import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Youtube,
  Upload,
  Link,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileCode,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Info,
  LogOut,
  Play,
} from 'lucide-react';
import { Reel, YouTubeSyncStatus } from '../types';

interface YouTubeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportReels: (newReels: Reel[], syncMessage?: string) => void;
}

export const YouTubeHistoryModal: React.FC<YouTubeHistoryModalProps> = ({
  isOpen,
  onClose,
  onImportReels,
}) => {
  const [activeTab, setActiveTab] = useState<'oauth' | 'takeout' | 'links' | 'sample'>('oauth');
  const [syncStatus, setSyncStatus] = useState<YouTubeSyncStatus>({
    connected: false,
    hasCredentials: false,
    hasApiKey: false,
  });
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isSyncingOAuth, setIsSyncingOAuth] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  // Takeout upload state
  const [jsonFileText, setJsonFileText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isParsingJson, setIsParsingJson] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Links state
  const [linksInput, setLinksInput] = useState<string>('');
  const [isParsingLinks, setIsParsingLinks] = useState(false);
  const [linksError, setLinksError] = useState<string | null>(null);

  // Sample scenarios state
  const [sampleHistories, setSampleHistories] = useState<any[]>([]);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  // Copy helper state
  const [copiedUri, setCopiedUri] = useState(false);
  const [redirectUri, setRedirectUri] = useState<string>('');

  // Fetch status on open
  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    setOauthError(null);
    try {
      const res = await fetch('/api/youtube/status');
      if (res.ok) {
        const data: YouTubeSyncStatus = await res.json();
        setSyncStatus(data);
      }

      const urlRes = await fetch('/api/auth/youtube/url');
      if (urlRes.ok) {
        const urlData = await urlRes.json();
        if (urlData.redirectUri) {
          setRedirectUri(urlData.redirectUri);
        }
      }
    } catch (err: any) {
      console.warn('Could not fetch YouTube status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // Fetch sample histories
  const fetchSamples = async () => {
    setIsLoadingSamples(true);
    try {
      const res = await fetch('/api/youtube/sample-histories');
      if (res.ok) {
        const data = await res.json();
        setSampleHistories(data.sampleHistories || []);
      }
    } catch (err) {
      console.warn('Could not load samples:', err);
    } finally {
      setIsLoadingSamples(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      fetchSamples();
    }
  }, [isOpen]);

  // Listen for OAuth completion from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        fetchStatus();
        handleSyncFromOAuth();
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        setOauthError(event.data?.error || 'Authentication failed');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Open Google OAuth popup
  const handleConnectOAuth = async () => {
    setOauthError(null);
    try {
      const res = await fetch('/api/auth/youtube/url');
      const data = await res.json();

      if (!data.configured || !data.url) {
        setOauthError(
          data.message ||
            'GOOGLE_CLIENT_ID is not configured in settings. You can set it in AI Studio settings or use the Takeout / Link importer below!'
        );
        return;
      }

      const authWindow = window.open(data.url, 'oauth_popup', 'width=600,height=720');
      if (!authWindow) {
        setOauthError('Popup was blocked by your browser. Please allow popups for this site and try again.');
      }
    } catch (err: any) {
      setOauthError(err.message || 'Failed to initiate OAuth flow.');
    }
  };

  // Disconnect OAuth
  const handleDisconnect = async () => {
    try {
      await fetch('/api/youtube/disconnect', { method: 'POST' });
      fetchStatus();
    } catch (err) {
      console.warn(err);
    }
  };

  // Sync actual history via API
  const handleSyncFromOAuth = async () => {
    setIsSyncingOAuth(true);
    setOauthError(null);
    try {
      const res = await fetch('/api/youtube/history');
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch YouTube history.');
      }
      const data = await res.json();
      if (data.reels && data.reels.length > 0) {
        onImportReels(data.reels, `Successfully synced ${data.reels.length} YouTube Shorts from your account.`);
        onClose();
      } else {
        setOauthError('No videos found in your liked YouTube history. Try watching and liking a few tech Shorts or use the Takeout / Link importer.');
      }
    } catch (err: any) {
      setOauthError(err.message);
    } finally {
      setIsSyncingOAuth(false);
    }
  };

  // Handle Takeout file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setJsonError(null);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setJsonFileText(content);
    };
    reader.onerror = () => {
      setJsonError('Failed to read file.');
    };
    reader.readAsText(file);
  };

  // Import Takeout JSON
  const handleImportTakeout = async () => {
    if (!jsonFileText) {
      setJsonError('Please select a valid watch-history.json file or paste JSON content.');
      return;
    }
    setIsParsingJson(true);
    setJsonError(null);
    try {
      const res = await fetch('/api/youtube/import-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonContent: jsonFileText }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to parse YouTube history JSON.');
      }

      const data = await res.json();
      if (data.reels && data.reels.length > 0) {
        onImportReels(data.reels, `Imported ${data.reels.length} YouTube Shorts from your watch history.`);
        onClose();
      } else {
        throw new Error('No valid YouTube Shorts entries detected.');
      }
    } catch (err: any) {
      setJsonError(err.message);
    } finally {
      setIsParsingJson(false);
    }
  };

  // Import Links
  const handleImportLinks = async () => {
    if (!linksInput.trim()) {
      setLinksError('Please paste at least one YouTube Shorts URL or video title.');
      return;
    }
    setIsParsingLinks(true);
    setLinksError(null);
    try {
      const res = await fetch('/api/youtube/import-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linksText: linksInput }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to import YouTube links.');
      }

      const data = await res.json();
      if (data.reels && data.reels.length > 0) {
        onImportReels(data.reels, `Imported ${data.reels.length} YouTube Shorts from provided links.`);
        onClose();
      }
    } catch (err: any) {
      setLinksError(err.message);
    } finally {
      setIsParsingLinks(false);
    }
  };

  // Load sample history
  const handleLoadSample = (sample: any) => {
    onImportReels(sample.reels, `Loaded "${sample.name}" with ${sample.reels.length} authentic YouTube Shorts.`);
    onClose();
  };

  const handleCopyUri = () => {
    if (!redirectUri) return;
    navigator.clipboard.writeText(redirectUri);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-red-50/50 via-white to-rose-50/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                <Youtube className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <span>Import YouTube Shorts History</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">
                    Personalized
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Connect your real account or import history to generate your personalized Technology DNA.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-2 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('oauth')}
              className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'oauth'
                  ? 'border-red-600 text-red-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span>Connect YouTube Account</span>
              {syncStatus.connected && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('takeout')}
              className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'takeout'
                  ? 'border-red-600 text-red-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Google Takeout JSON</span>
            </button>

            <button
              onClick={() => setActiveTab('links')}
              className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'links'
                  ? 'border-red-600 text-red-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Link className="w-4 h-4" />
              <span>Paste Shorts Links</span>
            </button>

            <button
              onClick={() => setActiveTab('sample')}
              className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'sample'
                  ? 'border-red-600 text-red-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Curated Scenarios</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* TAB 1: OAuth Flow */}
            {activeTab === 'oauth' && (
              <div className="space-y-5">
                {syncStatus.connected ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                          {syncStatus.channelTitle?.[0] || 'Y'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {syncStatus.channelTitle || 'Connected YouTube Account'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Connected
                            </span>
                          </div>
                          <p className="text-xs text-emerald-800 mt-0.5">
                            Ready to sync your liked tech Shorts and watch patterns.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleDisconnect}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Disconnect</span>
                      </button>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleSyncFromOAuth}
                        disabled={isSyncingOAuth}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSyncingOAuth ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Synchronizing Liked YouTube Shorts...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            <span>Sync Liked YouTube Shorts Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                        <Youtube className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          Connect with your YouTube / Google Account
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                          Sadhan AI will securely fetch your public Liked Videos & Shorts playlist (Read-Only) to analyze your technical viewing preferences.
                        </p>
                      </div>

                      <button
                        onClick={handleConnectOAuth}
                        className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                      >
                        <Youtube className="w-4 h-4 fill-current" />
                        <span>Sign in with YouTube</span>
                      </button>
                    </div>

                    {/* OAuth Credentials Configuration Notice */}
                    {!syncStatus.hasCredentials && (
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2.5">
                        <div className="flex items-center gap-2 font-bold text-amber-950">
                          <Info className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>Google Cloud OAuth Setup Note</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-amber-900/90">
                          To enable direct 1-click Google sign-in, add <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">GOOGLE_CLIENT_ID</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">GOOGLE_CLIENT_SECRET</code> in the project Settings &rarr; Secrets panel.
                        </p>
                        {redirectUri && (
                          <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-2">
                            <div className="truncate font-mono text-[10px] text-slate-600">
                              <span className="font-sans font-semibold text-slate-800 mr-1">Authorized Callback URL:</span>
                              {redirectUri}
                            </div>
                            <button
                              onClick={handleCopyUri}
                              className="shrink-0 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold flex items-center gap-1 transition-all"
                            >
                              {copiedUri ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedUri ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        )}
                        <p className="text-[11px] text-amber-800">
                          ⚡ <em>You can also instantly use the <strong>Google Takeout JSON</strong> or <strong>Curated Scenarios</strong> tabs without configuring OAuth credentials!</em>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {oauthError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{oauthError}</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Takeout JSON */}
            {activeTab === 'takeout' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">How to export Google Takeout YouTube history:</span>
                    <ol className="list-decimal ml-4 mt-1 space-y-0.5 text-blue-900/80 text-[11px]">
                      <li>Go to <a href="https://takeout.google.com" target="_blank" rel="noreferrer" className="underline font-semibold">takeout.google.com</a> and select only <strong>YouTube and YouTube Music</strong>.</li>
                      <li>In options, select <strong>history (JSON format)</strong> and download <code className="font-mono bg-blue-100 px-1 rounded">watch-history.json</code>.</li>
                      <li>Upload or drop the file below to parse your exact viewing timeline!</li>
                    </ol>
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-red-500 transition-all bg-slate-50/50">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="takeout-file-input"
                  />
                  <label
                    htmlFor="takeout-file-input"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-sm">
                      <FileCode className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">
                      {fileName ? fileName : 'Choose watch-history.json file'}
                    </span>
                    <span className="text-xs text-slate-500">
                      Drag and drop your exported JSON file here or click to browse
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Or paste raw Takeout JSON content directly:
                  </label>
                  <textarea
                    rows={4}
                    value={jsonFileText}
                    onChange={(e) => setJsonFileText(e.target.value)}
                    placeholder='[{"header": "YouTube", "title": "Watched Why Redis Event Loops Handle 100K...", "subtitles": [{"name": "ByteByteGo"}]}]'
                    className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>

                {jsonError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{jsonError}</span>
                  </div>
                )}

                <button
                  onClick={handleImportTakeout}
                  disabled={isParsingJson || !jsonFileText}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isParsingJson ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Parsing YouTube Watch History...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Import & Generate Personal Technology DNA</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: Paste Links */}
            {activeTab === 'links' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800">Paste your favorite YouTube Shorts:</span>
                  <p className="text-[11px]">
                    Paste YouTube Shorts links (one per line) or video titles. Sadhan AI will fetch metadata and integrate them into your active learning feed.
                  </p>
                </div>

                <div>
                  <textarea
                    rows={6}
                    value={linksInput}
                    onChange={(e) => setLinksInput(e.target.value)}
                    placeholder={`https://www.youtube.com/shorts/3i_b0mR5x2k
https://www.youtube.com/shorts/v7k9Q0aB1cD
Why Redis is Single Threaded (ByteByteGo)
Distributed Locks with Redlock (Hussein Nasser)`}
                    className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>

                {linksError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{linksError}</span>
                  </div>
                )}

                <button
                  onClick={handleImportLinks}
                  disabled={isParsingLinks || !linksInput.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isParsingLinks ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Fetching Shorts Metadata...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Import Shorts Links & Personalize</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 4: Curated Developer Scenarios */}
            {activeTab === 'sample' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Select an authentic YouTube Shorts developer binge to test Sadhan AI's multi-reel latent interest inference:
                </p>

                {isLoadingSamples ? (
                  <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-red-600" />
                    <span>Loading sample histories...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sampleHistories.map((sample) => (
                      <div
                        key={sample.id}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-red-400 bg-slate-50/50 hover:bg-red-50/30 transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              {sample.name}
                            </h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {sample.description}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 shrink-0">
                            {sample.reels?.length || 0} Shorts
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {sample.reels?.slice(0, 3).map((r: Reel) => (
                            <span
                              key={r.id}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-700 font-medium truncate max-w-[220px]"
                            >
                              {r.title}
                            </span>
                          ))}
                          {sample.reels?.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-200 text-[10px] text-slate-600 font-semibold">
                              +{sample.reels.length - 3} more
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleLoadSample(sample)}
                          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-red-600 hover:text-white text-red-600 border border-red-200 hover:border-red-600 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Load This YouTube Shorts History & Personalize</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Client-Safe & Gemini 3.7 Reasoning Powered</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

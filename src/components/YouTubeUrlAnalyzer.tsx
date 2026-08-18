import React, { useState } from 'react';
import {
  Youtube,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reel, ScrapedYouTubeAnalysis, SingleReelUnderstanding } from '../types';

interface YouTubeUrlAnalyzerProps {
  onAnalyzeComplete: (scrapedReel: Reel, understanding: SingleReelUnderstanding) => void;
  isGlobalAnalyzing?: boolean;
}

const SAMPLE_TECH_SHORTS = [
  {
    title: 'Why Redis Epoll Handles 100K Req/s',
    url: 'https://www.youtube.com/shorts/sample-epoll-redis',
    tag: 'Backend Systems',
  },
  {
    title: 'Vector Search & Cross-Encoder Rerankers',
    url: 'https://www.youtube.com/shorts/sample-vector-rerank',
    tag: 'AI & Machine Learning',
  },
  {
    title: 'Kubernetes Pod CrashLoopBackOff Fixes',
    url: 'https://www.youtube.com/shorts/sample-k8s-crashloop',
    tag: 'Cloud & DevOps',
  },
  {
    title: 'Model Context Protocol (MCP) in TypeScript',
    url: 'https://www.youtube.com/shorts/sample-mcp-anthropic',
    tag: 'AI Agents',
  },
];

export const YouTubeUrlAnalyzer: React.FC<YouTubeUrlAnalyzerProps> = ({
  onAnalyzeComplete,
  isGlobalAnalyzing = false,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ScrapedYouTubeAnalysis | null>(null);
  const [hasAddedToFeed, setHasAddedToFeed] = useState(false);

  const handleScrapeAndAnalyze = async (overrideUrl?: string) => {
    const targetUrl = overrideUrl || urlInput;
    if (!targetUrl || !targetUrl.trim()) {
      setScrapeError('Please enter a YouTube video or Shorts link.');
      return;
    }

    setIsScraping(true);
    setScrapeError(null);
    setHasAddedToFeed(false);

    try {
      const res = await fetch('/api/youtube/scrape-and-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to scrape and analyze YouTube video.');
      }

      const data: ScrapedYouTubeAnalysis = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Scrape error:', err);
      setScrapeError(err.message || 'Error scraping YouTube URL');
    } finally {
      setIsScraping(false);
    }
  };

  const handleAddToFeed = () => {
    if (!analysisResult) return;
    onAnalyzeComplete(analysisResult.scrapedReel, analysisResult.understanding);
    setHasAddedToFeed(true);
  };

  return (
    <div
      id="youtube-url-scraper-hub"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-5 transition-all"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-2xs">
            <Youtube className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                YouTube URL Inspector & Personalized Recommender
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                Live Scraper
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Paste any YouTube Short or video link to scrape metadata, evaluate engineering depth, and unlock personalized recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* URL Input Form */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="youtube-url-input"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (scrapeError) setScrapeError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleScrapeAndAnalyze();
              }}
              placeholder="Paste YouTube Shorts URL (e.g. https://www.youtube.com/shorts/... or https://youtu.be/...)"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-sans"
            />
          </div>

          <button
            onClick={() => handleScrapeAndAnalyze()}
            disabled={isScraping || !urlInput.trim()}
            id="scrape-youtube-btn"
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isScraping ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Scraping & Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Scrape & Personalize</span>
              </>
            )}
          </button>
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-500">Quick Test URLs:</span>
          {SAMPLE_TECH_SHORTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(sample.url);
                handleScrapeAndAnalyze(sample.url);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors border border-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Youtube className="w-3 h-3 text-red-500 fill-current" />
              <span>{sample.title}</span>
            </button>
          ))}
        </div>

        {/* Error message */}
        {scrapeError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{scrapeError}</span>
          </div>
        )}
      </div>

      {/* Analysis Result Display */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5"
          >
            {/* Top Scraped Video Card */}
            <div className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="relative w-full md:w-44 h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0 group">
                <img
                  src={analysisResult.scrapedReel.thumbnailUrl}
                  alt={analysisResult.scrapedReel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white">
                  Scraped Short
                </span>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {analysisResult.scrapedReel.categoryTag}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Creator: <strong className="text-slate-800">{analysisResult.scrapedReel.creator}</strong>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {analysisResult.scrapedReel.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {analysisResult.understanding.context}
                </p>

                <div className="flex items-center gap-3 pt-1">
                  {analysisResult.scrapedReel.videoUrl && (
                    <a
                      href={analysisResult.scrapedReel.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={handleAddToFeed}
                    disabled={hasAddedToFeed}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hasAddedToFeed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    {hasAddedToFeed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Added to Feed & Analyzed!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Add to Feed & Retrain DNA</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-medium block">Educational Value</span>
                <span className="text-lg font-black font-mono text-emerald-700">
                  {analysisResult.understanding.educationalValue}/100
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-medium block">Tech Relevance</span>
                <span className="text-lg font-black font-mono text-indigo-700">
                  {analysisResult.understanding.technologyRelevance}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-medium block">Quality Score</span>
                <span className="text-lg font-black font-mono text-cyan-700">
                  {analysisResult.understanding.qualityScore}/100
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-medium block">Hype Risk</span>
                <span className="text-lg font-black font-mono text-emerald-600">
                  {analysisResult.understanding.hypeRisk}/100
                </span>
              </div>
            </div>

            {/* Personalized Recommendations Anchored to this URL */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Personalized YouTube Recommendations for this URL
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {analysisResult.personalizedSuggestions.length} Curated High-Signal Matches
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysisResult.personalizedSuggestions.map((rec, index) => (
                  <div
                    key={rec.id || index}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs space-y-2.5 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {rec.category}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {rec.educationalValue}% Educational Score
                      </span>
                    </div>

                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {rec.title}
                    </h5>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {rec.whyThisCandidate}
                    </p>

                    <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-mono text-[11px]">
                        Creator: <strong className="text-slate-800">{rec.creator || 'Verified Tech Creator'}</strong>
                      </span>
                      {rec.videoUrl && (
                        <a
                          href={rec.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700"
                        >
                          <Youtube className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Short</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

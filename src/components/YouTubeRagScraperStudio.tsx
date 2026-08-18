import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Brain,
  Layers,
  ArrowRight,
  Youtube,
  ExternalLink,
  Play,
  CheckCircle2,
  BookOpen,
  Clock,
  Zap,
  Target,
  RefreshCw,
  Award,
  ChevronRight,
  Bookmark,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { YouTubeRAGScrapeResult, YouTubeRAGVideo, Reel } from '../types';
import { VideoPlayerModal } from './VideoPlayerModal';
import { openYouTubeVideo } from '../utils/youtubeUrl';

interface YouTubeRagScraperStudioProps {
  recentReels: Reel[];
  onAddReelToFeed?: (reel: Reel) => void;
}

const POPULAR_CATEGORY_PRESETS = [
  { name: 'AI & LLM Reasoning Models', topic: 'DeepSeek R1, Transformers Attention & LoRA', icon: '🤖' },
  { name: 'Distributed Systems & Consensus', topic: 'Raft Consensus, Consistent Hashing & Kafka', icon: '🌐' },
  { name: 'Linux Kernel & Low-Level', topic: 'eBPF Tracing, Linux Epoll & Memory Models', icon: '⚡' },
  { name: 'Database Internals & Storage', topic: 'PostgreSQL MVCC, B-Trees & WAL Engine', icon: '🗄️' },
  { name: 'Rust High Performance', topic: 'Rust Ownership, Tokio Async & SIMD', icon: '🦀' },
  { name: 'System Design at Scale', topic: 'Rate Limiting, CQRS & Distributed Tracing', icon: '📐' },
  { name: 'Frontend & Compiler Engines', topic: 'React 19 Server Components & V8 Hidden Classes', icon: '⚛️' },
  { name: 'DevOps & Kubernetes Cloud', topic: 'Kubernetes CNI, Docker BuildKit & Terraform', icon: '☁️' },
];

export const YouTubeRagScraperStudio: React.FC<YouTubeRagScraperStudioProps> = ({
  recentReels,
  onAddReelToFeed,
}) => {
  const [categoryInput, setCategoryInput] = useState('');
  const [userGoal, setUserGoal] = useState('Deep Architectural Mastery');
  const [targetSkillLevel, setTargetSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [ragResult, setRagResult] = useState<YouTubeRAGScrapeResult | null>(null);
  const [activePlayingVideo, setActivePlayingVideo] = useState<YouTubeRAGVideo | null>(null);
  const [savedVideoIds, setSavedVideoIds] = useState<Set<string>>(new Set());

  const handleRunRAGScrape = async (overrideCategory?: string) => {
    const targetQuery = (overrideCategory !== undefined ? overrideCategory : categoryInput).trim();
    if (!targetQuery) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/youtube/rag-category-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryInput: targetQuery,
          userGoal,
          targetSkillLevel,
          recentReels,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ragResult) {
          setRagResult(data.ragResult);
          if (overrideCategory) {
            setCategoryInput(overrideCategory);
          }
        }
      }
    } catch (err) {
      console.warn('RAG Scrape Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectWatch = (video: YouTubeRAGVideo) => {
    openYouTubeVideo(video.videoUrl, video.title, video.creator);
  };

  const handleSaveToFeed = (video: YouTubeRAGVideo) => {
    if (onAddReelToFeed) {
      const newReel: Reel = {
        id: `rag-feed-${video.id}-${Date.now()}`,
        title: video.title,
        creator: video.creator,
        caption: video.whyUseful,
        transcript: video.keyConcepts.join(' • '),
        thumbnailUrl: video.thumbnailUrl,
        videoUrl: video.videoUrl,
        interaction: 'saved',
        watchPercentage: 100,
        durationSeconds: video.duration.includes('m') ? 300 : 59,
        timestamp: new Date().toISOString(),
        categoryTag: video.category,
        source: 'youtube_shorts',
      };
      onAddReelToFeed(newReel);
      setSavedVideoIds((prev) => new Set(prev).add(video.id));
    }
  };

  return (
    <section id="youtube-rag-scraper-studio" className="space-y-6">
      {/* Studio Banner & Prompt Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <Youtube className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                  Retrieval-Augmented Generation & Live Scraping
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  YouTube Category Intelligence & Scraper Studio
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Full YouTube Permissions Active</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Enter <strong>any tech category or specialized topic</strong>. Our RAG model scrapes verified YouTube channels, synthesizes underlying engineering concepts, extracts prerequisites, and curates working video recommendations with direct redirect playback.
          </p>

          {/* Interactive Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunRAGScrape();
            }}
            className="space-y-4 pt-2"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Enter any category or topic (e.g. 'DeepSeek R1 Architecture', 'Raft Consensus', 'Rust Tokio Async', 'Postgres MVCC')..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm font-medium focus:outline-hidden focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !categoryInput.trim()}
                className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Running RAG Scrape...' : 'Scrape & Recommend'}</span>
              </button>
            </div>

            {/* Config Selectors: Goal & Skill Level */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400">Target Goal:</span>
                <select
                  value={userGoal}
                  onChange={(e) => setUserGoal(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-hidden cursor-pointer"
                >
                  <option value="Deep Architectural Mastery" className="bg-slate-800">Deep Architectural Mastery</option>
                  <option value="Ace Senior Tech Interviews" className="bg-slate-800">Ace Senior Tech Interviews</option>
                  <option value="Build a Production Project" className="bg-slate-800">Build a Production Project</option>
                  <option value="Debug Complex Production Outages" className="bg-slate-800">Debug Production Outages</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Skill Level:</span>
                <select
                  value={targetSkillLevel}
                  onChange={(e) => setTargetSkillLevel(e.target.value as any)}
                  className="bg-transparent text-white font-semibold focus:outline-hidden cursor-pointer"
                >
                  <option value="Beginner" className="bg-slate-800">Beginner (Foundations)</option>
                  <option value="Intermediate" className="bg-slate-800">Intermediate (Practitioner)</option>
                  <option value="Advanced" className="bg-slate-800">Advanced (Staff / Principal)</option>
                </select>
              </div>
            </div>

            {/* Popular Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Or choose a curated technical domain:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POPULAR_CATEGORY_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setCategoryInput(preset.name);
                      handleRunRAGScrape(preset.name);
                    }}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 hover:border-red-500/50 border border-slate-700/60 text-left transition-all cursor-pointer group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      <span>{preset.icon}</span>
                      <span className="truncate">{preset.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {preset.topic}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600 animate-pulse">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">
              Scraping YouTube & Synthesizing RAG Knowledge Graph...
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Querying verified technical channels, extracting prerequisites, and assembling verified video recommendations.
            </p>
          </div>
        </div>
      )}

      {/* RAG Results View */}
      {ragResult && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Synthesis Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-lg space-y-4 border border-indigo-800/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  RAG KNOWLEDGE SYNTHESIS
                </span>
                <span className="text-sm font-bold text-slate-200">
                  Category: &ldquo;{ragResult.customCategory}&rdquo;
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Target: {ragResult.targetSkillLevel} • {ragResult.userGoal}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {ragResult.aiSynthesis}
            </p>

            {/* Extracted Latent Concepts & Prerequisites */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[11px] uppercase font-bold text-indigo-300 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Key Latent Concepts to Master:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ragResult.extractedLatentConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-950/60 text-indigo-200 border border-indigo-700/50"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[11px] uppercase font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Foundational Prerequisites:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ragResult.prerequisites.map((prereq, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/60 text-emerald-200 border border-emerald-700/50"
                    >
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Videos Scraped from YouTube */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-600 fill-current" />
                <h4 className="text-base font-bold text-slate-900">
                  Scraped Top YouTube Videos & Shorts for &ldquo;{ragResult.customCategory}&rdquo;
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {ragResult.recommendedVideos.length} Verified Recommendations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ragResult.recommendedVideos.map((video, idx) => {
                const isSaved = savedVideoIds.has(video.id);

                return (
                  <div
                    key={video.id || idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      {/* Thumbnail with Direct Play button */}
                      <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden group/thumb">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-all duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                        {/* Direct Watch Launcher Overlay */}
                        <div
                          onClick={() => handleDirectWatch(video)}
                          className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover/thumb:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/90 text-white backdrop-blur-xs">
                            {video.format}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white">
                            {video.duration}
                          </span>
                        </div>

                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white">
                            {video.educationalScore}/100 Edu
                          </span>
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white font-medium">
                          <span className="truncate">{video.creator}</span>
                          <span>{video.viewsOrLikes}</span>
                        </div>
                      </div>

                      {/* Video Title & Why Useful */}
                      <div className="space-y-1.5">
                        <h5 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {video.title}
                        </h5>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {video.whyUseful}
                        </p>
                      </div>

                      {/* Key Concepts */}
                      <div className="flex flex-wrap gap-1">
                        {video.keyConcepts.slice(0, 3).map((concept, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>

                      {/* Code Snippet / Takeaway */}
                      {video.codeSnippetOrTakeaway && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
                          <strong className="text-indigo-600 block text-[10px] uppercase mb-0.5">Takeaway:</strong>
                          &ldquo;{video.codeSnippetOrTakeaway}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Direct Watch on YouTube & In-App Play */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDirectWatch(video)}
                          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Youtube className="w-3.5 h-3.5 fill-current" />
                          <span>Watch on YouTube</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>

                        <button
                          onClick={() => setActivePlayingVideo(video)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                          title="Open in player modal"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      {onAddReelToFeed && (
                        <button
                          onClick={() => handleSaveToFeed(video)}
                          disabled={isSaved}
                          className={`p-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                          title={isSaved ? 'Saved to Feed' : 'Save to Feed'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RAG 4-Stage Learning Roadmap */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h4 className="text-base font-bold text-slate-900">
                Personalized Step-by-Step Learning Roadmap for &ldquo;{ragResult.customCategory}&rdquo;
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {ragResult.ragRoadmapSteps.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 relative"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                      {step.step}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {step.estimatedTime}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 leading-snug">
                    {step.title}
                  </h5>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Video Player Modal */}
      {activePlayingVideo && (
        <VideoPlayerModal
          isOpen={Boolean(activePlayingVideo)}
          onClose={() => setActivePlayingVideo(null)}
          video={activePlayingVideo}
        />
      )}
    </section>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Youtube,
  ExternalLink,
  Sparkles,
  Play,
  CheckCircle2,
  Bookmark,
  Award,
  Layers,
  ArrowRight,
  Filter,
  Grid,
  ListFilter,
  TrendingUp,
  History,
  BookOpen,
  Zap,
  Search,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CuratedCategoryVideo,
  Reel,
  ALL_TECH_CATEGORIES,
  TechCategory,
} from '../types';
import {
  CURATED_CATEGORY_VIDEOS,
  filterReelsByCategory,
  getAllCuratedVideos,
} from '../data/categoryVideos';
import { VideoPlayerModal } from './VideoPlayerModal';
import { openYouTubeVideo } from '../utils/youtubeUrl';

interface CategoryTopVideosSectionProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  userReels: Reel[];
  onAddReelToFeed: (reel: Reel) => void;
}

export const CategoryTopVideosSection: React.FC<CategoryTopVideosSectionProps> = ({
  selectedCategoryId,
  onSelectCategory,
  userReels,
  onAddReelToFeed,
}) => {
  const [viewMode, setViewMode] = useState<'focused' | 'all-matrix'>('focused');
  const [selectedSubTopic, setSelectedSubTopic] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [activePlayingVideo, setActivePlayingVideo] = useState<CuratedCategoryVideo | Reel | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredVideos, setDiscoveredVideos] = useState<CuratedCategoryVideo[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchingYouTube, setIsSearchingYouTube] = useState(false);
  const [lastScrapedTopic, setLastScrapedTopic] = useState<string | null>(null);

  // Category quick-search suggested terms
  const CATEGORY_SEARCH_SUGGESTIONS: Record<string, string[]> = {
    'ai-ml': ['FlashAttention 2', 'LoRA Fine-tuning', 'Vector Search Reranking', 'Transformer Attention Math', 'DeepSeek MoE Architecture'],
    'backend-systems': ['Linux Epoll Concurrency', 'Kafka Partition Rebalancing', 'Postgres MVCC & VACUUM', 'Raft Consensus Algorithm', 'Redis Event Loop'],
    'system-design': ['Consistent Hashing Distributed', 'Token Bucket Rate Limiting', 'Distributed Tracing OpenTelemetry', 'CQRS & Event Sourcing'],
    'cloud-devops': ['Kubernetes CNI & CoreDNS', 'Docker Layer Caching & BuildKit', 'Terraform State Locking', 'eBPF Kernel Tracing'],
    'frontend-web': ['React 19 Server Actions', 'V8 JavaScript Hidden Classes', 'WebAssembly SIMD', 'CSS Container Queries'],
    'dsa': ['LRU Cache Implementation', 'B-Tree vs LSM-Tree', 'Dijkstra Priority Queue', 'Bit Manipulation Optimization'],
    'cybersecurity': ['OAuth 2.0 PKCE Flow', 'JWT Secret Key Cracking', 'SQL Injection Blind Time-based', 'Zero Trust Architecture'],
    'databases': ['B-Tree Index Fragmentation', 'Write-Ahead Log (WAL) Internals', 'Database Sharding Strategies', 'Postgres EXPLAIN ANALYZE'],
    'rust-lowlevel': ['Rust Ownership & Borrow Checker', 'SIMD Vectorization in Rust', 'Memory Allocator jemalloc vs mimalloc', 'Zero-Cost Abstractions'],
    'mobile-dev': ['React Native Bridgeless Architecture', 'SwiftUI StateObject vs ObservedObject', 'Kotlin Coroutines Flow', 'Mobile Memory Leak Profiling'],
    'all': ['System Design Architecture', 'Attention Mechanism Transformers', 'Linux Epoll Redis', 'Postgres Index Internals', 'Rust Memory Safety'],
  };

  // Determine current active category
  const activeCategory: TechCategory = useMemo(() => {
    return (
      ALL_TECH_CATEGORIES.find((c) => c.id === selectedCategoryId) ||
      ALL_TECH_CATEGORIES[0]
    );
  }, [selectedCategoryId]);

  // Curated videos for the active category (or all if 'all')
  const rawCuratedList = useMemo(() => {
    let base: CuratedCategoryVideo[] = [];
    if (selectedCategoryId === 'all') {
      base = getAllCuratedVideos();
    } else {
      base = CURATED_CATEGORY_VIDEOS[selectedCategoryId] || [];
    }

    const dynamicForThisCategory = discoveredVideos.filter(
      (v) => selectedCategoryId === 'all' || v.categoryId === selectedCategoryId
    );

    return [...dynamicForThisCategory, ...base];
  }, [selectedCategoryId, discoveredVideos]);

  // Extract distinct sub-topics for filter chips
  const subTopics = useMemo(() => {
    const set = new Set<string>();
    rawCuratedList.forEach((v) => {
      if (v.subTopic) set.add(v.subTopic);
    });
    return Array.from(set);
  }, [rawCuratedList]);

  // Filtered curated videos based on UI filters
  const filteredCuratedList = useMemo(() => {
    return rawCuratedList.filter((v) => {
      if (selectedSubTopic !== 'all' && v.subTopic !== selectedSubTopic) return false;
      if (difficultyFilter !== 'all' && v.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [rawCuratedList, selectedSubTopic, difficultyFilter]);

  // User's own YouTube history filtered to this category
  const userHistoryInThisCategory = useMemo(() => {
    return filterReelsByCategory(userReels, selectedCategoryId);
  }, [userReels, selectedCategoryId]);

  // Handle adding a curated recommendation to user's active feed
  const handleAddToFeed = (video: CuratedCategoryVideo | Reel) => {
    if ('category' in video && 'whyUseful' in video) {
      const v = video as CuratedCategoryVideo;
      const newReel: Reel = {
        id: `curated-${v.id}-${Date.now()}`,
        title: v.title,
        creator: v.creator,
        caption: v.whyUseful,
        transcript: `${v.title}. Key concepts: ${v.keyConcepts.join(', ')}.`,
        thumbnailUrl: v.thumbnailUrl,
        interaction: 'saved',
        watchPercentage: 100,
        durationSeconds: v.duration.includes('s') ? parseInt(v.duration) || 55 : 180,
        timestamp: new Date().toISOString().split('T')[0],
        categoryTag: v.category,
        source: 'youtube_shorts',
        videoUrl: v.videoUrl,
      };
      onAddReelToFeed(newReel);
      setAddedIds((prev) => new Set([...prev, v.id]));
    } else {
      onAddReelToFeed(video as Reel);
    }
  };

  // Live YouTube Scrape & Search
  const handleSearchAndScrapeYouTube = async (overrideQuery?: string) => {
    const queryToSearch = (overrideQuery !== undefined ? overrideQuery : searchKeyword).trim();
    if (!queryToSearch) return;

    setIsSearchingYouTube(true);
    setLastScrapedTopic(queryToSearch);

    try {
      const res = await fetch('/api/youtube/search-and-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSearch,
          categoryId: selectedCategoryId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
          setDiscoveredVideos((prev) => [...data.videos, ...prev]);
          setSearchKeyword('');
        }
      }
    } catch (err) {
      console.warn('YouTube Scrape error:', err);
    } finally {
      setIsSearchingYouTube(false);
    }
  };

  // Live Discovery for additional category videos
  const handleDiscoverMore = async () => {
    setIsDiscovering(true);
    try {
      const res = await fetch('/api/youtube/discover-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: selectedCategoryId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.videos && Array.isArray(data.videos)) {
          setDiscoveredVideos((prev) => [...data.videos, ...prev]);
        }
      }
    } catch (e) {
      console.warn('Discovery error:', e);
    } finally {
      setIsDiscovering(false);
    }
  };

  return (
    <>
      <section
        id="category-top-videos-directory"
        className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6 transition-all"
      >
        {/* Top Header with title and view mode toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                <Youtube className="w-4 h-4 fill-current" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {selectedCategoryId === 'all'
                  ? 'Top Tech Videos & Shorts — All Categories'
                  : `Top Useful Videos for ${activeCategory.name}`}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                {filteredCuratedList.length} Top High-Signal Videos
              </span>
              {userHistoryInThisCategory.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                  <History className="w-3 h-3" />
                  <span>{userHistoryInThisCategory.length} in your YouTube History</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {selectedCategoryId === 'all'
                ? 'Comprehensive high-signal directory spanning AI, Backend Systems, System Design, Cloud, Security, DSA, and beyond.'
                : activeCategory.description}
            </p>
          </div>

          {/* Controls: Discover More & View Mode Toggle */}
          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            <button
              onClick={handleDiscoverMore}
              disabled={isDiscovering}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDiscovering ? 'animate-spin' : ''}`} />
              <span>{isDiscovering ? 'Discovering...' : 'Find More on YouTube'}</span>
            </button>

            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => setViewMode('focused')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'focused'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Category Focus</span>
              </button>
              <button
                onClick={() => setViewMode('all-matrix')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'all-matrix'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>All Categories Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time YouTube Search & Scrape Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-3.5 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Search className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Live YouTube Search & Intelligence Scraper
              </h4>
            </div>
            <span className="text-[11px] text-slate-300 font-medium">
              Category: <strong className="text-indigo-300">{activeCategory.name}</strong>
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchAndScrapeYouTube();
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={`Search YouTube for any topic (e.g. "${CATEGORY_SEARCH_SUGGESTIONS[selectedCategoryId]?.[0] || 'System Design'}")`}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <button
              type="submit"
              disabled={isSearchingYouTube || !searchKeyword.trim()}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-600/30 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSearchingYouTube ? 'animate-spin' : ''}`} />
              <span>{isSearchingYouTube ? 'Scraping YouTube...' : 'Search & Scrape'}</span>
            </button>
          </form>

          {/* Suggested Quick Search Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Quick Scrape:</span>
            {(CATEGORY_SEARCH_SUGGESTIONS[selectedCategoryId] || CATEGORY_SEARCH_SUGGESTIONS['all']).map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleSearchAndScrapeYouTube(topic)}
                disabled={isSearchingYouTube}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-900/60 border border-slate-700/80 hover:border-indigo-500 text-slate-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer disabled:opacity-50"
              >
                + {topic}
              </button>
            ))}
          </div>

          {lastScrapedTopic && (
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Curated fresh YouTube results for: &ldquo;{lastScrapedTopic}&rdquo;</span>
            </div>
          )}
        </div>

        {/* VIEW 1: FOCUSED CATEGORY VIEW */}
        {viewMode === 'focused' && (
          <div className="space-y-6">
            {/* SECTION A: Matched Videos From User's Real YouTube History */}
            {userHistoryInThisCategory.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                      From Your YouTube History ({userHistoryInThisCategory.length} watched)
                    </h4>
                  </div>
                  <span className="text-[11px] text-indigo-700 font-medium">
                    Signals extracted for your personalized Tech DNA
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {userHistoryInThisCategory.slice(0, 6).map((reel) => (
                    <div
                      key={reel.id}
                      className="p-3.5 rounded-xl bg-white border border-indigo-200/70 hover:border-indigo-300 shadow-2xs space-y-2 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800">
                            {reel.interaction.toUpperCase()} • {reel.watchPercentage}% Watched
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {reel.durationSeconds}s
                          </span>
                        </div>

                        <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {reel.title}
                        </h5>

                        <p className="text-[11px] text-slate-500 font-mono">
                          Creator: <strong className="text-slate-700">{reel.creator}</strong>
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px]">
                        <span className="text-indigo-600 font-semibold">In Active DNA</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActivePlayingVideo(reel)}
                            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play</span>
                          </button>
                          <button
                            onClick={() => openYouTubeVideo(reel.videoUrl, reel.title, reel.creator)}
                            className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            <Youtube className="w-3 h-3 fill-current" />
                            <span>YouTube</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION B: Sub-topic and Difficulty Filter Chips */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Subtopics */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  <span>Topic:</span>
                </span>
                <button
                  onClick={() => setSelectedSubTopic('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedSubTopic === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  All Topics ({rawCuratedList.length})
                </button>
                {subTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedSubTopic(topic)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedSubTopic === topic
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-500">Difficulty:</span>
                {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${
                      difficultyFilter === diff
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {diff === 'all' ? 'All' : diff}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION C: Curated Top Useful Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredCuratedList.map((video) => {
                const isAdded = addedIds.has(video.id);

                return (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Video Thumbnail Header with direct play button */}
                    <div
                      onClick={() => setActivePlayingVideo(video)}
                      className="relative w-full h-36 bg-slate-900 overflow-hidden cursor-pointer group/thumb"
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300 opacity-90 group-hover/thumb:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Play Overlay Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover/thumb:opacity-100 transition-opacity">
                        <div className="w-11 h-11 rounded-full bg-red-600/90 group-hover/thumb:bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover/thumb:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Format / Duration Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white flex items-center gap-1 shadow-sm">
                          <Youtube className="w-3 h-3 fill-current" />
                          <span>{video.format}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/60 backdrop-blur-xs text-white">
                          {video.duration}
                        </span>
                      </div>

                      {/* Educational score pill */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-600/90 text-white shadow-sm flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>{video.educationalScore}/100 Score</span>
                        </span>
                      </div>

                      {/* Title and creator overlay */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <span className="text-[11px] font-mono text-slate-300 font-semibold block">
                          {video.creator}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                          {video.title}
                        </h4>
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {video.subTopic}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              video.difficulty === 'Advanced'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : video.difficulty === 'Intermediate'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {video.difficulty}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {video.whyUseful}
                        </p>

                        {/* Key Concepts Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {video.keyConcepts.map((concept, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 text-[10px] font-mono border border-slate-100"
                            >
                              #{concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Actions: Play in App, Watch on YouTube & Add to Feed */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setActivePlayingVideo(video)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play</span>
                          </button>

                          <button
                            onClick={() => openYouTubeVideo(video.videoUrl, video.title, video.creator)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Youtube className="w-3 h-3 fill-current" />
                            <span>YouTube</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleAddToFeed(video)}
                          disabled={isAdded}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>In Feed</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Add to Feed</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: ALL CATEGORIES MATRIX DIRECTORY */}
        {viewMode === 'all-matrix' && (
          <div className="space-y-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>
                  Browsing the Master Tech Directory across all {ALL_TECH_CATEGORIES.length - 1} Specializations. Click any video to play or category header to focus.
                </span>
              </div>
            </div>

            {ALL_TECH_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
              const catVideos = CURATED_CATEGORY_VIDEOS[cat.id] || [];
              const userHistoryForCat = filterReelsByCategory(userReels, cat.id);

              return (
                <div
                  key={cat.id}
                  className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4"
                >
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          {catVideos.length} Top Videos
                        </span>
                        {userHistoryForCat.length > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {userHistoryForCat.length} in your History
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{cat.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setViewMode('focused');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 self-start sm:self-auto cursor-pointer"
                    >
                      <span>Focus on {cat.shortName}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Video Cards Grid for this category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {catVideos.map((video) => (
                      <div
                        key={video.id}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs space-y-2 flex flex-col justify-between transition-all"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {video.subTopic}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-700">
                              {video.educationalScore}% Score
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {video.title}
                          </h5>

                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {video.whyUseful}
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                          <button
                            onClick={() => setActivePlayingVideo(video)}
                            className="inline-flex items-center gap-1 font-bold text-slate-800 hover:text-indigo-600 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play</span>
                          </button>
                          <button
                            onClick={() => openYouTubeVideo(video.videoUrl, video.title, video.creator)}
                            className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            <Youtube className="w-3 h-3 fill-current" />
                            <span>YouTube</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Embedded Live Video Player Modal */}
      <VideoPlayerModal
        isOpen={Boolean(activePlayingVideo)}
        onClose={() => setActivePlayingVideo(null)}
        video={activePlayingVideo}
        onAddToFeed={handleAddToFeed}
      />
    </>
  );
};

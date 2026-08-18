import React, { useState } from 'react';
import {
  Heart,
  Bookmark,
  Share2,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldAlert,
  Flame,
  Clock,
  Sliders,
  Youtube,
  ExternalLink,
  Play,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reel, InteractionType, SingleReelUnderstanding } from '../types';
import { VideoPlayerModal } from './VideoPlayerModal';
import { openYouTubeVideo } from '../utils/youtubeUrl';

interface ReelListProps {
  reels: Reel[];
  understandings: SingleReelUnderstanding[];
  onUpdateReelInteraction: (id: string, interaction: InteractionType) => void;
  onUpdateReelWatchPercentage: (id: string, watchPercentage: number) => void;
  onDeleteReel: (id: string) => void;
  onAddReelClick: () => void;
  onOpenYouTubeHistory?: () => void;
}

export const ReelList: React.FC<ReelListProps> = ({
  reels,
  understandings,
  onUpdateReelInteraction,
  onUpdateReelWatchPercentage,
  onDeleteReel,
  onAddReelClick,
  onOpenYouTubeHistory,
}) => {
  const [expandedReelId, setExpandedReelId] = useState<string | null>(null);
  const [playingReel, setPlayingReel] = useState<Reel | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedReelId((prev) => (prev === id ? null : id));
  };

  const getInteractionIcon = (type: InteractionType) => {
    switch (type) {
      case 'saved':
        return <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30" />;
      case 'liked':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />;
      case 'shared':
        return <Share2 className="w-3.5 h-3.5 text-blue-500" />;
      case 'watched':
        return <Eye className="w-3.5 h-3.5 text-emerald-600" />;
      case 'skipped':
        return <EyeOff className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <section id="reel-history-section" className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Reel & Shorts Feed</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
              {reels.length} Reels
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {onOpenYouTubeHistory && (
            <button
              onClick={onOpenYouTubeHistory}
              className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Youtube className="w-3.5 h-3.5 fill-current" />
              <span>Import YouTube Shorts</span>
            </button>
          )}
          <button
            onClick={onAddReelClick}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            + Add manual reel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {reels.map((reel, index) => {
          const understanding = understandings.find((u) => u.reelId === reel.id);
          const isExpanded = expandedReelId === reel.id;

          return (
            <motion.div
              key={reel.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              id={`reel-card-${reel.id}`}
              className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs transition-all group"
            >
              <div>
                {/* Thumbnail & Quick Overlays */}
                <div
                  onClick={() => setPlayingReel(reel)}
                  className="relative h-28 bg-slate-100 overflow-hidden cursor-pointer group/thumb"
                >
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover/thumb:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md transform group-hover/thumb:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Top Badge: Category & Index */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap max-w-[80%]">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/90 text-slate-800 border border-slate-200 shadow-2xs backdrop-blur-sm">
                      #{index + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-600/90 text-white shadow-2xs backdrop-blur-sm">
                      {reel.categoryTag || 'Tech'}
                    </span>
                    {(reel.source === 'youtube_shorts' || reel.source === 'takeout') && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-600/90 text-white shadow-2xs backdrop-blur-sm flex items-center gap-1">
                        <Youtube className="w-2.5 h-2.5 fill-current" />
                        <span>Shorts</span>
                      </span>
                    )}
                  </div>

                  {/* Top Right: Actions */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 flex items-center gap-1 z-10"
                  >
                    <button
                      onClick={() => openYouTubeVideo(reel.videoUrl, reel.title, reel.creator)}
                      className="p-1 rounded-md bg-white/90 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-2xs"
                      title="Watch on YouTube"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteReel(reel.id)}
                      className="p-1 rounded-md bg-white/90 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-2xs"
                      title="Remove Reel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Stats: Watch % and Interaction */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/90 border border-slate-200/80 shadow-2xs backdrop-blur-sm">
                      {getInteractionIcon(reel.interaction)}
                      <span className="capitalize font-bold text-[11px] text-slate-800">
                        {reel.interaction}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 border border-slate-200/80 text-[11px] font-mono font-semibold text-indigo-700 shadow-2xs backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-indigo-600" />
                      <span>{reel.watchPercentage}% ({reel.durationSeconds}s)</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-3.5 space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {reel.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {reel.caption}
                  </p>

                  {/* AI Understanding Snippet (if available) */}
                  {understanding && (
                    <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          {understanding.topic}
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono font-semibold">
                          Edu: {understanding.educationalValue}/100
                        </span>
                      </div>

                      {understanding.hypeRisk > 40 && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-800">
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
                          <span>Hype Risk: {understanding.hypeRisk}/100</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interactive Controls Pill */}
                  <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      {(['watched', 'liked', 'saved', 'skipped'] as const).map((act) => (
                        <button
                          key={act}
                          onClick={() => onUpdateReelInteraction(reel.id, act)}
                          className={`p-1 px-1.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                            reel.interaction === act
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                          }`}
                          title={`Mark as ${act}`}
                        >
                          {getInteractionIcon(act)}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleExpand(reel.id)}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide' : 'Details'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Expandable Transcript & Watch Slider */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2 space-y-2 text-xs border-t border-slate-100"
                      >
                        {/* Interactive watch percentage slider */}
                        <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                            <span>Adjust Watch %</span>
                            <span className="text-indigo-600 font-bold">{reel.watchPercentage}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={reel.watchPercentage}
                            onChange={(e) =>
                              onUpdateReelWatchPercentage(reel.id, Number(e.target.value))
                            }
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>

                        {/* Transcript */}
                        {reel.transcript && (
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5 font-bold">
                              Transcript / Speech:
                            </span>
                            <p className="text-slate-700 text-xs font-mono leading-relaxed max-h-24 overflow-y-auto">
                              &ldquo;{reel.transcript}&rdquo;
                            </p>
                          </div>
                        )}

                        {reel.creator && (
                          <span className="text-[10px] text-slate-500 font-mono block">
                            Creator: {reel.creator}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* In-App Video Player Modal */}
      <VideoPlayerModal
        isOpen={Boolean(playingReel)}
        onClose={() => setPlayingReel(null)}
        video={playingReel}
      />
    </section>
  );
};

import React from 'react';
import {
  Sparkles,
  Play,
  PlusCircle,
  FlaskConical,
  RotateCcw,
  Compass,
  Target,
  BookOpen,
  Dice5,
  User,
  Zap,
  Youtube,
} from 'lucide-react';
import { motion } from 'motion/react';
import { StudentProfile } from '../types';

interface HeaderProps {
  onAnalyze: () => void;
  onAddReel: () => void;
  onTryDemo: () => void;
  onOpenEvaluation: () => void;
  onReset: () => void;
  onSurpriseMe: () => void;
  onOpenProfile: () => void;
  onOpenYouTubeHistory: () => void;
  mode: 'exploit' | 'explore' | 'focused' | 'surprise';
  setMode: (mode: 'exploit' | 'explore' | 'focused') => void;
  isAnalyzing: boolean;
  reelCount: number;
  profile: StudentProfile;
}

export const Header: React.FC<HeaderProps> = ({
  onAnalyze,
  onAddReel,
  onTryDemo,
  onOpenEvaluation,
  onReset,
  onSurpriseMe,
  onOpenProfile,
  onOpenYouTubeHistory,
  mode,
  setMode,
  isAnalyzing,
  reelCount,
  profile,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b border-slate-200/90 shadow-sm transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 4 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 flex items-center justify-center shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500/30"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  Sadhan <span className="text-indigo-600">AI</span>
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Agent Live
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wider bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                  Gemini 3.7 Reasoning
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                &ldquo;Turn your scroll into your skill.&rdquo;
              </p>
            </div>
          </div>

          {/* Mode Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Explore vs Exploit Pill Tabs */}
            <div
              id="recommendation-mode-toggle"
              className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner"
            >
              <button
                id="mode-exploit-btn"
                onClick={() => setMode('exploit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'exploit'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Personalized: Focus tightly on your detected strong interests"
              >
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>Personalized</span>
              </button>
              <button
                id="mode-explore-btn"
                onClick={() => setMode('explore')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'explore'
                    ? 'bg-white text-purple-700 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Explore: Discover exciting lateral engineering connections"
              >
                <Compass className="w-3.5 h-3.5 text-purple-600" />
                <span>Explore</span>
              </button>
              <button
                id="mode-focused-btn"
                onClick={() => setMode('focused')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'focused'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Focused: Bridge detected technical skill gaps"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Focused</span>
              </button>
            </div>

            {/* Surprise Me Button */}
            <motion.button
              id="surprise-me-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSurpriseMe}
              disabled={isAnalyzing || reelCount === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Surprise Me with an unexpected lateral tech breakthrough"
            >
              <Dice5 className="w-4 h-4 text-amber-600" />
              <span>Surprise Me</span>
            </motion.button>

            {/* Student Profile */}
            <motion.button
              id="open-profile-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-all shadow-sm"
              title="Student Goals & Preferences"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Profile</span>
              {profile.careerGoal && (
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </motion.button>

            {/* Agent Evaluation / Trap Test Modal */}
            <motion.button
              id="open-evaluation-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenEvaluation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 text-xs font-semibold transition-all shadow-sm"
              title="Agent Evaluation & Built-in Trap Tests"
            >
              <FlaskConical className="w-3.5 h-3.5 text-violet-600" />
              <span className="hidden sm:inline">Trap Tests</span>
            </motion.button>

            {/* YouTube Shorts History Button */}
            <motion.button
              id="youtube-history-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenYouTubeHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Add your real YouTube Shorts history for hyper-personalized recommendations"
            >
              <Youtube className="w-4 h-4 fill-current text-red-600" />
              <span>YouTube Shorts</span>
            </motion.button>

            {/* Try Demo Button */}
            <motion.button
              id="try-demo-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTryDemo}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Try Demo</span>
            </motion.button>

            {/* Add Reel Button */}
            <motion.button
              id="add-reel-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddReel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Reel</span>
            </motion.button>

            {/* Main CTA: Analyze */}
            <motion.button
              id="primary-analyze-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAnalyze}
              disabled={isAnalyzing || reelCount === 0}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wide shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Reasoning...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Analyze ({reelCount})</span>
                </>
              )}
            </motion.button>

            {/* Reset Button */}
            <button
              id="reset-state-btn"
              onClick={onReset}
              disabled={isAnalyzing}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
              title="Reset all reels and state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import {
  Calendar,
  Flame,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Award,
  Zap,
  Target,
  BarChart,
} from 'lucide-react';
import { WeeklyProgressSummary } from '../types';

interface WeeklyProgressCardProps {
  progress: WeeklyProgressSummary | null;
  isAnalyzing: boolean;
}

export const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({
  progress,
  isAnalyzing,
}) => {
  if (isAnalyzing) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4 shadow-sm">
        <div className="h-5 w-44 bg-slate-100 rounded" />
        <div className="grid grid-cols-4 gap-3">
          <div className="h-14 bg-slate-50 rounded" />
          <div className="h-14 bg-slate-50 rounded" />
          <div className="h-14 bg-slate-50 rounded" />
          <div className="h-14 bg-slate-50 rounded" />
        </div>
      </div>
    );
  }

  if (!progress) return null;

  return (
    <section
      id="weekly-tech-progress-card"
      className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">WEEKLY TECH DISCOVERY & PROGRESS</h3>
            <p className="text-xs text-slate-500">
              Transforming passive scrolling into demonstrable engineering growth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{progress.learningStreakDays} Day Streak</span>
          </span>
        </div>
      </div>

      {/* Top 4 Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Strongest Interest */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Strongest Interest</span>
          </div>
          <p className="text-sm font-bold text-slate-900 truncate">
            {progress.strongestInterest}
          </p>
        </div>

        {/* Emerging Interest */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Emerging Domain</span>
          </div>
          <p className="text-sm font-bold text-emerald-700 truncate">
            {progress.emergingInterest}
          </p>
        </div>

        {/* Possible Skill Gap */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Target className="w-3.5 h-3.5 text-amber-500" />
            <span>Identified Gap</span>
          </div>
          <p className="text-sm font-bold text-amber-800 truncate">
            {progress.possibleGap}
          </p>
        </div>

        {/* Next Recommendation */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target Next Skill</span>
          </div>
          <p className="text-sm font-bold text-indigo-700 truncate">
            {progress.nextRecommendedSkill}
          </p>
        </div>
      </div>

      {/* Conversion Banner */}
      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
            {progress.scrollSkillConversionRate}%
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Scroll-to-Skill Conversion</h4>
            <p className="text-xs text-slate-600">
              {progress.reelsAnalyzedCount} Reels analyzed • {progress.topicsExploredCount} Deep Topics explored
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{progress.hypeFilteredCount} Hype/Clickbait filtered</span>
        </div>
      </div>
    </section>
  );
};

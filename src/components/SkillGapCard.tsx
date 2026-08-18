import React from 'react';
import { ShieldAlert, Compass, Sparkles, ArrowUpRight, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { SkillGap } from '../types';

interface SkillGapCardProps {
  skillGaps: SkillGap[];
  onBridgeGapClick?: (topic: string) => void;
  isAnalyzing: boolean;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({
  skillGaps,
  onBridgeGapClick,
  isAnalyzing,
}) => {
  if (isAnalyzing) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-3 shadow-sm">
        <div className="h-5 w-40 bg-slate-100 rounded" />
        <div className="h-16 bg-slate-50 rounded" />
      </div>
    );
  }

  if (!skillGaps || skillGaps.length === 0) return null;

  return (
    <section
      id="skill-gap-card"
      className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>SKILL-GAP DETECTION</span>
              <span className="text-[10px] text-amber-800 font-semibold px-2 py-0.5 rounded bg-amber-100 border border-amber-300">
                AI Opportunity Radar
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Comparing what you consume vs. what high-scale engineering requires
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {skillGaps.map((gap, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-slate-50 border border-amber-200 hover:border-amber-300 space-y-2.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {gap.area}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs">
                {gap.severity} Opportunity
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              <strong className="text-slate-900">Observation:</strong> {gap.observation}
            </p>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              <strong>Possible Learning Gap:</strong> {gap.learningGap}
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-xs text-slate-600 font-medium">
                Recommended Bridge: <strong className="text-indigo-700 font-semibold">{gap.recommendedBridgeTopic}</strong>
              </span>

              {onBridgeGapClick && (
                <button
                  onClick={() => onBridgeGapClick(gap.recommendedBridgeTopic)}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors cursor-pointer"
                >
                  <span>Explore Topic</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Dna, ChevronDown, ChevronUp, Sparkles, Zap, Award, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TechnologyDNA } from '../types';

interface TechnologyDNACardProps {
  technologyDNA: TechnologyDNA | null;
  isAnalyzing: boolean;
}

export const TechnologyDNACard: React.FC<TechnologyDNACardProps> = ({
  technologyDNA,
  isAnalyzing,
}) => {
  const [expandedInterest, setExpandedInterest] = useState<string | null>(null);

  if (isAnalyzing) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4 shadow-sm">
        <div className="h-5 w-40 bg-slate-100 rounded" />
        <div className="space-y-2">
          <div className="h-8 bg-slate-50 rounded" />
          <div className="h-8 bg-slate-50 rounded" />
          <div className="h-8 bg-slate-50 rounded" />
        </div>
      </div>
    );
  }

  if (!technologyDNA) return null;

  const toggleInterest = (category: string) => {
    setExpandedInterest((prev) => (prev === category ? null : category));
  };

  return (
    <section
      id="technology-dna-card"
      className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 border border-pink-100 flex items-center justify-center">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>YOUR TECHNOLOGY DNA</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                Confidence: {technologyDNA.confidence}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Archetype:{' '}
              <strong className="text-pink-600 font-bold">{technologyDNA.dominantArchetype}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Inferred Level:</span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {technologyDNA.overallSkillLevel}
          </span>
        </div>
      </div>

      {/* Latent Interests Tags */}
      {technologyDNA.latentInterests && technologyDNA.latentInterests.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Latent Interests Synthesized (Beyond Keywords)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {technologyDNA.latentInterests.map((latent, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/70 shadow-2xs"
              >
                #{latent}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Interest Percentage Bars */}
      <div className="space-y-3 pt-1">
        {technologyDNA.interests.map((interest, idx) => {
          const isExpanded = expandedInterest === interest.category;

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer"
              onClick={() => toggleInterest(interest.category)}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{interest.category}</span>
                  {interest.status === 'emerging' && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Emerging
                    </span>
                  )}
                  {interest.status === 'new' && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                      New
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-pink-600">{interest.percentage}%</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${interest.percentage}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                />
              </div>

              {/* Expandable Evidence from History */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2.5 pt-2 border-t border-slate-200 text-xs text-slate-600 leading-relaxed font-sans"
                  >
                    <strong className="text-indigo-600">Behavioral Evidence:</strong>{' '}
                    &ldquo;{interest.evidence}&rdquo;
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Rationale Footer */}
      {technologyDNA.skillLevelRationale && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-800">Level Inference:</strong>{' '}
            {technologyDNA.skillLevelRationale}
          </p>
        </div>
      )}
    </section>
  );
};

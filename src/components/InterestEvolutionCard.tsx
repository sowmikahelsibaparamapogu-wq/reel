import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { InterestEvolutionItem } from '../types';

interface InterestEvolutionCardProps {
  evolution: InterestEvolutionItem[];
  isAnalyzing: boolean;
}

export const InterestEvolutionCard: React.FC<InterestEvolutionCardProps> = ({
  evolution,
  isAnalyzing,
}) => {
  if (isAnalyzing) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4 shadow-sm">
        <div className="h-5 w-40 bg-slate-100 rounded" />
        <div className="space-y-2">
          <div className="h-10 bg-slate-50 rounded" />
          <div className="h-10 bg-slate-50 rounded" />
        </div>
      </div>
    );
  }

  if (!evolution || evolution.length === 0) return null;

  const getTrendBadge = (trend: InterestEvolutionItem['trend']) => {
    switch (trend) {
      case 'emerging':
      case 'new':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            <TrendingUp className="w-3 h-3 text-emerald-700" /> Emerging
          </span>
        );
      case 'declining':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
            <TrendingDown className="w-3 h-3 text-rose-700" /> Declining
          </span>
        );
      case 'stable':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Minus className="w-3 h-3 text-slate-500" /> Stable
          </span>
        );
    }
  };

  return (
    <section
      id="interest-evolution-card"
      className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">INTEREST EVOLUTION</h3>
            <p className="text-xs text-slate-500">Tracking changing technical affinities over time</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {evolution.map((item, idx) => {
          const isGain = item.toPercentage >= item.fromPercentage;
          const diff = item.toPercentage - item.fromPercentage;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{item.topic}</span>
                {getTrendBadge(item.trend)}
              </div>

              {/* Graphical Arrow Progress Line */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 pt-1">
                <span className="text-slate-500">{item.fromPercentage}%</span>

                <div className="flex-1 mx-3 flex items-center">
                  <div className="h-1 flex-1 bg-slate-200 relative rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${isGain ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 -ml-1 ${isGain ? 'text-emerald-600' : 'text-rose-600'}`}
                  />
                </div>

                <span className={`font-bold ${isGain ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {item.toPercentage}% {diff !== 0 && `(${diff > 0 ? '+' : ''}${diff}%)`}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans pt-0.5">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

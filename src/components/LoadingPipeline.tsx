import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BrainCircuit,
  Search,
  Activity,
  Layers,
  Sparkles,
  Dna,
  ShieldCheck,
  Filter,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

interface LoadingPipelineProps {
  isAnalyzing: boolean;
}

const STAGES = [
  { text: 'Analyzing Reel content & transcripts...', icon: Search, color: 'text-blue-600' },
  { text: 'Understanding context & intent...', icon: BrainCircuit, color: 'text-indigo-600' },
  { text: 'Analyzing engagement & watch signals...', icon: Activity, color: 'text-emerald-600' },
  { text: 'Comparing complete Reel history...', icon: Layers, color: 'text-cyan-600' },
  { text: 'Discovering hidden latent interests...', icon: Sparkles, color: 'text-purple-600' },
  { text: 'Building your Technology DNA...', icon: Dna, color: 'text-pink-600' },
  { text: 'Detecting possible skill gaps...', icon: BarChart3, color: 'text-amber-600' },
  { text: 'Generating candidate recommendations...', icon: Layers, color: 'text-violet-600' },
  { text: 'Filtering hype and clickbait content...', icon: ShieldCheck, color: 'text-rose-600' },
  { text: 'Ranking recommendations & explore balance...', icon: Filter, color: 'text-indigo-600' },
  { text: 'Selecting your best match & learning path...', icon: CheckCircle2, color: 'text-emerald-600' },
];

export const LoadingPipeline: React.FC<LoadingPipelineProps> = ({ isAnalyzing }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  const currentStage = STAGES[currentStageIndex];
  const IconComponent = currentStage.icon;
  const progressPercent = Math.round(((currentStageIndex + 1) / STAGES.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      id="loading-pipeline-card"
      className="mb-8 p-6 rounded-3xl bg-white border border-indigo-200/80 shadow-xl shadow-indigo-500/5 overflow-hidden relative"
    >
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ ease: 'easeInOut', duration: 0.5 }}
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
        {/* Active Stage Details */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-2xs">
              <IconComponent className={`w-7 h-7 ${currentStage.color} animate-pulse`} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-[10px] font-bold flex items-center justify-center text-white border-2 border-white">
              {currentStageIndex + 1}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-mono font-bold text-indigo-700">
                Sadhan AI Reasoning Pipeline
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">
                Stage {currentStageIndex + 1} of {STAGES.length}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.h3
                key={currentStageIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-bold text-slate-900 tracking-tight"
              >
                {currentStage.text}
              </motion.h3>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full md:w-64 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">AI Deep Synthesis</span>
            <span className="text-indigo-600 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Mini Stages Steps Bar */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-1.5 mt-5 pt-4 border-t border-slate-100">
        {STAGES.map((st, i) => {
          const isDone = i < currentStageIndex;
          const isCurrent = i === currentStageIndex;
          return (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-500'
                  : isCurrent
                  ? 'bg-indigo-600 ring-2 ring-indigo-400/40 animate-pulse'
                  : 'bg-slate-200'
              }`}
              title={st.text}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

import React from 'react';
import {
  GraduationCap,
  PlayCircle,
  Code,
  Layers,
  Cpu,
  CheckCircle2,
  Clock,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { LearningPathStep } from '../types';

interface LearningPathViewProps {
  learningPath: LearningPathStep[];
  isAnalyzing: boolean;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  learningPath,
  isAnalyzing,
}) => {
  if (isAnalyzing) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4 shadow-sm">
        <div className="h-5 w-48 bg-slate-100 rounded" />
        <div className="space-y-3">
          <div className="h-14 bg-slate-50 rounded-xl" />
          <div className="h-14 bg-slate-50 rounded-xl" />
          <div className="h-14 bg-slate-50 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!learningPath || learningPath.length === 0) return null;

  const getStageIcon = (stageName: LearningPathStep['stageName']) => {
    switch (stageName) {
      case 'Current Level':
        return <Clock className="w-4 h-4 text-slate-500" />;
      case 'Beginner Foundation':
        return <PlayCircle className="w-4 h-4 text-emerald-600" />;
      case 'Intermediate Deep-Dive':
        return <Layers className="w-4 h-4 text-blue-600" />;
      case 'Advanced Application':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'Practical Project':
        return <Code className="w-4 h-4 text-pink-600" />;
      case 'Next Skill Horizon':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <section
      id="learning-path-section"
      className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">PERSONALIZED LEARNING PROGRESSION</h3>
            <p className="text-xs text-slate-500">
              Transforming short-form entertainment into an engineering curriculum
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
          6-Step Micro-Path
        </span>
      </div>

      {/* Progression Steps Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 via-purple-500 to-emerald-500">
        {learningPath.map((step, idx) => {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="relative p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-1.5"
            >
              {/* Step Marker Dot */}
              <div className="absolute -left-6 sm:-left-8 top-4 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center text-[10px] font-bold text-indigo-700 shadow-sm">
                {step.stepNumber || idx + 1}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  {getStageIcon(step.stageName)}
                  <span className="text-xs uppercase font-bold tracking-wider text-indigo-700">
                    {step.stageName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs">
                    {step.format}
                  </span>
                  <span>{step.estimatedDuration}</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 pt-0.5">
                {step.topicTitle}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

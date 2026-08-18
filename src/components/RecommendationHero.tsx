import React, { useState } from 'react';
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Zap,
  HelpCircle,
  BarChart2,
  TrendingUp,
  CheckCircle,
  Eye,
  Dice5,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { RecommendationResult, FeedbackItem } from '../types';

interface RecommendationHeroProps {
  recommendation: RecommendationResult | null;
  onFeedback: (type: FeedbackItem['feedbackType']) => void;
  onShowAnother: () => void;
  onSurpriseMe: () => void;
  onOpenCandidatePool: () => void;
  isAnalyzing: boolean;
}

export const RecommendationHero: React.FC<RecommendationHeroProps> = ({
  recommendation,
  onFeedback,
  onShowAnother,
  onSurpriseMe,
  onOpenCandidatePool,
  isAnalyzing,
}) => {
  const [showWhyDeep, setShowWhyDeep] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);

  if (isAnalyzing) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100" />
          <div className="h-4 w-48 bg-slate-100 rounded" />
        </div>
        <div className="h-8 w-3/4 bg-slate-100 rounded-lg" />
        <div className="h-20 w-full bg-slate-50 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="h-16 bg-slate-50 rounded-xl" />
          <div className="h-16 bg-slate-50 rounded-xl" />
          <div className="h-16 bg-slate-50 rounded-xl" />
          <div className="h-16 bg-slate-50 rounded-xl" />
          <div className="h-16 bg-slate-50 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const handleAction = (type: FeedbackItem['feedbackType']) => {
    setFeedbackGiven(type);
    if (type === 'relevant' || type === 'saved') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b'],
      });
    }
    onFeedback(type);
  };

  const isLowHype = recommendation.hypeRisk <= 25;
  const isSurprise = recommendation.recommendationMode === 'surprise' || recommendation.isSurprisePick;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      id="primary-recommendation-card"
      className={`relative p-6 sm:p-8 rounded-3xl bg-white border shadow-md overflow-hidden transition-all ${
        isSurprise
          ? 'border-amber-300 ring-4 ring-amber-50 shadow-amber-500/5'
          : 'border-indigo-200 ring-4 ring-indigo-50/50 shadow-indigo-500/5'
      }`}
    >
      {/* Top Banner: Mode & Category */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isSurprise
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
            }`}
          >
            {isSurprise ? (
              <>
                <Dice5 className="w-3.5 h-3.5 text-amber-600" />
                <span>🎲 Surprise Discovery</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Top AI Recommendation</span>
              </>
            )}
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            {recommendation.category}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
              recommendation.difficulty === 'Advanced'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : recommendation.difficulty === 'Intermediate'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {recommendation.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCandidatePool}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer"
            title="Inspect all AI candidate evaluations and rejected hype"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>View Candidate Pool ({recommendation.allCandidates?.length || 4})</span>
          </button>
        </div>
      </div>

      {/* Main Reel Title */}
      <div className="space-y-2 mb-5">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          &ldquo;{recommendation.recommendedTechReel}&rdquo;
        </h2>

        {recommendation.creatorOrSource && (
          <p className="text-xs font-mono text-slate-500">
            Recommended Channel / Concept Source:{' '}
            <span className="text-indigo-600 font-semibold">{recommendation.creatorOrSource}</span>
          </p>
        )}
      </div>

      {/* Latent Interest Bridge Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Input Signal:</span>
            <span className="font-semibold text-slate-800 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
              {recommendation.interestDetected}
            </span>
          </div>
          <div className="hidden sm:block text-indigo-400 font-bold">➔</div>
          <div className="flex items-center gap-2">
            <span className="text-indigo-700 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Latent Interest Found:
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              {recommendation.latentInterestFound}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed pt-1">
          {recommendation.whyRecommended}
        </p>

        {isSurprise && recommendation.surpriseConnection && (
          <div className="pt-2 text-xs text-amber-800 font-medium flex items-start gap-1.5 border-t border-amber-200/60">
            <Dice5 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Lateral Connection: {recommendation.surpriseConnection}</span>
          </div>
        )}
      </div>

      {/* 5 AI Quality & Safety Metric Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {/* Relevance Score */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Relevance</span>
          <span className="text-xl font-black font-mono text-indigo-700">
            {recommendation.relevanceScore}%
          </span>
          <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${recommendation.relevanceScore}%` }}
            />
          </div>
        </div>

        {/* Educational Value */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Educational Value</span>
          <span className="text-xl font-black font-mono text-emerald-700">
            {recommendation.educationalValue}/100
          </span>
          <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${recommendation.educationalValue}%` }}
            />
          </div>
        </div>

        {/* Hype Risk Gauge */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 font-medium mb-1">
            {isLowHype ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>Hype Risk</span>
          </div>
          <span
            className={`text-xl font-black font-mono ${
              isLowHype ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {recommendation.hypeRisk}/100
          </span>
          <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${isLowHype ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${recommendation.hypeRisk}%` }}
            />
          </div>
        </div>

        {/* Content Quality */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Quality Score</span>
          <span className="text-xl font-black font-mono text-cyan-700">
            {recommendation.qualityScore}/100
          </span>
          <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-cyan-600 rounded-full"
              style={{ width: `${recommendation.qualityScore}%` }}
            />
          </div>
        </div>

        {/* Predicted Engagement */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Predicted Interest</span>
          <span className="text-xl font-black font-mono text-purple-700">
            {recommendation.predictedEngagement}%
          </span>
          <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full"
              style={{ width: `${recommendation.predictedEngagement}%` }}
            />
          </div>
        </div>
      </div>

      {/* Best Match vs Alternative Comparison Card */}
      {recommendation.comparison && (
        <div className="mb-6 p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              AI Recommendation Comparison
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Winner */}
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> BEST MATCH
                </span>
                <span className="font-mono text-emerald-700 font-black">
                  {recommendation.comparison.bestMatchScore}%
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                {recommendation.comparison.bestMatchTitle}
              </p>
            </div>

            {/* Runner-up */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600">ALTERNATIVE</span>
                <span className="font-mono text-slate-500 font-bold">
                  {recommendation.comparison.alternativeScore}%
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700">
                {recommendation.comparison.alternativeTitle}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 pt-1">
            <strong className="text-slate-800">Why Best Match Won:</strong>{' '}
            {recommendation.comparison.whyBestMatchWon}
          </p>
        </div>
      )}

      {/* Expandable "Why Do I Get This?" */}
      <div className="mb-6">
        <button
          onClick={() => setShowWhyDeep(!showWhyDeep)}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showWhyDeep ? 'Hide Multi-Reel Reasoning' : 'Why did I get this recommendation?'}</span>
        </button>

        <AnimatePresence>
          {showWhyDeep && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700 leading-relaxed font-sans space-y-2.5"
            >
              <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Deep Multi-Reel Reasoning Trace</span>
              </div>
              <p>{recommendation.whyDoIGetThis}</p>

              {recommendation.repetitionWarning && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  <strong>Repetition Control:</strong> {recommendation.repetitionWarning}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Feedback Loop Bar */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Was this useful?</span>
          <button
            onClick={() => handleAction('relevant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              feedbackGiven === 'relevant'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Relevant</span>
          </button>
          <button
            onClick={() => handleAction('not_relevant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              feedbackGiven === 'not_relevant'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Not for me</span>
          </button>
          <button
            onClick={() => handleAction('saved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              feedbackGiven === 'saved'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save to Queue</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShowAnother}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
            title="Generate another top candidate"
          >
            <span>Show Another</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onSurpriseMe}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-all cursor-pointer"
            title="Surprise me with lateral technology connection"
          >
            <Dice5 className="w-3.5 h-3.5 text-amber-600" />
            <span>Surprise Me</span>
          </button>
        </div>
      </div>
    </motion.section>
  );
};

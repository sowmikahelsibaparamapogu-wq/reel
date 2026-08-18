import React from 'react';
import { X, Layers, ShieldAlert, ShieldCheck, CheckCircle2, Award, Zap, Youtube, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CandidateRecommendation } from '../types';
import { openYouTubeVideo } from '../utils/youtubeUrl';

interface CandidatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: CandidateRecommendation[];
  onSelectCandidate?: (candidate: CandidateRecommendation) => void;
}

export const CandidatePoolModal: React.FC<CandidatePoolModalProps> = ({
  isOpen,
  onClose,
  candidates,
  onSelectCandidate,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          id="candidate-pool-modal"
          className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Candidate Generation & Hype Filtering Pool
                </h3>
                <p className="text-xs text-slate-500">
                  Sadhan AI generates multiple candidate topics, calculates quality scores, filters clickbait, and ranks the winner
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {candidates && candidates.length > 0 ? (
              candidates.map((cand, idx) => {
                const isSelected = cand.status === 'selected';
                const isFiltered = cand.status === 'filtered_out' || cand.hypeRisk >= 60;

                return (
                  <div
                    key={cand.id || idx}
                    className={`p-4.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                        : isFiltered
                        ? 'bg-rose-50/50 border-rose-200 opacity-80'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                          #{idx + 1}
                        </span>

                        <h4 className="text-sm font-bold text-slate-900">&ldquo;{cand.title}&rdquo;</h4>

                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> SELECTED WINNER
                          </span>
                        )}

                        {isFiltered && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> REJECTED HYPE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px] font-medium shadow-2xs">
                          {cand.category}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[11px] shadow-2xs">
                          {cand.difficulty}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {cand.whyThisCandidate}
                    </p>

                    {cand.hypeExplanation && (
                      <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                        <div>
                          <strong className="font-semibold">Rejection Cause:</strong>{' '}
                          {cand.hypeExplanation}
                        </div>
                      </div>
                    )}

                    {/* Metric Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mb-3">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between shadow-2xs">
                        <span className="text-slate-500">Relevance:</span>
                        <span className="font-bold text-indigo-700">{cand.relevanceScore}%</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between shadow-2xs">
                        <span className="text-slate-500">Educational:</span>
                        <span className="font-bold text-emerald-700">{cand.educationalValue}/100</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between shadow-2xs">
                        <span className="text-slate-500">Quality:</span>
                        <span className="font-bold text-cyan-700">{cand.qualityScore}/100</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between shadow-2xs">
                        <span className="text-slate-500">Hype Risk:</span>
                        <span
                          className={`font-bold ${
                            cand.hypeRisk > 50 ? 'text-rose-700' : 'text-emerald-700'
                          }`}
                        >
                          {cand.hypeRisk}/100
                        </span>
                      </div>
                    </div>

                    {/* Direct Watch Button */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => openYouTubeVideo(cand.videoUrl, cand.title, cand.category)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Youtube className="w-3.5 h-3.5 fill-current" />
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                No candidates available. Run an AI analysis first!
              </p>
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

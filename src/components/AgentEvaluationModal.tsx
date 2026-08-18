import React, { useState } from 'react';
import {
  X,
  FlaskConical,
  Play,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRAP_TEST_SCENARIOS } from '../data/mockScenarios';
import { TrapTestScenario, Reel } from '../types';

interface AgentEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScenario: (scenario: TrapTestScenario) => void;
}

export const AgentEvaluationModal: React.FC<AgentEvaluationModalProps> = ({
  isOpen,
  onClose,
  onLoadScenario,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<TrapTestScenario>(
    TRAP_TEST_SCENARIOS[0]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          id="agent-evaluation-modal"
          className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Agent Evaluation & Built-In Trap Test Suite
                </h3>
                <p className="text-xs text-slate-500">
                  Verify Sadhan AI multi-reel semantic reasoning vs. primitive keyword counting on stress-test datasets
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

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 max-h-[75vh] overflow-y-auto">
            {/* Scenario Selector Sidebar */}
            <div className="p-4 space-y-2 bg-slate-50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-2 mb-2">
                Select Test Scenario
              </span>

              {TRAP_TEST_SCENARIOS.map((scen) => {
                const isSelected = selectedScenario.id === scen.id;
                return (
                  <button
                    key={scen.id}
                    onClick={() => setSelectedScenario(scen)}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-violet-50 border-violet-300 text-violet-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="font-bold mb-0.5 text-slate-900">{scen.name}</div>
                    <div className="text-[11px] text-violet-700 font-mono mb-1 font-semibold">{scen.subtitle}</div>
                    <div className="text-xs text-slate-500 line-clamp-2">
                      {scen.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Scenario Details & Trap Inspection */}
            <div className="p-6 md:col-span-2 space-y-5 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">{selectedScenario.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-100 text-violet-800 border border-violet-200">
                    {selectedScenario.reels.length} Test Reels
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedScenario.description}
                </p>
              </div>

              {/* Weak Trap vs Strong Agent Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Weak Trap */}
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Primitive Keyword System (Trap)</span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed font-mono">
                    {selectedScenario.weakTrapAnswer}
                  </p>
                </div>

                {/* Strong Agent */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sadhan AI Agent Goal</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed font-mono">
                    {selectedScenario.strongAgentGoal}
                  </p>
                </div>
              </div>

              {/* Reels In this Scenario */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Simulated Student Interaction Sequence:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedScenario.reels.map((r, idx) => (
                    <div
                      key={r.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono font-bold text-slate-400 text-[10px]">#{idx + 1}</span>
                        <span className="text-slate-900 font-semibold truncate">{r.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold">
                          {r.interaction}
                        </span>
                        <span className="text-slate-500 font-semibold">{r.watchPercentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Load & Execute Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Loads these reels into the live workspace and initiates AI reasoning.
                </span>

                <button
                  onClick={() => {
                    onLoadScenario(selectedScenario);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Test in AI Engine</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

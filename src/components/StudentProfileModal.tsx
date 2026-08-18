import React, { useState } from 'react';
import { X, UserCheck, Target, Sparkles, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentProfile } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    profile.skillLevel || 'Intermediate'
  );
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal || '');
  const [preferredAreas, setPreferredAreas] = useState<string[]>(
    profile.preferredAreas || ['Backend Systems', 'System Design']
  );
  const [topicsToLearn, setTopicsToLearn] = useState<string>(
    profile.topicsToLearn?.join(', ') || 'Distributed Databases, Kafka, High-Throughput APIs'
  );
  const [currentGoals, setCurrentGoals] = useState(profile.currentGoals || '');

  if (!isOpen) return null;

  const TECH_OPTIONS = [
    'Backend Systems',
    'System Design',
    'AI & LLM Engineering',
    'DSA & Problem Solving',
    'Cloud & DevOps',
    'Hardware & Computer Architecture',
    'Full-Stack Web',
    'Cybersecurity',
  ];

  const toggleArea = (area: string) => {
    if (preferredAreas.includes(area)) {
      setPreferredAreas(preferredAreas.filter((a) => a !== area));
    } else {
      setPreferredAreas([...preferredAreas, area]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      skillLevel,
      careerGoal: careerGoal.trim() || undefined,
      preferredAreas: preferredAreas.length > 0 ? preferredAreas : undefined,
      topicsToLearn: topicsToLearn
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      currentGoals: currentGoals.trim() || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          id="student-profile-modal"
          className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Student Learning Profile</h3>
                <p className="text-xs text-slate-500">
                  Optional preferences to fine-tune Sadhan AI recommendations (agent will infer if omitted)
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

          <form onSubmit={handleSave} className="p-6 space-y-5">
            {/* Skill Level Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Self-Assessed Technical Skill Level
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSkillLevel(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      skillLevel === lvl
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>Target Career Goal / Role</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Backend Engineer at High-Scale Tech Co"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Preferred Tech Areas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Technology Domains
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TECH_OPTIONS.map((opt) => {
                  const isSelected = preferredAreas.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleArea(opt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific Topics to Learn */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Specific Concepts You Wish to Master (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Raft Consensus, Distributed Locks, Vector Indexes"
                value={topicsToLearn}
                onChange={(e) => setTopicsToLearn(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

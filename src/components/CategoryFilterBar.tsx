import React from 'react';
import {
  Sparkles,
  Brain,
  Globe,
  Server,
  Cloud,
  Binary,
  Shield,
  Smartphone,
  Database,
  Cpu,
  Palette,
  Briefcase,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ALL_TECH_CATEGORIES, TechCategory } from '../types';

interface CategoryFilterBarProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  isAnalyzing: boolean;
  totalReelCount: number;
  filteredReelCount?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
  Brain: <Brain className="w-3.5 h-3.5" />,
  Globe: <Globe className="w-3.5 h-3.5" />,
  Server: <Server className="w-3.5 h-3.5" />,
  Cloud: <Cloud className="w-3.5 h-3.5" />,
  Binary: <Binary className="w-3.5 h-3.5" />,
  Shield: <Shield className="w-3.5 h-3.5" />,
  Smartphone: <Smartphone className="w-3.5 h-3.5" />,
  Database: <Database className="w-3.5 h-3.5" />,
  Cpu: <Cpu className="w-3.5 h-3.5" />,
  Palette: <Palette className="w-3.5 h-3.5" />,
  Briefcase: <Briefcase className="w-3.5 h-3.5" />,
};

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategoryId,
  onSelectCategory,
  isAnalyzing,
  totalReelCount,
  filteredReelCount,
}) => {
  const currentCategory = ALL_TECH_CATEGORIES.find((c) => c.id === selectedCategoryId) || ALL_TECH_CATEGORIES[0];

  return (
    <div
      id="category-recommendation-hub"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 transition-all"
    >
      {/* Header section with category overview & description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Category Recommendation Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {ALL_TECH_CATEGORIES.length - 1} Specializations
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              {currentCategory.description}
            </p>
          </div>
        </div>

        {/* Active category pill status */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {selectedCategoryId !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline px-2 py-1"
            >
              Reset to Dynamic DNA
            </button>
          )}
          <span className="text-xs text-slate-400 font-mono">
            Mode:{' '}
            <strong className="text-slate-700">
              {selectedCategoryId === 'all' ? 'Holistic Multi-Reel' : currentCategory.shortName}
            </strong>
          </span>
        </div>
      </div>

      {/* Horizontal scrollable category pill selector */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
          {ALL_TECH_CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <motion.button
                key={cat.id}
                id={`category-btn-${cat.id}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectCategory(cat.id)}
                disabled={isAnalyzing}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-600/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className={isSelected ? 'text-white' : 'text-indigo-600'}>
                  {iconMap[cat.icon] || <Sparkles className="w-3.5 h-3.5" />}
                </span>
                <span>{cat.shortName}</span>
                {cat.id === 'all' && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] rounded font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    Auto
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quick sample topics for the selected category */}
      {selectedCategoryId !== 'all' && currentCategory.sampleReels && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Sample Curated Reel Topics:</span>
          {currentCategory.sampleReels.map((sample, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
            >
              {sample}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

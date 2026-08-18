/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  Sparkles,
  Layers,
  Dna,
  TrendingUp,
  Compass,
  GraduationCap,
  Calendar,
  MessageSquare,
  FlaskConical,
  RotateCcw,
} from 'lucide-react';
import { Header } from './components/Header';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { LoadingPipeline } from './components/LoadingPipeline';
import { ReelList } from './components/ReelList';
import { ReelModal } from './components/ReelModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { RecommendationHero } from './components/RecommendationHero';
import { CandidatePoolModal } from './components/CandidatePoolModal';
import { TechnologyDNACard } from './components/TechnologyDNACard';
import { InterestEvolutionCard } from './components/InterestEvolutionCard';
import { SkillGapCard } from './components/SkillGapCard';
import { LearningPathView } from './components/LearningPathView';
import { WeeklyProgressCard } from './components/WeeklyProgressCard';
import { AskYourFeedChat } from './components/AskYourFeedChat';
import { AgentEvaluationModal } from './components/AgentEvaluationModal';
import { YouTubeHistoryModal } from './components/YouTubeHistoryModal';
import { YouTubeUrlAnalyzer } from './components/YouTubeUrlAnalyzer';
import { CategoryTopVideosSection } from './components/CategoryTopVideosSection';
import { YouTubeRagScraperStudio } from './components/YouTubeRagScraperStudio';
import { DEFAULT_DEMO_REELS } from './data/mockScenarios';
import {
  Reel,
  StudentProfile,
  FullAnalysisResponse,
  FeedbackItem,
  InteractionType,
  TrapTestScenario,
  CandidateRecommendation,
  SingleReelUnderstanding,
} from './types';

export default function App() {
  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem('techreel_reels');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_REELS;
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('techreel_profile');
    return saved
      ? JSON.parse(saved)
      : {
          skillLevel: 'Intermediate',
          careerGoal: 'Software Engineer & Scalable Systems Architect',
          preferredAreas: ['Backend Systems', 'System Design', 'AI Engineering'],
        };
  });

  const [mode, setMode] = useState<'exploit' | 'explore' | 'focused' | 'surprise'>('exploit');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [analysis, setAnalysis] = useState<FullAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);

  // Modals
  const [isAddReelOpen, setIsAddReelOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [isCandidatePoolOpen, setIsCandidatePoolOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);

  // Sync reels & profile to local storage
  useEffect(() => {
    localStorage.setItem('techreel_reels', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('techreel_profile', JSON.stringify(profile));
  }, [profile]);

  // Main Analysis function
  const runAnalysis = useCallback(
    async (params?: {
      targetReels?: Reel[];
      overrideMode?: 'exploit' | 'explore' | 'focused' | 'surprise';
      overrideCategory?: string;
      surpriseMe?: boolean;
    }) => {
      const activeReels = params?.targetReels || reels;
      if (activeReels.length === 0) {
        setError('Please add at least one Reel to analyze.');
        return;
      }

      setIsAnalyzing(true);
      setError(null);

      const effectiveMode = params?.overrideMode || mode;
      const effectiveCategory = params?.overrideCategory !== undefined ? params.overrideCategory : selectedCategory;
      const surpriseMe = params?.surpriseMe || false;

      try {
        const res = await fetch('/api/analyze-reels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reels: activeReels,
            profile,
            mode: effectiveMode,
            selectedCategory: effectiveCategory,
            surpriseMe,
            feedbackHistory,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'AI analysis could not be completed. Please try again.');
        }

        const data: FullAnalysisResponse = await res.json();
        setAnalysis(data);
      } catch (err: any) {
        console.error('Analysis error:', err);
        setError(err.message || 'AI analysis failed. Please check network connection or try again.');
      } finally {
        setIsAnalyzing(false);
      }
    },
    [reels, profile, mode, selectedCategory, feedbackHistory]
  );

  // Handle YouTube Shorts History Import & Instant Analysis
  const handleImportYouTubeReels = (newReels: Reel[]) => {
    const existingIds = new Set(reels.map((r) => r.id));
    const freshReels = newReels.filter((r) => !existingIds.has(r.id));
    const combined = [...freshReels, ...reels];
    setReels(combined);
    // Automatically personalize and analyze based on new YouTube Shorts
    runAnalysis({ targetReels: combined, overrideMode: 'exploit' });
  };

  // Handle live scraped YouTube URL completion
  const handleScrapedUrlComplete = (scrapedReel: Reel, _understanding: SingleReelUnderstanding) => {
    const existing = reels.filter((r) => r.id !== scrapedReel.id);
    const updated = [scrapedReel, ...existing];
    setReels(updated);
    runAnalysis({ targetReels: updated, overrideMode: 'exploit' });
  };

  // Trigger initial analysis on first mount if not yet analyzed
  useEffect(() => {
    if (!analysis && reels.length > 0) {
      runAnalysis();
    }
  }, []);

  // Update reel interaction
  const handleUpdateInteraction = (id: string, interaction: InteractionType) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, interaction } : r))
    );
  };

  // Update reel watch percentage
  const handleUpdateWatchPercentage = (id: string, watchPercentage: number) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, watchPercentage } : r))
    );
  };

  // Add new reel
  const handleAddReel = (newReel: Reel) => {
    const updated = [newReel, ...reels];
    setReels(updated);
    runAnalysis({ targetReels: updated });
  };

  // Delete reel
  const handleDeleteReel = (id: string) => {
    const updated = reels.filter((r) => r.id !== id);
    setReels(updated);
    if (updated.length > 0) {
      runAnalysis({ targetReels: updated });
    } else {
      setAnalysis(null);
    }
  };

  // Reset to initial demo data
  const handleReset = () => {
    setReels(DEFAULT_DEMO_REELS);
    setFeedbackHistory([]);
    setSelectedCategory('all');
    runAnalysis({ targetReels: DEFAULT_DEMO_REELS, overrideMode: 'exploit', overrideCategory: 'all' });
  };

  // Try Demo button
  const handleTryDemo = () => {
    setReels(DEFAULT_DEMO_REELS);
    runAnalysis({ targetReels: DEFAULT_DEMO_REELS });
  };

  // Surprise Me
  const handleSurpriseMe = () => {
    setMode('surprise');
    runAnalysis({ surpriseMe: true, overrideMode: 'surprise' });
  };

  // Category change handler
  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    runAnalysis({ overrideCategory: catId });
  };

  // Show Another (cycling to alternative candidate or re-running explore)
  const handleShowAnother = () => {
    if (analysis?.primaryRecommendation?.allCandidates) {
      const candidates = analysis.primaryRecommendation.allCandidates.filter(
        (c) => c.status !== 'filtered_out' && c.id !== analysis.primaryRecommendation.id
      );
      if (candidates.length > 0) {
        const nextPick = candidates[0];
        setAnalysis((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            primaryRecommendation: {
              ...prev.primaryRecommendation,
              id: nextPick.id,
              recommendedTechReel: nextPick.title,
              category: nextPick.category,
              difficulty: nextPick.difficulty,
              relevanceScore: nextPick.relevanceScore,
              educationalValue: nextPick.educationalValue,
              qualityScore: nextPick.qualityScore,
              hypeRisk: nextPick.hypeRisk,
              predictedEngagement: nextPick.predictedEngagement,
              whyRecommended: nextPick.whyThisCandidate,
              whyDoIGetThis: `Alternative recommendation selected from the candidate pool: ${nextPick.whyThisCandidate}`,
            },
          };
        });
        return;
      }
    }
    runAnalysis({ overrideMode: 'explore' });
  };

  // Handle User Feedback (👍, 👎, 🔖)
  const handleFeedback = (type: FeedbackItem['feedbackType']) => {
    if (!analysis?.primaryRecommendation) return;

    const newFeedback: FeedbackItem = {
      recommendationId: analysis.primaryRecommendation.id,
      feedbackType: type,
      topic: analysis.primaryRecommendation.recommendedTechReel,
      timestamp: new Date().toISOString(),
    };

    setFeedbackHistory((prev) => [newFeedback, ...prev]);

    // If marked "not relevant", trigger next candidate automatically
    if (type === 'not_relevant') {
      setTimeout(() => {
        handleShowAnother();
      }, 500);
    }
  };

  // Load Scenario from Trap Test Suite
  const handleLoadScenario = (scenario: TrapTestScenario) => {
    setReels(scenario.reels);
    runAnalysis({ targetReels: scenario.reels });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Sticky Navigation Bar */}
      <Header
        onAnalyze={() => runAnalysis()}
        onAddReel={() => setIsAddReelOpen(true)}
        onTryDemo={handleTryDemo}
        onOpenEvaluation={() => setIsEvaluationOpen(true)}
        onReset={handleReset}
        onSurpriseMe={handleSurpriseMe}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenYouTubeHistory={() => setIsYouTubeModalOpen(true)}
        mode={mode}
        setMode={(newMode) => {
          setMode(newMode);
          runAnalysis({ overrideMode: newMode });
        }}
        isAnalyzing={isAnalyzing}
        reelCount={reels.length}
        profile={profile}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Live YouTube URL Scraper & Instant Personalized Recommender */}
        <YouTubeUrlAnalyzer
          onAnalyzeComplete={handleScrapedUrlComplete}
          isGlobalAnalyzing={isAnalyzing}
        />

        {/* Category Filter & Selector Bar */}
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          isAnalyzing={isAnalyzing}
        />

        {/* Error Notification Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => runAnalysis()}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all cursor-pointer"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Multi-Stage Loading Pipeline */}
        <LoadingPipeline isAnalyzing={isAnalyzing} />

        {/* Primary Recommendation Showcase (The Crown Jewel) */}
        {analysis?.primaryRecommendation && (
          <RecommendationHero
            recommendation={analysis.primaryRecommendation}
            onFeedback={handleFeedback}
            onShowAnother={handleShowAnother}
            onSurpriseMe={handleSurpriseMe}
            onOpenCandidatePool={() => setIsCandidatePoolOpen(true)}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* Live Interactive Category Input -> YouTube RAG Model Scraper & Recommendations */}
        <YouTubeRagScraperStudio
          recentReels={reels}
          onAddReelToFeed={handleAddReel}
        />

        {/* Top Useful Tech Videos & Shorts by Category + User YouTube History */}
        <CategoryTopVideosSection
          selectedCategoryId={selectedCategory}
          onSelectCategory={handleCategorySelect}
          userReels={reels}
          onAddReelToFeed={handleAddReel}
        />

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Technology DNA & Evolution & Progress */}
          <div className="lg:col-span-5 space-y-8">
            {/* AI Technology DNA */}
            <TechnologyDNACard
              technologyDNA={analysis?.technologyDNA || null}
              isAnalyzing={isAnalyzing}
            />

            {/* Interest Evolution */}
            <InterestEvolutionCard
              evolution={analysis?.interestEvolution || []}
              isAnalyzing={isAnalyzing}
            />

            {/* Weekly Tech Progress Summary */}
            <WeeklyProgressCard
              progress={analysis?.weeklyProgress || null}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Right Column: Skill Gaps & Personalized Learning Progression & Interactive Chat */}
          <div className="lg:col-span-7 space-y-8">
            {/* Skill Gap Detection */}
            <SkillGapCard
              skillGaps={analysis?.skillGaps || []}
              onBridgeGapClick={(topic) => {
                setMode('focused');
                runAnalysis({ overrideMode: 'focused' });
              }}
              isAnalyzing={isAnalyzing}
            />

            {/* 6-Step Personalized Learning Roadmap */}
            <LearningPathView
              learningPath={analysis?.learningPath || []}
              isAnalyzing={isAnalyzing}
            />

            {/* Ask Sadhan AI Conversational Assistant */}
            <AskYourFeedChat
              reels={reels}
              technologyDNA={analysis?.technologyDNA || null}
              skillGaps={analysis?.skillGaps || []}
              primaryRecommendation={analysis?.primaryRecommendation || null}
            />
          </div>
        </div>

        {/* Reel History Section */}
        <div className="pt-4 border-t border-slate-200">
          <ReelList
            reels={reels}
            understandings={analysis?.understandings || []}
            onUpdateReelInteraction={handleUpdateInteraction}
            onUpdateReelWatchPercentage={handleUpdateWatchPercentage}
            onDeleteReel={handleDeleteReel}
            onAddReelClick={() => setIsAddReelOpen(true)}
            onOpenYouTubeHistory={() => setIsYouTubeModalOpen(true)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Sadhan AI</span>
            <span>•</span>
            <span>&ldquo;Turn your scroll into your skill.&rdquo;</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>Powered by Multi-Reel Reasoning & Latent Signal Intelligence</span>
            <button
              onClick={() => setIsEvaluationOpen(true)}
              className="text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              Trap Test Suite
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReelModal
        isOpen={isAddReelOpen}
        onClose={() => setIsAddReelOpen(false)}
        onAddReel={handleAddReel}
      />

      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={(newProf) => {
          setProfile(newProf);
          runAnalysis();
        }}
      />

      <AgentEvaluationModal
        isOpen={isEvaluationOpen}
        onClose={() => setIsEvaluationOpen(false)}
        onLoadScenario={handleLoadScenario}
      />

      <CandidatePoolModal
        isOpen={isCandidatePoolOpen}
        onClose={() => setIsCandidatePoolOpen(false)}
        candidates={analysis?.primaryRecommendation?.allCandidates || []}
      />

      <YouTubeHistoryModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        onImportReels={handleImportYouTubeReels}
      />
    </div>
  );
}

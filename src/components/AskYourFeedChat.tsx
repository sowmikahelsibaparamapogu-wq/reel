import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, Reel, TechnologyDNA, SkillGap, RecommendationResult } from '../types';

interface AskYourFeedChatProps {
  reels: Reel[];
  technologyDNA: TechnologyDNA | null;
  skillGaps: SkillGap[];
  primaryRecommendation: RecommendationResult | null;
}

export const AskYourFeedChat: React.FC<AskYourFeedChatProps> = ({
  reels,
  technologyDNA,
  skillGaps,
  primaryRecommendation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'agent',
      content:
        "Hello! I'm your **Sadhan AI Assistant**. I've analyzed your reel consumption, latent interests, and skill gaps. Ask me anything about why you're getting specific recommendations, your Technology DNA, or what to learn next!",
      timestamp: 'Just now',
      suggestedPrompts: [
        'Why did you infer Software Engineering instead of just Java?',
        'What is my biggest blind spot right now?',
        'What should I learn next to level up?',
        'Why did you filter out the get-rich AI tools?',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          reels,
          technologyDNA,
          skillGaps,
          primaryRecommendation,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from Ask Your Feed');
      }

      const data = await response.json();
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: data.answer,
        timestamp: 'Just now',
        suggestedPrompts: data.suggestedPrompts,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'agent',
          content:
            "I couldn't reach the agent reasoning core right now. However, based on your history, you are moving from basic programming towards scalable systems and software engineering!",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="ask-your-feed-card"
      className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4"
    >
      {/* Card Header & Toggle */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>ASK SADHAN AI ASSISTANT</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                Grounded in your data
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Ask why specific recommendations were picked, discover blind spots, or request custom paths
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>{isExpanded ? 'Collapse Chat' : 'Open Chat'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Suggested Quick Prompt Chips (Always visible) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-500" />
          Instant Questions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            'Why did you infer Software Engineering instead of just Java?',
            'What is my biggest blind spot right now?',
            'What should I learn next?',
            'Why was hype content filtered out?',
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => {
                setIsExpanded(true);
                handleSend(promptText);
              }}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 hover:border-indigo-300 transition-all text-left cursor-pointer"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Interactive Chat Dialogue */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 space-y-3"
          >
            <div className="h-64 sm:h-80 overflow-y-auto p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-sans">
              {messages.map((msg) => {
                const isAgent = msg.role === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      isAgent ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {isAgent && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                        isAgent
                          ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                          : 'bg-indigo-600 text-white shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Follow-up Prompts */}
                      {isAgent && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                          {msg.suggestedPrompts.map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(p)}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
                            >
                              ➔ {p}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {!isAgent && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-indigo-600 font-mono py-2">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span>Sadhan AI is analyzing your reel context...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about your latent interests, recommendations, or skill gaps..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-all shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

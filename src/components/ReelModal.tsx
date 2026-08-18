import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Video,
  FileText,
  Heart,
  Bookmark,
  Share2,
  Eye,
  EyeOff,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reel, InteractionType } from '../types';

interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReel: (reel: Reel) => void;
}

export const ReelModal: React.FC<ReelModalProps> = ({ isOpen, onClose, onAddReel }) => {
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [caption, setCaption] = useState('');
  const [transcript, setTranscript] = useState('');
  const [categoryTag, setCategoryTag] = useState('Software Engineering');
  const [interaction, setInteraction] = useState<InteractionType>('liked');
  const [watchPercentage, setWatchPercentage] = useState<number>(90);
  const [durationSeconds, setDurationSeconds] = useState<number>(30);
  
  // Media upload state
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaBase64, setMediaBase64] = useState<string | null>(null);
  const [mediaMimeType, setMediaMimeType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mime = file.type;
    setMediaMimeType(mime);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setMediaPreview(result);
      setMediaBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setMediaMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setMediaPreview(result);
      setMediaBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !caption.trim() && !transcript.trim()) return;

    const newReel: Reel = {
      id: `reel-${Date.now()}`,
      title: title.trim() || 'Untitled Tech Reel',
      creator: creator.trim() || '@tech_creator',
      caption: caption.trim(),
      transcript: transcript.trim(),
      thumbnailUrl:
        mediaPreview ||
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      mediaBase64: mediaBase64 || undefined,
      mediaMimeType: mediaMimeType || undefined,
      interaction,
      watchPercentage,
      durationSeconds,
      timestamp: 'Just now',
      categoryTag: categoryTag || 'Technology',
    };

    onAddReel(newReel);
    onClose();
  };

  const CATEGORY_PRESETS = [
    'Programming Humor',
    'Developer Career',
    'Coding Interview',
    'System Design',
    'AI & ML',
    'Cloud / DevOps',
    'Hardware & GPU',
    'Tech Hype',
    'Cybersecurity',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          id="add-reel-modal"
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Reel to Feed</h3>
                <p className="text-xs text-slate-500">
                  Multimodal input: Provide video/image, caption, transcript, and interaction signals
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

          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Media Upload Area */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Reel Media / Thumbnail / Screenshot (Optional)
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-50 hover:bg-slate-100/70 relative group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,video/*"
                  className="hidden"
                />
                {mediaPreview ? (
                  <div className="relative inline-block max-h-40 rounded-xl overflow-hidden border border-slate-200">
                    <img src={mediaPreview} alt="Preview" className="max-h-40 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-xs font-semibold text-white">
                      Click to replace
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 py-3">
                    <Upload className="w-7 h-7 text-indigo-600 mx-auto group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-semibold text-slate-700">
                      Drag and drop image/video frame or <span className="text-indigo-600 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-400">Supports PNG, JPG, MP4, WebM (multimodal AI analysis)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Title & Creator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Reel Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Day in the life of a Backend Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Creator Handle</label>
                <input
                  type="text"
                  placeholder="e.g. @backend_daily"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Caption & Hashtags</label>
              <textarea
                rows={2}
                placeholder="e.g. Debugging Kafka cluster lag and scaling PostgreSQL replica pools #backend #swe"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Transcript */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Transcript / Spoken Audio Content</span>
                <span className="text-xs text-indigo-600 font-medium">High semantic value for AI</span>
              </label>
              <textarea
                rows={3}
                placeholder="What did the creator say? e.g. 'In this video we discuss how to design an event-driven architecture using message queues...'"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Category presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Topic Category Preset</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_PRESETS.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategoryTag(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      categoryTag === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Interaction Signals */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block">
                User Interaction Signals (Behavioral Weights)
              </span>

              {/* Interaction Type Buttons */}
              <div>
                <label className="block text-xs text-slate-500 mb-2">User Primary Action</label>
                <div className="grid grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => setInteraction('saved')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      interaction === 'saved'
                        ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 mb-1 text-amber-500" />
                    <span>Saved</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInteraction('liked')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      interaction === 'liked'
                        ? 'bg-rose-100 border-rose-300 text-rose-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className="w-4 h-4 mb-1 text-rose-500" />
                    <span>Liked</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInteraction('shared')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      interaction === 'shared'
                        ? 'bg-blue-100 border-blue-300 text-blue-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Share2 className="w-4 h-4 mb-1 text-blue-500" />
                    <span>Shared</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInteraction('watched')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      interaction === 'watched'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Eye className="w-4 h-4 mb-1 text-emerald-600" />
                    <span>Watched</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInteraction('skipped')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      interaction === 'skipped'
                        ? 'bg-slate-200 border-slate-400 text-slate-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <EyeOff className="w-4 h-4 mb-1 text-slate-400" />
                    <span>Skipped</span>
                  </button>
                </div>
              </div>

              {/* Watch Percentage & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-semibold">
                    <span>Watch Percentage</span>
                    <span className="font-mono text-indigo-600 font-bold">{watchPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={watchPercentage}
                    onChange={(e) => setWatchPercentage(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-semibold">
                    <span>Duration</span>
                    <span className="font-mono text-indigo-600 font-bold">{durationSeconds}s</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={120}
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add & Ingest Reel</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

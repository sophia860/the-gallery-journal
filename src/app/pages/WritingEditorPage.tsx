import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Sprout, Leaf, Flower2, Eye, Users, Lock, Tag, X, Bold, Italic, Quote, Type, Maximize2, Minimize2, Check, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GardenMainNav } from '../components/GardenMainNav';
import { JoinTheGardenGate } from '../components/JoinTheGardenGate';
import { createWriting, updateWriting, getWriting } from '/src/services/gardenWritingService';
import { Writing } from '/src/types/garden';

interface WritingEditorPageProps {
  writingId?: string;
}

export function WritingEditorPage({ writingId }: WritingEditorPageProps) {
  const { user, loading: authLoading } = useAuth();
  
  // AUTH GATE: Show join gate if not logged in
  if (!authLoading && !user) {
    return <JoinTheGardenGate />;
  }

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'essay' as 'essay' | 'poem' | 'fragment' | 'marginalia',
    growth_stage: 'seed' as 'seed' | 'sprout' | 'bloom',
    visibility: 'private' as 'private' | 'circles' | 'public',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loading, setLoading] = useState(!!writingId);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [contentTextarea, setContentTextarea] = useState<HTMLTextAreaElement | null>(null);
  
  // Submit to Editors state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [priorityNote, setPriorityNote] = useState('');
  const [isGreenhouseTier, setIsGreenhouseTier] = useState(false); // TODO: Replace with actual tier check
  const [showTooltip, setShowTooltip] = useState(false);

  // Load existing writing if editing
  useEffect(() => {
    if (writingId && user) {
      loadWriting();
    }
  }, [writingId, user]);

  const loadWriting = async () => {
    if (!writingId) return;

    try {
      setLoading(true);
      const writing = await getWriting(writingId);
      if (writing && writing.user_id === user?.id) {
        setFormData({
          title: writing.title,
          content: writing.content,
          type: writing.type,
          growth_stage: writing.growth_stage,
          visibility: writing.visibility,
          tags: writing.tags || [],
        });
      }
    } catch (error) {
      console.error('Error loading writing:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save on content change
  useEffect(() => {
    if (!user || loading) return;

    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Set new timeout for auto-save (2 seconds after typing stops)
    const timeout = setTimeout(() => {
      if (formData.title && formData.content) {
        handleAutoSave();
      }
    }, 2000);

    setAutoSaveTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [formData.title, formData.content, formData.type]);

  const handleAutoSave = async () => {
    if (!user || saving) return;

    try {
      setSaving(true);
      
      if (writingId) {
        // Update existing
        await updateWriting(writingId, formData);
      } else {
        // Create new (but don't redirect yet)
        const newWriting = await createWriting({
          ...formData,
          user_id: user.id,
        });
        // Update URL without reload
        if (newWriting) {
          window.history.replaceState({}, '', `/garden/write/${newWriting.id}`);
        }
      }
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!user || !formData.title || !formData.content) return;

    try {
      setSaving(true);

      if (writingId) {
        await updateWriting(writingId, formData);
      } else {
        const newWriting = await createWriting({
          ...formData,
          user_id: user.id,
        });
        if (newWriting) {
          window.location.href = `/my-garden`;
        }
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePlant = async () => {
    await handleSave();
    window.location.href = '/my-garden';
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  // Formatting functions
  const applyFormat = (prefix: string, suffix: string = prefix) => {
    if (!contentTextarea) return;
    
    const start = contentTextarea.selectionStart;
    const end = contentTextarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const beforeText = formData.content.substring(0, start);
    const afterText = formData.content.substring(end);
    
    if (selectedText) {
      const newContent = beforeText + prefix + selectedText + suffix + afterText;
      setFormData({ ...formData, content: newContent });
      
      // Restore selection after state update
      setTimeout(() => {
        contentTextarea.focus();
        contentTextarea.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 0);
    }
  };

  const formatBold = () => applyFormat('**', '**');
  const formatItalic = () => applyFormat('*', '*');
  const formatHeading = () => {
    if (!contentTextarea) return;
    const start = contentTextarea.selectionStart;
    const beforeText = formData.content.substring(0, start);
    const lastNewline = beforeText.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    applyFormat('# ', '');
  };
  const formatQuote = () => {
    if (!contentTextarea) return;
    const start = contentTextarea.selectionStart;
    const beforeText = formData.content.substring(0, start);
    const lastNewline = beforeText.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    applyFormat('> ', '');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        formatBold();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        formatItalic();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, contentTextarea]);

  // Calculate stats
  const wordCount = formData.content.split(/\s+/).filter(Boolean).length;
  const charCount = formData.content.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1729] flex items-center justify-center relative overflow-hidden">
        {/* Starfield */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="stars-layer"></div>
        </div>
        <div className="text-center relative z-10">
          <Sprout className="w-12 h-12 text-[#60a5fa] animate-pulse mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))' }} />
          <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      {/* Animated Starfield Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="stars-layer"></div>
        <div className="stars-layer-2"></div>
        <div className="stars-layer-3"></div>
        <div className="stars-layer-glow"></div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 10% 10%, white, transparent),
            radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 30% 15%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(3px 3px at 40% 40%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 50% 25%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 70% 50%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 80% 20%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 15% 60%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(2px 2px at 25% 80%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 35% 90%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 45% 5%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 55% 55%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 65% 35%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 75% 75%, rgba(180, 200, 255, 0.9), transparent),
            radial-gradient(2px 2px at 85% 85%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 95% 45%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 5% 95%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 12% 42%, rgba(255, 255, 255, 0.85), transparent);
          background-size: 200% 200%;
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 8% 20%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 18% 55%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 28% 12%, white, transparent),
            radial-gradient(1px 1px at 38% 68%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 48% 82%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 58% 38%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 68% 8%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 78% 58%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 88% 28%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 98% 78%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 3% 33%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(1px 1px at 13% 73%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 23% 48%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 33% 88%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 43% 18%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 53% 63%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 63% 93%, rgba(180, 200, 255, 0.85), transparent),
            radial-gradient(1px 1px at 73% 23%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 83% 53%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 93% 3%, rgba(255, 255, 255, 0.9), transparent);
          background-size: 250% 250%;
          animation: twinkle 6s ease-in-out infinite reverse;
        }

        .stars-layer-3 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 6% 16%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 16% 46%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 26% 76%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 36% 6%, white, transparent),
            radial-gradient(1px 1px at 46% 36%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 56% 66%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 66% 96%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 76% 26%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 86% 56%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(1px 1px at 96% 86%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 11% 51%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 21% 21%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 31% 81%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 41% 41%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 51% 11%, rgba(180, 200, 255, 0.9), transparent),
            radial-gradient(1px 1px at 61% 71%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 71% 31%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 81% 91%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 91% 61%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 1% 1%, rgba(255, 255, 255, 0.8), transparent);
          background-size: 300% 300%;
          animation: twinkle 8s ease-in-out infinite;
        }

        .stars-layer-glow {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(3px 3px at 15% 25%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(4px 4px at 45% 55%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(3px 3px at 75% 35%, rgba(200, 220, 255, 1), transparent),
            radial-gradient(4px 4px at 85% 75%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(3px 3px at 25% 85%, rgba(180, 210, 255, 1), transparent);
          background-size: 100% 100%;
          animation: glow 3s ease-in-out infinite;
          filter: blur(0.5px);
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes glow {
          0%, 100% { 
            opacity: 1;
            filter: blur(0.5px);
          }
          50% { 
            opacity: 0.6;
            filter: blur(1px);
          }
        }

        .glass-card {
          background: rgba(15, 23, 41, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 157, 195, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .glass-input {
          background: rgba(15, 23, 41, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(139, 157, 195, 0.3);
        }

        .glass-input:focus {
          background: rgba(15, 23, 41, 0.7);
          border: 1px solid rgba(96, 165, 250, 0.5);
          box-shadow: 0 0 20px rgba(96, 165, 250, 0.2);
        }
      `}</style>

      <GardenMainNav variant="dark" />

      <div className="pt-24 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Save Status */}
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h1 className="font-['Cardo'] text-4xl text-white mb-2 italic" style={{ textShadow: '0 0 25px rgba(96, 165, 250, 0.4)' }}>
                {writingId ? 'Edit Writing' : 'New Writing'}
              </h1>
              {lastSaved && (
                <p className="font-['Inter'] text-sm text-[#8b9dc3]">
                  Last saved {lastSaved.toLocaleTimeString()}
                </p>
              )}
              {saving && (
                <p className="font-['Inter'] text-sm text-[#60a5fa] flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFocusMode(true)}
                className="px-4 py-2 border border-[rgba(139,157,195,0.3)] text-[#8b9dc3] hover:bg-[rgba(96,165,250,0.1)] hover:border-[#60a5fa] hover:text-[#60a5fa] transition-all font-['Inter'] text-sm font-semibold rounded-lg flex items-center gap-2"
                title="Focus Mode - Distraction-free writing"
              >
                <Maximize2 className="w-4 h-4" />
                Focus Mode
              </button>
              <a
                href="/my-garden"
                className="px-4 py-2 border-2 border-[rgba(139,157,195,0.3)] text-[#c8cad8] hover:bg-[rgba(96,165,250,0.1)] hover:border-[#60a5fa] transition-all font-['Inter'] text-sm font-semibold rounded-lg"
              >
                Cancel
              </a>
              <button
                onClick={handlePlant}
                disabled={saving || !formData.title || !formData.content}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white hover:from-[#3b82f6] hover:to-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Cardo'] text-lg rounded-lg shadow-lg shadow-blue-500/30"
              >
                <Save className="w-4 h-4" />
                Plant in Garden
              </button>
            </div>
          </div>

          {/* Editor Controls */}
          <div className="glass-card rounded-lg p-6 mb-6 relative z-10">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Type Selector */}
              <div>
                <label className="block font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 glass-input text-white focus:outline-none font-['Inter'] text-sm rounded-lg"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="essay" style={{ background: '#1a1f3a', color: '#ffffff' }}>Essay</option>
                  <option value="poem" style={{ background: '#1a1f3a', color: '#ffffff' }}>Poem</option>
                  <option value="fragment" style={{ background: '#1a1f3a', color: '#ffffff' }}>Fragment</option>
                  <option value="marginalia" style={{ background: '#1a1f3a', color: '#ffffff' }}>Marginalia</option>
                </select>
              </div>

              {/* Growth Stage Selector */}
              <div>
                <label className="block font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-2">
                  Growth Stage
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, growth_stage: 'seed' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border rounded-lg transition-all ${
                      formData.growth_stage === 'seed'
                        ? 'border-[#d4a574] bg-[rgba(212,165,116,0.15)] shadow-lg'
                        : 'border-[rgba(139,157,195,0.2)] hover:border-[#d4a574]'
                    }`}
                    title="Seed - Early idea or fragment"
                    style={formData.growth_stage === 'seed' ? { boxShadow: '0 0 15px rgba(212, 165, 116, 0.3)' } : {}}
                  >
                    <div className="w-2 h-2 bg-[#d4a574] rounded-full"></div>
                    <span className="text-xs font-['Inter'] font-semibold text-[#d4a574]">Seed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, growth_stage: 'sprout' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border rounded-lg transition-all ${
                      formData.growth_stage === 'sprout'
                        ? 'border-[#10b981] bg-[rgba(16,185,129,0.15)] shadow-lg'
                        : 'border-[rgba(139,157,195,0.2)] hover:border-[#10b981]'
                    }`}
                    title="Sprout - Work in progress"
                    style={formData.growth_stage === 'sprout' ? { boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' } : {}}
                  >
                    <Leaf className="w-4 h-4 text-[#10b981]" />
                    <span className="text-xs font-['Inter'] font-semibold text-[#10b981]">Sprout</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, growth_stage: 'bloom' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border rounded-lg transition-all ${
                      formData.growth_stage === 'bloom'
                        ? 'border-[#ec4899] bg-[rgba(236,72,153,0.15)] shadow-lg'
                        : 'border-[rgba(139,157,195,0.2)] hover:border-[#ec4899]'
                    }`}
                    title="Bloom - Finished piece"
                    style={formData.growth_stage === 'bloom' ? { boxShadow: '0 0 15px rgba(236, 72, 153, 0.3)' } : {}}
                  >
                    <Flower2 className="w-4 h-4 text-[#ec4899]" />
                    <span className="text-xs font-['Inter'] font-semibold text-[#ec4899]">Bloom</span>
                  </button>
                </div>
              </div>

              {/* Visibility Selector */}
              <div>
                <label className="block font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-2">
                  Visibility
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'private' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border rounded-lg transition-all ${
                      formData.visibility === 'private'
                        ? 'border-[#8b9dc3] bg-[rgba(139,157,195,0.15)] shadow-lg'
                        : 'border-[rgba(139,157,195,0.2)] hover:border-[#8b9dc3]'
                    }`}
                    title="Private - Only you"
                    style={formData.visibility === 'private' ? { boxShadow: '0 0 15px rgba(139, 157, 195, 0.3)' } : {}}
                  >
                    <Lock className="w-4 h-4 text-[#8b9dc3]" />
                    <span className="text-xs font-['Inter'] font-semibold text-[#8b9dc3]">Private</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'circles' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border rounded-lg transition-all ${
                      formData.visibility === 'circles'
                        ? 'border-[#60a5fa] bg-[rgba(96,165,250,0.15)] shadow-lg'
                        : 'border-[rgba(139,157,195,0.2)] hover:border-[#60a5fa]'
                    }`}
                    title="Circles - Your circles only"
                    style={formData.visibility === 'circles' ? { boxShadow: '0 0 15px rgba(96, 165, 250, 0.3)' } : {}}
                  >
                    <Users className="w-4 h-4 text-[#60a5fa]" />
                    <span className="text-xs font-['Inter'] font-semibold text-[#60a5fa]">Circles</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'public' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border rounded-lg transition-all ${
                      formData.visibility === 'public'
                        ? 'border-[#10b981] bg-[rgba(16,185,129,0.15)] shadow-lg'
                        : 'border-[rgba(139,157,195,0.2)] hover:border-[#10b981]'
                    }`}
                    title="Public - Everyone can see"
                    style={formData.visibility === 'public' ? { boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' } : {}}
                  >
                    <Eye className="w-4 h-4 text-[#10b981]" />
                    <span className="text-xs font-['Inter'] font-semibold text-[#10b981]">Public</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[rgba(96,165,250,0.15)] border border-[rgba(96,165,250,0.3)] text-[#60a5fa] text-sm font-['Inter'] rounded-full"
                    style={{ boxShadow: '0 0 10px rgba(96, 165, 250, 0.2)' }}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-[#ec4899]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 glass-input text-white placeholder:text-[#8b9dc3] focus:outline-none font-['Inter'] text-sm rounded-lg"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white hover:from-[#3b82f6] hover:to-[#2563eb] transition-all font-['Inter'] text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/20"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="glass-card rounded-lg overflow-hidden relative z-10">
            {/* Title */}
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title your writing..."
              className="w-full px-8 py-6 border-b border-[rgba(139,157,195,0.2)] focus:border-[rgba(96,165,250,0.5)] focus:outline-none font-['Cardo'] text-4xl text-white placeholder:text-[#8b9dc3] bg-transparent"
            />

            {/* Formatting Toolbar */}
            <div className="px-8 py-3 border-b border-[rgba(139,157,195,0.15)] flex items-center gap-2">
              <button
                type="button"
                onClick={formatBold}
                className="px-3 py-1.5 glass-input hover:bg-[rgba(96,165,250,0.1)] hover:border-[#60a5fa] hover:text-[#60a5fa] text-[#8b9dc3] border border-[rgba(139,157,195,0.2)] rounded font-['Inter'] font-bold text-sm transition-all"
                title="Bold (Cmd+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={formatItalic}
                className="px-3 py-1.5 glass-input hover:bg-[rgba(96,165,250,0.1)] hover:border-[#60a5fa] hover:text-[#60a5fa] text-[#8b9dc3] border border-[rgba(139,157,195,0.2)] rounded font-['Inter'] italic text-sm transition-all"
                title="Italic (Cmd+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={formatHeading}
                className="px-3 py-1.5 glass-input hover:bg-[rgba(96,165,250,0.1)] hover:border-[#60a5fa] hover:text-[#60a5fa] text-[#8b9dc3] border border-[rgba(139,157,195,0.2)] rounded font-['Inter'] font-bold text-sm transition-all"
                title="Heading"
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={formatQuote}
                className="px-3 py-1.5 glass-input hover:bg-[rgba(96,165,250,0.1)] hover:border-[#60a5fa] hover:text-[#60a5fa] text-[#8b9dc3] border border-[rgba(139,157,195,0.2)] rounded font-['Inter'] text-sm transition-all"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <textarea
              ref={setContentTextarea}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Begin writing..."
              style={{ fontSize: '18px', lineHeight: '1.8' }}
              className="w-full min-h-[500px] px-8 py-6 focus:outline-none font-['Libre_Baskerville'] text-[#e8f0ff] resize-none placeholder:text-[#8b9dc3] bg-transparent"
            />
          </div>

          {/* Stats: Word Count, Character Count, Reading Time */}
          <div className="mt-4 flex items-center justify-between relative z-10">
            <p className="font-['Inter'] text-sm text-[#8b9dc3]">
              {wordCount} words · {charCount} characters · {readingTime} min read
            </p>
            <p className="font-['Courier_New'] text-xs text-[#8b9dc3]">
              Cmd+S to save | Cmd+B bold | Cmd+I italic
            </p>
          </div>
        </div>
      </div>

      {/* Focus Mode Overlay */}
      {focusMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8" style={{ 
          background: 'radial-gradient(ellipse at center, rgba(15, 23, 41, 0.95) 0%, rgba(10, 14, 26, 0.98) 100%)',
          backdropFilter: 'blur(20px)'
        }}>
          {/* Subtle vignette effect */}
          <div className="absolute inset-0 pointer-events-none" style={
            {
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)'
            }
          }/>

          {/* Minimal starfield in focus mode */}
          <div className="fixed inset-0 pointer-events-none opacity-30">
            <div className="stars-layer"></div>
          </div>

          {/* Exit Focus Button */}
          <button
            onClick={() => setFocusMode(false)}
            className="absolute top-8 right-8 px-4 py-2 glass-card border border-[rgba(139,157,195,0.3)] text-[#c8cad8] hover:bg-[rgba(96,165,250,0.1)] hover:border-[#60a5fa] hover:text-[#60a5fa] transition-all font-['Inter'] text-sm font-semibold rounded-lg flex items-center gap-2 z-10"
          >
            <Minimize2 className="w-4 h-4" />
            Exit Focus
          </button>

          {/* Autosave indicator */}
          {saving && (
            <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 glass-card border border-[rgba(139,157,195,0.3)] rounded-lg z-10">
              <Check className="w-4 h-4 text-[#10b981]" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="font-['Inter'] text-sm text-[#10b981]">Autosaving...</span>
            </div>
          )}

          {/* Focus Mode Editor */}
          <div className="max-w-4xl w-full relative z-10">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title..."
              className="w-full mb-8 px-0 py-2 bg-transparent border-none focus:outline-none font-['Cardo'] text-5xl text-white placeholder:text-[#8b9dc3] placeholder:opacity-40"
              style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.3)' }}
            />
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write..."
              className="w-full min-h-[60vh] px-0 py-0 bg-transparent border-none focus:outline-none font-['Libre_Baskerville'] text-white placeholder:text-[#8b9dc3] placeholder:opacity-40 resize-none"
              style={{ fontSize: '18px', lineHeight: '1.8' }}
              autoFocus
            />
            <div className="mt-8 text-center">
              <p className="font-['Inter'] text-sm text-[#8b9dc3] opacity-60">
                {wordCount} words · {charCount} characters · {readingTime} min read
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Sprout, Leaf, Flower2, Eye, Users, Lock, Tag, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GardenMainNav } from '../components/GardenMainNav';
import { createWriting, updateWriting, getWriting } from '/src/services/gardenWritingService';
import { Writing } from '/src/types/garden';

interface WritingEditorPageProps {
  writingId?: string;
}

export function WritingEditorPage({ writingId }: WritingEditorPageProps) {
  const { user } = useAuth();
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

  // Redirect if not authenticated
  if (!user) {
    window.location.href = '/garden/signin?redirect=/garden/write';
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <Sprout className="w-12 h-12 text-[#8A9A7B] animate-pulse mx-auto mb-4" />
          <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <GardenMainNav />

      <div className="pt-24 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Save Status */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-['Cardo'] text-4xl text-[#2C1810] mb-2 italic">
                {writingId ? 'Edit Writing' : 'New Writing'}
              </h1>
              {lastSaved && (
                <p className="font-['Inter'] text-sm text-[#8B7355]">
                  Last saved {lastSaved.toLocaleTimeString()}
                </p>
              )}
              {saving && (
                <p className="font-['Inter'] text-sm text-[#8A9A7B] flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <a
                href="/my-garden"
                className="px-4 py-2 border-2 border-[#E0D8D0] text-[#8B7355] hover:bg-white transition-all font-['Inter'] text-sm font-semibold rounded-lg"
              >
                Cancel
              </a>
              <button
                onClick={handlePlant}
                disabled={saving || !formData.title || !formData.content}
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Cardo'] text-lg rounded-lg shadow-md"
              >
                <Save className="w-4 h-4" />
                Plant in Garden
              </button>
            </div>
          </div>

          {/* Editor Controls */}
          <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Type Selector */}
              <div>
                <label className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Inter'] text-sm text-[#2C1810] rounded-lg"
                >
                  <option value="essay">Essay</option>
                  <option value="poem">Poem</option>
                  <option value="fragment">Fragment</option>
                  <option value="marginalia">Marginalia</option>
                </select>
              </div>

              {/* Growth Stage Selector */}
              <div>
                <label className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                  Growth Stage
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, growth_stage: 'seed' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border-2 rounded-lg transition-all ${
                      formData.growth_stage === 'seed'
                        ? 'border-[#8B7355] bg-[#8B7355]/10'
                        : 'border-[#E0D8D0] hover:border-[#8B7355]'
                    }`}
                    title="Seed - Early idea or fragment"
                  >
                    <div className="w-2 h-2 bg-[#8B7355] rounded-full"></div>
                    <span className="text-xs font-['Inter'] font-semibold">Seed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, growth_stage: 'sprout' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border-2 rounded-lg transition-all ${
                      formData.growth_stage === 'sprout'
                        ? 'border-[#8A9A7B] bg-[#8A9A7B]/10'
                        : 'border-[#E0D8D0] hover:border-[#8A9A7B]'
                    }`}
                    title="Sprout - Work in progress"
                  >
                    <Leaf className="w-4 h-4 text-[#8A9A7B]" />
                    <span className="text-xs font-['Inter'] font-semibold">Sprout</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, growth_stage: 'bloom' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border-2 rounded-lg transition-all ${
                      formData.growth_stage === 'bloom'
                        ? 'border-[#E11D48] bg-[#E11D48]/10'
                        : 'border-[#E0D8D0] hover:border-[#E11D48]'
                    }`}
                    title="Bloom - Finished piece"
                  >
                    <Flower2 className="w-4 h-4 text-[#E11D48]" />
                    <span className="text-xs font-['Inter'] font-semibold">Bloom</span>
                  </button>
                </div>
              </div>

              {/* Visibility Selector */}
              <div>
                <label className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                  Visibility
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'private' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border-2 rounded-lg transition-all ${
                      formData.visibility === 'private'
                        ? 'border-[#8B7355] bg-[#8B7355]/10'
                        : 'border-[#E0D8D0] hover:border-[#8B7355]'
                    }`}
                    title="Private - Only you"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-xs font-['Inter'] font-semibold">Private</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'circles' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border-2 rounded-lg transition-all ${
                      formData.visibility === 'circles'
                        ? 'border-[#8A9A7B] bg-[#8A9A7B]/10'
                        : 'border-[#E0D8D0] hover:border-[#8A9A7B]'
                    }`}
                    title="Circles - Your circles only"
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-['Inter'] font-semibold">Circles</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'public' })}
                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 border-2 rounded-lg transition-all ${
                      formData.visibility === 'public'
                        ? 'border-[#E11D48] bg-[#E11D48]/10'
                        : 'border-[#E0D8D0] hover:border-[#E11D48]'
                    }`}
                    title="Public - Everyone can see"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-['Inter'] font-semibold">Public</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#8A9A7B]/10 border border-[#8A9A7B] text-[#8A9A7B] text-sm font-['Inter'] rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-[#E11D48]"
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
                  className="flex-1 px-3 py-2 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Inter'] text-sm text-[#2C1810] rounded-lg"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all font-['Inter'] text-sm font-semibold rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white border-2 border-[#E0D8D0] rounded-lg overflow-hidden">
            {/* Title */}
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title your writing..."
              className="w-full px-8 py-6 border-b-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Cardo'] text-4xl text-[#2C1810] placeholder:text-[#E0D8D0]"
            />

            {/* Content */}
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Begin writing..."
              className="w-full min-h-[500px] px-8 py-6 focus:outline-none font-['Libre_Baskerville'] text-lg text-[#2C1810] leading-loose resize-none placeholder:text-[#E0D8D0]"
            />
          </div>

          {/* Word Count */}
          <div className="mt-4 text-right">
            <p className="font-['Inter'] text-sm text-[#8B7355]">
              {formData.content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
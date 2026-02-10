import { useState, useEffect, useRef } from 'react';
import { 
  Bold, Italic, Heading1, Heading2, Quote, Link as LinkIcon, 
  List, ListOrdered, Image, Save, Eye, Settings, ChevronDown,
  ChevronUp, Tag, FileImage, X, Lock
} from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { saveDraft, submitToGallery, type Draft } from '../../services/backend';

const categories = [
  { name: 'Poetry', description: 'Verse, free form, or structured poetry' },
  { name: 'Essay', description: 'Personal essays and reflections' },
  { name: 'Fiction', description: 'Short stories and flash fiction' },
  { name: 'Memoir', description: 'Personal narratives and memories' },
  { name: 'Experimental', description: 'Innovative and hybrid forms' },
];

const suggestedTags = [
  'Love', 'Nature', 'Memory', 'Loss', 'Identity', 'Family', 
  'Place', 'Time', 'Solitude', 'Urban', 'Rural', 'Seasons'
];

export function WriterEditorPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPublishing, setShowPublishing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shareToCommunity, setShareToCommunity] = useState(true); // Default ON
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [currentDraftId] = useState(crypto.randomUUID());
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count and reading time
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // Average reading speed
  }, [content]);

  // Auto-save simulation
  useEffect(() => {
    if (content.length > 0 || title.length > 0) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setLastSaved(new Date());
        setIsSaving(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [content, title]);

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSaveDraft = async () => {
    const draft: Draft = {
      title,
      content,
      category: selectedCategory,
      tags,
      shareToCommunity,
    };
    await saveDraft(draft);
    setShowSuccessMessage('Draft saved successfully!');
    setTimeout(() => setShowSuccessMessage(null), 3000);
  };

  const handleSubmitToGallery = async () => {
    const draft: Draft = {
      title,
      content,
      category: selectedCategory,
      tags,
      shareToCommunity,
    };
    await submitToGallery(draft);
    setShowSuccessMessage('Submitted to The Gallery successfully!');
    setTimeout(() => setShowSuccessMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FEFCF8]">
      <GalleryNav />

      <div className="pt-32 pb-16 px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="w-8 h-8 text-[#8B7355]" />
            <h1 className="font-['Cormorant_Garamond'] italic text-6xl text-[#2C2C2C]">
              Your Private Writing Desk
            </h1>
          </div>
          <p className="text-[#717171] font-['Inter'] text-lg mb-4">
            A quiet, private room for your words
          </p>
          <div className="inline-block px-4 py-2 bg-[#C4918A]/10 border border-[#C4918A]/30 rounded">
            <p className="text-xs text-[#8B7355] font-['Inter'] flex items-center gap-2">
              <Lock className="w-3 h-3" />
              This is your private sanctuary. Drafts saved here are for your eyes only.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Editor Area */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-sm border border-[#E8E0D8] p-8 md:p-12">
              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled piece..."
                className="w-full mb-8 text-4xl font-['Cormorant_Garamond'] text-[#2C2C2C] placeholder:text-[#C4B5A0] bg-transparent border-none outline-none"
              />

              {/* Writing Area */}
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin writing..."
                className="w-full min-h-[500px] text-lg leading-[1.8] font-['Georgia'] text-[#2C2C2C] placeholder:text-[#C4B5A0] bg-transparent border-none outline-none resize-none"
                style={{ fontSize: '18px' }}
              />
            </div>

            {/* Bottom Bar */}
            <div className="mt-4 flex items-center justify-between text-sm text-[#717171] font-['Inter']">
              <div className="flex items-center gap-6">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
              
              <div className="flex items-center gap-2">
                {isSaving ? (
                  <span className="flex items-center gap-2 text-[#DC143C]">
                    <span className="w-2 h-2 bg-[#DC143C] rounded-full animate-pulse"></span>
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span className="text-[#717171]">
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full px-6 py-3 bg-[#2C2C2C] text-white hover:bg-[#1A1A1A] transition-colors font-['Inter'] text-sm flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>

            {/* Document Settings */}
            <div className="bg-white shadow-sm border border-[#E8E0D8]">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#FEFCF8] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-[#DC143C]" />
                  <span className="font-['Inter'] font-medium text-[#2C2C2C]">Document Settings</span>
                </div>
                {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSettings && (
                <div className="px-6 pb-6 space-y-4 border-t border-[#E8E0D8] pt-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#717171] mb-2 font-['Inter']">
                      Font Size
                    </label>
                    <select 
                      defaultValue="18px"
                      className="w-full px-3 py-2 border border-[#E8E0D8] bg-white text-[#2C2C2C] font-['Inter']"
                    >
                      <option value="16px">16px - Compact</option>
                      <option value="18px">18px - Standard</option>
                      <option value="20px">20px - Comfortable</option>
                      <option value="22px">22px - Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#717171] mb-2 font-['Inter']">
                      Line Height
                    </label>
                    <select 
                      defaultValue="1.8"
                      className="w-full px-3 py-2 border border-[#E8E0D8] bg-white text-[#2C2C2C] font-['Inter']"
                    >
                      <option value="1.5">1.5 - Tight</option>
                      <option value="1.8">1.8 - Standard</option>
                      <option value="2.0">2.0 - Spacious</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Publishing Options */}
            <div className="bg-white shadow-sm border border-[#E8E0D8]">
              <button
                onClick={() => setShowPublishing(!showPublishing)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#FEFCF8] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileImage className="w-5 h-5 text-[#DC143C]" />
                  <span className="font-['Inter'] font-medium text-[#2C2C2C]">Publishing</span>
                </div>
                {showPublishing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showPublishing && (
                <div className="px-6 pb-6 space-y-6 border-t border-[#E8E0D8] pt-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#717171] mb-3 font-['Inter']">
                      Category
                    </label>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <button
                          key={cat.name}
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`w-full p-4 border-2 text-left transition-all ${
                            selectedCategory === cat.name
                              ? 'border-[#DC143C] bg-[#DC143C]/5'
                              : 'border-[#E8E0D8] hover:border-[#C4B5A0]'
                          }`}
                        >
                          <div className="font-['Inter'] font-medium text-[#2C2C2C] mb-1">
                            {cat.name}
                          </div>
                          <div className="text-xs text-[#717171] font-['Inter']">
                            {cat.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#717171] mb-3 font-['Inter']">
                      Tags
                    </label>
                    
                    {/* Current Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-[#DC143C]/10 text-[#DC143C] text-sm font-['Inter']"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-[#A01030]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tag Input */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(tagInput);
                          }
                        }}
                        placeholder="Add a tag..."
                        className="flex-1 px-3 py-2 border border-[#E8E0D8] bg-white text-[#2C2C2C] font-['Inter'] text-sm"
                      />
                      <button
                        onClick={() => handleAddTag(tagInput)}
                        className="px-4 py-2 bg-[#2C2C2C] text-white hover:bg-[#1A1A1A] transition-colors font-['Inter'] text-sm"
                      >
                        Add
                      </button>
                    </div>

                    {/* Suggested Tags */}
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.filter(t => !tags.includes(t)).slice(0, 6).map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleAddTag(tag)}
                          className="px-2 py-1 border border-[#E8E0D8] text-[#717171] hover:border-[#DC143C] hover:text-[#DC143C] transition-colors text-xs font-['Inter']"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Share to Community */}
                  <div className="pt-2 pb-2 border-t border-[#E8E0D8]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Lock className={`w-4 h-4 ${shareToCommunity ? 'text-green-600' : 'text-[#717171]'}`} />
                        <span className="text-sm font-['Inter'] font-medium text-[#2C2C2C]">
                          Share to Community Wall
                        </span>
                      </div>
                      <button
                        onClick={() => setShareToCommunity(!shareToCommunity)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          shareToCommunity ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            shareToCommunity ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-[#717171] font-['Inter'] leading-relaxed">
                      Community members can see your work. Only published pieces appear in The Collection.
                    </p>
                  </div>

                  {/* Save Draft / Publish Buttons */}
                  <div className="space-y-2 pt-4">
                    <button
                      onClick={handleSubmitToGallery}
                      className="w-full px-6 py-3 bg-[#DC143C] text-white hover:bg-[#B01030] transition-colors font-['Inter'] text-sm font-medium"
                    >
                      Submit to The Gallery
                    </button>
                    <button
                      onClick={handleSaveDraft}
                      className="w-full px-6 py-3 border-2 border-[#E8E0D8] text-[#2C2C2C] hover:border-[#C4B5A0] transition-colors font-['Inter'] text-sm"
                    >
                      Save as Draft
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8">
            <div className="bg-[#FEFCF8] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-12 relative shadow-2xl">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-6 right-6 p-2 hover:bg-[#E8E0D8] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8 pb-8 border-b border-[#E8E0D8]">
                <h1 className="font-['Cormorant_Garamond'] text-5xl text-[#2C2C2C] mb-4">
                  {title || 'Untitled'}
                </h1>
                {selectedCategory && (
                  <span className="inline-block px-3 py-1 bg-[#DC143C]/10 text-[#DC143C] text-sm font-['Inter']">
                    {selectedCategory}
                  </span>
                )}
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="font-['Georgia'] text-lg leading-loose whitespace-pre-wrap text-[#2C2C2C]">
                  {content || 'Your content will appear here...'}
                </div>
              </div>

              {tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[#E8E0D8]">
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[#E8E0D8] text-[#2C2C2C] text-sm font-['Inter']">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed bottom-4 right-4 z-50 bg-[#DC143C] text-white px-4 py-2 rounded shadow-lg font-['Inter'] text-sm">
            {showSuccessMessage}
          </div>
        )}
      </div>
    </div>
  );
}
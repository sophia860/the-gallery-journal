import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Check, ChevronDown, Eye, EyeOff, Users, Clock, FileText } from 'lucide-react';

export function EditorPage() {
  const [title, setTitle] = useState('Untitled');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>(['Poetry']);
  const [category, setCategory] = useState('Poetry');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'circle'>('private');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // Auto-save simulation
  useEffect(() => {
    if (content || title !== 'Untitled') {
      setSaveStatus('unsaved');
      const timer = setTimeout(() => {
        setSaveStatus('saving');
        setTimeout(() => setSaveStatus('saved'), 500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, title]);

  // Calculate word count and reading time
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // 200 words per minute
  }, [content]);

  const handlePublish = () => {
    console.log('Publishing...', { title, content, tags, category, visibility });
    setShowPublishMenu(false);
  };

  const visibilityConfig = {
    public: { icon: Eye, label: 'Public', color: '#7A9E7E' },
    private: { icon: EyeOff, label: 'Private', color: '#9B9B9B' },
    circle: { icon: Users, label: 'Circle Only', color: '#D4B896' },
  };

  const VisibilityIcon = visibilityConfig[visibility].icon;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* TOP BAR */}
      <header className="bg-white border-b-2 border-[#E5E0DA] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => window.location.href = '/garden'}
            className="p-2 hover:bg-[#FAF8F5] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#6B6B6B]" />
          </button>

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-['Lora'] text-xl font-semibold text-[#2C2C2C] bg-transparent border-none focus:outline-none min-w-[300px]"
            placeholder="Untitled"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Save Status */}
          <div className="flex items-center gap-2">
            {saveStatus === 'saved' && (
              <>
                <Check className="w-4 h-4 text-[#7A9E7E]" />
                <span className="font-['Inter'] text-sm text-[#7A9E7E]">Saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <Save className="w-4 h-4 text-[#9B9B9B] animate-pulse" />
                <span className="font-['Inter'] text-sm text-[#9B9B9B]">Saving...</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <span className="font-['Inter'] text-sm text-[#9B9B9B]">Unsaved changes</span>
            )}
          </div>

          {/* Publish Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPublishMenu(!showPublishMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold text-sm rounded-lg"
            >
              Publish
              <ChevronDown className="w-4 h-4" />
            </button>

            {showPublishMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowPublishMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border-2 border-[#E5E0DA] rounded-lg shadow-lg z-30 p-4">
                  <p className="font-['Inter'] text-sm font-semibold text-[#2C2C2C] mb-3">
                    Publish Settings
                  </p>
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="font-['Inter'] text-xs text-[#9B9B9B] mb-2">Visibility</p>
                      <div className="flex flex-col gap-2">
                        {(['public', 'private', 'circle'] as const).map((vis) => {
                          const config = visibilityConfig[vis];
                          const Icon = config.icon;
                          return (
                            <button
                              key={vis}
                              onClick={() => setVisibility(vis)}
                              className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                                visibility === vis
                                  ? 'bg-[#F0F7F0] border-2 border-[#7A9E7E]'
                                  : 'bg-[#FAF8F5] border-2 border-transparent hover:border-[#E5E0DA]'
                              }`}
                            >
                              <Icon className="w-4 h-4" style={{ color: config.color }} />
                              <span className="font-['Inter'] text-sm text-[#2C2C2C]">
                                {config.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handlePublish}
                    className="w-full px-4 py-2 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold text-sm rounded-lg"
                  >
                    Publish Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN EDITOR AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Document Outline */}
        <aside className="w-64 bg-white border-r-2 border-[#E5E0DA] p-6 overflow-y-auto">
          <h3 className="font-['Inter'] text-sm font-semibold text-[#2C2C2C] uppercase tracking-wider mb-4">
            Outline
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm font-['Inter'] text-[#6B6B6B] hover:bg-[#FAF8F5] rounded-lg transition-colors">
              Introduction
            </button>
            <button className="w-full text-left px-3 py-2 text-sm font-['Inter'] text-[#6B6B6B] hover:bg-[#FAF8F5] rounded-lg transition-colors">
              Body
            </button>
            <button className="w-full text-left px-3 py-2 text-sm font-['Inter'] text-[#6B6B6B] hover:bg-[#FAF8F5] rounded-lg transition-colors">
              Conclusion
            </button>
          </div>

          <div className="mt-8">
            <h3 className="font-['Inter'] text-sm font-semibold text-[#2C2C2C] uppercase tracking-wider mb-4">
              Writing Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-xs text-[#9B9B9B]">Words</span>
                <span className="font-['Inter'] text-sm font-semibold text-[#2C2C2C]">{wordCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-xs text-[#9B9B9B]">Reading time</span>
                <span className="font-['Inter'] text-sm font-semibold text-[#2C2C2C]">{readingTime} min</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN EDITOR */}
        <main className="flex-1 overflow-y-auto px-8 py-12">
          <div className="max-w-[640px] mx-auto">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Begin writing..."
              className="w-full min-h-[600px] bg-transparent border-none focus:outline-none resize-none font-['Lora'] text-lg leading-[1.75] text-[#2C2C2C] placeholder:text-[#E5E0DA]"
              style={{ fontSize: '18px' }}
            />
          </div>
        </main>

        {/* RIGHT PANEL - Metadata */}
        <aside className="w-80 bg-white border-l-2 border-[#E5E0DA] p-6 overflow-y-auto">
          <h3 className="font-['Inter'] text-sm font-semibold text-[#2C2C2C] uppercase tracking-wider mb-4">
            Metadata
          </h3>

          {/* Tags */}
          <div className="mb-6">
            <label className="block font-['Inter'] text-xs font-medium text-[#6B6B6B] mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#F0F7F0] border-2 border-[#7A9E7E] text-[#7A9E7E] text-xs font-['Inter'] font-semibold rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    className="hover:text-[#C4795B]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a tag..."
              className="w-full px-3 py-2 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-sm text-[#2C2C2C] rounded-lg transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  setTags([...tags, e.currentTarget.value]);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block font-['Inter'] text-xs font-medium text-[#6B6B6B] mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-sm text-[#2C2C2C] rounded-lg transition-colors"
            >
              <option>Poetry</option>
              <option>Fiction</option>
              <option>Essay</option>
              <option>Memoir</option>
              <option>Flash</option>
              <option>Experimental</option>
            </select>
          </div>

          {/* Visibility Toggle */}
          <div className="mb-6">
            <label className="block font-['Inter'] text-xs font-medium text-[#6B6B6B] mb-2">
              Visibility
            </label>
            <div className="space-y-2">
              {(['public', 'private', 'circle'] as const).map((vis) => {
                const config = visibilityConfig[vis];
                const Icon = config.icon;
                return (
                  <button
                    key={vis}
                    onClick={() => setVisibility(vis)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      visibility === vis
                        ? 'bg-[#F0F7F0] border-2 border-[#7A9E7E]'
                        : 'bg-[#FAF8F5] border-2 border-transparent hover:border-[#E5E0DA]'
                    }`}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                    <div className="flex-1 text-left">
                      <p className="font-['Inter'] text-sm font-medium text-[#2C2C2C]">
                        {config.label}
                      </p>
                      <p className="font-['Inter'] text-xs text-[#9B9B9B]">
                        {vis === 'public' && 'Everyone can see this'}
                        {vis === 'private' && 'Only you can see this'}
                        {vis === 'circle' && 'Only your circles can see this'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Growth Stage */}
          <div>
            <label className="block font-['Inter'] text-xs font-medium text-[#6B6B6B] mb-2">
              Growth Stage
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center gap-2 p-3 bg-[#FBF7F0] border-2 border-[#D4B896] rounded-lg">
                <div className="w-3 h-3 bg-[#D4B896] rounded-full"></div>
                <span className="font-['Inter'] text-xs font-semibold text-[#9B7E4F]">Seed</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 bg-[#FAF8F5] border-2 border-[#E5E0DA] hover:border-[#A3C4A0] rounded-lg transition-colors">
                <svg className="w-5 h-5 text-[#A3C4A0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22v-8m0-4V2m0 8c-2.5-2-5-2-7 0m7 0c2.5-2 5-2 7 0" strokeLinecap="round"/>
                </svg>
                <span className="font-['Inter'] text-xs font-semibold text-[#5A7E58]">Sprout</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 bg-[#FAF8F5] border-2 border-[#E5E0DA] hover:border-[#C48B8B] rounded-lg transition-colors">
                <svg className="w-5 h-5 text-[#C48B8B]" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="2"/>
                  <path d="M12 2c-1.5 4-1.5 6 0 8 1.5-2 1.5-4 0-8z" opacity="0.5"/>
                </svg>
                <span className="font-['Inter'] text-xs font-semibold text-[#9E5A5A]">Bloom</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM BAR */}
      <footer className="bg-white border-t-2 border-[#E5E0DA] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Auto-save Indicator */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#9B9B9B]" />
            <span className="font-['Inter'] text-xs text-[#9B9B9B]">
              Auto-saved at {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Version History */}
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#FAF8F5] rounded-lg transition-colors">
            <FileText className="w-4 h-4 text-[#9B9B9B]" />
            <span className="font-['Inter'] text-xs text-[#9B9B9B]">Version history</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-['Inter'] text-xs text-[#9B9B9B]">
            {wordCount} words • {readingTime} min read
          </span>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { GardenNav } from '../components/GardenNav';
import { useAuth } from '../../contexts/AuthContext';
import { notesService, NoteState, NoteVisibility } from '../utils/notes';
import type { WorkType } from '../utils/notes';

export function WritePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const noteId = urlParams.get('id');
  
  const { user, loading, supabase } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('Untitled');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [state, setState] = useState<NoteState>('seed');
  const [tagInput, setTagInput] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [wordGoal, setWordGoal] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [workType, setWorkType] = useState<WorkType>('prose');
  // CRITICAL: Publishing choice - nothing public unless explicitly chosen
  const [visibility, setVisibility] = useState<NoteVisibility>('private');
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [pendingVisibility, setPendingVisibility] = useState<NoteVisibility | null>(null);
  // Connections for growth stages
  const [growsFrom, setGrowsFrom] = useState<string[]>([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [tendedByCount, setTendedByCount] = useState(0);
  // Replant context
  const [replantContext, setReplantContext] = useState<{
    fromWritingId: string;
    fromTitle: string;
    fromAuthor: string;
    fromAuthorId: string;
  } | null>(null);

  // GROWTH STAGE CONSTRAINTS - stages are functional, not cosmetic
  const getStageConstraints = (stage: NoteState) => {
    switch (stage) {
      case 'seed':
        return {
          maxChars: 500,
          canConnect: false,
          canBePublic: false,
          message: 'This seed is still germinating. Keep it small.',
          minHeight: '200px',
          maxHeight: '300px',
          bgOpacity: '0.4',
          borderColor: 'rgba(100, 110, 130, 0.3)',
          glowColor: 'rgba(100, 110, 130, 0.1)',
        };
      case 'sprout':
        return {
          maxChars: 2000,
          canConnect: true,
          canBePublic: false, // Sprouts can be shared with circles, not Gallery
          message: 'Your sprout is reaching toward other ideas.',
          minHeight: '400px',
          maxHeight: '600px',
          bgOpacity: '0.6',
          borderColor: 'rgba(122, 155, 118, 0.3)',
          glowColor: 'rgba(122, 155, 118, 0.15)',
        };
      case 'bloom':
        return {
          maxChars: null, // No limit
          canConnect: true,
          canBePublic: true,
          message: 'This piece has bloomed. It may be ready for the gallery.',
          minHeight: '500px',
          maxHeight: 'none',
          bgOpacity: '0.8',
          borderColor: 'rgba(196, 164, 108, 0.4)',
          glowColor: 'rgba(196, 164, 108, 0.2)',
        };
    }
  };

  const constraints = getStageConstraints(state);

  // Check if can advance to next stage
  const canAdvanceToSprout = state === 'seed' && charCount > 0;
  const canAdvanceToBloom = state === 'sprout' && connectionCount >= 3 && tendedByCount >= 1;

  useEffect(() => {
    // FIX #5: Only redirect after loading completes AND user is confirmed null
    if (!loading && !user) {
      console.log('[WritePage] No authenticated user, redirecting to login');
      window.location.href = '/garden/login';
      return;
    }

    const storedPrompt = localStorage.getItem('gardenActivePrompt');
    if (storedPrompt) {
      setPromptText(storedPrompt);
      localStorage.removeItem('gardenActivePrompt');
    }

    // Check for replant context
    const storedReplant = localStorage.getItem('replant_context');
    if (storedReplant && !noteId) {
      const context = JSON.parse(storedReplant);
      setReplantContext(context);
      localStorage.removeItem('replant_context');
    }
  }, [user, loading]);

  // Load existing note if noteId is provided
  useEffect(() => {
    if (!user) return;

    if (noteId) {
      const loadNote = async () => {
        try {
          const { data: writing } = await supabase
            .from('writings')
            .select('*')
            .eq('id', noteId)
            .eq('user_id', user.id)
            .single();

          if (writing) {
            setTitle(writing.title);
            setContent(writing.content);
            setTags(writing.tags || []);
            setState(writing.growth_stage);
            setWordCount(writing.word_count || 0);
            setVisibility(writing.visibility);
            if (contentRef.current) {
              contentRef.current.innerHTML = writing.content;
            }
          }
        } catch (error) {
          console.error('Error loading note:', error);
        }
      };

      loadNote();
    }
  }, [noteId, user, supabase]);

  // Update word and character counts
  useEffect(() => {
    const count = notesService.calculateWordCount(content);
    setWordCount(count);
    setCharCount(content.length);
  }, [content]);

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] relative flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-2 border-[#7a9b76] border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="font-['Cormorant_Garamond'] text-[16px] text-[#8b9dc3]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Don't render editor if no user (redirect will happen)
  if (!user) {
    return null;
  }

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const wordCount = notesService.calculateWordCount(content);

      if (noteId) {
        await supabase
          .from('writings')
          .update({
            title,
            content,
            tags,
            growth_stage: state,
            word_count: wordCount,
            updated_at: new Date().toISOString(),
            visibility: pendingVisibility || visibility,
          })
          .eq('id', noteId)
          .eq('user_id', user.id);
      } else {
        const { data } = await supabase
          .from('writings')
          .insert({
            user_id: user.id,
            title,
            content,
            tags,
            growth_stage: state,
            word_count: wordCount,
            visibility: pendingVisibility || visibility,
          })
          .select()
          .single();

        window.history.replaceState(null, '', `/garden/write?id=${data?.id}`);
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving:', error);
    }

    setIsSaving(false);
    setPendingVisibility(null);
    setShowVisibilityModal(false);
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      const newCharCount = newContent.length;
      
      // ENFORCE CHARACTER LIMITS - prevent typing over limit
      if (constraints.maxChars && newCharCount > constraints.maxChars) {
        // Restore previous content
        contentRef.current.innerHTML = content;
        // Move cursor to end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(contentRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
        return;
      }
      
      setContent(newContent);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleExportCopy = () => {
    const plainText = contentRef.current?.innerText || '';
    navigator.clipboard.writeText(plainText);
    alert('Copied to clipboard!');
    setShowExportMenu(false);
  };

  const handleExportTxt = () => {
    const plainText = contentRef.current?.innerText || '';
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'untitled'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportMd = () => {
    let markdown = `# ${title}\n\n`;
    markdown += contentRef.current?.innerText || '';
    markdown += `\n\n---\n\nTags: ${tags.join(', ')}`;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'untitled'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const goalProgress = wordGoal > 0 ? Math.min((wordCount / wordGoal) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="stars-layer"></div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 20% 30%, rgba(122, 155, 118, 0.3), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(122, 155, 118, 0.2), transparent);
          background-size: 200% 200%;
          background-repeat: repeat;
        }

        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: rgba(232, 221, 208, 0.3);
          cursor: text;
        }

        [contentEditable] b, [contentEditable] strong {
          font-weight: bold;
        }

        [contentEditable] i, [contentEditable] em {
          font-style: italic;
        }

        [contentEditable] h1, [contentEditable] h2, [contentEditable] h3 {
          font-weight: bold;
          margin: 1em 0 0.5em;
        }

        [contentEditable] h1 { font-size: 2em; }
        [contentEditable] h2 { font-size: 1.5em; }
        [contentEditable] h3 { font-size: 1.25em; }

        [contentEditable] blockquote {
          border-left: 3px solid #7a9b76;
          padding-left: 1em;
          margin: 1em 0;
          opacity: 0.8;
        }

        [contentEditable] ul, [contentEditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        [contentEditable] hr {
          border: none;
          border-top: 1px solid rgba(122, 155, 118, 0.3);
          margin: 2em 0;
        }

        .toolbar-btn {
          padding: 0.5rem;
          color: #8b9dc3;
          border-radius: 0.25rem;
          transition: all 0.2s;
          cursor: pointer;
        }
        .toolbar-btn:hover {
          background: rgba(122, 155, 118, 0.1);
          color: #7a9b76;
        }
      `}</style>

      <GardenNav />
      
      <div className="relative z-10 pt-24 px-8 pb-16">
        <div className="max-w-[750px] mx-auto">
          {/* Prompt (if from prompts page) */}
          {promptText && (
            <div className="mb-8 p-6 bg-[rgba(122,155,118,0.1)] border border-[rgba(122,155,118,0.3)] rounded">
              <p className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.2em] text-[#7a9b76] mb-2">
                Writing from prompt:
              </p>
              <p className="font-['Cormorant_Garamond'] text-[16px] text-[#e8ddd0]" style={{ lineHeight: '1.6' }}>
                {promptText}
              </p>
            </div>
          )}

          {/* Replant Context (if replanting another writer's work) */}
          {replantContext && (
            <div className="mb-8 p-6 bg-[rgba(139,157,195,0.1)] border border-[rgba(139,157,195,0.3)] rounded">
              <div className="flex items-center gap-2 mb-3">
                <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="#8b9dc3" strokeWidth="2" fill="none">
                  <path d="M12 20 L12 8 M8 12 L12 8 L16 12" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="4" r="2" fill="#8b9dc3"/>
                </svg>
                <p className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.2em] text-[#8b9dc3]">
                  Replanted from:
                </p>
              </div>
              <p className="font-['Cormorant_Garamond'] text-[16px] text-[#e8ddd0]" style={{ lineHeight: '1.6' }}>
                <span className="italic">{replantContext.fromTitle}</span> by {replantContext.fromAuthor}
              </p>
              <p className="mt-2 font-['Cormorant_Garamond'] text-[13px] text-[#8b9dc3]/70 italic">
                Plant something new from this.
              </p>
            </div>
          )}

          {/* Top bar */}
          <div className="flex items-center justify-between mb-8 text-[#8b9dc3] text-sm">
            <div className="font-['Cormorant_Garamond']">
              {isSaving ? 'Saving...' : ''}
            </div>
            <div className="font-['Cormorant_Garamond']">{wordCount} words</div>
          </div>

          {/* Word Goal */}
          {wordGoal > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 text-sm font-['Cormorant_Garamond'] text-[#8b9dc3]">
                <span>Word goal: {wordCount} / {wordGoal}</span>
                <span>{goalProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-[rgba(15,21,37,0.6)] rounded-full overflow-hidden border border-[rgba(122,155,118,0.2)]">
                <div 
                  className="h-full bg-gradient-to-r from-[#7a9b76] to-[#8fb587] transition-all duration-300"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none text-[#f5f0e8] font-['Playfair_Display'] italic mb-6 focus:outline-none placeholder:text-[#e8ddd0]/30"
            style={{ fontSize: '42px', lineHeight: '1.2' }}
            placeholder="Untitled"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[rgba(122,155,118,0.2)]">
            <button onClick={() => applyFormat('bold')} className="toolbar-btn" title="Bold">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('italic')} className="toolbar-btn" title="Italic">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="19" y1="4" x2="10" y2="4"/>
                <line x1="14" y1="20" x2="5" y2="20"/>
                <line x1="15" y1="4" x2="9" y2="20"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('formatBlock', 'h2')} className="toolbar-btn" title="Heading">
              <span className="font-bold">H</span>
            </button>
            <button onClick={() => applyFormat('formatBlock', 'blockquote')} className="toolbar-btn" title="Quote">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('insertUnorderedList')} className="toolbar-btn" title="Bullet List">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="9" y1="6" x2="20" y2="6"/>
                <line x1="9" y1="12" x2="20" y2="12"/>
                <line x1="9" y1="18" x2="20" y2="18"/>
                <circle cx="5" cy="6" r="1" fill="currentColor"/>
                <circle cx="5" cy="12" r="1" fill="currentColor"/>
                <circle cx="5" cy="18" r="1" fill="currentColor"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('insertOrderedList')} className="toolbar-btn" title="Numbered List">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="10" y1="6" x2="21" y2="6"/>
                <line x1="10" y1="12" x2="21" y2="12"/>
                <line x1="10" y1="18" x2="21" y2="18"/>
                <path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('insertHorizontalRule')} className="toolbar-btn" title="Divider">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
              </svg>
            </button>
          </div>

          {/* Editor */}
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            className="w-full min-h-[500px] bg-transparent text-[#e8ddd0] font-['Cormorant_Garamond'] focus:outline-none mb-8"
            style={{ fontSize: '19px', lineHeight: '1.8' }}
            data-placeholder="Begin writing..."
          />

          {/* Tags */}
          <div className="mb-6">
            <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(122,155,118,0.15)] border border-[rgba(122,155,118,0.3)] rounded-full text-[#7a9b76] text-sm font-['Cormorant_Garamond']"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="cursor-pointer hover:text-[#8fb587]">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded px-4 py-2 text-[#e8ddd0] text-sm focus:border-[#7a9b76] focus:outline-none transition-colors font-['Cormorant_Garamond']"
                placeholder="Add a tag..."
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] rounded text-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] transition-all cursor-pointer text-sm font-['Cormorant_Garamond'] uppercase tracking-[0.15em]"
              >
                Add
              </button>
            </div>
          </div>

          {/* Work Type */}
          <div className="mb-6">
            <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
              Work Type
            </label>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value as WorkType)}
              className="w-full bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded px-4 py-3 text-[#e8ddd0] focus:border-[#7a9b76] focus:outline-none transition-colors font-['Cormorant_Garamond'] cursor-pointer"
            >
              <option value="poetry">Poetry</option>
              <option value="prose">Prose</option>
              <option value="fiction">Fiction</option>
              <option value="essay">Essay</option>
              <option value="fragment">Fragment</option>
              <option value="personal">Personal</option>
              <option value="experimental">Experimental</option>
            </select>
          </div>

          {/* CRITICAL: Visibility Control - Publishing Choice */}
          <div className="mb-6 pb-6 border-b border-[rgba(122,155,118,0.1)]">
            <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
              Who can see this?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (visibility === 'garden' && 'private' !== visibility) {
                    setPendingVisibility('private');
                  } else {
                    setVisibility('private');
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded border transition-all cursor-pointer ${
                  visibility === 'private'
                    ? 'bg-[rgba(139,157,195,0.15)] border-[rgba(139,157,195,0.4)] text-[#8b9dc3]'
                    : 'border-[rgba(139,157,195,0.2)] text-[#8b9dc3]/60 hover:border-[rgba(139,157,195,0.3)]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-['Cormorant_Garamond'] text-sm">Private</span>
              </button>
              <button
                onClick={() => {
                  if (visibility === 'private') {
                    setPendingVisibility('garden');
                    setShowVisibilityModal(true);
                  } else {
                    setVisibility('garden');
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded border transition-all cursor-pointer ${
                  visibility === 'garden'
                    ? 'bg-[rgba(122,155,118,0.15)] border-[rgba(122,155,118,0.4)] text-[#7a9b76]'
                    : 'border-[rgba(122,155,118,0.2)] text-[#7a9b76]/60 hover:border-[rgba(122,155,118,0.3)]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-['Cormorant_Garamond'] text-sm">Garden</span>
              </button>
              <button
                onClick={() => setVisibility('circle')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded border transition-all cursor-pointer ${
                  visibility === 'circle'
                    ? 'bg-[rgba(196,164,108,0.15)] border-[rgba(196,164,108,0.4)] text-[#c4a46c]'
                    : 'border-[rgba(196,164,108,0.2)] text-[#c4a46c]/60 hover:border-[rgba(196,164,108,0.3)]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-['Cormorant_Garamond'] text-sm">Circle Only</span>
              </button>
            </div>
            {visibility === 'garden' && (
              <p className="mt-3 text-xs text-[#7a9b76]/70 font-['Cormorant_Garamond'] italic">
                This piece will appear on the Explore page.
              </p>
            )}
            {visibility === 'circle' && (
              <p className="mt-3 text-xs text-[#c4a46c]/70 font-['Cormorant_Garamond'] italic">
                Choose which circle(s) can see this.
              </p>
            )}
            {visibility === 'private' && (
              <p className="mt-3 text-xs text-[#8b9dc3]/70 font-['Cormorant_Garamond'] italic">
                Only you can see this. Not visible to editors or other writers.
              </p>
            )}
          </div>

          {/* Visibility Confirmation Modal */}
          {showVisibilityModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-[rgba(15,21,37,0.95)] border border-[rgba(122,155,118,0.3)] rounded-lg p-8 max-w-md mx-4 shadow-2xl">
                <h3 className="font-['Playfair_Display'] italic text-2xl text-[#f5f0e8] mb-4">
                  Plant in the Garden?
                </h3>
                <p className="font-['Cormorant_Garamond'] text-[16px] text-[#e8ddd0] mb-6" style={{ lineHeight: '1.7' }}>
                  Your writing will be visible to other writers and editors on the Explore page. You can make it private again anytime.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setVisibility(pendingVisibility || 'garden');
                      setPendingVisibility(null);
                      setShowVisibilityModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] text-[#7a9b76] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
                  >
                    Plant in Garden
                  </button>
                  <button
                    onClick={() => {
                      setPendingVisibility(null);
                      setShowVisibilityModal(false);
                    }}
                    className="flex-1 px-6 py-3 border border-[rgba(139,157,195,0.2)] hover:border-[#8b9dc3] text-[#8b9dc3] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
                  >
                    Keep Private
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* State & Word Goal */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
                Growth Stage
              </label>
            </div>
            <div>
              <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
                Character Count
              </label>
              {/* CHARACTER COUNTER - Visual constraint */}
              <div className="p-4 border border-[rgba(122,155,118,0.2)] rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Cormorant_Garamond'] text-2xl text-[#e8ddd0]">
                    {charCount}
                  </span>
                  {constraints.maxChars && (
                    <span className="font-['Cormorant_Garamond'] text-sm text-[#8b9dc3]/60">
                      / {constraints.maxChars}
                    </span>
                  )}
                </div>
                {constraints.maxChars && (
                  <div className="w-full h-2 bg-[rgba(15,21,37,0.6)] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        charCount > constraints.maxChars
                          ? 'bg-red-500'
                          : charCount > constraints.maxChars * 0.8
                          ? 'bg-yellow-500'
                          : 'bg-[#7a9b76]'
                      }`}
                      style={{ width: `${Math.min((charCount / constraints.maxChars) * 100, 100)}%` }}
                    />
                  </div>
                )}
                {constraints.maxChars && charCount > constraints.maxChars && (
                  <p className="mt-2 text-xs text-red-400 font-['Cormorant_Garamond']">
                    Over limit by {charCount - constraints.maxChars} characters
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] disabled:opacity-50 text-[#7a9b76] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-8 py-3 border border-[rgba(196,164,108,0.2)] hover:border-[#c4a46c] text-[#e8ddd0] hover:text-[#f5f0e8] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
              >
                Export
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-[rgba(15,21,37,0.95)] border border-[rgba(122,155,118,0.3)] rounded backdrop-blur-md shadow-lg">
                  <button
                    onClick={handleExportCopy}
                    className="w-full text-left px-4 py-3 text-[#e8ddd0] hover:bg-[rgba(122,155,118,0.1)] transition-colors cursor-pointer font-['Cormorant_Garamond'] text-[14px]"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={handleExportTxt}
                    className="w-full text-left px-4 py-3 text-[#e8ddd0] hover:bg-[rgba(122,155,118,0.1)] transition-colors cursor-pointer font-['Cormorant_Garamond'] text-[14px]"
                  >
                    Download as .txt
                  </button>
                  <button
                    onClick={handleExportMd}
                    className="w-full text-left px-4 py-3 text-[#e8ddd0] hover:bg-[rgba(122,155,118,0.1)] transition-colors cursor-pointer font-['Cormorant_Garamond'] text-[14px]"
                  >
                    Download as .md
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => window.location.href = '/garden/dashboard'}
              className="px-8 py-3 border border-[rgba(139,157,195,0.2)] hover:border-[#8b9dc3] text-[#8b9dc3] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
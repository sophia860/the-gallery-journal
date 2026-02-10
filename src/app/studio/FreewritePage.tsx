import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { ArrowLeft, Send, Save, Check, Type, AlignLeft, Lock, Unlock, Tag, StickyNote, Sprout, Flower2, Sparkles, Users } from 'lucide-react';

export function FreewritePage() {
  const { user, accessToken } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<'poetry' | 'prose' | 'fiction' | 'nonfiction'>('prose');
  const [draftState, setDraftState] = useState<'seed' | 'sprout' | 'bloom'>('seed');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [notes, setNotes] = useState(''); // Private notes to self
  const [sharing, setSharing] = useState<'private' | 'circle' | 'public'>('private');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittingToFeed, setSubmittingToFeed] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [feedMessage, setFeedMessage] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [revisitCount, setRevisitCount] = useState(0); // Track how many times you've returned to this
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isWriting, setIsWriting] = useState(false);

  // Check if user is a member (has paid membership)
  const userMembership = user?.user_metadata?.membership || 'community';
  const isMember = ['member', 'patron'].includes(userMembership);

  // Track writing time
  useEffect(() => {
    let interval: number;
    if (isWriting) {
      interval = window.setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWriting]);

  // Auto-start timer when user starts typing
  useEffect(() => {
    if (content.length > 0 && !isWriting) {
      setIsWriting(true);
    }
  }, [content]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveDraft = async () => {
    if (!user || !accessToken || !content.trim()) return;

    setSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/drafts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: title || 'Untitled Draft',
            content,
            type: genre,
            toolType: 'freewrite',
            metadata: {
              timeElapsed,
              wordCount,
              draftState,
              tags,
              notes,
              sharing,
              revisitCount,
            },
          }),
        }
      );

      if (response.ok) {
        setSaveMessage('Draft saved to My Work');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveMessage('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitToEditors = async () => {
    if (!user || !accessToken || !content.trim() || !title.trim()) {
      setSubmitMessage('Please add a title and content before submitting');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }

    if (!confirm('Submit this piece to our editorial team for review?')) {
      return;
    }

    setSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/submissions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title,
            content,
            genre,
            submittedAt: new Date().toISOString(),
            metadata: {
              timeElapsed,
              wordCount,
              submittedFrom: 'freewrite-tool',
            },
          }),
        }
      );

      if (response.ok) {
        setSubmitMessage('✓ Submitted to editorial team! You\'ll hear back within 90 days.');
        // Clear form after successful submission
        setTimeout(() => {
          setTitle('');
          setContent('');
          setTimeElapsed(0);
          setIsWriting(false);
          setSubmitMessage('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setSubmitMessage(errorData.error || 'Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting to editors:', error);
      setSubmitMessage('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitToFeed = async () => {
    if (!user || !accessToken || !content.trim() || !title.trim()) {
      setFeedMessage('Please add a title and content before submitting');
      setTimeout(() => setFeedMessage(''), 3000);
      return;
    }

    if (!confirm('Submit this piece to our feed for review?')) {
      return;
    }

    setSubmittingToFeed(true);
    setFeedMessage('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/feed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title,
            content,
            genre,
            submittedAt: new Date().toISOString(),
            metadata: {
              timeElapsed,
              wordCount,
              submittedFrom: 'freewrite-tool',
            },
          }),
        }
      );

      if (response.ok) {
        setFeedMessage('✓ Submitted to feed! You\'ll hear back within 90 days.');
        // Clear form after successful submission
        setTimeout(() => {
          setTitle('');
          setContent('');
          setTimeElapsed(0);
          setIsWriting(false);
          setFeedMessage('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setFeedMessage(errorData.error || 'Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting to feed:', error);
      setFeedMessage('Failed to submit. Please try again.');
    } finally {
      setSubmittingToFeed(false);
    }
  };

  if (!user) {
    window.location.href = '/signin';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F5F0EB] to-[#EFE8E0]">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
        {/* Header with garden branding */}
        <div className="mb-16">
          <a 
            href="/studio"
            className="group inline-flex items-center gap-2 text-[#8B7355] hover:text-[#8A9A7B] transition-all duration-200 mb-8 font-[family-name:var(--font-ui)] text-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="relative">
              Back to Garden
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#8A9A7B] transition-all duration-200 group-hover:w-full"></span>
            </span>
          </a>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 mb-2 px-4 py-2 bg-[#8A9A7B]/10 rounded-full border border-[#8A9A7B]/30">
              <Sprout className="w-5 h-5 text-[#8A9A7B]" />
              <span className="font-['Courier_New'] text-xs text-[#8A9A7B] uppercase tracking-widest">Plant & Grow</span>
            </div>
            <h1 className="font-['Cardo'] text-5xl md:text-7xl text-[#2C1810] italic leading-[1.1] tracking-tight">
              Your Writing Garden
            </h1>
            <p className="font-['Libre_Baskerville'] text-lg md:text-xl text-[#8B7355] leading-relaxed max-w-2xl">
              Plant ideas as seeds, watch them grow through revisions, let finished pieces bloom—then share with our editorial team
            </p>
          </div>
        </div>

        {/* Stats Bar with refined design */}
        <div className="mb-8 p-6 md:p-8 bg-white/80 backdrop-blur-sm border-2 border-[#E0D8D0] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex gap-8 md:gap-12">
            <div className="group">
              <div className="font-['Courier_New'] text-xs text-[#8B7355] mb-2 uppercase tracking-wider">Time</div>
              <div className="font-['Libre_Baskerville'] text-3xl md:text-4xl text-[#2C1810] tabular-nums">{formatTime(timeElapsed)}</div>
            </div>
            <div className="group">
              <div className="font-['Courier_New'] text-xs text-[#8B7355] mb-2 uppercase tracking-wider">Words</div>
              <div className="font-['Libre_Baskerville'] text-3xl md:text-4xl text-[#2C1810] tabular-nums">{wordCount}</div>
            </div>
          </div>

          {/* Enhanced Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            disabled={saving || !content.trim()}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-[#E0D8D0] text-[#2C1810] hover:border-[#C4A265] hover:text-[#C4A265] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none font-['Cardo'] text-base tracking-wide rounded-xl active:scale-95"
          >
            <Save className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>
        </div>

        {/* Messages with elegant animations */}
        {saveMessage && (
          <div className="mb-6 p-5 bg-[#C4A265]/10 border-l-4 border-[#C4A265] rounded-r-xl font-['Courier_New'] text-sm text-[#2C1810] animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3">
            <Check className="w-5 h-5 text-[#C4A265] flex-shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {submitMessage && (
          <div className={`mb-6 p-5 border-l-4 rounded-r-xl font-['Courier_New'] text-sm animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3 ${
            submitMessage.includes('✓') 
              ? 'bg-[#8A9A7B]/10 border-[#8A9A7B] text-[#2C1810]' 
              : 'bg-[#E11D48]/10 border-[#E11D48] text-[#2C1810]'
          }`}>
            {submitMessage.includes('✓') ? (
              <Check className="w-5 h-5 text-[#8A9A7B] flex-shrink-0" />
            ) : (
              <span className="w-5 h-5 text-[#E11D48] flex-shrink-0 text-lg">!</span>
            )}
            <span>{submitMessage}</span>
          </div>
        )}

        {feedMessage && (
          <div className={`mb-6 p-5 border-l-4 rounded-r-xl font-['Courier_New'] text-sm animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3 ${
            feedMessage.includes('✓') 
              ? 'bg-[#8A9A7B]/10 border-[#8A9A7B] text-[#2C1810]' 
              : 'bg-[#E11D48]/10 border-[#E11D48] text-[#2C1810]'
          }`}>
            {feedMessage.includes('✓') ? (
              <Check className="w-5 h-5 text-[#8A9A7B] flex-shrink-0" />
            ) : (
              <span className="w-5 h-5 text-[#E11D48] flex-shrink-0 text-lg">!</span>
            )}
            <span>{feedMessage}</span>
          </div>
        )}

        {/* Writing Form */}
        <div className="bg-white border-2 border-[#E0D8D0] rounded-2xl p-8 md:p-12 shadow-lg">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-0 py-4 mb-6 border-0 border-b-2 border-[#E0D8D0] bg-transparent font-['Cardo'] text-4xl focus:border-[#E11D48] focus:outline-none placeholder:text-[#E0D8D0] text-[#2C1810]"
          />

          {/* Genre Selection */}
          <div className="mb-8">
            <label className="block font-['Courier_New'] text-xs text-[#8B7355] mb-3 uppercase tracking-wider">
              Genre
            </label>
            <div className="flex gap-3 flex-wrap">
              {(['poetry', 'prose', 'fiction', 'nonfiction'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`px-6 py-2 border-2 font-['Cardo'] text-sm transition-all rounded-full ${
                    genre === g
                      ? 'border-[#E11D48] bg-[#E11D48] text-white'
                      : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#E11D48] hover:text-[#E11D48]'
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Garden Metadata - Simplified and Clear */}
          <div className="mb-8 p-8 bg-gradient-to-br from-[#F5F0EB] to-[#FAF7F2] border-2 border-[#8A9A7B]/30 rounded-xl">
            <div className="flex items-start gap-3 mb-6">
              <Sprout className="w-6 h-6 text-[#8A9A7B] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-['Cardo'] text-2xl text-[#2C1810] mb-2">
                  Optional: Organize Your Work
                </h4>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                  These tools help you track ideas over time. They're completely optional — skip them if you just want to write and submit.
                </p>
              </div>
            </div>

            {/* Draft State */}
            <div className="mb-8 pb-8 border-b border-[#E0D8D0]">
              <label className="block font-['Cardo'] text-lg text-[#2C1810] mb-2">
                Growth State <span className="text-[#8B7355] font-[family-name:var(--font-ui)] text-sm font-normal">(optional)</span>
              </label>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-4">
                Mark where this piece is in your process. This helps you track which drafts need more work.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setDraftState('seed')}
                  className={`flex items-center gap-2 px-5 py-3 border-2 font-['Cardo'] text-sm transition-all rounded-lg ${
                    draftState === 'seed'
                      ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                      : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Seed <span className="text-xs opacity-75">— Early idea</span></span>
                </button>
                <button
                  onClick={() => setDraftState('sprout')}
                  className={`flex items-center gap-2 px-5 py-3 border-2 font-['Cardo'] text-sm transition-all rounded-lg ${
                    draftState === 'sprout'
                      ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                      : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                  }`}
                >
                  <Sprout className="w-4 h-4" />
                  <span>Sprout <span className="text-xs opacity-75">— Developing</span></span>
                </button>
                <button
                  onClick={() => setDraftState('bloom')}
                  className={`flex items-center gap-2 px-5 py-3 border-2 font-['Cardo'] text-sm transition-all rounded-lg ${
                    draftState === 'bloom'
                      ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                      : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                  }`}
                >
                  <Flower2 className="w-4 h-4" />
                  <span>Bloom <span className="text-xs opacity-75">— Ready</span></span>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8 pb-8 border-b border-[#E0D8D0]">
              <label className="block font-['Cardo'] text-lg text-[#2C1810] mb-2">
                Tags <span className="text-[#8B7355] font-[family-name:var(--font-ui)] text-sm font-normal">(optional)</span>
              </label>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-4">
                Add themes like "grief" or "childhood" to connect pieces. Later, you can see all pieces with the same tag in your Garden.
              </p>
              <div className="flex gap-2 mb-3 flex-wrap">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8A9A7B]/20 text-[#2C1810] rounded-full font-['Courier_New'] text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                      className="hover:text-[#E11D48] transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && currentTag.trim()) {
                      e.preventDefault();
                      setTags([...tags, currentTag.trim()]);
                      setCurrentTag('');
                    }
                  }}
                  placeholder="Type a tag and press Enter..."
                  className="flex-1 px-4 py-2 border-2 border-[#E0D8D0] rounded-lg font-['Courier_New'] text-sm focus:border-[#8A9A7B] focus:outline-none"
                />
              </div>
            </div>

            {/* Sharing Level */}
            <div>
              <label className="block font-['Cardo'] text-lg text-[#2C1810] mb-2">
                Who Can See This Draft <span className="text-[#8B7355] font-[family-name:var(--font-ui)] text-sm font-normal">(optional)</span>
              </label>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-4">
                Control visibility. Everything is private by default.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setSharing('private')}
                  className={`flex items-center gap-2 px-5 py-3 border-2 font-['Cardo'] text-sm transition-all rounded-lg ${
                    sharing === 'private'
                      ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                      : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Private <span className="text-xs opacity-75">— Just me</span></span>
                </button>
                <button
                  onClick={() => setSharing('circle')}
                  className={`flex items-center gap-2 px-5 py-3 border-2 font-['Cardo'] text-sm transition-all rounded-lg ${
                    sharing === 'circle'
                      ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                      : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Circle <span className="text-xs opacity-75">— Close friends</span></span>
                </button>
                <button
                  onClick={() => setSharing('public')}
                  className={`flex items-center gap-2 px-5 py-3 border-2 font-['Cardo'] text-sm transition-all rounded-lg ${
                    sharing === 'public'
                      ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                      : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                  }`}
                >
                  <Unlock className="w-4 h-4" />
                  <span>Public <span className="text-xs opacity-75">— Everyone</span></span>
                </button>
              </div>
            </div>
          </div>

          {/* Writing Area */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your piece..."
            className="w-full min-h-[500px] px-0 py-4 border-0 bg-transparent resize-none focus:outline-none font-['Libre_Baskerville'] text-lg leading-loose text-[#2C1810] placeholder:text-[#E0D8D0]"
            style={{
              lineHeight: '2',
            }}
          />

          {/* Private Notes to Self */}
          <div className="mt-8 p-6 bg-[#FAF7F2] border-l-4 border-[#8A9A7B] rounded-r-xl">
            <label className="flex items-center gap-2 font-['Courier_New'] text-xs text-[#8B7355] mb-3 uppercase tracking-wider">
              <StickyNote className="w-4 h-4" />
              Private Notes to Self — Marginalia
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot thoughts, questions, reminders... These are private and only you can see them."
              className="w-full min-h-[120px] px-0 py-2 border-0 bg-transparent resize-none focus:outline-none font-[family-name:var(--font-ui)] text-sm text-[#2C1810] placeholder:text-[#8B7355]/50 italic"
            />
            <p className="font-[family-name:var(--font-ui)] text-xs text-[#8B7355] mt-3 italic">
              ✦ Only visible to you. Like notes in the margin of a book.
            </p>
          </div>

          {/* Submit Section */}
          <div className="mt-8 pt-8 border-t-2 border-[#E0D8D0]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Cardo'] text-xl text-[#2C1810] mb-2">
                  Ready to submit?
                </h3>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                  Submit directly to our editorial team for review
                </p>
              </div>
              
              <button
                onClick={handleSubmitToEditors}
                disabled={submitting || !content.trim() || !title.trim()}
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] hover:scale-105 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-['Cardo'] text-lg tracking-wide rounded-lg"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit to Editors
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Submit to Feed Section */}
          {isMember && genre === 'poetry' && (
            <div className="mt-8 pt-8 border-t-2 border-[#E0D8D0]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-['Cardo'] text-xl text-[#2C1810] mb-2 flex items-center gap-2">
                    Or submit to Community Feed
                    <span className="px-2 py-1 bg-[#C4A265]/10 text-[#C4A265] text-xs rounded-full font-['Courier_New'] uppercase tracking-wider">
                      Poetry Only
                    </span>
                  </h3>
                  <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                    Share your poetry with the community for feedback and engagement
                  </p>
                </div>
                
                <button
                  onClick={handleSubmitToFeed}
                  disabled={submittingToFeed || !content.trim() || !title.trim()}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-[#C4A265] text-white hover:bg-[#B89255] hover:scale-105 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-['Cardo'] text-lg tracking-wide rounded-lg"
                >
                  {submittingToFeed ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit to Feed
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 p-6 bg-white/50 backdrop-blur-sm border border-[#E0D8D0] rounded-xl">
          <h4 className="font-['Cardo'] text-lg text-[#2C1810] mb-3">How it works</h4>
          <ul className="space-y-2 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C4A265] flex-shrink-0 mt-0.5" />
              <span>Write your piece using this distraction-free editor</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C4A265] flex-shrink-0 mt-0.5" />
              <span>Save drafts to My Work anytime to continue later</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C4A265] flex-shrink-0 mt-0.5" />
              <span>Submit directly to our editorial team when ready</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#C4A265] flex-shrink-0 mt-0.5" />
              <span>Expect a response within 90 days (members get priority review)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
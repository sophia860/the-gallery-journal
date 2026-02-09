import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { ArrowLeft, Play, Pause, RotateCcw, Save } from 'lucide-react';

type Mode = 'timed' | 'word-goal' | 'zen';

export function FreewritePage() {
  const { user, accessToken } = useAuth();
  const [mode, setMode] = useState<Mode>('timed');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeGoal, setTimeGoal] = useState(10); // minutes
  const [wordGoal, setWordGoal] = useState(500);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: number;
    if (isWriting) {
      interval = window.setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWriting]);

  // Auto-focus textarea when writing starts
  useEffect(() => {
    if (isWriting && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isWriting]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = timeElapsed > 0 ? Math.round((wordCount / timeElapsed) * 60) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsWriting(true);
  };

  const handlePause = () => {
    setIsWriting(false);
  };

  const handleReset = () => {
    if (confirm('Reset this session? Unsaved work will be lost.')) {
      setIsWriting(false);
      setTimeElapsed(0);
      setContent('');
      setTitle('');
    }
  };

  const handleSave = async () => {
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
            title: title || 'Untitled Freewrite',
            content,
            type: 'prose',
            toolType: 'freewrite',
            metadata: {
              timeElapsed,
              wordCount,
              wordsPerMinute,
              mode,
            },
          }),
        }
      );

      if (response.ok) {
        setSaveMessage('Saved to My Work');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    window.location.href = '/signin';
    return null;
  }

  const showZenMode = mode === 'zen' && isWriting;

  return (
    <div className={`min-h-screen ${showZenMode ? 'bg-[#1A1A1A] text-[#FAF7F2]' : 'bg-[#FAF7F2]'} transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto px-8 py-24">
        {/* Header */}
        {!showZenMode && (
          <div className="mb-12">
            <a 
              href="/studio"
              className="inline-flex items-center gap-2 text-[#717171] hover:text-[#5B8A8A] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-['Courier_New'] text-sm">Back to Studio</span>
            </a>
            
            <h1 className="font-serif text-5xl mb-4 text-[#2B2B2B]">
              Freewrite
            </h1>
            <p className="text-lg text-[#717171]">
              Just write. No distractions. No judgment.
            </p>
          </div>
        )}

        {/* Mode Selection (only when not writing) */}
        {!isWriting && !showZenMode && (
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => setMode('timed')}
              className={`px-6 py-3 border-2 font-['Courier_New'] text-sm transition-colors ${
                mode === 'timed'
                  ? 'border-[#5B8A8A] bg-[#5B8A8A] text-white'
                  : 'border-[#E0D8D0] hover:border-[#5B8A8A]'
              }`}
            >
              TIMED SESSION
            </button>
            <button
              onClick={() => setMode('word-goal')}
              className={`px-6 py-3 border-2 font-['Courier_New'] text-sm transition-colors ${
                mode === 'word-goal'
                  ? 'border-[#5B8A8A] bg-[#5B8A8A] text-white'
                  : 'border-[#E0D8D0] hover:border-[#5B8A8A]'
              }`}
            >
              WORD GOAL
            </button>
            <button
              onClick={() => setMode('zen')}
              className={`px-6 py-3 border-2 font-['Courier_New'] text-sm transition-colors ${
                mode === 'zen'
                  ? 'border-[#5B8A8A] bg-[#5B8A8A] text-white'
                  : 'border-[#E0D8D0] hover:border-[#5B8A8A]'
              }`}
            >
              ZEN MODE
            </button>
          </div>
        )}

        {/* Goal Settings */}
        {!isWriting && mode !== 'zen' && (
          <div className="mb-8">
            {mode === 'timed' && (
              <div>
                <label className="block font-['Courier_New'] text-sm text-[#717171] mb-2">
                  WRITING TIME (MINUTES)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={timeGoal}
                  onChange={(e) => setTimeGoal(parseInt(e.target.value) || 10)}
                  className="px-4 py-3 border-2 border-[#E0D8D0] bg-white font-serif text-lg focus:border-[#5B8A8A] focus:outline-none w-32"
                />
              </div>
            )}
            {mode === 'word-goal' && (
              <div>
                <label className="block font-['Courier_New'] text-sm text-[#717171] mb-2">
                  WORD GOAL
                </label>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  value={wordGoal}
                  onChange={(e) => setWordGoal(parseInt(e.target.value) || 500)}
                  className="px-4 py-3 border-2 border-[#E0D8D0] bg-white font-serif text-lg focus:border-[#5B8A8A] focus:outline-none w-32"
                />
              </div>
            )}
          </div>
        )}

        {/* Stats Bar */}
        {!showZenMode && (
          <div className="mb-6 p-6 border-2 border-[#E0D8D0] bg-white flex justify-between items-center">
            <div className="flex gap-8">
              <div>
                <div className="font-['Courier_New'] text-xs text-[#717171] mb-1">TIME</div>
                <div className="font-serif text-2xl text-[#2B2B2B]">{formatTime(timeElapsed)}</div>
              </div>
              <div>
                <div className="font-['Courier_New'] text-xs text-[#717171] mb-1">WORDS</div>
                <div className="font-serif text-2xl text-[#2B2B2B]">{wordCount}</div>
              </div>
              <div>
                <div className="font-['Courier_New'] text-xs text-[#717171] mb-1">WPM</div>
                <div className="font-serif text-2xl text-[#2B2B2B]">{wordsPerMinute}</div>
              </div>
              {mode === 'word-goal' && (
                <div>
                  <div className="font-['Courier_New'] text-xs text-[#717171] mb-1">PROGRESS</div>
                  <div className="font-serif text-2xl text-[#2B2B2B]">
                    {Math.round((wordCount / wordGoal) * 100)}%
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {!isWriting ? (
                <button
                  onClick={handleStart}
                  className="p-3 border-2 border-[#5B8A8A] bg-[#5B8A8A] text-white hover:bg-[#4A7979] transition-colors"
                >
                  <Play className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="p-3 border-2 border-[#E0D8D0] hover:border-[#5B8A8A] transition-colors"
                >
                  <Pause className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleReset}
                className="p-3 border-2 border-[#E0D8D0] hover:border-[#C4918A] transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="p-3 border-2 border-[#E0D8D0] hover:border-[#8A9A7B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {saveMessage && (
          <div className="mb-6 p-4 border-2 border-[#8A9A7B] bg-[#8A9A7B]/10 font-['Courier_New'] text-sm text-[#2B2B2B]">
            {saveMessage}
          </div>
        )}

        {/* Title Input */}
        {!showZenMode && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full px-0 py-3 mb-4 border-0 border-b-2 border-[#E0D8D0] bg-transparent font-serif text-3xl focus:border-[#5B8A8A] focus:outline-none placeholder:text-[#D0D0D0]"
          />
        )}

        {/* Writing Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={showZenMode ? '' : 'Start writing...'}
          className={`w-full min-h-[500px] px-0 py-4 border-0 bg-transparent resize-none focus:outline-none ${
            showZenMode 
              ? 'font-serif text-2xl leading-loose text-[#FAF7F2]' 
              : 'font-serif text-xl leading-loose text-[#2B2B2B] placeholder:text-[#D0D0D0]'
          }`}
          style={{
            lineHeight: '2',
          }}
        />

        {/* Zen Mode Instructions */}
        {showZenMode && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 font-['Courier_New'] text-xs text-[#FAF7F2]/50">
            Press ESC to exit zen mode
          </div>
        )}
      </div>
    </div>
  );
}

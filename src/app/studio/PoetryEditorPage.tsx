import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { ArrowLeft, Save, Eye } from 'lucide-react';

export function PoetryEditorPage() {
  const { user, accessToken } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const lineCount = content.split('\n').filter(line => line.trim()).length;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

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
            title: title || 'Untitled Poem',
            content,
            type: 'poetry',
            toolType: 'poetry',
            metadata: {
              lineCount,
              wordCount,
            },
          }),
        }
      );

      if (response.ok) {
        setSaveMessage('Poem saved to My Work');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save');
      }
    } catch (error) {
      console.error('Error saving poem:', error);
      setSaveMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    window.location.href = '/signin';
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto px-8 py-24">
        {/* Header */}
        <div className="mb-12">
          <a 
            href="/studio"
            className="inline-flex items-center gap-2 text-[#717171] hover:text-[#5B8A8A] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-['Courier_New'] text-sm">Back to Studio</span>
          </a>
          
          <h1 className="font-serif text-5xl mb-4 text-[#2B2B2B]">
            Poetry Editor
          </h1>
          <p className="text-lg text-[#717171]">
            Craft poems with precise line-break control. Preview how they'll appear in the gallery.
          </p>
        </div>

        {/* Stats & Actions Bar */}
        <div className="mb-6 p-6 border-2 border-[#E0D8D0] bg-white flex justify-between items-center">
          <div className="flex gap-8">
            <div>
              <div className="font-['Courier_New'] text-xs text-[#717171] mb-1">LINES</div>
              <div className="font-serif text-2xl text-[#2B2B2B]">{lineCount}</div>
            </div>
            <div>
              <div className="font-['Courier_New'] text-xs text-[#717171] mb-1">WORDS</div>
              <div className="font-serif text-2xl text-[#2B2B2B]">{wordCount}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 border-2 font-['Courier_New'] text-sm transition-colors flex items-center gap-2 ${
                showPreview
                  ? 'border-[#5B8A8A] bg-[#5B8A8A] text-white'
                  : 'border-[#E0D8D0] hover:border-[#5B8A8A]'
              }`}
            >
              <Eye className="w-4 h-4" />
              PREVIEW
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !content.trim()}
              className="px-4 py-2 border-2 border-[#E0D8D0] hover:border-[#8A9A7B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Courier_New'] text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              SAVE
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="mb-6 p-4 border-2 border-[#8A9A7B] bg-[#8A9A7B]/10 font-['Courier_New'] text-sm text-[#2B2B2B]">
            {saveMessage}
          </div>
        )}

        {/* Editor / Preview */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Editor */}
          <div className={showPreview ? 'block' : 'md:col-span-2'}>
            <div className="mb-4">
              <label className="block font-['Courier_New'] text-xs text-[#717171] mb-2">
                EDITOR
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Poem title"
                className="w-full px-0 py-3 mb-4 border-0 border-b-2 border-[#E0D8D0] bg-transparent font-serif text-3xl focus:border-[#5B8A8A] focus:outline-none placeholder:text-[#D0D0D0]"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin your poem...&#10;&#10;Each line break matters.&#10;The whitespace is part of the work."
                className="w-full min-h-[600px] px-0 py-4 border-0 bg-transparent resize-none focus:outline-none font-[family-name:var(--font-poetry)] text-xl leading-loose text-[#2B2B2B] placeholder:text-[#D0D0D0] whitespace-pre-wrap"
                style={{
                  lineHeight: '2',
                  fontFamily: "'EB Garamond', serif",
                }}
              />
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div>
              <div className="mb-4">
                <label className="block font-['Courier_New'] text-xs text-[#717171] mb-2">
                  GALLERY PREVIEW
                </label>
              </div>
              <div className="p-8 border-2 border-[#E0D8D0] bg-[#F5F0EB] min-h-[600px]">
                {title && (
                  <h2 className="font-[family-name:var(--font-headline)] text-4xl mb-8 text-[#2C2C2C]">
                    {title}
                  </h2>
                )}
                <div 
                  className="font-[family-name:var(--font-poetry)] text-xl leading-loose text-[#2C2C2C] whitespace-pre-wrap"
                  style={{
                    lineHeight: '2',
                    fontFamily: "'EB Garamond', serif",
                  }}
                >
                  {content || <span className="text-[#D0D0D0] italic">Your poem will appear here...</span>}
                </div>
              </div>
              <p className="mt-4 font-['Courier_New'] text-xs text-[#717171]">
                This is how your poem will appear when published to the gallery.
              </p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 p-6 border-2 border-[#E0D8D0] bg-white">
          <h3 className="font-['Courier_New'] text-sm text-[#717171] mb-3">
            POETRY EDITOR TIPS
          </h3>
          <ul className="space-y-2 text-[#2B2B2B] font-serif">
            <li>• Line breaks are preserved exactly as you type them</li>
            <li>• Use whitespace intentionally — it's part of the poem</li>
            <li>• Preview shows how your poem will appear in the warm gallery atmosphere</li>
            <li>• Saved poems go to My Work, where you can curate them into exhibits</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

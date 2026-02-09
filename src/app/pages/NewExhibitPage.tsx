import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { ArrowLeft } from 'lucide-react';

export function NewExhibitPage() {
  const { user, accessToken } = useAuth();
  const [step, setStep] = useState<'piece' | 'exhibit'>('piece');
  const [pieceData, setPieceData] = useState({
    title: '',
    content: '',
    type: 'prose' as 'prose' | 'poetry',
  });
  const [exhibitData, setExhibitData] = useState({
    title: '',
    openingNote: '',
  });
  const [createdPieceId, setCreatedPieceId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user) {
    window.location.href = '/signin';
    return null;
  }

  const handleCreatePiece = async () => {
    if (!accessToken) return;

    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/pieces`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(pieceData),
        }
      );

      const data = await response.json();
      if (data.piece) {
        setCreatedPieceId(data.piece.id);
        setStep('exhibit');
      }
    } catch (error) {
      console.error('Error creating piece:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateExhibit = async () => {
    if (!accessToken || !createdPieceId) return;

    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/exhibits`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...exhibitData,
            pieces: [createdPieceId],
          }),
        }
      );

      const data = await response.json();
      if (data.exhibit) {
        window.location.href = `/room/${user.id}`;
      }
    } catch (error) {
      console.error('Error creating exhibit:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8">
        <div className="mb-8">
          <a 
            href="/studio/work"
            className="inline-flex items-center gap-2 text-[#717171] hover:text-[#5B8A8A] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-['Courier_New'] text-sm">Back to My Work</span>
          </a>
          
          <h1 className="font-serif text-5xl mb-4 text-[#2B2B2B]">
            Create New Exhibit
          </h1>
          <p className="text-lg text-[#717171]">
            Curate your work into a collection. For now, create a new piece to exhibit.
          </p>
        </div>

        {step === 'piece' && (
          <div className="space-y-8">
            <div>
              <label className="block font-[family-name:var(--font-ui)] text-sm mb-2">
                Title
              </label>
              <input
                type="text"
                value={pieceData.title}
                onChange={(e) => setPieceData({ ...pieceData, title: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none font-[family-name:var(--font-headline)] text-2xl"
                placeholder="Untitled"
              />
            </div>

            <div>
              <label className="block font-[family-name:var(--font-ui)] text-sm mb-3">
                Type
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setPieceData({ ...pieceData, type: 'prose' })}
                  className={`px-6 py-3 border transition-colors font-[family-name:var(--font-ui)] ${
                    pieceData.type === 'prose'
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent'
                  }`}
                >
                  Prose
                </button>
                <button
                  onClick={() => setPieceData({ ...pieceData, type: 'poetry' })}
                  className={`px-6 py-3 border transition-colors font-[family-name:var(--font-ui)] ${
                    pieceData.type === 'poetry'
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent'
                  }`}
                >
                  Poetry
                </button>
              </div>
            </div>

            <div>
              <label className="block font-[family-name:var(--font-ui)] text-sm mb-2">
                Content
              </label>
              <textarea
                value={pieceData.content}
                onChange={(e) => setPieceData({ ...pieceData, content: e.target.value })}
                rows={20}
                className={`w-full px-6 py-4 bg-input-background border border-border focus:border-accent focus:outline-none resize-none ${
                  pieceData.type === 'poetry' 
                    ? 'font-[family-name:var(--font-poetry)] text-lg leading-loose whitespace-pre-wrap' 
                    : 'font-[family-name:var(--font-body)] text-lg leading-relaxed'
                }`}
                placeholder={pieceData.type === 'poetry' ? 'Write your poem here...' : 'Write your piece here...'}
              />
            </div>

            <button
              onClick={handleCreatePiece}
              disabled={saving || !pieceData.title || !pieceData.content}
              className="px-8 py-4 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-[family-name:var(--font-ui)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Creating...' : 'Continue to exhibit details'}
            </button>
          </div>
        )}

        {step === 'exhibit' && (
          <div className="space-y-8">
            <div className="p-6 bg-muted/50 border border-border">
              <div className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground mb-2">
                Your piece
              </div>
              <div className="font-[family-name:var(--font-headline)] text-2xl">
                {pieceData.title}
              </div>
            </div>

            <div>
              <label className="block font-[family-name:var(--font-ui)] text-sm mb-2">
                Exhibit title
              </label>
              <input
                type="text"
                value={exhibitData.title}
                onChange={(e) => setExhibitData({ ...exhibitData, title: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none font-[family-name:var(--font-headline)] text-2xl"
                placeholder="A title for this collection"
              />
            </div>

            <div>
              <label className="block font-[family-name:var(--font-ui)] text-sm mb-2">
                Opening note (optional)
              </label>
              <textarea
                value={exhibitData.openingNote}
                onChange={(e) => setExhibitData({ ...exhibitData, openingNote: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none font-[family-name:var(--font-body)] resize-none"
                placeholder="A note to introduce this exhibit..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCreateExhibit}
                disabled={saving || !exhibitData.title}
                className="px-8 py-4 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-[family-name:var(--font-ui)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Opening exhibit...' : 'Open exhibit'}
              </button>
              <button
                onClick={() => setStep('piece')}
                className="px-6 py-4 border border-border hover:border-accent transition-colors font-[family-name:var(--font-ui)]"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
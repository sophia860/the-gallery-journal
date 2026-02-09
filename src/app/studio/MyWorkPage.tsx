import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { ArrowLeft, FileText, Plus } from 'lucide-react';

interface Draft {
  id: string;
  title: string;
  content: string;
  type: string;
  toolType: string;
  status: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface Exhibit {
  id: string;
  title: string;
  openingNote: string;
  pieces: string[];
  createdAt: string;
}

type Tab = 'drafts' | 'exhibits' | 'published' | 'archived';

export function MyWorkPage() {
  const { user, accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('drafts');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingDraft, setSubmittingDraft] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }

    const fetchWork = async () => {
      try {
        // Fetch drafts
        const draftsResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/drafts/user/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        const draftsData = await draftsResponse.json();
        setDrafts(draftsData.drafts || []);

        // Fetch exhibits
        const exhibitsResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/exhibits/user/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        const exhibitsData = await exhibitsResponse.json();
        setExhibits(exhibitsData.exhibits || []);
      } catch (error) {
        console.error('Error fetching work:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [user, accessToken]);

  const handleSubmitToGallery = async (draftId: string) => {
    if (!user || !accessToken) return;

    setSubmittingDraft(draftId);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/submissions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ draftId }),
        }
      );

      if (response.ok) {
        alert('Submitted to The Gallery! You can track your submission status here.');
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting to gallery:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmittingDraft(null);
    }
  };

  if (!user) {
    return null;
  }

  const getToolIcon = (toolType: string) => {
    const icons: Record<string, string> = {
      freewrite: '✍️',
      poetry: '✨',
      essay: '📄',
      longform: '📖',
      concrete: '🗺️',
    };
    return icons[toolType] || '📝';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-8 py-24">
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
            My Work
          </h1>
          <p className="text-lg text-[#717171]">
            All your drafts, exhibits, and published pieces in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b-2 border-[#E0D8D0]">
          {[
            { key: 'drafts' as Tab, label: 'DRAFTS' },
            { key: 'exhibits' as Tab, label: 'EXHIBITS' },
            { key: 'published' as Tab, label: 'PUBLISHED' },
            { key: 'archived' as Tab, label: 'ARCHIVED' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-['Courier_New'] text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-[#5B8A8A] text-[#2B2B2B]'
                  : 'text-[#717171] hover:text-[#2B2B2B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center font-['Courier_New'] text-[#717171]">
            LOADING...
          </div>
        ) : (
          <>
            {/* Drafts Tab */}
            {activeTab === 'drafts' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <p className="font-['Courier_New'] text-sm text-[#717171]">
                    {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {drafts.length === 0 ? (
                  <div className="py-16 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-[#D0D0D0]" />
                    <p className="text-lg text-[#717171] mb-6">
                      No drafts yet. Start writing in one of the tools.
                    </p>
                    <a
                      href="/studio"
                      className="inline-block px-6 py-3 border-2 border-[#5B8A8A] bg-[#5B8A8A] text-white hover:bg-[#4A7979] transition-colors font-['Courier_New'] text-sm"
                    >
                      GO TO TOOLS
                    </a>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="p-6 border-2 border-[#E0D8D0] bg-white hover:border-[#5B8A8A] transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-2xl">{getToolIcon(draft.toolType)}</div>
                          <div className="font-['Courier_New'] text-xs text-[#717171]">
                            {formatDate(draft.updatedAt)}
                          </div>
                        </div>
                        
                        <h3 className="font-serif text-2xl mb-3 text-[#2B2B2B]">
                          {draft.title}
                        </h3>
                        
                        <p className="text-[#717171] mb-4 line-clamp-3 font-serif">
                          {draft.content.substring(0, 150)}...
                        </p>
                        
                        <div className="flex gap-4 text-xs font-['Courier_New'] text-[#717171] mb-4">
                          <span className="uppercase">{draft.toolType}</span>
                          {draft.metadata?.wordCount && (
                            <span>{draft.metadata.wordCount} words</span>
                          )}
                          {draft.metadata?.lineCount && (
                            <span>{draft.metadata.lineCount} lines</span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleSubmitToGallery(draft.id)}
                          disabled={submittingDraft === draft.id}
                          className="mt-2 px-4 py-2 border-2 border-[#E11D48] text-[#E11D48] hover:bg-[#E11D48] hover:text-white transition-colors font-['Courier_New'] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingDraft === draft.id ? 'SUBMITTING...' : 'SUBMIT TO THE GALLERY'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Exhibits Tab */}
            {activeTab === 'exhibits' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <p className="font-['Courier_New'] text-sm text-[#717171]">
                    {exhibits.length} exhibit{exhibits.length !== 1 ? 's' : ''}
                  </p>
                  <a
                    href="/studio/new-exhibit"
                    className="px-4 py-2 border-2 border-[#5B8A8A] bg-[#5B8A8A] text-white hover:bg-[#4A7979] transition-colors font-['Courier_New'] text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    NEW EXHIBIT
                  </a>
                </div>

                {exhibits.length === 0 ? (
                  <div className="py-16 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-[#D0D0D0]" />
                    <p className="text-lg text-[#717171] mb-6">
                      No exhibits yet. Curate your drafts into a collection.
                    </p>
                    <a
                      href="/studio/new-exhibit"
                      className="inline-block px-6 py-3 border-2 border-[#5B8A8A] bg-[#5B8A8A] text-white hover:bg-[#4A7979] transition-colors font-['Courier_New'] text-sm"
                    >
                      CREATE EXHIBIT
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {exhibits.map((exhibit) => (
                      <a
                        key={exhibit.id}
                        href={`/exhibit/${exhibit.id}`}
                        className="block p-8 border-2 border-[#E0D8D0] bg-white hover:border-[#5B8A8A] transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-serif text-3xl text-[#2B2B2B]">
                            {exhibit.title}
                          </h3>
                          <div className="font-['Courier_New'] text-xs text-[#717171]">
                            {formatDate(exhibit.createdAt)}
                          </div>
                        </div>
                        
                        {exhibit.openingNote && (
                          <p className="text-[#717171] mb-4 font-serif text-lg">
                            {exhibit.openingNote}
                          </p>
                        )}
                        
                        <div className="font-['Courier_New'] text-xs text-[#717171]">
                          {exhibit.pieces.length} {exhibit.pieces.length === 1 ? 'PIECE' : 'PIECES'}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Published / Archived Tabs - Coming Soon */}
            {(activeTab === 'published' || activeTab === 'archived') && (
              <div className="py-16 text-center">
                <p className="text-lg text-[#717171] font-['Courier_New']">
                  {activeTab === 'published' ? 'PUBLISHED PIECES' : 'ARCHIVED WORK'} — COMING SOON
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
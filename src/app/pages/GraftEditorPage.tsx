import { useState } from 'react';
import { ChevronLeft, Check, X, GripVertical, BookOpen, Send, Eye } from 'lucide-react';
import { GardenMainNav } from '../components/GardenMainNav';
import { GardenFooter } from '../components/GardenFooter';
import { NightSkyBackground } from '../components/NightSkyBackground';

interface GraftEditorPageProps {
  graftId: string;
}

interface Submission {
  id: string;
  title: string;
  author: string;
  word_count: number;
  submitted_at: string;
  status: 'pending' | 'accepted' | 'rejected';
  excerpt: string;
}

// Mock graft data
const MOCK_GRAFT = {
  id: '1',
  title: 'Voices of the City',
  theme: 'Urban life, identity, and belonging in the modern metropolis',
  curator: 'Alex Chen',
  status: 'accepting_submissions' as const,
  deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  target_pieces: '3-5',
  editors_note: ''
};

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    title: 'Subway Prayers',
    author: 'Maya Rodriguez',
    word_count: 1200,
    submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'accepted',
    excerpt: 'The F train at 6 AM carries more than commuters. It carries whispered prayers, silent dreams, and the weight of a thousand morning routines...'
  },
  {
    id: 's2',
    title: 'Corner Store Chronicles',
    author: 'James Park',
    word_count: 950,
    submitted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'accepted',
    excerpt: 'Mr. Kim has watched three generations pass through his bodega on 5th Avenue. Each face tells a story of arrival, struggle, and belonging...'
  },
  {
    id: 's3',
    title: 'Rooftop Garden',
    author: 'Sarah Chen',
    word_count: 800,
    submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'accepted',
    excerpt: 'Twenty stories up, between the water towers and satellite dishes, Maria tends tomatoes that taste like home...'
  },
  {
    id: 's4',
    title: 'Night Shift',
    author: 'Marcus Johnson',
    word_count: 1500,
    submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    excerpt: 'The city looks different at 3 AM. Softer somehow. The harsh edges smoothed by streetlight and shadow...'
  },
  {
    id: 's5',
    title: 'Lost and Found',
    author: 'Emily Zhang',
    word_count: 650,
    submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    excerpt: 'In a city of 8 million, I found myself in the reflection of a coffee shop window on a rainy Tuesday...'
  },
  {
    id: 's6',
    title: 'Construction Symphony',
    author: 'David Martinez',
    word_count: 1100,
    submitted_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    excerpt: 'The jackhammers start at dawn, composing the soundtrack of transformation. Steel beams rising, old facades falling...'
  }
];

export function GraftEditorPage({ graftId }: GraftEditorPageProps) {
  const [graft] = useState(MOCK_GRAFT);
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [editorsNote, setEditorsNote] = useState(graft.editors_note);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const acceptedSubmissions = submissions.filter(s => s.status === 'accepted');
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  const handleAccept = (submissionId: string) => {
    if (acceptedSubmissions.length >= 5) {
      alert('You can only accept up to 5 pieces for a Graft.');
      return;
    }
    setSubmissions(submissions.map(s => 
      s.id === submissionId ? { ...s, status: 'accepted' as const } : s
    ));
  };

  const handleReject = (submissionId: string) => {
    setSubmissions(submissions.map(s => 
      s.id === submissionId ? { ...s, status: 'rejected' as const } : s
    ));
  };

  const handleReorder = (draggedId: string, targetId: string) => {
    const accepted = acceptedSubmissions;
    const draggedIndex = accepted.findIndex(s => s.id === draggedId);
    const targetIndex = accepted.findIndex(s => s.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const reordered = [...accepted];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);
    
    // Update the submissions array with new order
    const otherSubmissions = submissions.filter(s => s.status !== 'accepted');
    setSubmissions([...reordered, ...otherSubmissions]);
  };

  const getStatusBadge = () => {
    const statuses = {
      draft: { text: 'Draft', color: '#8b9dc3' },
      accepting_submissions: { text: 'Accepting Submissions', color: '#10b981' },
      under_review: { text: 'Under Review', color: '#f59e0b' },
      published: { text: 'Published', color: '#c4a46c' }
    };
    const status = statuses[graft.status];
    return (
      <span 
        className="px-3 py-1 rounded-full text-xs font-['Inter'] uppercase tracking-wider font-semibold"
        style={{ 
          background: `${status.color}20`,
          color: status.color,
          border: `1px solid ${status.color}`
        }}
      >
        {status.text}
      </span>
    );
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      <NightSkyBackground />
      <GardenMainNav variant="dark" />

      <div className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <a
            href="/grafts"
            className="inline-flex items-center gap-2 mb-8 text-[#8b9dc3] hover:text-[#60a5fa] transition-colors font-['Inter'] text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Grafts
          </a>

          {/* Graft Header */}
          <div 
            className="rounded-2xl p-8 mb-8 backdrop-blur-xl"
            style={{
              background: 'rgba(15, 23, 41, 0.7)',
              border: '1px solid rgba(139, 157, 195, 0.25)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-8 h-8 text-[#60a5fa]" style={{ filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))' }} />
                  <h1 className="font-['Playfair_Display'] italic text-4xl text-white" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
                    {graft.title}
                  </h1>
                </div>
                <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8] leading-relaxed mb-4" style={{ lineHeight: '1.8' }}>
                  {graft.theme}
                </p>
                <div className="flex items-center gap-4">
                  {getStatusBadge()}
                  <span className="text-sm text-[#8b9dc3] font-['Inter']">
                    Curated by {graft.curator}
                  </span>
                  <span className="text-sm text-[#8b9dc3] font-['Inter']">•</span>
                  <span className="text-sm text-[#60a5fa] font-['Inter']">
                    {acceptedSubmissions.length} / {graft.target_pieces} pieces selected
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Submissions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Pieces */}
              {acceptedSubmissions.length > 0 && (
                <div>
                  <h2 className="font-['Cardo'] text-2xl text-white mb-4 italic flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#10b981]" />
                    Selected Pieces ({acceptedSubmissions.length})
                  </h2>
                  <div className="space-y-3">
                    {acceptedSubmissions.map((submission, index) => (
                      <div
                        key={submission.id}
                        className="rounded-xl p-6 backdrop-blur-xl border border-[#10b981]/30 bg-[rgba(16,185,129,0.05)]"
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('submissionId', submission.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const draggedId = e.dataTransfer.getData('submissionId');
                          handleReorder(draggedId, submission.id);
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="cursor-move text-[#8b9dc3] hover:text-white transition-colors">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-['Cardo'] text-lg text-white font-semibold">
                                {index + 1}.
                              </span>
                              <h3 className="font-['Cardo'] text-xl text-white italic">{submission.title}</h3>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <p className="text-sm text-[#c8cad8] font-['Inter']">by {submission.author}</p>
                              <span className="text-[#8b9dc3]">•</span>
                              <p className="text-sm text-[#8b9dc3] font-['Inter']">{submission.word_count} words</p>
                            </div>
                            <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] line-clamp-2 mb-3" style={{ lineHeight: '1.7' }}>
                              {submission.excerpt}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedSubmission(submission)}
                                className="px-3 py-1.5 border border-[rgba(139,157,195,0.3)] rounded-lg text-[#60a5fa] hover:bg-[rgba(96,165,250,0.1)] transition-all font-['Inter'] text-xs flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                Preview
                              </button>
                              <button
                                onClick={() => handleReject(submission.id)}
                                className="px-3 py-1.5 border border-[rgba(239,68,68,0.3)] rounded-lg text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-all font-['Inter'] text-xs flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Submissions */}
              {pendingSubmissions.length > 0 && (
                <div>
                  <h2 className="font-['Cardo'] text-2xl text-white mb-4 italic">
                    Pending Review ({pendingSubmissions.length})
                  </h2>
                  <div className="space-y-3">
                    {pendingSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="rounded-xl p-6 backdrop-blur-xl hover:border-[rgba(96,165,250,0.4)] transition-all"
                        style={{ background: 'rgba(15, 23, 41, 0.7)', border: '1px solid rgba(139, 157, 195, 0.25)' }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-['Cardo'] text-xl text-white mb-2 italic">{submission.title}</h3>
                            <div className="flex items-center gap-3 mb-3">
                              <p className="text-sm text-[#c8cad8] font-['Inter']">by {submission.author}</p>
                              <span className="text-[#8b9dc3]">•</span>
                              <p className="text-sm text-[#8b9dc3] font-['Inter']">{submission.word_count} words</p>
                              <span className="text-[#8b9dc3]">•</span>
                              <p className="text-sm text-[#8b9dc3] font-['Inter']">{getRelativeTime(submission.submitted_at)}</p>
                            </div>
                            <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] line-clamp-2 mb-4" style={{ lineHeight: '1.7' }}>
                              {submission.excerpt}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAccept(submission.id)}
                                className="px-4 py-2 bg-[#10b981] text-white hover:bg-[#059669] transition-all font-['Inter'] text-sm font-semibold rounded-lg flex items-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => setSelectedSubmission(submission)}
                                className="px-4 py-2 border border-[rgba(139,157,195,0.3)] rounded-lg text-[#60a5fa] hover:bg-[rgba(96,165,250,0.1)] transition-all font-['Inter'] text-sm flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Read Full
                              </button>
                              <button
                                onClick={() => handleReject(submission.id)}
                                className="px-4 py-2 border border-[rgba(239,68,68,0.3)] rounded-lg text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-all font-['Inter'] text-sm flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejected Submissions */}
              {rejectedSubmissions.length > 0 && (
                <div>
                  <h2 className="font-['Cardo'] text-2xl text-[#8b9dc3] mb-4 italic">
                    Declined ({rejectedSubmissions.length})
                  </h2>
                  <div className="space-y-3 opacity-60">
                    {rejectedSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="rounded-xl p-4 backdrop-blur-xl"
                        style={{ background: 'rgba(15, 23, 41, 0.5)', border: '1px solid rgba(139, 157, 195, 0.15)' }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-['Cardo'] text-base text-[#8b9dc3] italic">{submission.title}</h3>
                            <p className="text-xs text-[#8b9dc3] font-['Inter']">by {submission.author}</p>
                          </div>
                          <button
                            onClick={() => handleAccept(submission.id)}
                            className="text-xs text-[#60a5fa] hover:underline font-['Inter']"
                          >
                            Reconsider
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Editor's Note & Actions */}
            <div className="space-y-6">
              {/* Editor's Note */}
              <div 
                className="rounded-xl p-6 backdrop-blur-xl sticky top-32"
                style={{ background: 'rgba(15, 23, 41, 0.7)', border: '1px solid rgba(139, 157, 195, 0.25)' }}
              >
                <h3 className="font-['Cardo'] text-lg text-white mb-4 italic">Editor's Note</h3>
                <textarea
                  value={editorsNote}
                  onChange={(e) => setEditorsNote(e.target.value)}
                  placeholder="Write your editorial introduction... What drew you to these pieces? What themes or voices connect them?"
                  rows={8}
                  className="w-full px-4 py-3 bg-[rgba(15,23,41,0.9)] border border-[rgba(139,157,195,0.3)] rounded-lg text-white placeholder-[#8b9dc3] focus:border-[#60a5fa] focus:outline-none font-['Libre_Baskerville'] text-sm resize-none mb-4"
                  style={{ lineHeight: '1.7' }}
                />
                <p className="text-xs text-[#8b9dc3] font-['Inter'] mb-6">
                  This introduction will appear at the beginning of your published Graft.
                </p>

                {/* Publish Button */}
                <button
                  disabled={acceptedSubmissions.length < 3 || !editorsNote.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#c4a46c] to-[#b8935f] text-white hover:from-[#b8935f] hover:to-[#a68254] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Cardo'] text-lg rounded-lg shadow-lg flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 0 20px rgba(196, 164, 108, 0.3)' }}
                >
                  <Send className="w-5 h-5" />
                  Publish Graft
                </button>
                <p className="text-xs text-[#8b9dc3] font-['Inter'] text-center mt-2">
                  {acceptedSubmissions.length < 3 
                    ? 'Select at least 3 pieces to publish'
                    : !editorsNote.trim()
                    ? 'Add an editor\'s note to publish'
                    : 'Ready to publish!'}
                </p>
              </div>
            </div>
          </div>

          {/* Preview Modal */}
          {selectedSubmission && (
            <div 
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
              onClick={() => setSelectedSubmission(null)}
            >
              <div 
                className="bg-white max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <h2 className="font-['Cardo'] text-4xl text-[#2C1810] mb-2 italic">
                    {selectedSubmission.title}
                  </h2>
                  <div className="flex items-center gap-3 mb-6">
                    <p className="text-base text-[#8B7355] font-['Inter']">by {selectedSubmission.author}</p>
                    <span className="text-[#8B7355]">•</span>
                    <p className="text-sm text-[#8B7355] font-['Inter']">{selectedSubmission.word_count} words</p>
                  </div>
                  <div className="font-['Libre_Baskerville'] text-base text-[#2C1810] leading-loose whitespace-pre-wrap mb-8" style={{ lineHeight: '1.8' }}>
                    {selectedSubmission.excerpt}
                    {'\n\n'}
                    [Full text would appear here in production...]
                  </div>
                  <div className="flex gap-3">
                    {selectedSubmission.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            handleAccept(selectedSubmission.id);
                            setSelectedSubmission(null);
                          }}
                          className="flex-1 px-4 py-3 bg-[#10b981] text-white hover:bg-[#059669] transition-all font-['Inter'] text-sm font-semibold rounded-lg flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            handleReject(selectedSubmission.id);
                            setSelectedSubmission(null);
                          }}
                          className="flex-1 px-4 py-3 bg-[#ef4444] text-white hover:bg-[#dc2626] transition-all font-['Inter'] text-sm font-semibold rounded-lg flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Decline
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="px-6 py-3 border-2 border-[#E0D8D0] text-[#8B7355] hover:bg-[#F5F0EB] transition-all font-['Inter'] text-sm font-semibold rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <GardenFooter />
    </div>
  );
}
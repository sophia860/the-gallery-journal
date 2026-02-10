import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, Eye, Search, Calendar, User, Filter, FileText, LogOut } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';

type SubmissionStatus = 'pending' | 'accepted' | 'rejected';
type FilterTab = 'all' | 'pending' | 'accepted' | 'rejected';
type SortBy = 'date' | 'status' | 'author' | 'title';

interface Submission {
  id: string;
  user_id: string;
  title: string;
  content: string;
  author_name: string;
  author_email: string;
  author_bio?: string;
  genre: string;
  tags?: string;
  status: SubmissionStatus;
  submitted_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

interface Profile {
  id: string;
  email: string;
  display_name: string;
  role: string;
}

// Demo submissions
const demoSubmissions: Submission[] = [
  {
    id: '1',
    user_id: 'user1',
    title: 'The Weight of Winter',
    content: `The snow falls like memory,\nsoft and relentless,\ncovering everything we tried to forget.\n\nI watch from the window\nas the world turns white,\nerasing the paths we made\nlast summer.\n\nSome things are meant\nto be buried,\nto rest beneath layers\nof cold and quiet\nuntil spring decides\nwhat deserves\nto bloom again.`,
    author_name: 'Sarah Chen',
    author_email: 'sarah.chen@email.com',
    author_bio: 'Sarah Chen is a poet based in Portland, Oregon. Her work has appeared in various literary magazines.',
    genre: 'poetry',
    tags: 'winter, memory, nature',
    status: 'pending',
    submitted_at: '2026-02-09T14:30:00Z',
  },
  {
    id: '2',
    user_id: 'user2',
    title: 'Sunday Morning',
    content: `Coffee steam rises\nlike small prayers\nto a god of quiet moments.\n\nThe newspaper spreads across the table,\nink on my fingers,\nstories of a world\nthat feels very far away\nfrom this kitchen,\nthis cup,\nthis unhurried hour.`,
    author_name: 'Michael Torres',
    author_email: 'mtorres@email.com',
    author_bio: 'Michael Torres writes about everyday moments and domestic life.',
    genre: 'poetry',
    tags: 'domestic, morning, ritual',
    status: 'pending',
    submitted_at: '2026-02-08T09:15:00Z',
  },
  {
    id: '3',
    user_id: 'user3',
    title: 'What My Grandmother Taught Me',
    content: `She taught me that silence\nis not always empty—\nsometimes it's full\nof everything\nwe don't know how to say.\n\nShe taught me that love\ncan look like\na plate of food\nleft on the counter,\na light left on\nwhen you come home late.\n\nShe taught me\nthat some griefs\ndon't have names,\nonly the shape\nof an empty chair\nat the table.`,
    author_name: 'Ana Martinez',
    author_email: 'ana.m@email.com',
    author_bio: 'Ana Martinez explores themes of family, loss, and cultural memory in her poetry.',
    genre: 'poetry',
    tags: 'family, grief, wisdom',
    status: 'accepted',
    submitted_at: '2026-02-07T16:45:00Z',
    reviewed_at: '2026-02-08T10:00:00Z',
    notes: 'Beautiful meditation on intergenerational wisdom. Perfect for our next issue.',
  },
  {
    id: '4',
    user_id: 'user4',
    title: 'City Sounds',
    content: `The sirens are singing again tonight,\na chorus of urgency and desperation.\nI've learned to sleep through them,\nthe way you learn to sleep through anything\nwhen it becomes part of the soundtrack\nof your life.`,
    author_name: 'David Kim',
    author_email: 'dkim@email.com',
    author_bio: 'David Kim is an urban poet living in New York City.',
    genre: 'poetry',
    tags: 'urban, city life',
    status: 'rejected',
    submitted_at: '2026-02-06T11:20:00Z',
    reviewed_at: '2026-02-07T14:30:00Z',
    notes: 'Strong opening but needs more development. Encourage resubmission with revision.',
  },
  {
    id: '5',
    user_id: 'user5',
    title: 'The Art of Leaving',
    content: `I'm learning how to leave\nwithout slamming doors,\nwithout burning bridges,\nwithout turning back\nto see if anyone noticed\nI was gone.\n\nIt's harder than it sounds—\nthis quiet departure,\nthis gentle untangling\nof threads that bind us\nto places and people\nwe've outgrown.\n\nMaybe the real art\nisn't in leaving at all,\nbut in knowing\nwhen to go,\nhow to go,\nand what to carry\nwith you.`,
    author_name: 'Elena Rodriguez',
    author_email: 'elena.r@email.com',
    author_bio: 'Elena Rodriguez is a writer exploring themes of transition and transformation.',
    genre: 'poetry',
    tags: 'departure, growth, change',
    status: 'pending',
    submitted_at: '2026-02-10T08:00:00Z',
  },
  {
    id: '6',
    user_id: 'user6',
    title: 'Recipe for Heartbreak',
    content: `Take one part longing,\ntwo parts silence,\na dash of regret.\n\nMix thoroughly\nwith memories\nyou can't quite shake.\n\nLet simmer\nin the dark hours\nbetween midnight and dawn.\n\nServe cold,\nalone,\nwith a side\nof what-ifs.`,
    author_name: 'James Wilson',
    author_email: 'jwilson@email.com',
    genre: 'poetry',
    tags: 'love, loss, heartbreak',
    status: 'accepted',
    submitted_at: '2026-02-05T19:30:00Z',
    reviewed_at: '2026-02-06T11:00:00Z',
    notes: 'Clever use of the recipe format. Will pair well with other relationship poems.',
  },
];

export function EditorialSubmissionsPage() {
  const { user, supabase, signOut, loading: authLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>(demoSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (pageLoading) {
        if (user) {
          const fallbackProfile: Profile = {
            id: user.id,
            email: user.email || 'editor@page.com',
            display_name: user.email?.split('@')[0] || 'Editor',
            role: 'editor'
          };
          setProfile(fallbackProfile);
        }
        setPageLoading(false);
      }
    }, 5000);

    if (!authLoading) {
      checkAuth();
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        setRedirectTo('/signin?redirect=/editorial/submissions');
      }
    });

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [authLoading, user, pageLoading]);

  useEffect(() => {
    if (profile) {
      fetchSubmissions();
    }
  }, [profile]);

  const checkAuth = async () => {
    try {
      let { data: { session }, error } = await supabase.auth.getSession();
      
      if (!session && !error) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const retry = await supabase.auth.getSession();
        session = retry.data.session;
      }
      
      if (!session) {
        setRedirectTo('/signin?redirect=/editorial/submissions');
        setPageLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profileData) {
        const fallbackProfile: Profile = {
          id: session.user.id,
          email: session.user.email || 'editor@page.com',
          display_name: session.user.email?.split('@')[0] || 'Editor',
          role: 'editor'
        };
        setProfile(fallbackProfile);
        setPageLoading(false);
        return;
      }

      if (!['editor', 'eic', 'admin'].includes(profileData.role)) {
        alert('Access denied. This page is for editors only.');
        setRedirectTo('/studio');
        setPageLoading(false);
        return;
      }

      setProfile(profileData);
      setPageLoading(false);
    } catch (err) {
      console.error('Auth check error:', err);
      if (user) {
        const fallbackProfile: Profile = {
          id: user.id,
          email: user.email || 'editor@page.com',
          display_name: user.email?.split('@')[0] || 'Editor',
          role: 'editor'
        };
        setProfile(fallbackProfile);
      } else {
        setRedirectTo('/signin?redirect=/editorial/submissions');
      }
      setPageLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        return;
      }

      if (data && data.length > 0) {
        setSubmissions(data);
      }
    } catch (err) {
      console.error('Fetch submissions error:', err);
    }
  };

  const handleAccept = async (submission: Submission) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          status: 'accepted',
          notes: reviewNotes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submission.id);

      if (error) console.error('Error accepting submission:', error);

      setSubmissions(prev => prev.map(s =>
        s.id === submission.id
          ? { ...s, status: 'accepted', notes: reviewNotes, reviewed_at: new Date().toISOString() }
          : s
      ));
      
      setSelectedSubmission(null);
      setReviewNotes('');
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleReject = async (submission: Submission) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          status: 'rejected',
          notes: reviewNotes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submission.id);

      if (error) console.error('Error rejecting submission:', error);

      setSubmissions(prev => prev.map(s =>
        s.id === submission.id
          ? { ...s, status: 'rejected', notes: reviewNotes, reviewed_at: new Date().toISOString() }
          : s
      ));
      
      setSelectedSubmission(null);
      setReviewNotes('');
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setRedirectTo('/');
  };

  // Filter submissions
  const filteredSubmissions = submissions
    .filter(s => {
      // Filter by tab
      if (filterTab !== 'all' && s.status !== filterTab) return false;
      
      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          s.title.toLowerCase().includes(query) ||
          s.author_name.toLowerCase().includes(query) ||
          s.content.toLowerCase().includes(query) ||
          (s.tags && s.tags.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      } else if (sortBy === 'author') {
        return a.author_name.localeCompare(b.author_name);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Calculate stats
  const stats = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48] mb-4"></div>
          <div className="text-[#2C1810] font-['Cardo'] text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (redirectTo) {
    setTimeout(() => window.location.href = redirectTo, 100);
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48] mb-4"></div>
          <div className="text-[#2C1810] font-['Cardo'] text-xl">Redirecting...</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending': return 'bg-[#E59500] text-white';
      case 'accepted': return 'bg-[#059669] text-white';
      case 'rejected': return 'bg-[#DC2626] text-white';
      default: return 'bg-[#8B7355] text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <GalleryNav />

      {/* Header */}
      <div className="pt-32 pb-8 px-8 border-b border-[#E0D8D0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-['Cardo'] text-5xl text-[#2C1810] mb-2 italic">
              Editorial Submissions
            </h1>
            <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
              Review and manage all submissions
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 border-2 border-[#E0D8D0] text-[#8B7355] hover:border-[#E11D48] hover:text-[#E11D48] transition-all font-['Courier_New'] text-sm"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-24 z-40 bg-white border-b border-[#E0D8D0] py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-6 py-2 rounded font-['Courier_New'] text-sm transition-all ${
                filterTab === 'all'
                  ? 'bg-[#E11D48] text-white'
                  : 'bg-white border-2 border-[#E0D8D0] text-[#8B7355] hover:border-[#C4A265]'
              }`}
            >
              ALL ({stats.all})
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-6 py-2 rounded font-['Courier_New'] text-sm transition-all ${
                filterTab === 'pending'
                  ? 'bg-[#E59500] text-white'
                  : 'bg-white border-2 border-[#E0D8D0] text-[#8B7355] hover:border-[#C4A265]'
              }`}
            >
              PENDING ({stats.pending})
            </button>
            <button
              onClick={() => setFilterTab('accepted')}
              className={`px-6 py-2 rounded font-['Courier_New'] text-sm transition-all ${
                filterTab === 'accepted'
                  ? 'bg-[#059669] text-white'
                  : 'bg-white border-2 border-[#E0D8D0] text-[#8B7355] hover:border-[#C4A265]'
              }`}
            >
              ACCEPTED ({stats.accepted})
            </button>
            <button
              onClick={() => setFilterTab('rejected')}
              className={`px-6 py-2 rounded font-['Courier_New'] text-sm transition-all ${
                filterTab === 'rejected'
                  ? 'bg-[#DC2626] text-white'
                  : 'bg-white border-2 border-[#E0D8D0] text-[#8B7355] hover:border-[#C4A265]'
              }`}
            >
              REJECTED ({stats.rejected})
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-[family-name:var(--font-ui)] text-sm w-64"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-2 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-['Courier_New'] text-sm cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
              <option value="author">Sort by Author</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="py-8 px-8">
        <div className="max-w-7xl mx-auto">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white border border-[#E0D8D0] rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-[#8B7355]" />
              <p className="font-['Cardo'] text-2xl text-[#2C1810] mb-2">
                No submissions found
              </p>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                {searchQuery ? 'Try adjusting your search terms' : 'No submissions match the selected filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white border-2 border-[#E0D8D0] rounded-lg hover:border-[#C4A265] transition-all overflow-hidden"
                >
                  <div className="p-6 flex items-center gap-6">
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      <span className={`px-3 py-1.5 rounded font-['Courier_New'] text-xs uppercase tracking-wider ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>

                    {/* Submission Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-2 truncate">
                        {submission.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {submission.author_name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {submission.genre}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(submission.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {submission.tags && (
                          <>
                            <span>•</span>
                            <span className="text-[#C4A265]">{submission.tags}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setReviewNotes(submission.notes || '');
                        }}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-[#E0D8D0] text-[#8B7355] hover:border-[#C4A265] hover:text-[#2C1810] transition-all font-['Courier_New'] text-xs"
                      >
                        <Eye className="w-4 h-4" />
                        VIEW
                      </button>
                      
                      {submission.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setReviewNotes('');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#059669] text-white hover:bg-[#047857] transition-colors font-['Courier_New'] text-xs"
                          >
                            <Check className="w-4 h-4" />
                            ACCEPT
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setReviewNotes('');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors font-['Courier_New'] text-xs"
                          >
                            <X className="w-4 h-4" />
                            REJECT
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Preview (collapsed) */}
                  {submission.status === 'pending' && (
                    <div className="px-6 pb-6">
                      <div className="p-4 bg-[#F5F0EB] rounded border border-[#E0D8D0]">
                        <p className="font-['Libre_Baskerville'] text-sm text-[#2C1810] leading-relaxed whitespace-pre-wrap line-clamp-3">
                          {submission.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="bg-[#FAF7F2] max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#FAF7F2] border-b-2 border-[#E0D8D0] px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-['Cardo'] text-3xl text-[#2C1810]">Review Submission</h3>
                <span className={`px-3 py-1 rounded font-['Courier_New'] text-xs uppercase tracking-wider ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setReviewNotes('');
                }}
                className="p-2 hover:bg-[#F5F0E8] rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-[#8B7355]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Submission Info */}
              <div className="mb-8">
                <h4 className="font-['Cardo'] text-4xl text-[#2C1810] mb-4">
                  {selectedSubmission.title}
                </h4>
                <div className="grid grid-cols-2 gap-4 font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-4">
                  <div>
                    <strong className="text-[#2C1810]">Author:</strong> {selectedSubmission.author_name}
                  </div>
                  <div>
                    <strong className="text-[#2C1810]">Email:</strong> {selectedSubmission.author_email}
                  </div>
                  <div>
                    <strong className="text-[#2C1810]">Genre:</strong> {selectedSubmission.genre}
                  </div>
                  <div>
                    <strong className="text-[#2C1810]">Submitted:</strong>{' '}
                    {new Date(selectedSubmission.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  {selectedSubmission.tags && (
                    <div className="col-span-2">
                      <strong className="text-[#2C1810]">Tags:</strong> {selectedSubmission.tags}
                    </div>
                  )}
                </div>
                
                {selectedSubmission.author_bio && (
                  <div className="p-4 bg-[#F5F0EB] rounded border border-[#E0D8D0]">
                    <strong className="text-[#2C1810] font-['Courier_New'] text-xs uppercase tracking-wider">Author Bio:</strong>
                    <p className="font-[family-name:var(--font-ui)] text-sm text-[#2C1810] mt-2 leading-relaxed">
                      {selectedSubmission.author_bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Full Content */}
              <div className="mb-8 p-8 bg-white border-2 border-[#E0D8D0] rounded-lg">
                <p className="font-['Libre_Baskerville'] text-lg text-[#2C1810] leading-loose whitespace-pre-wrap">
                  {selectedSubmission.content}
                </p>
              </div>

              {/* Existing Notes */}
              {selectedSubmission.notes && selectedSubmission.status !== 'pending' && (
                <div className="mb-8 p-6 bg-[#F5F0EB] border-2 border-[#E0D8D0] rounded-lg">
                  <strong className="text-[#2C1810] font-['Courier_New'] text-xs uppercase tracking-wider">
                    Editorial Notes{selectedSubmission.reviewed_at && ` (${new Date(selectedSubmission.reviewed_at).toLocaleDateString()})`}:
                  </strong>
                  <p className="font-[family-name:var(--font-ui)] text-sm text-[#2C1810] mt-2 leading-relaxed">
                    {selectedSubmission.notes}
                  </p>
                </div>
              )}

              {/* Review Notes (editable for pending) */}
              {selectedSubmission.status === 'pending' && (
                <div className="mb-8">
                  <label className="block font-['Courier_New'] text-xs text-[#8B7355] mb-2 uppercase tracking-wider">
                    Editorial Notes (Optional)
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-[family-name:var(--font-ui)] text-sm resize-none"
                    placeholder="Add feedback for the author or internal notes..."
                  />
                </div>
              )}

              {/* Actions */}
              {selectedSubmission.status === 'pending' && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleAccept(selectedSubmission)}
                    className="flex items-center gap-2 px-8 py-4 bg-[#059669] text-white hover:bg-[#047857] transition-colors font-['Courier_New'] text-sm"
                  >
                    <Check className="w-5 h-5" />
                    ACCEPT & PUBLISH
                  </button>
                  <button
                    onClick={() => handleReject(selectedSubmission)}
                    className="flex items-center gap-2 px-8 py-4 bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors font-['Courier_New'] text-sm"
                  >
                    <X className="w-5 h-5" />
                    REJECT
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubmission(null);
                      setReviewNotes('');
                    }}
                    className="px-8 py-4 border-2 border-[#E0D8D0] text-[#8B7355] hover:border-[#C4A265] hover:text-[#2C1810] transition-all font-['Courier_New'] text-sm"
                  >
                    CANCEL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

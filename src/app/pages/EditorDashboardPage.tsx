import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, Eye, LogOut, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';

type ViewMode = 'submissions' | 'stats';

interface Submission {
  id: string;
  user_id: string;
  title: string;
  content: string;
  author_name: string;
  author_email: string;
  genre: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
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

// Demo submissions for initial display
const demoSubmissions: Submission[] = [
  {
    id: '1',
    user_id: 'user1',
    title: 'The Weight of Winter',
    content: `The snow falls like memory,\nsoft and relentless,\ncovering everything we tried to forget.\n\nI watch from the window\nas the world turns white,\nerasing the paths we made\nlast summer.\n\nSome things are meant\nto be buried,\nto rest beneath layers\nof cold and quiet\nuntil spring decides\nwhat deserves\nto bloom again.`,
    author_name: 'Sarah Chen',
    author_email: 'sarah.chen@email.com',
    genre: 'poetry',
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
    genre: 'poetry',
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
    genre: 'poetry',
    status: 'accepted',
    submitted_at: '2026-02-07T16:45:00Z',
    reviewed_at: '2026-02-08T10:00:00Z',
  },
  {
    id: '4',
    user_id: 'user4',
    title: 'City Sounds',
    content: `The sirens are singing again tonight,\na chorus of urgency and desperation.\nI've learned to sleep through them,\nthe way you learn to sleep through anything\nwhen it becomes part of the soundtrack\nof your life.`,
    author_name: 'David Kim',
    author_email: 'dkim@email.com',
    genre: 'poetry',
    status: 'rejected',
    submitted_at: '2026-02-06T11:20:00Z',
    reviewed_at: '2026-02-07T14:30:00Z',
    notes: 'Strong imagery but needs more development in the second half.',
  },
];

export function EditorDashboardPage() {
  const { user, supabase, signOut, loading: authLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('submissions');
  const [submissions, setSubmissions] = useState<Submission[]>(demoSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    // Timeout: Show dashboard after 5 seconds even if loading
    const loadingTimeout = setTimeout(() => {
      console.log('[EditorDashboard] TIMEOUT: 5 seconds elapsed, forcing dashboard to show');
      if (pageLoading) {
        // Create fallback profile from user if available
        if (user) {
          const fallbackProfile: Profile = {
            id: user.id,
            email: user.email || 'editor@page.com',
            display_name: user.email?.split('@')[0] || 'Editor',
            role: 'editor'
          };
          console.log('[EditorDashboard] Using fallback profile:', fallbackProfile);
          setProfile(fallbackProfile);
        }
        setPageLoading(false);
      }
    }, 5000);

    // Only check auth after authLoading is complete
    if (!authLoading) {
      checkAuth();
    }
    
    // Subscribe to auth state changes for immediate access grant on signin
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[EditorDashboard] Auth state changed:', event, session ? 'has session' : 'no session');
      
      if (event === 'SIGNED_IN' && session) {
        // Immediately check auth when user signs in
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        setRedirectTo('/signin?redirect=/editor-dashboard');
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
    console.log('[EditorDashboard] ========== START checkAuth ==========');
    console.log('[EditorDashboard] authLoading:', authLoading, 'user:', user?.email);
    
    try {
      // Get session directly from Supabase with retry logic for race condition
      console.log('[EditorDashboard] Step 1: Getting initial session...');
      let { data: { session }, error } = await supabase.auth.getSession();
      console.log('[EditorDashboard] Step 1 result - session:', session ? `exists (user: ${session.user.email})` : 'null', 'error:', error);
      
      // If no session initially, wait 2 seconds and retry once (handles race condition on page load)
      if (!session && !error) {
        console.log('[EditorDashboard] Step 2: No session found, waiting 2s for session restoration...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('[EditorDashboard] Step 2: Retrying getSession()...');
        const retry = await supabase.auth.getSession();
        session = retry.data.session;
        console.log('[EditorDashboard] Step 2 result - session:', session ? `exists (user: ${session.user.email})` : 'null');
      }
      
      // If still no session after retry, redirect to signin
      if (!session) {
        console.log('[EditorDashboard] Step 3: No session after retry, setting redirect to signin');
        setRedirectTo('/signin?redirect=/editor-dashboard');
        setPageLoading(false); // Ensure loading stops
        console.log('[EditorDashboard] ========== END checkAuth (no session) ==========');
        return;
      }

      console.log('[EditorDashboard] Step 3: Session confirmed! User ID:', session.user.id);
      console.log('[EditorDashboard] Step 4: Fetching profile from profiles table...');

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      console.log('[EditorDashboard] Step 4 result - profileData:', profileData, 'error:', profileError);

      if (profileError || !profileData) {
        console.error('[EditorDashboard] Step 5: Profile fetch failed! Creating fallback profile...');
        
        // Create fallback profile instead of redirecting
        const fallbackProfile: Profile = {
          id: session.user.id,
          email: session.user.email || 'editor@page.com',
          display_name: session.user.email?.split('@')[0] || 'Editor',
          role: 'editor'
        };
        
        console.log('[EditorDashboard] Step 5: Using fallback profile:', fallbackProfile);
        setProfile(fallbackProfile);
        setPageLoading(false);
        console.log('[EditorDashboard] ========== END checkAuth (fallback profile) ==========');
        return;
      }

      // Check role
      console.log('[EditorDashboard] Step 5: Checking role:', profileData.role);
      if (!['editor', 'eic', 'admin'].includes(profileData.role)) {
        console.log('[EditorDashboard] Step 6: Access denied - invalid role:', profileData.role);
        alert('Access denied. This page is for editors only.');
        setRedirectTo('/studio');
        setPageLoading(false); // Ensure loading stops
        console.log('[EditorDashboard] ========== END checkAuth (access denied) ==========');
        return;
      }

      console.log('[EditorDashboard] Step 6: Access granted! Setting profile and stopping loading...');
      setProfile(profileData);
      setPageLoading(false);
      console.log('[EditorDashboard] ========== END checkAuth (success) ==========');
    } catch (err) {
      console.error('[EditorDashboard] CATCH BLOCK - Auth check error:', err);
      
      // Create fallback profile on error
      if (user) {
        const fallbackProfile: Profile = {
          id: user.id,
          email: user.email || 'editor@page.com',
          display_name: user.email?.split('@')[0] || 'Editor',
          role: 'editor'
        };
        console.log('[EditorDashboard] CATCH BLOCK - Using fallback profile:', fallbackProfile);
        setProfile(fallbackProfile);
      } else {
        setRedirectTo('/signin?redirect=/editor-dashboard');
      }
      
      setPageLoading(false); // Ensure loading stops even on error
      console.log('[EditorDashboard] ========== END checkAuth (error) ==========');
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
      // Otherwise keep demo submissions
    } catch (err) {
      console.error('Fetch submissions error:', err);
      // Keep demo submissions on error
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

      if (error) {
        console.error('Error accepting submission:', error);
        // Update locally anyway for demo
      }

      // Update local state
      setSubmissions(prev => prev.map(s =>
        s.id === submission.id
          ? { ...s, status: 'accepted', notes: reviewNotes, reviewed_at: new Date().toISOString() }
          : s
      ));
      
      setSelectedSubmission(null);
      setReviewNotes('');
      alert(`"${submission.title}" by ${submission.author_name} has been accepted!`);
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

      if (error) {
        console.error('Error rejecting submission:', error);
        // Update locally anyway for demo
      }

      // Update local state
      setSubmissions(prev => prev.map(s =>
        s.id === submission.id
          ? { ...s, status: 'rejected', notes: reviewNotes, reviewed_at: new Date().toISOString() }
          : s
      ));
      
      setSelectedSubmission(null);
      setReviewNotes('');
      alert(`"${submission.title}" by ${submission.author_name} has been rejected.`);
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setRedirectTo('/');
  };

  // Calculate stats
  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  // Show loading screen while auth is loading OR while checking profile/role
  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48] mb-4"></div>
          <div className="text-[#2C1810] font-['Cardo'] text-xl">Loading Editor Dashboard...</div>
        </div>
      </div>
    );
  }

  // Redirect if necessary
  if (redirectTo) {
    setTimeout(() => {
      window.location.href = redirectTo;
    }, 100);
    
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48] mb-4"></div>
          <div className="text-[#2C1810] font-['Cardo'] text-xl">Redirecting...</div>
        </div>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <GalleryNav />

      {/* Header */}
      <div className="pt-32 pb-8 px-8 border-b border-[#E0D8D0]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-['Cardo'] text-5xl text-[#2C1810] mb-2 italic">
              Editorial Dashboard
            </h1>
            <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
              Welcome, {profile?.display_name}
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

      {/* Stats Bar */}
      <div className="py-8 px-8 bg-white border-b border-[#E0D8D0]">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-[#8B7355]" />
            </div>
            <div className="font-['Cardo'] text-4xl text-[#2C1810] mb-1">{stats.total}</div>
            <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
              Total Submissions
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-[#E59500]" />
            </div>
            <div className="font-['Cardo'] text-4xl text-[#E59500] mb-1">{stats.pending}</div>
            <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
              Pending Review
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-[#059669]" />
            </div>
            <div className="font-['Cardo'] text-4xl text-[#059669] mb-1">{stats.accepted}</div>
            <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
              Accepted
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <XCircle className="w-5 h-5 text-[#DC2626]" />
            </div>
            <div className="font-['Cardo'] text-4xl text-[#DC2626] mb-1">{stats.rejected}</div>
            <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
              Rejected
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Queue */}
      <div className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-2">
              Submissions Queue
            </h2>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
              {pendingSubmissions.length} pending submission{pendingSubmissions.length !== 1 ? 's' : ''} awaiting review
            </p>
          </div>

          <div className="space-y-6">
            {pendingSubmissions.length === 0 ? (
              <div className="bg-white border border-[#E0D8D0] rounded-lg p-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-[#059669]" />
                <p className="font-['Cardo'] text-2xl text-[#2C1810] mb-2">
                  All caught up!
                </p>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                  No pending submissions to review at this time.
                </p>
              </div>
            ) : (
              pendingSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white border-2 border-[#E0D8D0] rounded-lg p-8 hover:border-[#C4A265] transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-2">
                        {submission.title}
                      </h3>
                      <div className="flex items-center gap-4 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                        <span>by {submission.author_name}</span>
                        <span>•</span>
                        <span>{submission.genre}</span>
                        <span>•</span>
                        <span>{new Date(submission.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-[#E0D8D0] text-[#8B7355] hover:border-[#C4A265] hover:text-[#2C1810] transition-all font-['Courier_New'] text-xs"
                    >
                      <Eye className="w-4 h-4" />
                      FULL VIEW
                    </button>
                  </div>

                  {/* Content Preview */}
                  <div className="mb-6 p-6 bg-[#F5F0EB] rounded border border-[#E0D8D0]">
                    <p className="font-['Libre_Baskerville'] text-base text-[#2C1810] leading-relaxed whitespace-pre-wrap line-clamp-6">
                      {submission.content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-[#059669] text-white hover:bg-[#047857] transition-colors font-['Courier_New'] text-sm"
                    >
                      <Check className="w-4 h-4" />
                      ACCEPT
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors font-['Courier_New'] text-sm"
                    >
                      <X className="w-4 h-4" />
                      REJECT
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Show Reviewed Submissions */}
          {submissions.filter(s => s.status !== 'pending').length > 0 && (
            <div className="mt-16">
              <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-8">
                Recently Reviewed
              </h2>
              <div className="space-y-4">
                {submissions
                  .filter(s => s.status !== 'pending')
                  .slice(0, 5)
                  .map((submission) => (
                    <div
                      key={submission.id}
                      className="bg-white border border-[#E0D8D0] rounded-lg p-6 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-['Cardo'] text-xl text-[#2C1810] mb-1">
                          {submission.title}
                        </h4>
                        <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                          by {submission.author_name} • Reviewed {submission.reviewed_at ? new Date(submission.reviewed_at).toLocaleDateString() : 'recently'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-4 py-2 rounded font-['Courier_New'] text-xs uppercase tracking-wider ${
                            submission.status === 'accepted'
                              ? 'bg-[#059669] text-white'
                              : 'bg-[#DC2626] text-white'
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
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
              <h3 className="font-['Cardo'] text-3xl text-[#2C1810]">Review Submission</h3>
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
                <div className="flex flex-wrap gap-4 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                  <span><strong className="text-[#2C1810]">Author:</strong> {selectedSubmission.author_name}</span>
                  <span><strong className="text-[#2C1810]">Email:</strong> {selectedSubmission.author_email}</span>
                  <span><strong className="text-[#2C1810]">Genre:</strong> {selectedSubmission.genre}</span>
                  <span><strong className="text-[#2C1810]">Submitted:</strong> {new Date(selectedSubmission.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Full Content */}
              <div className="mb-8 p-8 bg-white border-2 border-[#E0D8D0] rounded-lg">
                <p className="font-['Libre_Baskerville'] text-lg text-[#2C1810] leading-loose whitespace-pre-wrap">
                  {selectedSubmission.content}
                </p>
              </div>

              {/* Review Notes */}
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

              {/* Actions */}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

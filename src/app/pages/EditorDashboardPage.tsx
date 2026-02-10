import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, BookOpen, Upload, LogOut, Menu, X } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';

type ViewMode = 'submissions' | 'content' | 'upload';

interface Submission {
  id: string;
  user_id: string;
  title: string;
  content: string;
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

export function EditorDashboardPage() {
  const { user, supabase, signOut, loading: authLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('submissions');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    authorName: '',
    authorEmail: '',
    content: '',
    genre: 'poetry',
    status: 'pending',
    submissionDate: new Date().toISOString().split('T')[0],
  });

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
    if (view === 'submissions' && profile) {
      fetchSubmissions();
    }
  }, [view, profile]);

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

      setSubmissions(data || []);
    } catch (err) {
      console.error('Fetch submissions error:', err);
    }
  };

  const updateSubmissionStatus = async (id: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          status,
          notes,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating submission:', error);
        alert('Failed to update submission');
        return;
      }

      // Refresh submissions
      fetchSubmissions();
      setSelectedSubmission(null);
      alert('Submission updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update submission');
    }
  };

  const handleUploadSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('submissions')
        .insert({
          title: uploadForm.title,
          content: uploadForm.content,
          genre: uploadForm.genre,
          status: uploadForm.status,
          submitted_at: uploadForm.submissionDate,
          user_id: user.id, // Using current editor as placeholder
          notes: `Legacy submission - Author: ${uploadForm.authorName} (${uploadForm.authorEmail})`,
        });

      if (error) {
        console.error('Error uploading submission:', error);
        alert('Failed to upload submission');
        return;
      }

      alert('Submission uploaded successfully!');
      setUploadForm({
        title: '',
        authorName: '',
        authorEmail: '',
        content: '',
        genre: 'poetry',
        status: 'pending',
        submissionDate: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload submission');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setRedirectTo('/');
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
    // Use setTimeout to redirect after showing loading screen briefly
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

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E0D8D0] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#F5F0EB] rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="font-['Cardo'] text-2xl text-[#2C1810]">Editor Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-['Cardo'] text-sm text-[#2C1810]">{profile?.display_name}</p>
              <p className="text-xs text-[#8B7355] uppercase tracking-wider">{profile?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors rounded"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex pt-20">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-[#E0D8D0] p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setView('submissions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  view === 'submissions'
                    ? 'bg-[#E11D48] text-white'
                    : 'hover:bg-[#F5F0EB] text-[#2C1810]'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-['Cardo'] text-base">Submissions</span>
              </button>

              <button
                onClick={() => setView('content')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  view === 'content'
                    ? 'bg-[#E11D48] text-white'
                    : 'hover:bg-[#F5F0EB] text-[#2C1810]'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-['Cardo'] text-base">Site Content</span>
              </button>

              <button
                onClick={() => setView('upload')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  view === 'upload'
                    ? 'bg-[#E11D48] text-white'
                    : 'hover:bg-[#F5F0EB] text-[#2C1810]'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span className="font-['Cardo'] text-base">Upload Old</span>
              </button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 p-8 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* SUBMISSIONS VIEW */}
          {view === 'submissions' && (
            <div>
              <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-6">Submissions</h2>
              
              <div className="bg-white border border-[#E0D8D0] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F5F0EB] border-b border-[#E0D8D0]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-['Courier_New'] text-[#2C1810] uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-['Courier_New'] text-[#2C1810] uppercase tracking-wider">
                        Genre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-['Courier_New'] text-[#2C1810] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-['Courier_New'] text-[#2C1810] uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-['Courier_New'] text-[#2C1810] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0D8D0]">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-[#FAF7F2]">
                        <td className="px-6 py-4 font-['Libre_Baskerville'] text-sm text-[#2C1810]">
                          {submission.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#8B7355]">
                          {submission.genre}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded font-['Courier_New'] ${
                            submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            submission.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                            submission.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {submission.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#8B7355]">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-[#E11D48] hover:text-[#C01040] text-sm font-['Courier_New']"
                          >
                            REVIEW
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SITE CONTENT VIEW */}
          {view === 'content' && (
            <div>
              <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-6">Site Content</h2>
              <div className="bg-white border border-[#E0D8D0] rounded-lg p-8">
                <p className="text-[#8B7355] font-['Libre_Baskerville'] text-lg">
                  Content management interface coming soon. This will allow you to edit poems and writings displayed on the collection pages.
                </p>
              </div>
            </div>
          )}

          {/* UPLOAD OLD SUBMISSIONS VIEW */}
          {view === 'upload' && (
            <div>
              <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-6">Upload Old Submissions</h2>
              
              <div className="bg-white border border-[#E0D8D0] rounded-lg p-8">
                <form onSubmit={handleUploadSubmission} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-['Courier_New'] text-[#2C1810] mb-2">
                        TITLE *
                      </label>
                      <input
                        type="text"
                        required
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-['Courier_New'] text-[#2C1810] mb-2">
                        AUTHOR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={uploadForm.authorName}
                        onChange={(e) => setUploadForm({ ...uploadForm, authorName: e.target.value })}
                        className="w-full px-4 py-2 border border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-['Courier_New'] text-[#2C1810] mb-2">
                        AUTHOR EMAIL *
                      </label>
                      <input
                        type="email"
                        required
                        value={uploadForm.authorEmail}
                        onChange={(e) => setUploadForm({ ...uploadForm, authorEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-['Courier_New'] text-[#2C1810] mb-2">
                        GENRE *
                      </label>
                      <select
                        required
                        value={uploadForm.genre}
                        onChange={(e) => setUploadForm({ ...uploadForm, genre: e.target.value })}
                        className="w-full px-4 py-2 border border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded"
                      >
                        <option value="poetry">Poetry</option>
                        <option value="fiction">Fiction</option>
                        <option value="nonfiction">Nonfiction</option>
                        <option value="essay">Essay</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-['Courier_New'] text-[#2C1810] mb-2">
                        STATUS *
                      </label>
                      <select
                        required
                        value={uploadForm.status}
                        onChange={(e) => setUploadForm({ ...uploadForm, status: e.target.value })}
                        className="w-full px-4 py-2 border border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-['Courier_New'] text-[#2C1810] mb-2">
                        SUBMISSION DATE *
                      </label>
                      <input
                        type="date"
                        required
                        value={uploadForm.submissionDate}
                        onChange={(e) => setUploadForm({ ...uploadForm, submissionDate: e.target.value })}
                        className="w-full px-4 py-2 border border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-['Courier_New'] text-[#2C1810] mb-2">
                      CONTENT *
                    </label>
                    <textarea
                      required
                      rows={12}
                      value={uploadForm.content}
                      onChange={(e) => setUploadForm({ ...uploadForm, content: e.target.value })}
                      className="w-full px-4 py-2 border border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-['Libre_Baskerville']"
                      placeholder="Paste the full text of the submission here..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Courier_New'] text-sm rounded"
                  >
                    UPLOAD SUBMISSION
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E0D8D0] px-8 py-6 flex items-center justify-between">
              <h3 className="font-['Cardo'] text-2xl text-[#2C1810]">Review Submission</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 hover:bg-[#F5F0EB] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <h4 className="font-['Cardo'] text-3xl text-[#2C1810] mb-2">
                  {selectedSubmission.title}
                </h4>
                <div className="flex gap-4 text-sm text-[#8B7355]">
                  <span>Genre: {selectedSubmission.genre}</span>
                  <span>Submitted: {new Date(selectedSubmission.submitted_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-6 p-6 bg-[#FAF7F2] rounded-lg">
                <pre className="font-['Libre_Baskerville'] text-base text-[#2C1810] whitespace-pre-wrap leading-relaxed">
                  {selectedSubmission.content}
                </pre>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-['Courier_New'] text-[#2C1810] mb-2">
                  REVIEW NOTES
                </label>
                <textarea
                  rows={4}
                  defaultValue={selectedSubmission.notes || ''}
                  id="review-notes"
                  className="w-full px-4 py-2 border border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded"
                  placeholder="Add notes about this submission..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const notes = (document.getElementById('review-notes') as HTMLTextAreaElement)?.value;
                    updateSubmissionStatus(selectedSubmission.id, 'accepted', notes);
                  }}
                  className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors font-['Courier_New'] text-sm rounded"
                >
                  ACCEPT
                </button>
                <button
                  onClick={() => {
                    const notes = (document.getElementById('review-notes') as HTMLTextAreaElement)?.value;
                    updateSubmissionStatus(selectedSubmission.id, 'under_review', notes);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-['Courier_New'] text-sm rounded"
                >
                  UNDER REVIEW
                </button>
                <button
                  onClick={() => {
                    const notes = (document.getElementById('review-notes') as HTMLTextAreaElement)?.value;
                    updateSubmissionStatus(selectedSubmission.id, 'rejected', notes);
                  }}
                  className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors font-['Courier_New'] text-sm rounded"
                >
                  REJECT
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors font-['Courier_New'] text-sm rounded"
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
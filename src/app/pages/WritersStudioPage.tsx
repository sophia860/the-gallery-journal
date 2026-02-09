import { useState, useEffect } from 'react';
import { Lock, FileText, Heart, Calendar, Edit3 } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { Footer } from '../components/Footer';
import { getDrafts, getSubmissions, type Draft, type Submission } from '../../services/backend';

export function WritersStudioPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [draftsData, submissionsData] = await Promise.all([
        getDrafts(),
        getSubmissions(),
      ]);
      setDrafts(draftsData);
      setSubmissions(submissionsData);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalHearts = submissions.reduce((sum, s) => sum + (s.rating || 0), 0);
  const publishedCount = submissions.filter(s => s.status === 'published').length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <GalleryNav />

      <div className="flex-1 pt-32 pb-16 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-[#E11D48]" />
              <span className="text-xs uppercase tracking-wider text-[#717171] font-['Inter']">
                Private Workspace
              </span>
            </div>
            <h1 className="font-['Cardo'] text-6xl text-[#2C2C2C] mb-4 italic">
              Your Writers' Studio
            </h1>
            <p className="font-['Libre_Baskerville'] text-lg text-[#717171] max-w-3xl leading-relaxed">
              A cozy, private sanctuary for your creative work. Your drafts, your progress, your space.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-[#E8E0D8] p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-[#E11D48]" />
                <span className="text-xs uppercase tracking-wider text-[#717171] font-['Inter']">
                  Private Drafts
                </span>
              </div>
              <div className="text-4xl font-bold text-[#2C2C2C] font-['Inter']">
                {drafts.length}
              </div>
            </div>

            <div className="bg-white border border-[#E8E0D8] p-6">
              <div className="flex items-center gap-3 mb-3">
                <Edit3 className="w-5 h-5 text-[#E11D48]" />
                <span className="text-xs uppercase tracking-wider text-[#717171] font-['Inter']">
                  Submitted
                </span>
              </div>
              <div className="text-4xl font-bold text-[#2C2C2C] font-['Inter']">
                {submissions.filter(s => s.status === 'submitted' || s.status === 'pending').length}
              </div>
            </div>

            <div className="bg-white border border-[#E8E0D8] p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-[#E11D48]" />
                <span className="text-xs uppercase tracking-wider text-[#717171] font-['Inter']">
                  Published
                </span>
              </div>
              <div className="text-4xl font-bold text-[#2C2C2C] font-['Inter']">
                {publishedCount}
              </div>
            </div>

            <div className="bg-white border border-[#E8E0D8] p-6">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-5 h-5 text-[#E11D48]" />
                <span className="text-xs uppercase tracking-wider text-[#717171] font-['Inter']">
                  Total Hearts
                </span>
              </div>
              <div className="text-4xl font-bold text-[#2C2C2C] font-['Inter']">
                {totalHearts}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-[#E8E0D8] p-8 mb-12">
            <h2 className="font-['Cardo'] text-3xl text-[#2C2C2C] mb-6">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="/writer-editor"
                className="px-6 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Inter'] text-sm font-medium"
              >
                Start Writing
              </a>
              <a
                href="/community-wall"
                className="px-6 py-3 border-2 border-[#E8E0D8] text-[#2C2C2C] hover:border-[#C4918A] transition-colors font-['Inter'] text-sm"
              >
                Visit Community Wall
              </a>
              <a
                href="/collection-gallery"
                className="px-6 py-3 border-2 border-[#E8E0D8] text-[#2C2C2C] hover:border-[#C4918A] transition-colors font-['Inter'] text-sm"
              >
                Browse Published Works
              </a>
            </div>
          </div>

          {/* My Private Drafts */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#717171]" />
                <h2 className="font-['Cardo'] text-3xl text-[#2C2C2C]">My Private Drafts</h2>
              </div>
              <span className="text-xs text-[#717171] font-['Inter'] italic">
                For your eyes only
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="font-['Inter'] text-[#717171]">Loading...</p>
              </div>
            ) : drafts.length === 0 ? (
              <div className="bg-white border border-[#E8E0D8] p-12 text-center">
                <p className="font-['Libre_Baskerville'] text-[#717171] italic mb-6">
                  Your private drafts will appear here. Start writing to create your first draft.
                </p>
                <a
                  href="/writer-editor"
                  className="inline-block px-6 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Inter'] text-sm"
                >
                  Create First Draft
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drafts.map((draft, idx) => (
                  <div
                    key={draft.id || idx}
                    className="bg-white border-2 border-[#E8E0D8] p-6 hover:border-[#C4918A] hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-['Libre_Baskerville'] text-xl text-[#2C2C2C] flex-1">
                        {draft.title || 'Untitled'}
                      </h3>
                      <Lock className="w-4 h-4 text-[#717171] flex-shrink-0" />
                    </div>
                    {draft.category && (
                      <p className="text-xs text-[#717171] font-['Inter'] mb-3">
                        {draft.category}
                      </p>
                    )}
                    <p className="font-['Libre_Baskerville'] text-sm text-[#2C2C2C] leading-relaxed line-clamp-3 mb-4">
                      {draft.content}
                    </p>
                    <a
                      href="/writer-editor"
                      className="text-sm text-[#E11D48] hover:underline font-['Inter']"
                    >
                      Continue writing →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          <div>
            <h2 className="font-['Cardo'] text-3xl text-[#2C2C2C] mb-6">Recent Submissions</h2>
            {submissions.length === 0 ? (
              <div className="bg-white border border-[#E8E0D8] p-12 text-center">
                <p className="font-['Libre_Baskerville'] text-[#717171] italic">
                  No submissions yet. Submit your work to The Gallery when you're ready.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.slice(0, 5).map(submission => (
                  <div
                    key={submission.id}
                    className="bg-white border border-[#E8E0D8] p-6 hover:border-[#C4918A] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-['Libre_Baskerville'] text-xl text-[#2C2C2C] mb-2">
                          {submission.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-[#717171] font-['Inter']">
                          <span className={`px-2 py-1 rounded text-xs ${
                            submission.status === 'published' ? 'bg-green-500/10 text-green-700' :
                            submission.status === 'pending' ? 'bg-blue-500/10 text-blue-700' :
                            'bg-amber-500/10 text-amber-700'
                          }`}>
                            {submission.status}
                          </span>
                          <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

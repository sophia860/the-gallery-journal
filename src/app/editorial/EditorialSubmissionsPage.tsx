import { useEffect, useState } from 'react';
import { Star, EyeOff, Tag, CheckCircle2, XCircle, ArrowRight, Mail, Crown, ListChecks } from 'lucide-react';
import { getSubmissions, updateSubmissionStatus, Submission } from '../../services/backend';

const statusCopy: Record<Submission['status'], { label: string; color: string }> = {
  pending: { label: 'Under review', color: 'bg-[#F4E7DD] text-[#8B5E3C]' },
  queued: { label: 'Shortlisted', color: 'bg-[#E6F0E8] text-[#2F6B3C]' },
  in_issue: { label: 'Accepted (in issue)', color: 'bg-[#E5ECF7] text-[#1C4C92]' },
  published: { label: 'Published', color: 'bg-[#E6F0E8] text-[#2F6B3C]' },
  revisions_requested: { label: 'Resubmit w/ feedback', color: 'bg-[#FFF3D6] text-[#8F5A12]' },
  rejected: { label: 'Rejected', color: 'bg-[#FBECEC] text-[#8F1F1F]' },
};

export function EditorialSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmissions().then((data) => {
      setSubmissions(data);
      setLoading(false);
    });
  }, []);

  const handleStatus = async (id: string, status: Submission['status']) => {
    await updateSubmissionStatus(id, status);
    setSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <div className="bg-[#F5F0EB] min-h-screen text-[#2D221C]">
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-start gap-4 mb-8">
          <ListChecks className="h-10 w-10 text-[#8B5E3C]" />
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-[#8B5E3C] mb-2">Editorial Dashboard</p>
            <h1 className="text-3xl font-semibold font-[family-name:var(--font-display)]">Gallery submissions queue</h1>
            <p className="text-[#5B463B] mt-2 max-w-4xl">
              Blind-first review, star ratings, and tags for shortlist/maybe/reject. Assign accepted work to an issue and page
              number, then notify writers with the prestige language they earned.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#E3D5C9] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#8B5E3C] font-medium">
              <EyeOff className="h-5 w-5" />
              Blind mode
            </div>
            <p className="text-sm text-[#5B463B] mt-2">Hide author metadata for first reads. Reveal only after rating.</p>
          </div>
          <div className="bg-white border border-[#E3D5C9] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#8B5E3C] font-medium">
              <Star className="h-5 w-5" />
              Rate 1-5 + notes
            </div>
            <p className="text-sm text-[#5B463B] mt-2">Add line notes and verdict tags: shortlist, maybe, reject-with-feedback.</p>
          </div>
          <div className="bg-white border border-[#E3D5C9] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#8B5E3C] font-medium">
              <Crown className="h-5 w-5" />
              Assign page & issue
            </div>
            <p className="text-sm text-[#5B463B] mt-2">Lock accepted work to an issue and page number before publishing.</p>
          </div>
        </div>

        <div className="bg-white border border-[#E3D5C9] rounded-2xl shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE1D7]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8B5E3C]">Queue</p>
              <p className="text-sm text-[#5B463B]">Reading period: Winter 2026 · Target: 50 pages · Acceptance ~4%</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <button className="px-3 py-2 rounded-lg border border-[#EDE1D7] bg-[#FCF8F4]">Batch: shortlist</button>
              <button className="px-3 py-2 rounded-lg border border-[#EDE1D7] bg-[#FCF8F4]">Batch: reject w/ feedback</button>
              <button className="px-3 py-2 rounded-lg border border-[#EDE1D7] bg-[#FCF8F4]">Export decisions</button>
            </div>
          </div>

          <div className="divide-y divide-[#F1E5DA]">
            {loading ? (
              <div className="px-6 py-4 text-sm text-[#5B463B]">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="px-6 py-4 text-sm text-[#5B463B]">No submissions yet.</div>
            ) : (
              submissions.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-start gap-4">
                  <div className="w-20 text-xs text-[#8B5E3C] font-semibold">{item.id.slice(0, 6)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">{item.title}</p>
                        <p className="text-sm text-[#5B463B]">
                          {item.authorName || 'Anonymous'} · Submitted {new Date(item.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusCopy[item.status].color}`}>
                          {statusCopy[item.status].label}
                        </span>
                        <div className="flex items-center gap-1 text-[#D0A16F]">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              className={`h-4 w-4 ${n <= (item.rating || 0) ? 'fill-[#D0A16F] text-[#D0A16F]' : 'text-[#E0C9AF]'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.tags?.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FCF8F4] border border-[#EDE1D7] text-xs text-[#5B463B]">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-sm">
                      <button
                        onClick={() => handleStatus(item.id, 'queued')}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#EDE1D7] bg-[#F8F2EC]"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleStatus(item.id, 'in_issue')}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#EDE1D7] bg-[#F8F2EC]"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatus(item.id, 'revisions_requested')}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#EDE1D7] bg-[#F8F2EC]"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Request revisions
                      </button>
                      <button
                        onClick={() => handleStatus(item.id, 'rejected')}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#EDE1D7] bg-[#F8F2EC]"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="border border-[#E3D5C9] rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#8B5E3C]">
              <Mail className="h-4 w-4" />
              Acceptance language
            </div>
            <p className="text-sm text-[#5B463B] leading-relaxed">
              “Your work [TITLE] has been selected for publication in The Page Gallery Journal, Issue 3: Winter 2026.
              Your piece will be published as Page 28 on the Memory & Loss wall. This honor is earned by roughly 4% of submissions.”
            </p>
          </div>
          <div className="border border-[#E3D5C9] rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#8B5E3C]">
              <Tag className="h-4 w-4" />
              Outcomes
            </div>
            <ul className="list-disc list-inside text-sm text-[#5B463B] space-y-1">
              <li>Under review → shortlisted → accepted → issue + page assigned.</li>
              <li>Rejected (optionally with feedback) or resubmit with specific notes.</li>
              <li>Priority perks for published writers: badge, live readings, mentorship eligibility.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

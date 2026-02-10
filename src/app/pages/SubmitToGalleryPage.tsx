import { useState } from 'react';
import { ShieldCheck, Star, PenLine, Tag, CheckCircle2 } from 'lucide-react';
import { submitToGallery, Draft } from '../../services/backend';

const categories = ['Poetry', 'Essay', 'Fiction', 'Memoir', 'Experimental'];

export function SubmitToGalleryPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const draft: Draft = {
      title,
      content,
      category,
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      shareToCommunity: false,
    };

    const result = await submitToGallery(draft);
    setSubmitting(false);

    if (result.success) {
      setMessage('Your work is under consideration. We respond within 8 weeks.');
      setTitle('');
      setContent('');
      setCategory(categories[0]);
      setTags('');
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFCF8] text-[#2D221C]">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-start gap-4 mb-10">
          <ShieldCheck className="h-12 w-12 text-[#8B5E3C]" />
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-[#8B5E3C] mb-3">The Page — Prestige Submission</p>
            <h1 className="text-4xl font-semibold font-[family-name:var(--font-display)] leading-tight">
              Curated, selective, and scarce.
            </h1>
            <p className="text-lg text-[#5B463B] mt-3 max-w-3xl">
              Publication in The Gallery is a credential: 50 pages per issue, ~4% acceptance. Submit one polished piece with intention.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#E9E0D6] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#8B5E3C] font-medium">
              <Star className="h-5 w-5" />
              Selective
            </div>
            <p className="text-sm text-[#5B463B] mt-1">We hang 50 pages per issue. Once the issue is hung, it closes.</p>
          </div>
          <div className="bg-white border border-[#E9E0D6] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#8B5E3C] font-medium">
              <PenLine className="h-5 w-5" />
              One piece at a time
            </div>
            <p className="text-sm text-[#5B463B] mt-1">Submit a single piece. No simultaneous Gallery submissions while under review.</p>
          </div>
          <div className="bg-white border border-[#E9E0D6] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#8B5E3C] font-medium">
              <CheckCircle2 className="h-5 w-5" />
              Clear timeline
            </div>
            <p className="text-sm text-[#5B463B] mt-1">Confirmation on submit. Responses within 8 weeks: accept, reject, or resubmit with feedback.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E9E0D6] rounded-2xl p-6 shadow-md space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#4A382F] mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-[#E6DCD1] bg-[#FEFCF8] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A989]"
              placeholder="The title you want to hang on The Page"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4A382F] mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              className="w-full rounded-lg border border-[#E6DCD1] bg-[#FEFCF8] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A989] leading-relaxed"
              placeholder="Paste your best work here. Craft, originality, risk-taking expected."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#4A382F] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[#E6DCD1] bg-[#FEFCF8] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A989]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4A382F] mb-1 flex items-center gap-2">
                Tags <Tag className="h-4 w-4 text-[#8B5E3C]" />
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-lg border border-[#E6DCD1] bg-[#FEFCF8] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A989]"
                placeholder="memory, winter issue, risk-taking"
              />
              <p className="text-xs text-[#7A655A] mt-1">Comma-separated. Helps editors place you on the right wall.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#2D221C] text-[#F7EFE6] text-sm font-semibold hover:bg-[#3A2D24] transition disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit to The Gallery'}
          </button>

          {message && <p className="text-sm text-[#2F6B3C] bg-[#E9F5EC] border border-[#CFE7D7] rounded-lg px-3 py-2">{message}</p>}
          {error && <p className="text-sm text-[#8F1F1F] bg-[#FBECEC] border border-[#F2D8D8] rounded-lg px-3 py-2">{error}</p>}
        </form>
      </section>
    </div>
  );
}

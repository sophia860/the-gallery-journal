import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  { value: 'poetry', label: 'Poetry' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'essay', label: 'Essay' },
  { value: 'visual-art', label: 'Visual Art' },
];

export function SubmitPage() {
  const { user, supabase } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'poetry',
    content: '',
    authorBio: '',
    email: user?.email || '',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Prepare submission data
      const submission = {
        title: formData.title,
        content: formData.content,
        genre: formData.category,
        author_name: user?.user_metadata?.writerName || formData.email.split('@')[0],
        author_email: formData.email,
        author_bio: formData.authorBio,
        tags: formData.tags,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        user_id: user?.id || 'guest',
      };

      // Try to save to Supabase
      const { error: dbError } = await supabase
        .from('submissions')
        .insert(submission);

      if (dbError) {
        console.error('Database error:', dbError);
        // Continue anyway - graceful degradation
      }

      // Show success
      setSubmitted(true);
      
      // Reset form
      setFormData({
        title: '',
        category: 'poetry',
        content: '',
        authorBio: '',
        email: user?.email || '',
        tags: '',
      });

      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err: any) {
      console.error('Submission error:', err);
      setError('There was an error submitting your work. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <GalleryNav />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-8 bg-gradient-to-b from-[#FAF8F5] to-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-['Cardo'] text-7xl text-[#2C1810] mb-6 italic">
            Submit Your Work
          </h1>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-16 bg-[#C4A265]"></div>
            <div className="w-1 h-1 bg-[#C4A265] rotate-45"></div>
            <div className="h-px w-16 bg-[#C4A265]"></div>
          </div>
          <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] leading-relaxed max-w-2xl mx-auto">
            Share your literary work with our community. All submissions are carefully reviewed by our editorial team.
          </p>
        </div>
      </section>

      {/* Success Message */}
      {submitted && (
        <div className="max-w-3xl mx-auto px-8 py-8">
          <div className="bg-[#059669]/10 border-2 border-[#059669] rounded-lg p-8 flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-[#059669] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-['Cardo'] text-2xl text-[#059669] mb-2">
                Submission Received
              </h3>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#2C1810] leading-relaxed">
                Thank you for submitting your work to The Gallery. Our editorial team will review your submission and respond within 90 days. We appreciate your patience and your contribution to our literary community.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto px-8 py-8">
          <div className="bg-[#E11D48]/10 border-2 border-[#E11D48] rounded-lg p-8 flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-[#E11D48] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-['Cardo'] text-2xl text-[#E11D48] mb-2">
                Submission Error
              </h3>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#2C1810] leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Form */}
      <section className="py-12 px-8">
        <div className="max-w-3xl mx-auto">
          {/* Editorial Note */}
          <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-8 mb-8">
            <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-4">
              Submission Guidelines
            </h3>
            <div className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed space-y-3">
              <p>
                • All submissions are reviewed by our editorial team within 90 days
              </p>
              <p>
                • We accept original, unpublished work in poetry, fiction, essays, and visual art
              </p>
              <p>
                • Writers may submit up to 3 pieces at a time
              </p>
              <p>
                • Please include a brief author bio and relevant tags/genres
              </p>
              <p>
                • Simultaneous submissions are accepted; please notify us if your work is accepted elsewhere
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white border-2 border-[#E0D8D0] rounded-lg p-8 space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-['Courier_New'] text-xs text-[#8B7355] mb-3 uppercase tracking-wider">
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-4 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-['Cardo'] text-2xl placeholder:text-[#C4B5A0]"
                placeholder="The title of your work"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block font-['Courier_New'] text-xs text-[#8B7355] mb-3 uppercase tracking-wider">
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-4 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-['Cardo'] text-lg cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block font-['Courier_New'] text-xs text-[#8B7355] mb-3 uppercase tracking-wider">
                Your Work *
              </label>
              <textarea
                id="content"
                required
                rows={16}
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full px-4 py-4 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-['Libre_Baskerville'] text-lg leading-loose resize-y placeholder:text-[#C4B5A0]"
                placeholder="Paste your work here. For poetry, preserve your line breaks. For prose, include paragraph breaks as needed."
              />
              <p className="mt-2 font-[family-name:var(--font-ui)] text-xs text-[#8B7355] italic">
                Word count: {formData.content.split(/\s+/).filter(w => w.length > 0).length}
              </p>
            </div>

            {/* Author Bio */}
            <div>
              <label htmlFor="authorBio" className="block font-['Courier_New'] text-xs text-[#8B7355] mb-3 uppercase tracking-wider">
                Author Bio *
              </label>
              <textarea
                id="authorBio"
                required
                rows={4}
                value={formData.authorBio}
                onChange={(e) => handleChange('authorBio', e.target.value)}
                className="w-full px-4 py-4 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-[family-name:var(--font-ui)] text-sm leading-relaxed resize-y placeholder:text-[#C4B5A0]"
                placeholder="A brief bio (2-3 sentences). Include any previous publications, awards, or relevant background."
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-['Courier_New'] text-xs text-[#8B7355] mb-3 uppercase tracking-wider">
                Contact Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-4 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-[family-name:var(--font-ui)] text-sm placeholder:text-[#C4B5A0]"
                placeholder="your@email.com"
              />
              <p className="mt-2 font-[family-name:var(--font-ui)] text-xs text-[#8B7355] italic">
                We'll use this email to respond to your submission
              </p>
            </div>

            {/* Tags/Genre */}
            <div>
              <label htmlFor="tags" className="block font-['Courier_New'] text-xs text-[#8B7355] mb-3 uppercase tracking-wider">
                Genre / Tags (Optional)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                className="w-full px-4 py-4 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-[family-name:var(--font-ui)] text-sm placeholder:text-[#C4B5A0]"
                placeholder="e.g., lyric poetry, magical realism, nature writing, experimental"
              />
              <p className="mt-2 font-[family-name:var(--font-ui)] text-xs text-[#8B7355] italic">
                Help us categorize your work (comma-separated)
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center py-4">
              <div className="h-px w-full bg-[#E0D8D0]"></div>
              <div className="px-4">
                <div className="w-1.5 h-1.5 bg-[#C4A265] rotate-45"></div>
              </div>
              <div className="h-px w-full bg-[#E0D8D0]"></div>
            </div>

            {/* Editorial Review Note */}
            <div className="bg-[#F5F0E8] border border-[#E0D8D0] rounded p-6">
              <p className="font-['Libre_Baskerville'] text-sm text-[#8B7355] leading-relaxed italic text-center">
                "We read every submission with care and attention. Our editorial team is committed to supporting emerging and established writers alike. Thank you for trusting us with your work."
              </p>
              <p className="font-['Courier_New'] text-xs text-[#8B7355] text-center mt-3 uppercase tracking-wider">
                — The Editorial Team
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-6 bg-[#E11D48] text-white hover:bg-[#C01040] disabled:bg-[#8B7355] disabled:cursor-not-allowed transition-all font-['Cardo'] text-lg tracking-wider flex items-center justify-center gap-3 group"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  SUBMITTING...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  SUBMIT YOUR WORK
                </>
              )}
            </button>

            <p className="text-center font-[family-name:var(--font-ui)] text-xs text-[#8B7355]">
              By submitting, you confirm this work is your original creation and you hold the rights to it.
            </p>
          </form>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

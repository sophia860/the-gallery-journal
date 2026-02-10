import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />

      {/* Header */}
      <section className="px-8 py-16 text-center">
        <h1 className="font-['Special_Elite'] text-[#1A1A1A] mb-6" style={{ fontSize: 'clamp(48px, 7vw, 64px)', lineHeight: '1.2' }}>
          ABOUT
        </h1>
      </section>

      {/* Editor's Note - Letter Style */}
      <section className="px-8 py-12 bg-[#EDE6D6]">
        <div className="max-w-3xl mx-auto">
          <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#1A1A1A] leading-relaxed mb-6">
            Dear reader,
          </p>
          <p className="font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A] leading-relaxed mb-6">
            PAGE is a literary journal that exists in the margins of traditional publishing. We believe in slow reading, in giving writers time to develop their voice, in creating space for work that doesn't fit neatly into categories.
          </p>
          <p className="font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A] leading-relaxed mb-6">
            Every platform for writers seemed to prioritize metrics over meaning, engagement over experience. We watched as beautiful essays were flattened into inbox clutter, as poetry was scrolled past in algorithmic feeds, as the intimate act of reading became just another form of content consumption.
          </p>
          <p className="font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A] leading-relaxed mb-6">
            We wanted something different. Not a newsletter service that takes 10% of your revenue. Not a social media feed that rewards frequency over quality. Not another platform optimized for "engagement."
          </p>
          <p className="font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A] leading-relaxed">
            We imagined a digital space that felt more like a gallery than a feed—where each piece of writing could exist in its own room, with its own atmosphere. Where readers could wander rather than scroll. Where the quiet act of reading was honored, not gamified.
          </p>
        </div>
      </section>

      {/* Pull Quote */}
      <section className="px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-['Special_Elite'] text-[28px] text-[#1A1A1A] leading-relaxed">
            "There is no algorithm. Just a nervous system, a lot of tabs open, and a deep love for what people make when they are paying attention."
          </blockquote>
        </div>
      </section>

      {/* Editorial Team - Masthead */}
      <section className="px-8 py-16 bg-[#EDE6D6]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Courier_New'] text-[28px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-12 text-center">
            EDITORIAL TEAM
          </h2>
          
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="pb-6 border-b border-[#1A1A1A]/10">
              <p className="font-['Source_Serif_Pro'] text-[20px] text-[#1A1A1A] mb-1">
                Bea Sophia
              </p>
              <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] text-[#4A4A4A]">
                Editor-in-Chief
              </p>
            </div>

            <div className="pb-6 border-b border-[#1A1A1A]/10">
              <p className="font-['Source_Serif_Pro'] text-[20px] text-[#1A1A1A] mb-1">
                Giove Pierra
              </p>
              <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] text-[#4A4A4A]">
                Head of Print
              </p>
            </div>

            <div className="pb-6 border-b border-[#1A1A1A]/10">
              <p className="font-['Source_Serif_Pro'] text-[20px] text-[#1A1A1A] mb-1">
                Marcus Chen
              </p>
              <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] text-[#4A4A4A]">
                Poetry Editor
              </p>
            </div>

            <div className="pb-6">
              <p className="font-['Source_Serif_Pro'] text-[20px] text-[#1A1A1A] mb-1">
                Alicia Rivera
              </p>
              <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] text-[#4A4A4A]">
                Fiction Editor
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section id="submit" className="px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-['Courier_New'] text-[28px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-8">
            SUBMISSION GUIDELINES
          </h2>
          
          <div className="space-y-6">
            <p className="font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A] leading-relaxed">
              We accept poetry, prose, essays, and hybrid forms. We're looking for work that takes risks, that doesn't fit neatly into categories, that makes us see the world differently.
            </p>
            <p className="font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A] leading-relaxed">
              Submit up to 5 poems or one prose piece (up to 5,000 words). Simultaneous submissions are welcome—just let us know if your work is accepted elsewhere.
            </p>
            <p className="font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A] leading-relaxed">
              Response time is typically 8-12 weeks. We read year-round.
            </p>
            <p className="font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A] leading-relaxed">
              Send submissions to: <a href="mailto:submit@pagegallery.com" className="text-[#8B2500] hover:underline">submit@pagegallery.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-8 py-16 bg-[#EDE6D6]">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-['Courier_New'] text-[28px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-8">
            CONTACT
          </h2>
          
          <form className="space-y-6">
            <div>
              <label className="block font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-2">
                Your Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#8B2500] font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A]"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-2">
                Your Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#8B2500] font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A]"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-2">
                Your Message
              </label>
              <textarea
                rows={8}
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#8B2500] font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A] leading-relaxed resize-none"
                placeholder="Dear Gallery..."
                style={{ borderRadius: 0 }}
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-[#8B2500] text-[#FFFDF8] hover:bg-[#6B1D00] transition-all font-['Courier_New'] text-[14px] uppercase tracking-[0.1em]"
              style={{ borderRadius: 0 }}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

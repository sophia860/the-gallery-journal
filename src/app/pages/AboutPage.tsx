import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { RandomPoemButton } from '../components/RandomPoemButton';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] relative">
      {/* Paper grain texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}></div>

      <GalleryNav />
      <RandomPoemButton />

      {/* Hero - Massive, asymmetric */}
      <section className="pt-40 pb-24 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-16 items-end">
          {/* Left - oversized heading */}
          <div>
            <p className="font-['Courier_New'] text-xs tracking-[0.4em] text-[#8B7355] uppercase mb-6">
              About
            </p>
            <h1 
              className="font-['Playfair_Display'] italic font-light text-[#2C1810]"
              style={{
                fontSize: 'clamp(3rem, 10vw, 8rem)',
                lineHeight: '1.05',
                letterSpacing: '-0.03em',
              }}
            >
              Meet<br />The Gallery
            </h1>
          </div>

          {/* Right - breathing copy */}
          <div className="md:mb-8">
            <p className="font-['Libre_Baskerville'] text-xl md:text-2xl text-[#8B7355] leading-relaxed" style={{ lineHeight: '1.8' }}>
              A digital sanctuary for contemporary writing, where literary excellence meets community
            </p>
          </div>
        </div>
      </section>

      {/* Mission - Full-width, dark background */}
      <section className="px-8 md:px-16 py-24 md:py-32 bg-[#F0E8DC]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl italic font-light text-[#2C1810] mb-12">
            Our Mission
          </h2>
          <p className="font-['Libre_Baskerville'] text-xl md:text-2xl text-[#2C1810] leading-relaxed mb-8" style={{ lineHeight: '1.9' }}>
            To create a space where writers can share their work with dignity and readers can engage with literature in the intimate, contemplative way it deserves.
          </p>
          <p className="font-['Libre_Baskerville'] text-xl md:text-2xl text-[#2C1810]/70 leading-relaxed" style={{ lineHeight: '1.9' }}>
            We believe good writing needs more than a platform—it needs a <em>place</em>: a room with atmosphere, care, and intentional design.
          </p>
        </div>
      </section>

      {/* Our Story - Asymmetric layout */}
      <section className="px-8 md:px-16 py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">
          {/* Left - sticky title */}
          <div className="md:sticky md:top-32 md:h-fit">
            <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl italic font-light text-[#2C1810]">
              Our Story
            </h2>
          </div>

          {/* Right - story text */}
          <div className="space-y-8 font-['Libre_Baskerville'] text-lg text-[#2C1810]" style={{ lineHeight: '1.8' }}>
            <p>
              The Gallery was born from a simple frustration: every platform for writers seemed to prioritize metrics over meaning, engagement over experience. We watched as beautiful essays were flattened into inbox clutter, as poetry was scrolled past in algorithmic feeds.
            </p>
            <p>
              We wanted something different. Not a newsletter service that takes 10% of your revenue. Not a social media feed that rewards frequency over quality. Not another platform optimized for "engagement."
            </p>
            <p>
              We imagined a digital space that felt more like a gallery than a feed—where each piece of writing could exist in its own room, with its own atmosphere. Where readers could wander rather than scroll.
            </p>
            <p>
              The Gallery launched in early 2026 as an experiment in what we call "calm technology for writers." No notification badges. No follower counts. No pressure to post daily.
            </p>
            <p className="text-[#8B7355] italic text-xl">
              "A room of one's own" isn't just our tagline—it's our founding principle.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Team - Print masthead style */}
      <section className="px-8 md:px-16 py-24 md:py-32 bg-[#2C1810] text-[#FAF8F5]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl italic font-light mb-16">
            Editorial Team
          </h2>
          
          {/* Masthead list - no cards, just names */}
          <div className="space-y-12">
            <div className="border-b border-[#FAF8F5]/20 pb-8">
              <h3 className="font-['Libre_Baskerville'] text-3xl mb-2">
                Bea Sophia
              </h3>
              <p className="font-['Courier_New'] text-xs uppercase tracking-[0.2em] text-[#FAF8F5]/60">
                Editor-in-Chief
              </p>
            </div>

            <div className="border-b border-[#FAF8F5]/20 pb-8">
              <h3 className="font-['Libre_Baskerville'] text-3xl mb-2">
                Giove Pierra
              </h3>
              <p className="font-['Courier_New'] text-xs uppercase tracking-[0.2em] text-[#FAF8F5]/60">
                Head of Print
              </p>
            </div>

            <div className="border-b border-[#FAF8F5]/20 pb-8">
              <h3 className="font-['Libre_Baskerville'] text-3xl mb-2">
                Marcus Chen
              </h3>
              <p className="font-['Courier_New'] text-xs uppercase tracking-[0.2em] text-[#FAF8F5]/60">
                Poetry Editor
              </p>
            </div>

            <div className="border-b border-[#FAF8F5]/20 pb-8">
              <h3 className="font-['Libre_Baskerville'] text-3xl mb-2">
                Alicia Rivera
              </h3>
              <p className="font-['Courier_New'] text-xs uppercase tracking-[0.2em] text-[#FAF8F5]/60">
                Fiction Editor
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact - Letter-writing feel */}
      <section className="px-8 md:px-16 py-24 md:py-32 bg-[#F0E8DC]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl italic font-light text-[#2C1810] mb-12">
            Write to Us
          </h2>
          
          <form className="space-y-6">
            <div>
              <label className="block font-['Libre_Baskerville'] text-sm text-[#2C1810] mb-2">
                Your Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border-2 border-[#E0D8D0] focus:border-[#2C1810] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] transition-colors"
                style={{ borderRadius: '2px 8px 2px 8px' }}
              />
            </div>

            <div>
              <label className="block font-['Libre_Baskerville'] text-sm text-[#2C1810] mb-2">
                Your Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white border-2 border-[#E0D8D0] focus:border-[#2C1810] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] transition-colors"
                style={{ borderRadius: '2px 8px 2px 8px' }}
              />
            </div>

            <div>
              <label className="block font-['Libre_Baskerville'] text-sm text-[#2C1810] mb-2">
                Your Message
              </label>
              <textarea
                rows={8}
                className="w-full px-4 py-3 bg-white border-2 border-[#E0D8D0] focus:border-[#2C1810] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] leading-relaxed resize-none transition-colors"
                style={{ borderRadius: '2px 8px 2px 8px' }}
                placeholder="Dear Gallery..."
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-[#2C1810] text-[#FAF8F5] hover:bg-[#1A1A1A] transition-all font-['Libre_Baskerville'] text-base"
              style={{
                borderRadius: '2px 8px 2px 8px',
                boxShadow: '4px 4px 0 rgba(44, 24, 16, 0.1)'
              }}
            >
              Send Letter
            </button>
          </form>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

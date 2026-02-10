import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function GalleryLandingPage() {
  return (
    <div className="min-h-screen bg-[#1B1B8F]">
      <GalleryNav />

      {/* HERO SECTION - Full viewport with deep blue background */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-[#1B1B8F] px-8 relative">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main title */}
          <h1 
            className="font-['Playfair_Display'] italic text-[#F5F0E8] mb-8"
            style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              lineHeight: '1',
              fontWeight: 400,
            }}
          >
            The Page Gallery
          </h1>

          {/* Tagline */}
          <p className="font-['Inter'] text-[#F5F0E8] text-[18px] mb-12 opacity-80 tracking-wide">
            a gallery, but online. a journal, but not academic.
          </p>

          {/* Decorative line */}
          <div className="w-24 h-px bg-[#E8DFC8] mx-auto mb-16"></div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <p className="font-['Inter'] text-[10px] uppercase tracking-[0.3em] text-[#F5F0E8] opacity-60">
            Scroll to Explore
          </p>
        </div>

        {/* Curved divider to cream section */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-[#F5F0E8]"
          style={{
            clipPath: 'ellipse(100% 100% at 50% 100%)',
          }}
        ></div>
      </section>

      {/* CURRENT EXHIBIT - Cream background */}
      <section className="bg-[#F5F0E8] py-32 px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Circular number label */}
          <div className="flex items-center gap-6 mb-12">
            <div 
              className="w-12 h-12 rounded-full border border-[#1B1B8F] flex items-center justify-center"
            >
              <span className="font-['Inter'] text-[14px] text-[#1B1B8F]">01</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1B1B8F]"></div>
              <p className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F]">
                Current Exhibit
              </p>
            </div>
          </div>

          {/* Exhibit content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 
                className="font-['Playfair_Display'] italic text-[#1B1B8F] mb-6"
                style={{
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  lineHeight: '1.1',
                }}
              >
                Along the Oxbow
              </h2>

              <p className="font-['Inter'] text-[16px] text-[#1B1B8F] mb-4">
                Bri Gearhart Staton · Illustrated by Sophia Sharkey
              </p>

              <p className="font-['Playfair_Display'] italic text-[18px] text-[#1B1B8F]/80 mb-8 leading-relaxed">
                An immersive poetry experience where each verse responds to the bend in the river.
              </p>

              <a
                href="https://pagegalleryjournal.com/brigearhartstaton"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#1B1B8F] px-8 py-4 font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F] hover:bg-[#1B1B8F] hover:text-[#F5F0E8] transition-all"
              >
                View Exhibit
              </a>
            </div>

            {/* Placeholder for image/visual */}
            <div className="h-96 border border-[#1B1B8F] flex items-center justify-center">
              <p className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F]/40">
                Exhibit Visual
              </p>
            </div>
          </div>
        </div>

        {/* Curved divider to blue section */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-[#1B1B8F]"
          style={{
            clipPath: 'ellipse(100% 100% at 50% 100%)',
          }}
        ></div>
      </section>

      {/* COLLECTION - Blue background */}
      <section className="bg-[#1B1B8F] py-32 px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Circular number label */}
          <div className="flex items-center gap-6 mb-12">
            <div 
              className="w-12 h-12 rounded-full border border-[#F5F0E8] flex items-center justify-center"
            >
              <span className="font-['Inter'] text-[14px] text-[#F5F0E8]">02</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#F5F0E8]"></div>
              <p className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8]">
                Winter 2026 Collection
              </p>
            </div>
          </div>

          {/* Collection content */}
          <div>
            <h2 
              className="font-['Playfair_Display'] italic text-[#F5F0E8] mb-12"
              style={{
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                lineHeight: '1.1',
              }}
            >
              Five poems by<br />Nix Carlson
            </h2>

            {/* Poem list */}
            <div className="space-y-6 mb-12">
              {[
                "I Thought You'd Been Queer Longer Than That",
                'Polyamory',
                'Yes',
                'Reasons You Refuse to Date Me',
                'I Probably L*ve You',
              ].map((title, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8DFC8] mt-2 flex-shrink-0"></div>
                  <a
                    href="https://pagegalleryjournal.com/nixcarlson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Inter'] text-[18px] text-[#F5F0E8] hover:text-[#E8DFC8] transition-colors"
                  >
                    {title}
                  </a>
                </div>
              ))}
            </div>

            <a
              href="/collection-gallery"
              className="inline-block border border-[#F5F0E8] px-8 py-4 font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8] hover:bg-[#F5F0E8] hover:text-[#1B1B8F] transition-all"
            >
              View Collection
            </a>
          </div>
        </div>

        {/* Curved divider to cream section */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-[#F5F0E8]"
          style={{
            clipPath: 'ellipse(100% 100% at 50% 100%)',
          }}
        ></div>
      </section>

      {/* SUBMIT - Cream background */}
      <section className="bg-[#F5F0E8] py-32 px-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Circular number label */}
          <div className="flex items-center gap-6 mb-12">
            <div 
              className="w-12 h-12 rounded-full border border-[#1B1B8F] flex items-center justify-center"
            >
              <span className="font-['Inter'] text-[14px] text-[#1B1B8F]">03</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1B1B8F]"></div>
              <p className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F]">
                Submit Your Work
              </p>
            </div>
          </div>

          <h2 
            className="font-['Playfair_Display'] italic text-[#1B1B8F] mb-8"
            style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              lineHeight: '1.1',
            }}
          >
            We accept poetry,<br />prose, and hybrid forms
          </h2>

          <p className="font-['Inter'] text-[16px] text-[#1B1B8F] mb-12 max-w-2xl">
            Work that doesn't fit neatly into categories. Writing that breathes. Pieces that stay with us after we close the tab.
          </p>

          {/* Contact form */}
          <form className="space-y-6 max-w-2xl">
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-6 py-4 bg-transparent border border-[#1B1B8F] font-['Inter'] text-[14px] text-[#1B1B8F] placeholder:text-[#1B1B8F]/40"
                style={{ borderRadius: 0 }}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-6 py-4 bg-transparent border border-[#1B1B8F] font-['Inter'] text-[14px] text-[#1B1B8F] placeholder:text-[#1B1B8F]/40"
                style={{ borderRadius: 0 }}
              />
            </div>
            <div>
              <textarea
                placeholder="Your submission or message"
                rows={6}
                className="w-full px-6 py-4 bg-transparent border border-[#1B1B8F] font-['Inter'] text-[14px] text-[#1B1B8F] placeholder:text-[#1B1B8F]/40 resize-none"
                style={{ borderRadius: 0 }}
              ></textarea>
            </div>
            <button
              type="submit"
              className="border border-[#1B1B8F] px-8 py-4 font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F] hover:bg-[#1B1B8F] hover:text-[#F5F0E8] transition-all"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Curved divider to blue section */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-[#1B1B8F]"
          style={{
            clipPath: 'ellipse(100% 100% at 50% 100%)',
          }}
        ></div>
      </section>

      {/* ABOUT - Blue background */}
      <section className="bg-[#1B1B8F] py-32 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Circular number label */}
          <div className="flex items-center gap-6 mb-12">
            <div 
              className="w-12 h-12 rounded-full border border-[#F5F0E8] flex items-center justify-center"
            >
              <span className="font-['Inter'] text-[14px] text-[#F5F0E8]">04</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#F5F0E8]"></div>
              <p className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8]">
                About
              </p>
            </div>
          </div>

          <h2 
            className="font-['Playfair_Display'] italic text-[#F5F0E8] mb-8"
            style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              lineHeight: '1.1',
            }}
          >
            A literary journal that exists in the margins
          </h2>

          <div className="space-y-6 font-['Inter'] text-[18px] text-[#F5F0E8]/90 leading-relaxed max-w-3xl">
            <p>
              PAGE is a literary journal that exists in the margins of traditional publishing. We believe in slow reading, in giving writers time to develop their voice, in creating space for work that doesn't fit neatly into categories.
            </p>
            <p>
              Each issue is a curated exhibition—poems, prose, and hybrid forms that speak to the moment we're living through.
            </p>
            <p className="font-['Playfair_Display'] italic text-[24px] text-[#E8DFC8] mt-12">
              "There is no algorithm. Just a nervous system, a lot of tabs open, and a deep love for what people make when they are paying attention."
            </p>
          </div>

          <div className="mt-12">
            <a
              href="/about"
              className="inline-block border border-[#F5F0E8] px-8 py-4 font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8] hover:bg-[#F5F0E8] hover:text-[#1B1B8F] transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}
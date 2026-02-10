import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { RandomPoemButton } from '../components/RandomPoemButton';

export function GalleryLandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />
      <RandomPoemButton />

      {/* Hero - LEFT-ALIGNED, generous whitespace */}
      <section className="px-8 py-32" style={{ paddingLeft: '8%' }}>
        <div className="max-w-4xl">
          <h1 className="font-['Special_Elite'] text-[#1A1A1A] mb-8 text-left" style={{ fontSize: 'clamp(56px, 7vw, 64px)', lineHeight: '1.2' }}>
            THE PAGE GALLERY
          </h1>
          <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#4A4A4A] mb-12 leading-relaxed text-left">
            a gallery, but online. a journal, but not academic.
          </p>
          <div className="w-[40%] h-px bg-[#4A4A4A]"></div>
        </div>
      </section>

      {/* FOYER - Featured Poem */}
      <section className="px-8 py-24 bg-[#F0E8DC]" style={{ boxShadow: 'inset 0 0 40px rgba(44,24,16,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          {/* Wall number */}
          <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.4em] text-[#4A4A4A] mb-6">
            Wall 01
          </p>

          {/* Poem Title */}
          <h2 className="font-['Special_Elite'] text-[#1A1A1A] mb-8" style={{ fontSize: 'clamp(32px, 6vw, 48px)', lineHeight: '1.2' }}>
            IT WILL TAKE SEVEN YEARS TO DIGEST THIS POEM
          </h2>

          {/* Poem Excerpt - ONLY the one real line provided */}
          <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#1A1A1A] mb-8 leading-relaxed">
            which, coincidentally, is how long they say it takes to replace every cell in your body.
          </p>

          {/* Attribution */}
          <div className="border-l-2 border-[#8B2500] pl-6">
            <p className="font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A]">
              Nix Carlson
            </p>
            <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] text-[#4A4A4A] mt-1">
              Winter 2026 Collection
            </p>
          </div>
        </div>
      </section>

      {/* Current Exhibit Section - 2-column grid */}
      <section className="px-8 py-16 bg-[#FAF8F5]" style={{ boxShadow: 'inset 0 0 40px rgba(44,24,16,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-['Courier_New'] text-[28px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-12">
            CURRENT EXHIBIT
          </h2>

          {/* 2-column grid: 2fr 1fr */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 mb-12 pb-12 border-b border-[#1A1A1A]/10">
            <div>
              <h3 className="font-['Courier_New'] text-[20px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-4">
                ALONG THE OXBOW
              </h3>
              <p className="font-['Source_Serif_Pro'] text-[16px] text-[#4A4A4A] mb-2">
                Bri Gearhart Staton · Illustrated by Sophia Sharkey
              </p>
              <p className="font-['Source_Serif_Pro'] italic text-[16px] text-[#4A4A4A] mb-6">
                An immersive poetry experience where each verse responds to the bend in the river.
              </p>
              <a
                href="https://pagegalleryjournal.com/brigearhartstaton"
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] hover:text-[#8B2500]"
              >
                VIEW EXHIBIT →
              </a>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full h-48 bg-[#E8E3D8] flex items-center justify-center">
                <p className="font-['Courier_New'] text-[12px] text-[#4A4A4A]">[illustration]</p>
              </div>
            </div>
          </div>

          {/* Winter Collection */}
          <div>
            <h3 className="font-['Courier_New'] text-[20px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-6">
              WINTER 2026 COLLECTION
            </h3>
            <p className="font-['Source_Serif_Pro'] text-[16px] text-[#4A4A4A] mb-8">
              Five poems by Nix Carlson
            </p>

            {/* Typed list - NO excerpts */}
            <div className="space-y-4">
              <div className="border-b border-[#1A1A1A]/10 pb-3">
                <a
                  href="https://pagegalleryjournal.com/nixcarlson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-[#8B2500] transition-colors"
                >
                  <p className="font-['Courier_New'] text-[16px] text-[#1A1A1A]">
                    I Thought You'd Been Queer Longer Than That
                  </p>
                  <p className="font-['Source_Serif_Pro'] text-[14px] text-[#4A4A4A] mt-1">
                    Nix Carlson · Self & Introspection
                  </p>
                </a>
              </div>

              <div className="border-b border-[#1A1A1A]/10 pb-3">
                <a
                  href="https://pagegalleryjournal.com/nixcarlson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-[#8B2500] transition-colors"
                >
                  <p className="font-['Courier_New'] text-[16px] text-[#1A1A1A]">
                    Polyamory
                  </p>
                  <p className="font-['Source_Serif_Pro'] text-[14px] text-[#4A4A4A] mt-1">
                    Nix Carlson · Love & Relationships
                  </p>
                </a>
              </div>

              <div className="border-b border-[#1A1A1A]/10 pb-3">
                <a
                  href="https://pagegalleryjournal.com/nixcarlson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-[#8B2500] transition-colors"
                >
                  <p className="font-['Courier_New'] text-[16px] text-[#1A1A1A]">
                    Yes
                  </p>
                  <p className="font-['Source_Serif_Pro'] text-[14px] text-[#4A4A4A] mt-1">
                    Nix Carlson · Love & Relationships
                  </p>
                </a>
              </div>

              <div className="border-b border-[#1A1A1A]/10 pb-3">
                <a
                  href="https://pagegalleryjournal.com/nixcarlson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-[#8B2500] transition-colors"
                >
                  <p className="font-['Courier_New'] text-[16px] text-[#1A1A1A]">
                    Reasons You Refuse to Date Me
                  </p>
                  <p className="font-['Source_Serif_Pro'] text-[14px] text-[#4A4A4A] mt-1">
                    Nix Carlson · Love & Relationships
                  </p>
                </a>
              </div>

              <div className="border-b border-[#1A1A1A]/10 pb-3">
                <a
                  href="https://pagegalleryjournal.com/nixcarlson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-[#8B2500] transition-colors"
                >
                  <p className="font-['Courier_New'] text-[16px] text-[#1A1A1A]">
                    I Probably L*ve You
                  </p>
                  <p className="font-['Source_Serif_Pro'] text-[14px] text-[#4A4A4A] mt-1">
                    Nix Carlson · Love & Relationships
                  </p>
                </a>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="/collection-gallery"
                className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] hover:text-[#8B2500]"
              >
                VIEW FULL COLLECTION →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About / Mission - Pull Quote - Dramatic dark section */}
      <section className="px-8 py-24 bg-[#2C1810]" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-['Special_Elite'] text-[24px] text-[#FAF8F5] leading-relaxed">
            "There is no algorithm. Just a nervous system, a lot of tabs open, and a deep love for what people make when they are paying attention."
          </blockquote>
          <div className="mt-8">
            <a
              href="/about"
              className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#FAF8F5] hover:text-[#8B2500]"
            >
              READ MORE →
            </a>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

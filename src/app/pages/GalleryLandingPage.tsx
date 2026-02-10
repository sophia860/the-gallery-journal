import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function GalleryLandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] relative">
      {/* Paper grain texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      <GalleryNav />

      {/* Gallery Foyer - Asymmetric Featured Exhibit */}
      <section className="relative px-8 py-32 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          {/* Featured exhibit card - asymmetric positioning */}
          <div 
            className="relative inline-block border border-dashed p-12"
            style={{
              marginLeft: '15%',
              transform: 'rotate(-1deg)',
              borderColor: '#c4b5a0',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              maxWidth: '600px'
            }}
          >
            {/* Gallery label - handwritten */}
            <p className="font-['Caveat'] text-2xl text-[#7d8471] mb-4">
              Now Showing
            </p>

            {/* Exhibit title - large italic Playfair */}
            <h1 
              className="font-['Playfair_Display'] italic text-[#2c2416] mb-6"
              style={{
                fontSize: 'clamp(3rem, 6vw, 6rem)',
                lineHeight: '1.1',
                fontWeight: 400
              }}
            >
              Along the<br />Oxbow
            </h1>

            {/* Hand-drawn decorative line */}
            <svg 
              viewBox="0 0 200 20" 
              className="w-48 mb-6"
              style={{ opacity: 0.4 }}
            >
              <path
                d="M 0 10 Q 25 5, 50 10 T 100 10 T 150 10 T 200 10"
                stroke="#c4b5a0"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Exhibit details */}
            <p className="font-['Source_Serif_4'] text-[18px] text-[#2c2416] mb-3 leading-relaxed">
              Written by Bri Gearhart Staton<br />
              Illustrated by Sophia Sharkey
            </p>

            <p className="font-['Source_Serif_4'] italic text-[16px] text-[#7d8471] mb-8 leading-relaxed">
              An immersive poetry experience where each verse responds to the bend in the river.
            </p>

            <a
              href="https://pagegalleryjournal.com/brigearhartstaton"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#a0522d] hover:text-[#2c2416] transition-colors border-b border-[#a0522d]"
            >
              Enter Exhibit
            </a>
          </div>

          {/* Secondary featured - Winter Collection */}
          <div 
            className="mt-32 ml-auto relative"
            style={{ maxWidth: '500px', marginRight: '12%' }}
          >
            <p className="font-['Caveat'] text-2xl text-[#7d8471] mb-4">
              Winter 2026 Collection
            </p>

            <h2 className="font-['Playfair_Display'] italic text-[#2c2416] text-5xl mb-6" style={{ lineHeight: '1.2' }}>
              Five Poems
            </h2>

            <p className="font-['Source_Serif_4'] text-[16px] text-[#2c2416] mb-6">
              Nix Carlson
            </p>

            <p className="font-['Source_Serif_4'] italic text-[16px] text-[#7d8471] mb-8 leading-relaxed">
              Identity, desire, love, and the spaces between words
            </p>

            <a
              href="/collection-gallery"
              className="inline-block font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#a0522d] hover:text-[#2c2416] transition-colors border-b border-[#a0522d]"
            >
              View Collection
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Statement - Off-center */}
      <section className="px-8 py-24 relative">
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative p-16 border border-dashed"
            style={{
              borderColor: '#c4b5a0',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              marginLeft: '8%'
            }}
          >
            <blockquote className="font-['Playfair_Display'] italic text-[#2c2416] text-3xl leading-relaxed mb-6">
              "There is no algorithm. Just a nervous system, a lot of tabs open, and a deep love for what people make when they are paying attention."
            </blockquote>

            <p className="font-['Caveat'] text-xl text-[#7d8471]">
              — The Gallery
            </p>

            <div className="mt-8">
              <a
                href="/about"
                className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#a0522d] hover:text-[#2c2416] transition-colors border-b border-[#a0522d]"
              >
                About the Gallery
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Current Exhibits List */}
      <section className="px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Caveat'] text-4xl text-[#7d8471] mb-12" style={{ marginLeft: '10%' }}>
            All Current Exhibits
          </h2>

          <div className="space-y-12">
            {/* Winter Collection Poems List */}
            <div 
              className="pb-12 border-b"
              style={{ 
                borderColor: 'rgba(196,181,160,0.3)',
                marginLeft: '10%'
              }}
            >
              <h3 className="font-['Playfair_Display'] text-2xl text-[#2c2416] mb-4">
                Winter 2026 Collection
              </h3>
              <p className="font-['Source_Serif_4'] text-[16px] text-[#7d8471] mb-6">
                Five poems by Nix Carlson
              </p>

              <div className="space-y-3">
                <div>
                  <a
                    href="https://pagegalleryjournal.com/nixcarlson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Source_Serif_4'] text-[16px] text-[#2c2416] hover:text-[#a0522d] transition-colors"
                  >
                    I Thought You'd Been Queer Longer Than That
                  </a>
                </div>
                <div>
                  <a
                    href="https://pagegalleryjournal.com/nixcarlson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Source_Serif_4'] text-[16px] text-[#2c2416] hover:text-[#a0522d] transition-colors"
                  >
                    Polyamory
                  </a>
                </div>
                <div>
                  <a
                    href="https://pagegalleryjournal.com/nixcarlson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Source_Serif_4'] text-[16px] text-[#2c2416] hover:text-[#a0522d] transition-colors"
                  >
                    Yes
                  </a>
                </div>
                <div>
                  <a
                    href="https://pagegalleryjournal.com/nixcarlson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Source_Serif_4'] text-[16px] text-[#2c2416] hover:text-[#a0522d] transition-colors"
                  >
                    Reasons You Refuse to Date Me
                  </a>
                </div>
                <div>
                  <a
                    href="https://pagegalleryjournal.com/nixcarlson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Source_Serif_4'] text-[16px] text-[#2c2416] hover:text-[#a0522d] transition-colors"
                  >
                    I Probably L*ve You
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="/collection-gallery"
                  className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#a0522d] hover:text-[#2c2416] transition-colors border-b border-[#a0522d]"
                >
                  View Full Collection
                </a>
              </div>
            </div>

            {/* Along the Oxbow */}
            <div 
              className="pb-12"
              style={{ marginLeft: '10%' }}
            >
              <h3 className="font-['Playfair_Display'] text-2xl text-[#2c2416] mb-4">
                Along the Oxbow
              </h3>
              <p className="font-['Source_Serif_4'] text-[16px] text-[#7d8471] mb-6">
                Bri Gearhart Staton · Illustrated by Sophia Sharkey
              </p>
              <a
                href="https://pagegalleryjournal.com/brigearhartstaton"
                target="_blank"
                rel="noopener noreferrer"
                className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#a0522d] hover:text-[#2c2416] transition-colors border-b border-[#a0522d]"
              >
                Enter Exhibit
              </a>
            </div>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

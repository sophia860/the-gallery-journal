import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function GalleryLandingPage() {
  return (
    <div className="min-h-screen bg-[#1B1B8F]">
      <GalleryNav />

      {/* HERO SECTION - Gateway to both systems */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-[#1B1B8F] px-8 relative pt-20">
        <div className="max-w-5xl mx-auto text-center mb-16">
          {/* Main title */}
          <h1 
            className="font-['Cardo'] italic text-white mb-8"
            style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              lineHeight: '1',
              fontWeight: 400,
            }}
          >
            The Page Gallery
          </h1>

          {/* Tagline */}
          <p className="font-['Cardo'] text-white/80 text-[20px] mb-16 leading-relaxed">
            a gallery, but online. a journal, but not academic.
          </p>

          {/* Two entry cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Enter the Gallery */}
            <a
              href="/exhibits"
              className="group bg-[#F5F0E8] p-12 border border-[#1B1B8F] hover:bg-white transition-all"
            >
              <h2 className="font-['Cardo'] italic text-4xl text-[#1B1B8F] mb-4">
                Enter the Gallery
              </h2>
              <p className="font-['Cardo'] text-[16px] text-[#1B1B8F]/70 mb-6">
                Curated exhibits, poetry collections, and literary art
              </p>
              <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#1B1B8F] group-hover:underline">
                EXPLORE →
              </span>
            </a>

            {/* Enter the Garden */}
            <a
              href="/garden"
              className="group bg-[#F5F0E8] p-12 border border-[#1B1B8F] hover:bg-white transition-all"
            >
              <h2 className="font-['Cardo'] italic text-4xl text-[#1B1B8F] mb-4 flex items-center gap-2">
                <span>🌿</span>
                Enter the Garden
              </h2>
              <p className="font-['Cardo'] text-[16px] text-[#1B1B8F]/70 mb-6">
                Your personal writing space to plant ideas and nurture drafts
              </p>
              <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#1B1B8F] group-hover:underline">
                BEGIN WRITING →
              </span>
            </a>
          </div>
        </div>

        {/* Curved divider */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-[#F5F0E8]"
          style={{ clipPath: 'ellipse(100% 100% at 50% 100%)' }}
        ></div>
      </section>

      {/* SECTION 01 - ALONG THE OXBOW */}
      <section className="bg-[#F5F0E8] py-32 px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-12 h-12 rounded-full border border-[#1B1B8F] flex items-center justify-center">
              <span className="font-['Courier_New'] text-[14px] text-[#1B1B8F]">01</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1B1B8F]"></div>
              <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F]">
                Current Exhibit
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-['Cardo'] italic text-[#1B1B8F] text-6xl mb-6">
                Along the Oxbow
              </h2>
              <p className="font-['Cardo'] text-[18px] text-[#1B1B8F] mb-4">
                Bri Gearhart Staton · Illustrated by Sophia Sharkey
              </p>
              <p className="font-['Cardo'] italic text-[18px] text-[#1B1B8F]/80 mb-8 leading-relaxed">
                An immersive poetry experience where each verse responds to the bend in the river.
              </p>
              <a
                href="https://pagegalleryjournal.com/brigearhartstaton"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#1B1B8F] px-8 py-4 font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F] hover:bg-[#1B1B8F] hover:text-[#F5F0E8] transition-all"
              >
                View Exhibit
              </a>
            </div>
            <div className="h-96 border border-[#1B1B8F] flex items-center justify-center">
              <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F]/40">
                Exhibit Visual
              </p>
            </div>
          </div>
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-[#1B1B8F]"
          style={{ clipPath: 'ellipse(100% 100% at 50% 100%)' }}
        ></div>
      </section>

      {/* SECTION 02 - WINTER COLLECTION */}
      <section className="bg-[#1B1B8F] py-32 px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <span className="font-['Courier_New'] text-[14px] text-white">02</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] text-white">
                Winter 2026 Collection
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-['Cardo'] italic text-white text-6xl mb-12">
              Five poems by<br />Nix Carlson
            </h2>
            <div className="space-y-6 mb-12">
              {[
                "I Thought You'd Been Queer Longer Than That",
                'Polyamory',
                'Yes',
                'Reasons You Refuse to Date Me',
                'I Probably L*ve You',
              ].map((title, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                  <a
                    href="https://pagegalleryjournal.com/nixcarlson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Cardo'] text-[20px] text-white hover:text-white/70 transition-colors"
                  >
                    {title}
                  </a>
                </div>
              ))}
            </div>
            <a
              href="/collection-gallery"
              className="inline-block border border-white px-8 py-4 font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-[#1B1B8F] transition-all"
            >
              View Collection
            </a>
          </div>
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-[#F5F0E8]"
          style={{ clipPath: 'ellipse(100% 100% at 50% 100%)' }}
        ></div>
      </section>

      {/* SECTION 03 - SUBMIT */}
      <section className="bg-[#F5F0E8] py-32 px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-12 h-12 rounded-full border border-[#1B1B8F] flex items-center justify-center">
              <span className="font-['Courier_New'] text-[14px] text-[#1B1B8F]">03</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1B1B8F]"></div>
              <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F]">
                Submit Your Work
              </p>
            </div>
          </div>

          <h2 className="font-['Cardo'] italic text-[#1B1B8F] text-6xl mb-8">
            We accept poetry,<br />prose, and hybrid forms
          </h2>
          <p className="font-['Cardo'] text-[18px] text-[#1B1B8F] mb-12 max-w-2xl">
            Work that doesn't fit neatly into categories. Writing that breathes.
          </p>
          <a
            href="/submit"
            className="inline-block border border-[#1B1B8F] px-8 py-4 font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F] hover:bg-[#1B1B8F] hover:text-[#F5F0E8] transition-all"
          >
            Submit
          </a>
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-[#1B1B8F]"
          style={{ clipPath: 'ellipse(100% 100% at 50% 100%)' }}
        ></div>
      </section>

      {/* SECTION 04 - ABOUT */}
      <section className="bg-[#1B1B8F] py-32 px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <span className="font-['Courier_New'] text-[14px] text-white">04</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] text-white">
                About
              </p>
            </div>
          </div>

          <h2 className="font-['Cardo'] italic text-white text-6xl mb-8">
            A literary journal that exists in the margins
          </h2>
          <div className="space-y-6 font-['Cardo'] text-[18px] text-white/90 leading-relaxed max-w-3xl">
            <p>
              PAGE is a literary journal that exists in the margins of traditional publishing. We believe in slow reading, in giving writers time to develop their voice.
            </p>
            <p className="italic text-[24px] text-white mt-12">
              "There is no algorithm. Just a nervous system, a lot of tabs open, and a deep love for what people make when they are paying attention."
            </p>
          </div>
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-[#F5F0E8]"
          style={{ clipPath: 'ellipse(100% 100% at 50% 100%)' }}
        ></div>
      </section>

      {/* SECTION 05 - FROM THE GARDEN */}
      <section className="bg-[#F5F0E8] py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-12 h-12 rounded-full border border-[#1B1B8F] flex items-center justify-center">
              <span className="font-['Courier_New'] text-[14px] text-[#1B1B8F]">05</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1B1B8F]"></div>
              <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F]">
                From the Garden
              </p>
            </div>
          </div>

          <h2 className="font-['Cardo'] italic text-[#1B1B8F] text-6xl mb-12">
            Recent writing from our community
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { author: 'Sarah M.', snippet: 'The light through winter trees...', state: 'Bloom' },
              { author: 'James K.', snippet: 'Memory is a kind of architecture...', state: 'Sprout' },
              { author: 'Alex R.', snippet: 'What is a home but a collection...', state: 'Seed' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 border border-[#1B1B8F]/20">
                <p className="font-['Cardo'] italic text-[16px] text-[#1B1B8F] mb-4">{item.snippet}</p>
                <div className="flex items-center justify-between">
                  <span className="font-['Courier_New'] text-[11px] text-[#1B1B8F]/60">{item.author}</span>
                  <span className="font-['Courier_New'] text-[11px] text-[#1B1B8F]">{item.state}</span>
                </div>
              </div>
            ))}
          </div>

          <a
            href="/garden"
            className="inline-block border border-[#1B1B8F] px-8 py-4 font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F] hover:bg-[#1B1B8F] hover:text-[#F5F0E8] transition-all"
          >
            Visit the Garden
          </a>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

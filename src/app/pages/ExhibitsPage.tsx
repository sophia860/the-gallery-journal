import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function ExhibitsPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />

      {/* Header */}
      <section className="px-8 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-['Special_Elite'] text-[56px] text-[#1A1A1A] mb-8" style={{ lineHeight: '1.2' }}>
            EXHIBITS
          </h1>
          <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#4A4A4A] mb-12 leading-relaxed">
            Immersive literary experiences
          </p>
          <div className="w-[40%] h-px bg-[#4A4A4A] mx-auto"></div>
        </div>
      </section>

      {/* Current Exhibits */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Courier_New'] text-[28px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-12">
            CURRENT
          </h2>

          {/* Along the Oxbow */}
          <div className="mb-12 pb-12 border-b border-[#1A1A1A]/10">
            <h3 className="font-['Courier_New'] text-[20px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-4">
              ALONG THE OXBOW
            </h3>
            <p className="font-['Source_Serif_Pro'] text-[16px] text-[#4A4A4A] mb-2">
              Written by Bri Gearhart Staton · Illustrated by Sophia Sharkey
            </p>
            <p className="font-['Source_Serif_Pro'] italic text-[16px] text-[#4A4A4A] mb-6">
              An immersive poetry experience where each verse responds to the bend in the river.
            </p>
            <a
              href="https://pagegalleryjournal.com/brigearhartstaton"
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#8B2500] hover:underline"
            >
              VIEW EXHIBIT →
            </a>
          </div>

          {/* Winter Collection */}
          <div className="mb-12 pb-12 border-b border-[#1A1A1A]/10">
            <h3 className="font-['Courier_New'] text-[20px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-4">
              WINTER 2026 COLLECTION
            </h3>
            <p className="font-['Source_Serif_Pro'] text-[16px] text-[#4A4A4A] mb-2">
              Five poems by Nix Carlson
            </p>
            <p className="font-['Source_Serif_Pro'] italic text-[16px] text-[#4A4A4A] mb-6">
              Identity, desire, love, and the spaces between words
            </p>
            <a
              href="/collection-gallery"
              className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#8B2500] hover:underline"
            >
              VIEW COLLECTION →
            </a>
          </div>

          <div className="text-center py-12">
            <p className="font-['Source_Serif_Pro'] italic text-[16px] text-[#4A4A4A]">
              More exhibits coming soon
            </p>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

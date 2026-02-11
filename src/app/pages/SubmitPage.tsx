import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function SubmitPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />

      {/* Main Content */}
      <section className="px-8 py-32 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-['Cardo'] italic text-[64px] text-[#1B1B8F] mb-8" style={{ lineHeight: '1.2' }}>
            Submit Through The Garden
          </h1>
          <p className="font-['Cardo'] text-[24px] text-[#4A4A4A] mb-12 leading-relaxed max-w-2xl mx-auto">
            All submissions to The Page Gallery happen through The Garden. Write, revise, and submit directly to our editors.
          </p>
          
          <a
            href="/garden"
            className="inline-block px-12 py-5 bg-[#1B1B8F] text-[#F5F0E8] font-['Courier_New'] text-[13px] uppercase tracking-[0.2em] hover:bg-[#252599] transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
          >
            GO TO THE GARDEN
          </a>

          <div className="mt-16 p-8 border-2 border-[#1B1B8F]/20 bg-white/50">
            <p className="font-['Cardo'] italic text-[18px] text-[#4A4A4A]">
              Plant your seeds, grow your drafts, and when ready, submit directly to our editors for review.
            </p>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

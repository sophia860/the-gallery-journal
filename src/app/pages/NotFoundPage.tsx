import { GalleryNav } from '../components/GalleryNav';
import { Footer } from '../components/Footer';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <GalleryNav />
      
      <div className="flex-1 flex items-center justify-center px-8 py-32">
        <div className="max-w-2xl text-center">
          <h1 className="font-['Cardo'] text-7xl text-[#2C2C2C] mb-6 italic">
            Lost between the pages...
          </h1>
          
          <div className="mb-12">
            <p className="font-['Libre_Baskerville'] text-lg text-[#717171] leading-relaxed italic mb-4">
              The story you seek has wandered
            </p>
            <p className="font-['Libre_Baskerville'] text-lg text-[#717171] leading-relaxed italic mb-4">
              into chapters yet unwritten,
            </p>
            <p className="font-['Libre_Baskerville'] text-lg text-[#717171] leading-relaxed italic">
              Perhaps it was never here at all.
            </p>
          </div>

          <div className="text-9xl mb-12 font-['Cardo'] text-[#E0D8D0]">
            404
          </div>

          <a
            href="/"
            className="inline-block px-8 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Courier_New'] text-sm tracking-wider shadow-lg hover:shadow-xl"
          >
            RETURN TO THE GALLERY
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

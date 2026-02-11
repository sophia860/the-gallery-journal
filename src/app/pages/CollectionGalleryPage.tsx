import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { ParallaxStarfield } from '../components/ParallaxStarfield';

export function CollectionGalleryPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      {/* Starfield background */}
      <ParallaxStarfield />

      <GalleryNav />

      {/* Coming Soon Content */}
      <div className="min-h-screen flex items-center justify-center px-8 relative z-10">
        <div className="text-center">
          <h1
            className="font-['Playfair_Display'] italic text-[#f5f0e8] mb-6"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: '1.1',
              fontWeight: 400,
              textShadow: '0 0 40px rgba(196, 164, 108, 0.3)',
            }}
          >
            Coming Soon
          </h1>
          <p className="font-['Cormorant_Garamond'] text-[20px] text-[#8b9dc3]" style={{ lineHeight: '1.8' }}>
            Our inaugural collection is currently being curated
          </p>
        </div>
      </div>

      <GalleryFooter />
    </div>
  );
}

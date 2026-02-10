import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

interface PiecePageProps {
  pieceId: string;
}

export function PiecePage({ pieceId }: PiecePageProps) {
  // Mock piece data - in production this would be fetched
  const piece = {
    id: pieceId,
    title: 'I Thought You\'d Been Queer Longer Than That',
    author: 'Nix Carlson',
    type: 'Poem',
    date: 'February 2026',
    authorBio: 'Nix Carlson writes about identity, love, and the spaces between words. Their work has appeared in various literary journals.',
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />

      {/* Piece Content - Centered Column */}
      <section className="px-8 py-24">
        <div className="max-w-[650px] mx-auto">
          {/* Title */}
          <h1 className="font-['Special_Elite'] text-[#1A1A1A] mb-6" style={{ fontSize: 'clamp(36px, 6vw, 48px)', lineHeight: '1.2' }}>
            {piece.title}
          </h1>

          {/* Author Name */}
          <p className="font-['Courier_New'] text-[14px] text-[#4A4A4A] mb-12 uppercase tracking-[0.1em]">
            {piece.author}
          </p>

          {/* Poem Text - Placeholder */}
          <div className="font-['Source_Serif_Pro'] text-[18px] text-[#1A1A1A] mb-16" style={{ lineHeight: '1.9' }}>
            <p className="italic mb-8">
              [The full poem would appear here]
            </p>
            <p className="text-[#4A4A4A]">
              Visit the published exhibit to read the complete piece:<br />
              <a 
                href="https://pagegalleryjournal.com/nixcarlson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8B2500] hover:underline"
              >
                pagegalleryjournal.com/nixcarlson
              </a>
            </p>
          </div>

          {/* Author Bio */}
          <div className="pt-8 border-t border-[#1A1A1A]/10">
            <p className="font-['Courier_New'] text-[14px] text-[#4A4A4A] leading-relaxed mb-8">
              {piece.authorBio}
            </p>
          </div>

          {/* Back Link */}
          <a
            href="/collection-gallery"
            className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] hover:text-[#8B2500]"
          >
            ← BACK TO EXHIBIT
          </a>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

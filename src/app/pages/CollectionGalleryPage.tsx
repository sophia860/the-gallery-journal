import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

// Real poems from Winter 2026 issue - titles only, NO fabricated content
const winterPoems = [
  {
    id: '1',
    title: 'I Thought You\'d Been Queer Longer Than That',
    author: 'Nix Carlson',
    category: 'Self & Introspection',
  },
  {
    id: '2',
    title: 'Polyamory',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
  },
  {
    id: '3',
    title: 'Yes',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
  },
  {
    id: '4',
    title: 'Reasons You Refuse to Date Me',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
  },
  {
    id: '5',
    title: 'I Probably L*ve You',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
  },
];

export function CollectionGalleryPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />

      {/* Header */}
      <section className="px-8 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-4">
            Winter 2026
          </p>
          <h1 className="font-['Special_Elite'] text-[56px] text-[#1A1A1A] mb-8" style={{ lineHeight: '1.2' }}>
            THE COLLECTION
          </h1>
          <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#4A4A4A] mb-12 leading-relaxed">
            Five pieces on belonging, identity, and the spaces we create for love
          </p>
          <div className="w-[40%] h-px bg-[#4A4A4A] mx-auto"></div>
        </div>
      </section>

      {/* Poems */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {winterPoems.map((poem, index) => (
            <div key={poem.id} className="pb-16 border-b border-[#1A1A1A]/10">
              <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.3em] text-[#4A4A4A] mb-4">
                Wall {String(index + 1).padStart(2, '0')}
              </p>
              
              <h2 className="font-['Special_Elite'] text-[36px] text-[#1A1A1A] mb-6" style={{ lineHeight: '1.3' }}>
                {poem.title}
              </h2>

              <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#4A4A4A] mb-8">
                Visit the exhibit to read this piece
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A]">
                    {poem.author}
                  </p>
                  <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] text-[#4A4A4A] mt-1">
                    {poem.category}
                  </p>
                </div>

                <a
                  href="https://pagegalleryjournal.com/nixcarlson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#8B2500] hover:underline"
                >
                  READ FULL PIECE →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Back to Gallery */}
      <section className="px-8 pb-24 text-center">
        <a
          href="/"
          className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#8B2500] hover:underline"
        >
          ← BACK TO GALLERY
        </a>
      </section>

      <GalleryFooter />
    </div>
  );
}

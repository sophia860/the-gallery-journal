import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

interface ExhibitPageProps {
  exhibitId: string;
}

export function ExhibitPage({ exhibitId }: ExhibitPageProps) {
  // Mock exhibit data - in production this would be fetched
  const exhibit = {
    id: exhibitId,
    title: 'Along the Oxbow',
    curator: 'Bri Gearhart Staton',
    illustrator: 'Sophia Sharkey',
    note: 'An immersive poetry experience where each verse responds to the bend in the river.',
    month: 'February',
    year: '2026',
    poems: [
      { title: 'River Bend', author: 'Bri Gearhart Staton', category: 'Nature & Place' },
      { title: 'Oxbow Memory', author: 'Bri Gearhart Staton', category: 'Time & Memory' },
      { title: 'Water\'s Edge', author: 'Bri Gearhart Staton', category: 'Nature & Place' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#EDE6D6]">
      <GalleryNav />

      {/* Exhibit Header */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Margin annotation */}
          <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] text-[#4A4A4A] mb-6">
            [{exhibit.month.toLowerCase()} exhibit]
          </p>

          <h1 className="font-['Courier_New'] text-[#1A1A1A] mb-8" style={{ fontSize: 'clamp(36px, 6vw, 48px)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            {exhibit.title}
          </h1>

          {/* Curator Note */}
          <div className="mb-8 pb-8 border-b border-[#1A1A1A]/10">
            <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#1A1A1A] leading-relaxed mb-4">
              {exhibit.note}
            </p>
            <p className="font-['Source_Serif_Pro'] text-[14px] text-[#4A4A4A]">
              Written by {exhibit.curator}
            </p>
            <p className="font-['Source_Serif_Pro'] text-[14px] text-[#4A4A4A]">
              Illustrated by {exhibit.illustrator}
            </p>
          </div>

          {/* Margin note */}
          <p className="font-['Courier_New'] text-[12px] text-[#4A4A4A] italic mb-8">
            [read slowly]
          </p>

          {/* Poem Entries - Typed List */}
          <div className="space-y-6">
            {exhibit.poems.map((poem, index) => (
              <div key={index} className="pb-6 border-b border-[#1A1A1A]/10">
                <p className="font-['Courier_New'] text-[18px] text-[#1A1A1A] mb-2">
                  {poem.title}
                </p>
                <p className="font-['Source_Serif_Pro'] text-[14px] text-[#4A4A4A]">
                  {poem.author} · {poem.category}
                </p>
              </div>
            ))}
          </div>

          {/* View Link */}
          <div className="mt-12">
            <a
              href="https://pagegalleryjournal.com/brigearhartstaton"
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] hover:text-[#8B2500]"
            >
              VIEW FULL EXHIBIT →
            </a>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}
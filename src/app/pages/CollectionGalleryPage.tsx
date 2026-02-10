import { useEffect, useRef } from 'react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { RandomPoemButton } from '../components/RandomPoemButton';

// Real poems from Winter 2026 issue - titles only, NO fabricated content
const winterPoems = [
  {
    id: '1',
    title: 'I Thought You\'d Been Queer Longer Than That',
    author: 'Nix Carlson',
    category: 'Self & Introspection',
    background: '#FAF8F5',
    alignment: 'left',
  },
  {
    id: '2',
    title: 'Polyamory',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    background: '#F0E8DC',
    alignment: 'right',
  },
  {
    id: '3',
    title: 'Yes',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    background: '#FAF8F5',
    alignment: 'center',
  },
  {
    id: '4',
    title: 'Reasons You Refuse to Date Me',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    background: '#2C1810',
    textColor: '#FAF8F5',
    alignment: 'left',
  },
  {
    id: '5',
    title: 'I Probably L*ve You',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    background: '#F0E8DC',
    alignment: 'right',
  },
];

function PoemSection({ poem, index }: { poem: typeof winterPoems[0]; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const alignmentClasses = {
    left: 'text-left pl-[10%] pr-[30%]',
    right: 'text-right pl-[30%] pr-[10%]',
    center: 'text-center px-[15%]',
  };

  return (
    <section
      ref={sectionRef}
      className="poem-section px-8 py-24 relative opacity-0 transition-all duration-1000"
      style={{
        backgroundColor: poem.background,
        color: poem.textColor || '#1A1A1A',
        boxShadow: 'inset 0 0 40px rgba(44,24,16,0.06)',
        transform: 'translateY(32px)',
        marginTop: index === 0 ? 0 : '120px'
      }}
    >
      {/* Margin annotation - left side */}
      <div className="absolute left-8 top-8">
        <p className="font-['Courier_New'] text-[12px]" style={{ color: poem.textColor ? `${poem.textColor}80` : '#4A4A4A' }}>
          [{index === 0 ? 'first published here' : index === 1 ? 'february exhibit' : index === 2 ? 'read slowly' : index === 3 ? 'new voices' : 'winter collection'}]
        </p>
      </div>

      <div className={`max-w-[650px] ${poem.alignment === 'center' ? 'mx-auto' : poem.alignment === 'right' ? 'ml-auto' : ''} ${alignmentClasses[poem.alignment as keyof typeof alignmentClasses]}`}>
        {/* Author name ABOVE piece - manuscript attribution style */}
        <p className="font-['Courier_New'] text-[14px] mb-4 uppercase tracking-[0.1em]" style={{ color: poem.textColor ? `${poem.textColor}CC` : '#4A4A4A' }}>
          {poem.author}
        </p>

        {/* Poem Title */}
        <h2 className="font-['Special_Elite'] mb-12" style={{ 
          fontSize: 'clamp(28px, 5vw, 36px)', 
          lineHeight: '1.3',
          color: poem.textColor || '#1A1A1A'
        }}>
          {poem.title}
        </h2>

        {/* Placeholder for poem text */}
        <div className="font-['Source_Serif_Pro'] text-[18px] mb-12" style={{ 
          lineHeight: '1.9',
          color: poem.textColor ? `${poem.textColor}99` : '#4A4A4A'
        }}>
          <p className="italic">
            Visit the full exhibit to read this piece
          </p>
        </div>

        {/* Link to full piece */}
        <a
          href="https://pagegalleryjournal.com/nixcarlson"
          target="_blank"
          rel="noopener noreferrer"
          className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] hover:text-[#8B2500]"
          style={{ color: poem.textColor || '#1A1A1A' }}
        >
          READ FULL PIECE →
        </a>
      </div>

      {/* Pull Quote (appears on 2nd and 4th poems) */}
      {(index === 1 || index === 3) && (
        <div className="max-w-[650px] mx-auto mt-24 text-center">
          <blockquote className="font-['Special_Elite']" style={{ 
            fontSize: 'clamp(24px, 4vw, 32px)', 
            lineHeight: '1.4',
            letterSpacing: '0.1em',
            color: poem.textColor || '#1A1A1A'
          }}>
            "WRITING THAT BREATHES"
          </blockquote>
        </div>
      )}
    </section>
  );
}

export function CollectionGalleryPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />
      <RandomPoemButton />

      {/* Header - Large Monospaced Title */}
      <section className="px-8 py-24 text-center bg-[#FAF8F5]" style={{ boxShadow: 'inset 0 0 40px rgba(44,24,16,0.06)' }}>
        <h1 className="font-['Special_Elite'] text-[#1A1A1A] mb-8" style={{ fontSize: 'clamp(36px, 6vw, 48px)', lineHeight: '1.2' }}>
          CURRENT EXHIBIT: FEBRUARY 2026
        </h1>
        
        {/* Curator's Note */}
        <div className="max-w-[650px] mx-auto">
          <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#1A1A1A] leading-relaxed">
            Five poems by Nix Carlson exploring belonging, identity, and the spaces we create for love. Each piece sits in its own room—read slowly, let the words breathe.
          </p>
        </div>
      </section>

      {/* Poem Sections - Alternating Alignment */}
      {winterPoems.map((poem, index) => (
        <PoemSection key={poem.id} poem={poem} index={index} />
      ))}

      {/* Bottom Spacer */}
      <div style={{ height: '120px' }}></div>

      {/* Back to Gallery Link */}
      <section className="px-8 pb-24 text-center">
        <a
          href="/"
          className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] hover:text-[#8B2500]"
        >
          ← BACK TO GALLERY
        </a>
      </section>

      <GalleryFooter />

      {/* Scroll fade-in CSS */}
      <style>{`
        .poem-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

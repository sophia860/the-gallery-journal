import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { RandomPoemButton } from '../components/RandomPoemButton';

// Real poems from Winter 2026 issue - titles only, NO fabricated content
const winterPoems = [
  {
    id: '1',
    title: 'I THOUGHT YOU\'D BEEN QUEER LONGER THAN THAT',
    author: 'Nix Carlson',
    category: 'Self & Introspection',
    wallNumber: '01',
    layout: 'left',
    background: '#FAF8F5',
  },
  {
    id: '2',
    title: 'POLYAMORY',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    wallNumber: '02',
    layout: 'right',
    background: '#F0E8DC',
  },
  {
    id: '3',
    title: 'YES',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    wallNumber: '03',
    layout: 'center',
    background: '#FAF8F5',
  },
  {
    id: '4',
    title: 'REASONS YOU REFUSE TO DATE ME',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    wallNumber: '04',
    layout: 'left',
    background: '#2C1810',
    textColor: '#F5F0EB',
  },
  {
    id: '5',
    title: 'I PROBABLY L*VE YOU',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    wallNumber: '05',
    layout: 'right',
    background: '#F0E8DC',
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

  const layoutClasses = {
    left: 'items-start text-left pr-[30%]',
    right: 'items-end text-left pl-[30%]',
    center: 'items-center text-center px-[15%]',
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="poem-section min-h-screen flex flex-col justify-center px-8 md:px-16 py-24 relative transition-all duration-1000 opacity-0 translate-y-8"
        style={{
          backgroundColor: poem.background,
          color: poem.textColor || '#2C1810',
        }}
      >
        {/* Paper grain texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}></div>

        <div className={`max-w-7xl mx-auto w-full flex flex-col ${layoutClasses[poem.layout as keyof typeof layoutClasses]}`}>
          {/* Wall number */}
          <div className="font-['Courier_New'] text-xs tracking-[0.4em] uppercase mb-6" style={{
            color: poem.textColor ? `${poem.textColor}80` : '#8B7355'
          }}>
            Wall {poem.wallNumber}
          </div>

          {/* Title - massive, dramatic */}
          <h2 
            className="font-['Playfair_Display'] italic font-light mb-12"
            style={{
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: poem.textColor || '#2C1810',
            }}
          >
            {poem.title}
          </h2>

          {/* Note to visit exhibit - NO fabricated content */}
          <p 
            className="font-['Libre_Baskerville'] italic text-lg mb-8"
            style={{
              color: poem.textColor ? `${poem.textColor}99` : '#8B735599',
            }}
          >
            Visit the exhibit to read this piece
          </p>

          {/* Author - small, understated */}
          <div className="mt-8">
            <p className="font-['Libre_Baskerville'] text-base" style={{
              color: poem.textColor ? `${poem.textColor}99` : '#8B7355'
            }}>
              {poem.author}
            </p>
            <p className="font-['Courier_New'] text-xs tracking-wider mt-1" style={{
              color: poem.textColor ? `${poem.textColor}66` : '#8B735566'
            }}>
              {poem.category}
            </p>
          </div>

          {/* Read full piece link */}
          <a
            href="https://pagegalleryjournal.com/nixcarlson"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 font-['Inter'] text-sm font-medium group"
            style={{
              color: poem.textColor || '#2C1810',
            }}
          >
            <span className="border-b border-current">Read full piece</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </section>

      {/* Visual divider - hand-drawn feel */}
      {index < winterPoems.length - 1 && (
        <div className="relative h-24 flex items-center justify-center" style={{
          backgroundColor: index % 2 === 0 ? '#F0E8DC' : '#FAF8F5'
        }}>
          {index % 3 === 0 ? (
            // Wavy line
            <div 
              className="w-48 h-px bg-current opacity-30"
              style={{
                transform: 'rotate(-1deg)',
                color: '#8B7355',
              }}
            ></div>
          ) : index % 3 === 1 ? (
            // Decorative symbol
            <div className="font-['Playfair_Display'] text-2xl opacity-20" style={{ color: '#8B7355' }}>
              ✦
            </div>
          ) : (
            // Dotted line
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 h-1 rounded-full bg-current opacity-30"
                  style={{ 
                    color: '#8B7355',
                    transform: `translateY(${Math.sin(i) * 2}px)`
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export function CollectionGalleryPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Paper grain texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}></div>

      {/* Navigation */}
      <GalleryNav />

      {/* Random Poem Button */}
      <RandomPoemButton />

      {/* Issue Header - Just the name, massive */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="px-8 md:px-16 pt-32 pb-16"
      >
        <div className="max-w-7xl mx-auto">
          {/* Season marker */}
          <p className="font-['Courier_New'] text-xs tracking-[0.4em] text-[#8B7355] uppercase mb-6">
            Winter 2026
          </p>

          {/* Issue name - oversized */}
          <h1 
            className="font-['Playfair_Display'] italic font-light text-[#2C1810]"
            style={{
              fontSize: 'clamp(3rem, 10vw, 9rem)',
              lineHeight: '1.05',
              letterSpacing: '-0.03em',
            }}
          >
            The<br />Collection
          </h1>

          {/* Subtitle - breathing */}
          <p className="font-['Libre_Baskerville'] text-xl md:text-2xl text-[#8B7355] mt-8 max-w-2xl" style={{
            lineHeight: '1.7'
          }}>
            Five pieces on belonging, identity, and the spaces we create for love
          </p>
        </div>
      </motion.section>

      {/* Poem Sections */}
      {winterPoems.map((poem, index) => (
        <PoemSection key={poem.id} poem={poem} index={index} />
      ))}

      {/* Footer */}
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

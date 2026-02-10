import { useEffect, useRef, useState } from 'react';
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

function PoemCard({ poem, index }: { poem: typeof winterPoems[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const isOdd = index % 2 === 0;
  const hasTape = index % 3 === 0 || index % 3 === 2; // Cards 0, 2, 3, 5

  return (
    <div
      ref={cardRef}
      className={`relative transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        marginLeft: isOdd ? '8%' : '35%',
        maxWidth: isOdd ? '55%' : '45%',
        transform: `rotate(${isOdd ? '-0.5deg' : '0.3deg'})`,
        marginBottom: '6rem',
      }}
    >
      {/* Tape marks - pseudo-element styling via inline SVG */}
      {hasTape && (
        <>
          <div
            className="absolute -top-2 left-8 w-16 h-6 pointer-events-none z-10"
            style={{
              backgroundColor: 'rgba(196,181,160,0.3)',
              transform: 'rotate(-12deg)',
            }}
          />
          <div
            className="absolute -top-2 right-8 w-16 h-6 pointer-events-none z-10"
            style={{
              backgroundColor: 'rgba(196,181,160,0.3)',
              transform: 'rotate(15deg)',
            }}
          />
        </>
      )}

      {/* Card */}
      <div
        className="relative bg-[#faf6ef] border border-dashed p-10"
        style={{
          borderColor: '#c4b5a0',
          boxShadow: '4px 4px 16px rgba(44, 36, 22, 0.08)',
        }}
      >
        {/* Wall number - small label */}
        <p className="font-['Courier_New'] text-[12px] uppercase tracking-[0.3em] text-[#7d8471] mb-4">
          Wall {String(index + 1).padStart(2, '0')}
        </p>

        {/* Title - Large Playfair italic */}
        <h2
          className="font-['Playfair_Display'] italic text-[#2c2416] mb-6"
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            lineHeight: '1.2',
            fontWeight: 400,
          }}
        >
          {poem.title}
        </h2>

        {/* Hand-drawn wavy separator */}
        <svg viewBox="0 0 200 15" className="w-40 mb-6" style={{ opacity: 0.4 }}>
          <path
            d="M 0 7 Q 20 3, 40 7 T 80 7 T 120 7 T 160 7 T 200 7"
            stroke="#c4b5a0"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Note to visit exhibit */}
        <p className="font-['Source_Serif_4'] italic text-[16px] text-[#7d8471] mb-6 leading-relaxed">
          Visit the exhibit to read this piece
        </p>

        {/* Author - handwritten style */}
        <p className="font-['Caveat'] text-2xl text-[#2c2416] mb-2">{poem.author}</p>

        {/* Category */}
        <p className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#7d8471] mb-6">
          {poem.category}
        </p>

        {/* Link */}
        <a
          href="https://pagegalleryjournal.com/nixcarlson"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#a0522d] hover:text-[#2c2416] transition-colors border-b border-[#a0522d]"
        >
          Read Full Piece
        </a>
      </div>
    </div>
  );
}

export function CollectionGalleryPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E8] relative">
      {/* Paper grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Scroll progress line */}
      <div
        className="fixed left-8 top-0 w-[2px] bg-[#a0522d] z-40 transition-all duration-300"
        style={{
          height: `${scrollProgress}%`,
          opacity: scrollProgress > 5 ? 1 : 0,
        }}
      />

      <GalleryNav />

      {/* Header - Off-center */}
      <section className="px-8 py-24 relative z-10" style={{ marginLeft: '8%' }}>
        <div className="max-w-4xl">
          <h1
            className="font-['Playfair_Display'] italic text-[#2c2416] mb-4"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: '1.1',
              fontWeight: 400,
            }}
          >
            The Collection
          </h1>

          {/* Handwritten annotation with arrow */}
          <div className="flex items-center gap-3 mt-6">
            <p className="font-['Caveat'] text-3xl text-[#7d8471]">winter 2026</p>
            <svg width="40" height="20" viewBox="0 0 40 20" className="text-[#7d8471]">
              <path
                d="M 0 10 Q 15 5, 30 10 L 28 8 M 30 10 L 28 12"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="font-['Source_Serif_4'] italic text-[18px] text-[#7d8471] mt-8 leading-relaxed max-w-2xl">
            Five pieces on belonging, identity, and the spaces we create for love
          </p>
        </div>
      </section>

      {/* Collection - Asymmetric cards with alternating backgrounds */}
      <section className="relative z-10 py-16">
        {winterPoems.map((poem, index) => (
          <div
            key={poem.id}
            style={{
              backgroundColor: index % 2 === 0 ? '#faf6ef' : '#f0ebe0',
              paddingTop: '4rem',
              paddingBottom: '4rem',
            }}
          >
            <PoemCard poem={poem} index={index} />
          </div>
        ))}
      </section>

      {/* Back to Gallery */}
      <section className="px-8 pb-24 text-center relative z-10">
        <a
          href="/"
          className="inline-block font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#a0522d] hover:text-[#2c2416] transition-colors border-b border-[#a0522d]"
        >
          ← Back to Gallery
        </a>
      </section>

      <GalleryFooter />
    </div>
  );
}

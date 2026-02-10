import { useState, useEffect } from 'react';

export function GalleryNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{
      backgroundColor: 'transparent',
      borderBottom: '1px solid rgba(196,181,160,0.3)'
    }}>
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        {/* Logo - Handwritten style */}
        <a 
          href="/" 
          className="font-['Caveat'] text-4xl text-[#3e2f1c] hover:text-[#a0522d] transition-all"
          style={{
            opacity: scrolled ? 1 : 0.9,
            transition: 'opacity 0.5s ease'
          }}
        >
          The Gallery
        </a>

        {/* Nav links - Fade in on scroll */}
        <div 
          className="flex items-center gap-6"
          style={{
            opacity: scrolled ? 1 : 0.7,
            transition: 'opacity 0.5s ease'
          }}
        >
          <a
            href="/exhibits"
            className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#3e2f1c] hover:text-[#a0522d] transition-colors"
          >
            Exhibits
          </a>
          <span className="text-[#c4b5a0]">·</span>
          <a
            href="/collection-gallery"
            className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#3e2f1c] hover:text-[#a0522d] transition-colors"
          >
            Collection
          </a>
          <span className="text-[#c4b5a0]">·</span>
          <a
            href="/archive"
            className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#3e2f1c] hover:text-[#a0522d] transition-colors"
          >
            Archive
          </a>
          <span className="text-[#c4b5a0]">·</span>
          <a
            href="/submit"
            className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#3e2f1c] hover:text-[#a0522d] transition-colors"
          >
            Submit
          </a>
          <span className="text-[#c4b5a0]">·</span>
          <a
            href="/about"
            className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.2em] text-[#3e2f1c] hover:text-[#a0522d] transition-colors"
          >
            About
          </a>
        </div>
      </div>
    </nav>
  );
}

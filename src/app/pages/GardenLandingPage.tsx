import { useEffect } from 'react';

export function GardenLandingPage() {
  useEffect(() => {
    // Fade-in observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      document.querySelectorAll('.fade-in-element').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="stars-layer-1"></div>
        <div className="stars-layer-2"></div>
      </div>

      <style>{`
        .stars-layer-1, .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-repeat: repeat;
          animation: twinkle 3s ease-in-out infinite;
        }

        .stars-layer-1 {
          background-image: 
            radial-gradient(1px 1px at 20% 30%, rgba(122, 155, 118, 0.6), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(122, 155, 118, 0.4), transparent),
            radial-gradient(1px 1px at 80% 10%, rgba(122, 155, 118, 0.5), transparent);
          background-size: 200% 200%;
        }

        .stars-layer-2 {
          background-image:
            radial-gradient(1px 1px at 40% 40%, rgba(139, 157, 195, 0.3), transparent),
            radial-gradient(1px 1px at 30% 80%, rgba(139, 157, 195, 0.4), transparent);
          background-size: 200% 200%;
          animation-delay: 1.5s;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .fade-in-element {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .fade-in-element.fade-in-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .feature-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(122, 155, 118, 0.6);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-md py-6 border-b border-[rgba(122,155,118,0.1)]">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <a 
            href="/" 
            className="text-[#f5f0e8] hover:text-[#7a9b76] transition-colors"
            style={{ 
              fontSize: '1.3rem', 
              letterSpacing: '0.05em',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic'
            }}
          >
            The Page Gallery
          </a>

          <div className="flex items-center gap-8">
            <a
              href="/"
              className="font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#e8ddd0]/80 hover:text-[#f5f0e8] transition-colors"
            >
              Gallery
            </a>
            <a
              href="/garden/login"
              className="font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#7a9b76] hover:text-[#8fb587] transition-colors"
            >
              Login
            </a>
            <a
              href="/garden/signup"
              className="px-6 py-2 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] text-[#7a9b76] transition-all font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] rounded cursor-pointer"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-8 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            <h1 
              className="font-['Playfair_Display'] italic mb-8"
              style={{
                fontSize: 'clamp(4rem, 10vw, 8rem)',
                lineHeight: '1.1',
                fontWeight: 400,
                color: '#7a9b76',
                textShadow: '0 0 40px rgba(122, 155, 118, 0.25)',
              }}
            >
              The Garden
            </h1>

            <p className="font-['Cormorant_Garamond'] text-[24px] text-[#8b9dc3] mb-6" style={{ lineHeight: '1.8' }}>
              A place to write.
            </p>

            <p className="text-center font-['Cormorant_Garamond'] text-[20px] text-[#e8ddd0] mb-16" style={{ lineHeight: '1.8' }}>
              Write without an audience. If an editor stops mid-scroll, they'll send a Replant Request—a publication offer to feature your piece in the Gallery. You can always say no.
            </p>

            <div className="flex items-center justify-center gap-6">
              <a
                href="/garden/signup"
                className="px-10 py-4 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] text-[#7a9b76] transition-all font-['Cormorant_Garamond'] text-[16px] uppercase tracking-[0.2em] rounded cursor-pointer"
              >
                Begin Writing
              </a>
              <a
                href="/garden/login"
                className="px-10 py-4 border border-[rgba(196,164,108,0.2)] hover:border-[#c4a46c] text-[#e8ddd0] hover:text-[#f5f0e8] transition-all font-['Cormorant_Garamond'] text-[16px] uppercase tracking-[0.2em] rounded cursor-pointer"
              >
                Login
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-8 fade-in-element">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-8 h-[1px] bg-[#7a9b76]"></div>
              <p className="font-['Cormorant_Garamond'] text-[12px] uppercase tracking-[0.15em] text-[#8b9dc3]">
                Features
              </p>
            </div>

            <h2 className="font-['Playfair_Display'] italic text-[#f5f0e8] text-[56px] mb-16" style={{ lineHeight: '1.2' }}>
              What's here.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="feature-card bg-[rgba(15,21,37,0.4)] border border-[rgba(122,155,118,0.2)] rounded p-8 backdrop-blur-sm">
                <div className="w-12 h-12 mb-6">
                  <svg viewBox="0 0 48 48" stroke="#7a9b76" strokeWidth="1.5" fill="none">
                    <path d="M8 8 L40 8 L40 40 L8 40 Z" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="18" x2="32" y2="18"/>
                    <line x1="16" y1="24" x2="28" y2="24"/>
                    <line x1="16" y1="30" x2="32" y2="30"/>
                  </svg>
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-[20px] text-[#f5f0e8] mb-4">
                  Distraction-Free Writing
                </h3>
                <p className="font-['Cormorant_Garamond'] text-[16px] text-[#8b9dc3]" style={{ lineHeight: '1.8' }}>
                  A clean editor. Nothing else in the room.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="feature-card bg-[rgba(15,21,37,0.4)] border border-[rgba(122,155,118,0.2)] rounded p-8 backdrop-blur-sm">
                <div className="w-12 h-12 mb-6">
                  <svg viewBox="0 0 48 48" stroke="#7a9b76" strokeWidth="1.5" fill="none">
                    <circle cx="24" cy="30" r="4"/>
                    <path d="M24 30 L24 10 M20 14 L24 10 L28 14" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 36 Q18 32, 24 36 T38 36" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-[20px] text-[#f5f0e8] mb-4">
                  Growth Stages
                </h3>
                <p className="font-['Cormorant_Garamond'] text-[16px] text-[#8b9dc3]" style={{ lineHeight: '1.8' }}>
                  Track where your work is. Seed, sprout, bloom. You'll know.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="feature-card bg-[rgba(15,21,37,0.4)] border border-[rgba(122,155,118,0.2)] rounded p-8 backdrop-blur-sm">
                <div className="w-12 h-12 mb-6">
                  <svg viewBox="0 0 48 48" stroke="#7a9b76" strokeWidth="1.5" fill="none">
                    <circle cx="24" cy="24" r="16"/>
                    <circle cx="16" cy="24" r="2"/>
                    <circle cx="24" cy="24" r="2"/>
                    <circle cx="32" cy="24" r="2"/>
                  </svg>
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-[20px] text-[#f5f0e8] mb-4">
                  Writing Circles
                </h3>
                <p className="font-['Cormorant_Garamond'] text-[16px] text-[#8b9dc3]" style={{ lineHeight: '1.8' }}>
                  Share work with people you trust. Discuss it like it matters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 px-8 fade-in-element">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-8 h-[1px] bg-[#7a9b76]"></div>
              <p className="font-['Cormorant_Garamond'] text-[12px] uppercase tracking-[0.15em] text-[#8b9dc3]">
                No Rejections
              </p>
            </div>

            <h2 className="font-['Playfair_Display'] italic text-[#f5f0e8] text-[56px] mb-8" style={{ lineHeight: '1.2' }}>
              How it works.
            </h2>

            <p className="font-['Cormorant_Garamond'] text-[20px] text-[#8b9dc3] mb-16 max-w-3xl" style={{ lineHeight: '1.8' }}>
              You write in your Garden. If an editor finds something they can't stop thinking about, they send a Replant Request. You can say no. That's the whole process.
            </p>

            <a
              href="/garden/signup"
              className="inline-block px-10 py-4 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] text-[#7a9b76] transition-all font-['Cormorant_Garamond'] text-[16px] uppercase tracking-[0.2em] rounded cursor-pointer"
            >
              Start Writing
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-8 border-t border-[rgba(122,155,118,0.1)]">
          <div className="max-w-7xl mx-auto text-center">
            <p className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.3em] text-[#8b9dc3]/60">
              The Garden
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
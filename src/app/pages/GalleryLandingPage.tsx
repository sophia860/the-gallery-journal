import { useEffect, useState } from 'react';
import { GalleryStarfield } from '../components/GalleryStarfield';

function GalleryNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0d0a15]/85 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/30' : 'bg-transparent'
      }`}
      style={{
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <a 
            href="/" 
            className="font-['Playfair_Display'] text-3xl text-white/95 italic tracking-tight hover:text-white transition-all duration-300"
            style={{ textShadow: '0 0 30px rgba(196, 164, 108, 0.4)' }}
          >
            PAGE
          </a>
          <div className="flex items-center gap-8">
            <a href="#about" className="font-['Cormorant_Garamond'] text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-[0.2em]">
              About
            </a>
            <a href="#collection" className="font-['Cormorant_Garamond'] text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-[0.2em]">
              Collection
            </a>
            <a href="/exhibits" className="font-['Cormorant_Garamond'] text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-[0.2em]">
              Exhibits
            </a>
            <a 
              href="/garden" 
              className="group flex items-center gap-2 px-5 py-2 rounded-lg backdrop-blur-xl transition-all duration-300"
              style={{
                background: 'rgba(122, 155, 118, 0.15)',
                border: '1px solid rgba(122, 155, 118, 0.4)',
              }}
            >
              <span 
                className="text-sm"
                style={{ filter: 'drop-shadow(0 0 6px rgba(122, 155, 118, 0.7))' }}
              >
                🌙
              </span>
              <span className="font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.2em] text-[#7a9b76] group-hover:text-[#8aab86] transition-colors">
                Garden
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function GalleryFooter() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-16" style={{ background: 'rgba(13, 10, 21, 0.6)' }}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-['Playfair_Display'] text-2xl text-white/95 italic mb-4">PAGE</h3>
            <p className="font-['Cormorant_Garamond'] text-[15px] text-white/60 leading-relaxed">
              A dual literary platform combining curated gallery exhibitions with community writing spaces.
            </p>
          </div>
          
          <div>
            <h4 className="font-['Cormorant_Garamond'] text-[13px] text-white/70 uppercase tracking-[0.2em] mb-4">
              Gallery
            </h4>
            <div className="space-y-2">
              <a href="#collection" className="block font-['Cormorant_Garamond'] text-[15px] text-white/60 hover:text-white transition-colors">
                Current Collection
              </a>
              <a href="#about" className="block font-['Cormorant_Garamond'] text-[15px] text-white/60 hover:text-white transition-colors">
                About PAGE
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-['Cormorant_Garamond'] text-[13px] text-white/70 uppercase tracking-[0.2em] mb-4">
              Connect
            </h4>
            <p className="font-['Cormorant_Garamond'] text-[15px] text-white/60">
              EVERYWHERE AND NOWHERE, BABY
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="font-['Cormorant_Garamond'] text-[13px] text-white/50">
            © {new Date().getFullYear()} PAGE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function GalleryLandingPage() {
  useEffect(() => {
    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Observe all elements with scroll-reveal class
    setTimeout(() => {
      document.querySelectorAll('.scroll-reveal').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1128] text-white relative overflow-hidden">
      <style>{`
        /* Scroll reveal animations */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .scroll-reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .scroll-reveal-delay-1 {
          transition-delay: 0.1s;
        }
        
        .scroll-reveal-delay-2 {
          transition-delay: 0.2s;
        }
        
        .scroll-reveal-delay-3 {
          transition-delay: 0.3s;
        }
        
        .scroll-reveal-delay-4 {
          transition-delay: 0.4s;
        }
      `}</style>
      <GalleryStarfield />
      <GalleryNav />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-8 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 
            className="font-['Playfair_Display'] text-7xl md:text-8xl lg:text-9xl text-white/95 italic mb-8 leading-[0.95]"
            style={{ textShadow: '0 0 60px rgba(196, 164, 108, 0.5)' }}
          >
            A Room for Writing
          </h1>
          <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-12">
            You don't submit. You don't query. You just write — and the editors come to you.
          </p>
          <div className="flex gap-6 justify-center">
            <a 
              href="#collection"
              className="group px-8 py-4 rounded-lg backdrop-blur-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
              style={{
                background: 'rgba(196, 164, 108, 0.2)',
                border: '1px solid rgba(196, 164, 108, 0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(196, 164, 108, 0.1)'
              }}
            >
              <span className="relative z-10 font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.2em] text-white">
                View Collection
              </span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at center, rgba(196, 164, 108, 0.3) 0%, transparent 70%)'
                }}
              />
            </a>
            <a 
              href="#about"
              className="px-8 py-4 rounded-lg backdrop-blur-xl transition-all duration-300 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <span className="font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">
                About the Gallery
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Two Cards Section */}
      <section className="relative z-10 py-32 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-5xl text-white/95 italic mb-4" style={{ textShadow: '0 0 30px rgba(196, 164, 108, 0.3)' }}>
              The Two Doors
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Gallery Card - Redesigned */}
            <a 
              href="#collection"
              className="scroll-reveal group block relative"
            >
              <div className="relative p-10 rounded-3xl backdrop-blur-xl transition-all duration-700 border-2 border-transparent hover:border-[#c4a46c]/40"
                style={{
                  background: 'linear-gradient(135deg, rgba(196, 164, 108, 0.12) 0%, rgba(196, 164, 108, 0.05) 100%)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                }}
              >
                {/* Floating ornament */}
                <div className="absolute -top-6 left-10 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(196, 164, 108, 0.3), rgba(196, 164, 108, 0.1))',
                    border: '2px solid rgba(196, 164, 108, 0.5)',
                    boxShadow: '0 8px 24px rgba(196, 164, 108, 0.3)',
                  }}
                >
                  <span className="text-2xl">✦</span>
                </div>

                {/* Content */}
                <div className="relative pt-6">
                  <div className="mb-6">
                    <span className="font-['Cormorant_Garamond'] text-xs uppercase tracking-[0.3em] text-[#c4a46c]/70">
                      Curated Journal
                    </span>
                  </div>
                  
                  <h3 className="font-['Playfair_Display'] text-5xl text-white/95 italic mb-5 leading-tight group-hover:text-[#c4a46c] transition-colors duration-300">
                    The Gallery
                  </h3>
                  
                  <p className="font-['Cormorant_Garamond'] text-base text-white/65 leading-relaxed mb-8">
                    Where work arrives because an editor noticed it. Not because a writer applied. Every piece here was found growing in someone's Garden, and the editor who found it couldn't leave it alone.
                  </p>

                  {/* Features list - more elegant */}
                  <div className="space-y-3 mb-8">
                    {[
                      'Quarterly exhibitions',
                      'No submissions. No slush pile.',
                      'Writers are paid when their work is selected',
                      'Editorially curated by attention, not application'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c4a46c]"></div>
                        <span className="font-['Cormorant_Garamond'] text-sm text-white/60">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex items-center gap-2 font-['Cormorant_Garamond'] text-sm text-[#c4a46c] uppercase tracking-wider group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(196, 164, 108, 0.15), transparent 60%)'
                  }}
                />
              </div>
            </a>

            {/* Garden Card - Redesigned */}
            <a 
              href="/garden"
              className="scroll-reveal scroll-reveal-delay-1 group block relative"
            >
              <div className="relative p-10 rounded-3xl backdrop-blur-xl transition-all duration-700 border-2 border-transparent hover:border-[#7a9b76]/40"
                style={{
                  background: 'linear-gradient(135deg, rgba(122, 155, 118, 0.12) 0%, rgba(122, 155, 118, 0.05) 100%)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                }}
              >
                {/* Floating ornament */}
                <div className="absolute -top-6 left-10 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(122, 155, 118, 0.3), rgba(122, 155, 118, 0.1))',
                    border: '2px solid rgba(122, 155, 118, 0.5)',
                    boxShadow: '0 8px 24px rgba(122, 155, 118, 0.3)',
                  }}
                >
                  <span className="text-2xl">✿</span>
                </div>

                {/* Content */}
                <div className="relative pt-6">
                  <div className="mb-6">
                    <span className="font-['Cormorant_Garamond'] text-xs uppercase tracking-[0.3em] text-[#7a9b76]/70">
                      Writing Community
                    </span>
                  </div>
                  
                  <h3 className="font-['Playfair_Display'] text-5xl text-white/95 italic mb-5 leading-tight group-hover:text-[#7a9b76] transition-colors duration-300">
                    The Garden
                  </h3>
                  
                  <p className="font-['Cormorant_Garamond'] text-base text-white/65 leading-relaxed mb-8">
                    Where you write without thinking about who's watching. A private studio for drafts, fragments, false starts, and the sentence you'll finish next month. The only audience is the page — until an editor quietly walks through.
                  </p>

                  {/* Features list - more elegant */}
                  <div className="space-y-3 mb-8">
                    {[
                      'Your own writing space',
                      'Drafts move through stages: seed, sprout, bloom',
                      'Small circles of other writers, not followers',
                      'Editors browse Gardens. You never have to ask.'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7a9b76]"></div>
                        <span className="font-['Cormorant_Garamond'] text-sm text-white/60">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex items-center gap-2 font-['Cormorant_Garamond'] text-sm text-[#7a9b76] uppercase tracking-wider group-hover:gap-3 transition-all">
                    <span>Enter</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(122, 155, 118, 0.15), transparent 60%)'
                  }}
                />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Current Exhibition */}
      <section id="collection" className="relative z-10 py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-['Cormorant_Garamond'] text-[13px] text-[#c4a46c] uppercase tracking-[0.3em] mb-4">
              Current Exhibition
            </p>
            <h2 
              className="font-['Playfair_Display'] text-6xl text-white/95 italic mb-6"
              style={{ textShadow: '0 0 40px rgba(196, 164, 108, 0.4)' }}
            >
              Featured Works
            </h2>
            <p className="font-['Cormorant_Garamond'] text-xl text-white/70 leading-relaxed max-w-3xl mx-auto italic">
              Found in the Gardens. Chosen because they wouldn't let go.
            </p>
          </div>

          <div className="space-y-8">
            <div 
              className="p-8 rounded-xl backdrop-blur-xl transition-all duration-300"
              style={{
                background: 'rgba(196, 164, 108, 0.08)',
                border: '1px solid rgba(196, 164, 108, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <p className="font-['Cormorant_Garamond'] text-[11px] text-[#c4a46c] uppercase tracking-[0.3em] mb-2">
                Poetry
              </p>
              <h3 className="font-['Playfair_Display'] text-2xl text-white/90 italic mb-3">
                Coming Soon
              </h3>
              <p className="font-['Cormorant_Garamond'] text-[15px] text-white/60 leading-relaxed">
                Our editors are reading. Our inaugural exhibition will be assembled from work already growing in the Gardens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 
              className="font-['Playfair_Display'] text-6xl text-white/95 italic mb-6"
              style={{ textShadow: '0 0 40px rgba(196, 164, 108, 0.4)' }}
            >
              How It Works
            </h2>
            <p className="font-['Cormorant_Garamond'] text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto italic font-semibold">
              You write. We pay attention.
            </p>
          </div>

          <div className="space-y-16">
            <div className="flex gap-8 items-start">
              <div 
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg backdrop-blur-sm"
                style={{
                  background: 'rgba(122, 155, 118, 0.2)',
                  border: '1px solid rgba(122, 155, 118, 0.4)',
                }}
              >
                <span className="font-['Playfair_Display'] text-xl text-[#7a9b76]">1</span>
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-3xl text-white/95 italic mb-4">Plant</h3>
                <p className="font-['Cormorant_Garamond'] text-[16px] text-white/70 leading-relaxed">
                  Open your Garden. Write anything — a line, a draft, a fragment you're not sure about. Let it sit. Come back. Revise it or abandon it. Nobody is timing you. Nothing is due.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div 
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg backdrop-blur-sm"
                style={{
                  background: 'rgba(196, 164, 108, 0.2)',
                  border: '1px solid rgba(196, 164, 108, 0.4)',
                }}
              >
                <span className="font-['Playfair_Display'] text-xl text-[#c4a46c]">2</span>
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-3xl text-white/95 italic mb-4">Editors Walk Through</h3>
                <p className="font-['Cormorant_Garamond'] text-[16px] text-white/70 leading-relaxed">
                  Our editorial team reads the Gardens. Not everything. Not on a schedule. But slowly, carefully, the way you'd move through a bookshop where every spine matters. When something stops them, they mark it.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div 
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg backdrop-blur-sm"
                style={{
                  background: 'rgba(196, 164, 108, 0.2)',
                  border: '1px solid rgba(196, 164, 108, 0.4)',
                }}
              >
                <span className="font-['Playfair_Display'] text-xl text-[#c4a46c]">3</span>
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-3xl text-white/95 italic mb-4">A Knock on the Door</h3>
                <p className="font-['Cormorant_Garamond'] text-[16px] text-white/70 leading-relaxed">
                  If an editor wants to feature your work, you'll receive a Replant Request — an invitation, not a demand. You can accept, revise first, or decline. If you accept, the piece moves into the Gallery. And we pay you for it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Do This */}
      <section id="about" className="relative z-10 py-32 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="font-['Playfair_Display'] text-6xl text-white/95 italic mb-6"
              style={{ textShadow: '0 0 40px rgba(196, 164, 108, 0.4)' }}
            >
              Why We Do This
            </h2>
          </div>

          <div className="space-y-8 font-['Cormorant_Garamond'] text-[18px] text-white/70 leading-relaxed">
            <p className="text-white/90 text-[22px] font-semibold italic">
              Every literary journal in history has asked writers to come to it. We go to the writers.
            </p>
            <p>
              The traditional model works like this: you write something, you research which journals might want it, you format it to their specifications, you submit it, you wait four months, you get a form rejection, and you do it again. The writing is almost beside the point. The <em>applying</em> is the job.
            </p>
            <p>
              We thought: what if the writing were the only job?
            </p>
            <p>
              What if you just wrote — in a space built for writing — and the people whose work it is to find good writing actually came and found it?
            </p>
            <p>
              That's the Gallery. Editors read Gardens the way gallery owners visit studios. They aren't sorting through a pile. They're walking through rooms where people are working, and noticing what they notice.
            </p>
            <p>
              The writer never submits. The writer never formats a cover letter. The writer never wonders if the font was wrong or the bio was too long. The writer just writes.
            </p>
            <p className="text-white/90 font-semibold">
              And if something they wrote is the kind of thing that stops a person mid-sentence — the kind of thing that makes an editor close their laptop and sit with it for a minute — then that editor sends a Replant Request, and the piece moves from the Garden to the Gallery wall.
            </p>
            <p>
              That's it. That's the whole model. You tend your Garden. We tend our attention.
            </p>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}
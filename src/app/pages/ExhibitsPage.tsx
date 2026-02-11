import { useEffect, useState } from 'react';
import { SectionDivider } from '../components/SectionDivider';

function SimpleNav() {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a1a]/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <a href="/" className="font-['Playfair_Display'] text-3xl text-white italic tracking-tight" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}>
            PAGE
          </a>
          <div className="flex items-center gap-8">
            <a href="/" className="font-['Inter'] uppercase tracking-widest font-medium text-[#c8cad8] hover:text-white transition-colors" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
              Home
            </a>
            <a href="/exhibits" className="font-['Inter'] uppercase tracking-widest font-medium text-white transition-colors" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
              Exhibits
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function ExhibitsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0a1a' }}>
      {/* Animated Starfield Background for Night Sections */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="stars-layer"></div>
        <div className="stars-layer-2"></div>
        <div className="stars-layer-3"></div>
        <div className="stars-layer-glow"></div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 10% 10%, white, transparent),
            radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 30% 15%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(3px 3px at 40% 40%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 50% 25%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 70% 50%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 80% 20%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 15% 60%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(2px 2px at 25% 80%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 35% 90%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 45% 5%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 55% 55%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 65% 35%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 75% 75%, rgba(180, 200, 255, 0.9), transparent),
            radial-gradient(2px 2px at 85% 85%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 95% 45%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 5% 95%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 12% 42%, rgba(255, 255, 255, 0.85), transparent);
          background-size: 200% 200%;
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 8% 20%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 18% 55%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 28% 12%, white, transparent),
            radial-gradient(1px 1px at 38% 68%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 48% 82%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 58% 38%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 68% 8%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 78% 58%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 88% 28%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 98% 78%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 3% 33%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(1px 1px at 13% 73%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 23% 48%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 33% 88%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 43% 18%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 53% 63%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 63% 93%, rgba(180, 200, 255, 0.85), transparent),
            radial-gradient(1px 1px at 73% 23%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 83% 53%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 93% 3%, rgba(255, 255, 255, 0.9), transparent);
          background-size: 250% 250%;
          animation: twinkle 6s ease-in-out infinite reverse;
        }

        .stars-layer-3 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 6% 16%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 16% 46%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 26% 76%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 36% 6%, white, transparent),
            radial-gradient(1px 1px at 46% 36%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 56% 66%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 66% 96%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 76% 26%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 86% 56%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(1px 1px at 96% 86%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 11% 51%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 21% 21%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 31% 81%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 41% 41%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 51% 11%, rgba(180, 200, 255, 0.9), transparent),
            radial-gradient(1px 1px at 61% 71%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 71% 31%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 81% 91%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 91% 61%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 1% 1%, rgba(255, 255, 255, 0.8), transparent);
          background-size: 300% 300%;
          animation: twinkle 8s ease-in-out infinite;
        }

        .stars-layer-glow {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(3px 3px at 15% 25%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(4px 4px at 45% 55%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(3px 3px at 75% 35%, rgba(200, 220, 255, 1), transparent),
            radial-gradient(4px 4px at 85% 75%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(3px 3px at 25% 85%, rgba(180, 210, 255, 1), transparent);
          background-size: 100% 100%;
          animation: glow 3s ease-in-out infinite;
          filter: blur(0.5px);
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes glow {
          0%, 100% { 
            opacity: 1;
            filter: blur(0.5px);
          }
          50% { 
            opacity: 0.6;
            filter: blur(1px);
          }
        }
      `}</style>

      <SimpleNav />

      {/* SECTION 1: Header with Coming Soon - NIGHT MODE */}
      <div className="min-h-screen flex items-center justify-center px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-['Playfair_Display'] text-[6rem] text-white italic font-bold mb-8" style={{ textShadow: '0 0 40px rgba(96, 165, 250, 0.15), 0 0 60px rgba(96, 165, 250, 0.3)' }}>
            Exhibitions
          </h1>
          <div className="inline-block px-12 py-8 rounded-2xl" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
          }}>
            <p className="font-['Playfair_Display'] text-5xl text-white italic mb-4" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
              Coming Soon
            </p>
            <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8] max-w-2xl" style={{ lineHeight: '1.8' }}>
              Editors are reading. Work appears here the moment it's selected.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a0a1a] border-t border-white/10 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <p className="font-['Inter'] uppercase tracking-widest font-medium text-[#8b9dc3]" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
              © {new Date().getFullYear()} PAGE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
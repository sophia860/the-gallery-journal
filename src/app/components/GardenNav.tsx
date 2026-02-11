import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function GardenNav() {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/garden/login';
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0a0e1a]/85 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/30' : 'bg-transparent'
      }`}
      style={{
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a 
              href="/garden" 
              className="font-['Playfair_Display'] text-3xl text-white/95 italic tracking-tight hover:text-white transition-all duration-300 flex items-center gap-3"
              style={{ textShadow: '0 0 30px rgba(122, 155, 118, 0.4)' }}
            >
              <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 10px rgba(122, 155, 118, 0.7))' }}>🌙</span>
              The Garden
            </a>
            
            {/* Gallery Link - Portal to the public space */}
            <a 
              href="/"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-xl transition-all duration-300"
              style={{
                background: 'rgba(196, 164, 108, 0.1)',
                border: '1px solid rgba(196, 164, 108, 0.3)',
              }}
            >
              <span 
                className="text-sm"
                style={{ filter: 'drop-shadow(0 0 6px rgba(196, 164, 108, 0.6))' }}
              >
                ✦
              </span>
              <span className="font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.2em] text-[#c4a46c] group-hover:text-[#d4b47c] transition-colors">
                Gallery
              </span>
            </a>
          </div>
          
          {user ? (
            <div className="flex items-center gap-6">
              <a href="/garden/write" className="font-['Cormorant_Garamond'] text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-[0.2em]">
                Write
              </a>
              <a href="/garden/explore" className="font-['Cormorant_Garamond'] text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-[0.2em]">
                Explore
              </a>
              <a href="/garden/circles" className="font-['Cormorant_Garamond'] text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-[0.2em]">
                Circles
              </a>
              <a href="/garden/profile" className="font-['Cormorant_Garamond'] text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-[0.2em]">
                Profile
              </a>
              <button 
                onClick={handleSignOut}
                className="font-['Cormorant_Garamond'] text-[13px] text-white/50 hover:text-white/70 transition-colors uppercase tracking-[0.2em]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <a href="/garden/login" className="font-['Cormorant_Garamond'] text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-[0.2em]">
                Login
              </a>
              <a href="/garden/signup" className="px-6 py-2 bg-[#7a9b76] text-white font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.2em] hover:bg-[#8aab86] transition-colors rounded">
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
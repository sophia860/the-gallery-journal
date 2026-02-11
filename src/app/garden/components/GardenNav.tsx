import { useAuth } from '../../contexts/AuthContext';
import { quietHoursService } from '../utils/quietHours';
import { useState, useEffect } from 'react';

export function GardenNav() {
  const { user, signOut } = useAuth();
  const [isQuietTime, setIsQuietTime] = useState(false);

  useEffect(() => {
    setIsQuietTime(quietHoursService.isQuietTime());
    const interval = setInterval(() => {
      setIsQuietTime(quietHoursService.isQuietTime());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/garden/login';
  };

  return (
    <>
      {isQuietTime && (
        <div className="fixed top-0 left-0 right-0 bg-[rgba(122,155,118,0.2)] backdrop-blur-md border-b border-[rgba(122,155,118,0.3)] text-[#7a9b76] text-center py-2 text-sm z-50 font-['Cormorant_Garamond']">
          🌙 Quiet Hours Active
        </div>
      )}
      <nav 
        className="fixed left-0 right-0 z-40 bg-[rgba(10,14,26,0.85)] backdrop-blur-md border-b border-[rgba(122,155,118,0.15)] py-4"
        style={{ top: isQuietTime ? '40px' : '0' }}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="/garden/dashboard" 
            className="text-[#7a9b76] hover:text-[#8fb587] transition-colors cursor-pointer"
            style={{ 
              fontSize: '1.4rem', 
              letterSpacing: '0.05em',
              fontFamily: "'Special Elite', cursive"
            }}
          >
            🌿 The Garden
          </a>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <a
              href="/garden/dashboard"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              GARDEN
            </a>
            <a
              href="/garden/explore"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              EXPLORE
            </a>
            <a
              href="/garden/prompts"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              PROMPTS
            </a>
            <a
              href="/garden/write"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              WRITE
            </a>
            <a
              href="/garden/circles"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              CIRCLES
            </a>
            <a
              href="/garden/harvest"
              className={`nav-link font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] ${
                isActive('/garden/harvest') ? 'text-[#7a9b76]' : 'text-[#e0e0e0]/80 hover:text-[#e0e0e0]'
              } transition-colors cursor-pointer`}
            >
              Harvest
            </a>
            <a
              href="/garden/kept"
              className={`nav-link font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] ${
                isActive('/garden/kept') ? 'text-[#7a9b76]' : 'text-[#e0e0e0]/80 hover:text-[#e0e0e0]'
              } transition-colors cursor-pointer`}
            >
              Kept
            </a>
            <a
              href="/garden/quiet-hours"
              className={`nav-link font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] ${
                isActive('/garden/quiet-hours') ? 'text-[#7a9b76]' : 'text-[#e0e0e0]/80 hover:text-[#e0e0e0]'
              } transition-colors cursor-pointer`}
            >
              Quiet Hours
            </a>
            
            {user && (
              <>
                <a
                  href="/garden/profile"
                  className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
                >
                  PROFILE
                </a>
                <span className="w-px h-4 bg-[#333]"></span>
                <span className="font-['Courier_New'] text-[11px] text-[#7a9b76]">
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'Writer'}
                </span>
                <button
                  onClick={handleLogout}
                  className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
                >
                  LOGOUT
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';

interface GalleryNavProps {
  currentPage?: string;
  variant?: 'light' | 'dark';
}

// Simple writer auth check - reads from localStorage for demo mode
function useWriterAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [writerName, setWriterName] = useState('');

  useEffect(() => {
    // Check if writer is logged in (demo mode)
    const loggedIn = localStorage.getItem('writer_logged_in') === 'true';
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const profile = localStorage.getItem('writer_profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        setWriterName(parsed.display_name || 'Writer');
      }
    }
  }, []);

  return { isLoggedIn, writerName };
}

export function GalleryNav({ currentPage = '', variant = 'light' }: GalleryNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { isLoggedIn, writerName } = useWriterAuth();

  const isActive = (page: string) => {
    if (!currentPage) {
      // Auto-detect from pathname
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      return path.includes(page);
    }
    return currentPage === page;
  };

  const handleSignOut = () => {
    localStorage.removeItem('writer_logged_in');
    localStorage.removeItem('writer_profile');
    window.location.href = '/';
  };

  // Dark variant styling
  const isDark = variant === 'dark';
  const bgColor = isDark ? 'bg-[#1A1F2E]/95' : 'bg-[#F5F0EB]/95';
  const borderColor = isDark ? 'border-[#2C3347]' : 'border-[#E0D8D0]';
  const textColor = isDark ? 'text-[#E8E4DC]' : 'text-[#2C2C2C]';
  const linkColor = isDark ? 'text-[#E8E4DC]' : '';
  const linkHover = isDark ? 'hover:text-[#E11D48]' : 'hover:text-[#E11D48]';
  const activeColor = isDark ? 'font-medium text-[#E11D48]' : 'font-medium text-[#E11D48]';
  const mobileBg = isDark ? 'bg-[#1A1F2E]' : 'bg-[#F5F0EB]';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-8 py-8 ${bgColor} backdrop-blur-md border-b ${borderColor} shadow-sm`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-10">
          <a href="/" className={`font-['Cardo'] text-3xl italic ${textColor} hover:text-[#E11D48] transition-colors duration-300`}>
            The Gallery
          </a>
          
          {/* Desktop Navigation - Gallery Links */}
          <nav className="hidden md:flex items-center gap-8 font-[family-name:var(--font-ui)] text-sm tracking-wide">
            <a 
              href="/collection-gallery" 
              className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('collection') ? activeColor : ''}`}
            >
              The Collection
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="/about" 
              className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('about') ? activeColor : ''}`}
            >
              About
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
            </a>

            {/* Writer Navigation - Only when logged in */}
            {isLoggedIn && (
              <>
                <a 
                  href="/garden" 
                  className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('garden') ? activeColor : ''}`}
                >
                  My Garden
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
                </a>
              </>
            )}
          </nav>
        </div>

        {/* Desktop Right Side - Auth UI */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            // Logged In - User Dropdown
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#8A9A7B] rounded-full flex items-center justify-center text-white text-xs font-['Inter'] font-semibold">
                  {writerName.charAt(0).toUpperCase()}
                </div>
                <span className={`text-sm font-['Inter'] ${textColor}`}>
                  {writerName}
                </span>
                <ChevronDown className={`w-4 h-4 ${textColor}`} />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-[#E0D8D0] rounded-xl shadow-xl z-50">
                    <div className="py-2">
                      <a
                        href="/garden"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-[#F5F0EB] transition-colors text-[#2C2C2C] text-sm font-['Inter']"
                      >
                        <User className="w-4 h-4" />
                        My Garden
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F5F0EB] transition-colors text-[#E11D48] text-sm font-['Inter']"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Logged Out - Sign In + Join
            <>
              <a
                href="/signin"
                className={`text-sm font-['Inter'] ${linkColor} ${linkHover} transition-colors`}
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="px-5 py-2 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all rounded-lg font-['Inter'] text-sm font-medium shadow-sm"
              >
                Join
              </a>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 ${textColor} hover:text-[#E11D48] transition-colors`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className={`md:hidden absolute top-full left-0 right-0 ${mobileBg} border-b ${borderColor} backdrop-blur-sm`}>
          <div className="px-8 py-6 space-y-4 font-[family-name:var(--font-ui)] text-sm">
            {/* Gallery Links */}
            <a 
              href="/collection-gallery" 
              className={`block py-2 ${linkColor} ${linkHover} transition-colors ${isActive('collection') ? activeColor : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              The Collection
            </a>
            <a 
              href="/about" 
              className={`block py-2 ${linkColor} ${linkHover} transition-colors ${isActive('about') ? activeColor : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>

            {/* Writer Links - When Logged In */}
            {isLoggedIn && (
              <>
                <div className="border-t border-[#E0D8D0] pt-4 mt-4">
                  <a 
                    href="/garden" 
                    className={`block py-2 ${linkColor} ${linkHover} transition-colors ${isActive('garden') ? activeColor : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Garden
                  </a>
                </div>

                <div className="border-t border-[#E0D8D0] pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#8A9A7B] rounded-full flex items-center justify-center text-white text-xs font-['Inter'] font-semibold">
                      {writerName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-sm font-['Inter'] ${textColor}`}>
                      {writerName}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left py-2 text-[#E11D48] hover:text-[#C01040] transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}

            {/* Auth Links - When Logged Out */}
            {!isLoggedIn && (
              <div className="border-t border-[#E0D8D0] pt-4 mt-4 space-y-3">
                <a
                  href="/signin"
                  className={`block py-2 ${linkColor} ${linkHover} transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="block px-5 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all rounded-lg font-['Inter'] text-sm font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join
                </a>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
import { useState, useEffect } from 'react';
import { Menu, X, Sprout, Compass, Users, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface GardenNavProps {
  variant?: 'light' | 'dark';
}

export function GardenMainNav({ variant = 'light' }: GardenNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();

  const isActive = (page: string) => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    return path.includes(page);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  // Dark variant styling
  const isDark = variant === 'dark';
  const bgColor = isDark ? 'bg-[#1A1F2E]/95' : 'bg-[#F5F0EB]/95';
  const borderColor = isDark ? 'border-[#2C3347]' : 'border-[#E0D8D0]';
  const textColor = isDark ? 'text-[#E8E4DC]' : 'text-[#2C1810]';
  const linkColor = isDark ? 'text-[#E8E4DC]' : 'text-[#2C1810]';
  const linkHover = 'hover:text-[#8A9A7B]';
  const activeColor = 'font-medium text-[#8A9A7B]';
  const mobileBg = isDark ? 'bg-[#1A1F2E]' : 'bg-[#F5F0EB]';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-8 py-6 ${bgColor} backdrop-blur-md border-b ${borderColor} shadow-sm`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <a href="/" className={`font-['Cardo'] text-2xl italic ${textColor} hover:text-[#8A9A7B] transition-colors duration-300 flex items-center gap-2`}>
            <Sprout className="w-6 h-6" />
            The Garden
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-[family-name:var(--font-ui)] text-sm tracking-wide">
            <a 
              href="/collection-gallery" 
              className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('collection') ? activeColor : ''}`}
            >
              The Gallery
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#8A9A7B] group-hover:w-full transition-all duration-300"></span>
            </a>

            <a 
              href="/explore" 
              className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('explore') ? activeColor : ''} flex items-center gap-2`}
            >
              <Compass className="w-4 h-4" />
              Explore
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#8A9A7B] group-hover:w-full transition-all duration-300"></span>
            </a>

            {user && (
              <>
                <a 
                  href="/my-garden" 
                  className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('my-garden') ? activeColor : ''}`}
                >
                  My Garden
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#8A9A7B] group-hover:w-full transition-all duration-300"></span>
                </a>

                <a 
                  href="/circles" 
                  className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('circles') ? activeColor : ''} flex items-center gap-2`}
                >
                  <Users className="w-4 h-4" />
                  Circles
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#8A9A7B] group-hover:w-full transition-all duration-300"></span>
                </a>
              </>
            )}
          </nav>
        </div>

        {/* Desktop Right Side - Auth UI */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            // Logged In - User Dropdown
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#8A9A7B] rounded-full flex items-center justify-center text-white text-xs font-['Inter'] font-semibold">
                  {(user.user_metadata?.display_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className={`text-sm font-['Inter'] ${textColor}`}>
                  {user.user_metadata?.display_name || 'Writer'}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#E0D8D0] rounded-xl shadow-xl z-50">
                    <div className="py-2">
                      <a
                        href="/my-garden"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F0EB] transition-colors text-[#2C1810] text-sm font-['Inter']"
                      >
                        <Sprout className="w-4 h-4" />
                        My Garden
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F0EB] transition-colors text-[#2C1810] text-sm font-['Inter']"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F0EB] transition-colors text-[#E11D48] text-sm font-['Inter']"
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
                href="/garden/signin"
                className={`text-sm font-['Inter'] ${linkColor} ${linkHover} transition-colors`}
              >
                Sign In
              </a>
              <a
                href="/garden/signup"
                className="px-6 py-2.5 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all rounded-lg font-['Inter'] text-sm font-medium shadow-sm"
              >
                Join The Garden
              </a>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 ${textColor} hover:text-[#8A9A7B] transition-colors`}
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
            <a 
              href="/collection-gallery" 
              className={`block py-2 ${linkColor} ${linkHover} transition-colors ${isActive('collection') ? activeColor : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              The Gallery
            </a>
            <a 
              href="/explore" 
              className={`block py-2 ${linkColor} ${linkHover} transition-colors flex items-center gap-2 ${isActive('explore') ? activeColor : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass className="w-4 h-4" />
              Explore
            </a>

            {user && (
              <>
                <div className="border-t border-[#E0D8D0] pt-4 mt-4">
                  <a 
                    href="/my-garden" 
                    className={`block py-2 ${linkColor} ${linkHover} transition-colors ${isActive('my-garden') ? activeColor : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Garden
                  </a>
                  <a 
                    href="/circles" 
                    className={`block py-2 ${linkColor} ${linkHover} transition-colors flex items-center gap-2 ${isActive('circles') ? activeColor : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users className="w-4 h-4" />
                    Circles
                  </a>
                </div>

                <div className="border-t border-[#E0D8D0] pt-4 mt-4">
                  <a
                    href="/settings"
                    className={`block py-2 ${linkColor} ${linkHover} transition-colors`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left py-2 text-[#E11D48] hover:text-[#C01040] transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}

            {!user && (
              <div className="border-t border-[#E0D8D0] pt-4 mt-4 space-y-3">
                <a
                  href="/garden/signin"
                  className={`block py-2 ${linkColor} ${linkHover} transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </a>
                <a
                  href="/garden/signup"
                  className="block px-5 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all rounded-lg font-['Inter'] text-sm font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join The Garden
                </a>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
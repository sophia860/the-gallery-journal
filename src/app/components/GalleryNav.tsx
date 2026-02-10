import { useState } from 'react';
import { Moon, Menu, X, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface GalleryNavProps {
  currentPage?: string;
  variant?: 'light' | 'dark';
}

export function GalleryNav({ currentPage = '', variant = 'light' }: GalleryNavProps) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if user has editor role
  const userRole = user?.user_metadata?.role || 'writer';
  const isEditor = ['editor', 'eic', 'admin'].includes(userRole);

  const isActive = (page: string) => {
    if (!currentPage) {
      // Auto-detect from pathname
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      return path.includes(page);
    }
    return currentPage === page;
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
        <a href="/" className={`font-['Cardo'] text-3xl italic ${textColor} hover:text-[#E11D48] transition-colors duration-300`}>
          The Gallery
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 font-[family-name:var(--font-ui)] text-sm tracking-wide">
          <a 
            href="/collection-gallery" 
            className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('collection') ? activeColor : ''}`}
          >
            The Collection
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="/community-wall" 
            className={`${linkColor} ${linkHover} transition-all duration-300 relative group flex items-center gap-1.5 ${isActive('community') ? activeColor : ''}`}
          >
            {!user && <Lock className="w-3 h-3 opacity-60" />}
            Gallery Wall
            {!user && (
              <span className="ml-1 px-2 py-0.5 bg-[#C4918A]/10 text-[#8B7355] text-xs rounded-full">
                Members
              </span>
            )}
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="/afterhours" 
            className={`${linkColor} ${linkHover} transition-all duration-300 relative group flex items-center gap-2 ${isActive('afterhours') ? activeColor : ''}`}
          >
            <Moon className="w-4 h-4 opacity-80" />
            Afterhours
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="/rooms" 
            className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('rooms') ? activeColor : ''}`}
          >
            Rooms
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
          </a>
          
          <a 
            href="/pricing" 
            className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('pricing') ? activeColor : ''}`}
          >
            Pricing
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
          </a>
          
          {/* Editor Dashboard - only show for editors */}
          {isEditor && (
            <a 
              href="/editor-dashboard" 
              className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('editor-dashboard') ? activeColor : ''}`}
            >
              Editor Dashboard
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
            </a>
          )}
          
          {user ? (
            <a 
              href="/studio" 
              className="px-8 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] hover:scale-105 hover:shadow-lg transition-all duration-300 rounded-lg"
            >
              Your Studio
            </a>
          ) : (
            <>
              <a 
                href="/signin" 
                className={`${linkColor} ${linkHover} transition-all duration-300 relative group`}
              >
                Log In
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="/signup" 
                className="px-8 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] hover:scale-105 hover:shadow-lg transition-all duration-300 rounded-lg"
              >
                Join
              </a>
            </>
          )}
        </nav>

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
            <a 
              href="/collection-gallery" 
              className={`block py-2 ${linkColor} ${linkHover} transition-colors ${isActive('collection') ? activeColor : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              The Collection
            </a>
            <div className="block py-2">
              <a 
                href="/gallery-wall" 
                className={`flex items-center gap-2 ${linkColor} ${linkHover} transition-colors ${isActive('gallery-wall') ? activeColor : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {/* Inline Lock SVG - 16x16 */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#8B7355] flex-shrink-0"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span className="flex-1">Gallery Wall</span>
              </a>
              <div className="pl-6 mt-1">
                <span className="text-xs text-[#8B7355] font-['Inter']">Members</span>
              </div>
            </div>
            <div className="block py-2">
              <a 
                href="/community-wall" 
                className={`flex items-center gap-2 ${linkColor} ${linkHover} transition-colors ${isActive('community-wall') ? activeColor : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {/* Inline Lock SVG - 16x16 */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#8B7355] flex-shrink-0"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span className="flex-1">Community Wall</span>
              </a>
              <div className="pl-6 mt-1">
                <span className="text-xs text-[#8B7355] font-['Inter']">Members</span>
              </div>
            </div>
            <a 
              href="/afterhours" 
              className={`block py-2 ${linkColor} ${linkHover} transition-colors flex items-center gap-2 ${isActive('afterhours') ? activeColor : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Moon className="w-4 h-4" />
              Afterhours
            </a>
            <a 
              href="/rooms" 
              className={`block py-2 ${linkColor} ${linkHover} transition-colors ${isActive('rooms') ? activeColor : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Rooms
            </a>
            
            <a 
              href="/pricing" 
              className={`block py-2 ${linkColor} ${linkHover} transition-colors ${isActive('pricing') ? activeColor : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            
            {/* Editor Dashboard - only show for editors */}
            {isEditor && (
              <a 
                href="/editor-dashboard" 
                className={`block py-2 ${linkColor} ${linkHover} transition-colors ${isActive('editor-dashboard') ? activeColor : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Editor Dashboard
              </a>
            )}
            
            {user ? (
              <a 
                href="/studio" 
                className="block py-3 px-6 bg-[#E11D48] text-white text-center hover:bg-[#C01040] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Your Studio
              </a>
            ) : (
              <>
                <a 
                  href="/signin" 
                  className={`block py-2 ${linkColor} ${linkHover} transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </a>
                <a 
                  href="/signup" 
                  className="block py-3 px-6 bg-[#E11D48] text-white text-center hover:bg-[#C01040] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join
                </a>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
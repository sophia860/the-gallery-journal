import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface GalleryNavProps {
  currentPage?: string;
  variant?: 'light' | 'dark';
}

export function GalleryNav({ currentPage = '', variant = 'light' }: GalleryNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            href="/about" 
            className={`${linkColor} ${linkHover} transition-all duration-300 relative group ${isActive('about') ? activeColor : ''}`}
          >
            About
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E11D48] group-hover:w-full transition-all duration-300"></span>
          </a>
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
            <a 
              href="/about" 
              className={`block py-2 ${linkColor} ${linkHover} transition-colors ${isActive('about') ? activeColor : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
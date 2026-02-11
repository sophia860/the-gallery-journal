export function GalleryNav({ onToggleDarkMode, darkMode }: { onToggleDarkMode?: () => void, darkMode?: boolean }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-md py-6 border-b border-[rgba(196,164,108,0.1)]">
      <style>{`
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #c4a46c;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/" 
          className="text-[#f5f0e8] hover:text-[#c4a46c] transition-colors"
          style={{ 
            fontSize: '1.3rem', 
            letterSpacing: '0.05em',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic'
          }}
        >
          The Page Gallery
        </a>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          <a
            href="/exhibits"
            className="nav-link font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#e8ddd0]/80 hover:text-[#f5f0e8] transition-colors"
          >
            Exhibits
          </a>
          <a
            href="/collection-gallery"
            className="nav-link font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#e8ddd0]/80 hover:text-[#f5f0e8] transition-colors"
          >
            Collection
          </a>
          <a
            href="/archive"
            className="nav-link font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#e8ddd0]/80 hover:text-[#f5f0e8] transition-colors"
          >
            Archive
          </a>
          <a
            href="/about"
            className="nav-link font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#e8ddd0]/80 hover:text-[#f5f0e8] transition-colors"
          >
            About
          </a>
          <span className="w-px h-4 bg-[rgba(196,164,108,0.3)]"></span>
          <a
            href="/garden"
            className="nav-link font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] hover:text-[#c4a46c] transition-colors"
          >
            The Garden
          </a>
          
          {/* Dark Mode Toggle */}
          {onToggleDarkMode && (
            <>
              <span className="w-px h-4 bg-[rgba(196,164,108,0.3)]"></span>
              <button
                onClick={onToggleDarkMode}
                className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110 cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
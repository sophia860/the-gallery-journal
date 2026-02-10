export function GalleryNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent py-6">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/" 
          className="font-['Playfair_Display'] italic text-2xl text-[#F5F0E8] hover:text-[#E8DFC8] transition-colors"
        >
          The Gallery
        </a>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <a
            href="/exhibits"
            className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8] hover:text-[#E8DFC8] transition-colors"
          >
            EXHIBITS
          </a>
          <span className="w-1 h-1 rounded-full bg-[#F5F0E8]"></span>
          <a
            href="/collection-gallery"
            className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8] hover:text-[#E8DFC8] transition-colors"
          >
            COLLECTION
          </a>
          <span className="w-1 h-1 rounded-full bg-[#F5F0E8]"></span>
          <a
            href="/archive"
            className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8] hover:text-[#E8DFC8] transition-colors"
          >
            ARCHIVE
          </a>
          <span className="w-1 h-1 rounded-full bg-[#F5F0E8]"></span>
          <a
            href="/submit"
            className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8] hover:text-[#E8DFC8] transition-colors"
          >
            SUBMIT
          </a>
          <span className="w-1 h-1 rounded-full bg-[#F5F0E8]"></span>
          <a
            href="/about"
            className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8] hover:text-[#E8DFC8] transition-colors"
          >
            ABOUT
          </a>
        </div>
      </div>
    </nav>
  );
}

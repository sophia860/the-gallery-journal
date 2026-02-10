export function GalleryFooter() {
  return (
    <footer className="bg-[#F5F0E8] py-16 px-8 border-t border-[#1B1B8F]">
      <div className="max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="font-['Playfair_Display'] italic text-2xl text-[#1B1B8F]">
            The Page Gallery
          </p>
        </div>

        {/* Footer links */}
        <div className="text-center mb-8">
          <p className="font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B8F]">
            <a href="/submit" className="hover:text-[#1B1B8F]/70 transition-colors">
              SUBMIT
            </a>
            <span className="inline-block w-1 h-1 rounded-full bg-[#1B1B8F] mx-4 align-middle"></span>
            <a
              href="mailto:editors@pagegalleryjournal.com"
              className="hover:text-[#1B1B8F]/70 transition-colors"
            >
              CONTACT
            </a>
            <span className="inline-block w-1 h-1 rounded-full bg-[#1B1B8F] mx-4 align-middle"></span>
            <a
              href="https://twitter.com/pagegallery"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1B1B8F]/70 transition-colors"
            >
              TWITTER
            </a>
            <span className="inline-block w-1 h-1 rounded-full bg-[#1B1B8F] mx-4 align-middle"></span>
            <a
              href="https://instagram.com/pagegallery"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1B1B8F]/70 transition-colors"
            >
              INSTAGRAM
            </a>
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="font-['Inter'] text-[10px] uppercase tracking-[0.15em] text-[#1B1B8F]/60">
            Issue 01 · Winter 2026 · Lexington, KY
          </p>
        </div>
      </div>
    </footer>
  );
}

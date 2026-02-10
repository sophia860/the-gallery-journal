export function GalleryNav() {
  return (
    <nav className="w-full bg-[#EDE6D6] border-b border-[#1A1A1A]/10">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <a
            href="/"
            className="font-['Courier_New'] text-[18px] uppercase tracking-[0.15em] text-[#1A1A1A] hover:text-[#8B2500] transition-colors"
          >
            EXHIBITS
          </a>
          <span className="text-[#4A4A4A]">·</span>
          <a
            href="/collection-gallery"
            className="font-['Courier_New'] text-[18px] uppercase tracking-[0.15em] text-[#1A1A1A] hover:text-[#8B2500] transition-colors"
          >
            COLLECTION
          </a>
          <span className="text-[#4A4A4A]">·</span>
          <a
            href="/archive"
            className="font-['Courier_New'] text-[18px] uppercase tracking-[0.15em] text-[#1A1A1A] hover:text-[#8B2500] transition-colors"
          >
            ARCHIVE
          </a>
          <span className="text-[#4A4A4A]">·</span>
          <a
            href="/submit"
            className="font-['Courier_New'] text-[18px] uppercase tracking-[0.15em] text-[#1A1A1A] hover:text-[#8B2500] transition-colors"
          >
            SUBMIT
          </a>
          <span className="text-[#4A4A4A]">·</span>
          <a
            href="/about"
            className="font-['Courier_New'] text-[18px] uppercase tracking-[0.15em] text-[#1A1A1A] hover:text-[#8B2500] transition-colors"
          >
            ABOUT
          </a>
        </div>
      </div>
    </nav>
  );
}

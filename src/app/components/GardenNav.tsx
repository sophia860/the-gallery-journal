export function GardenNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1B1B8F]/95 backdrop-blur-sm py-6 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/garden" 
          className="font-['Cardo'] italic text-2xl text-[#F5F0E8] hover:text-white transition-colors flex items-center gap-2"
        >
          <span>🌿</span>
          The Garden
        </a>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <a
            href="/garden"
            className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors"
          >
            GARDEN
          </a>
          <a
            href="/garden/write"
            className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors"
          >
            WRITE
          </a>
          <a
            href="/circles"
            className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors"
          >
            CIRCLES
          </a>
          <a
            href="/harvest"
            className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors"
          >
            HARVEST
          </a>
          <a
            href="/quiet-hours"
            className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors"
          >
            QUIET HOURS
          </a>
          <span className="w-px h-4 bg-white/30"></span>
          <a
            href="/"
            className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors"
          >
            THE GALLERY
          </a>
        </div>
      </div>
    </nav>
  );
}

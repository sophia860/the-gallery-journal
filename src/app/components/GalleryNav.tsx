import { motion } from 'motion/react';

export function GalleryNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#8B7355]/10 relative"
    >
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        {/* Logo - Playfair Display italic, larger */}
        <a href="/" className="font-['Playfair_Display'] text-3xl italic font-light text-[#2C1810] hover:text-[#8B7355] transition-colors">
          The Gallery
        </a>

        {/* Nav links - Inter, small, uppercase, spaced */}
        <div className="flex items-center gap-8">
          <a
            href="/collection-gallery"
            className="font-['Inter'] text-[13px] uppercase tracking-[0.15em] text-[#2C1810] hover:text-[#8B7355] transition-colors"
          >
            Collection
          </a>
          <a
            href="/about"
            className="font-['Inter'] text-[13px] uppercase tracking-[0.15em] text-[#2C1810] hover:text-[#8B7355] transition-colors"
          >
            About
          </a>
          
          {/* Divider */}
          <div className="w-px h-4 bg-[#8B7355]/20"></div>
          
          {/* Auth links - plain text, understated */}
          <a
            href="/signin"
            className="font-['Inter'] text-[13px] uppercase tracking-[0.15em] text-[#8B7355] hover:text-[#2C1810] transition-colors"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="font-['Inter'] text-[13px] uppercase tracking-[0.15em] text-[#8B7355] hover:text-[#2C1810] transition-colors"
          >
            Join
          </a>
        </div>
      </div>

      {/* Hand-drawn line under nav */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px bg-[#8B7355]/20"
        style={{ transform: 'rotate(-0.3deg)' }}
      ></div>
    </motion.nav>
  );
}

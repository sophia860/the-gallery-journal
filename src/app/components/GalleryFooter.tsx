export function GalleryFooter() {
  return (
    <footer className="bg-[#2C1810] text-[#FAF8F5] px-8 md:px-16 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Large italic quote */}
        <blockquote className="font-['Playfair_Display'] text-3xl md:text-4xl italic font-light text-[#FAF8F5]/90 mb-16 max-w-4xl leading-relaxed">
          "A room of one's own is not just a physical space—it's permission to exist fully, to create without apology, to claim your voice."
        </blockquote>

        {/* Divider */}
        <div className="h-px bg-[#FAF8F5]/10 mb-12"></div>

        {/* Bottom section - Issue info and links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          {/* Left - Issue info */}
          <div>
            <p className="font-['Courier_New'] text-xs uppercase tracking-[0.2em] text-[#FAF8F5]/60 mb-4">
              Issue 01 / Winter 2026 / Lexington, KY
            </p>
            <p className="font-['Inter'] text-sm text-[#FAF8F5]/40">
              © 2026 The Gallery. All rights reserved.
            </p>
          </div>

          {/* Right - Links */}
          <div className="flex flex-col md:items-end gap-3">
            <a
              href="/about"
              className="font-['Inter'] text-sm text-[#FAF8F5]/60 hover:text-[#FAF8F5] transition-colors"
            >
              About The Gallery
            </a>
            <a
              href="/submission-guidelines"
              className="font-['Inter'] text-sm text-[#FAF8F5]/60 hover:text-[#FAF8F5] transition-colors"
            >
              Submission Guidelines
            </a>
            <a
              href="/contact"
              className="font-['Inter'] text-sm text-[#FAF8F5]/60 hover:text-[#FAF8F5] transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

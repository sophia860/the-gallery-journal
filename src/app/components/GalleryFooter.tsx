interface GalleryFooterProps {
  variant?: 'light' | 'dark';
}

export function GalleryFooter({ variant = 'light' }: GalleryFooterProps) {
  const isDark = variant === 'dark';
  const bgColor = isDark ? 'bg-[#1A1F2E]' : 'bg-[#2C2C2C]';
  const textColor = isDark ? 'text-[#E8E4DC]' : 'text-[#F5F0EB]';
  const mutedTextColor = isDark ? 'text-[#E8E4DC]/60' : 'text-[#F5F0EB]/60';
  const borderColor = isDark ? 'border-[#2C3347]' : 'border-[#F5F0EB]/20';

  return (
    <footer className={`py-16 px-8 ${bgColor} ${textColor}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="font-['Cardo'] text-4xl italic mb-2">
              The Gallery
            </div>
            <div className={`font-['Cardo'] text-lg italic ${mutedTextColor}`}>
              "a room of one's own"
            </div>
          </div>
          <nav className="flex gap-8 font-['Courier_New'] text-sm">
            <a href="/about" className="hover:text-[#E11D48] hover:underline transition-all">
              About
            </a>
            <a href="/submit" className="hover:text-[#E11D48] hover:underline transition-all">
              Submit
            </a>
            <a href="/pricing" className="hover:text-[#E11D48] hover:underline transition-all">
              Pricing
            </a>
            <a href="#" className="hover:text-[#E11D48] hover:underline transition-all">
              Contact
            </a>
          </nav>
        </div>
        <div className={`pt-8 border-t ${borderColor} font-['Courier_New'] text-xs ${mutedTextColor}`}>
          © 2026 The Gallery. A space for contemporary writing.
        </div>
      </div>
    </footer>
  );
}
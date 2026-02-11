import { ArrowRight } from 'lucide-react';

interface GardenFooterProps {
  variant?: 'light' | 'dark';
}

export function GardenFooter({ variant = 'light' }: GardenFooterProps) {
  const isDark = variant === 'dark';
  const bgColor = isDark ? 'bg-[rgba(15,23,41,0.7)]' : 'bg-[#F5F0EB]';
  const borderColor = isDark ? 'border-[rgba(196,164,108,0.2)]' : 'border-[rgba(196,164,108,0.3)]';
  const textColor = isDark ? 'text-[#c8cad8]' : 'text-[#2C1810]';
  const mutedText = isDark ? 'text-[#8b9dc3]' : 'text-[#8B7355]';
  const linkHover = isDark ? 'hover:text-[#60a5fa]' : 'hover:text-[#8A9A7B]';

  return (
    <footer 
      className={`${bgColor} border-t-2 ${borderColor} backdrop-blur-sm`}
      style={isDark ? {
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Top Section - Branding */}
        <div className="mb-8 text-center">
          <p className={`${mutedText} font-['Libre_Baskerville'] text-sm mb-3`}>
            The Garden is part of
          </p>
          <a 
            href="/"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border-2 transition-all duration-300 group"
            style={{
              borderColor: 'rgba(196, 164, 108, 0.4)',
              backgroundColor: 'rgba(196, 164, 108, 0.08)'
            }}
          >
            <span 
              className="font-['Playfair_Display'] italic text-2xl font-bold"
              style={{ 
                color: '#c4a46c',
                textShadow: '0 0 15px rgba(196, 164, 108, 0.3)'
              }}
            >
              The Page Gallery
            </span>
            <ArrowRight 
              className="w-5 h-5 transition-transform group-hover:translate-x-1" 
              style={{ color: '#c4a46c' }}
            />
          </a>
        </div>

        {/* Middle Section - Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8">
          <a
            href="/exhibits"
            className={`${mutedText} ${linkHover} transition-colors font-['Inter'] text-sm`}
          >
            Current Exhibit
          </a>
          <a
            href="/submit"
            className={`${mutedText} ${linkHover} transition-colors font-['Inter'] text-sm`}
          >
            Submit to the Journal
          </a>
          <a
            href="/shop"
            className={`${mutedText} ${linkHover} transition-colors font-['Inter'] text-sm`}
          >
            Shop
          </a>
          <a
            href="/about"
            className={`${mutedText} ${linkHover} transition-colors font-['Inter'] text-sm`}
          >
            About
          </a>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="text-center">
          <p className={`${mutedText} font-['Inter'] text-xs opacity-70`}>
            © {new Date().getFullYear()} The Page Gallery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

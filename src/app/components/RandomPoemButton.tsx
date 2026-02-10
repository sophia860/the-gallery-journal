import { Shuffle } from 'lucide-react';
import { useState } from 'react';

const POEM_IDS = ['1', '2', '3', '4', '5'];

export function RandomPoemButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleRandomPoem = () => {
    const randomId = POEM_IDS[Math.floor(Math.random() * POEM_IDS.length)];
    window.location.href = `/collection-gallery#poem-${randomId}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleRandomPoem}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-12 h-12 bg-[#2C1810] text-[#FAF8F5] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 relative animate-pulse-subtle"
        aria-label="Random Poem"
      >
        <Shuffle className="w-5 h-5" />
        
        {/* Tooltip */}
        {showTooltip && (
          <span className="absolute bottom-full mb-2 right-0 px-3 py-1.5 bg-[#2C1810] text-[#FAF8F5] text-xs font-['Inter'] whitespace-nowrap rounded"
            style={{ borderRadius: '2px 8px 2px 8px' }}
          >
            Random Poem
          </span>
        )}
      </button>

      <style>{`
        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

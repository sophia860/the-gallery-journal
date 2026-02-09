import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

// Demo published pieces (matching CollectionGalleryPage data)
const publishedPieces = [
  {
    id: '1',
    title: 'Love Letter at 3AM',
    author: 'David Park',
    category: 'Love & Relationships',
    excerpt: "I'm writing this at 3am because I can't sleep without telling you: You are the answer to questions I didn't know I was asking.",
    content: `I'm writing this at 3am\nbecause I can't sleep\nwithout telling you:\n\nYou are the answer\nto questions I didn't know\nI was asking.\n\nYour laugh is the sound\nof home,\nand I've been homeless\nfor so long.`,
  },
  {
    id: '2',
    title: 'After the Funeral',
    author: 'Sarah Williams',
    category: 'Grief, Loss & Memory',
    excerpt: 'We sit in the living room, talking about everything except the empty chair.',
    content: `We sit in the living room,\ntalking about everything\nexcept the empty chair.\n\nSomeone makes coffee.\nSomeone tells a joke.\nWe laugh, then feel guilty\nfor laughing.\n\nThis is how grief works—\nin the pauses between words,\nin the ordinary tasks\nthat keep us moving forward.`,
  },
  {
    id: '3',
    title: 'Winter Morning',
    author: 'James Chen',
    category: 'Nature & The Natural World',
    excerpt: 'The city wakes slowly, frost on windows like lace, breath visible in the air.',
    content: `The city wakes slowly,\nfrost on windows like lace,\nbreath visible in the air.\n\nI watch from my kitchen,\ncoffee warming my hands,\nthe sun still deciding\nwhether to show up today.\n\nEverything suspended\nin this quiet blue hour—\nthe world holding its breath\nbefore the day begins.`,
  },
  {
    id: '4',
    title: 'Fragments of Home',
    author: 'Maya Rodriguez',
    category: 'Family & Identity',
    excerpt: 'I carry fragments of home in my pockets—a worn coin, a pressed flower, my grandmother\'s recipe written in Spanish.',
    content: `I carry fragments of home\nin my pockets—\na worn coin, a pressed flower,\nmy grandmother's recipe written in Spanish.\n\nThese small relics map\nthe distance between\nwhere I'm from\nand where I am.\n\nSometimes I forget\nwhich language I'm thinking in,\nwhich kitchen I'm standing in,\nwhich version of myself\nI'm supposed to be.`,
  },
  {
    id: '5',
    title: 'The Space Between',
    author: 'Luna Martinez',
    category: 'Time & Mortality',
    excerpt: 'There\'s a moment between sleeping and waking when I forget everything that\'s happened.',
    content: `There's a moment\nbetween sleeping and waking\nwhen I forget\neverything that's happened.\n\nFor those three seconds,\nI am neither here nor there,\nneither grieving nor healed,\njust existing\nin the soft gray\nof almost-consciousness.`,
  },
  {
    id: '6',
    title: 'Sunday Afternoon',
    author: 'Robert Chen',
    category: 'Self & Introspection',
    excerpt: 'My son asks me why the sky is blue. I give him the scientific answer, but he looks disappointed.',
    content: `My son asks me\nwhy the sky is blue.\n\nI give him the scientific answer—\nRayleigh scattering,\nwavelengths of light,\natmospheric particles.\n\nHe looks at me,\ndisappointed,\nand says:\n"I thought you'd say\nbecause it's happy."`,
  },
  {
    id: '7',
    title: 'Monsoon Memory',
    author: 'Aisha Patel',
    category: 'Grief, Loss & Memory',
    excerpt: 'My mother taught me to read the sky—the particular gray that means rain is coming.',
    content: `My mother taught me\nto read the sky—\nthe particular gray\nthat means rain is coming.\n\nNow, an ocean away,\nI stand at my window\nwatching different clouds,\nremembering her hands\npointing at the horizon.\n\nThe rain here\nsounds nothing like home.`,
  },
  {
    id: '8',
    title: "Father's Watch",
    author: 'Thomas Wright',
    category: 'Family & Identity',
    excerpt: 'He left me his watch, the one that stopped the day he died.',
    content: `He left me his watch,\nthe one that stopped\nthe day he died.\n\nI keep it in a drawer,\nrefusing to wind it,\nas if moving the hands forward\nwould somehow\nmove me forward too.\n\nTime doesn't heal.\nIt just accumulates.`,
  }
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(publishedPieces);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // Would need to call parent to open
        }
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search filter
  useEffect(() => {
    if (!query.trim()) {
      setResults(publishedPieces);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = publishedPieces.filter(piece => 
      piece.title.toLowerCase().includes(searchTerm) ||
      piece.author.toLowerCase().includes(searchTerm) ||
      piece.content.toLowerCase().includes(searchTerm) ||
      piece.category.toLowerCase().includes(searchTerm)
    );
    setResults(filtered);
  }, [query]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults(publishedPieces);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResultClick = () => {
    onClose();
    window.location.href = '/collection-gallery';
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="min-h-screen px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Search Input */}
          <div className="bg-white border-2 border-[#E0D8D0] shadow-2xl mb-6 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-4 px-6 py-5 border-b border-[#E0D8D0]">
              <Search className="w-6 h-6 text-[#717171]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, or content..."
                autoFocus
                className="flex-1 text-xl font-['Libre_Baskerville'] text-[#2C2C2C] placeholder:text-[#C4B5A0] bg-transparent outline-none"
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#F5F0EB] rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#717171]" />
              </button>
            </div>

            {/* Keyboard Hint */}
            <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#E0D8D0]">
              <p className="text-xs text-[#717171] font-['Inter']">
                <kbd className="px-2 py-1 bg-white border border-[#E0D8D0] rounded text-xs">ESC</kbd> to close
              </p>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="font-['Libre_Baskerville'] text-[#717171] italic">
                    No pieces found matching "{query}"
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#E0D8D0]">
                  {results.map(piece => (
                    <button
                      key={piece.id}
                      onClick={handleResultClick}
                      className="w-full px-6 py-5 text-left hover:bg-[#FAF8F5] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-['Libre_Baskerville'] text-xl text-[#2C2C2C]">
                          {piece.title}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-[#E11D48]/10 text-[#E11D48] rounded font-['Inter'] whitespace-nowrap">
                          {piece.category}
                        </span>
                      </div>
                      <p className="text-sm text-[#717171] font-['Inter'] mb-3">
                        by {piece.author}
                      </p>
                      <p className="font-['Libre_Baskerville'] text-sm text-[#2C2C2C] leading-relaxed line-clamp-2 italic">
                        {piece.excerpt}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          {query && (
            <p className="text-center text-sm text-[#F5F0EB] font-['Inter']">
              {results.length} {results.length === 1 ? 'piece' : 'pieces'} found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

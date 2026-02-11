import { useState, useEffect } from 'react';
import { GardenNav } from '../../components/GardenNav';

interface Writing {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  growthStage: 'seed' | 'sprout' | 'bloom';
  tags: string[];
}

const allWritings: Writing[] = [
  {
    id: '1',
    title: 'The Architecture of Memory',
    author: 'James K.',
    excerpt: 'Memory is a kind of architecture—rooms we build from moments, hallways that twist back on themselves...',
    growthStage: 'bloom',
    tags: ['memory', 'architecture', 'time'],
  },
  {
    id: '2',
    title: 'Winter Light',
    author: 'Sarah M.',
    excerpt: 'The light through winter trees / falls differently than summer gold / it knows something about endings...',
    growthStage: 'bloom',
    tags: ['winter', 'nature', 'light'],
  },
  {
    id: '3',
    title: 'What We Leave Behind',
    author: 'Alex R.',
    excerpt: 'What is a home but a collection of what we have chosen not to throw away? The coffee mug from...',
    growthStage: 'sprout',
    tags: ['home', 'belonging', 'objects'],
  },
  {
    id: '4',
    title: 'The Last Train',
    author: 'Maria V.',
    excerpt: 'She always took the last train home. Not because she had to, but because something about the empty...',
    growthStage: 'bloom',
    tags: ['urban', 'solitude', 'night'],
  },
  {
    id: '5',
    title: 'On Forgetting',
    author: 'David L.',
    excerpt: 'Sometimes I think forgetting is a skill / like playing piano or parallel parking / something you get better...',
    growthStage: 'sprout',
    tags: ['memory', 'forgetting', 'time'],
  },
  {
    id: '6',
    title: 'Kitchen Table Conversations',
    author: 'Emily T.',
    excerpt: 'My grandmother said the best conversations happen at kitchen tables. Not dining rooms, not living rooms...',
    growthStage: 'bloom',
    tags: ['family', 'conversation', 'domesticity'],
  },
  {
    id: '7',
    title: 'The Blue Hour',
    author: 'Chen W.',
    excerpt: 'There\'s a moment between day and night photographers call the blue hour. Everything takes on this impossible...',
    growthStage: 'seed',
    tags: ['photography', 'twilight', 'beauty'],
  },
  {
    id: '8',
    title: 'Inheritance',
    author: 'Rachel B.',
    excerpt: 'What my mother gave me: / her hands that shake when angry / her inability to throw away jars...',
    growthStage: 'bloom',
    tags: ['family', 'mother', 'inheritance'],
  },
];

export function BookmarksPage() {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [bookmarkedWritings, setBookmarkedWritings] = useState<Writing[]>([]);

  useEffect(() => {
    // Load bookmarks from localStorage
    const stored = localStorage.getItem('gardenBookmarks');
    if (stored) {
      const bookmarkIds = new Set(JSON.parse(stored));
      setBookmarked(bookmarkIds);
      
      // Filter writings to only bookmarked ones
      const filtered = allWritings.filter(w => bookmarkIds.has(w.id));
      setBookmarkedWritings(filtered);
    }
  }, []);

  const removeBookmark = (id: string) => {
    const updated = new Set(bookmarked);
    updated.delete(id);
    setBookmarked(updated);
    localStorage.setItem('gardenBookmarks', JSON.stringify([...updated]));
    
    // Update displayed writings
    const filtered = allWritings.filter(w => updated.has(w.id));
    setBookmarkedWritings(filtered);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'seed': return '#8b9dc3';
      case 'sprout': return '#c4a46c';
      case 'bloom': return '#7a9b76';
      default: return '#8b9dc3';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="stars-layer-1"></div>
        <div className="stars-layer-2"></div>
      </div>

      <style>{`
        .stars-layer-1, .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-repeat: repeat;
        }

        .stars-layer-1 {
          background-image: 
            radial-gradient(1px 1px at 20% 30%, rgba(122, 155, 118, 0.4), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(122, 155, 118, 0.3), transparent);
          background-size: 200% 200%;
        }

        .stars-layer-2 {
          background-image:
            radial-gradient(1px 1px at 40% 40%, rgba(139, 157, 195, 0.3), transparent);
          background-size: 200% 200%;
        }

        .writing-card {
          transition: all 0.3s ease;
        }

        .writing-card:hover {
          transform: translateY(-4px);
          border-color: rgba(122, 155, 118, 0.4);
        }
      `}</style>

      <GardenNav />

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Playfair_Display'] italic text-[48px] text-[#7a9b76] mb-4" style={{ lineHeight: '1.1' }}>
            Bookmarks
          </h1>
          <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3]">
            Your saved writings from the Garden
          </p>
        </div>

        {bookmarkedWritings.length === 0 ? (
          <div className="text-center py-16">
            <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto mb-6" stroke="#8b9dc3" strokeWidth="1.5" fill="none">
              <path d="M16 8 L48 8 L48 56 L32 48 L16 56 Z" strokeLinejoin="round" />
            </svg>
            <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3] mb-6">
              No bookmarks yet
            </p>
            <a
              href="/garden/explore"
              className="inline-block px-8 py-3 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] text-[#7a9b76] transition-all font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded cursor-pointer"
            >
              Explore Writings
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedWritings.map((writing) => (
              <div
                key={writing.id}
                className="writing-card bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded p-6 backdrop-blur-sm"
              >
                {/* Header with remove bookmark */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <a
                      href={`/garden/read/${writing.id}`}
                      className="font-['Cormorant_Garamond'] text-[20px] text-[#f5f0e8] hover:text-[#7a9b76] transition-colors cursor-pointer"
                      style={{ lineHeight: '1.3' }}
                    >
                      {writing.title}
                    </a>
                    <p className="font-['Cormorant_Garamond'] text-[14px] text-[#8b9dc3] mt-1">
                      by {writing.author}
                    </p>
                  </div>

                  {/* Remove bookmark icon */}
                  <button
                    onClick={() => removeBookmark(writing.id)}
                    className="flex-shrink-0 ml-3 cursor-pointer hover:opacity-70 transition-opacity"
                    title="Remove bookmark"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      stroke="#c4a46c"
                      strokeWidth="2"
                      fill="#c4a46c"
                    >
                      <path d="M5 3 L19 3 L19 21 L12 17 L5 21 Z" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Excerpt */}
                <p className="font-['Cormorant_Garamond'] text-[15px] text-[#e8ddd0]/80 mb-4" style={{ lineHeight: '1.6' }}>
                  {writing.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {writing.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[rgba(139,157,195,0.1)] border border-[rgba(139,157,195,0.2)] rounded-full font-['Cormorant_Garamond'] text-[12px] text-[#8b9dc3]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Growth stage badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.15em]"
                    style={{
                      color: getStageColor(writing.growthStage),
                      border: `1px solid ${getStageColor(writing.growthStage)}40`,
                      backgroundColor: `${getStageColor(writing.growthStage)}15`,
                    }}
                  >
                    {writing.growthStage}
                  </span>
                  <a
                    href={`/garden/read/${writing.id}`}
                    className="font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#7a9b76] hover:text-[#8fb587] transition-colors cursor-pointer"
                  >
                    Read →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
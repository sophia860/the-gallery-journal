import { useState, useEffect } from 'react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

// ARCHIVE AS WANDERING - Like walking through a physical archive
// Browse by theme, connection cluster, or random - NO popularity sorting
export function ArchivePage() {
  const [browseMode, setBrowseMode] = useState<'by-theme' | 'by-constellation' | 'chance'>('by-theme');
  const [selectedTheme, setSelectedTheme] = useState<string>('');

  // Themes/tags for browsing (would come from database in production)
  const themes = [
    'Memory & Time',
    'Nature & Seasons',
    'Love & Loss',
    'Identity & Becoming',
    'Place & Belonging',
    'Language & Silence',
    'Family & Inheritance',
    'Work & Purpose',
  ];

  // Mock archive entries (would come from database)
  const archiveEntries = [
    {
      id: '1',
      title: 'Along the Oxbow',
      author: 'Bri Gearhart Staton',
      issue: 'Winter 2026',
      theme: 'Nature & Seasons',
      connections: 3,
    },
    {
      id: '2',
      title: 'Five Poems',
      author: 'Nix Carlson',
      issue: 'Winter 2026',
      theme: 'Love & Loss',
      connections: 5,
    },
    {
      id: '3',
      title: 'The Architecture of Memory',
      author: 'James K.',
      issue: 'Autumn 2025',
      theme: 'Memory & Time',
      connections: 8,
    },
  ];

  const filteredEntries = selectedTheme
    ? archiveEntries.filter(e => e.theme === selectedTheme)
    : archiveEntries;

  const chanceEncounter = () => {
    // Navigate to random entry
    const random = archiveEntries[Math.floor(Math.random() * archiveEntries.length)];
    alert(`Chance encounter: "${random.title}" by ${random.author} (Feature coming soon)`);
  };

  useEffect(() => {
    // Fade-in observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      document.querySelectorAll('.fade-in-element').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] relative">
      {/* Starfield background */}
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
            radial-gradient(1px 1px at 20% 30%, rgba(245, 240, 232, 0.4), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(245, 240, 232, 0.3), transparent);
          background-size: 200% 200%;
        }

        .stars-layer-2 {
          background-image:
            radial-gradient(1px 1px at 40% 40%, rgba(139, 157, 195, 0.3), transparent);
          background-size: 200% 200%;
        }

        .fade-in-element {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .fade-in-element.fade-in-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .archive-entry {
          transition: all 0.3s ease;
        }

        .archive-entry:hover {
          transform: translateX(8px);
          border-color: rgba(196, 164, 108, 0.4);
        }
      `}</style>

      <div className="relative z-10">
        <GalleryNav />

        {/* Header */}
        <section className="px-8 py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-['Playfair_Display'] italic text-[72px] text-[#f5f0e8] mb-8" style={{ lineHeight: '1.1', textShadow: '0 0 40px rgba(196, 164, 108, 0.15)' }}>
              Archive
            </h1>
            <p className="font-['Cormorant_Garamond'] text-[20px] text-[#8b9dc3] mb-12" style={{ lineHeight: '1.8' }}>
              Walk through what has been. No popularity. No algorithms. Only deliberate browsing.
            </p>
            <div className="w-16 h-[1px] bg-[#c4a46c] mx-auto"></div>
          </div>
        </section>

        {/* Browse Modes */}
        <section className="px-8 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-12">
              <button
                onClick={() => setBrowseMode('by-theme')}
                className={`px-6 py-3 rounded font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                  browseMode === 'by-theme'
                    ? 'bg-[#c4a46c] text-[#0d1117]'
                    : 'border border-[rgba(196,164,108,0.3)] text-[#c4a46c] hover:bg-[rgba(196,164,108,0.1)]'
                }`}
              >
                By Theme
              </button>
              <button
                onClick={() => setBrowseMode('by-constellation')}
                className={`px-6 py-3 rounded font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                  browseMode === 'by-constellation'
                    ? 'bg-[#c4a46c] text-[#0d1117]'
                    : 'border border-[rgba(196,164,108,0.3)] text-[#c4a46c] hover:bg-[rgba(196,164,108,0.1)]'
                }`}
              >
                By Constellation
              </button>
              <button
                onClick={() => {
                  setBrowseMode('chance');
                  chanceEncounter();
                }}
                className="px-6 py-3 rounded border border-[rgba(196,164,108,0.3)] text-[#c4a46c] hover:bg-[rgba(196,164,108,0.1)] font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] transition-colors cursor-pointer"
              >
                Chance Encounter
              </button>
            </div>

            {/* By Theme */}
            {browseMode === 'by-theme' && (
              <div className="fade-in-element">
                <div className="mb-8">
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="bg-[rgba(15,21,37,0.6)] border border-[rgba(196,164,108,0.2)] rounded px-6 py-3 text-[#e8ddd0] font-['Cormorant_Garamond'] text-[16px] focus:border-[#c4a46c] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">All themes</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  {filteredEntries.map(entry => (
                    <div
                      key={entry.id}
                      className="archive-entry bg-[rgba(15,21,37,0.6)] border border-[rgba(196,164,108,0.2)] rounded p-6 cursor-pointer"
                      onClick={() => alert('View piece (coming soon)')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-['Cormorant_Garamond'] text-[12px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-2">
                            {entry.issue}
                          </p>
                          <h3 className="font-['Playfair_Display'] italic text-[28px] text-[#f5f0e8] mb-2" style={{ lineHeight: '1.2' }}>
                            {entry.title}
                          </h3>
                          <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3]">
                            {entry.author}
                          </p>
                          <p className="font-['Cormorant_Garamond'] text-[14px] text-[#c4a46c] mt-3">
                            {entry.theme} · {entry.connections} connection{entry.connections !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-[#c4a46c]">→</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* By Constellation */}
            {browseMode === 'by-constellation' && (
              <div className="fade-in-element text-center py-16">
                <div className="max-w-2xl mx-auto bg-[rgba(15,21,37,0.6)] border border-[rgba(196,164,108,0.2)] rounded p-12">
                  <p className="font-['Playfair_Display'] italic text-[24px] text-[#f5f0e8] mb-6" style={{ lineHeight: '1.4' }}>
                    Connection clusters show how pieces relate to each other.
                  </p>
                  <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3]" style={{ lineHeight: '1.8' }}>
                    This view will visualize writings grouped by their connections—constellations of related ideas. You discover by following threads, not algorithms.
                  </p>
                  <p className="font-['Cormorant_Garamond'] text-[14px] text-[#8b9dc3]/60 mt-6">
                    (Feature coming soon)
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <GalleryFooter />
      </div>
    </div>
  );
}

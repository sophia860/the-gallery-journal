import { useState } from 'react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

// Mock archive data
const archiveEntries = [
  { id: '1', title: 'I Thought You\'d Been Queer Longer Than That', author: 'Nix Carlson', type: 'Poem', date: 'February 2026' },
  { id: '2', title: 'Polyamory', author: 'Nix Carlson', type: 'Poem', date: 'February 2026' },
  { id: '3', title: 'Yes', author: 'Nix Carlson', type: 'Poem', date: 'February 2026' },
  { id: '4', title: 'Reasons You Refuse to Date Me', author: 'Nix Carlson', type: 'Poem', date: 'February 2026' },
  { id: '5', title: 'I Probably L*ve You', author: 'Nix Carlson', type: 'Poem', date: 'February 2026' },
  { id: '6', title: 'Along the Oxbow', author: 'Bri Gearhart Staton', type: 'Exhibit', date: 'February 2026' },
];

type FilterType = 'ALL' | 'POEMS' | 'PROSE' | 'ESSAYS' | 'EXHIBITS';

export function ArchivePage() {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [search, setSearch] = useState('');

  const filteredEntries = archiveEntries.filter(entry => {
    const matchesFilter = filter === 'ALL' || 
      (filter === 'POEMS' && entry.type === 'Poem') ||
      (filter === 'EXHIBITS' && entry.type === 'Exhibit');
    
    const matchesSearch = search === '' || 
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.author.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleRandomPoem = () => {
    const poems = archiveEntries.filter(e => e.type === 'Poem');
    const random = poems[Math.floor(Math.random() * poems.length)];
    window.location.href = `/piece/${random.id}`;
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />

      {/* Header */}
      <section className="px-8 py-16 text-center">
        <h1 className="font-['Special_Elite'] text-[#1A1A1A] mb-12" style={{ fontSize: 'clamp(48px, 7vw, 64px)', lineHeight: '1.2' }}>
          ARCHIVE
        </h1>

        {/* Search Bar */}
        <div className="max-w-[600px] mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search the archive..."
            className="w-full px-4 py-3 bg-[#EDE6D6] border border-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#8B2500] font-['Courier_New'] text-[16px] text-[#1A1A1A] placeholder:text-[#4A4A4A]"
            style={{ borderRadius: 0 }}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {(['ALL', 'POEMS', 'PROSE', 'ESSAYS', 'EXHIBITS'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-['Courier_New'] text-[14px] uppercase tracking-[0.15em] transition-colors ${
                filter === f 
                  ? 'text-[#8B2500] underline' 
                  : 'text-[#1A1A1A] hover:text-[#8B2500]'
              }`}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Archive List - Library Card Catalogue Style */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredEntries.map((entry) => (
            <a
              key={entry.id}
              href={`/piece/${entry.id}`}
              className="block py-3 border-b border-[#1A1A1A]/10 hover:text-[#8B2500] transition-colors group"
            >
              <p className="font-['Courier_New'] text-[18px] text-[#1A1A1A] group-hover:text-[#8B2500] group-hover:underline">
                {entry.title.toUpperCase()} — {entry.author} — {entry.type} — {entry.date}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Random Poem Link */}
      <section className="px-8 py-16 text-center">
        <button
          onClick={handleRandomPoem}
          className="font-['Courier_New'] text-[14px] text-[#1A1A1A] hover:text-[#8B2500] hover:underline"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          [pull a random poem from the archive]
        </button>
      </section>

      <GalleryFooter />
    </div>
  );
}

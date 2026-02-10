import { useState } from 'react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

const archiveItems = [
  {
    id: '1',
    title: 'Winter 2026 Collection',
    author: 'Five poems by Nix Carlson',
    type: 'poems',
    description: 'Identity, desire, love, and the spaces between words',
    link: '/collection-gallery',
  },
  {
    id: '2',
    title: 'Along the Oxbow',
    author: 'Written by Bri Gearhart Staton · Illustrated by Sophia Sharkey',
    type: 'exhibit',
    description: 'An immersive poetry experience where each verse responds to the bend in the river.',
    link: 'https://pagegalleryjournal.com/brigearhartstaton',
    external: true,
  },
];

type FilterType = 'all' | 'poems' | 'prose' | 'essays' | 'exhibits';

export function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredItems = archiveItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'poems' && item.type === 'poems') ||
      (activeFilter === 'exhibits' && item.type === 'exhibit');

    return matchesSearch && matchesFilter;
  });

  const handleRandomPoem = () => {
    // Navigate to collection gallery for now
    window.location.href = '/collection-gallery';
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />

      {/* Header */}
      <section className="px-8 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-['Special_Elite'] text-[56px] text-[#1A1A1A] mb-8" style={{ lineHeight: '1.2' }}>
            ARCHIVE
          </h1>
          <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#4A4A4A] mb-12 leading-relaxed">
            Past exhibitions and collections
          </p>
          <div className="w-[40%] h-px border-t border-dashed border-[#4A4A4A] mx-auto"></div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <input
            type="search"
            placeholder="search the archive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-[#EDE6D6] border border-[#4A4A4A] font-['Courier_New'] text-[14px] text-[#1A1A1A] placeholder:text-[#4A4A4A]"
            style={{ borderRadius: 0 }}
          />
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] transition-colors ${
                activeFilter === 'all' ? 'text-[#8B2500] border-b border-[#8B2500]' : 'text-[#1A1A1A] hover:text-[#8B2500]'
              }`}
            >
              ALL
            </button>
            <span className="text-[#1A1A1A]">·</span>
            <button
              onClick={() => setActiveFilter('poems')}
              className={`font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] transition-colors ${
                activeFilter === 'poems' ? 'text-[#8B2500] border-b border-[#8B2500]' : 'text-[#1A1A1A] hover:text-[#8B2500]'
              }`}
            >
              POEMS
            </button>
            <span className="text-[#1A1A1A]">·</span>
            <button
              onClick={() => setActiveFilter('prose')}
              className={`font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] transition-colors ${
                activeFilter === 'prose' ? 'text-[#8B2500] border-b border-[#8B2500]' : 'text-[#1A1A1A] hover:text-[#8B2500]'
              }`}
            >
              PROSE
            </button>
            <span className="text-[#1A1A1A]">·</span>
            <button
              onClick={() => setActiveFilter('essays')}
              className={`font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] transition-colors ${
                activeFilter === 'essays' ? 'text-[#8B2500] border-b border-[#8B2500]' : 'text-[#1A1A1A] hover:text-[#8B2500]'
              }`}
            >
              ESSAYS
            </button>
            <span className="text-[#1A1A1A]">·</span>
            <button
              onClick={() => setActiveFilter('exhibits')}
              className={`font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] transition-colors ${
                activeFilter === 'exhibits' ? 'text-[#8B2500] border-b border-[#8B2500]' : 'text-[#1A1A1A] hover:text-[#8B2500]'
              }`}
            >
              EXHIBITS
            </button>
          </div>
        </div>
      </section>

      {/* Archive Issues */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Courier_New'] text-[28px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-12">
            2026
          </h2>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-['Source_Serif_Pro'] italic text-[16px] text-[#4A4A4A]">
                No items found matching your search
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredItems.map((item) => (
                <div key={item.id} className="pb-12 border-b border-dashed border-[#c4b5a0]">
                  <h3 className="font-['Courier_New'] text-[20px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-4">
                    {item.title}
                  </h3>
                  <p className="font-['Source_Serif_Pro'] text-[16px] text-[#4A4A4A] mb-2">{item.author}</p>
                  <p className="font-['Source_Serif_Pro'] italic text-[16px] text-[#4A4A4A] mb-6">{item.description}</p>
                  <a
                    href={item.link}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#8B2500] hover:underline"
                  >
                    {item.type === 'exhibit' ? 'VIEW EXHIBIT' : 'VIEW COLLECTION'} →
                  </a>
                </div>
              ))}
            </div>
          )}

          <h2 className="font-['Courier_New'] text-[28px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-12 mt-16">
            2025
          </h2>

          <div className="text-center py-12">
            <p className="font-['Source_Serif_Pro'] italic text-[16px] text-[#4A4A4A]">More issues coming soon</p>
          </div>
        </div>
      </section>

      {/* Random Poem Link */}
      <section className="px-8 pb-24 text-center">
        <button
          onClick={handleRandomPoem}
          className="font-['Courier_New'] text-[14px] text-[#8B2500] hover:underline"
        >
          [pull a random poem from the archive]
        </button>
      </section>

      <GalleryFooter />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Compass, Flower2, Search, Bookmark, Heart, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GardenMainNav } from '../components/GardenMainNav';
import { getPublicBlooms, searchWritings, toggleTend } from '/src/services/gardenWritingService';
import { Writing } from '/src/types/garden';

// Writing Card Component
function WritingCard({ writing, onTend }: { writing: Writing; onTend: (id: string) => void }) {
  const [tending, setTending] = useState(false);

  const handleTend = async () => {
    setTending(true);
    await onTend(writing.id);
    setTending(false);
  };

  return (
    <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-6 hover:border-[#8A9A7B] hover:shadow-lg transition-all group">
      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#8A9A7B] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold">
          {writing.profile?.display_name?.[0]?.toUpperCase() || 'W'}
        </div>
        <div>
          <p className="font-['Inter'] text-sm font-semibold text-[#2C1810]">
            {writing.profile?.writer_name || writing.profile?.display_name || 'Anonymous'}
          </p>
          <p className="font-['Inter'] text-xs text-[#8B7355]">
            {new Date(writing.published_at || writing.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-3 group-hover:text-[#8A9A7B] transition-colors">
        {writing.title}
      </h3>

      {/* Excerpt */}
      <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] leading-relaxed mb-4 line-clamp-4">
        {writing.content.slice(0, 200)}...
      </p>

      {/* Tags */}
      {writing.tags && writing.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {writing.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-[#8A9A7B]/10 border border-[#8A9A7B] text-[#8A9A7B] text-xs uppercase tracking-wider font-['Inter'] font-semibold rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E0D8D0]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-[#E11D48]/10 border border-[#E11D48] text-[#E11D48] text-xs uppercase tracking-wider font-['Inter'] font-semibold rounded flex items-center gap-1">
            <Flower2 className="w-3 h-3" />
            Bloom
          </span>
          <span className="text-xs text-[#8B7355] font-['Inter']">
            {writing.type}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTend}
            disabled={tending}
            className={`p-2 rounded-lg transition-all ${
              writing.has_tended
                ? 'bg-[#8A9A7B] text-white'
                : 'hover:bg-[#8A9A7B]/10 text-[#8B7355] hover:text-[#8A9A7B]'
            }`}
            title="Tend (gentle appreciation)"
          >
            <Heart className={`w-4 h-4 ${writing.has_tended ? 'fill-current' : ''}`} />
          </button>
          <a
            href={`/garden/reading/${writing.id}`}
            className="px-4 py-2 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all font-['Inter'] text-sm font-semibold rounded-lg"
          >
            Read
          </a>
        </div>
      </div>
    </div>
  );
}

export function ExplorePage() {
  const { user } = useAuth();
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadBlooms();
  }, []);

  const loadBlooms = async () => {
    try {
      setLoading(true);
      const data = await getPublicBlooms(50, 0);
      setWritings(data);
    } catch (error) {
      console.error('Error loading blooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadBlooms();
      return;
    }

    try {
      setSearching(true);
      const results = await searchWritings(searchQuery);
      setWritings(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleTend = async (writingId: string) => {
    if (!user) {
      window.location.href = '/garden/signin?redirect=/explore';
      return;
    }

    try {
      await toggleTend(writingId);
      
      // Update local state
      setWritings(writings.map(w => 
        w.id === writingId 
          ? { ...w, has_tended: !w.has_tended }
          : w
      ));
    } catch (error) {
      console.error('Tend error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0EB] to-[#FAF8F5]">
      <GardenMainNav />

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8A9A7B]/20 rounded-full mb-6">
              <Compass className="w-8 h-8 text-[#8A9A7B]" />
            </div>
            <h1 className="font-['Cardo'] text-6xl text-[#2C1810] mb-4 italic">
              Explore
            </h1>
            <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] max-w-2xl mx-auto">
              Discover blooming writings from across The Garden
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, content, or tags..."
                className="w-full px-6 py-4 pr-32 bg-white border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg"
              />
              <button
                type="submit"
                disabled={searching}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-6 py-2 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] disabled:opacity-50 transition-all font-['Inter'] text-sm font-semibold rounded-lg"
              >
                {searching ? (
                  'Searching...'
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </form>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  loadBlooms();
                }}
                className="mt-3 font-['Inter'] text-sm text-[#8A9A7B] hover:text-[#7A8A6B] transition-colors"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Philosophy Note */}
          <div className="max-w-2xl mx-auto mb-12 p-6 bg-white border-2 border-[#E0D8D0] rounded-lg">
            <p className="font-['Libre_Baskerville'] text-sm text-[#8B7355] italic text-center leading-relaxed">
              "No algorithms. No trending. Just writers sharing their blooms. Discovery happens through curiosity, not competition."
            </p>
          </div>

          {/* Writings Grid */}
          {loading ? (
            <div className="text-center py-20">
              <Flower2 className="w-12 h-12 text-[#8A9A7B] animate-pulse mx-auto mb-4" />
              <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
                Gathering blooms...
              </p>
            </div>
          ) : writings.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8A9A7B]/20 rounded-full mb-6">
                <Flower2 className="w-10 h-10 text-[#8A9A7B]" />
              </div>
              <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-3 italic">
                {searchQuery ? 'No blooms found' : 'The garden is quiet'}
              </h3>
              <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] mb-8">
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Be the first to share a bloom with the community'
                }
              </p>
              {!searchQuery && user && (
                <a
                  href="/garden/write"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all font-['Cardo'] text-lg rounded-lg shadow-md"
                >
                  Start Writing
                </a>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {writings.map((writing) => (
                <WritingCard key={writing.id} writing={writing} onTend={handleTend} />
              ))}
            </div>
          )}

          {/* Load More */}
          {writings.length > 0 && writings.length % 50 === 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => {/* TODO: Implement pagination */}}
                className="px-8 py-3 border-2 border-[#8A9A7B] text-[#8A9A7B] hover:bg-[#8A9A7B] hover:text-white transition-all font-['Cardo'] text-lg rounded-lg"
              >
                Discover More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

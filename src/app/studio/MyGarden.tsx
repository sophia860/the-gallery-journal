import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { ArrowLeft, Sprout, Flower2, Sparkles, Tag, Search, Calendar } from 'lucide-react';

interface Draft {
  id: string;
  title: string;
  content: string;
  type: string;
  metadata: {
    draftState?: 'seed' | 'sprout' | 'bloom';
    tags?: string[];
    wordCount?: number;
    timeElapsed?: number;
    revisitCount?: number;
  };
  createdAt: string;
}

export function MyGarden() {
  const { user, accessToken } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<'seed' | 'sprout' | 'bloom' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all unique tags from drafts
  const allTags = Array.from(
    new Set(drafts.flatMap(d => d.metadata.tags || []))
  ).sort();

  useEffect(() => {
    if (user && accessToken) {
      fetchDrafts();
    }
  }, [user, accessToken]);

  const fetchDrafts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/drafts`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDrafts(data.drafts || []);
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter drafts
  const filteredDrafts = drafts.filter(draft => {
    const matchesTag = !filterTag || (draft.metadata.tags || []).includes(filterTag);
    const matchesState = !filterState || draft.metadata.draftState === filterState;
    const matchesSearch = !searchQuery || 
      draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTag && matchesState && matchesSearch;
  });

  // Group drafts by tag
  const draftsByTag = allTags.reduce((acc, tag) => {
    acc[tag] = drafts.filter(d => (d.metadata.tags || []).includes(tag));
    return acc;
  }, {} as Record<string, Draft[]>);

  if (!user) {
    window.location.href = '/signin';
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-[#F5F0EB] flex items-center justify-center">
        <div className="text-[#8B7355] font-['Libre_Baskerville']">Loading your garden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F5F0EB] to-[#EFE8E0]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        {/* Header with enhanced design */}
        <div className="mb-16">
          <a 
            href="/studio"
            className="group inline-flex items-center gap-2 text-[#8B7355] hover:text-[#E11D48] transition-all duration-200 mb-8 font-[family-name:var(--font-ui)] text-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="relative">
              Back to Studio
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#E11D48] transition-all duration-200 group-hover:w-full"></span>
            </span>
          </a>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-[#8A9A7B]/20 to-[#8A9A7B]/5 rounded-2xl">
                <Sprout className="w-12 h-12 text-[#8A9A7B]" />
              </div>
              <div>
                <h1 className="font-['Cardo'] text-5xl md:text-7xl text-[#2C1810] italic leading-[1.1] tracking-tight">
                  My Garden
                </h1>
              </div>
            </div>
            <p className="font-['Libre_Baskerville'] text-lg md:text-xl text-[#8B7355] leading-relaxed max-w-3xl">
              Your pieces organized by themes, constellations, and growth states
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 p-6 bg-white border-2 border-[#E0D8D0] rounded-xl">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your garden..."
                className="w-full pl-12 pr-4 py-3 border-2 border-[#E0D8D0] rounded-lg font-['Courier_New'] text-sm focus:border-[#8A9A7B] focus:outline-none"
              />
            </div>
          </div>

          {/* Growth State Filter */}
          <div className="mb-4">
            <label className="block font-['Courier_New'] text-xs text-[#8B7355] mb-3 uppercase tracking-wider">
              Filter by Growth State
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setFilterState(null)}
                className={`flex items-center gap-2 px-5 py-2 border-2 font-['Cardo'] text-sm transition-all rounded-lg ${
                  filterState === null
                    ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                    : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterState('seed')}
                className={`flex items-center gap-2 px-5 py-2 border-2 font-['Cardo'] text-sm transition-all rounded-lg ${
                  filterState === 'seed'
                    ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                    : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Seeds ({drafts.filter(d => d.metadata.draftState === 'seed').length})
              </button>
              <button
                onClick={() => setFilterState('sprout')}
                className={`flex items-center gap-2 px-5 py-2 border-2 font-['Cardo'] text-sm transition-all rounded-lg ${
                  filterState === 'sprout'
                    ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                    : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                }`}
              >
                <Sprout className="w-4 h-4" />
                Sprouts ({drafts.filter(d => d.metadata.draftState === 'sprout').length})
              </button>
              <button
                onClick={() => setFilterState('bloom')}
                className={`flex items-center gap-2 px-5 py-2 border-2 font-['Cardo'] text-sm transition-all rounded-lg ${
                  filterState === 'bloom'
                    ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                    : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                }`}
              >
                <Flower2 className="w-4 h-4" />
                Blooms ({drafts.filter(d => d.metadata.draftState === 'bloom').length})
              </button>
            </div>
          </div>

          {/* Tag Cloud */}
          {allTags.length > 0 && (
            <div>
              <label className="block font-['Courier_New'] text-xs text-[#8B7355] mb-3 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-3 h-3" />
                Filter by Constellation
              </label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterTag(null)}
                  className={`px-4 py-2 border-2 font-['Cardo'] text-sm transition-all rounded-full ${
                    filterTag === null
                      ? 'border-[#8A9A7B] bg-[#8A9A7B]/10 text-[#2C1810]'
                      : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                  }`}
                >
                  All
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-4 py-2 border-2 font-['Courier_New'] text-xs transition-all rounded-full ${
                      filterTag === tag
                        ? 'border-[#8A9A7B] bg-[#8A9A7B]/20 text-[#2C1810]'
                        : 'border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                    }`}
                  >
                    {tag} ({draftsByTag[tag].length})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Garden Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 bg-white border-2 border-[#E0D8D0] rounded-xl">
            <div className="font-['Courier_New'] text-xs text-[#8B7355] mb-2 uppercase tracking-wider">Total Pieces</div>
            <div className="font-['Cardo'] text-4xl text-[#2C1810]">{drafts.length}</div>
          </div>
          <div className="p-6 bg-white border-2 border-[#E0D8D0] rounded-xl">
            <div className="font-['Courier_New'] text-xs text-[#8B7355] mb-2 uppercase tracking-wider">Constellations</div>
            <div className="font-['Cardo'] text-4xl text-[#2C1810]">{allTags.length}</div>
          </div>
          <div className="p-6 bg-white border-2 border-[#E0D8D0] rounded-xl">
            <div className="font-['Courier_New'] text-xs text-[#8B7355] mb-2 uppercase tracking-wider">In Bloom</div>
            <div className="font-['Cardo'] text-4xl text-[#2C1810]">
              {drafts.filter(d => d.metadata.draftState === 'bloom').length}
            </div>
          </div>
          <div className="p-6 bg-white border-2 border-[#E0D8D0] rounded-xl">
            <div className="font-['Courier_New'] text-xs text-[#8B7355] mb-2 uppercase tracking-wider">Total Words</div>
            <div className="font-['Cardo'] text-4xl text-[#2C1810]">
              {drafts.reduce((sum, d) => sum + (d.metadata.wordCount || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Drafts Grid */}
        {filteredDrafts.length === 0 ? (
          <div className="p-12 bg-white border-2 border-[#E0D8D0] rounded-xl text-center">
            <Sprout className="w-16 h-16 mx-auto mb-4 text-[#8B7355]" />
            <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-2">Your garden is waiting</h3>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-6">
              Start writing to plant your first seeds
            </p>
            <a
              href="/studio/freewrite"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] transition-all font-['Cardo'] text-lg tracking-wide rounded-lg"
            >
              Start Writing
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrafts.map(draft => (
              <a
                key={draft.id}
                href={`/studio/freewrite?draft=${draft.id}`}
                className="group p-6 bg-white border-2 border-[#E0D8D0] hover:border-[#8A9A7B] rounded-xl transition-all hover:shadow-lg"
              >
                {/* Growth State Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {draft.metadata.draftState === 'seed' && (
                      <Sparkles className="w-5 h-5 text-[#8A9A7B]" />
                    )}
                    {draft.metadata.draftState === 'sprout' && (
                      <Sprout className="w-5 h-5 text-[#8A9A7B]" />
                    )}
                    {draft.metadata.draftState === 'bloom' && (
                      <Flower2 className="w-5 h-5 text-[#8A9A7B]" />
                    )}
                    <span className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
                      {draft.metadata.draftState || 'seed'}
                    </span>
                  </div>
                  <span className="font-['Courier_New'] text-xs text-[#8B7355]">
                    {draft.metadata.wordCount || 0} words
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-3 line-clamp-2 group-hover:text-[#E11D48] transition-colors">
                  {draft.title || 'Untitled'}
                </h3>

                {/* Content Preview */}
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-4 line-clamp-3 leading-relaxed">
                  {draft.content}
                </p>

                {/* Tags */}
                {draft.metadata.tags && draft.metadata.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {draft.metadata.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-[#8A9A7B]/10 text-[#8A9A7B] rounded-full font-['Courier_New'] text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-[#8B7355] font-['Courier_New']">
                  <Calendar className="w-3 h-3" />
                  {new Date(draft.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
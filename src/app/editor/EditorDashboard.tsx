import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CollectionsTab } from './CollectionsTab';
import { ExitDemoButton } from '../components/ExitDemoButton';

// Editor nav bar component
function EditorNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 py-6 border-b border-[rgba(196,164,108,0.1)]"
      style={{
        backgroundColor: 'rgba(13, 17, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <style>{`
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #c4a46c;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after, .nav-link.active::after {
          width: 100%;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <a 
            href="/" 
            className="text-[#c4a46c] hover:text-[#d4b47c] transition-colors flex items-center gap-2"
            style={{ 
              fontSize: '1.5rem', 
              letterSpacing: '0.05em',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              textShadow: '0 0 20px rgba(196, 164, 108, 0.3)'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Gallery
          </a>
          <span className="text-[rgba(196,164,108,0.3)]">|</span>
          <span className="text-[#c4a46c]/70 font-['Cormorant_Garamond'] text-sm uppercase tracking-wider">
            The Studio
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab('discover')}
            className={`nav-link font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] transition-colors ${
              activeTab === 'discover' ? 'text-[#c4a46c] active' : 'text-[#c8cad8]/80 hover:text-[#c8cad8]'
            }`}
          >
            Wander
          </button>
          <button
            onClick={() => setActiveTab('picked')}
            className={`nav-link font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] transition-colors ${
              activeTab === 'picked' ? 'text-[#c4a46c] active' : 'text-[#c8cad8]/80 hover:text-[#c8cad8]'
            }`}
          >
            Picked
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`nav-link font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] transition-colors ${
              activeTab === 'collections' ? 'text-[#c4a46c] active' : 'text-[#c8cad8]/80 hover:text-[#c8cad8]'
            }`}
          >
            Collections
          </button>
        </div>
      </div>
    </nav>
  );
}

interface Writing {
  id: string;
  title: string;
  content: string;
  growth_stage: 'seed' | 'sprout' | 'bloom';
  work_type?: string;
  tags?: string[];
  word_count?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles?: {
    garden_name: string;
    full_name: string;
  };
}

export function EditorDashboard() {
  const { user, supabase } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  const [allWritings, setAllWritings] = useState<Writing[]>([]);
  const [filteredWritings, setFilteredWritings] = useState<Writing[]>([]);
  const [pickedWritings, setPickedWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [growthFilter, setGrowthFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Full view modal
  const [selectedWriting, setSelectedWriting] = useState<Writing | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  useEffect(() => {
    // Check if demo mode is active OR if editor is logged in
    const demoMode = localStorage.getItem('demoMode');
    const editorLoggedIn = localStorage.getItem('editor_logged_in');
    
    if (!demoMode && !editorLoggedIn) {
      window.location.href = '/editor-login';
      return;
    }

    // Load all public garden writings
    loadAllGardenWritings();
    loadPickedWritings();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...allWritings];

    // Growth stage filter
    if (growthFilter !== 'all') {
      filtered = filtered.filter(w => w.growth_stage === growthFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.title.toLowerCase().includes(query) ||
        w.content.toLowerCase().includes(query) ||
        w.profiles?.garden_name.toLowerCase().includes(query) ||
        w.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredWritings(filtered);
  }, [growthFilter, searchQuery, allWritings]);

  const loadAllGardenWritings = async () => {
    setLoading(true);
    try {
      // Query all writings with visibility='garden' (public in the garden)
      const { data: writings, error } = await supabase
        .from('writings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            garden_name
          )
        `)
        .eq('visibility', 'garden')
        .order('updated_at', { ascending: false });

      if (error || !writings || writings.length === 0) {
        // Use mock data if database not available or empty
        console.log('Database not available, using mock data for editor dashboard');
        useMockWritings();
      } else {
        setAllWritings(writings);
      }
    } catch (error) {
      console.error('Error loading garden writings:', error);
      useMockWritings();
    }
    setLoading(false);
  };

  const useMockWritings = () => {
    const mockWritings: Writing[] = [
      {
        id: 'w1',
        title: 'The Weight of Autumn',
        content: 'There\'s a heaviness that settles in when the leaves begin to turn. Not sadness exactly, but a kind of melancholy nostalgia for summers not quite finished. I walk through the park and feel time slipping through my fingers like sand, like water, like the wind that carries these dying leaves into piles at the edges of memory.',
        growth_stage: 'bloom',
        work_type: 'poetry',
        tags: ['autumn', 'reflection', 'nature'],
        word_count: 342,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'u1',
        profiles: {
          garden_name: '@maya',
          full_name: 'Maya Chen'
        }
      },
      {
        id: 'w2',
        title: 'Letters to My Younger Self',
        content: 'Dear 25-year-old me, I know you think you have it all figured out. I know you believe that success means climbing ladders and checking boxes. Let me tell you something that will save you years of wondering: you\'re allowed to change your mind. You\'re allowed to want different things. This isn\'t failure. This is growth.',
        growth_stage: 'bloom',
        work_type: 'essay',
        tags: ['personal', 'growth', 'wisdom'],
        word_count: 520,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'u2',
        profiles: {
          garden_name: '@jordan',
          full_name: 'Jordan Rivers'
        }
      },
      {
        id: 'w3',
        title: 'The House on Maple Street',
        content: 'The house appeared overnight, or so the neighborhood children claimed. One day there was an empty lot overgrown with weeds and wildflowers, and the next—a Victorian mansion with peeling paint and windows that reflected clouds that weren\'t in the sky. Old Mrs. Patterson swore she saw lights moving inside at 3 AM.',
        growth_stage: 'sprout',
        work_type: 'fiction',
        tags: ['fiction', 'mystery', 'magical-realism'],
        word_count: 445,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'u3',
        profiles: {
          garden_name: '@river',
          full_name: 'River Park'
        }
      },
      {
        id: 'w4',
        title: 'On Grief and Gratitude',
        content: 'They told me grief comes in waves. What they didn\'t mention is that sometimes you\'re drowning and sometimes you\'re floating and sometimes—on the good days—you remember that you know how to swim. My mother died on a Tuesday. Not a special Tuesday, not a dramatic Tuesday. Just a regular, unremarkable Tuesday in March when the daffodils were starting to come up.',
        growth_stage: 'bloom',
        work_type: 'memoir',
        tags: ['grief', 'family', 'healing'],
        word_count: 680,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'u4',
        profiles: {
          garden_name: '@alex',
          full_name: 'Alex Santos'
        }
      },
      {
        id: 'w5',
        title: 'Fragments: City at 3 AM',
        content: 'Streetlight halos. Empty bus stops. A cat crossing the intersection with more purpose than I\'ve had all week. The bodega guy who knows my order. Steam rising from manholes like the city is breathing. Someone\'s distant laughter. The way loneliness feels less lonely when everyone else is asleep.',
        growth_stage: 'seed',
        work_type: 'experimental',
        tags: ['experimental', 'urban', 'night'],
        word_count: 180,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'u5',
        profiles: {
          garden_name: '@sam',
          full_name: 'Sam Taylor'
        }
      },
      {
        id: 'w6',
        title: 'What Gardening Taught Me About Patience',
        content: 'You can\'t rush a tomato. You can give it the best soil, the perfect amount of sun, sing to it if you want—but it will ripen when it\'s ready. Not when you need it for dinner, not when you planned your salad around it. This is not a metaphor. Or maybe it is. I planted my first garden at 32, right after my second divorce.',
        growth_stage: 'bloom',
        work_type: 'essay',
        tags: ['gardening', 'patience', 'life-lessons'],
        word_count: 390,
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'u6',
        profiles: {
          garden_name: '@casey',
          full_name: 'Casey Green'
        }
      }
    ];

    setAllWritings(mockWritings);
  };

  const loadPickedWritings = async () => {
    // TODO: Load picked writings from a picks table
    // For now, check localStorage for demo
    const stored = localStorage.getItem('editor_picked_writings');
    if (stored) {
      try {
        setPickedWritings(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing picked writings:', e);
      }
    }
  };

  const handlePickForGallery = async (writing: Writing) => {
    setIsPicking(true);
    
    // TODO: Save to picks table in database
    // For now, save to localStorage for demo
    const newPicked = [...pickedWritings, writing];
    setPickedWritings(newPicked);
    localStorage.setItem('editor_picked_writings', JSON.stringify(newPicked));
    
    setTimeout(() => {
      setIsPicking(false);
      setSelectedWriting(null);
    }, 500);
  };

  const isAlreadyPicked = (writingId: string) => {
    return pickedWritings.some(w => w.id === writingId);
  };

  const stripHtml = (html: string, maxLength = 200) => {
    return html.replace(/<[^>]*>/g, '').substring(0, maxLength);
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'seed': return '🌰';
      case 'sprout': return '🌱';
      case 'bloom': return '🌸';
      default: return '🌱';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'seed': return 'rgba(139, 157, 195, 0.3)';
      case 'sprout': return 'rgba(122, 155, 118, 0.3)';
      case 'bloom': return 'rgba(196, 164, 108, 0.3)';
      default: return 'rgba(122, 155, 118, 0.3)';
    }
  };

  const getTimeSincePlanted = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'planted today';
    if (diffDays === 1) return 'planted yesterday';
    if (diffDays < 7) return `planted ${diffDays} days ago`;
    if (diffDays < 30) return `planted ${Math.floor(diffDays / 7)} weeks ago`;
    return `planted ${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-[#0d1117] relative">
      {/* Enhanced Starfield background */}
      <div className="fixed inset-0 pointer-events-none opacity-25">
        <div className="stars-layer"></div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1.5px 1.5px at 20% 30%, rgba(196, 164, 108, 0.4), transparent),
            radial-gradient(1.5px 1.5px at 60% 70%, rgba(196, 164, 108, 0.3), transparent),
            radial-gradient(1px 1px at 40% 80%, rgba(196, 164, 108, 0.35), transparent),
            radial-gradient(1px 1px at 80% 20%, rgba(196, 164, 108, 0.25), transparent),
            radial-gradient(1px 1px at 15% 60%, rgba(139, 157, 195, 0.2), transparent),
            radial-gradient(1px 1px at 70% 45%, rgba(122, 155, 118, 0.2), transparent);
          background-size: 200% 200%;
          background-repeat: repeat;
          animation: twinkle 8s ease-in-out infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .writing-card {
          transition: all 0.3s ease;
        }
        
        .writing-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <EditorNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative z-10 pt-24 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Discover Tab */}
          {activeTab === 'discover' && (
            <>
              {/* Header */}
              <div className="mb-12">
                <h1 className="font-['Playfair_Display'] italic text-[52px] text-[#c4a46c] mb-3" style={{ textShadow: '0 0 30px rgba(196, 164, 108, 0.3)', lineHeight: '1.2' }}>
                  Wander Through the Gardens
                </h1>
                <p className="font-['Cormorant_Garamond'] text-[19px] text-[#8b9dc3]/80" style={{ lineHeight: '1.7' }}>
                  Writers plant their work naturally. You discover what calls to you.
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <svg 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b9dc3]/50"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[rgba(15,21,37,0.7)] border border-[rgba(196,164,108,0.2)] rounded-lg pl-12 pr-4 py-4 text-[#e0e0e0] focus:border-[#c4a46c] focus:outline-none transition-colors font-['Cormorant_Garamond'] text-[16px]"
                    placeholder="Search across all gardens..."
                    style={{ backdropFilter: 'blur(8px)' }}
                  />
                </div>
              </div>

              {/* Growth Stage Filter Pills */}
              <div className="mb-8 flex flex-wrap gap-3">
                <p className="font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3]/70 mr-2 flex items-center">
                  Growth:
                </p>
                <button
                  onClick={() => setGrowthFilter('all')}
                  className={`px-5 py-2.5 rounded-lg backdrop-blur-sm transition-all cursor-pointer ${
                    growthFilter === 'all'
                      ? 'bg-[rgba(196,164,108,0.25)] border border-[#c4a46c] text-[#c4a46c] shadow-lg shadow-[#c4a46c]/20'
                      : 'bg-[rgba(15,21,37,0.5)] border border-[rgba(196,164,108,0.2)] text-[#8b9dc3] hover:border-[#c4a46c]/50'
                  }`}
                >
                  <span className="font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em]">
                    All
                  </span>
                </button>
                {['seed', 'sprout', 'bloom'].map(stage => (
                  <button
                    key={stage}
                    onClick={() => setGrowthFilter(stage)}
                    className={`px-5 py-2.5 rounded-lg backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2 ${
                      growthFilter === stage
                        ? 'bg-[rgba(196,164,108,0.25)] border border-[#c4a46c] text-[#c4a46c] shadow-lg shadow-[#c4a46c]/20'
                        : 'bg-[rgba(15,21,37,0.5)] border border-[rgba(196,164,108,0.2)] text-[#8b9dc3] hover:border-[#c4a46c]/50'
                    }`}
                  >
                    <span className="text-base">{getStageIcon(stage)}</span>
                    <span className="font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em]">
                      {stage}s
                    </span>
                  </button>
                ))}
              </div>

              {/* Results Count */}
              <div className="mb-8">
                <p className="font-['Cormorant_Garamond'] text-[15px] text-[#8b9dc3]/70 italic">
                  {filteredWritings.length} {filteredWritings.length === 1 ? 'piece' : 'pieces'} growing in the gardens tonight
                </p>
              </div>

              {/* Writing Cards Grid */}
              {loading ? (
                <div className="text-center py-24">
                  <div className="w-20 h-20 border-2 border-[#c4a46c] border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
                  <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3]">
                    Wandering through the gardens...
                  </p>
                </div>
              ) : filteredWritings.length === 0 ? (
                <div className="text-center py-24">
                  <div className="mb-6">
                    <span className="text-6xl opacity-20">🌙</span>
                  </div>
                  <p className="font-['Cormorant_Garamond'] text-[22px] text-[#8b9dc3] mb-2">
                    No writing found
                  </p>
                  <p className="font-['Cormorant_Garamond'] text-[16px] text-[#8b9dc3]/60">
                    Try adjusting your filters or search
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWritings.map((writing) => (
                    <div
                      key={writing.id}
                      onClick={() => setSelectedWriting(writing)}
                      className="writing-card bg-[rgba(15,21,37,0.7)] border border-[rgba(196,164,108,0.2)] rounded-xl p-6 hover:border-[#c4a46c] hover:bg-[rgba(15,21,37,0.85)] hover:shadow-2xl hover:shadow-[#c4a46c]/10 transition-all cursor-pointer group backdrop-blur-sm"
                    >
                      {/* Garden Name & Growth Stage */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#7a9b76]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                          </svg>
                          <p className="font-['Cormorant_Garamond'] text-[13px] text-[#7a9b76]">
                            {writing.profiles?.garden_name || writing.profiles?.full_name || 'Anonymous'}'s garden
                          </p>
                        </div>
                        <span className="text-xl group-hover:scale-125 transition-transform duration-300">
                          {getStageIcon(writing.growth_stage)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-['Playfair_Display'] italic text-[26px] text-[#e0e0e0] mb-3 line-clamp-2 group-hover:text-[#f5f0e8] transition-colors leading-tight">
                        {writing.title}
                      </h3>

                      {/* Content preview */}
                      <p className="font-['Cormorant_Garamond'] text-[16px] text-[#8b9dc3] mb-4 line-clamp-4" style={{ lineHeight: '1.7' }}>
                        {stripHtml(writing.content)}...
                      </p>

                      {/* Work Type Badge (if present) */}
                      {writing.work_type && (
                        <div className="mb-4">
                          <span 
                            className="inline-block px-3 py-1 rounded-full text-[#c4a46c] text-xs font-['Cormorant_Garamond'] uppercase tracking-wider"
                            style={{ 
                              background: 'rgba(196,164,108,0.15)', 
                              border: '1px solid rgba(196,164,108,0.3)' 
                            }}
                          >
                            {writing.work_type}
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {writing.tags && writing.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {writing.tags.slice(0, 3).map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-[rgba(122,155,118,0.1)] border border-[rgba(122,155,118,0.25)] rounded text-[#7a9b76] text-xs font-['Cormorant_Garamond']"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Time planted & Picked badge */}
                      <div className="flex items-center justify-between">
                        <p className="font-['Cormorant_Garamond'] text-[12px] text-[#8b9dc3]/50 italic">
                          {getTimeSincePlanted(writing.updated_at)}
                        </p>
                        {isAlreadyPicked(writing.id) && (
                          <span className="px-2 py-1 bg-[rgba(196,164,108,0.2)] border border-[rgba(196,164,108,0.4)] rounded text-[#c4a46c] text-xs font-['Cormorant_Garamond'] flex items-center gap-1">
                            <span>✦</span>
                            Picked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Picked Tab */}
          {activeTab === 'picked' && (
            <>
              <div className="mb-12">
                <h1 className="font-['Playfair_Display'] italic text-[52px] text-[#c4a46c] mb-3" style={{ textShadow: '0 0 30px rgba(196, 164, 108, 0.3)', lineHeight: '1.2' }}>
                  Your Picks
                </h1>
                <p className="font-['Cormorant_Garamond'] text-[19px] text-[#8b9dc3]/80" style={{ lineHeight: '1.7' }}>
                  Writing you've chosen for the Gallery
                </p>
              </div>

              {pickedWritings.length === 0 ? (
                <div className="text-center py-24">
                  <div className="mb-8">
                    <span className="text-7xl opacity-20">✦</span>
                  </div>
                  <p className="font-['Cormorant_Garamond'] text-[24px] text-[#8b9dc3] mb-3">
                    No pieces picked yet
                  </p>
                  <p className="font-['Cormorant_Garamond'] text-[17px] text-[#8b9dc3]/60 mb-10">
                    Wander through the gardens and discover what calls to you
                  </p>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="px-10 py-4 bg-[rgba(196,164,108,0.2)] border border-[#c4a46c] hover:bg-[rgba(196,164,108,0.3)] hover:shadow-xl hover:shadow-[#c4a46c]/20 text-[#c4a46c] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[15px] uppercase tracking-[0.15em] rounded-lg"
                  >
                    Start Wandering
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pickedWritings.map((writing) => (
                    <div
                      key={writing.id}
                      onClick={() => setSelectedWriting(writing)}
                      className="writing-card bg-[rgba(15,21,37,0.7)] border border-[rgba(196,164,108,0.3)] rounded-xl p-6 hover:border-[#c4a46c] hover:shadow-2xl hover:shadow-[#c4a46c]/10 transition-all cursor-pointer backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#7a9b76]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                          </svg>
                          <p className="font-['Cormorant_Garamond'] text-[13px] text-[#7a9b76]">
                            {writing.profiles?.garden_name || writing.profiles?.full_name || 'Anonymous'}'s garden
                          </p>
                        </div>
                        <span className="text-lg">{getStageIcon(writing.growth_stage)}</span>
                      </div>
                      <h3 className="font-['Playfair_Display'] italic text-[26px] text-[#e0e0e0] mb-3 line-clamp-2 leading-tight">
                        {writing.title}
                      </h3>
                      <p className="font-['Cormorant_Garamond'] text-[16px] text-[#8b9dc3] mb-4 line-clamp-4" style={{ lineHeight: '1.7' }}>
                        {stripHtml(writing.content)}...
                      </p>
                      <span className="inline-block px-3 py-1 bg-[rgba(196,164,108,0.2)] border border-[rgba(196,164,108,0.4)] rounded text-[#c4a46c] text-xs font-['Cormorant_Garamond'] flex items-center gap-1 w-fit">
                        <span>✦</span>
                        Picked for Gallery
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Collections Tab */}
          {activeTab === 'collections' && (
            <CollectionsTab pickedWritings={pickedWritings} />
          )}
        </div>
      </div>

      {/* Full Writing Modal */}
      {selectedWriting && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-8" 
          onClick={() => setSelectedWriting(null)}
        >
          <div 
            className="bg-[rgba(15,21,37,0.95)] border border-[rgba(196,164,108,0.4)] rounded-2xl p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-5 h-5 text-[#7a9b76]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                  </svg>
                  <p className="font-['Cormorant_Garamond'] text-[14px] text-[#7a9b76]">
                    from {selectedWriting.profiles?.garden_name || selectedWriting.profiles?.full_name || 'Anonymous'}'s garden
                  </p>
                  <span className="text-lg ml-1">{getStageIcon(selectedWriting.growth_stage)}</span>
                </div>
                <h2 className="font-['Playfair_Display'] italic text-[48px] text-[#f5f0e8] leading-tight" style={{ textShadow: '0 0 20px rgba(196, 164, 108, 0.2)' }}>
                  {selectedWriting.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedWriting(null)}
                className="ml-6 w-12 h-12 flex items-center justify-center rounded-lg border border-[rgba(139,157,195,0.3)] hover:border-[#8b9dc3] hover:bg-[rgba(139,157,195,0.1)] text-[#8b9dc3] transition-all cursor-pointer text-xl"
              >
                ✕
              </button>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-[rgba(196,164,108,0.2)]">
              {selectedWriting.work_type && (
                <span 
                  className="px-4 py-1.5 rounded-full text-[#c4a46c] text-sm font-['Cormorant_Garamond'] uppercase tracking-wider"
                  style={{ 
                    background: 'rgba(196,164,108,0.2)', 
                    border: '1px solid rgba(196,164,108,0.4)' 
                  }}
                >
                  {selectedWriting.work_type}
                </span>
              )}
              <p className="font-['Cormorant_Garamond'] text-[13px] text-[#8b9dc3]/70">
                {selectedWriting.word_count || 0} words
              </p>
              <p className="font-['Cormorant_Garamond'] text-[13px] text-[#8b9dc3]/70 italic">
                {getTimeSincePlanted(selectedWriting.updated_at)}
              </p>
            </div>

            {/* Content */}
            <div 
              className="font-['Cormorant_Garamond'] text-[20px] text-[#e8ddd0] mb-10 prose prose-invert max-w-none"
              style={{ lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: selectedWriting.content }}
            />

            {/* Tags */}
            {selectedWriting.tags && selectedWriting.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-[rgba(196,164,108,0.2)]">
                {selectedWriting.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-[rgba(122,155,118,0.15)] border border-[rgba(122,155,118,0.3)] rounded-full text-[#7a9b76] text-sm font-['Cormorant_Garamond']"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              {!isAlreadyPicked(selectedWriting.id) ? (
                <button
                  onClick={() => handlePickForGallery(selectedWriting)}
                  disabled={isPicking}
                  className="flex-1 px-10 py-5 bg-[rgba(196,164,108,0.2)] border border-[#c4a46c] hover:bg-[rgba(196,164,108,0.3)] hover:shadow-xl hover:shadow-[#c4a46c]/30 disabled:opacity-50 text-[#c4a46c] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[16px] uppercase tracking-[0.15em] rounded-lg flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">✦</span>
                  <span>{isPicking ? 'Picking...' : 'Pick for Gallery'}</span>
                </button>
              ) : (
                <div className="flex-1 px-10 py-5 bg-[rgba(196,164,108,0.2)] border border-[rgba(196,164,108,0.4)] text-[#c4a46c] font-['Cormorant_Garamond'] text-[16px] uppercase tracking-[0.15em] rounded-lg flex items-center justify-center gap-3">
                  <span className="text-2xl">✦</span>
                  <span>Already Picked</span>
                </div>
              )}
              <button
                onClick={() => setSelectedWriting(null)}
                className="px-10 py-5 border border-[rgba(139,157,195,0.3)] hover:border-[#8b9dc3] hover:bg-[rgba(139,157,195,0.1)] text-[#8b9dc3] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[16px] uppercase tracking-[0.15em] rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Demo Button */}
      <ExitDemoButton />
    </div>
  );
}
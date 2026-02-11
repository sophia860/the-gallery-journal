import { useState, useEffect } from 'react';
import { Compass, Flower2, Search, Heart, Sprout, Leaf, Sparkles, MapPin, BookOpen, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GardenMainNav } from '../components/GardenMainNav';
import { JoinTheGardenGate } from '../components/JoinTheGardenGate';
import { SectionDivider } from '../components/SectionDivider';
import { getPublicBlooms, searchWritings, toggleTend } from '/src/services/gardenWritingService';
import { Writing } from '/src/types/garden';

// Convert display name to URL slug
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Immersive Garden Card - Feels like visiting someone's space
function GardenCard({ writing, onTend, isDayMode = false }: { writing: Writing; onTend: (id: string) => void; isDayMode?: boolean }) {
  const [tending, setTending] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleTend = async () => {
    setTending(true);
    await onTend(writing.id);
    setTending(false);
  };

  const getGrowthIcon = () => {
    const iconColor = isDayMode ? '#1a1a5e' : undefined;
    const glowColor = isDayMode ? 'rgba(26, 26, 94, 0.6)' : undefined;
    
    switch (writing.growth_stage) {
      case 'seed': 
        return <div 
          className="w-2 h-2 rounded-full seed-pulse" 
          style={{ 
            background: isDayMode ? '#8B7355' : '#d4a574',
            boxShadow: isDayMode ? '0 0 8px rgba(139, 115, 85, 0.6)' : '0 0 8px rgba(212, 165, 116, 0.6)' 
          }}
        ></div>;
      case 'sprout': 
        return <Leaf 
          className="w-4 h-4 sprout-sway" 
          style={{ 
            color: isDayMode ? '#5A7A4A' : '#10b981',
            filter: isDayMode ? 'drop-shadow(0 0 6px rgba(90, 122, 74, 0.5))' : 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))' 
          }} 
        />;
      case 'bloom': 
        return <Flower2 
          className="w-5 h-5 bloom-rotate" 
          style={{ 
            color: isDayMode ? '#8A4A6C' : '#ec4899',
            filter: isDayMode ? 'drop-shadow(0 0 8px rgba(138, 74, 108, 0.6))' : 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))' 
          }} 
        />;
    }
  };

  if (isDayMode) {
    // Day Mode Card
    return (
      <div 
        className="rounded-2xl overflow-hidden transition-all duration-500 group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: 'rgba(26, 26, 94, 0.05)',
          border: '1px solid rgba(26, 26, 94, 0.1)',
          transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: isHovered 
            ? '0 20px 60px rgba(26, 26, 94, 0.2), 0 0 40px rgba(26, 26, 94, 0.1)' 
            : '0 8px 32px rgba(26, 26, 94, 0.08)'
        }}
      >
        {/* Garden Header Banner - Day Mode */}
        <div className="relative h-24 border-b overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(26, 26, 94, 0.08) 0%, rgba(139, 115, 85, 0.06) 100%)',
          borderBottom: '1px solid rgba(26, 26, 94, 0.1)'
        }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-4 w-12 h-12 rounded-full" style={{ background: 'radial-gradient(circle, rgba(26, 26, 94, 0.3) 0%, transparent 70%)', filter: 'blur(15px)' }}></div>
            <div className="absolute bottom-2 right-8 w-16 h-16 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139, 115, 85, 0.3) 0%, transparent 70%)', filter: 'blur(20px)' }}></div>
          </div>
          
          <div className="relative h-full flex items-end p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-['Cardo'] text-2xl font-bold shadow-xl" style={{ 
                  background: 'linear-gradient(135deg, #1a1a5e 0%, #2a2a7e 50%, #1a1a5e 100%)',
                  boxShadow: '0 0 25px rgba(26, 26, 94, 0.4), inset 0 2px 10px rgba(255,255,255,0.2)' 
                }}>
                  {writing.profile?.display_name?.[0]?.toUpperCase() || 'W'}
                </div>
                <div className="absolute -top-1 -right-1 p-1.5 rounded-full border backdrop-blur-sm" style={{
                  background: 'rgba(245, 240, 232, 0.95)',
                  borderColor: 'rgba(26, 26, 94, 0.2)'
                }}>
                  {getGrowthIcon()}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-['Cardo'] text-lg font-semibold italic" style={{ color: '#1a1a5e' }}>
                    {writing.profile?.writer_name || writing.profile?.display_name || 'Anonymous'}'s Garden
                  </p>
                  <Sparkles className="w-4 h-4" style={{ color: '#8B7355', filter: 'drop-shadow(0 0 6px rgba(139, 115, 85, 0.4))' }} />
                </div>
                <div className="flex items-center gap-2 text-xs font-['Inter']" style={{ color: '#5a5a8e' }}>
                  <MapPin className="w-3 h-3" />
                  <span>
                    Planted {new Date(writing.published_at || writing.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Writing Content - Day Mode */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="mt-1">
              <Flower2 className="w-6 h-6" style={{ 
                color: '#8A4A6C',
                filter: 'drop-shadow(0 0 10px rgba(138, 74, 108, 0.4))' 
              }} />
            </div>
            <h3 className="flex-1 font-['Cardo'] text-3xl leading-tight group-hover:opacity-80 transition-opacity duration-300" style={{ color: '#1a1a5e' }}>
              {writing.title}
            </h3>
          </div>

          <div className="relative mb-5">
            <p className="font-['Libre_Baskerville'] text-base leading-relaxed line-clamp-5" style={{ lineHeight: '1.8', color: '#2a2a6e' }}>
              {writing.content.slice(0, 280)}...
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{
              background: 'linear-gradient(to top, rgba(245, 240, 232, 0.9), transparent)'
            }}></div>
          </div>

          {writing.tags && writing.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {writing.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-['Inter'] font-medium rounded-full transition-all hover:shadow-md cursor-default"
                  style={{
                    background: 'rgba(26, 26, 94, 0.08)',
                    border: '1px solid rgba(26, 26, 94, 0.15)',
                    color: '#1a1a5e'
                  }}
                >
                  <span className="opacity-60">#</span>{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid rgba(26, 26, 94, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full flex items-center gap-1.5" style={{
                background: 'rgba(138, 74, 108, 0.1)',
                border: '1px solid rgba(138, 74, 108, 0.2)'
              }}>
                <Flower2 className="w-3 h-3" style={{ color: '#8A4A6C' }} />
                <span className="text-xs font-['Inter'] font-semibold uppercase tracking-wider" style={{ color: '#8A4A6C' }}>
                  {writing.growth_stage}
                </span>
              </div>
            </div>
            <div className="h-4 w-px" style={{ background: 'rgba(26, 26, 94, 0.2)' }}></div>
            <span className="text-xs font-['Inter'] italic" style={{ color: '#5a5a8e' }}>
              {writing.work_type || writing.type}
            </span>
            <div className="h-4 w-px" style={{ background: 'rgba(26, 26, 94, 0.2)' }}></div>
            <span className="text-xs font-['Inter']" style={{ color: '#5a5a8e' }}>
              {writing.word_count || 0} words
            </span>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleTend}
              disabled={tending}
              className={`group/tend px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                writing.has_tended ? 'shadow-md' : ''
              }`}
              style={writing.has_tended ? {
                background: 'linear-gradient(135deg, #8A4A6C 0%, #6a3a5c 100%)',
                color: 'white'
              } : {
                border: '1px solid rgba(26, 26, 94, 0.2)',
                color: '#5a5a8e',
                background: 'transparent'
              }}
            >
              <Heart className={`w-4 h-4 transition-transform group-hover/tend:scale-110 ${writing.has_tended ? 'fill-current' : ''}`} />
              <span className="font-['Inter'] text-sm font-medium">
                {writing.has_tended ? 'Tended' : 'Tend'}
              </span>
            </button>

            <a
              href={`/garden/visit/${writing.author_username || nameToSlug(writing.profile?.writer_name || writing.profile?.display_name || 'anonymous')}`}
              className="px-6 py-2.5 transition-all font-['Cardo'] text-lg rounded-lg shadow-md flex items-center gap-2 group/read visit-garden-btn"
              style={{
                background: 'linear-gradient(135deg, #1a1a5e 0%, #2a2a7e 100%)',
                color: 'white'
              }}
            >
              <span>Visit Garden</span>
              <Compass className="w-4 h-4 transition-transform group-hover/read:rotate-12 compass-icon" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Night Mode Card (existing design)
  return (
    <div 
      className="glass-card rounded-2xl overflow-hidden transition-all duration-500 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered 
          ? '0 20px 60px rgba(96, 165, 250, 0.3), 0 0 40px rgba(96, 165, 250, 0.2)' 
          : '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Garden Header Banner */}
      <div className="relative h-24 bg-gradient-to-br from-[#1a2332] via-[#0f1729] to-[#1a1f3a] border-b border-[rgba(139,157,195,0.2)] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#3b82f6]" style={{ filter: 'blur(15px)' }}></div>
          <div className="absolute bottom-2 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#ec4899] to-[#db2777]" style={{ filter: 'blur(20px)' }}></div>
        </div>
        
        <div className="relative h-full flex items-end p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#60a5fa] via-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center text-white font-['Cardo'] text-2xl font-bold shadow-xl" style={{ boxShadow: '0 0 25px rgba(96, 165, 250, 0.5), inset 0 2px 10px rgba(255,255,255,0.3)' }}>
                {writing.profile?.display_name?.[0]?.toUpperCase() || 'W'}
              </div>
              <div className="absolute -top-1 -right-1 p-1.5 bg-[rgba(15,23,41,0.95)] rounded-full border border-[rgba(139,157,195,0.3)] backdrop-blur-sm">
                {getGrowthIcon()}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-['Cardo'] text-lg text-white font-semibold italic" style={{ textShadow: '0 0 15px rgba(96, 165, 250, 0.4)' }}>
                  {writing.profile?.writer_name || writing.profile?.display_name || 'Anonymous'}'s Garden
                </p>
                <Sparkles className="w-4 h-4 text-[#d4a574]" style={{ filter: 'drop-shadow(0 0 6px rgba(212, 165, 116, 0.6))' }} />
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8b9dc3] font-['Inter']">
                <MapPin className="w-3 h-3" />
                <span>
                  Planted {new Date(writing.published_at || writing.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Writing Content */}
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-1">
            <Flower2 className="w-6 h-6 text-[#ec4899]" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }} />
          </div>
          <h3 className="flex-1 font-['Cardo'] text-3xl text-white leading-tight group-hover:text-[#60a5fa] transition-colors duration-300" style={{ textShadow: isHovered ? '0 0 25px rgba(96, 165, 250, 0.5)' : '0 0 15px rgba(255, 255, 255, 0.2)' }}>
            {writing.title}
          </h3>
        </div>

        <div className="relative mb-5">
          <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8] leading-relaxed line-clamp-5" style={{ lineHeight: '1.8' }}>
            {writing.content.slice(0, 280)}...
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[rgba(15,23,41,0.9)] to-transparent pointer-events-none"></div>
        </div>

        {writing.tags && writing.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {writing.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-[rgba(96,165,250,0.12)] border border-[rgba(96,165,250,0.25)] text-[#60a5fa] text-xs font-['Inter'] font-medium rounded-full transition-all hover:bg-[rgba(96,165,250,0.2)] hover:border-[rgba(96,165,250,0.4)] hover:shadow-lg hover:shadow-blue-500/20 cursor-default"
              >
                <span className="opacity-60">#</span>{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[rgba(139,157,195,0.2)]">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-[rgba(236,72,153,0.15)] border border-[rgba(236,72,153,0.25)] rounded-full flex items-center gap-1.5">
              <Flower2 className="w-3 h-3 text-[#ec4899]" />
              <span className="text-[#ec4899] text-xs font-['Inter'] font-semibold uppercase tracking-wider">
                {writing.growth_stage}
              </span>
            </div>
          </div>
          <div className="h-4 w-px bg-[rgba(139,157,195,0.3)]"></div>
          <span className="text-xs text-[#8b9dc3] font-['Inter'] italic">
            {writing.work_type || writing.type}
          </span>
          <div className="h-4 w-px bg-[rgba(139,157,195,0.3)]"></div>
          <span className="text-xs text-[#8b9dc3] font-['Inter']">
            {writing.word_count || 0} words
          </span>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleTend}
            disabled={tending}
            className={`group/tend px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
              writing.has_tended
                ? 'bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white shadow-lg shadow-pink-500/30'
                : 'border border-[rgba(139,157,195,0.3)] text-[#8b9dc3] hover:border-[#ec4899] hover:bg-[rgba(236,72,153,0.1)] hover:text-[#ec4899]'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform group-hover/tend:scale-110 ${writing.has_tended ? 'fill-current' : ''}`} />
            <span className="font-['Inter'] text-sm font-medium">
              {writing.has_tended ? 'Tended' : 'Tend'}
            </span>
          </button>

          <a
            href={`/garden/visit/${writing.author_username || nameToSlug(writing.profile?.writer_name || writing.profile?.display_name || 'anonymous')}`}
            className="px-6 py-2.5 bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] text-white hover:from-[#3b82f6] hover:via-[#2563eb] hover:to-[#1d4ed8] transition-all font-['Cardo'] text-lg rounded-lg shadow-lg flex items-center gap-2 group/read visit-garden-btn"
            style={{ boxShadow: '0 0 25px rgba(96, 165, 250, 0.4)' }}
          >
            <span>Visit Garden</span>
            <Compass className="w-4 h-4 transition-transform group-hover/read:rotate-12 compass-icon" />
          </a>
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-10 right-10 w-1 h-1 bg-[#60a5fa] rounded-full animate-pulse" style={{ boxShadow: '0 0 15px rgba(96, 165, 250, 0.8)' }}></div>
          <div className="absolute bottom-20 left-8 w-1.5 h-1.5 bg-[#ec4899] rounded-full animate-pulse" style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.8)', animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 left-6 w-1 h-1 bg-[#10b981] rounded-full animate-pulse" style={{ boxShadow: '0 0 12px rgba(16, 185, 129, 0.8)', animationDelay: '1s' }}></div>
        </div>
      )}
    </div>
  );
}

export function ExplorePage() {
  const { user, loading: authLoading } = useAuth();
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (user) {
      loadBlooms();
    }
  }, [user]);

  // AUTH GATE: Show join gate if not logged in (after all hooks)
  if (!authLoading && !user) {
    return <JoinTheGardenGate />;
  }

  const loadBlooms = async () => {
    try {
      setLoading(true);
      
      const timeoutId = setTimeout(() => {
        console.log('Explore loading timeout - falling back to mock data');
        useMockBlooms();
        setLoading(false);
      }, 2000);
      
      try {
        const data = await getPublicBlooms(50, 0);
        clearTimeout(timeoutId);
        if (data && data.length > 0) {
          setWritings(data);
          setLoading(false);
        } else {
          useMockBlooms();
          setLoading(false);
        }
      } catch (dbError) {
        clearTimeout(timeoutId);
        console.log('Database not available, using mock data:', dbError);
        useMockBlooms();
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading blooms:', error);
      useMockBlooms();
      setLoading(false);
    }
  };

  const useMockBlooms = () => {
    const mockBlooms: Writing[] = [
      {
        id: '1',
        user_id: 'user-1',
        title: 'The Weight of Autumn',
        content: 'There\'s a heaviness that settles in when the leaves begin to turn. Not sadness exactly, but a kind of melancholy nostalgia for summers not quite finished. I walk through the park and feel time slipping through my fingers like sand, like water, like the wind that carries these dying leaves into piles at the edges of memory. My grandmother used to say that autumn is when the earth exhales. All summer long it holds its breath, green and tense with growing. Then September comes and everything loosens. The trees let go. The garden stops trying.',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'poetry',
        word_count: 342,
        character_count: 1680,
        tags: ['autumn', 'reflection', 'nature'],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'poetry',
        profile: {
          display_name: 'Maya Chen',
          writer_name: 'Maya Chen'
        },
        author_username: 'maya-chen'
      },
      {
        id: '2',
        user_id: 'user-2',
        title: 'Letters to My Younger Self',
        content: 'Dear 25-year-old me, I know you think you have it all figured out. I know you believe that success means climbing ladders and checking boxes. Let me tell you something that will save you years of wondering: you\'re allowed to change your mind. You\'re allowed to want different things. This isn\'t failure. This is growth. That apartment you\'re saving for? You won\'t want it in three years. That career path that seems so certain? It will bore you to tears. The person you think you\'ll marry? They\'re wonderful, but wrong for you.',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'essay',
        word_count: 520,
        character_count: 2560,
        tags: ['personal', 'growth', 'wisdom'],
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'essay',
        profile: {
          display_name: 'Jordan Rivers',
          writer_name: 'Jordan Rivers'
        },
        author_username: 'jordan-rivers'
      },
      {
        id: '3',
        user_id: 'user-3',
        title: 'The House on Maple Street',
        content: 'The house appeared overnight, or so the neighborhood children claimed. One day there was an empty lot overgrown with weeds and wildflowers, and the next—a Victorian mansion with peeling paint and windows that reflected clouds that weren\'t in the sky. Old Mrs. Patterson swore she saw lights moving inside at 3 AM, even though the electric company had no record of service to that address. The mailman refused to deliver there after finding letters addressed to people who\'d been dead for forty years.',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'fiction',
        word_count: 445,
        character_count: 2180,
        tags: ['fiction', 'mystery', 'magical-realism'],
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'fiction',
        profile: {
          display_name: 'River Park',
          writer_name: 'River Park'
        },
        author_username: 'river-park'
      },
      {
        id: '4',
        user_id: 'user-4',
        title: 'On Grief and Gratitude',
        content: 'They told me grief comes in waves. What they didn\'t mention is that sometimes you\'re drowning and sometimes you\'re floating and sometimes—on the good days—you remember that you know how to swim. My mother died on a Tuesday. Not a special Tuesday, not a dramatic Tuesday. Just a regular, unremarkable Tuesday in March when the daffodils were starting to come up. She would have liked that detail about the daffodils. She always said spring was about small resurrections.',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'memoir',
        word_count: 680,
        character_count: 3340,
        tags: ['grief', 'family', 'healing'],
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'memoir',
        profile: {
          display_name: 'Alex Santos',
          writer_name: 'Alex Santos'
        },
        author_username: 'alex-santos'
      },
      {
        id: '5',
        user_id: 'user-5',
        title: 'Fragments: City at 3 AM',
        content: 'Streetlight halos. Empty bus stops. A cat crossing the intersection with more purpose than I\'ve had all week. The bodega guy who knows my order. Steam rising from manholes like the city is breathing. Someone\'s distant laughter. The way loneliness feels less lonely when everyone else is asleep. Neon signs humming their electric psalms. A taxi with its light on, going nowhere in particular.',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'experimental',
        word_count: 180,
        character_count: 890,
        tags: ['experimental', 'urban', 'night'],
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'fragment',
        profile: {
          display_name: 'Sam Taylor',
          writer_name: 'Sam Taylor'
        },
        author_username: 'sam-taylor'
      },
      {
        id: '6',
        user_id: 'user-6',
        title: 'What Gardening Taught Me About Patience',
        content: 'You can\'t rush a tomato. You can give it the best soil, the perfect amount of sun, sing to it if you want—but it will ripen when it\'s ready. Not when you need it for dinner, not when you planned your salad around it. This is not a metaphor. Or maybe it is. I planted my first garden at 32, right after my second divorce, when I needed something that would grow without arguing back. The tomatoes taught me more about timing than any therapist ever did.',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'essay',
        word_count: 390,
        character_count: 1920,
        tags: ['gardening', 'patience', 'life-lessons'],
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'essay',
        profile: {
          display_name: 'Casey Green',
          writer_name: 'Casey Green'
        },
        author_username: 'casey-green'
      },
      {
        id: '7',
        user_id: 'editor-1',
        title: 'The Art of Revision',
        content: 'Good writing is rewriting. This truth haunts us because it means the first draft is never enough. It means that brilliant flash of inspiration must be tempered with patience, that what felt perfect at 2am often reads differently at noon. Revision is where we learn what we actually meant to say. It is where voice emerges from noise, where structure reveals itself beneath the chaos of initial creation. The best editors know this instinctively: they are not there to fix your work, but to help you see what it could become.',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'essay',
        word_count: 445,
        character_count: 2200,
        tags: ['craft', 'editing', 'writing-advice'],
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'essay',
        profile: {
          display_name: 'Sophia (Editor)',
          writer_name: 'Sophia'
        },
        author_username: 'sophia-editor',
        is_editor: true
      },
      {
        id: '8',
        user_id: 'editor-1',
        title: 'On Reading Like a Writer',
        content: 'When you read as a writer, everything changes. You notice the rhythm of sentences, the architecture of paragraphs. You see how a writer builds tension or releases it, how they use white space like punctuation, how they choose that word instead of this one. You become aware of craft in a way that makes reading slower, richer, more deliberate. This is not about losing the joy of story—it is about deepening it, about understanding that magic is made, not given.',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'essay',
        word_count: 380,
        character_count: 1850,
        tags: ['craft', 'reading', 'technique'],
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'essay',
        profile: {
          display_name: 'Sophia (Editor)',
          writer_name: 'Sophia'
        },
        author_username: 'sophia-editor',
        is_editor: true
      },
      {
        id: '9',
        user_id: 'editor-2',
        title: 'Finding Your Voice',
        content: 'Your voice is not something you find—it is something you uncover. Beneath the imitation, beneath the trying-too-hard, beneath the voice you think you should have, there is the voice you actually have. It emerges through practice, through failure, through writing so much that eventually you stop performing and start speaking. Voice is what remains when you stop trying to sound like someone else. It is the cadence of your thought, the particular way you see the world.',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'essay',
        word_count: 420,
        character_count: 2050,
        tags: ['voice', 'craft', 'authenticity'],
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'essay',
        profile: {
          display_name: 'Giove (Editor)',
          writer_name: 'Giove'
        },
        author_username: 'giove-editor',
        is_editor: true
      },
      {
        id: '10',
        user_id: 'editor-2',
        title: 'The Courage to Begin',
        content: 'Every writer knows the terror of the blank page. It is not just emptiness—it is potential, which is somehow more frightening. To begin means to commit, to make choices, to move from the realm of infinite possibility into the messy reality of actual words. But here is the secret: beginning badly is still beginning. The first sentence does not have to be perfect. It just has to exist. You can always revise. You cannot revise nothing.',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'essay',
        word_count: 395,
        character_count: 1920,
        tags: ['process', 'courage', 'beginning'],
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'essay',
        profile: {
          display_name: 'Giove (Editor)',
          writer_name: 'Giove'
        },
        author_username: 'giove-editor',
        is_editor: true
      }
    ];

    setWritings(mockBlooms);
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
      if (results && results.length > 0) {
        setWritings(results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleTend = async (writingId: string) => {
    try {
      await toggleTend(writingId);
      setWritings(prev =>
        prev.map(w =>
          w.id === writingId ? { ...w, has_tended: !w.has_tended } : w
        )
      );
    } catch (error) {
      console.error('Tend error:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0f1729' }}>
      {/* Starfield for Night Sections */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="stars-layer"></div>
        <div className="stars-layer-2"></div>
        <div className="stars-layer-3"></div>
        <div className="stars-layer-glow"></div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 10% 10%, white, transparent),
            radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 30% 15%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(3px 3px at 40% 40%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 50% 25%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 70% 50%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 80% 20%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 15% 60%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(2px 2px at 25% 80%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 35% 90%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 45% 5%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 55% 55%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 65% 35%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 75% 75%, rgba(180, 200, 255, 0.9), transparent),
            radial-gradient(2px 2px at 85% 85%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 95% 45%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 5% 95%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 12% 42%, rgba(255, 255, 255, 0.85), transparent);
          background-size: 200% 200%;
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 8% 20%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 18% 55%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 28% 12%, white, transparent),
            radial-gradient(1px 1px at 38% 68%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 48% 82%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 58% 38%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 68% 8%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 78% 58%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 88% 28%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 98% 78%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 3% 33%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(1px 1px at 13% 73%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 23% 48%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 33% 88%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 43% 18%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 53% 63%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 63% 93%, rgba(180, 200, 255, 0.85), transparent),
            radial-gradient(1px 1px at 73% 23%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 83% 53%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 93% 3%, rgba(255, 255, 255, 0.9), transparent);
          background-size: 250% 250%;
          animation: twinkle 6s ease-in-out infinite reverse;
        }

        .stars-layer-3 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 6% 16%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 16% 46%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 26% 76%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 36% 6%, white, transparent),
            radial-gradient(1px 1px at 46% 36%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 56% 66%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 66% 96%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 76% 26%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 86% 56%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(1px 1px at 96% 86%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 11% 51%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 21% 21%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 31% 81%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 41% 41%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 51% 11%, rgba(180, 200, 255, 0.9), transparent),
            radial-gradient(1px 1px at 61% 71%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 71% 31%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 81% 91%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 91% 61%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 1% 1%, rgba(255, 255, 255, 0.8), transparent);
          background-size: 300% 300%;
          animation: twinkle 8s ease-in-out infinite;
        }

        .stars-layer-glow {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(3px 3px at 15% 25%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(4px 4px at 45% 55%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(3px 3px at 75% 35%, rgba(200, 220, 255, 1), transparent),
            radial-gradient(4px 4px at 85% 75%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(3px 3px at 25% 85%, rgba(180, 210, 255, 1), transparent);
          background-size: 100% 100%;
          animation: glow 3s ease-in-out infinite;
          filter: blur(0.5px);
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes glow {
          0%, 100% { 
            opacity: 1;
            filter: blur(0.5px);
          }
          50% { 
            opacity: 0.6;
            filter: blur(1px);
          }
        }

        .glass-card {
          background: rgba(15, 23, 41, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(139, 157, 195, 0.25);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
        }

        /* Paper texture for day mode sections */
        .paper-texture {
          position: relative;
        }
        
        .paper-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(26, 26, 94, 0.02) 2px, rgba(26, 26, 94, 0.02) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(26, 26, 94, 0.02) 2px, rgba(26, 26, 94, 0.02) 4px);
          opacity: 0.5;
          pointer-events: none;
        }

        /* === FIREFLY PARTICLES === */
        .firefly {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 220, 100, 1) 0%, rgba(255, 200, 80, 0.6) 50%, transparent 100%);
          box-shadow: 0 0 10px rgba(255, 220, 100, 0.8), 0 0 20px rgba(255, 200, 80, 0.4);
          animation: firefly-float 8s ease-in-out infinite;
          opacity: 0;
          pointer-events: none;
        }

        .firefly:nth-child(1) { left: 10%; animation-delay: 0s; animation-duration: 12s; }
        .firefly:nth-child(2) { left: 25%; animation-delay: 2s; animation-duration: 10s; }
        .firefly:nth-child(3) { left: 40%; animation-delay: 4s; animation-duration: 14s; }
        .firefly:nth-child(4) { left: 60%; animation-delay: 1s; animation-duration: 11s; }
        .firefly:nth-child(5) { left: 75%; animation-delay: 3s; animation-duration: 13s; }
        .firefly:nth-child(6) { left: 85%; animation-delay: 5s; animation-duration: 9s; }

        @keyframes firefly-float {
          0% { bottom: 0%; opacity: 0; transform: translateX(0) scale(0.8); }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { bottom: 100%; opacity: 0; transform: translateX(30px) scale(1.2); }
        }

        /* === AMBIENT TITLE GLOW === */
        .title-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%);
          filter: blur(60px);
          animation: ambient-pulse 4s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }

        @keyframes ambient-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }

        /* === GROWTH ICON ANIMATIONS === */
        @keyframes seed-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }

        @keyframes sprout-sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }

        @keyframes bloom-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .seed-pulse { animation: seed-pulse 2s ease-in-out infinite; }
        .sprout-sway { animation: sprout-sway 3s ease-in-out infinite; }
        .bloom-rotate { animation: bloom-rotate 20s linear infinite; }

        /* === VISIT GARDEN BUTTON === */
        .visit-garden-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(212, 165, 116, 0.5), 0 0 60px rgba(212, 165, 116, 0.3) !important;
        }

        .compass-icon {
          transition: transform 1s ease-in-out;
        }

        a:hover .compass-icon {
          animation: compass-spin 1s ease-in-out;
        }

        @keyframes compass-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <GardenMainNav variant="dark" />

      {/* SECTION 1: Hero & Search - NIGHT MODE */}
      <div className="pt-32 pb-20 px-8 relative z-10">
        {/* Fireflies */}
        <div className="firefly" style={{ bottom: '0%' }}></div>
        <div className="firefly" style={{ bottom: '10%' }}></div>
        <div className="firefly" style={{ bottom: '20%' }}></div>
        <div className="firefly" style={{ bottom: '30%' }}></div>
        <div className="firefly" style={{ bottom: '15%' }}></div>
        <div className="firefly" style={{ bottom: '25%' }}></div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-3 mb-4 relative">
              {/* Ambient glow behind title */}
              <div className="title-glow" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}></div>
              <Compass className="w-8 h-8 text-[#60a5fa]" style={{ filter: 'drop-shadow(0 0 12px rgba(96, 165, 250, 0.6))' }} />
              <h1 className="font-['Playfair_Display'] text-[5.2rem] text-white italic font-bold" style={{ textShadow: '0 0 40px rgba(96, 165, 250, 0.15), 0 0 60px rgba(96, 165, 250, 0.3)' }}>
                Neighboring Gardens
              </h1>
              <Sprout className="w-8 h-8 text-[#10b981]" style={{ filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))' }} />
            </div>
            <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8] max-w-2xl mx-auto" style={{ lineHeight: '1.8', fontSize: '16px' }}>
              Wander through the literary gardens of fellow writers. Every bloom tells a story.
            </p>
          </div>

          <div className="mb-12">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b9dc3]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gardens by writer, title, or tags..."
                  className="w-full pl-14 pr-4 py-4 glass-card text-white placeholder:text-[#8b9dc3] focus:outline-none font-['Inter'] text-base rounded-xl focus:border-[rgba(96,165,250,0.5)] transition-all"
                  style={{ boxShadow: '0 0 30px rgba(96, 165, 250, 0.15)' }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* DIVIDER: Night to Day */}
      <SectionDivider color="#F5F0E8" />

      {/* SECTION 2: Philosophy Quote - DAY MODE */}
      <div className="py-20 px-8 relative paper-texture" style={{ background: '#F5F0E8' }}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <BookOpen className="w-12 h-12 mx-auto mb-6" style={{ color: '#8B7355' }} />
          <blockquote className="font-['Playfair_Display'] italic leading-relaxed mb-6" style={{ 
            color: '#1a1a5e',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            lineHeight: '1.6'
          }}>
            "A garden requires patient labor and attention. Plants do not grow merely to satisfy ambitions or to fulfill good intentions. They thrive because someone expended effort on them."
          </blockquote>
          <p className="font-['Inter'] uppercase tracking-widest font-medium" style={{ 
            color: '#5a5a8e',
            fontSize: '11px',
            letterSpacing: '0.2em'
          }}>
            — Liberty Hyde Bailey
          </p>
        </div>
      </div>

      {/* DIVIDER: Day to Night */}
      <SectionDivider color="#0f1729" />

      {/* SECTION 3: Writing Cards Grid - NIGHT MODE */}
      <div className="py-20 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <Sprout className="w-12 h-12 text-[#60a5fa] animate-pulse" style={{ filter: 'drop-shadow(0 0 15px rgba(96, 165, 250, 0.6))' }} />
                <Compass className="w-10 h-10 text-[#10b981] animate-pulse" style={{ filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))', animationDelay: '0.3s' }} />
                <Flower2 className="w-12 h-12 text-[#ec4899] animate-pulse" style={{ filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.6))', animationDelay: '0.6s' }} />
              </div>
              <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8]">
                Discovering gardens...
              </p>
            </div>
          ) : writings.length === 0 ? (
            <div className="text-center py-20">
              <Compass className="w-16 h-16 text-[#60a5fa] mx-auto mb-6 opacity-50" />
              <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8]">
                No gardens found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {writings.slice(0, 4).map((writing) => (
                <GardenCard key={writing.id} writing={writing} onTend={handleTend} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DIVIDER: Night to Day */}
      <SectionDivider color="#F5F0E8" />

      {/* SECTION 4: More Gardens - DAY MODE */}
      {writings.length > 4 && (
        <div className="py-20 px-8 relative paper-texture" style={{ background: '#F5F0E8' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-['Cardo'] text-5xl italic mb-4" style={{ color: '#1a1a5e' }}>
                More Gardens to Explore
              </h2>
              <p className="font-['Libre_Baskerville'] text-lg" style={{ color: '#5a5a8e' }}>
                Continue your journey through our literary landscape
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {writings.slice(4).map((writing) => (
                <GardenCard key={writing.id} writing={writing} onTend={handleTend} isDayMode={true} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
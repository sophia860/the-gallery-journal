import { useState, useEffect } from 'react';
import { Sprout, Leaf, Flower2, Plus, Calendar, Users, TrendingUp, BookOpen, Eye, Lock, Crown, Zap, Home as HomeIcon } from 'lucide-react';
import { GardenMainNav } from '../components/GardenMainNav';
import { NightSkyBackground } from '../components/NightSkyBackground';
import { JoinTheGardenGate } from '../components/JoinTheGardenGate';
import { GardenFooter } from '../components/GardenFooter';
import { useAuth } from '../contexts/AuthContext';

interface Writing {
  id: string;
  user_id: string;
  title: string;
  content: string;
  growth_stage: 'seed' | 'sprout' | 'bloom';
  visibility: 'private' | 'circles' | 'public' | 'garden';
  work_type?: string;
  word_count?: number;
  character_count?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface GardenStats {
  total_writings: number;
  seeds: number;
  sprouts: number;
  blooms: number;
  total_words: number;
  public_count: number;
  circles_count: number;
  private_count: number;
}

// Plant visual component
function PlantVisual({ writing }: { writing: Writing }) {
  const getPlantIcon = () => {
    switch (writing.growth_stage) {
      case 'seed':
        return <div className="w-3 h-3 bg-[#d4a574] rounded-full shadow-lg" style={{ boxShadow: '0 0 10px rgba(212, 165, 116, 0.5)' }}></div>;
      case 'sprout':
        return <Leaf className="w-8 h-8 text-[#10b981]" style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' }} />;
      case 'bloom':
        return <Flower2 className="w-12 h-12 text-[#ec4899]" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.5))' }} />;
    }
  };

  const getVisibilityIcon = () => {
    switch (writing.visibility) {
      case 'private':
        return <Lock className="w-3 h-3" />;
      case 'circles':
        return <Users className="w-3 h-3" />;
      case 'public':
      case 'garden':
        return <Eye className="w-3 h-3" />;
    }
  };

  const getPlantSize = () => {
    switch (writing.growth_stage) {
      case 'seed':
        return 'w-16 h-16';
      case 'sprout':
        return 'w-24 h-24';
      case 'bloom':
        return 'w-32 h-32';
    }
  };

  return (
    <div className={`${getPlantSize()} flex flex-col items-center justify-center glass-card rounded-lg hover:border-[rgba(96,165,250,0.5)] transition-all cursor-pointer group relative`}>
      {/* Plant Icon */}
      <div className="flex items-center justify-center mb-1">
        {getPlantIcon()}
      </div>
      
      {/* Visibility Badge */}
      <div className="absolute top-1 right-1 p-1 bg-[rgba(15,23,41,0.8)] rounded-full text-[#60a5fa] backdrop-blur-sm">
        {getVisibilityIcon()}
      </div>

      {/* Tooltip on Hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 glass-card text-white text-xs font-['Inter'] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {writing.title}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[rgba(15,23,41,0.9)]"></div>
      </div>
    </div>
  );
}

export function MyGardenPage() {
  const { user, loading: authLoading } = useAuth();
  const [writings, setWritings] = useState<Writing[]>([]);
  const [stats, setStats] = useState<GardenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'seed' | 'sprout' | 'bloom'>('all');
  const [selectedWriting, setSelectedWriting] = useState<Writing | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'stage' | 'alphabetical'>('date');
  const [collectionFilter, setCollectionFilter] = useState<'all' | 'poetry' | 'essays' | 'fiction'>('all');

  useEffect(() => {
    if (user) {
      loadGarden();
    }
  }, [user]);

  const loadGarden = async () => {
    if (!user) return;

    // Just use mock data for now
    setLoading(true);
    setTimeout(() => {
      useMockData();
      setLoading(false);
    }, 500);
  };

  const useMockData = () => {
    if (!user) return;
    
    // Mock writings
    const mockWritings: Writing[] = [
      {
        id: '1',
        user_id: user.id,
        title: 'Morning Thoughts',
        content: 'The quiet before dawn holds a special kind of magic...',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'poetry',
        word_count: 250,
        character_count: 1200,
        tags: ['morning', 'reflection'],
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        user_id: user.id,
        title: 'Work in Progress',
        content: 'Still finding the right words for this one. It needs more time to grow...',
        growth_stage: 'sprout',
        visibility: 'circles',
        work_type: 'prose',
        word_count: 180,
        character_count: 850,
        tags: ['draft', 'experimental'],
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        user_id: user.id,
        title: 'A New Idea',
        content: 'Just planting this seed...',
        growth_stage: 'seed',
        visibility: 'private',
        work_type: 'fragment',
        word_count: 45,
        character_count: 220,
        tags: ['idea'],
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        user_id: user.id,
        title: 'Sunset Musings',
        content: 'The sky painted in shades of amber and rose, a canvas that changes every evening...',
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'essay',
        word_count: 320,
        character_count: 1550,
        tags: ['nature', 'observation'],
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        user_id: user.id,
        title: 'Untitled',
        content: 'Some words about...',
        growth_stage: 'seed',
        visibility: 'private',
        work_type: 'personal',
        word_count: 30,
        character_count: 150,
        tags: [],
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      }
    ];

    const mockStats: GardenStats = {
      total_writings: 5,
      seeds: 2,
      sprouts: 1,
      blooms: 2,
      total_words: 825,
      public_count: 2,
      circles_count: 1,
      private_count: 2
    };

    setWritings(mockWritings);
    setStats(mockStats);
  };

  const filteredWritings = filter === 'all' 
    ? writings 
    : writings.filter(w => w.growth_stage === filter);

  // AUTH GATE: Show join gate if not logged in (after all hooks)
  if (!authLoading && !user) {
    return <JoinTheGardenGate />;
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f1729] relative overflow-hidden flex items-center justify-center">
        <NightSkyBackground />
        <div className="relative z-10 text-center">
          <Sprout className="w-12 h-12 text-[#60a5fa] animate-pulse mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))' }} />
          <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Get subscription tier from localStorage or user metadata
  const getTier = () => {
    if (typeof window !== 'undefined') {
      const storedTier = localStorage.getItem('subscription_tier');
      if (storedTier) return storedTier;
    }
    return user?.user_metadata?.subscription_tier || 'seedling';
  };

  const tier = getTier();

  const getTierInfo = (tierName: string) => {
    const tiers: Record<string, any> = {
      seedling: {
        name: 'Seedling',
        color: '#8b9dc3',
        icon: <Sprout className="w-6 h-6" />,
        features: ['Basic writing space', 'Share in Garden', 'Join 3 Circles'],
        canUpgrade: true
      },
      gardener: {
        name: 'Gardener',
        color: '#10b981',
        icon: <Leaf className="w-6 h-6" />,
        features: ['Unlimited Circles', 'Propose Grafts', 'Priority Support', 'Profile customization'],
        canUpgrade: true
      },
      greenhouse: {
        name: 'Greenhouse',
        color: '#c4a46c',
        icon: <Crown className="w-6 h-6" />,
        features: ['Everything in Gardener', 'Direct editor submissions', 'Featured in Gallery', 'Early access to features'],
        canUpgrade: false
      }
    };
    return tiers[tierName.toLowerCase()] || tiers.gardener;
  };

  const tierInfo = getTierInfo(tier);

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      {/* Animated Starfield Background */}
      <NightSkyBackground />

      <GardenMainNav variant="dark" />

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-['Cardo'] text-6xl text-white mb-3 italic" style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.4)' }}>
                  My Garden
                </h1>
                <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8]">
                  {user?.user_metadata?.writer_name || user?.user_metadata?.display_name || 'Your'} writing space
                </p>
              </div>
              <a
                href="/garden/write"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white hover:from-[#3b82f6] hover:to-[#2563eb] transition-all font-['Cardo'] text-lg rounded-lg shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                New Writing
              </a>
            </div>

            {/* Subscription Tier Badge */}
            <div className="glass-card rounded-xl p-6 mb-6" style={{ background: 'rgba(15, 23, 41, 0.7)', border: `1px solid ${tierInfo.color}40` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ 
                      background: `${tierInfo.color}20`,
                      border: `2px solid ${tierInfo.color}`,
                      boxShadow: `0 0 20px ${tierInfo.color}40`
                    }}
                  >
                    <div style={{ color: tierInfo.color }}>
                      {tierInfo.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-['Cardo'] text-2xl text-white italic">{tierInfo.name} Member</h3>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-['Inter'] uppercase tracking-wider font-semibold"
                        style={{ 
                          background: `${tierInfo.color}20`,
                          color: tierInfo.color,
                          border: `1px solid ${tierInfo.color}`
                        }}
                      >
                        Active
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tierInfo.features.map((feature: string, idx: number) => (
                        <span key={idx} className="text-sm text-[#c8cad8] font-['Inter'] flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#60a5fa]"></span>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {tierInfo.canUpgrade && (
                  <a
                    href="/pricing"
                    className="px-6 py-3 bg-gradient-to-r from-[#c4a46c] to-[#b8935f] text-white hover:from-[#b8935f] hover:to-[#a68254] transition-all font-['Inter'] text-sm font-semibold rounded-lg shadow-lg flex items-center gap-2"
                    style={{ boxShadow: '0 0 20px rgba(196, 164, 108, 0.3)' }}
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="glass-card rounded-lg p-4">
                  <div className="font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-1">
                    Total
                  </div>
                  <div className="font-['Cardo'] text-3xl text-white">
                    {stats.total_writings}
                  </div>
                </div>
                <div className="glass-card rounded-lg p-4">
                  <div className="font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#d4a574] rounded-full"></div>
                    Seeds
                  </div>
                  <div className="font-['Cardo'] text-3xl text-white">
                    {stats.seeds}
                  </div>
                </div>
                <div className="glass-card rounded-lg p-4">
                  <div className="font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-[#10b981]" />
                    Sprouts
                  </div>
                  <div className="font-['Cardo'] text-3xl text-white">
                    {stats.sprouts}
                  </div>
                </div>
                <div className="glass-card rounded-lg p-4">
                  <div className="font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Flower2 className="w-3 h-3 text-[#ec4899]" />
                    Blooms
                  </div>
                  <div className="font-['Cardo'] text-3xl text-white">
                    {stats.blooms}
                  </div>
                </div>
                <div className="glass-card rounded-lg p-4">
                  <div className="font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-1">
                    Public
                  </div>
                  <div className="font-['Cardo'] text-3xl text-white">
                    {stats.public_count}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-8 relative z-10">
            {(['all', 'seed', 'sprout', 'bloom'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setFilter(stage)}
                className={`px-4 py-2 font-['Inter'] text-sm uppercase tracking-wider font-semibold transition-all rounded-lg ${
                  filter === stage
                    ? 'bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30'
                    : 'glass-card text-[#c8cad8] hover:border-[rgba(96,165,250,0.4)]'
                }`}
              >
                {stage === 'all' ? 'All Writings' : stage}
              </button>
            ))}
          </div>

          {/* Garden Grid */}
          {loading ? (
            <div className="text-center py-20 relative z-10">
              <Sprout className="w-12 h-12 text-[#60a5fa] animate-pulse mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))' }} />
              <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8]">
                Loading your garden...
              </p>
            </div>
          ) : filteredWritings.length === 0 ? (
            <div className="text-center py-20 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#60a5fa]/20 to-[#3b82f6]/20 rounded-full mb-6 shadow-lg shadow-blue-500/20">
                <Sprout className="w-10 h-10 text-[#60a5fa]" />
              </div>
              <h3 className="font-['Cardo'] text-3xl text-white mb-3 italic" style={{ textShadow: '0 0 20px rgba(96, 165, 250, 0.3)' }}>
                Your garden awaits
              </h3>
              <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8] mb-8 max-w-md mx-auto">
                Plant your first seed. Every piece of writing starts somewhere.
              </p>
              <a
                href="/garden/write"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white hover:from-[#3b82f6] hover:to-[#2563eb] transition-all font-['Cardo'] text-lg rounded-lg shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                Start Writing
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative z-10">
              {filteredWritings.map((writing) => (
                <a
                  key={writing.id}
                  href={`/garden/writing/${writing.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedWriting(writing);
                  }}
                >
                  <PlantVisual writing={writing} />
                </a>
              ))}
            </div>
          )}

          {/* Quick Preview Modal */}
          {selectedWriting && (
            <div 
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
              onClick={() => setSelectedWriting(null)}
            >
              <div 
                className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-2">
                        {selectedWriting.title}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-[#8A9A7B]/10 border border-[#8A9A7B] text-[#8A9A7B] text-xs uppercase tracking-wider font-['Inter'] font-semibold rounded">
                          {selectedWriting.growth_stage}
                        </span>
                        <span className="px-2 py-1 bg-[#8B7355]/10 border border-[#8B7355] text-[#8B7355] text-xs uppercase tracking-wider font-['Inter'] font-semibold rounded">
                          {selectedWriting.visibility}
                        </span>
                        <span className="text-xs text-[#8B7355] font-['Inter']">
                          {selectedWriting.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="font-['Libre_Baskerville'] text-base text-[#2C1810] leading-loose whitespace-pre-wrap mb-6">
                    {selectedWriting.content.slice(0, 500)}
                    {selectedWriting.content.length > 500 && '...'}
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={`/garden/write/${selectedWriting.id}`}
                      className="flex-1 px-4 py-2 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all font-['Inter'] text-sm font-semibold text-center rounded-lg"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => setSelectedWriting(null)}
                      className="px-4 py-2 border-2 border-[#E0D8D0] text-[#8B7355] hover:bg-[#F5F0EB] transition-all font-['Inter'] text-sm font-semibold rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <GardenFooter />
    </div>
  );
}
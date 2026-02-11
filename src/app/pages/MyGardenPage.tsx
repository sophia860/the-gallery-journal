import { useState, useEffect } from 'react';
import { Sprout, Plus, Leaf, Flower2, Eye, EyeOff, Users, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GardenMainNav } from '../components/GardenMainNav';
import { getUserWritings } from '/src/services/gardenWritingService';
import { getGardenStats } from '/src/services/gardenProfileService';
import { Writing, GardenStats } from '/src/types/garden';

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

  // TEMPORARY: Mock user for demo purposes
  const mockUser = { id: 'demo-user-123', email: 'demo@example.com' };
  const demoUser = user || mockUser;

  useEffect(() => {
    if (demoUser) {
      loadGarden();
    }
  }, [demoUser]);

  const loadGarden = async () => {
    if (!demoUser) return;

    try {
      setLoading(true);
      
      // Set a 2-second timeout to fall back to mock data
      const timeoutId = setTimeout(() => {
        console.log('My Garden loading timeout - falling back to mock data');
        useMockData();
        setLoading(false);
      }, 2000);
      
      // Try to load from database
      try {
        const [writingsData, statsData] = await Promise.all([
          getUserWritings(demoUser.id),
          getGardenStats(demoUser.id)
        ]);
        
        clearTimeout(timeoutId);
        if (writingsData && writingsData.length > 0) {
          setWritings(writingsData);
          setStats(statsData);
          setLoading(false);
        } else {
          // Use mock data if no writings found
          useMockData();
          setLoading(false);
        }
      } catch (dbError) {
        clearTimeout(timeoutId);
        console.log('Database not available, using mock data:', dbError);
        useMockData();
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading garden:', error);
      useMockData();
      setLoading(false);
    }
  };

  const useMockData = () => {
    // Mock writings for demo
    const mockWritings: Writing[] = [
      {
        id: '1',
        user_id: demoUser.id,
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
        user_id: demoUser.id,
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
        user_id: demoUser.id,
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
        user_id: demoUser.id,
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
        user_id: demoUser.id,
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

  // TEMPORARY: Commented out auth redirect for demo
  // if (!authLoading && !user) {
  //   window.location.href = '/garden/signin?redirect=/my-garden';
  //   return null;
  // }

  const filteredWritings = filter === 'all' 
    ? writings 
    : writings.filter(w => w.growth_stage === filter);

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      {/* Animated Starfield Background */}
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
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 157, 195, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .glass-card:hover {
          background: rgba(15, 23, 41, 0.85);
          border: 1px solid rgba(96, 165, 250, 0.4);
          box-shadow: 0 8px 32px 0 rgba(96, 165, 250, 0.2);
        }
      `}</style>

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
    </div>
  );
}
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
        return <div className="w-3 h-3 bg-[#8B7355] rounded-full"></div>;
      case 'sprout':
        return <Leaf className="w-8 h-8 text-[#8A9A7B]" />;
      case 'bloom':
        return <Flower2 className="w-12 h-12 text-[#E11D48]" />;
    }
  };

  const getVisibilityIcon = () => {
    switch (writing.visibility) {
      case 'private':
        return <Lock className="w-3 h-3" />;
      case 'circles':
        return <Users className="w-3 h-3" />;
      case 'public':
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
    <div className={`${getPlantSize()} flex flex-col items-center justify-center bg-[#FAF8F5] border-2 border-[#E0D8D0] rounded-lg hover:border-[#8A9A7B] hover:shadow-lg transition-all cursor-pointer group relative`}>
      {/* Plant Icon */}
      <div className="flex items-center justify-center mb-1">
        {getPlantIcon()}
      </div>
      
      {/* Visibility Badge */}
      <div className="absolute top-1 right-1 p-1 bg-white rounded-full text-[#8B7355]">
        {getVisibilityIcon()}
      </div>

      {/* Tooltip on Hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#2C1810] text-white text-xs font-['Inter'] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {writing.title}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#2C1810]"></div>
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

  useEffect(() => {
    if (user) {
      loadGarden();
    }
  }, [user]);

  const loadGarden = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [writingsData, statsData] = await Promise.all([
        getUserWritings(user.id),
        getGardenStats(user.id)
      ]);
      setWritings(writingsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading garden:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!authLoading && !user) {
    window.location.href = '/garden/signin?redirect=/my-garden';
    return null;
  }

  const filteredWritings = filter === 'all' 
    ? writings 
    : writings.filter(w => w.growth_stage === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0EB] to-[#FAF8F5]">
      <GardenMainNav />

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-['Cardo'] text-6xl text-[#2C1810] mb-3 italic">
                  My Garden
                </h1>
                <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355]">
                  {user?.user_metadata?.writer_name || user?.user_metadata?.display_name || 'Your'} writing space
                </p>
              </div>
              <a
                href="/garden/write"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all font-['Cardo'] text-lg rounded-lg shadow-md"
              >
                <Plus className="w-5 h-5" />
                New Writing
              </a>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-4">
                  <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider mb-1">
                    Total
                  </div>
                  <div className="font-['Cardo'] text-3xl text-[#2C1810]">
                    {stats.total_writings}
                  </div>
                </div>
                <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-4">
                  <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#8B7355] rounded-full"></div>
                    Seeds
                  </div>
                  <div className="font-['Cardo'] text-3xl text-[#2C1810]">
                    {stats.seeds}
                  </div>
                </div>
                <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-4">
                  <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    Sprouts
                  </div>
                  <div className="font-['Cardo'] text-3xl text-[#2C1810]">
                    {stats.sprouts}
                  </div>
                </div>
                <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-4">
                  <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Flower2 className="w-3 h-3" />
                    Blooms
                  </div>
                  <div className="font-['Cardo'] text-3xl text-[#2C1810]">
                    {stats.blooms}
                  </div>
                </div>
                <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-4">
                  <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider mb-1">
                    Public
                  </div>
                  <div className="font-['Cardo'] text-3xl text-[#2C1810]">
                    {stats.public_blooms}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-8">
            {(['all', 'seed', 'sprout', 'bloom'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setFilter(stage)}
                className={`px-4 py-2 font-['Inter'] text-sm uppercase tracking-wider font-semibold transition-all rounded-lg ${
                  filter === stage
                    ? 'bg-[#8A9A7B] text-white'
                    : 'bg-white border-2 border-[#E0D8D0] text-[#8B7355] hover:border-[#8A9A7B]'
                }`}
              >
                {stage === 'all' ? 'All Writings' : stage}
              </button>
            ))}
          </div>

          {/* Garden Grid */}
          {loading ? (
            <div className="text-center py-20">
              <Sprout className="w-12 h-12 text-[#8A9A7B] animate-pulse mx-auto mb-4" />
              <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
                Loading your garden...
              </p>
            </div>
          ) : filteredWritings.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8A9A7B]/20 rounded-full mb-6">
                <Sprout className="w-10 h-10 text-[#8A9A7B]" />
              </div>
              <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-3 italic">
                Your garden awaits
              </h3>
              <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] mb-8 max-w-md mx-auto">
                Plant your first seed. Every piece of writing starts somewhere.
              </p>
              <a
                href="/garden/write"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all font-['Cardo'] text-lg rounded-lg shadow-md"
              >
                <Plus className="w-5 h-5" />
                Start Writing
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
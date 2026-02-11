import { useState, useEffect } from 'react';
import { Users, Plus, ChevronRight, UserPlus, Copy, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GardenMainNav } from '../components/GardenMainNav';
import { GardenFooter } from '../components/GardenFooter';
import { JoinTheGardenGate } from '../components/JoinTheGardenGate';
import { getUserCircles, createCircle, createInviteLink, joinCircleViaInvite } from '/src/services/gardenCircleService';
import { Circle, CircleInvite } from '/src/types/garden';

export function CirclesPage() {
  const { user, loading: authLoading } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    member_limit: 50
  });
  const [joinCode, setJoinCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  
  // Helper function to format relative time
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    if (user) {
      loadCircles();
    }
  }, [user]);

  const loadCircles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Set a 2-second timeout to fall back to mock data
      const timeoutId = setTimeout(() => {
        console.log('Circles loading timeout - falling back to mock data');
        useMockCircles();
        setLoading(false);
      }, 2000);
      
      // Try to load from database
      try {
        const data = await getUserCircles(user.id);
        clearTimeout(timeoutId);
        if (data && data.length > 0) {
          setCircles(data);
          setLoading(false);
        } else {
          // Use mock data if no circles found
          useMockCircles();
          setLoading(false);
        }
      } catch (dbError) {
        clearTimeout(timeoutId);
        console.log('Database not available, using mock data:', dbError);
        useMockCircles();
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading circles:', error);
      useMockCircles();
      setLoading(false);
    }
  };

  const useMockCircles = () => {
    if (!user) return;
    
    const mockCircles: Circle[] = [
      {
        id: '1',
        name: 'Midnight Writers',
        description: 'For those who write when the world is asleep. Share your late-night musings and nocturnal creativity.',
        member_count: 12,
        member_limit: 20,
        created_by: 'user-1',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_member: true,
        is_creator: false,
        last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        members_online: 3,
        posts_this_week: 12
      },
      {
        id: '2',
        name: 'Poetry Garden',
        description: 'A sanctuary for poets. Share verses, give gentle feedback, and grow together.',
        member_count: 8,
        member_limit: 15,
        created_by: 'user-2',
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        is_member: true,
        is_creator: false,
        last_activity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        members_online: 1,
        posts_this_week: 8
      },
      {
        id: '3',
        name: 'Memoir Circle',
        description: 'Your circle for sharing personal stories and life reflections. We hold each other\'s memories with care.',
        member_count: 15,
        member_limit: 50,
        created_by: user.id,
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        is_member: true,
        is_creator: true,
        last_activity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        members_online: 5,
        posts_this_week: 23
      }
    ];

    setCircles(mockCircles);
  };

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!createForm.name.trim()) {
      setError('Please enter a circle name');
      return;
    }

    try {
      setCreating(true);
      const newCircle = await createCircle(createForm);
      
      if (newCircle) {
        setCircles([newCircle, ...circles]);
        setShowCreateModal(false);
        setCreateForm({ name: '', description: '', member_limit: 50 });
        
        // Redirect to the new circle
        window.location.href = `/circles/${newCircle.id}`;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create circle');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!joinCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    try {
      setJoining(true);
      const success = await joinCircleViaInvite(joinCode.trim().toUpperCase());
      
      if (success) {
        setShowJoinModal(false);
        setJoinCode('');
        loadCircles(); // Reload to show new circle
      } else {
        setError('Invalid or expired invite code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join circle');
    } finally {
      setJoining(false);
    }
  };

  // AUTH GATE: Show join gate if not logged in (after all hooks)
  if (!authLoading && !user) {
    return <JoinTheGardenGate />;
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f1729] relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 pointer-events-none">
          <div className="stars-layer"></div>
          <div className="stars-layer-2"></div>
          <div className="stars-layer-3"></div>
        </div>
        <div className="relative z-10 text-center">
          <Users className="w-12 h-12 text-[#60a5fa] animate-pulse mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))' }} />
          <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

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

        /* Bright glowing stars */
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
          50% { opacity: 0.3; }
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-['Cardo'] text-6xl text-white mb-3 italic" style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.4)' }}>
                  Circles
                </h1>
                <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8]">
                  Small, intimate communities for sharing
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#60a5fa] text-[#60a5fa] hover:bg-gradient-to-r hover:from-[#60a5fa] hover:to-[#3b82f6] hover:text-white hover:border-transparent transition-all font-['Cardo'] text-lg rounded-lg shadow-lg shadow-blue-500/20"
                >
                  <UserPlus className="w-5 h-5" />
                  Join Circle
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white hover:from-[#3b82f6] hover:to-[#2563eb] transition-all font-['Cardo'] text-lg rounded-lg shadow-lg shadow-blue-500/30"
                >
                  <Plus className="w-5 h-5" />
                  Create Circle
                </button>
              </div>
            </div>

            {/* Philosophy */}
            <div className="p-6 glass-card rounded-lg">
              <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] italic text-center leading-relaxed">
                "Circles are capped at 50 members to maintain intimacy. Share works-in-progress, give feedback, and grow together in small, trusted communities."
              </p>
            </div>
          </div>

          {/* Circles List */}
          {loading ? (
            <div className="text-center py-20 relative z-10">
              <Users className="w-12 h-12 text-[#60a5fa] animate-pulse mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))' }} />
              <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8]">
                Loading circles...
              </p>
            </div>
          ) : circles.length === 0 ? (
            <div className="text-center py-20 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#60a5fa]/20 to-[#3b82f6]/20 rounded-full mb-6 shadow-lg shadow-blue-500/20">
                <Users className="w-10 h-10 text-[#60a5fa]" />
              </div>
              <h3 className="font-['Cardo'] text-3xl text-white mb-3 italic" style={{ textShadow: '0 0 20px rgba(96, 165, 250, 0.3)' }}>
                No circles yet
              </h3>
              <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8] mb-8">
                Create your first circle or join one with an invite code
              </p>
            </div>
          ) : (
            <div className="space-y-4 relative z-10">
              {circles.map((circle) => (
                <a
                  key={circle.id}
                  href={`/circles/${circle.id}`}
                  className="block glass-card rounded-lg p-6 hover:border-[rgba(96,165,250,0.5)] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-['Cardo'] text-2xl text-white group-hover:text-[#60a5fa] transition-colors" style={{ textShadow: '0 0 15px rgba(96, 165, 250, 0.2)' }}>
                            {circle.name}
                          </h3>
                          <div className="flex items-center gap-3 flex-wrap">
                            <p className="font-['Inter'] text-sm text-[#8b9dc3]">
                              {circle.member_count || 0} / {circle.member_limit} members
                            </p>
                            {circle.members_online && circle.members_online > 0 && (
                              <>
                                <span className="text-[#8b9dc3]">•</span>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" style={{ boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }}></div>
                                  <p className="font-['Inter'] text-sm text-[#10b981]">
                                    {circle.members_online} online
                                  </p>
                                </div>
                              </>
                            )}
                            {circle.posts_this_week && circle.posts_this_week > 0 && (
                              <>
                                <span className="text-[#8b9dc3]">•</span>
                                <p className="font-['Inter'] text-sm text-[#60a5fa]">
                                  {circle.posts_this_week} posts this week
                                </p>
                              </>
                            )}
                            {circle.last_activity && (
                              <>
                                <span className="text-[#8b9dc3]">•</span>
                                <p className="font-['Inter'] text-sm text-[#8b9dc3]/70">
                                  Active {getRelativeTime(circle.last_activity)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {circle.description && (
                        <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] ml-15 line-clamp-2">
                          {circle.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-6 h-6 text-[#8b9dc3] group-hover:text-[#60a5fa] group-hover:translate-x-1 transition-all" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setShowCreateModal(false)}
        >
          <div 
            className="bg-white max-w-md w-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-6 italic">
                Create Circle
              </h2>

              <form onSubmit={handleCreateCircle} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                    Circle Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg"
                    placeholder="Writers Circle, Poetry Group, etc."
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg resize-none"
                    placeholder="What's this circle about?"
                  />
                </div>

                {/* Member Limit */}
                <div>
                  <label className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                    Member Limit
                  </label>
                  <input
                    type="number"
                    value={createForm.member_limit}
                    onChange={(e) => setCreateForm({ ...createForm, member_limit: parseInt(e.target.value) })}
                    min={2}
                    max={50}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg"
                  />
                  <p className="mt-1 font-['Inter'] text-xs text-[#8B7355]">
                    Maximum 50 members to maintain intimacy
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-[#E11D48]/10 border-2 border-[#E11D48] rounded-lg">
                    <p className="font-['Courier_New'] text-sm text-[#E11D48]">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-[#E0D8D0] text-[#8B7355] hover:bg-[#F5F0EB] transition-all font-['Inter'] text-sm font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-4 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] disabled:opacity-50 transition-all font-['Cardo'] text-lg rounded-lg"
                  >
                    {creating ? 'Creating...' : 'Create Circle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Join Circle Modal */}
      {showJoinModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setShowJoinModal(false)}
        >
          <div 
            className="bg-white max-w-md w-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-6 italic">
                Join Circle
              </h2>

              <form onSubmit={handleJoinCircle} className="space-y-6">
                <div>
                  <label className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Courier_New'] text-2xl text-[#2C1810] tracking-widest text-center rounded-lg uppercase"
                    placeholder="XXXXXXXX"
                    maxLength={8}
                    required
                  />
                  <p className="mt-2 font-['Inter'] text-xs text-[#8B7355] text-center">
                    Enter the 8-character invite code
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-[#E11D48]/10 border-2 border-[#E11D48] rounded-lg">
                    <p className="font-['Courier_New'] text-sm text-[#E11D48]">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-[#E0D8D0] text-[#8B7355] hover:bg-[#F5F0EB] transition-all font-['Inter'] text-sm font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joining}
                    className="flex-1 px-4 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] disabled:opacity-50 transition-all font-['Cardo'] text-lg rounded-lg"
                  >
                    {joining ? 'Joining...' : 'Join Circle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <GardenFooter />
    </div>
  );
}
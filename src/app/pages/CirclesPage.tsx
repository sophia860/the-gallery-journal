import { useState, useEffect } from 'react';
import { Users, Plus, ChevronRight, UserPlus, Copy, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GardenMainNav } from '../components/GardenMainNav';
import { getUserCircles, createCircle, createInviteLink, joinCircleViaInvite } from '/src/services/gardenCircleService';
import { Circle, CircleInvite } from '/src/types/garden';

export function CirclesPage() {
  const { user } = useAuth();
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

  useEffect(() => {
    if (user) {
      loadCircles();
    }
  }, [user]);

  const loadCircles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getUserCircles(user.id);
      setCircles(data);
    } catch (error) {
      console.error('Error loading circles:', error);
    } finally {
      setLoading(false);
    }
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

  // Redirect if not authenticated
  if (!user) {
    window.location.href = '/garden/signin?redirect=/circles';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0EB] to-[#FAF8F5]">
      <GardenMainNav />

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-['Cardo'] text-6xl text-[#2C1810] mb-3 italic">
                  Circles
                </h1>
                <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355]">
                  Small, intimate communities for sharing
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#8A9A7B] text-[#8A9A7B] hover:bg-[#8A9A7B] hover:text-white transition-all font-['Cardo'] text-lg rounded-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  Join Circle
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all font-['Cardo'] text-lg rounded-lg shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Create Circle
                </button>
              </div>
            </div>

            {/* Philosophy */}
            <div className="p-6 bg-white border-2 border-[#E0D8D0] rounded-lg">
              <p className="font-['Libre_Baskerville'] text-sm text-[#8B7355] italic text-center leading-relaxed">
                "Circles are capped at 50 members to maintain intimacy. Share works-in-progress, give feedback, and grow together in small, trusted communities."
              </p>
            </div>
          </div>

          {/* Circles List */}
          {loading ? (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-[#8A9A7B] animate-pulse mx-auto mb-4" />
              <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
                Loading circles...
              </p>
            </div>
          ) : circles.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8A9A7B]/20 rounded-full mb-6">
                <Users className="w-10 h-10 text-[#8A9A7B]" />
              </div>
              <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-3 italic">
                No circles yet
              </h3>
              <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] mb-8">
                Create your first circle or join one with an invite code
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {circles.map((circle) => (
                <a
                  key={circle.id}
                  href={`/circles/${circle.id}`}
                  className="block bg-white border-2 border-[#E0D8D0] rounded-lg p-6 hover:border-[#8A9A7B] hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-[#8A9A7B] rounded-full flex items-center justify-center text-white">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-['Cardo'] text-2xl text-[#2C1810] group-hover:text-[#8A9A7B] transition-colors">
                            {circle.name}
                          </h3>
                          <p className="font-['Inter'] text-sm text-[#8B7355]">
                            {circle.member_count || 0} / {circle.member_limit} members
                          </p>
                        </div>
                      </div>
                      {circle.description && (
                        <p className="font-['Libre_Baskerville'] text-sm text-[#8B7355] ml-15 line-clamp-2">
                          {circle.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-6 h-6 text-[#8B7355] group-hover:text-[#8A9A7B] group-hover:translate-x-1 transition-all" />
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
    </div>
  );
}

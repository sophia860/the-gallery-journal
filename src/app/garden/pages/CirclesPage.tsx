import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { authService } from '../utils/auth';
import { circlesService, Circle } from '../utils/circles';

export function CirclesPage() {
  const currentUser = authService.getCurrentUser();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 12
  });

  useEffect(() => {
    if (!currentUser) {
      window.location.href = '/garden/login';
      return;
    }

    loadCircles();
  }, [currentUser]);

  const loadCircles = () => {
    if (!currentUser) return;
    const userCircles = circlesService.getUserCircles(currentUser.id);
    setCircles(userCircles);
  };

  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!formData.name.trim()) {
      alert('Please enter a circle name');
      return;
    }

    circlesService.createCircle(
      formData.name,
      formData.description,
      currentUser.id,
      formData.maxMembers
    );

    setFormData({ name: '', description: '', maxMembers: 12 });
    setShowCreateForm(false);
    loadCircles();
  };

  const handleLeaveCircle = (circleId: string) => {
    if (!currentUser) return;
    
    if (window.confirm('Are you sure you want to leave this circle?')) {
      circlesService.removeMember(circleId, currentUser.id);
      loadCircles();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
                Your Circles
              </h1>
              <p className="font-['Cardo'] text-[#e0e0e0]/60">
                Intimate spaces for shared growth
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-[#7a9b76] hover:bg-[#8fb587] text-white font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
            >
              {showCreateForm ? 'Cancel' : '+ New Circle'}
            </button>
          </div>

          {/* Create Circle Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateCircle} className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
              <h3 className="font-['Cardo'] text-xl text-[#e0e0e0] mb-4">
                Create a New Circle
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                    Circle Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
                    placeholder="e.g., Poetry Workshop"
                  />
                </div>

                <div>
                  <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors resize-none"
                    rows={3}
                    placeholder="What's this circle about?"
                  />
                </div>

                <div>
                  <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                    Max Members
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={formData.maxMembers}
                    onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                    className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 px-6 py-3 bg-[#7a9b76] hover:bg-[#8fb587] text-white font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
              >
                Create Circle
              </button>
            </form>
          )}

          {/* Circles Grid */}
          {circles.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-['Cardo'] text-xl text-[#e0e0e0]/60 mb-4">
                You haven't joined any circles yet
              </p>
              <p className="font-['Cardo'] text-sm text-[#e0e0e0]/40 mb-6">
                Circles are intimate spaces where you can share your writing with a trusted group
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-[#7a9b76] hover:bg-[#8fb587] text-white font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
              >
                Create Your First Circle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {circles.map(circle => (
                <div
                  key={circle.id}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#7a9b76] transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-['Georgia'] text-xl text-[#e0e0e0] mb-2">
                        {circle.name}
                      </h3>
                      <p className="font-['Georgia'] text-sm text-[#e0e0e0]/60 mb-3">
                        {circle.description}
                      </p>
                    </div>
                  </div>

                  {/* Member count */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#e0e0e0]/60 mb-2">
                      <span>👥</span>
                      <span>{circle.members.length} / {circle.maxMembers} members</span>
                    </div>
                    <div className="w-full bg-[#121212] rounded-full h-2">
                      <div
                        className="bg-[#7a9b76] h-2 rounded-full transition-all"
                        style={{ width: `${(circle.members.length / circle.maxMembers) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-[#e0e0e0]/40 mb-4">
                    <span>Created {formatDate(circle.createdAt)}</span>
                    {circle.createdBy === currentUser?.id && (
                      <span className="px-2 py-1 bg-[#7a9b76]/20 border border-[#7a9b76]/40 rounded text-[#7a9b76]">
                        Creator
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLeaveCircle(circle.id)}
                      className="flex-1 px-4 py-2 bg-transparent border border-[#333] hover:border-red-400 hover:text-red-400 text-[#e0e0e0] font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] rounded transition-colors cursor-pointer"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info section */}
          <div className="mt-12 p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-3">
              About Circles
            </h3>
            <p className="font-['Georgia'] text-sm text-[#e0e0e0]/70 leading-relaxed mb-3">
              Circles are intimate spaces (max 12 members) where you can share your writing 
              with a trusted group. Choose who sees your work and what kind of responses you'd like.
            </p>
            <p className="font-['Georgia'] text-sm text-[#e0e0e0]/70 leading-relaxed">
              Create circles for workshops, critique groups, or close friends who understand 
              your creative process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
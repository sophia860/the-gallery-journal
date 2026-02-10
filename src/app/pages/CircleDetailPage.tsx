import { useState, useEffect } from 'react';
import { Users, Settings, UserPlus, Copy, Check, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GardenMainNav } from '../components/GardenMainNav';
import { getCircle, getCircleMembers, getCircleWritings, createInviteLink, leaveCircle } from '/src/services/gardenCircleService';
import { Circle, CircleMember } from '/src/types/garden';

interface CircleDetailPageProps {
  circleId: string;
}

export function CircleDetailPage({ circleId }: CircleDetailPageProps) {
  const { user } = useAuth();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [writings, setWritings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'members'>('feed');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [generatingInvite, setGeneratingInvite] = useState(false);

  useEffect(() => {
    if (user) {
      loadCircle();
    }
  }, [circleId, user]);

  const loadCircle = async () => {
    try {
      setLoading(true);
      const [circleData, membersData, writingsData] = await Promise.all([
        getCircle(circleId),
        getCircleMembers(circleId),
        getCircleWritings(circleId)
      ]);
      
      setCircle(circleData);
      setMembers(membersData);
      setWritings(writingsData);
    } catch (error) {
      console.error('Error loading circle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvite = async () => {
    try {
      setGeneratingInvite(true);
      const invite = await createInviteLink(circleId, 10);
      
      if (invite) {
        const link = `${window.location.origin}/circles/join/${invite.invite_code}`;
        setInviteLink(link);
      }
    } catch (error) {
      console.error('Error generating invite:', error);
    } finally {
      setGeneratingInvite(false);
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveCircle = async () => {
    if (!confirm('Are you sure you want to leave this circle?')) return;

    try {
      await leaveCircle(circleId);
      window.location.href = '/circles';
    } catch (error) {
      console.error('Error leaving circle:', error);
    }
  };

  if (!user) {
    window.location.href = '/garden/signin?redirect=/circles';
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-[#8A9A7B] animate-pulse mx-auto mb-4" />
          <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">Loading circle...</p>
        </div>
      </div>
    );
  }

  if (!circle || !circle.is_member) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
            Circle not found or you don't have access
          </p>
          <a href="/circles" className="mt-4 inline-block text-[#8A9A7B] hover:underline">
            Back to Circles
          </a>
        </div>
      </div>
    );
  }

  const isCreator = circle.creator_id === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0EB] to-[#FAF8F5]">
      <GardenMainNav />

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <a
            href="/circles"
            className="inline-flex items-center gap-2 mb-6 text-[#8B7355] hover:text-[#8A9A7B] transition-colors font-['Inter'] text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Circles
          </a>

          {/* Circle Header */}
          <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#8A9A7B] rounded-full flex items-center justify-center text-white">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="font-['Cardo'] text-4xl text-[#2C1810] mb-2 italic">
                    {circle.name}
                  </h1>
                  <p className="font-['Inter'] text-sm text-[#8B7355]">
                    {circle.member_count} / {circle.member_limit} members
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#8A9A7B] text-[#8A9A7B] hover:bg-[#8A9A7B] hover:text-white transition-all font-['Inter'] text-sm font-semibold rounded-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite
                </button>
                {!isCreator && (
                  <button
                    onClick={handleLeaveCircle}
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#E11D48] text-[#E11D48] hover:bg-[#E11D48] hover:text-white transition-all font-['Inter'] text-sm font-semibold rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Leave
                  </button>
                )}
              </div>
            </div>

            {circle.description && (
              <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] leading-relaxed">
                {circle.description}
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b-2 border-[#E0D8D0]">
            <button
              onClick={() => setActiveTab('feed')}
              className={`pb-3 px-1 font-['Inter'] text-sm uppercase tracking-wider font-semibold transition-all relative ${
                activeTab === 'feed' ? 'text-[#2C1810]' : 'text-[#8B7355]'
              }`}
            >
              Circle Feed
              {activeTab === 'feed' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8A9A7B]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-3 px-1 font-['Inter'] text-sm uppercase tracking-wider font-semibold transition-all relative ${
                activeTab === 'members' ? 'text-[#2C1810]' : 'text-[#8B7355]'
              }`}
            >
              Members ({members.length})
              {activeTab === 'members' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8A9A7B]"></div>
              )}
            </button>
          </div>

          {/* Content */}
          {activeTab === 'feed' ? (
            <div className="space-y-6">
              {writings.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-[#E0D8D0] rounded-lg">
                  <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] mb-4">
                    No writings shared yet
                  </p>
                  <p className="font-['Inter'] text-sm text-[#8B7355]">
                    Share your sprouts and seeds with this circle
                  </p>
                </div>
              ) : (
                writings.map((writing) => (
                  <div key={writing.id} className="bg-white border-2 border-[#E0D8D0] rounded-lg p-6 hover:border-[#8A9A7B] transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#8A9A7B] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold">
                        {writing.profile?.display_name?.[0]?.toUpperCase() || 'W'}
                      </div>
                      <div>
                        <p className="font-['Inter'] text-sm font-semibold text-[#2C1810]">
                          {writing.profile?.writer_name || writing.profile?.display_name}
                        </p>
                        <p className="font-['Inter'] text-xs text-[#8B7355]">
                          {new Date(writing.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-3">
                      {writing.title}
                    </h3>

                    <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] leading-relaxed mb-4 line-clamp-3">
                      {writing.content}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs uppercase tracking-wider font-['Inter'] font-semibold rounded ${
                        writing.growth_stage === 'seed' ? 'bg-[#8B7355]/10 border border-[#8B7355] text-[#8B7355]' :
                        writing.growth_stage === 'sprout' ? 'bg-[#8A9A7B]/10 border border-[#8A9A7B] text-[#8A9A7B]' :
                        'bg-[#E11D48]/10 border border-[#E11D48] text-[#E11D48]'
                      }`}>
                        {writing.growth_stage}
                      </span>
                      <span className="text-xs text-[#8B7355]">{writing.type}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {members.map((member) => (
                <div key={member.id} className="bg-white border-2 border-[#E0D8D0] rounded-lg p-4 hover:border-[#8A9A7B] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#8A9A7B] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-lg">
                      {member.profile?.display_name?.[0]?.toUpperCase() || 'W'}
                    </div>
                    <div className="flex-1">
                      <p className="font-['Inter'] text-sm font-semibold text-[#2C1810]">
                        {member.profile?.writer_name || member.profile?.display_name}
                      </p>
                      <p className="font-['Inter'] text-xs text-[#8B7355]">
                        {member.role === 'creator' ? 'Creator' : 'Member'} • Joined {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setShowInviteModal(false)}
        >
          <div 
            className="bg-white max-w-md w-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-6 italic">
                Invite to Circle
              </h2>

              {!inviteLink ? (
                <div className="text-center py-8">
                  <button
                    onClick={handleGenerateInvite}
                    disabled={generatingInvite}
                    className="px-8 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] disabled:opacity-50 transition-all font-['Cardo'] text-lg rounded-lg"
                  >
                    {generatingInvite ? 'Generating...' : 'Generate Invite Link'}
                  </button>
                  <p className="mt-4 font-['Inter'] text-xs text-[#8B7355]">
                    Link valid for 7 days, up to 10 uses
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                    Invite Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="flex-1 px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] font-['Courier_New'] text-sm text-[#2C1810] rounded-lg"
                    />
                    <button
                      onClick={handleCopyInvite}
                      className="px-4 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all rounded-lg"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-2 font-['Inter'] text-xs text-[#8B7355]">
                    Share this link with people you want to invite
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowInviteModal(false)}
                className="mt-6 w-full px-4 py-3 border-2 border-[#E0D8D0] text-[#8B7355] hover:bg-[#F5F0EB] transition-all font-['Inter'] text-sm font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

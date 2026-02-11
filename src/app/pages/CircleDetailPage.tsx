import { useState } from 'react';
import { Users, UserPlus, ChevronLeft, Flower2, Leaf } from 'lucide-react';
import { GardenMainNav } from '../components/GardenMainNav';
import { NightSkyBackground } from '../components/NightSkyBackground';

interface CircleDetailPageProps {
  circleId: string;
}

// Mock data that matches the circles list page
const MOCK_CIRCLES = {
  '1': {
    id: '1',
    name: 'Midnight Writers',
    description: 'For those who write when the world is asleep. A space for night owls, insomniacs, and anyone who finds their voice in the quiet hours.',
    member_count: 12,
    member_limit: 20,
    created_at: new Date().toISOString()
  },
  '2': {
    id: '2',
    name: 'Poetry Garden',
    description: 'A sanctuary for poets to cultivate their craft, share verses, and explore the infinite possibilities of language and form.',
    member_count: 8,
    member_limit: 15,
    created_at: new Date().toISOString()
  },
  '3': {
    id: '3',
    name: 'Memoir Circle',
    description: 'Your circle for sharing personal stories, life writing, and the art of turning lived experience into narrative.',
    member_count: 15,
    member_limit: 50,
    created_at: new Date().toISOString()
  }
};

const MOCK_MEMBERS = [
  { id: '1', name: 'Maya Chen', role: 'creator', joined_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', name: 'Jordan Rivers', role: 'member', joined_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', name: 'River Park', role: 'member', joined_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', name: 'Alex Santos', role: 'member', joined_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', name: 'Sam Taylor', role: 'member', joined_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '6', name: 'Casey Green', role: 'member', joined_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
];

const MOCK_WRITINGS = [
  {
    id: '1',
    title: 'The Weight of Autumn',
    excerpt: "There's a heaviness that settles in when the leaves begin to turn. Not sadness exactly, but a kind of melancholy nostalgia for summers not quite finished...",
    author: 'Maya Chen',
    growth_stage: 'bloom',
    work_type: 'poetry',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Fragments: City at 3 AM',
    excerpt: "Streetlight halos. Empty bus stops. A cat crossing the intersection with more purpose than I've had all week. The bodega guy who knows my order...",
    author: 'Sam Taylor',
    growth_stage: 'sprout',
    work_type: 'experimental',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'On Grief and Gratitude',
    excerpt: "They told me grief comes in waves. What they didn't mention is that sometimes you're drowning and sometimes you're floating and sometimes you remember how to swim...",
    author: 'Alex Santos',
    growth_stage: 'bloom',
    work_type: 'memoir',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export function CircleDetailPage({ circleId }: CircleDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'members'>('feed');

  // Get circle from mock data - always use mock data
  const circle = MOCK_CIRCLES[circleId as keyof typeof MOCK_CIRCLES] || MOCK_CIRCLES['1'];
  const members = MOCK_MEMBERS;
  const writings = MOCK_WRITINGS;

  const getGrowthIcon = (stage: string) => {
    switch (stage) {
      case 'seed':
        return <div className="w-2 h-2 rounded-full" style={{ background: '#d4a574', boxShadow: '0 0 8px rgba(212, 165, 116, 0.6)' }} />;
      case 'sprout':
        return <Leaf className="w-4 h-4" style={{ color: '#10b981', filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))' }} />;
      case 'bloom':
        return <Flower2 className="w-5 h-5" style={{ color: '#ec4899', filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      <NightSkyBackground />
      <GardenMainNav variant="dark" />

      <div className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <a
            href="/circles"
            className="inline-flex items-center gap-2 mb-8 text-[#8b9dc3] hover:text-[#60a5fa] transition-colors font-['Inter'] text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Circles
          </a>

          {/* Circle Header */}
          <div 
            className="rounded-2xl p-8 mb-8 backdrop-blur-xl"
            style={{
              background: 'rgba(15, 23, 41, 0.7)',
              border: '1px solid rgba(139, 157, 195, 0.25)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-full flex items-center justify-center shadow-xl" style={{ boxShadow: '0 0 25px rgba(96, 165, 250, 0.5)' }}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="font-['Playfair_Display'] italic text-4xl text-white mb-2" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
                    {circle.name}
                  </h1>
                  <p className="font-['Inter'] text-sm text-[#8b9dc3]">
                    {circle.member_count} / {circle.member_limit} members
                  </p>
                </div>
              </div>

              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-['Inter'] text-sm font-semibold"
                style={{
                  background: 'rgba(96, 165, 250, 0.15)',
                  border: '1px solid rgba(96, 165, 250, 0.4)',
                  color: '#60a5fa'
                }}
              >
                <UserPlus className="w-4 h-4" />
                Invite
              </button>
            </div>

            <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8] leading-relaxed" style={{ lineHeight: '1.8' }}>
              {circle.description}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-[rgba(139,157,195,0.2)]">
            <button
              onClick={() => setActiveTab('feed')}
              className={`pb-3 px-1 font-['Inter'] text-sm uppercase tracking-wider font-semibold transition-all relative ${
                activeTab === 'feed' ? 'text-white' : 'text-[#8b9dc3]'
              }`}
              style={{ fontSize: '11px', letterSpacing: '0.2em' }}
            >
              Shared Writings
              {activeTab === 'feed' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#60a5fa]" style={{ boxShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-3 px-1 font-['Inter'] text-sm uppercase tracking-wider font-semibold transition-all relative ${
                activeTab === 'members' ? 'text-white' : 'text-[#8b9dc3]'
              }`}
              style={{ fontSize: '11px', letterSpacing: '0.2em' }}
            >
              Members ({members.length})
              {activeTab === 'members' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#60a5fa]" style={{ boxShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}></div>
              )}
            </button>
          </div>

          {/* Content */}
          {activeTab === 'feed' ? (
            <div className="space-y-6">
              {writings.map((writing) => (
                <div 
                  key={writing.id} 
                  className="rounded-xl p-6 backdrop-blur-xl hover:border-[rgba(96,165,250,0.4)] transition-all cursor-pointer"
                  style={{
                    background: 'rgba(15, 23, 41, 0.7)',
                    border: '1px solid rgba(139, 157, 195, 0.25)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold" style={{ boxShadow: '0 0 15px rgba(96, 165, 250, 0.4)' }}>
                      {writing.author[0]}
                    </div>
                    <div>
                      <p className="font-['Inter'] text-sm font-semibold text-white">
                        {writing.author}
                      </p>
                      <p className="font-['Inter'] text-xs text-[#8b9dc3]">
                        {new Date(writing.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      {getGrowthIcon(writing.growth_stage)}
                      <span className="text-xs font-['Inter'] uppercase tracking-wider text-[#8b9dc3]" style={{ fontSize: '10px', letterSpacing: '0.15em' }}>
                        {writing.growth_stage}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-['Playfair_Display'] italic text-2xl text-white mb-3" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.1)' }}>
                    {writing.title}
                  </h3>

                  <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8] leading-relaxed line-clamp-3 mb-4" style={{ lineHeight: '1.8' }}>
                    {writing.excerpt}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[rgba(139,157,195,0.2)] flex items-center justify-between">
                    <span className="text-xs font-['Inter'] italic text-[#8b9dc3]">
                      {writing.work_type}
                    </span>
                    <a
                      href={`/garden/reading/${writing.id}`}
                      className="text-sm font-['Inter'] text-[#60a5fa] hover:text-[#3b82f6] transition-colors flex items-center gap-1"
                    >
                      Read →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {members.map((member) => (
                <div 
                  key={member.id} 
                  className="rounded-xl p-4 backdrop-blur-xl hover:border-[rgba(96,165,250,0.4)] transition-all"
                  style={{
                    background: 'rgba(15, 23, 41, 0.7)',
                    border: '1px solid rgba(139, 157, 195, 0.25)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-lg" style={{ boxShadow: '0 0 15px rgba(96, 165, 250, 0.4)' }}>
                      {member.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-['Inter'] text-sm font-semibold text-white">
                        {member.name}
                      </p>
                      <p className="font-['Inter'] text-xs text-[#8b9dc3]">
                        {member.role === 'creator' ? 'Creator' : 'Member'} • Joined {new Date(member.joined_at).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Users, ChevronLeft, MessageSquare, Lightbulb, MessageCircle, UserPlus, TrendingUp, Clock, Send, Circle as CircleIcon, LogOut, Plus, Reply } from 'lucide-react';
import { GardenMainNav } from '../components/GardenMainNav';
import { GardenFooter } from '../components/GardenFooter';

interface CircleDetailPageProps {
  circleId: string;
}

// Mock circles data  
const MOCK_CIRCLES: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Midnight Writers',
    description: 'For those who write when the world is asleep. Share your late-night musings and nocturnal creativity.',
    member_count: 12,
    member_limit: 20,
    members_online: 3
  },
  '2': {
    id: '2',
    name: 'Poetry Garden',
    description: 'A sanctuary for poets. Share verses, give gentle feedback, and grow together.',
    member_count: 8,
    member_limit: 15,
    members_online: 1
  },
  '3': {
    id: '3',
    name: 'Memoir Circle',
    description: 'Your circle for sharing personal stories and life reflections. We hold each other\'s memories with care.',
    member_count: 15,
    member_limit: 50,
    members_online: 5
  }
};

const MOCK_MEMBERS = [
  { id: '1', name: 'Maya Chen', online: true },
  { id: '2', name: 'Jordan Rivers', online: true },
  { id: '3', name: 'River Park', online: false },
  { id: '4', name: 'Alex Santos', online: true },
  { id: '5', name: 'Sam Taylor', online: false },
  { id: '6', name: 'Casey Green', online: false },
  { id: '7', name: 'Morgan Lee', online: false },
  { id: '8', name: 'Taylor Kim', online: false },
  { id: '9', name: 'Jamie Wu', online: false },
  { id: '10', name: 'Avery Jones', online: false },
  { id: '11', name: 'Riley Chen', online: false },
  { id: '12', name: 'Quinn Park', online: false }
];

const MOCK_THREADS = [
  {
    id: 't1',
    author: 'Maya Chen',
    title: 'Struggling with the middle of my story',
    preview: 'I\'ve written a strong opening and I know where I want to end, but the middle feels muddy. How do you all handle saggy middles?',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    reply_count: 8,
    replies: [
      { id: 'r1', author: 'Alex Santos', text: 'Middle is where character transformation happens. What does your protagonist need to learn?', timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString() },
      { id: 'r2', author: 'Jordan Rivers', text: 'I outline my midpoint first, then build toward it. The middle becomes the bridge between setup and payoff.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 't2',
    author: 'Sam Taylor',
    title: 'Poetry recommendation: Ocean Vuong',
    preview: 'Just finished "Night Sky with Exit Wounds" and I\'m completely wrecked. His handling of family trauma and queerness is breathtaking.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    reply_count: 12,
    replies: [
      { id: 'r3', author: 'Casey Green', text: 'His poem "Someday I\'ll Love Ocean Vuong" changed how I think about self-narrative.', timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString() },
      { id: 'r4', author: 'Maya Chen', text: 'If you loved that, try "Time Is a Mother" - equally devastating but with more hope.', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 't3',
    author: 'Jordan Rivers',
    title: 'Writing through grief',
    preview: 'Lost my dad last month. Words feel impossible but also necessary. Anyone else write their way through loss?',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reply_count: 15,
    replies: [
      { id: 'r5', author: 'Alex Santos', text: 'Sending you so much love. I wrote my mom\'s eulogy in fragments over weeks. The broken pieces eventually found their shape.', timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() },
      { id: 'r6', author: 'River Park', text: 'There\'s no timeline for grief or for finding words again. Be gentle with yourself. We\'re here when you\'re ready to share.', timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 't4',
    author: 'Casey Green',
    title: 'Show vs Tell - when to break the rule?',
    preview: 'I keep hearing "show don\'t tell" but sometimes a summary is more powerful than a scene. Thoughts?',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    reply_count: 6,
    replies: []
  }
];

const MOCK_PROMPTS = [
  {
    id: 'p1',
    author: 'Alex Santos',
    prompt: 'Write about a moment of unexpected kindness from a stranger. 500 words.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    responses: 7
  },
  {
    id: 'p2',
    author: 'Maya Chen',
    prompt: 'Describe your childhood bedroom from the perspective of an object in it.',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    responses: 11
  },
  {
    id: 'p3',
    author: 'Sam Taylor',
    prompt: 'Write a love letter to your city at 3am. Use only sensory details - no abstract emotions.',
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    responses: 9
  }
];

const MOCK_CHAT = [
  { id: 'm1', author: 'Maya Chen', text: 'Good evening, night writers!', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: 'm2', author: 'Alex Santos', text: 'Hey Maya! Just settling in with tea and my laptop.', timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString() },
  { id: 'm3', author: 'Jordan Rivers', text: 'Anyone else procrastinating by reorganizing their desk? 😅', timestamp: new Date(Date.now() - 38 * 60 * 1000).toISOString() },
  { id: 'm4', author: 'Sam Taylor', text: 'I just finished a scene I\'ve been avoiding for weeks. Feels good.', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: 'm5', author: 'Maya Chen', text: 'Nice work Sam! What was the scene about?', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  { id: 'm6', author: 'Sam Taylor', text: 'A difficult conversation between siblings. Had to let them be messy and honest.', timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
  { id: 'm7', author: 'Alex Santos', text: 'Those are always the hardest but most rewarding scenes', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: 'm8', author: 'Casey Green', text: 'Just joined the chat! What are we all working on tonight?', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  { id: 'm9', author: 'Jordan Rivers', text: 'Revising a short story about urban loneliness. How about you?', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: 'm10', author: 'Casey Green', text: 'Poetry! Trying to capture the feeling of early morning fog.', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() }
];

export function CircleDetailPage({ circleId }: CircleDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'discussions' | 'prompts' | 'chat'>('discussions');
  const [isMember, setIsMember] = useState(true);
  const [showNewThread, setShowNewThread] = useState(false);
  const [showNewPrompt, setShowNewPrompt] = useState(false);
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [threadForm, setThreadForm] = useState({ title: '', body: '' });
  const [promptForm, setPromptForm] = useState('');

  const circle = MOCK_CIRCLES[circleId] || MOCK_CIRCLES['1'];
  
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

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      <GardenMainNav variant="dark" />

      <div className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <a
            href="/circles"
            className="inline-flex items-center gap-2 mb-8 text-[#8b9dc3] hover:text-[#60a5fa] transition-colors font-['Inter'] text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Circles
          </a>

          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Circle Header */}
              <div 
                className="rounded-2xl p-8 mb-8 backdrop-blur-xl"
                style={{
                  background: 'rgba(15, 23, 41, 0.7)',
                  border: '1px solid rgba(139, 157, 195, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-full flex items-center justify-center shadow-xl" style={{ boxShadow: '0 0 25px rgba(96, 165, 250, 0.5)' }}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="font-['Playfair_Display'] italic text-4xl text-white mb-2" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
                        {circle.name}
                      </h1>
                      <div className="flex items-center gap-3">
                        <p className="font-['Inter'] text-sm text-[#8b9dc3]">
                          {circle.member_count} / {circle.member_limit} members
                        </p>
                        {circle.members_online > 0 && (
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
                      </div>
                    </div>
                  </div>

                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-['Inter'] text-sm font-semibold"
                    style={{
                      background: 'rgba(96, 165, 250, 0.15)',
                      border: '1px solid rgba(96, 165, 250, 0.4)',
                      color: '#60a5fa'
                    }}
                    onClick={() => setIsMember(!isMember)}
                  >
                    {isMember ? (
                      <>
                        <LogOut className="w-4 h-4" />
                        Leave Circle
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Join Circle
                      </>
                    )}
                  </button>
                </div>

                <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8] leading-relaxed" style={{ lineHeight: '1.8' }}>
                  {circle.description}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 mb-8 border-b border-[rgba(139,157,195,0.2)]">
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`pb-3 px-1 font-['Inter'] text-sm uppercase tracking-wider font-semibold transition-all relative flex items-center gap-2 ${
                    activeTab === 'discussions' ? 'text-white' : 'text-[#8b9dc3]'
                  }`}
                  style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Discussions
                  {activeTab === 'discussions' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#60a5fa]" style={{ boxShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('prompts')}
                  className={`pb-3 px-1 font-['Inter'] text-sm uppercase tracking-wider font-semibold transition-all relative flex items-center gap-2 ${
                    activeTab === 'prompts' ? 'text-white' : 'text-[#8b9dc3]'
                  }`}
                  style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                >
                  <Lightbulb className="w-4 h-4" />
                  Prompts
                  {activeTab === 'prompts' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#60a5fa]" style={{ boxShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`pb-3 px-1 font-['Inter'] text-sm uppercase tracking-wider font-semibold transition-all relative flex items-center gap-2 ${
                    activeTab === 'chat' ? 'text-white' : 'text-[#8b9dc3]'
                  }`}
                  style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                  {activeTab === 'chat' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#60a5fa]" style={{ boxShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}></div>
                  )}
                </button>
              </div>

              {/* DISCUSSIONS TAB */}
              {activeTab === 'discussions' && (
                <div className="space-y-4">
                  {/* New Thread Button */}
                  {!showNewThread && (
                    <button
                      onClick={() => setShowNewThread(true)}
                      className="w-full py-4 rounded-xl backdrop-blur-xl border-2 border-dashed border-[rgba(96,165,250,0.3)] hover:border-[rgba(96,165,250,0.6)] transition-all flex items-center justify-center gap-2 text-[#60a5fa] font-['Inter'] text-sm font-semibold"
                      style={{ background: 'rgba(15, 23, 41, 0.5)' }}
                    >
                      <Plus className="w-5 h-5" />
                      New Thread
                    </button>
                  )}

                  {/* New Thread Form */}
                  {showNewThread && (
                    <div className="rounded-xl p-6 backdrop-blur-xl" style={{ background: 'rgba(15, 23, 41, 0.7)', border: '1px solid rgba(139, 157, 195, 0.25)' }}>
                      <h3 className="font-['Cardo'] text-xl text-white mb-4 italic">Start a Discussion</h3>
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={threadForm.title}
                          onChange={(e) => setThreadForm({ ...threadForm, title: e.target.value })}
                          placeholder="Thread title..."
                          className="w-full px-4 py-3 bg-[rgba(15,23,41,0.9)] border border-[rgba(139,157,195,0.3)] rounded-lg text-white placeholder-[#8b9dc3] focus:border-[#60a5fa] focus:outline-none font-['Inter']"
                        />
                        <textarea
                          value={threadForm.body}
                          onChange={(e) => setThreadForm({ ...threadForm, body: e.target.value })}
                          placeholder="Share your thoughts..."
                          rows={4}
                          className="w-full px-4 py-3 bg-[rgba(15,23,41,0.9)] border border-[rgba(139,157,195,0.3)] rounded-lg text-white placeholder-[#8b9dc3] focus:border-[#60a5fa] focus:outline-none font-['Libre_Baskerville'] resize-none"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowNewThread(false)}
                            className="px-6 py-2 border border-[rgba(139,157,195,0.3)] rounded-lg text-[#8b9dc3] hover:text-white hover:border-[rgba(139,157,195,0.5)] transition-all font-['Inter'] text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setShowNewThread(false);
                              setThreadForm({ title: '', body: '' });
                            }}
                            className="px-6 py-2 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-lg hover:from-[#3b82f6] hover:to-[#2563eb] transition-all font-['Inter'] text-sm font-semibold"
                          >
                            Post Thread
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Discussion Threads */}
                  {MOCK_THREADS.map((thread) => (
                    <div
                      key={thread.id}
                      className="rounded-xl p-6 backdrop-blur-xl hover:border-[rgba(96,165,250,0.4)] transition-all cursor-pointer"
                      style={{ background: 'rgba(15, 23, 41, 0.7)', border: '1px solid rgba(139, 157, 195, 0.25)' }}
                      onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-lg shrink-0" style={{ boxShadow: '0 0 15px rgba(96, 165, 250, 0.4)' }}>
                          {thread.author[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-['Inter'] text-sm font-semibold text-white">{thread.author}</p>
                            <span className="text-[#8b9dc3]">•</span>
                            <p className="font-['Inter'] text-xs text-[#8b9dc3]">{getRelativeTime(thread.timestamp)}</p>
                          </div>
                          <h3 className="font-['Cardo'] text-xl text-white mb-2 italic">{thread.title}</h3>
                          <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] line-clamp-2 mb-3" style={{ lineHeight: '1.7' }}>
                            {thread.preview}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-[#60a5fa]" >
                              <Reply className="w-4 h-4" />
                              <span className="font-['Inter'] text-sm">{thread.reply_count} replies</span>
                            </div>
                            <button className="font-['Inter'] text-sm text-[#60a5fa] hover:text-[#3b82f6] transition-colors">
                              {expandedThread === thread.id ? 'Hide replies' : 'View thread'}
                            </button>
                          </div>
                          
                          {/* Replies */}
                          {expandedThread === thread.id && thread.replies && thread.replies.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-[rgba(139,157,195,0.2)] space-y-3">
                              {thread.replies.map((reply) => (
                                <div key={reply.id} className="pl-6 border-l-2 border-[rgba(96,165,250,0.3)]">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-['Inter'] text-sm font-semibold text-white">{reply.author}</p>
                                    <span className="text-[#8b9dc3]">•</span>
                                    <p className="font-['Inter'] text-xs text-[#8b9dc3]">{getRelativeTime(reply.timestamp)}</p>
                                  </div>
                                  <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8]" style={{ lineHeight: '1.7' }}>
                                    {reply.text}
                                  </p>
                                </div>
                              ))}
                              <div className="pl-6">
                                <button className="font-['Inter'] text-sm text-[#60a5fa] hover:text-[#3b82f6] transition-colors flex items-center gap-2">
                                  <Reply className="w-4 h-4" />
                                  Reply to thread
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PROMPTS TAB */}
              {activeTab === 'prompts' && (
                <div className="space-y-4">
                  {/* Post Prompt Button */}
                  {!showNewPrompt && (
                    <button
                      onClick={() => setShowNewPrompt(true)}
                      className="w-full py-4 rounded-xl backdrop-blur-xl border-2 border-dashed border-[rgba(96,165,250,0.3)] hover:border-[rgba(96,165,250,0.6)] transition-all flex items-center justify-center gap-2 text-[#60a5fa] font-['Inter'] text-sm font-semibold"
                      style={{ background: 'rgba(15, 23, 41, 0.5)' }}
                    >
                      <Lightbulb className="w-5 h-5" />
                      Post Prompt
                    </button>
                  )}

                  {/* New Prompt Form */}
                  {showNewPrompt && (
                    <div className="rounded-xl p-6 backdrop-blur-xl" style={{ background: 'rgba(15, 23, 41, 0.7)', border: '1px solid rgba(139, 157, 195, 0.25)' }}>
                      <h3 className="font-['Cardo'] text-xl text-white mb-4 italic">Post a Prompt</h3>
                      <textarea
                        value={promptForm}
                        onChange={(e) => setPromptForm(e.target.value)}
                        placeholder="Share a writing prompt for the circle..."
                        rows={3}
                        className="w-full px-4 py-3 bg-[rgba(15,23,41,0.9)] border border-[rgba(139,157,195,0.3)] rounded-lg text-white placeholder-[#8b9dc3] focus:border-[#60a5fa] focus:outline-none font-['Libre_Baskerville'] resize-none mb-4"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowNewPrompt(false)}
                          className="px-6 py-2 border border-[rgba(139,157,195,0.3)] rounded-lg text-[#8b9dc3] hover:text-white hover:border-[rgba(139,157,195,0.5)] transition-all font-['Inter'] text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowNewPrompt(false);
                            setPromptForm('');
                          }}
                          className="px-6 py-2 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-lg hover:from-[#3b82f6] hover:to-[#2563eb] transition-all font-['Inter'] text-sm font-semibold"
                        >
                          Post Prompt
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Prompts List */}
                  {MOCK_PROMPTS.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="rounded-xl p-6 backdrop-blur-xl hover:border-[rgba(96,165,250,0.4)] transition-all"
                      style={{ background: 'rgba(15, 23, 41, 0.7)', border: '1px solid rgba(139, 157, 195, 0.25)' }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <Lightbulb className="w-6 h-6 text-[#fbbf24] shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' }} />
                        <div className="flex-1">
                          <p className="font-['Libre_Baskerville'] text-lg text-white mb-3 leading-relaxed" style={{ lineHeight: '1.7' }}>
                            {prompt.prompt}
                          </p>
                          <div className="flex items-center gap-3 text-sm">
                            <p className="font-['Inter'] text-[#8b9dc3]">
                              by <span className="text-white font-semibold">{prompt.author}</span>
                            </p>
                            <span className="text-[#8b9dc3]">•</span>
                            <p className="font-['Inter'] text-[#8b9dc3]">{getRelativeTime(prompt.date)}</p>
                            <span className="text-[#8b9dc3]">•</span>
                            <p className="font-['Inter'] text-[#60a5fa]">{prompt.responses} responses</p>
                          </div>
                        </div>
                      </div>
                      <button className="w-full py-2 border border-[rgba(96,165,250,0.3)] hover:border-[rgba(96,165,250,0.6)] hover:bg-[rgba(96,165,250,0.1)] rounded-lg text-[#60a5fa] font-['Inter'] text-sm transition-all">
                        Respond to Prompt
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* CHAT TAB */}
              {activeTab === 'chat' && (
                <div className="rounded-xl backdrop-blur-xl overflow-hidden" style={{ background: 'rgba(15, 23, 41, 0.7)', border: '1px solid rgba(139, 157, 195, 0.25)', height: '600px' }}>
                  {/* Chat Messages */}
                  <div className="h-[520px] overflow-y-auto p-6 space-y-4">
                    {MOCK_CHAT.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold shrink-0" style={{ boxShadow: '0 0 15px rgba(96, 165, 250, 0.4)' }}>
                          {msg.author[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-['Inter'] text-sm font-semibold text-white">{msg.author}</p>
                            <p className="font-['Inter'] text-xs text-[#8b9dc3]">{getRelativeTime(msg.timestamp)}</p>
                          </div>
                          <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8]" style={{ lineHeight: '1.6' }}>
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-[rgba(139,157,195,0.2)]">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-[rgba(15,23,41,0.9)] border border-[rgba(139,157,195,0.3)] rounded-lg text-white placeholder-[#8b9dc3] focus:border-[#60a5fa] focus:outline-none font-['Inter'] text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && chatMessage.trim()) {
                            setChatMessage('');
                          }
                        }}
                      />
                      <button
                        onClick={() => setChatMessage('')}
                        className="px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-lg hover:from-[#3b82f6] hover:to-[#2563eb] transition-all flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Member Sidebar */}
            <div className="w-64 shrink-0">
              <div className="rounded-xl p-6 backdrop-blur-xl sticky top-32" style={{ background: 'rgba(15, 23, 41, 0.7)', border: '1px solid rgba(139, 157, 195, 0.25)' }}>
                <h3 className="font-['Cardo'] text-lg text-white mb-4 italic">Members</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {MOCK_MEMBERS.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-sm">
                          {member.name[0]}
                        </div>
                        {member.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] rounded-full border-2 border-[#0f1729]" style={{ boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }}></div>
                        )}
                      </div>
                      <p className="font-['Inter'] text-sm text-white truncate">{member.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GardenFooter />
    </div>
  );
}
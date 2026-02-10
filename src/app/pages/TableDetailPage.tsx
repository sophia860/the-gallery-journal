import { useState } from 'react';
import { ArrowLeft, Users, Plus, Send, Bookmark, MessageCircle } from 'lucide-react';

// Mock data
const TABLE_DATA = {
  name: 'Poetry Workshop',
  description: 'A supportive space for poets to share drafts, give feedback, and grow together',
  members: [
    { id: '1', name: 'Jane Doe', username: '@janewrites', avatar: 'JD', role: 'Admin' },
    { id: '2', name: 'Maya Chen', username: '@mayapoet', avatar: 'MC', role: 'Member' },
    { id: '3', name: 'River Park', username: '@riverwords', avatar: 'RP', role: 'Member' },
    { id: '4', name: 'Alex Santos', username: '@alexwrites', avatar: 'AS', role: 'Member' },
  ],
};

const SHARED_WRITINGS = [
  {
    id: '1',
    author: 'Maya Chen',
    avatar: 'MC',
    title: 'Morning Light',
    excerpt: 'The way the sun hits the kitchen window at 6am, turning dust into gold...',
    timestamp: '2 hours ago',
    annotations: 3,
  },
  {
    id: '2',
    author: 'River Park',
    avatar: 'RP',
    title: 'Revision: Opening Stanza',
    excerpt: 'I tried rewriting the first stanza based on your feedback. Does this feel stronger?',
    timestamp: '5 hours ago',
    annotations: 5,
  },
];

const READING_LIST = [
  { title: 'Ocean Vuong - Night Sky with Exit Wounds', addedBy: 'Maya' },
  { title: 'Ada Limón - The Carrying', addedBy: 'Jane' },
  { title: 'Natalie Diaz - Postcolonial Love Poem', addedBy: 'River' },
];

const CHAT_MESSAGES = [
  { author: 'Maya', avatar: 'MC', message: 'Thanks everyone for the feedback on my draft!', time: '10m ago' },
  { author: 'River', avatar: 'RP', message: 'Looking forward to this week\'s share', time: '1h ago' },
  { author: 'Jane', avatar: 'JD', message: 'Who wants to do the next prompt?', time: '2h ago' },
];

export function TableDetailPage() {
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'reading' | 'chat'>('feed');

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#E5E0DA] px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <a
              href="/garden/tables"
              className="p-2 hover:bg-[#FAF8F5] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#6B6B6B]" />
            </a>
            <div className="flex-1">
              <h1 className="font-['Lora'] text-3xl font-semibold text-[#2C2C2C] mb-2">
                {TABLE_DATA.name}
              </h1>
              <p className="font-['Inter'] text-base text-[#6B6B6B]">
                {TABLE_DATA.description}
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold text-sm rounded-lg">
              <Plus className="w-4 h-4" />
              Invite
            </button>
          </div>

          {/* Member Count */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#9B9B9B]" />
            <span className="font-['Inter'] text-sm text-[#6B6B6B]">
              {TABLE_DATA.members.length} members
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Feed Area */}
        <main className="flex-1 overflow-y-auto px-8 py-8 max-w-4xl">
          <div className="space-y-6">
            {SHARED_WRITINGS.map((writing) => (
              <div
                key={writing.id}
                className="bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] rounded-xl p-6 transition-all"
              >
                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#7A9E7E] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-sm">
                    {writing.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter'] text-sm font-semibold text-[#2C2C2C]">
                      {writing.author}
                    </p>
                    <p className="font-['Inter'] text-xs text-[#9B9B9B]">
                      {writing.timestamp}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-[#FAF8F5] rounded-lg transition-colors">
                    <Bookmark className="w-4 h-4 text-[#9B9B9B]" />
                  </button>
                </div>

                {/* Content */}
                <h3 className="font-['Lora'] text-xl font-semibold text-[#2C2C2C] mb-3">
                  {writing.title}
                </h3>
                <p className="font-['Inter'] text-base text-[#6B6B6B] mb-4 leading-relaxed">
                  {writing.excerpt}
                </p>

                {/* Annotations */}
                <div className="flex items-center gap-4 pt-4 border-t-2 border-[#E5E0DA]">
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#FAF8F5] rounded-lg transition-colors">
                    <MessageCircle className="w-4 h-4 text-[#9B9B9B]" />
                    <span className="font-['Inter'] text-sm text-[#6B6B6B]">
                      {writing.annotations} annotations
                    </span>
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State for no writings */}
            {SHARED_WRITINGS.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-[#F0F7F0] rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-[#7A9E7E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22v-8m0-4V2m0 8c-2.5-2-5-2-7 0m7 0c2.5-2 5-2 7 0" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-2">
                  No shared work yet
                </h3>
                <p className="font-['Inter'] text-base text-[#9B9B9B] text-center max-w-md">
                  Share your writing with the table to get feedback and start conversations
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 bg-white border-l-2 border-[#E5E0DA] flex flex-col overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b-2 border-[#E5E0DA]">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 px-4 py-3 font-['Inter'] text-sm font-medium transition-colors ${
                activeTab === 'feed'
                  ? 'text-[#7A9E7E] border-b-2 border-[#7A9E7E] -mb-[2px]'
                  : 'text-[#9B9B9B] hover:text-[#2C2C2C]'
              }`}
            >
              Members
            </button>
            <button
              onClick={() => setActiveTab('reading')}
              className={`flex-1 px-4 py-3 font-['Inter'] text-sm font-medium transition-colors ${
                activeTab === 'reading'
                  ? 'text-[#7A9E7E] border-b-2 border-[#7A9E7E] -mb-[2px]'
                  : 'text-[#9B9B9B] hover:text-[#2C2C2C]'
              }`}
            >
              Reading
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-3 font-['Inter'] text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-[#7A9E7E] border-b-2 border-[#7A9E7E] -mb-[2px]'
                  : 'text-[#9B9B9B] hover:text-[#2C2C2C]'
              }`}
            >
              Chat
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Members Tab */}
            {activeTab === 'feed' && (
              <div className="space-y-4">
                {TABLE_DATA.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#7A9E7E] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-sm">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Inter'] text-sm font-semibold text-[#2C2C2C] truncate">
                        {member.name}
                      </p>
                      <p className="font-['Inter'] text-xs text-[#9B9B9B] truncate">
                        {member.username}
                      </p>
                    </div>
                    {member.role === 'Admin' && (
                      <span className="px-2 py-1 bg-[#F0F7F0] text-[#7A9E7E] font-['Inter'] text-xs font-semibold rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Reading List Tab */}
            {activeTab === 'reading' && (
              <div className="space-y-4">
                {READING_LIST.map((book, index) => (
                  <div key={index} className="p-4 bg-[#FAF8F5] rounded-lg">
                    <p className="font-['Lora'] text-sm font-semibold text-[#2C2C2C] mb-1">
                      {book.title}
                    </p>
                    <p className="font-['Inter'] text-xs text-[#9B9B9B]">
                      Added by {book.addedBy}
                    </p>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#E5E0DA] hover:border-[#7A9E7E] text-[#6B6B6B] hover:text-[#7A9E7E] transition-all font-['Inter'] text-sm font-semibold rounded-lg">
                  <Plus className="w-4 h-4" />
                  Add to Reading List
                </button>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-4 mb-4">
                  {CHAT_MESSAGES.map((msg, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 bg-[#7A9E7E] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-xs flex-shrink-0">
                        {msg.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <p className="font-['Inter'] text-sm font-semibold text-[#2C2C2C]">
                            {msg.author}
                          </p>
                          <p className="font-['Inter'] text-xs text-[#9B9B9B]">
                            {msg.time}
                          </p>
                        </div>
                        <p className="font-['Inter'] text-sm text-[#6B6B6B]">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Send a message..."
                    className="w-full pl-4 pr-12 py-3 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-sm text-[#2C2C2C] rounded-lg transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#7A9E7E] hover:bg-[#F0F7F0] rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
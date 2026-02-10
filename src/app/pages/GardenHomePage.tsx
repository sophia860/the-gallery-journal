import { useState } from 'react';
import { Sprout, Home, Compass, Users, Bookmark, FileText, Settings, Bell, Search, Plus, TrendingUp, Sparkles } from 'lucide-react';
import { NoteCard } from '../components/NoteCard';

// Mock data for note cards
const MOCK_WRITINGS = [
  {
    id: '1',
    title: 'On the Nature of Silence',
    preview: 'There is a kind of silence that speaks louder than words. It fills the spaces between heartbeats, the gaps in conversation, the moments before sleep...',
    tags: ['Poetry', 'Reflection'],
    status: 'bloom' as const,
    lastEdited: '2 days ago',
    connectionCount: 3,
  },
  {
    id: '2',
    title: 'Morning Rituals',
    preview: 'Coffee first, always. The ritual of boiling water, grinding beans, the first sip before the world wakes up. These small acts ground me...',
    tags: ['Essay', 'Daily Life'],
    status: 'sprout' as const,
    lastEdited: '5 hours ago',
    connectionCount: 0,
  },
  {
    id: '3',
    title: 'Fragments from a Dream',
    preview: 'A house with too many doors. My mother\'s voice calling from somewhere I cannot reach. The smell of rain on hot pavement...',
    tags: ['Fiction', 'Experimental'],
    status: 'seed' as const,
    lastEdited: '1 week ago',
    connectionCount: 1,
  },
  {
    id: '4',
    title: 'What I\'ve Learned About Love',
    preview: 'Love is not what the movies promised. It\'s doing dishes together at midnight. It\'s learning to say sorry. It\'s choosing each other, again and again...',
    tags: ['Memoir', 'Relationships'],
    status: 'bloom' as const,
    lastEdited: '3 days ago',
    connectionCount: 7,
  },
  {
    id: '5',
    title: 'The Architecture of Memory',
    preview: 'Memory is not a photograph. It\'s a building we construct, room by room, each visit changing the walls slightly...',
    tags: ['Essay', 'Philosophy'],
    status: 'sprout' as const,
    lastEdited: '1 day ago',
    connectionCount: 2,
  },
];

const FILTER_TABS = ['All', 'Following', 'Poetry', 'Fiction', 'Essays', 'Memoir'];

const TRENDING_TOPICS = [
  { tag: 'Climate Fiction', count: 156 },
  { tag: 'Grief', count: 142 },
  { tag: 'Identity', count: 128 },
  { tag: 'Experimental', count: 95 },
];

const SUGGESTED_WRITERS = [
  { name: 'Maya Chen', bio: 'Poet & essayist', avatar: 'MC' },
  { name: 'River Park', bio: 'Fiction writer', avatar: 'RP' },
  { name: 'Alex Santos', bio: 'Memoirist', avatar: 'AS' },
];

export function GardenHomePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-60 bg-white border-r-2 border-[#E5E0DA] flex flex-col fixed left-0 top-0 bottom-0">
        {/* User Profile */}
        <div className="p-6 border-b-2 border-[#E5E0DA]">
          <a href="/" className="flex items-center gap-2 mb-6">
            <Sprout className="w-6 h-6 text-[#7A9E7E]" />
            <span className="font-['Lora'] text-xl font-semibold text-[#2C2C2C] lowercase italic">
              garden
            </span>
          </a>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#7A9E7E] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-lg">
              JD
            </div>
            <div>
              <p className="font-['Inter'] text-sm font-semibold text-[#2C2C2C]">
                Jane Doe
              </p>
              <p className="font-['Inter'] text-xs text-[#9B9B9B]">
                @janewrites
              </p>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold text-sm rounded-lg shadow-sm">
            <Plus className="w-4 h-4" />
            New Seed
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <a
            href="/garden"
            className="flex items-center gap-3 px-4 py-2.5 bg-[#F0F7F0] text-[#7A9E7E] rounded-lg font-['Inter'] text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            My Garden
          </a>
          <a
            href="/garden/discover"
            className="flex items-center gap-3 px-4 py-2.5 text-[#6B6B6B] hover:bg-[#FAF8F5] hover:text-[#2C2C2C] rounded-lg font-['Inter'] text-sm font-medium transition-colors"
          >
            <Compass className="w-4 h-4" />
            Discover
          </a>
          <a
            href="/garden/tables"
            className="flex items-center gap-3 px-4 py-2.5 text-[#6B6B6B] hover:bg-[#FAF8F5] hover:text-[#2C2C2C] rounded-lg font-['Inter'] text-sm font-medium transition-colors"
          >
            <Users className="w-4 h-4" />
            Tables
          </a>
          <a
            href="/garden/bookmarks"
            className="flex items-center gap-3 px-4 py-2.5 text-[#6B6B6B] hover:bg-[#FAF8F5] hover:text-[#2C2C2C] rounded-lg font-['Inter'] text-sm font-medium transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            Bookmarks
          </a>
          <a
            href="/garden/drafts"
            className="flex items-center gap-3 px-4 py-2.5 text-[#6B6B6B] hover:bg-[#FAF8F5] hover:text-[#2C2C2C] rounded-lg font-['Inter'] text-sm font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            Drafts
          </a>
          <a
            href="/garden/settings"
            className="flex items-center gap-3 px-4 py-2.5 text-[#6B6B6B] hover:bg-[#FAF8F5] hover:text-[#2C2C2C] rounded-lg font-['Inter'] text-sm font-medium transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </a>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[#E5E0DA]">
          <p className="font-['Inter'] text-xs text-[#9B9B9B] text-center">
            © 2026 Garden
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-60 mr-80">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white border-b-2 border-[#E5E0DA] px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your garden..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-sm text-[#2C2C2C] rounded-lg transition-colors"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 hover:bg-[#FAF8F5] rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-[#6B6B6B]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C4795B] rounded-full"></span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 font-['Inter'] text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  activeFilter === tab
                    ? 'bg-[#7A9E7E] text-white'
                    : 'bg-[#FAF8F5] text-[#6B6B6B] hover:bg-[#E5E0DA]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid of Note Cards */}
        <div className="p-8">
          <h2 className="font-['Lora'] text-3xl font-semibold text-[#2C2C2C] mb-6">
            Your Garden
          </h2>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {MOCK_WRITINGS.map((writing) => (
              <div key={writing.id} className="break-inside-avoid">
                <NoteCard
                  {...writing}
                  onClick={() => window.location.href = `/garden/editor/${writing.id}`}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-80 bg-white border-l-2 border-[#E5E0DA] p-6 fixed right-0 top-0 bottom-0 overflow-y-auto">
        {/* Trending Topics */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#7A9E7E]" />
            <h3 className="font-['Lora'] text-lg font-semibold text-[#2C2C2C]">
              Trending Topics
            </h3>
          </div>
          <div className="space-y-3">
            {TRENDING_TOPICS.map((topic) => (
              <button
                key={topic.tag}
                className="w-full flex items-center justify-between p-3 bg-[#FAF8F5] hover:bg-[#F0F7F0] rounded-lg transition-colors group"
              >
                <span className="font-['Inter'] text-sm font-medium text-[#2C2C2C] group-hover:text-[#7A9E7E]">
                  {topic.tag}
                </span>
                <span className="font-['Inter'] text-xs text-[#9B9B9B]">
                  {topic.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Writers */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#D4B896]" />
            <h3 className="font-['Lora'] text-lg font-semibold text-[#2C2C2C]">
              Writers to Follow
            </h3>
          </div>
          <div className="space-y-3">
            {SUGGESTED_WRITERS.map((writer) => (
              <div
                key={writer.name}
                className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-lg"
              >
                <div className="w-10 h-10 bg-[#7A9E7E] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-sm flex-shrink-0">
                  {writer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Inter'] text-sm font-semibold text-[#2C2C2C] truncate">
                    {writer.name}
                  </p>
                  <p className="font-['Inter'] text-xs text-[#9B9B9B] truncate">
                    {writer.bio}
                  </p>
                </div>
                <button className="px-3 py-1.5 bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] hover:text-[#7A9E7E] text-[#6B6B6B] font-['Inter'] text-xs font-semibold rounded-lg transition-all flex-shrink-0">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
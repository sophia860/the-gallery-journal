import { useState } from 'react';
import { Sprout, Home, Compass, Users, Bookmark, FileText, Settings, Search, Plus, ArrowRight } from 'lucide-react';

// Mock data
const THEMATIC_THREADS = [
  {
    id: '1',
    topic: 'Writing About Climate',
    description: 'Exploring environmental themes through poetry and prose',
    pieces: 24,
    contributors: 12,
  },
  {
    id: '2',
    topic: 'Memory & Place',
    description: 'How our memories shape the landscapes we inhabit',
    pieces: 18,
    contributors: 9,
  },
  {
    id: '3',
    topic: 'Queer Joy',
    description: 'Celebrating LGBTQ+ stories of love, identity, and belonging',
    pieces: 31,
    contributors: 15,
  },
  {
    id: '4',
    topic: 'Immigrant Narratives',
    description: 'Stories of crossing borders, both physical and cultural',
    pieces: 22,
    contributors: 11,
  },
];

const GARDENS_TO_VISIT = [
  {
    id: '1',
    name: 'Maya Chen',
    username: '@mayapoet',
    bio: 'Poet exploring grief, joy, and the spaces between',
    avatar: 'MC',
    bloomCount: 12,
  },
  {
    id: '2',
    name: 'River Park',
    username: '@riverwords',
    bio: 'Fiction writer. Currently working on a climate novel',
    avatar: 'RP',
    bloomCount: 8,
  },
  {
    id: '3',
    name: 'Alex Santos',
    username: '@alexwrites',
    bio: 'Memoirist. Writing about family, food, and belonging',
    avatar: 'AS',
    bloomCount: 15,
  },
  {
    id: '4',
    name: 'Taylor Wong',
    username: '@taylorwrites',
    bio: 'Hybrid forms, experimental poetry, visual writing',
    avatar: 'TW',
    bloomCount: 20,
  },
];

const OPEN_TABLES = [
  {
    id: '1',
    name: 'Sunday Morning Pages',
    description: 'Weekly freewriting and gentle prompts. All genres welcome.',
    members: 5,
    capacity: 10,
    avatars: ['LM', 'KP', 'BR'],
  },
  {
    id: '2',
    name: 'Lyric Essay Circle',
    description: 'For writers exploring the hybrid space between poetry and essay',
    members: 7,
    capacity: 12,
    avatars: ['DW', 'ST', 'GH', 'PL'],
  },
  {
    id: '3',
    name: 'First Draft Club',
    description: 'A judgment-free zone for sharing messy first drafts',
    members: 4,
    capacity: 8,
    avatars: ['EM', 'VK'],
  },
];

export function DiscoverPage() {
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
            href="/garden/home"
            className="flex items-center gap-3 px-4 py-2.5 text-[#6B6B6B] hover:bg-[#FAF8F5] hover:text-[#2C2C2C] rounded-lg font-['Inter'] text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            My Garden
          </a>
          <a
            href="/garden/discover"
            className="flex items-center gap-3 px-4 py-2.5 bg-[#F0F7F0] text-[#7A9E7E] rounded-lg font-['Inter'] text-sm font-medium"
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
      <main className="flex-1 ml-60 px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['Lora'] text-4xl font-semibold text-[#2C2C2C] mb-3">
            Discover
          </h1>
          <p className="font-['Inter'] text-base text-[#6B6B6B] mb-6">
            Explore thematic threads, visit new gardens, and find writing communities
          </p>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9B9B9B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for writers, topics, or tables..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-base text-[#2C2C2C] rounded-lg transition-colors"
            />
          </div>
        </div>

        {/* Thematic Threads Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C]">
              Thematic Threads
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {THEMATIC_THREADS.map((thread) => (
              <a
                key={thread.id}
                href={`/garden/threads/${thread.id}`}
                className="block bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] rounded-xl p-6 transition-all hover:shadow-lg group"
              >
                <h3 className="font-['Lora'] text-xl font-semibold text-[#2C2C2C] group-hover:text-[#7A9E7E] mb-2 transition-colors">
                  {thread.topic}
                </h3>
                <p className="font-['Inter'] text-sm text-[#6B6B6B] mb-4">
                  {thread.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#9B9B9B] font-['Inter']">
                  <span>{thread.pieces} pieces</span>
                  <span>•</span>
                  <span>{thread.contributors} contributors</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Gardens to Visit Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C]">
              Gardens to Visit
            </h2>
          </div>

          {GARDENS_TO_VISIT.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-[#E5E0DA] rounded-xl">
              <div className="w-20 h-20 bg-[#F0F7F0] rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#7A9E7E]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c-1.5 4-1.5 6 0 8 1.5-2 1.5-4 0-8zm0 8c-4 1.5-6 1.5-8 0 2 1.5 4 1.5 8 0zm0 0c4 1.5 6 1.5 8 0-2 1.5-4 1.5-8 0zm0 0c-1.5 4-1.5 6 0 8 1.5-2 1.5-4 0-8z" opacity="0.5"/>
                  <circle cx="12" cy="12" r="2.5"/>
                </svg>
              </div>
              <h3 className="font-['Lora'] text-xl font-semibold text-[#2C2C2C] mb-2">
                No gardens yet
              </h3>
              <p className="font-['Inter'] text-sm text-[#9B9B9B] text-center max-w-md">
                Gardens will appear here as writers share their blooms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {GARDENS_TO_VISIT.map((writer) => (
                <a
                  key={writer.id}
                  href={`/garden/writers/${writer.username.slice(1)}`}
                  className="block bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] rounded-xl p-6 transition-all hover:shadow-lg group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#7A9E7E] rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-xl mb-4">
                      {writer.avatar}
                    </div>
                    <h3 className="font-['Lora'] text-lg font-semibold text-[#2C2C2C] group-hover:text-[#7A9E7E] mb-1 transition-colors">
                      {writer.name}
                    </h3>
                    <p className="font-['Inter'] text-xs text-[#9B9B9B] mb-3">
                      {writer.username}
                    </p>
                    <p className="font-['Inter'] text-sm text-[#6B6B6B] mb-4 line-clamp-2">
                      {writer.bio}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#9B9B9B] font-['Inter']">
                      <svg className="w-4 h-4 text-[#C48B8B]" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="2"/>
                      </svg>
                      <span>{writer.bloomCount} blooms</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Tables Accepting Members Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C]">
              Tables Accepting Members
            </h2>
            <a
              href="/garden/tables"
              className="flex items-center gap-2 font-['Inter'] text-sm font-medium text-[#7A9E7E] hover:text-[#6A8E6E] transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OPEN_TABLES.map((table) => (
              <a
                key={table.id}
                href={`/garden/tables/${table.id}`}
                className="block bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] rounded-xl p-6 transition-all hover:shadow-lg group"
              >
                <h3 className="font-['Lora'] text-lg font-semibold text-[#2C2C2C] group-hover:text-[#7A9E7E] mb-2 transition-colors">
                  {table.name}
                </h3>
                <p className="font-['Inter'] text-sm text-[#6B6B6B] mb-4 line-clamp-2">
                  {table.description}
                </p>

                {/* Member Count */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#9B9B9B]" />
                    <span className="font-['Inter'] text-sm text-[#2C2C2C] font-medium">
                      {table.members}/{table.capacity}
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-[#F0F7F0] text-[#7A9E7E] font-['Inter'] text-xs font-semibold rounded-full">
                    Open
                  </span>
                </div>

                {/* Avatar Stack */}
                <div className="flex items-center -space-x-2">
                  {table.avatars.map((avatar, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-[#7A9E7E] border-2 border-white rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-xs"
                      style={{ zIndex: table.avatars.length - index }}
                    >
                      {avatar}
                    </div>
                  ))}
                  {table.capacity - table.members > 0 && (
                    <div
                      className="w-8 h-8 bg-[#FAF8F5] border-2 border-[#E5E0DA] rounded-full flex items-center justify-center font-['Inter'] text-xs text-[#9B9B9B]"
                      style={{ zIndex: 0 }}
                    >
                      +{table.capacity - table.members}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

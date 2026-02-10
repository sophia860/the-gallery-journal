import { useState } from 'react';
import { Sprout, Home, Compass, Users, Bookmark, FileText, Settings, Plus, Search } from 'lucide-react';

// Mock data for tables
const MOCK_TABLES = [
  {
    id: '1',
    name: 'Poetry Workshop',
    description: 'A supportive space for poets to share drafts, give feedback, and grow together',
    members: 8,
    capacity: 12,
    lastActivity: '2 hours ago',
    avatars: ['JD', 'MC', 'RP', 'AS', 'TW'],
    isMember: true,
  },
  {
    id: '2',
    name: 'Flash Fiction Fridays',
    description: 'Weekly flash fiction challenges and critiques. Under 1000 words only!',
    members: 6,
    capacity: 10,
    lastActivity: '1 day ago',
    avatars: ['LM', 'KP', 'BR', 'NS'],
    isMember: true,
  },
  {
    id: '3',
    name: 'Memoir in Progress',
    description: 'Writers working on long-form memoir projects. Monthly chapter shares.',
    members: 5,
    capacity: 8,
    lastActivity: '3 days ago',
    avatars: ['DW', 'ST', 'GH'],
    isMember: false,
  },
  {
    id: '4',
    name: 'Experimental Forms',
    description: 'Playing with hybrid forms, visual poetry, and unconventional structures',
    members: 7,
    capacity: 12,
    lastActivity: '5 hours ago',
    avatars: ['EM', 'VK', 'PL', 'HJ'],
    isMember: false,
  },
];

export function TablesOverviewPage() {
  const [activeFilter, setActiveFilter] = useState<'my' | 'discover'>('my');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTables = MOCK_TABLES.filter(table => {
    const matchesFilter = activeFilter === 'my' ? table.isMember : true;
    const matchesSearch = table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          table.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
            className="flex items-center gap-3 px-4 py-2.5 text-[#6B6B6B] hover:bg-[#FAF8F5] hover:text-[#2C2C2C] rounded-lg font-['Inter'] text-sm font-medium transition-colors"
          >
            <Compass className="w-4 h-4" />
            Discover
          </a>
          <a
            href="/garden/tables"
            className="flex items-center gap-3 px-4 py-2.5 bg-[#F0F7F0] text-[#7A9E7E] rounded-lg font-['Inter'] text-sm font-medium"
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
            Tables
          </h1>
          <p className="font-['Inter'] text-base text-[#6B6B6B]">
            Gather around small tables to share work, give feedback, and grow together
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('my')}
              className={`px-4 py-2 font-['Inter'] text-sm font-medium rounded-lg transition-all ${
                activeFilter === 'my'
                  ? 'bg-[#7A9E7E] text-white'
                  : 'bg-white border-2 border-[#E5E0DA] text-[#6B6B6B] hover:border-[#7A9E7E]'
              }`}
            >
              My Tables
            </button>
            <button
              onClick={() => setActiveFilter('discover')}
              className={`px-4 py-2 font-['Inter'] text-sm font-medium rounded-lg transition-all ${
                activeFilter === 'discover'
                  ? 'bg-[#7A9E7E] text-white'
                  : 'bg-white border-2 border-[#E5E0DA] text-[#6B6B6B] hover:border-[#7A9E7E]'
              }`}
            >
              Discover
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tables..."
                className="w-64 pl-10 pr-4 py-2 bg-white border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-sm text-[#2C2C2C] rounded-lg transition-colors"
              />
            </div>

            {/* Start New Table Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold text-sm rounded-lg shadow-sm">
              <Plus className="w-4 h-4" />
              Start a New Table
            </button>
          </div>
        </div>

        {/* Tables Grid */}
        {filteredTables.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-[#F0F7F0] rounded-full flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-[#7A9E7E]" />
            </div>
            <h3 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-2">
              {activeFilter === 'my' ? 'No tables yet' : 'No tables found'}
            </h3>
            <p className="font-['Inter'] text-base text-[#9B9B9B] mb-6 text-center max-w-md">
              {activeFilter === 'my' 
                ? 'Tables are small writing communities where you can share work and get feedback'
                : 'Try adjusting your search or check back later for new tables'
              }
            </p>
            {activeFilter === 'my' && (
              <button className="flex items-center gap-2 px-6 py-3 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold text-sm rounded-lg">
                <Plus className="w-4 h-4" />
                Start Your First Table
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTables.map((table) => (
              <a
                key={table.id}
                href={`/garden/tables/${table.id}`}
                className="block bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] rounded-xl p-6 transition-all hover:shadow-lg group"
              >
                {/* Table Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-['Lora'] text-xl font-semibold text-[#2C2C2C] group-hover:text-[#7A9E7E] transition-colors">
                    {table.name}
                  </h3>
                  {table.isMember && (
                    <span className="px-2 py-1 bg-[#F0F7F0] text-[#7A9E7E] font-['Inter'] text-xs font-semibold rounded-full">
                      Member
                    </span>
                  )}
                </div>

                {/* Description */}
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
                  <span className="font-['Inter'] text-xs text-[#9B9B9B]">
                    {table.lastActivity}
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
        )}
      </main>
    </div>
  );
}

import { useState } from 'react';
import { Sprout, Home, Compass, Users, Bookmark, FileText, Settings, Upload, Edit2 } from 'lucide-react';
import { NoteCard } from '../components/NoteCard';

// Mock data
const USER_PROFILE = {
  displayName: 'Jane Doe',
  writerName: 'J.D. Gardens',
  username: '@janewrites',
  email: 'jane@example.com',
  bio: 'Poet and essayist exploring themes of memory, place, and belonging. Currently working on a collection about gardens and growth.',
  avatar: 'JD',
};

const RECENT_WRITINGS = [
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
    title: 'What I\'ve Learned About Love',
    preview: 'Love is not what the movies promised. It\'s doing dishes together at midnight. It\'s learning to say sorry. It\'s choosing each other, again and again...',
    tags: ['Memoir', 'Relationships'],
    status: 'bloom' as const,
    lastEdited: '3 days ago',
    connectionCount: 7,
  },
  {
    id: '3',
    title: 'The Architecture of Memory',
    preview: 'Memory is not a photograph. It\'s a building we construct, room by room, each visit changing the walls slightly...',
    tags: ['Essay', 'Philosophy'],
    status: 'sprout' as const,
    lastEdited: '1 day ago',
    connectionCount: 2,
  },
];

const STATS = {
  totalWritings: 24,
  seeds: 8,
  sprouts: 9,
  blooms: 7,
  publicCount: 12,
};

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(USER_PROFILE);

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
              {profile.avatar}
            </div>
            <div>
              <p className="font-['Inter'] text-sm font-semibold text-[#2C2C2C]">
                {profile.displayName}
              </p>
              <p className="font-['Inter'] text-xs text-[#9B9B9B]">
                {profile.username}
              </p>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold text-sm rounded-lg shadow-sm">
            <Upload className="w-4 h-4" />
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-['Lora'] text-4xl font-semibold text-[#2C2C2C] mb-2">
                Profile
              </h1>
              <p className="font-['Inter'] text-base text-[#6B6B6B]">
                Manage your public garden profile
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold text-sm rounded-lg"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-8 mb-8">
            {/* Avatar Upload */}
            <div className="flex items-start gap-6 mb-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-[#7A9E7E] rounded-full flex items-center justify-center text-white font-['Inter'] font-bold text-3xl">
                  {profile.avatar}
                </div>
                {isEditing && (
                  <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-base text-[#2C2C2C] rounded-lg transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* Writer Name (Pen Name) */}
            <div className="mb-6">
              <label className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                Writer Name (Pen Name)
              </label>
              <input
                type="text"
                value={profile.writerName}
                onChange={(e) => setProfile({ ...profile, writerName: e.target.value })}
                disabled={!isEditing}
                placeholder="Your public writing name"
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-base text-[#2C2C2C] rounded-lg transition-colors disabled:opacity-60"
              />
            </div>

            {/* Username */}
            <div className="mb-6">
              <label className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                Username
              </label>
              <input
                type="text"
                value={profile.username}
                disabled
                className="w-full px-4 py-2.5 bg-[#E5E0DA] border-2 border-[#E5E0DA] font-['Inter'] text-base text-[#9B9B9B] rounded-lg cursor-not-allowed"
              />
              <p className="font-['Inter'] text-xs text-[#9B9B9B] mt-1">
                Your username cannot be changed
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell visitors about your writing..."
                className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-base text-[#2C2C2C] rounded-lg transition-colors disabled:opacity-60 resize-none"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-4 text-center">
              <p className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-1">
                {STATS.totalWritings}
              </p>
              <p className="font-['Inter'] text-xs text-[#9B9B9B] uppercase tracking-wider">
                Total
              </p>
            </div>
            <div className="bg-[#FBF7F0] border-2 border-[#D4B896] rounded-xl p-4 text-center">
              <p className="font-['Lora'] text-2xl font-semibold text-[#9B7E4F] mb-1">
                {STATS.seeds}
              </p>
              <p className="font-['Inter'] text-xs text-[#9B7E4F] uppercase tracking-wider">
                Seeds
              </p>
            </div>
            <div className="bg-[#F0F7F0] border-2 border-[#A3C4A0] rounded-xl p-4 text-center">
              <p className="font-['Lora'] text-2xl font-semibold text-[#5A7E58] mb-1">
                {STATS.sprouts}
              </p>
              <p className="font-['Inter'] text-xs text-[#5A7E58] uppercase tracking-wider">
                Sprouts
              </p>
            </div>
            <div className="bg-[#FAF2F2] border-2 border-[#C48B8B] rounded-xl p-4 text-center">
              <p className="font-['Lora'] text-2xl font-semibold text-[#9E5A5A] mb-1">
                {STATS.blooms}
              </p>
              <p className="font-['Inter'] text-xs text-[#9E5A5A] uppercase tracking-wider">
                Blooms
              </p>
            </div>
            <div className="bg-white border-2 border-[#7A9E7E] rounded-xl p-4 text-center">
              <p className="font-['Lora'] text-2xl font-semibold text-[#7A9E7E] mb-1">
                {STATS.publicCount}
              </p>
              <p className="font-['Inter'] text-xs text-[#7A9E7E] uppercase tracking-wider">
                Public
              </p>
            </div>
          </div>

          {/* Public Garden Preview */}
          <div>
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-6">
              Public Garden Preview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {RECENT_WRITINGS.map((writing) => (
                <div key={writing.id}>
                  <NoteCard
                    {...writing}
                    onClick={() => window.location.href = `/garden/editor/${writing.id}`}
                  />
                </div>
              ))}
            </div>
            {RECENT_WRITINGS.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-[#E5E0DA] rounded-xl">
                <div className="w-20 h-20 bg-[#F0F7F0] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-[#7A9E7E]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c-1.5 4-1.5 6 0 8 1.5-2 1.5-4 0-8zm0 8c-4 1.5-6 1.5-8 0 2 1.5 4 1.5 8 0zm0 0c4 1.5 6 1.5 8 0-2 1.5-4 1.5-8 0zm0 0c-1.5 4-1.5 6 0 8 1.5-2 1.5-4 0-8z" opacity="0.5"/>
                    <circle cx="12" cy="12" r="2.5"/>
                  </svg>
                </div>
                <h3 className="font-['Lora'] text-xl font-semibold text-[#2C2C2C] mb-2">
                  No public writings yet
                </h3>
                <p className="font-['Inter'] text-sm text-[#9B9B9B] text-center max-w-md">
                  Share your blooms publicly to build your garden
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

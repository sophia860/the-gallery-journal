import { useState } from 'react';
import { Sprout, Home, Compass, Users, Bookmark, FileText, Settings, Sun, Moon, Monitor, Download, Eye, EyeOff, Lock } from 'lucide-react';

export function SettingsPage() {
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>('light');
  const [defaultVisibility, setDefaultVisibility] = useState<'public' | 'private' | 'circle'>('private');
  const [whoCanSeeGarden, setWhoCanSeeGarden] = useState<'everyone' | 'members' | 'tables'>('everyone');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');

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
            className="flex items-center gap-3 px-4 py-2.5 bg-[#F0F7F0] text-[#7A9E7E] rounded-lg font-['Inter'] text-sm font-medium"
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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-['Lora'] text-4xl font-semibold text-[#2C2C2C] mb-2">
              Settings
            </h1>
            <p className="font-['Inter'] text-base text-[#6B6B6B]">
              Manage your account and preferences
            </p>
          </div>

          {/* Account Section */}
          <section className="mb-8">
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-4">
              Account
            </h2>
            <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value="jane@example.com"
                  className="w-full px-4 py-2.5 bg-[#E5E0DA] border-2 border-[#E5E0DA] font-['Inter'] text-base text-[#9B9B9B] rounded-lg cursor-not-allowed"
                  disabled
                />
                <p className="font-['Inter'] text-xs text-[#9B9B9B] mt-1">
                  Contact support to change your email
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                  Password
                </label>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF8F5] border-2 border-[#E5E0DA] hover:border-[#7A9E7E] text-[#6B6B6B] hover:text-[#7A9E7E] transition-all font-['Inter'] text-sm font-medium rounded-lg">
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="mb-8">
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-4">
              Appearance
            </h2>
            <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-6">
              <label className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setAppearance('light')}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                    appearance === 'light'
                      ? 'bg-[#F0F7F0] border-[#7A9E7E]'
                      : 'bg-[#FAF8F5] border-[#E5E0DA] hover:border-[#7A9E7E]'
                  }`}
                >
                  <Sun className="w-6 h-6 text-[#7A9E7E]" />
                  <span className="font-['Inter'] text-sm font-medium text-[#2C2C2C]">
                    Light
                  </span>
                </button>
                <button
                  onClick={() => setAppearance('dark')}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                    appearance === 'dark'
                      ? 'bg-[#F0F7F0] border-[#7A9E7E]'
                      : 'bg-[#FAF8F5] border-[#E5E0DA] hover:border-[#7A9E7E]'
                  }`}
                >
                  <Moon className="w-6 h-6 text-[#7A9E7E]" />
                  <span className="font-['Inter'] text-sm font-medium text-[#2C2C2C]">
                    Dark
                  </span>
                </button>
                <button
                  onClick={() => setAppearance('system')}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                    appearance === 'system'
                      ? 'bg-[#F0F7F0] border-[#7A9E7E]'
                      : 'bg-[#FAF8F5] border-[#E5E0DA] hover:border-[#7A9E7E]'
                  }`}
                >
                  <Monitor className="w-6 h-6 text-[#7A9E7E]" />
                  <span className="font-['Inter'] text-sm font-medium text-[#2C2C2C]">
                    System
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="mb-8">
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-4">
              Privacy
            </h2>
            <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-6 space-y-6">
              {/* Default Visibility */}
              <div>
                <label className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-3">
                  Default Visibility for New Writings
                </label>
                <div className="space-y-2">
                  {(['public', 'private', 'circle'] as const).map((vis) => (
                    <button
                      key={vis}
                      onClick={() => setDefaultVisibility(vis)}
                      className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${
                        defaultVisibility === vis
                          ? 'bg-[#F0F7F0] border-[#7A9E7E]'
                          : 'bg-[#FAF8F5] border-[#E5E0DA] hover:border-[#7A9E7E]'
                      }`}
                    >
                      {vis === 'public' && <Eye className="w-4 h-4 text-[#7A9E7E]" />}
                      {vis === 'private' && <EyeOff className="w-4 h-4 text-[#9B9B9B]" />}
                      {vis === 'circle' && <Users className="w-4 h-4 text-[#D4B896]" />}
                      <div className="flex-1 text-left">
                        <p className="font-['Inter'] text-sm font-medium text-[#2C2C2C] capitalize">
                          {vis}
                        </p>
                        <p className="font-['Inter'] text-xs text-[#9B9B9B]">
                          {vis === 'public' && 'Everyone can see your writing'}
                          {vis === 'private' && 'Only you can see your writing'}
                          {vis === 'circle' && 'Only your circles can see your writing'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Who Can See Garden */}
              <div>
                <label className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-3">
                  Who Can See Your Garden Profile
                </label>
                <div className="space-y-2">
                  {(['everyone', 'members', 'tables'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setWhoCanSeeGarden(option)}
                      className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${
                        whoCanSeeGarden === option
                          ? 'bg-[#F0F7F0] border-[#7A9E7E]'
                          : 'bg-[#FAF8F5] border-[#E5E0DA] hover:border-[#7A9E7E]'
                      }`}
                    >
                      <div className="flex-1 text-left">
                        <p className="font-['Inter'] text-sm font-medium text-[#2C2C2C] capitalize">
                          {option === 'everyone' && 'Everyone'}
                          {option === 'members' && 'Garden Members Only'}
                          {option === 'tables' && 'My Tables Only'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="mb-8">
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-4">
              Notifications
            </h2>
            <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-6">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-1">
                    Essential Notifications Only
                  </p>
                  <p className="font-['Inter'] text-xs text-[#9B9B9B]">
                    Receive only critical updates like table invites and mentions
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#E5E0DA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E0DA] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7A9E7E]"></div>
                </div>
              </label>
            </div>
          </section>

          {/* Quiet Hours Section */}
          <section className="mb-8">
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-4">
              Quiet Hours
            </h2>
            <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-6 space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-1">
                    Enable Quiet Hours
                  </p>
                  <p className="font-['Inter'] text-xs text-[#9B9B9B]">
                    Mute all notifications during specified hours
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={quietHoursEnabled}
                    onChange={(e) => setQuietHoursEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#E5E0DA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E0DA] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7A9E7E]"></div>
                </div>
              </label>

              {quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-[#E5E0DA]">
                  <div>
                    <label className="block font-['Inter'] text-xs font-medium text-[#6B6B6B] mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={quietHoursStart}
                      onChange={(e) => setQuietHoursStart(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-sm text-[#2C2C2C] rounded-lg transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-['Inter'] text-xs font-medium text-[#6B6B6B] mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={quietHoursEnd}
                      onChange={(e) => setQuietHoursEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-sm text-[#2C2C2C] rounded-lg transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Data Export Section */}
          <section className="mb-8">
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-4">
              Data Export
            </h2>
            <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                    Download Your Writings
                  </p>
                  <p className="font-['Inter'] text-sm text-[#6B6B6B] mb-4">
                    Export all your writings, including seeds, sprouts, and blooms in JSON format. Your data belongs to you.
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold text-sm rounded-lg">
                <Download className="w-4 h-4" />
                Download All Writings
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <h2 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-4">
              Danger Zone
            </h2>
            <div className="bg-white border-2 border-[#C48B8B] rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-['Inter'] text-sm font-medium text-[#9E5A5A] mb-2">
                    Delete Account
                  </p>
                  <p className="font-['Inter'] text-sm text-[#6B6B6B] mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <button className="px-4 py-2.5 bg-white border-2 border-[#C48B8B] text-[#9E5A5A] hover:bg-[#FAF2F2] transition-all font-['Inter'] font-semibold text-sm rounded-lg">
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

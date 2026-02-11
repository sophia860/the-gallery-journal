import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileSettings {
  displayName: string;
  writerName: string;
  bio: string;
  genres: string[];
  isPublic: boolean;
  allowReplants: boolean;
}

export function ProfilePage() {
  const { user, loading, supabase } = useAuth();
  const [settings, setSettings] = useState<ProfileSettings>({
    displayName: '',
    writerName: '',
    bio: '',
    genres: [],
    isPublic: false,
    allowReplants: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const availableGenres = ['Poetry', 'Fiction', 'Non-fiction', 'Essay', 'Memoir', 'Other'];

  // Check auth and redirect if needed
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/garden/login';
    }
  }, [user, loading]);

  // Load profile settings
  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        try {
          // Try loading from Supabase first
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            setSettings({
              displayName: profile.display_name || user.user_metadata?.name || '',
              writerName: profile.writer_name || user.user_metadata?.writerName || '',
              bio: profile.bio || '',
              genres: profile.genres || [],
              isPublic: profile.is_public || false,
              allowReplants: profile.allow_replants !== false, // Default true
            });
          } else {
            // Fall back to localStorage
            const stored = localStorage.getItem(`garden_profile_${user.id}`);
            if (stored) {
              setSettings(JSON.parse(stored));
            } else {
              // Set defaults from user metadata
              setSettings(prev => ({
                ...prev,
                displayName: user.user_metadata?.name || '',
                writerName: user.user_metadata?.writerName || '',
              }));
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          // Fall back to localStorage
          const stored = localStorage.getItem(`garden_profile_${user.id}`);
          if (stored) {
            setSettings(JSON.parse(stored));
          }
        }
      };

      loadProfile();
    }
  }, [user, supabase]);

  const handleGenreToggle = (genre: string) => {
    setSettings(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setSaveMessage('');

    try {
      // Save to Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: settings.displayName,
          writer_name: settings.writerName,
          bio: settings.bio,
          genres: settings.genres,
          is_public: settings.isPublic,
          allow_replants: settings.allowReplants,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Also save to localStorage as backup
      localStorage.setItem(`garden_profile_${user.id}`, JSON.stringify(settings));

      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Save to localStorage as fallback
      localStorage.setItem(`garden_profile_${user.id}`, JSON.stringify(settings));
      setSaveMessage('Profile saved locally');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your writings and data. Are you absolutely sure?')) {
        // TODO: Implement account deletion
        alert('Account deletion will be implemented in a future update.');
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <style>{`
        /* Custom checkbox styling */
        input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        
        input[type="checkbox"]:checked {
          background-color: #7a9b76;
          border-color: #7a9b76;
          position: relative;
        }
        
        input[type="checkbox"]:checked::after {
          content: "✓";
          position: absolute;
          color: white;
          font-size: 14px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
              Profile & Settings
            </h1>
            <p className="font-['Cardo'] text-[#e0e0e0]/60">
              Manage your Garden profile and preferences
            </p>
          </div>

          {saveMessage && (
            <div className="mb-6 p-4 bg-[#7a9b76]/20 border border-[#7a9b76]/40 rounded text-[#7a9b76]">
              {saveMessage}
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-6">
            <h2 className="font-['Cardo'] text-2xl text-[#e0e0e0] mb-6">Profile</h2>

            <div className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                  className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
                  placeholder="Your Name"
                />
              </div>

              {/* Writer/Pen Name */}
              <div>
                <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                  Writer / Pen Name
                </label>
                <input
                  type="text"
                  value={settings.writerName}
                  onChange={(e) => setSettings({ ...settings, writerName: e.target.value })}
                  className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
                  placeholder="Your Writer Name"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                  Bio ({settings.bio.length}/280)
                </label>
                <textarea
                  value={settings.bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 280) {
                      setSettings({ ...settings, bio: e.target.value });
                    }
                  }}
                  className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors resize-none"
                  rows={4}
                  placeholder="Tell us about yourself and your writing..."
                  maxLength={280}
                />
              </div>
            </div>
          </div>

          {/* Writing Preferences Section */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-6">
            <h2 className="font-['Cardo'] text-2xl text-[#e0e0e0] mb-6">Writing Preferences</h2>

            <div>
              <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-4">
                Preferred Genres
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableGenres.map(genre => (
                  <label
                    key={genre}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={settings.genres.includes(genre)}
                      onChange={() => handleGenreToggle(genre)}
                      className="w-5 h-5 bg-[#121212] border-2 border-[#333] rounded checked:bg-[#7a9b76] checked:border-[#7a9b76] focus:outline-none focus:ring-2 focus:ring-[#7a9b76]/50 cursor-pointer transition-colors"
                    />
                    <span className="font-['Courier_New'] text-sm text-[#e0e0e0] group-hover:text-[#7a9b76] transition-colors">
                      {genre}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy Settings Section */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-6">
            <h2 className="font-['Cardo'] text-2xl text-[#e0e0e0] mb-6">Privacy Settings</h2>

            <div className="space-y-4">
              {/* Make garden public toggle */}
              <div className="flex items-center justify-between py-3 border-b border-[#333]">
                <div>
                  <div className="font-['Courier_New'] text-sm text-[#e0e0e0] mb-1">
                    Make my garden public
                  </div>
                  <div className="font-['Courier_New'] text-xs text-[#e0e0e0]/60">
                    Allow others to view your public writings
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, isPublic: !settings.isPublic })}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    settings.isPublic ? 'bg-[#7a9b76]' : 'bg-[#333]'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.isPublic ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Allow replant requests toggle */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-['Courier_New'] text-sm text-[#e0e0e0] mb-1">
                    Allow replant requests
                  </div>
                  <div className="font-['Courier_New'] text-xs text-[#e0e0e0]/60">
                    Let editors request to feature your work in The Gallery
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, allowReplants: !settings.allowReplants })}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    settings.allowReplants ? 'bg-[#7a9b76]' : 'bg-[#333]'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.allowReplants ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
            <h2 className="font-['Cardo'] text-2xl text-[#e0e0e0] mb-6">Account</h2>

            <div className="space-y-4">
              {/* Email (read-only) */}
              <div>
                <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0]/60 cursor-not-allowed"
                />
              </div>

              {/* Delete Account */}
              <div className="pt-4 border-t border-[#333]">
                <button
                  onClick={handleDeleteAccount}
                  className="px-6 py-3 bg-transparent border border-red-900/50 hover:border-red-600 hover:bg-red-900/20 text-red-400 hover:text-red-300 font-['Courier_New'] text-[11px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
                >
                  Delete Account
                </button>
                <p className="font-['Courier_New'] text-xs text-[#e0e0e0]/40 mt-2">
                  This action cannot be undone. All your writings will be permanently deleted.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-4 bg-[#7a9b76] hover:bg-[#8fb587] disabled:bg-[#7a9b76]/50 text-white font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => window.location.href = '/garden/dashboard'}
              className="px-8 py-4 bg-transparent border border-[#333] hover:border-[#7a9b76] text-[#e0e0e0] font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
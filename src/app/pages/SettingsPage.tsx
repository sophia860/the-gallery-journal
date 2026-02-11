import { useState } from 'react';
import { Sprout, Home, Compass, Users, Bookmark, FileText, Settings, Sun, Moon, Monitor, Download, Eye, EyeOff, Lock } from 'lucide-react';
import { GardenMainNav } from '../components/GardenMainNav';

export function SettingsPage() {
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>('dark');
  const [defaultVisibility, setDefaultVisibility] = useState<'public' | 'private' | 'circle'>('private');
  const [whoCanSeeGarden, setWhoCanSeeGarden] = useState<'everyone' | 'members' | 'tables'>('everyone');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom, #000000 0%, #0a0e1a 25%, #0f1729 50%, #1a1f3a 100%)'
    }}>
      {/* Animated Starfield Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="stars-layer"></div>
        <div className="stars-layer-2"></div>
        <div className="stars-layer-3"></div>
        <div className="stars-layer-glow"></div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 10% 10%, white, transparent),
            radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 30% 15%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(3px 3px at 40% 40%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 50% 25%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 70% 50%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 80% 20%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 15% 60%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(2px 2px at 25% 80%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 35% 90%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 45% 5%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 55% 55%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 65% 35%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 75% 75%, rgba(180, 200, 255, 0.9), transparent),
            radial-gradient(2px 2px at 85% 85%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 95% 45%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 5% 95%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 12% 42%, rgba(255, 255, 255, 0.85), transparent);
          background-size: 200% 200%;
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 8% 20%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 18% 55%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 28% 12%, white, transparent),
            radial-gradient(1px 1px at 38% 68%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 48% 82%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 58% 38%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 68% 8%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 78% 58%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 88% 28%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 98% 78%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 3% 33%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(1px 1px at 13% 73%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 23% 48%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 33% 88%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 43% 18%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 53% 63%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 63% 93%, rgba(180, 200, 255, 0.85), transparent),
            radial-gradient(1px 1px at 73% 23%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 83% 53%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 93% 3%, rgba(255, 255, 255, 0.9), transparent);
          background-size: 250% 250%;
          animation: twinkle 6s ease-in-out infinite reverse;
        }

        .stars-layer-3 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 6% 16%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 16% 46%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 26% 76%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 36% 6%, white, transparent),
            radial-gradient(1px 1px at 46% 36%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 56% 66%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 66% 96%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 76% 26%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 86% 56%, rgba(200, 210, 255, 0.9), transparent),
            radial-gradient(1px 1px at 96% 86%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 11% 51%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 21% 21%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 31% 81%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 41% 41%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 51% 11%, rgba(180, 200, 255, 0.9), transparent),
            radial-gradient(1px 1px at 61% 71%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 71% 31%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 81% 91%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 91% 61%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 1% 1%, rgba(255, 255, 255, 0.8), transparent);
          background-size: 300% 300%;
          animation: twinkle 8s ease-in-out infinite;
        }

        .stars-layer-glow {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(3px 3px at 15% 25%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(4px 4px at 45% 55%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(3px 3px at 75% 35%, rgba(200, 220, 255, 1), transparent),
            radial-gradient(4px 4px at 85% 75%, rgba(255, 255, 255, 1), transparent),
            radial-gradient(3px 3px at 25% 85%, rgba(180, 210, 255, 1), transparent);
          background-size: 100% 100%;
          animation: glow 3s ease-in-out infinite;
          filter: blur(0.5px);
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes glow {
          0%, 100% { 
            opacity: 1;
            filter: blur(0.5px);
          }
          50% { 
            opacity: 0.6;
            filter: blur(1px);
          }
        }

        .glass-card {
          background: rgba(15, 23, 41, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 157, 195, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .glass-card:hover {
          background: rgba(15, 23, 41, 0.75);
          border: 1px solid rgba(96, 165, 250, 0.3);
          box-shadow: 0 8px 32px 0 rgba(96, 165, 250, 0.15);
        }
      `}</style>

      <GardenMainNav variant="dark" />

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-['Cardo'] text-5xl text-white mb-3 italic" style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.4)' }}>
              Settings
            </h1>
            <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8]">
              Manage your account and preferences
            </p>
          </div>

          {/* Account Section */}
          <section className="mb-8">
            <h2 className="font-['Cardo'] text-3xl text-white mb-4 italic" style={{ textShadow: '0 0 20px rgba(96, 165, 250, 0.3)' }}>
              Account
            </h2>
            <div className="glass-card rounded-xl p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value="jane@example.com"
                  className="w-full px-4 py-3 glass-input text-[#8b9dc3] font-['Inter'] text-base rounded-lg cursor-not-allowed"
                  disabled
                />
                <p className="font-['Inter'] text-xs text-[#8b9dc3] mt-1">
                  Contact support to change your email
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-2">
                  Password
                </label>
                <button className="flex items-center gap-2 px-4 py-2.5 glass-card hover:border-[#60a5fa] text-[#c8cad8] hover:text-[#60a5fa] transition-all font-['Inter'] text-sm font-medium rounded-lg">
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="mb-8">
            <h2 className="font-['Cardo'] text-3xl text-white mb-4 italic" style={{ textShadow: '0 0 20px rgba(96, 165, 250, 0.3)' }}>
              Appearance
            </h2>
            <div className="glass-card rounded-xl p-6">
              <label className="block font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setAppearance('light')}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${
                    appearance === 'light'
                      ? 'border-[#60a5fa] bg-[rgba(96,165,250,0.15)] shadow-lg'
                      : 'border-[rgba(139,157,195,0.2)] hover:border-[#60a5fa]'
                  }`}
                  style={appearance === 'light' ? { boxShadow: '0 0 15px rgba(96, 165, 250, 0.3)' } : {}}
                >
                  <Sun className="w-6 h-6 text-[#60a5fa]" />
                  <span className="font-['Inter'] text-sm font-medium text-white">
                    Light
                  </span>
                </button>
                <button
                  onClick={() => setAppearance('dark')}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${
                    appearance === 'dark'
                      ? 'border-[#60a5fa] bg-[rgba(96,165,250,0.15)] shadow-lg'
                      : 'border-[rgba(139,157,195,0.2)] hover:border-[#60a5fa]'
                  }`}
                  style={appearance === 'dark' ? { boxShadow: '0 0 15px rgba(96, 165, 250, 0.3)' } : {}}
                >
                  <Moon className="w-6 h-6 text-[#60a5fa]" />
                  <span className="font-['Inter'] text-sm font-medium text-white">
                    Dark
                  </span>
                </button>
                <button
                  onClick={() => setAppearance('system')}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${
                    appearance === 'system'
                      ? 'border-[#60a5fa] bg-[rgba(96,165,250,0.15)] shadow-lg'
                      : 'border-[rgba(139,157,195,0.2)] hover:border-[#60a5fa]'
                  }`}
                  style={appearance === 'system' ? { boxShadow: '0 0 15px rgba(96, 165, 250, 0.3)' } : {}}
                >
                  <Monitor className="w-6 h-6 text-[#60a5fa]" />
                  <span className="font-['Inter'] text-sm font-medium text-white">
                    System
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="mb-8">
            <h2 className="font-['Cardo'] text-3xl text-white mb-4 italic" style={{ textShadow: '0 0 20px rgba(96, 165, 250, 0.3)' }}>
              Privacy
            </h2>
            <div className="glass-card rounded-xl p-6 space-y-6">
              {/* Default Visibility */}
              <div>
                <label className="block font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-3">
                  Default Visibility for New Writings
                </label>
                <div className="space-y-2">
                  {(['public', 'private', 'circle'] as const).map((vis) => (
                    <button
                      key={vis}
                      onClick={() => setDefaultVisibility(vis)}
                      className={`w-full flex items-center gap-3 p-3 border rounded-lg transition-all ${
                        defaultVisibility === vis
                          ? 'border-[#60a5fa] bg-[rgba(96,165,250,0.1)] shadow-lg'
                          : 'border-[rgba(139,157,195,0.2)] hover:border-[#60a5fa]'
                      }`}
                      style={defaultVisibility === vis ? { boxShadow: '0 0 10px rgba(96, 165, 250, 0.2)' } : {}}
                    >
                      {vis === 'public' && <Eye className="w-4 h-4 text-[#10b981]" />}
                      {vis === 'private' && <EyeOff className="w-4 h-4 text-[#8b9dc3]" />}
                      {vis === 'circle' && <Users className="w-4 h-4 text-[#60a5fa]" />}
                      <div className="flex-1 text-left">
                        <p className="font-['Inter'] text-sm font-medium text-white capitalize">
                          {vis}
                        </p>
                        <p className="font-['Inter'] text-xs text-[#8b9dc3]">
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
                <label className="block font-['Courier_New'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-3">
                  Who Can See Your Garden Profile
                </label>
                <div className="space-y-2">
                  {(['everyone', 'members', 'tables'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setWhoCanSeeGarden(option)}
                      className={`w-full flex items-center gap-3 p-3 border rounded-lg transition-all ${
                        whoCanSeeGarden === option
                          ? 'border-[#60a5fa] bg-[rgba(96,165,250,0.1)] shadow-lg'
                          : 'border-[rgba(139,157,195,0.2)] hover:border-[#60a5fa]'
                      }`}
                      style={whoCanSeeGarden === option ? { boxShadow: '0 0 10px rgba(96, 165, 250, 0.2)' } : {}}
                    >
                      <div className="flex-1 text-left">
                        <p className="font-['Inter'] text-sm font-medium text-white capitalize">
                          {option}
                        </p>
                        <p className="font-['Inter'] text-xs text-[#8b9dc3]">
                          {option === 'everyone' && 'Anyone can visit your garden'}
                          {option === 'members' && 'Only logged-in members can visit'}
                          {option === 'tables' && 'Only members at your tables'}
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
            <h2 className="font-['Cardo'] text-3xl text-white mb-4 italic" style={{ textShadow: '0 0 20px rgba(96, 165, 250, 0.3)' }}>
              Notifications
            </h2>
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Inter'] text-sm font-medium text-white">
                    Email Notifications
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8b9dc3]">
                    Receive emails about activity in your garden
                  </p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-gradient-to-r from-[#60a5fa] to-[#3b82f6]' : 'bg-[rgba(139,157,195,0.3)]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Data Section */}
          <section>
            <h2 className="font-['Cardo'] text-3xl text-white mb-4 italic" style={{ textShadow: '0 0 20px rgba(96, 165, 250, 0.3)' }}>
              Data
            </h2>
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Inter'] text-sm font-medium text-white">
                    Export Your Data
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8b9dc3]">
                    Download all your writings and garden data
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white hover:from-[#3b82f6] hover:to-[#2563eb] transition-all font-['Inter'] text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/30">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
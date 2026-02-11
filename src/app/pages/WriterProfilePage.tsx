import { useState } from 'react';
import { Heart, Lock, DollarSign, Users, TrendingUp, Sparkles, BookOpen, X, Check, Flower2, Leaf, Sprout, Calendar, MessageCircle, UserPlus } from 'lucide-react';
import { GardenMainNav } from '../components/GardenMainNav';
import { GardenFooter } from '../components/GardenFooter';
import { PaymentModal } from '../components/PaymentModal';

interface WriterProfilePageProps {
  username: string;
}

// Mock writer data
const MOCK_WRITER = {
  username: 'maya-chen',
  display_name: 'Maya Chen',
  bio: 'Poet & essayist. Exploring memory, displacement, and the quiet moments between words.',
  subscriber_count: 47,
  joined_date: 'Jan 2025',
  stats: {
    perennials: 47,
    seeds: 12,
    blooms: 3
  }
};

// Mock diary entries
const MOCK_DIARY_ENTRIES = [
  {
    id: '1',
    title: 'Working on a winter sequence',
    excerpt: 'The third poem keeps resisting me. Maybe it needs more space, more silence between the lines. There\'s something about the way light falls through frost that I can\'t quite capture yet.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    is_locked: false
  },
  {
    id: '2',
    title: 'Reading Tranströmer again',
    excerpt: 'His images are so precise yet mysterious. "The stones we hurled, I hear them now, striking the glass-pane roof of the house they stand in, their quarrel soundless." How does he do that?',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday
    is_locked: false
  },
  {
    id: '3',
    title: 'Notes on displacement',
    excerpt: 'Trying to write about my grandmother\'s journey. But every time I start, it feels like I\'m translating something that shouldn\'t be translated. Maybe that\'s the poem itself.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    is_locked: true
  }
];

// Mock activity feed
const MOCK_ACTIVITIES = [
  {
    id: '1',
    type: 'bloom',
    text: 'Published a new Bloom: Autumn Leaves',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: <Flower2 className="w-4 h-4" />
  },
  {
    id: '2',
    type: 'circle',
    text: 'Joined Circle: Poetry Workshop',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    icon: <Users className="w-4 h-4" />
  },
  {
    id: '3',
    type: 'diary',
    text: 'Wrote a diary entry',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    id: '4',
    type: 'subscribers',
    text: 'Received 12 new subscribers',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    icon: <UserPlus className="w-4 h-4" />
  },
  {
    id: '5',
    type: 'seed',
    text: 'Planted a new Seed: Morning Thoughts',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    icon: <Sprout className="w-4 h-4" />
  }
];

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function WriterProfilePage({ username }: WriterProfilePageProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(3);
  const [customTipAmount, setCustomTipAmount] = useState('');

  const writer = MOCK_WRITER;

  const handleSubscribe = () => {
    setShowSubscribeModal(true);
  };

  const handleTip = (amount: number) => {
    setTipAmount(amount);
    setShowTipModal(true);
  };

  const handleCustomTip = () => {
    const amount = parseFloat(customTipAmount);
    if (amount && amount > 0) {
      setTipAmount(amount);
      setShowTipModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="stars-layer"></div>
        <div className="stars-layer-2"></div>
        <div className="stars-layer-3"></div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 10% 10%, white, transparent),
            radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 30% 15%, rgba(255, 255, 255, 0.8), transparent);
          background-size: 200% 200%;
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 8% 20%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 18% 55%, rgba(255, 255, 255, 0.8), transparent);
          background-size: 250% 250%;
          animation: twinkle 6s ease-in-out infinite reverse;
        }

        .stars-layer-3 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 6% 16%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 16% 46%, rgba(255, 255, 255, 0.85), transparent);
          background-size: 300% 300%;
          animation: twinkle 8s ease-in-out infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .glass-card {
          background: rgba(15, 23, 41, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 157, 195, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>

      <GardenMainNav variant="dark" />

      <div className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Writer Header */}
          <div className="glass-card rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                  boxShadow: '0 0 30px rgba(96, 165, 250, 0.4)'
                }}
              >
                <span className="font-['Cardo'] text-4xl text-white font-bold">
                  {writer.display_name.charAt(0)}
                </span>
              </div>

              <div className="flex-1">
                <h1 className="font-['Playfair_Display'] text-4xl text-white italic mb-2" style={{ textShadow: '0 0 20px rgba(96, 165, 250, 0.3)' }}>
                  {writer.display_name}
                </h1>
                <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8] mb-4 leading-relaxed">
                  {writer.bio}
                </p>
                
                {/* Stats Bar */}
                <div className="flex items-center gap-6 text-sm font-['Inter'] text-[#8b9dc3] mb-6">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#60a5fa]" />
                    {writer.stats.perennials} Perennials
                  </span>
                  <span className="text-[rgba(139,157,195,0.4)]">|</span>
                  <span>{writer.stats.seeds} Seeds</span>
                  <span className="text-[rgba(139,157,195,0.4)]">|</span>
                  <span>{writer.stats.blooms} Blooms</span>
                  <span className="text-[rgba(139,157,195,0.4)]">|</span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Writing since {writer.joined_date}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  {!isSubscribed ? (
                    <button
                      onClick={handleSubscribe}
                      className="px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white hover:from-[#3b82f6] hover:to-[#2563eb] transition-all font-['Cardo'] text-lg rounded-lg shadow-lg shadow-blue-500/30 flex items-center gap-2"
                    >
                      <Heart className="w-5 h-5" />
                      Subscribe for $3/month
                    </button>
                  ) : (
                    <button
                      className="px-6 py-3 bg-[rgba(16,185,129,0.2)] border-2 border-[#10b981] text-[#10b981] font-['Cardo'] text-lg rounded-lg flex items-center gap-2"
                      disabled
                    >
                      <Check className="w-5 h-5" />
                      Subscribed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Writing Diary */}
              <div>
                <h2 className="font-['Cardo'] text-3xl text-white italic mb-6 flex items-center gap-3">
                  <BookOpen className="w-7 h-7 text-[#60a5fa]" style={{ filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))' }} />
                  Writing Diary
                </h2>
                <div className="space-y-4">
                  {MOCK_DIARY_ENTRIES.map((entry) => (
                    <div key={entry.id} className="glass-card rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/20 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {entry.is_locked ? (
                            <Lock className="w-5 h-5 text-[#8b9dc3]" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-[#60a5fa]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-['Cardo'] text-xl text-white italic">{entry.title}</h3>
                            {entry.is_locked && (
                              <span className="px-2 py-1 bg-[rgba(139,157,195,0.2)] border border-[rgba(139,157,195,0.3)] rounded text-xs text-[#8b9dc3] font-['Inter'] uppercase tracking-wider">
                                Subscribers Only
                              </span>
                            )}
                          </div>
                          <p className={`font-['Libre_Baskerville'] text-sm leading-relaxed mb-3 ${entry.is_locked ? 'text-[#8b9dc3] blur-sm select-none' : 'text-[#c8cad8]'}`}>
                            {entry.excerpt}
                          </p>
                          <p className="font-['Inter'] text-xs text-[#8b9dc3]">
                            {getRelativeTime(entry.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div>
                <h2 className="font-['Cardo'] text-3xl text-white italic mb-6 flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-[#a78bfa]" style={{ filter: 'drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))' }} />
                  Latest from Maya
                </h2>
                <div className="space-y-3">
                  {MOCK_ACTIVITIES.map((activity) => (
                    <div key={activity.id} className="glass-card rounded-lg p-4 hover:bg-[rgba(15,23,41,0.8)] transition-all">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'rgba(96, 165, 250, 0.2)',
                            border: '1px solid rgba(96, 165, 250, 0.3)'
                          }}
                        >
                          <div className="text-[#60a5fa]">
                            {activity.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-['Inter'] text-sm text-[#c8cad8]">{activity.text}</p>
                          <p className="font-['Inter'] text-xs text-[#8b9dc3] mt-1">
                            {getRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tip Jar */}
              <div className="glass-card rounded-xl p-6 sticky top-32">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-[#f59e0b]" style={{ filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))' }} />
                  <h3 className="font-['Cardo'] text-2xl text-white italic">Tip Jar</h3>
                </div>
                <p className="font-['Inter'] text-sm text-[#8b9dc3] mb-6">
                  Support Maya's writing with a one-time tip
                </p>

                {/* Preset Amounts */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    onClick={() => handleTip(1)}
                    className="py-3 rounded-lg border-2 border-[rgba(139,157,195,0.3)] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.1)] text-white font-['Cardo'] text-lg transition-all"
                  >
                    $1
                  </button>
                  <button
                    onClick={() => handleTip(3)}
                    className="py-3 rounded-lg border-2 border-[rgba(139,157,195,0.3)] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.1)] text-white font-['Cardo'] text-lg transition-all"
                  >
                    $3
                  </button>
                  <button
                    onClick={() => handleTip(5)}
                    className="py-3 rounded-lg border-2 border-[rgba(139,157,195,0.3)] hover:border-[#60a5fa] hover:bg-[rgba(96,165,250,0.1)] text-white font-['Cardo'] text-lg transition-all"
                  >
                    $5
                  </button>
                </div>

                {/* Custom Amount */}
                <div className="mb-4">
                  <label className="block font-['Inter'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-2">
                    Custom Amount
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="10.00"
                      value={customTipAmount}
                      onChange={(e) => setCustomTipAmount(e.target.value)}
                      className="flex-1 px-4 py-2 bg-[rgba(15,23,41,0.9)] border border-[rgba(139,157,195,0.3)] rounded-lg text-white placeholder-[#8b9dc3] focus:border-[#60a5fa] focus:outline-none font-['Inter']"
                    />
                    <button
                      onClick={handleCustomTip}
                      disabled={!customTipAmount || parseFloat(customTipAmount) <= 0}
                      className="px-4 py-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white hover:from-[#d97706] hover:to-[#b45309] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Inter'] text-sm font-semibold rounded-lg"
                    >
                      Tip
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(139,157,195,0.2)]">
                  <p className="font-['Inter'] text-xs text-[#8b9dc3] text-center">
                    Tips go directly to the writer
                  </p>
                </div>
              </div>

              {/* Community Stats */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-['Cardo'] text-xl text-white italic mb-4">Community</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-['Inter'] text-sm text-[#8b9dc3]">Perennials</span>
                    <span className="font-['Cardo'] text-xl text-white">{writer.stats.perennials}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Inter'] text-sm text-[#8b9dc3]">Total Pieces</span>
                    <span className="font-['Cardo'] text-xl text-white">{writer.stats.seeds + writer.stats.blooms}</span>
                  </div>
                  <div className="pt-3 border-t border-[rgba(139,157,195,0.2)]">
                    <p className="font-['Inter'] text-xs text-[#8b9dc3] text-center">
                      Join {writer.stats.perennials} subscribers supporting Maya's work
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GardenFooter />

      {/* Subscribe Payment Modal */}
      <PaymentModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        amount={3}
        type="subscription"
        description="Monthly subscription to Maya Chen's exclusive content"
        planName="Perennial Subscription"
        interval="month"
        onSuccess={(result) => {
          console.log('Subscription successful:', result);
          setShowSubscribeModal(false);
          setIsSubscribed(true);
          alert('Successfully subscribed! You now have access to all exclusive content.');
        }}
        onError={(error) => {
          console.error('Subscription failed:', error);
          alert('Subscription failed. Please try again.');
        }}
      />

      {/* Tip Payment Modal */}
      <PaymentModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
        amount={tipAmount}
        type="one-time"
        description={`Tip for ${writer.display_name}`}
        planName="Writer Tip"
        onSuccess={(result) => {
          console.log('Tip successful:', result);
          setShowTipModal(false);
          setCustomTipAmount('');
          alert(`Thank you for tipping $${tipAmount}!`);
        }}
        onError={(error) => {
          console.error('Tip failed:', error);
          alert('Tip failed. Please try again.');
        }}
      />
    </div>
  );
}

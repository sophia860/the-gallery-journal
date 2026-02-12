// ============================================================
// ALL GARDEN CODE - Compiled from src/app/garden/
// ============================================================

// ============================================================
// COMPONENTS
// ============================================================

// --- components/GardenFooter.tsx ---
export function GardenFooter() {
  return (
    <footer className="py-12 px-8 border-t border-[#333]">
      <div className="max-w-7xl mx-auto text-center space-y-2">
        <p className="font-['Courier_New'] text-[10px] uppercase tracking-[0.25em] text-[#e0e0e0]/40">
          The Garden · A place to grow writing
        </p>
        <p className="font-['Courier_New'] text-[10px] uppercase tracking-[0.25em] text-[#e0e0e0]/30">
          Supported by gardeners
        </p>
      </div>
    </footer>
  );
}

// --- components/GardenNav.tsx ---
import { useAuth } from '../../contexts/AuthContext';
import { quietHoursService } from '../utils/quietHours';
import { useState, useEffect } from 'react';

export function GardenNav() {
  const { user, signOut } = useAuth();
  const [isQuietTime, setIsQuietTime] = useState(false);

  useEffect(() => {
    setIsQuietTime(quietHoursService.isQuietTime());
    const interval = setInterval(() => {
      setIsQuietTime(quietHoursService.isQuietTime());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/garden/login';
  };

  return (
    <>
      {isQuietTime && (
        <div className="fixed top-0 left-0 right-0 bg-[rgba(122,155,118,0.2)] backdrop-blur-md border-b border-[rgba(122,155,118,0.3)] text-[#7a9b76] text-center py-2 text-sm z-50 font-['Cormorant_Garamond']">
          🌙 Quiet Hours Active
        </div>
      )}
      <nav 
        className="fixed left-0 right-0 z-40 bg-[rgba(10,14,26,0.85)] backdrop-blur-md border-b border-[rgba(122,155,118,0.15)] py-4"
        style={{ top: isQuietTime ? '40px' : '0' }}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="/garden/dashboard" 
            className="text-[#7a9b76] hover:text-[#8fb587] transition-colors cursor-pointer"
            style={{ 
              fontSize: '1.4rem', 
              letterSpacing: '0.05em',
              fontFamily: "'Special Elite', cursive"
            }}
          >
            🌿 The Garden
          </a>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <a
              href="/garden/dashboard"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              GARDEN
            </a>
            <a
              href="/garden/explore"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              EXPLORE
            </a>
            <a
              href="/garden/prompts"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              PROMPTS
            </a>
            <a
              href="/garden/write"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              WRITE
            </a>
            <a
              href="/garden/circles"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              CIRCLES
            </a>
            <a
              href="/garden/harvest"
              className={`nav-link font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] ${
                isActive('/garden/harvest') ? 'text-[#7a9b76]' : 'text-[#e0e0e0]/80 hover:text-[#e0e0e0]'
              } transition-colors cursor-pointer`}
            >
              Harvest
            </a>
            <a
              href="/garden/kept"
              className={`nav-link font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] ${
                isActive('/garden/kept') ? 'text-[#7a9b76]' : 'text-[#e0e0e0]/80 hover:text-[#e0e0e0]'
              } transition-colors cursor-pointer`}
            >
              Kept
            </a>
            <a
              href="/garden/quiet-hours"
              className={`nav-link font-['Courier_New'] text-[12px] uppercase tracking-[0.15em] ${
                isActive('/garden/quiet-hours') ? 'text-[#7a9b76]' : 'text-[#e0e0e0]/80 hover:text-[#e0e0e0]'
              } transition-colors cursor-pointer`}
            >
              Quiet Hours
            </a>
            
            {user && (
              <>
                <a
                  href="/garden/profile"
                  className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
                >
                  PROFILE
                </a>
                <span className="w-px h-4 bg-[#333]"></span>
                <span className="font-['Courier_New'] text-[11px] text-[#7a9b76]">
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'Writer'}
                </span>
                <button
                  onClick={handleLogout}
                  className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/80 hover:text-[#e0e0e0] transition-colors cursor-pointer"
                >
                  LOGOUT
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

// --- components/KeepButton.tsx ---
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface KeepButtonProps {
  writingId: string;
  title: string;
  author: string;
  authorId: string;
  excerpt: string;
  growthStage: 'seed' | 'sprout' | 'bloom';
  source?: 'gallery' | 'explore' | 'neighbouring';
}

export function KeepButton({ writingId, title, author, authorId, excerpt, growthStage, source = 'explore' }: KeepButtonProps) {
  const { user } = useAuth();
  const [isKept, setIsKept] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const kept = localStorage.getItem(`kept_${user.id}`);
    if (kept) {
      const keptList = JSON.parse(kept);
      setIsKept(keptList.some((k: any) => k.writingId === writingId));
    }
  }, [user, writingId]);

  const handleKeep = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      window.location.href = '/garden/login';
      return;
    }

    const stored = localStorage.getItem(`kept_${user.id}`);
    let kept = stored ? JSON.parse(stored) : [];

    if (isKept) {
      // Remove from kept
      kept = kept.filter((k: any) => k.writingId !== writingId);
      setIsKept(false);
    } else {
      // Add to kept
      kept.push({
        id: Date.now().toString(),
        writingId,
        title,
        author,
        authorId,
        excerpt,
        growthStage,
        savedAt: new Date().toISOString(),
        source,
      });
      setIsKept(true);
    }

    localStorage.setItem(`kept_${user.id}`, JSON.stringify(kept));
  };

  return (
    <button
      onClick={handleKeep}
      className="group flex items-center gap-2 px-3 py-2 rounded border border-[rgba(122,155,118,0.2)] hover:border-[#7a9b76] transition-all cursor-pointer"
      title={isKept ? 'Remove from kept' : 'Keep for me'}
    >
      <svg 
        viewBox="0 0 24 24" 
        className="w-4 h-4" 
        stroke="#7a9b76" 
        strokeWidth="2" 
        fill={isKept ? '#7a9b76' : 'none'}
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#7a9b76]">
        {isKept ? 'Kept' : 'Keep'}
      </span>
    </button>
  );
}

// --- components/ReplantButton.tsx ---
import { useAuth } from '../../contexts/AuthContext';

interface ReplantButtonProps {
  writingId: string;
  title: string;
  author: string;
  authorId: string;
  growthStage: 'seed' | 'sprout' | 'bloom';
}

export function ReplantButton({ writingId, title, author, authorId, growthStage }: ReplantButtonProps) {
  const { user } = useAuth();

  // Only show for blooms
  if (growthStage !== 'bloom') {
    return null;
  }

  const handleReplant = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/garden/login';
      return;
    }

    // Store replant context in localStorage
    const replantContext = {
      fromWritingId: writingId,
      fromTitle: title,
      fromAuthor: author,
      fromAuthorId: authorId,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('replant_context', JSON.stringify(replantContext));
    
    // Navigate to write page
    window.location.href = '/garden/write';
  };

  return (
    <button
      onClick={handleReplant}
      className="group flex items-center gap-2 px-3 py-2 rounded border border-[rgba(139,157,195,0.2)] hover:border-[#8b9dc3] transition-all cursor-pointer"
      title="Plant something new from this"
    >
      <svg 
        viewBox="0 0 24 24" 
        className="w-4 h-4" 
        stroke="#8b9dc3" 
        strokeWidth="2" 
        fill="none"
      >
        <path d="M12 20 L12 8 M8 12 L12 8 L16 12" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="4" r="2" fill="#8b9dc3"/>
        <path d="M6 20 Q12 16, 18 20" strokeLinecap="round"/>
      </svg>
      <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#8b9dc3]">
        Replant
      </span>
    </button>
  );
}

// --- components/WorkTypeBadge.tsx ---
import { WorkType } from '../utils/notes';
import { workTypeColors, workTypeLabels } from '../utils/sampleData';

interface WorkTypeBadgeProps {
  workType: WorkType;
  size?: 'sm' | 'md' | 'lg';
}

export function WorkTypeBadge({ workType, size = 'sm' }: WorkTypeBadgeProps) {
  const colors = workTypeColors[workType];
  const label = workTypeLabels[workType];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1',
    lg: 'text-[12px] px-3 py-1.5',
  };

  return (
    <span
      className={`inline-block font-['Cormorant_Garamond'] uppercase tracking-[0.15em] rounded-sm ${sizeClasses[size]}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {label}
    </span>
  );
}

// ============================================================
// PAGES
// ============================================================

// --- pages/BookmarksPage.tsx ---
import { useState, useEffect } from 'react';
import { GardenNav } from '../../components/GardenNav';

interface Writing {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  growthStage: 'seed' | 'sprout' | 'bloom';
  tags: string[];
}

const allWritings: Writing[] = [
  {
    id: '1',
    title: 'The Architecture of Memory',
    author: 'James K.',
    excerpt: 'Memory is a kind of architecture—rooms we build from moments, hallways that twist back on themselves...',
    growthStage: 'bloom',
    tags: ['memory', 'architecture', 'time'],
  },
  {
    id: '2',
    title: 'Winter Light',
    author: 'Sarah M.',
    excerpt: 'The light through winter trees / falls differently than summer gold / it knows something about endings...',
    growthStage: 'bloom',
    tags: ['winter', 'nature', 'light'],
  },
  {
    id: '3',
    title: 'What We Leave Behind',
    author: 'Alex R.',
    excerpt: 'What is a home but a collection of what we have chosen not to throw away? The coffee mug from...',
    growthStage: 'sprout',
    tags: ['home', 'belonging', 'objects'],
  },
  {
    id: '4',
    title: 'The Last Train',
    author: 'Maria V.',
    excerpt: 'She always took the last train home. Not because she had to, but because something about the empty...',
    growthStage: 'bloom',
    tags: ['urban', 'solitude', 'night'],
  },
  {
    id: '5',
    title: 'On Forgetting',
    author: 'David L.',
    excerpt: 'Sometimes I think forgetting is a skill / like playing piano or parallel parking / something you get better...',
    growthStage: 'sprout',
    tags: ['memory', 'forgetting', 'time'],
  },
  {
    id: '6',
    title: 'Kitchen Table Conversations',
    author: 'Emily T.',
    excerpt: 'My grandmother said the best conversations happen at kitchen tables. Not dining rooms, not living rooms...',
    growthStage: 'bloom',
    tags: ['family', 'conversation', 'domesticity'],
  },
  {
    id: '7',
    title: 'The Blue Hour',
    author: 'Chen W.',
    excerpt: 'There\'s a moment between day and night photographers call the blue hour. Everything takes on this impossible...',
    growthStage: 'seed',
    tags: ['photography', 'twilight', 'beauty'],
  },
  {
    id: '8',
    title: 'Inheritance',
    author: 'Rachel B.',
    excerpt: 'What my mother gave me: / her hands that shake when angry / her inability to throw away jars...',
    growthStage: 'bloom',
    tags: ['family', 'mother', 'inheritance'],
  },
];

export function BookmarksPage() {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [bookmarkedWritings, setBookmarkedWritings] = useState<Writing[]>([]);

  useEffect(() => {
    // Load bookmarks from localStorage
    const stored = localStorage.getItem('gardenBookmarks');
    if (stored) {
      const bookmarkIds = new Set(JSON.parse(stored));
      setBookmarked(bookmarkIds);
      
      // Filter writings to only bookmarked ones
      const filtered = allWritings.filter(w => bookmarkIds.has(w.id));
      setBookmarkedWritings(filtered);
    }
  }, []);

  const removeBookmark = (id: string) => {
    const updated = new Set(bookmarked);
    updated.delete(id);
    setBookmarked(updated);
    localStorage.setItem('gardenBookmarks', JSON.stringify([...updated]));
    
    // Update displayed writings
    const filtered = allWritings.filter(w => updated.has(w.id));
    setBookmarkedWritings(filtered);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'seed': return '#8b9dc3';
      case 'sprout': return '#c4a46c';
      case 'bloom': return '#7a9b76';
      default: return '#8b9dc3';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="stars-layer-1"></div>
        <div className="stars-layer-2"></div>
      </div>

      <style>{`
        .stars-layer-1, .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-repeat: repeat;
        }

        .stars-layer-1 {
          background-image: 
            radial-gradient(1px 1px at 20% 30%, rgba(122, 155, 118, 0.4), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(122, 155, 118, 0.3), transparent);
          background-size: 200% 200%;
        }

        .stars-layer-2 {
          background-image:
            radial-gradient(1px 1px at 40% 40%, rgba(139, 157, 195, 0.3), transparent);
          background-size: 200% 200%;
        }

        .writing-card {
          transition: all 0.3s ease;
        }

        .writing-card:hover {
          transform: translateY(-4px);
          border-color: rgba(122, 155, 118, 0.4);
        }
      `}</style>

      <GardenNav />

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Playfair_Display'] italic text-[48px] text-[#7a9b76] mb-4" style={{ lineHeight: '1.1' }}>
            Bookmarks
          </h1>
          <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3]">
            Your saved writings from the Garden
          </p>
        </div>

        {bookmarkedWritings.length === 0 ? (
          <div className="text-center py-16">
            <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto mb-6" stroke="#8b9dc3" strokeWidth="1.5" fill="none">
              <path d="M16 8 L48 8 L48 56 L32 48 L16 56 Z" strokeLinejoin="round" />
            </svg>
            <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3] mb-6">
              No bookmarks yet
            </p>
            <a
              href="/garden/explore"
              className="inline-block px-8 py-3 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] text-[#7a9b76] transition-all font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded cursor-pointer"
            >
              Explore Writings
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedWritings.map((writing) => (
              <div
                key={writing.id}
                className="writing-card bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded p-6 backdrop-blur-sm"
              >
                {/* Header with remove bookmark */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <a
                      href={`/garden/read/${writing.id}`}
                      className="font-['Cormorant_Garamond'] text-[20px] text-[#f5f0e8] hover:text-[#7a9b76] transition-colors cursor-pointer"
                      style={{ lineHeight: '1.3' }}
                    >
                      {writing.title}
                    </a>
                    <p className="font-['Cormorant_Garamond'] text-[14px] text-[#8b9dc3] mt-1">
                      by {writing.author}
                    </p>
                  </div>

                  {/* Remove bookmark icon */}
                  <button
                    onClick={() => removeBookmark(writing.id)}
                    className="flex-shrink-0 ml-3 cursor-pointer hover:opacity-70 transition-opacity"
                    title="Remove bookmark"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      stroke="#c4a46c"
                      strokeWidth="2"
                      fill="#c4a46c"
                    >
                      <path d="M5 3 L19 3 L19 21 L12 17 L5 21 Z" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Excerpt */}
                <p className="font-['Cormorant_Garamond'] text-[15px] text-[#e8ddd0]/80 mb-4" style={{ lineHeight: '1.6' }}>
                  {writing.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {writing.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[rgba(139,157,195,0.1)] border border-[rgba(139,157,195,0.2)] rounded-full font-['Cormorant_Garamond'] text-[12px] text-[#8b9dc3]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Growth stage badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.15em]"
                    style={{
                      color: getStageColor(writing.growthStage),
                      border: `1px solid ${getStageColor(writing.growthStage)}40`,
                      backgroundColor: `${getStageColor(writing.growthStage)}15`,
                    }}
                  >
                    {writing.growthStage}
                  </span>
                  <a
                    href={`/garden/read/${writing.id}`}
                    className="font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#7a9b76] hover:text-[#8fb587] transition-colors cursor-pointer"
                  >
                    Read →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- pages/CirclesPage.tsx ---
import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { useAuth } from '../../contexts/AuthContext';
import { circlesService, Circle } from '../utils/circles';

export function CirclesPage() {
  const { user: currentUser } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 12
  });

  useEffect(() => {
    if (!currentUser) {
      window.location.href = '/garden/login';
      return;
    }

    loadCircles();
  }, [currentUser]);

  const loadCircles = () => {
    if (!currentUser) return;
    const userCircles = circlesService.getUserCircles(currentUser.id);
    setCircles(userCircles);
  };

  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!formData.name.trim()) {
      alert('Please enter a circle name');
      return;
    }

    circlesService.createCircle(
      formData.name,
      formData.description,
      currentUser.id,
      formData.maxMembers
    );

    setFormData({ name: '', description: '', maxMembers: 12 });
    setShowCreateForm(false);
    loadCircles();
  };

  const handleLeaveCircle = (circleId: string) => {
    if (!currentUser) return;
    
    if (window.confirm('Are you sure you want to leave this circle?')) {
      circlesService.removeMember(circleId, currentUser.id);
      loadCircles();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
                Your Circles
              </h1>
              <p className="font-['Cardo'] text-[#e0e0e0]/60">
                Intimate spaces for shared growth
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-[#7a9b76] hover:bg-[#8fb587] text-white font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
            >
              {showCreateForm ? 'Cancel' : '+ New Circle'}
            </button>
          </div>

          {/* Create Circle Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateCircle} className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
              <h3 className="font-['Cardo'] text-xl text-[#e0e0e0] mb-4">
                Create a New Circle
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                    Circle Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
                    placeholder="e.g., Poetry Workshop"
                  />
                </div>

                <div>
                  <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors resize-none"
                    rows={3}
                    placeholder="What's this circle about?"
                  />
                </div>

                <div>
                  <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                    Max Members
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={formData.maxMembers}
                    onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                    className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 px-6 py-3 bg-[#7a9b76] hover:bg-[#8fb587] text-white font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
              >
                Create Circle
              </button>
            </form>
          )}

          {/* Circles Grid */}
          {circles.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-['Cardo'] text-xl text-[#e0e0e0]/60 mb-4">
                You haven't joined any circles yet
              </p>
              <p className="font-['Cardo'] text-sm text-[#e0e0e0]/40 mb-6">
                Circles are intimate spaces where you can share your writing with a trusted group
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-[#7a9b76] hover:bg-[#8fb587] text-white font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
              >
                Create Your First Circle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {circles.map(circle => (
                <div
                  key={circle.id}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#7a9b76] transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-['Georgia'] text-xl text-[#e0e0e0] mb-2">
                        {circle.name}
                      </h3>
                      <p className="font-['Georgia'] text-sm text-[#e0e0e0]/60 mb-3">
                        {circle.description}
                      </p>
                    </div>
                  </div>

                  {/* Member count */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#e0e0e0]/60 mb-2">
                      <span>👥</span>
                      <span>{circle.members.length} / {circle.maxMembers} members</span>
                    </div>
                    <div className="w-full bg-[#121212] rounded-full h-2">
                      <div
                        className="bg-[#7a9b76] h-2 rounded-full transition-all"
                        style={{ width: `${(circle.members.length / circle.maxMembers) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-[#e0e0e0]/40 mb-4">
                    <span>Created {formatDate(circle.createdAt)}</span>
                    {circle.createdBy === currentUser?.id && (
                      <span className="px-2 py-1 bg-[#7a9b76]/20 border border-[#7a9b76]/40 rounded text-[#7a9b76]">
                        Creator
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLeaveCircle(circle.id)}
                      className="flex-1 px-4 py-2 bg-transparent border border-[#333] hover:border-red-400 hover:text-red-400 text-[#e0e0e0] font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] rounded transition-colors cursor-pointer"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info section */}
          <div className="mt-12 p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-3">
              About Circles
            </h3>
            <p className="font-['Georgia'] text-sm text-[#e0e0e0]/70 leading-relaxed mb-3">
              Circles are intimate spaces (max 12 members) where you can share your writing 
              with a trusted group. Choose who sees your work and what kind of responses you'd like.
            </p>
            <p className="font-['Georgia'] text-sm text-[#e0e0e0]/70 leading-relaxed">
              Create circles for workshops, critique groups, or close friends who understand 
              your creative process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- pages/DashboardPage.tsx ---
import { useState, useEffect, useCallback } from 'react';
import { GardenMainNav } from '../../components/GardenMainNav';
import { NightSkyBackground } from '../../components/NightSkyBackground';
import { JoinTheGardenGate } from '../../components/JoinTheGardenGate';
import { WorkTypeBadge } from '../components/WorkTypeBadge';
import { useAuth } from '../../contexts/AuthContext';
import { notesService, GardenNote, NoteState, WorkType } from '../utils/notes';
import { calculateGardenSeason, calculateNoteWarmth, GardenSortOption, sortNotesByGardenLogic } from '../utils/gardenTime';

export function DashboardPage() {
  const { user, loading: authLoading, supabase } = useAuth();
  const [notes, setNotes] = useState<GardenNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<GardenNote[]>([]);
  const [stateFilter, setStateFilter] = useState<'all' | NoteState>('all');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<GardenSortOption>('connection-density');
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [profile, setProfile] = useState<any>(null);

  // Calculate garden season based on activity patterns
  const gardenSeason = calculateGardenSeason(notes.map(n => ({
    id: n.id,
    updatedAt: n.updatedAt,
    state: n.state,
    tendedBy: n.tendedBy || []
  })));
  
  // LOADING STATE: Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] relative flex items-center justify-center">
        <NightSkyBackground />
        <div className="relative z-10 text-center">
          <div 
            className="inline-block mb-6"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(122, 155, 118, 0.3))'
            }}
          >
            <span className="text-6xl animate-pulse">🌱</span>
          </div>
          <p className="font-['Playfair_Display'] italic text-2xl text-white/70">
            Loading your garden...
          </p>
        </div>
      </div>
    );
  }
  
  // AUTH GATE: Show join gate if not logged in (after loading check)
  if (!user) {
    return <JoinTheGardenGate />;
  }

  // Load user profile and writings from Supabase
  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        try {
          // Load profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }

          // Load writings
          const { data: writings } = await supabase
            .from('writings')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

          if (writings) {
            // Convert Supabase writings to GardenNote format
            const gardenNotes: GardenNote[] = writings.map(w => ({
              id: w.id,
              userId: w.user_id,
              title: w.title,
              content: w.content,
              state: w.growth_stage as NoteState,
              tags: w.tags || [],
              createdAt: w.created_at,
              updatedAt: w.updated_at,
              revisitCount: w.revisit_count || 0,
              revisitDate: w.revisit_date || null,
              growsFrom: w.grows_from || [],
              growsInto: w.grows_into || [],
              wordCount: w.word_count || 0,
              isPublic: w.is_public || false,
              sharedWithCircles: w.shared_with_circles || [],
              responseLevel: w.response_level || 'silent',
              versions: w.versions || [],
              workType: (w.work_type as WorkType) || 'prose',
              tendedBy: [],
              graftedTo: [],
              transplantHistory: [],
              visibility: w.visibility || 'private'
            }));
            setNotes(gardenNotes);

            // Extract unique tags
            const uniqueTags = [...new Set(gardenNotes.flatMap(n => n.tags))];
            setAllTags(uniqueTags);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          // Fall back to localStorage if Supabase fails
          const userNotes = notesService.getNotes(user.id);
          setNotes(userNotes);
          const tags = notesService.getUserTags(user.id);
          setAllTags(tags);
        }
      };

      loadUserData();
    }
  }, [user, supabase]);

  // Filter and sort notes whenever dependencies change
  useEffect(() => {
    if (!user) return;

    let filtered = [...notes];

    // Filter by state
    if (stateFilter !== 'all') {
      filtered = filtered.filter(note => note.state === stateFilter);
    }

    // Filter by tag
    if (tagFilter) {
      filtered = filtered.filter(note => note.tags.includes(tagFilter));
    }

    // Search
    if (searchQuery) {
      filtered = notesService.searchNotes(user.id, searchQuery);
      if (stateFilter !== 'all') {
        filtered = filtered.filter(note => note.state === stateFilter);
      }
      if (tagFilter) {
        filtered = filtered.filter(note => note.tags.includes(tagFilter));
      }
    }

    // Sort
    filtered = sortNotesByGardenLogic(filtered, sortBy);

    setFilteredNotes(filtered);
  }, [notes, stateFilter, tagFilter, searchQuery, sortBy, user?.id]);

  const handleDeleteNote = useCallback((noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      notesService.deleteNote(noteId);
      if (user) {
        const userNotes = notesService.getNotes(user.id);
        setNotes(userNotes);
        const tags = notesService.getUserTags(user.id);
        setAllTags(tags);
      }
    }
  }, [user]);

  const getStateIcon = (state: NoteState) => {
    switch (state) {
      case 'seed': return '🌰';
      case 'sprout': return '🌱';
      case 'bloom': return '🌸';
    }
  };

  const getStateLabel = (state: NoteState) => {
    switch (state) {
      case 'seed': return 'Seed';
      case 'sprout': return 'Sprout';
      case 'bloom': return 'Bloom';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 100);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      <NightSkyBackground />
      <GardenMainNav />
      
      <style>{`
        /* Sparkle dot animations */
        .sparkle-dot {
          opacity: 0;
          animation: sparkle-twinkle 2s ease-in-out infinite;
        }
        
        @keyframes sparkle-twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .neighbor-garden-card:hover .sparkle-dot {
          animation: sparkle-twinkle 2s ease-in-out infinite;
        }
        
        /* Vignette depth effect */
        .vignette-effect {
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 40%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0.5) 100%
          );
        }
        
        /* Swaying plant animation */
        .swaying-plant {
          animation: plant-sway 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        @keyframes plant-sway {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }
      `}</style>
      
      <div className="relative z-10 pt-24 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h1 
                  className="font-['Playfair_Display'] italic text-5xl text-white/95"
                  style={{ textShadow: '0 0 40px rgba(122, 155, 118, 0.4)' }}
                >
                  Your Garden
                </h1>
                {/* Seasonal indicator - based on activity patterns, not calendar */}
                <div 
                  className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-xl"
                  style={{
                    background: 'rgba(122, 155, 118, 0.1)',
                    border: '1px solid rgba(122, 155, 118, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(122, 155, 118, 0.05)'
                  }}
                >
                  <span className="text-xl" style={{ filter: 'drop-shadow(0 0 6px rgba(122, 155, 118, 0.8))' }}>{gardenSeason.icon}</span>
                  <span className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.2em] text-[#7a9b76]">
                    {gardenSeason.description}
                  </span>
                </div>
              </div>
              <p className="font-['Cormorant_Garamond'] text-lg text-white/50">
                A place to grow writing
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/garden/write'}
              className="group px-8 py-4 rounded-lg backdrop-blur-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
              style={{
                background: 'rgba(122, 155, 118, 0.15)',
                border: '1px solid rgba(122, 155, 118, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(122, 155, 118, 0.1)'
              }}
            >
              <span className="relative z-10 font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.25em] text-white flex items-center gap-2">
                <span className="text-lg">✦</span>
                New Note
              </span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at center, rgba(122, 155, 118, 0.2) 0%, transparent 70%)'
                }}
              />
            </button>
          </div>

          {/* NEIGHBOURING GARDENS - shows 2-3 recent blooms from nearby gardens */}
          <div className="mb-12 pb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 
                  className="font-['Playfair_Display'] italic text-3xl text-white/90 mb-2"
                  style={{ textShadow: '0 0 30px rgba(138, 157, 195, 0.3)' }}
                >
                  Neighbouring Gardens
                </h2>
                <p className="font-['Cormorant_Garamond'] text-base text-white/40">
                  Recent blooms from gardens near yours
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/garden/neighbours'}
                className="font-['Cormorant_Garamond'] text-[12px] uppercase tracking-[0.2em] text-[#8b9dc3]/80 hover:text-[#8b9dc3] transition-colors"
              >
                View All →
              </button>
            </div>
            
            {/* Neighbouring blooms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { gardenName: 'River\'s Garden', title: 'On Silence', snippet: 'The spaces between words carry more weight than...' },
                { gardenName: 'Moon\'s Garden', title: 'Fragments', snippet: 'I collect the edges of conversations, the moments when...' },
                { gardenName: 'Oak\'s Garden', title: 'Winter Light', snippet: 'In December, the sun arrives at an angle that makes...' }
              ].map((bloom, i) => (
                <div
                  key={i}
                  className="group relative rounded-xl p-6 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden neighbor-garden-card"
                  style={{
                    background: 'rgba(138, 157, 195, 0.08)',
                    border: '1px solid rgba(138, 157, 195, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                  onClick={() => {/* Navigate to bloom */}}
                >
                  {/* Sparkle dots - appear on hover */}
                  <div className="absolute top-3 right-3 w-1 h-1 rounded-full sparkle-dot" style={{ background: '#60a5fa', boxShadow: '0 0 8px rgba(96, 165, 250, 0.8)' }}></div>
                  <div className="absolute top-5 right-8 w-1.5 h-1.5 rounded-full sparkle-dot" style={{ background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)', animationDelay: '0.3s' }}></div>
                  <div className="absolute bottom-6 left-4 w-1 h-1 rounded-full sparkle-dot" style={{ background: '#ec4899', boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)', animationDelay: '0.6s' }}></div>
                  
                  {/* Swaying plant icon */}
                  <div className="absolute bottom-3 right-3 opacity-40 group-hover:opacity-70 transition-opacity">
                    <svg className="w-5 h-5 text-[#10b981] swaying-plant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22V8M12 8C12 8 14 6 14 4C14 2 12 2 12 2C12 2 10 2 10 4C10 6 12 8 12 8ZM12 14C12 14 14 12 16 12C18 12 18 14 18 14C18 14 18 16 16 16C14 16 12 14 12 14ZM12 14C12 14 10 12 8 12C6 12 6 14 6 14C6 14 6 16 8 16C10 16 12 14 12 14Z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  {/* Vignette depth effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none vignette-effect"></div>
                  
                  <div className="relative z-10">
                    <p className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.25em] text-[#8b9dc3]/70 mb-3">
                      {bloom.gardenName}
                    </p>
                    <h3 className="font-['Playfair_Display'] italic text-xl text-white/90 mb-3">
                      {bloom.title}
                    </h3>
                    <p className="font-['Cormorant_Garamond'] text-base text-white/50 leading-relaxed line-clamp-2">
                      {bloom.snippet}
                    </p>
                  </div>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(138, 157, 195, 0.15) 0%, transparent 70%)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
              placeholder="Search notes..."
            />

            {/* Filters row */}
            <div className="flex flex-wrap gap-4">
              {/* State filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setStateFilter('all')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    stateFilter === 'all'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStateFilter('seed')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    stateFilter === 'seed'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  🌰 Seeds
                </button>
                <button
                  onClick={() => setStateFilter('sprout')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    stateFilter === 'sprout'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  🌱 Sprouts
                </button>
                <button
                  onClick={() => setStateFilter('bloom')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    stateFilter === 'bloom'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  🌸 Blooms
                </button>
              </div>

              {/* Tag filter */}
              {allTags.length > 0 && (
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-2 text-[#e0e0e0] text-sm focus:border-[#7a9b76] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">All tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              )}

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as GardenSortOption)}
                className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-2 text-[#e0e0e0] text-sm focus:border-[#7a9b76] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="connection-density">Most Connected</option>
                <option value="recently-tended">Recently Tended</option>
                <option value="deepest-roots">Deepest Roots</option>
                <option value="discovery">Discovery</option>
              </select>

              {/* View mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('graph')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    viewMode === 'graph'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  Graph
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Notes Display */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-20">
              <div 
                className="inline-block mb-6"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(122, 155, 118, 0.3))'
                }}
              >
                <span className="text-6xl">🌱</span>
              </div>
              <p className="font-['Playfair_Display'] italic text-2xl text-white/70 mb-6">
                {searchQuery || stateFilter !== 'all' || tagFilter
                  ? 'No notes match your filters'
                  : 'Your garden awaits'}
              </p>
              {!searchQuery && stateFilter === 'all' && !tagFilter && (
                <button
                  onClick={() => window.location.href = '/garden/write'}
                  className="group px-8 py-4 rounded-lg backdrop-blur-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                  style={{
                    background: 'rgba(122, 155, 118, 0.15)',
                    border: '1px solid rgba(122, 155, 118, 0.4)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(122, 155, 118, 0.1)'
                  }}
                >
                  <span className="relative z-10 font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.25em] text-white">
                    Plant Your First Seed
                  </span>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(122, 155, 118, 0.25) 0%, transparent 70%)'
                    }}
                  />
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'graph' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredNotes.map(note => {
                // Get connected notes for display
                const growsFromNotes = (note.growsFrom || [])
                  .map(id => notes.find(n => n.id === id))
                  .filter(Boolean);
                const growsIntoNotes = (note.growsInto || [])
                  .map(id => notes.find(n => n.id === id))
                  .filter(Boolean);

                return (
                  <div
                    key={note.id}
                    className="group relative rounded-xl p-6 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    style={{
                      background: 'rgba(26, 30, 42, 0.6)',
                      border: '1px solid rgba(122, 155, 118, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
                    }}
                    onClick={() => window.location.href = `/garden/write?id=${note.id}`}
                  >
                    {/* Hover glow effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(122, 155, 118, 0.15) 0%, transparent 70%)'
                      }}
                    />
                    
                    <div className="relative z-10">
                      {/* State badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span 
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl text-sm"
                          style={{
                            background: 'rgba(122, 155, 118, 0.2)',
                            border: '1px solid rgba(122, 155, 118, 0.4)',
                            color: '#7a9b76',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(122, 155, 118, 0.1)'
                          }}
                        >
                          <span style={{ filter: 'drop-shadow(0 0 4px rgba(122, 155, 118, 0.8))' }}>
                            {getStateIcon(note.state)}
                          </span>
                          <span className="font-['Cormorant_Garamond'] uppercase tracking-wider text-xs">
                            {getStateLabel(note.state)}
                          </span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="text-white/30 hover:text-red-400 transition-all duration-300 hover:scale-110"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Title */}
                      <h3 
                        className="font-['Playfair_Display'] italic text-xl text-white/95 mb-3 line-clamp-2 group-hover:text-white transition-colors"
                        style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}
                      >
                        {note.title}
                      </h3>

                      {/* Content preview */}
                      <p className="font-['Cormorant_Garamond'] text-base text-white/60 mb-4 line-clamp-3 leading-relaxed">
                        {stripHtml(note.content) || 'No content yet...'}
                      </p>

                      {/* Connections */}
                      {(growsFromNotes.length > 0 || growsIntoNotes.length > 0) && (
                        <div className="mb-4 pb-4 border-b border-white/5">
                          {growsFromNotes.length > 0 && (
                            <div className="mb-2">
                              <p className="font-['Cormorant_Garamond'] text-xs text-[#7a9b76]/70 mb-1.5 uppercase tracking-wider">
                                Grows from:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {growsFromNotes.map(fromNote => (
                                  <span
                                    key={fromNote?.id}
                                    className="text-xs text-[#7a9b76] hover:text-[#8fb587] hover:underline transition-colors px-2 py-1 rounded"
                                    style={{
                                      background: 'rgba(122, 155, 118, 0.1)',
                                      border: '1px solid rgba(122, 155, 118, 0.2)'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/garden/write?id=${fromNote?.id}`;
                                    }}
                                  >
                                    {fromNote?.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {growsIntoNotes.length > 0 && (
                            <div>
                              <p className="font-['Cormorant_Garamond'] text-xs text-[#7a9b76]/70 mb-1.5 uppercase tracking-wider">
                                Grows into:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {growsIntoNotes.map(intoNote => (
                                  <span
                                    key={intoNote?.id}
                                    className="text-xs text-[#7a9b76] hover:text-[#8fb587] hover:underline transition-colors px-2 py-1 rounded"
                                    style={{
                                      background: 'rgba(122, 155, 118, 0.1)',
                                      border: '1px solid rgba(122, 155, 118, 0.2)'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/garden/write?id=${intoNote?.id}`;
                                    }}
                                  >
                                    {intoNote?.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {note.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full text-xs font-['Cormorant_Garamond'] backdrop-blur-sm"
                              style={{
                                background: 'rgba(138, 157, 195, 0.15)',
                                border: '1px solid rgba(138, 157, 195, 0.3)',
                                color: '#8b9dc3'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="px-3 py-1 text-white/40 text-xs font-['Cormorant_Garamond']">
                              +{note.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer info */}
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <div className="flex items-center gap-3">
                          {note.workType && <WorkTypeBadge workType={note.workType} />}
                          <span className="font-['Cormorant_Garamond']">{note.wordCount} words</span>
                        </div>
                        {note.growsFrom && note.growsFrom.length === 0 && note.growsInto && note.growsInto.length === 0 && (
                          <span className="font-['Cormorant_Garamond'] italic">Unplanted</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- pages/ExplorePage.tsx ---
import { GardenNav } from '../components/GardenNav';
import { GardenFooter } from '../components/GardenFooter';
import { ParallaxStarfield } from '../../components/ParallaxStarfield';

export function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#0d1525] text-[#f5f0e8] relative">
      <ParallaxStarfield />
      <GardenNav />
      
      <div className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-['Cardo'] text-6xl text-[#f5f0e8] italic mb-6">
            Explore
          </h1>
          <p className="font-['Cormorant_Garamond'] text-xl text-[#8b9dc3] mb-12">
            Discover writing from the Garden community.
          </p>
          
          <div className="p-12 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
            <p className="font-['Cormorant_Garamond'] text-lg text-[#8b9dc3] text-center">
              Explore features coming soon...
            </p>
          </div>
        </div>
      </div>
      
      <GardenFooter />
    </div>
  );
}

// --- pages/HarvestPage.tsx ---
import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { useAuth } from '../../contexts/AuthContext';
import { harvestService, HarvestAnalytics } from '../utils/harvest';

export function HarvestPage() {
  const { user: currentUser } = useAuth();
  const [analytics, setAnalytics] = useState<HarvestAnalytics | null>(null);

  useEffect(() => {
    if (!currentUser) {
      window.location.href = '/garden/login';
      return;
    }

    loadAnalytics();
  }, [currentUser]);

  const loadAnalytics = () => {
    if (!currentUser) return;
    const data = harvestService.getAnalytics(currentUser.id);
    setAnalytics(data);
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <GardenNav />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-[#e0e0e0]/60">Loading...</p>
        </div>
      </div>
    );
  }

  const maxMonthlyCount = Math.max(...analytics.monthlyActivity.map(m => m.count), 1);

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
              Your Harvest
            </h1>
            <p className="font-['Cardo'] text-[#e0e0e0]/60">
              Replant Requests are publication offers. When an editor wants to publish your work in the Gallery, you'll see it here.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Notes */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📝</span>
                <div>
                  <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Total Notes
                  </p>
                  <p className="font-['Cardo'] text-3xl text-[#e0e0e0]">
                    {analytics.totalNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Words */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">✍️</span>
                <div>
                  <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Total Words
                  </p>
                  <p className="font-['Cardo'] text-3xl text-[#e0e0e0]">
                    {analytics.totalWordCount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Writing Streak */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔥</span>
                <div>
                  <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Writing Streak
                  </p>
                  <p className="font-['Cardo'] text-3xl text-[#e0e0e0]">
                    {analytics.writingStreak} {analytics.writingStreak === 1 ? 'day' : 'days'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes by State */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-6">
              Notes by State
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌰</span>
                  <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Seeds
                  </span>
                </div>
                <p className="font-['Cardo'] text-2xl text-[#e0e0e0]">
                  {analytics.notesByState.seed}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌱</span>
                  <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Sprouts
                  </span>
                </div>
                <p className="font-['Cardo'] text-2xl text-[#e0e0e0]">
                  {analytics.notesByState.sprout}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌸</span>
                  <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60">
                    Blooms
                  </span>
                </div>
                <p className="font-['Cardo'] text-2xl text-[#e0e0e0]">
                  {analytics.notesByState.bloom}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Activity Chart */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-6">
              Monthly Activity
            </h3>
            <div className="flex items-end gap-2 h-48">
              {analytics.monthlyActivity.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-[#7a9b76] rounded-t transition-all hover:bg-[#8fb587]"
                      style={{ height: `${(month.count / maxMonthlyCount) * 100}%` }}
                      title={`${month.month}: ${month.count} notes`}
                    />
                  </div>
                  <span className="font-['Courier_New'] text-[9px] text-[#e0e0e0]/40 text-center">
                    {month.month.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Most Used Tags */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-4">
                Most Used Tags
              </h3>
              {analytics.mostUsedTags.length === 0 ? (
                <p className="text-[#e0e0e0]/40 text-sm">No tags yet</p>
              ) : (
                <div className="space-y-3">
                  {analytics.mostUsedTags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="font-['Courier_New'] text-xs text-[#e0e0e0]/40 w-6">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#e0e0e0] text-sm">{tag.tag}</span>
                          <span className="text-[#e0e0e0]/60 text-xs">{tag.count}</span>
                        </div>
                        <div className="w-full bg-[#121212] rounded-full h-1.5">
                          <div
                            className="bg-[#7a9b76] h-1.5 rounded-full transition-all"
                            style={{ width: `${(tag.count / analytics.mostUsedTags[0].count) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recurring Themes */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-4">
                Themes You Return To
              </h3>
              {analytics.recurringThemes.length === 0 ? (
                <p className="text-[#e0e0e0]/40 text-sm">Not enough data yet</p>
              ) : (
                <div className="space-y-4">
                  {analytics.recurringThemes.map((theme, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-[#e0e0e0] text-sm mb-1">{theme.tag}</p>
                        <p className="text-[#e0e0e0]/60 text-xs">
                          Appears in {theme.frequency}% of your notes
                        </p>
                      </div>
                      <div className="text-2xl">
                        {theme.frequency >= 50 ? '🌟' : theme.frequency >= 30 ? '✨' : '💫'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Most Revisited Notes */}
          {analytics.mostRevisitedNotes.length > 0 && (
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mt-8">
              <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-4">
                Most Revisited Notes
              </h3>
              <div className="space-y-3">
                {analytics.mostRevisitedNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between p-3 bg-[#121212] rounded hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/garden/write?id=${note.id}`}
                  >
                    <div className="flex-1">
                      <p className="text-[#e0e0e0] text-sm mb-1">{note.title}</p>
                      <p className="text-[#e0e0e0]/40 text-xs">
                        {note.wordCount} words
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[#7a9b76]">
                      <span className="text-sm">🔁</span>
                      <span className="text-sm">{note.revisitCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- pages/KeptPage.tsx ---
import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { GardenFooter } from '../components/GardenFooter';
import { useAuth } from '../../contexts/AuthContext';

interface KeptPiece {
  id: string;
  writingId: string;
  title: string;
  author: string;
  authorId: string;
  excerpt: string;
  growthStage: 'seed' | 'sprout' | 'bloom';
  savedAt: string;
  source: 'gallery' | 'explore' | 'neighbouring';
}

export function KeptPage() {
  const { user, supabase } = useAuth();
  const [kept, setKept] = useState<KeptPiece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      window.location.href = '/garden/login';
      return;
    }
    
    loadKept();
  }, [user]);

  const loadKept = async () => {
    if (!user) return;
    
    try {
      // Load from localStorage for now (can be moved to Supabase later)
      const stored = localStorage.getItem(`kept_${user.id}`);
      if (stored) {
        setKept(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading kept pieces:', error);
    }
    
    setLoading(false);
  };

  const removeKept = (id: string) => {
    if (!user) return;
    
    const updated = kept.filter(k => k.id !== id);
    setKept(updated);
    localStorage.setItem(`kept_${user.id}`, JSON.stringify(updated));
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'seed': return '🌰';
      case 'sprout': return '🌱';
      case 'bloom': return '🌸';
      default: return '🌱';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <GardenNav />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-[#e0e0e0]/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />

      <div className="pt-24 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
              Kept
            </h1>
            <p className="font-['Cardo'] text-[#e0e0e0]/60">
              Things you wanted to remember.
            </p>
          </div>

          {/* Kept Grid */}
          {kept.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-['Cardo'] text-xl text-[#e0e0e0]/60 mb-4">
                Nothing kept yet
              </p>
              <p className="font-['Cardo'] text-sm text-[#e0e0e0]/40">
                When you find writing that resonates, keep it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kept.map((piece) => (
                <div
                  key={piece.id}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#7a9b76] transition-colors"
                >
                  {/* Author & Stage */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-['Courier_New'] text-[10px] uppercase tracking-[0.15em] text-[#7a9b76]/70">
                      {piece.author}
                    </p>
                    <span className="text-lg">
                      {getStateIcon(piece.growthStage)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-['Georgia'] text-xl text-[#e0e0e0] mb-2 line-clamp-2">
                    {piece.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-['Georgia'] text-sm text-[#e0e0e0]/60 mb-4 line-clamp-3">
                    {piece.excerpt}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#333]">
                    <button
                      onClick={() => window.location.href = `/garden/read/${piece.writingId}`}
                      className="flex-1 text-sm text-[#7a9b76] hover:text-[#8fb587] transition-colors cursor-pointer"
                    >
                      Read →
                    </button>
                    <button
                      onClick={() => removeKept(piece.id)}
                      className="text-sm text-[#e0e0e0]/40 hover:text-[#e0e0e0] transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <GardenFooter />
    </div>
  );
}

// --- pages/LoginPage.tsx ---
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const { signIn, supabase } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('[LoginPage] Attempting email/password sign in...');
      await signIn(formData.email, formData.password);
      console.log('[LoginPage] Sign in successful, redirecting...');
      
      window.location.href = '/garden/dashboard';
    } catch (error: any) {
      console.error('[LoginPage] Sign in error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('[LoginPage] Google sign-in button clicked');
    setError('');
    setLoading(true);

    try {
      console.log('[LoginPage] Initiating Google OAuth...');
      
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectUrl = `${origin}/garden/dashboard`;
      
      console.log('[LoginPage] OAuth redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('[LoginPage] Google OAuth error:', error);
        
        if (error.message.includes('not enabled') || error.message.includes('Provider')) {
          setError('Google sign-in is not configured yet. Please contact support or use email/password login.');
        } else if (error.message.includes('popup')) {
          setError('Pop-up was blocked. Please allow pop-ups for this site and try again.');
        } else {
          setError(`Google sign-in failed: ${error.message}`);
        }
        setLoading(false);
        return;
      }

      // Check if OAuth is configured (data.url will be null if not configured)
      if (!data || !data.url) {
        console.error('[LoginPage] Google OAuth not configured - no redirect URL provided');
        setError('Google sign-in is not available yet. Please use email and password to sign in.');
        setLoading(false);
        return;
      }

      console.log('[LoginPage] OAuth initiated successfully, redirecting to Google...');
      // Manually redirect to ensure it works in all environments
      window.location.href = data.url;
    } catch (error: any) {
      console.error('[LoginPage] Unexpected error during Google sign-in:', error);
      setError(error.message || 'An unexpected error occurred during Google sign-in.');
      setLoading(false);
    }
  };

  // Generate stars with random positions and animation delays
  const stars = Array.from({ length: 90 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() > 0.7 ? (Math.random() * 2 + 2) : (Math.random() * 2 + 1),
    opacity: Math.random() * 0.7 + 0.3,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 6
  }));

  // Generate bright stars with glow
  const brightStars = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 4,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 4
  }));

  // Generate shooting stars
  const shootingStars = Array.from({ length: 2 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 50 + 10}%`,
    top: `${Math.random() * 50 + 10}%`,
    delay: i * 15 + 8
  }));

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Animated Starry Sky Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#050d1a] via-[#0a1628] to-[#0d1a2b]" style={{ zIndex: 0 }}>
        {/* Regular twinkling stars */}
        {stars.map(star => (
          <div
            key={`star-${star.id}`}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.size > 2 ? '#fffef0' : '#ffffff',
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              boxShadow: star.size > 2 ? '0 0 2px rgba(255, 254, 240, 0.8)' : 'none'
            }}
          />
        ))}

        {/* Bright stars with glow */}
        {brightStars.map(star => (
          <div
            key={`bright-${star.id}`}
            className="absolute rounded-full animate-pulse-glow"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#fffef0',
              boxShadow: '0 0 8px rgba(255, 254, 240, 0.9), 0 0 16px rgba(255, 254, 240, 0.6), 0 0 24px rgba(255, 254, 240, 0.3)',
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map(star => (
          <div
            key={`shooting-${star.id}`}
            className="absolute animate-shooting-star"
            style={{
              left: star.left,
              top: star.top,
              width: '100px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
              transform: 'rotate(-45deg)',
              animationDelay: `${star.delay}s`
            }}
          />
        ))}

        {/* Aurora glow at horizon */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-64 opacity-30"
          style={{
            background: 'linear-gradient(to top, rgba(42, 157, 143, 0.15), rgba(38, 70, 83, 0.08), transparent)'
          }}
        />

        {/* Subtle parallax drift overlay */}
        <div 
          className="absolute inset-0 animate-slow-drift"
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(42, 157, 143, 0.03), transparent 50%)'
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glassmorphism Card */}
        <div 
          className="backdrop-blur-xl rounded-2xl border p-8 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Glowing Icon */}
          <div className="flex justify-center mb-6">
            <div 
              className="text-5xl animate-pulse-soft"
              style={{
                filter: 'drop-shadow(0 0 12px rgba(124, 154, 110, 0.7)) drop-shadow(0 0 24px rgba(124, 154, 110, 0.4))'
              }}
            >
              🌱
            </div>
          </div>

          {/* Title */}
          <h1 
            className="font-['Cardo'] text-4xl text-center mb-2"
            style={{ color: '#f5f0e8' }}
          >
            Welcome back
          </h1>

          {/* Subtitle */}
          <p 
            className="font-['Cardo'] text-center italic mb-8 text-lg"
            style={{ color: 'rgba(245, 240, 232, 0.6)' }}
          >
            Your words are waiting under the stars
          </p>

          {/* Error Message */}
          {error && (
            <div 
              className="mb-6 p-4 rounded-xl border"
              style={{
                background: 'rgba(251, 146, 60, 0.15)',
                borderColor: 'rgba(251, 146, 60, 0.4)',
                color: '#fbbf24'
              }}
            >
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-6 px-6 py-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: '#f5f0e8'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </g>
            </svg>
            <span className="font-['Inter'] font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 font-['Inter'] text-xs uppercase tracking-wider" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(245, 240, 232, 0.4)' }}>
                or
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label 
                htmlFor="email"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="your@email.com"
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c9a6e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 154, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="••••••••"
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c9a6e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 154, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 cursor-pointer"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    background: rememberMe ? '#7c9a6e' : 'transparent'
                  }}
                />
                <span className="font-['Inter']" style={{ color: 'rgba(245, 240, 232, 0.6)' }}>
                  Remember me
                </span>
              </label>
              <a 
                href="/forgot-password"
                className="font-['Inter'] transition-colors"
                style={{ color: 'rgba(245, 240, 232, 0.6)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#7c9a6e'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245, 240, 232, 0.6)'}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-xl font-['Inter'] font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #5a7a4a 0%, #7c9a6e 100%)',
                boxShadow: '0 4px 16px rgba(90, 122, 74, 0.4)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(90, 122, 74, 0.6)';
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(90, 122, 74, 0.4)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center font-['Inter'] text-sm" style={{ color: 'rgba(245, 240, 232, 0.6)' }}>
            New here?{' '}
            <a 
              href="/garden/signup"
              className="font-semibold transition-colors"
              style={{ 
                color: '#7c9a6e',
                textShadow: '0 0 8px rgba(124, 154, 110, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8fb587';
                e.currentTarget.style.textShadow = '0 0 12px rgba(124, 154, 110, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#7c9a6e';
                e.currentTarget.style.textShadow = '0 0 8px rgba(124, 154, 110, 0.4)';
              }}
            >
              Plant your first seed
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes shooting-star {
          0% { transform: translateX(-100px) translateY(-100px) rotate(-45deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(300px) translateY(300px) rotate(-45deg); opacity: 0; }
        }
        
        @keyframes slow-drift {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        .animate-twinkle {
          animation: twinkle infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow infinite;
        }
        
        .animate-shooting-star {
          animation: shooting-star 3s ease-out infinite;
        }
        
        .animate-slow-drift {
          animation: slow-drift 20s ease-in-out infinite;
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

// --- pages/NotificationsPage.tsx ---
import { useEffect, useState } from 'react';
import { GardenNav } from '../../components/GardenNav';

interface Notification {
  id: string;
  type: 'replant_request' | 'circle_invitation' | 'feedback' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  actionUrl?: string;
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage
    const stored = localStorage.getItem('gardenNotifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      // Initialize with demo notifications
      const demoNotifications: Notification[] = [
        {
          id: '1',
          type: 'replant_request',
          title: 'Publication Offer from The Gallery',
          message: 'Editor Bea Sophia wants to publish "Memory is a kind of architecture" in The Gallery. This is a Replant Request—your piece would move from your Garden to the public Gallery. View the request to accept or decline.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionRequired: true,
          actionUrl: '/garden/harvest',
        },
        {
          id: '2',
          type: 'circle_invitation',
          title: 'Circle Invitation',
          message: 'Sarah M. invited you to join "Poetry Workshop Circle"',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionRequired: true,
        },
        {
          id: '3',
          type: 'feedback',
          title: 'New Petal on your writing',
          message: 'Alex R. left a petal on "The light through winter trees"',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: '4',
          type: 'system',
          title: 'Welcome to The Garden',
          message: 'Start planting your first piece. Remember: there are no rejections here, only growth.',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
      ];
      setNotifications(demoNotifications);
      localStorage.setItem('gardenNotifications', JSON.stringify(demoNotifications));
    }
  }, []);

  const saveNotifications = (updated: Notification[]) => {
    setNotifications(updated);
    localStorage.setItem('gardenNotifications', JSON.stringify(updated));
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const handleAccept = (id: string) => {
    alert('Request accepted! (This would trigger actual logic in production)');
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const handleDecline = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'replant_request':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="#7a9b76" strokeWidth="2" fill="none">
            <path d="M12 20 L12 8 M8 12 L12 8 L16 12" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="4" r="2" fill="#7a9b76"/>
          </svg>
        );
      case 'circle_invitation':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="#8b9dc3" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="8"/>
            <circle cx="9" cy="12" r="1.5" fill="#8b9dc3"/>
            <circle cx="15" cy="12" r="1.5" fill="#8b9dc3"/>
          </svg>
        );
      case 'feedback':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="#c4a46c" strokeWidth="2" fill="none">
            <path d="M12 4 L14 10 L20 10 L15 14 L17 20 L12 16 L7 20 L9 14 L4 10 L10 10 Z" strokeLinejoin="round"/>
          </svg>
        );
      case 'system':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="#8b9dc3" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <circle cx="12" cy="16" r="0.5" fill="#8b9dc3"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="stars-layer-1"></div>
        <div className="stars-layer-2"></div>
      </div>

      <style>{`
        .stars-layer-1, .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-repeat: repeat;
        }

        .stars-layer-1 {
          background-image: 
            radial-gradient(1px 1px at 20% 30%, rgba(122, 155, 118, 0.4), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(122, 155, 118, 0.3), transparent);
          background-size: 200% 200%;
        }

        .stars-layer-2 {
          background-image:
            radial-gradient(1px 1px at 40% 40%, rgba(139, 157, 195, 0.3), transparent);
          background-size: 200% 200%;
        }
      `}</style>

      <GardenNav />

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-24">
        <h1 className="font-['Playfair_Display'] italic text-[48px] text-[#7a9b76] mb-12" style={{ lineHeight: '1.1' }}>
          Notifications
        </h1>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3]">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded p-6 backdrop-blur-sm ${
                  !notif.read ? 'border-[rgba(122,155,118,0.4)]' : ''
                }`}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-['Cormorant_Garamond'] text-[18px] text-[#f5f0e8]">
                        {notif.title}
                      </h3>
                      <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9dc3]/60">
                        {formatTimestamp(notif.timestamp)}
                      </span>
                    </div>

                    <p className="font-['Cormorant_Garamond'] text-[16px] text-[#e8ddd0]/80 mb-4" style={{ lineHeight: '1.6' }}>
                      {notif.message}
                    </p>

                    {/* Action buttons */}
                    {notif.actionRequired && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(notif.id);
                          }}
                          className="px-6 py-2 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] text-[#7a9b76] transition-all font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] rounded cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecline(notif.id);
                          }}
                          className="px-6 py-2 border border-[rgba(196,164,108,0.2)] hover:border-[#c4a46c] text-[#e8ddd0] hover:text-[#f5f0e8] transition-all font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] rounded cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Unread indicator */}
                    {!notif.read && (
                      <div className="mt-3">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#7a9b76]"></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- pages/ProfilePage.tsx ---
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

// --- pages/PromptsPage.tsx ---
import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { GardenFooter } from '../components/GardenFooter';

// SEASONAL/CYCLICAL PROMPTS - Not data-driven, not trending
// Rotate on a slow rhythm (weekly or seasonal)
const seasonalPrompts = {
  winter: {
    season: 'Winter',
    icon: '❄️',
    prompt: 'Write about what grows in the cold. Not despite it—because of it.',
    meditation: 'Winter asks us to be still. To find what persists when everything else has fallen away.',
  },
  spring: {
    season: 'Spring',
    icon: '🌱',
    prompt: 'What are you becoming? Write about metamorphosis—yours or something you\'ve witnessed.',
    meditation: 'Spring is relentless. It doesn\'t ask permission. Neither should your writing.',
  },
  summer: {
    season: 'Summer',
    icon: '☀️',
    prompt: 'Write about abundance. What it feels like to have too much—of anything.',
    meditation: 'Summer teaches excess. Let your words spill over. There will be time for pruning later.',
  },
  autumn: {
    season: 'Autumn',
    icon: '🍂',
    prompt: 'What are you ready to let go? Write about the beauty of release.',
    meditation: 'Autumn shows us that letting go can be gorgeous. The trees know this.',
  },
};

// Calculate current season based on date (not trending, not algorithmic)
const getCurrentSeason = () => {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

export function PromptsPage() {
  const [currentPrompt, setCurrentPrompt] = useState(seasonalPrompts[getCurrentSeason()]);

  const handleUsePrompt = () => {
    // Store prompt in localStorage so WritePage can use it
    localStorage.setItem('gardenActivePrompt', currentPrompt.prompt);
    window.location.href = '/garden/write';
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
              Seasonal Prompts
            </h1>
            <p className="font-['Cardo'] text-[#e0e0e0]/60">
              One prompt. Slow rhythm. No trending topics.
            </p>
          </div>

          {/* Current Seasonal Prompt */}
          <div className="mb-16">
            <div className="bg-[#1a1a1a] border border-[#7a9b76]/30 rounded-lg p-12">
              {/* Season indicator */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="text-[48px]">{currentPrompt.icon}</span>
                <div>
                  <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#7a9b76]/70">
                    This Season's Prompt
                  </p>
                  <h2 className="font-['Cardo'] text-2xl text-[#7a9b76]">
                    {currentPrompt.season}
                  </h2>
                </div>
              </div>

              {/* The prompt */}
              <div className="mb-8">
                <p className="font-['Georgia'] text-[24px] text-[#e0e0e0] text-center mb-6" style={{ lineHeight: '1.6' }}>
                  {currentPrompt.prompt}
                </p>
                <p className="font-['Georgia'] text-[16px] text-[#8b9dc3] text-center italic" style={{ lineHeight: '1.8' }}>
                  {currentPrompt.meditation}
                </p>
              </div>

              {/* Use prompt button */}
              <div className="text-center">
                <button
                  onClick={handleUsePrompt}
                  className="px-8 py-4 bg-[#7a9b76] hover:bg-[#8fb587] text-white font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] rounded transition-colors cursor-pointer"
                >
                  Write from this prompt
                </button>
              </div>
            </div>
          </div>

          {/* About Seasonal Prompts */}
          <div className="bg-[rgba(26,26,26,0.6)] border border-[#333] rounded-lg p-8">
            <h3 className="font-['Cardo'] text-xl text-[#e0e0e0] mb-4">
              Why one prompt?
            </h3>
            <div className="space-y-4 font-['Georgia'] text-[16px] text-[#e0e0e0]/70" style={{ lineHeight: '1.8' }}>
              <p>
                Prompts change with the seasons. Not with trends. Not with what's popular. Not with algorithms tracking engagement.
              </p>
              <p>
                A single prompt for an entire season gives you time to sit with it. To return to it. To discover what it means to you this week versus last week.
              </p>
              <p>
                Gardens don't grow on demand. Neither should your writing practice.
              </p>
            </div>
          </div>

          {/* Previous Seasons (for reference) */}
          <div className="mt-12">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-6">
              Previous Seasons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(seasonalPrompts)
                .filter(([key]) => key !== getCurrentSeason())
                .map(([key, prompt]) => (
                  <div
                    key={key}
                    className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{prompt.icon}</span>
                      <p className="font-['Cardo'] text-lg text-[#e0e0e0]">
                        {prompt.season}
                      </p>
                    </div>
                    <p className="font-['Georgia'] text-sm text-[#e0e0e0]/60" style={{ lineHeight: '1.6' }}>
                      {prompt.prompt}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <GardenFooter />
    </div>
  );
}

// --- pages/QuietHoursPage.tsx ---
import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { useAuth } from '../../contexts/AuthContext';
import { quietHoursService, QuietHours } from '../utils/quietHours';

export function QuietHoursPage() {
  const { user: currentUser } = useAuth();
  const [settings, setSettings] = useState<QuietHours>(quietHoursService.getQuietHours());
  const [saved, setSaved] = useState(false);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (!currentUser) {
      window.location.href = '/garden/login';
    }
  }, [currentUser]);

  const handleToggle = () => {
    const updated = { ...settings, enabled: !settings.enabled };
    setSettings(updated);
    quietHoursService.updateQuietHours(updated);
    showSavedMessage();
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    quietHoursService.updateQuietHours(updated);
    showSavedMessage();
  };

  const handleDayToggle = (day: number) => {
    const updated = {
      ...settings,
      daysOfWeek: settings.daysOfWeek.includes(day)
        ? settings.daysOfWeek.filter(d => d !== day)
        : [...settings.daysOfWeek, day].sort()
    };
    setSettings(updated);
    quietHoursService.updateQuietHours(updated);
    showSavedMessage();
  };

  const showSavedMessage = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
              Quiet Hours
            </h1>
            <p className="font-['Cardo'] text-[#e0e0e0]/60">
              Set boundaries for your writing practice
            </p>
          </div>

          {/* Saved indicator */}
          {saved && (
            <div className="mb-6 p-3 bg-[#7a9b76]/20 border border-[#7a9b76] rounded text-[#7a9b76] text-sm text-center">
              ✓ Settings saved
            </div>
          )}

          {/* Enable/Disable Toggle */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Cardo'] text-xl text-[#e0e0e0] mb-2">
                  Enable Quiet Hours
                </h3>
                <p className="font-['Georgia'] text-sm text-[#e0e0e0]/60">
                  During quiet hours, The Garden shows a minimal interface
                </p>
              </div>
              <button
                onClick={handleToggle}
                className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer ${
                  settings.enabled ? 'bg-[#7a9b76]' : 'bg-[#333]'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Time Settings */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-6">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-6">
              Time Range
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-3">
                  Start Time
                </label>
                <input
                  type="time"
                  value={settings.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-3">
                  End Time
                </label>
                <input
                  type="time"
                  value={settings.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors cursor-pointer"
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-[#e0e0e0]/40">
              {settings.startTime > settings.endTime
                ? 'Quiet hours will span across midnight'
                : `Quiet hours: ${settings.startTime} - ${settings.endTime}`}
            </p>
          </div>

          {/* Days of Week */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-6">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-6">
              Active Days
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dayNames.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDayToggle(index)}
                  className={`px-4 py-3 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    settings.daysOfWeek.includes(index)
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#121212] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-4">
              🌙 How Quiet Hours Work
            </h3>
            <div className="space-y-3 font-['Georgia'] text-sm text-[#e0e0e0]/70 leading-relaxed">
              <p>
                During your quiet hours, The Garden will show a minimal banner at the top of the page, 
                reminding you that you're in a focused time.
              </p>
              <p>
                This is your time to write without distractions. The interface remains fully functional, 
                but the visual cue helps maintain your boundaries.
              </p>
              <p>
                Use quiet hours to protect your creative energy and establish a healthy relationship 
                with your writing practice.
              </p>
            </div>
          </div>

          {/* Current Status */}
          {settings.enabled && (
            <div className="mt-6 p-4 bg-[#7a9b76]/10 border border-[#7a9b76]/30 rounded text-center">
              <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#7a9b76]">
                {quietHoursService.isQuietTime()
                  ? '🌙 Currently in Quiet Hours'
                  : '☀️ Quiet Hours Not Active'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- pages/ReaderPage.tsx ---
import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { GardenFooter } from '../components/GardenFooter';
import { useAuth } from '../../contexts/AuthContext';

// CONNECTIONS ARE THE PRIMARY DISCOVERY MECHANISM
export function ReaderPage() {
  const { user, supabase } = useAuth();
  const [writing, setWriting] = useState<any>(null);
  const [connectedWritings, setConnectedWritings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get writing ID from URL
  const writingId = window.location.pathname.split('/garden/read/')[1];

  useEffect(() => {
    if (writingId) {
      loadWriting();
    }
  }, [writingId]);

  const loadWriting = async () => {
    setLoading(true);
    try {
      // Load the writing
      const { data: writingData } = await supabase
        .from('writings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            garden_name
          )
        `)
        .eq('id', writingId)
        .single();

      if (writingData) {
        setWriting(writingData);

        // Load connected writings (grows_from and grows_into)
        const connectionIds = [
          ...(writingData.grows_from || []),
          ...(writingData.grows_into || [])
        ];

        if (connectionIds.length > 0) {
          const { data: connections } = await supabase
            .from('writings')
            .select(`
              *,
              profiles:user_id (
                full_name,
                garden_name
              )
            `)
            .in('id', connectionIds)
            .eq('visibility', 'garden'); // Only show public connections

          setConnectedWritings(connections || []);
        }
      }
    } catch (error) {
      console.error('Error loading writing:', error);
    }
    setLoading(false);
  };

  const wanderToRandomBloom = async () => {
    // Load a random public bloom
    const { data: writings } = await supabase
      .from('writings')
      .select('id')
      .eq('visibility', 'garden')
      .eq('growth_stage', 'bloom');

    if (writings && writings.length > 0) {
      const randomIndex = Math.floor(Math.random() * writings.length);
      window.location.href = `/garden/read/${writings[randomIndex].id}`;
    }
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-[#7a9b76] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!writing) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <GardenNav />
        <div className="pt-24 px-8 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-['Cardo'] text-xl text-[#e0e0e0]/60">
              Writing not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Wander button at top */}
          <div className="mb-8 text-center">
            <button
              onClick={wanderToRandomBloom}
              className="px-6 py-2 border border-[#7a9b76]/30 hover:border-[#7a9b76] text-[#7a9b76] hover:bg-[#7a9b76]/10 transition-colors cursor-pointer font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] rounded"
            >
              Wander to another bloom →
            </button>
          </div>

          {/* Author */}
          <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#7a9b76]/70 mb-4">
            {writing.profiles?.garden_name || writing.profiles?.full_name || 'Anonymous'}
          </p>

          {/* Title */}
          <h1 className="font-['Playfair_Display'] italic text-[48px] text-[#e0e0e0] mb-8" style={{ lineHeight: '1.2' }}>
            {writing.title}
          </h1>

          {/* Content */}
          <div 
            className="font-['Georgia'] text-[19px] text-[#e0e0e0] mb-12 prose prose-invert max-w-none"
            style={{ lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: writing.content }}
          />

          {/* Tags */}
          {writing.tags && writing.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-[#333]">
              {writing.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#7a9b76]/10 border border-[#7a9b76]/30 rounded text-[#7a9b76] text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CONNECTED PIECES - PRIMARY DISCOVERY MECHANISM */}
          <div className="mb-12">
            <h2 className="font-['Cardo'] text-3xl text-[#7a9b76] mb-6">
              Connected Pieces
            </h2>
            
            {connectedWritings.length === 0 ? (
              <div className="p-8 bg-[#1a1a1a] border border-[#333] rounded-lg text-center">
                <p className="font-['Cardo'] text-[#e0e0e0]/60">
                  This piece stands alone. No connections yet.
                </p>
                <p className="font-['Cardo'] text-sm text-[#e0e0e0]/40 mt-2">
                  Discovery happens through following threads between ideas.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="font-['Cardo'] text-[#e0e0e0]/60 mb-6">
                  Follow the threads between ideas. This is how you discover new writing.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {connectedWritings.map((connected) => (
                    <div
                      key={connected.id}
                      className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#7a9b76] transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/garden/read/${connected.id}`}
                    >
                      <p className="font-['Courier_New'] text-[10px] uppercase tracking-[0.15em] text-[#7a9b76]/60 mb-2">
                        {connected.profiles?.garden_name || connected.profiles?.full_name || 'Anonymous'}
                      </p>
                      <h3 className="font-['Georgia'] text-xl text-[#e0e0e0] mb-2">
                        {connected.title}
                      </h3>
                      <p className="font-['Georgia'] text-sm text-[#e0e0e0]/60 line-clamp-3">
                        {stripHtml(connected.content).substring(0, 150)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pt-8 border-t border-[#333]">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-[#333] hover:border-[#7a9b76] text-[#e0e0e0] transition-colors cursor-pointer font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] rounded"
            >
              ← Back
            </button>
            <button
              onClick={() => window.location.href = '/garden/explore'}
              className="px-6 py-3 border border-[#333] hover:border-[#7a9b76] text-[#e0e0e0] transition-colors cursor-pointer font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] rounded"
            >
              Gallery
            </button>
          </div>
        </div>
      </div>

      <GardenFooter />
    </div>
  );
}

// --- pages/SignupPage.tsx ---
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function SignupPage() {
  const { signUp, supabase } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    writerName: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.displayName) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      console.log('[SignupPage] Attempting signup...');
      await signUp(
        formData.email,
        formData.password,
        formData.displayName,
        formData.writerName || formData.displayName
      );
      console.log('[SignupPage] Signup successful, redirecting...');
      // FIX: Session is now verified in AuthContext.signUp, safe to redirect
      // Small delay to ensure DOM is ready for redirect
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = '/garden/dashboard';
    } catch (err: any) {
      console.error('[SignupPage] Signup error:', err);
      
      if (err.message && err.message.includes('already been registered')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.message && err.message.includes('User already registered')) {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('[SignupPage] Google sign-up button clicked');
    setError('');
    setLoading(true);

    try {
      console.log('[SignupPage] Initiating Google OAuth...');
      
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectUrl = `${origin}/garden/dashboard`;
      
      console.log('[SignupPage] OAuth redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('[SignupPage] Google OAuth error:', error);
        
        if (error.message.includes('not enabled') || error.message.includes('Provider')) {
          setError('Google sign-up is not configured yet. Please contact support or use email/password signup.');
        } else if (error.message.includes('popup')) {
          setError('Pop-up was blocked. Please allow pop-ups for this site and try again.');
        } else {
          setError(`Google sign-up failed: ${error.message}`);
        }
        setLoading(false);
        return;
      }

      // Check if OAuth is configured (data.url will be null if not configured)
      if (!data || !data.url) {
        console.error('[SignupPage] Google OAuth not configured - no redirect URL provided');
        setError('Google sign-in is not available yet. Please use email and password to sign in.');
        setLoading(false);
        return;
      }

      console.log('[SignupPage] OAuth initiated successfully, redirecting to Google...');
      // Manually redirect to ensure it works in all environments
      window.location.href = data.url;
    } catch (error: any) {
      console.error('[SignupPage] Unexpected error during Google sign-up:', error);
      setError(error.message || 'An unexpected error occurred during Google sign-up.');
      setLoading(false);
    }
  };

  // Generate stars with random positions and animation delays
  const stars = Array.from({ length: 90 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() > 0.7 ? (Math.random() * 2 + 2) : (Math.random() * 2 + 1),
    opacity: Math.random() * 0.7 + 0.3,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 6
  }));

  // Generate bright stars with glow
  const brightStars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 4,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 4
  }));

  // Generate shooting stars
  const shootingStars = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 50 + 10}%`,
    top: `${Math.random() * 50 + 10}%`,
    delay: i * 12 + 6
  }));

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Animated Starry Sky Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#050d1a] via-[#0a1628] to-[#0d1a2b]" style={{ zIndex: 0 }}>
        {/* Regular twinkling stars */}
        {stars.map(star => (
          <div
            key={`star-${star.id}`}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.size > 2 ? '#fffef0' : '#ffffff',
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              boxShadow: star.size > 2 ? '0 0 2px rgba(255, 254, 240, 0.8)' : 'none'
            }}
          />
        ))}

        {/* Bright stars with glow */}
        {brightStars.map(star => (
          <div
            key={`bright-${star.id}`}
            className="absolute rounded-full animate-pulse-glow"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#fffef0',
              boxShadow: '0 0 8px rgba(255, 254, 240, 0.9), 0 0 16px rgba(255, 254, 240, 0.6), 0 0 24px rgba(255, 254, 240, 0.3)',
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map(star => (
          <div
            key={`shooting-${star.id}`}
            className="absolute animate-shooting-star"
            style={{
              left: star.left,
              top: star.top,
              width: '100px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
              transform: 'rotate(-45deg)',
              animationDelay: `${star.delay}s`
            }}
          />
        ))}

        {/* Aurora glow at horizon */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-64 opacity-30"
          style={{
            background: 'linear-gradient(to top, rgba(42, 157, 143, 0.15), rgba(38, 70, 83, 0.08), transparent)'
          }}
        />

        {/* Subtle parallax drift overlay */}
        <div 
          className="absolute inset-0 animate-slow-drift"
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(42, 157, 143, 0.03), transparent 50%)'
          }}
        />
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glassmorphism Card */}
        <div 
          className="backdrop-blur-xl rounded-2xl border p-8 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Glowing Icon */}
          <div className="flex justify-center mb-6">
            <div 
              className="text-5xl animate-bloom"
              style={{
                filter: 'drop-shadow(0 0 12px rgba(124, 154, 110, 0.7)) drop-shadow(0 0 24px rgba(124, 154, 110, 0.4))'
              }}
            >
              🌱
            </div>
          </div>

          {/* Title */}
          <h1 
            className="font-['Cardo'] text-4xl text-center mb-2"
            style={{ color: '#f5f0e8' }}
          >
            Start your garden
          </h1>

          {/* Subtitle */}
          <p 
            className="font-['Cardo'] text-center italic mb-8 text-lg"
            style={{ color: 'rgba(245, 240, 232, 0.6)' }}
          >
            A place for your writing to grow
          </p>

          {/* Error Message */}
          {error && (
            <div 
              className="mb-6 p-4 rounded-xl border"
              style={{
                background: 'rgba(251, 146, 60, 0.15)',
                borderColor: 'rgba(251, 146, 60, 0.4)',
                color: '#fbbf24'
              }}
            >
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Google Sign-Up */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-6 px-6 py-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: '#f5f0e8'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </g>
            </svg>
            <span className="font-['Inter'] font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 font-['Inter'] text-xs uppercase tracking-wider" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(245, 240, 232, 0.4)' }}>
                or
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label 
                htmlFor="displayName"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Display Name *
              </label>
              <input
                id="displayName"
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="Your name"
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c9a6e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 154, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="your@email.com"
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c9a6e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 154, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="At least 8 characters"
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c9a6e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 154, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
                required
                minLength={8}
              />
            </div>

            {/* Writer Name (Optional) */}
            <div>
              <label 
                htmlFor="writerName"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Writer Name <span style={{ color: 'rgba(245, 240, 232, 0.4)' }}>(optional)</span>
              </label>
              <input
                id="writerName"
                type="text"
                value={formData.writerName}
                onChange={(e) => setFormData({ ...formData, writerName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="Your pen name"
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c9a6e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 154, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button with Bloom Animation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-xl font-['Inter'] font-semibold text-white transition-all duration-300 hover:animate-bloom-button disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #5a7a4a 0%, #7c9a6e 100%)',
                boxShadow: '0 4px 16px rgba(90, 122, 74, 0.4)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 6px 32px rgba(90, 122, 74, 0.8), 0 0 24px rgba(124, 154, 110, 0.4)';
                  e.currentTarget.style.filter = 'brightness(1.15)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(90, 122, 74, 0.4)';
                e.currentTarget.style.filter = 'brightness(1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {loading ? 'Planting your seed...' : 'Plant the first seed'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center font-['Inter'] text-sm" style={{ color: 'rgba(245, 240, 232, 0.6)' }}>
            Already have a garden?{' '}
            <a 
              href="/garden/login"
              className="font-semibold transition-colors"
              style={{ 
                color: '#7c9a6e',
                textShadow: '0 0 8px rgba(124, 154, 110, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8fb587';
                e.currentTarget.style.textShadow = '0 0 12px rgba(124, 154, 110, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#7c9a6e';
                e.currentTarget.style.textShadow = '0 0 8px rgba(124, 154, 110, 0.4)';
              }}
            >
              Sign in
            </a>
          </p>

          {/* Inspirational Quote */}
          <p 
            className="mt-8 text-center font-['Cardo'] text-sm italic"
            style={{ color: 'rgba(245, 240, 232, 0.4)' }}
          >
            "Every great story begins with a single seed."
          </p>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes shooting-star {
          0% { transform: translateX(-100px) translateY(-100px) rotate(-45deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(300px) translateY(300px) rotate(-45deg); opacity: 0; }
        }
        
        @keyframes slow-drift {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes bloom {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          25% { transform: scale(1.05) rotate(-2deg); }
          50% { transform: scale(1.1) rotate(2deg); opacity: 1; }
          75% { transform: scale(1.05) rotate(-2deg); }
        }
        
        @keyframes bloom-button {
          0%, 100% { transform: scale(1.02); }
          50% { transform: scale(1.05); }
        }
        
        .animate-twinkle {
          animation: twinkle infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow infinite;
        }
        
        .animate-shooting-star {
          animation: shooting-star 3s ease-out infinite;
        }
        
        .animate-slow-drift {
          animation: slow-drift 20s ease-in-out infinite;
        }
        
        .animate-bloom {
          animation: bloom 4s ease-in-out infinite;
        }
        
        .animate-bloom-button {
          animation: bloom-button 0.6s ease-in-out;
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

// --- pages/WritePage.tsx ---
import { useState, useEffect, useRef } from 'react';
import { GardenNav } from '../components/GardenNav';
import { useAuth } from '../../contexts/AuthContext';
import { notesService, NoteState, NoteVisibility } from '../utils/notes';
import type { WorkType } from '../utils/notes';

export function WritePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const noteId = urlParams.get('id');
  
  const { user, loading, supabase } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('Untitled');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [state, setState] = useState<NoteState>('seed');
  const [tagInput, setTagInput] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [wordGoal, setWordGoal] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [workType, setWorkType] = useState<WorkType>('prose');
  // CRITICAL: Publishing choice - nothing public unless explicitly chosen
  const [visibility, setVisibility] = useState<NoteVisibility>('private');
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [pendingVisibility, setPendingVisibility] = useState<NoteVisibility | null>(null);
  // Connections for growth stages
  const [growsFrom, setGrowsFrom] = useState<string[]>([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [tendedByCount, setTendedByCount] = useState(0);
  // Replant context
  const [replantContext, setReplantContext] = useState<{
    fromWritingId: string;
    fromTitle: string;
    fromAuthor: string;
    fromAuthorId: string;
  } | null>(null);

  // GROWTH STAGE CONSTRAINTS - stages are functional, not cosmetic
  const getStageConstraints = (stage: NoteState) => {
    switch (stage) {
      case 'seed':
        return {
          maxChars: 500,
          canConnect: false,
          canBePublic: false,
          message: 'This seed is still germinating. Keep it small.',
          minHeight: '200px',
          maxHeight: '300px',
          bgOpacity: '0.4',
          borderColor: 'rgba(100, 110, 130, 0.3)',
          glowColor: 'rgba(100, 110, 130, 0.1)',
        };
      case 'sprout':
        return {
          maxChars: 2000,
          canConnect: true,
          canBePublic: false, // Sprouts can be shared with circles, not Gallery
          message: 'Your sprout is reaching toward other ideas.',
          minHeight: '400px',
          maxHeight: '600px',
          bgOpacity: '0.6',
          borderColor: 'rgba(122, 155, 118, 0.3)',
          glowColor: 'rgba(122, 155, 118, 0.15)',
        };
      case 'bloom':
        return {
          maxChars: null, // No limit
          canConnect: true,
          canBePublic: true,
          message: 'This piece has bloomed. It may be ready for the gallery.',
          minHeight: '500px',
          maxHeight: 'none',
          bgOpacity: '0.8',
          borderColor: 'rgba(196, 164, 108, 0.4)',
          glowColor: 'rgba(196, 164, 108, 0.2)',
        };
    }
  };

  const constraints = getStageConstraints(state);

  // Check if can advance to next stage
  const canAdvanceToSprout = state === 'seed' && charCount > 0;
  const canAdvanceToBloom = state === 'sprout' && connectionCount >= 3 && tendedByCount >= 1;

  useEffect(() => {
    // FIX #5: Only redirect after loading completes AND user is confirmed null
    if (!loading && !user) {
      console.log('[WritePage] No authenticated user, redirecting to login');
      window.location.href = '/garden/login';
      return;
    }

    const storedPrompt = localStorage.getItem('gardenActivePrompt');
    if (storedPrompt) {
      setPromptText(storedPrompt);
      localStorage.removeItem('gardenActivePrompt');
    }

    // Check for replant context
    const storedReplant = localStorage.getItem('replant_context');
    if (storedReplant && !noteId) {
      const context = JSON.parse(storedReplant);
      setReplantContext(context);
      localStorage.removeItem('replant_context');
    }
  }, [user, loading]);

  // Load existing note if noteId is provided
  useEffect(() => {
    if (!user) return;

    if (noteId) {
      const loadNote = async () => {
        try {
          const { data: writing } = await supabase
            .from('writings')
            .select('*')
            .eq('id', noteId)
            .eq('user_id', user.id)
            .single();

          if (writing) {
            setTitle(writing.title);
            setContent(writing.content);
            setTags(writing.tags || []);
            setState(writing.growth_stage);
            setWordCount(writing.word_count || 0);
            setVisibility(writing.visibility);
            if (contentRef.current) {
              contentRef.current.innerHTML = writing.content;
            }
          }
        } catch (error) {
          console.error('Error loading note:', error);
        }
      };

      loadNote();
    }
  }, [noteId, user, supabase]);

  // Update word and character counts
  useEffect(() => {
    const count = notesService.calculateWordCount(content);
    setWordCount(count);
    setCharCount(content.length);
  }, [content]);

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] relative flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-2 border-[#7a9b76] border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="font-['Cormorant_Garamond'] text-[16px] text-[#8b9dc3]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Don't render editor if no user (redirect will happen)
  if (!user) {
    return null;
  }

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const wordCount = notesService.calculateWordCount(content);

      if (noteId) {
        await supabase
          .from('writings')
          .update({
            title,
            content,
            tags,
            growth_stage: state,
            word_count: wordCount,
            updated_at: new Date().toISOString(),
            visibility: pendingVisibility || visibility,
          })
          .eq('id', noteId)
          .eq('user_id', user.id);
      } else {
        const { data } = await supabase
          .from('writings')
          .insert({
            user_id: user.id,
            title,
            content,
            tags,
            growth_stage: state,
            word_count: wordCount,
            visibility: pendingVisibility || visibility,
          })
          .select()
          .single();

        window.history.replaceState(null, '', `/garden/write?id=${data?.id}`);
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving:', error);
    }

    setIsSaving(false);
    setPendingVisibility(null);
    setShowVisibilityModal(false);
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      const newCharCount = newContent.length;
      
      // ENFORCE CHARACTER LIMITS - prevent typing over limit
      if (constraints.maxChars && newCharCount > constraints.maxChars) {
        // Restore previous content
        contentRef.current.innerHTML = content;
        // Move cursor to end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(contentRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
        return;
      }
      
      setContent(newContent);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleExportCopy = () => {
    const plainText = contentRef.current?.innerText || '';
    navigator.clipboard.writeText(plainText);
    alert('Copied to clipboard!');
    setShowExportMenu(false);
  };

  const handleExportTxt = () => {
    const plainText = contentRef.current?.innerText || '';
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'untitled'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportMd = () => {
    let markdown = `# ${title}\n\n`;
    markdown += contentRef.current?.innerText || '';
    markdown += `\n\n---\n\nTags: ${tags.join(', ')}`;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'untitled'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const goalProgress = wordGoal > 0 ? Math.min((wordCount / wordGoal) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="stars-layer"></div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 20% 30%, rgba(122, 155, 118, 0.3), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(122, 155, 118, 0.2), transparent);
          background-size: 200% 200%;
          background-repeat: repeat;
        }

        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: rgba(232, 221, 208, 0.3);
          cursor: text;
        }

        [contentEditable] b, [contentEditable] strong {
          font-weight: bold;
        }

        [contentEditable] i, [contentEditable] em {
          font-style: italic;
        }

        [contentEditable] h1, [contentEditable] h2, [contentEditable] h3 {
          font-weight: bold;
          margin: 1em 0 0.5em;
        }

        [contentEditable] h1 { font-size: 2em; }
        [contentEditable] h2 { font-size: 1.5em; }
        [contentEditable] h3 { font-size: 1.25em; }

        [contentEditable] blockquote {
          border-left: 3px solid #7a9b76;
          padding-left: 1em;
          margin: 1em 0;
          opacity: 0.8;
        }

        [contentEditable] ul, [contentEditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        [contentEditable] hr {
          border: none;
          border-top: 1px solid rgba(122, 155, 118, 0.3);
          margin: 2em 0;
        }

        .toolbar-btn {
          padding: 0.5rem;
          color: #8b9dc3;
          border-radius: 0.25rem;
          transition: all 0.2s;
          cursor: pointer;
        }
        .toolbar-btn:hover {
          background: rgba(122, 155, 118, 0.1);
          color: #7a9b76;
        }
      `}</style>

      <GardenNav />
      
      <div className="relative z-10 pt-24 px-8 pb-16">
        <div className="max-w-[750px] mx-auto">
          {/* Prompt (if from prompts page) */}
          {promptText && (
            <div className="mb-8 p-6 bg-[rgba(122,155,118,0.1)] border border-[rgba(122,155,118,0.3)] rounded">
              <p className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.2em] text-[#7a9b76] mb-2">
                Writing from prompt:
              </p>
              <p className="font-['Cormorant_Garamond'] text-[16px] text-[#e8ddd0]" style={{ lineHeight: '1.6' }}>
                {promptText}
              </p>
            </div>
          )}

          {/* Replant Context (if replanting another writer's work) */}
          {replantContext && (
            <div className="mb-8 p-6 bg-[rgba(139,157,195,0.1)] border border-[rgba(139,157,195,0.3)] rounded">
              <div className="flex items-center gap-2 mb-3">
                <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="#8b9dc3" strokeWidth="2" fill="none">
                  <path d="M12 20 L12 8 M8 12 L12 8 L16 12" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="4" r="2" fill="#8b9dc3"/>
                </svg>
                <p className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.2em] text-[#8b9dc3]">
                  Replanted from:
                </p>
              </div>
              <p className="font-['Cormorant_Garamond'] text-[16px] text-[#e8ddd0]" style={{ lineHeight: '1.6' }}>
                <span className="italic">{replantContext.fromTitle}</span> by {replantContext.fromAuthor}
              </p>
              <p className="mt-2 font-['Cormorant_Garamond'] text-[13px] text-[#8b9dc3]/70 italic">
                Plant something new from this.
              </p>
            </div>
          )}

          {/* Top bar */}
          <div className="flex items-center justify-between mb-8 text-[#8b9dc3] text-sm">
            <div className="font-['Cormorant_Garamond']">
              {isSaving ? 'Saving...' : ''}
            </div>
            <div className="font-['Cormorant_Garamond']">{wordCount} words</div>
          </div>

          {/* Word Goal */}
          {wordGoal > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 text-sm font-['Cormorant_Garamond'] text-[#8b9dc3]">
                <span>Word goal: {wordCount} / {wordGoal}</span>
                <span>{goalProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-[rgba(15,21,37,0.6)] rounded-full overflow-hidden border border-[rgba(122,155,118,0.2)]">
                <div 
                  className="h-full bg-gradient-to-r from-[#7a9b76] to-[#8fb587] transition-all duration-300"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none text-[#f5f0e8] font-['Playfair_Display'] italic mb-6 focus:outline-none placeholder:text-[#e8ddd0]/30"
            style={{ fontSize: '42px', lineHeight: '1.2' }}
            placeholder="Untitled"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[rgba(122,155,118,0.2)]">
            <button onClick={() => applyFormat('bold')} className="toolbar-btn" title="Bold">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('italic')} className="toolbar-btn" title="Italic">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="19" y1="4" x2="10" y2="4"/>
                <line x1="14" y1="20" x2="5" y2="20"/>
                <line x1="15" y1="4" x2="9" y2="20"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('formatBlock', 'h2')} className="toolbar-btn" title="Heading">
              <span className="font-bold">H</span>
            </button>
            <button onClick={() => applyFormat('formatBlock', 'blockquote')} className="toolbar-btn" title="Quote">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('insertUnorderedList')} className="toolbar-btn" title="Bullet List">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="9" y1="6" x2="20" y2="6"/>
                <line x1="9" y1="12" x2="20" y2="12"/>
                <line x1="9" y1="18" x2="20" y2="18"/>
                <circle cx="5" cy="6" r="1" fill="currentColor"/>
                <circle cx="5" cy="12" r="1" fill="currentColor"/>
                <circle cx="5" cy="18" r="1" fill="currentColor"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('insertOrderedList')} className="toolbar-btn" title="Numbered List">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="10" y1="6" x2="21" y2="6"/>
                <line x1="10" y1="12" x2="21" y2="12"/>
                <line x1="10" y1="18" x2="21" y2="18"/>
                <path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('insertHorizontalRule')} className="toolbar-btn" title="Divider">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
              </svg>
            </button>
          </div>

          {/* Editor */}
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            className="w-full min-h-[500px] bg-transparent text-[#e8ddd0] font-['Cormorant_Garamond'] focus:outline-none mb-8"
            style={{ fontSize: '19px', lineHeight: '1.8' }}
            data-placeholder="Begin writing..."
          />

          {/* Tags */}
          <div className="mb-6">
            <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(122,155,118,0.15)] border border-[rgba(122,155,118,0.3)] rounded-full text-[#7a9b76] text-sm font-['Cormorant_Garamond']"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="cursor-pointer hover:text-[#8fb587]">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded px-4 py-2 text-[#e8ddd0] text-sm focus:border-[#7a9b76] focus:outline-none transition-colors font-['Cormorant_Garamond']"
                placeholder="Add a tag..."
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] rounded text-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] transition-all cursor-pointer text-sm font-['Cormorant_Garamond'] uppercase tracking-[0.15em]"
              >
                Add
              </button>
            </div>
          </div>

          {/* Work Type */}
          <div className="mb-6">
            <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
              Work Type
            </label>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value as WorkType)}
              className="w-full bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded px-4 py-3 text-[#e8ddd0] focus:border-[#7a9b76] focus:outline-none transition-colors font-['Cormorant_Garamond'] cursor-pointer"
            >
              <option value="poetry">Poetry</option>
              <option value="prose">Prose</option>
              <option value="fiction">Fiction</option>
              <option value="essay">Essay</option>
              <option value="fragment">Fragment</option>
              <option value="personal">Personal</option>
              <option value="experimental">Experimental</option>
            </select>
          </div>

          {/* CRITICAL: Visibility Control - Publishing Choice */}
          <div className="mb-6 pb-6 border-b border-[rgba(122,155,118,0.1)]">
            <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
              Who can see this?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (visibility === 'garden' && 'private' !== visibility) {
                    setPendingVisibility('private');
                  } else {
                    setVisibility('private');
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded border transition-all cursor-pointer ${
                  visibility === 'private'
                    ? 'bg-[rgba(139,157,195,0.15)] border-[rgba(139,157,195,0.4)] text-[#8b9dc3]'
                    : 'border-[rgba(139,157,195,0.2)] text-[#8b9dc3]/60 hover:border-[rgba(139,157,195,0.3)]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-['Cormorant_Garamond'] text-sm">Private</span>
              </button>
              <button
                onClick={() => {
                  if (visibility === 'private') {
                    setPendingVisibility('garden');
                    setShowVisibilityModal(true);
                  } else {
                    setVisibility('garden');
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded border transition-all cursor-pointer ${
                  visibility === 'garden'
                    ? 'bg-[rgba(122,155,118,0.15)] border-[rgba(122,155,118,0.4)] text-[#7a9b76]'
                    : 'border-[rgba(122,155,118,0.2)] text-[#7a9b76]/60 hover:border-[rgba(122,155,118,0.3)]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-['Cormorant_Garamond'] text-sm">Garden</span>
              </button>
              <button
                onClick={() => setVisibility('circle')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded border transition-all cursor-pointer ${
                  visibility === 'circle'
                    ? 'bg-[rgba(196,164,108,0.15)] border-[rgba(196,164,108,0.4)] text-[#c4a46c]'
                    : 'border-[rgba(196,164,108,0.2)] text-[#c4a46c]/60 hover:border-[rgba(196,164,108,0.3)]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-['Cormorant_Garamond'] text-sm">Circle Only</span>
              </button>
            </div>
            {visibility === 'garden' && (
              <p className="mt-3 text-xs text-[#7a9b76]/70 font-['Cormorant_Garamond'] italic">
                This piece will appear on the Explore page.
              </p>
            )}
            {visibility === 'circle' && (
              <p className="mt-3 text-xs text-[#c4a46c]/70 font-['Cormorant_Garamond'] italic">
                Choose which circle(s) can see this.
              </p>
            )}
            {visibility === 'private' && (
              <p className="mt-3 text-xs text-[#8b9dc3]/70 font-['Cormorant_Garamond'] italic">
                Only you can see this. Not visible to editors or other writers.
              </p>
            )}
          </div>

          {/* Visibility Confirmation Modal */}
          {showVisibilityModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-[rgba(15,21,37,0.95)] border border-[rgba(122,155,118,0.3)] rounded-lg p-8 max-w-md mx-4 shadow-2xl">
                <h3 className="font-['Playfair_Display'] italic text-2xl text-[#f5f0e8] mb-4">
                  Plant in the Garden?
                </h3>
                <p className="font-['Cormorant_Garamond'] text-[16px] text-[#e8ddd0] mb-6" style={{ lineHeight: '1.7' }}>
                  Your writing will be visible to other writers and editors on the Explore page. You can make it private again anytime.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setVisibility(pendingVisibility || 'garden');
                      setPendingVisibility(null);
                      setShowVisibilityModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] text-[#7a9b76] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
                  >
                    Plant in Garden
                  </button>
                  <button
                    onClick={() => {
                      setPendingVisibility(null);
                      setShowVisibilityModal(false);
                    }}
                    className="flex-1 px-6 py-3 border border-[rgba(139,157,195,0.2)] hover:border-[#8b9dc3] text-[#8b9dc3] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
                  >
                    Keep Private
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* State & Word Goal */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
                Growth Stage
              </label>
            </div>
            <div>
              <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
                Character Count
              </label>
              {/* CHARACTER COUNTER - Visual constraint */}
              <div className="p-4 border border-[rgba(122,155,118,0.2)] rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Cormorant_Garamond'] text-2xl text-[#e8ddd0]">
                    {charCount}
                  </span>
                  {constraints.maxChars && (
                    <span className="font-['Cormorant_Garamond'] text-sm text-[#8b9dc3]/60">
                      / {constraints.maxChars}
                    </span>
                  )}
                </div>
                {constraints.maxChars && (
                  <div className="w-full h-2 bg-[rgba(15,21,37,0.6)] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        charCount > constraints.maxChars
                          ? 'bg-red-500'
                          : charCount > constraints.maxChars * 0.8
                          ? 'bg-yellow-500'
                          : 'bg-[#7a9b76]'
                      }`}
                      style={{ width: `${Math.min((charCount / constraints.maxChars) * 100, 100)}%` }}
                    />
                  </div>
                )}
                {constraints.maxChars && charCount > constraints.maxChars && (
                  <p className="mt-2 text-xs text-red-400 font-['Cormorant_Garamond']">
                    Over limit by {charCount - constraints.maxChars} characters
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] disabled:opacity-50 text-[#7a9b76] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-8 py-3 border border-[rgba(196,164,108,0.2)] hover:border-[#c4a46c] text-[#e8ddd0] hover:text-[#f5f0e8] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
              >
                Export
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-[rgba(15,21,37,0.95)] border border-[rgba(122,155,118,0.3)] rounded backdrop-blur-md shadow-lg">
                  <button
                    onClick={handleExportCopy}
                    className="w-full text-left px-4 py-3 text-[#e8ddd0] hover:bg-[rgba(122,155,118,0.1)] transition-colors cursor-pointer font-['Cormorant_Garamond'] text-[14px]"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={handleExportTxt}
                    className="w-full text-left px-4 py-3 text-[#e8ddd0] hover:bg-[rgba(122,155,118,0.1)] transition-colors cursor-pointer font-['Cormorant_Garamond'] text-[14px]"
                  >
                    Download as .txt
                  </button>
                  <button
                    onClick={handleExportMd}
                    className="w-full text-left px-4 py-3 text-[#e8ddd0] hover:bg-[rgba(122,155,118,0.1)] transition-colors cursor-pointer font-['Cormorant_Garamond'] text-[14px]"
                  >
                    Download as .md
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => window.location.href = '/garden/dashboard'}
              className="px-8 py-3 border border-[rgba(139,157,195,0.2)] hover:border-[#8b9dc3] text-[#8b9dc3] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- pages/WritePageEnhanced.tsx ---
import { useState, useEffect, useRef } from 'react';
import { GardenNav } from '../components/GardenNav';
import { useAuth } from '../../contexts/AuthContext';
import { notesService, NoteState } from '../utils/notes';

export function WritePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const noteId = urlParams.get('id');
  
  const { user, loading, supabase } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('Untitled');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [state, setState] = useState<NoteState>('seed');
  const [tagInput, setTagInput] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [wordGoal, setWordGoal] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [promptText, setPromptText] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/garden/login';
    }

    const storedPrompt = localStorage.getItem('gardenActivePrompt');
    if (storedPrompt) {
      setPromptText(storedPrompt);
      localStorage.removeItem('gardenActivePrompt');
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;

    if (noteId) {
      const loadNote = async () => {
        try {
          const { data: writing } = await supabase
            .from('writings')
            .select('*')
            .eq('id', noteId)
            .eq('user_id', user.id)
            .single();

          if (writing) {
            setTitle(writing.title);
            setContent(writing.content);
            setTags(writing.tags || []);
            setState(writing.growth_stage);
            setWordCount(writing.word_count || 0);
            if (contentRef.current) {
              contentRef.current.innerHTML = writing.content;
            }
          }
        } catch (error) {
          console.error('Error loading note:', error);
        }
      };

      loadNote();
    }
  }, [noteId, user, supabase]);

  useEffect(() => {
    const count = notesService.calculateWordCount(content);
    setWordCount(count);
  }, [content]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const wordCount = notesService.calculateWordCount(content);

      if (noteId) {
        await supabase
          .from('writings')
          .update({
            title,
            content,
            tags,
            growth_stage: state,
            word_count: wordCount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', noteId)
          .eq('user_id', user.id);
      } else {
        const { data } = await supabase
          .from('writings')
          .insert({
            user_id: user.id,
            title,
            content,
            tags,
            growth_stage: state,
            word_count: wordCount,
          })
          .select()
          .single();

        window.history.replaceState(null, '', `/garden/write?id=${data?.id}`);
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving:', error);
    }

    setIsSaving(false);
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleExportCopy = () => {
    const plainText = contentRef.current?.innerText || '';
    navigator.clipboard.writeText(plainText);
    alert('Copied to clipboard!');
    setShowExportMenu(false);
  };

  const handleExportTxt = () => {
    const plainText = contentRef.current?.innerText || '';
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'untitled'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportMd = () => {
    let markdown = `# ${title}\n\n`;
    markdown += contentRef.current?.innerText || '';
    markdown += `\n\n---\n\nTags: ${tags.join(', ')}`;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'untitled'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const goalProgress = wordGoal > 0 ? Math.min((wordCount / wordGoal) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="stars-layer"></div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 20% 30%, rgba(122, 155, 118, 0.3), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(122, 155, 118, 0.2), transparent);
          background-size: 200% 200%;
          background-repeat: repeat;
        }

        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: rgba(232, 221, 208, 0.3);
          cursor: text;
        }

        [contentEditable] b, [contentEditable] strong {
          font-weight: bold;
        }

        [contentEditable] i, [contentEditable] em {
          font-style: italic;
        }

        [contentEditable] h1, [contentEditable] h2, [contentEditable] h3 {
          font-weight: bold;
          margin: 1em 0 0.5em;
        }

        [contentEditable] h1 { font-size: 2em; }
        [contentEditable] h2 { font-size: 1.5em; }
        [contentEditable] h3 { font-size: 1.25em; }

        [contentEditable] blockquote {
          border-left: 3px solid #7a9b76;
          padding-left: 1em;
          margin: 1em 0;
          opacity: 0.8;
        }

        [contentEditable] ul, [contentEditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        [contentEditable] hr {
          border: none;
          border-top: 1px solid rgba(122, 155, 118, 0.3);
          margin: 2em 0;
        }
      `}</style>

      <GardenNav />
      
      <div className="relative z-10 pt-24 px-8 pb-16">
        <div className="max-w-[750px] mx-auto">
          {/* Prompt (if from prompts page) */}
          {promptText && (
            <div className="mb-8 p-6 bg-[rgba(122,155,118,0.1)] border border-[rgba(122,155,118,0.3)] rounded">
              <p className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.2em] text-[#7a9b76] mb-2">
                Writing from prompt:
              </p>
              <p className="font-['Cormorant_Garamond'] text-[16px] text-[#e8ddd0]" style={{ lineHeight: '1.6' }}>
                {promptText}
              </p>
            </div>
          )}

          {/* Top bar */}
          <div className="flex items-center justify-between mb-8 text-[#8b9dc3] text-sm">
            <div className="font-['Cormorant_Garamond']">
              {isSaving ? 'Saving...' : lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
            </div>
            <div className="font-['Cormorant_Garamond']">{wordCount} words</div>
          </div>

          {/* Word Goal */}
          {wordGoal > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 text-sm font-['Cormorant_Garamond'] text-[#8b9dc3]">
                <span>Word goal: {wordCount} / {wordGoal}</span>
                <span>{goalProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-[rgba(15,21,37,0.6)] rounded-full overflow-hidden border border-[rgba(122,155,118,0.2)]">
                <div 
                  className="h-full bg-gradient-to-r from-[#7a9b76] to-[#8fb587] transition-all duration-300"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none text-[#f5f0e8] font-['Playfair_Display'] italic mb-6 focus:outline-none placeholder:text-[#e8ddd0]/30"
            style={{ fontSize: '42px', lineHeight: '1.2' }}
            placeholder="Untitled"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[rgba(122,155,118,0.2)]">
            <button onClick={() => applyFormat('bold')} className="toolbar-btn" title="Bold">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('italic')} className="toolbar-btn" title="Italic">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="19" y1="4" x2="10" y2="4"/>
                <line x1="14" y1="20" x2="5" y2="20"/>
                <line x1="15" y1="4" x2="9" y2="20"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('formatBlock', 'h2')} className="toolbar-btn" title="Heading">
              <span className="font-bold">H</span>
            </button>
            <button onClick={() => applyFormat('formatBlock', 'blockquote')} className="toolbar-btn" title="Quote">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('insertUnorderedList')} className="toolbar-btn" title="Bullet List">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="9" y1="6" x2="20" y2="6"/>
                <line x1="9" y1="12" x2="20" y2="12"/>
                <line x1="9" y1="18" x2="20" y2="18"/>
                <circle cx="5" cy="6" r="1" fill="currentColor"/>
                <circle cx="5" cy="12" r="1" fill="currentColor"/>
                <circle cx="5" cy="18" r="1" fill="currentColor"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('insertOrderedList')} className="toolbar-btn" title="Numbered List">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="10" y1="6" x2="21" y2="6"/>
                <line x1="10" y1="12" x2="21" y2="12"/>
                <line x1="10" y1="18" x2="21" y2="18"/>
                <path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
              </svg>
            </button>
            <button onClick={() => applyFormat('insertHorizontalRule')} className="toolbar-btn" title="Divider">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
              </svg>
            </button>
          </div>

          <style>{`
            .toolbar-btn {
              padding: 0.5rem;
              color: #8b9dc3;
              border-radius: 0.25rem;
              transition: all 0.2s;
              cursor: pointer;
            }
            .toolbar-btn:hover {
              background: rgba(122, 155, 118, 0.1);
              color: #7a9b76;
            }
          `}</style>

          {/* Editor */}
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            className="w-full min-h-[500px] bg-transparent text-[#e8ddd0] font-['Cormorant_Garamond'] focus:outline-none mb-8"
            style={{ fontSize: '19px', lineHeight: '1.8' }}
            data-placeholder="Begin writing..."
          />

          {/* Tags */}
          <div className="mb-6">
            <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(122,155,118,0.15)] border border-[rgba(122,155,118,0.3)] rounded-full text-[#7a9b76] text-sm font-['Cormorant_Garamond']"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="cursor-pointer hover:text-[#8fb587]">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded px-4 py-2 text-[#e8ddd0] text-sm focus:border-[#7a9b76] focus:outline-none transition-colors font-['Cormorant_Garamond']"
                placeholder="Add a tag..."
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] rounded text-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] transition-all cursor-pointer text-sm font-['Cormorant_Garamond'] uppercase tracking-[0.15em]"
              >
                Add
              </button>
            </div>
          </div>

          {/* State & Word Goal */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
                Growth Stage
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value as NoteState)}
                className="w-full bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded px-4 py-2 text-[#e8ddd0] focus:border-[#7a9b76] focus:outline-none transition-colors cursor-pointer font-['Cormorant_Garamond']"
              >
                <option value="seed">Seed</option>
                <option value="sprout">Sprout</option>
                <option value="bloom">Bloom</option>
              </select>
            </div>
            <div>
              <label className="block font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] text-[#8b9dc3] mb-3">
                Word Goal
              </label>
              <input
                type="number"
                value={wordGoal || ''}
                onChange={(e) => setWordGoal(Number(e.target.value))}
                className="w-full bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded px-4 py-2 text-[#e8ddd0] focus:border-[#7a9b76] focus:outline-none transition-colors font-['Cormorant_Garamond']"
                placeholder="e.g. 1000"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] disabled:opacity-50 text-[#7a9b76] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-8 py-3 border border-[rgba(196,164,108,0.2)] hover:border-[#c4a46c] text-[#e8ddd0] hover:text-[#f5f0e8] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
              >
                Export
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-[rgba(15,21,37,0.95)] border border-[rgba(122,155,118,0.3)] rounded backdrop-blur-md shadow-lg">
                  <button
                    onClick={handleExportCopy}
                    className="w-full text-left px-4 py-3 text-[#e8ddd0] hover:bg-[rgba(122,155,118,0.1)] transition-colors cursor-pointer font-['Cormorant_Garamond'] text-[14px]"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={handleExportTxt}
                    className="w-full text-left px-4 py-3 text-[#e8ddd0] hover:bg-[rgba(122,155,118,0.1)] transition-colors cursor-pointer font-['Cormorant_Garamond'] text-[14px]"
                  >
                    Download as .txt
                  </button>
                  <button
                    onClick={handleExportMd}
                    className="w-full text-left px-4 py-3 text-[#e8ddd0] hover:bg-[rgba(122,155,118,0.1)] transition-colors cursor-pointer font-['Cormorant_Garamond'] text-[14px]"
                  >
                    Download as .md
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => window.location.href = '/garden/dashboard'}
              className="px-8 py-3 border border-[rgba(139,157,195,0.2)] hover:border-[#8b9dc3] text-[#8b9dc3] transition-all cursor-pointer font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.15em] rounded"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// UTILS
// ============================================================

// --- utils/auth.ts ---
// Auth system for The Garden
import { storage } from './storage';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  joinedDate: string;
  isGuest?: boolean;
}

const USERS_KEY = 'garden_users';
const CURRENT_USER_KEY = 'garden_current_user';

export const authService = {
  // Get all users
  getUsers: (): User[] => {
    return storage.get<User[]>(USERS_KEY) || [];
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return storage.get<User>(CURRENT_USER_KEY);
  },

  // Check if logged in
  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  },

  // Sign up new user
  signup: (username: string, email: string, displayName: string, bio: string = ''): { success: boolean; user?: User; error?: string } => {
    const users = authService.getUsers();
    
    // Check if username or email already exists
    if (users.some(u => u.username === username)) {
      return { success: false, error: 'Username already exists' };
    }
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      displayName,
      bio,
      joinedDate: new Date().toISOString(),
      isGuest: false
    };

    users.push(newUser);
    storage.set(USERS_KEY, users);
    storage.set(CURRENT_USER_KEY, newUser);

    return { success: true, user: newUser };
  },

  // Login user
  login: (username: string, email: string): { success: boolean; user?: User; error?: string } => {
    const users = authService.getUsers();
    const user = users.find(u => u.username === username && u.email === email);

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    storage.set(CURRENT_USER_KEY, user);
    return { success: true, user };
  },

  // Create guest user
  createGuestUser: (): User => {
    const guestUser: User = {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: `Guest_${Math.random().toString(36).substr(2, 6)}`,
      email: '',
      displayName: 'Guest Writer',
      bio: 'Exploring The Garden',
      joinedDate: new Date().toISOString(),
      isGuest: true
    };

    storage.set(CURRENT_USER_KEY, guestUser);
    return guestUser;
  },

  // Logout
  logout: (): void => {
    storage.remove(CURRENT_USER_KEY);
  },

  // Update user profile
  updateProfile: (updates: Partial<User>): { success: boolean; user?: User; error?: string } => {
        const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const users = authService.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const updatedUser = { ...currentUser, ...updates, id: currentUser.id };
    users[userIndex] = updatedUser;
    
    storage.set(USERS_KEY, users);
    storage.set(CURRENT_USER_KEY, updatedUser);

    return { success: true, user: updatedUser };
  }
};

// --- utils/circles.ts ---
// Circles system for The Garden
import { storage } from './storage';

export interface Circle {
  id: string;
  name: string;
  description: string;
  members: string[]; // array of user IDs
  maxMembers: number;
  createdBy: string;
  createdAt: string;
}

const CIRCLES_KEY = 'garden_circles';

export const circlesService = {
  // Get all circles
  getAllCircles: (): Circle[] => {
    return storage.get<Circle[]>(CIRCLES_KEY) || [];
  },

  // Get circles where user is a member
  getUserCircles: (userId: string): Circle[] => {
    const allCircles = circlesService.getAllCircles();
    return allCircles.filter(circle => circle.members.includes(userId));
  },

  // Get circle by ID
  getCircleById: (circleId: string): Circle | null => {
    const allCircles = circlesService.getAllCircles();
    return allCircles.find(circle => circle.id === circleId) || null;
  },

  // Create new circle
  createCircle: (
    name: string,
    description: string,
    createdBy: string,
    maxMembers: number = 12
  ): Circle => {
    const allCircles = circlesService.getAllCircles();

    const newCircle: Circle = {
      id: `circle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      members: [createdBy], // Creator is automatically a member
      maxMembers,
      createdBy,
      createdAt: new Date().toISOString()
    };

    allCircles.push(newCircle);
    storage.set(CIRCLES_KEY, allCircles);

    return newCircle;
  },

  // Add member to circle
  addMember: (circleId: string, userId: string): { success: boolean; error?: string } => {
    const allCircles = circlesService.getAllCircles();
    const circleIndex = allCircles.findIndex(circle => circle.id === circleId);

    if (circleIndex === -1) {
      return { success: false, error: 'Circle not found' };
    }

    const circle = allCircles[circleIndex];

    if (circle.members.includes(userId)) {
      return { success: false, error: 'User already in circle' };
    }

    if (circle.members.length >= circle.maxMembers) {
      return { success: false, error: 'Circle is full' };
    }

    circle.members.push(userId);
    storage.set(CIRCLES_KEY, allCircles);

    return { success: true };
  },

  // Remove member from circle
  removeMember: (circleId: string, userId: string): boolean => {
    const allCircles = circlesService.getAllCircles();
    const circleIndex = allCircles.findIndex(circle => circle.id === circleId);

    if (circleIndex === -1) return false;

    const circle = allCircles[circleIndex];
    circle.members = circle.members.filter(id => id !== userId);
    
    storage.set(CIRCLES_KEY, allCircles);
    return true;
  },

  // Delete circle
  deleteCircle: (circleId: string): boolean => {
    const allCircles = circlesService.getAllCircles();
    const filteredCircles = allCircles.filter(circle => circle.id !== circleId);

    if (filteredCircles.length === allCircles.length) return false;

    storage.set(CIRCLES_KEY, filteredCircles);
    return true;
  }
};

// --- utils/gardenTime.ts ---
// NON-LINEAR TIME - Gardens don't measure time with clocks
// Replace all temporal indicators with garden rhythms

export interface GardenNote {
  id: string;
  updatedAt: string;
  state: 'seed' | 'sprout' | 'bloom';
  tendedBy?: any[];
}

/**
 * Calculate warmth/temperature of a note based on when it was last tended
 * Returns a color temperature value that can be applied visually
 * Recently tended = warmer (amber/gold tints)
 * Untended = cooler (blue/grey tints)
 */
export function calculateNoteWarmth(lastTendedDate: string): {
  temperature: 'warm' | 'mild' | 'cool' | 'cold';
  colorTint: string; // CSS color for overlay
  glowIntensity: number; // 0-1 for glow effect
} {
  const now = new Date().getTime();
  const lastTended = new Date(lastTendedDate).getTime();
  const hoursSince = (now - lastTended) / (1000 * 60 * 60);

  // Warm: tended within 24 hours
  if (hoursSince < 24) {
    return {
      temperature: 'warm',
      colorTint: 'rgba(196, 164, 108, 0.15)', // Golden amber
      glowIntensity: 0.8,
    };
  }
  
  // Mild: tended within 7 days
  if (hoursSince < 24 * 7) {
    return {
      temperature: 'mild',
      colorTint: 'rgba(196, 164, 108, 0.08)', // Subtle gold
      glowIntensity: 0.4,
    };
  }
  
  // Cool: tended within 30 days
  if (hoursSince < 24 * 30) {
    return {
      temperature: 'cool',
      colorTint: 'rgba(139, 157, 195, 0.05)', // Subtle blue
      glowIntensity: 0.1,
    };
  }
  
  // Cold: untended for over 30 days
  return {
    temperature: 'cold',
    colorTint: 'rgba(100, 110, 130, 0.08)', // Grey-blue
    glowIntensity: 0,
  };
}

/**
 * Calculate the current season of a garden based on activity patterns
 * NOT based on calendar dates - based on what's growing
 */
export function calculateGardenSeason(notes: GardenNote[]): {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  description: string;
  icon: string;
} {
  if (notes.length === 0) {
    return {
      season: 'winter',
      description: 'Awaiting the first seeds',
      icon: '❄️',
    };
  }

  const seedCount = notes.filter(n => n.state === 'seed').length;
  const sproutCount = notes.filter(n => n.state === 'sprout').length;
  const bloomCount = notes.filter(n => n.state === 'bloom').length;
  const totalCount = notes.length;

  const seedRatio = seedCount / totalCount;
  const sproutRatio = sproutCount / totalCount;
  const bloomRatio = bloomCount / totalCount;

  // Spring: Many seeds germinating (>50% seeds)
  if (seedRatio > 0.5) {
    return {
      season: 'spring',
      description: 'Seeds are germinating',
      icon: '🌱',
    };
  }

  // Summer: Active growth, sprouts dominant (>40% sprouts)
  if (sproutRatio > 0.4) {
    return {
      season: 'summer',
      description: 'Growth is abundant',
      icon: '☀️',
    };
  }

  // Autumn: Blooms harvesting (>30% blooms)
  if (bloomRatio > 0.3) {
    return {
      season: 'autumn',
      description: 'The garden blooms',
      icon: '🍂',
    };
  }

  // Winter: Low activity or balanced (no dominant stage)
  return {
    season: 'winter',
    description: 'Quiet contemplation',
    icon: '❄️',
  };
}

/**
 * Calculate garden maturity based on age and activity
 * Replace "member since 2024" with growth metaphors
 */
export function calculateGardenMaturity(
  createdAt: string,
  noteCount: number,
  connectionCount: number
): {
  stage: 'freshly-planted' | 'taking-root' | 'established' | 'ancient';
  label: string;
  description: string;
} {
  const now = new Date().getTime();
  const created = new Date(createdAt).getTime();
  const daysSince = (now - created) / (1000 * 60 * 60 * 24);
  
  // Activity score: notes + connections
  const activityScore = noteCount + (connectionCount * 2);

  // Ancient grove: >180 days AND high activity
  if (daysSince > 180 && activityScore > 50) {
    return {
      stage: 'ancient',
      label: 'Ancient Grove',
      description: 'Deep roots, many stories',
    };
  }

  // Well-established: >60 days with good activity
  if (daysSince > 60 && activityScore > 20) {
    return {
      stage: 'established',
      label: 'Well-Established',
      description: 'This garden has found its rhythm',
    };
  }

  // Taking root: >14 days OR moderate activity
  if (daysSince > 14 || activityScore > 5) {
    return {
      stage: 'taking-root',
      label: 'Taking Root',
      description: 'Beginning to grow',
    };
  }

  // Freshly planted: new garden
  return {
    stage: 'freshly-planted',
    label: 'Freshly Planted',
    description: 'A new garden begins',
  };
}

/**
 * Sort options that don't rely on dates
 */
export type GardenSortOption = 
  | 'connection-density'  // Most connected pieces first
  | 'recently-tended'     // Most recently tended (warmth)
  | 'deepest-roots'       // Oldest connections first
  | 'discovery';          // Random/serendipitous

export function sortNotesByGardenLogic(
  notes: GardenNote[],
  sortBy: GardenSortOption
): GardenNote[] {
  const sorted = [...notes];

  switch (sortBy) {
    case 'connection-density':
      // Most connected first (would need connection data)
      return sorted; // Placeholder
    
    case 'recently-tended':
      // Sort by warmth (most recent first)
      return sorted.sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });
    
    case 'deepest-roots':
      // Oldest connections first
      return sorted.sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return aTime - bTime;
      });
    
    case 'discovery':
      // Shuffle randomly for serendipitous discovery
      return sorted.sort(() => Math.random() - 0.5);
    
    default:
      return sorted;
  }
}

/**
 * Format Quiet Hours as garden dormancy
 */
export function isGardenResting(quietHours?: { start: string; end: string }): boolean {
  if (!quietHours) return false;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  const [startHour, startMinute] = quietHours.start.split(':').map(Number);
  const startTime = startHour * 60 + startMinute;
  
  const [endHour, endMinute] = quietHours.end.split(':').map(Number);
  const endTime = endHour * 60 + endMinute;
  
  // Handle overnight quiet hours
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime;
  }
  
  return currentTime >= startTime && currentTime < endTime;
}

// --- utils/harvest.ts ---
// Analytics/Harvest utility for The Garden
import { notesService, GardenNote } from './notes';

export interface HarvestAnalytics {
  totalNotes: number;
  notesByState: {
    seed: number;
    sprout: number;
    bloom: number;
  };
  totalWordCount: number;
  mostUsedTags: { tag: string; count: number }[];
  writingStreak: number;
  mostRevisitedNotes: GardenNote[];
  monthlyActivity: { month: string; count: number }[];
  recurringThemes: { tag: string; frequency: number }[];
}

export const harvestService = {
  // Get comprehensive analytics for a user
  getAnalytics: (userId: string): HarvestAnalytics => {
    const notes = notesService.getNotes(userId);

    return {
      totalNotes: notes.length,
      notesByState: harvestService.countByState(notes),
      totalWordCount: harvestService.calculateTotalWords(notes),
      mostUsedTags: harvestService.getTopTags(notes, 10),
      writingStreak: harvestService.calculateStreak(notes),
      mostRevisitedNotes: harvestService.getMostRevisited(notes, 5),
      monthlyActivity: harvestService.getMonthlyActivity(notes),
      recurringThemes: harvestService.getRecurringThemes(notes)
    };
  },

  // Count notes by state
  countByState: (notes: GardenNote[]) => {
    return {
      seed: notes.filter(n => n.state === 'seed').length,
      sprout: notes.filter(n => n.state === 'sprout').length,
      bloom: notes.filter(n => n.state === 'bloom').length
    };
  },

  // Calculate total word count
  calculateTotalWords: (notes: GardenNote[]): number => {
    return notes.reduce((sum, note) => sum + note.wordCount, 0);
  },

  // Get top N most used tags
  getTopTags: (notes: GardenNote[], limit: number = 10): { tag: string; count: number }[] => {
    const tagCounts = new Map<string, number>();

    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  // Calculate writing streak (consecutive days)
  calculateStreak: (notes: GardenNote[]): number => {
    if (notes.length === 0) return 0;

    // Get unique dates when user wrote
    const dates = notes
      .map(note => new Date(note.createdAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date();

    for (const dateStr of dates) {
      const noteDate = new Date(dateStr);
      const diffDays = Math.floor((currentDate.getTime() - noteDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  },

  // Get most revisited notes
  getMostRevisited: (notes: GardenNote[], limit: number = 5): GardenNote[] => {
    return notes
      .sort((a, b) => b.revisitCount - a.revisitCount)
      .slice(0, limit);
  },

  // Get monthly activity (last 12 months)
  getMonthlyActivity: (notes: GardenNote[]): { month: string; count: number }[] => {
    const monthCounts = new Map<string, number>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize last 12 months
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthCounts.set(key, 0);
    }

    // Count notes per month
    notes.forEach(note => {
      const date = new Date(note.createdAt);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (monthCounts.has(key)) {
        monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
      }
    });

    return Array.from(monthCounts.entries()).map(([month, count]) => ({ month, count }));
  },

  // Get recurring themes based on tag frequency
  getRecurringThemes: (notes: GardenNote[]): { tag: string; frequency: number }[] => {
    const topTags = harvestService.getTopTags(notes, 5);
    return topTags.map(({ tag, count }) => ({
      tag,
      frequency: Math.round((count / notes.length) * 100)
    }));
  }
};

// --- utils/notes.ts ---
// Notes system for The Garden
import { storage } from './storage';

export type NoteState = 'seed' | 'sprout' | 'bloom';
export type ResponseLevel = 'silent' | 'close_circle' | 'private_annotations';
export type NoteVisibility = 'private' | 'garden' | 'circle';
export type WorkType = 'poetry' | 'prose' | 'fragment' | 'essay' | 'fiction' | 'personal' | 'experimental';

export interface NoteVersion {
  content: string;
  savedAt: string;
}

// CROSS-POLLINATION SOCIAL LAYER - garden verbs, not social media verbs
export interface TendAction {
  userId: string;
  userName: string;
  tendedAt: string;
}

export interface GraftConnection {
  fromNoteId: string;
  fromNoteTitle: string;
  fromUserId: string;
  fromUserName: string;
  graftedAt: string;
}

export interface GardenNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  state: NoteState;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  revisitCount: number;
  isPublic: boolean;
  sharedWithCircles: string[];
  responseLevel: ResponseLevel;
  versions: NoteVersion[];
  // Connection system - friction is the product
  growsFrom: string[]; // IDs of notes this grows from
  growsInto: string[]; // IDs of notes that grow from this
  revisitDate?: string | null;
  // CRITICAL: Publishing choice - nothing public unless explicitly chosen
  visibility: NoteVisibility; // 'private' (default), 'garden' (explore page), 'circle' (specific circles)
  // CROSS-POLLINATION SOCIAL ACTIONS
  tendedBy: TendAction[]; // Who has tended this note (spent time with it)
  graftedFrom?: GraftConnection; // If this note was grafted from another
  graftedTo: string[]; // IDs of notes that were grafted from this one
  transplantHistory: string[]; // History of moves between circles/gallery
  workType: WorkType; // Type of work this note represents
}

const NOTES_KEY = 'garden_notes';

export const notesService = {
  // Get all notes
  getAllNotes: (): GardenNote[] => {
    return storage.get<GardenNote[]>(NOTES_KEY) || [];
  },

  // Get notes by user ID
  getNotes: (userId: string): GardenNote[] => {
    const allNotes = notesService.getAllNotes();
    return allNotes.filter(note => note.userId === userId);
  },

  // Get note by ID
  getNoteById: (noteId: string): GardenNote | null => {
    const allNotes = notesService.getAllNotes();
    return allNotes.find(note => note.id === noteId) || null;
  },

  // Create new note
  createNote: (
    userId: string,
    title: string = 'Untitled',
    content: string = '',
    state: NoteState = 'seed'
  ): GardenNote => {
    const allNotes = notesService.getAllNotes();
    
    const newNote: GardenNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      content,
      state,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: notesService.calculateWordCount(content),
      revisitCount: 0,
      isPublic: false,
      sharedWithCircles: [],
      responseLevel: 'silent',
      versions: [],
      growsFrom: [],
      growsInto: [],
      revisitDate: null,
      visibility: 'private',
      // CROSS-POLLINATION SOCIAL ACTIONS
      tendedBy: [],
      graftedTo: [],
      transplantHistory: [],
      workType: 'prose' // Default work type
    };

    allNotes.push(newNote);
    storage.set(NOTES_KEY, allNotes);

    return newNote;
  },

  // Update note
  updateNote: (noteId: string, updates: Partial<GardenNote>): GardenNote | null => {
    const allNotes = notesService.getAllNotes();
    const noteIndex = allNotes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) return null;

    const currentNote = allNotes[noteIndex];
    
    // Save version if content changed
    if (updates.content && updates.content !== currentNote.content) {
      currentNote.versions.push({
        content: currentNote.content,
        savedAt: new Date().toISOString()
      });
    }

    // Update word count if content changed
    if (updates.content) {
      updates.wordCount = notesService.calculateWordCount(updates.content);
    }

    const updatedNote = {
      ...currentNote,
      ...updates,
      updatedAt: new Date().toISOString(),
      revisitCount: currentNote.revisitCount + 1
    };

    allNotes[noteIndex] = updatedNote;
    storage.set(NOTES_KEY, allNotes);

    return updatedNote;
  },

  // Delete note
  deleteNote: (noteId: string): boolean => {
    const allNotes = notesService.getAllNotes();
    const filteredNotes = allNotes.filter(note => note.id !== noteId);

    if (filteredNotes.length === allNotes.length) return false;

    storage.set(NOTES_KEY, filteredNotes);
    return true;
  },

  // Change note state
  changeNoteState: (noteId: string, newState: NoteState): GardenNote | null => {
    return notesService.updateNote(noteId, { state: newState });
  },

  // Calculate word count
  calculateWordCount: (content: string): number => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(word => word.length > 0).length;
  },

  // Get notes by state
  getNotesByState: (userId: string, state: NoteState): GardenNote[] => {
    return notesService.getNotes(userId).filter(note => note.state === state);
  },

  // Get notes by tag
  getNotesByTag: (userId: string, tag: string): GardenNote[] => {
    return notesService.getNotes(userId).filter(note => note.tags.includes(tag));
  },

  // Search notes
  searchNotes: (userId: string, query: string): GardenNote[] => {
    const lowerQuery = query.toLowerCase();
    return notesService.getNotes(userId).filter(note => 
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // Get all tags for a user
  getUserTags: (userId: string): string[] => {
    const notes = notesService.getNotes(userId);
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }
};

// --- utils/quietHours.ts ---
// Quiet Hours system for The Garden
import { storage } from './storage';

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  daysOfWeek: number[]; // 0-6, where 0 is Sunday
}

const QUIET_HOURS_KEY = 'garden_quiet_hours';

export const quietHoursService = {
  // Get quiet hours settings
  getQuietHours: (): QuietHours => {
    return storage.get<QuietHours>(QUIET_HOURS_KEY) || {
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6] // All days
    };
  },

  // Update quiet hours settings
  updateQuietHours: (settings: Partial<QuietHours>): QuietHours => {
    const current = quietHoursService.getQuietHours();
    const updated = { ...current, ...settings };
    storage.set(QUIET_HOURS_KEY, updated);
    return updated;
  },

  // Check if currently in quiet hours
  isQuietTime: (): boolean => {
    const settings = quietHoursService.getQuietHours();
    
    if (!settings.enabled) return false;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Check if today is in the enabled days
    if (!settings.daysOfWeek.includes(currentDay)) return false;

    // Parse times
    const [startHour, startMin] = settings.startTime.split(':').map(Number);
    const [endHour, endMin] = settings.endTime.split(':').map(Number);
    const [currentHour, currentMin] = currentTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const currentMinutes = currentHour * 60 + currentMin;

    // Handle cases where end time is on the next day
    if (endMinutes < startMinutes) {
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }
};

// --- utils/sampleData.ts ---
// Sample data for The Garden with varied work types

import { GardenNote, WorkType } from './notes';

export const sampleNotes: Partial<GardenNote>[] = [
  {
    id: 'sample_1',
    title: 'Morning Light Through Kitchen Window',
    content: 'The way sunlight catches dust particles / suspended in air like tiny galaxies / Each mote a world unto itself / spinning through the breakfast hour',
    workType: 'poetry',
    state: 'bloom',
    tags: ['morning', 'observation', 'light'],
    visibility: 'garden',
    wordCount: 28,
  },
  {
    id: 'sample_2',
    title: 'On the Ethics of Silence',
    content: 'There are moments when speaking feels like an intrusion—not into conversation, but into the fabric of what exists between people. I have been thinking about how silence operates as its own language, complete with grammar and syntax we barely acknowledge...',
    workType: 'essay',
    state: 'sprout',
    tags: ['philosophy', 'language', 'communication'],
    visibility: 'garden',
    wordCount: 156,
  },
  {
    id: 'sample_3',
    title: 'The thing about trains',
    content: 'is how they make you believe in linear time again. A to B. Departure and arrival. No scrolling back, no refresh.',
    workType: 'fragment',
    state: 'seed',
    tags: ['transit', 'time', 'observation'],
    visibility: 'private',
    wordCount: 24,
  },
  {
    id: 'sample_4',
    title: 'The Last Coffee Shop',
    content: 'Margaret had been coming to Rosie\'s for thirty years, always ordering the same thing: black coffee, no sugar, and whatever pie was fresh. She didn\'t know that today the shop would close forever, or that the waitress serving her had been working up the courage to ask about Margaret\'s life all this time...',
    workType: 'fiction',
    state: 'bloom',
    tags: ['character study', 'endings', 'nostalgia'],
    visibility: 'garden',
    wordCount: 178,
  },
  {
    id: 'sample_5',
    title: 'What I Remember About Being 7',
    content: 'The carpet in my grandmother\'s living room. How it smelled like dust and decades. The way she\'d let me eat cookies before dinner because "rules are for people who forgot how to live." I didn\'t understand what that meant then. I think I\'m starting to now.',
    workType: 'personal',
    state: 'sprout',
    tags: ['memory', 'family', 'childhood'],
    visibility: 'garden',
    wordCount: 67,
  },
  {
    id: 'sample_6',
    title: '01001000 01100101 01101100 01101100 01101111',
    content: 'what if every word / was actually / a number / pretending / to be / a feeling / and we all just / agreed / to play along',
    workType: 'experimental',
    state: 'bloom',
    tags: ['language', 'form', 'digital'],
    visibility: 'garden',
    wordCount: 22,
  },
  {
    id: 'sample_7',
    title: 'Draft: The Architecture of Forgetting',
    content: 'Memory as building. Forgetting as demolition. But what if it\'s more like renovation? You don\'t tear down the whole structure—you repurpose, rearrange, let new light in through old windows. Some rooms you wall off entirely. Others you expand until they swallow adjacent spaces...',
    workType: 'prose',
    state: 'sprout',
    tags: ['memory', 'metaphor', 'architecture'],
    visibility: 'garden',
    wordCount: 98,
  },
  {
    id: 'sample_8',
    title: 'Instructions for Growing a Garden in Your Chest',
    content: '1. Locate the hollow space between your ribs\n2. Plant something small\n3. Water with salt\n4. Wait\n5. Do not dig it up to check if it\'s growing\n6. Wait longer\n7. Feel the first green shoots pressing against bone\n8. Learn to breathe around them',
    workType: 'poetry',
    state: 'bloom',
    tags: ['body', 'growth', 'instruction'],
    visibility: 'garden',
    wordCount: 56,
  },
  {
    id: 'sample_9',
    title: 'Why We Talk About Weather',
    content: 'It\'s not because we care about meteorology. It\'s because we need a language for "I acknowledge your existence" that doesn\'t demand vulnerability. The weather is neutral territory. Safe. Shared. Nobody has to reveal anything beyond "yes, it is raining."',
    workType: 'essay',
    state: 'sprout',
    tags: ['social', 'communication', 'observation'],
    visibility: 'garden',
    wordCount: 52,
  },
  {
    id: 'sample_10',
    title: 'Untitled (Tuesday)',
    content: 'I keep starting sentences and deleting them.',
    workType: 'fragment',
    state: 'seed',
    tags: ['draft', 'process'],
    visibility: 'private',
    wordCount: 7,
  },
  {
    id: 'sample_11',
    title: 'The Woman Who Collected Silence',
    content: 'She stored it in glass jars, labeled by location and date. "Library Reading Room, March 14th." "Empty Church, 3am." "Snow falling, no one watching." Her apartment was full of them, shelves and shelves of carefully preserved quiet. When asked why, she said she was building an archive of what would be lost.',
    workType: 'fiction',
    state: 'bloom',
    tags: ['character', 'collection', 'silence'],
    visibility: 'garden',
    wordCount: 67,
  },
  {
    id: 'sample_12',
    title: 'Things My Mother Never Said Out Loud',
    content: 'But I heard them anyway in the way she washed dishes—the particular violence of scrubbing that meant disappointment. In how she folded laundry: sharp corners for anger, loose edges for resignation. The whole emotional vocabulary of a woman who was taught that speaking your mind was the same as losing it.',
    workType: 'personal',
    state: 'bloom',
    tags: ['mother', 'silence', 'family'],
    visibility: 'garden',
    wordCount: 67,
  },
];

export const getRandomWorkType = (): WorkType => {
  const types: WorkType[] = ['poetry', 'prose', 'fragment', 'essay', 'fiction', 'personal', 'experimental'];
  return types[Math.floor(Math.random() * types.length)];
};

export const workTypeColors: Record<WorkType, { bg: string; text: string; border: string }> = {
  poetry: { bg: 'rgba(139, 92, 246, 0.1)', text: '#a78bfa', border: 'rgba(139, 92, 246, 0.3)' },
  prose: { bg: 'rgba(196, 164, 108, 0.1)', text: '#c4a46c', border: 'rgba(196, 164, 108, 0.3)' },
  fragment: { bg: 'rgba(139, 157, 195, 0.1)', text: '#8b9dc3', border: 'rgba(139, 157, 195, 0.3)' },
  essay: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
  fiction: { bg: 'rgba(236, 72, 153, 0.1)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.3)' },
  personal: { bg: 'rgba(122, 155, 118, 0.1)', text: '#7a9b76', border: 'rgba(122, 155, 118, 0.3)' },
  experimental: { bg: 'rgba(14, 165, 233, 0.1)', text: '#0ea5e9', border: 'rgba(14, 165, 233, 0.3)' },
};

export const workTypeLabels: Record<WorkType, string> = {
  poetry: 'Poetry',
  prose: 'Prose',
  fragment: 'Fragment',
  essay: 'Essay',
  fiction: 'Fiction',
  personal: 'Personal',
  experimental: 'Experimental',
};

// --- utils/storage.ts ---
// localStorage utility functions for The Garden

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};


    // --- pages/NewGardenSignInPage.tsx ---
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function NewGardenSignInPage() {
  const { signIn, supabase } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
            window.location.href = '/garden/dashboard';
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/garden/dashboard' }
      });
      if (error) { setError(error.message); setLoading(false); return; }
      if (!data?.url) { setError('Google sign-in not available'); setLoading(false); return; }
      window.location.href = data.url;
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  const handleGithubSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin + '/garden/dashboard' }
      });
      if (error) { setError(error.message); setLoading(false); return; }
      if (!data?.url) { setError('GitHub sign-in not available'); setLoading(false); return; }
      window.location.href = data.url;
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] relative">
      <a href="/" className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#E5E0DA] rounded-full hover:bg-white transition-colors text-[#2C2C2C] font-['Inter'] text-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to Gallery
      </a>
      <div className="flex items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-[#7A9E7E] text-2xl">🌱</span>
            <a href="/" className="font-['Playfair_Display'] italic text-xl text-[#2C2C2C]">garden</a>
          </div>
          <h1 className="font-['Playfair_Display'] italic text-4xl text-center text-[#2C2C2C] mb-2">Welcome back</h1>
          <p className="font-['Inter'] text-center text-[#9B9B9B] mb-8">Return to your garden</p>
          <div className="bg-white rounded-2xl border border-[#E5E0DA] p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">Email</label>
                <input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-base text-[#2C2C2C] rounded-lg transition-colors" placeholder="your@email.com" required />
              </div>
              <div>
                <label htmlFor="password" className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">Password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 pr-12 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-base text-[#2C2C2C] rounded-lg transition-colors" placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-[#2C2C2C] transition-colors">
                    {showPassword ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.rememberMe} onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })} className="w-4 h-4 border-2 border-[#E5E0DA] rounded text-[#7A9E7E]" />
                  <span className="font-['Inter'] text-[#6B6B6B]">Remember me</span>
                </label>
                <a href="/garden/forgot-password" className="font-['Inter'] text-[#7A9E7E] hover:text-[#5C8260] transition-colors">Forgot password?</a>
              </div>
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#C4956A] hover:bg-[#B8895E] disabled:opacity-50 text-white font-['Courier_New'] text-sm uppercase tracking-[0.15em] rounded-lg transition-colors cursor-pointer">
                {loading ? 'Signing in...' : 'Return to your garden'}
              </button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E0DA]" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white font-['Inter'] text-[#9B9B9B] text-xs">or continue with</span></div>
            </div>
            <div className="space-y-3">
              <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 18 18"><g fill="none"><path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></g></svg>
                <span className="font-['Inter'] text-sm text-[#2C2C2C]">Continue with Google</span>
              </button>
              <button type="button" onClick={handleGithubSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#2C2C2C"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span className="font-['Inter'] text-sm text-[#2C2C2C]">Continue with GitHub</span>
              </button>
            </div>
          </div>
          <p className="mt-8 text-center font-['Inter'] text-sm text-[#9B9B9B]">
            New here?{' '}<a href="/garden/signup" className="text-[#7A9E7E] hover:text-[#5C8260] font-semibold transition-colors">Plant your first seed</a>
          </p>
        </div>
      </div>
    </div>
  );
}

    // ==================== SIGN UP PAGE ====================
const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: window.location.origin + '/garden/dashboard'
        }
      });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data?.user) {
        window.location.href = '/garden/verify-email';
      }
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-['Fraunces'] text-4xl text-white mb-2">Create Account</h1>
          <p className="font-['Inter'] text-[#9B9B9B]">Join our community of writers</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-['Inter'] text-sm text-[#9B9B9B] mb-1">Display Name</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#3C3C3C] rounded-lg font-['Inter'] text-white focus:outline-none focus:border-[#7A9E7E]" placeholder="Your name" required />
          </div>
          <div>
            <label className="block font-['Inter'] text-sm text-[#9B9B9B] mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#3C3C3C] rounded-lg font-['Inter'] text-white focus:outline-none focus:border-[#7A9E7E]" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block font-['Inter'] text-sm text-[#9B9B9B] mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#3C3C3C] rounded-lg font-['Inter'] text-white focus:outline-none focus:border-[#7A9E7E]" placeholder="At least 6 characters" required />
          </div>
          <div>
            <label className="block font-['Inter'] text-sm text-[#9B9B9B] mb-1">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#3C3C3C] rounded-lg font-['Inter'] text-white focus:outline-none focus:border-[#7A9E7E]" placeholder="Confirm your password" required />
          </div>
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#C4956A] hover:bg-[#B8895E] disabled:opacity-50 rounded-lg font-['Inter'] text-white font-medium">{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p className="mt-6 text-center font-['Inter'] text-sm text-[#9B9B9B]">Already have an account?{' '}<a href="/garden/signin" className="text-[#7A9E7E] hover:text-[#5C8260] font-semibold">Sign in</a></p>
      </div>
    </div>
  );
}

// ==================== FORGOT PASSWORD PAGE ====================
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/garden/reset-password'
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess(true);
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#7A9E7E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7A9E7E" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h1 className="font-['Fraunces'] text-3xl text-white mb-4">Check your email</h1>
          <p className="font-['Inter'] text-[#9B9B9B] mb-6">We've sent a password reset link to {email}</p>
          <a href="/garden/signin" className="inline-block px-6 py-3 bg-[#2C2C2C] hover:bg-[#3C3C3C] rounded-lg font-['Inter'] text-white">Back to Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-['Fraunces'] text-4xl text-white mb-2">Reset Password</h1>
          <p className="font-['Inter'] text-[#9B9B9B]">Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-['Inter'] text-sm text-[#9B9B9B] mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#3C3C3C] rounded-lg font-['Inter'] text-white focus:outline-none focus:border-[#7A9E7E]" placeholder="you@example.com" required />
          </div>
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#C4956A] hover:bg-[#B8895E] disabled:opacity-50 rounded-lg font-['Inter'] text-white font-medium">{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>
        <p className="mt-6 text-center font-['Inter'] text-sm text-[#9B9B9B]"><a href="/garden/signin" className="text-[#7A9E7E] hover:text-[#5C8260] font-semibold">Back to Sign In</a></p>
      </div>
    </div>
  );
}

// ==================== RESET PASSWORD PAGE ====================
const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess(true);
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#7A9E7E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7A9E7E" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h1 className="font-['Fraunces'] text-3xl text-white mb-4">Password Updated</h1>
          <p className="font-['Inter'] text-[#9B9B9B] mb-6">Your password has been successfully reset</p>
          <a href="/garden/signin" className="inline-block px-6 py-3 bg-[#C4956A] hover:bg-[#B8895E] rounded-lg font-['Inter'] text-white">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-['Fraunces'] text-4xl text-white mb-2">New Password</h1>
          <p className="font-['Inter'] text-[#9B9B9B]">Enter your new password below</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-['Inter'] text-sm text-[#9B9B9B] mb-1">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#3C3C3C] rounded-lg font-['Inter'] text-white focus:outline-none focus:border-[#7A9E7E]" placeholder="At least 6 characters" required />
          </div>
          <div>
            <label className="block font-['Inter'] text-sm text-[#9B9B9B] mb-1">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#3C3C3C] rounded-lg font-['Inter'] text-white focus:outline-none focus:border-[#7A9E7E]" placeholder="Confirm password" required />
          </div>
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#C4956A] hover:bg-[#B8895E] disabled:opacity-50 rounded-lg font-['Inter'] text-white font-medium">{loading ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  );
}

// ==================== VERIFY EMAIL PAGE ====================
const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-[#7A9E7E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7A9E7E" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
        </div>
        <h1 className="font-['Fraunces'] text-3xl text-white mb-4">Check your email</h1>
        <p className="font-['Inter'] text-[#9B9B9B] mb-6">We've sent you a verification link. Please check your inbox and click the link to verify your email address.</p>
        <a href="/garden/signin" className="inline-block px-6 py-3 bg-[#2C2C2C] hover:bg-[#3C3C3C] rounded-lg font-['Inter'] text-white">Back to Sign In</a>
      </div>
    </div>
  );
}

// ==================== DASHBOARD PAGE ====================
const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/garden/signin';
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/garden/signin';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7A9E7E]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C]">
      <nav className="border-b border-[#2C2C2C] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-['Fraunces'] text-2xl text-white">Garden</h1>
          <div className="flex items-center gap-4">
            <span className="font-['Inter'] text-sm text-[#9B9B9B]">{user?.email}</span>
            <button onClick={handleSignOut} className="px-4 py-2 bg-[#2C2C2C] hover:bg-[#3C3C3C] rounded-lg font-['Inter'] text-sm text-white">Sign Out</button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="font-['Fraunces'] text-3xl text-white mb-2">Welcome back</h2>
          <p className="font-['Inter'] text-[#9B9B9B]">Your writing journey continues here</p>
        </div>
        <div className="grid gap-6">
          <div className="bg-[#2C2C2C] rounded-xl p-6 border border-[#3C3C3C]">
            <h3 className="font-['Fraunces'] text-xl text-white mb-4">Quick Actions</h3>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-[#C4956A] hover:bg-[#B8895E] rounded-lg font-['Inter'] text-white">New Post</button>
              <button className="px-4 py-2 bg-[#3C3C3C] hover:bg-[#4C4C4C] rounded-lg font-['Inter'] text-white">View Drafts</button>
            </div>
          </div>
          <div className="bg-[#2C2C2C] rounded-xl p-6 border border-[#3C3C3C]">
            <h3 className="font-['Fraunces'] text-xl text-white mb-4">Recent Posts</h3>
            {posts.length === 0 ? (
              <p className="font-['Inter'] text-[#9B9B9B]">No posts yet. Start writing!</p>
            ) : (
              <div className="space-y-4">{posts.map((post, i) => (<div key={i} className="p-4 bg-[#1C1C1C] rounded-lg"><h4 className="font-['Inter'] text-white">{post.title}</h4></div>))}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ==================== EXPORTS ====================
export {
  // Utilities
  supabase,
  LocalStorage,
  
  // Authentication Pages
  SignInPage,
  SignUpPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
  DashboardPage,
};

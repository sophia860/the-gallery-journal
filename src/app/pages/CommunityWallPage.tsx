import { useState } from 'react';
import { Heart, Lock, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { GalleryNav } from '../components/GalleryNav';
import { Footer } from '../components/Footer';

// Community pieces - ONLY submitted and published (NO DRAFTS EVER)
const communityPieces = [
  {
    id: '2',
    title: 'Love Letter at 3AM',
    author: 'David Park',
    authorInitials: 'DP',
    authorColor: '#C4918A',
    status: 'published',
    category: 'Love & Relationships',
    excerpt: "I'm writing this at 3am because I can't sleep without telling you: You are the answer to questions I didn't know I was asking.",
    sharedAt: '2026-01-25T10:00:00Z',
    hearts: 24,
    hasHearted: true
  },
  {
    id: '4',
    title: 'After the Funeral',
    author: 'Sarah Williams',
    authorInitials: 'SW',
    authorColor: '#A8998F',
    status: 'published',
    category: 'Grief, Loss & Memory',
    excerpt: 'We sit in the living room, talking about everything except the empty chair.',
    sharedAt: '2026-01-23T09:15:00Z',
    hearts: 31,
    hasHearted: true
  },
  {
    id: '5',
    title: 'Morning Ritual',
    author: 'Chen Wei',
    authorInitials: 'CW',
    authorColor: '#8A9A7B',
    status: 'published',
    category: 'Time & Mortality',
    excerpt: 'Each day I wake and wonder if today will be the day I become the person I imagine.',
    sharedAt: '2026-02-07T08:00:00Z',
    hearts: 12,
    hasHearted: false
  },
  {
    id: '10',
    title: 'Sunday Afternoon',
    author: 'Robert Chen',
    authorInitials: 'RC',
    authorColor: '#A8998F',
    status: 'published',
    category: 'Self & Introspection',
    excerpt: 'My son asks me why the sky is blue. I give him science; he wanted poetry.',
    sharedAt: '2026-02-06T09:45:00Z',
    hearts: 27,
    hasHearted: true
  },
  {
    id: '12',
    title: 'The Space Between',
    author: 'Luna Martinez',
    authorInitials: 'LM',
    authorColor: '#8A9A7B',
    status: 'published',
    category: 'Time & Mortality',
    excerpt: "There's a moment between sleeping and waking when I forget everything.",
    sharedAt: '2026-01-30T12:00:00Z',
    hearts: 20,
    hasHearted: true
  }
];

type SortBy = 'newest' | 'most_appreciated' | 'category';
type StatusFilter = 'all' | 'submitted' | 'under_review' | 'published';

const statusStyles = {
  submitted: 'bg-blue-500/10 text-blue-700 border-blue-500',
  under_review: 'bg-purple-500/10 text-purple-700 border-purple-500',
  published: 'bg-green-500/10 text-green-700 border-green-500',
};

const statusLabels = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  published: 'Published',
};

export function CommunityWallPage() {
  const { user } = useAuth();
  const { hasActiveSubscription, loading: subscriptionLoading } = useSubscription();
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('published');
  const [pieces, setPieces] = useState(communityPieces);

  // Auth Gate - Unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <GalleryNav />
        
        <div className="flex-1 flex items-center justify-center px-8 py-32">
          <div className="max-w-2xl text-center">
            <svg
              className="w-20 h-20 mx-auto mb-8 text-[#E11D48]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h1 className="font-['Cardo'] text-6xl text-[#2C2C2C] mb-4 italic">
              The Writers' Salon
            </h1>
            <p className="font-['Libre_Baskerville'] text-xl text-[#717171] mb-8 italic">
              A Private Community Space
            </p>
            <div className="border-t border-b border-[#E0D8D0] py-8 mb-12">
              <p className="font-['Libre_Baskerville'] text-base text-[#717171] leading-relaxed">
                Welcome to our writers' salon-a private, intimate space where community members share work, offer appreciation, and grow together.
                <br />
                <br />
                Sign in to join the conversation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="/signin?redirect=/community-wall"
                className="px-8 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Courier_New'] text-sm tracking-wider shadow-lg hover:shadow-xl inline-block"
              >
                SIGN IN TO ENTER
              </a>
              <a
                href="/"
                className="px-8 py-4 border-2 border-[#E0D8D0] text-[#2C2C2C] hover:border-[#C4918A] transition-colors font-['Courier_New'] text-sm tracking-wider inline-block"
              >
                RETURN TO THE GALLERY
              </a>
            </div>
            <p className="text-xs text-[#717171] font-['Inter'] italic">
              A velvet rope at an intimate literary salon
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Subscription Gate - Authenticated but not subscribed
  if (!subscriptionLoading && !hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <GalleryNav />
        
        <div className="flex-1 flex items-center justify-center px-8 py-32">
          <div className="max-w-2xl text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-8 text-[#C4918A]" />
            <h1 className="font-['Cardo'] text-5xl text-[#2C2C2C] mb-4 italic">
              Become a Member
            </h1>
            <p className="font-['Libre_Baskerville'] text-xl text-[#717171] mb-2 italic">
              Welcome, {user?.user_metadata?.name || 'Writer'}!
            </p>
            <div className="border-t border-[#E0D8D0] w-24 mx-auto my-8" />
            <p className="font-['Libre_Baskerville'] text-base text-[#717171] leading-relaxed max-w-lg mx-auto mb-12">
              The Community Wall is an exclusive space for our members. Join today to share your work, appreciate others' writing, and become part of our intimate literary community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="/pricing"
                className="px-8 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Courier_New'] text-sm tracking-wider shadow-lg hover:shadow-xl inline-block"
              >
                VIEW MEMBERSHIP PLANS
              </a>
              <a
                href="/"
                className="px-8 py-4 border-2 border-[#E0D8D0] text-[#2C2C2C] hover:border-[#C4918A] transition-colors font-['Courier_New'] text-sm tracking-wider inline-block"
              >
                RETURN TO THE GALLERY
              </a>
            </div>
            <div className="bg-white border border-[#E0D8D0] rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-['Libre_Baskerville'] text-lg text-[#2C2C2C] mb-3">
                What's included:
              </h3>
              <ul className="text-left space-y-2 text-sm text-[#717171] font-['Inter']">
                <li className="flex items-center gap-2">
                  <span className="text-[#8A9A7B]">&#10003;</span>
                  Share your writing with the community
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#8A9A7B]">&#10003;</span>
                  Appreciate and engage with others' work
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#8A9A7B]">&#10003;</span>
                  Join our intimate writers' salon
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleHeart = (id: string) => {
    setPieces(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          hearts: p.hasHearted ? p.hearts - 1 : p.hearts + 1,
          hasHearted: !p.hasHearted
        };
      }
      return p;
    }));
  };

  const publishedPieces = pieces.filter(p => p.status === 'published');

  const filteredPieces = publishedPieces
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime();
      }
      if (sortBy === 'most_appreciated') {
        return b.hearts - a.hearts;
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <GalleryNav />

      {/* Members Only Banner */}
      <div className="fixed top-24 left-0 right-0 z-50 bg-[#C4918A]/10 border-b border-[#C4918A]/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-8 py-2 flex items-center justify-center gap-2">
          <Lock className="w-3 h-3 text-[#8B7355]" />
          <span className="text-xs font-['Courier_New'] tracking-wider text-[#8B7355] uppercase">
            Community Wall - Members Only
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-44 pb-12 px-8 bg-gradient-to-b from-[#F5F0EB] to-[#FAF7F2]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="font-['Cardo'] text-6xl text-[#2C2C2C]">
              Gallery Wall
            </h1>
          </div>
          <p className="text-lg text-[#717171] font-['Libre_Baskerville'] max-w-2xl leading-relaxed">
            Our writers' community space. Share your work, appreciate others, and grow together.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-[7.5rem] z-40 bg-[#FAF7F2]/95 backdrop-blur-sm border-y border-[#E0D8D0] py-4 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#717171] font-['Inter']">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 bg-white border border-[#E0D8D0] text-[#2C2C2C] font-['Inter'] text-sm focus:border-[#C4918A] focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="most_appreciated">Most Appreciated</option>
                <option value="category">Category</option>
              </select>
            </div>

            {/* Status Filter - published only */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'published'] as StatusFilter[]).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-xs font-['Inter'] uppercase tracking-wider transition-all ${
                    statusFilter === status
                      ? 'bg-[#2C2C2C] text-white'
                      : 'bg-white text-[#717171] border border-[#E0D8D0] hover:border-[#C4918A]'
                  }`}
                >
                  {status === 'all' ? 'All' : statusLabels[status as keyof typeof statusLabels]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Community Feed */}
      <div className="px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-4">
          {filteredPieces.map(piece => (
            <div
              key={piece.id}
              className="bg-white border border-[#E0D8D0] rounded-lg p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Author Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold flex-shrink-0"
                  style={{ backgroundColor: piece.authorColor }}
                >
                  {piece.authorInitials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-['Libre_Baskerville'] text-xl text-[#2C2C2C]">
                          {piece.title}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs border rounded-full ${statusStyles[piece.status as keyof typeof statusStyles]} font-['Inter'] uppercase tracking-wider`}>
                          {statusLabels[piece.status as keyof typeof statusLabels]}
                        </span>
                      </div>
                      <p className="text-sm text-[#717171] font-['Inter']">
                        by {piece.author}
                      </p>
                    </div>
                    <span className="text-xs text-[#717171] font-['Inter'] whitespace-nowrap">
                      {new Date(piece.sharedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-sm text-[#717171] font-['Inter'] mb-2">
                    {piece.category}
                  </p>

                  <p className="font-['Libre_Baskerville'] text-[#2C2C2C] leading-relaxed mb-4 italic">
                    {piece.excerpt}
                  </p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleHeart(piece.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                        piece.hasHearted
                          ? 'bg-[#E11D48]/10 text-[#E11D48]'
                          : 'bg-[#F5F0EB] text-[#717171] hover:bg-[#E0D8D0]'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${piece.hasHearted ? 'fill-current' : ''}`}
                      />
                      <span className="text-sm font-['Inter'] font-medium">{piece.hearts}</span>
                    </button>
                    <button className="text-sm text-[#717171] hover:text-[#2C2C2C] font-['Inter'] transition-colors">
                      Read full piece &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

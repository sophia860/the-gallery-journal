import { BookMarked, Calendar, Users, TrendingUp, Clock, DollarSign, Home, Sparkles, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { GardenMainNav } from '../components/GardenMainNav';
import { GardenFooter } from '../components/GardenFooter';

interface Room {
  id: string;
  name: string;
  editor: string;
  spots: { filled: number; total: number };
  price: number;
  duration: string;
  startDate: string;
  description: string;
  status: 'active' | 'upcoming';
}

interface PastBloom {
  id: string;
  title: string;
  roomName: string;
  writers: number;
  publishedDate: string;
}

const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    name: 'Poetry Sprint',
    editor: 'Sophia Chen',
    spots: { filled: 8, total: 12 },
    price: 10,
    duration: '2 weeks',
    startDate: 'Feb 18, 2026',
    description: 'Intensive poetry workshop focused on revision and contemporary forms. Daily prompts and peer feedback.',
    status: 'active'
  },
  {
    id: '2',
    name: 'Hybrid Text Lab',
    editor: 'Giove Martinez',
    spots: { filled: 5, total: 10 },
    price: 15,
    duration: '3 weeks',
    startDate: 'Feb 20, 2026',
    description: 'Explore the boundaries between prose and poetry. Experiment with form, fragment, and collage.',
    status: 'active'
  },
  {
    id: '3',
    name: 'Ekphrasis Weekend',
    editor: 'Maya Rivers',
    spots: { filled: 11, total: 15 },
    price: 8,
    duration: '3 days',
    startDate: 'Feb 21, 2026',
    description: 'Write in response to visual art. Museum visits, image prompts, and collaborative discussion.',
    status: 'active'
  },
  {
    id: '4',
    name: 'Memoir Fragments',
    editor: 'Jordan Park',
    spots: { filled: 0, total: 12 },
    price: 12,
    duration: '4 weeks',
    startDate: 'Mar 1, 2026',
    description: 'Personal essay and memoir writing. Focus on scene, voice, and the art of the fragment.',
    status: 'upcoming'
  },
  {
    id: '5',
    name: 'Flash Fiction Intensive',
    editor: 'River Santos',
    spots: { filled: 0, total: 15 },
    price: 10,
    duration: '2 weeks',
    startDate: 'Mar 5, 2026',
    description: 'Master the art of the very short story. Compression, implication, and the power of restraint.',
    status: 'upcoming'
  },
  {
    id: '6',
    name: 'Experimental Forms',
    editor: 'Sam Taylor',
    spots: { filled: 0, total: 8 },
    price: 18,
    duration: '4 weeks',
    startDate: 'Mar 10, 2026',
    description: 'Push boundaries. Break rules. Invent new forms. For adventurous writers only.',
    status: 'upcoming'
  }
];

const PAST_BLOOMS: PastBloom[] = [
  {
    id: '1',
    title: 'Night Gardens: A Collection',
    roomName: 'Poetry Sprint (Dec 2025)',
    writers: 12,
    publishedDate: 'Jan 15, 2026'
  },
  {
    id: '2',
    title: 'Between States',
    roomName: 'Hybrid Text Lab (Nov 2025)',
    writers: 10,
    publishedDate: 'Dec 28, 2025'
  },
  {
    id: '3',
    title: 'Fragments & Wholes',
    roomName: 'Memoir Fragments (Oct 2025)',
    writers: 11,
    publishedDate: 'Nov 30, 2025'
  }
];

export function GreenhousePage() {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming'>('active');

  const filteredRooms = MOCK_ROOMS.filter(room => room.status === activeTab);

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
            radial-gradient(1px 1px at 30% 15%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(3px 3px at 40% 40%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 50% 25%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 70% 50%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 80% 20%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 15% 60%, rgba(200, 210, 255, 0.9), transparent);
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
            radial-gradient(1px 1px at 48% 82%, rgba(255, 255, 255, 0.8), transparent);
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
            radial-gradient(2px 2px at 36% 6%, white, transparent);
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
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <Home className="w-10 h-10 text-[#10b981]" style={{ filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))' }} />
              <h1 className="font-['Playfair_Display'] text-7xl text-white italic font-bold" style={{ textShadow: '0 0 40px rgba(16, 185, 129, 0.3)' }}>
                The Greenhouse
              </h1>
              <Sparkles className="w-8 h-8 text-[#d4a574]" style={{ filter: 'drop-shadow(0 0 12px rgba(212, 165, 116, 0.6))' }} />
            </div>
            <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8] max-w-3xl mx-auto" style={{ lineHeight: '1.8' }}>
              Time-limited writing rooms. Small groups. Real craft.
            </p>
            <p className="font-['Inter'] text-sm text-[#8b9dc3] mt-4">
              Micro-residencies with guest editors. Join a room, write together, publish as a collection.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-8 py-3 rounded-lg font-['Inter'] font-semibold text-sm transition-all ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-green-500/30'
                  : 'glass-card text-[#c8cad8] hover:bg-[rgba(16,185,129,0.1)] hover:border-[#10b981]'
              }`}
            >
              Active Rooms
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-3 rounded-lg font-['Inter'] font-semibold text-sm transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-green-500/30'
                  : 'glass-card text-[#c8cad8] hover:bg-[rgba(16,185,129,0.1)] hover:border-[#10b981]'
              }`}
            >
              Upcoming Rooms
            </button>
          </div>

          {/* Room Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="glass-card rounded-2xl p-6 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Room Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-['Cardo'] text-2xl text-white italic" style={{ textShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
                      {room.name}
                    </h3>
                    {room.status === 'active' && (
                      <span className="px-2 py-1 bg-[rgba(16,185,129,0.2)] border border-[#10b981] text-[#10b981] text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="font-['Inter'] text-sm text-[#8b9dc3] mb-4">
                    with {room.editor}
                  </p>
                  <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] leading-relaxed">
                    {room.description}
                  </p>
                </div>

                {/* Room Details */}
                <div className="space-y-3 mb-6 pb-6 border-b border-[rgba(139,157,195,0.2)]">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-[#60a5fa]" />
                    <span className="font-['Inter'] text-[#c8cad8]">
                      {room.spots.filled}/{room.spots.total} writers
                    </span>
                    {room.spots.filled >= room.spots.total && (
                      <span className="ml-auto px-2 py-0.5 bg-[rgba(236,72,153,0.2)] text-[#ec4899] text-xs font-semibold rounded">
                        FULL
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="w-4 h-4 text-[#10b981]" />
                    <span className="font-['Inter'] text-[#c8cad8]">
                      ${room.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-[#d4a574]" />
                    <span className="font-['Inter'] text-[#c8cad8]">
                      {room.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-[#8b9dc3]" />
                    <span className="font-['Inter'] text-[#c8cad8]">
                      Starts {room.startDate}
                    </span>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  disabled={room.spots.filled >= room.spots.total}
                  className={`w-full py-3 rounded-lg font-['Cardo'] text-lg font-semibold transition-all ${
                    room.spots.filled >= room.spots.total
                      ? 'bg-[rgba(139,157,195,0.2)] text-[#8b9dc3] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] shadow-lg shadow-green-500/30 hover:shadow-green-500/50'
                  }`}
                >
                  {room.spots.filled >= room.spots.total ? 'Room Full' : 'Join Room'}
                </button>
              </div>
            ))}
          </div>

          {/* Past Blooms Section */}
          <div className="glass-card rounded-2xl p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-[#ec4899]" style={{ filter: 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.6))' }} />
                <h2 className="font-['Cardo'] text-5xl text-white italic" style={{ textShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }}>
                  Past Blooms
                </h2>
              </div>
              <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8]">
                Published collections from completed residencies
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {PAST_BLOOMS.map((bloom) => (
                <div
                  key={bloom.id}
                  className="p-6 rounded-xl border border-[rgba(139,157,195,0.2)] hover:border-[#ec4899] hover:bg-[rgba(236,72,153,0.05)] transition-all cursor-pointer"
                >
                  <h4 className="font-['Cardo'] text-xl text-white italic mb-2" style={{ textShadow: '0 0 15px rgba(236, 72, 153, 0.3)' }}>
                    {bloom.title}
                  </h4>
                  <p className="font-['Inter'] text-sm text-[#8b9dc3] mb-3">
                    {bloom.roomName}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[#c8cad8] font-['Inter']">
                    <span>{bloom.writers} writers</span>
                    <span>·</span>
                    <span>{bloom.publishedDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <a
                href="/gallery"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white hover:from-[#db2777] hover:to-[#be185d] transition-all font-['Cardo'] text-lg rounded-lg shadow-lg shadow-pink-500/30"
              >
                <BookOpen className="w-5 h-5" />
                Browse All Collections
              </a>
            </div>
          </div>
        </div>
      </div>

      <GardenFooter />
    </div>
  );
}
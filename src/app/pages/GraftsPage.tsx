import { useState } from 'react';
import { Layers, BookOpen, Edit3, Users, Calendar, Clock, CheckCircle, Send, Lock, Crown } from 'lucide-react';
import { GardenMainNav } from '../components/GardenMainNav';
import { GardenFooter } from '../components/GardenFooter';
import { PaymentModal } from '../components/PaymentModal';
import { useAuth } from '../contexts/AuthContext';

interface Graft {
  id: string;
  title: string;
  curator: string;
  theme: string;
  submissions: { received: number; slots: number };
  deadline: string;
  status: 'accepting' | 'under-review' | 'published';
}

interface PublishedGraft {
  id: string;
  title: string;
  editor: string;
  pieceCount: number;
  coverArt: string;
}

const MOCK_OPEN_GRAFTS: Graft[] = [
  {
    id: '1',
    title: 'Bodies of Water',
    curator: 'Maya Rivers',
    theme: 'Writing that flows, submerges, or drowns.',
    submissions: { received: 14, slots: 4 },
    deadline: 'Feb 28, 2026',
    status: 'accepting'
  },
  {
    id: '2',
    title: 'Letters Never Sent',
    curator: 'Jordan Park',
    theme: 'Epistolary fragments, unsent confessions, and words left unspoken.',
    submissions: { received: 8, slots: 5 },
    deadline: 'Mar 5, 2026',
    status: 'accepting'
  },
  {
    id: '3',
    title: 'Nocturnes',
    curator: 'Sophia Chen',
    theme: 'Poetry and prose of the night—insomnia, dreams, darkness.',
    submissions: { received: 23, slots: 3 },
    deadline: 'Feb 20, 2026',
    status: 'under-review'
  },
  {
    id: '4',
    title: 'Small Rebellions',
    curator: 'River Santos',
    theme: 'Quiet acts of resistance. Everyday defiance.',
    submissions: { received: 11, slots: 4 },
    deadline: 'Mar 10, 2026',
    status: 'accepting'
  }
];

const MOCK_PUBLISHED_GRAFTS: PublishedGraft[] = [
  {
    id: '1',
    title: 'Threshold Moments',
    editor: 'Sophia Chen',
    pieceCount: 5,
    coverArt: 'T'
  },
  {
    id: '2',
    title: 'Between Languages',
    editor: 'Giove Martinez',
    pieceCount: 4,
    coverArt: 'B'
  },
  {
    id: '3',
    title: 'Ghost Stories',
    editor: 'Maya Rivers',
    pieceCount: 5,
    coverArt: 'G'
  },
  {
    id: '4',
    title: 'Urban Pastoral',
    editor: 'Jordan Park',
    pieceCount: 4,
    coverArt: 'U'
  },
  {
    id: '5',
    title: 'Forms of Attention',
    editor: 'River Santos',
    pieceCount: 3,
    coverArt: 'F'
  },
  {
    id: '6',
    title: 'Inheritance',
    editor: 'Sam Taylor',
    pieceCount: 5,
    coverArt: 'I'
  }
];

export function GraftsPage() {
  const getStatusBadge = (status: string) => {
    const styles = {
      accepting: { bg: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa', text: 'Accepting Submissions' },
      'under-review': { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', text: 'Under Review' },
      published: { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', text: 'Published' }
    };
    const style = styles[status as keyof typeof styles];
    
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-['Inter'] font-semibold uppercase tracking-wider"
        style={{
          background: style.bg,
          color: style.color
        }}
      >
        {style.text}
      </span>
    );
  };

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { user } = useAuth();

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
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Hero Section */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6">
                  <Layers className="w-10 h-10 text-[#a78bfa]" style={{ filter: 'drop-shadow(0 0 15px rgba(167, 139, 250, 0.6))' }} />
                  <h1 className="font-['Playfair_Display'] text-7xl text-white italic font-bold" style={{ textShadow: '0 0 40px rgba(167, 139, 250, 0.4)' }}>
                    Grafts
                  </h1>
                </div>
                <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8] max-w-3xl mx-auto mb-4" style={{ lineHeight: '1.8' }}>
                  Curate your own micro-anthology. Become the editor.
                </p>
                <p className="font-['Inter'] text-sm text-[#8b9dc3]">
                  Writers propose themes, receive submissions, and publish permanent collections.
                </p>
              </div>

              {/* Open Grafts Section */}
              <div className="mb-16">
                <h2 className="font-['Cardo'] text-4xl text-white italic mb-8" style={{ textShadow: '0 0 25px rgba(167, 139, 250, 0.3)' }}>
                  Open Grafts
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {MOCK_OPEN_GRAFTS.map((graft) => (
                    <div
                      key={graft.id}
                      className="glass-card rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
                    >
                      {/* Graft Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-['Cardo'] text-2xl text-white italic flex-1" style={{ textShadow: '0 0 20px rgba(167, 139, 250, 0.3)' }}>
                            {graft.title}
                          </h3>
                          {getStatusBadge(graft.status)}
                        </div>
                        <p className="font-['Inter'] text-sm text-[#8b9dc3] mb-3">
                          Curated by <span className="text-[#a78bfa]">{graft.curator}</span>
                        </p>
                        <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] leading-relaxed italic">
                          "{graft.theme}"
                        </p>
                      </div>

                      {/* Graft Stats */}
                      <div className="space-y-3 mb-6 pb-6 border-b border-[rgba(139,157,195,0.2)]">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-['Inter'] text-[#8b9dc3] flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Submissions
                          </span>
                          <span className="font-['Inter'] text-[#c8cad8] font-semibold">
                            {graft.submissions.received} received / {graft.submissions.slots} slots
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-['Inter'] text-[#8b9dc3] flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Deadline
                          </span>
                          <span className="font-['Inter'] text-[#c8cad8] font-semibold">
                            {graft.deadline}
                          </span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        disabled={graft.status !== 'accepting'}
                        className={`w-full py-3 rounded-lg font-['Cardo'] text-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                          graft.status !== 'accepting'
                            ? 'bg-[rgba(139,157,195,0.2)] text-[#8b9dc3] cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] text-white hover:from-[#8b5cf6] hover:to-[#7c3aed] shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                        }`}
                      >
                        <Send className="w-5 h-5" />
                        {graft.status === 'accepting' ? 'Submit to this Graft' : 'Submissions Closed'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start a Graft CTA */}
              <div className="glass-card rounded-2xl p-10 mb-16 border-2 border-[rgba(167,139,250,0.3)] hover:border-[#a78bfa] hover:shadow-2xl hover:shadow-purple-500/30 transition-all">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <Edit3 className="w-8 h-8 text-[#a78bfa]" style={{ filter: 'drop-shadow(0 0 12px rgba(167, 139, 250, 0.6))' }} />
                    <h3 className="font-['Cardo'] text-4xl text-white italic" style={{ textShadow: '0 0 30px rgba(167, 139, 250, 0.3)' }}>
                      Start a Graft
                    </h3>
                  </div>
                  <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8] max-w-2xl mx-auto leading-relaxed">
                    Become the editor. Propose a theme, write your editorial call, receive submissions from Garden writers, select 3-5 pieces, and your finished Graft is published permanently on the site with your name as editor.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="text-center">
                    <p className="font-['Inter'] text-xs text-[#8b9dc3] uppercase tracking-wider mb-2">Curation Fee</p>
                    <p className="font-['Cardo'] text-4xl text-[#a78bfa] font-bold">$8</p>
                  </div>
                </div>

                <button
                  className="w-full py-4 rounded-lg font-['Cardo'] text-xl font-semibold bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] text-white hover:from-[#8b5cf6] hover:to-[#7c3aed] shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  Propose Your Graft
                </button>
              </div>

              {/* Published Grafts Section */}
              <div>
                <h2 className="font-['Cardo'] text-4xl text-white italic mb-8" style={{ textShadow: '0 0 25px rgba(167, 139, 250, 0.3)' }}>
                  Published Grafts
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {MOCK_PUBLISHED_GRAFTS.map((graft) => (
                    <div
                      key={graft.id}
                      className="glass-card rounded-xl p-6 hover:shadow-xl hover:shadow-purple-500/20 transition-all cursor-pointer group"
                    >
                      {/* Cover Art */}
                      <div
                        className="w-full aspect-square rounded-lg mb-4 flex items-center justify-center text-white font-['Cardo'] text-6xl font-bold shadow-xl group-hover:scale-105 transition-transform"
                        style={{
                          background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                          boxShadow: '0 0 30px rgba(167, 139, 250, 0.4)'
                        }}
                      >
                        {graft.coverArt}
                      </div>

                      <h4 className="font-['Cardo'] text-xl text-white italic mb-2" style={{ textShadow: '0 0 15px rgba(167, 139, 250, 0.3)' }}>
                        {graft.title}
                      </h4>
                      <p className="font-['Inter'] text-sm text-[#8b9dc3] mb-3">
                        Edited by <span className="text-[#a78bfa]">{graft.editor}</span>
                      </p>
                      <p className="font-['Inter'] text-xs text-[#8b9dc3] mb-4">
                        {graft.pieceCount} pieces
                      </p>

                      <button className="w-full py-2 rounded-lg font-['Inter'] text-sm font-semibold border border-[rgba(167,139,250,0.3)] text-[#a78bfa] hover:bg-[rgba(167,139,250,0.1)] transition-all flex items-center justify-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Read
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - How It Works */}
            <div className="w-80 flex-shrink-0">
              <div className="glass-card rounded-2xl p-8 sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  <Layers className="w-6 h-6 text-[#a78bfa]" />
                  <h3 className="font-['Cardo'] text-2xl text-white italic">How It Works</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 text-white font-['Inter'] font-bold text-sm shadow-lg shadow-purple-500/30">
                      1
                    </div>
                    <div>
                      <h4 className="font-['Inter'] text-sm font-semibold text-white mb-2">Propose Theme</h4>
                      <p className="font-['Inter'] text-xs text-[#8b9dc3] leading-relaxed">
                        Submit your anthology concept and editorial vision. $8 curation fee.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 text-white font-['Inter'] font-bold text-sm shadow-lg shadow-purple-500/30">
                      2
                    </div>
                    <div>
                      <h4 className="font-['Inter'] text-sm font-semibold text-white mb-2">Write Editorial Call</h4>
                      <p className="font-['Inter'] text-xs text-[#8b9dc3] leading-relaxed">
                        Craft the call for submissions. Set your deadline and piece count (3-5).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 text-white font-['Inter'] font-bold text-sm shadow-lg shadow-purple-500/30">
                      3
                    </div>
                    <div>
                      <h4 className="font-['Inter'] text-sm font-semibold text-white mb-2">Receive Submissions</h4>
                      <p className="font-['Inter'] text-xs text-[#8b9dc3] leading-relaxed">
                        Garden writers submit directly to your Graft. Review at your pace.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 text-white font-['Inter'] font-bold text-sm shadow-lg shadow-purple-500/30">
                      4
                    </div>
                    <div>
                      <h4 className="font-['Inter'] text-sm font-semibold text-white mb-2">Curate 3-5 Pieces</h4>
                      <p className="font-['Inter'] text-xs text-[#8b9dc3] leading-relaxed">
                        Select the pieces that best fit your vision. You're the editor.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center flex-shrink-0 text-white font-['Inter'] font-bold text-sm shadow-lg shadow-green-500/30">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-['Inter'] text-sm font-semibold text-white mb-2">Published Permanently</h4>
                      <p className="font-['Inter'] text-xs text-[#8b9dc3] leading-relaxed">
                        Your Graft lives forever on the site with your editorial byline.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[rgba(139,157,195,0.2)]">
                  <div className="px-4 py-3 rounded-lg" style={{ background: 'rgba(167, 139, 250, 0.1)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                    <p className="font-['Inter'] text-xs text-[#a78bfa] text-center font-semibold">
                      ✨ Give writers editorial power
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GardenFooter />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={8}
        type="one-time"
        description="One-time curation fee to propose and curate a Graft anthology"
        planName="Graft Curation"
        onSuccess={(result) => {
          console.log('Payment successful:', result);
          setIsPaymentModalOpen(false);
          alert('Payment successful! You can now create your Graft.');
          // Redirect to graft editor
          window.location.href = '/grafts/edit/new';
        }}
        onError={(error) => {
          console.error('Payment failed:', error);
          alert('Payment failed. Please try again.');
        }}
      />
    </div>
  );
}
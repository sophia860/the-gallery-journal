import { useState } from 'react';
import { ChevronLeft, X, Flower2, Leaf, Heart, Lock, DollarSign, Users, TrendingUp, Sparkles } from 'lucide-react';
import { GardenMainNav } from '../components/GardenMainNav';

interface VisitGardenPageProps {
  username: string;
}

interface GardenWriting {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  growth_stage: 'seed' | 'sprout' | 'bloom';
  work_type: string;
  position: { x: number; y: number }; // Position in garden (percentage)
}

interface GardenProfile {
  username: string;
  display_name: string;
  garden_bio: string;
  garden_theme_color: string; // neon color for their garden
  writings: GardenWriting[];
}

// Mock data for 3 writers
const MOCK_GARDEN_PROFILES: Record<string, GardenProfile> = {
  'maya-chen': {
    username: 'maya-chen',
    display_name: 'Maya Chen',
    garden_bio: 'Planting words in the quiet hours. Poetry, prose, and fragments from the in-between spaces.',
    garden_theme_color: '#ec4899', // pink
    writings: [
      {
        id: '1',
        title: 'The Weight of Autumn',
        excerpt: "There's a heaviness that settles in when the leaves begin to turn...",
        content: "There's a heaviness that settles in when the leaves begin to turn. Not sadness exactly, but a kind of melancholy nostalgia for summers not quite finished. I walk through the park and feel the crunch beneath my feet--each leaf a small goodbye. The air smells of smoke and earth, of things ending and returning to soil. My mother used to say that autumn was nature's way of teaching us about letting go. But I think it's more than that. It's a reminder that beauty and death can coexist, that the most vibrant colors come right before the fall.",
        growth_stage: 'bloom',
        work_type: 'poetry',
        position: { x: 25, y: 35 }
      },
      {
        id: '2',
        title: 'Midnight Thoughts',
        excerpt: 'The city never really sleeps...',
        content: 'The city never really sleeps, but it does pause. At 3 AM, there\'s a moment--just a breath--when the noise dims to a hum. That\'s when I write. When the streets are empty enough that I can hear my own thoughts, when the windows across the way go dark one by one. In these hours, I am most myself. The darkness doesn\'t scare me; it holds space for the things I can\'t say in daylight.',
        growth_stage: 'bloom',
        work_type: 'prose',
        position: { x: 65, y: 25 }
      },
      {
        id: '3',
        title: 'On Belonging',
        excerpt: 'I\'ve never felt like I fit anywhere completely...',
        content: 'I\'ve never felt like I fit anywhere completely. Not in the place where I was born, not in the places I\'ve lived since. There\'s always a part of me that feels like an observer, watching from slightly outside the frame. My therapist says this is common for children of immigrants--we inherit our parents\' sense of displacement. But I wonder if it\'s deeper than that. Maybe some of us are just meant to be bridges, standing between worlds, never fully in one or the other.',
        growth_stage: 'sprout',
        work_type: 'memoir',
        position: { x: 45, y: 60 }
      },
      {
        id: '4',
        title: 'Untitled Fragment',
        excerpt: 'Coffee rings on paper...',
        content: 'Coffee rings on paper. The way morning light falls through blinds, making prison bars on the wall. How we always say "I\'m fine" when we mean anything but.',
        growth_stage: 'seed',
        work_type: 'fragment',
        position: { x: 80, y: 70 }
      },
      {
        id: '5',
        title: 'Winter Solstice',
        excerpt: 'The darkest day of the year...',
        content: 'The darkest day of the year, and yet I feel lighter than I have in months. There\'s something clarifying about acknowledging the darkness instead of fighting it. Tonight, I light a candle. Not for hope or renewal or any of those things we\'re supposed to feel. Just for the small defiance of flame against the void.',
        growth_stage: 'bloom',
        work_type: 'poetry',
        position: { x: 15, y: 75 }
      },
      {
        id: '6',
        title: 'Letters I Won\'t Send',
        excerpt: 'Dear you, I\'m learning to be alone...',
        content: 'Dear you, I\'m learning to be alone without being lonely. It\'s harder than I thought it would be. Some mornings I still reach for my phone to text you before remembering you won\'t answer. But I\'m getting better at sitting with the silence. At making breakfast for one. At being enough.',
        growth_stage: 'sprout',
        work_type: 'personal',
        position: { x: 55, y: 45 }
      }
    ]
  },
  'jordan-rivers': {
    username: 'jordan-rivers',
    display_name: 'Jordan Rivers',
    garden_bio: 'Experimental writer. I grow fragments that don\'t fit anywhere else.',
    garden_theme_color: '#06b6d4', // cyan
    writings: [
      {
        id: '7',
        title: 'City at 3 AM',
        excerpt: 'Streetlight halos. Empty bus stops...',
        content: 'Streetlight halos. Empty bus stops. A cat crossing the intersection with more purpose than I\'ve had all week. The bodega guy who knows my order but not my name. Sirens in the distance--always in the distance. Somewhere, someone is awake like me, staring at screens or ceilings, counting the hours until morning.',
        growth_stage: 'bloom',
        work_type: 'experimental',
        position: { x: 30, y: 40 }
      },
      {
        id: '8',
        title: 'Digital Ghosts',
        excerpt: 'Your profile still exists...',
        content: 'Your profile still exists even though you don\'t. I scroll through your photos sometimes, which I know is unhealthy, which I do anyway. The algorithm doesn\'t know you\'re gone--it keeps suggesting I tag you in memories. I wonder how long your digital ghost will haunt these platforms. Forever, probably. We\'ve created a new kind of afterlife: eternal, searchable, unable to rest.',
        growth_stage: 'sprout',
        work_type: 'prose',
        position: { x: 60, y: 55 }
      },
      {
        id: '9',
        title: 'Waiting Room Thoughts',
        excerpt: 'Everyone here is pretending to be calm...',
        content: 'Everyone here is pretending to be calm. Flipping through magazines from 2019, checking phones, anything to avoid eye contact. I wonder what brought each of us here. What we\'re hoping to hear or dreading to learn. The fluorescent lights hum their anxious song.',
        growth_stage: 'seed',
        work_type: 'fragment',
        position: { x: 75, y: 30 }
      },
      {
        id: '10',
        title: 'Grocery Store Meditation',
        excerpt: 'In the produce aisle...',
        content: 'In the produce aisle at 11 PM, I am the only customer. I take my time choosing avocados, testing their give. There\'s a kind of peace in these mundane rituals. The quiet concentration of selecting the right onion, the weight of tomatoes in my palm. No one here needs me to be anything but a person choosing vegetables. It\'s enough.',
        growth_stage: 'bloom',
        work_type: 'prose',
        position: { x: 40, y: 70 }
      },
      {
        id: '11',
        title: 'Bus Route Observations',
        excerpt: 'The same faces, different days...',
        content: 'The same faces, different days. The woman who always sits in the back and knits. The student with headphones who moves his lips to songs I can\'t hear. We\'re all going somewhere, but we\'re together in the going. Anonymous intimacy. Tomorrow we\'ll be strangers again.',
        growth_stage: 'sprout',
        work_type: 'experimental',
        position: { x: 20, y: 60 }
      }
    ]
  },
  'river-park': {
    username: 'river-park',
    display_name: 'River Park',
    garden_bio: 'Poet. Tending to small observations and quiet revelations.',
    garden_theme_color: '#8b5cf6', // purple
    writings: [
      {
        id: '12',
        title: 'Morning Ritual',
        excerpt: 'I make coffee the same way every day...',
        content: 'I make coffee the same way every day. Grind the beans, heat the water to exactly 200 degrees, pour in slow circles. It\'s a meditation, this precision. A way of telling myself that I\'m still here, still capable of care. Some days this is the only thing I do with intention.',
        growth_stage: 'bloom',
        work_type: 'poetry',
        position: { x: 35, y: 45 }
      },
      {
        id: '13',
        title: 'Rain',
        excerpt: 'It\'s been raining for three days...',
        content: 'It\'s been raining for three days and I\'ve stopped trying to fight my mood. Instead, I let myself be grey. Make soup. Read books that don\'t demand anything of me. Watch water trace paths down the window. Sometimes the best thing you can do is surrender to the weather, inside and out.',
        growth_stage: 'bloom',
        work_type: 'prose',
        position: { x: 65, y: 35 }
      },
      {
        id: '14',
        title: 'Unfinished Poem About Light',
        excerpt: 'The way afternoon sun catches dust...',
        content: 'The way afternoon sun catches dust particles, making them dance like...like what? I can\'t find the right words. Like galaxies. Like proof of movement. Like something I can\'t name.',
        growth_stage: 'seed',
        work_type: 'poetry',
        position: { x: 50, y: 65 }
      },
      {
        id: '15',
        title: 'What I Know About Love',
        excerpt: 'It\'s in the small things...',
        content: 'It\'s in the small things. Remembering how someone takes their tea. The specific way they fold towels. How they tilt their head when they\'re thinking. Love isn\'t the grand gestures we see in movies. It\'s attention. It\'s showing up. It\'s learning someone\'s particular way of being in the world and making space for it next to yours.',
        growth_stage: 'sprout',
        work_type: 'essay',
        position: { x: 25, y: 55 }
      }
    ]
  },
  'sophia-editor': {
    username: 'sophia-editor',
    display_name: 'Sophia (Editor)',
    garden_bio: 'Editor at PAGE. Helping writers find their voice through thoughtful revision and craft guidance.',
    garden_theme_color: '#f59e0b', // golden amber for editor
    writings: [
      {
        id: 'ed-1',
        title: 'The Art of Revision',
        excerpt: 'Good writing is rewriting...',
        content: 'Good writing is rewriting. This truth haunts us because it means the first draft is never enough. It means that brilliant flash of inspiration must be tempered with patience, that what felt perfect at 2am often reads differently at noon. Revision is where we learn what we actually meant to say. It is where voice emerges from noise, where structure reveals itself beneath the chaos of initial creation.',
        growth_stage: 'bloom',
        work_type: 'essay',
        position: { x: 30, y: 40 }
      },
      {
        id: 'ed-2',
        title: 'On Reading Like a Writer',
        excerpt: 'When you read as a writer, everything changes...',
        content: 'When you read as a writer, everything changes. You notice the rhythm of sentences, the architecture of paragraphs. You see how a writer builds tension or releases it, how they use white space like punctuation, how they choose that word instead of this one. You become aware of craft in a way that makes reading slower, richer, more deliberate. This is not about losing the joy of story--it is about deepening it.',
        growth_stage: 'bloom',
        work_type: 'craft',
        position: { x: 60, y: 30 }
      },
      {
        id: 'ed-3',
        title: 'Notes on Voice',
        excerpt: 'Voice is the hardest thing to teach...',
        content: 'Voice is the hardest thing to teach because it cannot be taught--only uncovered. It is what remains when you stop trying to impress. When you stop imitating the writers you admire and start trusting your own particular way of seeing. Voice is authenticity made audible. It is the sound of you, on the page.',
        growth_stage: 'bloom',
        work_type: 'essay',
        position: { x: 45, y: 65 }
      }
    ]
  },
  'giove-editor': {
    username: 'giove-editor',
    display_name: 'Giove (Editor)',
    garden_bio: 'Senior Editor at PAGE. Championing bold voices and experimental forms in contemporary literature.',
    garden_theme_color: '#d97706', // deeper amber/gold for editor
    writings: [
      {
        id: 'ed-4',
        title: 'Finding Your Voice',
        excerpt: 'Your voice is not something you find...',
        content: 'Your voice is not something you find--it is something you uncover. Beneath the imitation, beneath the trying-too-hard, beneath the voice you think you should have, there is the voice you actually have. It emerges through practice, through failure, through writing so much that eventually you stop performing and start speaking. Voice is what remains when you stop trying to sound like someone else.',
        growth_stage: 'bloom',
        work_type: 'essay',
        position: { x: 35, y: 35 }
      },
      {
        id: 'ed-5',
        title: 'The Courage to Begin',
        excerpt: 'Every writer knows the terror of the blank page...',
        content: 'Every writer knows the terror of the blank page. It is not just emptiness--it is potential, which is somehow more frightening. To begin means to commit, to make choices, to move from the realm of infinite possibility into the messy reality of actual words. But here is the secret: beginning badly is still beginning. The first sentence does not have to be perfect. It just has to exist.',
        growth_stage: 'bloom',
        work_type: 'essay',
        position: { x: 65, y: 50 }
      },
      {
        id: 'ed-6',
        title: 'On Experimental Form',
        excerpt: 'Rules exist to be understood, then broken...',
        content: 'Rules exist to be understood, then broken. But you must know them first. You must understand why sentences have subjects and verbs, why paragraphs have topic sentences, why stories have beginnings and middles and ends. Only then can you break these conventions with intention. Experimental writing is not random--it is purposeful departure. It is knowing the map well enough to venture off the path.',
        growth_stage: 'bloom',
        work_type: 'craft',
        position: { x: 50, y: 70 }
      }
    ]
  }
};

export function VisitGardenPage({ username }: VisitGardenPageProps) {
  const [selectedWriting, setSelectedWriting] = useState<GardenWriting | null>(null);
  const [hoveredWriting, setHoveredWriting] = useState<GardenWriting | null>(null);
  
  // Get garden profile
  const garden = MOCK_GARDEN_PROFILES[username] || MOCK_GARDEN_PROFILES['maya-chen'];

  // Firefly positions (random floating particles)
  const fireflies = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 4 + 3
  }));

  const getPlantVisual = (writing: GardenWriting) => {
    const { growth_stage, position } = writing;
    
    if (growth_stage === 'seed') {
      return (
        <div
          className="absolute plant-container cursor-pointer group"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'float 4s ease-in-out infinite',
            animationDelay: `${Math.random() * 2}s`
          }}
          onClick={() => setSelectedWriting(writing)}
          onMouseEnter={() => setHoveredWriting(writing)}
          onMouseLeave={() => setHoveredWriting(null)}
        >
          <div
            className="w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-125"
            style={{
              background: '#d4a574',
              boxShadow: `0 0 15px rgba(212, 165, 116, 0.6), 0 0 30px rgba(212, 165, 116, 0.3)`,
              filter: 'brightness(1.2)'
            }}
          />
        </div>
      );
    } else if (growth_stage === 'sprout') {
      return (
        <div
          className="absolute plant-container cursor-pointer group"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'sway 3s ease-in-out infinite',
            animationDelay: `${Math.random() * 2}s`,
            transformOrigin: 'bottom center'
          }}
          onClick={() => setSelectedWriting(writing)}
          onMouseEnter={() => setHoveredWriting(writing)}
          onMouseLeave={() => setHoveredWriting(null)}
        >
          <Leaf
            className="w-10 h-10 transition-all duration-300 group-hover:scale-110"
            style={{
              color: '#10b981',
              filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 30px rgba(16, 185, 129, 0.4))',
            }}
          />
        </div>
      );
    } else {
      // bloom
      return (
        <div
          className="absolute plant-container cursor-pointer group"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'floatPulse 4s ease-in-out infinite',
            animationDelay: `${Math.random() * 2}s`
          }}
          onClick={() => setSelectedWriting(writing)}
          onMouseEnter={() => setHoveredWriting(writing)}
          onMouseLeave={() => setHoveredWriting(null)}
        >
          <div className="relative">
            <Flower2
              className="w-16 h-16 transition-all duration-300 group-hover:scale-125"
              style={{
                color: garden.garden_theme_color,
                filter: `drop-shadow(0 0 20px ${garden.garden_theme_color}) drop-shadow(0 0 40px ${garden.garden_theme_color}80)`,
              }}
            />
            {/* Pulsing glow ring */}
            <div
              className="absolute inset-0 rounded-full opacity-40"
              style={{
                background: `radial-gradient(circle, ${garden.garden_theme_color}40 0%, transparent 70%)`,
                animation: 'pulse 2s ease-in-out infinite',
                transform: 'scale(1.5)'
              }}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#050510' }}>
      <GardenMainNav variant="dark" />

      {/* Animated CSS */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: translate(-50%, -50%) rotate(-3deg);
          }
          50% {
            transform: translate(-50%, -50%) rotate(3deg);
          }
        }

        @keyframes floatPulse {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-15px) scale(1.05);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1.5);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.8);
          }
        }

        @keyframes firefly {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% {
            transform: translate(30px, -40px);
            opacity: 1;
          }
          50% {
            transform: translate(-20px, -80px);
            opacity: 0.4;
          }
          75% {
            transform: translate(40px, -60px);
            opacity: 0.8;
          }
        }

        .firefly {
          animation: firefly var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }
      `}</style>

      {/* Starfield background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 10% 20%, white, transparent),
              radial-gradient(1px 1px at 30% 40%, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 50% 10%, rgba(255, 255, 255, 0.9), transparent),
              radial-gradient(2px 2px at 70% 60%, white, transparent),
              radial-gradient(1px 1px at 80% 30%, rgba(255, 255, 255, 0.85), transparent),
              radial-gradient(1px 1px at 20% 80%, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(1px 1px at 90% 70%, rgba(255, 255, 255, 0.9), transparent),
              radial-gradient(2px 2px at 40% 90%, white, transparent),
              radial-gradient(1px 1px at 60% 50%, rgba(255, 255, 255, 0.85), transparent),
              radial-gradient(1px 1px at 15% 50%, rgba(255, 255, 255, 0.8), transparent)
            `,
            backgroundSize: '200% 200%',
            animation: 'twinkle 4s ease-in-out infinite'
          }}
        />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <a
            href="/explore"
            className="inline-flex items-center gap-2 mb-8 text-[#8b9dc3] hover:text-[#60a5fa] transition-colors font-['Inter'] text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Explore
          </a>

          {/* Garden Header */}
          <div className="text-center mb-16">
            <h1 
              className="font-['Playfair_Display'] italic text-6xl mb-4"
              style={{
                color: garden.garden_theme_color,
                textShadow: `0 0 60px ${garden.garden_theme_color}80, 0 0 100px ${garden.garden_theme_color}40`,
                filter: 'brightness(1.2)'
              }}
            >
              {garden.display_name}'s Garden
            </h1>
            <p 
              className="font-['Libre_Baskerville'] text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ 
                color: '#c8cad8',
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)'
              }}
            >
              {garden.garden_bio}
            </p>
          </div>

          {/* Garden Space - where plants are positioned */}
          <div className="relative w-full" style={{ minHeight: '600px', height: '70vh' }}>
            {/* Fireflies */}
            {fireflies.map((firefly) => (
              <div
                key={firefly.id}
                className="absolute firefly pointer-events-none"
                style={{
                  left: `${firefly.x}%`,
                  top: `${firefly.y}%`,
                  width: `${firefly.size}px`,
                  height: `${firefly.size}px`,
                  background: '#ffeb3b',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px rgba(255, 235, 59, 0.8), 0 0 20px rgba(255, 235, 59, 0.4)',
                  '--delay': `${firefly.delay}s`,
                  '--duration': `${firefly.duration}s`,
                } as React.CSSProperties}
              />
            ))}

            {/* Plants (writings) */}
            {garden.writings.map((writing) => (
              <div key={writing.id}>
                {getPlantVisual(writing)}
              </div>
            ))}

            {/* Hover Tooltip */}
            {hoveredWriting && !selectedWriting && (
              <div
                className="absolute pointer-events-none z-20"
                style={{
                  left: `${hoveredWriting.position.x}%`,
                  top: `${hoveredWriting.position.y}%`,
                  transform: 'translate(-50%, calc(-100% - 30px))'
                }}
              >
                <div
                  className="px-4 py-3 rounded-lg backdrop-blur-xl"
                  style={{
                    background: 'rgba(15, 23, 41, 0.95)',
                    border: `1px solid ${garden.garden_theme_color}40`,
                    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px ${garden.garden_theme_color}20`,
                    maxWidth: '250px'
                  }}
                >
                  <p className="font-['Playfair_Display'] italic text-white text-sm mb-1">
                    {hoveredWriting.title}
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8b9dc3] capitalize">
                    {hoveredWriting.work_type}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-12 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#d4a574', boxShadow: '0 0 10px rgba(212, 165, 116, 0.6)' }} />
              <span className="font-['Inter'] text-sm text-[#8b9dc3]">Seeds</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4" style={{ color: '#10b981', filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' }} />
              <span className="font-['Inter'] text-sm text-[#8b9dc3]">Sprouts</span>
            </div>
            <div className="flex items-center gap-2">
              <Flower2 className="w-5 h-5" style={{ color: garden.garden_theme_color, filter: `drop-shadow(0 0 10px ${garden.garden_theme_color})` }} />
              <span className="font-['Inter'] text-sm text-[#8b9dc3]">Blooms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Modal */}
      {selectedWriting && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedWriting(null)}
        >
          <div 
            className="max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-2xl p-10 relative"
            style={{
              background: 'rgba(10, 14, 26, 0.95)',
              border: `2px solid ${garden.garden_theme_color}40`,
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 80px ${garden.garden_theme_color}20`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedWriting(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-[#8b9dc3] hover:text-white" />
            </button>

            {/* Growth stage badge */}
            <div className="flex items-center gap-3 mb-6">
              {selectedWriting.growth_stage === 'seed' && (
                <div className="w-3 h-3 rounded-full" style={{ background: '#d4a574', boxShadow: '0 0 10px rgba(212, 165, 116, 0.6)' }} />
              )}
              {selectedWriting.growth_stage === 'sprout' && (
                <Leaf className="w-5 h-5" style={{ color: '#10b981', filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' }} />
              )}
              {selectedWriting.growth_stage === 'bloom' && (
                <Flower2 className="w-6 h-6" style={{ color: garden.garden_theme_color, filter: `drop-shadow(0 0 10px ${garden.garden_theme_color})` }} />
              )}
              <span className="font-['Inter'] text-xs uppercase tracking-wider text-[#8b9dc3]">
                {selectedWriting.growth_stage}
              </span>
              <span className="font-['Inter'] text-xs italic text-[#8b9dc3]">
                {selectedWriting.work_type}
              </span>
            </div>

            {/* Title */}
            <h2 
              className="font-['Playfair_Display'] italic text-4xl mb-8"
              style={{
                color: garden.garden_theme_color,
                textShadow: `0 0 30px ${garden.garden_theme_color}40`,
                filter: 'brightness(1.1)'
              }}
            >
              {selectedWriting.title}
            </h2>

            {/* Content */}
            <div 
              className="font-['Libre_Baskerville'] text-lg leading-loose text-[#e8f0ff] whitespace-pre-wrap"
              style={{ lineHeight: '2' }}
            >
              {selectedWriting.content}
            </div>

            {/* Author */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <p className="font-['Inter'] text-sm text-[#8b9dc3]">
                From <span style={{ color: garden.garden_theme_color }}>{garden.display_name}</span>'s Garden
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
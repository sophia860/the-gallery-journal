import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

// Sample poems (all published works - NO DRAFTS)
const allPoems = [
  {
    id: '1',
    title: 'Your Eyes',
    author: 'Pam Martin-Lawrence',
    authorId: 'sample1',
    category: 'Love & Relationships',
    wallNumber: '01',
    firstLines: 'In your eyes I see / a universe unfolding...',
    content: `In your eyes I see
  a universe unfolding,
  galaxies that spiral soft,
  constellations only we can read.

  Your gaze holds summer evenings,
  the weight of August heat,
  the promise of October rain.

  When you look at me like that,
  time folds into itself—
  past and future collapse
  into this one perfect now.`,
    status: 'published' as const,
  },
  {
    id: '2',
    title: 'Thoughts on love during a heatwave',
    author: 'Ella B Winters',
    authorId: 'sample2',
    category: 'Love & Relationships',
    wallNumber: '02',
    firstLines: 'The air is thick with wanting...',
    content: `The air is thick with wanting,
humidity that clings like memory.
We are melting into each other,
borders dissolving in 98 degrees.

Love in summer is a fever—
all sweat and desperate reaching,
ceiling fans doing nothing
but pushing hot air in circles.

I think about glaciers,
how they remember centuries.
We are not glaciers.
We are heat lightning,
brief and brilliant.`,
  },
  {
    id: '3',
    title: 'Ocean Pockets',
    author: 'Indee Sehrish Watson',
    authorId: 'sample3',
    category: 'Nature & The Natural World',
    wallNumber: '03',
    firstLines: 'I keep finding ocean in my pockets...',
    content: `I keep finding ocean in my pockets—
salt-crusted shells, smooth stones,
evidence of the tide's attention.

The sea returns what we give it,
polished and patient,
edges worn soft by time.

Today I found a piece of sea glass,
blue as forgetting,
smooth as the space
between one wave
and the next.`,
  },
  {
    id: '4',
    title: 'The Clear Sky',
    author: 'Bhavna Jain',
    authorId: 'sample4',
    category: 'Nature & The Natural World',
    wallNumber: '04',
    firstLines: 'After the storm, such clarity...',
    content: `After the storm, such clarity—
the sky washed clean,
clouds scattered like old thoughts
no longer needed.

Everything sharp-edged and new.
The world remade in the aftermath,
breathing easier now,
lighter somehow.

I stand in the cleared space
and remember:
destruction is sometimes
another word for beginning.`,
  },
  {
    id: '5',
    title: 'Blessings',
    author: 'Leonie Rowland',
    authorId: 'sample5',
    category: 'Time & Mortality',
    wallNumber: '05',
    firstLines: 'Bless the small things...',
    content: `Bless the small things:
coffee still warm at noon,
the dog's greeting at the door,
light through kitchen windows.

Bless the unremarkable Tuesday,
the ordinary accumulation of hours,
the way we move through rooms
we've moved through a thousand times.

Bless the boring miracle
of another day,
the spectacular mundane,
the holy routine.`,
  },
  {
    id: '6',
    title: 'Dialogue in Times Square',
    author: 'Seth Trochtenberg',
    authorId: 'sample6',
    category: 'Self & Introspection',
    wallNumber: '06',
    firstLines: 'Standing still in the rush...',
    content: `Standing still in the rush,
I am an island in the stream.
Thousands pass. None see me.
I am learning to be invisible.

"Are you lost?" someone asks.
No. I am exactly where I need to be:
here, in the overwhelming now,
practicing the art of presence
in a place designed for passage.

Times Square teaches you
you are both everything
and nothing at all.`,
  },
  {
    id: '7',
    title: 'Tinkles',
    author: 'Sadiya Ali',
    authorId: 'sample7',
    category: 'Grief, Loss & Memory',
    wallNumber: '07',
    firstLines: 'The sound of ice in glasses...',
    content: `The sound of ice in glasses—
that's what brings you back.
Not photographs, not letters,
but this small auditory ghost.

You always filled your glass
too full, ice cubes crowding,
the gentle percussion
of abundance.

Now every clink is an elegy,
every tinkle a tiny bell
ringing you home,
ringing you gone.`,
  },
  {
    id: '8',
    title: 'Her Graduation',
    author: 'Luna Bailey',
    authorId: 'sample8',
    category: 'Family & Identity',
    wallNumber: '08',
    firstLines: 'She walks across the stage...',
    content: `She walks across the stage
and I am watching her
walk away from me,
toward everything,
toward the vast open.

This is what we do:
we grow them strong enough
to leave us.
We teach them to fly
then watch them go.

Her graduation is mine too—
I am graduating from the daily work
of raising her,
moving into the harder work
of letting her become.`,
  },
];

const categories = [
  'All',
  'Love & Relationships',
  'Nature & The Natural World',
  'Grief, Loss & Memory',
  'Family & Identity',
  'Time & Mortality',
  'Self & Introspection',
];

export function GalleryWallPage() {
  const { supabase } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedPoem, setExpandedPoem] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const publishedPoems = allPoems.filter(poem => {
    const status = (poem as { status?: string }).status;
    return !status || status === 'published';
  });

  // Check authentication with getSession() - DO NOT rely on user from context
  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      console.log('[GalleryWall] Checking access with getSession()...');
      
      try {
        // Get current session directly from Supabase with retry logic for race condition
        let { data: { session }, error } = await supabase.auth.getSession();
        console.log('[GalleryWall] Initial session check:', session ? 'exists' : 'null', error);
        
        // If no session initially, wait 2 seconds and retry once (handles race condition on page load)
        if (!session && !error) {
          console.log('[GalleryWall] No session found, waiting 2s for session restoration...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          const retry = await supabase.auth.getSession();
          session = retry.data.session;
          console.log('[GalleryWall] Retry session check:', session ? 'exists' : 'null');
        }

        if (!mounted) return;

        if (session) {
          console.log('[GalleryWall] Access granted - user:', session.user.email);
          setHasAccess(true);
        } else {
          console.log('[GalleryWall] No session after retry - access denied');
          setHasAccess(false);
        }
      } catch (err) {
        console.error('[GalleryWall] Error checking session:', err);
        if (mounted) {
          setHasAccess(false);
        }
      }
    };

    checkAccess();

    // Subscribe to auth state changes for immediate access grant on signin
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[GalleryWall] Auth state changed:', event, session ? 'has session' : 'no session');
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setHasAccess(false);
      } else if (event === 'SIGNED_IN' && session) {
        // Immediately grant access when user signs in
        setHasAccess(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const filteredPoems = selectedCategory === 'All' 
    ? publishedPoems 
    : publishedPoems.filter(p => p.category === selectedCategory);

  // Members Only Gate
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <GalleryNav />
        
        <div className="flex-1 flex items-center justify-center px-8 py-32">
          <div className="max-w-2xl text-center">
            {/* Lock Icon SVG */}
            <svg
              className="w-20 h-20 mx-auto mb-8 text-[#C4A265]"
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

            {/* Heading */}
            <h1 className="font-['Cardo'] text-6xl text-[#2C1810] mb-4 italic">
              The Gallery Wall
            </h1>

            {/* Subtitle */}
            <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] mb-8 italic">
              A Private Space for Our Writing Community
            </p>

            {/* Message */}
            <div className="border-t border-b border-[#C4A265]/30 py-8 mb-12">
              <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] leading-relaxed">
                The Gallery Wall is an intimate space where our community's finest works are displayed.
                <br />
                <br />
                Sign in to enter this private literary sanctuary.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="/signin?redirect=/gallery-wall"
                className="px-8 py-4 bg-[#C4A265] text-white hover:bg-[#B08D4F] transition-colors font-['Cardo'] text-sm tracking-wider shadow-lg hover:shadow-xl inline-block"
              >
                SIGN IN TO ENTER
              </a>
              <a
                href="/"
                className="px-8 py-4 border-2 border-[#C4A265]/30 text-[#2C1810] hover:border-[#C4A265] transition-colors font-['Cardo'] text-sm tracking-wider inline-block"
              >
                RETURN TO THE GALLERY
              </a>
            </div>

            <p className="text-xs text-[#8B7355] font-['Inter'] italic">
              A velvet rope at an intimate literary salon
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Navigation */}
      <GalleryNav />

      {/* Featured Exhibit Banner */}
      <div className="fixed top-24 left-0 right-0 z-40 bg-gradient-to-r from-[#1A1F2E] via-[#2C3347] to-[#1A1F2E] border-b border-[#C4A265]/30">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center justify-center gap-3">
          <span className="text-xs font-['Cardo'] tracking-wider text-[#C4A265] uppercase">
            Now Showing:
          </span>
          <a
            href="https://pagegalleryjournal.com/brigearhartstaton"
            target="_blank"
            rel="noopener noreferrer"
            className="font-['Cardo'] text-sm text-white hover:text-[#C4A265] transition-colors italic"
          >
            Along the Oxbow <span className="text-[#8B7355]">by Bri Gearhart Staton</span>
          </a>
          <ArrowRight className="w-3 h-3 text-[#C4A265]" />
        </div>
      </div>

      {/* Hero Section - Sophisticated */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-40 pb-20 px-8 bg-gradient-to-b from-[#FAF8F5] to-[#F5F0E8]"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Season/Issue */}
          <div className="font-['Cardo'] text-xs tracking-[0.3em] text-[#8B7355] mb-6 uppercase">
            Winter 2026
          </div>
          
          {/* Main Title */}
          <h1 className="font-['Cardo'] text-8xl md:text-9xl text-[#2C1810] mb-8 italic font-light">
            Gallery Wall
          </h1>
          
          {/* Gold Divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px w-24 bg-[#C4A265]"></div>
            <div className="w-1 h-1 bg-[#C4A265] mx-3 rotate-45"></div>
            <div className="h-px w-24 bg-[#C4A265]"></div>
          </div>
          
          {/* Subtitle */}
          <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] max-w-2xl mx-auto italic leading-relaxed">
            A curated collection of poetry and prose from our writing community
          </p>
        </div>
      </motion.section>

      {/* Category Filters - Refined Tabs */}
      <div className="sticky top-24 z-40 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#C4A265]/20 py-8">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex flex-wrap gap-8 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-['Cardo'] text-base tracking-wide transition-all pb-2 relative ${
                  selectedCategory === category
                    ? 'text-[#2C1810] font-medium'
                    : 'text-[#8B7355] hover:text-[#2C1810]'
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4A265]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Poems - Alternating Editorial Layout */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          {filteredPoems.map((poem, index) => (
            <div key={poem.id}>
              {/* Poem Entry */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative py-16 ${
                  index % 2 === 0 
                    ? 'border-l-[3px] border-[#C4A265] pl-12 pr-0' 
                    : 'border-r-[3px] border-[#C4A265] pr-12 pl-0 text-right'
                }`}
              >
                {/* Decorative Wall Number */}
                <div className={`absolute ${
                  index % 2 === 0 ? 'left-16' : 'right-16'
                } top-8 font-['Cardo'] text-8xl text-[#2C1810] opacity-5 pointer-events-none`}>
                  {poem.wallNumber}
                </div>

                {/* Category Label */}
                <div className={`text-xs uppercase tracking-[0.2em] text-[#C4A265] mb-3 font-['Cardo'] ${
                  index % 2 === 0 ? 'text-left' : 'text-right'
                }`}>
                  {poem.category}
                </div>

                {/* Title */}
                <button
                  onClick={() => setExpandedPoem(poem.id)}
                  className={`group block mb-3 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}
                >
                  <h2 className="font-['Cardo'] text-5xl text-[#2C1810] hover:text-[#C4A265] transition-colors duration-300">
                    {poem.title}
                  </h2>
                </button>

                {/* Author */}
                <p className={`text-sm uppercase tracking-[0.15em] text-[#8B7355] mb-6 font-['Cardo'] ${
                  index % 2 === 0 ? 'text-left' : 'text-right'
                }`}>
                  by {poem.author}
                </p>

                {/* Excerpt */}
                <p className={`font-['Libre_Baskerville'] text-lg text-[#2C1810] leading-relaxed italic mb-8 max-w-2xl ${
                  index % 2 === 0 ? 'text-left' : 'text-right ml-auto'
                }`}>
                  {poem.firstLines}
                </p>

                {/* Read Link */}
                <button
                  onClick={() => setExpandedPoem(poem.id)}
                  className={`group flex items-center gap-2 text-[#C4A265] hover:gap-4 transition-all font-['Cardo'] text-sm tracking-wider ${
                    index % 2 === 0 ? 'text-left' : 'text-right ml-auto flex-row-reverse'
                  }`}
                >
                  <span>READ POEM</span>
                  <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${
                    index % 2 === 1 ? 'rotate-180' : ''
                  }`} />
                </button>
              </motion.div>

              {/* Ornamental Divider (except after last poem) */}
              {index < filteredPoems.length - 1 && (
                <div className="flex items-center justify-center my-8">
                  <div className="h-px w-16 bg-[#C4A265]/30"></div>
                  <div className="w-1 h-1 bg-[#C4A265] mx-3 rotate-45"></div>
                  <div className="h-px w-16 bg-[#C4A265]/30"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Expanded Poem Modal */}
      {expandedPoem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-[#2C1810]/80 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setExpandedPoem(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] max-w-4xl w-full max-h-[85vh] overflow-y-auto p-16 relative shadow-2xl"
          >
            <button
              onClick={() => setExpandedPoem(null)}
              className="absolute top-8 right-8 p-2 hover:bg-[#F5F0E8] rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-[#8B7355]" />
            </button>

            {allPoems.find(p => p.id === expandedPoem) && (
              <>
                {/* Category */}
                <div className="text-xs uppercase tracking-[0.2em] text-[#C4A265] mb-4 font-['Cardo']">
                  {allPoems.find(p => p.id === expandedPoem)?.category}
                </div>

                {/* Title */}
                <h2 className="font-['Cardo'] text-6xl mb-4 text-[#2C1810] leading-tight">
                  {allPoems.find(p => p.id === expandedPoem)?.title}
                </h2>

                {/* Author */}
                <p className="text-sm uppercase tracking-[0.15em] text-[#8B7355] mb-12 font-['Cardo']">
                  by {allPoems.find(p => p.id === expandedPoem)?.author}
                </p>
                
                {/* Gold Divider */}
                <div className="flex items-center mb-12">
                  <div className="h-px flex-1 bg-[#C4A265]/30"></div>
                  <div className="w-1 h-1 bg-[#C4A265] mx-4 rotate-45"></div>
                  <div className="h-px flex-1 bg-[#C4A265]/30"></div>
                </div>

                {/* Full Poem Content */}
                <div className="font-['Libre_Baskerville'] text-2xl leading-loose text-[#2C1810] whitespace-pre-wrap mb-16">
                  {allPoems.find(p => p.id === expandedPoem)?.content.split('\n').map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.03 }}
                    >
                      {line}
                    </motion.div>
                  ))}
                </div>

                {/* Visit Author Button */}
                <a
                  href={`/writer/${allPoems.find(p => p.id === expandedPoem)?.authorId}`}
                  className="inline-block px-8 py-4 border-2 border-[#C4A265] text-[#2C1810] hover:bg-[#C4A265] hover:text-white transition-all font-['Cardo'] text-sm tracking-wider"
                >
                  VISIT {allPoems.find(p => p.id === expandedPoem)?.author.toUpperCase()}'S ROOM
                </a>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <GalleryFooter />
    </div>
  );
}

import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Feather, Key } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

// Sample poems for Winter 2026 issue
const winterPoems = [
  {
    id: '1',
    title: 'Your Eyes',
    author: 'Pam Martin-Lawrence',
    authorId: 'sample1',
    category: 'Love & Relationships',
    wallNumber: '01',
    preview: 'In your eyes I see\\na universe unfolding...',
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
  },
  {
    id: '2',
    title: 'Thoughts on love during a heatwave',
    author: 'Ella B Winters',
    authorId: 'sample2',
    category: 'Love & Relationships',
    wallNumber: '02',
    preview: 'The air is thick with wanting...',
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
    preview: 'I keep finding ocean in my pockets...',
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
    preview: 'After the storm, such clarity...',
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
    preview: 'Bless the small things...',
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
    preview: 'Standing still in the rush...',
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
    preview: 'The sound of ice in glasses...',
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
    preview: 'She walks across the stage...',
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

export function GalleryLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F5F0EB] to-[#FAF8F5]">
      {/* Navigation */}
      <GalleryNav />

      {/* Hero Section - Enhanced */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="space-page-top pb-24 px-8 relative overflow-hidden surface-gallery"
      >
        {/* Atmospheric background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_var(--state-seed)_0%,_transparent_50%)] opacity-5"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-[radial-gradient(circle,_var(--state-bloom)_0%,_transparent_70%)] opacity-5"></div>
        
        <div className="container-page relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <Feather className="w-10 h-10 icon-sprout" style={{ color: 'var(--state-seed)' }} />
            </div>
            <div className="text-meta mb-6">
              Winter 2026
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="heading-hero mb-6 text-center"
            style={{ fontSize: 'clamp(4rem, 15vw, 10rem)' }}
          >
            The Gallery
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-large mb-12 text-center max-w-4xl mx-auto"
            style={{ fontSize: 'var(--text-3xl)' }}
          >
            A living literary journal
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/collection-gallery"
              className="btn-bloom inline-flex items-center gap-3 px-10 py-5 text-lg group"
            >
              Read The Collection
              <ArrowRight className="w-5 h-5 icon-sprout transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/about"
              className="btn-secondary inline-flex items-center gap-3 px-10 py-5 text-lg group"
            >
              <BookOpen className="w-5 h-5 icon-sprout" />
              About The Gallery
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Exhibit Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-32 px-8 bg-[#1A1F2E] relative overflow-hidden"
      >
        {/* Atmospheric elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#6366F1]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#C4A265]/20 to-transparent"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-['Courier_New'] text-xs tracking-[0.3em] text-[#C4A265] mb-6 uppercase"
          >
            Featured Exhibit
          </motion.div>

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-['Cardo'] text-7xl md:text-9xl text-white mb-8 italic font-light leading-tight"
          >
            Along the Oxbow
          </motion.h2>

          {/* Credits */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="font-['Libre_Baskerville'] text-xl text-[#E8E4DC] mb-2">
              Written by <span className="text-[#C4A265]">Bri Gearhart Staton</span>
            </p>
            <p className="font-['Libre_Baskerville'] text-xl text-[#E8E4DC]">
              Illustrated by <span className="text-[#4F46E5]">Sophia Sharkey</span>
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="font-['Libre_Baskerville'] text-lg text-[#E8E4DC]/80 mb-12 max-w-3xl mx-auto leading-loose italic"
          >
            An immersive poetry experience where each verse responds to the bend in the river. Navigate illustrated vignettes exploring memory, landscape, and transformation.
          </motion.p>

          {/* Decorative divider with indigo accent */}
          <div className="flex items-center justify-center mb-12">
            <div className="h-px w-24 bg-[#C4A265]/50"></div>
            <div className="w-2 h-2 bg-[#4F46E5] mx-4 rounded-full animate-pulse"></div>
            <div className="h-px w-24 bg-[#C4A265]/50"></div>
          </div>

          {/* Visit Button */}
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            href="https://pagegalleryjournal.com/brigearhartstaton"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-10 py-5 bg-[#E11D48] text-white hover:bg-[#C01040] hover:shadow-2xl transition-all font-['Cardo'] text-lg tracking-wide group"
          >
            Enter The Exhibit
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>
      </motion.section>

      {/* Issue Preview Card */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 px-8"
      >
        <div className="max-w-5xl mx-auto">
          <a 
            href="/collection-gallery"
            className="block p-12 md:p-16 bg-gradient-to-br from-white to-[#FAF7F2] border-2 border-[#E0D8D0] hover:border-[#E11D48] transition-all hover:shadow-2xl group rounded-2xl relative overflow-hidden"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#E11D48]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full"></div>
            
            <div className="relative z-10">
              <div className="font-['Courier_New'] text-sm tracking-widest text-[#8B7355] mb-6 uppercase">
                Winter 2026 — Issue 01
              </div>
              <h2 className="font-['Cardo'] text-7xl italic mb-6 text-[#2C1810] group-hover:text-[#E11D48] transition-colors">
                The Gallery
              </h2>
              <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] leading-relaxed mb-8 max-w-3xl">
                An ongoing, living magazine inspired by the shoreline. Eight pieces exploring love, nature, memory, and the spaces between words.
              </p>
              <div className="flex items-center gap-3 font-['Cardo'] text-lg text-[#E11D48] group-hover:gap-4 transition-all">
                Explore the issue
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </a>
        </div>
      </motion.section>

      {/* Featured Poems Preview */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C4A265] to-transparent"></div>
              <BookOpen className="w-6 h-6 text-[#C4A265]" />
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C4A265] to-transparent"></div>
            </div>
            <div className="font-['Courier_New'] text-sm tracking-widest text-[#8B7355] mb-4 uppercase">
              From The Collection
            </div>
            <h2 className="font-['Cardo'] text-6xl md:text-7xl text-[#2C1810] mb-6 italic">
              Featured Work
            </h2>
            <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] max-w-2xl mx-auto">
              A selection from our Winter 2026 issue
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {winterPoems.slice(0, 4).map((poem, index) => (
              <motion.div
                key={poem.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 border-2 border-[#E0D8D0] hover:border-[#C4A265] hover:shadow-lg transition-all bg-gradient-to-br from-[#F5F0EB]/50 to-white rounded-xl"
              >
                <div className="font-['Courier_New'] text-xs text-[#8B7355] mb-2 uppercase tracking-wider">
                  Wall {poem.wallNumber}
                </div>
                <h3 className="font-['Cardo'] text-3xl mb-2 text-[#2C1810] group-hover:text-[#E11D48] transition-colors">
                  {poem.title}
                </h3>
                <p className="font-['Courier_New'] text-sm text-[#8B7355] mb-6">
                  by {poem.author}
                </p>
                <p className="font-[family-name:var(--font-poetry)] text-lg leading-loose text-[#2C1810]/80 mb-6 italic">
                  {poem.preview}
                </p>
                <a 
                  href="/collection-gallery"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#C4A265] text-[#C4A265] hover:bg-[#C4A265] hover:text-white transition-all font-['Cardo'] text-sm tracking-wide group-hover:gap-3"
                >
                  Read Full Piece
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a 
              href="/collection-gallery"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#2C1810] text-white hover:bg-[#1A1A1A] hover:shadow-xl transition-all font-['Cardo'] text-lg tracking-wide group"
            >
              View Complete Issue
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Editor Log In - Subtle section at bottom */}
      <section className="py-12 px-8 bg-[#FAF8F5] border-t border-[#E0D8D0]">
        <div className="max-w-7xl mx-auto text-center">
          <a
            href="/editors"
            className="inline-flex items-center gap-2 text-sm text-[#8B7355] hover:text-[#2C1810] transition-colors font-['Libre_Baskerville'] group"
          >
            <Key className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            <span>Editor Log In</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <GalleryFooter />
    </div>
  );
}
import { motion } from 'motion/react';
import { ArrowRight, Moon, User, Send, Eye, Heart, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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
    preview: 'In your eyes I see\na universe unfolding...',
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

const categories = [
  'Love & Relationships',
  'Nature & The Natural World',
  'Grief, Loss & Memory',
  'Family & Identity',
  'Time & Mortality',
  'Self & Introspection',
];

const joinFeatures = [
  {
    icon: User,
    title: 'Your Page',
    description: 'A personal page where your pieces, drafts, and bio live.',
  },
  {
    icon: Send,
    title: 'Submit Directly',
    description: 'Submit to The Gallery from your page — no cold forms.',
  },
  {
    icon: Eye,
    title: 'Track Your Work',
    description: 'See where your pieces are in the editorial queue.',
  },
  {
    icon: Heart,
    title: 'Follow Writers',
    description: 'Follow writers you love and get notified when they publish.',
  },
  {
    icon: Award,
    title: 'Build Your Record',
    description: 'A track record that editors can see at a glance.',
  },
];

const submitSteps = [
  {
    title: 'Create Your Page',
    description: 'Add a bio and your work.',
  },
  {
    title: 'Upload a Draft',
    description: 'Write or paste a piece on your page.',
  },
  {
    title: 'Submit',
    description: 'Click submit to enter the editorial queue.',
  },
  {
    title: 'Track It',
    description: 'Follow it from received to accepted.',
  },
];

export function GalleryLandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Navigation */}
      <GalleryNav />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pt-48 pb-32 px-8"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-['Courier_New'] text-sm tracking-[0.3em] text-[#717171] mb-6"
          >
            WINTER 2026
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-['Cardo'] text-[8rem] md:text-[12rem] italic leading-none text-[#2C2C2C] mb-8"
          >
            The Gallery
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-['Cardo'] text-2xl italic text-[#717171] mb-8"
          >
            "a room of one's own"
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-[family-name:var(--font-body)] text-xl max-w-2xl mx-auto text-[#2C2C2C]/80 mb-12 leading-relaxed"
          >
            A curated collection of contemporary writing, poetry, and visual art. 
            Where work breathes and readers wander.
          </motion.p>
          
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            href="/collection"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#E11D48] !text-white hover:bg-[#C01040] hover:scale-105 hover:shadow-lg transition-all hover:gap-4 font-['Courier_New'] text-sm font-semibold group"
          >
            READ THE LIVE ISSUE
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.a>
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
        {/* Blue botanical accent elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6366F1]/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-['Cardo'] text-xs tracking-[0.3em] text-[#C4A265] mb-6 uppercase"
          >
            Current Exhibit
          </motion.div>

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-['Cardo'] text-7xl md:text-8xl text-white mb-8 italic font-light"
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
            <p className="font-['Libre_Baskerville'] text-lg text-[#E8E4DC] mb-2">
              Written by <span className="text-[#C4A265]">Bri Gearhart Staton</span>
            </p>
            <p className="font-['Libre_Baskerville'] text-lg text-[#E8E4DC]">
              Illustrated by <span className="text-[#4F46E5]">Sophia Sharkey</span>
            </p>
          </motion.div>

          {/* Decorative divider with indigo accent */}
          <div className="flex items-center justify-center mb-12">
            <div className="h-px w-24 bg-[#C4A265]/50"></div>
            <div className="w-2 h-2 bg-[#4F46E5] mx-4 rounded-full"></div>
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
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-all font-['Courier_New'] text-sm group"
          >
            ENTER THE EXHIBIT
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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
        <div className="max-w-4xl mx-auto">
          <a 
            href="/collection"
            className="block p-12 bg-white border-2 border-[#E0D8D0] hover:border-[#E11D48] transition-all hover:shadow-2xl group"
          >
            <div className="font-['Courier_New'] text-sm tracking-widest text-[#717171] mb-4">
              WINTER 2026 — ISSUE 01
            </div>
            <h2 className="font-['Cardo'] text-6xl italic mb-6 text-[#2C2C2C] group-hover:text-[#E11D48] transition-colors">
              The Gallery
            </h2>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#717171] leading-relaxed mb-8">
              An ongoing, living magazine inspired by the shoreline. Eight pieces exploring love, 
              nature, memory, and the spaces between words.
            </p>
            <div className="font-['Courier_New'] text-sm text-[#E11D48]">
              Click to explore the issue →
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
            <div className="font-['Courier_New'] text-sm tracking-widest text-[#717171] mb-4">
              FROM THE COLLECTION
            </div>
            <h2 className="font-['Cardo'] text-6xl text-[#2C2C2C] mb-6">
              Featured Work
            </h2>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#717171] max-w-2xl mx-auto">
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
                className="p-8 border-2 border-[#E0D8D0] hover:border-[#C4918A] transition-all bg-[#F5F0EB]/50"
              >
                <div className="font-['Courier_New'] text-xs text-[#717171] mb-2">
                  WALL {poem.wallNumber}
                </div>
                <h3 className="font-['Cardo'] text-3xl mb-2 text-[#2C2C2C]">
                  {poem.title}
                </h3>
                <p className="font-['Courier_New'] text-sm text-[#717171] mb-6">
                  by {poem.author}
                </p>
                <p className="font-[family-name:var(--font-poetry)] text-lg leading-loose text-[#2C2C2C]/80 mb-6 italic">
                  {poem.preview}
                </p>
                <a 
                  href="/collection"
                  className="inline-block px-6 py-3 border-2 border-[#C4918A] text-[#C4918A] hover:bg-[#C4918A] hover:text-white transition-colors font-['Courier_New'] text-sm"
                >
                  READ FULL PIECE
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
              href="/collection"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#2C2C2C] text-white hover:bg-[#1A1A1A] transition-all font-['Courier_New'] text-sm"
            >
              VIEW COMPLETE ISSUE
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Join Page Section */}
      <section className="py-24 px-8 bg-[#EDE8E1] border-y border-[#E0D8D0]/70">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Part A — Hero band */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8 rounded-3xl bg-[#0B1221] text-white p-12 shadow-xl overflow-hidden"
          >
            <h2 className="font-[family-name:var(--font-display)] text-6xl md:text-7xl">
              Join <span className="italic text-[#E6D5B8]">page</span>
            </h2>
            <p className="font-[family-name:var(--font-body)] text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              The social home of The Gallery — follow writers, share drafts, and see what the editors are reading.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#E11D48] text-white rounded-md hover:bg-[#C01040] transition-all font-[family-name:var(--font-ui)] text-sm tracking-wide shadow-md"
              >
                Join Now
              </a>
              <a
                href="/meet-the-page"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white rounded-md hover:bg-white/10 transition-all font-[family-name:var(--font-ui)] text-sm tracking-wide"
              >
                Learn More
              </a>
            </div>
            <p className="font-[family-name:var(--font-body)] text-sm text-white/60">
              Free to join, for writers and readers.
            </p>
          </motion.div>

          {/* Part B — Why Join grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <h3 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[#1A1F2E]">
                Why Join <span className="italic text-[#8B7355]">page</span>?
              </h3>
              <p className="font-[family-name:var(--font-body)] text-lg text-[#1A1F2E]/75 max-w-3xl mx-auto">
                Built for writers, editors, and the readers who follow them.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-5">
              {joinFeatures.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-white/90 border border-[#E0D8D0] rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#F5F0EB] border border-[#E0D8D0] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#8B7355]" />
                      </div>
                      <h4 className="font-[family-name:var(--font-display)] text-xl text-[#1A1F2E]">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="font-[family-name:var(--font-body)] text-base text-[#1A1F2E]/75 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Part C — How to Submit */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <h3 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[#1A1F2E]">
                How You Submit to The Gallery
              </h3>
              <p className="font-[family-name:var(--font-body)] text-lg text-[#1A1F2E]/75 max-w-2xl mx-auto">
                Start on your page, submit in a click, track it all the way.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {submitSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 bg-white/90 border border-[#E0D8D0] rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-[#8B7355] text-white flex items-center justify-center font-[family-name:var(--font-ui)] text-sm tracking-wide mb-4">
                    {index + 1}
                  </div>
                  <h4 className="font-[family-name:var(--font-display)] text-xl text-[#1A1F2E] mb-2">
                    {step.title}
                  </h4>
                  <p className="font-[family-name:var(--font-body)] text-base text-[#1A1F2E]/75 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-10 py-4 bg-[#E11D48] text-white rounded-md hover:bg-[#C01040] transition-all font-[family-name:var(--font-ui)] text-sm tracking-wide shadow-md"
              >
                Create Your Page
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Exhibits Section */}
      <section className="py-24 px-8 bg-gradient-to-b from-[#F5F0EB] to-[#E8E0D8]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="font-['Courier_New'] text-sm tracking-widest text-[#717171] mb-4">
              IMMERSIVE EXPERIENCES
            </div>
            <h2 className="font-['Cardo'] text-7xl text-[#2C2C2C] mb-6">
              Exhibits
            </h2>
            <p className="font-[family-name:var(--font-body)] text-xl text-[#717171] italic">
              Where poetry transcends the page
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative p-12 bg-gradient-to-br from-white to-[#F5F0EB] border-2 border-[#E0D8D0] hover:border-[#C4918A] transition-all hover:shadow-2xl"
          >
            <div className="font-['Courier_New'] text-xs tracking-widest text-[#717171] mb-4">
              FEATURED EXHIBIT
            </div>
            <h3 className="font-['Cardo'] text-5xl mb-3 text-[#2C2C2C]">
              Along the Oxbow
            </h3>
            <p className="font-['Cardo'] text-xl italic text-[#717171] mb-8">
              by Bri Gearhart Staton, illustrations by Sophia Sharkey
            </p>
            <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed text-[#2C2C2C]/80 mb-8 max-w-2xl">
              An interactive poetry experience exploring memory, landscape, and the river's 
              constant transformation. Navigate through illustrated vignettes where each poem 
              responds to the bend in the river.
            </p>
            <a 
              href="https://pagegalleryjournal.com/brigearhartstaton"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-all font-['Courier_New'] text-sm group"
            >
              ENTER THE EXHIBIT
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-8 font-['Courier_New'] text-xs text-[#717171] italic">
              Additional exhibits forthcoming
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <GalleryFooter />
    </div>
  );
}

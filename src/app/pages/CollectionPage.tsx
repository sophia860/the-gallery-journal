import { useState } from 'react';
import { motion } from 'motion/react';
import { Moon, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

// Winter 2026 Issue Content
const winterPoems = [
  {
    id: '1',
    title: 'Your Eyes',
    author: 'Pam Martin-Lawrence',
    authorId: 'sample1',
    category: 'Love & Relationships',
    wallNumber: '01',
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

const sections = [
  {
    title: 'Love & Relationships',
    intro: 'Poems exploring connection, desire, and the spaces between hearts.',
    poems: winterPoems.filter(p => p.category === 'Love & Relationships'),
  },
  {
    title: 'Nature & The Natural World',
    intro: 'Work that finds wisdom in landscapes, seasons, and the earth\'s patient teachings.',
    poems: winterPoems.filter(p => p.category === 'Nature & The Natural World'),
  },
  {
    title: 'Grief, Loss & Memory',
    intro: 'Pieces that hold what\'s gone and honor how absence shapes us.',
    poems: winterPoems.filter(p => p.category === 'Grief, Loss & Memory'),
  },
  {
    title: 'Family & Identity',
    intro: 'Explorations of who we are, where we come from, and how we become.',
    poems: winterPoems.filter(p => p.category === 'Family & Identity'),
  },
  {
    title: 'Time & Mortality',
    intro: 'Meditations on impermanence, aging, and the grace of ordinary days.',
    poems: winterPoems.filter(p => p.category === 'Time & Mortality'),
  },
  {
    title: 'Self & Introspection',
    intro: 'Inward journeys and the art of seeing oneself clearly.',
    poems: winterPoems.filter(p => p.category === 'Self & Introspection'),
  },
];

export function CollectionPage() {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'writer';
  const isEditor = userRole === 'editor' || userRole === 'managing_editor';
  const [expandedPieces, setExpandedPieces] = useState<Record<string, boolean>>({});

  const togglePiece = (id: string) => {
    setExpandedPieces((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Navigation */}
      <GalleryNav currentPage="collection" />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-40 pb-24 px-8 border-b-2 border-[#E0D8D0]"
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="font-['Courier_New'] text-sm text-[#717171] mb-4 tracking-widest">
            THE GALLERY PRESENTS
          </div>
          <h1 className="font-['Cardo'] text-7xl md:text-9xl mb-6 text-[#2C2C2C] leading-none">
            Winter 2026
          </h1>
          <div className="font-['Courier_New'] text-lg text-[#717171] mb-8">
            Issue 01 • Eight pieces exploring memory, nature, love, and time
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="font-[family-name:var(--font-body)] text-xl leading-relaxed text-[#2C2C2C] italic">
              An ongoing, living collection inspired by the shoreline. Work that breathes with the changing seasons.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Category Navigation Pills */}
      <div className="sticky top-24 z-40 bg-[#F5F0EB]/95 backdrop-blur-sm border-b border-[#E0D8D0] py-6">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`}
                className="px-4 py-2 border border-[#C4918A] text-[#C4918A] hover:bg-[#C4918A] hover:text-white transition-colors whitespace-nowrap font-['Courier_New'] text-sm"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, sectionIdx) => (
        <motion.div
          key={sectionIdx}
          id={section.title.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`py-24 px-8 ${sectionIdx % 2 === 0 ? 'bg-[#F5F0EB]' : 'bg-white'}`}
        >
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-16 pb-8 border-b-2 border-[#E0D8D0]">
              <h2 className="font-['Cardo'] text-5xl mb-6 text-[#2C2C2C]">
                {section.title}
              </h2>
              <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed text-[#717171] italic">
                {section.intro}
              </p>
            </div>

            {/* Poems in Section */}
            <div className="space-y-12">
              {section.poems.map((poem) => {
                const isExpanded = expandedPieces[poem.id];

                return (
                  <motion.div
                    key={poem.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="border-2 border-[#E0D8D0] bg-white hover:border-[#C4918A] transition-all"
                  >
                    <button
                      onClick={() => togglePiece(poem.id)}
                      className="w-full p-8 text-left flex justify-between items-center group"
                    >
                      <div className="flex-1">
                        <div className="font-['Courier_New'] text-xs text-[#717171] mb-2">
                          WALL {poem.wallNumber}
                        </div>
                        <h3 className="font-['Cardo'] text-3xl mb-2 text-[#2C2C2C] group-hover:text-[#C4918A] transition-colors">
                          {poem.title}
                        </h3>
                        <p className="font-['Courier_New'] text-sm text-[#717171]">
                          by <a href={`/room/${poem.authorId}`} className="hover:text-[#C4918A] transition-colors">{poem.author}</a>
                        </p>
                      </div>
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-[#C4918A]" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-[#717171]" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="px-8 pb-8 pt-4 border-t border-[#E0D8D0]"
                      >
                        <div className="font-[family-name:var(--font-poetry)] text-xl leading-loose whitespace-pre-wrap text-[#2C2C2C] mb-8">
                          {poem.content.split('\n').map((line, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                              {line}
                            </motion.div>
                          ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#E0D8D0]">
                          <a
                            href={`/room/${poem.authorId}`}
                            className="inline-block px-6 py-3 border-2 border-[#C4918A] text-[#C4918A] hover:bg-[#C4918A] hover:text-white transition-colors font-['Courier_New'] text-sm"
                          >
                            VISIT {poem.author.toUpperCase()}'S ROOM
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Footer CTA */}
      <GalleryFooter />
    </div>
  );
}
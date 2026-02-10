import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Feather } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

// Sample poems for Winter 2026 issue
const winterPoems = [
  {
    id: '1',
    title: 'I THOUGHT YOU\'D BEEN QUEER LONGER THAN THAT',
    author: 'Nix Carlson',
    authorId: 'nix1',
    category: 'Self & Introspection',
    wallNumber: '01',
    preview: 'Perhaps because I have been...',
    content: `I thought you'd been queer longer than that,
you said, like it was a compliment,
like I'd earned some invisible badge
by wearing the right shoes
or knowing the right songs.

But I've been queer since before
I had the words for it—
in the way I looked at girls in seventh grade,
in the way I couldn't explain
why I felt more myself
in borrowed clothes,
in spaces between.

You don't measure queerness
in years or coming-out stories.
You measure it in the quiet knowing,
the way you finally exhale
when you stop pretending.`,
  },
  {
    id: '2',
    title: 'POLYAMORY',
    author: 'Nix Carlson',
    authorId: 'nix2',
    category: 'Love & Relationships',
    wallNumber: '02',
    preview: 'i know i look to you like a child never quite loved right...',
    content: `They ask how it works,
like love is a math problem
with only one solution.

But love isn't division—
it's multiplication.
My heart doesn't split
into smaller pieces;
it grows larger rooms.

Yes, it's complicated.
So is a symphony.
So is a garden.
So is anything worth doing.

I'm learning that jealousy
isn't a proof of love—
it's a question to ask yourself.
Compersion is the answer:
joy in the joy of those you love.

We're making it up as we go,
writing our own instruction manual,
and isn't that what love
has always been?`,
  },
  {
    id: '3',
    title: 'YES',
    author: 'Nix Carlson',
    authorId: 'nix3',
    category: 'Love & Relationships',
    wallNumber: '03',
    preview: 'gravity wraps my hair in its fist and pulls me on top...',
    content: `Yes to the first kiss
that tasted like coffee and courage.

Yes to the second date
where we talked until the restaurant
closed around us.

Yes to the third month
when I stopped counting
and started believing.

Yes to moving in together,
to learning how you fold towels
(wrong, but I love you anyway).

Yes to the hard conversations,
the ones that start with
"we need to talk"
and end with
"I'm not going anywhere."

Yes to forever,
whatever shape it takes.
Yes to us.
Yes.`,
  },
  {
    id: '4',
    title: 'REASONS YOU REFUSE TO DATE ME',
    author: 'Nix Carlson',
    authorId: 'nix4',
    category: 'Love & Relationships',
    wallNumber: '04',
    preview: 'my nose is too big. so are my thighs...',
    content: `You say I'm too intense,
like it's a warning label
on a bottle of something dangerous.

You say you need space,
but I see the way you orbit
everyone else's gravity.

You say timing is everything,
but I've been waiting
for the right moment
since before we met.

You say you're not ready,
and maybe that's true,
or maybe I'm just not
the one you want to be ready for.

Either way,
I'm learning to accept
that sometimes
the door is closed
not because it's locked,
but because it was never
meant for me to open.`,
  },
  {
    id: '5',
    title: 'I PROBABLY L*VE YOU',
    author: 'Nix Carlson',
    authorId: 'nix5',
    category: 'Love & Relationships',
    wallNumber: '05',
    preview: 'but we\'re sitting in your car under the broken streetlight...',
    content: `I can't say it yet,
not out loud,
not with all four letters
in the right order.

But I probably l*ve you
in the way I remember
how you take your coffee.

I probably l*ve you
in the way I text you
the street art I see
because you'd appreciate it.

I probably l*ve you
in the way I'm scared
of how much I probably l*ve you.

One day I'll say it without the asterisk,
without the probably,
without the fear.

But for now,
know this:
I probably l*ve you
more than I know how to say.`,
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
                An ongoing, living magazine inspired by the shoreline. Five pieces exploring identity, desire, love, and the spaces between words.
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

      {/* Footer */}
      <GalleryFooter />
    </div>
  );
}
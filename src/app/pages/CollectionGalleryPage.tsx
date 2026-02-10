import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { Footer } from '../components/Footer';

// Type for display piece
interface DisplayPiece {
  id: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  wallNumber: string;
}

const categories = [
  'All',
  'Love & Relationships',
  'Nature & The Natural World',
  'Grief, Loss & Memory',
  'Family & Identity',
  'Time & Mortality',
  'Self & Introspection'
];

// Hardcoded poems by Nix Carlson - Always available
const PUBLISHED_POEMS: DisplayPiece[] = [
  {
    id: '1',
    title: 'I THOUGHT YOU\'D BEEN QUEER LONGER THAN THAT',
    author: 'Nix Carlson',
    category: 'Self & Introspection',
    excerpt: 'I thought you\'d been queer longer than that, you said, like it was a compliment...',
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
    publishedDate: '2026-01-15',
    wallNumber: '01'
  },
  {
    id: '2',
    title: 'POLYAMORY',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    excerpt: 'They ask how it works, like love is a math problem with only one solution...',
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
    publishedDate: '2026-01-20',
    wallNumber: '02'
  },
  {
    id: '3',
    title: 'YES',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    excerpt: 'Yes to the first kiss that tasted like coffee and courage...',
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
    publishedDate: '2026-01-25',
    wallNumber: '03'
  },
  {
    id: '4',
    title: 'REASONS YOU REFUSE TO DATE ME',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    excerpt: 'You say I\'m too intense, like it\'s a warning label on a bottle of something dangerous...',
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
    publishedDate: '2026-01-30',
    wallNumber: '04'
  },
  {
    id: '5',
    title: 'I PROBABLY L*VE YOU',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    excerpt: 'I can\'t say it yet, not out loud, not with all four letters in the right order...',
    content: `I can't say it yet,
not out loud,
not with all four letters
in the right order.

But I probably l*ve you
in the way I remember
how you take your coffee.

But I probably l*ve you
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
    publishedDate: '2026-02-05',
    wallNumber: '05'
  }
];

export function CollectionGalleryPage() {
  const [selectedPiece, setSelectedPiece] = useState<DisplayPiece | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredPieces = selectedCategory === 'All'
    ? PUBLISHED_POEMS
    : PUBLISHED_POEMS.filter(p => p.category === selectedCategory);

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
            The Collection
          </h1>
          
          {/* Gold Divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px w-24 bg-[#C4A265]"></div>
            <div className="w-1 h-1 bg-[#C4A265] mx-3 rotate-45"></div>
            <div className="h-px w-24 bg-[#C4A265]"></div>
          </div>
          
          {/* Subtitle */}
          <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] max-w-2xl mx-auto italic leading-relaxed">
            Published works from our curated editorial selections
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
                className={`pb-2 px-1 text-sm uppercase tracking-[0.15em] font-['Inter'] font-semibold transition-all relative ${
                  selectedCategory === category
                    ? 'text-[#2C1810]'
                    : 'text-[#8B7355] hover:text-[#2C1810]'
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4A265]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Published Pieces Grid */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPieces.map((piece, index) => (
              <motion.article
                key={piece.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedPiece(piece)}
                className="group cursor-pointer"
              >
                {/* Card Container */}
                <div className="h-full p-8 bg-white border-2 border-[#E8E0D8] hover:border-[#C4A265] hover:shadow-xl transition-all duration-300">
                  {/* Wall Number */}
                  <div className="font-['Courier_New'] text-xs tracking-wider text-[#8B7355] mb-4 uppercase">
                    Wall {piece.wallNumber}
                  </div>

                  {/* Title */}
                  <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-3 group-hover:text-[#C4A265] transition-colors">
                    {piece.title}
                  </h2>

                  {/* Author */}
                  <p className="font-['Courier_New'] text-sm text-[#8B7355] mb-6">
                    by {piece.author}
                  </p>

                  {/* Excerpt */}
                  <p className="font-['Libre_Baskerville'] text-base text-[#2C1810]/70 leading-relaxed mb-6 italic">
                    {piece.excerpt}
                  </p>

                  {/* Read Button */}
                  <div className="flex items-center gap-2 text-sm font-['Inter'] font-semibold text-[#C4A265] uppercase tracking-wider">
                    Read Full Piece
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPieces.length === 0 && (
            <div className="text-center py-20">
              <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] italic">
                No pieces found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Full Piece Modal */}
      {selectedPiece && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedPiece(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-[#FAF8F5] max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPiece(null)}
              className="absolute top-6 right-6 p-2 hover:bg-[#E8E0D8] transition-colors rounded-full z-10"
            >
              <X className="w-6 h-6 text-[#2C1810]" />
            </button>

            {/* Modal Content */}
            <div className="p-12 md:p-16">
              {/* Wall Number */}
              <div className="font-['Courier_New'] text-xs tracking-wider text-[#8B7355] mb-6 uppercase">
                Wall {selectedPiece.wallNumber}
              </div>

              {/* Title */}
              <h2 className="font-['Cardo'] text-5xl md:text-6xl text-[#2C1810] mb-4 leading-tight">
                {selectedPiece.title}
              </h2>

              {/* Author & Date */}
              <div className="flex items-center gap-4 mb-12 pb-8 border-b border-[#C4A265]/30">
                <p className="font-['Courier_New'] text-sm text-[#8B7355]">
                  by {selectedPiece.author}
                </p>
                <span className="text-[#C4A265]">•</span>
                <p className="font-['Courier_New'] text-sm text-[#8B7355]">
                  {new Date(selectedPiece.publishedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Poem Content */}
              <div className="prose prose-lg max-w-none">
                <div className="font-['Libre_Baskerville'] text-xl text-[#2C1810] leading-loose whitespace-pre-line">
                  {selectedPiece.content}
                </div>
              </div>

              {/* Category Tag */}
              <div className="mt-12 pt-8 border-t border-[#C4A265]/30">
                <span className="inline-block px-4 py-2 bg-[#C4A265]/10 border border-[#C4A265]/30 text-[#2C1810] text-sm font-['Inter'] font-medium uppercase tracking-wider">
                  {selectedPiece.category}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
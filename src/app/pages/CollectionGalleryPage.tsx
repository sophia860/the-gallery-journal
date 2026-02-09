import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { Footer } from '../components/Footer';

// Published demo pieces for the public gallery (NO DRAFTS)
const publishedPieces = [
  {
    id: '1',
    title: 'Love Letter at 3AM',
    author: 'David Park',
    category: 'Love & Relationships',
    excerpt: "I'm writing this at 3am because I can't sleep without telling you: You are the answer to questions I didn't know I was asking.",
    content: `I'm writing this at 3am\nbecause I can't sleep\nwithout telling you:\n\nYou are the answer\nto questions I didn't know\nI was asking.\n\nYour laugh is the sound\nof home,\nand I've been homeless\nfor so long.`,
    publishedDate: '2026-01-25',
    wallNumber: '09'
  },
  {
    id: '2',
    title: 'After the Funeral',
    author: 'Sarah Williams',
    category: 'Grief, Loss & Memory',
    excerpt: 'We sit in the living room, talking about everything except the empty chair.',
    content: `We sit in the living room,\ntalking about everything\nexcept the empty chair.\n\nSomeone makes coffee.\nSomeone tells a joke.\nWe laugh, then feel guilty\nfor laughing.\n\nThis is how grief works—\nin the pauses between words,\nin the ordinary tasks\nthat keep us moving forward.`,
    publishedDate: '2026-01-23',
    wallNumber: '12'
  },
  {
    id: '3',
    title: 'Winter Morning',
    author: 'James Chen',
    category: 'Nature & The Natural World',
    excerpt: 'The city wakes slowly, frost on windows like lace, breath visible in the air.',
    content: `The city wakes slowly,\nfrost on windows like lace,\nbreath visible in the air.\n\nI watch from my kitchen,\ncoffee warming my hands,\nthe sun still deciding\nwhether to show up today.\n\nEverything suspended\nin this quiet blue hour—\nthe world holding its breath\nbefore the day begins.`,
    publishedDate: '2026-02-15',
    wallNumber: '14'
  },
  {
    id: '4',
    title: 'Fragments of Home',
    author: 'Maya Rodriguez',
    category: 'Family & Identity',
    excerpt: 'I carry fragments of home in my pockets—a worn coin, a pressed flower, my grandmother\'s recipe written in Spanish.',
    content: `I carry fragments of home\nin my pockets—\na worn coin, a pressed flower,\nmy grandmother's recipe written in Spanish.\n\nThese small relics map\nthe distance between\nwhere I'm from\nand where I am.\n\nSometimes I forget\nwhich language I'm thinking in,\nwhich kitchen I'm standing in,\nwhich version of myself\nI'm supposed to be.`,
    publishedDate: '2026-02-01',
    wallNumber: '11'
  },
  {
    id: '5',
    title: 'The Space Between',
    author: 'Luna Martinez',
    category: 'Time & Mortality',
    excerpt: 'There\'s a moment between sleeping and waking when I forget everything that\'s happened.',
    content: `There's a moment\nbetween sleeping and waking\nwhen I forget\neverything that's happened.\n\nFor those three seconds,\nI am neither here nor there,\nneither grieving nor healed,\njust existing\nin the soft gray\nof almost-consciousness.`,
    publishedDate: '2026-01-30',
    wallNumber: '10'
  },
  {
    id: '6',
    title: 'Sunday Afternoon',
    author: 'Robert Chen',
    category: 'Self & Introspection',
    excerpt: 'My son asks me why the sky is blue. I give him the scientific answer, but he looks disappointed.',
    content: `My son asks me\nwhy the sky is blue.\n\nI give him the scientific answer—\nRayleigh scattering,\nwavelengths of light,\natmospheric particles.\n\nHe looks at me,\ndisappointed,\nand says:\n"I thought you'd say\nbecause it's happy."`,
    publishedDate: '2026-02-06',
    wallNumber: '13'
  },
  {
    id: '7',
    title: 'Monsoon Memory',
    author: 'Aisha Patel',
    category: 'Grief, Loss & Memory',
    excerpt: 'My mother taught me to read the sky—the particular gray that means rain is coming.',
    content: `My mother taught me\nto read the sky—\nthe particular gray\nthat means rain is coming.\n\nNow, an ocean away,\nI stand at my window\nwatching different clouds,\nremembering her hands\npointing at the horizon.\n\nThe rain here\nsounds nothing like home.`,
    publishedDate: '2026-02-05',
    wallNumber: '08'
  },
  {
    id: '8',
    title: "Father's Watch",
    author: 'Thomas Wright',
    category: 'Family & Identity',
    excerpt: 'He left me his watch, the one that stopped the day he died.',
    content: `He left me his watch,\nthe one that stopped\nthe day he died.\n\nI keep it in a drawer,\nrefusing to wind it,\nas if moving the hands forward\nwould somehow\nmove me forward too.\n\nTime doesn't heal.\nIt just accumulates.`,
    publishedDate: '2026-01-22',
    wallNumber: '07'
  }
];

const categories = [
  'All',
  'Love & Relationships',
  'Nature & The Natural World',
  'Grief, Loss & Memory',
  'Family & Identity',
  'Time & Mortality',
  'Self & Introspection'
];

export function CollectionGalleryPage() {
  const [selectedPiece, setSelectedPiece] = useState<typeof publishedPieces[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredPieces = selectedCategory === 'All'
    ? publishedPieces
    : publishedPieces.filter(p => p.category === selectedCategory);

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
                className={`font-['Cardo'] text-base tracking-wide transition-all pb-2 relative ${
                  selectedCategory === category
                    ? 'text-[#2C1810] font-medium'
                    : 'text-[#8B7355] hover:text-[#2C1810]'
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <motion.div
                    layoutId="activeCollectionFilter"
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
          {filteredPieces.map((piece, index) => (
            <div key={piece.id}>
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
                  {piece.wallNumber}
                </div>

                {/* Category Label */}
                <div className={`text-xs uppercase tracking-[0.2em] text-[#C4A265] mb-3 font-['Cardo'] ${
                  index % 2 === 0 ? 'text-left' : 'text-right'
                }`}>
                  {piece.category}
                </div>

                {/* Title */}
                <button
                  onClick={() => setSelectedPiece(piece)}
                  className={`group block mb-3 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}
                >
                  <h2 className="font-['Cardo'] text-5xl text-[#2C1810] hover:text-[#C4A265] transition-colors duration-300">
                    {piece.title}
                  </h2>
                </button>

                {/* Author */}
                <p className={`text-sm uppercase tracking-[0.15em] text-[#8B7355] mb-6 font-['Cardo'] ${
                  index % 2 === 0 ? 'text-left' : 'text-right'
                }`}>
                  by {piece.author}
                </p>

                {/* Excerpt */}
                <p className={`font-['Libre_Baskerville'] text-lg text-[#2C1810] leading-relaxed italic mb-8 max-w-2xl ${
                  index % 2 === 0 ? 'text-left' : 'text-right ml-auto'
                }`}>
                  {piece.excerpt}
                </p>

                {/* Read Link */}
                <button
                  onClick={() => setSelectedPiece(piece)}
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
              {index < filteredPieces.length - 1 && (
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

      {/* Reading Modal */}
      {selectedPiece && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-[#2C1810]/80 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setSelectedPiece(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] max-w-4xl w-full max-h-[85vh] overflow-y-auto p-16 relative shadow-2xl"
          >
            <button
              onClick={() => setSelectedPiece(null)}
              className="absolute top-8 right-8 p-2 hover:bg-[#F5F0E8] rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-[#8B7355]" />
            </button>

            {/* Category */}
            <div className="text-xs uppercase tracking-[0.2em] text-[#C4A265] mb-4 font-['Cardo']">
              {selectedPiece.category}
            </div>

            {/* Title */}
            <h2 className="font-['Cardo'] text-6xl mb-4 text-[#2C1810] leading-tight">
              {selectedPiece.title}
            </h2>

            {/* Author */}
            <p className="text-sm uppercase tracking-[0.15em] text-[#8B7355] mb-12 font-['Cardo']">
              by {selectedPiece.author}
            </p>
            
            {/* Gold Divider */}
            <div className="flex items-center mb-12">
              <div className="h-px flex-1 bg-[#C4A265]/30"></div>
              <div className="w-1 h-1 bg-[#C4A265] mx-4 rotate-45"></div>
              <div className="h-px flex-1 bg-[#C4A265]/30"></div>
            </div>

            {/* Full Poem Content */}
            <div className="font-['Libre_Baskerville'] text-2xl leading-loose text-[#2C1810] whitespace-pre-wrap mb-16">
              {selectedPiece.content.split('\n').map((line, idx) => (
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

            {/* Published Date */}
            <div className="text-sm text-[#8B7355] font-['Cardo'] italic mb-8">
              Published {new Date(selectedPiece.publishedDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
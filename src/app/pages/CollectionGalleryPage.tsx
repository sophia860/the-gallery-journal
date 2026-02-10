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
    excerpt: 'Perhaps because I have been. My gay card came in the mail at 14 years...',
    content: `Perhaps because I have been. My gay card came in the mail at 14 years. Back when I had scabbed knees, living in a house painted all red, cross on the front door. Back when blue and pink and purple simply looked pretty next to each other. It's in my wallet. Haven't I shown it to you? How dare you insinuate that my past of lying to with men means that my queerness is young. It was born long before a man in pretentious sweaters taught me how to use my mouth for more than just running it. It was born long before women in dyke boots hand-fed me cherries and taught me to lick out the pit with my tongue. I don't need to hold space for the chance that you might want to fuck a man in a year or ten, you know the boundaries of your desire (though we are kaleidoscopes, so if the light ever shifts, I will remain by your side). But I do hold space for the way our pedestal of male proximity taints Sappho-sanctioned homes, turns comrades to enemies. I am not your enemy - nor are the men I decide to take to bed. The hands that pin you with fear are the same that keep me pinned, spread-eagle, to the dissection table. The tools of scrutiny they use to slice into your heart and diagnose disorder are the same that interrogate mine for beating in two directions. You claim that I am the one performing your dissection (and perhaps I am complicit, as humans often are), but look to your hands and see the bloodied scalpel you hold. This is not the moral failing of you or I, it is the fault of a world addicted to conformity, snorting identical lines of ideological lies. I do not need you to link arms with me; my arms are heavy with the bricks of liberation. I do not need you to take my hand, tell me my sexuality is valid; my hands are busy writing this poem of resistance. I know I have a seat at our table; I need you to let me take it. Regardless of whose bed I'm leaving.`,
    publishedDate: '2026-01-15',
    wallNumber: '01'
  },
  {
    id: '2',
    title: 'POLYAMORY',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    excerpt: 'i know i look to you like a child / never quite loved right...',
    content: `i know i look to you like a child / never quite loved right. / numb fingers turning over loose stones / searching for the beetle-husk of validation. / hands pulling up fistfuls of weeds / set carefully in vases / mistook for wildflowers. / starved / for scraps of proof / that i am of any importance. / needed by anyone. / i know i seem to be collecting illicit scandals / lovers / like pennies in my pocket. / forever scouring the pavement for something shiny and new / to toss in with the rest / to forget as tarnish sets in / to trade for sweets / or paints / or triple-a batteries / the next time i'm bored. / greedy girl / jangling my loose change for all to hear. / as if i might even be proud of my earnings. / i'm sure you think i'm afraid / of the color white / and diamond rings / and anything deep enough to drown in. / sprinting towards dust bowls at the sight of a puddle. / the wind blows / leaves me dirt-streaked / sand-mouthed / but breathing. / no shackled weights on my fingers. / i confess, i am a little scared of vows / but only because i haven't learned to write about love / without loss. / i know jealousy's branding iron sizzles through your lungs. / i know you'd prefer your desires only unearthed on a new moon. / i know you could never.`,
    publishedDate: '2026-01-20',
    wallNumber: '02'
  },
  {
    id: '3',
    title: 'YES',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    excerpt: 'gravity wraps my hair in its fist and pulls me on top...',
    content: `gravity wraps my hair in its fist and pulls me on top, breaks all his rules (all my rules, too) to look down on me from below i hold his breath against my tongue: spearmint orbiting teeth notes of nicotine and soured sleep, drink every last drop of rum from his lips as if I could drink him sober fingers flex prints into the flesh of my waist he climbs my ribcage until i arch to my breasts skin supple and giving into his will grab me by the throat like a rabid dog and feel my life, ruinous and red, rushing past your fingers star burst vision and rusted breath my fingers sprinting to hold yours in place tighter, tighter. time slows the yes before palm connects with the side of my face, knocks my moan to the floor with a sting soothed by restraint eyes on me. stay.`,
    publishedDate: '2026-01-25',
    wallNumber: '03'
  },
  {
    id: '4',
    title: 'REASONS YOU REFUSE TO DATE ME',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    excerpt: 'my nose is too big. so are my thighs. my tits are too small...',
    content: `my nose is too big. so are my thighs. my tits are too small. my haircut is queer. i'm blind without contacts, so i'll never truly see you wracked with sobs in the kitchen at three in the morning. i believe silence is made to be broken. so are mugs. but i refuse to believe people are. my heart is too soft, a squishy thing oozing through your fingers. my blood contains over the legal limit of ink. i'll stain your hands. one day i'll call you a narcissistic drunk. then sober up over the toilet, sick with remorse, useless to you. when you smash the porcelain vase masquerading as my body, i'll sit down with gold and glue, fix the cracks to glisten. i'll immortalize you, clad in cheap metaphor. i love too many people, and they've all undressed me. in one way or another. my heart has turned blind to suffering. i invite death in for tea, slide an envelope across the table, stuffed with rival's names yours at the top and a wad of cash to seal the deal. i'll tell you i'm not a liar and i'll be lying.`,
    publishedDate: '2026-01-30',
    wallNumber: '04'
  },
  {
    id: '5',
    title: 'I PROBABLY L*VE YOU',
    author: 'Nix Carlson',
    category: 'Love & Relationships',
    excerpt: 'but we\'re sitting in your car under the broken streetlight...',
    content: `but we're sitting in your car under the broken streetlight / and you're telling me we're through / it's barely july / and the air bites negative / i can see my breath stall between us / you probably l*ve me / but you lean in at the bar / all cocksure smiles / as you say i'm just an obligation / and i can feel my heartbeat thrumming in my ears / static in my veins / and maybe you l*ve me / but you've texted me three times in two weeks / to tell me how much you h*te me / so it's possible / maybe / you mean it / whispering l*ve into the midnight hush on your couch / but honesty has a habit of curdling in your throat / so the words sound more like / I think we should f*ck / and I end up kissing sour lips / because you definitely don't l*ve me / i'm more of a vice / the bacardi you're parched for / a thought loop you can't close / an aged tattoo on your clavicle that won't wash off / the problem is / that my feelings don't dissipate / at golden hour / so i c*re about you / but when i say it / it has to sound like / did you get home safe? / i l*ve you / but i have to bite my tongue and say / yes, touch me there / there, again / i l*ve you / and i'm down for whatever / even forever / but i know you're not planning past thursday / so don't insult me with / i probably love you.`,
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
            className="bg-[#FAF8F5] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
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
            <div className="p-8 md:p-12">
              {/* Wall Number */}
              <div className="font-['Courier_New'] text-xs tracking-wider text-[#8B7355] mb-6 uppercase">
                Wall {selectedPiece.wallNumber}
              </div>

              {/* Header */}
              <div className="mb-8">
                {/* Title */}
                <h2 className="font-['Cardo'] text-2xl md:text-3xl tracking-wide text-[#2C1810] mb-4 leading-tight">
                  {selectedPiece.title}
                </h2>

                {/* Author & Date */}
                <div className="flex items-center gap-4 pb-8 border-b border-[#C4A265]/30">
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
              </div>

              {/* Decorative Divider with Content */}
              <div className="border-t border-[#E8E0D8] py-8">
                {/* Poem Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="font-['Libre_Baskerville'] text-base text-[#2C1810] leading-loose whitespace-pre-line">
                    {selectedPiece.content}
                  </div>
                </div>
              </div>

              {/* Category Tag */}
              <div className="pt-8 border-t border-[#C4A265]/30">
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
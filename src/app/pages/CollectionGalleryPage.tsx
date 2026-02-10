import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { Footer } from '../components/Footer';

// Type for exhibit data
interface Exhibit {
  id: string;
  userId: string;
  title: string;
  openingNote: string;
  pieces: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
  }>;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

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

export function CollectionGalleryPage() {
  const [publishedPieces, setPublishedPieces] = useState<DisplayPiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<DisplayPiece | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Load poems from localStorage on mount
  useEffect(() => {
    loadPoemsFromLocalStorage();
  }, []);

  const loadPoemsFromLocalStorage = () => {
    try {
      const pieces: DisplayPiece[] = [];
      
      // Get all exhibit IDs
      const exhibitAllData = localStorage.getItem('exhibit:all');
      let exhibitIds: string[] = [];
      
      console.log('Loading poems from localStorage...');
      console.log('exhibit:all data:', exhibitAllData);
      
      if (exhibitAllData) {
        exhibitIds = JSON.parse(exhibitAllData);
      } else {
        // Fallback: scan localStorage for exhibit keys
        console.log('No exhibit:all found, scanning localStorage...');
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('exhibit:') && key !== 'exhibit:all') {
            exhibitIds.push(key.replace('exhibit:', ''));
          }
        }
      }

      console.log('Found exhibit IDs:', exhibitIds);

      // Load each exhibit
      exhibitIds.forEach((exhibitId, index) => {
        const exhibitData = localStorage.getItem(`exhibit:${exhibitId}`);
        console.log(`Loading exhibit:${exhibitId}`, exhibitData ? 'found' : 'not found');
        
        if (exhibitData) {
          try {
            const exhibit: Exhibit = JSON.parse(exhibitData);
            console.log('Parsed exhibit:', exhibit);
            
            // Extract author name from opening note (assumes format "by Author Name")
            const authorMatch = exhibit.openingNote.match(/by\s+([^\n]+)/);
            const authorName = authorMatch ? authorMatch[1].trim() : 'Unknown Author';
            
            // Get the first piece (poem)
            const firstPiece = exhibit.pieces[0];
            if (firstPiece) {
              // Create excerpt (first 100 characters)
              const excerpt = firstPiece.content
                .split('\n')
                .filter(line => line.trim())
                .slice(0, 2)
                .join(' ')
                .substring(0, 150) + '...';

              pieces.push({
                id: exhibit.id,
                title: exhibit.title,
                author: authorName,
                category: 'Poetry', // Default category for now
                excerpt: excerpt,
                content: firstPiece.content,
                publishedDate: exhibit.createdAt,
                wallNumber: String(index + 1).padStart(2, '0')
              });
            }
          } catch (error) {
            console.error(`Error parsing exhibit ${exhibitId}:`, error);
          }
        }
      });

      console.log('Loaded pieces:', pieces);
      setPublishedPieces(pieces);
      setLoading(false);
    } catch (error) {
      console.error('Error loading poems from localStorage:', error);
      setLoading(false);
    }
  };

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
          {loading ? (
            /* Loading State */
            <div className="text-center py-20">
              <div className="font-['Cardo'] text-xl text-[#8B7355] mb-4">
                Loading poems...
              </div>
              <div className="flex items-center justify-center">
                <div className="h-px w-16 bg-[#C4A265]/30"></div>
                <div className="w-1 h-1 bg-[#C4A265] mx-3 rotate-45 animate-pulse"></div>
                <div className="h-px w-16 bg-[#C4A265]/30"></div>
              </div>
            </div>
          ) : filteredPieces.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="font-['Cardo'] text-6xl text-[#2C1810] mb-6 italic">
                No poems found
              </div>
              <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] mb-8 italic">
                Please visit the <a href="/admin/reset-gallery" className="text-[#C4A265] hover:underline">Reset Gallery</a> page to load the Nix Carlson collection.
              </p>
              <div className="flex items-center justify-center">
                <div className="h-px w-16 bg-[#C4A265]/30"></div>
                <div className="w-1 h-1 bg-[#C4A265] mx-3 rotate-45"></div>
                <div className="h-px w-16 bg-[#C4A265]/30"></div>
              </div>
            </div>
          ) : (
            /* Poems List */
            filteredPieces.map((piece, index) => (
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
            ))
          )}
        </div>
      </section>

      {/* Reading Modal */}
      {selectedPiece && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 bg-[#FAF8F5] overflow-y-auto"
        >
          {/* Atmospheric background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-[#F5F0EB] to-[#FAF8F5] opacity-60"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,_#C4A265_0%,_transparent_70%)] opacity-5"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle,_#8B7355_0%,_transparent_70%)] opacity-5"></div>
          
          <div className="relative">
            {/* Close Button - Elegant */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => setSelectedPiece(null)}
              className="fixed top-8 right-8 z-10 group"
            >
              <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-[#E0D8D0] hover:border-[#C4A265] rounded-full transition-all shadow-lg hover:shadow-xl">
                <X className="w-5 h-5 text-[#8B7355] group-hover:text-[#C4A265] transition-colors" />
                <span className="font-['Cardo'] text-sm tracking-wider text-[#8B7355] group-hover:text-[#C4A265] transition-colors">CLOSE</span>
              </div>
            </motion.button>

            {/* Main Content Container */}
            <div className="max-w-4xl mx-auto px-8 py-32">
              {/* Wall Number - Large Decorative */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.03, scale: 1 }}
                transition={{ duration: 1 }}
                className="absolute top-24 left-1/2 -translate-x-1/2 font-['Cardo'] text-[20rem] text-[#2C1810] pointer-events-none select-none"
                style={{ lineHeight: 1 }}
              >
                {selectedPiece.wallNumber}
              </motion.div>

              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center mb-8"
              >
                <span className="inline-block px-6 py-2 border-2 border-[#C4A265] text-xs uppercase tracking-[0.3em] text-[#C4A265] font-['Cardo'] bg-white/50 backdrop-blur-sm">
                  {selectedPiece.category}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-['Cardo'] text-7xl md:text-8xl text-[#2C1810] text-center mb-6 italic leading-tight"
              >
                {selectedPiece.title}
              </motion.h1>

              {/* Author */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center text-base uppercase tracking-[0.2em] text-[#8B7355] mb-16 font-['Cardo']"
              >
                by {selectedPiece.author}
              </motion.p>

              {/* Ornamental Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="flex items-center justify-center mb-20"
              >
                <div className="h-px w-32 bg-[#C4A265]"></div>
                <div className="w-2 h-2 bg-[#C4A265] mx-6 rotate-45"></div>
                <div className="h-px w-32 bg-[#C4A265]"></div>
              </motion.div>

              {/* Poem Content - Beautiful Typography */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative"
              >
                <div className="font-['Libre_Baskerville'] text-3xl md:text-4xl leading-loose text-[#2C1810] text-center mb-20 max-w-3xl mx-auto">
                  {selectedPiece.content.split('\n').map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 + idx * 0.05 }}
                      className="mb-2"
                    >
                      {line || '\u00A0'}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Bottom Ornament */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex items-center justify-center mb-12"
              >
                <div className="h-px w-24 bg-[#C4A265]/40"></div>
                <div className="w-1.5 h-1.5 bg-[#C4A265] mx-4 rotate-45"></div>
                <div className="h-px w-24 bg-[#C4A265]/40"></div>
              </motion.div>

              {/* Published Date & Meta */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-center"
              >
                <p className="font-['Cardo'] text-sm text-[#8B7355] italic mb-6">
                  Published {new Date(selectedPiece.publishedDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
                <p className="font-['Cardo'] text-xs uppercase tracking-[0.3em] text-[#8B7355]/60">
                  Wall {selectedPiece.wallNumber} • Winter 2026
                </p>
              </motion.div>

              {/* Scroll hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="mt-20 text-center"
              >
                <button
                  onClick={() => setSelectedPiece(null)}
                  className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-[#C4A265] text-[#C4A265] hover:bg-[#C4A265] hover:text-white transition-all font-['Cardo'] text-sm tracking-wider"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  RETURN TO COLLECTION
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
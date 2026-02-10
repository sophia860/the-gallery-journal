import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { RandomPoemButton } from '../components/RandomPoemButton';

export function GalleryLandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] relative">
      {/* Paper grain texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}></div>

      {/* Navigation */}
      <GalleryNav />
      
      {/* Random Poem Button */}
      <RandomPoemButton />

      {/* FOYER - Featured Exhibit (NO fabricated poetry) */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="min-h-screen flex items-center justify-center px-8 md:px-16 relative"
        style={{ paddingTop: 'clamp(4rem, 12vh, 8rem)', paddingBottom: 'clamp(4rem, 12vh, 8rem)' }}
      >
        {/* Asymmetric background accent */}
        <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-gradient-to-bl from-[#F0E8DC]/30 to-transparent"></div>
        
        <div className="max-w-5xl mx-auto relative">
          {/* Wall number - small, understated */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-['Courier_New'] text-xs tracking-[0.4em] text-[#8B7355] mb-8 uppercase"
          >
            Featured Exhibit
          </motion.div>

          {/* Exhibit title - HUGE, dramatic */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="font-['Playfair_Display'] italic font-light text-[#2C1810] mb-12"
            style={{ 
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              lineHeight: '1.05',
              letterSpacing: '-0.02em'
            }}
          >
            Along the<br />
            Oxbow
          </motion.h1>

          {/* Subtitle - breathing, generous */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.3 }}
            className="font-['Libre_Baskerville'] text-[#2C1810]/80 leading-[1.8] space-y-6"
            style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)' }}
          >
            <p>
              Five poems by Nix Carlson
            </p>
          </motion.div>

          {/* Attribution - offset, asymmetric */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-12 pl-8 border-l-2 border-[#C4A265]"
          >
            <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] mb-4">
              An immersive poetry experience exploring identity, love, and belonging
            </p>
            <p className="font-['Courier_New'] text-xs text-[#8B7355]/60 mt-1 tracking-wider uppercase">
              Winter 2026 Collection
            </p>
          </motion.div>

          {/* Enter exhibit link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="mt-12"
          >
            <a
              href="/collection-gallery"
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#2C1810] text-white hover:bg-[#1A1A1A] transition-all font-['Inter'] text-sm font-semibold tracking-wide group"
              style={{ borderRadius: '2px 8px 2px 8px' }}
            >
              Enter the Exhibit
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        {/* Scroll hint - subtle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-[#8B7355]/40 to-transparent"></div>
        </motion.div>
      </motion.section>

      {/* ABOUT COPY - Large, breathing, imperfect */}
      <section className="px-8 md:px-16 py-24 md:py-32 bg-[#F0E8DC] relative overflow-hidden">
        {/* Ink bleed effect */}
        <div className="absolute inset-0 opacity-40" style={{
          boxShadow: 'inset 0 0 120px rgba(44, 24, 16, 0.03), inset 0 0 60px rgba(44, 24, 16, 0.02)'
        }}></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-16 items-start">
            {/* Left column - smaller */}
            <div>
              <p className="font-['Courier_New'] text-xs tracking-[0.3em] text-[#8B7355] uppercase mb-4">
                About Page
              </p>
              <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl italic font-light text-[#2C1810] leading-tight">
                A room of<br />one's own
              </h2>
            </div>

            {/* Right column - larger, offset down */}
            <div className="md:mt-12">
              <p className="font-['Libre_Baskerville'] text-xl md:text-2xl text-[#2C1810] leading-relaxed mb-8" style={{ lineHeight: '1.8' }}>
                PAGE is a literary journal that exists in the margins of traditional publishing. We believe in slow reading, in giving writers time to develop their voice, in creating space for work that doesn't fit neatly into categories.
              </p>
              <p className="font-['Libre_Baskerville'] text-xl md:text-2xl text-[#2C1810]/70 leading-relaxed" style={{ lineHeight: '1.8' }}>
                Each issue is a curated exhibition—poems, prose, and hybrid forms that speak to the moment we're living through.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EXHIBIT - Full bleed, dramatic */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="relative overflow-hidden"
        style={{ minHeight: 'clamp(600px, 80vh, 900px)' }}
      >
        {/* Textured gradient background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2E] via-[#2C1810] to-[#1A1F2E]">
          {/* Atmospheric elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4F46E5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#C4A265]/5 rounded-full blur-3xl"></div>
          
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Content - asymmetric overlay */}
        <div className="relative h-full flex items-end px-8 md:px-16 py-16 md:py-24">
          <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-16 items-end">
            {/* Left - oversized title */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <p className="font-['Courier_New'] text-xs tracking-[0.3em] text-[#C4A265] mb-6 uppercase">
                  Immersive Experience
                </p>
                <h2 className="font-['Playfair_Display'] italic font-light text-white mb-8" style={{
                  fontSize: 'clamp(3rem, 10vw, 8rem)',
                  lineHeight: '0.95',
                  letterSpacing: '-0.02em'
                }}>
                  Along the<br />Oxbow
                </h2>
              </motion.div>
            </div>

            {/* Right - credits and description, offset */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: true }}
              className="md:-mb-8"
            >
              <div className="bg-[#2C1810]/60 backdrop-blur-sm p-8 border-l-4 border-[#C4A265]" style={{
                borderRadius: '2px 12px 4px 8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}>
                <p className="font-['Libre_Baskerville'] text-lg text-[#E8E4DC] mb-4">
                  Written by <span className="text-[#C4A265] font-semibold">Bri Gearhart Staton</span>
                </p>
                <p className="font-['Libre_Baskerville'] text-lg text-[#E8E4DC] mb-6">
                  Illustrated by <span className="text-[#4F46E5] font-semibold">Sophia Sharkey</span>
                </p>
                <p className="font-['Libre_Baskerville'] text-base text-[#E8E4DC]/80 leading-relaxed italic mb-6">
                  An immersive poetry experience where each verse responds to the bend in the river.
                </p>
                <a
                  href="https://pagegalleryjournal.com/brigearhartstaton"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] transition-all font-['Inter'] text-sm font-semibold tracking-wide group"
                  style={{ borderRadius: '2px 8px 2px 8px' }}
                >
                  Enter Exhibit
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[40%] bg-gradient-to-b from-transparent via-[#C4A265]/20 to-transparent"></div>
      </motion.section>

      {/* WINTER COLLECTION - Asymmetric grid */}
      <section className="px-8 md:px-16 py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto">
          {/* Header - offset */}
          <div className="mb-16 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
            <div>
              <p className="font-['Courier_New'] text-xs tracking-[0.3em] text-[#8B7355] uppercase mb-4">
                Winter 2026
              </p>
              <h2 className="font-['Playfair_Display'] text-6xl md:text-7xl italic font-light text-[#2C1810]" style={{
                lineHeight: '1.1'
              }}>
                Five pieces on<br />belonging
              </h2>
            </div>
            <div className="flex items-end">
              <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] leading-relaxed">
                Identity, desire, love, and the spaces between words
              </p>
            </div>
          </div>

          {/* CTA - hand-cut feel */}
          <a 
            href="/collection-gallery"
            className="inline-block bg-[#2C1810] text-white px-8 py-4 hover:bg-[#1A1A1A] transition-all group relative overflow-hidden"
            style={{
              borderRadius: '3px 10px 2px 12px',
              boxShadow: '4px 4px 0 rgba(44, 24, 16, 0.1), 8px 8px 24px rgba(44, 24, 16, 0.08)'
            }}
          >
            <span className="font-['Playfair_Display'] text-2xl italic relative z-10">
              View the Collection
            </span>
            <ArrowRight className="inline-block ml-3 w-5 h-5 transition-transform group-hover:translate-x-2 relative z-10" />
            
            {/* Ink bleed effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C4A265]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <GalleryFooter />
    </div>
  );
}

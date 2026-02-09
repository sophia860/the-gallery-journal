import { motion } from 'motion/react';
import { Moon, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function AfterhoursPage() {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'writer';
  const isEditor = userRole === 'editor' || userRole === 'managing_editor';

  return (
    <div className="min-h-screen bg-[#1A1F2E] text-[#E8E4DC]">
      {/* Navigation */}
      <GalleryNav variant="dark" currentPage="afterhours" />

      {/* Hero */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="pt-48 pb-32 px-8 relative overflow-hidden"
      >
        {/* Atmospheric gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A1F2E]/50 to-[#1A1F2E] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-8"
          >
            <Moon className="w-24 h-24 mx-auto text-[#E8E4DC]/30" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-['Cardo'] text-7xl md:text-9xl italic leading-none text-[#E8E4DC] mb-8"
          >
            Afterhours
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-[family-name:var(--font-body)] text-xl max-w-2xl mx-auto text-[#B8B4A8] mb-4 leading-relaxed"
          >
            When the gallery closes, a different space opens.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="font-['Cardo'] text-2xl italic text-[#E8E4DC]/60"
          >
            experimental · visual · ephemeral
          </motion.p>
        </div>
      </motion.section>

      {/* Coming Soon Section */}
      <section className="py-32 px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-16 border-2 border-[#2C3347] bg-gradient-to-br from-[#1A1F2E] to-[#252B3E] relative overflow-hidden"
          >
            {/* Subtle animated gradient */}
            <motion.div
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-tr from-[#E11D48]/10 via-transparent to-[#5B8A8A]/10 pointer-events-none"
            />
            
            <div className="relative z-10">
              <div className="font-['Courier_New'] text-sm tracking-[0.3em] text-[#B8B4A8] mb-6">
                LAUNCHING SOON
              </div>
              
              <h2 className="font-['Cardo'] text-5xl md:text-6xl text-[#E8E4DC] mb-8">
                A Space for the Experimental
              </h2>
              
              <div className="max-w-2xl mx-auto space-y-6 text-[#B8B4A8] font-[family-name:var(--font-body)] text-lg leading-relaxed mb-12">
                <p>
                  Afterhours is where form breaks. Where visual poetry lives. Where audio pieces breathe. 
                  Where the experimental finds its stage.
                </p>
                <p>
                  This is the space that opens when traditional structures close. More atmospheric. 
                  More daring. More room to play.
                </p>
              </div>

              <div className="space-y-4 mb-12">
                <div className="font-['Courier_New'] text-sm text-[#E8E4DC]/60">
                  UPCOMING FEATURES:
                </div>
                <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {[
                    { title: 'Visual Poetry', desc: 'Words as images, images as words' },
                    { title: 'Audio Pieces', desc: 'Spoken word, soundscapes, voice' },
                    { title: 'Ephemeral Work', desc: 'Time-limited pieces that vanish' },
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                      viewport={{ once: true }}
                      className="p-6 border border-[#2C3347] bg-[#1A1F2E]/50"
                    >
                      <h3 className="font-['Cardo'] text-xl text-[#E8E4DC] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[#B8B4A8]">
                        {feature.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="font-['Courier_New'] text-sm text-[#E11D48] mb-8">
                Opening March 2026
              </div>

              <a
                href="/studio"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#E8E4DC] text-[#E8E4DC] hover:bg-[#E8E4DC] hover:text-[#1A1F2E] transition-all font-['Courier_New'] text-sm group"
              >
                INTERESTED IN SUBMITTING?
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-8 border-t border-[#2C3347]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="font-['Cardo'] text-4xl text-[#E8E4DC] mb-8">
              The Late-Night Gallery
            </h3>
            <div className="space-y-6 text-[#B8B4A8] font-[family-name:var(--font-body)] text-lg leading-relaxed">
              <p>
                There's a different kind of attention available after dark. A willingness to sit with 
                the strange, the unfinished, the formally ambitious.
              </p>
              <p>
                Afterhours is for work that doesn't fit the traditional mold. Poetry that requires sound. 
                Pieces that need to be seen. Experiments that live in the space between forms.
              </p>
              <p className="font-['Cardo'] italic text-xl text-[#E8E4DC]/80">
                This is where the rules soften.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <GalleryFooter variant="dark" />
    </div>
  );
}
import { Sprout, Leaf, Flower2, Users, Home, Layers, Sparkles, Heart, Edit3, ArrowRight, Check } from 'lucide-react';
import { GardenMainNav } from '../components/GardenMainNav';

export function GardenLandingPage() {
  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      {/* Animated Starfield Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="stars-layer"></div>
        <div className="stars-layer-2"></div>
        <div className="stars-layer-3"></div>
        
        {/* Floating botanical particles */}
        <div className="botanical-particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            >
              <Leaf className="w-4 h-4 text-[#10b981] opacity-20" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 10% 10%, white, transparent),
            radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 30% 15%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(3px 3px at 40% 40%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 50% 25%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 70% 50%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 80% 20%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 15% 60%, rgba(200, 210, 255, 0.9), transparent);
          background-size: 200% 200%;
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 8% 20%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 18% 55%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 28% 12%, white, transparent),
            radial-gradient(1px 1px at 38% 68%, rgba(255, 255, 255, 0.85), transparent);
          background-size: 250% 250%;
          animation: twinkle 6s ease-in-out infinite reverse;
        }

        .stars-layer-3 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 6% 16%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 16% 46%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 26% 76%, rgba(255, 255, 255, 0.8), transparent);
          background-size: 300% 300%;
          animation: twinkle 8s ease-in-out infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .botanical-particles {
          position: absolute;
          inset: 0;
        }

        .particle {
          position: absolute;
          animation: float-particle linear infinite;
        }

        @keyframes float-particle {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translate(100px, -100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .glass-card {
          background: rgba(15, 23, 41, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 157, 195, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .lifecycle-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            rgba(212, 165, 116, 0.3) 0%,
            rgba(16, 185, 129, 0.3) 50%,
            rgba(236, 72, 153, 0.3) 100%
          );
        }
      `}</style>

      <GardenMainNav variant="dark" />

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center justify-center px-8 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo Icon */}
            <div className="mb-8 flex justify-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(122, 155, 118, 0.3) 0%, rgba(122, 155, 118, 0.1) 60%, transparent 100%)',
                  boxShadow: '0 0 60px rgba(122, 155, 118, 0.4), inset 0 0 30px rgba(122, 155, 118, 0.2)'
                }}
              >
                <Sprout 
                  className="w-16 h-16" 
                  style={{ 
                    color: '#7a9b76',
                    filter: 'drop-shadow(0 0 20px rgba(122, 155, 118, 0.8))'
                  }} 
                />
              </div>
            </div>

            <h1 
              className="font-['Playfair_Display'] italic text-8xl text-white mb-6"
              style={{
                textShadow: '0 0 60px rgba(122, 155, 118, 0.6), 0 0 120px rgba(122, 155, 118, 0.4)',
                lineHeight: '1.1'
              }}
            >
              The Garden
            </h1>

            <p 
              className="font-['Libre_Baskerville'] text-2xl text-[#c8cad8] mb-12 max-w-3xl mx-auto"
              style={{ 
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
                lineHeight: '1.8'
              }}
            >
              A living space for writers who care about craft.
            </p>

            <a
              href="/garden/signup"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-[#7a9b76] to-[#6a8b66] text-white hover:from-[#6a8b66] hover:to-[#5a7b56] transition-all rounded-xl font-['Cardo'] text-2xl font-semibold shadow-2xl hover:shadow-green-500/30 hover:scale-105 transform duration-300"
              style={{
                boxShadow: '0 0 40px rgba(122, 155, 118, 0.5), inset 0 0 30px rgba(122, 155, 118, 0.1)'
              }}
            >
              Join The Garden
              <ArrowRight className="w-6 h-6" />
            </a>

            <p className="font-['Inter'] text-sm text-[#8b9dc3] mt-6">
              Free to join. No credit card required.
            </p>
          </div>
        </section>

        {/* WHAT IS THE GARDEN */}
        <section className="py-32 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-['Playfair_Display'] italic text-5xl text-white text-center mb-6" style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.4)' }}>
              What is The Garden?
            </h2>
            <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8] text-center mb-16 max-w-3xl mx-auto" style={{ lineHeight: '1.8' }}>
              The Garden is a writing community inside The Page Gallery journal. It's where your work grows — from first draft to published piece.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Write */}
              <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:shadow-green-500/20 transition-all text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#7a9b76] to-[#6a8b66] flex items-center justify-center shadow-xl" style={{ boxShadow: '0 0 30px rgba(122, 155, 118, 0.5)' }}>
                  <Edit3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-['Cardo'] text-2xl text-white italic mb-4">Write</h3>
                <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8] leading-relaxed">
                  Plant seeds. Write freely in a distraction-free editor. Your work is private until you're ready to share.
                </p>
              </div>

              {/* Grow */}
              <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/20 transition-all text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] flex items-center justify-center shadow-xl" style={{ boxShadow: '0 0 30px rgba(96, 165, 250, 0.5)' }}>
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-['Cardo'] text-2xl text-white italic mb-4">Grow</h3>
                <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8] leading-relaxed">
                  Join circles. Get thoughtful feedback from other writers who understand your craft.
                </p>
              </div>

              {/* Bloom */}
              <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:shadow-pink-500/20 transition-all text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#ec4899] to-[#db2777] flex items-center justify-center shadow-xl" style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.5)' }}>
                  <Flower2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-['Cardo'] text-2xl text-white italic mb-4">Bloom</h3>
                <p className="font-['Libre_Baskerville'] text-base text-[#c8cad8] leading-relaxed">
                  Publish and be read. Your finished work lives in The Garden for the community to discover.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW YOUR WRITING GROWS */}
        <section className="py-32 px-8" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 41, 0.5) 50%, transparent 100%)' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="font-['Playfair_Display'] italic text-5xl text-white text-center mb-6" style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.4)' }}>
              How Your Writing Grows
            </h2>
            <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8] text-center mb-20 max-w-3xl mx-auto" style={{ lineHeight: '1.8' }}>
              Every piece follows a natural lifecycle from early draft to published work.
            </p>

            <div className="relative">
              {/* Connection Line */}
              <div className="lifecycle-line"></div>

              {/* Lifecycle Stages */}
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {/* Seed */}
                <div className="glass-card rounded-2xl p-8 text-center border-2 border-[rgba(212,165,116,0.3)]">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(212, 165, 116, 0.2)', boxShadow: '0 0 20px rgba(212, 165, 116, 0.4)' }}>
                    <div className="w-8 h-8 bg-[#d4a574] rounded-full" style={{ boxShadow: '0 0 15px rgba(212, 165, 116, 0.6)' }}></div>
                  </div>
                  <h3 className="font-['Cardo'] text-2xl text-[#d4a574] italic mb-4">Seed</h3>
                  <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] leading-relaxed mb-3">
                    Early ideas and drafts. Private to you. A safe space to experiment.
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8b9dc3]">
                    Up to 500 characters
                  </p>
                </div>

                {/* Sprout */}
                <div className="glass-card rounded-2xl p-8 text-center border-2 border-[rgba(16,185,129,0.3)]">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.2)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
                    <Leaf className="w-10 h-10 text-[#10b981]" style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))' }} />
                  </div>
                  <h3 className="font-['Cardo'] text-2xl text-[#10b981] italic mb-4">Sprout</h3>
                  <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] leading-relaxed mb-3">
                    Work in progress. Share with your circles for feedback and community.
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8b9dc3]">
                    Up to 2,000 characters
                  </p>
                </div>

                {/* Bloom */}
                <div className="glass-card rounded-2xl p-8 text-center border-2 border-[rgba(236,72,153,0.3)]">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(236, 72, 153, 0.2)', boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' }}>
                    <Flower2 className="w-10 h-10 text-[#ec4899]" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }} />
                  </div>
                  <h3 className="font-['Cardo'] text-2xl text-[#ec4899] italic mb-4">Bloom</h3>
                  <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] leading-relaxed mb-3">
                    Finished piece. Published in The Garden. Eligible for Gallery consideration.
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8b9dc3]">
                    Unlimited length
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THREE WAYS TO GO DEEPER */}
        <section className="py-32 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-['Playfair_Display'] italic text-5xl text-white text-center mb-6" style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.4)' }}>
              Three Ways to Go Deeper
            </h2>
            <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8] text-center mb-16 max-w-3xl mx-auto" style={{ lineHeight: '1.8' }}>
              Optional features to enhance your creative practice and support other writers.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* GREENHOUSE */}
              <div className="glass-card rounded-2xl p-8 border-2 border-[rgba(122,155,118,0.3)] hover:border-[#7a9b76] hover:shadow-2xl hover:shadow-green-500/30 transition-all">
                <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-[#7a9b76] to-[#6a8b66] flex items-center justify-center shadow-xl" style={{ boxShadow: '0 0 25px rgba(122, 155, 118, 0.5)' }}>
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-['Cardo'] text-3xl text-white italic mb-3" style={{ textShadow: '0 0 20px rgba(122, 155, 118, 0.3)' }}>
                  Greenhouse
                </h3>
                <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] leading-relaxed mb-4">
                  Join paid micro-residencies led by guest editors. Focused writing rooms with prompts and community.
                </p>
                <p className="font-['Inter'] text-sm font-semibold text-[#7a9b76] mb-6">
                  $5–15 per room
                </p>
                <a href="/greenhouse" className="inline-flex items-center gap-2 text-[#7a9b76] hover:text-[#6a8b66] transition-colors font-['Inter'] text-sm font-semibold">
                  Explore rooms
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* GRAFTS */}
              <div className="glass-card rounded-2xl p-8 border-2 border-[rgba(167,139,250,0.3)] hover:border-[#a78bfa] hover:shadow-2xl hover:shadow-purple-500/30 transition-all">
                <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] flex items-center justify-center shadow-xl" style={{ boxShadow: '0 0 25px rgba(167, 139, 250, 0.5)' }}>
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-['Cardo'] text-3xl text-white italic mb-3" style={{ textShadow: '0 0 20px rgba(167, 139, 250, 0.3)' }}>
                  Grafts
                </h3>
                <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] leading-relaxed mb-4">
                  Curate your own micro-anthology. Propose a theme, receive submissions, publish permanently.
                </p>
                <p className="font-['Inter'] text-sm font-semibold text-[#a78bfa] mb-6">
                  $8 curation fee
                </p>
                <a href="/grafts" className="inline-flex items-center gap-2 text-[#a78bfa] hover:text-[#8b5cf6] transition-colors font-['Inter'] text-sm font-semibold">
                  View Grafts
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* PERENNIALS */}
              <div className="glass-card rounded-2xl p-8 border-2 border-[rgba(244,114,182,0.3)] hover:border-[#f472b6] hover:shadow-2xl hover:shadow-pink-500/30 transition-all">
                <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-[#f472b6] to-[#ec4899] flex items-center justify-center shadow-xl" style={{ boxShadow: '0 0 25px rgba(244, 114, 182, 0.5)' }}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-['Cardo'] text-3xl text-white italic mb-3" style={{ textShadow: '0 0 20px rgba(244, 114, 182, 0.3)' }}>
                  Perennials
                </h3>
                <p className="font-['Libre_Baskerville'] text-sm text-[#c8cad8] leading-relaxed mb-4">
                  Subscribe to writers for exclusive Seeds, diary entries, and early access. Support with tips.
                </p>
                <p className="font-['Inter'] text-sm font-semibold text-[#f472b6] mb-6">
                  $3/month subscriptions
                </p>
                <a href="/writer/maya-chen" className="inline-flex items-center gap-2 text-[#f472b6] hover:text-[#ec4899] transition-colors font-['Inter'] text-sm font-semibold">
                  See example
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="py-32 px-8" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 41, 0.5) 50%, transparent 100%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-['Playfair_Display'] italic text-5xl text-white mb-8" style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.4)' }}>
              Who It's For
            </h2>
            <p className="font-['Libre_Baskerville'] text-2xl text-[#c8cad8] leading-relaxed" style={{ lineHeight: '1.8' }}>
              Poets. Fiction writers. Hybrid artists. Anyone who takes their craft seriously and wants a quiet, beautiful space to work.
            </p>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-['Playfair_Display'] italic text-5xl text-white text-center mb-6" style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.4)' }}>
              Pricing
            </h2>
            <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8] text-center mb-16 max-w-3xl mx-auto" style={{ lineHeight: '1.8' }}>
              The core platform is free. Premium features are pay-as-you-go.
            </p>

            <div className="glass-card rounded-2xl p-10 border-2 border-[rgba(96,165,250,0.3)]">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Free */}
                <div>
                  <h3 className="font-['Cardo'] text-3xl text-white italic mb-6">Free Forever</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-1" />
                      <span className="font-['Libre_Baskerville'] text-base text-[#c8cad8]">Write unlimited pieces</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-1" />
                      <span className="font-['Libre_Baskerville'] text-base text-[#c8cad8]">Join writing circles</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-1" />
                      <span className="font-['Libre_Baskerville'] text-base text-[#c8cad8]">Publish in The Garden</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-1" />
                      <span className="font-['Libre_Baskerville'] text-base text-[#c8cad8]">Distraction-free editor</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-1" />
                      <span className="font-['Libre_Baskerville'] text-base text-[#c8cad8]">Gallery submission eligibility</span>
                    </li>
                  </ul>
                </div>

                {/* Optional */}
                <div>
                  <h3 className="font-['Cardo'] text-3xl text-white italic mb-6">Optional Add-Ons</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-[#f472b6] flex-shrink-0 mt-1" />
                      <div>
                        <span className="font-['Libre_Baskerville'] text-base text-[#c8cad8] block">Greenhouse rooms</span>
                        <span className="font-['Inter'] text-xs text-[#8b9dc3]">$5–15 per room</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-[#f472b6] flex-shrink-0 mt-1" />
                      <div>
                        <span className="font-['Libre_Baskerville'] text-base text-[#c8cad8] block">Curate a Graft</span>
                        <span className="font-['Inter'] text-xs text-[#8b9dc3]">$8 curation fee</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-[#f472b6] flex-shrink-0 mt-1" />
                      <div>
                        <span className="font-['Libre_Baskerville'] text-base text-[#c8cad8] block">Perennial subscriptions</span>
                        <span className="font-['Inter'] text-xs text-[#8b9dc3]">$3/month per writer</span>
                      </div>
                    </li>
                  </ul>
                  <p className="font-['Inter'] text-sm text-[#8b9dc3] mt-6 italic">
                    No monthly subscription required to use the core platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-['Playfair_Display'] italic text-6xl text-white mb-8" style={{ textShadow: '0 0 40px rgba(122, 155, 118, 0.6)' }}>
              Start planting.
            </h2>
            <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8] mb-12 max-w-2xl mx-auto" style={{ lineHeight: '1.8' }}>
              Join The Garden and begin growing your writing practice today.
            </p>
            <a
              href="/garden/signup"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-[#7a9b76] to-[#6a8b66] text-white hover:from-[#6a8b66] hover:to-[#5a7b56] transition-all rounded-xl font-['Cardo'] text-2xl font-semibold shadow-2xl hover:shadow-green-500/30 hover:scale-105 transform duration-300"
              style={{
                boxShadow: '0 0 40px rgba(122, 155, 118, 0.5), inset 0 0 30px rgba(122, 155, 118, 0.1)'
              }}
            >
              Join The Garden
              <ArrowRight className="w-6 h-6" />
            </a>
            <p className="font-['Inter'] text-sm text-[#8b9dc3] mt-6">
              Free to join · No credit card required · Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-8 border-t border-[rgba(139,157,195,0.2)]">
          <div className="max-w-6xl mx-auto text-center">
            <p className="font-['Inter'] text-sm text-[#8b9dc3]">
              The Garden is part of The Page Gallery, a literary journal championing bold voices.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

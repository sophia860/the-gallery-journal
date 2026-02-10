import { Pen, Send, FolderOpen, Settings, Check, Sparkles, Sprout, Flower2, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function StudioHub() {
  const { user } = useAuth();

  // Check if user is a member (has paid membership)
  const userMembership = user?.user_metadata?.membership || 'community';
  const isMember = ['member', 'patron'].includes(userMembership);

  if (!user) {
    window.location.href = '/signin';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-[#F5F0EB] pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-[#8A9A7B]/10 rounded-full border border-[#8A9A7B]/30">
            <Sprout className="w-6 h-6 text-[#8A9A7B]" />
            <span className="font-['Cardo'] text-xl text-[#2C1810] italic">Your Garden on PAGE</span>
          </div>
          
          <h1 className="font-['Cardo'] text-7xl mb-6 text-[#2C1810] italic">
            Grow Your Writing
          </h1>
          <p className="font-['Libre_Baskerville'] text-2xl text-[#8B7355] leading-relaxed max-w-3xl mx-auto mb-8">
            Plant seeds, watch ideas sprout, let finished pieces bloom—then share them with our editorial team
          </p>
          
          {/* Clear Concept Explanation */}
          <div className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-sm border-2 border-[#8A9A7B]/30 rounded-2xl">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <Sprout className="w-8 h-8 text-[#8A9A7B]" />
              <h3 className="font-['Cardo'] text-3xl text-[#2C1810]">The Garden Concept</h3>
            </div>
            <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] mb-6 leading-relaxed">
              PAGE uses a garden metaphor instead of folders or feeds. Your writing grows organically over time, connected by themes.
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#8A9A7B]/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#8A9A7B]" />
                </div>
                <div>
                  <h4 className="font-['Cardo'] text-lg text-[#2C1810] mb-1">Seeds — Early Ideas</h4>
                  <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                    First drafts, fragments, thoughts just beginning to form. Private by default.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#8A9A7B]/20 rounded-full flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-[#8A9A7B]" />
                </div>
                <div>
                  <h4 className="font-['Cardo'] text-lg text-[#2C1810] mb-1">Sprouts — Developing</h4>
                  <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                    Works in progress that need revision. Coming into focus.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#8A9A7B]/20 rounded-full flex items-center justify-center">
                  <Flower2 className="w-5 h-5 text-[#8A9A7B]" />
                </div>
                <div>
                  <h4 className="font-['Cardo'] text-lg text-[#2C1810] mb-1">Blooms — Ready to Share</h4>
                  <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                    Finished pieces ready to submit to editors or share with readers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#8A9A7B]/20 rounded-full flex items-center justify-center">
                  <Tag className="w-5 h-5 text-[#8A9A7B]" />
                </div>
                <div>
                  <h4 className="font-['Cardo'] text-lg text-[#2C1810] mb-1">Tags — Constellations</h4>
                  <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                    Connect pieces by theme (grief, sea, mothers). Over time, see patterns emerge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Writing Tool - Prominent */}
        <div className="mb-16">
          <a
            href="/studio/freewrite"
            className="card hover-lift group relative block p-12 md:p-16 bg-gradient-to-br from-white to-[var(--surface-studio)] rounded-2xl overflow-hidden"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-sprout)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-[var(--color-sprout)]/10 rounded-full">
                  <Pen className="w-10 h-10 icon-sprout" style={{ color: 'var(--color-sprout)' }} />
                </div>
                <div>
                  <h2 className="heading-page">
                    Plant & Grow
                  </h2>
                  <p className="text-meta">
                    Your writing garden starts here
                  </p>
                </div>
              </div>

              <p className="text-large mb-8 max-w-2xl">
                Write in a clean, distraction-free editor. Tag your pieces to build constellations. Mark growth states. When a piece is ready, submit it to our editorial team with one click.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 icon-sprout flex-shrink-0 mt-1" style={{ color: 'var(--color-sprout)' }} />
                  <div>
                    <h4 className="heading-card text-lg mb-1">Distraction-Free Writing</h4>
                    <p className="text-small">Beautiful, minimal editor focused on your words</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 icon-sprout flex-shrink-0 mt-1" style={{ color: 'var(--color-sprout)' }} />
                  <div>
                    <h4 className="heading-card text-lg mb-1">Garden Organization</h4>
                    <p className="text-small">Track growth states and tag themes over time</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 icon-sprout flex-shrink-0 mt-1" style={{ color: 'var(--color-sprout)' }} />
                  <div>
                    <h4 className="heading-card text-lg mb-1">Private Notes</h4>
                    <p className="text-small">Add marginalia only you can see</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 icon-sprout flex-shrink-0 mt-1" style={{ color: 'var(--color-sprout)' }} />
                  <div>
                    <h4 className="heading-card text-lg mb-1">Direct Submission</h4>
                    <p className="text-small">Send to editors when your bloom is ready</p>
                  </div>
                </div>

                {isMember && (
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 icon-sprout flex-shrink-0 mt-1" style={{ color: 'var(--state-bloom)' }} />
                    <div>
                      <h4 className="heading-card text-lg mb-1">Community Feed</h4>
                      <p className="text-small">Share poetry to the feed (members only)</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 icon-sprout flex-shrink-0 mt-1" style={{ color: 'var(--color-sprout)' }} />
                  <div>
                    <h4 className="heading-card text-lg mb-1">Multiple Genres</h4>
                    <p className="text-small">Poetry, prose, fiction, nonfiction</p>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-3 px-10 py-5 bg-[#8A9A7B] text-white group-hover:bg-[#6F7D62] group-hover:scale-105 transition-all font-['Cardo'] text-lg tracking-wide rounded-lg shadow-lg">
                <Pen className="w-5 h-5" />
                Start Writing
                <span className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
              </div>
            </div>
          </a>
        </div>

        {/* How Submission Works */}
        <div className="mb-16 p-8 md:p-12 bg-white border-2 border-[#E0D8D0] rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Send className="w-6 h-6 text-[#E11D48]" />
            <h3 className="font-['Cardo'] text-3xl text-[#2C1810]">How Submission Works</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#E11D48]/10 rounded-full flex items-center justify-center font-['Cardo'] text-lg text-[#E11D48]">
                1
              </div>
              <div>
                <h4 className="font-['Cardo'] text-xl text-[#2C1810] mb-2">Write Your Piece</h4>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                  Use our clean editor to write poetry, prose, fiction, or nonfiction. Save drafts as you go.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#E11D48]/10 rounded-full flex items-center justify-center font-['Cardo'] text-lg text-[#E11D48]">
                2
              </div>
              <div>
                <h4 className="font-['Cardo'] text-xl text-[#2C1810] mb-2">Click Submit to Editors</h4>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                  When your piece is ready, click the "Submit to Editors" button. Your work goes directly to our editorial team for review.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#E11D48]/10 rounded-full flex items-center justify-center font-['Cardo'] text-lg text-[#E11D48]">
                3
              </div>
              <div>
                <h4 className="font-['Cardo'] text-xl text-[#2C1810] mb-2">Hear Back Within 90 Days</h4>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                  Our editors carefully review every submission. Members get priority review (typically within 30 days). All submissions receive personal consideration.
                </p>
              </div>
            </div>

            {isMember && (
              <div className="flex gap-4 p-4 bg-[#C4A265]/10 rounded-xl border border-[#C4A265]/30">
                <Sparkles className="flex-shrink-0 w-6 h-6 text-[#C4A265] mt-1" />
                <div>
                  <h4 className="font-['Cardo'] text-xl text-[#2C1810] mb-2">Member Bonus: Community Feed</h4>
                  <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                    As a member, you can also submit poetry directly to the Community Feed to share with readers and get feedback before or instead of editorial submission.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Studio Management */}
        <div className="border-t-2 border-[#E0D8D0] pt-12">
          <h2 className="font-['Cardo'] text-4xl mb-8 text-[#2C1810] italic text-center">
            Manage Your Work
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/studio/my-garden"
              className="group p-8 bg-gradient-to-br from-[#8A9A7B]/5 to-white border-2 border-[#8A9A7B] hover:border-[#8A9A7B] hover:shadow-xl rounded-xl transition-all duration-300"
            >
              <Sprout className="w-8 h-8 mb-4 text-[#8A9A7B] group-hover:scale-110 transition-transform" />
              <h3 className="font-['Cardo'] text-2xl mb-3 text-[#2C1810]">
                My Garden
              </h3>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                See your pieces organized by tags, themes, and growth states. Build constellations of ideas.
              </p>
            </a>
            
            <a
              href="/studio/work"
              className="group p-8 bg-white border-2 border-[#E0D8D0] hover:border-[#C4A265] rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              <FolderOpen className="w-8 h-8 mb-4 text-[#8B7355] group-hover:text-[#C4A265] transition-colors" />
              <h3 className="font-['Cardo'] text-2xl mb-3 text-[#2C1810]">
                My Work
              </h3>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                View all your drafts, create exhibits, manage published pieces, and track submission status
              </p>
            </a>

            <a
              href="/studio/room-settings"
              className="group p-8 bg-white border-2 border-[#E0D8D0] hover:border-[#C4A265] rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              <Settings className="w-8 h-8 mb-4 text-[#8B7355] group-hover:text-[#C4A265] transition-colors" />
              <h3 className="font-['Cardo'] text-2xl mb-3 text-[#2C1810]">
                Room Settings
              </h3>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                Customize your public Room: design, typography, featured pieces, and bookshelf
              </p>
            </a>
          </div>
        </div>

        {/* Philosophy Note */}
        <div className="mt-12 p-8 bg-white/50 backdrop-blur-sm border border-[#E0D8D0] rounded-xl">
          <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] leading-loose italic text-center">
            Your Studio is your private creative workspace. Write without pressure, save drafts as you work, 
            and submit only when you're ready. This is where craft happens—quiet, focused, yours.
          </p>
        </div>
      </div>
    </div>
  );
}
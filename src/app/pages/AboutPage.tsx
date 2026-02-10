import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { Heart, BookOpen, Users, Mail, Send, Feather } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <GalleryNav />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-8 bg-gradient-to-b from-[#F5F0EB] to-[#FAF7F2]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-['Cardo'] text-7xl md:text-8xl text-[#2C1810] mb-8 italic leading-tight">
            Meet The Gallery
          </h1>
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-20 bg-[#C4A265]"></div>
            <Feather className="w-6 h-6 text-[#C4A265]" />
            <div className="h-px w-20 bg-[#C4A265]"></div>
          </div>
          <p className="font-['Libre_Baskerville'] text-2xl text-[#8B7355] leading-relaxed max-w-3xl mx-auto">
            A digital sanctuary for contemporary writing, where literary excellence meets community, and every voice finds its room.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-12 md:p-16">
            <div className="flex items-center justify-center mb-8">
              <BookOpen className="w-8 h-8 text-[#E11D48]" />
            </div>
            <h2 className="font-['Cardo'] text-4xl text-[#2C1810] mb-8 text-center italic">
              Our Mission
            </h2>
            <p className="font-['Libre_Baskerville'] text-xl text-[#2C1810] leading-loose text-center">
              To create a space where writers can share their work with dignity and readers can engage with literature in the intimate, contemplative way it deserves. We believe good writing needs more than a platform—it needs a <em>place</em>: a room with atmosphere, care, and intentional design.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Cardo'] text-5xl text-[#2C1810] mb-12 text-center italic">
            Our Story
          </h2>
          <div className="space-y-8 font-['Libre_Baskerville'] text-lg text-[#2C1810] leading-loose">
            <p>
              The Gallery was born from a simple frustration: every platform for writers seemed to prioritize metrics over meaning, engagement over experience. We watched as beautiful essays were flattened into inbox clutter, as poetry was scrolled past in algorithmic feeds, as the intimate act of reading became just another form of content consumption.
            </p>
            <p>
              We wanted something different. Not a newsletter service that takes 10% of your revenue. Not a social media feed that rewards frequency over quality. Not another platform optimized for "engagement."
            </p>
            <p>
              We imagined a digital space that felt more like a gallery than a feed—where each piece of writing could exist in its own room, with its own atmosphere. Where readers could wander rather than scroll. Where the quiet act of reading was honored, not gamified.
            </p>
            <p>
              The Gallery launched in early 2026 as an experiment in what we call "calm technology for writers." No notification badges. No follower counts. No pressure to post daily. Just a beautiful space for writing to live and breathe, designed with the same care you'd give to a physical exhibition.
            </p>
            <p className="text-[#8B7355] italic pt-4">
              "A room of one's own" isn't just our tagline—it's our founding principle.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Team */}
      <section className="py-20 px-8 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-['Cardo'] text-5xl text-[#2C1810] mb-16 text-center italic">
            Editorial Team
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Editor-in-Chief */}
            <div className="bg-white border-2 border-[#E0D8D0] rounded-lg overflow-hidden hover:border-[#C4A265] transition-all">
              <div className="aspect-[3/4] bg-gradient-to-br from-[#C4A265]/20 to-[#E11D48]/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-white/80 rounded-full flex items-center justify-center mb-4">
                    <Feather className="w-12 h-12 text-[#E11D48]" />
                  </div>
                  <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
                    Photo
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-2">
                  Elena Moretti
                </h3>
                <p className="font-['Courier_New'] text-xs text-[#E11D48] uppercase tracking-wider mb-4">
                  Editor-in-Chief
                </p>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                  Elena brings fifteen years of editorial experience from <em>The Paris Review</em> and <em>Granta</em>. She holds an MFA from Iowa and believes that every manuscript deserves a careful, generous read. Her work has appeared in <em>Best American Essays</em> and <em>The New Yorker</em>.
                </p>
              </div>
            </div>

            {/* Poetry Editor */}
            <div className="bg-white border-2 border-[#E0D8D0] rounded-lg overflow-hidden hover:border-[#C4A265] transition-all">
              <div className="aspect-[3/4] bg-gradient-to-br from-[#8B7355]/20 to-[#C4A265]/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-white/80 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-12 h-12 text-[#8B7355]" />
                  </div>
                  <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
                    Photo
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-2">
                  Marcus Chen
                </h3>
                <p className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider mb-4">
                  Poetry Editor
                </p>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                  Marcus is the author of two poetry collections and a Pushcart Prize winner. He champions innovative voices and believes poetry should be accessible without being simplistic. Previously poetry editor at <em>Tin House</em>, he teaches at Columbia University.
                </p>
              </div>
            </div>

            {/* Fiction Editor */}
            <div className="bg-white border-2 border-[#E0D8D0] rounded-lg overflow-hidden hover:border-[#C4A265] transition-all">
              <div className="aspect-[3/4] bg-gradient-to-br from-[#E11D48]/20 to-[#8B7355]/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-white/80 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-12 h-12 text-[#E11D48]" />
                  </div>
                  <div className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
                    Photo
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-2">
                  Amara Johnson
                </h3>
                <p className="font-['Courier_New'] text-xs text-[#C4A265] uppercase tracking-wider mb-4">
                  Fiction Editor
                </p>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
                  Amara's debut novel was longlisted for the National Book Award. She's passionate about narrative voices that challenge conventions and stories that linger long after the last page. She was fiction editor at <em>One Story</em> and holds an MFA from Michigan.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] italic">
              Plus a dedicated team of contributing editors, readers, and community moderators
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Cardo'] text-5xl text-[#2C1810] mb-16 text-center italic">
            What We Stand For
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Literary Excellence */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E11D48]/10 rounded-full mb-6">
                <Feather className="w-10 h-10 text-[#E11D48]" />
              </div>
              <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
                Literary Excellence
              </h3>
              <p className="font-[family-name:var(--font-ui)] text-base text-[#8B7355] leading-relaxed">
                We champion writing that takes risks, trusts its reader, and honors the craft. Quality over quantity, always. Every submission receives a careful, considered read from our editorial team.
              </p>
            </div>

            {/* Community */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C4A265]/10 rounded-full mb-6">
                <Users className="w-10 h-10 text-[#C4A265]" />
              </div>
              <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
                Community
              </h3>
              <p className="font-[family-name:var(--font-ui)] text-base text-[#8B7355] leading-relaxed">
                Writers and readers aren't metrics—they're people. We build connections through shared appreciation of good writing, not through algorithmic manipulation. Our community values generosity, curiosity, and respect.
              </p>
            </div>

            {/* Accessibility */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8B7355]/10 rounded-full mb-6">
                <BookOpen className="w-10 h-10 text-[#8B7355]" />
              </div>
              <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
                Accessibility
              </h3>
              <p className="font-[family-name:var(--font-ui)] text-base text-[#8B7355] leading-relaxed">
                Great writing should be discoverable regardless of the writer's platform size or social media following. We use editorial curation, not follower counts, to bring exceptional work to readers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Principles */}
      <section className="py-20 px-8 bg-[#F5F0EB]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Cardo'] text-4xl text-[#2C1810] mb-12 text-center italic">
            Design Principles
          </h2>
          
          <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-8 md:p-12">
            <div className="space-y-6 font-[family-name:var(--font-ui)] text-base text-[#8B7355] leading-relaxed">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#E11D48] rounded-full mt-2 flex-shrink-0"></div>
                <p><strong className="text-[#2C1810]">No notification badges</strong> — Your attention belongs to you, not to an app.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#E11D48] rounded-full mt-2 flex-shrink-0"></div>
                <p><strong className="text-[#2C1810]">No follower counts</strong> — We measure impact through engagement depth, not audience size.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#E11D48] rounded-full mt-2 flex-shrink-0"></div>
                <p><strong className="text-[#2C1810]">No algorithmic feeds</strong> — Discovery happens through editorial curation and intentional browsing.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#E11D48] rounded-full mt-2 flex-shrink-0"></div>
                <p><strong className="text-[#2C1810]">No pressure to post</strong> — Write when you have something to say, not to feed an algorithm.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#E11D48] rounded-full mt-2 flex-shrink-0"></div>
                <p><strong className="text-[#2C1810]">No content extraction</strong> — Your work stays yours. We take 0% of your earnings.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#E11D48] rounded-full mt-2 flex-shrink-0"></div>
                <p><strong className="text-[#2C1810]">Generous margins, slow transitions</strong> — The design respects the reading experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Cardo'] text-5xl text-[#2C1810] mb-12 text-center italic">
            Get In Touch
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* General Contact */}
            <div className="bg-[#F5F0EB] border-2 border-[#E0D8D0] rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-[#E11D48]" />
                <h3 className="font-['Cardo'] text-2xl text-[#2C1810]">
                  General Inquiries
                </h3>
              </div>
              <a 
                href="mailto:hello@thegallery.page" 
                className="font-['Libre_Baskerville'] text-lg text-[#E11D48] hover:text-[#C01040] transition-colors"
              >
                hello@thegallery.page
              </a>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mt-4">
                For questions about membership, technical support, or general inquiries
              </p>
            </div>

            {/* Submissions */}
            <div className="bg-[#F5F0EB] border-2 border-[#E0D8D0] rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Send className="w-6 h-6 text-[#C4A265]" />
                <h3 className="font-['Cardo'] text-2xl text-[#2C1810]">
                  Submissions
                </h3>
              </div>
              <a 
                href="mailto:submit@thegallery.page" 
                className="font-['Libre_Baskerville'] text-lg text-[#E11D48] hover:text-[#C01040] transition-colors"
              >
                submit@thegallery.page
              </a>
              <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mt-4">
                For questions about the submission process or to inquire about submission status
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
              We aim to respond to all inquiries within 2-3 business days
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-8 bg-gradient-to-b from-[#2C1810] to-[#1A1F2E]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Cardo'] text-5xl md:text-6xl text-[#F5F0EB] mb-8 italic">
            Join The Gallery
          </h2>
          <p className="font-['Libre_Baskerville'] text-xl text-[#E8E4DC]/80 leading-relaxed mb-12 max-w-2xl mx-auto">
            Whether you're a writer looking for your room or a reader seeking exceptional contemporary literature, there's a place for you here.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="/submit"
              className="group px-10 py-5 bg-[#E11D48] text-white hover:bg-[#C01040] transition-all font-['Cardo'] text-lg tracking-wide flex items-center gap-3"
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Submit Your Work
            </a>
            <a 
              href="/signup"
              className="px-10 py-5 border-2 border-[#F5F0EB] text-[#F5F0EB] hover:bg-[#F5F0EB] hover:text-[#2C1810] transition-all font-['Cardo'] text-lg tracking-wide"
            >
              Become a Member
            </a>
          </div>

          <div className="mt-16 pt-12 border-t border-[#F5F0EB]/20">
            <p className="font-['Libre_Baskerville'] text-lg text-[#E8E4DC]/60 italic">
              "A room of one's own"
            </p>
          </div>
        </div>
      </section>

      <GalleryFooter variant="dark" />
    </div>
  );
}

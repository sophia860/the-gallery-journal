import { Sprout, BookOpen, Users, Leaf } from 'lucide-react';

export function GardenLandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E5E0DA]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-[#7A9E7E]" />
            <span className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] lowercase italic">
              garden
            </span>
          </div>
          <a
            href="/garden/signin"
            className="px-6 py-2 text-sm font-medium text-[#2C2C2C] hover:text-[#7A9E7E] transition-colors font-['Inter']"
          >
            Sign in
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 mb-8">
            <Sprout className="w-16 h-16 text-[#7A9E7E]" />
            <h1 className="font-['Lora'] text-7xl font-semibold text-[#2C2C2C] lowercase italic">
              garden
            </h1>
          </div>

          {/* Tagline */}
          <h2 className="font-['Lora'] text-4xl font-medium text-[#2C2C2C] mb-6 leading-tight">
            A place for writers who think.
          </h2>

          <p className="font-['Inter'] text-xl text-[#6B6B6B] mb-12 max-w-2xl mx-auto leading-relaxed">
            Cultivate your ideas. Connect your thoughts. Share with intimate circles. 
            No feeds, no metrics—just space to write and grow.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <a
              href="/garden/signup"
              className="w-full sm:w-auto px-8 py-4 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold rounded-lg shadow-sm text-lg"
            >
              Create your garden
            </a>
            <a
              href="/garden/signin"
              className="w-full sm:w-auto px-8 py-4 border-2 border-[#E5E0DA] text-[#2C2C2C] hover:border-[#7A9E7E] hover:text-[#7A9E7E] transition-all font-['Inter'] font-semibold rounded-lg text-lg"
            >
              Sign in
            </a>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-white border-2 border-[#E5E0DA] rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D4B896] mt-2"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#F0EDE8] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[#F0EDE8] rounded w-full"></div>
                    <div className="h-3 bg-[#F0EDE8] rounded w-5/6 mt-1"></div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#A3C4A0] mt-2"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#F0EDE8] rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-[#F0EDE8] rounded w-full"></div>
                    <div className="h-3 bg-[#F0EDE8] rounded w-4/5 mt-1"></div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C48B8B] mt-2"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#F0EDE8] rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-[#F0EDE8] rounded w-full"></div>
                    <div className="h-3 bg-[#F0EDE8] rounded w-3/4 mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-6 border-t border-[#E5E0DA]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Prop 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F0F7F0] rounded-full mb-6">
                <Leaf className="w-8 h-8 text-[#7A9E7E]" />
              </div>
              <h3 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-4">
                Watch ideas grow
              </h3>
              <p className="font-['Inter'] text-base text-[#6B6B6B] leading-relaxed">
                Track your writing through stages—from seeds (fragments) to sprouts (drafts) to blooms (finished pieces). Your garden shows your creative process.
              </p>
            </div>

            {/* Prop 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FBF7F0] rounded-full mb-6">
                <BookOpen className="w-8 h-8 text-[#D4B896]" />
              </div>
              <h3 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-4">
                Connect your thoughts
              </h3>
              <p className="font-['Inter'] text-base text-[#6B6B6B] leading-relaxed">
                Link notes together. Build constellations of related ideas. Create your own personal wiki that reflects how you actually think.
              </p>
            </div>

            {/* Prop 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FAF2F2] rounded-full mb-6">
                <Users className="w-8 h-8 text-[#C48B8B]" />
              </div>
              <h3 className="font-['Lora'] text-2xl font-semibold text-[#2C2C2C] mb-4">
                Share with intention
              </h3>
              <p className="font-['Inter'] text-base text-[#6B6B6B] leading-relaxed">
                Join intimate tables (max 12 writers) for feedback and community. No public metrics. No viral content. Just thoughtful conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#E5E0DA]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-['Inter'] text-sm text-[#9B9B9B]">
            © 2026 Garden. A place for writers who think slowly.
          </p>
        </div>
      </footer>
    </div>
  );
}

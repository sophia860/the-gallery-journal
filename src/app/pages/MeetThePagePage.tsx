import { motion } from 'motion/react';
import { ArrowRight, Award, Users, BookOpen, Star, CheckCircle, User, Send, Eye, Heart } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function MeetThePagePage() {
  return (
    <div className="min-h-screen bg-[#1A1F2E]">
      <GalleryNav currentPage="meet-the-page" variant="dark" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl text-[#F5F0EB] mb-6">
              Join <span className="italic text-[#C9A87C]">page</span> — the social home of The Gallery
            </h1>
            <p className="font-[family-name:var(--font-ui)] text-xl text-[#A0A0A0] max-w-3xl mx-auto mb-10">
              Follow writers, share drafts, and see what the editors are actually reading in real time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A87C] text-[#1A1F2E] font-[family-name:var(--font-ui)] font-medium rounded-lg hover:bg-[#D4B88E] transition-colors"
            >
              Join Now
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/collection-gallery"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#3D4556] text-[#F5F0EB] font-[family-name:var(--font-ui)] font-medium rounded-lg hover:border-[#C9A87C] hover:text-[#C9A87C] transition-colors"
            >
              Browse The Gallery
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-[family-name:var(--font-body)] text-sm text-[#A0A0A0] mt-4"
          >
            Free to join, for writers and readers.
          </motion.p>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 px-6 bg-[#151925]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[#F5F0EB] text-center mb-16"
          >
            Why Join <span className="italic text-[#C9A87C]">page</span>?
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: User,
                title: "Your Own Page",
                description: "Get a personal page where your pieces, drafts, and bio live."
              },
              {
                icon: Send,
                title: "Submit Directly",
                description: "Submit directly to The Gallery from your page instead of filling out cold forms."
              },
              {
                icon: Eye,
                title: "Track Your Work",
                description: "See which pieces have been picked up, longlisted, or are in the editorial queue."
              },
              {
                icon: Heart,
                title: "Follow Writers",
                description: "Follow writers you love and be notified when they publish or submit something new."
              },
              {
                icon: Award,
                title: "Build Your Record",
                description: "Build a track record that editors can actually see at a glance."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-[#1A1F2E] rounded-xl border border-[#3D4556] shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              >
                <feature.icon className="w-10 h-10 text-[#C9A87C] mb-4" />
                <h3 className="font-[family-name:var(--font-ui)] text-xl text-[#F5F0EB] mb-3">
                  {feature.title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[#A0A0A0]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How You Submit */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[#F5F0EB] text-center mb-16"
          >
            How You Submit to The Gallery
          </motion.h2>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Create Your Page",
                description: "Add a short bio, links, and your current work."
              },
              {
                step: "02",
                title: "Upload a Draft",
                description: "Write or paste a piece directly on your page."
              },
              {
                step: "03",
                title: "Click 'Submit to The Gallery'",
                description: "Hit the submit button on that piece to send it into our editorial queue."
              },
              {
                step: "04",
                title: "Track Your Submission",
                description: "Follow it from received → in reading → accepted, all from your page."
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#151925] border border-[#C9A87C] flex items-center justify-center">
                  <span className="font-[family-name:var(--font-display)] text-xl text-[#C9A87C]">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-ui)] text-xl text-[#F5F0EB] mb-2">
                    {item.title}
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-[#A0A0A0]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A87C] text-[#1A1F2E] font-[family-name:var(--font-ui)] font-medium rounded-lg hover:bg-[#D4B88E] transition-colors"
            >
              Create Your Page
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-[#151925]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "4%", label: "Acceptance Rate" },
              { value: "50", label: "Pages Per Issue" },
              { value: "1,250+", label: "Submissions/Quarter" },
              { value: "8", label: "Weeks Response" }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="font-[family-name:var(--font-display)] text-4xl text-[#C9A87C] mb-2">
                  {stat.value}
                </div>
                <div className="font-[family-name:var(--font-ui)] text-sm text-[#A0A0A0]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[#F5F0EB] mb-6">
              Ready to Join <span className="italic text-[#C9A87C]">page</span>?
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[#A0A0A0] mb-8">
              It's free. Create your page, start following writers, and submit to The Gallery when you're ready.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A87C] text-[#1A1F2E] font-[family-name:var(--font-ui)] font-medium rounded-lg hover:bg-[#D4B88E] transition-colors"
            >
              Join Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

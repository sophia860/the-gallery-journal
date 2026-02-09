import { motion } from 'motion/react';
import { ArrowRight, Award, Users, BookOpen, Star, CheckCircle } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function MeetThePagePage() {
  return (
    <div className="min-h-screen bg-[#1A1F2E]">
      <GalleryNav currentPage="meet-the-page" variant="dark" />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl text-[#F5F0EB] mb-6">
              Meet <span className="italic text-[#C9A87C]">The Page</span>
            </h1>
            <p className="font-[family-name:var(--font-ui)] text-xl text-[#A0A0A0] max-w-2xl mx-auto mb-8">
              Every great poem deserves its own page. At The Page Gallery Journal, 
              your work doesn't disappear into an archive—it becomes a permanent 
              coordinate in our literary space.
            </p>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#C9A87C] italic mb-12">
              "Being published in The Gallery is a badge of honor."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/submit-to-gallery"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A87C] text-[#1A1F2E] font-[family-name:var(--font-ui)] font-medium rounded-lg hover:bg-[#D4B88E] transition-colors"
            >
              Submit Your Work
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/collection-gallery"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#3D4556] text-[#F5F0EB] font-[family-name:var(--font-ui)] font-medium rounded-lg hover:border-[#C9A87C] hover:text-[#C9A87C] transition-colors"
            >
              Browse The Gallery
            </a>
          </motion.div>
        </div>
      </section>

      {/* What Makes The Page Special */}
      <section className="py-20 px-6 bg-[#151925]">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[#F5F0EB] text-center mb-16"
          >
            What Makes <span className="italic text-[#C9A87C]">The Page</span> Different
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Earned Prestige",
                description: "We publish only 4% of submissions. Each accepted piece has genuinely earned its place on our walls."
              },
              {
                icon: Star,
                title: "Numbered Pages",
                description: "Your work becomes Page [number] in our collection—a permanent, citable coordinate in literary space."
              },
              {
                icon: Users,
                title: "Curated Community",
                description: "Join a selective community of published writers. Your Gallery badge is a recognized literary credential."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-8 bg-[#1A1F2E] rounded-xl border border-[#3D4556]"
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

      {/* The Badge of Honor */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[#F5F0EB] mb-6">
                The Gallery Badge
              </h2>
              <p className="font-[family-name:var(--font-body)] text-[#A0A0A0] mb-6">
                When your work is accepted, you earn the Gallery Badge—a verified mark of 
                literary achievement. Display it on your profile, CV, or website as proof 
                that your work met our editorial standards.
              </p>
              <ul className="space-y-3">
                {[
                  "Verified 'Published in The Gallery' credential",
                  "Permanent page number in our collection",
                  "Listed in our annual Best of The Gallery anthology",
                  "Priority access to live readings and events"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#F5F0EB]">
                    <CheckCircle className="w-5 h-5 text-[#C9A87C] mt-0.5 flex-shrink-0" />
                    <span className="font-[family-name:var(--font-body)]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Badge Visual */}
              <div className="bg-gradient-to-br from-[#C9A87C] to-[#8B7355] p-1 rounded-2xl">
                <div className="bg-[#1A1F2E] p-8 rounded-xl text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C9A87C] to-[#8B7355] flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-[#1A1F2E]" />
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-[#F5F0EB] mb-2">
                    Published Writer
                  </h3>
                  <p className="font-[family-name:var(--font-ui)] text-[#C9A87C] text-sm mb-4">
                    The Page Gallery Journal
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#151925] rounded-full">
                    <Star className="w-4 h-4 text-[#C9A87C]" />
                    <span className="font-[family-name:var(--font-ui)] text-[#F5F0EB] text-sm">
                      Page 42 · Winter 2026
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#151925]">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[#F5F0EB] text-center mb-16"
          >
            How to Claim Your Page
          </motion.h2>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Submit Your Best Work",
                description: "Send us one carefully prepared piece during our quarterly submission window. Include a cover letter explaining why this work belongs in The Gallery."
              },
              {
                step: "02",
                title: "Editorial Review",
                description: "Our editors review every submission with care. We respond within 8 weeks with either an acceptance, feedback, or a thoughtful rejection."
              },
              {
                step: "03",
                title: "Claim Your Page",
                description: "If accepted, your work is assigned a page number and hung on a themed wall. You'll receive your Gallery Badge and be notified of your publication date."
              },
              {
                step: "04",
                title: "Join The Gallery",
                description: "Your piece lives permanently in The Gallery. Share your page with readers, add your badge to your bio, and join our community of published writers."
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
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#1A1F2E] border border-[#C9A87C] flex items-center justify-center">
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
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

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#151925]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[#F5F0EB] mb-6">
              Ready to Claim Your Page?
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[#A0A0A0] mb-8">
              Our Winter 2026 submission window is now open. Submit your best work 
              and join the writers who've earned their place in The Gallery.
            </p>
            <a
              href="/submit-to-gallery"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A87C] text-[#1A1F2E] font-[family-name:var(--font-ui)] font-medium rounded-lg hover:bg-[#D4B88E] transition-colors"
            >
              Submit to The Gallery
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

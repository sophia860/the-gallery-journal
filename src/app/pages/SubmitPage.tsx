import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function SubmitPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />

      {/* Header */}
      <section className="px-8 py-16 text-center">
        <h1 className="font-['Special_Elite'] text-[#1A1A1A] mb-8" style={{ fontSize: 'clamp(48px, 7vw, 64px)', lineHeight: '1.2' }}>
          SUBMIT
        </h1>
      </section>

      {/* Pull Quote */}
      <section className="px-8 py-12 bg-[#EDE6D6]">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-['Special_Elite'] text-[#1A1A1A]" style={{ 
            fontSize: 'clamp(24px, 4vw, 32px)', 
            lineHeight: '1.4',
            letterSpacing: '0.05em'
          }}>
            "Writing that bruises or burns. Poetry that breaks rules. Underpublished and neurodivergent voices."
          </blockquote>
        </div>
      </section>

      {/* Guidelines */}
      <section className="px-8 py-16">
        <div className="max-w-[650px] mx-auto space-y-12">
          {/* What We Publish */}
          <div>
            <h3 className="font-['Courier_New'] text-[20px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-6">
              WHAT WE PUBLISH
            </h3>
            <div className="font-['Source_Serif_Pro'] text-[18px] text-[#1A1A1A] leading-relaxed space-y-4">
              <p>
                Poetry, prose, essays, and hybrid forms. We're looking for work that takes risks, that doesn't fit neatly into categories, that makes us see the world differently.
              </p>
              <p>
                We prioritize work by writers from marginalized communities, neurodivergent writers, and voices underrepresented in traditional literary spaces.
              </p>
              <p>
                We don't publish AI-generated work. Every piece in our archive is written by a human being who cares deeply about language.
              </p>
            </div>
          </div>

          {/* How to Submit */}
          <div>
            <h3 className="font-['Courier_New'] text-[20px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-6">
              HOW TO SUBMIT
            </h3>
            <div className="font-['Source_Serif_Pro'] text-[18px] text-[#1A1A1A] leading-relaxed space-y-4">
              <p>
                Submit up to <strong>5 poems</strong> or <strong>one prose piece</strong> (up to 5,000 words) via email.
              </p>
              <p>
                Include a brief cover letter (2-3 sentences) and a short bio (50 words max) in the body of your email. Attach your work as a <strong>.doc</strong>, <strong>.docx</strong>, or <strong>.pdf</strong> file.
              </p>
              <p>
                Simultaneous submissions are welcome—just let us know if your work is accepted elsewhere.
              </p>
              <p className="pt-4">
                Send submissions to:
              </p>
              <p>
                <a 
                  href="mailto:submit@pagegalleryjournal.com"
                  className="font-['Courier_New'] text-[20px] text-[#8B2500] hover:underline uppercase tracking-[0.1em]"
                >
                  submit@pagegalleryjournal.com
                </a>
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-['Courier_New'] text-[20px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-6">
              TIMELINE
            </h3>
            <div className="font-['Source_Serif_Pro'] text-[18px] text-[#1A1A1A] leading-relaxed space-y-4">
              <p>
                We read year-round. Response time is typically <strong>8-12 weeks</strong>.
              </p>
              <p>
                If we haven't responded within 12 weeks, feel free to query. We receive a high volume of submissions and do our best to respond to everyone.
              </p>
            </div>
          </div>

          {/* Rights */}
          <div>
            <h3 className="font-['Courier_New'] text-[20px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-6">
              RIGHTS
            </h3>
            <div className="font-['Source_Serif_Pro'] text-[18px] text-[#1A1A1A] leading-relaxed space-y-4">
              <p>
                We acquire <strong>first serial rights</strong> for publication in our digital gallery and any future print editions. All rights revert to the author upon publication.
              </p>
              <p>
                We do not pay for submissions at this time, but we're working toward a sustainable model that compensates writers fairly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Note */}
      <section className="px-8 py-16 bg-[#EDE6D6]">
        <div className="max-w-[650px] mx-auto text-center">
          <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#1A1A1A] leading-relaxed">
            Questions? Email us at <a href="mailto:editors@pagegalleryjournal.com" className="text-[#8B2500] hover:underline">editors@pagegalleryjournal.com</a>
          </p>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

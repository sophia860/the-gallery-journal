import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function SubmitPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />

      {/* Header */}
      <section className="px-8 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-['Special_Elite'] text-[56px] text-[#1A1A1A] mb-8" style={{ lineHeight: '1.2' }}>
            SUBMIT
          </h1>
          <p className="font-['Source_Serif_Pro'] italic text-[18px] text-[#4A4A4A] mb-12 leading-relaxed">
            We accept poetry, prose, and hybrid forms
          </p>
          <div className="w-[40%] h-px bg-[#4A4A4A] mx-auto"></div>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-['Courier_New'] text-[28px] uppercase tracking-[0.15em] text-[#1A1A1A] mb-8">
            GUIDELINES
          </h2>

          <div className="space-y-8 font-['Source_Serif_Pro'] text-[18px] text-[#1A1A1A] leading-relaxed">
            <div>
              <h3 className="font-['Courier_New'] text-[18px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-3">
                What We're Looking For
              </h3>
              <p>
                Work that doesn't fit neatly into categories. Writing that breathes. Pieces that stay with us after we close the tab.
              </p>
            </div>

            <div>
              <h3 className="font-['Courier_New'] text-[18px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-3">
                Submission Format
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send 3-5 poems or up to 3,000 words of prose</li>
                <li>Include a brief bio (100 words or less)</li>
                <li>Previously published work is welcome—just let us know where</li>
                <li>Simultaneous submissions accepted</li>
              </ul>
            </div>

            <div>
              <h3 className="font-['Courier_New'] text-[18px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-3">
                Response Time
              </h3>
              <p>
                We read submissions on a rolling basis. Expect a response within 8-12 weeks.
              </p>
            </div>

            <div>
              <h3 className="font-['Courier_New'] text-[18px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-3">
                How to Submit
              </h3>
              <p className="mb-4">
                Email your work to:{' '}
                <a
                  href="mailto:submissions@pagegalleryjournal.com"
                  className="text-[#8B2500] hover:underline font-['Courier_New']"
                >
                  submissions@pagegalleryjournal.com
                </a>
              </p>
              <p className="text-[16px] italic text-[#4A4A4A]">
                Subject line: [Genre] Submission - [Your Name]
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 border border-[#1A1A1A]/10">
            <p className="font-['Source_Serif_Pro'] italic text-[16px] text-[#4A4A4A] text-center">
              "There is no algorithm. Just a nervous system, a lot of tabs open, and a deep love for what people make when they are paying attention."
            </p>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}

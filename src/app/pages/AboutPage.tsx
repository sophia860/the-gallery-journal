import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { ParallaxStarfield } from '../components/ParallaxStarfield';
import { useEffect } from 'react';

export function AboutPage() {
  useEffect(() => {
    // Fade in observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      document.querySelectorAll('.fade-in-element').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      <ParallaxStarfield />

      <style>{`
        .fade-in-element {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s ease, transform 1s ease;
        }

        .fade-in-element.fade-in-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hospital-note {
          background: rgba(20, 25, 35, 0.5);
          border-left: 2px solid rgba(196, 164, 108, 0.3);
          backdrop-filter: blur(10px);
        }
      `}</style>

      <div className="relative z-10">
        <GalleryNav />

        {/* Long-scrolling, unhurried page */}
        <div className="max-w-3xl mx-auto px-8 py-40">
          
          {/* WHY THIS EXISTS */}
          <section className="mb-32 fade-in-element">
            <div className="mb-16">
              <div className="w-12 h-[1px] bg-[#c4a46c] mb-8"></div>
              <h2 className="font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.25em] text-[#c4a46c] mb-2">
                Why This Exists
              </h2>
            </div>

            <div className="space-y-8 font-['Georgia'] text-[22px] text-[#f5f0e8]" style={{ lineHeight: '1.9' }}>
              <p>
                Sophia got sick.
              </p>

              <p>
                The world shrank to the square foot around her bed. In that slowed-down space, small things gained weight—the way people spoke when they weren't performing, the accidental sentences that slipped out between tasks. She began collecting those fragments.
              </p>

              <p>
                She made a vow: to build a place that would treat people's words as exhibits, because that is what they are—evidence of a mind insisting on being heard. Not decoration. Not draft material. Exhibits.
              </p>
            </div>
          </section>

          {/* THE PROMISE */}
          <section className="mb-32 fade-in-element">
            <div className="space-y-8 font-['Georgia'] text-[22px] text-[#e8ddd0]" style={{ lineHeight: '1.9' }}>
              <p>
                The Page Gallery was built to keep that promise.
              </p>

              <p>
                The calls are written in plain language. The edits explain instead of exclude. The invitations don't depend on the right credentials. And the fragments themselves are not apologised for—they are the form.
              </p>
            </div>
          </section>

          {/* WHAT THE GALLERY IS */}
          <section className="mb-32 fade-in-element">
            <div className="mb-16">
              <div className="w-12 h-[1px] bg-[#c4a46c] mb-8"></div>
              <h2 className="font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.25em] text-[#c4a46c] mb-2">
                What The Gallery Is
              </h2>
            </div>

            <div className="space-y-8 font-['Georgia'] text-[22px] text-[#e8ddd0]" style={{ lineHeight: '1.9' }}>
              <p>
                The Gallery is not an archive of polish; it is a body in motion. It shifts like weather.
              </p>

              <p>
                Step inside and you are briefly inside someone else's thinking: their private weather system, their running joke, their hesitation. Nothing here is manicured to impress. It is presented to be witnessed.
              </p>

              <p>
                The smudge, the strike-through, the tangent: each is proof that a life was here, demanding to be noticed.
              </p>
            </div>
          </section>

          {/* THE BELIEF */}
          <section className="mb-32 fade-in-element">
            <div className="mb-16">
              <div className="w-12 h-[1px] bg-[#c4a46c] mb-8"></div>
              <h2 className="font-['Cormorant_Garamond'] text-[14px] uppercase tracking-[0.25em] text-[#c4a46c] mb-2">
                The Belief
              </h2>
            </div>

            <div className="space-y-8 font-['Georgia'] text-[22px] text-[#e8ddd0]" style={{ lineHeight: '1.9' }}>
              <p>
                Anyone who can write can change what the world pays attention to.
              </p>

              <p>
                Change does not mean utopia. It means a door opens, a silence cracks, a perspective shifts.
              </p>

              <p>
                The Page Gallery listens hard enough to make that possible, carrying voices into spaces they have not been allowed to reach.
              </p>
            </div>

            <div className="mt-16 pt-12 border-t border-[rgba(196,164,108,0.2)]">
              <p className="font-['Cormorant_Garamond'] text-[16px] text-[#8b9dc3]">
                Sophia Sharkey, Founder
              </p>
              <p className="font-['Cormorant_Garamond'] text-[14px] text-[#8b9dc3]/60 mt-1">
                The Page Gallery, 2025
              </p>
            </div>
          </section>

          {/* HOSPITAL DIARY - THE MOST IMPORTANT PART */}
          <section className="mb-32 fade-in-element">
            <div className="mb-8">
              <p className="font-['Cormorant_Garamond'] text-[12px] uppercase tracking-[0.25em] text-[#c4a46c]/70 italic">
                From the founder's notebook
              </p>
            </div>

            <div className="hospital-note py-12 px-8 md:px-12">
              <p 
                className="font-['Georgia'] text-[24px] text-[#f5f0e8] italic"
                style={{ lineHeight: '1.8' }}
              >
                If this kills me, or if I live to be 90, the when is not my concern anymore. The point is this: I will not leave without finding a way for no more people to die unheard. I will build a world that refuses the gates. A place where voice isn't weighed by credentials, where language belongs to lungs that need it, where no life disappears without its record.
              </p>
            </div>

            <div className="mt-8">
              <p className="font-['Cormorant_Garamond'] text-[13px] text-[#8b9dc3]/50 italic text-right">
                A note found later
              </p>
            </div>
          </section>

          {/* Spacer before footer */}
          <div className="h-32"></div>
        </div>

        <GalleryFooter />
      </div>
    </div>
  );
}

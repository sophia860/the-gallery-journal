// About page - redesigned with visual layout and scroll animations
import { useEffect, useRef } from 'react';

export function AboutPage() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <>
      <style>{`
        .fade-section {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fade-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-line {
          display: block;
          overflow: hidden;
        }
        .hero-line span {
          display: inline-block;
          animation: slideUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: translateY(100%);
        }
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes expandLine {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .accent-line {
          animation: expandLine 1s cubic-bezier(0.22, 1, 0.36, 1) 1.1s forwards;
          transform: scaleX(0);
          transform-origin: left;
        }
        .feature-card {
          border-left: 2px solid var(--page-stone);
          transition: border-color 0.4s ease, background 0.4s ease;
        }
        .feature-card:hover {
          border-left-color: var(--page-rose);
          background: rgba(196, 145, 138, 0.04);
        }
      `}</style>

      <div className="min-h-screen">
        {/* Hero Section */}
        <header className="pt-40 pb-24 px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-[family-name:var(--font-headline-alt)] text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight mb-8">
              <span className="hero-line"><span style={{ '--delay': '0.1s' } as React.CSSProperties}>About</span></span>
              <span className="hero-line"><span style={{ '--delay': '0.3s' } as React.CSSProperties} className="text-[var(--page-rose)]">PAGE</span></span>
            </h1>
            <div className="accent-line h-[2px] w-24 bg-[var(--page-rose)] mb-12"></div>
            <p className="font-[family-name:var(--font-body)] text-xl md:text-2xl max-w-2xl leading-relaxed text-muted-foreground" style={{ animation: 'slideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.6s forwards', opacity: 0, transform: 'translateY(100%)' }}>
              A gallery for writing. Not a newsletter service. Not a content feed.
              A space for people who care about how language looks, sounds, and feels.
            </p>
          </div>
        </header>

        {/* Museum Quote */}
        <section ref={addRef} className="fade-section py-20 px-8 bg-[var(--page-stone)] bg-opacity-30">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-[family-name:var(--font-poetry)] text-2xl md:text-3xl leading-relaxed italic">
              Every piece is curated like a little room in a dream-museum: layered, thoughtful,
              and built around voice, not credentials.
            </p>
          </div>
        </section>

        {/* Founding Ethos */}
        <section ref={addRef} className="fade-section py-24 px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_2fr] gap-16 items-start">
            <div>
              <span className="font-[family-name:var(--font-ui)] text-xs tracking-[0.2em] uppercase text-muted-foreground">01</span>
              <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl mt-2 leading-tight">
                The founding ethos
              </h2>
            </div>
            <div className="space-y-6 font-[family-name:var(--font-body)] text-lg leading-relaxed">
              <p>
                Writing deserves a <em className="font-[family-name:var(--font-poetry)]">place</em>, not just a platform.
                Substack flattens every voice into the same email template and takes 10% for the privilege.
                Ghost offers independence but demands technical ability.
              </p>
              <p>
                PAGE sits in neither camp. It's a space where every writer gets a{' '}
                <strong className="text-[var(--page-rose)]">room</strong> — with atmosphere, temperature, visual texture.
                When you visit someone's work, you don't scroll past it in a feed. You walk into it.
              </p>
            </div>
          </div>
        </section>

        {/* Calm Technology */}
        <section ref={addRef} className="fade-section py-24 px-8 border-t border-border">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_2fr] gap-16 items-start">
            <div>
              <span className="font-[family-name:var(--font-ui)] text-xs tracking-[0.2em] uppercase text-muted-foreground">02</span>
              <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl mt-2 leading-tight">
                Calm Technology
              </h2>
            </div>
            <div className="space-y-8 font-[family-name:var(--font-body)] text-lg leading-relaxed">
              <p>
                PAGE is built on the principles of Calm Technology — a design philosophy that
                prioritizes human well-being over engagement.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'No notification badges',
                  'No unread counters',
                  'No guilt emails',
                  'No follower counts',
                  'No trending lists',
                  'No algorithmic feeds',
                ].map((item) => (
                  <div key={item} className="py-3 px-4 border border-border text-sm font-[family-name:var(--font-ui)] text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground">
                Discovery happens through editorial curation, reader-built playlists, and wandering.
                The architecture refuses to create hierarchies of attention.
              </p>
            </div>
          </div>
        </section>

        {/* What Makes PAGE Different */}
        <section ref={addRef} className="fade-section py-24 px-8 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
              <span className="font-[family-name:var(--font-ui)] text-xs tracking-[0.2em] uppercase text-muted-foreground">03</span>
              <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl mt-2 leading-tight">
                What makes PAGE different
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-0">
              {[
                {
                  title: 'Exhibits, not posts',
                  body: 'Writers don\'t publish posts. They open exhibits — curated collections of 1\u201310 pieces, released together with a title and opening note. A mini issue. A chapbook. An event.',
                },
                {
                  title: 'Commonplace books',
                  body: 'Instead of liking a piece, readers pull lines into their own private commonplace book — a personal garden of collected fragments.',
                },
                {
                  title: 'Intimacy metrics',
                  body: 'Writers see how many people collected their lines, how many stayed for more than three minutes. Not vanity metrics — intimacy metrics.',
                },
                {
                  title: 'Gallery spaciousness',
                  body: 'Generous margins. Slow transitions. Full-bleed work. The writing breathes.',
                },
              ].map((card) => (
                <div key={card.title} className="feature-card py-8 px-8 border-b border-border">
                  <h3 className="font-[family-name:var(--font-headline)] text-xl mb-3">{card.title}</h3>
                  <p className="font-[family-name:var(--font-body)] text-base leading-relaxed text-muted-foreground">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Quote */}
        <section ref={addRef} className="fade-section py-32 px-8 bg-[var(--page-charcoal)] text-[var(--page-ivory)]">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-[family-name:var(--font-ui)] text-xs tracking-[0.2em] uppercase opacity-50 mb-8 block">The feeling</span>
            <p className="font-[family-name:var(--font-poetry)] text-2xl md:text-3xl leading-relaxed italic">
              The whole thing should feel less like opening an app and more like walking into
              a room where someone has left a light on for you. The walls are a colour someone
              chose with care. There's a book open on the table. You sit down and you read,
              and nobody is counting how long you stay.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section ref={addRef} className="fade-section py-24 px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-[family-name:var(--font-headline-alt)] text-4xl md:text-5xl mb-8">Open your room</h2>
            <a
              href="/signup"
              className="inline-block px-12 py-5 bg-primary text-primary-foreground hover:bg-[var(--page-rose)] hover:text-[var(--page-charcoal)] transition-all duration-300 font-[family-name:var(--font-ui)] text-sm tracking-[0.15em] uppercase"
            >
              Get Started
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

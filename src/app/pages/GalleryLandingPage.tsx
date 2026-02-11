import { useEffect, useState } from "react";

function SimpleStarfield() {
  // Generate stars with random positions and animation delays
  const stars = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size:
      Math.random() > 0.7
        ? Math.random() * 3 + 2
        : Math.random() * 2.5 + 1,
    opacity: Math.random() * 0.7 + 0.5,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 6,
  }));

  // Generate bright stars with glow
  const brightStars = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 3,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 4,
  }));

  // Generate shooting stars
  const shootingStars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 50 + 10}%`,
    top: `${Math.random() * 50 + 10}%`,
    delay: i * 7 + 3,
  }));

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    >
      {/* Regular twinkling stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute rounded-full animate-twinkle-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: "#ffffff",
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            boxShadow:
              star.size > 2
                ? "0 0 6px rgba(255, 255, 255, 1), 0 0 10px rgba(255, 255, 255, 0.5)"
                : "0 0 3px rgba(255, 255, 255, 0.8)",
          }}
        />
      ))}

      {/* Bright stars with radial glow */}
      {brightStars.map((star) => (
        <div
          key={`bright-${star.id}`}
          className="absolute rounded-full animate-pulse-glow-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: "#ffffff",
            boxShadow:
              "0 0 15px rgba(255, 255, 255, 1), 0 0 25px rgba(255, 255, 255, 0.8), 0 0 35px rgba(255, 255, 255, 0.6)",
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <div
          key={`shooting-${star.id}`}
          className="absolute animate-shooting-star-trail"
          style={{
            left: star.left,
            top: star.top,
            width: "150px",
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 1), transparent)",
            transform: "rotate(-45deg)",
            animationDelay: `${star.delay}s`,
            boxShadow: "0 0 8px rgba(255, 255, 255, 1)",
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle-star {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse-glow-star {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        
        @keyframes shooting-star-trail {
          0% { transform: translateX(-150px) translateY(-150px) rotate(-45deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(500px) translateY(500px) rotate(-45deg); opacity: 0; }
        }
        
        .animate-twinkle-star {
          animation: twinkle-star infinite;
        }
        
        .animate-pulse-glow-star {
          animation: pulse-glow-star infinite;
        }
        
        .animate-shooting-star-trail {
          animation: shooting-star-trail 5s ease-out infinite;
        }
      `}</style>
    </div>
  );
}

function GalleryNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}
      style={{
        background: scrolled
          ? "rgba(8, 9, 13, 0.85)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid rgba(196, 162, 101, 0.15)"
          : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="font-['Playfair_Display'] text-3xl italic tracking-tight hover:text-[#c4a265] transition-colors duration-300"
            style={{
              color: "#c4a265",
              textShadow: "0 0 20px rgba(196, 162, 101, 0.3)",
            }}
          >
            PAGE
          </a>
          <div className="flex items-center gap-8">
            <a
              href="#about"
              className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.25em] transition-colors duration-300"
              style={{ color: "#f5f0e8" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#c4a265")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#f5f0e8")
              }
            >
              About
            </a>
            <a
              href="#collection"
              className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.25em] transition-colors duration-300"
              style={{ color: "#f5f0e8" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#c4a265")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#f5f0e8")
              }
            >
              Collection
            </a>
            <a
              href="/exhibits"
              className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.25em] transition-colors duration-300"
              style={{ color: "#f5f0e8" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#c4a265")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#f5f0e8")
              }
            >
              Exhibits
            </a>
            <a
              href="/garden"
              className="group flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-300"
              style={{
                border: "1px solid rgba(196, 162, 101, 0.4)",
              }}
            >
              <span
                className="text-sm"
                style={{
                  filter:
                    "drop-shadow(0 0 6px rgba(196, 162, 101, 0.5))",
                }}
              >
                🌙
              </span>
              <span
                className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.25em] transition-colors"
                style={{ color: "#c4a265" }}
              >
                Garden
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function GalleryFooter() {
  return (
    <footer
      className="relative z-10 py-16"
      style={{
        borderTop: "1px solid rgba(196, 162, 101, 0.2)",
        background: "rgba(8, 9, 13, 0.6)",
      }}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3
              className="font-['Playfair_Display'] text-2xl italic mb-4"
              style={{ color: "#c4a265" }}
            >
              PAGE
            </h3>
            <p
              className="font-['Cormorant_Garamond'] text-[15px] leading-relaxed"
              style={{ color: "rgba(245, 240, 232, 0.6)" }}
            >
              A dual literary platform combining curated gallery
              exhibitions with community writing spaces.
            </p>
          </div>

          <div>
            <h4
              className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.25em] mb-4"
              style={{ color: "rgba(245, 240, 232, 0.7)" }}
            >
              Gallery
            </h4>
            <div className="space-y-2">
              <a
                href="#collection"
                className="block font-['Cormorant_Garamond'] text-[15px] transition-colors"
                style={{ color: "rgba(245, 240, 232, 0.6)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#f5f0e8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    "rgba(245, 240, 232, 0.6)")
                }
              >
                Current Collection
              </a>
              <a
                href="#about"
                className="block font-['Cormorant_Garamond'] text-[15px] transition-colors"
                style={{ color: "rgba(245, 240, 232, 0.6)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#f5f0e8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    "rgba(245, 240, 232, 0.6)")
                }
              >
                About PAGE
              </a>
            </div>
          </div>

          <div>
            <h4
              className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.25em] mb-4"
              style={{ color: "rgba(245, 240, 232, 0.7)" }}
            >
              Connect
            </h4>
            <p
              className="font-['Cormorant_Garamond'] text-[15px]"
              style={{ color: "rgba(245, 240, 232, 0.6)" }}
            >
              EVERYWHERE AND NOWHERE, BABY
            </p>
          </div>
        </div>

        <div
          className="pt-8 text-center"
          style={{
            borderTop: "1px solid rgba(196, 162, 101, 0.15)",
          }}
        >
          <p
            className="font-['Cormorant_Garamond'] text-[11px]"
            style={{ color: "rgba(245, 240, 232, 0.4)" }}
          >
            © {new Date().getFullYear()} PAGE. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function GalleryLandingPage() {
  useEffect(() => {
    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-reveal-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    // Observe all elements with scroll-reveal class
    setTimeout(() => {
      document
        .querySelectorAll(".scroll-reveal")
        .forEach((el) => {
          observer.observe(el);
        });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #0a1628 0%, #132a45 50%, #1a3a5a 100%)",
      }}
    >
      <style>{`
        /* Scroll reveal animations */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .scroll-reveal-delay-1 {
          transition-delay: 0.15s;
        }
        
        .scroll-reveal-delay-2 {
          transition-delay: 0.3s;
        }
        
        .scroll-reveal-delay-3 {
          transition-delay: 0.45s;
        }
        
        .scroll-reveal-delay-4 {
          transition-delay: 0.6s;
        }

        /* Golden shimmer animation for accent lines */
        @keyframes shimmer {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.4; }
        }

        .shimmer-line {
          animation: shimmer 4s ease-in-out infinite;
        }

        /* Spotlight effect */
        .spotlight {
          background: radial-gradient(ellipse at center, rgba(196, 162, 101, 0.08) 0%, transparent 70%);
        }

        /* Museum card hover glow */
        .museum-card {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .museum-card:hover {
          border-color: rgba(196, 162, 101, 0.6) !important;
          box-shadow: 0 0 40px rgba(196, 162, 101, 0.15), 0 20px 60px rgba(0, 0, 0, 0.4) !important;
        }

        /* Fade in up animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Parallax subtle effect */
        .parallax-bg {
          transform: translateZ(0);
          will-change: transform;
        }
      `}</style>

      {/* Film grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Starfield */}
      <SimpleStarfield />

      <GalleryNav />

      {/* Hero Section - Monumental Museum Entrance */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-8 pt-32 pb-20">
        {/* Spotlight effect behind title */}
        <div
          className="absolute inset-0 spotlight"
          style={{ pointerEvents: "none" }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1
            className="font-['Playfair_Display'] italic mb-8 leading-[0.95] fade-in-up"
            style={{
              fontSize: "clamp(4rem, 10vw, 7rem)",
              color: "#f5f0e8",
              letterSpacing: "0.05em",
              textShadow: "0 0 40px rgba(196, 162, 101, 0.3)",
            }}
          >
            A Room for Writing
          </h1>
          <p
            className="font-['Cormorant_Garamond'] text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-12 fade-in-up"
            style={{
              color: "rgba(196, 162, 101, 0.8)",
              animationDelay: "0.2s",
            }}
          >
            You don't submit. You don't query. You just write —
            and the editors come to you.
          </p>
          <div
            className="flex gap-6 justify-center fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#collection"
              className="group px-8 py-4 rounded-sm transition-all duration-300 cursor-pointer relative"
              style={{
                border: "1px solid rgba(196, 162, 101, 0.3)",
                background: "rgba(255, 255, 255, 0.03)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(196, 162, 101, 0.6)";
                e.currentTarget.style.background =
                  "rgba(255, 255, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(196, 162, 101, 0.3)";
                e.currentTarget.style.background =
                  "rgba(255, 255, 255, 0.03)";
              }}
            >
              <span
                className="font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.3em]"
                style={{ color: "#f5f0e8" }}
              >
                View Collection
              </span>
              <div
                className="absolute bottom-0 left-1/2 h-[1px] w-0 group-hover:w-3/4 transition-all duration-500"
                style={{
                  background: "#c4a265",
                  transform: "translateX(-50%)",
                }}
              />
            </a>
            <a
              href="#about"
              className="group px-8 py-4 rounded-sm transition-all duration-300 cursor-pointer relative"
              style={{
                border: "1px solid rgba(245, 240, 232, 0.2)",
                background: "rgba(255, 255, 255, 0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(245, 240, 232, 0.4)";
                e.currentTarget.style.background =
                  "rgba(255, 255, 255, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(245, 240, 232, 0.2)";
                e.currentTarget.style.background =
                  "rgba(255, 255, 255, 0.02)";
              }}
            >
              <span
                className="font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.3em]"
                style={{ color: "rgba(245, 240, 232, 0.7)" }}
              >
                About the Gallery
              </span>
              <div
                className="absolute bottom-0 left-1/2 h-[1px] w-0 group-hover:w-3/4 transition-all duration-500"
                style={{
                  background: "#f5f0e8",
                  transform: "translateX(-50%)",
                }}
              />
            </a>
          </div>
        </div>
      </section>

      {/* Golden divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <div
          className="h-[1px] shimmer-line"
          style={{ background: "#c4a265" }}
        />
      </div>

      {/* Two Doors Section - Museum Exhibition Rooms */}
      <section className="relative z-10 py-32 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 scroll-reveal">
            <h2
              className="font-['Playfair_Display'] text-5xl italic mb-4"
              style={{
                color: "#f5f0e8",
                textShadow:
                  "0 0 30px rgba(196, 162, 101, 0.25)",
              }}
            >
              The Two Doors
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Gallery Card - Framed Artwork Style */}
            <a
              href="#collection"
              className="scroll-reveal museum-card group block relative p-10 rounded-sm"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(196, 162, 101, 0.25)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Content */}
              <div className="relative">
                <div className="mb-6">
                  <span
                    className="font-['Cormorant_Garamond'] text-[10px] uppercase tracking-[0.3em]"
                    style={{
                      color: "rgba(196, 162, 101, 0.6)",
                    }}
                  >
                    Curated Journal
                  </span>
                </div>

                <h3
                  className="font-['Playfair_Display'] text-4xl italic mb-5 leading-tight transition-colors duration-500"
                  style={{ color: "#f5f0e8" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c4a265")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#f5f0e8")
                  }
                >
                  The Gallery
                </h3>

                <p
                  className="font-['Cormorant_Garamond'] text-[15px] leading-relaxed mb-8"
                  style={{
                    color: "rgba(245, 240, 232, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Where work arrives because an editor noticed
                  it. Not because a writer applied. Every piece
                  here was found growing in someone's Garden,
                  and the editor who found it couldn't leave it
                  alone.
                </p>

                {/* Features list with golden bullets */}
                <div className="space-y-3 mb-8">
                  {[
                    "Work goes live the moment an editor selects it",
                    "No submissions. No slush pile.",
                    "Writers are paid when their work is selected",
                    "Editorially curated by attention, not application",
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="text-xs mt-1"
                        style={{ color: "#c4a265" }}
                      >
                        ✦
                      </span>
                      <span
                        className="font-['Cormorant_Garamond'] text-[14px]"
                        style={{
                          color: "rgba(245, 240, 232, 0.5)",
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Arrow indicator */}
                <div
                  className="flex items-center gap-2 font-['Cormorant_Garamond'] text-[12px] uppercase tracking-[0.2em] group-hover:gap-3 transition-all"
                  style={{ color: "#c4a265" }}
                >
                  <span>Explore</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </a>

            {/* Garden Card - Framed Artwork Style */}
            <a
              href="/garden"
              className="scroll-reveal scroll-reveal-delay-1 museum-card group block relative p-10 rounded-sm"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(196, 162, 101, 0.25)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Content */}
              <div className="relative">
                <div className="mb-6">
                  <span
                    className="font-['Cormorant_Garamond'] text-[10px] uppercase tracking-[0.3em]"
                    style={{
                      color: "rgba(196, 162, 101, 0.6)",
                    }}
                  >
                    Writing Community
                  </span>
                </div>

                <h3
                  className="font-['Playfair_Display'] text-4xl italic mb-5 leading-tight transition-colors duration-500"
                  style={{ color: "#f5f0e8" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c4a265")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#f5f0e8")
                  }
                >
                  The Garden
                </h3>

                <p
                  className="font-['Cormorant_Garamond'] text-[15px] leading-relaxed mb-8"
                  style={{
                    color: "rgba(245, 240, 232, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Where you write without thinking about who's
                  watching. A private studio for drafts,
                  fragments, false starts, and the sentence
                  you'll finish next month. The only audience is
                  the page — until an editor quietly walks
                  through.
                </p>

                {/* Features list with flower bullets */}
                <div className="space-y-3 mb-8">
                  {[
                    "Your own writing space",
                    "Drafts move through stages: seed, sprout, bloom",
                    "Small circles of other writers, not followers",
                    "Editors browse Gardens. You never have to ask.",
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="text-xs mt-1"
                        style={{ color: "#c4a265" }}
                      >
                        ✿
                      </span>
                      <span
                        className="font-['Cormorant_Garamond'] text-[14px]"
                        style={{
                          color: "rgba(245, 240, 232, 0.5)",
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Arrow indicator */}
                <div
                  className="flex items-center gap-2 font-['Cormorant_Garamond'] text-[12px] uppercase tracking-[0.2em] group-hover:gap-3 transition-all"
                  style={{ color: "#c4a265" }}
                >
                  <span>Enter</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Golden divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <div
          className="h-[1px] shimmer-line"
          style={{ background: "#c4a265" }}
        />
      </div>

      {/* Current Exhibition - Museum Hall */}
      <section
        id="collection"
        className="relative z-10 py-32 px-8"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 scroll-reveal">
            {/* Decorative title with lines */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div
                className="h-[1px] w-20 shimmer-line"
                style={{ background: "#c4a265" }}
              />
              <p
                className="font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.3em]"
                style={{ color: "#c4a265" }}
              >
                Current Exhibition
              </p>
              <div
                className="h-[1px] w-20 shimmer-line"
                style={{ background: "#c4a265" }}
              />
            </div>
            <h2
              className="font-['Playfair_Display'] text-5xl italic mb-6"
              style={{
                color: "#f5f0e8",
                textShadow:
                  "0 0 30px rgba(196, 162, 101, 0.25)",
              }}
            >
              Featured Works
            </h2>
            <p
              className="font-['Cormorant_Garamond'] text-xl italic leading-relaxed max-w-3xl mx-auto"
              style={{
                color: "rgba(245, 240, 232, 0.6)",
                lineHeight: "1.8",
              }}
            >
              Found in the Gardens. Chosen because they wouldn't
              let go.
            </p>
          </div>

          <div className="space-y-8 scroll-reveal scroll-reveal-delay-1">
            {/* Coming Soon - Blank Canvas Style */}
            <div
              className="p-12 rounded-sm text-center transition-all duration-500"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "2px dashed rgba(196, 162, 101, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              }}
            >
              <p
                className="font-['Cormorant_Garamond'] text-[10px] uppercase tracking-[0.3em] mb-3"
                style={{ color: "rgba(196, 162, 101, 0.5)" }}
              >
                Poetry
              </p>
              <h3
                className="font-['Playfair_Display'] text-3xl italic mb-4"
                style={{ color: "rgba(245, 240, 232, 0.7)" }}
              >
                Coming Soon
              </h3>
              <p
                className="font-['Cormorant_Garamond'] text-[15px] leading-relaxed max-w-2xl mx-auto"
                style={{
                  color: "rgba(245, 240, 232, 0.5)",
                  lineHeight: "1.8",
                }}
              >
                Editors are reading the Gardens. When a piece
                stops them, they publish it. The first works
                will appear here soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Golden divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <div
          className="h-[1px] shimmer-line"
          style={{ background: "#c4a265" }}
        />
      </div>

      {/* How It Works - Museum Room Numbers */}
      <section className="relative z-10 py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24 scroll-reveal">
            <h2
              className="font-['Playfair_Display'] text-5xl italic mb-6"
              style={{
                color: "#f5f0e8",
                textShadow:
                  "0 0 30px rgba(196, 162, 101, 0.25)",
              }}
            >
              How It Works
            </h2>
            <p
              className="font-['Playfair_Display'] text-2xl italic font-semibold"
              style={{
                color: "rgba(245, 240, 232, 0.7)",
                letterSpacing: "0.02em",
              }}
            >
              You write. We pay attention.
            </p>
          </div>

          <div className="space-y-20 relative">
            {/* Connecting vertical line */}
            <div
              className="absolute left-6 top-6 bottom-6 w-[1px]"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(196, 162, 101, 0.3), transparent)",
              }}
            />

            {/* Step 1 */}
            <div className="flex gap-8 items-start scroll-reveal">
              <div
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full relative z-10"
                style={{
                  background: "rgba(8, 9, 13, 1)",
                  border: "2px solid #c4a265",
                  boxShadow:
                    "0 0 20px rgba(196, 162, 101, 0.3)",
                }}
              >
                <span
                  className="font-['Playfair_Display'] text-lg"
                  style={{ color: "#c4a265" }}
                >
                  1
                </span>
              </div>
              <div className="pt-1">
                <h3
                  className="font-['Playfair_Display'] text-3xl italic mb-4"
                  style={{ color: "#f5f0e8" }}
                >
                  Plant
                </h3>
                <p
                  className="font-['Cormorant_Garamond'] text-[16px] leading-relaxed"
                  style={{
                    color: "rgba(245, 240, 232, 0.6)",
                    lineHeight: "1.9",
                    letterSpacing: "0.01em",
                  }}
                >
                  Open your Garden. Write anything — a line, a
                  draft, a fragment you're not sure about. Let
                  it sit. Come back. Revise it or abandon it.
                  Nobody is timing you. Nothing is due.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 items-start scroll-reveal scroll-reveal-delay-1">
              <div
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full relative z-10"
                style={{
                  background: "rgba(8, 9, 13, 1)",
                  border: "2px solid #c4a265",
                  boxShadow:
                    "0 0 20px rgba(196, 162, 101, 0.3)",
                }}
              >
                <span
                  className="font-['Playfair_Display'] text-lg"
                  style={{ color: "#c4a265" }}
                >
                  2
                </span>
              </div>
              <div className="pt-1">
                <h3
                  className="font-['Playfair_Display'] text-3xl italic mb-4"
                  style={{ color: "#f5f0e8" }}
                >
                  Editors Walk Through
                </h3>
                <p
                  className="font-['Cormorant_Garamond'] text-[16px] leading-relaxed"
                  style={{
                    color: "rgba(245, 240, 232, 0.6)",
                    lineHeight: "1.9",
                    letterSpacing: "0.01em",
                  }}
                >
                  Our editorial team reads the Gardens. Not
                  everything. Not on a schedule. But slowly,
                  carefully, the way you'd move through a
                  bookshop where every spine matters. When
                  something stops them, they mark it.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8 items-start scroll-reveal scroll-reveal-delay-2">
              <div
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full relative z-10"
                style={{
                  background: "rgba(8, 9, 13, 1)",
                  border: "2px solid #c4a265",
                  boxShadow:
                    "0 0 20px rgba(196, 162, 101, 0.3)",
                }}
              >
                <span
                  className="font-['Playfair_Display'] text-lg"
                  style={{ color: "#c4a265" }}
                >
                  3
                </span>
              </div>
              <div className="pt-1">
                <h3
                  className="font-['Playfair_Display'] text-3xl italic mb-4"
                  style={{ color: "#f5f0e8" }}
                >
                  A Knock on the Door
                </h3>
                <p
                  className="font-['Cormorant_Garamond'] text-[16px] leading-relaxed"
                  style={{
                    color: "rgba(245, 240, 232, 0.6)",
                    lineHeight: "1.9",
                    letterSpacing: "0.01em",
                  }}
                >
                  If an editor wants to feature your work,
                  you'll receive a Replant Request — an
                  invitation, not a demand. You can accept,
                  revise first, or decline. If you accept, the
                  piece moves into the Gallery. And we pay you
                  for it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Golden divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <div
          className="h-[1px] shimmer-line"
          style={{ background: "#c4a265" }}
        />
      </div>

      {/* Why We Do This - Museum Wall Text Panel */}
      <section id="about" className="relative z-10 py-32 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2
              className="font-['Playfair_Display'] text-5xl italic mb-6"
              style={{
                color: "#f5f0e8",
                textShadow:
                  "0 0 30px rgba(196, 162, 101, 0.25)",
              }}
            >
              Why We Do This
            </h2>
          </div>

          <div
            className="space-y-8 font-['Cormorant_Garamond'] text-[17px] scroll-reveal scroll-reveal-delay-1"
            style={{
              color: "rgba(245, 240, 232, 0.6)",
              lineHeight: "1.9",
              letterSpacing: "0.01em",
            }}
          >
            <p
              className="font-['Playfair_Display'] text-[20px] font-semibold italic"
              style={{
                color: "rgba(245, 240, 232, 0.85)",
                lineHeight: "1.7",
              }}
            >
              Every literary journal in history has asked
              writers to come to it. We go to the writers.
            </p>
            <p>
              The traditional model works like this: you write
              something, you research which journals might want
              it, you format it to their specifications, you
              submit it, you wait four months, you get a form
              rejection, and you do it again. The writing is
              almost beside the point. The <em>applying</em> is
              the job.
            </p>
            <p>
              We thought: what if the writing were the only job?
            </p>
            <p>
              What if you just wrote — in a space built for
              writing — and the people whose work it is to find
              good writing actually came and found it?
            </p>
            <p>
              That's the Gallery. Editors read Gardens the way
              gallery owners visit studios. They aren't sorting
              through a pile. They're walking through rooms
              where people are working, and noticing what they
              notice.
            </p>
            <p>
              The writer never submits. The writer never formats
              a cover letter. The writer never wonders if the
              font was wrong or the bio was too long. The writer
              just writes.
            </p>
            <p
              className="font-semibold pl-6"
              style={{
                color: "rgba(245, 240, 232, 0.8)",
                borderLeft: "3px solid #c4a265",
              }}
            >
              And if something they wrote is the kind of thing
              that stops a person mid-sentence — the kind of
              thing that makes an editor close their laptop and
              sit with it for a minute — then that editor sends
              a Replant Request, and the piece moves from the
              Garden to the Gallery wall.
            </p>
            <p>
              That's it. That's the whole model. You tend your
              Garden. We tend our attention.
            </p>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}
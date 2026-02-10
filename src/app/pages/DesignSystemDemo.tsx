import { Sprout, Flower2, Sparkles, Heart, ArrowRight } from 'lucide-react';

/**
 * Design System Demonstration
 * Shows the narrative design system in action with micro-interactions
 */

export function DesignSystemDemo() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--page-parchment)' }}>
      <div className="max-w-4xl mx-auto px-8 py-24">
        
        {/* Header */}
        <div className="mb-16 text-center fade-grow-in">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3" style={{
            background: 'var(--quiet-murmur)',
            borderRadius: 'var(--radius-full)',
            border: '2px solid var(--color-sprout)'
          }}>
            <Sprout className="w-6 h-6" style={{ color: 'var(--color-sprout)' }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              color: 'var(--color-earth-dark)',
              fontStyle: 'italic'
            }}>
              The Page Design System
            </span>
          </div>
          
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-6xl)',
            lineHeight: 'var(--leading-tight)',
            color: 'var(--color-earth-dark)',
            fontStyle: 'italic',
            marginBottom: 'var(--space-6)',
            letterSpacing: 'var(--tracking-tight)'
          }}>
            A Literary Garden
          </h1>
          
          <p style={{
            fontFamily: 'var(--font-literary)',
            fontSize: 'var(--text-xl)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-earth-medium)',
            maxWidth: '42rem',
            margin: '0 auto'
          }}>
            Where ideas grow in seasons, not feeds. Every interaction has weight,
            every color knows its emotional purpose.
          </p>
        </div>

        {/* Color Palette */}
        <section className="mb-20 fade-grow-in" style={{ animationDelay: '100ms' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--color-earth-dark)',
            fontStyle: 'italic',
            marginBottom: 'var(--space-8)'
          }}>
            Color System — Emotional Roles
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Earth Colors */}
            <div className="text-center">
              <div style={{
                width: '100%',
                height: '120px',
                background: 'var(--color-earth-dark)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-3)'
              }} className="hover-lift"></div>
              <p style={{
                fontFamily: 'var(--font-journal)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-earth-medium)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wider)'
              }}>Deep Soil</p>
            </div>
            
            <div className="text-center">
              <div style={{
                width: '100%',
                height: '120px',
                background: 'var(--color-earth-medium)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-3)'
              }} className="hover-lift"></div>
              <p style={{
                fontFamily: 'var(--font-journal)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-earth-medium)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wider)'
              }}>Rich Loam</p>
            </div>
            
            <div className="text-center">
              <div style={{
                width: '100%',
                height: '120px',
                background: 'var(--color-earth-light)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-3)',
                border: '2px solid var(--color-earth-light)'
              }} className="hover-lift"></div>
              <p style={{
                fontFamily: 'var(--font-journal)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-earth-medium)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wider)'
              }}>Sandy Paths</p>
            </div>
            
            {/* Growth States */}
            <div className="text-center">
              <div style={{
                width: '100%',
                height: '120px',
                background: 'var(--state-seed)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-3)'
              }} className="hover-lift"></div>
              <p style={{
                fontFamily: 'var(--font-journal)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-earth-medium)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wider)'
              }}>Seed Gold</p>
            </div>
            
            <div className="text-center">
              <div style={{
                width: '100%',
                height: '120px',
                background: 'var(--state-sprout)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-3)'
              }} className="hover-lift"></div>
              <p style={{
                fontFamily: 'var(--font-journal)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-earth-medium)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wider)'
              }}>Sprout Green</p>
            </div>
            
            <div className="text-center">
              <div style={{
                width: '100%',
                height: '120px',
                background: 'var(--state-bloom)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-3)'
              }} className="hover-lift"></div>
              <p style={{
                fontFamily: 'var(--font-journal)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-earth-medium)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wider)'
              }}>Bloom Red</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20 fade-grow-in" style={{ animationDelay: '200ms' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--color-earth-dark)',
            fontStyle: 'italic',
            marginBottom: 'var(--space-8)'
          }}>
            Typography — Two Voices
          </h2>
          
          <div style={{
            background: 'var(--surface-canvas)',
            padding: 'var(--space-8)',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--color-earth-light)',
            marginBottom: 'var(--space-6)'
          }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-4xl)',
              lineHeight: 'var(--leading-tight)',
              color: 'var(--color-earth-dark)',
              fontStyle: 'italic',
              marginBottom: 'var(--space-4)'
            }}>
              The Display Voice
            </p>
            <p style={{
              fontFamily: 'var(--font-journal)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-earth-medium)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-widest)'
            }}>
              Cardo — Italic-forward, Poetic, Editorial
            </p>
          </div>
          
          <div style={{
            background: 'var(--surface-canvas)',
            padding: 'var(--space-8)',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--color-earth-light)',
            marginBottom: 'var(--space-6)'
          }}>
            <p style={{
              fontFamily: 'var(--font-literary)',
              fontSize: 'var(--text-xl)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-earth-dark)',
              marginBottom: 'var(--space-4)'
            }}>
              The Literary Voice
            </p>
            <p style={{
              fontFamily: 'var(--font-journal)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-earth-medium)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-widest)'
            }}>
              Libre Baskerville — Readable, Book-like, Contemplative
            </p>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-20 fade-grow-in" style={{ animationDelay: '300ms' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--color-earth-dark)',
            fontStyle: 'italic',
            marginBottom: 'var(--space-8)'
          }}>
            Buttons — Growth States
          </h2>
          
          <div className="flex gap-4 flex-wrap">
            <button className="btn-primary interactive-base" style={{
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-base)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              <Sprout className="w-5 h-5 icon-sprout" />
              <span>Primary Action</span>
            </button>
            
            <button className="btn-secondary interactive-base" style={{
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-base)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              <Flower2 className="w-5 h-5 icon-sprout" />
              <span>Secondary Action</span>
            </button>
            
            <button style={{
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-base)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              background: 'var(--state-bloom)',
              color: 'var(--surface-canvas)',
              border: '2px solid var(--state-bloom)',
              transition: 'all var(--timing-grow) var(--ease-organic)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <Heart className="w-5 h-5 icon-sprout" />
              <span>Bloom Action</span>
            </button>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-20 fade-grow-in" style={{ animationDelay: '400ms' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--color-earth-dark)',
            fontStyle: 'italic',
            marginBottom: 'var(--space-8)'
          }}>
            Cards — They Breathe
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-base" style={{ padding: 'var(--space-8)' }}>
              <Sparkles className="w-8 h-8 mb-4 icon-sprout" style={{ color: 'var(--state-seed)' }} />
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                color: 'var(--color-earth-dark)',
                marginBottom: 'var(--space-3)',
                fontStyle: 'italic'
              }}>
                Seed Card
              </h3>
              <p style={{
                fontFamily: 'var(--font-literary)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-relaxed)',
                color: 'var(--color-earth-medium)'
              }}>
                Hover over me to see the gentle lift and shadow bloom
              </p>
            </div>
            
            <div className="card-base" style={{ padding: 'var(--space-8)' }}>
              <Sprout className="w-8 h-8 mb-4 icon-sprout" style={{ color: 'var(--state-sprout)' }} />
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                color: 'var(--color-earth-dark)',
                marginBottom: 'var(--space-3)',
                fontStyle: 'italic'
              }}>
                Sprout Card
              </h3>
              <p style={{
                fontFamily: 'var(--font-literary)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-relaxed)',
                color: 'var(--color-earth-medium)'
              }}>
                Watch how the border changes color as it grows toward you
              </p>
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="mb-20 fade-grow-in" style={{ animationDelay: '500ms' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--color-earth-dark)',
            fontStyle: 'italic',
            marginBottom: 'var(--space-8)'
          }}>
            Tags — Seeds of Meaning
          </h2>
          
          <div className="flex gap-3 flex-wrap">
            <span className="tag-base">grief</span>
            <span className="tag-base">mothers</span>
            <span className="tag-base">sea</span>
            <span className="tag-base">childhood</span>
            <span className="tag-base">loss</span>
            <span className="tag-base">belonging</span>
          </div>
        </section>

        {/* Links */}
        <section className="mb-20 fade-grow-in" style={{ animationDelay: '600ms' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--color-earth-dark)',
            fontStyle: 'italic',
            marginBottom: 'var(--space-8)'
          }}>
            Links — Reveal Themselves
          </h2>
          
          <div className="space-y-4">
            <p style={{
              fontFamily: 'var(--font-literary)',
              fontSize: 'var(--text-lg)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-earth-dark)'
            }}>
              Hover over these links to watch the{' '}
              <a href="#" className="link-grow" style={{
                color: 'var(--color-sprout)',
                fontWeight: '500'
              }}>
                underline grow slowly
              </a>
              {' '}from left to right, like a{' '}
              <a href="#" className="link-grow" style={{
                color: 'var(--color-bloom)',
                fontWeight: '500'
              }}>
                vine reaching toward light
              </a>.
            </p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="fade-grow-in" style={{ animationDelay: '700ms' }}>
          <div style={{
            background: 'var(--surface-canvas)',
            padding: 'var(--space-12)',
            borderRadius: 'var(--radius-2xl)',
            border: '2px solid var(--color-earth-light)',
            borderLeft: '4px solid var(--color-sprout)'
          }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              lineHeight: 'var(--leading-snug)',
              color: 'var(--color-earth-dark)',
              fontStyle: 'italic',
              marginBottom: 'var(--space-6)'
            }}>
              "Every interaction must have weight, every color must know its emotional purpose,
              every animation must suggest organic growth rather than mechanical efficiency."
            </p>
            <p style={{
              fontFamily: 'var(--font-journal)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-earth-medium)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-widest)'
            }}>
              — Design Philosophy
            </p>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-16 text-center">
          <a href="/studio" className="link-grow inline-flex items-center gap-2" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            color: 'var(--color-sprout)',
            fontStyle: 'italic'
          }}>
            <span>Return to Your Garden</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

      </div>
    </div>
  );
}

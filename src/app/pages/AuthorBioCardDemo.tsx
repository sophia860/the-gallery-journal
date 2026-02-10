import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { AuthorBioCard } from '../components/AuthorBioCard';

// This is a demo page showing different AuthorBioCard variants
export function AuthorBioCardDemo() {
  const sampleAuthor = {
    authorId: 'author123',
    authorName: 'Elena Rodriguez',
    authorBio: 'Elena Rodriguez is a poet and essayist whose work explores themes of memory, place, and belonging. Her writing has appeared in The Paris Review, Granta, and Best American Poetry. She holds an MFA from the Iowa Writers\' Workshop.',
    socialLinks: [
      { type: 'website' as const, url: 'https://elenarodriguez.com', label: 'Website' },
      { type: 'twitter' as const, url: 'https://twitter.com/elenarodriguez', label: 'Twitter' },
      { type: 'instagram' as const, url: 'https://instagram.com/elenarodriguez', label: 'Instagram' },
    ],
    workCount: 24,
  };

  const samplePoem = `The Weight of Winter

The snow falls like memory,
soft and relentless,
covering everything we tried to forget.

I watch from the window
as the world turns white,
erasing the paths we made
last summer.

Some things are meant
to be buried,
to rest beneath layers
of cold and quiet
until spring decides
what deserves
to bloom again.`;

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <GalleryNav />

      <div className="pt-32 pb-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-['Cardo'] text-5xl text-[#2C1810] mb-4 italic text-center">
            AuthorBioCard Component Demo
          </h1>
          <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] text-center mb-16">
            Three variants for different contexts
          </p>

          {/* Default Variant */}
          <section className="mb-16">
            <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
              Default Variant
            </h2>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-6">
              Full-featured card with gradient background, social links, and prominent CTA. Best for Collection pages or standalone author pages.
            </p>
            <AuthorBioCard {...sampleAuthor} />
          </section>

          {/* Compact Variant */}
          <section className="mb-16">
            <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
              Compact Variant
            </h2>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-6">
              Smaller card with white background. Best for sidebar or secondary placements.
            </p>
            <div className="max-w-md">
              <AuthorBioCard {...sampleAuthor} variant="compact" />
            </div>
          </section>

          {/* Inline Variant */}
          <section className="mb-16">
            <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
              Inline Variant
            </h2>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-6">
              Minimal inline card with left border accent. Best for after individual poems/essays.
            </p>

            {/* Example: Poem with inline author bio */}
            <div className="max-w-3xl">
              <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-12 mb-6">
                <h3 className="font-['Cardo'] text-4xl text-[#2C1810] mb-8 text-center">
                  The Weight of Winter
                </h3>
                <div className="font-['Libre_Baskerville'] text-lg text-[#2C1810] leading-loose whitespace-pre-wrap">
                  {samplePoem}
                </div>
              </div>
              
              <AuthorBioCard {...sampleAuthor} variant="inline" />
            </div>
          </section>

          {/* Without Photo */}
          <section className="mb-16">
            <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
              Without Photo (Default Avatar)
            </h2>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-6">
              Shows gradient placeholder with user icon when no photo is provided.
            </p>
            <div className="max-w-2xl">
              <AuthorBioCard
                authorId="author456"
                authorName="Marcus Chen"
                authorBio="Marcus Chen is a fiction writer exploring themes of identity and diaspora. His debut novel was longlisted for the National Book Award."
                variant="compact"
              />
            </div>
          </section>

          {/* Minimal - No Links */}
          <section className="mb-16">
            <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
              Minimal (No Social Links)
            </h2>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-6">
              Clean version without social links, just name, bio, and profile link.
            </p>
            <AuthorBioCard
              authorId="author789"
              authorName="Amara Johnson"
              authorBio="Amara Johnson writes essays about culture, family, and the everyday. Her work has been featured in The New Yorker, The Atlantic, and Best American Essays 2025."
              workCount={18}
            />
          </section>

          {/* Usage Examples */}
          <section className="bg-white border-2 border-[#E0D8D0] rounded-lg p-8">
            <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-6">
              Usage Examples
            </h2>
            <div className="space-y-6 font-['Courier_New'] text-sm">
              <div>
                <h3 className="text-[#E11D48] uppercase tracking-wider mb-2">Default Variant</h3>
                <pre className="bg-[#F5F0EB] p-4 rounded overflow-x-auto text-xs">
{`<AuthorBioCard
  authorId="author123"
  authorName="Elena Rodriguez"
  authorBio="Writer and poet exploring memory and place..."
  socialLinks={[
    { type: 'website', url: 'https://...' },
    { type: 'twitter', url: 'https://...' }
  ]}
  workCount={24}
/>`}
                </pre>
              </div>

              <div>
                <h3 className="text-[#E11D48] uppercase tracking-wider mb-2">Compact Variant</h3>
                <pre className="bg-[#F5F0EB] p-4 rounded overflow-x-auto text-xs">
{`<AuthorBioCard
  authorId="author123"
  authorName="Elena Rodriguez"
  authorBio="Writer and poet..."
  variant="compact"
/>`}
                </pre>
              </div>

              <div>
                <h3 className="text-[#E11D48] uppercase tracking-wider mb-2">Inline Variant</h3>
                <pre className="bg-[#F5F0EB] p-4 rounded overflow-x-auto text-xs">
{`<AuthorBioCard
  authorId="author123"
  authorName="Elena Rodriguez"
  authorBio="Writer and poet..."
  variant="inline"
/>`}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div>

      <GalleryFooter />
    </div>
  );
}

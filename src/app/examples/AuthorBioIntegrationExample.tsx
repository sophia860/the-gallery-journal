import { AuthorBioCard } from '../components/AuthorBioCard';

/**
 * INTEGRATION EXAMPLES FOR AuthorBioCard
 * 
 * This file shows how to integrate the AuthorBioCard component
 * into different pages and contexts.
 */

// Example 1: After a poem on a Collection page
export function PoemWithAuthorBio() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* The Poem */}
      <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-12 mb-8">
        <div className="text-center mb-8">
          <span className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
            Wall 01
          </span>
        </div>
        <h2 className="font-['Cardo'] text-4xl text-[#2C1810] mb-8 text-center">
          The Weight of Winter
        </h2>
        <div className="font-['Libre_Baskerville'] text-lg text-[#2C1810] leading-loose whitespace-pre-wrap">
{`The snow falls like memory,
soft and relentless,
covering everything we tried to forget.

I watch from the window
as the world turns white,
erasing the paths we made
last summer.`}
        </div>
      </div>

      {/* Author Bio - Inline variant flows naturally after the poem */}
      <AuthorBioCard
        authorId="elena-rodriguez"
        authorName="Elena Rodriguez"
        authorBio="Elena Rodriguez is a poet whose work explores themes of memory, place, and belonging. Her writing has appeared in The Paris Review and Best American Poetry."
        variant="inline"
      />
    </div>
  );
}

// Example 2: On a Writer's Profile/Room page
export function WriterProfileWithBio() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Featured Bio Card - Default variant */}
      <AuthorBioCard
        authorId="elena-rodriguez"
        authorName="Elena Rodriguez"
        authorBio="Elena Rodriguez is a poet and essayist whose work explores themes of memory, place, and belonging. Her writing has appeared in The Paris Review, Granta, and Best American Poetry. She holds an MFA from the Iowa Writers' Workshop and teaches creative writing at Columbia University."
        socialLinks={[
          { type: 'website', url: 'https://elenarodriguez.com' },
          { type: 'twitter', url: 'https://twitter.com/elenarodriguez' },
          { type: 'instagram', url: 'https://instagram.com/elenarodriguez' },
          { type: 'email', url: 'mailto:elena@email.com' },
        ]}
        workCount={24}
      />

      {/* List of works would go here */}
      <div className="grid gap-6">
        {/* Work items... */}
      </div>
    </div>
  );
}

// Example 3: In a sidebar on an exhibit page
export function ExhibitWithAuthorSidebar() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2">
        <h1 className="font-['Cardo'] text-5xl text-[#2C1810] mb-8">
          Winter Poems
        </h1>
        {/* Exhibit content... */}
      </div>

      {/* Sidebar with compact author bio */}
      <div className="lg:col-span-1">
        <AuthorBioCard
          authorId="elena-rodriguez"
          authorName="Elena Rodriguez"
          authorBio="Poet and essayist exploring themes of memory and belonging. MFA from Iowa Writers' Workshop."
          socialLinks={[
            { type: 'website', url: 'https://elenarodriguez.com' },
          ]}
          workCount={24}
          variant="compact"
        />
      </div>
    </div>
  );
}

// Example 4: In a Collection page with multiple poems
export function CollectionWithMultipleAuthors() {
  const poems = [
    {
      id: '1',
      title: 'First Poem',
      content: 'Poem content...',
      author: {
        id: 'author1',
        name: 'Elena Rodriguez',
        bio: 'Elena Rodriguez is a poet whose work appears in major literary magazines.',
      }
    },
    {
      id: '2',
      title: 'Second Poem',
      content: 'Poem content...',
      author: {
        id: 'author2',
        name: 'Marcus Chen',
        bio: 'Marcus Chen is a Pushcart Prize-winning poet and editor.',
      }
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {poems.map((poem) => (
        <div key={poem.id} className="space-y-8">
          {/* Poem */}
          <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-12">
            <h2 className="font-['Cardo'] text-4xl text-[#2C1810] mb-8 text-center">
              {poem.title}
            </h2>
            <div className="font-['Libre_Baskerville'] text-lg text-[#2C1810] leading-loose">
              {poem.content}
            </div>
          </div>

          {/* Author Bio - Inline for clean flow */}
          <AuthorBioCard
            authorId={poem.author.id}
            authorName={poem.author.name}
            authorBio={poem.author.bio}
            variant="inline"
          />
        </div>
      ))}
    </div>
  );
}

// Example 5: Featured author on homepage/landing
export function FeaturedAuthorSection() {
  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-['Cardo'] text-4xl text-[#2C1810] mb-12 text-center italic">
          Featured Writer
        </h2>
        
        <AuthorBioCard
          authorId="elena-rodriguez"
          authorName="Elena Rodriguez"
          authorBio="This month's featured writer, Elena Rodriguez, brings us a collection of poems exploring memory and place. Her work has been praised for its lyrical precision and emotional depth. Read her latest exhibit in The Gallery."
          socialLinks={[
            { type: 'website', url: 'https://elenarodriguez.com', label: 'Website' },
            { type: 'twitter', url: 'https://twitter.com/elenarodriguez', label: '@elenarodriguez' },
          ]}
          workCount={24}
        />
      </div>
    </section>
  );
}

// Example 6: Author list page
export function AuthorDirectory() {
  const authors = [
    {
      id: 'author1',
      name: 'Elena Rodriguez',
      bio: 'Poet exploring themes of memory and belonging.',
      workCount: 24,
    },
    {
      id: 'author2',
      name: 'Marcus Chen',
      bio: 'Fiction writer and Pushcart Prize winner.',
      workCount: 18,
    },
    {
      id: 'author3',
      name: 'Amara Johnson',
      bio: 'Essayist writing about culture and family.',
      workCount: 15,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-['Cardo'] text-5xl text-[#2C1810] mb-12 text-center italic">
        Our Writers
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {authors.map((author) => (
          <AuthorBioCard
            key={author.id}
            authorId={author.id}
            authorName={author.name}
            authorBio={author.bio}
            workCount={author.workCount}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}

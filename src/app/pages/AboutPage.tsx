export function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-8">
        <h1 className="font-[family-name:var(--font-headline)] text-6xl mb-12 leading-tight">
          About PAGE
        </h1>

        <div className="space-y-6 font-[family-name:var(--font-body)] text-lg leading-relaxed">
          <p>
            PAGE is a gallery for writing. Not a newsletter service. Not a content feed. 
            A space designed by and for people who care about how language looks, sounds, and feels.
          </p>

          <p>
            Every piece is curated like a little room in a dream-museum: layered, thoughtful, 
            and built around voice, not credentials.
          </p>

          <h2 className="font-[family-name:var(--font-headline)] text-3xl pt-8 pb-4">
            The founding ethos
          </h2>

          <p>
            Writing deserves a <em>place</em>, not just a platform. Substack flattens every 
            voice into the same email template and takes 10% for the privilege. Ghost offers 
            independence but demands technical ability.
          </p>

          <p>
            PAGE sits in neither camp. It's a space where every writer gets a <strong>room</strong> — 
            with atmosphere, temperature, visual texture. When you visit someone's work, you don't 
            scroll past it in a feed. You walk into it.
          </p>

          <h2 className="font-[family-name:var(--font-headline)] text-3xl pt-8 pb-4">
            Calm Technology
          </h2>

          <p>
            PAGE is built on the principles of Calm Technology — a design philosophy that 
            prioritizes human well-being over engagement.
          </p>

          <div className="pl-6 space-y-3 text-muted-foreground">
            <p>• No notification badges</p>
            <p>• No unread counters</p>
            <p>• No "you haven't posted in 7 days" emails</p>
            <p>• No follower counts</p>
            <p>• No trending lists</p>
            <p>• No algorithmic feeds</p>
          </div>

          <p className="pt-4">
            Discovery happens through editorial curation, reader-built playlists, and wandering. 
            The architecture refuses to create hierarchies of attention.
          </p>

          <h2 className="font-[family-name:var(--font-headline)] text-3xl pt-8 pb-4">
            What makes PAGE different
          </h2>

          <p>
            <strong>Exhibits, not posts.</strong> Writers don't "publish posts." They open exhibits — 
            curated collections of 1–10 pieces, released together with a title and opening note. 
            It's a mini issue. A chapbook. An event.
          </p>

          <p>
            <strong>Commonplace books.</strong> Instead of "liking" a piece, readers pull lines 
            into their own private commonplace book — a personal garden of collected fragments.
          </p>

          <p>
            <strong>Intimacy metrics.</strong> Writers see how many people collected their lines, 
            how many stayed for more than three minutes. Not vanity metrics — intimacy metrics.
          </p>

          <p>
            <strong>Gallery spaciousness.</strong> Generous margins. Slow transitions. Full-bleed 
            work. The writing breathes.
          </p>

          <h2 className="font-[family-name:var(--font-headline)] text-3xl pt-8 pb-4">
            The feeling
          </h2>

          <p className="text-xl italic">
            The whole thing should feel less like opening an app and more like walking into 
            a room where someone has left a light on for you. The walls are a colour someone 
            chose with care. There's a book open on the table. You sit down and you read, 
            and nobody is counting how long you stay.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <a
            href="/signup"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-[family-name:var(--font-ui)]"
          >
            Open your room
          </a>
        </div>
      </div>
    </div>
  );
}

export function WelcomePage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-8">
        <h1 className="font-[family-name:var(--font-headline)] text-6xl mb-12 leading-tight">
          Welcome to your room
        </h1>

        <div className="space-y-8 font-[family-name:var(--font-body)] text-lg leading-relaxed">
          <p>
            You've just opened a space on PAGE. This isn't a blog. It isn't a newsletter. 
            It's a room — yours to shape, fill, and share.
          </p>

          <p>
            Here's what you can do:
          </p>

          <div className="pl-6 space-y-4">
            <div>
              <strong className="font-[family-name:var(--font-headline)]">
                Customize your atmosphere
              </strong>
              <br />
              <span className="text-muted-foreground">
                Choose warm, cool, or stark. Set the visual temperature of your space.
              </span>
            </div>

            <div>
              <strong className="font-[family-name:var(--font-headline)]">
                Open exhibits
              </strong>
              <br />
              <span className="text-muted-foreground">
                Not "posts" — exhibits. Curated collections of 1-10 pieces, released together 
                like a chapbook or a mini issue.
              </span>
            </div>

            <div>
              <strong className="font-[family-name:var(--font-headline)]">
                Build your bookshelf
              </strong>
              <br />
              <span className="text-muted-foreground">
                List your influences. Books, albums, films, other writers. 
                Let visitors see what shapes your work.
              </span>
            </div>

            <div>
              <strong className="font-[family-name:var(--font-headline)]">
                Collect lines
              </strong>
              <br />
              <span className="text-muted-foreground">
                When reading others' work, select any line to save it to your private 
                commonplace book. A personal anthology of fragments that stayed with you.
              </span>
            </div>
          </div>

          <p className="pt-8">
            <strong>What PAGE isn't:</strong> There are no follower counts. No trending lists. 
            No algorithm. No pressure to post daily. You write when you have something to say, 
            and readers find you through curation, not gamification.
          </p>

          <p>
            The whole thing should feel less like opening an app and more like walking into 
            a room where someone has left a light on for you.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <a
            href="/dashboard"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-[family-name:var(--font-ui)]"
          >
            Go to your dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

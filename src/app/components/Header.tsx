import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SearchModal } from './SearchModal';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  try {
    const { user, signOut } = useAuth();
    const userRole = user?.user_metadata?.role || 'writer';
    const isEditor = userRole === 'editor' || userRole === 'managing_editor';

    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-border">
          <a 
            href="/" 
            className="font-[family-name:var(--font-headline)] text-2xl tracking-tight hover:text-accent transition-colors"
          >
            PAGE
          </a>
          
          <nav className="flex items-center gap-6 font-[family-name:var(--font-ui)] text-sm">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-accent transition-colors"
              title="Search (Cmd+K)"
            >
              <Search className="w-5 h-5" />
            </button>
            <a href="/about" className="hover:text-accent transition-colors">
              About
            </a>
            <a href="/gallery" className="hover:text-accent transition-colors">
              Gallery
            </a>
            <a href="/collection" className="hover:text-accent transition-colors">
              The Collection
            </a>
            {user ? (
              <>
                <a href="/studio" className="hover:text-accent transition-colors font-medium">
                  Your Studio
                </a>
                <a href="/commonplace" className="hover:text-accent transition-colors">
                  Commonplace
                </a>
                <a href="/letters" className="hover:text-accent transition-colors">
                  Letters
                </a>
                {isEditor && (
                  <a href="/editor" className="hover:text-accent transition-colors font-medium text-[#E11D48]">
                    Editor
                  </a>
                )}
                <a href={`/room/${user.id}`} className="hover:text-accent transition-colors">
                  Your Room
                </a>
                <button
                  onClick={signOut}
                  className="hover:text-accent transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a href="/signin" className="hover:text-accent transition-colors">
                  Sign In
                </a>
                <a href="/signup" className="px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                  Join PAGE
                </a>
              </>
            )}
          </nav>
        </header>
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
    );
  } catch (error) {
    console.error('Header error:', error);
    // Return a basic header if auth context fails
    return (
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-border">
        <a 
          href="/" 
          className="font-[family-name:var(--font-headline)] text-2xl tracking-tight hover:text-accent transition-colors"
        >
          PAGE
        </a>
        
        <nav className="flex items-center gap-6 font-[family-name:var(--font-ui)] text-sm">
          <a href="/about" className="hover:text-accent transition-colors">
            About
          </a>
          <a href="/gallery" className="hover:text-accent transition-colors">
            Gallery
          </a>
          <a href="/collection" className="hover:text-accent transition-colors">
            The Collection
          </a>
          <a href="/signin" className="hover:text-accent transition-colors">
            Sign In
          </a>
          <a href="/signup" className="px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
            Join PAGE
          </a>
        </nav>
      </header>
    );
  }
}
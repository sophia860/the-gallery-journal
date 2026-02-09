import { useState } from 'react';
import { subscribeNewsletter } from '../../services/backend';

const literaryQuotes = [
  "Words are, in my not-so-humble opinion, our most inexhaustible source of magic. - J.K. Rowling",
  "There is no greater agony than bearing an untold story inside you. - Maya Angelou",
  "A writer is someone for whom writing is more difficult than it is for other people. - Thomas Mann",
  "You can make anything by writing. - C.S. Lewis",
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [randomQuote] = useState(literaryQuotes[Math.floor(Math.random() * literaryQuotes.length)]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');
    
    const result = await subscribeNewsletter(email);
    
    if (result.success) {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    } else {
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-[#F5F0EB] border-t border-[#2C2C2C]">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Quote */}
          <div className="lg:col-span-2">
            <h3 className="font-['Cardo'] text-3xl italic mb-4">The Gallery</h3>
            <p className="text-sm text-[#C4B5A0] font-['Libre_Baskerville'] italic leading-relaxed mb-6">
              {randomQuote}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-['Inter'] text-sm uppercase tracking-wider mb-4 text-[#C4B5A0]">
              Explore
            </h4>
            <nav className="space-y-3">
              <a href="/collection-gallery" className="block font-['Inter'] text-sm hover:text-white transition-colors">
                The Collection
              </a>
              <a href="/community-wall" className="block font-['Inter'] text-sm hover:text-white transition-colors">
                Gallery Wall
              </a>
              <a href="/afterhours" className="block font-['Inter'] text-sm hover:text-white transition-colors">
                Afterhours
              </a>
              <a href="/rooms" className="block font-['Inter'] text-sm hover:text-white transition-colors">
                Rooms
              </a>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-['Inter'] text-sm uppercase tracking-wider mb-4 text-[#C4B5A0]">
              Newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2 bg-[#2C2C2C] border border-[#3C3C3C] text-white placeholder:text-[#717171] font-['Inter'] text-sm focus:border-[#E11D48] focus:outline-none"
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="w-full px-4 py-2 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Inter'] text-sm disabled:opacity-50"
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : 
                 subscribeStatus === 'success' ? 'Subscribed!' : 
                 subscribeStatus === 'error' ? 'Try again' : 
                 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2C2C2C] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#717171] font-['Inter']">
            © 2026 The Gallery. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-[#717171] hover:text-white transition-colors font-['Inter']">
              Twitter
            </a>
            <a href="#" className="text-xs text-[#717171] hover:text-white transition-colors font-['Inter']">
              Instagram
            </a>
            <a href="#" className="text-xs text-[#717171] hover:text-white transition-colors font-['Inter']">
              Substack
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

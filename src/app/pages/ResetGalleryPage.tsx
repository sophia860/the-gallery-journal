import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { RefreshCw, Sparkles } from 'lucide-react';

const NIX_CARLSON_POEMS = [
  {
    title: "I THOUGHT YOU'D BEEN QUEER LONGER THAN THAT.",
    content: `Perhaps because I have been. My gay card came in the mail at 14 years. Back when I had scabbed knees,
living in a house painted all red, cross on the front door. Back when blue and pink and purple simply
looked pretty next to each other. It's in my wallet. Haven't I shown it to you? How dare you insinuate that
my past
of lying to with men means that my queerness is young. It was born long before a man in pretentious
sweaters taught me how to use my mouth for more than just running it. It was born long before women in
dyke boots hand-fed me cherries and taught me to lick out the pit with my tongue. I don't need to hold
space for the chance that you might want to fuck a man in a year or ten, you know the boundaries of your
desire (though we are kaleidoscopes, so if the light ever shifts, I will remain by your side). But I do hold
space for the way our pedestal of male proximity taints Sappho-sanctioned homes, turns comrades to
enemies. I am not your enemy – nor are the men I decide to take to bed. The hands that pin you with fear
are the same that keep me pinned, spread-eagle, to the dissection table. The tools of scrutiny they use to
slice into your heart and diagnose disorder are the same that interrogate mine for beating in two
directions.
You claim that I am the one performing your dissection (and perhaps I am complicit, as humans often
are), but look to your hands and see the bloodied scalpel you hold. This is not the moral failing of you or
I, it is the fault of a world addicted to conformity, snorting identical lines of ideological lies. I do not need
you to
link arms with me; my arms are heavy with the bricks of liberation. I do not need you to take my hand,
tell me my sexuality is valid; my hands are busy writing this poem of resistance. I know I have a seat at
our table; I need you to let me take it.

Regardless of whose bed I'm leaving.`,
    genre: 'poetry'
  },
  {
    title: "POLYAMORY",
    content: `i know i look to you like a child / never quite loved right. / numb fingers
turning over loose stones / searching for the beetle-husk of validation. /
hands pulling up fistfuls of weeds / set carefully in vases / mistook for
wildflowers. / starved / for scraps of proof / that i am of any importance.
/ needed by anyone. /
i know i seem to be collecting illicit scandals / lovers / like pennies in my
pocket. / forever scouring the pavement for something shiny and new / to
toss in with the rest / to forget as tarnish sets in / to trade for sweets / or
paints / or triple-a batteries / the next time i'm bored. / greedy girl /
jangling my loose change for all to hear. / as if i might even be proud of
my earnings. /
i'm sure you think i'm afraid / of the color white / and diamond rings /
and anything deep enough to drown in. / sprinting towards dust bowls at
the sight of a puddle. / the wind blows / leaves me dirt-streaked / sand-
mouthed / but breathing. / no shackled weights on my fingers. /
i confess, i am a little scared of vows / but only because i haven't learned
to write about love / without loss. /
i know jealousy's branding iron sizzles through your lungs. /
i know you'd prefer your desires only unearthed on a new moon. /
i know you could never. /`,
    genre: 'poetry'
  },
  {
    title: "YES",
    content: `gravity wraps my hair in its fist
and pulls me on top, breaks
all his rules 
(all my rules, too)
to look down on me from
below
i hold his breath against my tongue:
spearmint orbiting teeth
notes of nicotine
and soured sleep, 
drink every last drop of 
rum from his lips as if I could drink him sober
fingers flex prints into the flesh of my waist
he climbs my ribcage until i arch
to my breasts      
skin      supple and giving
into his will
grab me by the throat like a rabid dog
and feel my life, ruinous
and red, rushing past your fingers
star burst vision and rusted breath 
my fingers sprinting
to hold yours in place
tighter,
tighter.
time slows the yes before palm connects 
with the side of my face,
knocks my moan to the floor
with a sting
soothed by restraint
eyes on me. stay.`,
    genre: 'poetry'
  },
  {
    title: "REASONS YOU REFUSE TO DATE ME",
    content: `my nose is too big.
so are my thighs.
my tits are too small.
my haircut is queer.
i'm blind without contacts, so i'll never truly see
you wracked with sobs in the kitchen
at three in the morning.
i believe silence is made to be broken.
so are mugs.
but i refuse to believe people are.
my heart is too soft,
a squishy thing oozing through your fingers.
my blood contains over the legal limit
of ink. i'll stain your hands.
one day i'll call you a narcissistic drunk.
then sober up over the toilet, sick
with remorse, useless to you.
when you smash the porcelain vase
masquerading as my body, i'll sit down
with gold and glue,
fix the cracks to glisten.
i'll immortalize you, clad in cheap metaphor.
i love too many people,
and they've all undressed me.
in one way or another.
my heart has turned blind to suffering.
i invite death in for tea, slide an envelope
across the table, stuffed with rival's names
yours at the top
and a wad of cash to seal the deal.
i'll tell you i'm not a liar
and i'll be lying.`,
    genre: 'poetry'
  },
  {
    title: "I PROBABLY L*VE YOU",
    content: `but we're sitting in your car under the broken streetlight / and you're
telling me we're through / it's barely july / and the air bites negative / i can
see my breath stall between us / you probably l*ve me / but you lean in at
the bar / all cocksure smiles / as you say i'm just an obligation / and i can
feel my heartbeat thrumming in my ears / static in my veins /
and maybe you l*ve me / but you've texted me three times in two weeks
/ to tell me how much you h*te me / so it's possible / maybe / you mean
it / whispering l*ve into the midnight hush on your couch / but honesty
has a habit of curdling in your throat / so the words sound more like / I
think we should f*ck / and I end up kissing sour lips /
because you definitely don't l*ve me / i'm more of a vice / the bacardi
you're parched for / a thought loop you can't close / an aged tattoo on
your clavicle that won't wash off /
the problem is / that my feelings don't dissipate / at golden hour / so i
c*re about you / but when i say it / it has to sound like / did you get home
safe? / i l*ve you / but i have to bite my tongue and say / yes, touch me
there / there, again / i l*ve you / and i'm down for whatever / even
forever /
but i know you're not planning past thursday /
so don't insult me with /
i probably love you.`,
    genre: 'poetry'
  }
];

export function ResetGalleryPage() {
  const { user, accessToken } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const resetGallery = async () => {
    if (!confirm('This will DELETE all existing poems and add Nix Carlson\'s 5 poems. Continue?')) {
      return;
    }

    setProcessing(true);
    setComplete(false);
    setLogs([]);

    try {
      // Step 1: Clear all existing exhibits from localStorage
      setCurrentStep('Clearing existing poems...');
      addLog('🗑️ Clearing existing exhibits from localStorage...');
      
      // Clear all exhibit-related keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('exhibit:') || key.startsWith('user:exhibits:'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      addLog(`✅ Cleared ${keysToRemove.length} existing items from localStorage`);

      // Step 2: Add Nix Carlson's poems
      setCurrentStep('Adding Nix Carlson poems...');
      addLog('📚 Starting to add Nix Carlson\'s poems...');

      let successCount = 0;
      const demoUserId = 'demo-user-nix-carlson';

      for (let i = 0; i < NIX_CARLSON_POEMS.length; i++) {
        const poem = NIX_CARLSON_POEMS[i];
        const exhibitId = `exhibit-nix-${i + 1}`;
        
        addLog(`📝 Adding: "${poem.title}"`);

        try {
          const exhibitData = {
            id: exhibitId,
            userId: demoUserId,
            title: poem.title,
            openingNote: `by Nix Carlson

Nix Carlson (she/they) is a queer, polyamorous, and neurodivergent poet and sign language interpreter based in Lexington, KY, with strong ties to Milwaukee, WI. Their work has appeared or is forthcoming in Wildscape, Voicemail Poems, Orange Rose, Vellichor Literary, Broken Stone Review, Coming Up Short, and Eunoia Review, among others.

Instagram: @bynixec`,
            pieces: [
              {
                id: crypto.randomUUID(),
                title: poem.title,
                content: poem.content,
                type: poem.genre,
              }
            ],
            coverImage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Store in localStorage
          localStorage.setItem(`exhibit:${exhibitId}`, JSON.stringify(exhibitData));
          localStorage.setItem(`user:exhibits:${demoUserId}:${exhibitId}`, exhibitId);
          
          successCount++;
          addLog(`✅ Successfully added: "${poem.title}"`);
        } catch (error: any) {
          addLog(`❌ Error adding: "${poem.title}" - ${error.message}`);
        }

        // Small delay between operations
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Store exhibit list
      const exhibitIds = Array.from({ length: NIX_CARLSON_POEMS.length }, (_, i) => `exhibit-nix-${i + 1}`);
      localStorage.setItem('exhibit:all', JSON.stringify(exhibitIds));
      localStorage.setItem(`user:${demoUserId}:name`, 'Nix Carlson');
      
      addLog(`📝 Stored ${successCount} exhibits in local storage`);

      setCurrentStep('Complete!');
      addLog(`\n🎉 COMPLETE! Added ${successCount} of ${NIX_CARLSON_POEMS.length} poems`);
      addLog('✨ Gallery has been reset with Nix Carlson\'s work');
      addLog('');
      addLog('💡 Note: Poems are stored in browser localStorage for demo purposes');
      addLog('   The gallery will display these poems when you visit /collection-gallery');
      setComplete(true);

    } catch (error: any) {
      console.error('Error resetting gallery:', error);
      addLog(`❌ Error: ${error.message || 'Failed to reset gallery'}`);
      setCurrentStep('Error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-[#F5F0EB] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex items-center gap-4 mb-6">
          <RefreshCw className="w-12 h-12 text-[#8A9A7B]" />
          <div>
            <h1 className="font-['Cardo'] text-6xl text-[#2C1810] italic">
              Reset Gallery
            </h1>
          </div>
        </div>
        
        <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] mb-12">
          Clear all existing poems and populate with Nix Carlson's work
        </p>

        {/* Info Box */}
        <div className="bg-white border-2 border-[#8A9A7B] rounded-xl p-8 mb-8">
          <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
            What This Does
          </h2>
          <ul className="space-y-3 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
            <li className="flex items-start gap-2">
              <span className="text-[#E11D48] flex-shrink-0">1.</span>
              <span><strong>Deletes all existing exhibits</strong> — Removes every poem currently in the gallery</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8A9A7B] flex-shrink-0">2.</span>
              <span><strong>Adds 5 poems by Nix Carlson</strong> — Imports real, published literary work</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C4A265] flex-shrink-0">3.</span>
              <span><strong>Includes full poet credits</strong> — Bio, publications, and social media</span>
            </li>
          </ul>
        </div>

        {/* Poems Preview */}
        <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8 mb-8">
          <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-4">
            Nix Carlson's Poems
          </h3>
          <ul className="space-y-2 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
            {NIX_CARLSON_POEMS.map((poem, i) => (
              <li key={i} className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#8A9A7B] flex-shrink-0 mt-0.5" />
                <span>{poem.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        {!processing && !complete && (
          <button
            onClick={resetGallery}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#8A9A7B] text-white hover:bg-[#6F7D62] hover:scale-105 transition-all font-['Cardo'] text-lg rounded-lg shadow-lg mb-8"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Gallery with Nix Carlson's Poems
          </button>
        )}

        {/* Processing Status */}
        {processing && (
          <div className="mb-8 p-6 bg-white border-2 border-[#8A9A7B] rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 border-4 border-[#8A9A7B] border-t-transparent rounded-full animate-spin"></div>
              <span className="font-['Cardo'] text-xl text-[#2C1810]">{currentStep}</span>
            </div>
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-[#2C1810] border-2 border-[#E0D8D0] rounded-xl p-6 overflow-auto max-h-96">
            <h3 className="font-['Courier_New'] text-sm text-[#8A9A7B] mb-4 uppercase tracking-wider">
              Process Log
            </h3>
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="font-['Courier_New'] text-xs text-[#F5F0EB] leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Message */}
        {complete && (
          <div className="mt-8 p-8 bg-gradient-to-br from-[#8A9A7B]/20 to-white border-2 border-[#8A9A7B] rounded-xl text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#8A9A7B]" />
            <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-3">
              Gallery Reset Complete!
            </h3>
            <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] mb-6">
              The gallery now features Nix Carlson's powerful poetry
            </p>
            <a
              href="/collection-gallery"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#8A9A7B] text-white hover:bg-[#6F7D62] transition-all font-['Cardo'] text-lg rounded-lg"
            >
              View Gallery
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
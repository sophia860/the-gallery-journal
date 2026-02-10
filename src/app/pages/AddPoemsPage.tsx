import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { Sparkles } from 'lucide-react';

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

export function AddPoemsPage() {
  const { user, accessToken } = useAuth();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const addNixCarlsonPoems = async () => {
    if (!user || !accessToken) {
      setMessage('You must be signed in to add poems');
      return;
    }

    setAdding(true);
    setMessage('');
    setResults([]);

    try {
      const addedPoems: string[] = [];

      // Create exhibits for each poem
      for (const poem of NIX_CARLSON_POEMS) {
        try {
          // Create the exhibit
          const exhibitResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/exhibits`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                title: poem.title,
                openingNote: `by Nix Carlson

Nix Carlson (she/they) is a queer, polyamorous, and neurodivergent poet and sign language interpreter based in Lexington, KY, with strong ties to Milwaukee, WI. Their work has appeared or is forthcoming in Wildscape, Voicemail Poems, Orange Rose, Vellichor Literary, Broken Stone Review, Coming Up Short, and Eunoia Review, among others. You can find them on Instagram at @bynixec.`,
                pieces: [
                  {
                    id: crypto.randomUUID(),
                    title: poem.title,
                    content: poem.content,
                    type: poem.genre,
                  }
                ],
                coverImage: null,
              }),
            }
          );

          if (exhibitResponse.ok) {
            addedPoems.push(`✓ Added: "${poem.title}"`);
          } else {
            const error = await exhibitResponse.json();
            addedPoems.push(`✗ Failed: "${poem.title}" - ${error.error || 'Unknown error'}`);
          }
        } catch (err) {
          addedPoems.push(`✗ Failed: "${poem.title}" - Network error`);
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setResults(addedPoems);
      setMessage(`Finished adding ${addedPoems.filter(r => r.startsWith('✓')).length} of ${NIX_CARLSON_POEMS.length} poems`);
    } catch (error) {
      console.error('Error adding poems:', error);
      setMessage('✗ Error: Failed to add poems');
    } finally {
      setAdding(false);
    }
  };

  if (!user) {
    window.location.href = '/signin';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-[#F5F0EB] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8">
        <h1 className="font-['Cardo'] text-6xl mb-6 text-[#2C1810] italic">
          Add Nix Carlson Poems
        </h1>
        <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] mb-12">
          Import {NIX_CARLSON_POEMS.length} poems by Nix Carlson to the gallery
        </p>

        {/* Poet Bio */}
        <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8 mb-8">
          <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
            About Nix Carlson
          </h2>
          <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed mb-4">
            Nix Carlson (she/they) is a queer, polyamorous, and neurodivergent poet and sign language interpreter based in Lexington, KY, with strong ties to Milwaukee, WI. Their work has appeared or is forthcoming in Wildscape, Voicemail Poems, Orange Rose, Vellichor Literary, Broken Stone Review, Coming Up Short, and Eunoia Review, among others. You can find them on Instagram at @bynixec.
          </p>
        </div>

        {/* Poems List */}
        <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8 mb-8">
          <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-4">
            Poems to Import
          </h3>
          <ul className="space-y-2 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
            {NIX_CARLSON_POEMS.map((poem, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#C4A265]">{i + 1}.</span>
                <span>{poem.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Add Button */}
        <button
          onClick={addNixCarlsonPoems}
          disabled={adding}
          className="inline-flex items-center gap-3 px-10 py-5 bg-[#8A9A7B] text-white hover:bg-[#6F7D62] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Cardo'] text-lg rounded-lg shadow-lg mb-8"
        >
          <Sparkles className="w-5 h-5" />
          {adding ? 'Adding Poems...' : 'Add All Poems to Gallery'}
        </button>

        {/* Message Display */}
        {message && (
          <div className={`p-5 border-2 rounded-xl font-['Courier_New'] text-sm mb-6 ${
            message.includes('✗')
              ? 'bg-[#E11D48]/10 border-[#E11D48] text-[#2C1810]'
              : 'bg-[#8A9A7B]/10 border-[#8A9A7B] text-[#2C1810]'
          }`}>
            {message}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8">
            <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-4">
              Results
            </h3>
            <ul className="space-y-2 font-['Courier_New'] text-sm">
              {results.map((result, i) => (
                <li key={i} className={result.startsWith('✓') ? 'text-[#8A9A7B]' : 'text-[#E11D48]'}>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
// Run: node test-data/generate-users.js
// Generates 100 unique test user profiles with literary-themed data

const fs = require('fs');
const path = require('path');

const firstNames = [
  'Ada','Amara','Aisha','Blake','Bri','Carmen','Celeste','Clara','Dara',
  'Elena','Ezra','Freya','Gael','Hana','Iris','Jude','Kai','Lena','Luna',
  'Maya','Mira','Nadia','Nico','Olive','Orla','Petra','Quinn','Rae','Ren',
  'Rumi','Sage','Sana','Sia','Sol','Tara','Uma','Vera','Wren','Yara','Zara',
  'Aiden','Bela','Cass','Dove','Eden','Faye','Grey','Hart','Inez','Jaya',
  'Kira','Lark','Moss','Nova','Opal','Piper','Reed','Rue','Seren','Thea'
];

const lastNames = [
  'Alcott','Bronte','Cather','Dickinson','Eliot','Fitzgerald','Garcia',
  'Hughes','Ibsen','Joyce','Kafka','Lorde','Morrison','Neruda','Oates',
  'Plath','Quindlen','Rich','Sontag','Tolstoy','Updike','Vonnegut',
  'Walker','Xie','Yeats','Zambra','Atwood','Borges','Colette','Duras',
  'Emerson','Frost','Ginsberg','Hesse','Ishiguro','Jin','Kincaid',
  'Lahiri','Munro','Nabokov','Oliver','Paz','Rilke','Sexton','Tagore',
  'Ueland','Valenzuela','Woolf','Xiao','Yourcenar','Zusak'
];

const writerPrefixes = [
  '', '', '', // 30% leave blank (use real name)
  'writes.as.', 'the.quiet.', 'ink.', 'verso.', 'margin.',
  'after.', 'between.lines.', 'soft.', 'half.', 'salt.'
];

const poems = [
  { title: "Morning Light", body: "The kitchen window frames a square of sky\nthat changes meaning every hour." },
  { title: "What the River Said", body: "I carry everything that falls into me\nleaves, stones, someone's lost shoe." },
  { title: "Letter to My Hands", body: "You've held more than I remember\ndoorknobs, bread dough, a child's fever." },
  { title: "After the Diagnosis", body: "The doctor spoke in percentages.\nI counted ceiling tiles. Seven." },
  { title: "Small Hours", body: "At 3am the house confesses\nfloorboards creak their age." },
  { title: "Grocery List as Love Poem", body: "Oat milk (the one you like)\nThat weird cheese\nStrawberries if they look good" },
  { title: "Tidal", body: "My mother's voice on the phone\ndistant, familiar, the way the ocean sounds inside a shell." },
  { title: "On Seeing a Fox in the City", body: "It paused under the streetlight\nlike a secret that wandered out of the wrong story." },
  { title: "November", body: "The trees are doing that thing again\nletting go of everything beautiful and calling it wisdom." },
  { title: "Self-Portrait as a Room", body: "The walls are the color of thinking too much.\nThere's a window I forget to open." },
  { title: "What I Didn't Say at the Funeral", body: "You would have hated the flowers.\nToo formal. Too arranged." },
  { title: "Recipe for Sleep", body: "Turn off the screen.\nLie flat. Count nothing.\nLet the dog press against your leg." },
  { title: "Geography of Touch", body: "The shoulder. The wrist.\nThe space between thumb and finger." },
  { title: "Elegy for a Kitchen Table", body: "Four chairs, one wobbly.\nCoffee rings like tree rings." },
  { title: "To the Woman Crying on the Train", body: "I didn't look away.\nI didn't look too long.\nI just sat one seat closer." }
];

const shortStories = [
  { title: "The Collector", body: "She kept a jar of beach glass on the windowsill. Each piece had been sharp once." },
  { title: "Closing Time", body: "The bookshop owner turned the sign to CLOSED but left the door unlocked." },
  { title: "The Translator", body: "My grandmother spoke three languages but dreamed in one she'd forgotten." },
  { title: "Last Light", body: "Every evening the painter walked to the end of the pier and watched the sky." },
  { title: "The Bench", body: "They'd been meeting on the same park bench for eleven years. Wednesdays at noon." }
];

function generateUsers(count = 100) {
  const users = [];
  const usedEmails = new Set();

  for (let i = 0; i < count; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${first} ${last}`;

    let email;
    do {
      const num = Math.floor(Math.random() * 9999);
      email = `testuser.${first.toLowerCase()}.${num}@gallerytesting.dev`;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    const prefix = writerPrefixes[Math.floor(Math.random() * writerPrefixes.length)];
    const writerName = prefix ? `${prefix}${first.toLowerCase()}` : '';

    const allWorks = [...poems, ...shortStories];
    const work = allWorks[i % allWorks.length];

    users.push({
      id: i + 1,
      name: fullName,
      writerName: writerName,
      email: email,
      password: `Gallery2026!Test${i}`,
      submission: {
        title: `${work.title} — v${i + 1}`,
        body: work.body,
        type: i % allWorks.length < poems.length ? 'poetry' : 'prose'
      }
    });
  }

  return users;
}

const users = generateUsers(100);

const outputPath = path.join(__dirname, 'test-users.json');
fs.writeFileSync(outputPath, JSON.stringify(users, null, 2));

console.log(`Generated ${users.length} test users -> ${outputPath}`);
console.log(`  ${users.filter(u => u.writerName).length} with writer names`);
console.log(`  ${users.filter(u => u.submission.type === 'poetry').length} poetry submissions`);
console.log(`  ${users.filter(u => u.submission.type === 'prose').length} prose submissions`);

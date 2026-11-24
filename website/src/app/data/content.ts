/**
 * Verified content for the portfolio.
 * Everything here comes from Aditya's own repositories / brief:
 *  - portfolio/PRODUCT.md (positioning, voice, constraints)
 *  - github.com/adityayadav171106 (BAGTAG, crce_placement_portal-, Aditya_portfolio)
 * Nothing is invented: no fake metrics, awards or dates.
 */

export type Chip = { label: string; tone?: 'accent' | 'warm' };

const KEYBOARD = [
  ' .---------------------------------------.',
  ' |   ~ 1 2 3 4 5 6 7 8 9 0 - =  [del]    |',
  ' |    q w e r t y u i o p [ ] \\          |',
  " |     a s d f g h j k l ; '  [enter]    |",
  ' |      z x c v b n m , . /   [shift]    |',
  ' |  [ctrl] [fn] [   space   ] [cmd]      |',
  " '---------------------------------------'",
].join('\n');

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  summary: string;
  blurb: string;
  bullets: string[];
  stack: string[];
  links: { label: string; href: string }[];
  ascii: string;
  artLabel: string;
  featured?: boolean;
};

export type ContactLink = { label: string; href: string; note: string; key: string };

export const identity = {
  name: 'Aditya Yadav',
  handle: 'adityayadav171106',
  location: 'Mumbai, India',
  roles: ['engineering student', 'builder of small things', 'occasional tinkerer'],
  tagline: ['just your', 'average', 'nerd ;)'],
  lead: 'Engineering student in Mumbai. I follow whatever question keeps me curious: code, chess, cats, robots — and the next thing I pick up.',
  status: 'open to internships & collaborations',
  email: 'adityayadav171106@gmail.com',
};

export const nav = [
  { label: 'home', href: '#top', key: 'H' },
  { label: 'about', href: '#about', key: 'A' },
  { label: 'work', href: '#work', key: 'W' },
  { label: 'side quests', href: '#quests', key: 'S' },
  { label: 'contact', href: '#contact', key: 'C' },
];

export const stats: { value: string; label: string }[] = [
  { value: '2026', label: 'fol. edition' },
  { value: '03', label: 'public repos' },
  { value: '∞', label: 'rabbit holes' },
  { value: 'B.Tech', label: 'computer engg.' },
];

export const interests: { name: string; glyph: string; note: string }[] = [
  { name: 'Coding', glyph: '[ ]', note: 'the default state' },
  { name: 'Chess', glyph: '[ ]', note: 'long games, longer thinks' },
  { name: 'Cats', glyph: '[ ]', note: 'unreasonably fond' },
  { name: 'Robots', glyph: '[ ]', note: 'wires + curiosity' },
];

export const about = {
  statement: 'I am interested in a lot of things, and I tend to follow the questions that come with them.',
  paragraphs: [
    'Engineering is what I study. Outside of it, I am drawn to coding, chess, cats, robots, and whatever catches my curiosity next.',
    'I like projects that sit between hardware and software — a tag that talks over Bluetooth, a portal people actually have to use, an interface that explains itself.',
    'This site is a place to collect the things I make and the things I am still figuring out. It is written to be read, not skimmed: every line here is something I can point at a repository for.',
  ],
  timeline: [
    {
      when: 'now',
      title: 'B.Tech, Computer Engineering',
      detail: 'Studying in Mumbai. Coursework in systems, networks and the odd bit of embedded work.',
    },
    {
      when: '2026',
      title: 'BAGTAG — anti-loss tracker',
      detail:
        'ESP32 BLE tag plus a Kotlin/Jetpack Compose Android app: scanning, safe zones, conservative forgotten-item alerts.',
    },
    {
      when: '2026',
      title: 'CRCE Placement Cell portal',
      detail:
        'A working placement portal for the college: recruiter listings, internships, student, faculty and recruiter views.',
    },
    {
      when: 'ongoing',
      title: 'Whatever is next',
      detail:
        'Currently poking at embedded protocols, chess openings, and the way this page renders on a phone.',
    },
  ],
};

export const projects: Project[] = [
  {
    slug: 'bagtag',
    name: 'BAGTAG',
    kind: 'hardware × android',
    year: '2026',
    featured: true,
    summary: 'A tag that tells your phone when you have left it behind.',
    blurb:
      'An ESP32 advertises itself over Bluetooth Low Energy. An Android app listens, remembers when it last saw the tag, and only complains when leaving it behind was probably a mistake.',
    bullets: [
      'BLE beacon firmware in Arduino (NimBLE-Arduino) that advertises a stable tag identifier.',
      'Kotlin + Jetpack Compose app: scan control, RSSI, last-seen time, and graceful handling of disabled Bluetooth or denied permissions.',
      'Forgotten-item logic that pairs a last observation with safe-zone classification, timeout, grace period, phone-to-observation distance and cooldown.',
      'Named safe zones you can create, edit and delete — places where leaving the tag is intentional, so no false alarms.',
      'Local storage only. No cloud, no GPS in the tag, and no promises about exact distance.',
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'ESP32', 'NimBLE-Arduino', 'BLE'],
    links: [
      { label: 'source', href: 'https://github.com/adityayadav171106/BAGTAG' },
      {
        label: 'project plan',
        href: 'https://github.com/adityayadav171106/BAGTAG/blob/main/docs/project-plan.md',
      },
    ],
    artLabel: 'a small robot drawn in ASCII',
    ascii: String.raw`
     .------.
    /  o  o  \
   |    /\    |
   |   '--'   |
    \  [==]  /
     '-.__.-'
   ___|    |___
  /   |    |   \
 |    |____|    |
 |   /      \   |
  \_/        \_/
   []        []
`,
  },
  {
    slug: 'placement-portal',
    name: 'CRCE Placement Portal',
    kind: 'web app',
    year: '2026',
    featured: true,
    summary: 'A placement cell site that students and recruiters can actually use.',
    blurb:
      'Built for a college competition and then kept alive: recruiter and internship listings, plus separate landing, login, student, faculty and recruiter views — with a small Node server behind it.',
    bullets: [
      'React + Vite front end with dedicated landing, login, student portal, faculty portal and recruiter portal pages.',
      'Recruiter directory (roles and package bands) and an internship board with stipend, duration, location and tags.',
      'Client-side data layer (portalStorage) so the demo runs without a database.',
      'Node/Express server for production serving, with build and start scripts.',
    ],
    stack: ['React', 'Vite', 'Node.js', 'JavaScript', 'CSS'],
    links: [{ label: 'source', href: 'https://github.com/adityayadav171106/crce_placement_portal-' }],
    artLabel: 'an ASCII keyboard',
    ascii: KEYBOARD,
  },
  {
    slug: 'this-site',
    name: 'this portfolio',
    kind: 'angular web app',
    year: '2026',
    summary: 'The page you are reading, drawn in characters.',
    blurb:
      'A single-page Angular app with no visual framework: every headline, card and doodle is monospace text laid over one canvas of drifting stars. Rebuilt from an earlier collage-style concept.',
    bullets: [
      'Angular 22, standalone components, signals and zoneless change detection.',
      'ASCII artwork authored by hand and by dithering actual images down to characters.',
      'Keyboard-first: press a key to jump between sections, and a little cat follows along.',
      'Runtime theme cycling, reduced-motion respect, and a font subset that guarantees the art never shifts.',
    ],
    stack: ['Angular', 'TypeScript', 'SCSS', 'Canvas'],
    links: [
      { label: 'source', href: 'https://github.com/adityayadav171106/Aditya_portfolio' },
      {
        label: 'earlier design',
        href: 'https://github.com/adityayadav171106/Aditya_portfolio/tree/redesign',
      },
    ],
    artLabel: 'a cat in ASCII',
    ascii: String.raw`
    /\_/\
   ( o.o )
   -= ^ =-
   /|   |\
  / |   | \
 |  |   |  |
 |  |   |  |
  \ |   | /
   \|___|/
     | |
     |_|
`,
  },
];

/**
 * Compact moon (≤ 34 columns) used on narrow screens.
 */
export const compactMoon = String.raw`
            _.-'''-.._
         .-'   _.-.   '-.
       .'     (     )    '.
      /         '-.-'       \
     |    _.-.         .-.   |
     |   (     )       (     )|
      \                       /
       '.                   .'
         '-.._         _..-'
              '-.....--'
`;

export const quests = [
  {
    name: 'Coding',
    key: '01',
    ascii: String.raw`
  > print("hello")
  hello
  > _
`,
    lines: [
      'The default state. Mostly JavaScript and TypeScript, some Kotlin, and Arduino C++ when the hardware asks for it.',
      'I like finishing things: a repo that runs, a README that explains it, and no dead buttons.',
    ],
  },
  {
    name: 'Chess',
    key: '02',
    ascii: String.raw`
  +---+---+---+---+---+---+---+---+
8 | r | n | b | q | k | b | n | r |
  +---+---+---+---+---+---+---+---+
7 | p | p | p | p | p | p | p | p |
  +---+---+---+---+---+---+---+---+
6 |   | . |   | . |   | . |   | . |
  +---+---+---+---+---+---+---+---+
5 | . |   | . |   | . |   | . |   |
  +---+---+---+---+---+---+---+---+
4 |   | . |   | . |   | . |   | . |
  +---+---+---+---+---+---+---+---+
3 | . |   | . | N | . |   | . |   |
  +---+---+---+---+---+---+---+---+
2 | P | P | P | P | P | P | P | P |
  +---+---+---+---+---+---+---+---+
1 | R | N | B | Q | K | B | N | R |
  +---+---+---+---+---+---+---+---+
    a   b   c   d   e   f   g   h
`,
    lines: [
      'Long games, longer thinks. I play quietly and lose on time less often than I used to.',
      'Mostly a way of practising the thing engineering needs anyway: looking one move further than feels comfortable.',
    ],
  },
  {
    name: 'Cats',
    key: '03',
    ascii: String.raw`
    /\_/\
   ( ^.^ )   <3
   -= ^ =-
   /|   |\
  / |   | \
 |  |   |  |
 |  |   |  |
  \ |   | /
   \|___|/
     | |
     |_|
`,
    lines: [
      'Unreasonably fond of them. There is one living at the top of this page, and another one that follows your cursor around.',
      'Also the reason the internet handle is what it is.',
    ],
  },
  {
    name: 'Robots',
    key: '04',
    ascii: String.raw`
     .------.
    /  o  o  \
   |    /\    |
   |   '--'   |
    \  [==]  /
     '-.__.-'
   ___|    |___
  /   |    |   \
 |    |____|    |
 |   /      \   |
  \_/        \_/
   []        []
`,
    lines: [
      'Wires plus curiosity. Sensors, boards, and the small satisfaction of making a thing react to the physical world.',
      'BAGTAG started here: a tag that broadcasts, and a phone that decides what that broadcast means.',
    ],
  },
];

export const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    href: 'mailto:adityayadav171106@gmail.com',
    note: 'the reliable one',
    key: 'M',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/adityayadav171106',
    note: '@adityayadav171106',
    key: 'G',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/aditya-yadav-a183b8330',
    note: 'aditya-yadav',
    key: 'L',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/adi_likes_cats/',
    note: '@adi_likes_cats',
    key: 'I',
  },
];

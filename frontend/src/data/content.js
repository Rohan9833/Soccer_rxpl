// Marketing content for the Sales Soccer microsite.
// Product descriptions only: no internal game logic is defined or described here.

// Asset URLs respect Vite's base path, so the site also works from a sub-folder.
const BASE = import.meta.env.BASE_URL;
const screen = (file) => `${BASE}assets/screens/${encodeURIComponent(file)}`;

export const ASSETS = {
  logo: `${BASE}assets/brand/sales-soccer-logo.png`,
  // Same official logo with only the transparent margin cropped away.
  logoTrimmed: `${BASE}assets/brand/sales-soccer-logo-trimmed.png`,
  heroStadium: `${BASE}assets/visuals/stadium-hero.jpg`,
  turf: `${BASE}assets/visuals/stadium-turf.jpg`,
  playerSilhouette: `${BASE}assets/visuals/player-silhouette.png`,
};

export const NAV_LINKS = [
  { id: 'game', label: 'The Game' },
  { id: 'tournament', label: 'Tournament' },
  { id: 'app', label: 'The App' },
  { id: 'command-centre', label: 'HO Portal' },
  { id: 'benefits', label: 'Why Sales Soccer' },
];

// Original, unmodified application screenshots supplied by digiLATERAL.
export const APP_SCREENS = [
  {
    id: 'home',
    file: 'Home.png',
    src: screen('Home.png'),
    title: 'Home Dashboard',
    description: 'View player performance, current football position, team identity and match progress.',
    tags: ['Player card', 'Field position', 'Live match'],
    orientation: 'portrait',
  },
  {
    id: 'upload',
    file: 'Upload.png',
    src: screen('Upload.png'),
    title: 'Activity Upload',
    description: 'Submit campaign activities such as Prescription, Camp, POB and Conversion, with supporting proof.',
    tags: ['Campaign activities', 'Brand selection', 'Proof upload'],
    orientation: 'portrait',
  },
  {
    id: 'approval',
    file: 'Approval Status.png',
    src: screen('Approval Status.png'),
    title: 'Approval Status',
    description: 'Track submitted activity records and their approval status.',
    tags: ['Date filter', 'Status filter', 'Submission history'],
    orientation: 'portrait',
  },
  {
    id: 'leaderboard',
    file: 'Leaderboard.png',
    src: screen('Leaderboard.png'),
    title: 'Player Rankings',
    description: 'Explore individual player and team rankings.',
    tags: ['Player rank', 'Team rank', 'Monthly view'],
    orientation: 'portrait',
  },
  {
    id: 'compare',
    file: 'Compare Player.png',
    src: screen('Compare Player.png'),
    title: 'Compare Players',
    description: 'Compare individual performance across football-inspired metrics.',
    tags: ['Head-to-head', 'Match stats', 'Player du’ Match'],
    orientation: 'portrait',
  },
  {
    id: 'notifications',
    file: 'Notification.png',
    src: screen('Notification.png'),
    title: 'Notifications',
    description: 'Stay informed about Goals, position movements and match-related activity.',
    tags: ['Goal alerts', 'Movement updates', 'Daily feed'],
    orientation: 'portrait',
  },
  {
    id: 'playground',
    file: 'Play Ground.png',
    src: screen('Play Ground.png'),
    title: 'Football Playground',
    description: 'View player positions and team performance on the football field.',
    tags: ['Live pitch view', 'My team vs opponent', 'Zoom controls'],
    orientation: 'landscape',
  },
];

export const BENEFITS = [
  {
    icon: 'Flame',
    title: 'Higher Engagement',
    text: 'Make field-force participation more exciting.',
  },
  {
    icon: 'Swords',
    title: 'Team Competition',
    text: 'Create competitive energy across territories and regions.',
  },
  {
    icon: 'Eye',
    title: 'Greater Visibility',
    text: 'Follow campaign participation and field-force activity.',
  },
  {
    icon: 'SlidersHorizontal',
    title: 'Customisable Campaigns',
    text: 'Configure brand drives around campaign objectives.',
  },
  {
    icon: 'LayoutDashboard',
    title: 'Centralised Oversight',
    text: 'Monitor campaigns through the HO dashboard and reports.',
  },
];

export const HO_CAPABILITIES = [
  {
    icon: 'LayoutDashboard',
    title: 'Campaign dashboards',
    text: 'A live view of every brand drive, team and match in one place.',
  },
  {
    icon: 'Activity',
    title: 'Performance monitoring',
    text: 'Follow player and team progress across the tournament.',
  },
  {
    icon: 'Trophy',
    title: 'Campaign & tournament setup',
    text: 'Create match rounds, assign teams and run the tournament journey.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Approval oversight',
    text: 'Review activity uploads and keep every score accountable.',
  },
  {
    icon: 'FileDown',
    title: 'Head Office reports',
    text: 'Downloadable reports for brand and sales leadership.',
  },
];

// Illustrative team names for the tournament visual. They are examples, not client results.
export const BRACKET = {
  league: [
    ['North Strikers', 'East Falcons', 'West Titans', 'South Chargers'],
    ['Central Lions', 'Coastal Waves', 'Hill Rangers', 'Metro Rockets'],
  ],
  quarterfinals: [
    ['North Strikers', 'Hill Rangers'],
    ['West Titans', 'Coastal Waves'],
    ['Central Lions', 'East Falcons'],
    ['Metro Rockets', 'South Chargers'],
  ],
  semifinals: [
    ['North Strikers', 'West Titans'],
    ['Central Lions', 'Metro Rockets'],
  ],
  final: ['North Strikers', 'Central Lions'],
};

export const TICKER_ITEMS = [
  'Brand Drives',
  'Dribbles',
  'Goals',
  'Live Match Scores',
  'Team vs Team',
  'Player Rankings',
  'Tournament Rounds',
  'Proof-Based Uploads',
  'Approval Workflows',
  'HO Dashboards',
];

// Replace with real URLs when available. When null, a placeholder dialog is shown.
export const LEGAL_LINKS = {
  privacyPolicy: null,
};

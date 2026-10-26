export const ORIGIN = 'https://opendataensemble.org';
export const DOCS = `${ORIGIN}/docs`;
export const DOWNLOADS = `${ORIGIN}/downloads`;
export const FORUM = 'https://forum.opendataensemble.org';
export const GITHUB = 'https://github.com/OpenDataEnsemble/ode';
export const LINKEDIN = 'https://www.linkedin.com/company/opendataensemble';
export const TIKTOK = 'https://www.tiktok.com/@opendataensemble';
export const SECURITY_EMAIL = 'security@opendataensemble.org';
export const HELLO_EMAIL = 'hello@opendataensemble.org';
export const GROUNDBREAKER = 'https://groundbreaker.org/';

export const GITHUB_CONTRIBUTING = `${GITHUB}/blob/main/CONTRIBUTING.md`;
export const GITHUB_ISSUES = `${GITHUB}/issues`;
export const GITHUB_PORTAL = `${GITHUB}/tree/main/synkronus-portal`;

export const docs = {
  gettingStarted: `${DOCS}/getting-started`,
  whatIsOde: `${DOCS}/getting-started/what-is-ode`,
  architecture: `${DOCS}/getting-started/architecture-overview`,
  using: `${DOCS}/using`,
  reference: `${DOCS}/reference`,
  formulus: `${DOCS}/reference/formulus`,
  formplayer: `${DOCS}/reference/formplayer`,
  synkronus: `${DOCS}/reference/synkronus-server`,
  synkronusCli: `${DOCS}/reference/synkronus-cli`,
  odeDesktop: `${DOCS}/reference/ode-desktop`,
  examples: `${DOCS}/community/examples`,
  gettingHelp: `${DOCS}/community/getting-help`,
  installation: `${DOCS}/development/installation`,
  quickStart: `${DOCS}/development/quick-start`,
  setup: `${DOCS}/development/setup`,
  privacy: `${DOCS}/legal/formulus-privacy-policy`,
  terms: `${DOCS}/legal/formulus-terms`,
  accountDeletion: `${DOCS}/legal/formulus-account-deletion`,
  license: `${DOCS}/legal/open-source-license`,
} as const;

export const pageLinks = [
  { href: '/about', label: 'About' },
  { href: '/community', label: 'Community' },
  { href: '/contact', label: 'Contact' },
];

export const faqs = [
  {
    question: 'What is Open Data Ensemble?',
    answer:
      'ODE is a set of open-source tools for collecting and synchronizing field data. Formulus is the mobile app, Synkronus is the server that connects your devices, and ODE Desktop, the Portal, and the CLI are for managing the work. They share one public API, so data can move into tools you already use.',
  },
  {
    question: 'Does it really work without internet?',
    answer:
      'Yes. Formulus is offline-first: forms and custom app bundles run on the device, and observations and attachments are stored locally. You need a connection for initial setup, downloading bundles, and synchronizing, but not for everyday field collection once you’re set up.',
  },
  {
    question: 'Can I host it myself?',
    answer:
      'Yes. You can deploy Synkronus on your own infrastructure with Docker and point the ODE clients at that server. You are responsible for the deployment, access controls, backups, and hosting costs. The documentation covers the architecture and setup.',
  },
  {
    question: 'Can I build my own forms and apps?',
    answer:
      'Yes. Define forms with JSON Schema and JSON Forms, or build a custom HTML, CSS, and JavaScript app bundle. Formulus stores observations, attachments, and handles synchronization. ODE Desktop includes a workbench for local development.',
  },
];

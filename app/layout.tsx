import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import '@ode/tokens/css';
import { themeColor } from '@ode/tokens';
import '../src/styles.css';
import '../src/FieldGlobe.css';
import { asset } from '../src/asset';
import BackToTop from '../src/BackToTop';
import SiteFooter from '../src/SiteFooter';
import SiteHeader from '../src/SiteHeader';

const socialTitle = 'ODE · Open Data Ensemble';
const socialDescription =
  'Collect observations offline, sync them when a connection returns, and keep the data on infrastructure you control.';
const socialImage = {
  // Use the deployed Pages project URL, including its base path, in every build.
  url: 'https://opendataensemble.github.io/website/brand/og.png',
  width: 1200,
  height: 630,
  alt: 'Open Data Ensemble — Open-source field data tools. Good data. From the field. Offline.',
};

export const metadata: Metadata = {
  title: {
    default: socialTitle,
    template: '%s · ODE',
  },
  description:
    'Open-source tools for collecting and syncing field data when the network is unreliable. Formulus on the phone, Synkronus to bring observations together.',
  icons: {
    icon: {
      url: asset('/favicon.ico'),
      type: 'image/x-icon',
      sizes: '16x16 32x32 48x48',
    },
    apple: {
      url: asset('/apple-touch-icon.png'),
      type: 'image/png',
      sizes: '180x180',
    },
  },
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    type: 'website',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description: socialDescription,
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  themeColor,
  width: 'device-width',
  initialScale: 1,
};

const inter = localFont({
  src: [
    {
      path: './fonts/InterVariable.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: './fonts/InterVariable-Italic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif',
  ],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <BackToTop />
      </body>
    </html>
  );
}

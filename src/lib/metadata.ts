import type { Metadata } from 'next';

// Next.js replaces the root layout's `openGraph` outright when a page sets its
// own, so pages that do spread this to keep the shared fields.
export const siteOpenGraph = {
  type: 'website',
  siteName: 'Multiborder',
  url: './',
  locale: 'en_US',
} satisfies Metadata['openGraph'];

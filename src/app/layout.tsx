import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'Multiborder',
  description:
    'Easily add borders to multiple images, preserving aspect ratio to optimize for social media posts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      className={`${spaceMono.variable} antialiased bg-stone-800`}
      lang='en'
    >
      <body>
        {children}
        {GA_ID && (
          <>
            <Script
              strategy='afterInteractive'
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id='ga-init'
              strategy='afterInteractive'
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}

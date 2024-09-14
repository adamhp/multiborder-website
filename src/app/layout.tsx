import type { Metadata } from "next";
import "./globals.css";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Multiborder",
  description:
    "Easily add borders to multiple images, preserving aspect ratio to optimize for social media posts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${spaceMono.variable} antialiased bg-stone-800`}
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}

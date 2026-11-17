import type { MetadataRoute } from 'next';
import { posts } from '@/content/blog';

const base = 'https://www.multiborder.io';

const pages: [path: string, priority: number][] = [
  ['', 1],
  ['/editor', 0.8],
  ['/features', 0.6],
  ['/reviews', 0.5],
  ['/blog', 0.5],
  ['/support', 0.3],
  ['/feedback', 0.2],
  ['/about', 0.2],
  ['/privacy', 0.1],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map(([path, priority]) => ({ url: base + path, priority })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.date, priority: 0.6 })),
  ];
}

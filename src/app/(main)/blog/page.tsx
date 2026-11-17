import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { formatDate, posts } from '@/content/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Guides to adding borders, captions and the right aspect ratio to your photos for Instagram and beyond.',
};

export default function BlogPage() {
  return (
    <Container className='py-16'>
      <div className='mx-auto max-w-prose'>
        <h1 className='text-3xl text-stone-100'>Blog</h1>
        <ul className='mt-12 space-y-12'>
          {posts.map((p) => (
            <li key={p.slug}>
              <time dateTime={p.date} className='text-sm text-stone-400'>{formatDate(p.date)}</time>
              <h2 className='mt-2 text-xl font-medium'>
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h2>
              <p className='mt-2 text-stone-300'>{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { appUrl, siteUrl } from '@/constants';
import { siteOpenGraph } from '@/lib/metadata';
import { findPost, formatDate, posts } from '@/content/blog';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = findPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      ...siteOpenGraph,
      type: 'article',
      publishedTime: post.date,
      // The root's generated share image isn't inherited once a page sets openGraph.
      images: '/opengraph-image',
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = findPost((await params).slug);
  if (!post) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Adam', url: `${siteUrl}/about` },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <Container className='py-16'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <article className='prose prose-stone prose-invert mx-auto'>
        <time dateTime={post.date} className='text-sm text-stone-400'>{formatDate(post.date)}</time>
        <h1 className='mt-2 text-balance'>{post.title}</h1>
        {post.body}
      </article>
      <div className='mx-auto mt-16 flex max-w-prose flex-wrap gap-4'>
        <Button href='/editor'>Try the web editor</Button>
        <Button href={appUrl} variant='outline'>Get the iPhone app</Button>
      </div>
    </Container>
  );
}

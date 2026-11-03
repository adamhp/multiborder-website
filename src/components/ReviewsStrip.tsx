import Link from 'next/link';

import { Container } from '@/components/Container';
import { appStoreRating, homeReviews } from '@/content/reviews';

export function ReviewsStrip() {
  return (
    <section aria-label='Reviews' className='pb-20 sm:pb-28'>
      <Container>
        <div className='grid grid-cols-1 gap-4 text-sm/6 sm:grid-cols-2 lg:grid-cols-[220px_repeat(3,minmax(0,1fr))]'>
          <div className='flex flex-col justify-center gap-1 rounded-2xl bg-amber-600/15 p-6 ring-1 ring-amber-600/35 sm:col-span-2 lg:col-span-1'>
            <p className='text-5xl font-semibold tracking-tight text-stone-100'>
              {appStoreRating}
            </p>
            <p aria-hidden='true' className='text-xl tracking-wider text-amber-500'>
              ★★★★★
            </p>
            <p className='text-stone-300'>
              <span className='sr-only'>{`Rated ${appStoreRating} out of 5: `}</span>
              App Store rating
            </p>
          </div>
          {homeReviews.map((review) => (
            <figure
              key={review.author}
              className='flex flex-col justify-between gap-6 rounded-2xl bg-stone-800/75 p-6 ring-1 ring-white/10'
            >
              <blockquote className='text-stone-100'>
                <p>{`“${review.body}”`}</p>
              </blockquote>
              <figcaption className='flex items-center justify-between gap-x-4 border-t border-white/10 pt-4'>
                <span className='text-stone-400'>{review.author}</span>
                <span className='text-xs text-stone-500'>{review.source}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className='mt-8 text-center text-sm font-medium'>
          <Link href='/reviews'>Read all reviews →</Link>
        </p>
      </Container>
    </section>
  );
}

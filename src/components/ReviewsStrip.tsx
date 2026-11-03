'use client';

import Link from 'next/link';
import { useState } from 'react';

import { allReviews, type Review } from '@/content/reviews';

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className='flex w-72 shrink-0 flex-col justify-between gap-6 rounded-2xl bg-stone-800/75 p-6 text-sm/6 ring-1 ring-white/10 sm:w-80'>
      <blockquote className='text-stone-100'>
        <p>{`“${review.body}”`}</p>
      </blockquote>
      <figcaption className='flex items-center justify-between gap-x-4 border-t border-white/10 pt-4'>
        <span className='text-stone-400'>{review.author}</span>
        <span className='text-xs text-stone-500'>{review.source}</span>
      </figcaption>
    </figure>
  );
}

// Every review in a slow, endless row. The list is rendered twice so the -50% loop is seamless;
// the copy is hidden from assistive tech. The Pause button (and hovering, or focus inside) stops it,
// and with reduced motion it stops and becomes a row you can scroll sideways.
export function ReviewsStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-label='Reviews' className='pb-20 sm:pb-28'>
      <div className='overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]'>
        <div
          className='flex w-max animate-marquee-x py-2 [--marquee-duration:70s] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:px-4'
          style={paused ? { animationPlayState: 'paused' } : undefined}
        >
          <ul className='flex gap-4 pr-4'>
            {allReviews.map((review) => (
              <li key={review.author} className='flex'>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
          <ul aria-hidden='true' className='flex gap-4 pr-4 motion-reduce:hidden'>
            {allReviews.map((review) => (
              <li key={review.author} className='flex'>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='mt-8 flex items-center justify-center gap-6 text-sm font-medium'>
        <button
          type='button'
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          className='rounded-full px-3 py-1 text-stone-400 ring-1 ring-white/15 hover:text-stone-100 focus-visible:outline-2 focus-visible:outline-amber-500 motion-reduce:hidden'
        >
          {paused ? 'Play reviews' : 'Pause reviews'}
        </button>
        <Link href='/reviews'>Read all reviews →</Link>
      </div>
    </section>
  );
}

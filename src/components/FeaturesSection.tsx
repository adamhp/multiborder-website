import clsx from 'clsx';

import { Container } from '@/components/Container';
import { SpotlightVideo } from '@/components/SpotlightVideo';
import { spotlights, tiles } from '@/content/features';

export function FeaturesSection() {
  return (
    <section id='features' aria-labelledby='features-title' className='scroll-mt-8 pb-24 sm:pb-32'>
      <Container>
        <div className='mx-auto max-w-2xl text-center'>
          <p className='text-base/7 font-semibold text-amber-600'>New in 3.0</p>
          <h2
            id='features-title'
            className='mt-2 text-3xl tracking-tight text-balance text-stone-100 sm:text-4xl'
          >
            More ways to make every border yours
          </h2>
        </div>

        <div className='mt-16 space-y-16 sm:mt-20 lg:space-y-24'>
          {spotlights.map((spotlight, index) => (
            <div
              key={spotlight.title}
              className='grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16'
            >
              <div className={clsx('min-w-0', index % 2 === 1 && 'lg:order-2')}>
                <h3 className='text-2xl font-medium tracking-tight text-stone-100'>
                  {spotlight.title}
                </h3>
                <p className='mt-4 text-stone-300'>{spotlight.body}</p>
                <ul className='mt-6 space-y-2 text-sm text-stone-400'>
                  {spotlight.points.map((point) => (
                    <li key={point} className='flex gap-3'>
                      <span aria-hidden='true' className='text-amber-500'>
                        —
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <SpotlightVideo
                src={spotlight.video}
                poster={spotlight.poster}
                label={spotlight.videoLabel}
              />
            </div>
          ))}
        </div>

        <ul className='mt-20 grid grid-cols-1 gap-4 sm:mt-24 sm:grid-cols-2 lg:grid-cols-3'>
          {tiles.map((tile) => (
            <li
              key={tile.title}
              className='rounded-2xl bg-stone-800/75 p-6 ring-1 ring-white/10'
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/15 ring-1 ring-amber-600/35'>
                <tile.icon aria-hidden='true' className='h-6 w-6' />
              </div>
              <h3 className='mt-4 font-semibold text-stone-100'>{tile.title}</h3>
              <p className='mt-2 text-sm text-stone-400'>{tile.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

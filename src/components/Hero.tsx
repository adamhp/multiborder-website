import { useId } from 'react';

import { AppDemo } from '@/components/AppDemo';
import { Container } from '@/components/Container';
import { PhoneFrame } from '@/components/PhoneFrame';

// import { NewsletterSignup } from './NewsletterSignup';
import { QrDownload } from './QrDownload';
import { Button } from './Button';
import Link from 'next/link';

function BackgroundIllustration(props: React.ComponentPropsWithoutRef<'div'>) {
  const id = useId();

  return (
    <div {...props}>
      <svg
        viewBox='0 0 1026 1026'
        fill='none'
        aria-hidden='true'
        className='absolute inset-0 h-full w-full animate-spin-slow'
      >
        <path
          d='M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z'
          stroke='#D4D4D4'
          strokeOpacity='0.7'
        />
        <path
          d='M513 1025C230.23 1025 1 795.77 1 513'
          stroke={`url(#${id}-gradient-1)`}
          strokeLinecap='round'
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-1`}
            x1='1'
            y1='513'
            x2='1'
            y2='1025'
            gradientUnits='userSpaceOnUse'
          >
            <stop stopColor='#d97706' />
            <stop offset='1' stopColor='#d97706' stopOpacity='0' />
          </linearGradient>
        </defs>
      </svg>
      <svg
        viewBox='0 0 1026 1026'
        fill='none'
        aria-hidden='true'
        className='absolute inset-0 h-full w-full animate-spin-reverse-slower'
      >
        <path
          d='M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z'
          stroke='#D4D4D4'
          strokeOpacity='0.7'
        />
        <path
          d='M913 513c0 220.914-179.086 400-400 400'
          stroke={`url(#${id}-gradient-2)`}
          strokeLinecap='round'
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-2`}
            x1='913'
            y1='513'
            x2='913'
            y2='913'
            gradientUnits='userSpaceOnUse'
          >
            <stop stopColor='#d97706' />
            <stop offset='1' stopColor='#d97706' stopOpacity='0' />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <div className='overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36'>
      <Container>
        <div className='lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20'>
          <div className='lg:hidden relative -mt-24'>
            <BackgroundIllustration className='absolute left-1/2 top-4 h-[700px] w-[700px] -translate-x-1/2 stroke-stone-400/70 [mask-image:linear-gradient(to_bottom,white_10%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg: xl:-top-14 xl:ml-0' />
            <div className='h-[700px] px-9 lg:[mask-image:linear-gradient(to_bottom,white_80%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-top-32 lg:h-auto lg:px-0 lg:-bottom-32'>
              <PhoneFrame className='mx-auto max-w-[393px]' priority>
                <AppDemo />
              </PhoneFrame>
            </div>
          </div>
          <div className='relative -mt-16 z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6'>
            <div className='w-full flex flex-row items-center justify-center mb-12'>
              <Link href='/features'>
                <Button variant='outline'>See more features</Button>
              </Link>
            </div>
            <h1 className='text-3xl text-center lg:text-4xl lg:text-left font-medium tracking-tight text-stone-100'>
              Easily add borders to multiple images
            </h1>
            <p className='mt-6 text-lg text-stone-300'>
              Multiborder is an iOS app that makes adding borders to multiple
              images quick and easy. With just a few taps, adjust aspect ratio,
              border size, and color, then download the results for seamless
              sharing.
            </p>
            <div className='hidden md:block mt-12 w-min mx-0 md:mx-auto lg:mx-0'>
              <QrDownload />
            </div>
          </div>
          <div className='hidden relative lg:block mt-10 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6'>
            <BackgroundIllustration className='absolute left-1/2 top-4 h-[700px] w-[700px] -translate-x-1/2 stroke-stone-400/70 [mask-image:linear-gradient(to_bottom,white_10%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg: xl:-top-14 xl:ml-0' />
            <div className='h-[700px] px-9 lg:[mask-image:linear-gradient(to_bottom,white_80%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-top-32 lg:h-auto lg:px-0 lg:-bottom-32'>
              <PhoneFrame className='mx-auto max-w-[393px]' priority>
                <AppDemo />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </Container>
      {/* <div className='mt-32'>
        <NewsletterSignup />
      </div> */}
    </div>
  );
}

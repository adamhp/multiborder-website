'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { useDebouncedCallback } from 'use-debounce';

import { AppScreen } from '@/components/AppScreen';
import { CircleBackground } from '@/components/CircleBackground';
import { Container } from '@/components/Container';
import { PhoneFrame } from '@/components/PhoneFrame';
import { motion } from 'framer-motion';
import { AppStoreLink } from './AppStoreLink';
import { QrDownload } from './QrDownload';

const features = [
  {
    name: 'Edit multiple photos at a time',
    description:
      'Select multiple images at a time to streamline your workflow (only limited by what your phone can handle!)',
    icon: MultiplePhotosIcon,
    screen: MultiselectScreen,
  },
  {
    name: 'Simple controls',
    description:
      'With a few sliders and buttons, control border sizing, color, aspect ratio, and export size. You’ll have bordered images in minutes.',
    icon: EditIcon,
    screen: EditScreen,
  },
  {
    name: 'Quick configurable exports',
    description:
      'Quickly configure your desired long-edge size and download the results.',
    icon: ExportIcon,
    screen: ExportScreen,
  },
];

function MultiplePhotosIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg version='1.1' width='23.9648' height='24.7363' {...props}>
      <g>
        <rect height='24.7363' opacity={0} width='23.9648' x={0} y={0} />
        <path
          d='M17.9647 2.79297L5.63882 2.79297C5.6789 1.99929 6.17978 1.54297 7.01172 1.54297L16.5918 1.54297C17.4237 1.54297 17.9246 1.99929 17.9647 2.79297Z'
          fill='#ffffff'
          fillOpacity='0.85'
        />
        <path
          d='M19.9623 5.5825C19.6482 5.53257 19.3151 5.50781 18.9648 5.50781L4.63867 5.50781C4.2885 5.50781 3.95544 5.53256 3.64145 5.58247C3.74778 4.64426 4.38263 4.12109 5.41992 4.12109L18.1934 4.12109C19.2307 4.12109 19.8575 4.64428 19.9623 5.5825Z'
          fill='#ffffff'
          fillOpacity='0.85'
        />
        <path
          d='M4.77539 22.8906L18.8477 22.8906C20.6836 22.8906 21.6504 21.9531 21.6504 20.1172L21.6504 19.4434L16.7773 14.834C16.377 14.4531 15.8691 14.2676 15.3613 14.2676C14.834 14.2676 14.375 14.4336 13.9453 14.8242L9.6875 18.5742L7.99805 17.0605C7.59766 16.6992 7.17773 16.5137 6.71875 16.5137C6.29883 16.5137 5.91797 16.709 5.51758 17.0508L1.97266 20.1172C1.97266 21.9531 2.93945 22.8906 4.77539 22.8906ZM4.63867 23.1641L18.9648 23.1641C21.0059 23.1641 22.0312 22.1484 22.0312 20.1367L22.0312 10.1074C22.0312 8.0957 21.0059 7.08008 18.9648 7.08008L4.63867 7.08008C2.59766 7.08008 1.57227 8.0957 1.57227 10.1074L1.57227 20.1367C1.57227 22.1484 2.59766 23.1641 4.63867 23.1641ZM4.66797 21.5918C3.69141 21.5918 3.14453 21.0645 3.14453 20.0488L3.14453 10.1953C3.14453 9.17969 3.69141 8.65234 4.66797 8.65234L18.9453 8.65234C19.9023 8.65234 20.459 9.17969 20.459 10.1953L20.459 20.0488C20.459 21.0645 19.9023 21.5918 18.9453 21.5918Z'
          fill='#ffffff'
          fillOpacity='0.85'
        />
        <path
          d='M8.93555 15.0684C10.166 15.0684 11.1621 14.043 11.1621 12.8223C11.1621 11.6016 10.166 10.5957 8.93555 10.5957C7.69531 10.5957 6.69922 11.6016 6.69922 12.8223C6.69922 14.043 7.69531 15.0684 8.93555 15.0684Z'
          fill='#ffffff'
          fillOpacity='0.85'
        />
      </g>
    </svg>
  );
}

function EditIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg {...props} version='1.1' width='20.0391' height='16.6504'>
      <g>
        <rect height='16.6504' opacity={0} width='20.0391' x={0} y={0} />
        <path
          d='M13.3398 16.6504C14.6289 16.6504 15.6836 15.5957 15.6836 14.3066C15.6836 13.0176 14.6289 11.9629 13.3398 11.9629C12.0508 11.9629 10.9863 13.0176 10.9863 14.3066C10.9863 15.5957 12.0508 16.6504 13.3398 16.6504ZM13.3398 15.4492C12.6953 15.4492 12.1973 14.9414 12.1973 14.3066C12.1973 13.6523 12.6953 13.1641 13.3398 13.1641C13.9844 13.1641 14.4824 13.6523 14.4824 14.3066C14.4824 14.9414 13.9844 15.4492 13.3398 15.4492ZM11.7871 13.5156L0.78125 13.5156C0.341797 13.5156 0 13.8672 0 14.3066C0 14.7461 0.341797 15.0879 0.78125 15.0879L11.7871 15.0879ZM18.9258 13.5156L15.0391 13.5156L15.0391 15.0879L18.9258 15.0879C19.3262 15.0879 19.6777 14.7461 19.6777 14.3066C19.6777 13.8672 19.3262 13.5156 18.9258 13.5156ZM6.44531 10.6934C7.73438 10.6934 8.78906 9.62891 8.78906 8.33984C8.78906 7.05078 7.73438 5.99609 6.44531 5.99609C5.15625 5.99609 4.10156 7.05078 4.10156 8.33984C4.10156 9.62891 5.15625 10.6934 6.44531 10.6934ZM6.44531 9.48242C5.81055 9.48242 5.30273 8.97461 5.30273 8.33984C5.30273 7.69531 5.81055 7.19727 6.44531 7.19727C7.08984 7.19727 7.58789 7.69531 7.58789 8.33984C7.58789 8.97461 7.08984 9.48242 6.44531 9.48242ZM0.742188 7.54883C0.341797 7.54883 0 7.90039 0 8.33984C0 8.7793 0.341797 9.12109 0.742188 9.12109L4.76562 9.12109L4.76562 7.54883ZM18.8867 7.54883L7.99805 7.54883L7.99805 9.12109L18.8867 9.12109C19.3262 9.12109 19.6777 8.7793 19.6777 8.33984C19.6777 7.90039 19.3262 7.54883 18.8867 7.54883ZM13.3398 4.7168C14.6289 4.7168 15.6836 3.66211 15.6836 2.37305C15.6836 1.08398 14.6289 0.0195312 13.3398 0.0195312C12.0508 0.0195312 10.9863 1.08398 10.9863 2.37305C10.9863 3.66211 12.0508 4.7168 13.3398 4.7168ZM13.3398 3.51562C12.6953 3.51562 12.1973 3.00781 12.1973 2.36328C12.1973 1.71875 12.6953 1.2207 13.3398 1.2207C13.9844 1.2207 14.4824 1.71875 14.4824 2.36328C14.4824 3.00781 13.9844 3.51562 13.3398 3.51562ZM11.8359 1.5918L0.78125 1.5918C0.341797 1.5918 0 1.93359 0 2.37305C0 2.8125 0.341797 3.16406 0.78125 3.16406L11.8359 3.16406ZM18.9258 1.5918L14.9023 1.5918L14.9023 3.16406L18.9258 3.16406C19.3262 3.16406 19.6777 2.8125 19.6777 2.37305C19.6777 1.93359 19.3262 1.5918 18.9258 1.5918Z'
          fill='#ffffff'
          fillOpacity='0.85'
        />
      </g>
    </svg>
  );
}

function ExportIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg {...props} version='1.1' width='17.6953' height='25.3418'>
      <g>
        <rect height='25.3418' opacity={0} width='17.6953' x={0} y={0} />
        <path
          d='M17.334 10.1953L17.334 19.9414C17.334 21.9531 16.3086 22.9688 14.2676 22.9688L3.06641 22.9688C1.02539 22.9688 0 21.9531 0 19.9414L0 10.1953C0 8.18359 1.02539 7.16797 3.06641 7.16797L6.00586 7.16797L6.00586 8.74023L3.08594 8.74023C2.10938 8.74023 1.57227 9.26758 1.57227 10.2832L1.57227 19.8535C1.57227 20.8691 2.10938 21.3965 3.08594 21.3965L14.2383 21.3965C15.2051 21.3965 15.7617 20.8691 15.7617 19.8535L15.7617 10.2832C15.7617 9.26758 15.2051 8.74023 14.2383 8.74023L11.3281 8.74023L11.3281 7.16797L14.2676 7.16797C16.3086 7.16797 17.334 8.18359 17.334 10.1953Z'
          fill='#ffffff'
          fillOpacity='0.85'
        />
        <path
          d='M8.66211 16.543C8.86719 16.543 9.0332 16.4844 9.22852 16.2891L12.5293 13.0957C12.6758 12.9492 12.7637 12.793 12.7637 12.5879C12.7637 12.1875 12.4512 11.9043 12.0508 11.9043C11.8555 11.9043 11.6602 11.9824 11.5234 12.1387L10.0391 13.7109L9.38477 14.4043L9.44336 12.9395L9.44336 2.64648C9.44336 2.23633 9.08203 1.88477 8.66211 1.88477C8.24219 1.88477 7.89062 2.23633 7.89062 2.64648L7.89062 12.9395L7.94922 14.4043L7.28516 13.7109L5.81055 12.1387C5.67383 11.9824 5.45898 11.9043 5.27344 11.9043C4.86328 11.9043 4.57031 12.1875 4.57031 12.5879C4.57031 12.793 4.64844 12.9492 4.79492 13.0957L8.0957 16.2891C8.30078 16.4844 8.4668 16.543 8.66211 16.543Z'
          fill='#ffffff'
          fillOpacity='0.85'
        />
      </g>
    </svg>
  );
}

function MultiselectScreen() {
  return (
    <AppScreen>
      <video
        width='393'
        height='952'
        playsInline
        muted
        preload='none'
        autoPlay
        loop
      >
        <source src='/feature1.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    </AppScreen>
  );
}

function EditScreen() {
  return (
    <AppScreen>
      <video
        width='393'
        height='952'
        playsInline
        muted
        preload='none'
        autoPlay
        loop
      >
        <source src='/feature2.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    </AppScreen>
  );
}

function ExportScreen() {
  return (
    <AppScreen>
      <video
        width='393'
        height='952'
        playsInline
        muted
        preload='none'
        autoPlay
        loop
      >
        <source src='/feature3.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    </AppScreen>
  );
}

function FeaturesDesktop() {
  const [changeCount, setChangeCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onChange = useDebouncedCallback(
    (selectedIndex) => {
      setSelectedIndex(selectedIndex);
      setChangeCount((changeCount) => changeCount + 1);
    },
    100,
    { leading: true },
  );

  return (
    <TabGroup
      className='grid grid-cols-12 items-center gap-8 lg:gap-16 xl:gap-24'
      selectedIndex={selectedIndex}
      onChange={onChange}
      vertical
    >
      <TabList className='relative z-10 order-last col-span-6 space-y-6'>
        {features.map((feature, featureIndex) => (
          <div
            key={feature.name}
            className='relative rounded-2xl transition-colors hover:bg-stone-700'
          >
            {featureIndex === selectedIndex && (
              <motion.div
                layoutId='activeBackground'
                className='absolute inset-0 bg-stone-900'
                initial={{ borderRadius: 16 }}
              />
            )}
            <div className='relative z-10 p-8'>
              <feature.icon className='h-8 w-8' />
              <h3 className='mt-6 text-lg font-semibold text-stone-50'>
                <Tab className='text-left ui-not-focus-visible:outline-none'>
                  <span className='absolute inset-0 rounded-2xl' />
                  {feature.name}
                </Tab>
              </h3>
              <p className='mt-2 text-stone-300'>{feature.description}</p>
            </div>
          </div>
        ))}
      </TabList>
      <div className='relative col-span-6'>
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
          <CircleBackground color='#d97706' className='animate-spin-slower' />
        </div>
        <PhoneFrame className='z-10 mx-auto w-full max-w-[393px]'>
          <TabPanels as={Fragment}>
            {features.map((feature, featureIndex) =>
              selectedIndex === featureIndex ? (
                <TabPanel
                  static
                  key={feature.name + changeCount}
                  className='col-start-1 row-start-1 flex focus:outline-offset-[32px] ui-not-focus-visible:outline-none'
                >
                  <feature.screen />
                </TabPanel>
              ) : null,
            )}
          </TabPanels>
        </PhoneFrame>
      </div>
    </TabGroup>
  );
}

function FeaturesMobile() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideContainerRef = useRef<React.ElementRef<'div'>>(null);
  const slideRefs = useRef<React.ElementRef<'div'>[]>([]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target instanceof HTMLDivElement) {
            setActiveIndex(slideRefs.current.indexOf(entry.target));
            break;
          }
        }
      },
      {
        root: slideContainerRef.current,
        threshold: 0.6,
      },
    );

    for (const slide of slideRefs.current) {
      if (slide) {
        observer.observe(slide);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [slideContainerRef, slideRefs]);

  return (
    <>
      <div
        ref={slideContainerRef}
        className='flex snap-x snap-mandatory -space-x-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] sm:-space-x-6 [&::-webkit-scrollbar]:hidden'
      >
        {features.map((feature, featureIndex) => (
          <div
            key={featureIndex}
            ref={(ref) => {
              if (ref) {
                slideRefs.current[featureIndex] = ref;
              }
            }}
            className='h-[75vh] w-full flex-none snap-center '
          >
            <div className='-mt-12 md:mt-0 relative transform rounded-2xl bg-stone-800 p-2'>
              <div className='h-[60vh] [mask-image:linear-gradient(to_bottom,white_60%,transparent)]'>
                <PhoneFrame className='relative mx-auto w-full max-w-[300px] md:max-w-[393px]'>
                  <feature.screen />
                </PhoneFrame>
              </div>
              <div className='h-min absolute inset-x-0 -bottom-40 p-6 backdrop-blur sm:p-10'>
                <feature.icon className='h-6 w-6 mb-4' />
                <h3 className='text-sm font-semibold text-stone-100 sm:text-lg'>
                  {feature.name}
                </h3>
                <p className='mt-2 text-sm text-stone-400'>
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className='absolute bottom-0 inset-x-0 mt-6 flex justify-center gap-3'>
          {features.map((_, featureIndex) => (
            <button
              type='button'
              key={featureIndex}
              className={clsx(
                'relative h-0.5 w-4 rounded-full',
                featureIndex === activeIndex ? 'bg-stone-300' : 'bg-stone-500',
              )}
              aria-label={`Go to slide ${featureIndex + 1}`}
              onClick={() => {
                slideRefs.current[featureIndex].scrollIntoView({
                  block: 'nearest',
                  inline: 'nearest',
                });
              }}
            >
              <span className='absolute -inset-x-1.5 -inset-y-3' />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function PrimaryFeatures() {
  return (
    <section
      id='features'
      aria-label='Features for investing all your money'
      className='bg-stone-800 md:pt-8 pb-32 sm:pb-32'
    >
      <Container>
        <div className='mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl'>
          <h2 className='text-center text-xl md:text-left md:text-3xl font-medium tracking-tight text-stone-100'>
            Simple. Free. Borders.
          </h2>
          <p className='mt-2 text-lg text-stone-300 hidden md:block'>
            Fed up with bloated, complicated apps when you just need borders?
            Built by a photographer, multiborder lets you easily add borders of
            various size and color to multiple images at a time, configure
            aspect ratio, and export to commonly used social media sizes.
          </p>
        </div>
      </Container>
      <div className='mt-8 md:hidden'>
        <FeaturesMobile />
      </div>
      <Container className='hidden md:mt-20 md:block'>
        <FeaturesDesktop />
      </Container>
      <p className='mt-16 text-lg text-stone-300 md:hidden'>
        Fed up with bloated, complicated apps when you just need borders? Built
        by a photographer, multiborder lets you easily add borders of various
        size and color to multiple images at a time, configure aspect ratio, and
        export to commonly used social media sizes.
      </p>
      <div className='hidden md:block mt-24 w-min mx-auto'>
        <QrDownload />
      </div>
      <div className='block md:hidden mt-24 mx-auto w-min bg-stone-950 rounded-2xl'>
        <AppStoreLink />
      </div>
    </section>
  );
}

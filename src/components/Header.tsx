'use client';

import Link from 'next/link';
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Logo } from '@/components/Logo';
import { NavLinks } from '@/components/NavLinks';
import { appUrl } from '../constants';

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox='0 0 24 24' fill='none' aria-hidden='true' {...props}>
      <path
        d='M5 6h14M5 18h14M5 12h14'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function ChevronUpIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox='0 0 24 24' fill='none' aria-hidden='true' {...props}>
      <path
        d='M17 14l-5-5-5 5'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function MobileNavLink(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof PopoverButton<typeof Link>>,
    'as' | 'className'
  >,
) {
  return (
    <PopoverButton
      as={Link}
      className='block text-base leading-7 tracking-tight text-stone-300'
      {...props}
    />
  );
}

export function Header() {
  return (
    <header>
      <nav>
        <Container className='relative z-50 flex justify-between py-8'>
          <div className='relative z-10 flex items-center gap-16'>
            <Link href='/' aria-label='Home'>
              <Logo className='h-10 w-auto' />
            </Link>
            <div className='hidden lg:flex lg:gap-10'>
              <NavLinks />
            </div>
          </div>
          <div className='flex items-center gap-6'>
            <Popover className='lg:hidden'>
              {({ open }) => (
                <>
                  <PopoverButton
                    className='relative z-10 -m-2 inline-flex items-center rounded-lg stroke-stone-500 p-2 hover:bg-gray-900 hover:stroke-stone-400 active:stroke-stone-900 ui-not-focus-visible:outline-none'
                    aria-label='Toggle site navigation'
                  >
                    {({ open }) =>
                      open ? (
                        <ChevronUpIcon className='h-6 w-6' />
                      ) : (
                        <MenuIcon className='h-6 w-6' />
                      )
                    }
                  </PopoverButton>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <PopoverBackdrop
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='fixed inset-0 z-0 bg-gray-300/60 backdrop-blur'
                        />
                        <PopoverPanel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className='absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-stone-700 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20'
                        >
                          <div className='space-y-4'>
                            <MobileNavLink href={appUrl}>
                              Features
                            </MobileNavLink>
                            <MobileNavLink href='/#features'>
                              Features
                            </MobileNavLink>
                            <MobileNavLink href='/#reviews'>
                              Reviews
                            </MobileNavLink>
                            <MobileNavLink href='/#faqs'>FAQs</MobileNavLink>
                          </div>
                          <div className='mt-8 flex flex-col gap-4'>
                            <Button href={appUrl}>Download the app</Button>
                          </div>
                        </PopoverPanel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>
          </div>
        </Container>
      </nav>
    </header>
  );
}

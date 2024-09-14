import { Container } from '@/components/Container';
import { Logomark } from '@/components/Logo';
import Link from 'next/link';
import { AppStoreLink } from './AppStoreLink';

export function Footer() {
  return (
    <footer>
      <Container>
        <div className='flex flex-col-reverse space-y-8 md:space-y-0 items-center border-t border-amber-600 pb-12 pt-8 md:flex-row-reverse md:justify-between md:pt-6'>
          <div className='flex flex-col items-center lg:items-end'>
            <p className='mt-6 text-sm text-stone-400 md:mt-0'>
              &copy; Copyright {new Date().getFullYear()}. All rights reserved.
            </p>
            <Link
              className='hover:text-amber-600 text-amber-500 mt-6 text-sm md:mt-0'
              href='/privacy'
            >
              Privacy Policy
            </Link>
          </div>

          <div className='flex flex-col space-y-2 lg:flex-row lg:space-y-0 items-center text-stone-100'>
            <Logomark className='h-10 w-10 flex-none fill-amber-500' />
            <div className='lg:ml-4'>
              <p className='text-base font-semibold w-full text-center lg:text-start'>
                multiborder
              </p>
              <p className='mt-1 text-sm'>
                Easily add borders to multiple images.
              </p>
            </div>
          </div>
          <div className='block md:hidden mt-24 mx-auto w-min bg-stone-950 rounded-2xl'>
            <AppStoreLink />
          </div>
        </div>
      </Container>
    </footer>
  );
}

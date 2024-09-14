import Image from 'next/image';
import qrCode from '@/images/qr-code.png';
import { appUrl } from '../constants';
import Link from 'next/link';

export function QrDownload() {
  return (
    <div className='flex flex-none group relative items-center p-4 transition-colors bg-stone-900 hover:bg-stone-700 rounded-2xl w-[400px]'>
      <div className='relative flex h-24 w-24 flex-none items-center justify-center'>
        <QrCodeBorder className='absolute -inset-2 h-28 w-28 stroke-stone-300 transition-colors group-hover:stroke-amber-500' />
        <Image src={qrCode} alt='' unoptimized />
      </div>
      <div className='ml-8 lg:w-64'>
        <p className='text-base font-semibold text-stone-100'>
          <Link href={appUrl}>
            <span className='absolute inset-0' />
            Download the app
          </Link>
        </p>
        <p className='mt-1 text-sm text-stone-300 max-w-sm'>
          Click here or scan the QR code to download the app from the App Store.
        </p>
      </div>
    </div>
  );
}

function QrCodeBorder(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox='0 0 96 96' fill='none' aria-hidden='true' {...props}>
      <path
        d='M1 17V9a8 8 0 0 1 8-8h8M95 17V9a8 8 0 0 0-8-8h-8M1 79v8a8 8 0 0 0 8 8h8M95 79v8a8 8 0 0 1-8 8h-8'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );
}

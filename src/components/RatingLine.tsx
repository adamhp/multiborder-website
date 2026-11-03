import clsx from 'clsx';

import { appUrl } from '@/constants';
import { appStoreRating } from '@/content/reviews';

export function RatingLine({ className }: { className?: string }) {
  return (
    <a
      href={appUrl}
      className={clsx(
        'inline-flex items-center gap-2 text-sm',
        className,
      )}
    >
      <span aria-hidden='true' className='tracking-wider text-amber-500'>
        ★★★★★
      </span>
      <span className='sr-only'>{`Rated ${appStoreRating} out of 5 on the App Store`}</span>
      <span aria-hidden='true'>
        <span className='font-semibold text-stone-100'>{appStoreRating}</span> on the App Store
      </span>
    </a>
  );
}

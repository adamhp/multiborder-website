import Image from 'next/image';
import clsx from 'clsx';

import frame from '@/images/iphoneframe.svg';

export function PhoneFrame({
  className,
  children,
  priority = false,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { priority?: boolean }) {
  return (
    <div className={clsx('relative aspect-[393/852]', className)} {...props}>
      <div className='absolute inset-y-[calc(1/852*100%)] left-[calc(7/852*100%)] right-[calc(5/852*100%)] rounded-[calc(58/393*100%)/calc(58/852*100%)] shadow-2xl' />
      <div className='debug absolute left-[calc(32/393*100%)] top-[calc(71/852*100%)] grid h-[calc(711/852*100%)] w-[calc(330/393*100%)] transform grid-cols-1 overflow-hidden rounded-3xl'>
        {children}
      </div>
      <Image
        src={frame}
        alt=''
        className='pointer-events-none absolute inset-0 h-full w-full'
        unoptimized
        priority={priority}
      />
    </div>
  );
}

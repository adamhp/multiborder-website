'use client';

import demo from '@/images/demo.gif';
import { AppScreen } from '@/components/AppScreen';
import Image from 'next/image';

export function AppDemo() {
  return (
    <AppScreen>
      <video width='393' height='952' playsInline muted preload='none' autoPlay>
        <source src='/demo.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>
      {/* <Image
        unoptimized={true}
        alt='demo video gif'
        src={demo}
        width={393}
        height={952}
      /> */}
    </AppScreen>
  );
}

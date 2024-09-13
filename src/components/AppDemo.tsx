'use client';

import demo from '@/images/demo.gif';
import { AppScreen } from '@/components/AppScreen';
import Image from 'next/image';

export function AppDemo() {
  return (
    <AppScreen>
      <Image
        unoptimized={true}
        alt='demo video gif'
        src={demo}
        width={393}
        height={952}
      />
    </AppScreen>
  );
}

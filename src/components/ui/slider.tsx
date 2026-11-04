'use client';

// shadcn/ui's Slider, styled for the site: an amber track and a white thumb, like the app's.
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

export function Slider({
  className,
  label,
  valueText,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & { label: string; valueText?: string }) {
  return (
    <SliderPrimitive.Root className={cn('relative flex h-8 w-full touch-none select-none items-center', className)} {...props}>
      <SliderPrimitive.Track className='relative h-1 w-full grow overflow-hidden rounded-full bg-stone-600'>
        <SliderPrimitive.Range className='absolute h-full bg-amber-500' />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={label}
        aria-valuetext={valueText}
        className='block size-6 cursor-grab rounded-full bg-white shadow-md shadow-black/40 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-110 active:cursor-grabbing'
      />
    </SliderPrimitive.Root>
  );
}

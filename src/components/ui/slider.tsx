'use client';

// shadcn/ui's Slider (Radix), styled like the app's: an amber track and a white thumb carrying its value,
// which lifts clear of the finger while dragging.
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

export function Slider({
  className,
  label,
  valueText,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & { label: string; valueText?: string }) {
  return (
    <SliderPrimitive.Root className={cn('group relative flex h-10 w-full touch-none select-none items-center', className)} {...props}>
      <SliderPrimitive.Track className='relative h-1 w-full grow overflow-hidden rounded-full bg-stone-600'>
        <SliderPrimitive.Range className='absolute h-full bg-amber-500' />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={label}
        aria-valuetext={valueText}
        className='relative block size-7 cursor-grab rounded-full bg-white shadow-md shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:cursor-grabbing'
      >
        {valueText !== undefined && (
          <span
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-[-0.75rem] top-1/2 -translate-y-1/2 text-center text-[11px] font-medium tabular-nums text-stone-900 transition-all duration-150 ease-out group-active:-translate-y-[2.6rem] group-active:text-sm group-active:text-white'
          >
            {valueText}
          </span>
        )}
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
}

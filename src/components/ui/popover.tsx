'use client';

// shadcn/ui's Popover (Radix), styled like the app's popovers: dark, rounded, growing from its anchor.
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({ className, sideOffset = 8, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn('mb-popover z-50 rounded-2xl border border-white/10 bg-stone-800/95 p-4 text-sm text-stone-100 shadow-2xl shadow-black/50 backdrop-blur-xl outline-none', className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

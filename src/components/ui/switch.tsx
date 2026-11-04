'use client';

// shadcn/ui's Switch (Radix), in the app's amber.
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { useId } from 'react';
import { cn } from '@/lib/utils';

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn('inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full bg-stone-600 p-0.5 transition-colors data-[state=checked]:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60', className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className='block size-5 rounded-full bg-white shadow transition-transform duration-200 data-[state=checked]:translate-x-4' />
    </SwitchPrimitive.Root>
  );
}

/** A labeled switch row, as the app's popovers list them. */
export function SwitchRow({ label, checked, onCheckedChange, disabled }: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className={cn('flex items-center justify-between gap-4', disabled && 'opacity-50')}>
      <label htmlFor={id}>{label}</label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

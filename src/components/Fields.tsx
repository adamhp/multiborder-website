import { useId } from 'react';
import clsx from 'clsx';

const formClasses =
  'caret-amber-500 block w-full appearance-none rounded-lg border border-stone-400 bg-stone-50 py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-stone-800 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm placeholder:text-xs md:placeholder:text-base';

function Label({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={id}
      className='mb-2 block text-sm font-semibold text-stone-100'
    >
      {children}
    </label>
  );
}

export function TextArea({
  label,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'textarea'>, 'id'> & {
  label?: string;
}) {
  const id = useId();

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <textarea id={id} {...props} className={formClasses} />
    </div>
  );
}

export function TextField({
  label,
  id = undefined,
  type = 'text',
  className,
  ...props
}: React.ComponentPropsWithoutRef<'input'> & {
  label?: string;
}) {
  const _id = useId();

  return (
    <div className={className}>
      {label && <Label id={id || _id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  );
}

export function SelectField({
  label,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'select'>, 'id'> & { label?: string }) {
  const id = useId();

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
    </div>
  );
}

import Link from "next/link";
import clsx from "clsx";

const baseStyles = {
  solid:
    "inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors",
  outline:
    "inline-flex justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors",
};

const variantStyles = {
  solid: {
    amber:
      "relative overflow-hidden bg-amber-500 text-stone-100 before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-amber-600 active:text-stone-100/80 before:transition-colors",
    white:
      "bg-white text-amber-900 hover:bg-white/90 active:bg-white/90 active:text-amber-900/70",
    stone:
      "bg-stone-800 text-stone-100 hover:bg-stone-900 active:bg-stone-800 active:text-stone-100/80",
  },
  outline: {
    stone:
      "border-stone-300 text-stone-300 hover:border-stone-400 active:bg-amber-600/25 active:text-stone-300/80",
  },
};

type ButtonProps = (
  | {
      variant?: "solid";
      color?: keyof typeof variantStyles.solid;
    }
  | {
      variant: "outline";
      color?: keyof typeof variantStyles.outline;
    }
) &
  (
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, "color">
    | (Omit<React.ComponentPropsWithoutRef<"button">, "color"> & {
        href?: undefined;
      })
  );

export function Button({ className, ...props }: ButtonProps) {
  props.variant ??= "solid";
  props.color ??= "stone";

  className = clsx(
    baseStyles[props.variant],
    props.variant === "outline"
      ? variantStyles.outline[props.color]
      : props.variant === "solid"
      ? variantStyles.solid[props.color]
      : undefined,
    className,
  );

  return typeof props.href === "undefined" ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  );
}

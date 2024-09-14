import Image from "next/image";
import clsx from "clsx";

import frame from "@/images/iphoneframe.svg";

export function PhoneFrame({
  className,
  children,
  priority = false,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { priority?: boolean }) {
  return (
    <div className={clsx("relative aspect-[393/852]", className)} {...props}>
      <div className="absolute left-[calc(32/393*100%)] top-[calc(71/852*100%)] grid h-[calc(711/852*100%)] w-[calc(330/393*100%)] transform grid-cols-1 overflow-hidden rounded-3xl">
        {children}
      </div>
      <Image
        src={frame}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full"
        unoptimized
        priority={priority}
      />
    </div>
  );
}

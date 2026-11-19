import Image from "next/image";
import clsx from "clsx";

import frame from "@/images/iphoneframe.png";

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
      {/* The frame is squatter than this box; `object-contain` fits its width and centers it vertically, so the screen cut-out lines up with the content above. */}
      <Image
        src={frame}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        sizes="393px"
        priority={priority}
      />
    </div>
  );
}

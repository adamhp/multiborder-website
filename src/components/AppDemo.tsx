"use client";

import { AppScreen } from "@/components/AppScreen";
import { useMotionSafeAutoplay } from "@/components/SpotlightVideo";

export function AppDemo() {
  const ref = useMotionSafeAutoplay();

  return (
    <AppScreen>
      {/* The poster is the clip's first frame, so the phone is never empty while the video loads, or when motion is reduced. */}
      <video
        ref={ref}
        width="393"
        height="952"
        playsInline
        muted
        preload="none"
        poster="/demo-poster.jpg"
        loop
      >
        <source src="/demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </AppScreen>
  );
}

"use client";

import { AppScreen } from "@/components/AppScreen";

export function AppDemo() {
  return (
    <AppScreen>
      {/* The poster is the clip's first frame, so the phone is never empty while the video loads or if it can't play. */}
      <video
        width="393"
        height="952"
        playsInline
        muted
        preload="none"
        poster="/demo-poster.jpg"
        autoPlay
        loop
      >
        <source src="/demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </AppScreen>
  );
}

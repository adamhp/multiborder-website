'use client';

import { useEffect, useRef } from 'react';

/** Plays a silent looping clip only while the visitor allows motion; otherwise its poster stays up. */
export function useMotionSafeAutoplay() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      if (reduce.matches) video.pause();
      else video.play().catch(() => {});
    };
    update();
    reduce.addEventListener('change', update);
    return () => reduce.removeEventListener('change', update);
  }, []);

  return ref;
}

// The poster stays visible if the video is missing or fails to load.
export function SpotlightVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useMotionSafeAutoplay();

  return (
    <video
      ref={ref}
      className='aspect-[4/3] w-full max-w-full rounded-2xl bg-stone-900 object-cover ring-1 ring-white/10'
      muted
      loop
      playsInline
      preload='metadata'
      poster={poster}
      aria-label={label}
    >
      <source src={src} type='video/mp4' />
    </video>
  );
}

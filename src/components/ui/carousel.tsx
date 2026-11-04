'use client';

// shadcn/ui's Carousel (Embla), trimmed to the horizontal carousel the editor uses.
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type CarouselApi = UseEmblaCarouselType[1];
type Options = Parameters<typeof useEmblaCarousel>[0];

type Context = {
  carouselRef: UseEmblaCarouselType[0];
  api: CarouselApi;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = createContext<Context | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error('useCarousel must be used within a <Carousel />');
  return context;
}

export function Carousel({
  opts,
  setApi,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { opts?: Options; setApi?: (api: CarouselApi) => void }) {
  const [carouselRef, api] = useEmblaCarousel(opts);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((embla: CarouselApi) => {
    if (!embla) return;
    setCanScrollPrev(embla.canScrollPrev());
    setCanScrollNext(embla.canScrollNext());
  }, []);

  useEffect(() => {
    if (api) setApi?.(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('reInit', onSelect).on('select', onSelect);
    return () => {
      api.off('reInit', onSelect).off('select', onSelect);
    };
  }, [api, onSelect]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      api?.scrollPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      api?.scrollNext();
    }
  };

  return (
    <CarouselContext.Provider value={{ carouselRef, api, canScrollPrev, canScrollNext }}>
      <div onKeyDownCapture={onKeyDown} className={cn('relative', className)} role='region' aria-roledescription='carousel' {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef } = useCarousel();
  return (
    <div ref={carouselRef} className='overflow-hidden'>
      <div className={cn('flex', className)} {...props} />
    </div>
  );
}

export function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  return <div role='group' aria-roledescription='slide' className={cn('min-w-0 shrink-0 grow-0 basis-full', className)} {...props} />;
}

const arrow =
  'absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-stone-900/70 text-stone-100 backdrop-blur transition-opacity hover:bg-stone-900 disabled:pointer-events-none disabled:opacity-0';

export function CarouselPrevious({ className }: { className?: string }) {
  const { api, canScrollPrev } = useCarousel();
  return (
    <button type='button' aria-label='Previous photo' disabled={!canScrollPrev} onClick={() => api?.scrollPrev()} className={cn(arrow, 'left-2', className)}>
      <ChevronLeft className='size-5' />
    </button>
  );
}

export function CarouselNext({ className }: { className?: string }) {
  const { api, canScrollNext } = useCarousel();
  return (
    <button type='button' aria-label='Next photo' disabled={!canScrollNext} onClick={() => api?.scrollNext()} className={cn(arrow, 'right-2', className)}>
      <ChevronRight className='size-5' />
    </button>
  );
}

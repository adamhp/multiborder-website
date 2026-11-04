'use client';

import clsx from 'clsx';
import { Plus, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { AppStoreLink } from '@/components/AppStoreLink';
import { Controls, ExportOptions } from '@/components/editor/Controls';
import { DecodeError, drawComposite, exportImage, exportName, loadPhoto, supportsCanvasFilter, type LoadedPhoto } from '@/editor/compose';
import { loadCaptionFont } from '@/editor/fonts';
import { layout } from '@/editor/layout';
import { loadSettings, saveSettings, type BorderSettings } from '@/editor/settings';

type Failure = { id: string; name: string; message: string };

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function Thumbnail({ photo }: { photo: LoadedPhoto }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const side = 128;
    const scale = Math.max(side / photo.preview.width, side / photo.preview.height);
    canvas.width = side;
    canvas.height = side;
    const w = photo.preview.width * scale, h = photo.preview.height * scale;
    ctx.drawImage(photo.preview, (side - w) / 2, (side - h) / 2, w, h);
  }, [photo]);
  return <canvas ref={ref} className='size-16 rounded-md' aria-hidden='true' />;
}

/** The selected photo on its border, redrawn whenever the settings or the space available change. */
/** Only the photo in view and its neighbors are drawn, so a long carousel doesn't redraw every photo on each change. */
function Preview({ photo, settings, fontsLoaded, active }: { photo: LoadedPhoto; settings: BorderSettings; fontsLoaded: number; active: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const [room, setRoom] = useState({ width: 0, height: 0 });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setRoom({ width: entry.contentRect.width, height: Math.max(window.innerHeight * 0.6, 320) }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || room.width === 0 || !active) return;
    // The full-size layout gives the canvas's shape; the preview is the same layout at the width that fits.
    const full = layout(photo.size, { ...settings, exportWidth: 0 });
    const ratio = full.canvasSize.width / full.canvasSize.height;
    const cssWidth = Math.min(room.width, room.height * ratio);
    const dpr = window.devicePixelRatio || 1;
    const result = layout(photo.size, { ...settings, exportWidth: Math.round(cssWidth * dpr) });
    canvas.width = result.canvasSize.width;
    canvas.height = result.canvasSize.height;
    canvas.style.width = `${result.canvasSize.width / dpr}px`;
    canvas.style.height = `${result.canvasSize.height / dpr}px`;
    // A drawing failure (e.g. the browser is out of canvas memory) shouldn't take the whole page down.
    try {
      drawComposite(ctx, photo.preview, result, settings, photo.details);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, [photo, settings, fontsLoaded, room, active]);

  return (
    <div ref={box} className='flex w-full flex-col items-center justify-center' style={{ minHeight: room.height || undefined }}>
      {failed && (
        <p role='alert' className='mb-2 text-sm text-red-300'>
          This browser couldn&apos;t draw the preview. Try fewer photos or reload the page.
        </p>
      )}
      <canvas ref={ref} role='img' aria-label={`Preview of ${photo.name} with its border`} className='shadow-xl' />
    </div>
  );
}

export function Editor() {
  const [settings, setSettings] = useState<BorderSettings | null>(null);
  const [photos, setPhotos] = useState<LoadedPhoto[]>([]);
  const [failures, setFailures] = useState<Failure[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  // Counts caption fonts as they finish loading, so the previews redraw in them.
  const [fontsLoaded, setFontsLoaded] = useState(0);
  const [canBlur, setCanBlur] = useState(true);
  const input = useRef<HTMLInputElement>(null);

  // Settings and browser features are read after mounting, since the page is prerendered without a window.
  useEffect(() => {
    setSettings(loadSettings());
    setCanBlur(supportsCanvasFilter());
  }, []);

  const captionFont = settings?.captionFont;
  useEffect(() => {
    if (captionFont) loadCaptionFont(captionFont).then(() => setFontsLoaded((n) => n + 1));
  }, [captionFont]);

  const change = useCallback((patch: Partial<BorderSettings>) => {
    setSettings((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const addFiles = async (files: Iterable<File>) => {
    // One at a time, so a batch of large photos doesn't hold several full-size decodes at once.
    for (const file of files) {
      setLoading((n) => n + 1);
      try {
        const photo = await loadPhoto(file);
        setPhotos((list) => [...list, photo]);
        setSelectedId((id) => id ?? photo.id);
      } catch (error) {
        const message = error instanceof DecodeError ? error.message : "This photo couldn't be opened.";
        setFailures((list) => [...list, { id: crypto.randomUUID(), name: file.name, message }]);
      } finally {
        setLoading((n) => n - 1);
      }
    }
  };

  const remove = (id: string) => {
    photos.find((p) => p.id === id)?.preview.close();
    setPhotos((list) => {
      const next = list.filter((p) => p.id !== id);
      setSelectedId((selected) => (selected === id ? next[0]?.id ?? null : selected));
      return next;
    });
  };

  const selected = photos.find((p) => p.id === selectedId) ?? photos[0];
  const selectedIndex = selected ? photos.indexOf(selected) : 0;

  // The carousel and the selection follow each other: swiping selects, and selecting (a thumbnail,
  // or a removal) scrolls.
  const [carousel, setCarousel] = useState<CarouselApi>();
  useEffect(() => {
    if (!carousel) return;
    const onSelect = () => {
      const photo = photos[carousel.selectedScrollSnap()];
      if (photo) setSelectedId(photo.id);
    };
    carousel.on('select', onSelect);
    return () => {
      carousel.off('select', onSelect);
    };
  }, [carousel, photos]);
  useEffect(() => {
    if (carousel && carousel.selectedScrollSnap() !== selectedIndex) carousel.scrollTo(selectedIndex);
  }, [carousel, selectedIndex, photos.length]);

  const downloadSelected = async () => {
    if (!selected || !settings) return;
    setBusy('Exporting…');
    setNotice(null);
    try {
      const blob = await exportImage(selected, settings);
      download(blob, exportName(selected.name, blob.type));
    } catch {
      setNotice(`Couldn't export ${selected.name}. Try the 1080 px size, or fewer photos at once.`);
    } finally {
      setBusy(null);
    }
  };

  const downloadAll = async () => {
    if (!settings || photos.length === 0) return;
    const { zipSync } = await import('fflate');
    const files: Record<string, [Uint8Array, { level: 0 }]> = {};
    const skipped: string[] = [];
    setNotice(null);
    try {
      for (const [index, photo] of photos.entries()) {
        setBusy(`Exporting ${index + 1} of ${photos.length}…`);
        try {
          const blob = await exportImage(photo, settings);
          // Names that differ only in case would overwrite each other when unzipped on a Mac or PC.
          const taken = new Set(Object.keys(files).map((n) => n.toLowerCase()));
          let name = exportName(photo.name, blob.type);
          for (let n = 2; taken.has(name.toLowerCase()); n++) name = exportName(photo.name, blob.type).replace(/(\.\w+)$/, `-${n}$1`);
          // JPEGs and PNGs are already compressed, so they're stored as they are.
          files[name] = [new Uint8Array(await blob.arrayBuffer()), { level: 0 }];
        } catch {
          skipped.push(photo.name);
        }
      }
      if (Object.keys(files).length > 0) {
        download(new Blob([zipSync(files) as Uint8Array<ArrayBuffer>], { type: 'application/zip' }), 'multiborder.zip');
      }
      if (skipped.length > 0) {
        setNotice(`Couldn't export ${skipped.join(', ')}. Try the 1080 px size, or fewer photos at once.`);
      }
    } catch {
      setNotice("Couldn't make the .zip. Try downloading the photos one at a time.");
    } finally {
      setBusy(null);
    }
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files).filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name)));
  };

  const picker = (
    <input
      ref={input}
      type='file'
      accept='image/*,.heic,.heif'
      multiple
      className='sr-only'
      aria-label='Choose photos'
      onChange={(e) => {
        if (e.target.files) addFiles(Array.from(e.target.files));
        e.target.value = '';
      }}
    />
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className='py-12'
    >
      <div className='mb-8 max-w-2xl'>
        <h1 className='text-3xl text-stone-100'>Web Editor</h1>
        <p className='mt-3 text-stone-300'>
          Add borders to your photos right in your browser. Your photos stay on your device: nothing is uploaded.
        </p>
      </div>
      {picker}

      {photos.length === 0 ? (
        <button
          type='button'
          onClick={() => input.current?.click()}
          className={clsx(
            'flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-24 text-center transition-colors',
            dragging ? 'border-amber-500 bg-amber-500/10' : 'border-stone-600 hover:border-stone-400',
          )}
        >
          <span className='text-lg text-stone-100'>{loading > 0 ? 'Opening photos…' : 'Choose photos'}</span>
          <span className='text-sm text-stone-400'>or drop them here. JPEG, PNG and WebP work everywhere; HEIC in Safari.</span>
        </button>
      ) : (
        <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem]'>
          <div className='min-w-0 space-y-4'>
            {settings && (
              <Carousel setApi={setCarousel} aria-label='Photos' className='rounded-2xl bg-stone-900/40 p-3 sm:p-6'>
                <CarouselContent>
                  {photos.map((photo, index) => (
                    <CarouselItem key={photo.id} aria-label={`${index + 1} of ${photos.length}`}>
                      <Preview photo={photo} settings={settings} fontsLoaded={fontsLoaded} active={Math.abs(index - selectedIndex) <= 1} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {photos.length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            )}
            <ul className='flex justify-center gap-2 overflow-x-auto p-1 pb-2' aria-label='Photo list'>
              {photos.map((photo) => (
                <li key={photo.id} className='group relative shrink-0'>
                  <button
                    type='button'
                    onClick={() => setSelectedId(photo.id)}
                    aria-label={`Show ${photo.name}`}
                    aria-current={photo.id === selected?.id}
                    className={clsx('block rounded-lg p-0.5 transition-colors', photo.id === selected?.id ? 'bg-amber-500' : 'bg-transparent hover:bg-stone-600')}
                  >
                    <Thumbnail photo={photo} />
                  </button>
                  <button
                    type='button'
                    onClick={() => remove(photo.id)}
                    aria-label={`Remove ${photo.name}`}
                    className='absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-stone-900 text-stone-200 ring-1 ring-stone-600 hover:bg-stone-700'
                  >
                    <X className='size-3.5' />
                  </button>
                </li>
              ))}
              <li className='shrink-0'>
                <button
                  type='button'
                  onClick={() => input.current?.click()}
                  className='flex size-[4.25rem] items-center justify-center rounded-lg border-2 border-dashed border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200'
                  aria-label='Add photos'
                >
                  <Plus className='size-6' />
                </button>
              </li>
            </ul>
          </div>

          {/* The controls keep the phone's width, beside the photos on large screens and under them on small ones. */}
          <aside aria-label='Border settings' className='mx-auto w-full max-w-sm space-y-4 lg:sticky lg:top-6 lg:rounded-2xl lg:bg-stone-900/40 lg:p-4'>
            {settings && <Controls settings={settings} onChange={change} canBlur={canBlur} />}

            <div className='space-y-2 border-t border-white/10 pt-4'>
              {settings && <ExportOptions settings={settings} onChange={change} />}
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={downloadSelected}
                  disabled={!!busy || !selected}
                  className='flex-1 rounded-xl bg-amber-500 px-3 py-2.5 text-sm font-semibold text-stone-900 hover:bg-amber-400 disabled:opacity-50'
                >
                  Download
                </button>
                {photos.length > 1 && (
                  <button
                    type='button'
                    onClick={downloadAll}
                    disabled={!!busy}
                    className='flex-1 rounded-xl bg-stone-600 px-3 py-2.5 text-sm text-stone-100 hover:bg-stone-500 disabled:opacity-50'
                  >
                    Download all ({photos.length})
                  </button>
                )}
              </div>
              <p className='min-h-5 text-sm text-stone-400' role='status' aria-live='polite'>
                {busy ?? (loading > 0 ? 'Opening photos…' : notice ?? '')}
              </p>
            </div>
          </aside>
        </div>
      )}

      {failures.length > 0 && (
        <ul className='mt-6 space-y-2' aria-label="Photos that couldn't be opened">
          {failures.map((f) => (
            <li key={f.id} className='flex items-start justify-between gap-3 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-200'>
              <span>
                <strong className='font-semibold'>{f.name}:</strong> {f.message}
              </span>
              <button type='button' onClick={() => setFailures((list) => list.filter((x) => x.id !== f.id))}
                aria-label={`Dismiss the message about ${f.name}`} className='text-red-300 hover:text-red-100'>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className='mt-16 flex flex-col items-center gap-4 border-t border-stone-700 pt-10 text-center'>
        <p className='max-w-xl text-stone-300'>
          Want HDR photos, HEIC, more fonts, caption icons and borders straight from the Photos app? Get multiborder for iPhone and iPad.
        </p>
        <AppStoreLink />
      </div>
    </div>
  );
}

// Draws a photo on its border in a canvas, as `ImageComposer.composite` does in the iOS app.
// Browser only: everything here needs the DOM.
import { captionPlacement, captionRows, captionTextColor, detailsFromTags, readTags, type PhotoDetails } from './caption';
import { layout, type Layout } from './layout';
import { serialQueue } from './queue';
import { blurRadius, cornerRadius, shadowBlur, type BorderSettings, type Size } from './settings';

export type LoadedPhoto = {
  id: string;
  file: File;
  name: string;
  /** Upright pixel size of the full-resolution photo. */
  size: Size;
  /** A copy whose long side is at most `PREVIEW_PIXEL_SIZE`, for redrawing the preview quickly. */
  preview: ImageBitmap;
  details: PhotoDetails;
};

export class DecodeError extends Error {}

const PREVIEW_PIXEL_SIZE = 1600;
/** Long side of the photo copy the blur fill is blurred at before being scaled up. */
const BACKDROP_PIXEL_SIZE = 512;
const JPEG_QUALITY = 0.92;

/**
 * Full-size decodes and export canvases, one at a time across every caller (adding photos while
 * exporting, two drops in a row), since iOS Safari has little memory for either.
 */
const decodeQueue = serialQueue();

/** Gives a canvas's memory back now rather than whenever it's collected; iOS Safari counts it against a small budget. */
function release(element: HTMLCanvasElement) {
  element.width = 0;
  element.height = 0;
}

const isHeic = (file: File) => /hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);

/** The photo decoded upright. Falls back to an `<img>`, which some browsers decode more formats with. */
async function decode(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return await createImageBitmap(img);
    } catch {
      throw new DecodeError(
        isHeic(file)
          ? "This browser can't open HEIC photos. Try Safari, export the photo as JPEG, or use the multiborder app."
          : "This photo couldn't be opened.",
      );
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

function canvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const element = document.createElement('canvas');
  element.width = Math.max(1, Math.round(width));
  element.height = Math.max(1, Math.round(height));
  const ctx = element.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.imageSmoothingQuality = 'high';
  return [element, ctx];
}

/** `image` scaled to fit `longSide`, never enlarged. */
function scaledCopy(image: CanvasImageSource & Size, longSide: number): HTMLCanvasElement {
  const scale = Math.min(1, longSide / Math.max(image.width, image.height));
  const [copy, ctx] = canvas(image.width * scale, image.height * scale);
  ctx.drawImage(image, 0, 0, copy.width, copy.height);
  return copy;
}

export function loadPhoto(file: File): Promise<LoadedPhoto> {
  return decodeQueue(async () => {
    const [bitmap, tags] = await Promise.all([decode(file), readTags(file)]);
    let copy: HTMLCanvasElement | undefined;
    try {
      copy = scaledCopy(bitmap, PREVIEW_PIXEL_SIZE);
      return {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: { width: bitmap.width, height: bitmap.height },
        // A bitmap rather than the canvas, so the copy's canvas memory can be given back.
        preview: await createImageBitmap(copy),
        details: detailsFromTags(tags),
      };
    } finally {
      bitmap.close();
      if (copy) release(copy);
    }
  });
}

let filterSupport: boolean | undefined;

/** Whether canvas `filter` really blurs (older Safari ignores it), which the blur fill needs. */
export function supportsCanvasFilter(): boolean {
  if (filterSupport !== undefined) return filterSupport;
  try {
    const [, ctx] = canvas(9, 9);
    ctx.filter = 'blur(2px)';
    ctx.fillRect(4, 4, 1, 1);
    // Unblurred, the pixel beside the dot stays transparent.
    filterSupport = ctx.getImageData(5, 4, 1, 1).data[3] > 0;
  } catch {
    filterSupport = false;
  }
  return filterSupport;
}

/** The photo blurred by `sigma` canvas pixels, scaled to cover a canvas of `size`. Edges are clamped so they don't fade. */
function blurredBackdrop(image: CanvasImageSource & Size, size: Size, sigma: number): HTMLCanvasElement {
  const small = scaledCopy(image, BACKDROP_PIXEL_SIZE);
  const scaleUp = Math.max(size.width / small.width, size.height / small.height);
  const blur = sigma / scaleUp;
  const pad = Math.ceil(blur * 3);
  const w = small.width, h = small.height;
  const [padded, p] = canvas(w + pad * 2, h + pad * 2);
  p.drawImage(small, pad, pad);
  // Repeat each edge row and column outward, then the corners.
  p.drawImage(small, 0, 0, w, 1, pad, 0, w, pad);
  p.drawImage(small, 0, h - 1, w, 1, pad, pad + h, w, pad);
  p.drawImage(small, 0, 0, 1, h, 0, pad, pad, h);
  p.drawImage(small, w - 1, 0, 1, h, pad + w, pad, pad, h);
  p.drawImage(small, 0, 0, 1, 1, 0, 0, pad, pad);
  p.drawImage(small, w - 1, 0, 1, 1, pad + w, 0, pad, pad);
  p.drawImage(small, 0, h - 1, 1, 1, 0, pad + h, pad, pad);
  p.drawImage(small, w - 1, h - 1, 1, 1, pad + w, pad + h, pad, pad);
  const [blurred, b] = canvas(w, h);
  b.filter = `blur(${blur}px)`;
  b.drawImage(padded, -pad, -pad);
  release(small);
  release(padded);
  return blurred;
}

function photoPath(ctx: CanvasRenderingContext2D, layout: Layout, radius: number) {
  const r = layout.imageRect;
  ctx.beginPath();
  if (radius <= 0) {
    ctx.rect(r.x, r.y, r.width, r.height);
  } else if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(r.x, r.y, r.width, r.height, radius);
  } else {
    // Safari before 16 and Firefox before 112 have no roundRect.
    const right = r.x + r.width, bottom = r.y + r.height;
    ctx.moveTo(r.x + radius, r.y);
    ctx.arcTo(right, r.y, right, bottom, radius);
    ctx.arcTo(right, bottom, r.x, bottom, radius);
    ctx.arcTo(r.x, bottom, r.x, r.y, radius);
    ctx.arcTo(r.x, r.y, right, r.y, radius);
    ctx.closePath();
  }
}

/**
 * Draws `image` on a canvas of `layout.canvasSize` filled with the border color or the blurred photo,
 * with its shadow and rounded corners, then the caption in `fontFamily` (which must already be loaded).
 */
export function drawComposite(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource & Size,
  layout: Layout,
  s: BorderSettings,
  details: PhotoDetails,
  fontFamily: string,
): void {
  const { canvasSize: size, imageRect: rect } = layout;
  ctx.save();
  ctx.imageSmoothingQuality = 'high';
  if (s.fill === 'blur' && supportsCanvasFilter()) {
    const backdrop = blurredBackdrop(image, size, blurRadius(s, size));
    const scale = Math.max(size.width / backdrop.width, size.height / backdrop.height);
    const w = backdrop.width * scale, h = backdrop.height * scale;
    ctx.drawImage(backdrop, (size.width - w) / 2, (size.height - h) / 2, w, h);
    release(backdrop);
  } else {
    ctx.fillStyle = s.borderColor;
    ctx.fillRect(0, 0, size.width, size.height);
  }

  const radius = cornerRadius(s, size, rect);
  const shadow = shadowBlur(s, size);
  if (shadow > 0) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = shadow;
    ctx.shadowOffsetY = shadow / 4;
    ctx.fillStyle = '#000';
    photoPath(ctx, layout, radius);
    ctx.fill();
    ctx.restore();
  }
  ctx.save();
  if (radius > 0) {
    photoPath(ctx, layout, radius);
    ctx.clip();
  }
  ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  ctx.restore();

  const fill = s.fill === 'blur' && supportsCanvasFilter() ? 'blur' : 'color';
  const font = (px: number) => `${px}px ${fontFamily}`;
  ctx.font = font(100);
  const placement = captionPlacement(captionRows(details, s), layout, (text) => ctx.measureText(text).width / 100);
  if (placement) {
    ctx.font = font(placement.fontSize);
    ctx.fillStyle = captionTextColor(s.borderColor, fill);
    ctx.textBaseline = 'middle';
    if (fill === 'blur') {
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = placement.fontSize * 0.4;
    }
    for (const { item, frame } of placement.entries) {
      ctx.fillText(item.text, frame.x, frame.y + frame.height / 2);
    }
  }
  ctx.restore();
}

/** Waits for the caption font so measuring and drawing use it rather than the fallback. */
export async function loadFont(fontFamily: string): Promise<void> {
  try {
    await document.fonts.load(`100px ${fontFamily}`, 'ƒ/1.8 ISO');
  } catch {
    // Draws with the fallback font.
  }
}

/** The photo at export size on its border, as a JPEG. Renders full size, so callers export one photo at a time. */
export function exportJpeg(photo: LoadedPhoto, s: BorderSettings, fontFamily: string): Promise<Blob> {
  return decodeQueue(() => renderJpeg(photo, s, fontFamily));
}

async function renderJpeg(photo: LoadedPhoto, s: BorderSettings, fontFamily: string): Promise<Blob> {
  const bitmap = await decode(photo.file);
  const [element, ctx] = (() => {
    try {
      const result = layout({ width: bitmap.width, height: bitmap.height }, s);
      const [element, ctx] = canvas(result.canvasSize.width, result.canvasSize.height);
      drawComposite(ctx, bitmap, result, s, photo.details, fontFamily);
      return [element, ctx] as const;
    } finally {
      bitmap.close();
    }
  })();
  try {
    return await new Promise<Blob>((resolve, reject) =>
      element.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))), 'image/jpeg', JPEG_QUALITY),
    );
  } finally {
    ctx.reset?.();
    release(element);
  }
}

/** "IMG_2066.JPG" → "IMG_2066-multiborder.jpg". */
export function exportName(name: string): string {
  return `${name.replace(/\.[^.]+$/, '') || 'photo'}-multiborder.jpg`;
}

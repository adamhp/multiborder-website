// Canvas and photo placement, ported line for line from `ImageComposer.layout` in the iOS app.
import { canvasWidthOverHeight, insets as sideInsets, type BorderSettings, type Rect, type Size } from './settings';

export type Layout = {
  canvasSize: Size;
  /** Where the photo sits inside the canvas (top-left origin). */
  imageRect: Rect;
};

/** iOS Safari refuses canvases over 16,777,216 pixels; this leaves some headroom. */
export const MAX_CANVAS_PIXELS = 16_000_000;

/**
 * Canvas and photo placement for a photo of `source` pixels.
 *
 * The canvas is as large as needed to draw the photo at its native resolution (never upscaled),
 * then shrunk to `exportWidth` or `maxPixels` if needed. Everything scales linearly, so the
 * preview uses the same layout with a small `exportWidth`.
 */
export function layout(source: Size, s: BorderSettings, maxPixels = MAX_CANVAS_PIXELS): Layout {
  if (!(source.width > 0 && source.height > 0)) {
    return { canvasSize: { width: 0, height: 0 }, imageRect: { x: 0, y: 0, width: 0, height: 0 } };
  }
  const ratio = canvasWidthOverHeight(s) ?? source.width / source.height;
  const clamp = (value: number) => Math.min(Math.max(value, 0), 0.45);
  const raw = sideInsets(s);
  const insets = { top: clamp(raw.top), left: clamp(raw.left), bottom: clamp(raw.bottom), right: clamp(raw.right) };
  // Padding is measured on the shorter side; this converts it to units of canvas width.
  const shorterPerWidth = Math.min(1, 1 / ratio);
  const innerWidthPerWidth = 1 - (insets.left + insets.right) * shorterPerWidth;
  const innerHeightPerWidth = 1 / ratio - (insets.top + insets.bottom) * shorterPerWidth;

  const nativeWidth = Math.max(source.width / innerWidthPerWidth, source.height / innerHeightPerWidth);
  let widthLimit = Math.sqrt(maxPixels * ratio);
  if (s.exportWidth > 0) widthLimit = Math.min(widthLimit, s.exportWidth);

  if (nativeWidth <= widthLimit) {
    // Native resolution: whole-pixel canvas, inset and origin, so the photo is copied pixel for pixel.
    // Ignore float noise (e.g. 4032 / (4032 / 3024)) before rounding up.
    const roundUp = (value: number) => Math.max(Math.ceil(value - 1e-6), 1);
    // Rounding the inset can steal a pixel; grow until the photo fits (a few steps at most).
    for (let width = roundUp(nativeWidth); width <= Math.round(widthLimit); width++) {
      const height = roundUp(width / ratio);
      const shorter = Math.min(width, height);
      const left = Math.round(insets.left * shorter), right = Math.round(insets.right * shorter);
      const top = Math.round(insets.top * shorter), bottom = Math.round(insets.bottom * shorter);
      const innerWidth = width - left - right, innerHeight = height - top - bottom;
      if (innerWidth >= source.width && innerHeight >= source.height) {
        return {
          canvasSize: { width, height },
          imageRect: {
            x: left + Math.floor((innerWidth - source.width) / 2),
            y: top + Math.floor((innerHeight - source.height) / 2),
            width: source.width,
            height: source.height,
          },
        };
      }
    }
  }

  const width = Math.max(Math.round(Math.min(nativeWidth, widthLimit)), 1);
  const height = Math.max(Math.round(width / ratio), 1);
  const shorter = Math.min(width, height);
  const innerWidth = width - (insets.left + insets.right) * shorter;
  const innerHeight = height - (insets.top + insets.bottom) * shorter;
  const scale = Math.min(innerWidth / source.width, innerHeight / source.height, 1);
  const imageWidth = source.width * scale, imageHeight = source.height * scale;
  return {
    canvasSize: { width, height },
    imageRect: {
      x: insets.left * shorter + (innerWidth - imageWidth) / 2,
      y: insets.top * shorter + (innerHeight - imageHeight) / 2,
      width: imageWidth,
      height: imageHeight,
    },
  };
}

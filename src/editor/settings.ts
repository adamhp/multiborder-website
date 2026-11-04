// Border settings for the web editor, mirroring `BorderSettings` in the iOS app
// (multiborder-2.0/Shared/ImageComposer.swift). Fractions are of the canvas's shorter side.

export type Size = { width: number; height: number };
export type Rect = Size & { x: number; y: number };

/** Canvas shapes, described in portrait; `isLandscape` turns them sideways. */
export const ASPECT_RATIOS = ['original', '2:3', '3:4', '4:5', '1:1', '9:16'] as const;
export type AspectRatio = (typeof ASPECT_RATIOS)[number];

export const CAPTION_FIELDS = ['date', 'handle', 'camera', 'focalLength', 'aperture', 'shutter', 'iso'] as const;
export type CaptionField = (typeof CAPTION_FIELDS)[number];
export const CAPTION_ALIGNMENTS = ['spread', 'leading', 'center', 'trailing'] as const;
export type CaptionAlignment = (typeof CAPTION_ALIGNMENTS)[number];
export type BorderFill = 'color' | 'blur';

export type BorderSettings = {
  aspectRatio: AspectRatio;
  isLandscape: boolean;
  paddingFraction: number;
  /** `#rrggbb`. */
  borderColor: string;
  fill: BorderFill;
  blurFraction: number;
  roundsCorners: boolean;
  cornerFraction: number;
  hasShadow: boolean;
  shadowFraction: number;
  /** Maximum output width in pixels; 0 exports at the photo's full resolution. */
  exportWidth: number;
  showsCaption: boolean;
  captionFields: CaptionField[];
  /** Left to right; with `captionBelow`, lists every field exactly once. */
  captionAbove: CaptionField[];
  captionBelow: CaptionField[];
  captionAlignmentAbove: CaptionAlignment;
  captionAlignmentBelow: CaptionAlignment;
  handle: string;
  cameraShowsMake: boolean;
  cameraShowsModel: boolean;
};

export const PADDING_RANGE = [0, 0.16] as const;
export const BLUR_RANGE = [0.005, 0.1] as const;
export const CORNER_RANGE = [0.00125, 0.08] as const;
export const SHADOW_RANGE = [0.002, 0.04] as const;

export const DEFAULT_SETTINGS: BorderSettings = {
  aspectRatio: '4:5',
  isLandscape: false,
  paddingFraction: 0,
  borderColor: '#ffffff',
  fill: 'color',
  blurFraction: 0.04,
  roundsCorners: false,
  cornerFraction: 0.02,
  hasShadow: false,
  shadowFraction: 0.01,
  exportWidth: 0,
  showsCaption: false,
  captionFields: [...CAPTION_FIELDS],
  captionAbove: ['date', 'handle'],
  captionBelow: ['camera', 'focalLength', 'aperture', 'shutter', 'iso'],
  captionAlignmentAbove: 'spread',
  captionAlignmentBelow: 'spread',
  handle: '',
  cameraShowsMake: true,
  cameraShowsModel: true,
};

const clamp = (value: number, [low, high]: readonly [number, number]) => Math.min(Math.max(value, low), high);

const PORTRAIT_RATIOS: Record<AspectRatio, number | null> = {
  original: null,
  '2:3': 2 / 3,
  '3:4': 3 / 4,
  '4:5': 4 / 5,
  '1:1': 1,
  '9:16': 9 / 16,
};

/** Whether turning the canvas sideways changes its shape. */
export const hasOrientation = (ratio: AspectRatio) => ratio !== 'original' && ratio !== '1:1';

/** The ratio as shown, e.g. "2:3", or "3:2" in landscape. */
export function aspectRatioTitle(ratio: AspectRatio, landscape: boolean): string {
  if (ratio === 'original') return 'Original';
  return landscape ? ratio.split(':').reverse().join(':') : ratio;
}

/** Canvas width divided by height after orientation; `null` keeps the photo's own ratio. */
export function canvasWidthOverHeight(s: BorderSettings): number | null {
  const ratio = PORTRAIT_RATIOS[s.aspectRatio];
  return ratio === null ? null : s.isLandscape ? 1 / ratio : ratio;
}

/** 0 while `roundsCorners` is off; never more than half the photo's shorter side. */
export function cornerRadius(s: BorderSettings, canvas: Size, photo: Size): number {
  if (!s.roundsCorners) return 0;
  return Math.min(
    clamp(s.cornerFraction, CORNER_RANGE) * Math.min(canvas.width, canvas.height),
    Math.min(photo.width, photo.height) / 2,
  );
}

/** The shadow's blur in pixels; it falls a quarter of this below the photo. 0 while `hasShadow` is off. */
export function shadowBlur(s: BorderSettings, canvas: Size): number {
  if (!s.hasShadow) return 0;
  return clamp(s.shadowFraction, SHADOW_RANGE) * Math.min(canvas.width, canvas.height);
}

/** The blur fill's Gaussian standard deviation in pixels. */
export function blurRadius(s: BorderSettings, canvas: Size): number {
  return clamp(s.blurFraction, BLUR_RANGE) * Math.min(canvas.width, canvas.height);
}

const STORAGE_KEY = 'multiborder.settings';

function browserStorage(): Storage | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

/** Stored settings over the defaults. Unknown or mistyped values fall back to the default, so this never throws. */
export function loadSettings(storage = browserStorage()): BorderSettings {
  let stored: Record<string, unknown> = {};
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(STORAGE_KEY) ?? '{}');
    if (parsed && typeof parsed === 'object') stored = parsed as Record<string, unknown>;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
  const result: Record<string, unknown> = { ...DEFAULT_SETTINGS };
  for (const [key, fallback] of Object.entries(DEFAULT_SETTINGS)) {
    const value = stored[key];
    if (typeof value === typeof fallback && !Array.isArray(fallback)) result[key] = value;
  }
  const s = result as BorderSettings;
  const isField = (f: unknown): f is CaptionField => CAPTION_FIELDS.includes(f as CaptionField);
  const fields = (value: unknown, fallback: CaptionField[]) => (Array.isArray(value) ? value.filter(isField) : fallback);
  if (!ASPECT_RATIOS.includes(s.aspectRatio)) s.aspectRatio = DEFAULT_SETTINGS.aspectRatio;
  if (s.fill !== 'color' && s.fill !== 'blur') s.fill = DEFAULT_SETTINGS.fill;
  if (!/^#[0-9a-f]{6}$/i.test(s.borderColor)) s.borderColor = DEFAULT_SETTINGS.borderColor;
  if (!CAPTION_ALIGNMENTS.includes(s.captionAlignmentAbove)) s.captionAlignmentAbove = 'spread';
  if (!CAPTION_ALIGNMENTS.includes(s.captionAlignmentBelow)) s.captionAlignmentBelow = 'spread';
  s.captionFields = [...new Set(fields(stored.captionFields, DEFAULT_SETTINGS.captionFields))];
  // Repaired like the app: each field in exactly one row, missing ones at the end of their default row.
  const above = [...new Set(fields(stored.captionAbove, DEFAULT_SETTINGS.captionAbove))];
  const below = [...new Set(fields(stored.captionBelow, DEFAULT_SETTINGS.captionBelow))].filter((f) => !above.includes(f));
  for (const f of CAPTION_FIELDS) {
    if (above.includes(f) || below.includes(f)) continue;
    (DEFAULT_SETTINGS.captionAbove.includes(f) ? above : below).push(f);
  }
  s.captionAbove = above;
  s.captionBelow = below;
  return s;
}

export function saveSettings(s: BorderSettings, storage = browserStorage()): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // Private windows and full storage: settings just don't persist.
  }
}

export type CaptionRow = 'above' | 'below';

/** `s` with `field` moved to `index` in `row` (clamped to the row's ends), out of wherever it was. */
export function moveCaptionField(s: BorderSettings, field: CaptionField, row: CaptionRow, index: number): BorderSettings {
  const captionAbove = s.captionAbove.filter((f) => f !== field);
  const captionBelow = s.captionBelow.filter((f) => f !== field);
  const target = row === 'above' ? captionAbove : captionBelow;
  target.splice(Math.min(Math.max(index, 0), target.length), 0, field);
  return { ...s, captionAbove, captionBelow };
}

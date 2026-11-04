// Border settings for the web editor, mirroring `BorderSettings` in the iOS app
// (multiborder-2.0/Shared/ImageComposer.swift). Fractions are of the canvas's shorter side.

export type Size = { width: number; height: number };
export type Rect = Size & { x: number; y: number };

/** Canvas shapes, described in portrait; `isLandscape` turns them sideways. */
export const ASPECT_RATIOS = ['original', '2:3', '3:4', '4:5', '1:1', '9:16'] as const;
export type AspectRatio = (typeof ASPECT_RATIOS)[number];

export const CAPTION_FIELDS = ['date', 'title', 'filename', 'handle', 'camera', 'focalLength', 'aperture', 'shutter', 'iso'] as const;
export type CaptionField = (typeof CAPTION_FIELDS)[number];
export const CAPTION_ALIGNMENTS = ['spread', 'leading', 'center', 'trailing'] as const;
export type CaptionAlignment = (typeof CAPTION_ALIGNMENTS)[number];
export type BorderFill = 'color' | 'blur';
/** Where the handle points, shown as the icon before it. */
export const HANDLE_STYLES = ['instagram', 'flickr', 'at', 'website', 'plain'] as const;
export type HandleStyle = (typeof HANDLE_STYLES)[number];
/** The caption's typefaces, in the order the app's font menu lists them. */
export const CAPTION_FONTS = ['dmMono', 'dmSans', 'ibmPlexMono', 'inter', 'jetBrainsMono', 'spaceGrotesk', 'spaceMono'] as const;
export type CaptionFont = (typeof CAPTION_FONTS)[number];
export const EXPORT_FORMATS = ['original', 'jpeg', 'png'] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];
/** Output widths offered; 0 is the photo's full resolution. */
export const EXPORT_WIDTHS = [0, 2048, 1080] as const;
export type Insets = { top: number; left: number; bottom: number; right: number };

export type BorderSettings = {
  aspectRatio: AspectRatio;
  isLandscape: boolean;
  paddingFraction: number;
  /** Whether each side uses its own thickness from `sides` instead of `paddingFraction`. */
  isPerSide: boolean;
  /** Per-side thicknesses, kept while `isPerSide` is off; `null` until it's first turned on. */
  sides: Insets | null;
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
  exportFormat: ExportFormat;
  showsCaption: boolean;
  captionFields: CaptionField[];
  /** Left to right; with `captionBelow`, lists every field exactly once. */
  captionAbove: CaptionField[];
  captionBelow: CaptionField[];
  captionAlignmentAbove: CaptionAlignment;
  captionAlignmentBelow: CaptionAlignment;
  handle: string;
  handleStyle: HandleStyle;
  /** Details printed without their icon. */
  captionHiddenIcons: CaptionField[];
  /** Whether any caption icons are printed; when on, `captionHiddenIcons` still hides single ones. */
  showsCaptionIcons: boolean;
  captionFont: CaptionFont;
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
  isPerSide: false,
  sides: null,
  borderColor: '#ffffff',
  fill: 'color',
  blurFraction: 0.04,
  roundsCorners: false,
  cornerFraction: 0.02,
  hasShadow: false,
  shadowFraction: 0.01,
  exportWidth: 0,
  exportFormat: 'original',
  showsCaption: false,
  // The filename starts off; the title is usually the better label.
  captionFields: CAPTION_FIELDS.filter((f) => f !== 'filename'),
  captionAbove: ['date', 'title', 'filename', 'handle'],
  captionBelow: ['camera', 'focalLength', 'aperture', 'shutter', 'iso'],
  captionAlignmentAbove: 'spread',
  captionAlignmentBelow: 'spread',
  handle: '',
  handleStyle: 'instagram',
  captionHiddenIcons: [],
  showsCaptionIcons: true,
  captionFont: 'spaceMono',
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

/** The thickness of each side that the layout uses. */
export function insets(s: BorderSettings): Insets {
  const uniform = { top: s.paddingFraction, left: s.paddingFraction, bottom: s.paddingFraction, right: s.paddingFraction };
  return s.isPerSide ? s.sides ?? uniform : uniform;
}

/** The type an export is encoded as: PNG stays PNG with `original`; everything else the browser can't write is JPEG. */
export function exportType(format: ExportFormat, sourceType: string): 'image/jpeg' | 'image/png' {
  if (format === 'png' || (format === 'original' && sourceType === 'image/png')) return 'image/png';
  return 'image/jpeg';
}

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
  if (!HANDLE_STYLES.includes(s.handleStyle)) s.handleStyle = DEFAULT_SETTINGS.handleStyle;
  if (!CAPTION_FONTS.includes(s.captionFont)) s.captionFont = DEFAULT_SETTINGS.captionFont;
  if (!EXPORT_FORMATS.includes(s.exportFormat)) s.exportFormat = DEFAULT_SETTINGS.exportFormat;
  if (!(EXPORT_WIDTHS as readonly number[]).includes(s.exportWidth)) s.exportWidth = DEFAULT_SETTINGS.exportWidth;
  const sides = stored.sides as Partial<Insets> | null | undefined;
  s.sides = sides && (['top', 'left', 'bottom', 'right'] as const).every((k) => typeof sides[k] === 'number')
    ? (sides as Insets) : null;
  if (!CAPTION_ALIGNMENTS.includes(s.captionAlignmentAbove)) s.captionAlignmentAbove = 'spread';
  if (!CAPTION_ALIGNMENTS.includes(s.captionAlignmentBelow)) s.captionAlignmentBelow = 'spread';
  s.captionFields = [...new Set(fields(stored.captionFields, DEFAULT_SETTINGS.captionFields))];
  s.captionHiddenIcons = [...new Set(fields(stored.captionHiddenIcons, []))];
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

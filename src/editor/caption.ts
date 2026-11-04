// The caption printed above and below the photo, ported from `PhotoCaption` in the iOS app.
import type { Layout } from './layout';
import type { BorderFill, BorderSettings, CaptionAlignment, CaptionField, HandleStyle, Rect, Size } from './settings';

/** The EXIF tags the caption reads, as `exifr` returns them with `reviveValues: false`. */
export type ExifTags = {
  DateTimeOriginal?: string;
  DateTime?: string;
  Make?: string;
  Model?: string;
  FocalLength?: number;
  FocalLengthIn35mmFormat?: number;
  FNumber?: number;
  ExposureTime?: number;
  ISO?: number | number[];
  /** IPTC object name. */
  ObjectName?: string;
  /** IPTC caption/abstract. */
  Caption?: string;
  /** XMP dc:title and dc:description, which exifr gives as a string or a per-language object. */
  title?: unknown;
  description?: unknown;
  ImageDescription?: string;
};

/** A photo's details, already formatted for printing. Missing details are left out. */
export type PhotoDetails = {
  date?: string;
  title?: string;
  filename?: string;
  make?: string;
  model?: string;
  focalLength?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
};

/** An icon printed before a detail: a Lucide icon, or a mark drawn from a path. */
export type CaptionIcon = 'calendar' | 'camera' | 'scope' | 'aperture' | 'timer' | 'globe' | 'instagram' | 'flickr';
export type CaptionItem = { field: CaptionField; text: string; icon?: CaptionIcon };

/** Each detail's icon; the title, filename and ISO are printed without one. */
export const FIELD_ICONS: Partial<Record<CaptionField, CaptionIcon>> = {
  date: 'calendar',
  camera: 'camera',
  focalLength: 'scope',
  aperture: 'aperture',
  shutter: 'timer',
};

/** The icon each handle style prints; `at` prints "@name" and `plain` just the name. */
export const HANDLE_ICONS: Record<HandleStyle, CaptionIcon | undefined> = {
  instagram: 'instagram',
  flickr: 'flickr',
  at: undefined,
  website: 'globe',
  plain: undefined,
};
export type CaptionRows = {
  above: CaptionItem[];
  below: CaptionItem[];
  aboveAlignment: CaptionAlignment;
  belowAlignment: CaptionAlignment;
};

const TAGS: (keyof ExifTags)[] = [
  'DateTimeOriginal', 'DateTime', 'Make', 'Model', 'FocalLength', 'FocalLengthIn35mmFormat',
  'FNumber', 'ExposureTime', 'ISO', 'ObjectName', 'Caption', 'title', 'description', 'ImageDescription',
];

/** The photo's EXIF tags; `{}` when it has none or they can't be read. */
export async function readTags(file: File): Promise<ExifTags> {
  try {
    const exifr = (await import('exifr')).default;
    return ((await exifr.parse(file, { pick: TAGS, reviveValues: false, iptc: true, xmp: true })) as ExifTags | undefined) ?? {};
  } catch {
    return {};
  }
}

/** Orientations 5–8 turn the photo a quarter turn, swapping its width and height. */
export function uprightSize(pixelSize: Size, orientation?: number): Size {
  return orientation !== undefined && orientation >= 5 && orientation <= 8
    ? { width: pixelSize.height, height: pixelSize.width }
    : pixelSize;
}

const positive = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : undefined;

const text = (value: unknown): string | undefined => {
  const trimmed = typeof value === 'string' ? value.replace(/\0/g, '').trim() : '';
  return trimmed || undefined;
};

/** One decimal place, without a trailing ".0". */
function decimal(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** An EXIF date ("2026:11:02 14:05:09") as a short date, e.g. "Nov 2, 2026". EXIF dates carry no time zone, so read and write in UTC. */
function formattedDate(stamp: string): string | undefined {
  const match = /^(\d{4}):(\d{2}):(\d{2})/.exec(stamp);
  if (!match) return undefined;
  const [year, month, day] = match.slice(1).map(Number);
  // setUTCFullYear avoids Date.UTC's 0–99 → 19xx mapping; the round trip rejects dates that would roll over
  // (e.g. Feb 30) and the zeros cameras write when their clock was never set.
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  if (year < 1 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return undefined;
  }
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}

/** Longest title printed; a longer one is cut short so it can't shrink the whole row. */
const MAX_TITLE_LENGTH = 60;
/** Descriptions some cameras write on every photo, which say nothing about it. */
const CAMERA_DEFAULT_DESCRIPTIONS = new Set(['olympus digital camera', 'sony dsc', 'digital camera', 'default', 'image', 'picture']);

/** An XMP text value: a string, or per-language values where the first is the fallback. */
function xmpText(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const values = Object.values(value as Record<string, unknown>);
    return values.find((v): v is string => typeof v === 'string');
  }
  return undefined;
}

/** The photo's title, or failing that its caption or description. Text that only names the camera is skipped. */
function title(tags: ExifTags): string | undefined {
  const make = (text(tags.Make) ?? '').toLowerCase(), model = (text(tags.Model) ?? '').toLowerCase();
  const candidates = [tags.ObjectName, xmpText(tags.title), tags.Caption, xmpText(tags.description), tags.ImageDescription];
  for (const candidate of candidates) {
    // One line, with runs of spaces and line breaks collapsed.
    const line = (typeof candidate === 'string' ? candidate : '').split(/\s+/).filter(Boolean).join(' ');
    const lowered = line.toLowerCase();
    if (!line || CAMERA_DEFAULT_DESCRIPTIONS.has(lowered) || (make && lowered.includes(make)) || (model && lowered.includes(model))) continue;
    const chars = [...line];
    return chars.length > MAX_TITLE_LENGTH ? chars.slice(0, MAX_TITLE_LENGTH - 1).join('').trim() + '…' : line;
  }
  return undefined;
}

/** The filename without its extension, e.g. "IMG_1234" for "IMG_1234.HEIC". */
function cleanFilename(filename: string): string | undefined {
  const trimmed = filename.trim();
  const name = trimmed.replace(/\.[^./]*$/, '');
  return (name || trimmed) || undefined;
}

export function detailsFromTags(tags: ExifTags, filename?: string): PhotoDetails {
  const details: PhotoDetails = {};
  const photoTitle = title(tags);
  if (photoTitle) details.title = photoTitle;
  const name = filename && cleanFilename(filename);
  if (name) details.filename = name;
  const stamp = text(tags.DateTimeOriginal) ?? text(tags.DateTime);
  const date = stamp && formattedDate(stamp);
  if (date) details.date = date;
  const make = text(tags.Make), model = text(tags.Model);
  if (make) details.make = make;
  if (model) details.model = model;
  // The 35mm equivalent is what people compare; the actual focal length is the fallback.
  const focal = positive(tags.FocalLengthIn35mmFormat) ?? positive(tags.FocalLength);
  if (focal) details.focalLength = `${Math.round(focal)}mm`;
  const aperture = positive(tags.FNumber);
  if (aperture) details.aperture = `ƒ/${decimal(aperture)}`;
  const exposure = positive(tags.ExposureTime);
  if (exposure) details.shutter = exposure < 1 ? `1/${Math.round(1 / exposure)}s` : `${decimal(exposure)}s`;
  const iso = positive(Array.isArray(tags.ISO) ? tags.ISO[0] : tags.ISO);
  if (iso) details.iso = `ISO ${Math.round(iso)}`;
  return details;
}

/** The camera as the settings ask: make, model or both, without repeating a make the model already names. */
function cameraText(details: PhotoDetails, s: BorderSettings): string | undefined {
  const model = s.cameraShowsModel ? details.model ?? '' : '';
  let make = s.cameraShowsMake ? details.make ?? '' : '';
  if (model && model.toLowerCase().includes(make.toLowerCase())) make = '';
  return [make, model].filter(Boolean).join(' ') || undefined;
}

/** The handle as typed, without any "@" before it; "@name" in the `at` style. */
export function handleText(s: BorderSettings): string | undefined {
  const name = s.handle.trim().replace(/^@+/, '').trim();
  if (!name) return undefined;
  return s.handleStyle === 'at' ? `@${name}` : name;
}

function fieldText(field: CaptionField, details: PhotoDetails, s: BorderSettings): string | undefined {
  switch (field) {
    case 'camera': return cameraText(details, s);
    case 'handle': return handleText(s);
    default: return details[field];
  }
}

/** The icon printed before `field`. The handle's comes from its style, which has its own text-only choice. */
function fieldIcon(field: CaptionField, s: BorderSettings): CaptionIcon | undefined {
  if (!s.showsCaptionIcons) return undefined;
  if (field === 'handle') return HANDLE_ICONS[s.handleStyle];
  return s.captionHiddenIcons.includes(field) ? undefined : FIELD_ICONS[field];
}

/** What the settings print for a photo; empty while the caption is off. */
export function captionRows(details: PhotoDetails, s: BorderSettings): CaptionRows {
  const items = (order: CaptionField[]) =>
    s.showsCaption
      ? order.filter((f) => s.captionFields.includes(f)).flatMap((field) => {
          const value = fieldText(field, details, s);
          if (!value) return [];
          const icon = fieldIcon(field, s);
          return [icon ? { field, text: value, icon } : { field, text: value }];
        })
      : [];
  return {
    above: items(s.captionAbove),
    below: items(s.captionBelow),
    aboveAlignment: s.captionAlignmentAbove,
    belowAlignment: s.captionAlignmentBelow,
  };
}

// MARK: - Layout

/** The caption font's measurements at font size 1. */
export type FontMetrics = {
  /** Width of `text`. */
  measure: (text: string) => number;
  capHeight: number;
  /** The line box above and below the baseline. */
  ascent: number;
  descent: number;
};

export type CaptionPlacement = {
  fontSize: number;
  entries: { item: CaptionItem; frame: Rect }[];
  /** The box each icon is fitted into: as tall as the text's capital letters. */
  iconSize: Size;
  /** Space between an icon and its value. */
  iconGap: number;
  ascent: number;
  descent: number;
  /** The baseline of a line of text centered in `frame`. */
  baseline: (frame: Rect) => number;
};

/** Font size as a share of the canvas's shorter side, before it's limited by the room available. */
const SIZE_SHARE = 0.022;
/** A border must be this many font sizes deep: the space beside the photo, the row, and some beyond. */
const GAP_IN_FONT_SIZES = 2.6;
/** Space between the photo and the row, in font sizes. */
const PHOTO_SPACING = 0.8;
/** Least space between two spread items, in font sizes. */
const MINIMUM_SPACING = 1.0;
/** Space between items that aren't spread, in font sizes. */
const GROUPED_SPACING = 1.5;
const LINE_HEIGHT = 1.2;
/** An icon's box is this many times as wide as it is tall, so wide icons keep their full height. */
export const ICON_ASPECT = 1.3;
/** Space after an icon, in font sizes. */
const ICON_GAP_SHARE = 0.35;

/**
 * Lays each row out just beside the photo, arranged by its alignment: spread so its first item starts at
 * the photo's left edge and its last ends at the right edge (a single item is centered), or grouped at the
 * left, center or right. The text shrinks to fit the borders' depth and the photo's width.
 * A row with no border to print in is left out; `null` when nothing is placed.
 */
export function captionPlacement(rows: CaptionRows, layout: Layout, metrics: FontMetrics): CaptionPlacement | null {
  const canvas = layout.canvasSize, photo = layout.imageRect;
  if (!(photo.width > 0)) return null;
  const printed = [
    { above: true, items: rows.above, gap: photo.y, alignment: rows.aboveAlignment },
    { above: false, items: rows.below, gap: canvas.height - (photo.y + photo.height), alignment: rows.belowAlignment },
  ].filter((row) => row.items.length > 0 && row.gap >= 1);
  if (printed.length === 0) return null;

  // Every width grows in proportion to the font size, so measure at size 1 and scale.
  const widthsAtOne = (items: CaptionItem[]) =>
    items.map((i) => (i.icon ? metrics.capHeight * ICON_ASPECT + ICON_GAP_SHARE : 0) + metrics.measure(i.text));
  let fontSize = Math.min(canvas.width, canvas.height) * SIZE_SHARE;
  for (const { items, gap, alignment } of printed) {
    const spacing = alignment === 'spread' ? MINIMUM_SPACING : GROUPED_SPACING;
    const needed = widthsAtOne(items).reduce((a, b) => a + b, 0) + spacing * (items.length - 1);
    fontSize = Math.min(fontSize, gap / GAP_IN_FONT_SIZES, photo.width / needed);
  }

  const rowHeight = fontSize * LINE_HEIGHT;
  const entries: CaptionPlacement['entries'] = [];
  for (const { above, items, alignment } of printed) {
    const widths = widthsAtOne(items).map((w) => w * fontSize);
    const total = widths.reduce((a, b) => a + b, 0);
    const y = above ? photo.y - fontSize * PHOTO_SPACING - rowHeight : photo.y + photo.height + fontSize * PHOTO_SPACING;
    let spacing: number, x: number;
    if (alignment === 'spread') {
      spacing = items.length > 1 ? (photo.width - total) / (items.length - 1) : 0;
      x = items.length > 1 ? photo.x : photo.x + photo.width / 2 - widths[0] / 2;
    } else {
      spacing = fontSize * GROUPED_SPACING;
      const grouped = total + spacing * (items.length - 1);
      x = alignment === 'leading' ? photo.x
        : alignment === 'trailing' ? photo.x + photo.width - grouped
        : photo.x + photo.width / 2 - grouped / 2;
    }
    items.forEach((item, index) => {
      entries.push({ item, frame: { x, y, width: widths[index], height: rowHeight } });
      x += widths[index] + spacing;
    });
  }
  const ascent = metrics.ascent * fontSize, descent = metrics.descent * fontSize;
  return {
    fontSize,
    entries,
    iconSize: { width: metrics.capHeight * ICON_ASPECT * fontSize, height: metrics.capHeight * fontSize },
    iconGap: fontSize * ICON_GAP_SHARE,
    ascent,
    descent,
    baseline: (frame) => frame.y + frame.height / 2 + (ascent - descent) / 2,
  };
}

/** Dark text on a light border, light text on a dark one; over the blurred photo, light text (drawn with a shadow). */
export function captionTextColor(borderHex: string, fill: BorderFill): string {
  if (fill !== 'color') return 'rgba(255,255,255,0.9)';
  const linear = [1, 3, 5].map((i) => {
    const c = parseInt(borderHex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  return luminance > 0.25 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)';
}

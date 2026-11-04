// The caption printed above and below the photo, ported from `PhotoCaption` in the iOS app.
import type { BorderSettings, CaptionAlignment, CaptionField, Size } from './settings';

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
  Orientation?: number;
};

/** A photo's details, already formatted for printing. Missing details are left out. */
export type PhotoDetails = {
  date?: string;
  make?: string;
  model?: string;
  focalLength?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
};

export type CaptionItem = { field: CaptionField; text: string };
export type CaptionRows = {
  above: CaptionItem[];
  below: CaptionItem[];
  aboveAlignment: CaptionAlignment;
  belowAlignment: CaptionAlignment;
};

const TAGS: (keyof ExifTags)[] = [
  'DateTimeOriginal', 'DateTime', 'Make', 'Model', 'FocalLength', 'FocalLengthIn35mmFormat',
  'FNumber', 'ExposureTime', 'ISO', 'Orientation',
];

/** The photo's EXIF tags; `{}` when it has none or they can't be read. */
export async function readTags(file: File): Promise<ExifTags> {
  try {
    const exifr = (await import('exifr')).default;
    return ((await exifr.parse(file, { pick: TAGS, reviveValues: false })) as ExifTags | undefined) ?? {};
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
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}

export function detailsFromTags(tags: ExifTags): PhotoDetails {
  const details: PhotoDetails = {};
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

/** The handle as "@name", without any "@" typed before it. */
function handleText(s: BorderSettings): string | undefined {
  const name = s.handle.trim().replace(/^@+/, '').trim();
  return name ? `@${name}` : undefined;
}

function fieldText(field: CaptionField, details: PhotoDetails, s: BorderSettings): string | undefined {
  switch (field) {
    case 'camera': return cameraText(details, s);
    case 'handle': return handleText(s);
    default: return details[field];
  }
}

/** What the settings print for a photo; empty while the caption is off. */
export function captionRows(details: PhotoDetails, s: BorderSettings): CaptionRows {
  const items = (order: CaptionField[]) =>
    s.showsCaption
      ? order.filter((f) => s.captionFields.includes(f)).flatMap((field) => {
          const value = fieldText(field, details, s);
          return value ? [{ field, text: value }] : [];
        })
      : [];
  return {
    above: items(s.captionAbove),
    below: items(s.captionBelow),
    aboveAlignment: s.captionAlignmentAbove,
    belowAlignment: s.captionAlignmentBelow,
  };
}

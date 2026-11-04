import { describe, expect, it } from 'vitest';
import { captionRows, detailsFromTags, uprightSize } from './caption';
import { DEFAULT_SETTINGS, type BorderSettings } from './settings';

const settings = (overrides: Partial<BorderSettings>): BorderSettings => ({ ...DEFAULT_SETTINGS, showsCaption: true, ...overrides });
const texts = (items: { text: string }[]) => items.map((i) => i.text);

describe('photo details', () => {
  it('formatsExposureValues', () => {
    expect(detailsFromTags({ FNumber: 1.8 }).aperture).toBe('ƒ/1.8');
    expect(detailsFromTags({ FNumber: 2.0 }).aperture).toBe('ƒ/2');
    expect(detailsFromTags({ ExposureTime: 0.008 }).shutter).toBe('1/125s');
    expect(detailsFromTags({ ExposureTime: 2.5 }).shutter).toBe('2.5s');
    expect(detailsFromTags({ FocalLength: 5.7, FocalLengthIn35mmFormat: 26 }).focalLength).toBe('26mm');
    expect(detailsFromTags({ FocalLength: 5.7 }).focalLength).toBe('6mm');
    expect(detailsFromTags({ ISO: [64] }).iso).toBe('ISO 64');
    expect(detailsFromTags({ ISO: 64 }).iso).toBe('ISO 64');
  });

  it('formatsTheDateInGMT', () => {
    expect(detailsFromTags({ DateTimeOriginal: '2026:11:02 23:30:00' }).date).toBe('Nov 2, 2026');
    expect(detailsFromTags({ DateTime: '2025:01:09 00:10:00' }).date).toBe('Jan 9, 2025');
    expect(detailsFromTags({ DateTimeOriginal: 'garbage' }).date).toBeUndefined();
  });

  it('impossibleDatesAreOmitted', () => {
    // Cameras whose clock was never set write zeros.
    expect(detailsFromTags({ DateTimeOriginal: '0000:00:00 00:00:00' }).date).toBeUndefined();
    expect(detailsFromTags({ DateTimeOriginal: '2026:02:30 12:00:00' }).date).toBeUndefined();
    expect(detailsFromTags({ DateTimeOriginal: '2026:13:01 12:00:00' }).date).toBeUndefined();
    expect(detailsFromTags({ DateTimeOriginal: '0050:03:04 12:00:00' }).date).toBe('Mar 4, 50');
  });

  it('missingTagsAreOmitted', () => {
    expect(detailsFromTags({})).toEqual({});
    const rows = captionRows({}, settings({ handle: 'adam', handleStyle: 'at' }));
    expect(texts(rows.above)).toEqual(['@adam']);
    expect(rows.below).toEqual([]);
  });

  it('uprightSizeSwapsForRotatedOrientations', () => {
    expect(uprightSize({ width: 4032, height: 3024 }, 6)).toEqual({ width: 3024, height: 4032 });
    expect(uprightSize({ width: 4032, height: 3024 }, 1)).toEqual({ width: 4032, height: 3024 });
    expect(uprightSize({ width: 4032, height: 3024 })).toEqual({ width: 4032, height: 3024 });
  });
});

describe('caption rows', () => {
  const details = detailsFromTags({
    DateTimeOriginal: '2026:11:02 23:30:00', Make: 'Apple', Model: 'iPhone 16 Pro',
    FocalLengthIn35mmFormat: 24, FNumber: 1.78, ExposureTime: 1 / 60, ISO: 80,
  });

  it('cameraDropsARepeatedMake', () => {
    const camera = (d: object, s: Partial<BorderSettings> = {}) =>
      captionRows({ ...details, ...d }, settings({ captionFields: ['camera'], ...s })).below.map((i) => i.text);
    expect(camera({ make: 'Canon', model: 'Canon EOS R5' })).toEqual(['Canon EOS R5']);
    expect(camera({})).toEqual(['Apple iPhone 16 Pro']);
    expect(camera({}, { cameraShowsMake: false })).toEqual(['iPhone 16 Pro']);
    expect(camera({}, { cameraShowsMake: false, cameraShowsModel: false })).toEqual([]);
  });

  it('handleStripsLeadingAt', () => {
    expect(texts(captionRows({}, settings({ handle: '  @@adam ', handleStyle: 'at' })).above)).toEqual(['@adam']);
    expect(texts(captionRows({}, settings({ handle: '  @@adam ' })).above)).toEqual(['adam']);
    expect(captionRows({}, settings({ handle: '  @ ' })).above).toEqual([]);
  });

  it('rowsFollowSettingsOrderAndToggles', () => {
    const rows = captionRows(details, settings({
      captionFields: ['date', 'iso', 'aperture'],
      captionAbove: ['iso', 'date'],
      captionBelow: ['aperture', 'camera', 'handle', 'focalLength', 'shutter'],
      captionAlignmentBelow: 'center',
    }));
    expect(texts(rows.above)).toEqual(['ISO 80', 'Nov 2, 2026']);
    expect(texts(rows.below)).toEqual(['ƒ/1.8']);
    expect(rows.belowAlignment).toBe('center');
  });

  it('isEmptyWhileTheCaptionIsOff', () => {
    const rows = captionRows(details, settings({ showsCaption: false, handle: 'adam' }));
    expect(rows.above).toEqual([]);
    expect(rows.below).toEqual([]);
  });
});

describe('caption content parity', () => {
  it('titleSkipsCameraTextAndIsShortened', () => {
    expect(detailsFromTags({ ObjectName: '  Sunset\n over   the bay ' }).title).toBe('Sunset over the bay');
    expect(detailsFromTags({ ImageDescription: 'OLYMPUS DIGITAL CAMERA' }).title).toBeUndefined();
    expect(detailsFromTags({ ImageDescription: 'Shot on Canon EOS R5', Model: 'Canon EOS R5' }).title).toBeUndefined();
    expect(detailsFromTags({ ImageDescription: 'Harbor', Caption: 'Beach' }).title).toBe('Beach');
    const long = detailsFromTags({ title: 'x'.repeat(80) }).title!;
    expect(long).toHaveLength(60);
    expect(long.endsWith('…')).toBe(true);
  });

  it('filenameDropsItsExtension', () => {
    const rows = captionRows(detailsFromTags({}, 'IMG_1234.HEIC'), settings({ captionFields: ['filename'] }));
    expect(texts(rows.above)).toEqual(['IMG_1234']);
  });

  it('handleStylesSetItsTextAndIcon', () => {
    const handle = (handleStyle: BorderSettings['handleStyle']) => captionRows({}, settings({ handle: 'adam', handleStyle })).above[0];
    expect(handle('instagram')).toEqual({ field: 'handle', text: 'adam', icon: 'instagram' });
    expect(handle('flickr')).toEqual({ field: 'handle', text: 'adam', icon: 'flickr' });
    expect(handle('website')).toEqual({ field: 'handle', text: 'adam', icon: 'globe' });
    expect(handle('at')).toEqual({ field: 'handle', text: '@adam' });
    expect(handle('plain')).toEqual({ field: 'handle', text: 'adam' });
  });

  it('iconsFollowTheirSwitches', () => {
    const details = detailsFromTags({ DateTimeOriginal: '2026:11:02 23:30:00', ISO: 80, FNumber: 2 });
    const s = settings({ captionFields: ['date', 'iso', 'aperture', 'handle'], captionAbove: ['date', 'handle'], handle: 'adam' });
    expect(captionRows(details, s).above[0].icon).toBe('calendar');
    expect(captionRows(details, s).below.map((i) => i.icon)).toEqual(['aperture', undefined]);
    expect(captionRows(details, { ...s, captionHiddenIcons: ['date'] }).above[0].icon).toBeUndefined();
    // With every icon off, the handle's style icon goes too.
    const off = captionRows(details, { ...s, showsCaptionIcons: false });
    expect([...off.above, ...off.below].every((i) => i.icon === undefined)).toBe(true);
    // Hiding the handle in captionHiddenIcons doesn't apply: its style has its own text-only choice.
    expect(captionRows(details, { ...s, captionHiddenIcons: ['handle'] }).above[1].icon).toBe('instagram');
  });
});

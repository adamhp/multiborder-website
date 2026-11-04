import { describe, expect, it } from 'vitest';
import { layout, MAX_CANVAS_PIXELS } from './layout';
import {
  ASPECT_RATIOS,
  blurRadius,
  canvasWidthOverHeight,
  cornerRadius,
  DEFAULT_SETTINGS,
  exportType,
  loadSettings,
  moveCaptionField,
  type BorderSettings,
} from './settings';

const settings = (overrides: Partial<BorderSettings>): BorderSettings => ({ ...DEFAULT_SETTINGS, ...overrides });

describe('layout', () => {
  it('noPaddingOriginalRatioIsTheSourceSize', () => {
    const result = layout({ width: 3000, height: 2000 }, settings({ aspectRatio: 'original', paddingFraction: 0 }));
    expect(result.canvasSize).toEqual({ width: 3000, height: 2000 });
    expect(result.imageRect).toEqual({ x: 0, y: 0, width: 3000, height: 2000 });
  });

  it('photoIsNeverUpscaled', () => {
    const result = layout({ width: 1000, height: 500 }, settings({ aspectRatio: '1:1', paddingFraction: 0, exportWidth: 8192 }));
    expect(result.canvasSize).toEqual({ width: 1000, height: 1000 });
    expect(result.imageRect.width).toBe(1000);
    expect(result.imageRect.height).toBe(500);
  });

  it('exportWidthShrinksCanvasAndKeepsProportions', () => {
    const result = layout({ width: 4000, height: 3000 }, settings({ aspectRatio: '4:5', paddingFraction: 0.1, exportWidth: 1080 }));
    expect(result.canvasSize).toEqual({ width: 1080, height: 1350 });
    const rect = result.imageRect;
    expect(Math.abs(rect.x - 108)).toBeLessThan(0.5);
    expect(Math.abs(rect.width - 864)).toBeLessThan(0.5);
    expect(Math.abs(rect.y + rect.height / 2 - 675)).toBeLessThan(0.5);
  });

  for (const ratio of ASPECT_RATIOS) {
    for (const isLandscape of [false, true]) {
      it(`canvasMatchesAspectRatio ${ratio} landscape=${isLandscape}`, () => {
        const source = { width: 3024, height: 4032 };
        const s = settings({ aspectRatio: ratio, isLandscape, paddingFraction: 0.05 });
        const { canvasSize: canvas, imageRect: rect } = layout(source, s);
        const expected = canvasWidthOverHeight(s) ?? source.width / source.height;
        expect(Math.abs(canvas.width / canvas.height - expected)).toBeLessThan(0.01);
        expect(rect.width).toBeLessThanOrEqual(source.width + 0.5);
        expect(rect.height).toBeLessThanOrEqual(source.height + 0.5);
        expect(Math.abs(rect.x + rect.width / 2 - canvas.width / 2)).toBeLessThanOrEqual(0.5);
        expect(Math.abs(rect.y + rect.height / 2 - canvas.height / 2)).toBeLessThanOrEqual(0.5);
        expect(Math.abs(rect.width / rect.height - source.width / source.height)).toBeLessThan(0.001);
      });
    }

    it(`paddingIsAFractionOfTheShorterSide ${ratio}`, () => {
      const fraction = 0.1;
      const source = { width: 1000, height: 1000 };
      const { canvasSize: canvas, imageRect: rect } = layout(source, settings({ aspectRatio: ratio, paddingFraction: fraction }));
      const inset = fraction * Math.min(canvas.width, canvas.height);
      expect(Math.abs(Math.min(rect.x, rect.y) - inset)).toBeLessThan(1);
      expect(rect.width).toBe(1000);
      expect(rect.height).toBe(1000);
    });
  }

  it('capsCanvasAtTheBudget', () => {
    const source = { width: 8064, height: 6048 };
    const { canvasSize: canvas, imageRect: rect } = layout(source, settings({ aspectRatio: '2:3', paddingFraction: 0.16 }));
    expect(canvas.width * canvas.height).toBeLessThanOrEqual(MAX_CANVAS_PIXELS + canvas.width);
    expect(Math.abs(canvas.width / canvas.height - 2 / 3)).toBeLessThan(0.001);
    expect(rect.width).toBeLessThan(source.width);
  });

  it('emptySourceHasEmptyLayout', () => {
    const result = layout({ width: 0, height: 0 }, DEFAULT_SETTINGS);
    expect(result.canvasSize).toEqual({ width: 0, height: 0 });
    expect(result.imageRect).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });
});

describe('settings', () => {
  it('cornerRadiusScalesWithTheShorterSideAndFitsThePhoto', () => {
    const canvas = { width: 1000, height: 2000 };
    expect(cornerRadius(settings({ roundsCorners: false }), canvas, canvas)).toBe(0);
    expect(cornerRadius(settings({ roundsCorners: true, cornerFraction: 0.02 }), canvas, canvas)).toBeCloseTo(20);
    // Clamped to the range's top, 0.08.
    expect(cornerRadius(settings({ roundsCorners: true, cornerFraction: 1 }), canvas, canvas)).toBeCloseTo(80);
    // Never more than half the photo's shorter side.
    expect(cornerRadius(settings({ roundsCorners: true, cornerFraction: 0.08 }), canvas, { width: 100, height: 50 })).toBe(25);
  });

  it('blurRadiusScalesWithTheShorterSideAndIsClamped', () => {
    const canvas = { width: 1000, height: 2000 };
    expect(blurRadius(settings({ blurFraction: 0.04 }), canvas)).toBeCloseTo(40);
    expect(blurRadius(settings({ blurFraction: 0 }), canvas)).toBeCloseTo(5);
    expect(blurRadius(settings({ blurFraction: 1 }), canvas)).toBeCloseTo(100);
  });

  it('loadSettingsFallsBackToDefaults', () => {
    const store = new Map<string, string>();
    const storage = { getItem: (k: string) => store.get(k) ?? null } as Storage;
    expect(loadSettings(storage)).toEqual(DEFAULT_SETTINGS);
    store.set('multiborder.settings', '{not json');
    expect(loadSettings(storage)).toEqual(DEFAULT_SETTINGS);
    store.set('multiborder.settings', JSON.stringify({ aspectRatio: '7:8', paddingFraction: 0.05, fill: 'plaid' }));
    expect(loadSettings(storage)).toEqual({ ...DEFAULT_SETTINGS, paddingFraction: 0.05 });
  });
});

describe('moveCaptionField', () => {
  it('movesWithinARowAndBetweenRows', () => {
    const s = settings({ captionAbove: ['date', 'handle'], captionBelow: ['camera', 'focalLength', 'aperture', 'shutter', 'iso'] });
    expect(moveCaptionField(s, 'handle', 'above', 0).captionAbove).toEqual(['handle', 'date']);
    const across = moveCaptionField(s, 'iso', 'above', 1);
    expect(across.captionAbove).toEqual(['date', 'iso', 'handle']);
    expect(across.captionBelow).toEqual(['camera', 'focalLength', 'aperture', 'shutter']);
    // Out-of-range indexes clamp to the row's ends.
    expect(moveCaptionField(s, 'date', 'below', 99).captionBelow.at(-1)).toBe('date');
    expect(moveCaptionField(s, 'date', 'below', -5).captionBelow[0]).toBe('date');
    // The original is untouched.
    expect(s.captionAbove).toEqual(['date', 'handle']);
  });
});

describe('per-side borders', () => {
  for (const exportWidth of [0, 1080]) {
    it(`unevenSidesKeepEachWidthAndCenterBetweenThem exportWidth=${exportWidth}`, () => {
      const source = { width: 3024, height: 4032 };
      const sides = { top: 0.02, left: 0.04, bottom: 0.16, right: 0.08 };
      const { canvasSize: canvas, imageRect: rect } = layout(source, settings({ aspectRatio: '1:1', isPerSide: true, sides, exportWidth }));
      const shorter = Math.min(canvas.width, canvas.height);
      expect(rect.y).toBeGreaterThanOrEqual(sides.top * shorter - 0.5);
      expect(rect.x).toBeGreaterThanOrEqual(sides.left * shorter - 0.5);
      expect(canvas.height - (rect.y + rect.height)).toBeGreaterThanOrEqual(sides.bottom * shorter - 0.5);
      expect(canvas.width - (rect.x + rect.width)).toBeGreaterThanOrEqual(sides.right * shorter - 0.5);
      expect(Math.abs(rect.y - sides.top * shorter)).toBeLessThanOrEqual(2);
      expect(Math.abs(canvas.height - (rect.y + rect.height) - sides.bottom * shorter)).toBeLessThanOrEqual(2);
      const spareLeft = rect.x - sides.left * shorter, spareRight = canvas.width - (rect.x + rect.width) - sides.right * shorter;
      expect(Math.abs(spareLeft - spareRight)).toBeLessThanOrEqual(1.5);
      expect(Math.abs(rect.width / rect.height - source.width / source.height)).toBeLessThan(0.001);
    });
  }

  it('equalSidesMatchTheSingleWidth', () => {
    const source = { width: 3024, height: 4032 };
    for (const f of [0, 0.05, 0.16]) {
      const perSide = settings({ isPerSide: true, sides: { top: f, left: f, bottom: f, right: f } });
      expect(layout(source, perSide)).toEqual(layout(source, settings({ paddingFraction: f })));
    }
  });

  it('sidesAreIgnoredWhileOff', () => {
    const source = { width: 3024, height: 4032 };
    const withSides = settings({ paddingFraction: 0.05, sides: { top: 0.16, left: 0, bottom: 0, right: 0 } });
    expect(layout(source, withSides)).toEqual(layout(source, settings({ paddingFraction: 0.05 })));
  });
});

describe('export format', () => {
  it('originalKeepsPNGAndOtherwiseExportsJPEG', () => {
    expect(exportType('original', 'image/png')).toBe('image/png');
    expect(exportType('original', 'image/jpeg')).toBe('image/jpeg');
    expect(exportType('original', 'image/heic')).toBe('image/jpeg');
    expect(exportType('original', 'image/webp')).toBe('image/jpeg');
    expect(exportType('png', 'image/jpeg')).toBe('image/png');
    expect(exportType('jpeg', 'image/png')).toBe('image/jpeg');
  });

  it('loadsOnlyKnownExportOptions', () => {
    const store = new Map([['multiborder.settings', JSON.stringify({ exportWidth: 50, exportFormat: 'heic', handleStyle: 'myspace', captionFont: 'comicSans' })]]);
    const loaded = loadSettings({ getItem: (k: string) => store.get(k) ?? null } as Storage);
    expect(loaded.exportWidth).toBe(0);
    expect(loaded.exportFormat).toBe('original');
    expect(loaded.handleStyle).toBe('instagram');
    expect(loaded.captionFont).toBe('spaceMono');
  });
});

import { describe, expect, it } from 'vitest';
import { captionPlacement, captionTextColor, type CaptionItem, type CaptionRows } from './caption';
import type { Layout } from './layout';

const measure = (t: string) => t.length * 0.6;
const item = (text: string): CaptionItem => ({ field: 'date', text });
const rows = (above: string[], below: string[] = [], alignment: CaptionRows['aboveAlignment'] = 'spread'): CaptionRows => ({
  above: above.map(item), below: below.map(item), aboveAlignment: alignment, belowAlignment: alignment,
});
// A 1000×1000 canvas with a 40px border above and below an 800px-wide photo.
const bordered: Layout = { canvasSize: { width: 1000, height: 1000 }, imageRect: { x: 100, y: 40, width: 800, height: 920 } };

describe('caption placement', () => {
  it('rowWithoutRoomIsLeftOut', () => {
    const flush: Layout = { canvasSize: { width: 1000, height: 1000 }, imageRect: { x: 0, y: 0, width: 1000, height: 1000 } };
    expect(captionPlacement(rows(['Nov 2, 2026']), flush, measure)).toBeNull();
    expect(captionPlacement(rows([]), bordered, measure)).toBeNull();
  });

  it('fontSizeIsLimitedByTheBorderDepth', () => {
    const placement = captionPlacement(rows(['A', 'B']), bordered, measure)!;
    expect(placement.fontSize).toBeCloseTo(Math.min(1000 * 0.022, 40 / 2.6));
  });

  it('fontSizeShrinksToFitThePhotoWidth', () => {
    const long = 'x'.repeat(200);
    const placement = captionPlacement(rows([long]), bordered, measure)!;
    expect(placement.fontSize).toBeCloseTo(800 / (200 * 0.6));
  });

  it('spreadRowSpansThePhotoWidth', () => {
    const { entries } = captionPlacement(rows(['Nov 2, 2026', '@adam', 'ISO 80']), bordered, measure)!;
    expect(entries[0].frame.x).toBeCloseTo(100);
    const last = entries[entries.length - 1].frame;
    expect(last.x + last.width).toBeCloseTo(900, 2);
  });

  it('singleSpreadItemIsCentered', () => {
    const { entries } = captionPlacement(rows(['@adam']), bordered, measure)!;
    expect(entries[0].frame.x + entries[0].frame.width / 2).toBeCloseTo(500);
  });

  it('groupedRowsUseFixedSpacing', () => {
    const at = (alignment: CaptionRows['aboveAlignment']) => captionPlacement(rows(['AB', 'CD'], [], alignment), bordered, measure)!;
    const leading = at('leading');
    expect(leading.entries[0].frame.x).toBeCloseTo(100);
    const gap = leading.entries[1].frame.x - (leading.entries[0].frame.x + leading.entries[0].frame.width);
    expect(gap).toBeCloseTo(leading.fontSize * 1.5);
    const trailing = at('trailing').entries[1].frame;
    expect(trailing.x + trailing.width).toBeCloseTo(900);
    const center = at('center').entries;
    expect((center[0].frame.x + center[1].frame.x + center[1].frame.width) / 2).toBeCloseTo(500);
  });

  it('rowsSitJustBesideThePhoto', () => {
    const placement = captionPlacement(rows(['A'], ['B']), bordered, measure)!;
    const f = placement.fontSize;
    expect(placement.entries[0].frame.y).toBeCloseTo(40 - f * 0.8 - f * 1.2);
    expect(placement.entries[1].frame.y).toBeCloseTo(960 + f * 0.8);
    expect(placement.entries[1].frame.height).toBeCloseTo(f * 1.2);
  });
});

describe('caption text color', () => {
  it('textColorFollowsBorderLuminance', () => {
    expect(captionTextColor('#ffffff', 'color')).toBe('rgba(0,0,0,0.7)');
    expect(captionTextColor('#000000', 'color')).toBe('rgba(255,255,255,0.8)');
    // sRGB 0x80 is about 0.22 linear: dark enough for light text.
    expect(captionTextColor('#808080', 'color')).toBe('rgba(255,255,255,0.8)');
    expect(captionTextColor('#ffffff', 'blur')).toBe('rgba(255,255,255,0.9)');
  });
});

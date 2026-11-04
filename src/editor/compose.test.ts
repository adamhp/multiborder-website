import { expect, it } from 'vitest';
import { exportName } from './compose';

it('exportNameReplacesTheExtension', () => {
  expect(exportName('IMG_2066.JPG')).toBe('IMG_2066-multiborder.jpg');
  expect(exportName('beach.day.heic')).toBe('beach.day-multiborder.jpg');
  expect(exportName('.png')).toBe('photo-multiborder.jpg');
});

it('exportNameUsesThePNGExtension', () => {
  expect(exportName('IMG_2066.JPG', 'image/png')).toBe('IMG_2066-multiborder.png');
});

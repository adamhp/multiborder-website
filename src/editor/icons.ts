// The icons printed in the caption, as SVG paths on a 24-unit grid, so the canvas (`Path2D`) and the
// controls (`<svg>`) draw exactly the same marks. The Lucide icons are stroked; the site marks are filled.
import type { CaptionIcon } from './caption';

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const roundedRect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

export type IconDrawing = { paths: string[]; fill: boolean };

export const CAPTION_ICON_PATHS: Record<CaptionIcon, IconDrawing> = {
  // Lucide: calendar, camera, crosshair, aperture, timer, globe (ISC license).
  calendar: { fill: false, paths: ['M8 2v3', 'M16 2v3', roundedRect(3, 3, 18, 18, 2), 'M3 9h18'] },
  camera: {
    fill: false,
    paths: [
      'M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z',
      circle(12, 13, 3),
    ],
  },
  scope: { fill: false, paths: [circle(12, 12, 10), 'M22 12H18', 'M6 12H2', 'M12 6V2', 'M12 22V18'] },
  aperture: {
    fill: false,
    paths: [circle(12, 12, 10), 'm14.31 8 5.74 9.94', 'M9.69 8h11.48', 'm7.38 12 5.74-9.94', 'M9.69 16 3.95 6.06', 'M14.31 16H2.83', 'm16.62 12-5.74 9.94'],
  },
  timer: { fill: false, paths: ['M10 2H14', 'M12 14 15 11', circle(12, 14, 8)] },
  globe: { fill: false, paths: [circle(12, 12, 10), 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', 'M2 12h20'] },
  // The app's marks for sites Lucide doesn't cover, filled with the even-odd rule.
  instagram: {
    fill: true,
    paths: [roundedRect(0, 0, 24, 24, 6.72) + roundedRect(2.16, 2.16, 19.68, 19.68, 4.8) + circle(12, 12, 5.52) + circle(12, 12, 3.36) + circle(18.24, 5.76, 1.44)],
  },
  flickr: { fill: true, paths: [circle(6, 12, 5.04) + circle(18, 12, 5.04)] },
};

/** Space kept under the icon, as a share of its box's height: the camera sits low, so it's lifted and shrunk a little. */
export const iconBottomPadding = (icon: CaptionIcon) => (icon === 'camera' ? 0.12 : 0);

/** Draws `icon` in `color`, fitted and centered in the box at `x, y` of `width × height`. */
export function drawCaptionIcon(ctx: CanvasRenderingContext2D, icon: CaptionIcon, x: number, y: number, width: number, height: number, color: string) {
  const { paths, fill } = CAPTION_ICON_PATHS[icon];
  const side = Math.min(width, height);
  ctx.save();
  ctx.translate(x + (width - side) / 2, y + (height - side) / 2);
  ctx.scale(side / 24, side / 24);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const d of paths) {
    const path = new Path2D(d);
    if (fill) ctx.fill(path, 'evenodd');
    else ctx.stroke(path);
  }
  ctx.restore();
}

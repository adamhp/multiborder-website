import type { CaptionFont } from './settings';

/** Each caption font's name in the menu and the family `fonts.css` declares for it (the app's bundled files). */
export const CAPTION_FONT_INFO: Record<CaptionFont, { title: string; family: string }> = {
  dmMono: { title: 'DM Mono', family: '"MB DM Mono"' },
  dmSans: { title: 'DM Sans', family: '"MB DM Sans"' },
  ibmPlexMono: { title: 'IBM Plex Mono', family: '"MB IBM Plex Mono"' },
  inter: { title: 'Inter', family: '"MB Inter"' },
  jetBrainsMono: { title: 'JetBrains Mono', family: '"MB JetBrains Mono"' },
  spaceGrotesk: { title: 'Space Grotesk', family: '"MB Space Grotesk"' },
  spaceMono: { title: 'Space Mono', family: '"MB Space Mono"' },
};

/** Waits for a caption font, so measuring and drawing use it rather than the fallback. */
export async function loadCaptionFont(font: CaptionFont): Promise<void> {
  try {
    await document.fonts.load(`100px ${CAPTION_FONT_INFO[font].family}`, 'ƒ/1.8 ISO');
  } catch {
    // Draws with the fallback font.
  }
}

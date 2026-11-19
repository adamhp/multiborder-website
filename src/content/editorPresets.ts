import type { BorderSettings } from '@/editor/settings';

/** A landing page at `/editor/<slug>`: the web editor, opened already set up for one job. */
export type EditorPreset = {
  slug: string;
  /** The page title, before the site's suffix. */
  title: string;
  description: string;
  heading: string;
  intro: string;
  /** Laid over the visitor's saved settings when the page opens. */
  settings: Partial<BorderSettings>;
};

export const editorPresets: EditorPreset[] = [
  {
    slug: 'white-border',
    title: 'Add a White Border to Photos Online',
    description:
      'Add a clean white border to one photo or a whole batch, right in your browser. Free, and nothing is uploaded.',
    heading: 'Add a white border to your photos',
    intro:
      'The editor is set to an even white border that keeps each photo’s own shape. Add your photos, move the Border width slider until it looks right, then download them one at a time or all together.',
    settings: { aspectRatio: 'original', fill: 'color', borderColor: '#ffffff', paddingFraction: 0.05, isPerSide: false },
  },
  {
    slug: 'instagram',
    title: 'Instagram Photo Border: Post Without Cropping',
    description:
      'Fit your whole photo into Instagram’s 3:4 frame with a border instead of a crop. Works on a batch of photos at once. Free, and nothing is uploaded.',
    heading: 'Fit your whole photo on Instagram',
    intro:
      'The editor is set to a 3:4 canvas, the tallest shape Instagram accepts and the shape of its profile grid, with white filling the space your photo doesn’t. Nothing is cropped. Add your photos, switch to 4:5 or change the color if you like, and download them at 1080 pixels wide.',
    settings: {
      aspectRatio: '3:4',
      isLandscape: false,
      fill: 'color',
      borderColor: '#ffffff',
      paddingFraction: 0.04,
      isPerSide: false,
      exportWidth: 1080,
    },
  },
  {
    slug: 'camera-settings',
    title: 'Add Camera Settings (EXIF) to Photos',
    description:
      'Print the camera, focal length, aperture, shutter speed and ISO on your photo’s border, read from the file itself. Free, and nothing is uploaded.',
    heading: 'Show your camera settings on the photo',
    intro:
      'The editor is set to a white border with the caption turned on. Add a photo and its camera, focal length, aperture, shutter speed and ISO are read from the file and printed on the border. Choose which details to show, reorder them, and pick a typeface.',
    settings: { showsCaption: true, paddingFraction: 0.08, isPerSide: false, fill: 'color', borderColor: '#ffffff' },
  },
  {
    slug: 'blur-background',
    title: 'Blurred Background Border for Photos',
    description:
      'Fill the space around your photo with a soft, blurred copy of the photo itself instead of a plain color. Free, and nothing is uploaded.',
    heading: 'Fill the border with a blurred copy',
    intro:
      'The editor is set to a 4:5 canvas with the border filled by a blurred copy of your photo, so wide shots fit a tall frame without bars of plain color. Add your photos, then adjust Blur strength and Border width.',
    settings: { aspectRatio: '4:5', isLandscape: false, fill: 'blur', paddingFraction: 0.04, isPerSide: false },
  },
];

export const findPreset = (slug: string) => editorPresets.find((p) => p.slug === slug);

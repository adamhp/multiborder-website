import {
  ExportIcon,
  HdrIcon,
  MultiplePhotosIcon,
  PhotosEditIcon,
  ShareIcon,
  ShortcutsIcon,
} from '@/components/FeatureIcons';

export type Spotlight = {
  title: string;
  body: string;
  points: string[];
  video: string;
  poster: string;
  videoLabel: string;
};
export type Tile = {
  title: string;
  body: string;
  icon: (props: React.ComponentPropsWithoutRef<'svg'>) => React.JSX.Element;
};

// Names follow the app's own What's New sheet (multiborder/WhatsNew.swift).
export const spotlights: Spotlight[] = [
  {
    title: 'Borders your way',
    body: 'Round the photo’s corners, lift it off the border with a soft shadow, give every side its own width, or fill the border with a soft blur of the photo.',
    points: ['Rounded corners', 'Shadow', 'A different width for each side', 'Blurred photo border'],
    video: '/videos/border-styles.mp4',
    poster: '/videos/border-styles.jpg',
    videoLabel: 'A photo’s corners round off and a shadow fades in',
  },
  {
    title: 'Camera settings caption',
    body: 'Show the date taken, title, filename, your handle, camera, focal length, aperture, shutter speed and ISO above and below the photo, all read from the photo itself.',
    points: ['Drag details into place', 'Choose the font', 'Optional icons'],
    video: '/videos/camera-caption.mp4',
    poster: '/videos/camera-caption.jpg',
    videoLabel: 'A camera settings caption appears under a photo and changes font',
  },
];

export const tiles: Tile[] = [
  {
    title: 'Edit many photos at once',
    body: 'Select as many photos as your phone can handle and border them all together.',
    icon: MultiplePhotosIcon,
  },
  {
    title: 'HDR stays HDR',
    body: 'Exports keep the bright highlights in HDR photos.',
    icon: HdrIcon,
  },
  {
    title: 'Edit in Photos',
    body: 'Add a border without leaving the Photos app, and change it later.',
    icon: PhotosEditIcon,
  },
  {
    title: 'Share sheet',
    body: 'Border photos from any app using your last settings.',
    icon: ShareIcon,
  },
  {
    title: 'Shortcuts',
    body: 'An “Add Border to Photos” action for your automations.',
    icon: ShortcutsIcon,
  },
  {
    title: 'Saves where you want',
    body: 'Pick the album and format, keep each photo’s original date, and downloads keep going in the background.',
    icon: ExportIcon,
  },
];

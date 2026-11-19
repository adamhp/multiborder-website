import { post as fullPhotoInstagram } from './post-full-photo-instagram-without-cropping';
import { post as instagramSizes } from './instagram-photo-sizes-4-5-3-4-1-1';
import { post as blurredBorder } from './blurred-background-photo-border';
import { post as filmBorders } from './film-style-photo-borders';
import { post as instagramWhiteBorder } from './add-white-border-instagram-photos';
import { post as batchBordersIphone } from './add-borders-to-multiple-photos-iphone';
import { post as cameraSettingsCaption } from './add-camera-settings-to-photos';

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** `YYYY-MM-DD`. */
  date: string;
  body: React.ReactNode;
};

/** Newest first. */
export const posts: Post[] = [
  fullPhotoInstagram,
  instagramSizes,
  blurredBorder,
  filmBorders,
  instagramWhiteBorder,
  batchBordersIphone,
  cameraSettingsCaption,
];

export const findPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

import Link from 'next/link';
import type { Post } from '.';
import { Figure } from './Figure';

export const post: Post = {
  slug: 'post-full-photo-instagram-without-cropping',
  title: 'How to post a full photo on Instagram without cropping',
  description:
    'Three ways to get a whole photo onto Instagram: the built-in fit button, shooting in a shape that fits, and adding a border. Here’s when each one works.',
  date: '2026-11-19',
  body: (
    <>
      <p>
        You pick a photo, tap Next, and Instagram has zoomed in on it. The edges are gone. There are three ways to get
        the whole photo back, and which one works depends on the shape of the photo.
      </p>

      <h2>1. Use the fit button</h2>
      <p>
        When you choose a photo for a post, Instagram shows a small button with two arrows in the corner of the
        preview. Tap it, or pinch the photo inward, and the preview switches from the zoomed-in crop to the photo’s
        own shape.
      </p>
      <p>
        This only goes so far. At the time of writing, Instagram accepts posts between 3:4 (tall) and 1.91:1 (wide).
        If your photo is inside that range, the fit button shows all of it. If it’s outside, the button stops at the
        limit and the rest is still cropped.
      </p>

      <h2>2. Shoot in a shape that fits</h2>
      <p>
        An upright iPhone photo in the default 4:3 mode is exactly 3:4, so it fits with nothing lost. If you know a
        photo is going to Instagram, shooting in that mode saves you the trouble later.
      </p>
      <p>
        This doesn’t help with the photos you already have, or with a camera that shoots 3:2. Held upright, a 3:2
        photo is 2:3, which is taller than Instagram allows.
      </p>

      <h2>3. Add a border</h2>
      <p>
        A border works for every photo. You place the photo on a canvas in a shape Instagram accepts, and the border
        fills whatever space is left over. Instagram sees an image that already fits, so it has nothing to crop.
      </p>
      <Figure src='instagram-crop-vs-border.jpg' width={1600} height={1038}
        alt='The same sea stack photo twice: cropped to 3:4 on the left, and whole on a white 3:4 border on the right'
        caption='Left: what Instagram does to a 2:3 photo. Right: the same photo on a 3:4 canvas, with white filling the sides.' />
      <p>
        The <Link href='/editor/instagram'>Instagram border editor</Link> is set up for this. It opens with a 3:4
        canvas and a white border:
      </p>
      <ol>
        <li>Choose your photos. They all get the same canvas.</li>
        <li>Keep 3:4, or pick 4:5 or 1:1 if that suits your feed better.</li>
        <li>Raise Border width if you want a frame on every side as well.</li>
        <li>Download. The size is already set to 1080 pixels wide.</li>
      </ol>
      <p>Nothing is uploaded. The editor works on the photos in your browser.</p>

      <h2>Which one to use</h2>
      <ul>
        <li>
          <strong>A photo that’s only slightly off</strong>, such as a 4:5 crop: the fit button is enough.
        </li>
        <li>
          <strong>A portrait from a camera</strong> (2:3): add a border. The fit button will still trim the top and
          bottom.
        </li>
        <li>
          <strong>A panorama or a 16:9 landscape</strong>: add a border on a tall canvas. The photo keeps its full
          width and the post takes up more of the screen.
        </li>
        <li>
          <strong>A carousel</strong>: add the same border to every photo. Instagram fits all the slides to the shape
          of the first one, so mixed shapes get cropped.
        </li>
      </ul>
      <p>
        Not sure which canvas to choose? <Link href='/blog/instagram-photo-sizes-4-5-3-4-1-1'>Here’s how 3:4, 4:5 and
        1:1 compare</Link>.
      </p>
    </>
  ),
};

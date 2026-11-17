import Link from 'next/link';
import type { Post } from '.';
import { Figure } from './Figure';

export const post: Post = {
  slug: 'add-white-border-instagram-photos',
  title: 'How to add a white border to Instagram photos without cropping',
  description:
    'Instagram crops photos that are too tall or too wide. A white border fits the whole photo into a 4:5 or 3:4 frame. Here’s how to add one, for one photo or fifty.',
  date: '2026-11-17',
  body: (
    <>
      <p>
        You post a portrait from your camera, and Instagram trims the top and bottom off. The horizon you lined up so
        carefully is gone, along with the subject’s feet. A white border fixes this. It pads the photo out to a shape
        Instagram accepts, so the whole frame survives.
      </p>
      <p>
        I built Multiborder because I was doing this by hand for every photo I posted. Here’s what I’ve learned about
        getting it right.
      </p>

      <h2>Why Instagram crops your photos</h2>
      <p>
        Instagram only accepts a certain range of shapes. At the time of writing, the tallest a post can be is 3:4
        (1080 × 1440 pixels), and the widest is 1.91:1. Anything outside that range gets cropped to fit.
      </p>
      <p>Most cameras shoot in shapes that fall outside that range:</p>
      <ul>
        <li>
          <strong>Mirrorless and DSLR cameras</strong> shoot 3:2. Held upright, that’s 2:3, which is taller than 3:4.
          Instagram crops it.
        </li>
        <li>
          <strong>iPhones</strong> shoot 4:3 by default, so an upright iPhone photo is exactly 3:4 and fits. A 16:9
          photo does not.
        </li>
        <li>
          <strong>Panoramas</strong> are far wider than 1.91:1 and lose most of their width.
        </li>
      </ul>
      <p>
        The profile grid adds a second crop. It shows every post as a 3:4 tile, so a 4:5 post loses a sliver from each
        side and a landscape post loses a lot.
      </p>

      <h2>How a border solves it</h2>
      <p>
        A border changes the canvas, and leaves the photo alone. Take a 2:3 portrait and place it on a 3:4 white canvas.
        The photo keeps its full height, and white bars fill the space on its left and right. Instagram sees a 3:4
        image and has nothing to crop.
      </p>
      <Figure src='instagram-crop-vs-border.jpg' width={1600} height={1038}
        alt='The same sea stack photo twice: cropped to 3:4 on the left, and whole on a white 3:4 border on the right'
        caption='Left: a 2:3 photo cropped to 3:4, losing sky and sea. Right: the same photo on a 3:4 white border, with nothing cut off.' />
      <p>
        The same trick works for landscapes. Put a 3:2 landscape on a 4:5 canvas and it gets white space above and
        below. The photo is the same size it would have been as a landscape post, but the post fills more of the
        screen. A whole feed of these looks consistent, too.
      </p>

      <h2>Which shape to pick</h2>
      <ul>
        <li>
          <strong>3:4</strong> is the tallest shape Instagram allows, and it matches the grid tiles. Your post appears
          on your profile exactly as you framed it.
        </li>
        <li>
          <strong>4:5</strong> was the tallest shape for years, and many people still use it. It works well if your
          existing feed is 4:5.
        </li>
        <li>
          <strong>1:1</strong> gives the classic square look, with the most white space around a landscape photo.
        </li>
      </ul>
      <p>
        If you post a carousel, use the same shape for every photo. Instagram fits every slide to the shape of the
        first one, so a mixed set gets cropped.
      </p>

      <h2>Adding the border</h2>
      <p>
        You can do this in any editor with a canvas size setting, one photo at a time. For a whole set, this is what I
        made Multiborder for. In the <Link href='/editor'>free web editor</Link>:
      </p>
      <ol>
        <li>Add your photos. You can add as many as you like, and they all get the same border.</li>
        <li>Pick 3:4 or 4:5. Turn the canvas sideways if you want a landscape frame.</li>
        <li>
          Set the border width. Even with a width of zero, the photo sits inside the canvas you chose, with white
          filling the gaps. A small width adds an even frame on every side as well.
        </li>
        <li>Leave the color white, or pick any other color.</li>
        <li>Download. For Instagram, a width of 1080 pixels is plenty.</li>
      </ol>
      <Figure src='instagram-editor.jpg' width={1600} height={978}
        alt='The Multiborder web editor showing a portrait photo on a white 3:4 border, with the 3:4 button selected'
        caption='The web editor with 3:4 selected. Both photos get the same border, and the arrow switches between them.' />
      <p>
        Your photos never leave your device. The editor does all its work in the browser and uploads nothing.
      </p>

      <h2>Small touches that look good</h2>
      <ul>
        <li>
          <strong>Off-white or black borders.</strong> Pure white can glare in dark mode. A warm off-white, or black
          for moody photos, often looks better.
        </li>
        <li>
          <strong>Blurred border.</strong> Instead of a flat color, fill the border with a blurred copy of the photo.
          It picks up the photo’s colors automatically.
        </li>
        <li>
          <strong>Rounded corners and a soft shadow.</strong> These lift the photo off the border, a bit like a print
          on a table.
        </li>
      </ul>
      <p>
        Next time Instagram shows the crop handles, add a border first and post the whole photo.
      </p>
    </>
  ),
};

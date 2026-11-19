import Link from 'next/link';
import type { Post } from '.';

export const post: Post = {
  slug: 'blurred-background-photo-border',
  title: 'How to add a blurred background border to a photo',
  description:
    'A blurred border fills the space around your photo with a soft copy of the photo itself. Here’s when it looks better than a plain color, and how to add one.',
  date: '2026-11-19',
  body: (
    <>
      <p>
        When a photo doesn’t fit the frame, something has to fill the gap. The usual answer is a plain color: white or
        black bars. A blurred border fills the gap with an enlarged, blurred copy of the same photo.
      </p>
      <p>
        You’ve seen this on TV, where a phone video shot upright is shown with a soft, blurred version of itself on
        either side. It works the same way for a photo.
      </p>

      <h2>Why use one</h2>
      <ul>
        <li>
          <strong>The colors always match.</strong> The border is made from the photo, so it can’t clash with it. You
          don’t have to choose a color.
        </li>
        <li>
          <strong>It suits both light and dark mode.</strong> White bars glare on a dark screen and black bars look
          heavy on a light one. A blurred border sits somewhere in between.
        </li>
        <li>
          <strong>Wide photos fill a tall post.</strong> A landscape on a 3:4 or 4:5 canvas leaves large gaps above
          and below. Blur makes those gaps look like part of the picture.
        </li>
      </ul>

      <h2>When a plain border is better</h2>
      <p>
        A blurred border adds color and texture around the photo. For a quiet, minimal picture, or a set you want to
        look like prints on a wall, plain white is calmer. A busy photo also makes a busy blur, and{' '}
        <Link href='/editor/white-border'>a white border</Link> may suit it better.
      </p>

      <h2>How to add one</h2>
      <p>
        The <Link href='/editor/blur-background'>blurred border editor</Link> opens with the blur already on and a 4:5
        canvas:
      </p>
      <ol>
        <li>Choose your photos. The same border goes on every one.</li>
        <li>Pick the canvas shape. Use 3:4 or 4:5 for an Instagram post, or 9:16 for a story.</li>
        <li>
          Move Blur strength. A low setting leaves shapes you can recognize. A high setting turns the border into a
          smooth wash of color.
        </li>
        <li>Move Border width to set how much blur shows on the sides the photo already reaches.</li>
        <li>Download one photo, or all of them as a .zip.</li>
      </ol>
      <p>Your photos stay on your device. The editor does its work in the browser and uploads nothing.</p>

      <h2>Making it look good</h2>
      <ul>
        <li>
          <strong>Use more blur than you think.</strong> A lightly blurred border looks like an out-of-focus mistake.
          A strong blur looks deliberate.
        </li>
        <li>
          <strong>Add a shadow.</strong> Turn on Shadow to separate the sharp photo from its blurred copy.
        </li>
        <li>
          <strong>Try rounded corners.</strong> With Rounded corners on, the photo looks like a card resting on the
          blur.
        </li>
      </ul>
      <p>
        The same options are in the iPhone app, if you’d rather do this from your camera roll. For other looks, see{' '}
        <Link href='/blog/film-style-photo-borders'>film-style borders</Link>.
      </p>
    </>
  ),
};

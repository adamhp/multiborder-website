import Link from 'next/link';
import type { Post } from '.';

const shapes = [
  { name: '3:4', className: 'aspect-[3/4]' },
  { name: '4:5', className: 'aspect-[4/5]' },
  { name: '1:1', className: 'aspect-square' },
];

export const post: Post = {
  slug: 'instagram-photo-sizes-4-5-3-4-1-1',
  title: 'Instagram photo sizes: 3:4, 4:5 or 1:1?',
  description:
    'The three shapes for an Instagram photo post, their sizes in pixels, how each one looks in the feed and on your profile grid, and which to pick.',
  date: '2026-11-19',
  body: (
    <>
      <p>
        Instagram gives a photo post three useful shapes: 3:4, 4:5 and 1:1. They take up different amounts of the
        screen, and they’re treated differently on your profile. These are the sizes at the time of writing.
      </p>

      <h2>The sizes</h2>
      <figure>
        <div className='not-prose flex items-end justify-center gap-4 rounded-lg bg-stone-900 p-6' role='img'
          aria-label='Three outlines at the same width: 3:4 is the tallest, 4:5 is slightly shorter, and 1:1 is square'>
          {shapes.map((shape) => (
            <div key={shape.name} className={`${shape.className} flex w-1/4 flex-col items-center justify-center border border-stone-400 text-center`}>
              <span className='text-stone-100'>{shape.name}</span>
            </div>
          ))}
        </div>
        <figcaption>The three shapes at the same width. 3:4 is only a little taller than 4:5.</figcaption>
      </figure>
      <table>
        <thead>
          <tr>
            <th>Shape</th>
            <th>Size in pixels</th>
            <th>On the profile grid</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>3:4</td>
            <td>1080 × 1440</td>
            <td>Shown whole</td>
          </tr>
          <tr>
            <td>4:5</td>
            <td>1080 × 1350</td>
            <td>A sliver trimmed from each side</td>
          </tr>
          <tr>
            <td>1:1</td>
            <td>1080 × 1080</td>
            <td>Changed to fit a tall tile</td>
          </tr>
        </tbody>
      </table>
      <p>
        Instagram shows photos 1080 pixels wide. Uploading something larger doesn’t make the post sharper, because
        Instagram shrinks it.
      </p>

      <h2>3:4</h2>
      <p>
        This is the tallest shape Instagram accepts, so it fills the most screen in the feed. It’s also the shape of
        the tiles on the profile grid, which means the post looks the same on your profile as it does in the feed. An
        upright iPhone photo in the default mode is already 3:4.
      </p>

      <h2>4:5</h2>
      <p>
        For years this was the tallest shape allowed, and a lot of feeds are built on it. It’s a little shorter than
        3:4. On the grid it loses a thin strip from the left and right, so keep anything important away from the
        edges.
      </p>

      <h2>1:1</h2>
      <p>
        The original square. It takes up the least room in the feed, and because the grid’s tiles are taller than a
        square, it doesn’t appear on your profile exactly as you posted it. It still suits photos that were composed as
        squares.
      </p>

      <h2>Which to pick</h2>
      <ul>
        <li>
          <strong>Starting fresh, or not sure:</strong> 3:4. It’s the biggest in the feed and it matches the grid.
        </li>
        <li>
          <strong>Your feed is already 4:5:</strong> stay with 4:5 so new posts sit well next to the old ones.
        </li>
        <li>
          <strong>A carousel:</strong> pick one shape for the whole set. Instagram fits every slide to the first.
        </li>
      </ul>

      <h2>When your photo is a different shape</h2>
      <p>
        Most photos are none of these shapes. A camera’s 2:3 portrait is too tall, and a landscape is far too wide.
        You can crop to fit, or you can keep the whole photo and put it on a canvas in the shape you want, with a
        border filling the gaps.
      </p>
      <p>
        The <Link href='/editor/instagram'>Instagram border editor</Link> does the second one. It opens on a 3:4
        canvas, and 4:5 and 1:1 are one tap away. There’s more on how that works in{' '}
        <Link href='/blog/post-full-photo-instagram-without-cropping'>how to post a full photo without cropping</Link>.
      </p>
    </>
  ),
};

import Link from 'next/link';
import type { Post } from '.';
import { Figure } from './Figure';

export const post: Post = {
  slug: 'film-style-photo-borders',
  title: 'Film-style borders for digital photos',
  description:
    'Darkroom prints, instant film and contact sheets each have a border of their own. Here’s what makes each one look the way it does, and how to give a digital photo the same frame.',
  date: '2026-11-19',
  body: (
    <>
      <p>
        Film photos tend to come with a border. It wasn’t added for style. It’s left over from how the picture was
        made. That’s part of why a border makes a digital photo feel more like a print: it suggests an object, and not
        only a file.
      </p>
      <p>Here are three of those borders, where each comes from, and how to make them.</p>

      <h2>The darkroom print</h2>
      <p>
        In a darkroom, the paper is held flat by an easel while it’s exposed. The easel’s blades cover the edges of
        the paper, so the edges stay white. The result is an even white border around the picture.
      </p>
      <p>
        <strong>To make it:</strong> open the <Link href='/editor/white-border'>white border editor</Link>, which
        keeps each photo’s own shape, and set Border width to a moderate amount. Photo paper is rarely pure white, so
        try a slightly warm off-white for the border color.
      </p>

      <h2>The instant print</h2>
      <p>
        An instant print has a narrow border on three sides and a much deeper one at the bottom. The deep edge is
        where the pod of developing chemicals sits before it’s spread across the picture. People have written on it
        ever since.
      </p>
      <p>
        <strong>To make it:</strong> turn on Separate border for each side, then make the bottom about three times as
        wide as the other three. A square canvas is closest to the classic look.
      </p>
      <Figure src='film-border.jpg' width={1440} height={1080}
        alt='A coastal village photo on a white border that is wider at the bottom, with rounded corners and a soft shadow'
        caption='A border that’s wider at the bottom, with rounded corners and a shadow under the photo.' />

      <h2>The black edge</h2>
      <p>
        Some printers file out the negative carrier so that the print shows the clear edge of the film as a thin black
        line around the picture. It became a way of showing that the photo was printed whole, with nothing cropped.
      </p>
      <p>
        <strong>To make it:</strong> set the border color to black and keep Border width low. A thin black edge is
        enough. A thick one starts to look like a frame.
      </p>

      <h2>Notes in the margin</h2>
      <p>
        Photographers have always written on their borders and contact sheets: the date, the place, the exposure.
        Some film cameras even had a data back that printed the date onto the frame.
      </p>
      <p>
        You can do the same. The <Link href='/editor/camera-settings'>camera settings editor</Link> reads the camera,
        focal length, aperture, shutter speed and ISO from each photo and prints them on the border. A monospaced
        typeface suits it best. There’s more in{' '}
        <Link href='/blog/add-camera-settings-to-photos'>how to show camera settings on your photos</Link>.
      </p>

      <h2>Keep the shape of the film</h2>
      <p>
        The frame’s shape does as much as the border. 35mm film is 3:2, and medium format is often square. If your
        photo is already one of those shapes, keep the canvas on Original so the border follows it. Cropping a 3:2
        photo to fit a phone screen takes away the thing that made it look like film.
      </p>
      <p>
        Whichever border you choose, use it for the whole set. A row of photos with the same frame looks like a
        series, and that’s something film gave you without asking.
      </p>
    </>
  ),
};

import Link from 'next/link';
import type { Post } from '.';
import { Figure } from './Figure';

export const post: Post = {
  slug: 'add-camera-settings-to-photos',
  title: 'How to show camera settings (EXIF) on your photos',
  description:
    'Instagram strips the camera details from your photos. Here’s how to print the camera, lens, aperture, shutter speed and ISO onto the border instead.',
  date: '2026-11-17',
  body: (
    <>
      <p>
        The most common comment on a good photo is a question: “What settings did you use?” The answer is already in
        the file. Your camera records the camera model, focal length, aperture, shutter speed and ISO in every photo it
        takes. This data is called EXIF.
      </p>
      <p>
        The trouble is that hardly anyone sees it. Instagram and most other social apps remove this data when you
        upload. If you want people to see your settings, you have to print them on the image.
      </p>

      <h2>What the details mean</h2>
      <ul>
        <li>
          <strong>Camera</strong>: the make and model, such as an iPhone or a Fujifilm X100.
        </li>
        <li>
          <strong>Focal length</strong>: how zoomed in the lens was, in millimeters. Lower numbers are wider.
        </li>
        <li>
          <strong>Aperture</strong>: how wide the lens opened, written as f/1.8 or f/8. A small number means more
          background blur.
        </li>
        <li>
          <strong>Shutter speed</strong>: how long the shutter stayed open, such as 1/250 s. Fast speeds freeze
          motion.
        </li>
        <li>
          <strong>ISO</strong>: how much the sensor was amplified. High numbers help in the dark but add grain.
        </li>
      </ul>
      <p>
        Together these tell another photographer how the shot was made, which is why people ask for them.
      </p>

      <h2>Why a caption on the border works</h2>
      <p>
        You could type the settings into your post’s caption, but few people read that far, and typing it for every
        photo gets old fast. A line of small text on the border sits right under the photo. It reads like the
        information card in a gallery, and it stays with the image wherever it gets shared.
      </p>

      <h2>Adding the caption</h2>
      <p>
        In Multiborder, the camera settings caption reads the details straight from each photo, so you never type
        them. In the <Link href='/editor/camera-settings'>web editor</Link> or the iPhone app:
      </p>
      <ol>
        <li>Add your photos and give them a border. The caption sits in the border, so leave some room.</li>
        <li>Turn on the camera settings caption.</li>
        <li>
          Choose which details to show. Besides the camera settings, you can add the date taken, a title, the
          filename and your handle.
        </li>
        <li>
          Drag the details into place. There’s a row above the photo and a row below, and each row can spread out
          or line up left, center or right.
        </li>
        <li>Pick a font, and decide whether each detail gets a small icon.</li>
      </ol>
      <Figure src='caption-editor.jpg' width={1600} height={978}
        alt='A photo of a sea stack on a white border, with the date above it and the camera, 43mm, f/11, 1/160s and ISO 100 below it'
        caption='The camera settings caption, read from the photo: the date above, and the camera, focal length, aperture, shutter speed and ISO below.' />
      <p>
        By default the date, title and handle go above the photo, and the camera settings go below. That layout works
        for most photos, so it’s a good place to start.
      </p>

      <h2>Tips for a clean caption</h2>
      <ul>
        <li>
          <strong>Use a monospace font</strong> such as Space Mono or JetBrains Mono. The numbers line up neatly and
          it looks like the readout on a camera.
        </li>
        <li>
          <strong>Show less.</strong> Aperture, shutter and ISO are what people ask about. You can hide the camera
          make and keep just the model.
        </li>
        <li>
          <strong>Add your handle.</strong> If someone reposts your photo, your name goes with it. Choose an Instagram,
          Flickr, @ or website icon to go with it.
        </li>
      </ul>

      <h2>When the details are missing</h2>
      <p>
        Screenshots, photos saved from messaging apps and some edited exports have no EXIF data. The caption can only
        show what’s in the file, so start from the original photo from your camera or your camera roll.
      </p>
      <p>
        Next time someone asks what settings you used, they won’t need to. The answer will be printed right under the
        photo.
      </p>
    </>
  ),
};

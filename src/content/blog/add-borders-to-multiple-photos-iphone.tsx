import Link from 'next/link';
import { appUrl } from '@/constants';
import type { Post } from '.';
import { Figure } from './Figure';

export const post: Post = {
  slug: 'add-borders-to-multiple-photos-iphone',
  title: 'How to add borders to multiple photos at once on iPhone',
  description:
    'Border a whole set of photos in one go on iPhone, from the app, the share sheet, the Photos app or a Shortcut, with the same frame on every photo.',
  date: '2026-11-17',
  body: (
    <>
      <p>
        After a trip I usually have twenty photos I want to post. Most border apps make you open each one, set the
        border, save it, and start again. That’s twenty rounds of the same taps, and twenty chances to get the width a
        little different.
      </p>
      <p>
        Batch bordering takes one pass. You set the border once and every photo gets the same frame. Here are the ways
        to do it on an iPhone, from the quickest to the most automatic.
      </p>

      <h2>Why a batch matters</h2>
      <p>
        A set of photos looks like a set when the frames match. In an Instagram carousel or a profile grid, a border
        that is 5% wide on one photo and 6% on the next stands out. Applying one setting to every photo removes the
        problem. It also saves time: the work is the same for two photos or two hundred.
      </p>

      <h2>Option 1: The Multiborder app</h2>
      <p>
        I built <a href={appUrl}>Multiborder</a> for exactly this. It’s free on the App Store for iPhone and iPad.
      </p>
      <ol>
        <li>Open the app and select your photos. Select as many as your phone can handle.</li>
        <li>Pick the shape, such as 4:5 or 3:4 for Instagram.</li>
        <li>Set the border width and color. The preview shows every photo with the same frame.</li>
        <li>Save. Pick the album and format you want.</li>
      </ol>
      <p>A few details make the batch painless:</p>
      <ul>
        <li>Each photo keeps its original date, so your library stays in order.</li>
        <li>HDR photos keep their bright highlights in the export.</li>
        <li>Saving keeps going in the background, so you can switch apps while a big batch finishes.</li>
      </ul>

      <h2>Option 2: The share sheet</h2>
      <p>
        You don’t need to open the app first. In the Photos app, select the photos, tap Share, and choose Multiborder.
        It borders them with your last settings. This is the quickest route once you have settings you like.
      </p>

      <h2>Option 3: Edit in the Photos app</h2>
      <p>
        For a single photo, you can add a border without leaving Photos. Tap Edit, then open Multiborder from the
        extensions menu. The border stays editable, so you can change it later.
      </p>

      <h2>Option 4: A Shortcut</h2>
      <p>
        Multiborder adds an <strong>Add Border to Photos</strong> action to the Shortcuts app. Put it after an action
        that gets photos, such as your latest photos or an album, and then save the results. Run the shortcut and the
        whole set is bordered without opening anything. Shortcuts can run from the home screen, the share sheet or an
        automation, so you can make it as hands-off as you like.
      </p>

      <h2>Option 5: In the browser</h2>
      <p>
        If you’d rather not install anything, the <Link href='/editor'>Multiborder web editor</Link> also does batches.
        It runs in Safari on iPhone and in any browser on a computer. Add your photos, set the border once, and
        download the results one at a time, or all together as a .zip file.
      </p>
      <Figure src='batch-editor.jpg' width={1600} height={978}
        alt='The Multiborder web editor with six photos in a row of thumbnails, each on a white 4:5 border'
        caption='Six photos in the web editor, all on the same 4:5 border. Download all saves them in one .zip file.' />
      <p>
        The editor works entirely on your device and uploads nothing. HEIC photos, the iPhone’s default format, open in
        Safari. In other browsers, use JPEG or PNG.
      </p>

      <h2>Which one to use</h2>
      <p>
        For a one-off set, open the app or the web editor. If you border photos every week, set your look once in the
        app and use the share sheet from then on. Once your settings are right, a batch of photos takes a few taps.
      </p>
    </>
  ),
};

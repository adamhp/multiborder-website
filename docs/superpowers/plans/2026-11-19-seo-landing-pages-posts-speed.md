# Editor Landing Pages, Blog Posts and Page Speed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the site four search-targeted editor landing pages, four more blog posts, and lighter home page media.

**Architecture:** A list of presets in `src/content/editorPresets.ts` drives one statically generated route, `/editor/[preset]`, which renders the existing `Editor` with a starting-settings override. Blog posts follow the existing `src/content/blog` pattern. Speed work is asset changes plus two small component edits.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind, vitest, ffmpeg (local, for assets).

**Spec:** `docs/superpowers/specs/2026-11-19-seo-landing-pages-posts-speed-design.md`

## Global Constraints

- No new dependencies.
- The editor's behavior on `/editor` does not change.
- Opening a landing page must not write to `localStorage`; only a control change saves.
- Each landing page opens the editor already set up for what its title promises.
- No visual change to the hero or phone frame.
- Copy style matches the existing posts: plain, second person, no hype.
- Every task ends with `npm test && npm run lint && npm run build` passing.

## Review Focus

1. A visitor with saved settings opens a landing page, changes nothing, then opens `/editor`: their saved settings are intact. (Task 1 test.)
2. A visitor with saved settings opens a landing page: the preset's keys win, their other saved keys (e.g. caption font, handle) are kept. (Task 1 test.)
3. `/editor/unknown-slug` returns 404, not the plain editor. (Task 2, `dynamicParams = false`, checked in build output and by request.)
4. Each landing page's canonical is its own URL, not `/editor`. (Task 2 verification.)
5. Reduced-motion or blocked autoplay: the hero shows the poster rather than an empty phone. (Task 4 verification.)

---

### Task 1: Presets and starting settings

**Files:**
- Create: `src/content/editorPresets.ts`
- Modify: `src/editor/settings.ts` (add `startingSettings`)
- Modify: `src/components/editor/Editor.tsx` (props, mount effect, heading)
- Test: `src/editor/layout.test.ts` (where `loadSettings` is already tested)

**Interfaces:**
- Produces:
  - `startingSettings(preset?: Partial<BorderSettings>, storage?: Storage): BorderSettings` in `src/editor/settings.ts`: `{ ...loadSettings(storage), ...preset }`, never writes.
  - `type EditorPreset = { slug: string; title: string; description: string; heading: string; intro: string; settings: Partial<BorderSettings> }`
  - `editorPresets: EditorPreset[]` and `findPreset(slug: string): EditorPreset | undefined`
  - `Editor({ preset, heading, intro }: { preset?: Partial<BorderSettings>; heading?: string; intro?: string })`. Defaults keep today's "Web Editor" heading and intro.

Preset values:

| slug | settings |
|---|---|
| `white-border` | `aspectRatio: 'original', fill: 'color', borderColor: '#ffffff', paddingFraction: 0.05, isPerSide: false` |
| `instagram` | `aspectRatio: '4:5', isLandscape: false, fill: 'color', borderColor: '#ffffff', paddingFraction: 0.04, isPerSide: false, exportWidth: 1080` |
| `camera-settings` | `showsCaption: true, paddingFraction: 0.08, isPerSide: false, fill: 'color', borderColor: '#ffffff'` |
| `blur-background` | `aspectRatio: '4:5', isLandscape: false, fill: 'blur', paddingFraction: 0.04, isPerSide: false` |

- [ ] **Step 1: Write failing tests** in `src/editor/layout.test.ts`:
  - `startingSettingsAppliesPresetOverStored`: storage holds `{ paddingFraction: 0.1, captionFont: 'inter' }`; `startingSettings({ paddingFraction: 0.05, fill: 'blur' }, storage)` has `paddingFraction 0.05`, `fill 'blur'`, `captionFont 'inter'`.
  - `startingSettingsDoesNotWrite`: storage with a `setItem` spy; after the call the spy was not called.
  - `startingSettingsWithoutPresetIsLoadSettings`.
  - `presetsAreValid`: every preset's slug is unique and kebab-case, and each `settings` key exists in `DEFAULT_SETTINGS` with the same `typeof`.
- [ ] **Step 2:** `npm test` fails on the missing exports.
- [ ] **Step 3:** Implement `startingSettings`, the presets file, and the `Editor` props. In `Editor`, the mount effect calls `startingSettings(preset)`; `change` is unchanged (it saves the merged settings on the first control change).
- [ ] **Step 4:** `npm test && npm run lint` pass.
- [ ] **Step 5:** Commit.

### Task 2: Landing page route

**Files:**
- Create: `src/app/(main)/editor/[preset]/page.tsx`
- Modify: `src/app/(main)/editor/page.tsx` (links to the four pages below the editor)
- Modify: `src/app/sitemap.ts` (four URLs, priority 0.7)

**Interfaces:**
- Consumes: `editorPresets`, `findPreset`, `Editor` props from Task 1.

Page metadata (title is combined with the root template `%s · Multiborder`):

| slug | title | heading |
|---|---|---|
| `white-border` | Add a White Border to Photos Online | Add a white border to your photos |
| `instagram` | Instagram Photo Border: Post Without Cropping | Fit your whole photo on Instagram |
| `camera-settings` | Add Camera Settings (EXIF) to Photos | Show your camera settings on the photo |
| `blur-background` | Blurred Background Border for Photos | Fill the border with a blurred copy |

Each description is one or two sentences ending with "Free, and nothing is uploaded." Each intro is two or three sentences saying what the editor is already set to and what to adjust.

- [ ] **Step 1:** Create the route following `blog/[slug]/page.tsx`: `dynamicParams = false`, `generateStaticParams`, `generateMetadata` returning title and description, and a page that imports `../editor.css` and renders `<Editor preset heading intro />` in `Container`. Add `WebApplication` JSON-LD with the page's own URL.
- [ ] **Step 2:** Add a "Start from a preset" link list under the editor on `/editor`, and the sitemap entries.
- [ ] **Step 3:** `npm run build`; output lists the four `/editor/...` routes as static. Start the built site and check, for each: the `<title>`, `<link rel="canonical">` equals `https://multiborder.io/editor/<slug>`, one `h1`, and `/editor/nope` is 404. In a browser, open `/editor/blur-background` with a photo and confirm the blur fill is on, then confirm `localStorage['multiborder.settings']` is unchanged until a control moves.
- [ ] **Step 4:** Commit.

### Task 3: Four blog posts

**Files:**
- Create: `src/content/blog/post-full-photo-instagram-without-cropping.tsx`
- Create: `src/content/blog/instagram-photo-sizes-4-5-3-4-1-1.tsx`
- Create: `src/content/blog/blurred-background-photo-border.tsx`
- Create: `src/content/blog/film-style-photo-borders.tsx`
- Create: screenshots in `public/blog/` (one or two per post, JPEG, under 200 KB each)
- Modify: `src/content/blog/index.ts` (add to `posts`, newest first)
- Modify: the three existing posts to link to their matching landing page

**Interfaces:**
- Consumes: `Post` type, `Figure`, landing page URLs from Task 2.

- [ ] **Step 1:** Write each post as a `Post` dated `2026-11-19`, 400-700 words, with `h2` sections, numbered steps using the web editor, a `Figure` or two, and a link to the matching landing page (`instagram`, `instagram`, `blur-background`, `white-border`) plus one link to another post. Facts about Instagram sizes must be checked against a current source before writing, not recalled.
- [ ] **Step 2:** Capture screenshots from the running editor with a sample photo, at the same framing as the existing ones.
- [ ] **Step 3:** `npm run build` lists eight blog routes; each new post renders with its figure and its links resolve.
- [ ] **Step 4:** Commit.

### Task 4: Page speed

**Files:**
- Delete: `src/images/demo.gif`
- Modify: `src/components/AppDemo.tsx` (remove the commented-out image, add `poster`)
- Replace: `public/demo.mp4`; create `public/demo-poster.jpg`
- Replace: `src/images/iphoneframe.svg` with `src/images/iphoneframe.png`
- Modify: `src/components/PhoneFrame.tsx`

- [ ] **Step 1:** Delete `demo.gif`; confirm nothing imports it.
- [ ] **Step 2:** Re-encode the hero video to 660 px wide (it displays at 330 CSS px), H.264, `-crf 28 -preset slow -movflags +faststart -an`. Extract the first frame as `demo-poster.jpg` at the same size. Target under 400 KB for the video; compare a frame against the original by eye.
- [ ] **Step 3:** The SVG is a wrapper around one embedded 1419×2796 PNG. Extract that PNG to `src/images/iphoneframe.png`, import it in `PhoneFrame`, drop `unoptimized`, and set `sizes='(min-width: 393px) 393px, 100vw'` so Next serves a resized WebP/AVIF with alpha.
- [ ] **Step 4:** `npm run build`, then view the home page at desktop and phone widths: the frame aligns with the video exactly as before, and with autoplay blocked the poster shows. Record before/after transfer sizes.
- [ ] **Step 5:** Commit.

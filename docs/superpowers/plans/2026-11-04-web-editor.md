# Web Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A client-side-only `/editor` page on multiborder.io that adds multiborder-style borders to photos in the browser and downloads them as JPEGs, pointing people at the iPhone app for everything it leaves out.

**Architecture:** Pure TypeScript ports of the app's geometry (`ImageComposer.layout`, `PhotoCaption.placement`) live in `src/editor/` and are unit-tested with Vitest against the app's own test cases. A canvas renderer draws the same composite the app draws: fill or blurred backdrop, shadow, rounded photo, caption. The preview and the export call the same renderer. The preview just passes a small `exportWidth`, since the layout scales linearly. Photos never leave the browser. There is no API route or upload.

**Tech Stack:** Next.js 16 App Router (existing site), React 19, Tailwind 4, Canvas 2D, `exifr` (EXIF), `fflate` (zip for "Download all"), Vitest (new dev dependency, pure modules only).

**Spec:** The conversation of 2026-11-04 plus the app sources it ports: `~/dev/multiborder-2.0/Shared/ImageComposer.swift`, `Shared/PhotoCaption.swift`, `multiborderTests/swift_multiborderTests.swift` (`LayoutTests`).

## Global Constraints

- Repo: `~/dev/multiborder-website`. Branch `web-editor` from `main`. Don't push or open a PR without asking. `gh` fails in the sandbox, so Adam opens PRs.
- Client-only: photos must never be uploaded. No server actions, no API routes, no analytics on photo content.
- American English in all copy and code (color, center, gray).
- Exports: JPEG only, quality `0.92`, sRGB. No metadata is written, so location is never exported.
- Canvas pixel budget `MAX_CANVAS_PIXELS = 16_000_000` (iOS Safari caps canvases at 16,777,216 px).
- Constants copied verbatim from the app:
  - padding range `0...0.16` (layout clamps insets to `0...0.45`)
  - blur range `0.005...0.1`, default `0.04`
  - corner range `0.00125...0.08`, default `0.02`
  - shadow range `0.002...0.04`, default `0.01`
  - backdrop long side `512`
  - caption: `sizeShare 0.022`, `gapInFontSizes 2.6`, `photoSpacing 0.8`, `minimumSpacing 1.0`, `groupedSpacing 1.5`, row height `fontSize * 1.2`
  - caption text color: on the blur fill `rgba(255,255,255,0.9)` with shadow blur `fontSize * 0.4`, `rgba(0,0,0,0.5)`; on a color fill, linear luminance `> 0.25` → `rgba(0,0,0,0.7)`, else `rgba(255,255,255,0.8)`
  - shadow: `rgba(0,0,0,0.5)`, offset `blur / 4` downward
- Defaults: aspect ratio `4:5`, padding `0`, border `#ffffff`, fill color, caption off, font Space Mono.
- v1 scope (deliberately hamstrung, each gap gets an "in the app" pointer):
  - **In:** multiple photos; aspect ratio and landscape; uniform padding; border color or blur fill; rounded corners; shadow; caption with Date, Camera, Focal Length, Aperture, Shutter Speed, ISO and Handle (`@name`); caption on/off per field; spread, left, center or right alignment per row; export width (Full or 1080); Download and Download all.
  - **Out:** HDR/gain maps; HEIC outside Safari; PNG/HEIC export; keeping metadata; per-side borders; caption icons; extra fonts; Title/Filename fields; drag-to-reorder caption fields; the extensions, Shortcuts and Photos albums.
- Verification under the sandbox: `next dev` 404s (EMFILE) and port 3000 is taken. Verify with `npm run build` (using `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` if Google Fonts can't be fetched) then `npx next start -p 3100`. `npm run lint` is already broken on main, so don't gate on it.

## Review Focus

1. **HEIC on Chrome or Firefox** (the default iPhone format): `createImageBitmap` rejects it. Expect a clear per-photo message ("This browser can't open HEIC photos. Export as JPEG/Most Compatible, or use the app") instead of a silent failure. Test: `decodeError` copy, Task 4.
2. **A 48 MP photo with a wide border:** the export must stay under `MAX_CANVAS_PIXELS` and not crash the tab on iPhone Safari. Test: `capsCanvasAtTheBudget`, Task 1.
3. **EXIF orientation:** a rotated phone JPEG must come out upright and use its upright size. Test: `uprightSizeSwapsForRotatedOrientations`, Task 2, plus the manual check in Task 5.
4. **Blur fill where `ctx.filter` isn't supported** (older Safari): hide the Blur option rather than export an unblurred photo. Test: `supportsCanvasFilter` gating, Task 4.
5. **Photos with no EXIF** (screenshots, stripped images): the caption shows only the handle or nothing, and never prints "undefined" or a stray separator. Test: `missingTagsAreOmitted`, Task 2.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/editor/settings.ts` | `BorderSettings` type, defaults, ranges, derived values (`canvasWidthOverHeight`, `cornerRadius`, `shadowBlur`, `blurRadius`), load/save to `localStorage` |
| `src/editor/layout.ts` | `layout()`, a port of `ImageComposer.layout` |
| `src/editor/caption.ts` | EXIF → `PhotoDetails`, value formatting, `captionRows`, `captionPlacement`, `captionTextColor` |
| `src/editor/compose.ts` | Canvas drawing (`drawComposite`), `exportJpeg`, decode helpers |
| `src/editor/*.test.ts` | Vitest unit tests for the three pure modules |
| `src/components/editor/Editor.tsx` | Client component: photo list, preview, downloads |
| `src/components/editor/Controls.tsx` | Settings panel |
| `src/app/(main)/editor/page.tsx` | Route and metadata, renders `<Editor/>` |
| `src/constants.ts`, `src/app/sitemap.ts` | Nav link "Web Editor" → `/editor`, sitemap entry |

---

### Task 1: Settings and layout port

**Files:**
- Create: `vitest.config.ts`, `src/editor/settings.ts`, `src/editor/layout.ts`, `src/editor/layout.test.ts`
- Modify: `package.json` (devDependency `vitest`, script `"test": "vitest run"`)

**Interfaces:**
- Produces:
  - `type AspectRatio = 'original' | '2:3' | '3:4' | '4:5' | '1:1' | '9:16'`
  - `type Insets = { top: number; left: number; bottom: number; right: number }`
  - `type BorderSettings = { aspectRatio; isLandscape: boolean; paddingFraction: number; borderColor: string /* #rrggbb */; fill: 'color' | 'blur'; blurFraction; roundsCorners; cornerFraction; hasShadow; shadowFraction; exportWidth: number /* 0 = full */; showsCaption; captionFields: CaptionField[]; captionAbove: CaptionField[]; captionBelow: CaptionField[]; captionAlignmentAbove: CaptionAlignment; captionAlignmentBelow: CaptionAlignment; handle: string; cameraShowsMake: boolean; cameraShowsModel: boolean }`
  - `const DEFAULT_SETTINGS: BorderSettings`
  - `canvasWidthOverHeight(s): number | null`, `cornerRadius(s, canvas: Size, photo: Size): number`, `shadowBlur(s, canvas: Size): number`, `blurRadius(s, canvas: Size): number`
  - `loadSettings(): BorderSettings` (merges stored keys over defaults, drops unknown enum values, never throws), `saveSettings(s): void` (key `multiborder.settings`)
  - `type Size = { width: number; height: number }`, `type Rect = Size & { x: number; y: number }`
  - `type Layout = { canvasSize: Size; imageRect: Rect }` (top-left origin)
  - `const MAX_CANVAS_PIXELS = 16_000_000`
  - `layout(source: Size, s: BorderSettings, maxPixels = MAX_CANVAS_PIXELS): Layout`

- [ ] **Step 1: Branch and tooling.** `git switch -c web-editor main`, then `npm i -D vitest`. Add `vitest.config.ts` with the `@` alias pointed at `./src` and the `node` environment. Add the `test` script.
- [ ] **Step 2: Write the failing tests** in `src/editor/layout.test.ts`. Port these `LayoutTests` from `swift_multiborderTests.swift:64-225` with the same numbers:
  - `noPaddingOriginalRatioIsTheSourceSize` (3000×2000 → canvas 3000×2000, rect at 0,0)
  - `photoIsNeverUpscaled` (1000×500, square, exportWidth 8192 → canvas 1000×1000, photo 1000×500)
  - `exportWidthShrinksCanvasAndKeepsProportions` (4000×3000, 4:5, 0.1, 1080 → 1080×1350, minX≈108, width≈864, midY≈675, each ±0.5)
  - `canvasMatchesAspectRatio` (every ratio × landscape, source 3024×4032, padding 0.05)
  - `paddingIsAFractionOfTheShorterSide` (every ratio, 1000×1000, 0.1)
  - `capsCanvasAtTheBudget` (8064×6048, 2:3, padding 0.16 → `w*h <= MAX_CANVAS_PIXELS + w`, ratio within 0.001, photo shrunk)
  - `emptySourceHasEmptyLayout`
  - `cornerRadiusScalesWithTheShorterSideAndFitsThePhoto` and `blurRadiusScalesWithTheShorterSideAndIsClamped` (port from `:380-400`)
  - `loadSettingsFallsBackToDefaults` (missing keys, garbage JSON, and an unknown `aspectRatio` all give the defaults for those fields)
- [ ] **Step 3: Run** `npm test`. Expected: FAIL, modules not found.
- [ ] **Step 4: Implement** `settings.ts` and `layout.ts`. `layout` is a line-for-line port of `ImageComposer.swift:376-433`, including the whole-pixel native branch with its `roundUp` (subtract `1e-6`, then ceil, min 1) and the grow-until-it-fits loop. Insets come from `paddingFraction` (uniform). Keep `Insets` in the signature path so per-side can be added later without touching the math. Use `Math.round` where Swift uses `.rounded()` (positive values only, so it's equivalent).
- [ ] **Step 5: Run** `npm test`. Expected: all PASS.
- [ ] **Step 6: Commit** `Add the border layout ported from the app, with its tests`.

### Task 2: Photo details and caption rows

**Files:**
- Create: `src/editor/caption.ts`, `src/editor/caption.test.ts`
- Modify: `package.json` (dependency `exifr`)

**Interfaces:**
- Consumes: `BorderSettings` (Task 1)
- Produces:
  - `type CaptionField = 'date' | 'camera' | 'focalLength' | 'aperture' | 'shutter' | 'iso' | 'handle'`, `type CaptionAlignment = 'spread' | 'leading' | 'center' | 'trailing'`. Default rows: above = date, handle; below = camera, focalLength, aperture, shutter, iso. All fields on by default.
  - `type ExifTags = { DateTimeOriginal?: string; DateTime?: string; Make?: string; Model?: string; FocalLength?: number; FocalLengthIn35mmFormat?: number; FNumber?: number; ExposureTime?: number; ISO?: number | number[]; Orientation?: number }`
  - `type PhotoDetails = { date?: string; make?: string; model?: string; focalLength?: string; aperture?: string; shutter?: string; iso?: string }`
  - `detailsFromTags(tags: ExifTags): PhotoDetails` (pure)
  - `readTags(file: File): Promise<ExifTags>` uses `exifr.parse(file, { pick: [...], reviveValues: false })` and resolves `{}` on any error
  - `uprightSize(pixelSize: Size, orientation?: number): Size` swaps width and height for orientations 5–8
  - `type CaptionItem = { field: CaptionField; text: string }`, `type CaptionRows = { above: CaptionItem[]; below: CaptionItem[]; aboveAlignment; belowAlignment }`
  - `captionRows(details: PhotoDetails, s: BorderSettings): CaptionRows` returns empty rows while `showsCaption` is off

- [ ] **Step 1: Write the failing tests** with values from `PhotoCaption.swift:310-353`:
  - `formatsExposureValues`: FNumber 1.8 → `ƒ/1.8`, 2.0 → `ƒ/2`; ExposureTime 0.008 → `1/125s`, 2.5 → `2.5s`; FocalLengthIn35mmFormat 26 preferred over FocalLength 5.7 → `26mm`; ISO `[64]` or `64` → `ISO 64`
  - `formatsTheDateInGMT`: `"2026:11:02 23:30:00"` → `Nov 2, 2026` (`Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })` on `Date.UTC(...)`)
  - `cameraDropsARepeatedMake`: make `Canon`, model `Canon EOS R5` → `Canon EOS R5`; make `Apple`, model `iPhone 16 Pro` → `Apple iPhone 16 Pro`; make off → `iPhone 16 Pro`
  - `handleStripsLeadingAt`: `"  @@adam "` → `@adam`; blank → no item
  - `missingTagsAreOmitted`: `{}` with caption on and handle `adam` → above `[@adam]`, below `[]`
  - `rowsFollowSettingsOrderAndToggles`: a field removed from `captionFields` disappears, and order follows `captionAbove`/`captionBelow`
  - `uprightSizeSwapsForRotatedOrientations`: 4032×3024 with orientation 6 → 3024×4032, with 1 → unchanged
- [ ] **Step 2: Run** `npm test caption`. Expected: FAIL.
- [ ] **Step 3: Implement** `caption.ts` (formatting part). `decimal()` matches Swift: round to one place and drop a trailing `.0`.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `Read photo details and build caption rows for the web editor`.

### Task 3: Caption placement and text color

**Files:**
- Modify: `src/editor/caption.ts`, `src/editor/caption.test.ts`

**Interfaces:**
- Consumes: `Layout` (Task 1), `CaptionRows` (Task 2)
- Produces:
  - `type Measure = (text: string) => number` (width of `text` at font size 1)
  - `type CaptionPlacement = { fontSize: number; entries: { item: CaptionItem; frame: Rect }[] }`
  - `captionPlacement(rows: CaptionRows, layout: Layout, measure: Measure): CaptionPlacement | null`
  - `captionTextColor(borderHex: string, fill: 'color' | 'blur'): string`

- [ ] **Step 1: Write the failing tests** using `measure = t => t.length * 0.6`:
  - `rowWithoutRoomIsLeftOut`: padding 0 → `null`
  - `fontSizeIsLimitedByTheBorderDepth`: on a 1000×1000 canvas with a 40 px top gap, the font size is `min(1000*0.022, 40/2.6)`
  - `spreadRowSpansThePhotoWidth`: the first entry's `x` is `imageRect.x` and the last entry's right edge is `imageRect.x + width` (±0.01)
  - `singleSpreadItemIsCentered`
  - `groupedRowsUseFixedSpacing`: leading starts at `imageRect.x`, trailing ends at the right edge, center is centered
  - `aboveRowSitsJustAboveThePhoto`: `y === imageRect.y - fontSize*0.8 - fontSize*1.2`
  - `textColorFollowsBorderLuminance`: `#ffffff` → `rgba(0,0,0,0.7)`, `#000000` → `rgba(255,255,255,0.8)`, any color with blur → `rgba(255,255,255,0.9)`. Convert sRGB hex to linear before computing luminance (the app's `Color.Resolved` is linear).
- [ ] **Step 2: Run** the tests. Expected: FAIL.
- [ ] **Step 3: Implement** as a port of `PhotoCaption.swift:360-413` with no icons, so item width is `measure(text)`.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `Lay out the caption rows like the app`.

### Task 4: Canvas renderer and export

**Files:**
- Create: `src/editor/compose.ts`

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces:
  - `type LoadedPhoto = { id: string; file: File; name: string; size: Size /* upright */; preview: ImageBitmap /* long side ≤ 2048 */; details: PhotoDetails }`
  - `loadPhoto(file: File): Promise<LoadedPhoto>` rejects with `DecodeError` for unreadable files. The message is `"This browser can't open HEIC photos. Try Safari, export the photo as JPEG, or use the multiborder app."` when the type or extension is HEIC/HEIF, otherwise `"This photo couldn't be opened."`
  - `drawComposite(ctx: CanvasRenderingContext2D, image: CanvasImageSource, layout: Layout, s: BorderSettings, details: PhotoDetails): void`
  - `exportJpeg(photo: LoadedPhoto, s: BorderSettings): Promise<Blob>` decodes the full-resolution file, lays it out with `MAX_CANVAS_PIXELS`, draws, runs `toBlob('image/jpeg', 0.92)`, then frees the bitmap and sets the canvas to 0×0
  - `supportsCanvasFilter(): boolean`
  - `exportName(name: string): string` → `"<base>-multiborder.jpg"`

- [ ] **Step 1: Implement `loadPhoto`.** Use `createImageBitmap(file, { imageOrientation: 'from-image' })` for both the full size and the preview (`resizeWidth`/`resizeHeight` to fit 2048 on the long side, `resizeQuality: 'high'`). The browser applies EXIF orientation, so `size` is the bitmap's own width and height. Fill `details` from `readTags`.
- [ ] **Step 2: Implement `drawComposite`** in this order, mirroring `ImageComposer.composite`:
  1. Background: fill `borderColor`. Or, for blur, draw `image` scaled down to a 512 long side onto a scratch canvas padded by `3σ` on each side (image stretched to cover the padding, so edges don't fade), with `filter = blur(σ px)` where `σ = blurRadius / scaleUp`. Then draw the center crop scaled to cover the canvas.
  2. Shadow: when `shadowBlur > 0`, fill the rounded photo path with `shadowColor rgba(0,0,0,0.5)`, `shadowBlur`, `shadowOffsetY = blur/4`.
  3. Photo: clip to `roundRect(imageRect, cornerRadius)` when the radius is > 0, then `drawImage(image, imageRect)`.
  4. Caption: wait for `document.fonts.load('16px "Space Mono"')`. Run `captionPlacement` with `measure = t => ctx.measureText(t).width / 100` at a 100 px font, then `fillText` at each frame with `textBaseline = 'middle'` on the frame's vertical center, using `captionTextColor` and the blur-fill text shadow.
- [ ] **Step 3: Verify** with `npx tsc --noEmit`. Expected: no errors. Visual checks happen in Task 5.
- [ ] **Step 4: Commit** `Draw and export bordered photos on a canvas`.

### Task 5: Editor page, controls, nav

**Files:**
- Create: `src/app/(main)/editor/page.tsx`, `src/components/editor/Editor.tsx`, `src/components/editor/Controls.tsx`
- Modify: `src/constants.ts` (insert `['Web Editor', '/editor']` after Features), `src/app/sitemap.ts` (add `/editor`, monthly, 0.3), `package.json` (dependency `fflate`)

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Page.** `page.tsx` is a server component that exports `metadata` (title "Web Editor", description "Add borders to your photos in your browser. Nothing is uploaded.") and renders `<Editor/>` inside `<Container>`. Follow the `support/page.tsx` pattern.
- [ ] **Step 2: Editor** (`'use client'`). It handles:
  - a file input (`accept="image/*"`, multiple), plus drag-and-drop on the empty state
  - a thumbnail strip with a remove button for each photo, and the selected photo's preview
  - per-photo error rows that show the `DecodeError` message
  - settings in `useState(loadSettings)`, saved on change
  - the preview: a `<canvas>` sized to its container × `devicePixelRatio`, drawn with `layout(photo.size, {...s, exportWidth: cssWidth*dpr})` and the photo's `preview` bitmap
  - **Download** (selected photo) and **Download all**, which exports one photo at a time and zips more than one with `fflate.zipSync` into `multiborder.zip`
  - a busy state while exporting
  - the note "Photos stay on your device. Want HDR, HEIC, more fonts and caption icons? Get the app." with `AppStoreLink`
- [ ] **Step 3: Controls.** Each control is labeled and keyboard-usable (native `<input type=range|color|checkbox>` and `<select>`):
  - aspect ratio buttons and a Landscape toggle (hidden for Original and 1:1)
  - padding slider (0–16%)
  - Color/Blur fill (Blur hidden when `!supportsCanvasFilter()`) with the color picker or blur slider
  - Rounded corners toggle and slider, Shadow toggle and slider
  - Caption toggle, then a checkbox per field, an alignment select per row, a handle text field and Make/Model checkboxes
  - export width select (Full size or 1080 px)
- [ ] **Step 4: Build and serve:** `npm run build && npx next start -p 3100`. Expected: the build succeeds and `/editor` is listed as a static route.
- [ ] **Step 5: Manual/Playwright check** at `http://localhost:3100/editor`:
  - Upload `~/dev/multiborder-2.0/sample-photos/IMG_2066.JPG` and IMG_2067.
  - The preview updates live with each control.
  - Download gives a JPEG whose size equals `layout(...)` for those settings (check in the browser console).
  - Download all gives a zip with 2 files.
  - A rotated sample comes out upright.
  - A `.HEIC` in Chromium shows the HEIC message.
  - Settings survive a reload.
  - No horizontal scroll at 390 px width.
  - The network panel shows no request carrying the photo.
- [ ] **Step 6: Commit** `Add the web editor page`.

---

## Rough size

About 600–800 lines of TypeScript plus tests, so **2–3 focused days**. Tasks 1–3 are mechanical ports with tests. Task 4 is where most of the visual fiddling goes (matching the app's shadow and blur look). Task 5 is regular React UI.

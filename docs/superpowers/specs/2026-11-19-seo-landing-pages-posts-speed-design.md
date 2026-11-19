# Editor landing pages, more blog posts, and page-speed fixes

Approved by Adam on 2026-11-19.

## Why

The site's technical SEO is in place. Discovery is now limited by how few
search intents the site can rank for: one `/editor` page and three posts.
People search for a tool ("add white border to photo online"), so the free
web editor is the best thing to rank, and each intent needs its own page.

## Goals

- Four editor landing pages, each targeting one search intent.
- Four more blog posts answering searched questions.
- Lighter home page media.

Non-goals: changing how the editor works, redesigning any page, new
dependencies. Anti-goal: thin doorway pages. Each landing page must open
the editor already set up for what its title promises.

## Approaches

1. **Preset routes rendering the shared editor (chosen).** One dynamic
   route, `/editor/[preset]`, statically generated from a list of presets
   in `src/content`. Each preset has a slug, title, description, heading,
   short copy and a `Partial<BorderSettings>`. Mirrors how the blog is
   built.
2. Query strings (`/editor?preset=instagram`). One URL can only carry one
   title and canonical, so it cannot rank for separate intents.
3. Hand-written page per intent. Works, but four near-identical files.

## Design

### Landing pages

| Path | Preset |
|---|---|
| `/editor/white-border` | white colour fill, original shape, visible padding |
| `/editor/instagram` | 4:5 canvas, white fill, no crop |
| `/editor/camera-settings` | caption on, camera details shown |
| `/editor/blur-background` | blur fill, 4:5 |

- `Editor` takes an optional `preset` prop. On mount the settings are
  `{ ...loadSettings(), ...preset }`. Nothing is saved until the visitor
  changes a control, so opening a landing page does not overwrite saved
  settings. (Claude's call: once they change something, the merged
  settings are saved as today.)
- Each page has its own `title`, `description`, an `h1`, a few lines of
  copy above the editor, and canonical URL. `/editor` keeps its current
  metadata and gains links to the four pages.
- All four are in the sitemap (priority 0.7) and linked from the matching
  blog posts.

### Blog posts

Same format as the existing posts in `src/content/blog`, each with editor
screenshots in `public/blog/` and a link to the matching landing page:

- posting a full photo on Instagram without cropping
- Instagram sizes: 4:5 vs 3:4 vs 1:1
- blurred-background borders
- film-style borders

### Speed

- Delete the unused `src/images/demo.gif` and the commented-out code that
  referenced it.
- Re-encode `public/demo.mp4` (1.2 MB) smaller and add a poster frame.
- Find why `src/images/iphoneframe.svg` is 499 KB and shrink it without
  changing how it looks.

## Left to the builder

Exact preset values, page copy, post wording, screenshot framing, encoder
settings.

## Proof

`npm test`, `npm run lint`, `npm run build`; each new route renders with
its own title and canonical; the hero and phone frame look unchanged.

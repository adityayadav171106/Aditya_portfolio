# Aditya — ASCII portfolio

A single-page portfolio for Aditya Yadav, built as an **Angular** web app.
Every headline, project card and doodle on the page is monospace text laid over
one canvas of drifting ASCII stars.

```
   /\_/\        .            *
  ( o.o )      / \            .
   -= ^ =-    /   \      ·
  /|   |\    |     |        *
```

## What is in here

| Concern | Where |
| --- | --- |
| Content (verified from the `redesign` branch + GitHub) | `src/app/data/content.ts` |
| Section components | `src/app/sections/*.component.ts` |
| Shell, header, cat companion, star canvas | `src/app/core/*.component.ts` |
| ASCII renderer (auto fit-to-width, line reveal) | `src/app/shared/ascii-art.component.ts` |
| Design tokens + four themes | `src/styles.scss` |
| Font subset (JetBrains Mono, ASCII + box drawing) | `public/fonts/jetbrains-mono-ascii.woff2` |

## Interactions

- **Mouse**: pointer parallax on the star field; hover states on keys and cards.
- **Scroll**: sections reveal in, the progress hairline fills, the cat walks.
- **Keyboard**: `H` `A` `W` `S` `C` jump to sections, `J` / `K` step through them,
  `T` cycles the theme (`moonlight → phosphor → amber → paper`, remembered in
  `localStorage`).
- **Themes** recolour the canvas, art, borders and text from CSS custom properties.
- `prefers-reduced-motion` disables reveals, the typewriter, the intro curtain,
  the cat and all canvas animation (a single static frame is drawn instead).

## Running it

```bash
npm install
npm start          # ng serve → http://localhost:4200
npm run build      # production build → dist/website/browser
```

Node 20+ is enough; the app itself is Angular 22, zoneless, standalone
components, signals, no router (it is one page by design).

## Deploying

The production build is fully static. Publish `dist/website/browser` to any
static host (GitHub Pages, Netlify, Cloudflare Pages, S3…). For GitHub Pages
under a repository path, build with:

```bash
npx ng build --base-href /Aditya_portfolio/
```

## Content policy

Nothing on this site is invented. Project facts come from the public
repositories ([BAGTAG](https://github.com/adityayadav171106/BAGTAG),
[crce_placement_portal-](https://github.com/adityayadav171106/crce_placement_portal-))
and the earlier `redesign` branch's `PRODUCT.md`; contact links are the verified
ones. When a project or detail is not known, it is left out rather than filled
with placeholder claims.

## Accessibility

Semantic landmarks, a skip link, visible focus rings, `aria-label`ed ASCII art
(each `pre` is exposed as one image with a description, plus a screen-reader copy
of the raw art), real buttons for every control, and reduced-motion support.

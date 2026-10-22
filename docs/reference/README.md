# Reference code (not built)

Draft implementations written alongside the design. Nothing in `docs/` is compiled by Astro.

| File | Move to | State |
|---|---|---|
| `layouts/Base.astro` | `src/layouts/` | complete: head, theme-before-paint script, background, dock, motion import |
| `components/Dock.astro` | `src/components/` | complete |
| `components/PageHead.astro` | `src/components/` | complete (path line, § label, title, ghost word, lead) |
| `components/Timeline.astro` | `src/components/` | complete for education + experience (`org` entries with `roles[]`) |
| `components/home/Hero.astro`, `About.astro` | `src/components/home/` | markup complete (About is the approved layout); their CSS is **not written yet**: create `src/styles/pages/home.css` from `docs/design/Main.dc.html` |
| `islands/ThemeToggle.tsx`, `LocalTime.tsx` | `src/islands/` | complete |
| `styles/**` | `src/styles/` | complete for background, dock, page-head, timeline, prose, base, utilities. `global.css` is the `@import` manifest and already lists files that do not exist yet (`components/cards.css`, `pages/*.css`): create each in its phase, or comment the line out until then |

Moving a file: copy it, fix import paths, run `npm run build`, then compare with `docs/design/screenshots/`.
Treat this code as a strong first draft: if it disagrees with the screenshots, the screenshots win.
Already live in `src/`: `content.config.ts`, all content YAML, `data/site.ts`, `scripts/motion.ts`, `styles/tokens.css`, `styles/motion.css`.

---
description: Add a book, paper or article to the reading library
argument-hint: <title>
---
Add "$ARGUMENTS" to the reading library.

1. Copy `src/content/reading/_template.md` to `src/content/reading/<kebab-case-of-title>.md`.
2. Ask me for `author`, `kind` (book / paper / article), `status` (reading / finished / queued), and optionally `topic`, `year`, `finished` (the date I finished it), `url`, `why`.
3. Replace the template body with my notes, or remove it if I have none (a body turns on the `/reading/<slug>/` notes page).
4. Run `npm run build` and confirm it passes.

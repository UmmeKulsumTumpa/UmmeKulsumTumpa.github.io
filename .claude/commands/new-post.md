---
description: Create a new blog post in src/content/writing
argument-hint: <post title>
---
Create a new post titled "$ARGUMENTS".

1. Copy `src/content/writing/_template.md` to `src/content/writing/<kebab-case-of-title>.md`.
2. Fill `title`, `date` (today), and ask me for `summary` and `tags` (allowed: llm, engineering, notes, essays). Set `draft: true` until I say it is ready.
3. Leave the body as headings for me to write; do not write the post content for me unless I ask.
4. Run `npm run build` and confirm it passes.

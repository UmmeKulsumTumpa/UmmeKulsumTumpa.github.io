---
description: Add a job, role or degree to the experience or education timeline
---
Ask me: which file (experience or education), the organisation, the title, type, start, end (or current), and 1–3 bullets.

1. If the organisation already exists in the YAML, add the role to the **top** of its `roles` list (newest first) and,
   if the new role is current, set the previous current role's `current: false` and give it an `end`.
2. Otherwise add a new organisation entry at the position that keeps the file newest first.
3. Do not touch any other entry. Run `npm run build` and show me the diff.

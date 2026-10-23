---
description: Execute one phase of docs/PLAN.md, issue by issue, then release it
argument-hint: <phase number>
---
Execute Phase $ARGUMENTS of `docs/PLAN.md`, following `docs/GIT-WORKFLOW.md` exactly.

1. Read `CLAUDE.md`, `docs/SPEC.md`, `docs/GIT-WORKFLOW.md`, the Phase $ARGUMENTS section of `docs/PLAN.md`, and `docs/design/README.md`.
2. If this is Phase 0: do the Phase 0 steps and the one-time setup, show me the backlog table, and stop for my OK.
3. Otherwise list the open issues of the milestone for Phase $ARGUMENTS (`gh issue list --milestone "<title>" --state open`)
   and show me the order you will work them in, with a one-line plan per issue. Then start without waiting unless something is unclear.
4. For each issue, run the feature loop: branch off `develop`, read the screenshots it names, implement in small Conventional
   Commits, `npm run build` before each commit, visual check, PR into `develop` with `Closes #n`, CI green, self-review the diff,
   squash merge, delete the branch. After each merge send me one line: issue, PR link, what changed, checks.
5. When every issue in the milestone is closed, check every item under Phase $ARGUMENTS in `docs/PLAN.md` on `develop`
   and report each as pass/fail with evidence. Fix failures as new issues in the same milestone.
6. Run the release loop up to the release PR into `main`, then stop and ask me before merging it.
7. After my yes: merge, create the GitHub release, back-merge into `develop`, watch the deploy, check the live pages,
   close the milestone, and stop. Do not start the next phase.

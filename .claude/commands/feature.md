---
description: Build one feature or fix through the full git flow (issue, branch, commits, PR, merge)
argument-hint: <issue number, or a description of a new feature/fix>
---
Work on: $ARGUMENTS

1. If that is an issue number, read it with `gh issue view`. If it is a description, create an issue first using the body
   template in `docs/GIT-WORKFLOW.md`, with the right `type:` label and the current phase milestone; show it to me.
2. Run the feature loop in `docs/GIT-WORKFLOW.md` for that issue only: branch off `develop`, small Conventional Commits,
   `npm run build` before each commit, visual check for any page it touches, PR into `develop` with `Closes #n`,
   CI green, self-review against `CLAUDE.md`, squash merge, delete the branch.
3. Change only what the issue asks. Anything else you notice becomes a new issue.
4. Report: issue, PR link, what changed, check results.

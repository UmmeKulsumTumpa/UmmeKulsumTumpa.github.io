---
description: Release develop to main (deploys the live site) as version v0.<n>.0
argument-hint: <phase number>
---
Release Phase $ARGUMENTS as `v0.$ARGUMENTS.0` (`v1.0.0` if this is Phase 7), following the release loop in `docs/GIT-WORKFLOW.md`.

1. Confirm the phase milestone has no open issues; if it does, list them and stop.
2. Create `release/<version>` from `develop`, bump the version with `npm version <version> --no-git-tag-version`,
   commit `chore(release): <version>`, push, open the PR into `main` listing the merged PRs and closed issues.
3. Wait for CI, then ask me before merging (it deploys the public site).
4. After my yes: merge commit, `gh release create`, back-merge the release branch into `develop` by PR, watch the deploy,
   check the live pages, close the milestone, report the live URL and release link.

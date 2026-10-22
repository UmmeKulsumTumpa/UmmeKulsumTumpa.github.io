# Kickoff prompt for Claude Code

Paste everything inside the block into Claude Code, started in this folder.

```text
You are building my personal website in this repository, from the spec and design I already prepared. I want you to plan, build and ship it feature by feature with a standard Gitflow process on GitHub.

Read these first, fully, before doing anything:
1. CLAUDE.md (rules)
2. docs/SPEC.md (what to build; the source of truth)
3. docs/PLAN.md (phases and their checks)
4. docs/GIT-WORKFLOW.md (branches, issues, commits, PRs, releases, and the issue backlog)
5. docs/design/README.md, then open the screenshots in docs/design/screenshots/ for the pages you are about to touch

Then:

A. Preflight. Check: node -v (needs >= 22.23.4), gh auth status (logged in as UmmeKulsumTumpa), git config user.name / user.email. If anything is missing, tell me the exact command to run and wait. Do not run gh auth login yourself.

B. Phase 0. Do the Phase 0 steps in docs/PLAN.md: initial commit on main, create the public repo UmmeKulsumTumpa.github.io, enable Pages with GitHub Actions, watch the first deploy. Then run the one-time setup in docs/GIT-WORKFLOW.md: develop as the default branch, merge-commit-only settings, labels, milestones, every issue in the backlog (with the body template, labels and milestone), the CI workflow through the normal feature loop, branch protection on main and develop, release v0.0.1. Show me the milestones and issues as a table with their GitHub numbers, and stop for my OK.

C. Phases 1 to 7, in order, one at a time. For each phase:
   - Work its milestone's issues one by one with the feature loop: feature/<issue#>-<slug> off develop, small Conventional Commits (npm run build passes before every commit), the visual check against the design screenshots, PR into develop with "Closes #<n>", CI green, self-review of the diff against CLAUDE.md, merge commit, delete the branch.
   - After each merge, send me one line: issue, PR link, what changed, check results.
   - When the milestone is empty, verify the phase checks in docs/PLAN.md on develop and report pass/fail with evidence.
   - Open the release PR (release/v0.N.0 into main). Stop and ask me before merging it, because that deploys the live site. After my yes, finish the release loop (merge, GitHub release, back-merge into develop, watch the deploy, check the live pages, close the milestone) and wait for me before starting the next phase.

Rules that matter most to me:
- The site must look exactly like the design screenshots. Compare every page you build with them; do not call a page done while you can still name a visible difference.
- Change only what the current issue asks. Do not restyle or restructure approved sections. Anything else you notice becomes a new issue.
- Never commit directly to main or develop after Phase 0, never force-push them, never rewrite pushed history, never skip hooks.
- Never invent facts about me. Keep [placeholders] and label the issue needs:owner with a comment saying exactly what you need, then continue with the next independent issue.
- If the spec is unclear or two documents disagree, ask me instead of guessing.
- Look up current docs (GitHub API, action versions, Astro APIs) instead of answering from memory.

Start with A.
```

Shortcuts for later sessions: `/execute-phase <n>`, `/feature <issue# or description>`, `/release <n>`.

# CLAUDE.md

Personal website of Umme Kulsum Tumpa (software engineer + LLM researcher). Astro 7 static site, React 19 islands,
TypeScript strict, Markdown/YAML content, deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Read first

1. `docs/SPEC.md`: what to build (source of truth).
2. `docs/design/README.md` and every screenshot it lists for the page you touch: what it must look like,
   and the v2 screenshots for Home, Education, Experience and Research.
3. `docs/PLAN.md`: phase order and per-phase checks. Work one phase at a time.
4. `docs/GIT-WORKFLOW.md`: issues, branches, commits, PRs, releases. Follow it for every change.

## Rules

- **Match the design screenshots exactly.** Use the visual check in `docs/PLAN.md` before saying a page is done.
- **Change only what the task asks.** Do not restructure, restyle or "improve" approved sections you were not asked about
  (the owner has rejected this twice). If you think something else should change, say so and ask.
- Timelines are **newest first**; roles at the same organisation share one block with connected dots.
- Separation of concerns (SPEC §2.1): pages compose components only; one CSS file per component/page under `src/styles/`;
  no inline `style=""`, no `<style>` blocks in pages, no CSS-in-JS, no `!important`; hex colours only in `src/styles/tokens.css`.
- Client JS only in `src/islands/*.tsx` and `src/scripts/motion.ts`. Respect `prefers-reduced-motion`.
- Content lives in `src/content/`; adding a post, role, project or book must never need a code change.
- Keep `[bracket placeholders]` in content until the owner supplies the real text
  (production builds hide them; `npm run dev` shows them). Do not invent facts about her.
- Git (details in `docs/GIT-WORKFLOW.md`): one issue → one `feature/<issue#>-<slug>` branch off `develop` → Conventional Commits →
  PR into `develop` → CI green → squash merge (release and back-merge PRs keep merge commits). Never commit directly to `main` or `develop` after Phase 0, never force-push them.
  Releases to `main` deploy the public site: **ask the owner before merging any PR into `main`.**
- Work found mid-task becomes a new issue, not extra commits on the current branch.

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Build (must pass before any commit) | `npm run build` |
| Preview build | `npm run preview` |
| Regenerate content types | `npm run sync` |
| Screenshots of the build for comparison | `npm run shots -- /page/` (needs preview running) |

Node ≥ 22.23.4 (`.nvmrc` says 24).

## Slash commands

`/execute-phase <n>`, `/feature <issue# or description>`, `/release <n>`, `/new-post <title>`, `/add-role`, `/add-reading <title>`: see `.claude/commands/`.

# ummekulsumtumpa.github.io

Personal website of **Umme Kulsum Tumpa**, software engineer and LLM researcher.
Live at https://ummekulsumtumpa.github.io

Built with [Astro](https://astro.build) + React islands, content in Markdown/YAML, deployed to GitHub Pages by GitHub Actions on every push to `main`.

## Run locally

```sh
nvm use            # Node 24 (see .nvmrc)
npm ci
npm run dev        # http://localhost:4321
```

## Add content (no code needed)

| To add | Do this |
|---|---|
| Blog post | copy `src/content/writing/_template.md` to a new `.md` file |
| Book / paper / article | copy `src/content/reading/_template.md` |
| Job or role | edit `src/content/experience.yaml` (newest first) |
| Degree | edit `src/content/education.yaml` |
| Course project | edit `src/content/course-projects.yaml` |
| Paper | edit `src/content/publications.yaml` |
| Selected project (Experience) | edit `src/content/selected-projects.yaml` (newest first) |
| Toolbox item (Experience) | edit `src/content/toolbox.yaml` |

Open a PR into `develop`; the site updates when `develop` is released to `main` (see `docs/GIT-WORKFLOW.md`).

## Docs

`docs/SPEC.md` (what to build), `docs/PLAN.md` (build phases), `docs/design/` (approved design screenshots), `CLAUDE.md` (rules for Claude Code).
`docs/GIT-WORKFLOW.md` (Gitflow: issues, branches, commits, PRs, releases).

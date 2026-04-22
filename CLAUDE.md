# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

GitHub profile README auto-generator for [jung-thomas](https://github.com/jung-thomas/jung-thomas). Fetches live data from external APIs, renders a Handlebars template, and outputs the final `README.md` via a GitHub Actions workflow ("README builder").

## Build

```sh
npm run build        # node build.js — prints generated README to stdout
```

No test suite exists. Validate changes by running `npm run build` and inspecting the output.

## Architecture

- **`build.js`** — Main entry point. Fetches data from YouTube RSS and SAP Community APIs, renders the template, and prints to stdout.
- **`template.js`** — Exports a Handlebars template string (raw markdown with `{{#items}}` blocks).
- **`README.md`** — Generated output. **Do not edit manually**; the CI workflow overwrites it every 6 hours via `npm --silent run build > README.md`.

Data sources:

1. YouTube RSS feed (SAP Developers channel) — latest 6 videos via `rss-parser`
2. SAP Community CodeJam events — upcoming 5 events via `then-request` + Lithium REST API (SQL-like query syntax in URL)
3. GitHub API — repo metadata (description, URL) for 4 featured repos in `FEATURED_REPOS` array
4. SAP Community blog posts — currently commented out

## Conventions

- **CommonJS** modules (`require` / `module.exports`), not ESM
- Template uses Handlebars triple-stash `{{{var}}}` for unescaped HTML/URLs
- `build.js` exits with code 1 on any fetch error — but the GitHub Action uses `continue-on-error: true`, so the workflow run won't show as failed
- Keep API queries and template sections in sync: if you add a data source in `build.js`, add a matching Handlebars block in `template.js` (current blocks: `{{#itemsNew}}`, `{{#events}}`, `{{#repoRows}}`)

## Pitfalls

- `GITHUB_TOKEN` env var is optional but recommended — without it, GitHub API calls are rate-limited to 60/hr. The CI workflow provides it via `secrets.GITHUB_TOKEN`
- Editing `README.md` directly is pointless — CI regenerates it from the template
- The SAP Community API uses a SQL-like query syntax in the URL; URL-encode special characters carefully
- `then-request` is synchronous-style but returns a thenable; prefer `await` over `.then()` chains

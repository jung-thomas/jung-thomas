# Project Guidelines

## Overview

GitHub profile README auto-generator for [jung-thomas](https://github.com/jung-thomas/jung-thomas). Fetches live data from external APIs, renders a Handlebars template, and outputs the final `README.md` via a GitHub Actions workflow ("README builder").

## Architecture

- **`build.js`** — Main entry point. Fetches data from YouTube RSS and SAP Community APIs, then renders and prints to stdout.
- **`template.js`** — Exports a Handlebars template string (raw markdown with `{{#items}}` blocks).
- **`README.md`** — Generated output. **Do not edit manually**; it is overwritten by the CI workflow.

Data sources:
1. YouTube RSS feed (SAP Developers channel) — latest 6 videos via `rss-parser`
2. SAP Community CodeJam events — upcoming 5 events via `then-request` + Lithium REST API
3. SAP Community blog posts — currently commented out

## Build

```sh
npm run build        # node build.js — prints generated README to stdout
```

No test suite exists. Validate changes by running `npm run build` and inspecting the output.

## Conventions

- **CommonJS** modules (`require` / `module.exports`), not ESM
- Template uses **Handlebars** triple-stash `{{{var}}}` for unescaped HTML/URLs
- `build.js` exits with code 1 on any fetch error — the GitHub Action treats this as a failure
- Keep API queries and template sections in sync: if you add a data source in `build.js`, add a matching `{{#block}}` in `template.js`

## Pitfalls

- Editing `README.md` directly is pointless — CI regenerates it from the template
- The SAP Community API uses a SQL-like query syntax in the URL; URL-encode special characters carefully
- `then-request` is synchronous-style but returns a thenable; prefer `await` over `.then()` chains

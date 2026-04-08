---
title: GitHub Profile README Redesign
date: 2026-04-08
status: approved
---

## Overview

Redesign the `jung-thomas` GitHub profile README to remove broken external services, clean up outdated social links, and add three new static sections (About, Tech Stack, Featured Projects). Live dynamic data (YouTube RSS, SAP CodeJam API) is preserved unchanged.

## What's Changing

### Removed

- **Twitter/X and Mastodon** social badges — replaced by LinkedIn only
- **"On my blog"** section — SAP Community blog API is commented out and unmaintained; `{{#items}}` block removed from template, `items` variable dropped from `build.js`
- **"README builder" CI badge** — stale / cosmetically unnecessary
- **"Open in VSCode" badge** — not relevant on a profile page
- **SAP Community Activity badges** — `devrel-tools-prod-scn-badges-srv.cfapps.eu10.hana.ondemand.com` is unreliable/broken
- **GitHub Statistics widgets** — `github-readme-streak-stats.herokuapp.com` unreliable, `activity-graph.herokuapp.com` shut down, trophy widget optional cruft
- **Old `<table>` wrapping blog + videos** — the outer table that placed "On my blog" and "Videos" side by side is removed; a new table places YouTube and CodeJams side by side instead (see Layout)

### Kept (live data, no changes to fetch logic)

- **YouTube RSS** — latest 6 videos from SAP Developers channel via `rss-parser`; template block is `{{#itemsNew}}`, uses fields: `{{{title}}}`, `{{{link}}}`, `{{date}}` (unchanged from existing template)
- **Upcoming SAP CodeJams** — next 5 events via SAP Community Lithium API; template block is `{{#events}}`, uses fields: `{{{title}}}`, `{{{href}}}`, `{{{thumb}}}`, `{{{startTimeFormatted}}}`, `{{{location}}}` (unchanged from existing template)

### Added

#### About (static, in template)

> Nearly three decades in SAP — from ABAP developer to Head of Developer Advocacy. I lead a team that creates tutorials, videos, sample code, and CodeJams to help developers cut through the noise and actually build things.

#### Tech Stack (static shields.io badges, in template)

Render as a row of `<img>` tags. Exact badge URLs:

| Technology | Badge URL |
| --- | --- |
| SAP BTP | `https://img.shields.io/badge/SAP%20BTP-0070F2?style=flat&logo=sap&logoColor=white` |
| CAP (Node.js) | `https://img.shields.io/badge/CAP%20Node.js-0070F2?style=flat&logo=sap&logoColor=white` |
| SAP HANA Cloud | `https://img.shields.io/badge/SAP%20HANA%20Cloud-00A4E4?style=flat&logo=sap&logoColor=white` |
| ABAP | `https://img.shields.io/badge/ABAP-0070F2?style=flat&logo=sap&logoColor=white` |
| SAP AI Core | `https://img.shields.io/badge/SAP%20AI%20Core-6E40C9?style=flat&logo=sap&logoColor=white` |
| JavaScript / Node.js | `https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black` |
| Joule Studio | `https://img.shields.io/badge/Joule%20Studio-E8503A?style=flat&logo=sap&logoColor=white` |

#### Featured Projects (live data — new GitHub API fetch in `build.js`)

Fetch repo name + description from GitHub REST API (`GET https://api.github.com/repos/:owner/:repo`) for:

1. `SAP-samples/hana-developer-cli-tool-example`
2. `SAP-samples/abap-oo-basics`
3. `SAP-samples/cloud-cap-hana-swapi`
4. `SAP-samples/cap-hana-exercises-codejam`

Map each response to `{ name, description, url }` where `url = html_url`, `name = name`, `description = description || ''`.

In `build.js`, split the flat `repos` array into pairs before passing to the template:

```js
const repoRows = []
for (let i = 0; i < repos.length; i += 2) {
  repoRows.push(repos.slice(i, i + 2))
}
// pass repoRows to template, not repos
```

**Rate limiting:** Unauthenticated GitHub API requests are limited to 60/hour per IP. GitHub Actions runners share IPs and can exhaust this. The build must pass `User-Agent` (required by GitHub API), `Accept`, `X-GitHub-Api-Version`, and `Authorization` headers:

```js
const repoHeaders = {
  'User-Agent': 'jung-thomas-readme-builder',
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN && {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`
  })
}
```

`GITHUB_TOKEN` is automatically available in GitHub Actions without any secrets configuration.

**Partial failure:** If a single repo returns a non-200 response (e.g., repo renamed or deleted), log a warning to stderr and substitute `{ name: slug.split('/')[1], description: '', url: 'https://github.com/' + slug }`. The bare repo name (after the `/`) is used as the fallback link text. Do not exit.

## Layout

Single-column flow, in this order:

```text
1. Header           — name, title, LinkedIn badge
2. About            — short bio (two sentences)
3. Live columns     — YouTube videos (left) | Upcoming CodeJams (right)  [HTML table, 50/50]
4. Tech Stack       — shields.io badge row
5. Featured Projects — 2x2 HTML table of repo cards (name + description)
```

The YouTube + CodeJam side-by-side layout reuses the same `<table><tr><td valign="top" width="50%">` pattern as the old template, just without the blog column.

## Template Changes (`template.js`)

Full rewrite. Variable names passed from `build.js`:

| Variable    | Type            | Source                                   |
|-------------|-----------------|------------------------------------------|
| `itemsNew`  | array of items  | YouTube RSS                              |
| `events`    | array of events | CodeJam API                              |
| `repoRows`  | array of pairs  | GitHub API, pre-split into 2-item arrays |

`items` (blog posts) is removed entirely — no longer passed or used.

### Repo card markup (2x2 HTML table)

```handlebars
<table>
{{#repoRows}}
<tr>
{{#this}}
<td valign="top" width="50%">

**[{{{name}}}]({{{url}}})**

{{{description}}}

</td>
{{/this}}
</tr>
{{/repoRows}}
</table>
```

Triple-stash `{{{...}}}` is used for `url`, `name`, and `description` to prevent Handlebars HTML-escaping.

## Build Changes (`build.js`)

Add a `repos` fetch after the existing fetches. Use sequential `await` calls — `then-request` is synchronous and blocks regardless, so `Promise.all` offers no benefit here. If `then-request` is ever replaced with a real async client, switch to `Promise.all` for the four parallel repo fetches:

```js
const FEATURED_REPOS = [
  'SAP-samples/hana-developer-cli-tool-example',
  'SAP-samples/abap-oo-basics',
  'SAP-samples/cloud-cap-hana-swapi',
  'SAP-samples/cap-hana-exercises-codejam',
]

const repoHeaders = {
  'User-Agent': 'jung-thomas-readme-builder',
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN && {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`
  })
}

const repos = []
for (const slug of FEATURED_REPOS) {
  const res = await request('GET', `https://api.github.com/repos/${slug}`, { headers: repoHeaders })
  if (res.statusCode !== 200) {
    process.stderr.write(`Warning: could not fetch ${slug} (${res.statusCode})\n`)
    repos.push({ name: slug.split('/')[1], description: '', url: 'https://github.com/' + slug })
  } else {
    const data = JSON.parse(res.getBody('utf8'))
    repos.push({ name: data.name, description: data.description || '', url: data.html_url })
  }
}

const repoRows = []
for (let i = 0; i < repos.length; i += 2) {
  repoRows.push(repos.slice(i, i + 2))
}
```

Pass `repoRows` alongside `itemsNew` and `events` to `template({ itemsNew, events, repoRows })`.

Remove `items` from the template call entirely.

## Error Handling

- Any top-level fetch failure (YouTube RSS, CodeJam API) → `process.exit(1)` (consistent with existing pattern)
- Individual GitHub repo fetch failure → log warning to stderr, push fallback object, continue (do not exit)

## Validation

Run `npm run build` and verify:

- LinkedIn badge renders
- About text appears
- YouTube list has 6 entries
- CodeJam list has up to 5 entries
- Tech stack badges appear as images (7 badges)
- Featured projects show 4 repo cards in a 2x2 table with names, descriptions, and working links
- No references to removed services in output (no herokuapp, no devrel-tools, no activity-graph)

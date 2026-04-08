# README Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the jung-thomas GitHub profile README template and build script to remove all broken external widgets, add About/Tech Stack/Featured Projects sections, and fetch live GitHub repo data.

**Architecture:** Two files change — `template.js` is fully rewritten with new static sections and updated Handlebars blocks, and `build.js` gains a GitHub API fetch loop that produces a `repoRows` variable (array of pairs) passed to the template alongside the existing `itemsNew` and `events` data.

**Tech Stack:** Node.js (CommonJS), Handlebars, rss-parser, then-request, GitHub REST API (unauthenticated + GITHUB_TOKEN), shields.io (static badge URLs)

---

## File Map

| File | Change |
|------|--------|
| `template.js` | Full rewrite — new layout, static About + Tech Stack, updated Handlebars blocks |
| `build.js` | Add GitHub API fetch + repoRows split; remove `items`; update template call |

No new files. No dependency changes.

---

### Task 1: Rewrite `template.js`

**Files:**
- Modify: `template.js`

This task has no automated tests — validation is `npm run build` and eyeballing the output. The project has no test suite (see CLAUDE.md).

- [ ] **Step 1: Open `template.js` and read the current content**

  Familiarise yourself with the existing Handlebars blocks. The file exports a single template string. Key blocks to keep: `{{#itemsNew}}` (YouTube) and `{{#events}}` (CodeJams). Everything else is replaced.

- [ ] **Step 2: Replace the entire contents of `template.js` with the new template**

  ```js
  module.exports = `
  # Hi there 👋🏼

  I'm **Thomas Jung**, Head of [SAP Developer Advocacy](https://developers.sap.com/developer-advocates.html) at SAP.

  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/thomasjungsap/)

  ---

  ## About

  Nearly three decades in SAP — from ABAP developer to Head of Developer Advocacy. I lead a team that creates tutorials, videos, sample code, and CodeJams to help developers cut through the noise and actually build things.

  ---

  <table><tr><td valign="top" width="50%">

  ## Latest Videos
  {{#itemsNew}}- [{{{title}}}]({{{link}}}) ({{date}})
  {{/itemsNew}}
  - More on [SAP Developers YouTube Channel](https://www.youtube.com/channel/UCNfmelKDrvRmjYwSi9yvrMg)

  </td><td valign="top" width="50%">

  ## Upcoming SAP CodeJams
  {{#events}}- [{{{title}}}]({{{href}}})
    - Start: {{{startTimeFormatted}}}
    - Location: {{{location}}}
  {{/events}}
  - More on [the SAP CodeJam Community Events Calendar](https://groups.community.sap.com/t5/sap-codejam/eb-p/codejam-events)

  </td></tr></table>

  ---

  ## Tech Stack

  <img src="https://img.shields.io/badge/SAP%20BTP-0070F2?style=flat&logo=sap&logoColor=white" alt="SAP BTP" />
  <img src="https://img.shields.io/badge/CAP%20Node.js-0070F2?style=flat&logo=sap&logoColor=white" alt="CAP Node.js" />
  <img src="https://img.shields.io/badge/SAP%20HANA%20Cloud-00A4E4?style=flat&logo=sap&logoColor=white" alt="SAP HANA Cloud" />
  <img src="https://img.shields.io/badge/ABAP-0070F2?style=flat&logo=sap&logoColor=white" alt="ABAP" />
  <img src="https://img.shields.io/badge/SAP%20AI%20Core-6E40C9?style=flat&logo=sap&logoColor=white" alt="SAP AI Core" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Joule%20Studio-E8503A?style=flat&logo=sap&logoColor=white" alt="Joule Studio" />

  ---

  ## Featured Projects

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
  `
  ```

  Note: The CodeJam section **removes** the `<img src="{{{thumb}}}" />` thumbnail line that was in the old template — thumbnails made the output very verbose. Location and start time are kept.

- [ ] **Step 3: Verify the file saved correctly**

  Run: `node -e "const t = require('./template'); console.log(typeof t)"` from `d:/projects/jung-thomas`

  Expected output: `string`

- [ ] **Step 4: Commit**

  ```bash
  git add template.js
  git commit -m "rewrite template: remove broken widgets, add about/tech-stack/featured-projects sections"
  ```

---

### Task 2: Update `build.js` — add GitHub API fetch and update template call

**Files:**
- Modify: `build.js`

- [ ] **Step 1: Read `build.js` in full**

  Understand the existing structure: `rss-parser` fetch for YouTube, `then-request` fetch for CodeJam events, `Handlebars.compile` call, and `console.log(template({ itemsNew, items, events }))`.

- [ ] **Step 2: Add the `FEATURED_REPOS` constant and `repoHeaders` object after the existing URL constants (top of file, before `const main`)**

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
  ```

- [ ] **Step 3: Add the GitHub fetch loop inside `main()`, after the existing CodeJam fetch block and before the `console.log` call**

  ```js
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

  `then-request` is synchronous — it blocks the event loop on each call. Sequential `await` in a `for...of` loop is the correct pattern here. If `then-request` is ever replaced with a real async client, switch to `Promise.all`.

- [ ] **Step 4: Update the `console.log` template call — remove `items`, add `repoRows`**

  Change:
  ```js
  console.log(template({ itemsNew, items, events }))
  ```

  To:
  ```js
  console.log(template({ itemsNew, events, repoRows }))
  ```

- [ ] **Step 5: Remove the now-unused `items` variable**

  In the existing code there is `let items = []` declared just before the `console.log`. Delete that line entirely.

- [ ] **Step 6: Run the build and verify output**

  ```bash
  npm run build
  ```

  Check the output for:
  - `LinkedIn` badge line present
  - `## About` heading present with bio text
  - `## Latest Videos` with 6 bullet points
  - `## Upcoming SAP CodeJams` with up to 5 events (no `<img` thumbnail tags)
  - `## Tech Stack` with 7 `<img` badge tags
  - `## Featured Projects` table with 4 repo cards, each with a name and description
  - No occurrences of `herokuapp`, `devrel-tools`, `activity-graph`, `twitter`, `mastodon`

  Quick grep check:
  ```bash
  npm --silent run build | grep -i "herokuapp\|devrel-tools\|activity-graph\|twitter\|mastodon"
  ```

  Expected: no output (zero matches).

- [ ] **Step 7: Commit**

  ```bash
  git add build.js
  git commit -m "build: add GitHub API fetch for featured repos, remove items variable"
  ```

---

### Task 3: Regenerate README.md and verify

**Files:**
- Modify: `README.md` (generated output)

- [ ] **Step 1: Regenerate README.md**

  ```bash
  npm --silent run build > README.md
  ```

- [ ] **Step 2: Inspect README.md**

  Open `README.md` and confirm:
  - Header shows Thomas Jung's name and SAP Developer Advocacy link
  - LinkedIn badge is present and uses `https://www.linkedin.com/in/thomasjungsap/`
  - About section has the bio text
  - YouTube and CodeJam sections are in a side-by-side HTML table
  - Tech Stack section has 7 inline `<img>` badge tags
  - Featured Projects section has an HTML table with 4 repo cards
  - Repo names match: `hana-developer-cli-tool-example`, `abap-oo-basics`, `cloud-cap-hana-swapi`, `cap-hana-exercises-codejam`
  - Each repo has a non-empty description (fetched live from GitHub)

- [ ] **Step 3: Commit**

  ```bash
  git add README.md
  git commit -m "regenerate README with new design"
  ```

# Interactive designs

GitHub never runs code in a README, so interactivity comes from three tricks:

1. **Disclosure.** `<details>` lets visitors choose what to open (`adventure`, `interactive-resume`). There's no setup, and it works everywhere.
2. **Rendered blocks.** Mermaid diagrams, maps and 3D models are drawn by GitHub (`interactive-resume`).
3. **Issues + Actions.** A link opens a pre-filled issue, and a GitHub Action in the profile repo updates the README and closes the issue (`guestbook`, `poll`). Visitors see their action reflected on the profile about a minute later.

## Adventure

- **Narration:** write short, second-person italics in each door ("*Workbenches line the walls…*"). One or two sentences, matching the person's personality.
- **Doors:** 4–6 is the right number. Common rooms are a workshop (projects), library (skills), journal (about), radio (contact) and a secret room. Rename them to fit the person; a gardener-developer might have a greenhouse.
- **Nesting:** put each project in its own nested `<details>` inside the workshop. More than two levels deep gets tedious.
- **Blank lines:** leave one after every `</summary>` (see `github-rendering.md`).

## Interactive resume

- **Timeline:** ask for the career history (roles, orgs, years), or read it from a résumé the user provides. The Mermaid timeline takes `YEAR : event` lines, and extra events in the same year go on the next line starting with `:`.
- **Mindmap:** group skills into 3–5 branches (Languages, Frameworks, Data, Cloud and DevOps, AI). Keep node text free of `()[]{}:&`.
- **Open section:** leave About open with `<details open>` so the profile isn't a wall of closed boxes.

## World map

GitHub renders a ```` ```geojson ```` code block as an interactive map that visitors can drag, zoom and click.

- **Places:** ask where the person studied, worked and lives, with years. Use city-level coordinates only, never a home address.
- **Coordinate order:** GeoJSON uses `[longitude, latitude]`, the opposite of most maps. Getting this backwards puts Lisbon in the Indian Ocean.
- **Pins:** each Point gets `title`, `description` (years and what happened), and simplestyle properties: `marker-color`, `marker-symbol` (Maki icon names like `star`, `college`, `suitcase`, `rocket`) and `marker-size`.
- **Journey line:** add a LineString through the points in time order to show the journey.
- **Validate:** check the JSON before publishing (`python3 -c "import json,sys; json.load(sys.stdin)"`), since one trailing comma turns the map into a plain code block.

## Guestbook

Files to add to the profile repo:

| From this skill | To the profile repo |
|---|---|
| `assets/workflows/guestbook.yml` | `.github/workflows/guestbook.yml` |
| `assets/actions/guestbook.mjs` | `.github/scripts/guestbook.mjs` |

The README needs these markers, which the Action writes between:

```markdown
<!-- GUESTBOOK:START -->
_No signatures yet. Be the first!_
<!-- GUESTBOOK:END -->
```

The sign link opens an issue titled `guestbook: <message>`:

```
https://github.com/USER/USER/issues/new?title=guestbook%3A+Your+message+here&body=Replace+%22Your+message+here%22+in+the+title+with+your+note%2C+then+click+Create.+A+bot+adds+it+to+the+profile+and+closes+this+issue.
```

What the script does:
- **Cleans the message:** strips links, markdown and HTML, and caps it at 100 characters.
- **Keeps the newest 15 entries.**
- **Replies and closes:** comments a thank-you and closes the issue.

The issue title reaches the script only through an environment variable, so a visitor can't inject shell commands.

## Poll

Files to add to the profile repo:

| From this skill | To the profile repo |
|---|---|
| `assets/workflows/poll.yml` | `.github/workflows/poll.yml` |
| `assets/actions/poll.mjs` | `.github/scripts/poll.mjs` |
| `assets/actions/poll.example.json` (edited) | `.github/poll.json` |

1. **Write `poll.json`:** fill in the question, and give each option a short lowercase `id` (used in the vote link) and a `label` (shown in the results).
2. **Add one vote badge per option:** each links to `issues/new?title=vote%3A+<id>&body=...`.
3. **Draw the initial results:** put `<!-- POLL:START -->` / `<!-- POLL:END -->` in the README, then run `node .github/scripts/poll.mjs --render` once from the repo root.

The script allows one vote per GitHub account (voters are stored lowercase in `poll.json`). It ignores unknown option ids and redraws a bar table with percentages.

## Republishing without losing data

When you update an interactive profile later:
- **Guestbook and poll content:** copy everything between the `GUESTBOOK` / `POLL` markers from the current README into the new one, or visitors' entries disappear.
- **`.github/poll.json`:** never overwrite it. It holds the votes. Change the options only if the user asks, and keep the votes for options that remain.

## Things to tell the user

- **Spam:** anyone with a GitHub account can sign or vote. The owner can delete a line from the README, and the issues stay visible in the repo's closed issues as an audit trail.
- **Actions must be enabled:** they're on by default for new repos, but check under Settings → Actions.
- **First run:** after publishing, open one test issue (`guestbook: testing!`) to confirm the workflow runs. Then delete the entry if they like.

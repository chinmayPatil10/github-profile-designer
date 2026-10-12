---
name: github-profile-designer
description: Design, write and publish a GitHub profile README (the username/username repo shown at the top of github.com/username), choosing from 12 designs including interactive ones like a choose-your-adventure profile, an expandable resume with Mermaid timelines, a visitor guestbook and a visitor poll powered by GitHub Actions. Use this whenever someone wants to beautify, redesign, create, spice up or fix their GitHub (or GitLab) profile, profile README, or "about me" page on GitHub, asks for profile badges, stats cards, typing animations or a contribution snake, or wants their profile to be interactive, even if they don't say "README".
---

# GitHub Profile Designer

Turn someone's GitHub account into a profile README that looks good, says something true and specific about them, and actually renders on GitHub.

The work has three parts, and all three matter. **Content** is learning who the person is and writing it well. **Design** is picking a look that fits them. **Verification** is proving every image and section renders before calling it done. A beautiful layout full of broken badges or vague adjectives is a failure.

## Workflow

### 1. Gather what's true about the person

Run the fetch script to get the public facts:

```bash
node <skill-dir>/scripts/fetch_profile.mjs <username>
```

It prints a JSON draft with name, bio, location, links, languages, ranked candidate repos (forks skipped), and whether the `username/username` profile repo already exists. If the account isn't found, tell the user. GitHub usernames are case-insensitive, but typos are common, and the account may be on GitLab instead.

Then fill the gaps. Ask the user for what GitHub can't tell you:
- **Tagline and role:** offer 3–4 options if they're unsure.
- **About:** a few concrete facts, ideally with numbers.
- **Current focus:** what they're building or learning now.
- **Contact:** which links to show.

If they share a résumé or a portfolio, mine it for skills, experience and project descriptions. Never publish a phone number or street address, even if a résumé has one. Asking with a form or a question tool beats a long list of questions in prose.

Repo descriptions are often empty or stale. Read a candidate repo's README (`gh api repos/OWNER/REPO/readme --jq .content | base64 -d`) before writing a one-liner for it. Leave out repos that are forks, coursework or empty templates unless the user wants them, and say which ones you skipped.

### 2. Pick a design

Read `references/designs.md` for the catalog of 12 designs. There are 8 static ones (classic, terminal, lab-notebook, stats-dashboard, neon, minimal, project-cards, neon-terminal) and 4 interactive ones (adventure, interactive-resume, guestbook, poll). It covers which design fits which kind of person and how to mix them.

Show the options visually if you can, for example as small mockup cards. Recommend one or two based on what you learned. Users often want to combine two designs, which is fine; the catalog explains how.

### 3. Write the README

Open `assets/examples/<design>.md` as the starting structure, then write the real content for this person. The examples are about a fictional "Ada", so replace every name, link, project and username. Use `references/building-blocks.md` for exact URL formats (banners, typing SVG, badges, skill icons, stats cards, snake). The shields.io escaping rules there prevent the most common broken-badge bug.

For interactive designs, read `references/interactive.md`. The guestbook and poll need extra files in the profile repo (a workflow, a script, and for polls a `poll.json`), all in `assets/`.

If something must render a specific way, check `references/github-rendering.md`. GitHub strips `<script>`, `<style>`, `style=""` and event handlers, and markdown inside `<details>` needs a blank line after `</summary>`.

### 4. Check it before showing it off

```bash
node <skill-dir>/scripts/check_readme.mjs README.md
```

This fetches every image and fails on broken ones, including stats cards that return HTTP 200 but draw an error message inside the image. It also catches unbalanced tags, unpaired interactive markers, stripped HTML and leftover placeholders. Fix everything it reports as ✗. A 404 on the snake image is expected until its workflow runs once.

### 5. Publish (with permission)

Publishing makes the content public on the person's profile, so confirm first. Say what will be pushed and that the repo will be public.

- **No profile repo yet:** create it with `gh repo create USER/USER --public --source . --push` from a folder holding the README and any `.github/` files.
- **Profile repo exists:** clone it, replace or edit `README.md`, and commit with a clear message.
  - Keep the content between existing `GUESTBOOK` / `POLL` markers, and keep `.github/poll.json` as is, or visitors' entries and votes are lost.
  - Keep anything else the user wants to keep.
- **No `gh` or no shell:** hand the user the finished README and the files, plus steps: create a public repo named exactly their username, then add the files.
- **GitLab:** same idea. Create a public project named exactly the username and put `README.md` at its root. Skip Actions-based features.

After pushing, look at the live profile in a browser if you can, or at least re-run the checker against the pushed file. Check the workflow runs too (`gh run list -R USER/USER`). For interactive designs, offer to open a test issue so the user sees it work. Image changes can take a few minutes to show because GitHub caches images, so don't keep "fixing" something that's just cached.

### 6. Hand off

Tell the user:
- **The link:** their profile URL.
- **What changed:** what you built and anything you left out on purpose.
- **What's dynamic:** anything that updates itself (snake nightly, stats cards live, guestbook and poll on each issue).
- **How to edit later:** for example, how to change the typing lines.

Offer one or two sensible next steps, such as pinning their best repos or filling in the empty bio field.

## Files in this skill

| Path | What it's for |
|---|---|
| `scripts/fetch_profile.mjs` | Draft profile from public GitHub data (zero dependencies, Node 18+) |
| `scripts/check_readme.mjs` | Pre-publish checker for images, tags and markers |
| `references/designs.md` | Design catalog, how to choose, how to mix, content writing tips |
| `references/building-blocks.md` | URL recipes for every image service |
| `references/github-rendering.md` | What GitHub renders and strips |
| `references/interactive.md` | Setup for adventure, interactive resume, guestbook and poll |
| `assets/examples/*.md` | One full example README per design |
| `assets/workflows/*.yml` | Snake, guestbook and poll GitHub Actions |
| `assets/actions/*` | Guestbook and poll scripts plus an example `poll.json` |

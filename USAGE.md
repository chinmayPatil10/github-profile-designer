# How to use GitHub Profile Designer

Copy-paste commands for installing, using, updating and removing the skill.

## Contents
1. [Install](#1-install)
2. [Make your profile](#2-make-your-profile)
3. [Pick a specific design](#3-pick-a-specific-design)
4. [Example prompts](#4-example-prompts)
5. [Update an existing profile](#5-update-an-existing-profile)
6. [Use the scripts on their own](#6-use-the-scripts-on-their-own)
7. [Update or uninstall](#7-update-or-uninstall)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Install

### Option A: Claude Code plugin (recommended)

From your terminal:

```bash
claude plugin marketplace add chinmayPatil10/github-profile-designer
```

```bash
claude plugin install github-profile-designer@github-profile-designer
```

Or from inside a Claude Code session:

```text
/plugin marketplace add chinmayPatil10/github-profile-designer
/plugin install github-profile-designer@github-profile-designer
```

Check it's installed:

```bash
claude plugin list
```

### Option B: copy the skill folder

```bash
git clone https://github.com/chinmayPatil10/github-profile-designer /tmp/gpd && cp -r /tmp/gpd/skills/github-profile-designer ~/.claude/skills/
```

To install it for one project only, copy it into that project's `.claude/skills/` folder instead.

### Option C: Claude apps (claude.ai, desktop, mobile)

1. Download `github-profile-designer.zip` from the [latest release](https://github.com/chinmayPatil10/github-profile-designer/releases/latest).
2. In Claude, open **Settings → Capabilities → Skills**, click **Upload skill**, and choose the zip.

In the Claude apps, Claude can't push to GitHub for you. It gives you the finished README and tells you where to put it.

### Optional: let Claude publish for you

Publishing uses the [GitHub CLI](https://cli.github.com). Install it and sign in once:

```bash
brew install gh
```

```bash
gh auth login
```

The guestbook, poll and snake designs add GitHub Actions workflows, which need the `workflow` scope:

```bash
gh auth refresh -s workflow
```

---

## 2. Make your profile

Start Claude Code in any folder:

```bash
claude
```

Then ask in plain words:

```text
Make my GitHub profile look great. My username is octocat.
```

Claude will:
1. **Look you up:** fetch your public GitHub info and best repos.
2. **Ask questions:** a short set about what GitHub can't tell it, like your tagline, a few facts about you, what you're working on, and which links to show.
3. **Offer designs:** show you the options and recommend one or two.
4. **Write it:** draft the README and check that every image renders.
5. **Publish:** ask before pushing, then publish to `github.com/<you>/<you>` and confirm it's live.

You can also run the skill directly as a slash command:

```text
/github-profile-designer:github-profile-designer
```

### One-shot from the terminal

```bash
claude "Redesign my GitHub profile in the terminal style. I'm octocat."
```

---

## 3. Pick a specific design

Add a design name after the slash command to skip the menu:

```text
/github-profile-designer:github-profile-designer rpg
```

| Design | Command argument | Vibe |
|---|---|---|
| Clean & professional | `classic` | Polished, recruiter-friendly |
| Terminal | `terminal` | `$ whoami` console sections |
| Lab notebook | `lab-notebook` | Projects as experiments |
| Stats dashboard | `stats-dashboard` | Live stats, streak, contribution chart |
| Animated neon | `neon` | Typing header, skill icons, snake |
| Minimal editorial | `minimal` | Text only |
| Project cards | `project-cards` | Repo pin cards |
| Neon terminal | `neon-terminal` | Neon header + terminal sections |
| RPG character sheet | `rpg` | Level, stats, inventory, quest log |
| Changelog | `changelog` | Your career as release notes |
| Code snippet | `code-snippet` | You as a TypeScript object |
| Magazine | `magazine` | Two-column editorial cover |
| Retro 90s homepage | `retro-90s` | Under construction, visitor counter |
| 🕹️ Choose your adventure | `adventure` | Clickable doors to explore |
| 🕹️ Interactive resume | `interactive-resume` | Expandable sections, Mermaid timeline |
| 🕹️ World map | `world-map` | Pan-and-zoom map of where you've been |
| 🕹️ Guestbook | `guestbook` | Visitors sign your profile |
| 🕹️ Poll | `poll` | Visitors vote on what you build next |

See every design in [the examples folder](skills/github-profile-designer/assets/examples).

---

## 4. Example prompts

**Starting from scratch**

```text
I'm chinmayPatil10. Make me a GitHub profile. I'm an AI tinkerer who likes to experiment.
```

```text
Here's my resume (~/Documents/resume.pdf). Use it to build my GitHub profile, recruiter-friendly style.
```

**Picking a vibe**

```text
Turn my GitHub profile into an RPG character sheet. Years of experience = level.
```

```text
Make my profile look like a 90s homepage, with a visitor counter and an under construction banner.
```

```text
Write my career as a changelog: v1.0.0 for my first job, and [Unreleased] for what I'm building now.
```

```text
Show me 6 profile design options as visual mockups before we pick one.
```

**Interactive**

```text
Add a guestbook to my GitHub profile so visitors can leave a message.
```

```text
Add a poll to my profile asking "What should I build next?" with options: an AI agent, a game, a dev tool.
```

```text
Make my profile a choose-your-own-adventure where visitors explore my projects.
```

```text
Add a world map to my profile showing Mumbai (studied, 2015 to 2019), Chicago (master's, 2019 to 2021) and Atlanta (work, 2021 to now).
```

**Mixing designs**

```text
Use the neon header with terminal-style sections below it, and add a guestbook at the end.
```

**GitLab**

```text
Beautify my GitLab profile README. I'll paste it into GitLab myself.
```

---

## 5. Update an existing profile

```text
Add my new project github-profile-designer to my GitHub profile and keep everything else the same.
```

```text
My profile's LinkedIn badge looks broken. Check every image on github.com/octocat and fix what's wrong.
```

```text
Switch my profile from neon to minimal, but keep the guestbook entries.
```

The skill tells Claude to keep existing guestbook entries and poll votes when it redesigns a profile.

---

## 6. Use the scripts on their own

The scripts need Node.js 18+ and have no dependencies. Paths below assume the plugin install. With Option B, use `~/.claude/skills/github-profile-designer/` instead.

```bash
SKILL=~/.claude/plugins/marketplaces/github-profile-designer/skills/github-profile-designer
```

**Draft profile from public GitHub data** (name, links, languages, ranked repos):

```bash
node $SKILL/scripts/fetch_profile.mjs octocat
```

**Check any README before publishing** (broken images, error cards, unbalanced tags):

```bash
node $SKILL/scripts/check_readme.mjs README.md
```

Set `GITHUB_TOKEN` for a higher GitHub API rate limit:

```bash
GITHUB_TOKEN=$(gh auth token) node $SKILL/scripts/fetch_profile.mjs octocat
```

---

## 7. Update or uninstall

Get the latest designs:

```bash
claude plugin marketplace update github-profile-designer
```

```bash
claude plugin update github-profile-designer@github-profile-designer
```

Restart Claude Code afterwards to load the new version.

Turn it off without removing it:

```bash
claude plugin disable github-profile-designer@github-profile-designer
```

Remove it:

```bash
claude plugin uninstall github-profile-designer@github-profile-designer
```

```bash
claude plugin marketplace remove github-profile-designer
```

Uninstalling the skill doesn't touch your published profile.

---

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| Profile README doesn't show on my profile | The repo must be **public** and named exactly like your username, with `README.md` at the root |
| A badge or image still looks broken after a fix | GitHub caches images for a few minutes. Hard-refresh, or open `github.com/<you>?v=2` |
| Stats card says "Something went wrong" | The free stats service is rate-limited or down. Ask Claude to swap it for another card, or try again later |
| Snake image is missing | It appears after the snake workflow runs once. Check with `gh run list -R <you>/<you>` |
| Guestbook or poll doesn't update | Check that Actions are enabled in the repo settings, then run `gh run list -R <you>/<you>` to see the error |
| `gh: workflow scope required` when publishing | `gh auth refresh -s workflow` |
| The skill doesn't kick in | Run it directly with `/github-profile-designer:github-profile-designer`, or check `claude plugin list` |

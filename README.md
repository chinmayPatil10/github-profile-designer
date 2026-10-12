<div align="center">

# 🎨 GitHub Profile Designer

**An agent skill that designs, writes and publishes your GitHub profile README.**

Tell Claude *"make my GitHub profile look great"*. It reads your public GitHub data, asks what it can't find, offers 18 designs (5 of them interactive), writes the README, checks that every image renders, and publishes it to your `username/username` repo once you say yes.

![Skill](https://img.shields.io/badge/Agent-Skill-7C4DFF?style=flat-square)
![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-D85A30?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-00E5FF?style=flat-square)

</div>

## 🖼️ Designs

**Static**

| Design | Vibe | Example |
|---|---|---|
| Clean & professional | Polished, recruiter-friendly | [view](skills/github-profile-designer/assets/examples/classic.md) |
| Terminal | `$ whoami` console sections | [view](skills/github-profile-designer/assets/examples/terminal.md) |
| Lab notebook | Projects as EXP-001, EXP-002… | [view](skills/github-profile-designer/assets/examples/lab-notebook.md) |
| Stats dashboard | Live stats, streak, contribution chart | [view](skills/github-profile-designer/assets/examples/stats-dashboard.md) |
| Animated neon | Typing header, skill icons, contribution snake 🐍 | [view](skills/github-profile-designer/assets/examples/neon.md) |
| Minimal editorial | Text only, calm | [view](skills/github-profile-designer/assets/examples/minimal.md) |
| Project cards | Repo pin cards in a grid | [view](skills/github-profile-designer/assets/examples/project-cards.md) |
| Neon terminal | Neon header plus terminal sections | [view](skills/github-profile-designer/assets/examples/neon-terminal.md) |
| RPG character sheet | Level, HP/XP bars, inventory, quest log, achievements | [view](skills/github-profile-designer/assets/examples/rpg.md) |
| Changelog | Your career as release notes, `[Unreleased]` to `v1.0.0` | [view](skills/github-profile-designer/assets/examples/changelog.md) |
| Code snippet | You, as a TypeScript object | [view](skills/github-profile-designer/assets/examples/code-snippet.md) |
| Magazine | Two-column editorial cover story | [view](skills/github-profile-designer/assets/examples/magazine.md) |
| Retro 90s homepage | Under construction, visitor counter, best viewed in Netscape | [view](skills/github-profile-designer/assets/examples/retro-90s.md) |

**🕹️ Interactive**

| Design | What visitors do | Example |
|---|---|---|
| Choose your adventure | Open "doors" to explore your workshop, library, journal and a secret room | [try it](skills/github-profile-designer/assets/examples/adventure.md) |
| Interactive resume | Expand sections, see a Mermaid career timeline and skills mindmap | [try it](skills/github-profile-designer/assets/examples/interactive-resume.md) |
| World map | Drag, zoom and click pins on a map of where you've studied and worked | [try it](skills/github-profile-designer/assets/examples/world-map.md) |
| Guestbook | Sign your profile. A GitHub Action adds their message within a minute | [view](skills/github-profile-designer/assets/examples/guestbook.md) |
| Poll | Vote on what you build next. An Action counts the votes and redraws the bars | [view](skills/github-profile-designer/assets/examples/poll.md) |

GitHub never runs JavaScript in a README, so the interactive designs use what GitHub *does* allow:
- **Collapsible sections:** `<details>` lets visitors choose what to open.
- **Rendered blocks:** Mermaid code blocks become timelines and mindmaps, and GeoJSON blocks become interactive maps.
- **Issue-driven Actions:** a link opens a pre-filled issue, and a workflow updates the README and closes the issue.

## 🚀 Quick start

```bash
claude plugin marketplace add chinmayPatil10/github-profile-designer
```

```bash
claude plugin install github-profile-designer@github-profile-designer
```

Then, in Claude Code:

```text
Make my GitHub profile look great. My username is octocat.
```

Or go straight to a design:

```text
/github-profile-designer:github-profile-designer rpg
```

**📖 [Full usage guide](USAGE.md)** covers installing in the Claude apps, every design's command, example prompts, standalone scripts, updating and troubleshooting.

## 🧰 What's inside

```
skills/github-profile-designer/
├── SKILL.md                     workflow: gather → design → write → check → publish
├── scripts/
│   ├── fetch_profile.mjs        draft profile from public GitHub data
│   └── check_readme.mjs         fetches every image, catches broken badges and error cards
├── references/                  design catalog, URL recipes, GitHub rendering rules, interactive setup
└── assets/
    ├── examples/                one full README per design
    ├── workflows/               snake, guestbook and poll GitHub Actions
    └── actions/                 guestbook and poll scripts (zero dependencies)
```

The scripts need Node.js 18+. Publishing uses the [GitHub CLI](https://cli.github.com) if you have it, and otherwise Claude hands you the files to add yourself.

## 🛠️ Develop

```bash
npm test                # guestbook and poll logic, end-to-end action runs, example structure
npm run check-examples  # fetch every image in every example
```

To add a design, write `assets/examples/<id>.md`, add a row to `references/designs.md`, and run both commands above. PRs with new designs are welcome!

## 🙏 Built on

[capsule-render](https://github.com/kyechan99/capsule-render) · [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg) · [skillicons.dev](https://skillicons.dev) · [shields.io](https://shields.io) · [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) · [streak-stats](https://github.com/DenverCoder1/github-readme-streak-stats) · [ghchart](https://github.com/2016rshah/githubchart-api) · [komarev](https://github.com/antonkomarev/github-profile-views-counter) · [Platane/snk](https://github.com/Platane/snk)

## 📄 License

MIT © Chinmay Patil

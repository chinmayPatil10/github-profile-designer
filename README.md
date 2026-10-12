<div align="center">

# 🎨 GitHub Profile Designer MCP

**Pick a design, and your AI assistant builds and publishes your GitHub profile README.**

An [MCP](https://modelcontextprotocol.io) server that reads your public GitHub data, offers 8 profile README designs, renders your README, and can publish it to your `username/username` repo.

![MCP](https://img.shields.io/badge/MCP-server-7C4DFF?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-00E5FF?style=flat-square)

</div>

## ✨ How it works

Just ask your assistant:

> *"Design my GitHub profile. My username is octocat."*

1. **`fetch_github_profile`** pulls your name, bio, links, languages and best repos into a draft profile.
2. The assistant asks for whatever's missing: tagline, role, a few facts about you, and what you're working on now.
3. **`list_designs`** shows the designs, and you pick one.
4. **`generate_readme`** renders it so you can review it.
5. **`publish_profile_readme`** commits it to `username/username` once you confirm, creating the repo if needed.

## 🖼️ Designs

| Design | Vibe | Highlights | Example |
|---|---|---|---|
| `classic` | Polished, recruiter-friendly | Wave banner, tech badges, projects table | [view](examples/classic.md) |
| `terminal` | Hacker, monospace | `$ whoami`, `ls ./projects`, `tail -f now.log` sections | [view](examples/terminal.md) |
| `lab-notebook` | Curious experimenter | Projects as EXP-001, EXP-002… with hypothesis and status | [view](examples/lab-notebook.md) |
| `stats-dashboard` | Data-driven | Live stats cards, streak, contribution graph | [view](examples/stats-dashboard.md) |
| `neon` | Flashy, animated | Typing header, skill icons, contribution snake 🐍 | [view](examples/neon.md) |
| `minimal` | Calm, writerly | Text only, no images | [view](examples/minimal.md) |
| `project-cards` | Portfolio-first | Repo pin cards in a grid | [view](examples/project-cards.md) |
| `neon-terminal` | Flashy hacker | Neon animated header plus terminal sections | [view](examples/neon-terminal.md) |

The `neon` and `neon-terminal` designs also add `.github/workflows/snake.yml`, a GitHub Action that redraws the contribution snake every night.

## 🚀 Install

You need Node.js 18 or later.

### Claude Code

```bash
claude mcp add profile-designer -e GITHUB_TOKEN=ghp_yourtoken -- npx -y github:chinmayPatil10/github-profile-designer-mcp
```

### Claude Desktop, Cursor and other MCP clients

Add this to your MCP config (for Claude Desktop, `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "profile-designer": {
      "command": "npx",
      "args": ["-y", "github:chinmayPatil10/github-profile-designer-mcp"],
      "env": { "GITHUB_TOKEN": "ghp_yourtoken" }
    }
  }
}
```

### 🔑 About the token

`GITHUB_TOKEN` is **optional**.

- **Without it:** you can still browse designs, fetch profiles and generate READMEs, then paste the result into your profile repo yourself.
- **With it:** `publish_profile_readme` can commit for you. Use a [classic token](https://github.com/settings/tokens) with the `repo` and `workflow` scopes. `workflow` is only needed for the snake designs.

The server only publishes to the token owner's own `username/username` repo.

## 🧰 Tools

| Tool | What it does | Writes? |
|---|---|---|
| `list_designs` | Lists the designs with their vibe and features | No |
| `fetch_github_profile` | Builds a draft profile from public GitHub data | No |
| `generate_readme` | Renders the README plus any extra files | No |
| `publish_profile_readme` | Commits the files to `username/username`. Supports `dry_run` | **Yes** |

There's also a **`design_my_profile`** prompt that walks through the whole flow.

## 🛠️ Develop

```bash
npm install
npm test           # design rendering + end-to-end MCP tests
npm run examples   # regenerate examples/*.md
npm run dev        # run the server from source
```

### Adding a design

Add a `Design` object to [`src/designs.ts`](src/designs.ts): an `id`, `name`, `vibe`, `features` and a `render(profile)` function that returns `{ readme, extraFiles }`. Reusable pieces (badges, skill icons, banners, stats cards, snake) live in [`src/blocks.ts`](src/blocks.ts). Then add the new id to the `DESIGNS` array, and run `npm test` and `npm run examples`.

Pull requests with new designs are welcome!

## 🙏 Built on

[capsule-render](https://github.com/kyechan99/capsule-render) · [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg) · [skillicons.dev](https://skillicons.dev) · [shields.io](https://shields.io) · [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) · [streak-stats](https://github.com/DenverCoder1/github-readme-streak-stats) · [activity graph](https://github.com/Ashutosh00710/github-readme-activity-graph) · [Platane/snk](https://github.com/Platane/snk)

## 📄 License

MIT © Chinmay Patil

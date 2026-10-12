# Building blocks

URL recipes for the image services profile READMEs use. All of them return SVG or PNG and work through GitHub's image proxy. Replace `USER` with the GitHub username.

## Contents
- Banners (capsule-render)
- Typing header (readme-typing-svg)
- Badges (shields.io)
- Skill icons (skillicons.dev)
- Stats cards (github-readme-stats, streak, contribution chart)
- Visitor counter
- Contribution snake
- Pre-filled issue links (for interactive designs)

## Banners: capsule-render

```html
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6E40C9,100:2F81F7&height=120&section=header" alt="header" width="100%" />
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2F81F7,100:6E40C9&height=100&section=footer" alt="footer" width="100%" />
```

- `color=0:HEX,50:HEX,100:HEX` makes a gradient (no `#`). `type`: `waving`, `wave`, `rect`, `soft`, `slice`, `egg`, `shark`, `cylinder`, `venom`.
- **Don't put the name in the banner** with `&text=`. The text fades in with a CSS animation, and in some renderers (screenshots, some browsers and email previews) it shows up blank. Put the name in a markdown `#` heading below the banner instead.

## Typing header: readme-typing-svg

```html
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=2800&pause=900&color=B388FF&center=true&vCenter=true&width=640&lines=Hi%2C+I'm+Ada;Curious+%C2%B7+Builder;I+make+developer+tools" alt="Typing intro" />
```

- **Encoding:** lines are separated by `;` and spaces become `+`. URL-encode everything else (`,` → `%2C`, `·` → `%C2%B7`, emoji are UTF-8 percent-encoded).
- **Length:** keep each line under about 40 characters at size 28 with width 640, or it gets clipped.

## Badges: shields.io

```markdown
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/HANDLE)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
```

- **Path:** `/badge/LABEL-MESSAGE-COLOR` or `/badge/MESSAGE-COLOR`. Inside the label or message, a literal `-` must be written `--`, `_` must be written `__`, and a space is `%20` or `_`.
- **Common bug:** a LinkedIn slug ending in `-` (like `chinmay-patil-`) breaks parsing and renders a single green "LINKEDIN" badge. Use a fixed message like `Connect` and put the real URL in the link.
- **Styles:** `flat`, `flat-square`, `for-the-badge`, `plastic`. Add `&labelColor=HEX` for two-tone badges on dark designs.
- **Logos:** use Simple Icons slugs, e.g. `nodedotjs`, `nextdotjs`, `googlecloud`, `amazonwebservices`, `postgresql`, `googlegemini`, `langchain`, `apachekafka`.

## Skill icons: skillicons.dev

```html
<img src="https://skillicons.dev/icons?i=ts,py,nodejs,react,nextjs,postgres,docker,aws&perline=12&theme=dark" alt="Skills" />
```

- **Common ids:** `js ts py java kotlin swift go rust ruby php cpp c cs dart html css sass tailwind nodejs deno bun nestjs express react nextjs angular vue nuxtjs svelte astro vite django flask fastapi spring rails laravel dotnet flutter graphql gcp aws azure terraform docker kubernetes postgres mysql mongodb redis sqlite firebase supabase kafka git github gitlab githubactions jira confluence figma linux bash vercel netlify prisma tensorflow pytorch opencv nginx threejs electron vscode jest cloudflare`.
- **Not covered:** LLMs, LangChain, gRPC and BigQuery have no icon. Use shields badges for those.
- **Rows:** use two `<img>` tags with 12 icons each instead of one long row.

## Stats cards

```html
<img height="165" src="https://github-readme-stats.vercel.app/api?username=USER&show_icons=true&theme=tokyonight&hide_border=true" alt="GitHub stats" />
<img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=USER&layout=compact&theme=tokyonight&hide_border=true" alt="Top languages" />
<img src="https://streak-stats.demolab.com?user=USER&theme=tokyonight&hide_border=true" alt="Streak" />
<img src="https://ghchart.rshah.org/7C4DFF/USER" alt="Contribution chart" width="100%" />
<a href="https://github.com/USER/REPO"><img src="https://github-readme-stats.vercel.app/api/pin/?username=USER&repo=REPO&theme=github_dark&hide_border=true" alt="REPO" /></a>
```

- **Service outages:** these are free community services. They go down and get rate-limited, and the old `github-readme-activity-graph.vercel.app` now returns HTTP 402. Always run `scripts/check_readme.mjs`, which reads the SVG text to catch "Something went wrong" cards that still return HTTP 200.
- **Pin cards:** they only work for repos the user owns (or public repos by `owner/repo`).
- **Themes:** `tokyonight`, `radical`, `dracula`, `github_dark`, `default`, `transparent`, `catppuccin_mocha`.

## Visitor counter

```markdown
![Profile views](https://komarev.com/ghpvc/?username=USER&style=for-the-badge&color=7C4DFF&label=VISITORS)
```

## Contribution snake

This needs `assets/workflows/snake.yml` in the profile repo at `.github/workflows/snake.yml`. The workflow writes the SVGs to an `output` branch.

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/USER/USER/output/github-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/USER/USER/output/github-snake.svg" />
  <img alt="Contribution snake" src="https://raw.githubusercontent.com/USER/USER/output/github-snake-dark.svg" />
</picture>
```

The images return 404 until the workflow has run once. It runs on push, so it fixes itself a minute after publishing. Recolor it by editing `color_snake` and `color_dots` in the workflow.

## Pre-filled issue links

`https://github.com/USER/USER/issues/new?title=URL_ENCODED_TITLE&body=URL_ENCODED_BODY`

Wrap the link in a badge so it looks like a button:

```markdown
[![Sign the guestbook](https://img.shields.io/badge/✍️_Sign_the_guestbook-D85A30?style=for-the-badge)](https://github.com/USER/USER/issues/new?title=guestbook%3A+Your+message+here&body=...)
```

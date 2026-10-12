import type { Profile, Project } from "./profile.js";

/** Reusable markdown building blocks shared by the designs. */

const SKILL_ICON_IDS: Record<string, string> = {
  javascript: "js", js: "js", typescript: "ts", ts: "ts", python: "py", py: "py", java: "java", kotlin: "kotlin",
  swift: "swift", go: "go", golang: "go", rust: "rust", ruby: "ruby", php: "php", "c++": "cpp", cpp: "cpp", c: "c",
  "c#": "cs", csharp: "cs", dart: "dart", scala: "scala", elixir: "elixir", haskell: "haskell", lua: "lua", r: "r",
  html: "html", html5: "html", css: "css", css3: "css", sass: "sass", scss: "sass", tailwind: "tailwind",
  tailwindcss: "tailwind", bootstrap: "bootstrap", "node.js": "nodejs", nodejs: "nodejs", node: "nodejs",
  deno: "deno", bun: "bun", nestjs: "nestjs", "nest.js": "nestjs", express: "express", "express.js": "express",
  react: "react", "react native": "react", "next.js": "nextjs", nextjs: "nextjs", angular: "angular", vue: "vue",
  "vue.js": "vue", nuxt: "nuxtjs", svelte: "svelte", solid: "solidjs", astro: "astro", vite: "vite",
  django: "django", flask: "flask", fastapi: "fastapi", spring: "spring", rails: "rails", laravel: "laravel",
  ".net": "dotnet", dotnet: "dotnet", flutter: "flutter", graphql: "graphql", gcp: "gcp",
  "google cloud": "gcp", "google cloud platform (gcp)": "gcp", aws: "aws", "amazon web services (aws)": "aws",
  azure: "azure", terraform: "terraform", docker: "docker", kubernetes: "kubernetes", k8s: "kubernetes",
  postgresql: "postgres", postgres: "postgres", mysql: "mysql", mongodb: "mongodb", redis: "redis",
  sqlite: "sqlite", firebase: "firebase", firestore: "firebase", supabase: "supabase", kafka: "kafka",
  git: "git", github: "github", gitlab: "gitlab", "github actions": "githubactions", jira: "jira",
  confluence: "confluence", figma: "figma", linux: "linux", bash: "bash", vercel: "vercel", netlify: "netlify",
  prisma: "prisma", tensorflow: "tensorflow", pytorch: "pytorch", opencv: "opencv", nginx: "nginx",
  "three.js": "threejs", threejs: "threejs", electron: "electron", vim: "vim", neovim: "neovim",
  "vs code": "vscode", vscode: "vscode", webpack: "webpack", jest: "jest", cloudflare: "cloudflare",
};

export function splitSkills(skills: string[]): { iconIds: string[]; other: string[] } {
  const iconIds: string[] = [];
  const other: string[] = [];
  for (const s of skills) {
    const id = SKILL_ICON_IDS[s.trim().toLowerCase()];
    if (id) {
      if (!iconIds.includes(id)) iconIds.push(id);
    } else other.push(s.trim());
  }
  return { iconIds, other };
}

export function skillIcons(skills: string[], theme: "dark" | "light" = "dark", perLine = 12): string {
  const { iconIds, other } = splitSkills(skills);
  const rows: string[] = [];
  for (let i = 0; i < iconIds.length; i += perLine) {
    rows.push(
      `<img src="https://skillicons.dev/icons?i=${iconIds.slice(i, i + perLine).join(",")}&perline=${perLine}&theme=${theme}" alt="Skills" />`,
    );
  }
  const extra = other.map((s) => shieldBadge(s, "555555", "flat-square")).join("\n");
  return [rows.join("\n<br/>\n"), extra].filter(Boolean).join("\n\n");
}

function shieldEscape(s: string): string {
  return encodeURIComponent(s.replace(/-/g, "--").replace(/_/g, "__"));
}

export function shieldBadge(label: string, color: string, style = "flat-square", logo?: string): string {
  const logoPart = logo ? `&logo=${encodeURIComponent(logo)}&logoColor=white` : "";
  return `![${label}](https://img.shields.io/badge/${shieldEscape(label)}-${color}?style=${style}${logoPart})`;
}

export function skillBadges(skills: string[], color: string, style = "flat-square"): string {
  return skills.map((s) => shieldBadge(s, color, style)).join("\n");
}

export function linkBadges(p: Profile, opts: { style?: string; labelColor?: string } = {}): string {
  const style = opts.style ?? "for-the-badge";
  const lc = opts.labelColor ? `&labelColor=${opts.labelColor}` : "";
  const out: string[] = [];
  const { links } = p;
  if (links.linkedin)
    out.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=${style}&logo=linkedin&logoColor=white${lc})](${links.linkedin})`);
  if (links.email)
    out.push(`[![Email](https://img.shields.io/badge/Email-Say%20hi-EA4335?style=${style}&logo=gmail&logoColor=white${lc})](mailto:${links.email})`);
  if (links.website)
    out.push(`[![Website](https://img.shields.io/badge/Website-Visit-111111?style=${style}&logo=googlechrome&logoColor=white${lc})](${links.website})`);
  if (links.twitter)
    out.push(`[![X](https://img.shields.io/badge/X-@${shieldEscape(links.twitter)}-000000?style=${style}&logo=x&logoColor=white${lc})](https://x.com/${links.twitter})`);
  return out.join("\n");
}

export function textLinks(p: Profile, sep = " · "): string {
  const { links } = p;
  const out: string[] = [];
  if (links.linkedin) out.push(`[LinkedIn](${links.linkedin})`);
  if (links.email) out.push(`[Email](mailto:${links.email})`);
  if (links.website) out.push(`[Website](${links.website})`);
  if (links.twitter) out.push(`[X](https://x.com/${links.twitter})`);
  out.push(`[GitHub](https://github.com/${p.username})`);
  return out.join(sep);
}

export function waveBanner(colors: string, section: "header" | "footer", height: number): string {
  return `<img src="https://capsule-render.vercel.app/api?type=waving&color=${colors}&height=${height}&section=${section}" alt="${section}" width="100%" />`;
}

export function typingSvg(lines: string[], color: string, size = 28): string {
  const enc = lines.map((l) => encodeURIComponent(l).replace(/%20/g, "+")).join(";");
  return `<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=${size}&duration=2800&pause=900&color=${color}&center=true&vCenter=true&width=640&lines=${enc}" alt="Typing intro" />`;
}

export function defaultTypingLines(p: Profile): string[] {
  if (p.typingLines.length) return p.typingLines;
  return [`Hi, I'm ${p.name}`, p.tagline, p.role].filter(Boolean);
}

export function projectLink(pr: Project): string {
  return pr.url ? `[${pr.name}](${pr.url})` : pr.name;
}

export function projectsTable(projects: Project[], icon = ""): string {
  if (!projects.length) return "";
  const rows = projects.map(
    (pr) =>
      `| ${icon}**${projectLink(pr)}** | ${pr.description || "-"} | ${pr.stack.length ? pr.stack.join(" · ") : "-"} |`,
  );
  return ["| Project | What it does | Built with |", "|---|---|---|", ...rows].join("\n");
}

export function bullets(items: string[], prefix = "- "): string {
  return items.map((i) => `${prefix}${i}`).join("\n");
}

export function pinCard(username: string, repo: string, theme: string): string {
  return `<a href="https://github.com/${username}/${repo}"><img src="https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${repo}&theme=${theme}&hide_border=true" alt="${repo}" /></a>`;
}

export function statsCards(username: string, theme: string): string {
  return [
    `<img height="165" src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=true&include_all_commits=true&count_private=true" alt="GitHub stats" />`,
    `<img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=true&langs_count=8" alt="Top languages" />`,
  ].join("\n");
}

export function streakCard(username: string, theme: string): string {
  return `<img src="https://streak-stats.demolab.com?user=${username}&theme=${theme}&hide_border=true" alt="Streak" />`;
}

export function activityGraph(username: string, theme: string): string {
  return `<img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${theme}&hide_border=true&area=true" alt="Contribution graph" width="100%" />`;
}

export function visitorBadge(username: string, color: string): string {
  return `![Profile views](https://komarev.com/ghpvc/?username=${username}&style=for-the-badge&color=${color}&label=VISITORS)`;
}

export function snakePicture(username: string): string {
  const base = `https://raw.githubusercontent.com/${username}/${username}/output`;
  return `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="${base}/github-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="${base}/github-snake.svg" />
  <img alt="Contribution snake" src="${base}/github-snake-dark.svg" />
</picture>`;
}

export function snakeWorkflow(snakeColor: string, dots: string): string {
  return `name: Generate contribution snake

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Generate snake SVGs
        uses: Platane/snk@v3
        with:
          github_user_name: \${{ github.repository_owner }}
          outputs: |
            dist/github-snake.svg
            dist/github-snake-dark.svg?palette=github-dark&color_snake=${snakeColor}&color_dots=${dots}

      - name: Push to output branch
        uses: crazy-max/ghaction-github-pages@v4
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;
}

/** Pads a string to a column width for aligned console output. */
export function pad(s: string, width: number): string {
  return s.length >= width ? `${s} ` : s + " ".repeat(width - s.length);
}

export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function compact(parts: (string | false | undefined | null)[]): string {
  return parts.filter((x): x is string => typeof x === "string" && x.trim().length > 0).join("\n\n") + "\n";
}

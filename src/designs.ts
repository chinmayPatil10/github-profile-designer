import type { Profile } from "./profile.js";
import type { PublishFile } from "./github.js";
import * as b from "./blocks.js";

export interface Design {
  id: string;
  name: string;
  description: string;
  vibe: string;
  features: string[];
  render(p: Profile): { readme: string; extraFiles: PublishFile[] };
}

const SNAKE_PATH = ".github/workflows/snake.yml";

function heading(text: string, terminal = false): string {
  return terminal ? `### \`$ ${text}\`` : `## ${text}`;
}

const classic: Design = {
  id: "classic",
  name: "Clean & professional",
  description: "Gradient wave banner, short bio, colored tech badges, a projects table and contact badges.",
  vibe: "Polished, recruiter-friendly",
  features: ["wave banner", "shields.io tech badges", "projects table", "contact badges"],
  render(p) {
    const readme = b.compact([
      `<div align="center">`,
      b.waveBanner("0:6E40C9,100:2F81F7", "header", 120),
      `# ${p.name}`,
      p.tagline && `**${p.tagline}**`,
      p.role && `### ${p.role}`,
      b.linkBadges(p),
      `</div>`,
      `---`,
      p.about.length > 0 && `${heading("👋 About me")}\n\n${b.bullets(p.about)}${p.location ? `\n- 📍 ${p.location}` : ""}`,
      p.skills.length > 0 && `${heading("🧰 Tech stack")}\n\n${b.skillBadges(p.skills, "2F81F7")}`,
      p.projects.length > 0 && `${heading("🚀 Featured projects")}\n\n${b.projectsTable(p.projects)}`,
      p.now.length > 0 && `${heading("🧭 Currently")}\n\n${b.bullets(p.now)}`,
      `<div align="center">`,
      b.waveBanner("0:2F81F7,100:6E40C9", "footer", 100),
      `</div>`,
    ]);
    return { readme, extraFiles: [] };
  },
};

const terminal: Design = {
  id: "terminal",
  name: "Terminal",
  description: "Every section is a shell command with console output: whoami, cat stack.txt, ls ./projects, tail -f now.log.",
  vibe: "Hacker, monospace, nerdy",
  features: ["console code blocks", "skill icons", "projects table", "minimal color"],
  render(p) {
    const host = `${p.username.toLowerCase()}@github:~$`;
    const whoami = [
      `${host} whoami`,
      [p.name, p.role, p.location].filter(Boolean).join(" · "),
      ...(p.about.length ? ["", `${host} cat about.txt`, ...p.about.map((a) => `> ${a}`)] : []),
    ].join("\n");
    const w = Math.max(12, ...p.projects.map((x) => b.slug(x.name).length + 3));
    const ls = [
      `${host} ls -l ./projects`,
      ...p.projects.map((x) => `drwxr-xr-x  ${b.pad(b.slug(x.name) + "/", w)}${x.description}`),
    ].join("\n");
    const now = p.now.map((n) => `[running]  ${n}`).join("\n");
    const readme = b.compact([
      "```console",
      `${host} echo $TAGLINE`,
      `${p.tagline || p.name}`,
      "```",
      b.linkBadges(p, { style: "flat-square", labelColor: "0d1117" }),
      `${heading("whoami", true)}\n\n\`\`\`console\n${whoami}\n\`\`\``,
      p.skills.length > 0 && `${heading("cat stack.txt", true)}\n\n${b.skillIcons(p.skills)}`,
      p.projects.length > 0 &&
        `${heading("ls ./projects", true)}\n\n\`\`\`console\n${ls}\n\`\`\`\n\n${b.projectsTable(p.projects)}`,
      p.now.length > 0 && `${heading("tail -f now.log", true)}\n\n\`\`\`console\n${now}\n\`\`\``,
      `\`\`\`console\n${host} exit\nlogout — thanks for stopping by.\n\`\`\``,
    ]);
    return { readme, extraFiles: [] };
  },
};

const labNotebook: Design = {
  id: "lab-notebook",
  name: "Lab notebook",
  description: "Projects written up as numbered experiments (EXP-001...) with hypothesis, stack and status.",
  vibe: "Curious experimenter, playful",
  features: ["experiment log entries", "status labels", "skill badges", "notebook-style sections"],
  render(p) {
    const entries = p.projects
      .map((x, i) => {
        const id = `EXP-${String(i + 1).padStart(3, "0")}`;
        return [
          `#### 🧪 ${id} · ${b.projectLink(x)}`,
          `> **Hypothesis:** ${x.description || "It might just work."}  `,
          x.stack.length ? `> **Apparatus:** ${x.stack.join(", ")}  ` : "",
          `> **Status:** ✅ shipped`,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");
    const running = p.now.map((n, i) => {
      const id = `EXP-${String(p.projects.length + i + 1).padStart(3, "0")}`;
      return `- ⚗️ **${id}**: ${n} *(in progress)*`;
    });
    const readme = b.compact([
      `# 📓 Lab notebook of ${p.name}`,
      p.tagline && `*${p.tagline}*`,
      p.role && `**Researcher role:** ${p.role}${p.location ? ` · **Lab location:** ${p.location}` : ""}`,
      b.linkBadges(p, { style: "flat-square" }),
      `---`,
      p.about.length > 0 && `## 🔬 Field notes\n\n${b.bullets(p.about)}`,
      p.skills.length > 0 && `## 🧰 Equipment\n\n${b.skillBadges(p.skills, "534AB7")}`,
      entries && `## 📋 Experiment log\n\n${entries}`,
      running.length > 0 && `## ⏳ Currently running\n\n${running.join("\n")}`,
      `---`,
      `<sub>📝 Notebook auto-updated · Got an idea worth testing? Open an issue or get in touch.</sub>`,
    ]);
    return { readme, extraFiles: [] };
  },
};

const statsDashboard: Design = {
  id: "stats-dashboard",
  name: "Stats dashboard",
  description: "Live GitHub stats cards, top languages, streak counter and contribution graph that update on their own.",
  vibe: "Data-driven, active contributor",
  features: ["github-readme-stats cards", "streak stats", "activity graph", "skill icons"],
  render(p) {
    const theme = "tokyonight";
    const readme = b.compact([
      `<div align="center">`,
      `# ${p.name}`,
      [p.tagline, p.role].filter(Boolean).join(" · ") && `**${[p.tagline, p.role].filter(Boolean).join(" · ")}**`,
      b.linkBadges(p),
      `</div>`,
      p.about.length > 0 && `## 👋 About\n\n${b.bullets(p.about)}`,
      p.skills.length > 0 && `## 🧰 Tech stack\n\n<div align="center">\n\n${b.skillIcons(p.skills)}\n\n</div>`,
      `## 📊 GitHub stats\n\n<div align="center">\n\n${b.statsCards(p.username, theme)}\n\n${b.streakCard(p.username, theme)}\n\n</div>`,
      `## 📈 Contribution graph\n\n${b.activityGraph(p.username, "tokyo-night")}`,
      p.projects.length > 0 && `## 🚀 Featured projects\n\n${b.projectsTable(p.projects)}`,
      p.now.length > 0 && `## 🧭 Currently\n\n${b.bullets(p.now)}`,
    ]);
    return { readme, extraFiles: [] };
  },
};

const neon: Design = {
  id: "neon",
  name: "Animated neon",
  description: "Typing-animation header, neon wave banner, skill icon grid and a contribution snake eating your activity graph.",
  vibe: "Flashy, animated, eye-catching",
  features: ["typing SVG header", "neon wave banner", "skill icons", "visitor counter", "contribution snake (GitHub Action)"],
  render(p) {
    const readme = b.compact([
      `<div align="center">`,
      b.waveBanner("0:0B0B1A,50:7C4DFF,100:00E5FF", "header", 120),
      b.typingSvg(b.defaultTypingLines(p), "B388FF"),
      `${b.linkBadges(p, { labelColor: "0B0B1A" })}\n${b.visitorBadge(p.username, "7C4DFF")}`,
      `</div>`,
      p.about.length > 0 && `## ⚡ About me\n\n${b.bullets(p.about)}`,
      p.skills.length > 0 && `## 🛠️ Tech stack\n\n<div align="center">\n\n${b.skillIcons(p.skills)}\n\n</div>`,
      p.projects.length > 0 && `## 🚀 Projects\n\n${b.projectsTable(p.projects)}`,
      p.now.length > 0 && `## 🔭 Right now\n\n${b.bullets(p.now)}`,
      `<div align="center">`,
      b.snakePicture(p.username),
      b.waveBanner("0:00E5FF,50:7C4DFF,100:0B0B1A", "footer", 100),
      `</div>`,
    ]);
    return {
      readme,
      extraFiles: [{ path: SNAKE_PATH, content: b.snakeWorkflow("#00E5FF", "#161b22,#311b92,#5e35b1,#7c4dff,#b388ff") }],
    };
  },
};

const minimal: Design = {
  id: "minimal",
  name: "Minimal editorial",
  description: "Quiet, text-first README with no badges or images. Just who you are, what you built and how to reach you.",
  vibe: "Calm, understated, writerly",
  features: ["no images", "short paragraphs", "plain text links"],
  render(p) {
    const projects = p.projects.map((x) => `- ${b.projectLink(x)}${x.description ? ` — ${x.description}` : ""}`);
    const readme = b.compact([
      `### ${p.name}`,
      p.tagline && `*${p.tagline}*`,
      [p.role, ...p.about].filter(Boolean).join(" ") || false,
      projects.length > 0 && `**Selected work**\n\n${projects.join("\n")}`,
      p.now.length > 0 && `**Now:** ${p.now.join("; ")}.`,
      p.skills.length > 0 && `<sub>${p.skills.join(" · ")}</sub>`,
      b.textLinks(p),
    ]);
    return { readme, extraFiles: [] };
  },
};

const projectCards: Design = {
  id: "project-cards",
  name: "Project cards",
  description: "Featured repos as GitHub-style pin cards in a two-column grid, with a compact header.",
  vibe: "Portfolio-first, show the work",
  features: ["repo pin cards", "two-column grid", "skill icons", "contact badges"],
  render(p) {
    const theme = "github_dark";
    const pinnable = p.projects.filter((x) => x.repo);
    const others = p.projects.filter((x) => !x.repo);
    const cards = pinnable.map((x) => b.pinCard(p.username, x.repo!, theme)).join("\n");
    const readme = b.compact([
      `<div align="center">`,
      `# ${p.name}`,
      [p.tagline, p.role].filter(Boolean).join(" · ") && `**${[p.tagline, p.role].filter(Boolean).join(" · ")}**`,
      b.linkBadges(p),
      `</div>`,
      p.about.length > 0 && b.bullets(p.about),
      (cards || others.length > 0) &&
        `## 🗂️ Featured work\n\n${cards ? `<div align="center">\n\n${cards}\n\n</div>` : ""}${others.length ? `\n\n${b.projectsTable(others)}` : ""}`,
      p.skills.length > 0 && `## 🧰 Toolbox\n\n<div align="center">\n\n${b.skillIcons(p.skills)}\n\n</div>`,
      p.now.length > 0 && `## 🧭 Currently\n\n${b.bullets(p.now)}`,
    ]);
    return { readme, extraFiles: [] };
  },
};

const neonTerminal: Design = {
  id: "neon-terminal",
  name: "Neon terminal",
  description: "Neon animated header (typing text, skill icons, snake) combined with terminal-style console sections.",
  vibe: "Flashy hacker, best of both",
  features: ["typing SVG header", "console sections", "skill icons", "visitor counter", "contribution snake (GitHub Action)"],
  render(p) {
    const host = `${p.username.toLowerCase()}@lab:~$`;
    const whoami = [
      `${host} whoami`,
      [p.name, p.role, p.location].filter(Boolean).join(" · "),
      ...(p.about.length ? ["", `${host} cat about.txt`, ...p.about.map((a) => `> ${a}`)] : []),
    ].join("\n");
    const w = Math.max(12, ...p.projects.map((x) => b.slug(x.name).length + 3));
    const ls = [
      `${host} ls -l ./experiments`,
      ...p.projects.map((x) => `drwxr-xr-x  ${b.pad(b.slug(x.name) + "/", w)}${x.description}`),
    ].join("\n");
    const now = p.now.map((n) => `[running]  ${n}`).join("\n");
    const readme = b.compact([
      `<div align="center">`,
      b.waveBanner("0:0B0B1A,50:7C4DFF,100:00E5FF", "header", 120),
      `<a href="https://github.com/${p.username}">\n  ${b.typingSvg(b.defaultTypingLines(p), "B388FF")}\n</a>`,
      `${b.linkBadges(p, { labelColor: "0B0B1A" })}\n${b.visitorBadge(p.username, "7C4DFF")}`,
      `</div>`,
      `---`,
      `### \`$ whoami\`\n\n\`\`\`console\n${whoami}\n\`\`\``,
      p.skills.length > 0 && `### \`$ cat stack.txt\`\n\n<div align="center">\n\n${b.skillIcons(p.skills)}\n\n</div>`,
      p.projects.length > 0 &&
        `### \`$ ls ./experiments\`\n\n\`\`\`console\n${ls}\n\`\`\`\n\n${b.projectsTable(p.projects)}`,
      p.now.length > 0 && `### \`$ tail -f now.log\`\n\n\`\`\`console\n${now}\n\`\`\``,
      `---`,
      `<div align="center">`,
      b.snakePicture(p.username),
      `\`\`\`console\n${host} echo "Got a wild idea? Let's prototype it."\n\`\`\``,
      b.waveBanner("0:00E5FF,50:7C4DFF,100:0B0B1A", "footer", 100),
      `</div>`,
    ]);
    return {
      readme,
      extraFiles: [{ path: SNAKE_PATH, content: b.snakeWorkflow("#00E5FF", "#161b22,#311b92,#5e35b1,#7c4dff,#b388ff") }],
    };
  },
};

export const DESIGNS: Design[] = [classic, terminal, labNotebook, statsDashboard, neon, minimal, projectCards, neonTerminal];

export function getDesign(id: string): Design {
  const d = DESIGNS.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown design "${id}". Available: ${DESIGNS.map((x) => x.id).join(", ")}`);
  return d;
}

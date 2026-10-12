import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { addEntry, sanitizeMessage, sanitizeUser } from "../skills/github-profile-designer/assets/actions/guestbook.mjs";
import { renderResults, vote } from "../skills/github-profile-designer/assets/actions/poll.mjs";

const SKILL = join(dirname(fileURLToPath(import.meta.url)), "../skills/github-profile-designer");
const EX = join(SKILL, "assets/examples");

test("guestbook message is sanitized", () => {
  assert.equal(sanitizeMessage("guestbook: Hello <script>x</script> [link](http://evil.com) **bold**"), "Hello scriptx/script link bold");
  assert.equal(sanitizeMessage("guestbook:   "), "👋");
  assert.equal(sanitizeMessage("guestbook: " + "a".repeat(300)).length, 100);
  assert.equal(sanitizeUser("dependabot[bot]"), "dependabotbot");
});

test("guestbook adds newest entry first, caps the list, replaces placeholder", () => {
  let readme = readFileSync(join(EX, "guestbook.md"), "utf8");
  for (let i = 1; i <= 4; i++) readme = addEntry(readme, `u${i}`, `hi ${i}`, "2026-10-11", 3).readme;
  const block = readme.split("<!-- GUESTBOOK:START -->")[1].split("<!-- GUESTBOOK:END -->")[0];
  const lines = block.trim().split("\n");
  assert.equal(lines.length, 3);
  assert.ok(lines[0].includes("@u4"));
  assert.ok(!block.includes("No signatures yet"));
  assert.ok(readme.includes("## Featured projects"), "rest of README untouched");
});

test("guestbook without markers does nothing", () => {
  assert.equal(addEntry("# hi", "u", "m", "d").changed, false);
});

test("poll counts one vote per user and rejects unknown options", () => {
  const poll = JSON.parse(readFileSync(join(SKILL, "assets/actions/poll.example.json"), "utf8"));
  assert.equal(vote(poll, "Alice", "vote: agent").ok, true);
  assert.equal(vote(poll, "alice", "vote: game").ok, false);
  assert.equal(vote(poll, "bob", "vote: nope").ok, false);
  assert.equal(vote(poll, "bob", "Vote: GAME").ok, true);
  const out = renderResults(poll);
  assert.ok(out.includes("| 🤖 An AI agent | `█████░░░░░` 50% (1) |"));
  assert.ok(out.includes("2 votes so far"));
});

test("poll example README matches what --render produces", () => {
  const poll = JSON.parse(readFileSync(join(SKILL, "assets/actions/poll.example.json"), "utf8"));
  const readme = readFileSync(join(EX, "poll.md"), "utf8");
  assert.ok(readme.includes(renderResults(poll)));
});

test("scripts run end to end like the GitHub Action does", () => {
  const dir = mkdtempSync(join(tmpdir(), "profile-"));
  mkdirSync(join(dir, ".github/scripts"), { recursive: true });
  copyFileSync(join(SKILL, "assets/actions/guestbook.mjs"), join(dir, ".github/scripts/guestbook.mjs"));
  copyFileSync(join(SKILL, "assets/actions/poll.mjs"), join(dir, ".github/scripts/poll.mjs"));
  copyFileSync(join(SKILL, "assets/actions/poll.example.json"), join(dir, ".github/poll.json"));
  const readme = readFileSync(join(EX, "guestbook.md"), "utf8") + "\n" +
    readFileSync(join(EX, "poll.md"), "utf8").match(/<!-- POLL:START -->[\s\S]*<!-- POLL:END -->/)[0];
  writeFileSync(join(dir, "README.md"), readme);
  const out = join(dir, "out.txt");
  const run = (script, title, user) =>
    execFileSync("node", [`.github/scripts/${script}`], { cwd: dir, env: { ...process.env, ISSUE_TITLE: title, ISSUE_USER: user, GITHUB_OUTPUT: out } });

  run("guestbook.mjs", "guestbook: Love the profile; $(rm -rf /)", "visitor1");
  run("poll.mjs", "vote: game", "visitor1");
  const final = readFileSync(join(dir, "README.md"), "utf8");
  assert.ok(final.includes("**[@visitor1](https://github.com/visitor1)**: Love the profile; $rm -rf /"));
  assert.ok(final.includes("| 🎮 A browser game | `██████████` 100% (1) |"));
  assert.equal(JSON.parse(readFileSync(join(dir, ".github/poll.json"), "utf8")).voters[0], "visitor1");
  assert.match(readFileSync(out, "utf8"), /reply=Thanks for signing, @visitor1!/);
});

test("every example passes structural checks", () => {
  for (const name of ["adventure", "interactive-resume", "guestbook", "poll", "classic", "terminal", "lab-notebook", "minimal", "neon", "neon-terminal", "project-cards", "stats-dashboard", "rpg", "changelog", "code-snippet", "magazine", "retro-90s", "world-map"]) {
    const md = readFileSync(join(EX, `${name}.md`), "utf8");
    for (const tag of ["details", "div", "picture"]) {
      const open = (md.match(new RegExp(`<${tag}[\\s>]`, "g")) || []).length;
      const close = (md.match(new RegExp(`</${tag}>`, "g")) || []).length;
      assert.equal(open, close, `${name}: <${tag}> balance`);
    }
    assert.ok(!/<\/summary>\n[^\n<]/.test(md), `${name}: blank line after </summary>`);
  }
});

test("world-map example has valid GeoJSON with [lng, lat] order", () => {
  const md = readFileSync(join(EX, "world-map.md"), "utf8");
  const geo = JSON.parse(md.match(/```geojson\n([\s\S]*?)```/)[1]);
  for (const f of geo.features.filter((f) => f.geometry.type === "Point")) {
    const [lng, lat] = f.geometry.coordinates;
    assert.ok(Math.abs(lat) <= 90 && Math.abs(lng) <= 180, `${f.properties.title} coordinates in range`);
  }
});

test("catalog lists every example and every example is in the catalog", async () => {
  const { readdirSync } = await import("node:fs");
  const catalog = readFileSync(join(SKILL, "references/designs.md"), "utf8");
  const files = readdirSync(EX).filter((f) => f.endsWith(".md") && f !== "README.md").map((f) => f.replace(".md", ""));
  assert.equal(files.length, 18);
  for (const id of files) assert.ok(catalog.includes(`| \`${id}\` |`), `${id} in designs.md`);
});

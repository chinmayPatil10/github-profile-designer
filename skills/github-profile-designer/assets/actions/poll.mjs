// Records a vote from a "vote: <option-id>" issue and redraws the poll results in README.md.
// Runs inside the profile repo's GitHub Action. Zero dependencies.
// State lives in .github/poll.json: { "question", "options": [{ "id", "label", "votes" }], "voters": [] }
// Inputs (env): ISSUE_TITLE, ISSUE_USER. Optional: README_PATH, POLL_PATH.
// Run with --render to only redraw the results from poll.json (used when setting up the poll).
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";

const START = "<!-- POLL:START -->";
const END = "<!-- POLL:END -->";

export function renderResults(poll) {
  const total = poll.options.reduce((n, o) => n + o.votes, 0);
  const rows = poll.options.map((o) => {
    const pct = total ? Math.round((o.votes / total) * 100) : 0;
    const filled = Math.round(pct / 10);
    const bar = "█".repeat(filled) + "░".repeat(10 - filled);
    return `| ${o.label} | \`${bar}\` ${pct}% (${o.votes}) |`;
  });
  return [
    "| Option | Votes |",
    "|---|---|",
    ...rows,
    "",
    `<sub>${total} vote${total === 1 ? "" : "s"} so far · one vote per GitHub account</sub>`,
  ].join("\n");
}

export function replaceBlock(readme, content) {
  const s = readme.indexOf(START);
  const e = readme.indexOf(END);
  if (s < 0 || e < s) return null;
  return `${readme.slice(0, s)}${START}\n${content}\n${END}${readme.slice(e + END.length)}`;
}

export function vote(poll, user, title) {
  const id = String(title ?? "")
    .replace(/^\s*vote\s*:\s*/i, "")
    .trim()
    .toLowerCase();
  const option = poll.options.find((o) => o.id.toLowerCase() === id);
  if (!option) return { ok: false, reply: `"${id}" isn't one of the options, so no vote was counted.` };
  const who = user.toLowerCase();
  if (poll.voters.includes(who)) return { ok: false, reply: `You've already voted, @${user}. Thanks for being keen!` };
  option.votes += 1;
  poll.voters.push(who);
  return { ok: true, reply: `Vote counted for **${option.label}**. Thanks, @${user}! 🗳️` };
}

function output(key, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const readmePath = process.env.README_PATH || "README.md";
  const pollPath = process.env.POLL_PATH || ".github/poll.json";
  const poll = JSON.parse(readFileSync(pollPath, "utf8"));
  poll.voters ??= [];
  let reply = "Results redrawn.";
  if (!process.argv.includes("--render")) {
    const user = String(process.env.ISSUE_USER ?? "").replace(/[^A-Za-z0-9-]/g, "");
    const res = vote(poll, user, process.env.ISSUE_TITLE);
    reply = res.reply;
    if (res.ok) writeFileSync(pollPath, JSON.stringify(poll, null, 2) + "\n");
  }
  const next = replaceBlock(readFileSync(readmePath, "utf8"), renderResults(poll));
  if (next === null) reply = "Couldn't find the poll markers in README.md.";
  else writeFileSync(readmePath, next);
  output("reply", reply);
  console.log(reply);
}

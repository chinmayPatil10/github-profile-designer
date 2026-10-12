// Adds a guestbook entry to README.md from a "guestbook: <message>" issue.
// Runs inside the profile repo's GitHub Action. Zero dependencies.
// Inputs (env): ISSUE_TITLE, ISSUE_USER. Optional: README_PATH, GUESTBOOK_MAX (default 15).
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";

const START = "<!-- GUESTBOOK:START -->";
const END = "<!-- GUESTBOOK:END -->";
const EMPTY = "_No signatures yet. Be the first!_";

export function sanitizeMessage(raw) {
  const msg = String(raw ?? "")
    .replace(/^\s*guestbook\s*:\s*/i, "")
    .replace(/https?:\/\/\S+/gi, "") // no links, to keep spam out
    .replace(/[<>[\]()`*_|#!\\~]/g, "") // no markdown or HTML
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
  return msg || "👋";
}

export function sanitizeUser(raw) {
  return String(raw ?? "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 39);
}

export function addEntry(readme, user, message, date, max = 15) {
  const s = readme.indexOf(START);
  const e = readme.indexOf(END);
  if (s < 0 || e < s) return { readme, changed: false, reason: "markers not found" };
  const entries = readme
    .slice(s + START.length, e)
    .split("\n")
    .filter((l) => l.startsWith("- "));
  const entry = `- **[@${user}](https://github.com/${user})**: ${message} <sub>${date}</sub>`;
  const next = [entry, ...entries].slice(0, max);
  const block = `${START}\n${next.join("\n") || EMPTY}\n${END}`;
  return { readme: readme.slice(0, s) + block + readme.slice(e + END.length), changed: true };
}

function output(key, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.env.README_PATH || "README.md";
  const user = sanitizeUser(process.env.ISSUE_USER);
  const message = sanitizeMessage(process.env.ISSUE_TITLE);
  const date = new Date().toISOString().slice(0, 10);
  const res = addEntry(readFileSync(path, "utf8"), user, message, date, Number(process.env.GUESTBOOK_MAX || 15));
  if (res.changed) writeFileSync(path, res.readme);
  output("reply", res.changed ? `Thanks for signing, @${user}! Your message is now on the profile. ✍️` : `Couldn't update the guestbook (${res.reason}).`);
  console.log(res.changed ? `Signed by ${user}: ${message}` : res.reason);
}

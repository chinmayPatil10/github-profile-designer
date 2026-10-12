#!/usr/bin/env node
// Checks a profile README before publishing.
// Usage: node check_readme.mjs README.md
// - Fetches every image URL and reports ones that fail or don't return an image
// - Flags markdown that GitHub won't render the way you'd expect
// Exit code 1 if anything is broken.
import { readFileSync } from "node:fs";

const path = process.argv[2] || "README.md";
const md = readFileSync(path, "utf8");
const problems = [];
const warnings = [];

const urls = new Set();
for (const m of md.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)) urls.add(m[1]);
for (const m of md.matchAll(/<img[^>]+src="(https?:\/\/[^"]+)"/g)) urls.add(m[1].replace(/&amp;/g, "&"));
for (const m of md.matchAll(/srcset="(https?:\/\/[^"]+)"/g)) urls.add(m[1]);

async function check(url) {
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "github-profile-designer" }, signal: AbortSignal.timeout(20000) });
    const type = res.headers.get("content-type") || "";
    if (!res.ok) {
      const note = url.includes("/output/github-snake")
        ? " (expected until the snake workflow runs once)"
        : "";
      (note ? warnings : problems).push(`Image ${res.status}${note}: ${url}`);
    } else if (!type.startsWith("image/") && !type.includes("svg")) {
      problems.push(`Not an image (${type}): ${url}`);
    } else {
      // Card services return 200 with an error drawn inside the image, so read the SVG text.
      const body = type.includes("svg") ? await res.text() : "";
      if (/invalid|bad request|something went wrong|rate limit|could not resolve|user not found|not found/i.test(body))
        problems.push(`Image renders an error message: ${url}`);
    }
  } catch (e) {
    warnings.push(`Couldn't reach (may just be slow): ${url} (${e.message})`);
  }
}
await Promise.all([...urls].map(check));

// Markdown inside <details> needs a blank line after </summary> to render.
for (const m of md.matchAll(/<\/summary>\n(?!\n)(\S)/g)) {
  if (!/^[<]/.test(m[1])) warnings.push(`Add a blank line after </summary> near: "${md.slice(m.index, m.index + 40).replace(/\n/g, " ")}"`);
}
// Tag balance
for (const tag of ["details", "div", "picture"]) {
  const open = (md.match(new RegExp(`<${tag}[\\s>]`, "g")) || []).length;
  const close = (md.match(new RegExp(`</${tag}>`, "g")) || []).length;
  if (open !== close) problems.push(`<${tag}> opened ${open} times but closed ${close} times`);
}
// Interactive markers must be paired
for (const name of ["GUESTBOOK", "POLL"]) {
  const s = md.includes(`<!-- ${name}:START -->`);
  const e = md.includes(`<!-- ${name}:END -->`);
  if (s !== e) problems.push(`${name} markers aren't paired`);
}
// Things GitHub strips
if (/<script|<style|<iframe/i.test(md)) problems.push("GitHub strips <script>, <style> and <iframe>; they won't work");
if (/\sstyle="/i.test(md)) warnings.push('GitHub ignores style="..." attributes');
if (/\son[a-z]+="/i.test(md)) problems.push("GitHub strips event handlers like onclick");
if (/\]\(\s*\)/.test(md)) problems.push("Empty link target found: ]()");
if (/undefined|\[object Object\]|\{\{|TODO|YOUR_/i.test(md)) problems.push("Leftover placeholder text (undefined, {{, TODO or YOUR_)");

console.log(`Checked ${urls.size} images in ${path}`);
for (const p of problems) console.log(`✗ ${p}`);
for (const w of warnings) console.log(`! ${w}`);
if (!problems.length) console.log("✓ No blocking problems");
process.exit(problems.length ? 1 : 0);

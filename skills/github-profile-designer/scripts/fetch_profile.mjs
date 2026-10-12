#!/usr/bin/env node
// Prints a draft profile (JSON) from a user's public GitHub data.
// Usage: node fetch_profile.mjs <username> [maxProjects=8]
// Uses GITHUB_TOKEN or GH_TOKEN if set (higher rate limit), otherwise unauthenticated.
const [username, maxArg] = process.argv.slice(2);
if (!username) {
  console.error("Usage: node fetch_profile.mjs <username> [maxProjects]");
  process.exit(1);
}
const max = Number(maxArg || 8);
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = { Accept: "application/vnd.github+json", "User-Agent": "github-profile-designer" };
if (token) headers.Authorization = `Bearer ${token}`;

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GET ${path}: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const user = await gh(`/users/${encodeURIComponent(username)}`);
const repos = await gh(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`);

let profileRepo = null;
try {
  const r = await gh(`/repos/${user.login}/${user.login}`);
  profileRepo = { exists: true, url: r.html_url, private: r.private };
} catch {
  profileRepo = { exists: false };
}

const own = repos.filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== user.login.toLowerCase());
const languages = {};
for (const r of own) if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;

// Score repos so real projects beat coursework, tests and empty templates.
// Stars matter, but so do a description, a live site, topics and recent activity.
const LOW_SIGNAL = /(course|assignment|homework|hw\d|lab\d|tutorial|practice|test|demo|sample|template|hello-world|learning|class|university|college)/i;
const now = Date.now();
function score(r) {
  let s = r.stargazers_count * 3;
  if (r.description) s += 4;
  if (r.homepage) s += 3;
  if ((r.topics || []).length) s += 1;
  const ageDays = (now - Date.parse(r.pushed_at)) / 86400000;
  s += ageDays < 180 ? 4 : ageDays < 365 ? 2 : ageDays < 1095 ? 1 : 0;
  if (LOW_SIGNAL.test(r.name) || LOW_SIGNAL.test(r.description || "")) s -= 6;
  return s;
}
const ranked = [...own].sort((a, b) => score(b) - score(a) || b.pushed_at.localeCompare(a.pushed_at));

console.log(
  JSON.stringify(
    {
      username: user.login,
      name: user.name || user.login,
      bio: user.bio,
      company: user.company,
      location: user.location,
      website: user.blog || null,
      twitter: user.twitter_username,
      email: user.email,
      followers: user.followers,
      publicRepos: user.public_repos,
      profileRepo,
      languages: Object.entries(languages).sort((a, b) => b[1] - a[1]).map(([l, n]) => `${l} (${n})`),
      candidateProjects: ranked.slice(0, max).map((r) => ({
        repo: r.name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        stars: r.stargazers_count,
        topics: r.topics || [],
        lastPush: r.pushed_at.slice(0, 10),
        lowSignal: LOW_SIGNAL.test(r.name) || LOW_SIGNAL.test(r.description || ""),
      })),
      skippedForks: repos.filter((r) => r.fork).length,
    },
    null,
    2,
  ),
);

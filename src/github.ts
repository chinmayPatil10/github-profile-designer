import type { Profile } from "./profile.js";

const API = "https://api.github.com";

function headers(token?: string): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "github-profile-designer-mcp",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function gh<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { ...init, headers: { ...headers(token), ...(init.headers ?? {}) } });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`GitHub ${init.method ?? "GET"} ${path} failed: ${res.status} ${body.slice(0, 300)}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

interface GhUser {
  login: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string | null;
  email: string | null;
  twitter_username: string | null;
  company: string | null;
}

interface GhRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  topics?: string[];
}

/** Builds a draft profile from public GitHub data. The user should review and enrich it. */
export async function fetchDraftProfile(username: string, maxProjects = 6, token?: string): Promise<Profile> {
  const user = await gh<GhUser>(`/users/${encodeURIComponent(username)}`, {}, token);
  const repos = await gh<GhRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
    {},
    token,
  );

  const own = repos.filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== user.login.toLowerCase());
  // Rank by stars, then by having a description, then by recent activity.
  const ranked = [...own].sort(
    (a, b) =>
      b.stargazers_count - a.stargazers_count ||
      Number(!!b.description) - Number(!!a.description) ||
      b.pushed_at.localeCompare(a.pushed_at),
  );

  const langCount = new Map<string, number>();
  for (const r of own) if (r.language) langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
  const skills = [...langCount.entries()].sort((a, b) => b[1] - a[1]).map(([l]) => l);

  const website = user.blog ? (user.blog.startsWith("http") ? user.blog : `https://${user.blog}`) : undefined;

  return {
    username: user.login,
    name: user.name ?? user.login,
    tagline: "",
    role: user.company ? `@ ${user.company.replace(/^@/, "")}` : "",
    about: user.bio ? [user.bio] : [],
    location: user.location ?? undefined,
    skills,
    projects: ranked.slice(0, maxProjects).map((r) => ({
      name: r.name,
      description: r.description ?? "",
      url: r.homepage || r.html_url,
      repo: r.name,
      stack: [r.language, ...(r.topics ?? []).slice(0, 2)].filter((x): x is string => !!x),
      stars: r.stargazers_count,
      language: r.language ?? undefined,
    })),
    now: [],
    links: {
      email: user.email ?? undefined,
      website,
      twitter: user.twitter_username ?? undefined,
    },
    typingLines: [],
  };
}

export interface PublishFile {
  path: string;
  content: string;
}

export interface PublishResult {
  repoUrl: string;
  profileUrl: string;
  createdRepo: boolean;
  files: { path: string; action: "created" | "updated" | "unchanged" }[];
}

/** Creates `<login>/<login>` if missing and commits the given files to its default branch. */
export async function publishProfile(files: PublishFile[], token: string, message: string): Promise<PublishResult> {
  const me = await gh<{ login: string }>("/user", {}, token);
  const repoPath = `/repos/${me.login}/${me.login}`;

  let createdRepo = false;
  let branch = "main";
  try {
    const repo = await gh<{ default_branch: string }>(repoPath, {}, token);
    branch = repo.default_branch;
  } catch (e) {
    if ((e as { status?: number }).status !== 404) throw e;
    await gh(
      "/user/repos",
      {
        method: "POST",
        body: JSON.stringify({ name: me.login, description: "My GitHub profile README", auto_init: true }),
      },
      token,
    );
    createdRepo = true;
  }

  const results: PublishResult["files"] = [];
  for (const f of files) {
    let sha: string | undefined;
    let existing: string | undefined;
    try {
      const cur = await gh<{ sha: string; content: string }>(
        `${repoPath}/contents/${f.path}?ref=${branch}`,
        {},
        token,
      );
      sha = cur.sha;
      existing = Buffer.from(cur.content, "base64").toString("utf8");
    } catch (e) {
      if ((e as { status?: number }).status !== 404) throw e;
    }
    if (existing === f.content) {
      results.push({ path: f.path, action: "unchanged" });
      continue;
    }
    await gh(
      `${repoPath}/contents/${f.path}`,
      {
        method: "PUT",
        body: JSON.stringify({
          message,
          content: Buffer.from(f.content, "utf8").toString("base64"),
          branch,
          ...(sha ? { sha } : {}),
        }),
      },
      token,
    );
    results.push({ path: f.path, action: sha ? "updated" : "created" });
  }

  return {
    repoUrl: `https://github.com/${me.login}/${me.login}`,
    profileUrl: `https://github.com/${me.login}`,
    createdRepo,
    files: results,
  };
}

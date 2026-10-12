#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { DESIGNS, getDesign } from "./designs.js";
import { fetchDraftProfile, publishProfile } from "./github.js";
import { ProfileSchema } from "./profile.js";

const server = new McpServer({ name: "github-profile-designer", version: "0.1.0" });

function token(): string | undefined {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || undefined;
}

function json(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

server.registerTool(
  "list_designs",
  {
    title: "List profile README designs",
    description:
      "List the available GitHub profile README designs with their id, vibe and features. Show these to the user so they can pick one.",
    inputSchema: {},
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  async () =>
    json(
      DESIGNS.map((d) => ({ id: d.id, name: d.name, vibe: d.vibe, description: d.description, features: d.features })),
    ),
);

server.registerTool(
  "fetch_github_profile",
  {
    title: "Fetch a draft profile from GitHub",
    description:
      "Build a draft profile from a user's public GitHub data: name, bio, location, links, languages and their best non-fork repos. " +
      "Review it with the user and fill in tagline, role, about, skills, now and links before generating a README.",
    inputSchema: {
      username: z.string().describe("GitHub username"),
      max_projects: z.number().int().min(1).max(12).default(6).describe("How many repos to include"),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async ({ username, max_projects }) => json(await fetchDraftProfile(username, max_projects, token())),
);

server.registerTool(
  "generate_readme",
  {
    title: "Generate a profile README",
    description:
      "Render a profile README in the chosen design. Returns the README markdown plus any extra files the design needs " +
      "(e.g. a GitHub Action for the contribution snake). Nothing is published.",
    inputSchema: {
      design: z.string().describe(`Design id: ${DESIGNS.map((d) => d.id).join(", ")}`),
      profile: ProfileSchema.describe("Profile data, usually from fetch_github_profile after the user reviewed it"),
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  async ({ design, profile }) => {
    const { readme, extraFiles } = getDesign(design).render(ProfileSchema.parse(profile));
    return {
      content: [
        { type: "text" as const, text: readme },
        ...(extraFiles.length
          ? [
              {
                type: "text" as const,
                text:
                  "Extra files this design needs:\n\n" +
                  extraFiles.map((f) => `--- ${f.path} ---\n${f.content}`).join("\n\n"),
              },
            ]
          : []),
      ],
    };
  },
);

server.registerTool(
  "publish_profile_readme",
  {
    title: "Publish the profile README to GitHub",
    description:
      "Publish the README (and any extra files) to the authenticated user's <username>/<username> repo, creating it as a " +
      "public repo if needed. This makes the content public on the user's GitHub profile, so confirm with the user first. " +
      "Requires GITHUB_TOKEN (or GH_TOKEN) in the server environment with repo and workflow scopes. " +
      "Use dry_run to see what would change without writing.",
    inputSchema: {
      design: z.string().describe("Design id"),
      profile: ProfileSchema,
      commit_message: z.string().default("Update profile README").describe("Commit message"),
      dry_run: z.boolean().default(false).describe("Only report what would be published"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ design, profile, commit_message, dry_run }) => {
    const p = ProfileSchema.parse(profile);
    const { readme, extraFiles } = getDesign(design).render(p);
    const files = [{ path: "README.md", content: readme }, ...extraFiles];
    if (dry_run) {
      return json({ dry_run: true, target: `${p.username}/${p.username}`, files: files.map((f) => f.path) });
    }
    const t = token();
    if (!t) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text:
              "No GITHUB_TOKEN or GH_TOKEN set for this MCP server. Add one to the server's env config, or use " +
              "generate_readme and commit the files yourself to a public repo named after your username.",
          },
        ],
      };
    }
    const me = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${t}`, "User-Agent": "github-profile-designer-mcp" },
    }).then((r) => r.json() as Promise<{ login?: string }>);
    if (me.login?.toLowerCase() !== p.username.toLowerCase()) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `The token belongs to "${me.login}", but the profile is for "${p.username}". You can only publish your own profile README.`,
          },
        ],
      };
    }
    return json(await publishProfile(files, t, commit_message));
  },
);

server.registerPrompt(
  "design_my_profile",
  {
    title: "Design my GitHub profile",
    description: "Guided flow: fetch your GitHub data, pick a design, review and publish your profile README.",
    argsSchema: { username: z.string().describe("Your GitHub username") },
  },
  ({ username }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text:
            `Help me design my GitHub profile README. My username is ${username}.\n\n` +
            "1. Call fetch_github_profile and show me the draft.\n" +
            "2. Ask me for anything missing: tagline, role, a few 'about' facts, skills, what I'm working on now, and links.\n" +
            "3. Call list_designs and let me choose one.\n" +
            "4. Call generate_readme and show me the result.\n" +
            "5. Only after I confirm, call publish_profile_readme.",
        },
      },
    ],
  }),
);

await server.connect(new StdioServerTransport());

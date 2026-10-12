import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string().describe("Project name"),
  description: z.string().default("").describe("One-line description"),
  url: z.string().optional().describe("Link to the repo or live site"),
  repo: z.string().optional().describe("Repo name under the user's account, enables repo pin cards"),
  stack: z.array(z.string()).default([]).describe("Technologies used"),
  stars: z.number().optional(),
  language: z.string().optional(),
});

export const ProfileSchema = z.object({
  username: z.string().describe("GitHub username"),
  name: z.string().describe("Display name"),
  tagline: z.string().default("").describe("Short tagline, e.g. 'Tinkerer · Explorer · Builder'"),
  role: z.string().default("").describe("Role or title, e.g. 'AI tinkerer'"),
  about: z.array(z.string()).default([]).describe("Bio bullet points, one fact each"),
  location: z.string().optional(),
  skills: z.array(z.string()).default([]).describe("Languages, frameworks, tools"),
  projects: z.array(ProjectSchema).default([]).describe("Featured projects, best first"),
  now: z.array(z.string()).default([]).describe("What you're currently working on or learning"),
  links: z
    .object({
      email: z.string().optional(),
      linkedin: z.string().optional().describe("Full LinkedIn URL"),
      website: z.string().optional(),
      twitter: z.string().optional().describe("X/Twitter handle without @"),
    })
    .default({}),
  typingLines: z.array(z.string()).default([]).describe("Lines for animated typing headers"),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;

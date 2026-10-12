import { writeFileSync } from "node:fs";
import { DESIGNS } from "../src/designs.js";
import { ProfileSchema } from "../src/profile.js";

/** Renders every design with a sample profile into examples/<id>.md. */
const sample = ProfileSchema.parse({
  username: "chinmayPatil10",
  name: "Chinmay Patil",
  tagline: "Tinkerer · Explorer · Builder",
  role: "AI tinkerer",
  about: [
    "7+ years shipping software, still treating every project like an experiment",
    "Built an AI support agent that cut developer support time by 80%",
    "Founder of Convoo, a dating app where you talk before you see profiles",
  ],
  location: "Atlanta, GA",
  skills: ["TypeScript", "Python", "Node.js", "NestJS", "React", "Next.js", "GCP", "AWS", "Docker", "PostgreSQL", "Supabase", "LangChain"],
  projects: [
    { name: "Recess", description: "AI models battle it out in browser games", url: "https://recess-one.vercel.app", repo: "Recess", stack: ["HTML", "LLM APIs"] },
    { name: "AppBase", description: "Self-hosted help center, changelog and feedback platform", url: "https://chinmaypatil10.github.io/appbase/", repo: "appbase", stack: ["TypeScript"] },
    { name: "PlugAI", description: "One npm API for Gemini, DeepSeek and OpenAI", url: "https://github.com/chinmayPatil10/plugai", repo: "plugai", stack: ["TypeScript"] },
    { name: "supabase-node-kit", description: "Drop-in Supabase auth and DB for Node", url: "https://github.com/chinmayPatil10/supabase-node-kit", repo: "supabase-node-kit", stack: ["TypeScript", "Supabase"] },
  ],
  now: ["Building Convoo", "Experimenting with AI agents"],
  links: { linkedin: "https://www.linkedin.com/in/chinmay-patil-/" },
  typingLines: ["Hi, I'm Chinmay Patil", "Tinkerer · Explorer · Builder", "I build AI things that shouldn't work"],
});

for (const d of DESIGNS) {
  writeFileSync(`examples/${d.id}.md`, d.render(sample).readme);
  console.log(`examples/${d.id}.md`);
}

import { test } from "node:test";
import assert from "node:assert/strict";
import { DESIGNS, getDesign } from "../src/designs.js";
import { ProfileSchema } from "../src/profile.js";
import { splitSkills } from "../src/blocks.js";

const full = ProfileSchema.parse({
  username: "octo-dev",
  name: "Octo Dev",
  tagline: "Tinkerer · Explorer · Builder",
  role: "AI tinkerer",
  about: ["Builds things", "Breaks things"],
  location: "Atlanta, GA",
  skills: ["TypeScript", "Python", "Node.js", "LangChain", "GCP"],
  projects: [
    { name: "Recess", description: "AI arcade", url: "https://example.com", repo: "Recess", stack: ["HTML"] },
    { name: "KitabAI", description: "Chat with books", stack: ["Gemini"] },
  ],
  now: ["Building Convoo"],
  links: { email: "octo@example.com", linkedin: "https://linkedin.com/in/octo" },
});

const empty = ProfileSchema.parse({ username: "ghost", name: "Ghost" });

for (const d of DESIGNS) {
  test(`${d.id} renders a full profile`, () => {
    const { readme } = d.render(full);
    assert.ok(readme.includes("Octo Dev") || readme.includes("octo-dev"), "mentions the user");
    assert.ok(readme.includes("Recess"), "includes projects");
    assert.ok(!readme.includes("undefined"), "no undefined leaks");
    assert.ok(!readme.includes("[object Object]"));
  });

  test(`${d.id} renders an empty profile without errors`, () => {
    const { readme } = d.render(empty);
    assert.ok(readme.length > 0);
    assert.ok(!readme.includes("undefined"));
  });
}

test("snake designs ship the workflow file", () => {
  for (const id of ["neon", "neon-terminal"]) {
    const { readme, extraFiles } = getDesign(id).render(full);
    assert.equal(extraFiles[0]?.path, ".github/workflows/snake.yml");
    assert.ok(readme.includes("raw.githubusercontent.com/octo-dev/octo-dev/output/github-snake-dark.svg"));
  }
});

test("project-cards uses pin cards only for owned repos", () => {
  const { readme } = getDesign("project-cards").render(full);
  assert.ok(readme.includes("api/pin/?username=octo-dev&repo=Recess"));
  assert.ok(!readme.includes("repo=KitabAI"));
  assert.ok(readme.includes("KitabAI"), "non-repo projects fall back to the table");
});

test("skills split into icons and badges", () => {
  const { iconIds, other } = splitSkills(full.skills);
  assert.deepEqual(iconIds, ["ts", "py", "nodejs", "gcp"]);
  assert.deepEqual(other, ["LangChain"]);
});

test("unknown design id lists the options", () => {
  assert.throws(() => getDesign("nope"), /Available: classic/);
});

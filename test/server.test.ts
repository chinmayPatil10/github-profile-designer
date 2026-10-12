import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

type TextContent = { type: "text"; text: string }[];

test("MCP server end to end over stdio", async () => {
  const env = { ...process.env } as Record<string, string>;
  delete env.GITHUB_TOKEN;
  delete env.GH_TOKEN;
  const transport = new StdioClientTransport({ command: "npx", args: ["tsx", "src/index.ts"], env });
  const client = new Client({ name: "test", version: "0.0.0" });
  await client.connect(transport);
  try {
    const tools = (await client.listTools()).tools.map((t) => t.name).sort();
    assert.deepEqual(tools, ["fetch_github_profile", "generate_readme", "list_designs", "publish_profile_readme"]);

    const prompts = (await client.listPrompts()).prompts.map((p) => p.name);
    assert.deepEqual(prompts, ["design_my_profile"]);

    const list = await client.callTool({ name: "list_designs", arguments: {} });
    const designs = JSON.parse((list.content as TextContent)[0].text);
    assert.equal(designs.length, 8);

    const profile = { username: "octo-dev", name: "Octo Dev", tagline: "Builder", projects: [{ name: "Thing" }] };
    const gen = await client.callTool({ name: "generate_readme", arguments: { design: "neon", profile } });
    const parts = gen.content as TextContent;
    assert.ok(parts[0].text.includes("readme-typing-svg"));
    assert.ok(parts[1].text.includes(".github/workflows/snake.yml"));

    const dry = await client.callTool({
      name: "publish_profile_readme",
      arguments: { design: "terminal", profile, dry_run: true },
    });
    assert.deepEqual(JSON.parse((dry.content as TextContent)[0].text).files, ["README.md"]);

    const noToken = await client.callTool({ name: "publish_profile_readme", arguments: { design: "terminal", profile } });
    assert.equal(noToken.isError, true);

    const bad = await client.callTool({ name: "generate_readme", arguments: { design: "nope", profile } });
    assert.equal(bad.isError, true);
  } finally {
    await client.close();
  }
});

test("fetch_github_profile builds a draft from live GitHub data", { skip: !!process.env.OFFLINE }, async () => {
  const transport = new StdioClientTransport({ command: "npx", args: ["tsx", "src/index.ts"] });
  const client = new Client({ name: "test", version: "0.0.0" });
  await client.connect(transport);
  try {
    const res = await client.callTool({ name: "fetch_github_profile", arguments: { username: "octocat", max_projects: 3 } });
    const draft = JSON.parse((res.content as TextContent)[0].text);
    assert.equal(draft.username, "octocat");
    assert.ok(draft.projects.length > 0 && draft.projects.length <= 3);
  } finally {
    await client.close();
  }
});

# What GitHub renders in a README

GitHub sanitizes README HTML. Designing around these limits is most of the craft.

## Works
- **Markdown:** headings, tables, lists, blockquotes, code blocks, task lists, footnotes, emoji shortcodes, and alerts (`> [!NOTE]`).
- **Images:** external images, proxied through GitHub's camo cache.
- **`<details>` / `<summary>`:** collapsible sections, which can be nested. Markdown inside them renders only if there's a blank line after `</summary>`. `<details open>` starts the section expanded.
- **`<picture>` with `<source media="(prefers-color-scheme: dark)">`:** separate images for light and dark mode.
- **Alignment:** `align="center"` on `<div>`, `<p>`, `<img>`, and `<h1>`–`<h6>`.
- **Basic HTML:** `width` and `height` on `<img>`, plus `<br/>`, `<sub>`, `<sup>`, `<kbd>`, `<b>`, `<i>`, `<a>`, and `<table>`.
- **Diagrams:** ```` ```mermaid ```` code blocks render as diagrams, including `flowchart`, `timeline`, `mindmap`, `pie`, `gitGraph`, `journey`, and `quadrantChart`.
- **Math:** `$...$` and `$$...$$`.
- **Maps and 3D:** ```` ```geojson ```` and ```` ```topojson ```` blocks render as maps, and ```` ```stl ```` blocks as 3D models.

## Stripped or ignored
- **Code and embeds:** `<script>`, `<style>`, `<iframe>`, `<form>`, `<input>`, `<button>`, and event handlers (`onclick` and the like).
- **Styling:** `style="..."` attributes and `class` / `id` attributes, so CSS can't do anything.
- **Video:** `<video>` and `<audio>` tags in a README. Use a GIF instead.
- **Images that render poorly:** SVGs that rely on web fonts or JavaScript. Animated SVGs (CSS keyframes) generally work, but text that fades in from `opacity: 0` can look blank in screenshots.

## Gotchas
- **Image caching:** camo caches images. After a change, a hard refresh may still show the old badge for a few minutes. Don't "fix" something that's already fixed; recheck with `?v=2` on the profile URL or wait.
- **Mermaid limits:** Mermaid diagrams aren't clickable in GitHub. Parentheses, brackets and colons in mindmap node text break the parse, so write "Cloud and DevOps", not "Cloud & DevOps (AWS)". In `timeline`, a colon separates the period from its events.
- **Light and dark themes:** visitors use both. Prefer images with transparent or dark backgrounds that also look fine on white, or use `<picture>` to swap them.
- **Mobile:** tables wider than about 3 columns get cramped on phones.
- **Where a profile README shows:** only in a **public** repo named exactly like the username (case-insensitive) that has a `README.md` at the root. A private repo shows nothing.
- **GitLab is different:** the project must be public and named exactly the username. GitLab supports most of the same markdown and HTML, but `align` is less reliable and Actions-based designs don't apply.

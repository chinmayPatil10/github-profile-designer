# Design catalog

Twelve designs. Each has a full example in `assets/examples/<id>.md`. Read the example for the design the user picks and adapt it. Don't copy Ada's content.

Present the options to the user as a short list (name, one-line vibe). If the client can show visuals, mock up 4–6 options side by side. Suggest one or two based on what you learned about the person. An experimenter suits `lab-notebook` or `adventure`, a job seeker suits `classic` or `interactive-resume`, and someone with a following suits `guestbook` or `poll`.

## Static designs

| id | Vibe | Structure | Good for |
|---|---|---|---|
| `classic` | Polished, recruiter-friendly | Wave banner → name, tagline, role → contact badges → About bullets → tech badges → projects table → Currently | Job seekers, most people |
| `terminal` | Hacker, monospace | Every section is a shell command with ```` ```console ```` output: `whoami`, `cat stack.txt`, `ls ./projects`, `tail -f now.log`, then `exit` | Backend, infra, CLI people |
| `lab-notebook` | Curious experimenter | "Lab notebook of X" → Field notes → Equipment (skills) → Experiment log with EXP-001… each with Hypothesis / Apparatus / Status → Currently running | Tinkerers, side-project people |
| `stats-dashboard` | Data-driven | Header → skill icons → stats card + top languages + streak → contribution chart → projects | Active contributors with lots of public commits |
| `neon` | Flashy, animated | Neon wave → typing SVG header → badges + visitor counter → skill icons → projects → contribution snake → footer wave | People who want to stand out. Needs the snake workflow |
| `minimal` | Calm, writerly | `###` name, italic tagline, one paragraph, "Selected work" list, "Now", tiny skills line, text links. No images | Senior people, writers, people who hate badges |
| `project-cards` | Portfolio-first | Compact header → pin cards in a grid (one per owned repo) → table for non-repo projects → skill icons | People whose repos speak for themselves |
| `neon-terminal` | Flashy hacker | `neon` header + `terminal` console sections + snake | Best of both |

## Interactive designs

GitHub never runs JavaScript in a README, so "interactive" means one of three things. The first two are pure markdown. The last two designs below need GitHub Actions. See `interactive.md` for setup.

| id | Interaction | How it works | Setup |
|---|---|---|---|
| `adventure` | Choose-your-own-adventure | Nested `<details>` "doors": workshop (projects), library (skills), journal (about), radio (contact), a secret room. Short second-person narration in italics | None |
| `interactive-resume` | Expandable resume | Every section is a `<details>` (About open by default). Mermaid `timeline` for the career and a Mermaid `mindmap` for skills, plus a nested `<details>` per role | None. Needs career history from the user |
| `guestbook` | Visitors leave a message | A "Sign the guestbook" badge links to a pre-filled new-issue form. An Action adds the entry between `GUESTBOOK` markers and closes the issue | Workflow + script |
| `poll` | Visitors vote | One badge per option links to a pre-filled `vote: <id>` issue. An Action counts votes in `.github/poll.json` and redraws the bar chart between `POLL` markers | Workflow + script + poll.json |

## Mixing designs

You can combine designs, and people often ask for it. Rules of thumb:
- **Header:** take it from one design, either a banner + typing SVG or a plain name + tagline.
- **Section style:** keep one style for the body, all console blocks or all `##` headings. Mixing them reads as messy.
- **Interactive pieces:** a guestbook or poll section drops into any design. Put it after projects so the profile still leads with who the person is.
- **One heavy animation:** pick the typing header *or* the snake as the centerpiece, not three animated things competing.

## Writing the content

The design is the frame, and the words make it good:
- **Tagline:** 3–6 words. Adjective triplets work ("Tinkerer · Explorer · Builder").
- **About:** 3–5 bullets, each one concrete fact with a number where possible ("cut support time by 80%"), not adjectives.
- **Projects:** 3–6, best first. Each description says what it *does* for someone, in under 12 words. Skip forks, coursework and empty template repos unless the user wants them.
- **Now:** 1–3 lines about what's in progress. This keeps the profile feeling alive.
- **Contact info:** leave out phone numbers and street addresses, even if a résumé has them.

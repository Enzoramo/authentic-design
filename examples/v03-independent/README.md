# Independent v0.3 trials

Three original static prototypes: Malha (knitting), Quintal (seed exchange), Zênite (observation journal). All content and operations are synthetic. Run from this directory:

```sh
python3 -m http.server 8767 --bind 127.0.0.1 --directory dist
```

Then open http://127.0.0.1:8767/ in your browser. No dependencies, account, API key or build step. Progress is stored per prototype in browser local storage. Stopping the server does not remove that progress.

`inputs/` preserves exact functional requests, predeclared evaluation protocol and frozen instructions. The original SKILL.md snapshot is stored as `entrypoint.md` to avoid duplicate installed-skill discovery; its original bytes and hash are preserved. `dist/<case>/` preserves each full submitted output without reviewer edits; each agent's DESIGN.md explains its own choices and limitations. `SHA256SUMS.json` verifies the submitted files. `screenshots/` and `QA.md` contain evaluator observations.

The gallery wrapper and previews are evaluator packaging, not creator outputs. Do not mistake it for a fourth independent design. The three samples are not a controlled comparison against v0.2 or no skill; their style is not proof of authorship or internet-wide uniqueness.

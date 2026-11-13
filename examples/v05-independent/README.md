# Independent v0.5 examples

Revez (loans), Vereda (branching fiction), Minuto (audio chapters). Synthetic data; functional briefs only. See [QA](QA.md) for observed behavior and limits.

## Run

From this directory:

```sh
python3 -m http.server 8769 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:8769 in a browser. No build, accounts or API keys. Progress uses localStorage for that browser origin. Fonts reference local system families with fallbacks; proprietary fonts are not redistributed. Rendering can change when those families are absent.

`dist/` preserves closed creator submissions. The parent-authored index is navigation only, not a fourth independent design. `inputs/` preserves briefs, frozen instructions, preselection source studies and capture exchanges. The frozen `entrypoint.md` has the exact original `SKILL.md` bytes; its filename prevents duplicate skill discovery. `skill-manifest.json` uses the original logical filename.

`*-study-*.jpg` captures alternatives before selection, including an autonomous correction to Vereda's second candidate. `*-ui-*.jpg` captures creator-requested implementation checks, sometimes before final revisions. Bare `*-desktop.jpg`, `*-mobile.jpg`, `*-mobile-320.jpg` are evaluator captures of closed submissions. Screenshots and model tests are not participant research or proof of originality.

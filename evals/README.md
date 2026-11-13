# Evaluating Authentic Design

The cases in [cases.json](cases.json) are behavioral scenarios, not a benchmark leaderboard or an automated quality score. All products and records are synthetic.

## Run a useful comparison

1. Give an independent agent the brief, the skill, and necessary raw inputs. Keep reviewer expectations and previous conclusions out of its context.
2. Use an isolated workspace and avoid live publication or private client data.
3. Preserve the actual artifact, skill version or content hash, model/host information when available, tool availability, and what was verified.
4. Review the output against the case's observable checks and the user's requested scope. Cite evidence from the artifact; do not just count keywords.
5. Compare structurally different briefs and also same-product cases. Reward appropriate consistency; penalize a shared template only when it ignores the task.

To claim improvement over a baseline, run equivalent briefs with and without the skill under comparable conditions, repeat across several runs, and review anonymized outputs. Separate task success, coherence, perceived distinctiveness, accessibility, and implementation quality. A numerical total can hide a serious usability failure.

For implementation cases, inspect rendered output and exercise interactions. A polished specification is not evidence that an implementation works. Participant testing is a separate activity and must be reported separately.

## Initial release evidence

Three independent agent sessions used version 0.1.0 on 2026-11-12. Each received one synthetic brief, the skill, and only the raw requirements needed; the case review criteria and other outputs were not supplied. The author then reviewed the resulting specifications. Exact model identifiers and sampling settings were not captured, so these are exploratory trials rather than a reproducible model benchmark.

| Executed case | Observed result | Evidence and limits |
| --- | --- | --- |
| Repair booking | Symptom-led four-step form; scoped estimates; review; unavailable-slot recovery preserves data. An alternative compares services and availability on one surface. | [Full specification](results/repair-booking.md). Includes calculated contrast pairs and fixture date/time checks. No rendered prototype or participant test. |
| Theater readiness | Ordered cue script with adjacent notes; incomplete checks remain visible without sorting away the sequence. Alternative organizes by department. | [Full specification](results/theater-readiness.md). Includes fixture/count assertions and calculated contrast pairs. No rendered prototype or participant test. |
| Existing system | Search toolbar and Invoice table retain the specified system type, purple accent, 8px controls, navigation, and density. | [Full specification](results/existing-system.md). Written requirements comparison only. |

The booking and theater results differ in task structure, navigation, density, and presentation of state, beyond their colors. The continuity case preserves common visual choices when explicitly required. These are useful observations in three written artifacts, not proof that arbitrary future creations will differ or be usable.

The package also passed the bundled Codex skill creator's structural validator, Markdown file-link checks, and evaluation-case ID checks. Those checks establish packaging integrity only. `SKILL.md` SHA-256 for these trials: `48606f6baffa56ed34c4478db3e1607a2d24f3ae496acf55e91d6112a5175791`.

At the initial release, the remaining five cases in `cases.json` had **not been run**. They remain unexecuted as those exact cases. The separate rendered-interface round below adds browser rendering and interaction evidence; native-platform behavior, participant research, and comparison against a no-skill baseline remain untested. No superiority, universal uniqueness, conversion lift, or user-tested usability is claimed.

## Rendered-interface round and version 0.2.0

[Full report, before/after evidence, and limitations](results/rendered-interfaces.md). Three independent agents implemented synthetic pottery retail, cinema booking, and transport-operation briefs using v0.1.0. The parent reviewed actual browser output, directed corrections, tested desktop/mobile flows, and distilled the observed failures into v0.2.0. These are three new implementation trials, not reruns of the original written cases or proof of independent v0.2 improvement.

## Independent v0.2 round

[Report and original screenshots](results/independent-v02.md), 2026-11-13. Three fresh contexts implemented oral-history reading, cooking assistance and French practice from functional briefs. No extra style direction or post-submission corrections were given. Browser checks covered desktop and 390/320 px. The outputs differed in task model and responsive behavior, but repeated a cool pale surface / dark blue ink / strong sans-serif visual family. The archived v0.2 snapshot is unchanged; all submitted files and input hashes are preserved. This is not a matched v0.1 or no-skill comparison.

## Independent v0.3 round

[Report and original screenshots](results/independent-v03.md), 2026-11-13. Three fresh contexts implemented knitting progress, seed exchange and observation logging. Frozen v0.3, functional briefs only, no post-submission edits. All created visible direction studies (3/3/2); selected relationships carried into the prototypes and tested flows worked. Visual diversity was partial: the knitting and seed apps converged on cream/green/Georgia; all used related serif wordmarks and small-label conventions. Desktop and 390/320 px evidence is preserved. No controlled improvement claim.

## Contributing a regression

Provide the brief, expected observable behavior, actual artifact, and the specific failure. Prefer a narrow repair and a counterexample where the new rule should not apply. Do not grow a style blacklist from a single disliked result.

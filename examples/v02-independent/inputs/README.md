# Frozen trial inputs

The requests preserve the exact local paths supplied to the three authors. Those paths describe the execution environment; use an isolated workspace and adjust paths when reproducing a run.

The skill snapshot is in `skill/authentic-design/`. Its entry file is stored as `entrypoint.md` to avoid registering a second nested skill when this repository is installed. Its bytes and SHA-256 are unchanged from the original `SKILL.md`; `skill-manifest.json` uses the original filename. The reference files retain their original paths and bytes. The immutable source commit is recorded in the evaluation report.

The three submission manifests refer to files relative to their corresponding `dist/archive`, `dist/kitchen`, or `dist/learning` directories. These submitted files were not edited after delivery.

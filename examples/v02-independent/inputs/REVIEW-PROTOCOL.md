# Independent v0.2 trial protocol

Frozen before reading the three submitted outputs, 2026-11-13.

- Each agent receives its REQUEST.md, the same frozen v0.2.0 SKILL.md and references, and an isolated output folder. No conversation history, prior artifacts, other trial output, palette/font/layout reference, or corrective review is supplied.
- The full design skill inherently contains design guidance and examples. "No style hints" means no extra direction in the trial briefs; it does not mean removing the guidance being evaluated.
- Each agent can reason, iterate and check its own code before submission. After submission the evaluator preserves that output, records file hashes and renders the submitted files unchanged.
- Browser access is reserved for the evaluator so three agents do not compete for one browser session. Therefore the independently submitted outputs are not author-browser-validated.
- All three use static HTML/CSS/JS with relative local assets and Portuguese content. Tools, time and context are comparable but no exact model build/sampling metadata is captured.

## Functional observations

Archive: search, topic filter, no-results recovery, complete record reading, add/remove collection, reload persistence.
Kitchen: 2/4/6 scaling, prepared ingredients, method progress/back, reload persistence, finish, restart.
Learning: choose/check, correct and incorrect feedback, one first-attempt score, review only missed items, perfect-session handling, restart.

Use ordinary UI interactions. Inspect opening and changed states at an explicit desktop viewport and actual 390 × 844 / 320 × 740 phone viewports. Check horizontal overflow, visible controls, focus/dismissal when applicable, and console errors. This is not a full accessibility or screen-reader audit.

## Visual observations

Compare information structure, composition and density; type hierarchy and type pairing; surface/accent palette; grouping, borders and corner shapes; meaningful task-specific elements; and repeated ornamental habits. Explain what differs and what is shared with screenshot evidence. Evaluate whether the distinctions follow the task instead of treating any difference as a success. Use no arbitrary numerical originality score.

## Interpretation

Report independent first results as they are, including defects. Do not revise the skill or cosmetically repair the examples during this trial. Any later repair must be labeled separately. Three new tasks and one result each cannot establish causality, universal uniqueness, participant usability or improvement over v0.1 without a matched control. The practical question is whether these independent v0.2 outputs distinguish their tasks and visual decisions without parent style coaching.

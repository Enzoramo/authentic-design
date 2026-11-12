---
name: authentic-design
description: Design and improve web and app interfaces with product-specific UX, art direction, and working interactions. Use for new screens, redesigns, design critiques, or requests to make an interface distinctive and less templated. Preserve existing brand systems and familiar controls; do not activate for unrelated backend work or visual assets without an interface task.
license: MIT
metadata:
  author: Enzoramo
  version: "0.1.0"
---

# Authentic Design

Create an interface whose decisions can be traced to its users, content, and purpose. Distinctiveness is an outcome of specificity, not random variation or a claim about who made it. Optimize for task success, clarity, accessibility, and coherent character together.

## Choose the right amount of design

- **New product or substantial redesign:** establish the task model, explore materially different directions, implement the strongest one, then inspect it.
- **Existing product:** inspect its screens, tokens, components, language, and conventions first. Improve the requested area within that identity. A second screen is not a second brand.
- **Small fix:** make the smallest useful change and check its effect. Do not turn a spacing fix into discovery, rebranding, or a redesign.
- **Critique only:** connect each finding to an observed screen or interaction, its user consequence, and a concrete remedy. Distinguish observation from inference; do not implement without scope.

Use the user's chosen tools, stack, deliverable, and aesthetic. This skill adds design judgment, not authority to install services, publish, buy assets, or inspect unrelated projects. It needs no particular framework, plugin, or external account.

## Ground the work before styling it

Inspect the actual brief, relevant project files, supplied references, and available research. Identify:

- Who is trying to do what, in which situation, on which device?
- What must they understand or decide before acting? What would a costly mistake be?
- Which content, capabilities, constraints, and brand assets are real?
- What is fixed, and where is there room for expression?

Keep **observed facts**, **user requirements**, and **design hypotheses** distinct. Invented personas are assumptions, not research. Never fabricate testimonials, adoption figures, awards, availability, or measured improvements.

Ask only for missing information that materially changes the solution and cannot be inferred. Otherwise state a reasonable assumption and proceed. If the subject itself is missing, ask one focused question; continue only work that does not depend on inventing a business. An explicit request to invent a concept authorizes fictional content, clearly identified as such.

## Design the task, then its expression

For a substantial flow, read [UX and content](references/ux-and-content.md). Establish the main path, the necessary decisions, and the relevant recovery path before polishing screens. Choose information structure from the task: comparison, search, scheduling, reading, monitoring, creation, or something else. A marketing page and a working tool need different structures.

For a fresh identity or a request for meaningful variation, read [Art direction](references/art-direction.md). Explore a small set of plausible directions; two or three usually reveal the tradeoffs. Each direction needs a different organizing idea, not just a different palette. Compare task fit, content fit, recognizability, accessibility, and implementation cost. Select and execute the strongest direction unless the user requested options or approval.

Leave a compact, reviewable decision record, in the response or an existing design document:

> **User task → content structure → expressive idea → decisions → tradeoff → validation.**

Name the actual relationships. “Premium, clean, modern” is not a rationale. Do not produce a design manifesto when the user asked for a small deliverable.

For a selected direction, define only the tokens and rules the interface needs: semantic color roles and usable pairings, type roles and fallbacks, spacing and density, containers, imagery, interaction states, responsive transformations, and motion if useful. Reuse the project's existing system where possible.

## Build specificity into the interface

- Let real objects and decisions determine components. Use a table when comparison matters, a sequence when order matters, and grouping when relationships matter. Do not pour every brief into the same hero, feature cards, testimonials, and CTA sequence.
- Make one or a few connected decisions carry the identity: content organization, type composition, a useful domain-specific interaction, image treatment, or spatial rhythm. Quiet supporting UI makes these decisions legible.
- Preserve learned interaction conventions. Labels, links, focus, navigation, dismissal, and form behavior must remain understandable even when the expression is unfamiliar.
- Use imagery, illustration, and motion when they explain the subject or communicate a state. Source or generate suitable assets with available authorized tools; check actual rights and provenance. When assets are unavailable, build a deliberate typographic or structural alternative and disclose the gap. Never fake assets with broken URLs or imply that an uncreated asset exists.
- Write actual interface copy in the requested language and locale. Label the result of an action. Keep brand voice in proportion to the user's situation, especially during errors or sensitive tasks.
- Make visible controls work within the agreed scope. Identify simulations and missing integrations. Do not create decorative buttons that imply a completed action.
- Keep the implementation maintainable: semantic controls, shared tokens, meaningful components, appropriate dependencies, and no unnecessary visual machinery.

## Challenge the easy answer

Before accepting a substantial design, use these probes:

1. **Substitution:** could another product replace the name and images without changing the structure or interactions? If yes, find the missing product decision. Shared conventions alone are not a failure.
2. **Silhouette:** after ignoring color and decorative details, does this repeat the same hierarchy and composition as the alternatives or available prior work? Revisit the organizing idea when the brief supports a different one.
3. **Removal:** does removing an effect or ornament make the task clearer without losing useful identity? Remove it.
4. **Continuity:** did the pursuit of difference break this product's own system or a familiar control? Restore the useful consistency.
5. **Evidence:** which assertions are checked, inferred, or still unknown? Do not turn a plausible explanation into a user-research finding.

No color, font, radius, grid, gradient, or style is inherently “AI.” Do not replace a recognizable template with a universal anti-template. Keep a familiar choice when the brief justifies it.

When earlier work is supplied or project memory is authorized, compare against it using [Design continuity](references/design-continuity.md). Without that history, describe only the variation actually examined; do not promise never to repeat yourself or claim uniqueness across unseen work.

## Verify the experience and the result

Read [Review and validation](references/review-and-validation.md) for substantial implementations and audits. Scale checks to the changed surface. If rendering and interaction tools are available, inspect the real output at representative sizes and exercise the main action plus relevant failure or recovery behavior. Screenshots alone do not verify interactions, and source inspection does not establish visual quality.

Fix observed blockers, then recheck affected behavior. When tools or data are unavailable, separate implementation from verification and say what remains untested. Do not present self-scoring as proof of usability, accessibility compliance, conversion lift, or originality.

Deliver the requested artifact, a short explanation of the important design decisions, what was actually checked, and any material limitation. Keep exploration notes out of end-user interface copy. If the request was to build, a plan alone is not the deliverable.

## Supporting material

- [UX and content](references/ux-and-content.md): flows, states, content, and research boundaries.
- [Art direction](references/art-direction.md): deriving identity and comparing alternatives.
- [Design continuity](references/design-continuity.md): useful memory without forced novelty or cross-project leakage.
- [Review and validation](references/review-and-validation.md): evidence-based acceptance checks.
- [Sources](references/sources.md): primary references and what they support.

# Review and validation

Use for substantial implementations or audits. Apply checks to the changed surface rather than auditing everything after a small edit.

## Separate the evidence

| Evidence | What it can establish |
| --- | --- |
| Brief and supplied research | Requirements and reported observations |
| Source inspection | Implemented structure and likely behavior |
| Rendered output | Visible composition, clipping, legibility at that state |
| Interaction checks | Observed behavior along tested paths |
| Accessibility tooling | Specific conditions within tool coverage |
| Participant research | Observations from those participants and tasks |

None alone proves usability, broad accessibility conformance, originality, or business impact.

## Inspect what people will use

When tools allow, render the real artifact at representative small and large sizes, with long content, missing data, and relevant states. Responsive behavior should change priorities and layout sensibly, not just shrink everything. Inspect native apps using actual platform conventions and text scaling.

Exercise the main task and a relevant recovery path. Check navigation, back behavior, validation, loading, success, and persistence when required. Verify overlay dismissal and focus return; actions must do what their labels promise.

Screenshots do not replace keyboard or interaction testing. Without a renderer or runtime, inspect what you can and mark visual and interaction verification as incomplete.

Record the actual viewport dimensions from the rendered page. A browser resize request may affect a different tab; a desktop screenshot cannot substantiate a mobile claim. At small widths, inspect the main action and at least one changed state or overlay, not only the top of the page.

Inspect the opening screen before scrolling. In task-oriented tools, excessive titles, summaries, and decorative section markers can push the response out of the workspace. In browsing experiences, assess whether the visible information gives the person a useful next decision. Do not make every page fit one screen; allocate space according to the task.

Check the visual size of decision data in the screenshot, alongside measured contrast. Passing a contrast threshold does not make tiny capacity, price, time, or availability labels comfortable to read. Reduce nonessential copy before shrinking essential information.

## Accessibility as a constraint

Use applicable WCAG criteria and project requirements for web work. These checks are not a complete conformance audit:

- Semantic controls, accessible names, labels, instructions, logical reading and focus order.
- Keyboard operation, visible focus that is not obscured, no traps; no critical hover-only information.
- Measure text/background pairs: WCAG 2.2 AA generally requires 4.5:1 for normal text and 3:1 for qualifying large text, with specified exceptions. Check applicable non-text contrast separately.
- Do not communicate state through color alone; include errors, charts, and selection.
- AA pointer targets generally need 24 × 24 CSS pixels or an applicable exception such as sufficient spacing. Prefer generous touch controls when feasible; follow platform guidance for native apps.
- Check reflow at 320 CSS pixels for vertically scrolling web content, with exceptions for content that requires two-dimensional layout. Test zoom and text scaling; do not disable them.
- Respect reduced motion and provide motion controls where needed.

Consult [primary sources](sources.md) for exact conditions and current platform guidance. Do not call 44-pixel targets a universal WCAG AA requirement or equate a clean automated report with compliance.

## Review identity and finish

Ask whether major decisions belong to this brief, hierarchy reflects task priority, and content works without filler decoration. For a fresh identity, inspect the visual study and the implementation side by side. Distinguish a genuinely different visual treatment from a different task flow inside the same shell. Check type silhouette, rhythm, surface relationships and graphic treatment after ignoring the product name and accent. A small icon or a changed color alone is weak evidence of identity.

Verify the selection countercase: were alternatives treated fairly and rejected for observed tradeoffs, or for unsupported category stereotypes? Compare font roles, the entire color-role bundle and brand construction separately; do not let one distinctive task widget stand in for all three.

For typography and marks, inspect the actual rendered face and case, not just font-stack declarations. Check whether the name inherited a prominent object's treatment without its own rationale. Where a focused comparison was needed, did it keep the composition stable and give the alternate type equal care? Distinguish a task-specific typographic relationship from the same habitual pairing with a new explanation. A different font in every artifact is not a quality target; neither is accepting a repeated relationship because each interface has a different function.

Verify that the selected direction survives a second useful state and the responsive layout. Compare against authorized prior work when available; assess same-product consistency separately. Record the visible evidence and any recurring defaults. Do not infer AI authorship from a style.

Fix task blockers and accessibility failures before cosmetic refinements. Address observed hierarchy, rhythm, or identity problems; recheck affected behavior. If further improvement is speculative, describe a next experiment rather than iterating indefinitely.

When improving the skill from a trial, preserve the original artifact or its revision, record the observed problem, and distinguish an independent first attempt from a reviewer-directed correction. Corrected examples show the repair; they do not by themselves prove that a new skill version will avoid the problem on unseen briefs.

Deliver the artifact and a concise account of checks, observations, and limitations. Distinguish implemented, rendered, interacted with, and tested with participants. Do not award a quality percentage or promise conversion lift without measurements.

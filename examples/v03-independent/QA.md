# Evaluator QA — original v0.3 submissions

Date: 2026-11-13. Chrome, operated through CUA. Source files were collected after each creator declared submission closed; no evaluator edits were made to the prototypes. The gallery wrapper is separate.

## Browser checks

Actual DOM viewport measurements for each product: 1440×900, 390×844 and 320×740. Document scroll width equalled viewport width at the measured states. Phone screenshots include working/scrolled states, not only page tops. This is not a full device or assistive-technology audit.

### Malha

- Initial state: career 1 active, zero completed; sequence step 1 and 48 total.
- Double-clicking the main action advanced once to career 2, one completed; temporary disabled confirmation appeared.
- Undo and reload restored career 1 with zero completed.
- Jumping to 49 and submitting showed the integer 1–48 error, with the dialog retained. The submit button is enabled for invalid input and validation happens on submit; this is not itself a failure.
- Jump to 7 and reload preserved six completed, step 3, the instruction to alternate two meia and two tricô.
- Jump to 48 preserved 47 completed. Completing the final row required confirmation; cancel preserved the current row. Confirming produced 48 completed and no active row.
- Restart asked for confirmation. Escape dismissed and returned focus to the restart control. Restart changed to row 1 / zero; Undo restart and reload recovered 48 completed.
- 390 and 320 px states retained the main action, count and instruction without horizontal overflow. The sequence follows below.

### Quintal

- Initial lot data matched the brief; Coentro was sold out with no reserve action.
- Quantity 7 for six available tomato envelopes was rejected with an explicit limit.
- Quantity 2 led to review showing 24 seeds, Ana, Biblioteca do bairro and Saturday 10–12h before confirmation.
- Confirm reduced tomato availability from 6 to 4 and total envelopes from 14 to 12. Reservation list survived reload with the same two envelopes.
- Mobile cancellation dialog named the two envelopes to be returned. Confirming restored tomato stock to 6 and reservation count to zero.
- Library filter showed exactly tomato and sunflower. Combined search for abacaxi produced an empty state with a working reset.
- 390 px cancellation and 320 px listing were readable without observed clipping/overflow.

### Zênite

- Initial four objects were pending. Lua was saved as seen with a note; Saturno as not seen with a different note.
- Summary separated one seen, one not seen and two pending; it did not conflate failed attempts with pending objects.
- Editing Lua's note and reloading preserved both records and the revised note.
- Combining Planeta with Visto produced an empty filter result and a working clear action.
- At 390 px selecting M42 moved to the editor and focused the object heading; result choices, note and save remained available.
- At 320 px the observed editor state had no horizontal overflow.

## Visual evidence

Each product has a desktop screenshot, phone screenshots, a second meaningful state and its rendered direction study. There are three candidates for Malha, three for Quintal and two for Zênite. The chosen principles appear in implementation: count/instruction/ruler, illustrated inventory rows, and chronological margin with observation page. The evaluator rendered these studies after submission; creators selected from code and did not visually iterate in a browser.

The visual-diversity objective is **partially met, not passed in full**. All three use Georgia for major roles, lowercase serif wordmarks with a final dot and a small line icon, spaced uppercase labels and fine rules. Malha and Quintal are especially close: warm pale backgrounds, dark green text/actions, sage supporting surfaces and similar serif/sans roles. Their task composition differs, but the identity families overlap. Zênite has a distinct dark surface and time margin, yet shares that editorial typographic vocabulary.

Remaining finish concerns: recurring slogans and small secondary metadata add a model habit beyond what the tasks require. For example, Zênite's sequence footer and Quintal's empty-reservation encouragement repeat information; these are review findings, not evidence of AI authorship. No post-submission polish was applied to hide them.

## Source checks rerun by evaluator

- Malha: `node verify.cjs` (12 groups) and `python3 verify-static.py` passed.
- Quintal: `node checks.cjs` (11 groups) passed.
- Zênite: `node verify.cjs` (20 logic checks) passed.

These are creator-authored tests, not an independent quality score. Some use a minimal DOM substitute or pure logic; browser evidence above is separate. Calculated contrast checks cover specified pairs, not complete WCAG conformance. No storage-permission failure or simultaneous-tab race was exercised in the real browser.

## Limits

Three new briefs, one run each, no matched v0.2/no-skill control, no blinded panel, no participants, no native app test and no internet-wide originality search. The static/local constraint reduced asset and tooling variation. Differences from the previous round cannot be attributed causally to the skill change. The round establishes observable exploration behavior and working paths; it does not establish reliable independent brand diversity.

# Browser observations — 2026-11-13

Chrome, through ordinary UI controls. Submitted prototype files were not edited. Desktop screenshots use 1440×900; phones were measured as 390×844 and 320×740 with document scroll widths matching the viewport. The gallery is evaluator-authored, outside the trial submissions.

## Archive

- Search `cadernos` returned only VB-02, whose complete supplied transcript opened by keyboard.
- Save from the reader; Escape returned to the same record. Reload and collection view retained the item. Removing it yielded an empty collection and working recovery to the archive.
- Encontros filter returned the two matching stories. Adding search `oficina` produced no results; clearing search and filters restored the six-story archive.
- 390 px opening view inspected. At 320 px the full-screen reader was scrollable, save worked, and Escape returned focus to the record title after rerender. No horizontal overflow.
- Observed small defect: mobile heading has `bairro,muitas` without a separating space. No correction applied.
- Browser console tool returned no error/warning entries.

## Kitchen

- Four servings: rice 360 g, mushrooms 500 g, stock 1200 ml, onion 2, garlic 2, oil 30 ml, parsley 10 g. Six: 540/750/1800/3/3/45/15. Returning to two restores base amounts.
- Checking rice then changing servings retained the check and displayed a reminder to reconfirm prepared quantities. All seven ingredients could be marked.
- Start, complete step 1 and inspect step 2. Reload retained 6 servings, 7 checks and step 2. Back showed step 1 as review; next restored step 2 without inventing completion.
- Progress to step 4 and explicit finish showed four completed steps. Canceling restart kept the finished state. Confirming restart cleared ingredients and steps and retained 6 servings, as disclosed.
- 390 px uses separate ingredient/preparation controls. At 320 px the current instruction and completion action were readable and operable. Restart dialog width was 282 px; Escape returned focus to restart. No horizontal overflow.
- Browser console tool returned no error/warning entries. One automation selector was ambiguous because both the page and dialog have a Recomeçar button; scoping to the visible dialog resolved it. This was not scored as an app failure.

## Learning

- Verify initially disabled without selection. Wrong `Bonjour → Obrigado` was retained; choices locked and feedback explained `Olá`.
- Five subsequent correct answers produced 5/6, with Bonjour as the only item to review and its first wrong answer preserved.
- Review at 390/320 px, choose Olá, confirm: review 1/1, original 5/6 unchanged.
- New session reshuffled six unique expressions. Six correct answers produced 6/6 and the explicit nothing-to-review state with no review action.
- Focus moves to the question, feedback or result as the flow changes. No horizontal overflow at either phone width.
- Browser console tool returned no error/warning entries. An evaluator text probe initially looked for “Resposta correta” while the UI says “Resposta certa”; visible progress and final score verified the behavior. No app defect was inferred from that wording mismatch.

## Boundaries

Not an exhaustive keyboard, accessibility, screen-reader, storage-failure, cross-tab, cross-browser or user-research evaluation. Source/model assertions reported by the authors are preserved in DESIGN.md and are not mislabeled as parent browser checks. No style fixes or v0.3 instructions were introduced.

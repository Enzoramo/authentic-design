# UX and content

Use for meaningful task flows. A simple form rarely needs a journey map.

## Find the decision structure

Describe the task: actor, trigger, desired outcome, information needed, obstacles, and consequences of error. Start from observed behavior, support issues, requirements, or existing flows. Missing evidence is an uncertainty to manage, not permission to invent a research finding.

Identify the objects people manipulate and their relationships. A booking has a service, location, date, availability, price, and confirmation; the order of those decisions depends on the service. The data model is evidence but does not automatically define navigation.

Choose the simplest path that preserves understanding and control. Fewer clicks are not always better: a review can prevent an expensive mistake. Keep required information near its decision; reveal advanced controls when relevant without hiding essentials.

| Question | Design consequence |
| --- | --- |
| What does the person know on entry? | Context, defaults, orientation |
| What must they decide? | Fields, comparisons, labels, order |
| What can prevent progress? | Validation, permissions, unavailable choices |
| How do they recover or leave? | Back, cancel, edit, retry, undo where feasible |
| What proves the action happened? | Honest status, updated data, confirmation |

Use native or established controls unless the task creates a concrete reason to depart. A novel booking metaphor that obscures dates is worse than a familiar date picker with a coherent presentation.

## Design beyond the ideal state

Include applicable states, not a mechanical checklist on every screen:

- Empty data: explain what belongs here and offer the relevant next action.
- Loading: communicate progress without implying certainty; preserve useful context.
- Invalid input: identify the field, explain a fix, retain valid entries.
- No results: show active constraints and a way to change them.
- Failure, offline, or permission denied: distinguish the cause where known and offer an honest recovery route.
- Success: show the changed result and next useful action; a toast alone may be insufficient for a consequential operation.
- Destructive work: make the consequence clear; support undo where feasible or an appropriate review when it is not.

For prototypes, specify which states are simulated. For implementations, follow actual API and persistence behavior. Never show success before the relevant operation succeeds.

## Make content do real work

Write labels and actions around the user's object and intended result. Keep terminology consistent. Explain necessary technical concepts in context rather than replacing them with vague language.

Use realistic content lengths and variation: long names, missing metadata, mixed statuses, localized dates, currencies, units, plurals, and relevant writing directions. Separate display labels from stored values when required.

A fictional product can have plausible sample records, clearly identified as demo data. Commercial proof, customer quotes, safety claims, and performance metrics require evidence. Do not invent urgency or hide costs, cancellation, or consent choices to improve conversion.

## Existing products and research

Separate observed pain from an attractive redesign idea. Record the issue and its user consequence before changing established navigation. Reuse accessible components and terminology.

When research is in scope, propose a testable task and success observation: “Can a participant change the appointment and identify the new time?” is testable. “Does this feel authentic?” can inform perception but cannot establish task success. Report participant findings only after actual research.

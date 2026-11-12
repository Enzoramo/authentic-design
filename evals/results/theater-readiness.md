# Tonight’s preparation — design specification

**Deliverable:** a screen and interaction specification for a fictional small-theater rehearsal. This document is reviewable design work, not an implemented or rendered application. No real equipment, crew messaging, or live readiness service is involved.

## Basis and boundaries

**Supplied facts and requirements:** a stage manager uses a laptop in a dim backstage space; cues must remain in performance order; missing confirmations must be easy to identify; notes must be inspected without losing place. Three groups exist: lighting, sound, and stage. Some people prefer reduced motion. There is no existing brand, stock library, or backend.

**Working assumptions:** the order in the brief is authoritative; “ready” is the supplied preparation status, not permission to execute a cue; the initial screen is a preparation view rather than a live show caller. The brief supplies a blocker but no separate note bodies, confirmation authors, or timestamps. None will be fabricated.

**Design hypotheses, not research findings:** an ordered list with an adjacent inspector should make it easier to retain sequence context than separate group boards; a dark, low-chrome canvas may suit the stated environment. Both need evaluation with actual users and displays. No adoption or productivity claim is made.

The costly interaction error to prevent is confusing an inspected cue with the next cue to execute. The UI uses **Selected cue**, never “Live,” “Active,” or “Go.” Selection changes only what information is shown.

## Two candidate directions

### A. Cue script with margin notes — selected

**Organizing idea:** one continuous ordered script; readiness is attached to each line and notes occupy its margin. It prioritizes sequence and retaining position while inspecting exceptions.

```text
Tonight’s preparation                    Fictional rehearsal · Demo data
2 of 4 cues ready · 2 need attention
Lighting 2/2 ready     Sound 0/1 ready     Stage 0/1 ready

Cue order                         Selected cue
01 L12 Warm preset   Ready        02 / 04 · Sound
02 S08 Storm         Awaiting ←   S08 · Storm
03 C03 Clear chair   Blocked      Awaiting check
04 L13 Blackout      Ready        Notes
                                  No notes provided for this cue.
[Next unresolved cue]             [Previous cue] [Next cue]
```

The cue ID is the strongest row anchor; title follows; group and written status support scanning. A restrained vertical rule at the selected row connects the script and inspector. Expression comes from cue numbering, aligned IDs, and the relationship between list and margin—not a theatrical illustration. Familiar list buttons and panel headings keep navigation recognizable.

**Tradeoff:** an inspector takes width, and equal access to group work is secondary. Implementation is modest: one ordered collection, a selected ID, and a responsive detail region. No third-party assets are needed.

### B. Department readiness board with a sequence ruler

**Organizing idea:** three department work surfaces support readiness preparation; a narrow ordered ruler above them preserves the shared sequence.

```text
Tonight’s preparation        2 need attention
Sequence: [01 L12]—[02 S08]—[03 C03]—[04 L13]

Lighting              Sound                Stage
2 / 2 ready           0 / 1 ready           0 / 1 ready
01 L12 Warm preset    02 S08 Storm          03 C03 Clear chair
   Ready                 Awaiting check       Blocked
04 L13 Blackout                             Missing prop
   Ready

Selected cue notes expand inside its department column.
```

This prioritizes identifying which department needs attention. Wider department headings and vertically stacked preparation entries make group ownership the primary hierarchy. The sequence ruler is persistent and selecting either representation highlights the same cue. On a phone, departments become a single stack below the ruler, which must wrap in order.

**Tradeoff:** duplicated cue representations and cross-column reading create extra work for preserving execution order. Expanding notes can shift other entries in a department. Keyboard users need clear names distinguishing sequence navigation from detail controls. Implementation must synchronize the ruler and board; a narrow viewport makes that relationship less immediate.

### Selection rationale

| Criterion | A: cue script | B: department board |
| --- | --- | --- |
| Main task fit | Order remains the dominant structure throughout inspection | Department preparation is strongest; global order is secondary |
| Content fit | Four supplied cues read directly, with no duplication | Sparse columns; lighting occupies two positions in the sequence |
| Recognizability | Ordered list, explicit buttons, adjacent details | Familiar board, but a second linked representation needs explanation |
| Accessibility | One cue navigation path and one details region | Two linked navigation paths; more reading-order decisions |
| Cost and assets | Simple responsive regions; typography only | Synchronized representations and more complex responsive handling |

**Choose A.** It directly serves the required sequence and place retention. B is a materially different information model worth testing if departmental coordination becomes the primary job; the current brief does not establish that priority.

## Selected screen: content and hierarchy

Visible heading: **Tonight’s preparation**. Supporting badge: **Fictional rehearsal · Demo data**. No invented production title, calendar date, connection indicator, or live clock.

The first summary reads **2 of 4 cues ready** and **2 need attention**. “Need attention” includes both an awaiting check and a blocked cue; these remain distinct in the list. The group summary is static text, not an unexplained clickable metric:

- **Lighting — 2 of 2 ready**
- **Sound — 0 of 1 ready**
- **Stage — 0 of 1 ready**

Below it, the ordered list is the primary surface. Do not split it into groups, sort by status, drag to reorder, or remove ready cues when reviewing exceptions.

| Position | Cue | Title | Group | Visible status |
| --- | --- | --- | --- | --- |
| 01 | L12 | Warm preset | Lighting | ✓ Ready |
| 02 | S08 | Storm | Sound | ! Awaiting check |
| 03 | C03 | Clear chair | Stage | × Blocked · Missing prop |
| 04 | L13 | Blackout | Lighting | ✓ Ready |

Initial selection: **L12**, establishing the start of the supplied sequence. The first attention action is **Review 2 unresolved cues**. It selects S08 without changing order. Once there, show **Unresolved 1 of 2** and **Next unresolved cue**; at C03 show **Unresolved 2 of 2** and **Back to first unresolved**. This last label makes the wrap explicit. Attention navigation is optional; each row can also be selected directly.

Each row is a button with the accessible name formed from position, ID, title, group, and status, for example: **“Cue 2 of 4, S08, Storm, Sound, Awaiting check. Inspect cue.”** Visual selection uses a side rule, the word **Selected**, and a different surface; it never resembles a change to preparation status. Use an ordered list with native buttons rather than declaring a grid unless grid keyboard behavior is actually implemented.

The inspector is a named region headed **Selected cue**. For C03 it contains:

> **03 of 04 · Stage**  
> **C03 · Clear chair**  
> **Blocked**  
> **Blocker**  
> Missing prop.  
> **Notes**  
> No further notes provided for this cue.  
> **Previous cue** · **Next cue**

For S08, display **Awaiting check** and **Readiness confirmation is missing.** Under Notes: **No notes provided for this cue.** Ready cues show **Ready** without invented check details. The inspector repeats key status so it remains understandable on a narrow screen. There is no fabricated long note merely to fill space.

This screen supports reviewing preparation. It does not offer “Confirm ready,” “Send reminder,” or note editing because the brief provides no confirmation authority, communication integration, or storage. Those controls would promise capabilities outside the agreed scope. A later implementation can add them with a real data model; this specification does not imply that review changes status.

## Layout and visual rules

At **1024 CSS px and wider**, use a 64% list / 36% inspector split inside a container up to 1440 px wide, with 24 px outer padding and a 24 px gutter. Keep the summary shallow; the first cue follows within the opening viewport on a typical laptop. The list is document content, not a second nested scroll area. The inspector can be sticky with a 16 px top inset when its content fits; long notes return it to normal flow so the document owns scrolling.

At **720–1023 px**, use the same ordered list but expand detail directly below the selected row. At **320–719 px**, each row becomes two lines: ID + title first, group + status second. Position sits in a narrow leading column. Detail becomes a third full-width section. Use 12–16 px page padding. Wrap “Blocked · Missing prop” rather than truncating it. Do not require horizontal scrolling.

Only one inline inspector is open. Before replacing it, preserve the clicked row’s top position relative to the viewport, then reveal the detail below it. On first opening a row, do not scroll it away to focus the notes. A visible **Close notes** button collapses detail and returns focus to that cue’s button. The cue remains selected. A collapsed selected row says **Open notes**. This preserves the place even after dismissal.

Use a system sans-serif stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Cue IDs use `ui-monospace, SFMono-Regular, Consolas, monospace` and tabular numerals. No font download or image assets. Type roles: heading 24/30 px, cue IDs and titles 18/24 px, body and status 16/24 px, supplementary labels 14/20 px. Do not use all-caps paragraphs. Allow user zoom and text enlargement.

Spacing unit: 4 px. Use 8 px between related text, 16 px row padding and section gaps, 24 px between primary regions. Rows have at least 72 px height at the laptop baseline and grow with wrapping. Button targets are at least 44 × 44 CSS px as a chosen comfort target, with 8 px separation. Use 6 px corners for controls and small status labels; avoid card-within-card framing. Separators communicate row boundaries without shadows.

| Token | Value | Use |
| --- | --- | --- |
| Canvas | `#11161B` | Page background |
| Panel | `#1B242C` | Inspector and controls |
| Selected surface | `#25313B` | Selected cue row |
| Primary text | `#E7EDF2` | Titles and body |
| Secondary text | `#B6C2CC` | Group labels and supporting copy |
| Ready | `#A5D8BC` | Ready text and check symbol |
| Awaiting | `#F5CC82` | Awaiting text and exclamation symbol |
| Blocked | `#FFB2AE` | Blocked text and cross symbol |
| Focus / selection rule | `#91C9FF` | Visible focus and selected-row rule |
| Control boundary | `#677986` | Essential control edges |

Status color never fills a large bright area and never carries meaning alone. Use the written status and symbol together. Focus is a 2 px outline with 3 px offset; keep it distinct from the selected-row rule and unobscured by sticky content. Hover may underline the cue title; essential information is visible without hover. Pressed controls change surface immediately. Default motion is none: no auto-advance, pulsing blockers, sliding panels, or smooth scroll. Reduced-motion preference therefore receives the same complete information and interactions.

## Interaction and recovery contract

| Trigger / state | Result and recovery |
| --- | --- |
| Select a cue with pointer, Enter, or Space | Update the inspector in place. Keep focus on the triggering cue button. Announce a short polite message, e.g. “S08 selected. Awaiting check.” Do not announce the entire note body. |
| Read notes by keyboard | A visible **Read selected cue notes** link follows cue navigation and focuses the inspector heading. Inspector provides **Back to selected cue**, restoring focus and revealing that row only if needed. Keep normal Tab behavior; no custom arrow-key scheme or single-letter shortcuts. |
| Next / Previous cue inside inspector | Change selection to the adjacent cue in the full order. Keep focus on the navigation control and announce the new cue. Disable Previous at the first cue and Next at the last cue. If a boundary change disables the focused control, move focus to the inspector heading and announce its position. Keep the selected row visible with immediate, minimal scrolling only if offscreen. |
| Review unresolved cues | Select S08, then C03. Ready rows stay visible. No row changes status simply because it was inspected. On narrow screens the same row receives inline details. |
| Close inline notes / leave inspector | Return to the selected cue. Preserve selection and document position; do not jump to the top. On desktop the inspector is persistent and needs no dismiss control. |
| Missing notes | Display the exact empty copy above. Do not show a skeleton or error for absent note content. |
| Long notes in a future fixture | Wrap text and URLs, retain paragraphs, and keep the entire body available. Inline detail grows in document flow. Reaching the bottom exposes **Back to selected cue** again. Do not clip to a teaser that hides operational information. |
| No cues supplied | **No cues added for tonight.** Supporting copy: **The cue order will appear here when a cue list is available.** Remove misleading readiness fractions and attention controls. There is no import button until import exists. |
| No unresolved cues in another dataset | **All 4 cues are ready.** Replace attention navigation with plain text **No unresolved cues.** Do not equate preparation readiness with starting a performance. |
| Browser reload | Reload the supplied four-cue demo and select L12. No saved position or edits are claimed. A future persistence layer must specify its own restoration behavior. |
| Invalid or unavailable fixture in a future prototype | **Cue list could not be loaded.** Action **Try again** reloads the fixture. Do not convert unknown statuses into Ready. Preserve the last successfully displayed list if one exists, labeled **Previous data — reload failed**. This is an implementation requirement, not an observed current error. |

No offline or synchronization badge is shown in this static specification; there is no service whose connectivity can be measured. Loading, failures, and subsequent datasets above are specified recovery cases, not live behavior claimed to exist.

## Decision record and design challenges

**User task → content structure → expression → decisions → tradeoff → validation:** prepare tonight’s ordered cues and find incomplete checks → one immutable cue sequence, group summary, selected-cue detail → a typographic cue script with margin notes → aligned cue IDs, explicit status language, attention navigation without filtering, inline narrow-screen detail → less room for simultaneous departmental comparison → inspect the written scenario and numerical color pairs now; render and test the interaction contract in a subsequent implementation.

- **Substitution:** the order is not an interchangeable dashboard layout. Cues are identified independently of department and inspected without sorting; “unresolved” moves through exceptions while the complete performance sequence stays visible.
- **Silhouette:** A has one ordered vertical sequence plus a margin; B has three group columns plus a linked sequence ruler. This comparison is only against the two candidates here; no claim about unseen work or universal originality is made.
- **Removal:** stage curtains, spotlights, waveform ornament, animated readiness, and stock theater photos add no required information. None is included.
- **Continuity:** there is no supplied brand to preserve. Native button behavior, ordinary document scrolling, and explicit return links preserve learned conventions.
- **Evidence:** requirements come from the brief. Dark appearance and adjacent notes are design hypotheses. Numerical contrast was calculated; visual quality and usability remain untested.

## Actual checks and remaining validation

Performed a static content audit and checked the artifact’s cue table with a local Python script: the sequence is L12 → S08 → C03 → L13; all four titles, departments, statuses, and the supplied missing-prop blocker are retained. Script assertions passed for the four IDs, order, status counts, blocker, and department totals. Counts reconcile to two ready, one awaiting check, one blocked; department counts are 2/2, 0/1, and 0/1. Walked the specified scenario on paper: entry at L12 → review S08 → read notes → return to S08 → next unresolved C03 → close inline detail while keeping C03 selected. This is a specification consistency check, not an interaction test.

Calculated sRGB relative-luminance contrast ratios with a local Python script for the proposed flat color pairs:

| Pair | Ratio |
| --- | --- |
| Primary / canvas | 15.41:1 |
| Secondary / canvas | 10.03:1 |
| Primary / panel | 13.33:1 |
| Secondary / panel | 8.67:1 |
| Ready / panel | 9.85:1 |
| Awaiting / panel | 10.37:1 |
| Blocked / panel | 9.16:1 |
| Focus / panel | 8.99:1 |
| Control boundary / panel | 3.49:1 |
| Primary / selected surface | 11.25:1 |

These measurements establish only those specified color pairs; they do not establish accessibility conformance or legibility on an actual dim backstage display. Other pairings require checks if introduced.

**Not performed:** rendering, browser interaction, screen-reader operation, zoom/reflow checks, operating-system reduced-motion verification, or participant sessions. The ASCII compositions are structural sketches, not screenshots. No application, backend, assets, or research findings are claimed.

**Next implementation acceptance checks:** render at 1280 × 800, 768 px, and 320 px widths; verify text enlargement and long-note wrapping; exercise pointer and keyboard selection, both navigation loops, inline collapse and focus return; confirm no automatic scrolling while reading; inspect a failed fixture load and empty list; test reduced motion and focus visibility. A participant task should ask a stage manager to identify both unresolved cues, read C03’s blocker, and name the cue following it without losing their place. Observe errors and recovery rather than asking only whether the design looks appealing.

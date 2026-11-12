# Browser verification record — 2026-11-12

All records are fictional. Chrome was operated through normal visible controls. Final desktop captures are 1470 × 779 CSS pixels; earlier captures used a taller desktop viewport. Mobile widths were measured from the actual page: 390 × 844 and 320 × 740.

| Prototype | Observed checks |
| --- | --- |
| Barro | Small €24 / medium €34 selection; large disabled; increment €24→€48; decrement and minimum 1; small + medium = €58; both removals and empty state; reload retains bag; Escape and close restore action focus. 320 px bag dialog remains usable; no document overflow at 320/390. |
| Margem | Three dates and all nine supplied sessions; sold-out Saturday 21:00 disabled; film details and Escape return; 24-seat map with occupied controls disabled; choose C4 then B2 with keyboard; confirmation €6 and correct film/date/seat; reopening disables reserved B2; B2 available in a different session; 320 px seat selection and confirmation through scrollable dialog; no document overflow at 320/390. |
| Linha | Delayed filter contains lines 24 and 31; detail and route match selection; R01→24 leaves observed +8 min; R01 unavailable for 31; R02→31 yields zero free reserves and retains +4 min; undo both restores two reserves; on-time 12 has no assignment form; filtering from 12 selects visible 24; 390/320 mobile detail and explicit return restore selected-row focus; 320 px assignment and undo succeed. |
| Gallery | Three preview images load; links point to matching prototype folders; images preserve whole screenshots; no overflow at 390 px. |

The transport action bottom was measured at about 673 px in the 779 px final desktop viewport. Ceramic/cinema dialog focus and keyboard activation were exercised, but this is not an exhaustive keyboard or screen-reader audit. No error/warning console records were returned during the final prototype checks. JavaScript syntax, SVG parsing, and local asset references were checked separately.

The initial outputs and screenshots are preserved in baseline/ and screenshots/*-before.jpg. Revisions are reviewer-directed, not a new independent v0.2 run. There was no participant study, native-app build, no-skill control, blinded rating or cross-browser test.

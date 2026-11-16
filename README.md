# Physics-Informed Intrusion Detection for Vehicle CAN Bus Networks

CSE 4531 Computer Security research project, UIU, Fall 2026.

**The one question we are answering:**

> On a real car's decoded CAN signals, does adding known physical relations to an attack detector improve detection of signal-tampering attacks, at the same false-alarm budget, compared with a detector that only learns from data?

## The two working files

| File | Use it for |
|---|---|
| [project_proposal.md](project_proposal.md) | Understanding the project: motivation, background, related work, gap, research questions, scope, data, method, evaluation, risks, slide outline, likely questions. |
| [glossary.md](glossary.md) | Short plain explanations of every technical term used in the other two files. |
| [implementation_guide.md](implementation_guide.md) | Doing the project: fourteen steps from setup to final results, each with what to do, what to check, and when it is done. |

If an idea is not in these two files, it is out of scope until the files are changed on purpose.

## Other folders

| Path | What it is |
|---|---|
| [course/](course/) | Course catalogue and marking rubric. |
| [references/](references/) | Papers we have as files. `ISI_2026_Princy.pdf` is background on physics-informed detection for vehicle platoons; it is related work, not our method. |

## Status

- Proposal slides: not made yet. Build them from the slide outline in the proposal file.
- Dataset: downloaded to `data/` (not to be shared). Steps 2 and 3 done: all needed signals exist and behave sensibly; see `decisions.md` and `results/`.
- Next: steps 4 and 5 (split the recordings, fit the physical relations, apply the gate).
- No detector has been built and no experiment has been run.

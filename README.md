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

## Proposal presentation (Stage 1): start here if you are presenting

Everything for the 5-minute proposal pitch is in [presentation/](presentation/).

| File | Use it for |
|---|---|
| [CAN_IDS_proposal_pitch_v4.pptx](presentation/CAN_IDS_proposal_pitch_v4.pptx) | **The final slides** (8 slides, editable). Fill in the `[bracketed]` group number, names, IDs and instructor on slides 1 and 8. |
| [CAN_IDS_proposal_pitch_v4.pdf](presentation/CAN_IDS_proposal_pitch_v4.pdf) | The same slides as a PDF, as a backup for the projector. |
| [speech.md](presentation/speech.md) | **What each member says.** Member 1: slides 1–2. Member 2: slides 3–5. Member 3: slides 6–8. About 5 minutes in total. |
| [terms_explained.md](presentation/terms_explained.md) | Every technical word on the slides, explained in plain language. |
| [defense_qa.md](presentation/defense_qa.md) | Questions the teacher may ask, with short, honest answers. |
| [defense_and_methodology.md](presentation/defense_and_methodology.md) | Longer version: the detailed methodology (data, physics, the four detectors, training, evaluation) and the critic's review. |
| [slide_guide.md](presentation/slide_guide.md) | How each slide is laid out and why (colours, fonts, visuals). |
| [build_deck.js](presentation/build_deck.js) | The script that generates the slides. Needs Node.js with `pptxgenjs`, `react`, `react-dom`, `react-icons` and `sharp`. Most people won't need it. |
| [notes_from_speech.py](presentation/notes_from_speech.py) | Copies the text of `speech.md` into the slides' speaker notes (`python notes_from_speech.py speech.md CAN_IDS_proposal_pitch_v4.pptx`; needs `python-pptx`). Run it after editing the speech. |

Suggested order for a new member: speech → terms explained → defence Q&A → slides.

## Other folders and files

| Path | What it is |
|---|---|
| [decisions.md](decisions.md) | Log of every data finding and every choice we changed, with reasons. |
| [results/](results/) | Data checks so far: file inventory, signal check and signal plots. No detector results yet. |
| [src/](src/) | Code. `inventory.py` checks the data files; `scratch/` holds a rough feasibility test (not a result). |
| [course/](course/) | Course catalogue and marking rubric. |
| [references/](references/) | Papers we have as files. `ISI_2026_Princy.pdf` is background on physics-informed detection for vehicle platoons; it is related work, not our method. |
| `data/` | The dataset (not in Git; download it yourself from IEEE DataPort, see `implementation_guide.md` step 2). |

## Status

- Proposal slides: done (v4, see above).
- Dataset: downloaded to `data/` (not to be shared). Steps 2 and 3 done: all needed signals exist and behave sensibly; see `decisions.md` and `results/`.
- Next: steps 4 and 5 (split the recordings, fit the physical relations, apply the gate).
- No detector has been built and no experiment has been run.

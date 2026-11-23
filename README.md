# Physics-Informed Intrusion Detection for Vehicle CAN Bus Networks

CSE 4531 Computer Security research project, UIU, Fall 2026.

**The one question we are answering:**

> On a real car's decoded CAN signals, does adding known physical relations to an attack detector improve detection of signal-tampering attacks, at the same false-alarm budget, compared with a detector that only learns from data?

**Where this sits (revised 2026-11-22).** Physics-informed attack detection already exists, including a with-and-without-physics comparison on simulated vehicle platoons [13]. We test whether that gain holds on a public real-car CAN dataset under stricter rules. We do not claim to be first. Reasons and sources: [decisions.md](decisions.md), entry of 2026-11-22.

## The working files (source of truth)

| File | Use it for |
|---|---|
| [project_proposal.md](project_proposal.md) | Understanding the project: motivation, background, related work, gap, research questions, scope, data, method, evaluation, risks, likely questions, and how far each source was read. |
| [proposal/proposal_v2.md](proposal/proposal_v2.md) | The revised 2 to 3 page proposal (short version of the file above). |
| [proposal/figures/methodology_flowchart.pdf](proposal/figures/methodology_flowchart.pdf) | The whole method on one page. Also `.svg`, `-preview.png`, and the `.json` spec to edit it. |
| [glossary.md](glossary.md) | Short plain explanations of every technical term used in the other two files. |
| [implementation_guide.md](implementation_guide.md) | Doing the project: fourteen steps from setup to final results, each with what to do, what to check, and when it is done. |

If an idea is not in `project_proposal.md` or `implementation_guide.md`, it is out of scope until those files are changed on purpose and the change is logged in `decisions.md`.

## Proposal presentation (Stage 1, already presented)

Everything for the 5-minute proposal pitch is in [presentation/](presentation/). Kept as a record and not updated. Its gap framing ("learned detectors or physics rules, nobody combined them") is **superseded**; use `project_proposal.md` for the current position.

| File | Use it for |
|---|---|
| [CAN_IDS_proposal_pitch_v4.pptx](presentation/CAN_IDS_proposal_pitch_v4.pptx) | **The final slides** (8 slides, editable). Fill in the `[bracketed]` group number, names, IDs and instructor on slides 1 and 8. |
| [CAN_IDS_proposal_pitch_v4.pdf](presentation/CAN_IDS_proposal_pitch_v4.pdf) | The same slides as a PDF, as a backup for the projector. |
| [speech.md](presentation/speech.md) | **What each member says.** Member 1: slides 1–2. Member 2: slides 3–5. Member 3: slides 6–8. About 5 minutes in total. |
| [speech_bn.md](presentation/speech_bn.md) | The same speech in everyday Bangla-English mix (Banglish), for practice and understanding. |
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
| [references/](references/) | Papers we have as files. `ISI_2026_Princy.pdf` is Philip et al. [13], the closest prior work: the same network with and without a physics loss, on simulated platoon data. We test whether its finding holds on real-car CAN data. Venue still to confirm. |
| `data/` | The dataset (not in Git; download it yourself from IEEE DataPort, see `implementation_guide.md` step 2). |

## Status

- Proposal slides: presented (v4, see above).
- Novelty claim revised after supervisor feedback; revised proposal and methodology flowchart in `proposal/`.
- Dataset: downloaded to `data/` (not to be shared). Steps 2 and 3 done: all needed signals exist and behave sensibly; see `decisions.md` and `results/`.
- Next: steps 4 and 5 (split the recordings, fit the physical relations, apply the gate).
- No detector has been built and no experiment has been run.

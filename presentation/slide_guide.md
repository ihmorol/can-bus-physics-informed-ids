# Proposal pitch: slide guide (v4)

Files: [CAN_IDS_proposal_pitch_v4.pptx](CAN_IDS_proposal_pitch_v4.pptx) (current, editable) and [CAN_IDS_proposal_pitch_v4.pdf](CAN_IDS_proposal_pitch_v4.pdf) (backup for the projector). [build_deck.js](build_deck.js) regenerates the deck. The full spoken script is in each slide's **speaker notes**. For panel questions, use [defense_and_methodology.md](defense_and_methodology.md).

## The story in one line per slide

Each slide answers the question the previous one raises.

1. **Who we are and what we ask:** can a car's physics catch attackers?
2. **Problem:** an attacker can send false values that look normal, and current detectors either miss them or raise too many false alarms.
3. **Idea:** a car's signals must agree with each other, so a false value stands out.
4. **Gap and novelty:** detectors use learning *or* physics; nobody we found has compared them fairly.
5. **Approach:** four detectors, one fair test.
6. **Questions and contribution:** what we will find out, why any answer helps, and our honest scope.
7. **References.**
8. **Thank you:** a one-sentence summary, then questions.

The deck uses only one number: "up to ~40% false alarms" [3]. It is there because it proves the motivation. All dataset statistics and early measurements have been removed.

## Time plan (5 minutes)

| Speaker | Slides | Time |
|---|---|---|
| 1 | 1 Title, 2 Problem | 40 s + 60 s |
| 2 | 3 Idea, 4 Gap and novelty, 5 Approach | 50 s + 45 s + 50 s |
| 3 | 6 Questions, 7 References (shown only), 8 Thank you | 40 s + 5 s + 15 s |

The words to say are in [speech.md](speech.md).

## Design
- **Fonts:** Cambria for titles, Calibri for body text. Both come with Office.
- **Sizes:** titles 24 to 26 pt, written as plain sentences and left-aligned; body text 13 to 15 pt; no footer.
- **Colours keep one meaning throughout:** teal = physics and our study; red = attacker or altered value; dark slate = neutral parts; grey = notes.
- **Slide frames:** the title and thank-you slides are dark, the content slides white. The same CAN bus drawing opens and closes the talk.

## Slide by slide

### 1. Title (Speaker 1)
- **Left:** course line, title, and the one-line question. Below them, the group block: group number, section, three names with student IDs, and the instructor. **Fill in every [bracket].**
- **Right:** a CAN bus drawing with five control units and a red Attacker box joined by a dashed line.

### 2. "An attacker can send false sensor values at completely normal timing" (Speaker 1)
- **Left:** a chart with no axis numbers. The blue line is the real speed; the red line is the frozen value the attacker sends. A grey "Threat" box underneath states the threat model: an attacker on the bus silences one unit and sends its messages on time [1][7]. The first card adds that researchers have hijacked real cars this way [11][12].
- **Right:** three cards with icons: no sender check (padlock), timing looks normal (clock), too many false alarms (red bell, the only number in the deck).
- **Transition:** "So we need a detector that catches false values without crying wolf."

### 3. "Our idea: a car's signals are bound to agree with each other" (Speaker 2)
- **Left:** a hub diagram. "Vehicle speed" sits in the centre, linked to wheel speeds, acceleration, turning rate, and engine speed and gear. The wheel-speed box is red ("altered by attacker") with a broken dashed link.
- **Right:** three numbered steps. (1) Physics links the signals. (2) Attacks break the links, and to hide, an attacker must fake several units at once, which we test. (3) An example check: alarm when average wheel speed and gearbox speed disagree more than usual.
- **Transition:** "But is that new?"

### 4. "Detectors use either learning or physics; we found no fair comparison" (Speaker 2)
- **Left:** a 2×2 grid (learns from data / fixed rules × no physics / uses physics). "Our study" is the teal cell, with a small note that a "PINN for CAN" paper also exists [10]. A grey note says the gap is based on the sources read so far and will be confirmed by the literature review.
- **Right:** three cards, "What is new": a fair comparison on the same real-car data; two ways of adding physics; an honest test of what physics cannot catch.

### 5. "How we will carry out the study" (Speaker 2)
- **Top:** five arrows: real driving data → learn normal driving → add physics checks → insert attacks (red) → compare detectors.
- **Middle:** four detector cards. D1 physics only; D2 data only (baseline); D3 physics as input; D4 physics in training.
- **Bottom:** a red-labelled "Attacks tested" line (freeze, drift, offset, replay, whole message, physics-consistent) and a teal "Fair test" strip: public real-car recordings [1], train on normal driving only, alarm level set first, tested on drives never seen before. This covers the data and evaluation points the rubric asks for.

### 6. "Research questions and expected contribution" (Speaker 3)
- **Left:** RQ1 to RQ4 with round badges. RQ1 is teal because it is the main question.
- **Right:** a teal "Expected contribution" card (any answer is useful) and a grey "Scope and limits" card (one car, attacks inserted into recordings, no hardware).

### 7. References
Numbered as in the written proposal. Show it briefly; do not read it aloud.

### 8. Thank you (Speaker 3)
A one-sentence summary of the whole talk, the group line, and the CAN bus drawing again. Then open the floor for questions.

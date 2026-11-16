# Defence notes and detailed methodology

A study sheet for all three presenters. Sources: `project_proposal.md` (numbers in brackets are its references), `implementation_guide.md`, `decisions.md`.
Labels used below: **Known** = checked in a source or in our data. **Our choice** = a setting we picked; it can change only before test results are seen, and every change is logged in `decisions.md`.

---

## 1. The story in four lines

1. **Problem:** a car's CAN bus has no sender authentication. An attacker on the bus can replace a value such as wheel speed while sending messages at the normal rate, so timing-based detectors miss it [3][8].
2. **Why it matters:** signal-level detectors can see such attacks, but the closest recent one raises false alarms 17.5% to 39.6% of the time [3]. A detector that cries wolf that often is unusable in a car.
3. **Idea:** a car's signals are linked by physics (four wheel speeds must match vehicle speed, and so on). A falsified value breaks those links.
4. **Contribution (candidate):** a controlled comparison. Using the same public real-car data and the same false-alarm budget, we measure what physics adds to a learned detector, and where it adds nothing.

## 2. Why it matters (say this if asked "so what?")

- Value tampering is the attack that timing-based IDSs cannot see, and value changes are what affect speed and steering decisions.
- False alarms decide whether an IDS can be deployed. That is why we fix the false-alarm budget first and only then compare detection.
- Physics detectors exist [7][8] and learned detectors exist [1][3][4], but builders have no evidence on whether combining them is worth it. Our result answers that for one real car, whether the answer is yes or no.

## 3. Novelty: what we claim and what we do not

**Claim:** in the ten sources we read, no study compares physics checks, a learned detector, and learned detectors with physics added, on the same public decoded-signal data at the same false-alarm budget on unseen recordings. That comparison is our contribution.

**Do not claim:** the first physics-informed CAN detector (the phrase "PINN for CAN" is already used [10]); a PINN in the strict sense; attacks on a real vehicle; results for other cars; publication.

**If a reviewer names a paper that already does this:** "Our gap is a candidate from a limited search. The Stage 2 review will check it. If it is already done, our work becomes a replication on public data, which is still a valid course project."

## 4. What already exists in the workspace (as of 16 Nov 2026)

| Done (verified) | Where |
|---|---|
| Dataset downloaded and integrity checked (1.19 GB, 133 parquet files) | `data/` (not shared), `decisions.md` |
| Inventory: 7 normal recordings + 126 attack files, all on an exact 5 ms grid, 688 signals + label | `results/inventory.csv` |
| Every needed signal present, no missing values; meanings checked against the data | `results/signal_check.md`, `results/plots/` |
| First-look relation strength (R1 r ≈ 0.999 … R4 0.77–0.87) | `decisions.md` |
| Rough feasibility pilot (one-wheel edits on dump2) | `src/scratch/pilot_feasibility.py`, `decisions.md` |

**Not done yet:** recording split, relation fitting and the keep/drop gate (steps 4 and 5), attack injector, all four detectors, thresholds, evaluation. **No detector has been built and no experiment has been run.** Say this plainly if asked.

## 5. How the data comes in (step by step)

1. **Source:** X-CANIDS signal dataset [1], a real Hyundai LF Sonata 2017 recorded through the diagnostic port. The signals were decoded with the public file `hyundai_2015_ccan.dbc` [2].
2. **Recordings (Known):** dump1–dump6 are driving (23.9 to 36.4 min each, about 171 min in total); dump7 is idling (36.9 min). The dataset's attack files are all built from dump6.
3. **Time grid (Known):** every file is already on an exact 5 ms grid, holding the last received value, so no resampling is needed.
4. **Signals used:** the four wheel speeds; dashboard speed `CF_Clu_Vanz`; engine-unit speed `VS`; gearbox-unit speed `VS_TCU`; `LONG_ACCEL`, `LAT_ACCEL` and `YAW_RATE` (ESP12); engine speed `N`; target gear `CF_Tcu_TarGr`; `SAS_Angle`; plus `TEMP_ENG` as a **control** signal that has no physical partner.
   - `CUR_GR` turned out to be the lever position stored as text (P/R/D), not a gear number, so target gear is used instead.
5. **Split by whole recording (Our choice):** dump6 is test only (its normal version plus all attack versions). One other driving recording is used for validation, the rest for training, and dump7 is kept aside as an extra false-alarm check. The split is written once to `work/split.json` and never changed.
6. **Low-speed mask (Our choice):** relations are checked only above 5 km/h, because at standstill they mean nothing.
7. **Scaling:** mean and spread are computed from training recordings only. Nothing is tuned on dump6.
8. **Windows (Our choice, used by D2–D4):** 1 s windows (200 rows at 5 ms), moving forward 0.1 s at a time.

## 6. How physics comes in

### 6.1 The five relations
For every relation the *form* is known physics. The *constants* for this particular car are unknown, so they are fitted by least squares on training recordings. Speeds are converted from km/h to m/s where they are mixed with m/s².

| ID | Relation fitted | Why it should hold | Known trouble spots |
|---|---|---|---|
| R1 | other-unit speed ≈ k · mean(4 wheel speeds) + b, separately for `CF_Clu_Vanz`, `VS`, `VS_TCU` | All of them measure the same vehicle speed | The dashboard reads about 7% high, which k absorbs; VS has 1 km/h steps |
| R2 | d(mean wheel speed)/dt ≈ k · `LONG_ACCEL` + b | Acceleration is the rate of change of speed | Speed is quantised, so it is smoothed over 0.5 s first; slopes add gravity (`SLOPE_TCU` is a candidate correction) |
| R3 | `YAW_RATE` ≈ k · (RR − RL wheel speed) + b | When turning, the outer rear wheel runs faster | Wheel slip |
| R4 | `LAT_ACCEL` ≈ k · speed · `YAW_RATE` + b | Sideways (centripetal) acceleration = speed × turning rate | Road camber; yaw rate saturates at 40.95 |
| R5 | `N` ≈ k_g · speed, one k_g per gear | A fixed gear ratio links engine speed and road speed | Gear changes, pulling away; only gears 3–7 are tight |

### 6.2 The gate (step 5)
- **Residual** = left side − right side, computed on the validation recording.
- **Keep rule (Our choice):** keep a relation if its validation R² ≥ 0.9 and it shows no unexplained drift. A relation that holds only under a condition (for example R5 while the gear is steady) is kept and checked only where that condition holds.
- The first look suggests R1 and R5 pass easily, while R2–R4 (raw r 0.75–0.92, i.e. R² ≈ 0.56–0.85) need a proper fit with masks. If the rule changes, the change goes in `decisions.md` **before** fitting.
- **If at least 3 relations are kept:** continue as planned. **If only R1:** continue with R1 and say so. **If none:** stop and talk to the instructor.

### 6.3 Three ways physics enters the detectors
- **D1:** physics is the whole detector.
- **D3:** physics enters as extra inputs to the network.
- **D4:** physics enters through the training loss.
- D2 has no physics. It is the yardstick for the other three.

## 7. The four detectors: training and detection

All four use the same signals, the same windows, the same seeds and the same threshold rule, so the only thing that differs is how physics is used.

### D1: physics only (no neural network)
- **Training:** none beyond fitting the relation constants (step 5).
- **Scoring:** compute every kept relation's residual at each row and divide it by its training spread (median absolute deviation, which rare spikes cannot distort). Row score = the largest scaled |residual| across relations, averaged over 1 s. A relation contributes 0 outside its valid condition.
- **Explanation:** we save which relation produced the score. This tells us *why* an alarm fired (for example "R1: wheels disagree with gearbox speed").

### D2: data only (baseline)
- **Model (Our choice):** a small fully connected autoencoder that compresses each 1 s window through a narrow middle layer and reconstructs it. It belongs to the same family as [1] (BiLSTM) and [4] (CNN), but is simpler and easier to get right. Recurrent and convolutional versions are listed as extensions.
- **Training:** only on normal training recordings, minimising the mean squared reconstruction error. Training stops when the validation error stops improving (early stopping). Five seeds (three in the core plan).
- **Scoring:** window score = mean squared reconstruction error. The model learned only normal driving, so a tampered window reconstructs badly.

### D3: physics as inputs
- Same as D2, but the scaled residuals from D1 are added as extra input channels, and the model reconstructs both the signals and the residuals.
- An attack that breaks a relation shows up as a residual the model has never seen during normal driving, so the reconstruction error rises.

### D4: physics in training
- Loss = reconstruction error + λ × physics penalty.
- **Physics penalty** = mean squared residual of the kept relations, computed on the model's *reconstructed* signals after converting them back to physical units. R2 uses a time difference inside the window; the other relations are computed row by row. Rows where a relation is not valid are skipped.
- **λ (Our choice):** chosen from {0.01, 0.1, 1} using validation reconstruction error and validation physics penalty only. **Attack results are never used to choose λ.**
- This is "physics-informed learning" in the loose sense. A classic PINN solves a differential equation; D4 does not.

**Fairness check:** D2, D3 and D4 should have nearly the same number of trainable weights. If D3 is bigger because of its extra inputs, we report that as a threat to the comparison.

## 8. Threshold and alarm (same for all detectors)
- Threshold = 99.9th percentile of the detector's scores on the **normal validation recording** (Our choice). One threshold per detector, saved to `work/thresholds.json` and **frozen before any test score is computed**.
- An alarm event is a run of rows above the threshold. Gaps shorter than 1 s are merged into one event (Our choice).
- An attack counts as **detected** if any alarm event overlaps it.

## 9. Attacks used for testing
The main test uses our own edits, because the dataset's built-in attacks are trivially easy: during the attack, wheel speeds jump between 0 and 511.97 km/h (Known, from our check).

| Shape | Edit |
|---|---|
| Freeze | hold the value from the attack start |
| Drift | add an offset that grows linearly from 0 to Δ |
| Offset | add a constant Δ |
| Replay | copy the signal's own values from an earlier part of the recording |
| Whole message | the same edit applied to all four wheel speeds (one message), while other units' speed signals are left untouched |
| Consistent group | all four wheel speeds and all three speed signals scaled by the same factor. Physics is expected to miss this; it is our honest limit test (RQ4) |

- **Targets:** one wheel speed, `CF_Clu_Vanz`, `YAW_RATE`, `LONG_ACCEL`, `N`, `SAS_Angle`, and the control `TEMP_ENG`.
- **Sizes (Our choice):** 0.5×, 2× and 5× the signal's normal spread, clipped to the legal range in the DBC.
- **Placement (Our choice):** 10 s attacks at seeded random times, only above 5 km/h, at least 30 s apart, covering at most about a quarter of the recording.
- **Injector self-checks:** rows outside an attack are unchanged; labels mark exactly the edited rows; the same seed gives the same output.

## 10. Evaluation and how the RQs are answered
- **Reported:** detection rate per attack shape, size and target at the frozen threshold; false alarms per hour on normal dump6 and on dump7; AUROC (threshold-free); time from attack start to first alarm; mean and spread over seeds.
- **RQ1:** D3 and D4 against D2. A difference counts as real only if it is larger than the spread across seeds.
- **RQ2:** D3 against D4.
- **RQ3:** D1 against the best of D2–D4.
- **RQ4:** list the attacks no detector caught (expected: the consistent group, `TEMP_ENG`, anything below 5 km/h) and explain why.
- **Side check:** all four detectors on the dataset's own attacks, reported separately. Use the 480–1440 s window as the attack interval, because the per-row label marks only about 12% of the altered rows (Known).
- **Sensitivity checks (labelled as checks):** a different threshold percentile, a different window length, and D1 with one relation removed at a time.

**Core plan if time runs short:** D1, D2 and D3; freeze, drift and consistent-group attacks; four targets; three seeds. D4, the other attacks and the side check are extensions. Without D4, RQ2 is dropped and the paper says so.

---

## 11. Questions the panel may ask, and how to answer

**About the idea and novelty**
- **"What is new here?"** The controlled comparison: physics alone, data alone and both combined, on the same public data at the same false-alarm budget. We call it a candidate gap until the Stage 2 review confirms it.
- **"Isn't this just a PINN?"** Not in the strict sense. A classic PINN solves a differential equation. We use known relations between signals inside a detector; D4 adds them to the training loss.
- **"Why is this a security project and not just ML?"** It has a threat model: an attacker with bus access silences a unit and sends false values at normal timing (masquerade [1]). We test what that attacker can and cannot hide, including a stronger attacker who keeps the physics consistent.

**About data**
- **"One car only. Does this generalise?"** No, and we do not claim it does. The dataset's authors state the same limit [1]. The method (fit constants per car) carries over to other cars; the results do not.
- **"The DBC file is community-made. Can you trust the signals?"** We checked every signal's behaviour in the data: the four wheel speeds overlap, acceleration goes negative under braking, and so on. The fitted constants absorb unknown units and scales.
- **"Aren't you fitting and testing on the same car?"** On the same car, yes, but never on the same drive. Constants, scaling, model weights and thresholds come only from training and validation drives; dump6 is test only.

**About attacks**
- **"Your attacks are not real attacks."** Correct. They are edits to recorded normal driving, as in [1] and [3]. The car does not react to them, so we make no safety claims.
- **"Why not use the dataset's own attacks?"** We do, as a side check. They set wheel speeds to 0 or 511.97 km/h, so any detector catches them, and they would not separate the detectors.
- **"Can an attacker beat physics?"** Yes, by changing all related signals consistently. We include exactly that attack and report the result.
- **"What about attacks at low speed or standstill?"** Relations are switched off below 5 km/h, so D1 is blind there. That is a stated limit; D2 still covers it.
- **"What about suspension or timing attacks?"** Value-based detectors are not designed to see missing messages. We run them once as a side check and expect weak results.

**About method and evaluation**
- **"Why an autoencoder and not an LSTM?"** It is the simplest model in the same family as [1] and [4], and the easiest to get right. Recurrent or convolutional versions are an extension.
- **"Doesn't D3 win just because it has more inputs?"** We check that the parameter counts are nearly equal, and report it if they are not.
- **"Why the 99.9th percentile?"** It is our choice, fixed on a validation drive before testing. A sensitivity check reports other percentiles.
- **"How is λ chosen without cheating?"** From validation reconstruction error and physics penalty on normal data only, never from attack results.
- **"What false-alarm rate is acceptable?"** We do not set a target. We report false alarms per hour so readers can judge. For reference, CADD reports a false-positive rate below 0.5% [8].
- **"How do you know a difference is real?"** We train several seeds and treat a difference as real only if it is larger than the seed spread.
- **"Your pilot already detects 2 km/h. Isn't the answer obvious?"** No. The pilot was a crude one-wheel check on one drive with no learned detector to compare against. It only shows the task is neither trivial nor impossible.

**About outcome and scope**
- **"What if physics does not help?"** We report that. It is a useful answer for anyone building a CAN IDS, and RQ3 and RQ4 still produce results.
- **"Is it real-time?"** Out of scope. This is offline analysis.
- **"The 17.5–39.6% figure is from another dataset. Are you claiming to beat it?"** No. It only motivates why false alarms matter. Our numbers will be on X-CANIDS only.
- **"[3] is a preprint."** Yes, it is not peer reviewed, and we cite it as such.
- **"Cost and hardware?"** None: public data, free software, an ordinary laptop.
- **"Data licence?"** The data is open access to logged-in users. We cite it, do not redistribute it, and share only code and download instructions.

## 12. Which question each slide invites

| Slide | Expect | Short answer |
|---|---|---|
| 1 Title | "PINN?" | Physics-informed learning in the loose sense; not a classic PINN |
| 2 Problem | "Is the chart real data?" | No, it is labelled an illustration |
| 3 Gap | "Are you sure nobody did this?" | Candidate gap; Stage 2 review confirms it |
| 4 Data | "Are these results?" | No, first-look correlations before fitting |
| 5 Method | "Is D3/D4 a fair comparison?" | Same inputs, windows, seeds and thresholds; parameter count checked |
| 6 Evaluation | "Can physics be fooled?" | Yes, the consistent-group attack tests exactly that |

---

## 13. Hard questions from the independent critic review (16 Nov 2026)

An independent reviewer watched the v3 slides as a skeptical security panel would. The v4 slides now answer the questions marked **on slide**. Learn the rest for Q&A.

| Question | Short honest answer | Where |
|---|---|---|
| Are these attacks actually dangerous? Has anyone done this? | Yes. Researchers controlled a car's brakes and engine through CAN [11], and remotely took over a Jeep in 2015, which led to a recall of about 1.4 million vehicles [12]. Wheel speed and yaw rate feed the braking and stability systems. We make no crash or safety claims. | On slide (slide 2) + notes |
| Who is the attacker and how does it get in? | It is already on the bus, for example through a hacked connected or diagnostic device [7]. It silences one unit and sends that unit's messages on time (masquerade [1]). How it gains access is not modelled. | On slide (slide 2 "Threat" box) |
| Can't the attacker just send values that still obey physics? | Only by faking several units at once. The relations link signals from different units (wheels vs. engine, gearbox, dashboard). That is a much stronger attacker, and our "physics-consistent" attack tests exactly this case. | On slide (slide 3, point 2) |
| What does the detector actually compute? | A residual per relation, for example (scaled average wheel speed − gearbox speed), divided by its normal spread. The largest across relations is averaged over 1 s, with an alarm above a threshold fixed on a normal validation drive. | On slide (slide 3, point 3) + section 7 |
| "~40% false alarms", but X-CANIDS and CADD report good numbers? | The figure is from one recent learned detector [3] on its own data; the slide now says that. CADD [8] does well but is a hand-built physics model that needs extra signals. That is exactly why we compare learning and physics. | On slide (wording fixed) |
| Isn't "learned + physics" already done? | One paper uses a "PINN for CAN" [10] (we have read only its summary). Our claim is the controlled comparison, a candidate gap. | On slide (slide 4 note) |
| Which attacks? | Freeze, drift, offset, replay, whole message, and a physics-consistent attack. | On slide (slide 5) |
| Are the other units' speed signals really independent of the wheel speeds? | **Not verified.** `VS` and `VS_TCU` follow the wheels very closely, so they may be computed from wheel speeds. In a real car, a unit that derives its speed from faked wheel speeds would repeat the fake, which our offline edits cannot show. Check in the DBC which unit sends each signal, and state this as a limit. | Q&A + risk to add |
| Is the "consistent group" attack really consistent? | **Design gap.** As written in the implementation guide, it scales the wheel and speed signals but not engine speed (R5) or acceleration (R2), so physics may still partly catch it. Either scale those too, or say it is consistent for R1 only. | Fix in implementation guide |
| What about attacks at low speed or standstill? | Relations are switched off below 5 km/h, so D1 is blind there, and our attack placement also avoids that range. Either add some low-speed attacks or state the exclusion openly. | Q&A + design decision |
| Is it really a PINN? | Not in the strict sense. Only D4 puts physics in the training loss. | Q&A |
| What if the attacker knows the detector? | That is out of scope in our threat model. The physics-consistent attack is the closest stand-in. | Q&A |

**Sources [11] and [12] are new** and are not yet in `project_proposal.md`. Add them to its source list:
- [11] Koscher et al., "Experimental security analysis of a modern automobile," IEEE S&P 2010.
- [12] Miller and Valasek, "Remote exploitation of an unaltered passenger vehicle," Black Hat USA 2015.

# Decisions and findings log

Every change to an "Our choice" setting, every dropped relation and every surprise in the data goes here, with the reason. Newest at the bottom.

## 2026-11-16: Data download and steps 2 to 3

**Data**
- Downloaded the signal version (`signal.zip`, 1,186,800,785 bytes) and `ReadMe.md` from IEEE DataPort. Zip integrity check passed. 134 entries (133 parquet files and the `signal/` folder) unzipped to `data/signal/`.
- Contents: `dump1` to `dump7` (normal) plus 126 attack files built from dump6 (34 targets for each of fabrication, masquerade and suspension; 17 fuzzing rates; 4 replay windows).
- Licence: the dataset page says files are open access to logged-in users, and the ReadMe asks users to cite the dataset and the X-CANIDS paper. No other licence terms were found in the ReadMe. Do not redistribute the data.

**Inventory (`results/inventory.csv`)**
- Every file has 690 columns: 688 signals + `label` + the `timestamp` index. The ReadMe says 688 signals + label, and that matches.
- Every file is on an exact 5 ms grid (min = median = max step = 5 ms). Signals hold the last received value. Step 4's resampling is not needed.
- Lengths: dump1 23.9 min, dump2 31.6, dump3 24.7, dump4 36.4, dump5 22.3, dump6 32.7, dump7 36.9. Driving total (dump1 to 6) about 171 min.
- **dump7 is the idling recording:** mean wheel speed never exceeds 2.1 km/h and the gear lever reads P or R. dump1 to dump6 spend 76% to 91% of the time above 5 km/h.
- All 126 attack files have exactly dump6's length (392,387 rows).
- Normal files have label 0 everywhere, as the ReadMe states.

**Signals (`results/signal_check.csv`, `results/signal_check.md`, `results/plots/`)**
- All needed signals exist with the expected `AID_SignalName` names and have no missing values in any normal recording.
- **`112_CUR_GR` is text (P/R/D), the lever position, not a gear number.** It is replaced for R5 by `113_CF_Tcu_TarGr` (target gear, values 1 to 7; `111_GEAR_TYPE` = 7 is consistent with a 7-speed gearbox). Note this is the *target* gear, which may lead the actual gear during shifts.
- Found `113_SLOPE_TCU`, a road-slope estimate from the gearbox unit. It is a candidate correction for R2 (gravity on slopes). Its unit is not given in the DBC.
- A second engine-speed column exists, `080_N` (message EMS_DCT11). We use `316_N`, as planned.
- `4F1_CF_Clu_Vanz` (dashboard speed) reads about 7% higher than the wheel speeds (max 100 vs 93.7 km/h in dump1). This is normal speedometer over-reading; R1's fitted scale `k` absorbs it.
- `220_YAW_RATE` reaches 40.95, the top of its DBC range, during a sharp low-speed turn at the end of dump1. Treat values at the range limit as saturated, not as real readings.
- `TEMP_ENG` (control signal) varies slowly between 81.75 and 96.75 with 21 distinct values.

**First-look relation strength (Pearson r, rows above 5 km/h, before any fitting or masking)**

| Relation | r range over dump1 to dump6 |
|---|---|
| R1 wheels vs CF_Clu_Vanz / VS / VS_TCU | 0.999 to 0.9999 |
| R2 d(speed)/dt vs LONG_ACCEL | 0.90 to 0.92 |
| R3 YAW_RATE vs (RR − RL) | 0.75 to 0.91 |
| R4 LAT_ACCEL vs speed × YAW_RATE | 0.77 to 0.87 |
| R5 N / speed within gear | gears 3 to 7: narrow (e.g. gear 6 median 21.9, IQR 21.8 to 22.1, same in every recording); gears 1 and 2: wide (pull-away and clutch slip) |

What this means for the gate in step 5 (not yet decided):
- R1 and R5 (gears 3 to 7) look strong.
- R2, R3 and R4 are clearly real relations, but raw r of 0.75 to 0.92 means R² of about 0.56 to 0.85, below the step-5 keep rule of R² ≥ 0.9. That rule was our own arbitrary choice. Step 5 must fit them properly (scale, offset, slope correction, masks for saturation and slip) and then decide. If the rule is changed, the change and reason go here **before** fitting.

**Test-data caution**
- These first-look numbers were computed on all recordings, including dump6, which is the test recording. To keep step 5 honest, keep or drop decisions and all fitted constants will use training and validation recordings only. dump6 numbers above are not used for any decision.

## 2026-11-16: Is the data usable? Feasibility trial

**Trial (not a result; code in `src/scratch/pilot_feasibility.py`).** Crude physics check: each wheel speed compared with the mean of the other three, averaged over 1 s, rows above 5 km/h. Threshold = 99.9th percentile of the deviation on dump1. Scored on dump2 with our own 10 s edits on `386_WHL_SPD_FL`, 30 random placements each. dump6 not used.

| Edit on one wheel | Detected |
|---|---|
| offset 0.5 / 1 / 2 / 5 km/h | 0/30, 1/30, 30/30, 30/30 |
| drift to 0.5 / 1 / 2 / 5 km/h | 1/30, 0/30, 28/30, 30/30 |
| freeze | 30/30 |

On normal dump2, 0.041% of moving rows were above the threshold. Conclusion: the injection approach works on this data, and results are not all-or-nothing, so there is room for detectors to differ. These numbers must not be quoted as findings.

**Dataset's own attacks, wheel-speed message (386h), compared with normal dump6:**
- Masquerade and fabrication: during 480 to 1440 s all four wheel speeds alternate between 0 and 511.97 km/h (payload all-zero / all-one bits). Only 2 distinct values. Trivially detectable; confirms the plan to use our own edits as the main test.
- Suspension: wheel speeds read 0 in the signal file while the message is missing.
- Replay (0 to 120 s): earlier values replayed into the window; 44% of window rows differ from normal.
- No row outside 480 to 1440 s is altered in any of these files.
- **Label pitfall:** in the signal files `label = 1` marks only 5 ms rows where an attack frame arrived (about 12% for 386h), but about 96 to 98% of window rows carry altered values. For the step 12 side check, use the 480 to 1440 s window as the attack interval, not the per-row label.

**Design fix from the threat model (step 6).** An attacker who masquerades message 386h controls all four wheel speeds at once, so editing one wheel only is the weakest attacker, and the wheel-vs-wheel check alone would miss a whole-message edit. Added a "whole message" attack (all four wheels edited together, other units' speed signals untouched) to step 6. Cross-message relations (wheels vs `VS`, `VS_TCU`, `CF_Clu_Vanz`, which come from other control units) are what catch it.

## 2026-11-22: Novelty claim revised after supervisor feedback

**Trigger.** At the proposal presentation the supervisor questioned our claim that physics-based intrusion detection had not been done. She was right. The slides split earlier work into "learned detectors" and "physics rule checkers" and implied nobody had combined the two.

**What we checked** (17 sources, about 12 targeted web searches; not a systematic review; read levels are in `project_proposal.md` section 13):
- Physics rule checkers on real cars exist: SAID [7], CADD [8].
- Physics combined with learning exists: CAID for in-car signals [14], EV powertrain [15], platoons [13][16].
- **Closest prior work: Philip et al. [13]** (`references/ISI_2026_Princy.pdf`, read in full). Same LSTM with and without a physics loss, trained on normal data only. Physics raised overall F1 from 93.86% to 95.74% and AUROC from 97.29% to 98.33%. Data: truck simulator plus brake hardware rig (platoon V2V states, not in-car CAN). Threshold: F1-optimal on validation data that contains attacks. No physics-only baseline, no physics-consistent attacker.
- Nothing physics-informed was found on X-CANIDS [1]. Zhao et al. [17] say "physical semantics" but mean signal meaning, not physics equations.

**Decision.** The research questions, data, four detectors and evaluation rules stay as they are. Only the framing changes:
- The contribution is now: test whether the physics gain reported in [13] carries over to a public real-car CAN dataset, with a physics-only baseline, thresholds fixed on normal driving only, and a physics-consistent attacker.
- Removed claims: "first physics-informed CAN detector", "physics-based detection has not been done", "first with/without-physics comparison". Listed under "May not claim" in `project_proposal.md` section 14.
- D4 is described as the same idea as [13] (physics penalty in training), applied to an autoencoder. Our choice to keep the autoencoder (same family as [1][4]) instead of switching to [13]'s forecasting LSTM; a forecasting variant is a possible extension only.
- Our attack shapes map to [13]'s names: offset = bias, drift = ramp, freeze = freeze, replay = replay, consistent group = scaling of all related signals. We do not use their sinusoidal, FDI or composite attacks (our choice, to keep the core small).

**Still to confirm before citing:** the venue of [13] (the PDF does not print it; "ISI 2026" is only the file name); year and venue of [14]; [16] is known only through [13]'s description.

**Documents.** New: `proposal/proposal_v2.md` (2 to 3 page revised proposal) and `proposal/figures/methodology_flowchart.*` (built with the `ihmorol/methodology-flowchart` skill from steps 2 to 14 of the implementation guide). The Stage 1 slides, speech and Q&A in `presentation/` were already presented and are left unchanged as a record; their "two groups" framing is superseded by this entry.

## 2026-11-23: Literature review draft; CADD row corrected

**Trigger.** Writing the Stage 2 literature-review section (`literature_review.md`) meant re-reading the key passages of [1], [3], [4], [6], [7] and [8] (open-access PDFs) alongside [13]. Page and table locators in that file are PDF pages of the consulted versions.

**Correction.** `project_proposal.md` section 5 said CADD [8] had "no learned-detector comparison". That was wrong. CADD's authors reimplemented an LSTM-based detector (PID-Piper) and a correlation detector (EVAD) on the same training data, in CarSim with varied road slope and friction. PID-Piper caught under 30.7% of attacks at a false-positive rate near CADD's (about 4%) and went above 90% false positives when tuned to CADD's detection rate ([8] PDF p. 12, Fig. 11). With extra slope training data it still had a 66.95% false-positive rate (PDF p. 19, Table 11). The authors read this as learning without physics failing when conditions change (PDF p. 12).

**What changed.** The [8] row in `project_proposal.md` section 5, the physics-only bullet in section 6, the [8] read level in section 13, and gap item 2 in `proposal/proposal_v2.md`. The gap itself stands: [8] has no physics-informed learner and tests its learned baseline only in simulation. Its result supports our expectation that physics matters most when test conditions differ from training.

**Other findings from the re-read (no design change yet):**
- [13] uses its physics residuals in the anomaly score at inference as well as in the training loss (PDF p. 4, §IV-D). Its reported gain cannot be credited to the training loss alone. D4 adds physics only to the training loss, so D4 is not an exact copy of [13]. Decide whether to say so or add a residual-scoring variant.
- [13] gives no false-positive rate in the text and no spread across training runs (Table III, one value per cell).
- The other numbers quoted for [1], [3], [7] and [8] in section 5 matched the papers.

# Implementation Guide: From Empty Folder to Final Results

Companion to [project_proposal.md](project_proposal.md). Technical terms are explained in [glossary.md](glossary.md). Do the steps in order. Each step says what to do, what you must have at the end, and when to stop. Do not start a step until the previous one's "Done when" is true.

**Three kinds of statement appear below. Keep them apart:**

- **Known:** checked against a source (numbers in brackets refer to the proposal's source list).
- **Check:** something we have not seen yet. The step tells you how to find out. Do not assume the answer.
- **Our choice:** a setting we picked. It is not a fact from the literature. You may change it, but only before looking at test results, and you must write the change down.

---

## Ground rules (apply to every step)

1. **Recording 6 is test data.** The dataset's attack files were made from recording 6 [1]. Recording 6 and every file derived from it must never be used for training, fitting constants, scaling, or choosing thresholds.
2. **Nothing is tuned on test data.** Fitted constants, the numbers used to rescale signals, model settings and alarm thresholds come from training and validation recordings only.
3. **Fix random seeds** and save them with every result.
4. **Keep a decisions log** (`decisions.md`): every "Our choice" you change, every relation you drop, every surprise in the data, with the reason.
5. **Never write a result into the paper that is not in a saved results file.**
6. **Do not share the dataset files.** Check the licence shown on the dataset page when you download, and follow it.

Suggested layout (our choice):

```
data/        raw downloads, never edited, not uploaded anywhere
work/        aligned tables, fitted constants, trained models
results/     tables and figures that go into the paper
src/         code
decisions.md
```

---

## Step 1. Set up tools

**Do**
- Install Python with: `pandas`, `pyarrow`, `numpy`, `scipy`, `scikit-learn`, `matplotlib`, `torch` (CPU build is enough to start).
- Put the project folder under version control so you can undo mistakes.

**Done when** a script can import all of these without error.

## Step 2. Get the data and take inventory

**Known:** the signal version is 1.11 GB; files are parquet; each has 688 signal columns and one label column; there are six driving recordings, one idling recording, and attack files made from recording 6; a free IEEE account is required [1].

**Do**
- Create the IEEE account, download the signal zip and `ReadMe.md`, unzip into `data/`. Read the ReadMe fully.
- For every file, record: file name, number of rows, time span in seconds, time step between rows, label values present.
- Load only the columns you need (parquet lets you select columns), so memory stays small.

**Check, and write the answers in `decisions.md`**
- How are columns named? The paper writes one signal as `329_TEMP_ENG` (message ID, then signal name) [1]. Confirm the pattern in the real files.
- Is there a time column, and are rows evenly spaced?
- How long is each recording?
- What does the label column contain in normal files and in attack files?

**Done when** you have a table `results/inventory.csv` with one row per file, and you can name the exact column for each signal in the next step.

## Step 3. Pull out the signals and confirm what they mean

**Known:** the decoding file defines these signals and units [2], and the paper's message table shows the car transmits the carrying messages [1].

| Signal | Message | Unit in decoding file |
|---|---|---|
| `WHL_SPD_FL`, `_FR`, `_RL`, `_RR` | `WHL_SPD11` | km/h |
| `CF_Clu_Vanz` | `CLU11` | "km/h or MPH" |
| `VS` | `EMS11` | km/h |
| `VS_TCU` | `TCU12` | km/h |
| `N` | `EMS11` | rpm |
| `CF_Tcu_TarGr` (target gear 1 to 7) | `TCU13` | none given |
| `SLOPE_TCU` (road slope estimate, optional for R2) | `TCU13` | none given |

Checked on the data: `112_CUR_GR` is stored as text P/R/D (lever position), not a gear number, so it is not usable for R5. See `decisions.md`.
| `LONG_ACCEL`, `LAT_ACCEL` | `ESP12` | m/s² |
| `YAW_RATE` | `ESP12` | none given |
| `SAS_Angle` | `SAS11` | degrees |

Also keep one signal with no physical partner in our relations, as a control. `TEMP_ENG` (engine coolant temperature) exists in this dataset [1].

**Do**
- Extract these columns from every file into one table per recording.
- Plot each signal against time for one driving recording.

**Check**
- Is each column present and non-constant? Any missing values or start-up junk? The dataset's authors saw false alarms from uninitialised values at the start of a recording [1]; cut such warm-up rows and note how many.
- Does each signal behave like its name? Speed is zero at standstill; the four wheel speeds nearly overlap; `YAW_RATE` and `SAS_Angle` change sign together in turns; `LONG_ACCEL` goes negative under braking.
- `YAW_RATE` has no unit in the file and `CF_Clu_Vanz` may be km/h or mph. Do not guess. Step 5 fits a scale factor, which settles both.

**Done when** `results/signal_check.md` lists every signal as *usable*, *usable with note*, or *not usable*, each with a plot.

**Stop rule:** if the wheel speeds or the vehicle speed are not usable, stop and re-plan. Without them no relation survives.

## Step 4. Put everything on one time grid and split the recordings

**Known:** messages arrive at different rates. `ESP12`, `SAS11`, `EMS11`, `TCU12` about every 10 ms; `WHL_SPD11`, `CLU11` about every 20 ms [1].

**Do**
- From step 2 you know how the signal files are sampled. If rows are already on an even grid, keep it. If not, resample every signal onto one even grid by holding the last received value. *Checked:* the signal files are already on an exact 5 ms grid holding the last received value, with no gaps. Keep the 5 ms grid; no resampling is needed.
- Split by whole recording. *Our choice, to be adjusted to the recording lengths found in step 2:*
  - **Test:** recording 6 (normal version, plus the dataset's attack versions).
  - **Validation:** one other driving recording.
  - **Training:** the remaining driving recordings.
  - **Idling recording:** not used for relations (nothing moves). Keep it aside as an extra false-alarm check.
- Write the split to `work/split.json` and never change it after step 9 begins.

**Done when** each recording is one aligned table, and `split.json` exists.

## Step 5. Fit and test the physical relations (the gate)

This step decides whether the project can run as planned. Use **training recordings to fit**, **the validation recording to judge**.

For each relation, the form is known physics, but the constants are unknown for this car, so find them by fitting a straight line on training data (a standard fit called least squares). Convert speeds from km/h to m/s (divide by 3.6) where a formula mixes them with m/s².

| ID | Relation to fit | Constants | Known trouble spots |
|---|---|---|---|
| R1 | `speed_other ≈ k · mean(four wheel speeds) + b`, separately for `CF_Clu_Vanz`, `VS`, `VS_TCU` | `k`, `b` each | `VS` and `VS_TCU` have 1 km/h steps [2]; expect a staircase. |
| R2 | `d(mean wheel speed)/dt ≈ k · LONG_ACCEL + b` | `k`, `b` | Wheel speed has 0.03125 km/h steps [2]; over one 20 ms step that is about 0.43 m/s² of noise, so smooth the speed before taking its rate of change (*our choice:* moving average over 0.5 s). On slopes an accelerometer also feels gravity, which is why [8] estimates road slope; expect a slowly wandering offset. |
| R3 | `YAW_RATE ≈ k · (WHL_SPD_RR − WHL_SPD_RL) + b` | `k`, `b` | Fails when wheels slip. Sign and unit of `YAW_RATE` come out of the fit. |
| R4 | `LAT_ACCEL ≈ k · speed · YAW_RATE + b` | `k`, `b` | Road camber adds an offset. |
| R5 | `N ≈ k_g · speed`, one `k_g` per value of `CF_Tcu_TarGr` | one per gear | This car sends dual-clutch transmission messages [1]; expect the relation to break during gear changes and when pulling away. |

**Do**
- Use only rows where speed is above a minimum (*our choice:* 5 km/h); below that most relations mean nothing.
- Fit each relation on training data. Save constants to `work/relations.json`.
- On the validation recording compute the residual (left side minus right side) and report: how much of the variation the relation explains (R²), residual spread, and a plot of residual against time.
- Look at where the large residuals fall (braking, turning, gear change, slope). Write it down; this is material for the paper.

**Keep or drop** (*our choice*): keep a relation if R² on validation is at least 0.9 and the residual shows no long drifts you cannot explain. If a relation holds only under a condition (for example R5 only while the gear is steady), keep it, but check it only on rows where that condition holds.

**Done when** `results/relations_report.md` has one section per relation with the fit, the validation numbers, the plot, and the keep/drop decision.

**Gate**
- Three or more relations kept: continue as planned.
- Only R1 kept: continue with R1 alone and say so in the paper. The four detectors still make sense.
- None kept: stop and talk to the instructor. A possible fallback is the ROAD dataset's wheel-speed attack [4], but we have not checked that ROAD's extracted signals can be identified as wheel speeds. Check that before relying on it.

## Step 6. Build the attack injector

The injector takes a normal aligned recording and returns an edited copy plus a per-row label. It changes signal values only; timing is untouched.

**Attack shapes**

| Name | Edit | Note |
|---|---|---|
| Freeze | Hold the target at its value at attack start | Called plateau in [3] |
| Drift | Add an offset that grows linearly from zero to `Δ` | Called continuous in [3] |
| Offset | Add a constant `Δ` from attack start | |
| Replay | Overwrite the target with its own values from an earlier part of the same recording | Replay is a category in [1] |
| Whole message | Apply the same edit to all four wheel speeds (one message, `WHL_SPD11`); other units' speed signals untouched | Realistic: masquerading one message controls all its signals. See `decisions.md`. |
| Consistent group | Multiply all four wheel speeds and all three speed signals by the same factor | Physics is expected to miss this. It is the honesty test for RQ4. |

**Targets** (one at a time, except the group attack): one wheel speed, `CF_Clu_Vanz`, `YAW_RATE`, `LONG_ACCEL`, `N`, `SAS_Angle`, and the control signal `TEMP_ENG`.

**Sizes** (*our choice*): express `Δ` in units of that signal's normal spread on training data, at three levels: small (0.5×), medium (2×), large (5×). Clip to the signal's legal range from the decoding file so the edit is never an out-of-range value.

**Placement** (*our choice*): attacks of 10 s each, at random start times chosen with a fixed seed, only where speed is above the minimum, at least 30 s apart, covering no more than about a quarter of the recording.

**Do**
- Write the injector and three self-checks: rows outside the attack are exactly the same as the original; the label marks exactly the edited rows; the same seed gives the same output.
- Generate the attacked test sets from the normal version of recording 6, and a small attacked set from the validation recording for debugging only.

**Done when** the self-checks pass and `work/attacks/` holds one file per (shape, target, size), with an index file listing them.

## Step 7. Detector D1: physics only

**Do**
- For each kept relation compute the residual at every row, using constants from step 5.
- Scale each residual by its spread on training data (use a spread measure that rare spikes cannot throw off, such as the median absolute deviation).
- Score per row = the largest scaled absolute residual across relations, averaged over a short window (*our choice:* 1 s). Outside each relation's valid condition, that relation contributes zero.
- Save, per row, which relation gave the largest value. This is the explanation shown in the paper.

**Done when** D1 produces a score column for any recording, and on normal validation data the score is small and stable.

## Step 8. Detector D2: data only

**Do**
- Inputs: the same signals used by the relations plus the control signal. Scale each with mean and spread from training data only.
- Cut into windows (*our choice:* 1 s windows, stepping by 0.1 s).
- Model: a small autoencoder that reconstructs the window. *Our choice:* a plain fully connected autoencoder first, because it is the easiest to get right; [1] and [4] use more complex autoencoders (recurrent and convolutional types), which you may try afterwards if time allows, as a noted extension.
- Train on training recordings only, stop when the validation reconstruction error stops improving.
- Score per window = mean squared reconstruction error. Keep per-signal errors as well.
- Train with five different seeds.

**Done when** five saved models exist, validation error is close to training error, and scores on normal validation data are stable.

## Step 9. Detectors D3 and D4

Keep everything identical to D2 (signals, windows, layer sizes, training rule, seeds) except the one change named.

**D3: physics as inputs**
- Append the scaled residuals from step 7 as extra input channels. The model reconstructs the original signals and the residual channels.

**D4: physics in the training loss**
- Loss = reconstruction error + `λ` × physics penalty.
- Physics penalty = mean squared residual of the kept relations computed on the model's **reconstructed** signals, after converting them back to physical units. R2 needs a time difference inside the window; R1, R3, R4, R5 are computed row by row. Skip rows where a relation is not valid (for example below the minimum speed).
- Choose `λ` from a short list (*our choice:* 0.01, 0.1, 1) by lowest validation reconstruction error together with lowest validation physics penalty. Do not look at attack results to choose it.

**Check**
- Confirm D2, D3 and D4 have nearly the same number of trainable parameters (adjustable weights inside the network). If D3 is noticeably larger because of the extra channels, note it; it is a threat to the comparison.

**Done when** five seeds of each are trained and saved, and a table shows validation reconstruction error and physics penalty for D2, D3, D4.

## Step 10. Fix the thresholds

**Do**
- For each detector and seed, compute scores on the **normal validation recording**.
- *Our choice:* threshold = the 99.9th percentile of those scores. One threshold per detector, used for everything.
- Define an alarm event: consecutive rows above threshold, with gaps shorter than 1 s merged (*our choice*).
- Save thresholds to `work/thresholds.json`. From this point they are frozen.

**Done when** the file exists and is committed before any test score is computed.

## Step 11. Run the main evaluation

**Do**, for each detector, each seed, each attack file from step 6:
- Score the file, apply the frozen threshold.
- An attack counts as detected if an alarm event overlaps its labelled rows.
- Record detection (yes/no) and delay (seconds from attack start to first alarm).

On the **normal version of recording 6** (no edits) and on the idling recording:
- Count alarm events and divide by hours of data: false alarms per hour.

Also compute AUROC per attack file, using row labels and raw scores, so the comparison does not depend on the threshold.

**Done when** `results/main_results.csv` has one row per (detector, seed, shape, target, size) with: detected fraction, median delay, AUROC; and `results/false_alarms.csv` has one row per (detector, seed, recording).

## Step 12. Side check on the dataset's own attacks

**Do**
- Run all four detectors with the same frozen thresholds on the dataset's attack versions of recording 6, using the dataset's label column.
- Report per attack type, in a separate table.

**Known:** the dataset's authors report precision and recall above 0.99 on fabrication and masquerade in the rows we read, and say their own method is weak on suspension [1]. Timing attacks such as suspension are outside what value-based detectors can see; a low score there is expected, not a bug.

**Check:** how the dataset's attack values were generated is not described on the dataset page. Look at the attacked signal values against the normal ones and describe what you see (random, constant, extreme).

**Done when** `results/builtin_attacks.csv` exists and the paper's text says clearly that this is a side check.

## Step 13. Analyse and answer the research questions

Build these from the results files, averaging over seeds and showing the spread:

1. **Main table:** detection rate by attack shape and size, four detectors side by side, at the frozen threshold, with false alarms per hour underneath.
2. **By target signal:** same, split by which signal was attacked. Expect physics to matter only where the target appears in a kept relation; the control signal shows what happens where it does not.
3. **The group attack:** reported on its own.
4. **Which relation fired** (D1) for each target.
5. **One time plot** of a detected attack and one of a missed attack.

Then answer, in one paragraph each, only what the tables support:

- **RQ1:** compare D3 and D4 with D2. Call a difference real only if it is larger than the spread across seeds.
- **RQ2:** compare D3 with D4.
- **RQ3:** compare D1 with the best of D2 to D4.
- **RQ4:** list the attacks nobody detected and the ones only non-physics detectors caught, with the reason.

**Sensitivity checks** (do these last, one at a time, and label them as checks): change the threshold percentile; change the window length; remove one relation at a time from D1.

**Done when** every sentence in your results section points to a row or figure in `results/`.

## Step 14. Write up and package

**Paper sections** (rubric Stage 4): abstract, introduction, related work, method, results, discussion, references.

- Related work comes from the proposal's section 5, after the full readings.
- Method is steps 3 to 10 of this guide.
- Results are step 11 to 13 outputs.
- Discussion must include these limits: attacks are edits to recordings and the car does not react; one car; decoding file is community-made; relations were fitted on the same car; thresholds depend on one validation recording; which relations were dropped and why.

**Package:** code, `split.json`, `relations.json`, `thresholds.json`, seeds, `decisions.md`, results files, and instructions to download the data (not the data itself).

**Done when** someone else could download the data, run the code, and get the same tables.

---

## Core and extensions

The full plan is large. If time or skill runs short, cut to the core. The core still answers RQ1, RQ3 and RQ4.

**Core (do these)**
- Steps 1 to 5, including the gate.
- Step 6 with freeze, drift and the consistent-group attack; targets: one wheel speed, `CF_Clu_Vanz`, `YAW_RATE`, `TEMP_ENG`; all three sizes.
- D1, D2 and D3 (steps 7, 8, 9 without D4); three seeds.
- Steps 10, 11 and 13.

**Extensions (only after the core results are saved)**
- D4 (physics in the loss). Without it RQ2 is dropped and the paper says so.
- Offset and replay attacks, the remaining targets, five seeds.
- Step 12 (dataset's own attacks).
- Sensitivity checks.
- Rotating the test recording: repeat with each driving recording as the test one, injecting our attacks into it. The dataset page says the attacks fill seconds 480 to 1440, half of the capture [1]. That implies recording 6 is about 32 minutes with only about 16 minutes of normal test driving. This is inferred, not measured; step 2 gives the real length. If it is short, false alarms per hour from one test drive will be coarse, and rotating gives more test data.
- Recurrent or convolutional autoencoders, as used in [1] and [4].

## What can go wrong, and what to do

| If you see this | Likely cause | Do this |
|---|---|---|
| Column names differ from the decoding file | Prefixes or duplicates across messages | Use the inventory from step 2; write the column names once in a single settings file and reuse it everywhere. |
| Residuals are huge at low speed or standstill | Relations are meaningless there | Ignore rows below the minimum speed everywhere, including in D4's training penalty. |
| R2 residual drifts slowly | Road slope, sensor offset | Compare over short windows or subtract a slow moving average; say so in the paper. If still bad, drop R2. |
| R5 is noisy | Gear changes, clutch slip | Ignore rows around gear changes; if still bad, drop R5. |
| D2 to D4 detect everything, even small attacks | Test data leaked into training, or the attack sizes are too large | Recheck ground rule 1 and the rescaling numbers; add a smaller size level before looking further. |
| D2 to D4 detect nothing | Model reconstructs anything (too large), or scores dominated by one noisy signal | Make the network's narrow middle layer smaller; check per-signal errors. |
| False alarms per hour are very high on recording 6 | Recording 6 differs from validation driving | Report it as it is. Do not move the threshold. Discuss it as the test drive differing from the training drives (distribution shift). |
| D4 equals D2 | `λ` too small, or the model already satisfies the relations | Report the validation physics penalty for both; this is a finding, not a failure. |
| Results change a lot between seeds | Too little training data or unstable training | Report the spread; do not pick the best seed. |
| A paper turns up that already did this comparison | The gap was only a candidate | Cite it, reposition as a replication on public data, keep going. |

## What you will hold at the end

- `results/inventory.csv`, `signal_check.md`, `relations_report.md`: evidence the data and physics are sound.
- `results/main_results.csv`, `false_alarms.csv`, `builtin_attacks.csv`: the numbers.
- Tables and figures for the paper, each traceable to those files.
- `decisions.md`: every choice and change, which is what you defend in the viva.

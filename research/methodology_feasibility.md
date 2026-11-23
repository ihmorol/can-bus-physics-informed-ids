# Methodology feasibility review

Reviewed 2026-11-23 against `proposal/figures/methodology_flowchart.json` (boxes 1 to 14), `implementation_guide.md` steps 1 to 14, `decisions.md`, `results/`, and the sources in [literature_tracker.md](literature_tracker.md). Nothing here is an experimental result. Estimates are labelled as estimates. Recommendations are proposals; per the README, adopt one only by logging it in `decisions.md`.

## Verdict

The method can be run as planned with the data and hardware we have. No step needs paid compute, a GPU or new data. Steps 1 to 3 are done and the data passed its checks.

Before step 5, four design points should be settled and logged, because each could make the comparison uninformative:

1. **The R² ≥ 0.9 gate will probably drop R2, R3 and R4.** Their raw correlations (r = 0.75 to 0.92) imply R² of about 0.56 to 0.85 before fitting (decisions 2026-11-16). Fitting may raise this, but if it does not, only R1 and R5 survive, and yaw rate, lateral and longitudinal acceleration lose all physics coverage.
2. **Attack sizes in "units of normal spread" are likely far too large for speed signals.** If "spread" means the standard deviation of a raw signal over driving, wheel speed varies over tens of km/h, so 0.5× would be several km/h or more. The pilot already caught 30/30 offsets at 2 km/h. Every detector would then score near 100%, and RQ1 could not separate them. (Inference: the spread values have not been computed.)
3. **The "consistent group" attack is not consistent with R2, R4 and R5.** Scaling the seven speed signals leaves `N`, `LONG_ACCEL` and `LAT_ACCEL` untouched, so those relations break. D1 would likely catch it, which defeats its purpose as the RQ4 honesty test.
4. **"Gain above seed spread" with 3 seeds is a weak decision rule.** A paired comparison over attack instances is cheap and stronger.

Two additions would make the results much easier to defend: a **late-fusion baseline** (D1 and D2 scores combined, no new training) and a **steering relation** (R6), because `SAS_Angle` is an attack target that no relation covers.

## Resources we have

Checked on this machine on 2026-11-23.

| Resource | Status | Needed for | Action |
|---|---|---|---|
| Dataset (signal version) | Downloaded and checked, but **not on this machine**. The pilot script reads `E:/University/.../data/signal/`, which does not exist here | Steps 4 onward | Copy to `data/signal/` on whichever machine runs the experiments; D: has 162 GB free |
| CPU | AMD Ryzen 5 5625U, 12 logical cores | All training | Enough (see estimate) |
| RAM | 8 GB | Loading and windowing | Enough if only needed columns are loaded (guide step 2); see estimate |
| GPU | Integrated Radeon, **no CUDA** | Not needed | CPU training only |
| Python 3.13, pandas, numpy, scipy, scikit-learn, matplotlib | Installed | Steps 4–13 | None |
| **pyarrow** | **Missing** | Reading parquet | `pip install pyarrow` |
| **torch** | **Missing** | D2, D3, D4 | Install the CPU build |
| Literature | 7 sources in full text, 1 locally | Related work, design precedents | See tracker §6 for open items |
| Time | No dates in the course rubric | | Stage 2 asks for a *locked* question and method, so make the changes below now |

### Compute estimate (estimate, not measured)

- Training data: dump1 to dump5 total 138.9 min. With one held out for validation, about 103 to 117 min remain, which gives roughly 62,000 to 70,000 one-second windows at a 0.1 s step.
- Inputs: about 14 signals. At the native 5 ms grid a window is 200 rows × 14 = 2,800 values; 70,000 windows in float32 is about 0.8 GB. Feasible on 8 GB, but tight alongside pandas copies.
- Suggestion: inside each window, keep every 4th row (20 ms). `WHL_SPD11` and `CLU11` only update every 20 ms [1], so little information is lost, and the input shrinks to 700 values (about 0.2 GB). Log it if adopted.
- A fully connected autoencoder of a few hundred thousand weights on 70,000 windows trains in minutes per run on this CPU. The full plan (D2, D3, D4 × 5 seeds, plus 3 λ values for D4) is about 25 runs, so a few hours at most.
- Scoring: roughly 60 to 70 attack files × about 19,600 windows each × 20 models is small. Store attack *specifications* and regenerate edited copies on the fly rather than saving ~70 full copies of recording 6.

## Stage-by-stage review

Rating: **Ready** = can be done now as written. **Fix first** = runnable, but a design point should be settled before running. **Done** = completed and logged.

### Stage 1 · Data and physics

| Box | Step | Rating | Evidence and resources | Similar work | Issues and recommendations |
|---|---|---|---|---|---|
| 1 X-CANIDS signals | Guide 2–3 | **Done** | 7 recordings, 688 signals, exact 5 ms grid, no gaps; all needed signals present (decisions 2026-11-16; `results/inventory.csv`, `signal_check.md`) | Same data as [1] | `112_CUR_GR` replaced by `113_CF_Tcu_TarGr`; `YAW_RATE` saturates at 40.95. Both already logged |
| 2 Split by recording | Guide 4 | **Fix first** (small) | dump6 test; dump7 idle; dump1–5 for train and validation | [13] splits at file level 8/1/3 (p. 3) | The validation recording is not chosen yet. Pick it by a rule written down now (for example, the recording with median length), not by looking at fits. Write `work/split.json` before step 5 |
| 3 Fit relations | Guide 5 | **Fix first** | First-look r: R1 0.999+, R2 0.90–0.92, R3 0.75–0.91, R4 0.77–0.87; R5 tight in gears 3–7 only (`signal_check.md`) | [7] steering/yaw and accel models; [8] slope, slip and mass estimation; [13] learnable offset for road grade (p. 4) | (a) See gate below. (b) R2: try `113_SLOPE_TCU` as a gravity correction, or fit a slowly varying offset as [13] does. (c) R3: mask `YAW_RATE` at its range limit. (d) R5: use gears 3–7 only, and mask around target-gear changes because target gear leads actual gear |
| Gate: any relation kept? | Guide 5 | **Fix first** | R² ≥ 0.9 is "our choice" (guide 5; decisions 2026-11-16) | None. No source in the set uses an R² gate | R² punishes relations with a small range more than relations that are actually noisy. Decide before fitting, and log it: either keep R² ≥ 0.9, or gate on what matters for detection, for example "residual robust spread is smaller than the smallest planned attack size on the target". Either rule is defensible; changing it after seeing the fits is not |
| Stop and re-plan | Guide 5 | Ready | R1 alone already keeps the project alive (guide 5) | ROAD fallback [4] unverified | Very unlikely to trigger given R1's r ≥ 0.999 |

**Coverage gap in the relations.** `SAS_Angle` is an attack target (guide step 6) but appears in no relation, so for D1 it behaves as a second control signal. Our data already shows `YAW_RATE` vs `SAS_Angle` r = 0.85 to 0.92 (`signal_check.md`), and SAID uses a steering/yaw model [7, p. 4]. **Idea: add R6, yaw rate ≈ speed × steering angle / (wheelbase × (1 + K·speed²)),** the standard single-track (bicycle) model, with the steering ratio and K fitted. This would be new to our plan, so log it before step 5 if adopted. If not adopted, say in the paper that `SAS_Angle` has no physics partner.

Also note which targets depend on the gate. If R2 is dropped, `LONG_ACCEL` loses physics; if R3 and R4 are dropped, `YAW_RATE` does too. Then RQ1 can only be tested on speed signals and `N`. That is acceptable, but should be expected.

### Stage 2 · Attack sets

| Box | Step | Rating | Evidence and resources | Similar work | Issues and recommendations |
|---|---|---|---|---|---|
| 4 Attack injector | Guide 6 | **Ready** for code; **Fix first** for the group attack | Pandas only. Pilot already injected offset, drift and freeze (`src/scratch/pilot_feasibility.py`) | Freeze/drift in [3]; bias, ramp, freeze, replay, scaling in [13] (p. 2, Table I) | Group attack: see below. Whole-message attack (all four wheels) is well motivated (decisions 2026-11-16) |
| 5 Attacked test copies | Guide 6 | **Fix first** | Placement rules are concrete; recording 6 is 32.7 min, ~76% moving, so up to about 45–50 ten-second attacks fit in the 25% cap (estimate) | [3] and [13] also inject into recorded or simulated nominal data | Attack size unit: see below. Freeze and replay have no size, so the "3 sizes" axis applies only to offset, drift, whole-message and group |

**Attack sizes.** The pilot shows the useful range for one wheel: offsets of 0.5 and 1 km/h were almost never detected, 2 and 5 km/h always (decisions 2026-11-16). Sizes should span that edge. Options, in order of preference:

1. Express Δ in units of each target's *short-term* noise, for example the robust spread (MAD) of the signal minus its own 1 s moving average on training data. This tracks sensor resolution, not driving range.
2. Use fixed physical units per signal, chosen from training data and documented (for example 0.5, 2 and 5 km/h for speeds).

Do not choose sizes by looking at D1's detection rate on the validation set; that would tune the test to one detector.

**Consistent group attack.** As planned (guide step 6) it scales four wheel speeds and `CF_Clu_Vanz`, `VS`, `VS_TCU` by one factor. Under kept R2, R4 or R5 that is inconsistent: d(speed)/dt grows but `LONG_ACCEL` does not, speed × yaw grows but `LAT_ACCEL` does not, speed grows but `N` does not. Proposal:

- **Group-full (RQ4 honesty test):** edit every signal in every kept relation that contains speed so that all kept relations still hold. With factor f: speeds × f (R1), `N` × f (R5), `LONG_ACCEL` × f (R2), `YAW_RATE` × f (R3, because the rear-wheel difference scales by f), and then `LAT_ACCEL` × f² (R4, speed × yaw). If R6 is added, `SAS_Angle` must be recomputed from the fitted model, since that relation is not linear in speed. Write the exact set after the gate, because it depends on which relations survive.
- **Group-speed (optional):** the current speed-only version, reported as "partly consistent", to show which relation catches it.

State the attacker this implies: editing `WHL_SPD11`, `CLU11`, `EMS11` (which carries both `VS` and `N`), `TCU12` and `ESP12` means masquerading several messages from several control units. That is a strong attacker and should be described as such.

### Stage 3 · Detectors, per seed

| Box | Step | Rating | Evidence and resources | Similar work | Issues and recommendations |
|---|---|---|---|---|---|
| 6 · D1 physics only | Guide 7 | **Ready** | Numpy only; pilot is a crude D1 | [7], [8]; [5] (consistency, not read) | Relations that are off below 5 km/h give a score of zero there. Attacks are placed above 5 km/h, so this is consistent, but mention it as a blind spot |
| 6 · D2 autoencoder | Guide 8 | **Ready** after installing torch | CPU training is enough (estimate above) | [1] BiLSTM AE; [4] CNN AE | Use trailing (causal) windows so no alarm can start before the attack. Consider 20 ms subsampling inside the window |
| 6 · D3 violation inputs | Guide 9 | **Ready** | Same as D2 | None in the read set | Guide already asks to compare parameter counts. Simple fix: shrink D3's first hidden layer so total weights match D2 |
| 6 · D4 physics loss | Guide 9 | **Fix first** (small) | Same as D2 | [13] PI-LSTM (loss + score); [16] PINN | (a) The λ rule "lowest reconstruction error together with lowest physics penalty" has two objectives and can tie or conflict. Pick one rule now, for example "largest λ whose validation reconstruction error is within 5% of D2's". (b) [13] ramps physics weights in over the first 3 of 8 epochs (p. 4); worth copying, and citing. (c) [13] also adds residuals to the anomaly score (p. 4, §IV-D), D4 does not. Either say so plainly, or add the fusion baseline below, which covers the score side |
| 7 Train models | Guide 8–9 | **Ready** | Training drives only | [13] 8 epochs, Adam, lr 10⁻³ (Table II) | Early stopping on validation reconstruction error is fine; it uses no attacks |
| All seeds done? | Guide 8 | Ready | 3 seeds core, 5 full | [13] reports no spread | Seeds are cheap here (estimate); run 5 if at all possible |
| 8 Freeze thresholds | Guide 10 | **Fix first** (small) | Validation drive of 22–36 min gives about 13,000–22,000 windows; the top 0.1% is only 13–22 windows, and overlapping windows make them strongly dependent | [1] attack-free threshold; [3] 3σ; [13] F1-optimal, with Youden J and FPR-constrained also tried (p. 4) | The 99.9th percentile rests on very few, correlated points, so it will vary between seeds and between validation drives. Report its uncertainty (block bootstrap over 1-minute blocks of the validation drive). "Same false-alarm budget" holds on validation only; on test, realised false alarms per hour will differ by detector, so report them side by side |

**Idea: late-fusion baseline (D1 ⊕ D2).** Combine the two existing scores, for example the maximum of D1 and D2 after each is divided by its own validation threshold, and alarm above 1. It needs no training and costs minutes. It answers the question a reviewer will ask about D3 and D4: does building physics into the network beat simply running a physics check next to a learned detector? It also mirrors [13]'s choice to put residuals into the anomaly score. If adopted, add it as D5 in a logged decision; it strengthens RQ2.

### Stage 4 · Test

| Box | Step | Rating | Evidence and resources | Similar work | Issues and recommendations |
|---|---|---|---|---|---|
| 9 Score test data | Guide 11 | **Ready** | dump6 normal + edits; dump7 idle | [1], [3] score held-out recordings | Fix the window label rule now (for example, a window is attacked if any of its rows is), and a grace period after an attack ends during which alarms are neither hits nor false alarms |
| 10 Compute metrics | Guide 11 | **Ready** | Detection rate, false alarms per hour, AUROC, delay | [3] per-timestep FPR; [13] F1 and AUROC | False alarms per hour from 0.55 h of dump6 is coarse: one alarm is about 1.8 per hour. dump7 adds 0.6 h of idling, which is a different regime. See rotation below |
| Gain above seed spread? | Guide 13 | **Fix first** | 3–5 seeds | [13] reports no spread; [3] uses ± over test blocks | Add a paired comparison: every detector sees the same attack instances, so compute the per-instance difference in detection (D3 or D4 minus D2) and a bootstrap 95% interval over instances, per seed. Call a gain real only if the interval excludes zero **and** it exceeds the seed spread. Write this rule down before step 11 |
| 11 Locate the gain | Guide 13 | Ready | D1 saves which relation fired | [7] reports per model | None |
| 12 Side check | Guide 12 | **Ready** | Attack window is 480–1440 s; per-row label marks only ~12% of rows for 386h (decisions 2026-11-16) | [1] Table V | Already handled: use the window, not the row label |
| No gain found | Guide 13 | Ready | | [8] found the learned baseline fails under shift (p. 12) | A null result is publishable here; [8] gives a reason to expect gains mainly under condition shift |
| 13 Answer RQ2–RQ4 | Guide 13 | Ready, given the group-attack fix | | | RQ2 needs D4 (an extension in the core plan). If D4 is cut, D5 fusion still gives a partial RQ2 |
| 14 Paper and package | Guide 14 | Ready | | | Open citation checks in tracker §6 must close first |

**Idea: promote test-recording rotation from extension to core if time allows.** Rotating which driving recording is the test one multiplies test hours by up to six, removes the dependence on one test drive, and costs only retraining (cheap here). Note one caution: the first-look table already contains dump6 numbers. The decisions log says they are not used for any choice; keep it that way.

## Ideas, ranked

| # | Idea | Why | Cost | Source support |
|---|---|---|---|---|
| 1 | Settle the gate rule before fitting | Avoid losing R2–R4 to an arbitrary R² cut, or changing the rule after seeing fits | Minutes | decisions 2026-11-16 |
| 2 | Attack sizes in short-term-noise or physical units | Keeps RQ1 informative; pilot shows the detection edge near 1–2 km/h | Minutes | Pilot (decisions 2026-11-16) |
| 3 | Group-full attack | Makes RQ4 test what it claims | 1 hour | [13] scaling attack (Table I) |
| 4 | Late-fusion baseline D5 | Tests whether integration beats running both side by side | 1 hour, no training | [13] residuals in score (p. 4) |
| 5 | Paired bootstrap rule | Defensible "real gain" decision with few seeds | 1 hour | Neither [13] nor [1] reports run spread |
| 6 | R6 steering relation | Gives `SAS_Angle` physics coverage | Half a day | [7] steering/yaw model (p. 4); our r = 0.85–0.92 |
| 7 | Test-recording rotation | More test hours, more stable false-alarm rates | Retraining × 6 | Guide extensions |
| 8 | Physics-weight ramp for D4 | Stabler training; cite [13] | Minutes | [13] p. 4 |

## Decisions to log before step 5

1. Validation recording, and the rule used to choose it.
2. Gate rule (keep R² ≥ 0.9, or switch to a detectability rule).
3. Whether R6 is added.
4. Attack size unit and the three levels per target.
5. Exact signal set for the group-full attack (after the gate).
6. λ selection rule; whether to ramp the physics weight.
7. Whether D5 fusion is added.
8. Window label rule, grace period, and the paired-comparison rule for "real gain".

## Limits of this review

- Feasibility of compute and memory is estimated from recording lengths and window counts, not measured. The dataset is not on this machine, so no spread values or fits could be checked.
- "Similar work" covers only the 7 full-text sources and the partial ones in the tracker. A fresh search is still needed before claiming that any element is new.
- This is one model's reading of the plan. A teammate or the supervisor should check items 1 to 4 of the verdict before they are adopted.

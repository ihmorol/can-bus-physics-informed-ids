# Literature tracker

**Current register after the systematic screen of 2026-11-23.** The full method, flow counts, gap check and the log of all 136 screened records are in [reports/CAN IDS systematic literature review.md](../reports/CAN%20IDS%20systematic%20literature%20review.md). The per-stream notes are in [research_notes/CAN IDS systematic literature review/](../research_notes/CAN%20IDS%20systematic%20literature%20review/). A machine-readable copy of the register is in [literature_tracker.csv](literature_tracker.csv).

**IDs.** Kept sources keep their old numbers [1]–[16]. New papers are N1–N10. Dropped numbers ([9], [10], [12]) are retired and not reused.

**How to use this file.** Update a row when its read level changes or a number is re-checked. Log changes to the core set in `decisions.md`. *Not extracted* means we have not looked, not that the paper lacks it.

**Read-level legend**

| Code | Meaning |
|---|---|
| FULL | Whole PDF read |
| KEY | Full text available; method, results and limits passages re-read with page locators (`literature_review.md`) |
| ABS | Abstract read during the systematic screen (2026-11-23) |
| ABS+ | Abstract plus some full-text sections read during the screen |

**Limits of the screen.** One AI screener per topic stream, almost all decisions on abstracts only. OpenAlex was the main database; Scopus, IEEE Xplore and Google Scholar were not queried directly. "Scopus" below is a judgement about the venue, not a Scopus check. Citation counts: OA = OpenAlex, S2 = Semantic Scholar, both 2026-11-23. The review is PRISMA-informed, not PRISMA-compliant.

---

## 1. Core set (20 papers + 1 data file)

| ID | Group | Short citation | Venue · year | Peer reviewed / Scopus (venue) | Citations | Read level | Role in our paper | RQs | Next action |
|---|---|---|---|---|---|---|---|---|---|
| [1] | a Dataset & learned baselines | Jeong et al., X-CANIDS · [doi](https://doi.org/10.1109/TVT.2023.3327275) | IEEE TVT 73(3):3230–3246, 2024 | Yes / journal | OA 89, S2 68 | KEY | Data source; D2 family; threshold from attack-free data | RQ1, RQ3 | None blocking |
| [2] | a | commaai/opendbc `hyundai_2015_ccan.dbc` | GitHub | Data file | n/a | File checked | Signal names, units, scaling | all | Cite with commit hash and access date |
| [3] | a | Rahman, Salek, Chowdhury, digital-twin IDS | arXiv:2608.17093, 2026 | **No (preprint)** | 0 | KEY | Closest real-car learned competitor; FPR motivation | RQ1, RQ4 | Check whether its log is X-CANIDS; check for a peer-reviewed version |
| [4] | a | Shahriar et al., CANShield · [doi](https://doi.org/10.1109/JIOT.2023.3303271) | IEEE IoT-J 10(24):22111–22127, 2023 | Yes / journal | OA 98, S2 79 | KEY (arXiv v4) | Autoencoder design for D2 | RQ1 | Re-map page locators to the IoT-J version |
| N1 | a | Kang et al. (check), CANival · [doi](https://doi.org/10.1016/j.vehcom.2024.100845) | Vehicular Communications 50:100845, 2024 | Yes / journal | OA 55 | ABS | Only peer-reviewed signal-level detector with X-CANIDS numbers: TPR 0.960, TNR 0.997 (abstract) | RQ1 | Full text: attacks, threshold rule |
| [7] | b Physics-only | Xue et al., SAID | USENIX Security 2022, pp. 1921–1938 | Yes / uncertain | S2 24 | KEY | Physics comparator for D1; steering/yaw model (R4, R6). Describe it as command filtering, not passive detection | RQ3 | Keyword-search for R3 |
| [8] | b | Chen, Shin, Dadras, CADD · [doi](https://doi.org/10.1145/3678890.3678895) | RAID 2024 | Yes / likely | S2 8 | KEY | Physics vs LSTM under changing road conditions; slope handling for R2 | RQ1, RQ3 | Keyword-search for R3 |
| N2 | b | Ben Othmane et al. · [doi](https://doi.org/10.1109/TDSC.2020.2990192) | IEEE TDSC, accepted 2020 | Yes / journal | not checked | ABS | Speed–RPM relation (R5) vs k-means/HMM on a real moving Ford Transit | RQ3 | Full text; confirm volume and year |
| [13] | c Physics + learning | Philip et al., PI-LSTM · [doi](https://doi.org/10.1109/ISI69914.2026.11685836) | IEEE ISI 2026, pp. 144–149 | Yes / likely | 0 | FULL | **Closest prior work**; the result we test on real CAN | RQ1, RQ2 | Check third author's name on IEEE Xplore ("K. B. Devika" in OpenAlex) |
| [14] | c | Wasicek et al., CAID | escar USA 2017 (secondary reference only) | Probably / probably not | S2 51 | ABS | Novelty risk: physical reference models + unsupervised network on a real car | novelty | Full text; confirm venue and year |
| [15] | c | Guo, Ye, Yang · [doi](https://doi.org/10.1109/TTE.2020.3044524) | IEEE TTE 7(3):2010–2022, 2021 | Yes / journal | OA 71, S2 51 | ABS | Vehicle precedent for physics as inputs (D3) | RQ2 | Abstract is enough |
| [16] | c | Vyas, Padisala, Dey · [doi](https://doi.org/10.23919/ACC55779.2023.10155846) | ACC 2023, pp. 4537–4542 | Yes / likely | OA 12, S2 9 | ABS | Vehicle precedent for physics in the loss (D4); simulation only | RQ2 | Full text (guide step 14) |
| N3 | c | van Wyk et al. · [doi](https://doi.org/10.1109/TITS.2019.2906038) | IEEE T-ITS 21(3):1264–1276, 2020 | Yes / journal | OA 413, S2 304 | ABS | Physics-only vs learned-only vs hybrid in one study; hybrid beats both (abstract) | RQ1, RQ3 | Full text: is its data real or simulated? |
| N4 | c | Chahine & Noura · [doi](https://doi.org/10.3390/fi18060308) | Future Internet 18(6):308, 2026 | Yes / believed | OA 3 | ABS | D3 template: same detector with physics features vs raw (PA-F1 0.7343 vs 0.6687, abstract) | RQ1, RQ2 | Full text: any inputs-vs-loss ablation |
| N5 | c | Zideh & Solanki · [doi](https://doi.org/10.1016/j.segan.2025.102022) | Sustainable Energy, Grids and Networks 44:102022, 2025 | Yes / journal | OA 30, S2 14 | ABS | D4 template: same autoencoder with and without a physics-loss term | RQ2 | Full text: loss weighting, threshold |
| N6 | d Evaluation | Verma et al., ROAD · [doi](https://doi.org/10.1371/journal.pone.0296879) | PLOS ONE 19(1):e0296879, 2024 | Yes / journal | OA 180 | ABS+ | Critique: public attacks "too easily detectable", physical effects "not verified" (abstract); why X-CANIDS, not ROAD | protocol | None |
| N7 | e Stealthy attacks | Erba et al. · [doi](https://doi.org/10.1145/3427228.3427660) | ACSAC 2020 | Yes / likely | OA 125 | ABS | Model for the consistent-group attack: recall 0.68 → 0.12 by editing 4 of 82 sensors (abstract) | RQ4 | Full text: attack construction |
| N8 | e | Urbina et al. · [doi](https://doi.org/10.1145/2976749.2978388) | ACM CCS 2016 (seminal) | Yes / proceedings | OA 459 | ABS | Evaluate physics detectors at a fixed false-alarm bound against stealthy attackers | RQ4, protocol | Metric section |
| N9 | f Survey & threat | Rajapaksha et al. · [doi](https://doi.org/10.1145/3570954) | ACM Computing Surveys, 2023 | Yes / journal | OA 317 | ABS | One survey for the introduction | intro | Abstract is enough |
| [11] | f | Koscher et al. · [doi](https://doi.org/10.1109/SP.2010.34) | IEEE S&P 2010 (seminal) | Yes / likely | OA 2,263 | ABS | Threat model: a compromised ECU overrides safety functions | intro | Re-read cited claim |
| N10 | f | Checkoway et al. | USENIX Security 2011 (seminal) | Yes / unknown | OA 1,984 | ABS | Replaces [12]: remote compromise is feasible | intro | None |

## 2. Reserve list (cite only if a specific sentence needs it)

| ID | Paper | Why reserve, not core |
|---|---|---|
| [5] | Ganesan, Rao, Shin, SAE 2017-01-1654 (seminal) | Learned pairwise correlations; idea covered by SAID, CADD, EVAD. Cite once as the origin of "natural redundancy" if space allows |
| [6] | Moriano et al., JISA 98:104392, 2026 | Masquerade motivation covered by ROAD, CANShield, X-CANIDS. If cited, use the JISA version, not arXiv |
| [17] | Zhao et al., PSEAD, Electronics 13(2):377, 2024 | "Physical semantics" means what the signals mean, not physics. One sentence in the gap statement at most |
| — | EVAD (Guo et al., IEEE TVT 2019) | Cross-sensor correlation; CADD's baseline |
| — | LGOVAD (Xu et al., Alexandria Eng. J. 2025) | Strongest learn-the-dependencies-only foil |
| — | PIWAD (IEEE IoT-J 2026) | Physics in the score; residual-aware adaptive attackers |
| — | AVMON (VehicleSec 2024) | Hybrid vs physics-model defences on an RC car |
| — | Pasqualetti, Dörfler, Bullo, IEEE TAC 2013 | Theory: a fully consistent attack leaves zero residual |
| — | Dash et al., ACSAC 2019 | Evading physics-model IDS on robotic vehicles |
| — | Longari et al., ACM TCPS 2025 | Evasion of CAN IDS |
| — | Lazeski et al., VehicleSec '26 (WIP) | States our hypothesis directly; workshop-level |
| — | Koltai et al., EuroS&P Workshops 2026; Sharmin et al., J. Computer Security 2024 | Evaluation and comparability critique |
| — | Loukas et al., Ad Hoc Networks 2019 | Survey with cyber-physical framing |

## 3. Removed from the source list

| Old ID | Paper | Decision | Reason |
|---|---|---|---|
| [9] | ATHENA, arXiv:2503.17067 | Drop | Preprint only; rule mining on ROAD bits; uncertain in two streams, excluded in one |
| [10] | Senthilkumar & Anbalagan, JESA 59(4), 2026 | Drop | Abstract names no physical relation; encryption times of tens to hundreds of seconds; indexing known only from the publisher's claim |
| [12] | Miller & Valasek, Black Hat 2015 | Replace with N10 | White paper, not peer reviewed |

---

## 4. Evidence matrix (full-text sources only)

Locators are PDF pages of the consulted versions, as in `literature_review.md`. [6] has moved to the reserve list; its column is kept for the record.

| | [1] X-CANIDS | [3] Digital twin | [4] CANShield | [6] ORNL (reserve) | [7] SAID | [8] CADD | [13] Philip et al. |
|---|---|---|---|---|---|---|---|
| **Data** | One real car (Hyundai LF Sonata 2017), 107 signals (pp. 6–7) | Real Hyundai/Kia log, 17 powertrain signals (p. 10) | SynCAN, ROAD | ROAD masquerade | Simulation, robotic cars, testbed, real vehicles | 13 real OBD-II traces + CarSim (p. 8) | TruckMaker + brake HiL rig, 3 vehicles × 4 cycles × 2,100 s at 100 Hz (p. 3) |
| **Detector** | BiLSTM autoencoder | Shared-encoder LSTM forecaster | Ensemble of CNN autoencoders | 4 correlation-based detectors | Dynamics-model rules | Cross-checked context estimates | CNN, LSTM, PI-LSTM |
| **Explicit physics** | No | No (authors say it learns "physical relationships", p. 2) | No | No | Yes: roll, steering/yaw, accel/brake (p. 4) | Yes: slope, slip, mass estimates | Yes: spacing, relative velocity, force balance (pp. 3–4) |
| **Where physics enters** | n/a | n/a | n/a | n/a | Rules | Rules | Training loss **and** anomaly score (p. 4, §IV-D) |
| **Threshold rule** | Attack-free data (p. 4, Fig. 4) | 3σ of calibration residual (p. 10) | Training data | Per method | Physical reasoning + simulation (p. 9) | Model-based | F1-optimal on validation; Youden J and FPR-constrained also tried (p. 4) |
| **Attacks** | Fuzzing, fabrication, suspension, masquerade, replay | Drift, masquerade, plateau, gear masquerade (Table 4) | SynCAN set (not extracted) | ROAD masquerade | Injected messages | Authors' own; replay argued only (p. 13) | Bias, sinusoidal, replay, scaling, ramp, freeze, FDI, composite (p. 2, Table I) |
| **Headline result** | F1 ≥ 0.99 fabrication/masquerade on most streams; weak on suspension (p. 9, Table V) | Detection 44.7–94.6%; FPR 17.5–39.6% (p. 13, Table 4) | Masquerade AUPRC 0.65–0.88 on SynCAN (p. 12) | None effective on every attack type (p. 1) | FN < 5% at defaults, no FP on tested messages (p. 11, Table 8) | Recall > 96%, FPR < 0.5% (p. 1); PID-Piper < 30.7% TPR at ~4% FPR (p. 12, Fig. 11) | F1 93.86 → 95.74%, AUROC 97.29 → 98.33% (p. 5, Table III) |
| **Spread over runs** | not extracted | ± over 10 test blocks | not extracted | not extracted | not extracted | not extracted | Not reported |

## 5. Gap coverage after the screen

Bounded to 136 screened abstracts plus our seven full-text readings. Details: report section "Each candidate gap survives, but narrower than the proposal states".

| Candidate gap | Status | Already exists in |
|---|---|---|
| Physics-informed learner on public real-car decoded CAN (X-CANIDS) | **Not found** in 89 X-CANIDS-citing abstracts | Nearest: CAID [14] (own car, 2017); [3] learned coupling only |
| RQ2: physics as inputs vs as loss, same detector | **Not found** | Each placement exists separately: inputs [15], N4; loss [16], N5; score PIWAD; mixed [13] |
| Physics-only baseline in the same study | **Exists** in vehicles | N3, N2, [8]. Reword as "three-way comparison on recorded car CAN" |
| Threshold fixed on normal data at a fixed false-alarm budget | **Exists** as a protocol | Timing-only CAN detectors (CITA 2026); N8. Not found for a physics vs data-only comparison |
| Physics-consistent multi-signal attacker against a CAN detector | **Not found** | Analogues outside cars: N7 (industrial control), Dash (robotic vehicles) |
| R3 (yaw vs rear-wheel speed difference) in an attack detector | **Not found** in abstracts | Check SAID, CADD and EVAD full texts |

**Defensible wording (candidate gap):** no screened study puts explicit physical relations into a learned detector on a public real-car decoded CAN dataset, compares input and loss placement against both a physics-only and a data-only detector at one false-alarm budget fixed on normal data, and tests a physics-consistent attacker.

## 6. Attack-name crosswalk

| Our name | [13] | [3] | [1] dataset | N7 / N6 |
|---|---|---|---|---|
| Offset | Bias | — | — | — |
| Drift | Ramp | Drift (continuous) | — | — |
| Freeze | Freeze | Plateau | — | — |
| Replay | Replay | — | Replay | Replay (N7) |
| Whole message | — | — | Masquerade (closest) | ROAD "correlated signal" attack edits four wheel speeds inconsistently (N6, Appendix 6.3) |
| Consistent group | Scaling (all related signals) | — | — | Constrained concealment (N7) |

## 7. Verification queue (in order)

| # | Item | Why | Status |
|---|---|---|---|
| 1 | Read Gao et al., KBS 328:114237, 2025 ([doi](https://doi.org/10.1016/j.knosys.2025.114237)) | Biggest novelty risk: signal-relationship graph transformer, possibly on X-CANIDS; abstract not retrieved | Open |
| 2 | Read Luo et al., Int. J. Automotive Technology 2025 ([doi](https://doi.org/10.1007/s12239-025-00305-w)) | Causality-aware GCN over signals; abstract not retrieved | Open |
| 3 | Full text of N3 van Wyk et al. | Three-way design; real or simulated data | Open |
| 4 | Full text of N4 Chahine & Noura | D3 ablation protocol; any placement comparison | Open |
| 5 | Full text of PIWAD (reserve) | Placement ablations; adaptive attacker design | Open |
| 6 | Full text of N7 Erba et al. | How to build the consistent-group attack | Open |
| 7 | Full text of [14] CAID | Are its "reference models" explicit physics? Venue and year | Open |
| 8 | Full text of [16] Vyas et al. | Required by guide step 14 | Open |
| 9 | Short checks: [3] data = X-CANIDS?; arXiv 2604.15996 abstract; SAVIOR evaluation; keyword-search SAID/CADD/EVAD for R3 | Gap wording | Open |
| 10 | Metadata: [13] third author; N1 authors; N2 volume/year; [4] page re-mapping | Citations | Open |

## 8. Change log

| Date | Change |
|---|---|
| 2026-11-23 | Tracker created from the 17 project sources; [13] rechecked against the local PDF. |
| 2026-11-23 | Systematic screen: 136 distinct records screened on abstract (83 include, 11 uncertain, 42 exclude; 23 more had no retrievable abstract). Core reset to 20 papers + DBC file: 11 kept, N1–N10 added, [5] [6] [17] moved to reserve, [9] [10] dropped, [12] replaced by N10. Venues confirmed: [13] IEEE ISI 2026; [4] IEEE IoT-J 2023; [6] JISA 2026. |

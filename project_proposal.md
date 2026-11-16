# Physics-Informed Intrusion Detection for Vehicle CAN Bus Networks

**CSE 4531 Computer Security, UIU. Project understanding and proposal source.**
Use this file to understand the project and to pull material for the proposal document and slides. The step-by-step work is in [implementation_guide.md](implementation_guide.md). Technical terms are explained in [glossary.md](glossary.md).

Every factual statement about other people's work carries a source number. Section 13 says how far each source was actually read. Nothing here is an experimental result of ours; no experiment has been run.

---

## 1. The project in three sentences

Attackers who can send messages on a car's internal network can change values such as speed or steering angle while keeping the message timing normal. A car's signals are tied together by physics (four wheel speeds must agree with vehicle speed), so a false value should break those ties. We measure, on public recordings from a real car, whether using those physical ties helps an attack detector beyond what it learns from data alone.

## 2. Background (plain words)

- **CAN bus.** The network that lets a car's control units (engine, brakes, steering) exchange short messages. Messages are not authenticated: a receiver cannot tell who sent one.
- **Signal.** A physical value packed inside a message, for example wheel speed in km/h. A decoding file (DBC) says where each signal sits in the message bytes [1][2].
- **IDS.** Intrusion detection system: software that watches the traffic and raises an alarm on suspected attacks.
- **Attack types** as defined by our dataset's authors [1]: *fuzzing* (random IDs and random message contents), *fabrication* (extra crafted messages for one ID), *suspension* (a unit is silenced), *masquerade* (a unit is silenced and its messages are replaced), *replay* (old legitimate messages are sent again).
- **Physics-informed.** The detector is given known physical relations between signals, instead of having to discover every pattern from data.

**Threat model (our assumption; it matches how [1] and [3] build their attacks).**

- The attacker can already send frames on the bus, for example through a compromised connected device such as a diagnostic tool [7]. We do not model how that access is gained.
- The attacker can silence one control unit and send false values in its place: the masquerade case in [1]. Message timing is kept normal.
- The defender sees only decoded signal values on the receiving side. The bus has no message authentication.
- Stronger attacker, tested separately: changes several related signals together so they stay consistent with each other (the "consistent group" attack in section 10).
- Out of scope: physical tampering with wires or sensors, attacks on the detector itself, and an attacker who knows our thresholds.

## 3. Motivation

- Detectors that look only at message timing or ID order cannot see an attack that keeps timing normal and changes only the values [3][8].
- Signal-level detectors exist, but the closest recent one reports false positive rates of 17.5% to 39.6% depending on the attack [3]. A detector that cries wolf that often cannot be used.
- Physics-based checks on real vehicles report low error rates in their own tests (missed attacks below 5% at default thresholds in [7]; false positive rate below 0.5% in [8]), but they are built from engineering models rather than learned from signal data [7][8].
- Nobody we found has measured, on the same public data, what physics adds to a learned detector.

## 4. Problem statement

> Given decoded CAN signals from a real car, detect value-tampering attacks on those signals with as few false alarms as possible, and determine whether explicit physical relations between signals improve detection compared with a detector that only learns from normal data.

## 5. Related work

| # | Work | What it does | What it leaves open for us |
|---|---|---|---|
| [1] | X-CANIDS (IEEE TVT 2024) | Decodes signals with a DBC file, trains an autoencoder (BiLSTM, a network type for sequences) on 107 signals from attack-free driving, flags high reconstruction error. In the result rows we read, precision and recall are above 0.99 for fabrication and masquerade. | Uses no physical relations. Authors state two limits: one vehicle only, and weak on suspension attacks. Its built-in attacks look easy to detect, so they may not separate good detectors from bad ones. |
| [3] | Digital-twin IDS (arXiv, Aug 2026, preprint) | LSTM learns relationships among 17 decoded engine and transmission signals; alarm on prediction error. Detection 44.7% to 94.6% by attack type. | Learns relationships from data only; no explicit physics. False positives 17.5% to 39.6%. Powertrain signals only; no wheel, steering or motion signals. |
| [4] | CANShield (2022) | Autoencoders built from convolutional layers (CNN) on signal data from SynCAN and ROAD (3 h training, 30 min test). | No physical relations. ROAD signals have no public names, so physics cannot be written for them. |
| [5] | Ganesan et al. (SAE 2017) | Pairwise correlation between vehicle sensors to detect anomalies. | Statistical correlation, not physical equations. |
| [6] | ORNL benchmark of unsupervised masquerade detectors on ROAD (2024) | Compares four correlation-based detectors. No single method is best for every attack; the benchmarked detectors do not detect every attack type. | Correlation only; no named physical signals. |
| [7] | SAID (USENIX Security 2022) | Checks injected messages against three vehicle dynamics models (roll, steering/yaw, accelerating/braking) on real vehicles. Reports false negatives below 5% at default thresholds. | Rule and threshold based. Authors name machine learning as future work. No comparison with a learned detector. |
| [8] | CADD (RAID 2024) | Checks that driver controls match the resulting acceleration, estimating road slope, tyre slip and mass. Reports recall above 96% and false positive rate below 0.5% on more than 87,000 test cases. | Acceleration only. Needs engine torque, pedal, gear and slope information. No learned-detector comparison. |
| [9] | ATHENA (2025 preprint) | Mines rules from message bits on ROAD. | Not motion equations. |
| [10] | "Conservative PINN" with encryption (2026 journal) | Claims a PINN for CAN and reports RPM spoofing accuracy. | Shows the phrase "PINN for CAN" is already used. Not read beyond a summary. |

## 6. The gap (candidate)

In the sources we read:

- Detectors that use vehicle physics [7][8] are built from engineering models with thresholds. In the parts we read, neither is compared against a learned signal detector. We have not read their evaluation sections in full, so the literature review must confirm this.
- Detectors that learn from signals [1][3][4] use no explicit physics.
- We did not find a study that puts both on the same public decoded-signal data and measures what physics adds, under the same false-alarm budget, on unseen recordings.

**This is a candidate gap.** It rests on the ten sources in section 13 and a handful of searches, not a systematic review. The Stage 2 literature review must confirm it. If a paper that already does this turns up, the project becomes a replication on different data, which is still a valid course project.

## 7. Research questions

- **RQ1.** At the same false-alarm budget, does a learned detector with physics detect more signal-tampering attacks than the same detector without physics?
- **RQ2.** Does it matter how physics is added: as extra inputs, or as a training penalty?
- **RQ3.** Is the neural network needed at all, or do the physics checks alone do as well?
- **RQ4.** Which attacks stay invisible to physics, and why?

We do not predict the answers. "Physics did not help" is an acceptable outcome and will be reported as such.

## 8. Scope

**In scope**

- One public dataset from one real car [1].
- Signal-level tampering attacks (values changed, timing unchanged).
- Four small detectors compared on identical inputs.
- Offline analysis in Python on a normal laptop or free cloud notebook.

**Out of scope**

- Hardware, simulators, real-vehicle tests.
- Timing-based attacks as a research target (fuzzing, suspension). They are run once as a side check only.
- Classic equation-solving PINNs, new neural architectures, real-time deployment.
- Vehicle-to-vehicle (platoon) security.
- Any claim about other car models.

## 9. Data

**X-CANIDS dataset** [1], IEEE DataPort, free account required.

- Real Hyundai LF Sonata 2017, recorded through the diagnostic port.
- Six driving recordings and one idling recording, attack-free.
- Attacks were simulated into recording 6 during seconds 480 to 1440. They were not executed on the moving car.
- Signal version: 1.11 GB, 688 signal columns plus a label column, decoded with the public file `hyundai_2015_ccan.dbc` [2].
- The paper's message table shows this car transmits the messages we need, with changing content: `WHL_SPD11` (wheel speeds, every 20 ms), `ESP12` (accelerations and turning rate, every 10 ms), `SAS11` (steering angle, 10 ms), `CLU11` (displayed speed, 20 ms), `EMS11` (engine speed, 10 ms), `TCU12` (gear, 10 ms) [1].

Physical relations we plan to use (signal names from [2]):

| ID | Relation in words | Signals |
|---|---|---|
| R1 | The four wheel speeds agree with the vehicle speed | `WHL_SPD_FL/FR/RL/RR`, `CF_Clu_Vanz`, `VS`, `VS_TCU` |
| R2 | Rate of change of speed matches measured forward acceleration | wheel speeds, `LONG_ACCEL` |
| R3 | Turning rate matches the left/right rear wheel speed difference | `YAW_RATE`, `WHL_SPD_RL`, `WHL_SPD_RR` |
| R4 | Sideways acceleration = speed × turning rate | `LAT_ACCEL`, speed, `YAW_RATE` |
| R5 | Engine speed ÷ road speed is constant within a gear | `N`, speed, `CF_Tcu_TarGr` (target gear 1 to 7) |

**Still unverified:** we have not opened the files. Column names, sampling rate, recording lengths, and whether each relation actually holds on this car are checked in steps 2 to 5 of the implementation guide before anything else is built.

## 10. Method: how it works

```
decoded signals ──► align to one time grid ──► split by whole recording
                                                      │
                        ┌─────────────────────────────┼──────────────────────────┐
                        ▼                             ▼                          ▼
              fit physics constants          train detectors             inject test attacks
              on normal training data        on normal training data     into unseen normal recordings
                        └─────────────┬───────────────┘                          │
                                      ▼                                          ▼
                         set alarm threshold on a separate            score, count detections
                         normal recording (fixed after this)          and false alarms
```

Four detectors, same signals, same windows:

| | Detector | Purpose |
|---|---|---|
| D1 | **Physics only.** Compute how far each relation R1 to R5 is violated; alarm when the violation is abnormally large. No neural network. | Answers RQ3. |
| D2 | **Data only.** A small autoencoder learns to reconstruct normal signal windows; alarm on large reconstruction error. Same family as [1][4]. | The baseline. |
| D3 | **Data + physics inputs.** D2 with the violations from D1 added as extra input channels. | RQ1, RQ2. |
| D4 | **Physics in training.** D2 with an extra training penalty when its reconstruction breaks R1 to R5. This is the "physics-informed neural network" in the loose sense. | RQ1, RQ2. |

**Attacks used for testing.** We edit signal values in unseen normal recordings: freeze a value, drift it slowly, add an offset, replay an earlier segment. Freeze and drift are also used in [3]; replay is one of the dataset's own categories [1]. We also include one attack that changes a whole group of related signals consistently, which physics is expected to miss, to show the limit honestly. All of these are labelled synthetic.

## 11. Evaluation

- **Split by whole recording.** Training, threshold-setting and test recordings never share a drive. Recording 6 and everything derived from it are test only.
- **Thresholds fixed before testing**, using a separate normal recording.
- **Reported numbers:** detection rate per attack type and size at the fixed threshold; false alarms per hour of normal driving; threshold-free ranking score (AUROC); time from attack start to first alarm; mean and spread over several training runs.
- **Breakdowns:** by target signal, by attack size, and by which relation fired.
- **Side check:** all four detectors on the dataset's built-in attacks, reported separately.

## 12. Risks and how we handle them

| Risk | Evidence | Handling |
|---|---|---|
| The dataset's built-in attacks are too easy to separate the detectors | [1] reports above 0.99 on them | Main test uses our own edits at several sizes, down to small ones. |
| Only one recording contains attacks | [1] | Inject our edits into every unseen normal recording. |
| Signals arrive at different rates (10 ms and 20 ms) | Message table in [1] | Resample onto one time grid before anything else. |
| A relation does not hold on this car (slopes, wheel slip, gear changes, standstill) | [8] has to estimate slope, slip and mass | Test every relation on normal data first. Drop relations that fail. Ignore periods below a minimum speed. |
| The decoding file is community-made, not from the manufacturer | [2]; [3] had to mix two DBC files | Confirm each signal's meaning and unit from the data itself. |
| High false alarms | 17.5% to 39.6% in [3] | Fix the false-alarm budget first; report alarms per hour, not only accuracy. |
| Physics adds nothing | Possible | Report it. RQ3 and RQ4 still give results. |
| Someone already did this | [7][8] are close | Stage 2 review; position as a controlled comparison, cite them as the physics baselines. |
| Edited recordings are not real attacks | Same limit as [1][3] | State it. The car does not react to our edits. No safety claims. |
| One car only | [1] states this limit itself | No claim about other vehicles. |

## 13. Sources and how far each was read

| # | Source | Read level |
|---|---|---|
| [1] | Jeong, Lee, Lee, Kim. "X-CANIDS: Signal-Aware Explainable Intrusion Detection System for Controller Area Network-Based In-Vehicle Network." IEEE TVT 73(3), 2024. [Paper](https://doi.org/10.1109/TVT.2023.3327275) · [arXiv:2303.12278](https://arxiv.org/abs/2303.12278) · [Dataset](https://ieee-dataport.org/open-access/x-canids-dataset-vehicle-signal-dataset) | Dataset page read in full. arXiv version searched by keyword across the full text. Dataset files not opened. |
| [2] | [hyundai_2015_ccan.dbc](https://github.com/commaai/opendbc/blob/master/opendbc/dbc/hyundai_2015_ccan.dbc), commaai/opendbc | File downloaded; message and signal definitions checked. |
| [3] | Rahman, Salek, Chowdhury. "Digital Twin-Based Intrusion Detection for Vehicle Powertrain CAN Bus Systems." [arXiv:2608.17093](https://arxiv.org/abs/2608.17093), 2026 | Abstract read; full PDF searched by keyword. Preprint, not peer reviewed. |
| [4] | Shahriar et al. "CANShield." [arXiv:2205.01306](https://arxiv.org/abs/2205.01306) | Full text searched by keyword. |
| [5] | Ganesan et al. "Exploiting Consistency Among Heterogeneous Sensors for Vehicle Anomaly Detection." SAE 2017. [PDF](https://kabru.eecs.umich.edu/rtclweb/assets/publications/2017/Ganesan-SAE-2017.pdf) | Search summary, and as described in [6]. Not read directly. |
| [6] | "Evaluating lightweight unsupervised online IDS for masquerade attacks in CAN." [arXiv:2406.13778](https://arxiv.org/abs/2406.13778), 2024 | Full text searched by keyword. |
| [7] | Xue et al. "SAID: State-aware Defense Against Injection Attacks on In-vehicle Network." USENIX Security 2022. [PDF](https://usenix.org/system/files/sec22summer_xue.pdf) | Full PDF searched by keyword. Title and authors confirmed from the PDF. |
| [8] | Chen, Shin, Dadras. "Context-Aware Anomaly Detection Using Vehicle Dynamics" (the method is called CADD). RAID 2024. [PDF](https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2024/raid24-chen.pdf) | Full PDF searched by keyword. |
| [9] | Wang et al. "ATHENA." [arXiv:2503.17067](https://arxiv.org/abs/2503.17067), 2025 | Search summary only. |
| [10] | Homomorphic-encryption IDS with conservative PINN, Journal Européen des Systèmes Automatisés, 2026. [Listing](https://www.iieta.org/journals/jesa/paper/10.18280/jesa.590401) | Search summary only. |

"Searched by keyword" means the full text was fetched and the passages on data, method, results and limits were read. It is not a cover-to-cover reading. Before the Stage 2 review, read [1], [3], [7] and [8] completely and confirm every number quoted above.

## 14. What we may and may not claim

**May claim:** a controlled comparison of four detectors on public real-car signals; where physics helped and where it did not, on this car; a reproducible attack-injection procedure.

**May not claim:** the first physics-informed CAN detector; a PINN in the strict sense; attacks carried out on a vehicle; results that hold for other cars; crash prevention; publication.

## 15. Slide outline

| Slide | Pull from |
|---|---|
| Title, team, theme T4 (ML for threat detection) | top of file |
| Motivation | section 3 |
| Background: CAN, signals, attack types | section 2 |
| Problem statement | section 4 |
| Related work and gap | sections 5, 6 (use rows [1], [3], [7], [8]) |
| Research questions | section 7 |
| Data | section 9 |
| Method and diagram | section 10 |
| Evaluation plan | section 11 |
| Risks and limits | sections 12, 14 |
| Scope and what we will deliver | section 8; deliverables: code, results table, paper |

## 16. Likely questions

- **Is this a PINN?** No, not in the strict sense. A classic PINN solves a differential equation. We use known relations between signals inside a detector, which is physics-informed learning. Detector D4 puts physics in the training loss.
- **What is new?** Possibly the controlled comparison. We say "candidate gap" until the literature review confirms it.
- **Are the attacks real?** No. They are edits to recorded normal driving, as in [1] and [3]. The car does not react.
- **Why not use the dataset's own attacks?** We do, as a side check. The dataset's authors already detect them at above 0.99, so they are unlikely to show a difference between detectors.
- **What if physics does not help?** We report that, plus which attacks physics can never see.
- **Can an attacker beat physics checks?** Yes, by changing all related signals consistently. We test exactly that case and report it.
- **Cost?** None. Public data, free software, an ordinary computer.

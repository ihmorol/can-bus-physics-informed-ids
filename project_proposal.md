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
- Mixing physics with learning is **not new**: it has been done for in-car signals [14], electric-vehicle powertrains [15] and vehicle platoons [13][16]. The closest study [13] trains the same LSTM with and without a physics loss and reports that physics raised overall F1 from 93.86% to 95.74%. That result comes from simulated platoon data with a hardware brake rig, not from a car's internal network.
- What we did not find is the same with-and-without-physics test on a **public recording of a real car's CAN bus**, with the alarm threshold fixed on normal driving only.

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
| [8] | CADD (RAID 2024) | Checks that driver controls match the resulting acceleration, estimating road slope, tyre slip and mass. Reports recall above 96% and false positive rate below 0.5% on more than 87,000 test cases. | Acceleration only. Needs engine torque, pedal, gear and slope information. Does compare against a learned detector: an LSTM-based baseline (PID-Piper), reimplemented by the authors and tested only in CarSim with varied road slope and friction. At a false-positive rate near CADD's (about 4%) it caught under 30.7% of attacks (PDF p. 12, Fig. 11), and still had a 66.95% false-positive rate with extra slope training data (PDF p. 19, Table 11). No physics-informed learner in that comparison, and none on recorded data. |
| [9] | ATHENA (2025 preprint) | Mines rules from message bits on ROAD. | Not motion equations. |
| [10] | "Conservative PINN" with encryption (2026 journal) | Claims a PINN for CAN and reports RPM spoofing accuracy. | Shows the phrase "PINN for CAN" is already used. Not read beyond a summary. |
| [13] | Philip et al., physics-informed LSTM for platoon attack detection (2026) | **Closest prior work.** CNN, LSTM and physics-informed LSTM (PI-LSTM) trained on normal data only, same sequences, attacks and threshold rule for all. Physics loss from spacing, velocity and force-balance residuals; a learnable offset absorbs road grade. Overall AUROC 98.33%, F1 95.74% (LSTM without physics: 97.29%, 93.86%). | Platoon (vehicle-to-vehicle) states, not in-car CAN signals. Data from a truck simulator plus a brake hardware rig, not a recorded drive. Threshold chosen as the F1-optimal point on validation data that contains attacks. No physics-only baseline, no attacker who keeps physics consistent. |
| [14] | Wasicek et al., context-aware intrusion detection (CAID) | Adds a physical model to a car IDS; an unsupervised neural network flags chip-tuning manipulation of engine behaviour. | Shows "physics + learned detector for in-car signals" already exists. Not read beyond a summary and the authors' slides; year, venue and data to confirm. |
| [15] | Guo, Ye, Yang, "Cyberattack detection for electric vehicles using physics-guided machine learning," IEEE TTE 7(3), 2021 | Physics-guided classifier for EV cyberattacks, tested on a hardware-in-the-loop rig. | Supervised, EV powertrain, lab rig. Abstract and listing only. |
| [16] | Vyas, Padisala, Dey, PINN for attack detection in platoons, ACC 2023 | PINN with physics-guided parameter learning on platoon perception channels. | As described in [13]: several PINNs trained online. Not read directly. |
| [17] | Zhao et al., "Application-layer anomaly detection leveraging time-series physical semantics in CAN-FD vehicle networks," Electronics 13(2), 2024 | LSTM with self-attention predicts decoded CAN-FD signal values. | "Physical semantics" means the signals' meaning, not physical equations. Private data. Search summary only. |

## 6. The gap (candidate, revised 2026-11-22)

**What is already done, so we must not claim it:**

- Physics-based intrusion detection for cars exists [7][8].
- Physics combined with a learned detector exists for in-car signals [14], EV powertrains [15] and platoons [13][16].
- A controlled "same network, with and without physics" comparison exists [13], but on simulated platoon data.

**What we did not find** (17 sources, about 12 targeted web searches on 2026-11-22; not a systematic review):

- That comparison on a **public, real-car, decoded CAN dataset**. Searches for physics-informed work on X-CANIDS [1] returned nothing.
- A comparison that includes a **physics-only detector** as well, so the network's own value is tested (RQ3). The nearest is [8], which pits a physics detector against a plain LSTM detector, but only in simulation and with no physics-informed learner.
- An alarm threshold fixed on **normal driving only**, before any attack is seen. [13] picks its threshold using validation data that contains attacks, which real deployments cannot do.
- A test against an attacker who **keeps the physics consistent** (RQ4).

**So the project is:** a test of whether a reported benefit of physics-informed learning [13] carries over from simulated platoon data to a real car's internal network, under stricter evaluation rules. If physics does not help here, that is still a finding. If a paper that already does this turns up, the project becomes a replication on different data, which is still a valid course project.

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

How our attacks line up with the closest prior work [13], so results can be compared in words (not in numbers, because the data differ): offset = their *bias*, drift = their *ramp*, freeze = *freeze*, replay = *replay*, consistent group = a *scaling* attack applied to every related signal at once. We do not use their sinusoidal, FDI or composite attacks (our choice, to keep the core small).

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
| Someone already did this | [7][8] use physics; [13] already compares with and without physics, on platoons | Do not claim "first physics IDS". Cite [13] as the study we test on real CAN data; cite [7][8][14] as physics detectors. Stage 2 review re-checks for a CAN-dataset version. |
| Edited recordings are not real attacks | Same limit as [1][3] | State it. The car does not react to our edits. No safety claims. |
| One car only | [1] states this limit itself | No claim about other vehicles. |

## 13. Sources and how far each was read

> **Updated 2026-11-23 after the systematic screen** (136 abstracts; see `reports/CAN IDS systematic literature review.md` and `decisions.md`). The current register is [research/literature_tracker.md](research/literature_tracker.md). Changes to the table below: **[9] and [10] dropped**; **[12] replaced by N10** (Checkoway et al., USENIX Security 2011); **[5], [6], [17] moved to a reserve list**; venues confirmed for [13] (IEEE ISI 2026, doi:10.1109/ISI69914.2026.11685836), [4] (IEEE IoT-J 10(24), 2023) and [6] (JISA 98:104392, 2026). New core papers N1–N10 are listed after this table. The table is kept for the read-level history.

| # | Source | Read level |
|---|---|---|
| [1] | Jeong, Lee, Lee, Kim. "X-CANIDS: Signal-Aware Explainable Intrusion Detection System for Controller Area Network-Based In-Vehicle Network." IEEE TVT 73(3), 2024. [Paper](https://doi.org/10.1109/TVT.2023.3327275) · [arXiv:2303.12278](https://arxiv.org/abs/2303.12278) · [Dataset](https://ieee-dataport.org/open-access/x-canids-dataset-vehicle-signal-dataset) | Dataset page read in full. arXiv version searched by keyword across the full text. Dataset files not opened. |
| [2] | [hyundai_2015_ccan.dbc](https://github.com/commaai/opendbc/blob/master/opendbc/dbc/hyundai_2015_ccan.dbc), commaai/opendbc | File downloaded; message and signal definitions checked. |
| [3] | Rahman, Salek, Chowdhury. "Digital Twin-Based Intrusion Detection for Vehicle Powertrain CAN Bus Systems." [arXiv:2608.17093](https://arxiv.org/abs/2608.17093), 2026 | Abstract read; full PDF searched by keyword. Preprint, not peer reviewed. |
| [4] | Shahriar et al. "CANShield." [arXiv:2205.01306](https://arxiv.org/abs/2205.01306) | Full text searched by keyword. |
| [5] | Ganesan et al. "Exploiting Consistency Among Heterogeneous Sensors for Vehicle Anomaly Detection." SAE 2017. [PDF](https://kabru.eecs.umich.edu/rtclweb/assets/publications/2017/Ganesan-SAE-2017.pdf) | Search summary, and as described in [6]. Not read directly. |
| [6] | "Evaluating lightweight unsupervised online IDS for masquerade attacks in CAN." [arXiv:2406.13778](https://arxiv.org/abs/2406.13778), 2024 | Full text searched by keyword. |
| [7] | Xue et al. "SAID: State-aware Defense Against Injection Attacks on In-vehicle Network." USENIX Security 2022. [PDF](https://usenix.org/system/files/sec22summer_xue.pdf) | Full PDF searched by keyword. Title and authors confirmed from the PDF. |
| [8] | Chen, Shin, Dadras. "Context-Aware Anomaly Detection Using Vehicle Dynamics" (the method is called CADD). RAID 2024. [PDF](https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2024/raid24-chen.pdf) | Full PDF searched by keyword. Results, baseline comparison (§7) and Appendix C re-read on 2026-11-23 for `literature_review.md`. |
| [9] | Wang et al. "ATHENA." [arXiv:2503.17067](https://arxiv.org/abs/2503.17067), 2025 | Search summary only. |
| [10] | Homomorphic-encryption IDS with conservative PINN, Journal Européen des Systèmes Automatisés, 2026. [Listing](https://www.iieta.org/journals/jesa/paper/10.18280/jesa.590401) | Search summary only. |
| [11] | Koscher et al. "Experimental security analysis of a modern automobile." IEEE S&P 2010 | Cited from memory in the slide notes; not re-read. |
| [12] | Miller and Valasek. "Remote exploitation of an unaltered passenger vehicle." Black Hat USA 2015 | Cited from memory in the slide notes; not re-read. |
| [13] | Philip, Rajadurai, Koonthalakadu Baby, Subramanian. "Physics-Informed Temporal Learning for Cyber Attack Detection in Vehicle Platoons." 2026. Local copy: `references/ISI_2026_Princy.pdf` | **Full PDF read (6 pages).** The PDF itself does not print the venue; "ISI 2026" comes from the file name only. Confirm before citing. |
| [14] | Wasicek, Pesé, Weimerskirch, Burakova, Singh. "Context-aware Intrusion Detection in Automotive Control Systems." [Slides](https://www.slideshare.net/ArminWasicek/contextaware-automotive-intrusion-detection-using-reference-models) | Search summary and slide listing only. Year and venue not confirmed. |
| [15] | Guo, Ye, Yang. "Cyberattack Detection for Electric Vehicles Using Physics-Guided Machine Learning." IEEE TTE 7(3):2010–2022. [Listing](https://www.aminer.cn/pub/600fe71fd4150a363c218ad8/cyberattack-detection-for-electric-vehicles-using-physics-guided-machine-learning) | Abstract via listing; bibliographic details from [13]'s reference list. |
| [16] | Vyas, Padisala, Dey. "A physics-informed neural network approach towards cyber attack detection in vehicle platoons." ACC 2023, pp. 4537–4542 | Only as described in [13]. Not read. |
| [17] | Zhao et al. "Application-Layer Anomaly Detection Leveraging Time-Series Physical Semantics in CAN-FD Vehicle Networks." Electronics 13(2):377, 2024. [Paper](https://mdpi.com/2079-9292/13/2/377) | Search summary only. |

**New core sources added 2026-11-23** (abstract read during the screen; full details and DOIs in `research/literature_tracker.md`):

| # | Source | Role |
|---|---|---|
| N1 | Kang et al., "CANival," Vehicular Communications 50:100845, 2024 | Only peer-reviewed signal-level detector with X-CANIDS numbers |
| N2 | Ben Othmane et al., "On the Performance of Detecting Injection of Fabricated Messages into the CAN Bus," IEEE TDSC, 2020 | Physics relation (speed vs RPM) vs unsupervised ML on a real moving vehicle |
| N3 | van Wyk, Wang, Khojandi, Masoud, "Real-Time Sensor Anomaly Detection and Identification in Automated Vehicles," IEEE T-ITS 21(3), 2020 | Physics-only vs learned vs hybrid in one study |
| N4 | Chahine, Noura, "Features over Architecture: Physics-Informed Anomaly Detection in Industrial Control Systems," Future Internet 18(6):308, 2026 | Template for D3 (physics features vs raw, same detector) |
| N5 | Zideh, Solanki, "Multivariate physics-informed convolutional autoencoder for anomaly detection in power distribution systems...," SEGAN 44:102022, 2025 | Template for D4 (physics term in an autoencoder loss) |
| N6 | Verma et al., "A comprehensive guide to CAN IDS data and introduction of the ROAD dataset," PLOS ONE 19(1), 2024 | Dataset-realism critique |
| N7 | Erba et al., "Constrained Concealment Attacks against Reconstruction-based Anomaly Detectors in ICS," ACSAC 2020 | Model for the consistent-group attack (RQ4) |
| N8 | Urbina et al., "Limiting the Impact of Stealthy Attacks on Industrial Control Systems," ACM CCS 2016 | Evaluation at a fixed false-alarm bound |
| N9 | Rajapaksha et al., "AI-Based Intrusion Detection Systems for In-Vehicle Networks: A Survey," ACM Computing Surveys, 2023 | Survey for the introduction |
| N10 | Checkoway et al., "Comprehensive Experimental Analyses of Automotive Attack Surfaces," USENIX Security 2011 | Replaces [12] |

"Searched by keyword" means the full text was fetched and the passages on data, method, results and limits were read. It is not a cover-to-cover reading. Before the Stage 2 review, read [1], [3], [7] and [8] completely and confirm every number quoted above.

## 14. What we may and may not claim

**May claim:** a controlled comparison of four detectors on public real-car signals; where physics helped and where it did not, on this car; a reproducible attack-injection procedure.

**May not claim:** the first physics-informed CAN detector; that physics-based or physics-informed intrusion detection has not been done (it has [7][8][13]–[16]); the first with-and-without-physics comparison ([13] did one on platoons); a PINN in the strict sense; attacks carried out on a vehicle; results that hold for other cars; crash prevention; publication.

## 15. Slide outline

*Historical: this is the outline of the Stage 1 slides, which were presented before the 2026-11-22 revision. Their gap slide used only [1], [3], [7], [8]. Any future slides must use section 6 as revised and cite [13].*

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
- **Physics-informed detection has been done. What is new?** Agreed, it has [7][8][13]–[16]. The closest study [13] showed physics helps an LSTM on simulated platoon data. We test whether that holds on a public recording of a real car's CAN bus, with a physics-only baseline, a threshold fixed on normal driving only, and an attacker who keeps physics consistent. We say "candidate gap" until the literature review confirms nobody has done this on CAN data.
- **Are the attacks real?** No. They are edits to recorded normal driving, as in [1] and [3]. The car does not react.
- **Why not use the dataset's own attacks?** We do, as a side check. The dataset's authors already detect them at above 0.99, so they are unlikely to show a difference between detectors.
- **What if physics does not help?** We report that, plus which attacks physics can never see.
- **Can an attacker beat physics checks?** Yes, by changing all related signals consistently. We test exactly that case and report it.
- **Cost?** None. Public data, free software, an ordinary computer.

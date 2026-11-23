# Does Physics Help a Learned CAN Intrusion Detector on Real-Car Data?

**CSE 4531 Computer Security, UIU. Stage 1 proposal, revised 22 November 2026.**
Theme T4: Machine Learning for Threat Detection.

> **What changed since the first version.** The first version split earlier work into "learned detectors" and "physics rule checkers" and implied nobody had combined the two. That was wrong. Physics-informed detectors already exist for cars, electric vehicles and vehicle platoons [7][8][13]–[16], and one study [13] already compares the same network with and without physics. This version cites that work, drops any "first" claim, and narrows the contribution to what we could not find: the same test on a public real-car CAN dataset, under stricter evaluation rules.

## 1. Problem

A car's control units talk over the CAN bus, which has no message authentication. An attacker who can send frames can silence a unit and send false values in its place while keeping message timing normal (masquerade) [1]. Timing-based detectors cannot see this. Value-based detectors can, but the closest recent one reports false-positive rates of 17.5% to 39.6% [3].

The car's signals obey physics: the four wheel speeds agree with the vehicle speed, the turning rate matches the speed difference between the rear wheels, and so on. A false value should break these ties.

**Problem statement.** On decoded CAN signals from a real car, does adding known physical relations to a learned detector catch more value-tampering attacks at the same false-alarm rate?

## 2. What is already done

| Line of work | Examples | Uses physics? | Learned? | Real in-car CAN data? |
|---|---|---|---|---|
| Signal-level learned IDS | X-CANIDS [1], CANShield [4], digital twin [3] | No | Yes | Yes |
| Physics rule checkers | SAID [7], CADD [8] | Yes | No | Yes, own vehicles |
| Physics + learning, in-car | CAID [14] | Yes | Yes | Own data, chip tuning |
| Physics + learning, EV and platoon | Guo et al. [15], Vyas et al. [16], Philip et al. [13] | Yes | Yes | No: lab rig or simulation |

The closest study is Philip et al. [13]. It trains a CNN, an LSTM and a physics-informed LSTM on normal platoon data only, and adds a loss for violated spacing, velocity and force-balance relations. Physics raised overall F1 from 93.86% to 95.74% and AUROC from 97.29% to 98.33%. Its data come from a truck simulator plus a brake hardware rig, and the threshold is picked as the F1-best point on validation data that contains attacks.

## 3. Gap (candidate)

In 17 sources and about 12 targeted searches (not a systematic review), we did not find:

1. a with-and-without-physics comparison on a **public, real-car, decoded CAN dataset** (nothing physics-informed turned up for X-CANIDS [1]);
2. a **physics-only** detector in the same comparison, which tests whether the network is needed at all (CADD [8] compares a physics detector with a plain LSTM detector, but only in simulation and with no physics-informed learner);
3. thresholds fixed on **normal driving only**, before any attack is seen;
4. a test against an attacker who **changes related signals consistently**, which physics should miss.

So the project tests whether the benefit reported in [13] carries over to a real car's internal network under these stricter rules. The Stage 2 literature review must confirm the gap. If someone has done it, the work becomes a replication on public data.

## 4. Research questions

- **RQ1.** At the same false-alarm budget, does a learned detector with physics detect more value-tampering attacks than the same detector without it?
- **RQ2.** Does it matter whether physics enters as extra inputs or as a training penalty?
- **RQ3.** Do the physics checks alone do as well as any learned detector?
- **RQ4.** Which attacks stay invisible to physics, and why?

We do not predict the answers. "Physics did not help" is an acceptable result.

## 5. Data

X-CANIDS signal dataset [1]: a 2017 Hyundai Sonata recorded through the diagnostic port, decoded with a public DBC file [2]. **Checked by us (16 Nov 2026):** 7 recordings (6 driving, about 171 min in total, and 1 idling), 688 signals each, all on an exact 5 ms grid. All signals we need are present with no missing values. Built-in attacks exist only for recording 6. The built-in masquerade and fabrication attacks on the wheel-speed message flip the values between 0 and 511.97 km/h, which any detector catches. Our main test therefore uses our own edits.

Relations, to be fitted and kept or dropped on training and validation data only:

| ID | Relation |
|---|---|
| R1 | Four wheel speeds agree with vehicle speed from three other units |
| R2 | Rate of change of speed matches forward acceleration |
| R3 | Turning rate matches the rear-wheel speed difference |
| R4 | Sideways acceleration = speed × turning rate |
| R5 | Engine speed ÷ road speed is constant within a gear |

A first look (not a result) gave correlations of 0.999+ for R1 and 0.75 to 0.92 for R2 to R4.

## 6. Method

Figure 1 (`proposal/figures/methodology_flowchart.pdf`) shows the whole process. Four detectors see the same signals and the same 1 s windows:

| | Detector | Answers |
|---|---|---|
| D1 | Physics only: scaled violation of the kept relations | RQ3 |
| D2 | Data only: small autoencoder, alarm on reconstruction error | Baseline |
| D3 | D2 plus the D1 violations as extra inputs | RQ1, RQ2 |
| D4 | D2 plus a physics penalty in the training loss (same idea as [13]) | RQ1, RQ2 |

**Attacks.** We edit signal values in unseen normal recordings: offset, drift, freeze, replay, all four wheel speeds together, and a consistent group attack that scales every speed signal by the same factor. In the terms of [13] these are bias, ramp, freeze, replay and scaling. Three sizes, from small to large, measured in units of each signal's normal spread. One control signal (engine temperature) has no physics partner.

## 7. Evaluation

- Split by whole recording: train, validation and test never share a drive. Recording 6 is test only.
- One threshold per detector, set as the 99.9th percentile of scores on normal validation driving and frozen before testing.
- Report detection rate per attack type and size, false alarms per hour, AUROC, time to first alarm, and the spread over seeds.
- A difference counts only if it is larger than the spread across seeds.
- Side check: the dataset's own attacks, reported separately.

## 8. Risks and limits

| Risk | Handling |
|---|---|
| A relation does not hold on this car (slopes, slip, gear changes) | Fit and test each one first; drop failures; ignore speeds below 5 km/h |
| Physics adds nothing | Report it; RQ3 and RQ4 still give results |
| Attacks are edits, not real attacks | Stated as a limit, as in [1][3]; no safety claims |
| One car, community DBC file | No claim about other vehicles; check units from the data |
| Someone already did this on CAN data | Cite it and run as a replication |

**Out of scope:** hardware, simulators, platoons, strict equation-solving PINNs, real-time deployment.

**Cost:** none. Public data, free software, an ordinary laptop.

## 9. Deliverables

Code, the fitted relations, the frozen thresholds, a decisions log, a results table per research question, and the Stage 4 paper.

## References

[1] Jeong et al., "X-CANIDS: Signal-Aware Explainable Intrusion Detection System for CAN-Based In-Vehicle Network," IEEE TVT 73(3), 2024; dataset on IEEE DataPort.
[2] commaai/opendbc, `hyundai_2015_ccan.dbc`.
[3] Rahman, Salek, Chowdhury, "Digital Twin-Based Intrusion Detection for Vehicle Powertrain CAN Bus Systems," arXiv:2608.17093, 2026 (preprint).
[4] Shahriar et al., "CANShield," arXiv:2205.01306.
[7] Xue et al., "SAID: State-aware Defense Against Injection Attacks on In-vehicle Network," USENIX Security 2022.
[8] Chen, Shin, Dadras, "Context-Aware Anomaly Detection Using Vehicle Dynamics" (CADD), RAID 2024.
[13] Philip, Rajadurai, Koonthalakadu Baby, Subramanian, "Physics-Informed Temporal Learning for Cyber Attack Detection in Vehicle Platoons," 2026 (venue to confirm).
[14] Wasicek, Pesé, Weimerskirch, Burakova, Singh, "Context-aware Intrusion Detection in Automotive Control Systems" (year and venue to confirm).
[15] Guo, Ye, Yang, "Cyberattack Detection for Electric Vehicles Using Physics-Guided Machine Learning," IEEE TTE 7(3), 2021.
[16] Vyas, Padisala, Dey, "A Physics-Informed Neural Network Approach Towards Cyber Attack Detection in Vehicle Platoons," ACC 2023.

Numbering follows `project_proposal.md`, which also records how far each source was read.

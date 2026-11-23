# Literature review: learned, physics-based and physics-informed detection of CAN signal tampering

Draft for Stage 2, 23 Nov 2026. Source numbers follow `project_proposal.md` §13.

## Scope and how to read this section

This section synthesises the seven selected sources that we could read in full text: X-CANIDS [1], the digital-twin detector [3], CANShield [4], the ORNL masquerade benchmark [6], SAID [7], CADD [8] and Philip et al. [13]. Four related works ([5], [14], [15], [16]) are known to us only from abstracts, slides or other papers' descriptions, so they appear only where that limit is stated. The set comes from the proposal's targeted searches, not a systematic review, and it does not support claims about the whole field. Locators give the PDF page of the file we consulted (for arXiv papers, the version named in the source list). In the text, "reports" or "found" marks a result in the source; "argues" or "attributes" marks the authors' interpretation; "we read" or "suggests" marks our own.

## Learned value-based detectors catch timing-preserving attacks, but unevenly

A masquerade attacker silences a control unit and sends forged values at the expected times, so frame timing stays normal [6, p. 1]. All four learned detectors in the set respond by modelling decoded signal values from attack-free driving, and all report that this detects payload tampering. The level of success differs a great deal.

X-CANIDS trains a BiLSTM autoencoder on 107 decoded signals from one 2017 Hyundai Sonata [1, pp. 6–7] and sets its alarm threshold from attack-free data only [1, p. 4, Fig. 4]. It reports F1 ≥ 0.99 for fabrication and masquerade on most streams. The exceptions are four streams with lower precision, and stream 381h, where it detected nothing [1, p. 9, Table V]. It reports weak recall on suspension attacks, which the authors attribute to buffered signal values staying legitimate during a suspension [1, p. 9]. CANShield, an ensemble of convolutional autoencoders, reports AUPRC of 0.92 or higher for fabrication and suspension on SynCAN but only 0.65 to 0.88 for masquerade [4, p. 12]. The authors also note that SynCAN's attacks were created in post-processing without physical verification [4, p. 13].

The digital-twin detector trains an LSTM on 17 decoded powertrain signals from a real Hyundai/Kia log and flags a timestep when a residual exceeds three standard deviations of its calibration-set residual [3, p. 10]. Averaged over ten test blocks, it reports detection of 94.6% ± 4.8 for drift, 89.2% ± 21.5 for masquerade, 61.8% ± 36.3 for plateau and 44.7% ± 37.3 for gear masquerade. False-positive rates were 17.5% to 39.6% [3, p. 13, Table 4]. Its range-and-plausibility rule baseline detected almost none of these attacks (Table 4). The authors attribute the high false-positive rate partly to their adaptive-rollout mechanism, which stays in closed-loop mode after an attack ends [3, p. 13]. The ORNL benchmark of four correlation-based unsupervised detectors on ROAD masquerade attacks found that none was effective on every attack type [6, p. 1].

We do not read the gap between precision above 0.998 in [1] and false positives near 40% in [3] as a contradiction. The two papers score different units: [1] scores 5 ms windows over a balanced attack period [1, p. 8], while [3] scores single timesteps averaged over blocks. Their attacks, vehicles and thresholds also differ. One pattern does recur across papers. Attacks that hold a signal near a plausible constant are the hardest: plateau and gear masquerade in [3, p. 13], and freeze and replay in [13, p. 5]. Both sets of authors explain this by long near-constant stretches in normal driving, which make the forged signal look legitimate.

## Physics-based detectors report high accuracy within a narrow scope

SAID checks injected messages against roll, steering/yaw and accelerating/braking models [7, p. 4]. Its thresholds come from physical reasoning and simulation, for example a load-transfer-ratio limit of 0.6 [7, p. 9]. It reports false negatives below 5% at default thresholds and no false positives, including on normal messages recorded from real vehicles [7, p. 11, Table 8]. The authors add that the false-negative rate depends on how many messages are injected before the dynamics cross the threshold (p. 11), and they list machine learning for unknown anomalies as future work [7, p. 13].

CADD compares estimates of road slope, tyre slip and vehicle mass obtained from different signal combinations. It reports recall above 96% and false-positive rate below 0.5% over more than 87,000 test cases [8, p. 1]. The test cases mix two settings: 13 real driving traces from an OBD-II dongle, and CarSim simulations built on those traces with varied road conditions. Tyre slip was tested only in simulation, for safety reasons [8, p. 8].

Both detectors need named signals and a model for each relation, and both evaluate attacks their authors built. "No false positives" in [7] covers the messages tested. We do not read it as a general property.

## The disagreement: is learning without physics enough?

The sources disagree here, and the disagreement matters most for this project. CADD's authors implemented two baselines with the same training data: EVAD, which uses data correlations, and PID-Piper, an LSTM-based detector [8, p. 9]. The comparison ran in the CarSim setting, where road slope and friction vary [8, p. 18, Table 10]. In some settings PID-Piper's true-positive rate came within 5 to 10 points of CADD's [8, p. 11]. At a false-positive rate similar to CADD's (about 4%), however, it reached under 30.7% true positives, and when tuned to match CADD's true-positive rate its false positives rose above 90% [8, p. 12, Fig. 11]. With extra training data covering ten slopes, it still had a 66.95% false-positive rate [8, p. 19, Table 11]. From this the authors argue that machine learning without physical modelling fails in changing environments [8, p. 12].

Against this, [1] reports near-perfect fabrication and masquerade detection with no physical relations. The authors of [3] argue that their purely learned twin captures the "physical relationships" among signals [3, p. 2].

We see three reasons why these claims can all hold. First, the physics-free baselines differ. In [3] the baseline is a range check; in [8] it is an LSTM. Second, the conditions differ. Only [8] tests operating conditions, here road slope and friction, that differ between training and test. [1] and [3] train and test on recordings from one vehicle in similar driving. Third, [8]'s comparison is a reimplementation run by the authors in simulation, so it does not show how PID-Piper behaves on recorded data under changing conditions. We read the evidence as saying that the advantage of explicit physics shows up mainly under distribution shift. No paper in the set tests this directly on a recorded CAN dataset.

## The one controlled with-and-without-physics comparison

Philip et al. [13] give the only controlled comparison in the set. A CNN, an LSTM and a physics-informed LSTM (PI-LSTM) are trained on nominal platoon data only. The PI-LSTM adds spacing, relative-velocity and force-balance residuals to the loss, plus a learnable offset for road grade [13, pp. 3–4, Eqs. 8–12]. The data come from a TruckMaker simulator coupled to a brake hardware rig: three vehicles, four drive cycles of 2,100 s each, at 100 Hz [13, p. 3]. All models share sequences, attacks and threshold rules [13, p. 4].

Physics raised overall F1 from 93.86% to 95.74% and AUROC from 97.29% to 98.33% [13, p. 5, Table III]. The gains were largest where the LSTM was weakest: sinusoidal (F1 80.17% to 84.88%), replay (85.22% to 87.94%) and freeze (93.38% to 96.01%). For bias and scaling attacks, which the LSTM already detected at F1 above 97.8%, the gains were under 1.1 points (Table III).

The authors conclude that reliable detection "requires" both temporal learning and physical modelling [13, p. 6]. We think the evidence supports a narrower claim, for four reasons. Table III reports one value per cell; spread across training runs is not reported. The physics residuals enter both the training loss and the anomaly score at inference [13, p. 4, §IV-D], so the table cannot separate the two effects, and there is no physics-only detector. The threshold is the F1-optimal point on the validation set [13, p. 4]. Because F1 needs attack labels, we infer that this validation data contained attacks. Finally, the text says false positives stay "low" but gives no rate; we did not extract values from the confusion matrices in Fig. 6. Other physics-plus-learning work exists: CAID for in-car engine signals [14], an electric-vehicle detector tested on a lab rig [15], and platoon PINNs [16]. We know these only from summaries, and [16] only through [13]'s description of it as several PINNs trained online [13, p. 1].

## What this set leaves open

Within these seven sources, three things are missing. First, the only same-network comparison with and without physics [13] uses simulated platoon messages and a threshold tuned with attack data. Second, the two physics detectors for cars [7, 8] were never compared with a physics-informed learner, and [8]'s learned baseline was tested only in simulation under changing conditions. Third, learned detectors on recorded car data report false-alarm levels that differ by orders of magnitude under different metrics [1, 3], so we found no comparison at a fixed false-alarm budget. None of the seven tests an attacker who keeps the modelled relations consistent; [8] argues against replay only by reasoning, not with an experiment [8, p. 13]. These open points motivate our research questions. They need a fresh search before Stage 2 can call any of them a gap in the field.

## Methods at a glance

| Source | Data | Detector | Explicit physics | Threshold set on | Headline result (locator) |
|---|---|---|---|---|---|
| [1] X-CANIDS | One real car (Hyundai Sonata 2017), chassis CAN, 107 signals | BiLSTM autoencoder | No | Attack-free data | F1 ≥ 0.99 fabrication/masquerade, most streams; weak on suspension (p. 9, Table V) |
| [3] Digital twin (preprint) | Real Hyundai/Kia log, 17 powertrain signals | Shared-encoder LSTM forecaster | No | Calibration partition, 3σ | Detection 44.7–94.6%; FPR 17.5–39.6% (p. 13, Table 4) |
| [4] CANShield | SynCAN, ROAD | Ensemble of CNN autoencoders | No | Training data | Masquerade AUPRC 0.65–0.88 on SynCAN (p. 12) |
| [6] ORNL benchmark | ROAD masquerade | Four correlation-based detectors | No | Per method | None effective on every attack type (p. 1) |
| [7] SAID | Simulation, robotic cars, testbed, real vehicles | Dynamics-model rules | Yes | Physical reasoning and simulation | FN < 5% at defaults, no FP (p. 11, Table 8) |
| [8] CADD | 13 real traces plus CarSim | Cross-checked context estimates | Yes | Model-based | Recall > 96%, FPR < 0.5% (p. 1); LSTM baseline fails under varied roads (p. 12) |
| [13] Philip et al. | Truck simulator plus brake rig, platoon | CNN, LSTM, PI-LSTM | Yes (loss and score) | F1-optimal on validation | F1 93.86 → 95.74% with physics (p. 5, Table III) |

## Sources (outside the word count)

Numbers match `project_proposal.md` §13. Consulted files: [1] arXiv:2303.12278v3; [3] arXiv:2608.17093 (preprint, not peer reviewed); [4] arXiv:2205.01306v4; [6] arXiv:2406.13778v3; [7] USENIX Security 2022 open-access PDF; [8] RAID 2024 author PDF; [13] local copy `references/ISI_2026_Princy.pdf` (venue not printed in the PDF).

- [1] Jeong, Lee, Lee, Kim. "X-CANIDS: Signal-Aware Explainable Intrusion Detection System for Controller Area Network-Based In-Vehicle Network." IEEE TVT 73(3), 2024.
- [3] Rahman, Salek, Chowdhury. "Digital Twin-Based Intrusion Detection for Vehicle Powertrain CAN Bus Systems." arXiv:2608.17093, 2026.
- [4] Shahriar, Xiao, Moriano, Lou, Hou. "CANShield: Deep Learning-Based Intrusion Detection Framework for Controller Area Networks at the Signal-Level." arXiv:2205.01306.
- [5] Ganesan et al. "Exploiting Consistency Among Heterogeneous Sensors for Vehicle Anomaly Detection." SAE 2017. (Not read directly.)
- [6] Moriano, Hespeler, Li, Bridges. "Evaluating lightweight unsupervised online IDS for masquerade attacks in CAN." arXiv:2406.13778.
- [7] Xue et al. "SAID: State-aware Defense Against Injection Attacks on In-vehicle Network." USENIX Security 2022.
- [8] Chen, Shin, Dadras. "Context-Aware Anomaly Detection Using Vehicle Dynamics." RAID 2024.
- [13] Philip, Rajadurai, Koonthalakadu Baby, Subramanian. "Physics-Informed Temporal Learning for Cyber Attack Detection in Vehicle Platoons." 2026.
- [14] Wasicek, Pesé, Weimerskirch, Burakova, Singh. "Context-aware Intrusion Detection in Automotive Control Systems." (Summary and slides only.)
- [15] Guo, Ye, Yang. "Cyberattack Detection for Electric Vehicles Using Physics-Guided Machine Learning." IEEE TTE 7(3), 2021. (Abstract only.)
- [16] Vyas, Padisala, Dey. "A Physics-Informed Neural Network Approach Towards Cyber Attack Detection in Vehicle Platoons." ACC 2023. (Only as described in [13].)

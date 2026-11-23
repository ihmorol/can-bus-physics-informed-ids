# Screening 136 papers yields a twenty-paper core

A PRISMA-informed search and abstract-level screen across five topic streams reached **136 distinct records** (153 stream-level screenings minus 17 cross-stream duplicates). Of these, **83 were included, 11 left uncertain and 42 excluded**. A further **23 records were found but could not be screened because no abstract could be retrieved**. From the 83 included records, the review selects a **final core of 20 papers plus one data artefact** (the opendbc DBC file). Together they cover the project's dataset, its closest learned baselines, the physics-only detectors, the physics-plus-learning prior work that gives templates for D3 (physics as input features) and D4 (physics as a training-loss penalty), the critique of evaluation practice, and the stealthy-attack theory behind RQ4. Eleven of the existing 17 sources stay in the core. Three ([5], [6], [17]) move to a reserve list. Two ([9] ATHENA, [10] JESA) are dropped. One ([12] Miller & Valasek) is replaced by the peer-reviewed Checkoway et al. (USENIX Security 2011). Ten new papers (N1–N10) join the core. Each of the project's candidate gaps survives at abstract level, but narrower than the proposal states. A physics-only detector compared in the same study already exists in vehicles (van Wyk et al., Ben Othmane et al., CADD). A fixed-false-alarm protocol already exists for timing-only CAN detectors. Physics-plus-learning on real in-car signals goes back to CAID (2017). What no screened abstract reports is the full combination: explicit physical relations injected into a learned detector, as inputs vs as a loss, on a public real-car decoded CAN dataset, at a fixed false-alarm budget, tested against a physics-consistent attacker. Two unscreened 2025 papers (Gao et al., KBS; Luo et al., IJAT) are the largest remaining risk to that claim and must be read before Stage 2 calls anything a gap.

## Abstract-level screening by AI agents limits what this review can claim

**Review questions.** The screen asked which recent, peer-reviewed, high-impact papers bear on four research questions. RQ1: does adding known physical relations to a learned anomaly detector improve detection of signal tampering on X-CANIDS decoded signals at the same false-alarm budget? RQ2: do physics residuals work better as input features (D3) or as a training-loss penalty (D4)? RQ3: how does a physics-only detector (D1) compare with learned detectors? RQ4: which attacks can physics not see, including a "consistent group" attacker who keeps the modelled relations satisfied? The screen also asked which of the project's existing sources [1]–[17] to keep.

**Eligibility.** The screen used five streams, each with its own topic criterion (I3):

- **A, signal-level learned IDS:** learned detectors that model decoded CAN signal or payload values.
- **B, physics and vehicle-dynamics detection:** explicit physics, vehicle dynamics or physical cross-signal consistency on road vehicles.
- **C, physics-informed ML detection:** explicit physics combined with a learned detector. A non-vehicle paper was kept only if it had a controlled with-vs-without-physics comparison or a clearly reusable design.
- **D, datasets, evaluation and surveys:** CAN datasets, benchmarks, evaluation methodology and surveys for in-vehicle networks.
- **E, stealthy and physics-consistent attacks:** attacks that evade physics-based or learned detectors in vehicles or cyber-physical systems.

Two criteria applied to every stream. **I1** required peer review, with a Scopus-indexed venue preferred; preprints were kept only if exceptionally relevant, and then flagged. **I2** required publication between 2019 and 2026; older seminal works were allowed but flagged. Exclusion codes depended on the stream: timing-only or ID-only detectors (A), purely data-driven detectors (B, C), physics-only rule checkers (C), non-automotive work (A, B, D), fault detection only (B), PINNs with no detection task (C), single detector papers with no dataset or methodology contribution (D), and generic adversarial ML with no cyber-physical link (E). Relevance was scored 0–3.

**Sources and search failures.**

- **OpenAlex** was the primary engine: keyword search with a 2019+ date filter (stream C), the forward-citation search of X-CANIDS (stream A, 89 citing works), and DOI lookups.
- **Semantic Scholar keyword search** returned HTTP 429 (rate limit) for every query in all five streams. Its `paper/batch` endpoint did work in streams A, B and C, and was used to cross-check abstracts, venues and citation counts.
- **Other routes:** Crossref returned metadata but no Elsevier or Springer abstracts. The arXiv API supplied preprint abstracts and publication-status checks. A general web search and direct fetches of publisher and author pages were also used. ScienceDirect and SpringerLink pages returned HTTP 403; ACM DL also returned 403.
- **Not queried directly:** Scopus, IEEE Xplore and Google Scholar.

**Search strings.** These are summarised in the table below. The search date was **2026-11-23**, and all citation counts were retrieved that day.

| Stream | Representative search strings (OpenAlex unless noted) | Title-level rows inspected |
|---|---|---|
| A | forward citations of X-CANIDS (`cites:W4387918052`); "CANShield deep learning signal-level intrusion detection"; "lightweight unsupervised online IDS masquerade attacks CAN"; "vehicle dynamics physical consistency CAN bus intrusion detection signals"; "physics-informed anomaly detection in-vehicle CAN" | 89 citing titles plus top hits of 12 searches (count not recorded) |
| B | S2: "physical consistency in-vehicle network intrusion detection" (top 20); web: "vehicle dynamics model in-vehicle network attack detection CAN signals physical consistency", "bicycle model yaw rate steering attack detection CAN", "Kalman filter sensor anomaly detection automated vehicles wheel speed GPS IMU" | ≈183 (S2 top 20 plus 17 web searches of 9–10 links) |
| C | 28 queries, e.g. "physics-informed cyberattack detection", "physics-constrained autoencoder anomaly detection cyber-physical", "physics-informed CAN bus intrusion detection", "kinematic consistency anomaly detection vehicle CAN signals" | ≈450 |
| D | 23 queries, e.g. "ROAD real OEM automotive dataset CAN intrusion detection", "survey intrusion detection in-vehicle networks", "CAN intrusion detection evaluation pitfalls benchmark", "CAN intrusion detection data leakage train test split" | ≈186 |
| E | about 20 queries, e.g. "evasion attacks CAN automotive intrusion detection", "Limiting the impact of stealthy attacks on industrial control systems", "masquerade attack CAN signal detection", plus 9 known-item title searches | ≈180 |

**Limits of the process.** These limits bound every conclusion below.

- **Who screened.** Screening was done by AI research agents, with **one reviewer per stream** and no independent second screener. Records were not adjudicated across streams except in this synthesis.
- **What was read.** Almost every decision rests on the **abstract alone**. Full-text keyword searches were run only for a handful of records: SAID, CADD, EVAD, Ganesan, ROAD and the X-CANIDS DataPort page.
- **Scopus status** is a judgement about the venue, never a check in Scopus.
- **Citation counts** are OpenAlex (OA) or Semantic Scholar (S2) counts dated 2026-11-23. The two often disagree (X-CANIDS: OA 89 vs S2 68).
- **Title-level counts** in the table above are approximate, overlap across streams, and were reconstructed from the "top-k inspected" entries in the search logs.

The process is therefore **PRISMA-informed**, not PRISMA-compliant: it borrows the flow and the eligibility discipline, but not the dual screening, the registered protocol or the bibliographic-database coverage.

## 153 screenings collapse to 136 distinct records

Seventeen screenings were duplicates, because key papers fell inside more than one stream's scope. **CANShield** and **ATHENA** were each screened three times. **X-CANIDS, CANet, CANival, ETFIDS, Moriano et al., ROAD, the digital-twin preprint, Philip et al., van Wyk et al., Wang et al. (FISTS), PCADS, Vyas et al. and AVMON** were each screened twice. Duplicates were matched by DOI, or by title where no DOI existed. CADD, SAVIOR and the Eslami preprint each appear in one stream's "not screened" list but were screened in another stream, so they count once, as screened.

| Stage | A | B | C | D | E | Total |
|---|---|---|---|---|---|---|
| Records screened on abstract (stream level) | 30 | 28 | 33 | 36 | 26 | **153** |
| Included / uncertain / excluded (stream level) | 17 / 4 / 9 | 14 / 4 / 10 | 20 / 3 / 10 | 27 / 0 / 9 | 15 / 2 / 9 | 93 / 13 / 47 |
| Found, no abstract retrieved (stream level) | 6 | 5 | 3 | 6 | 7 | 27 |
| Cross-stream duplicate screenings removed | | | | | | **−17** |
| **Distinct records screened on abstract** | 30 | 25 new | 28 new | 29 new | 24 new | **136** |
| Distinct records with no abstract (none screened elsewhere) | 6 | 4 | 2 | 6 | 5 | **23** |

**Stream E's own tally does not match its table.** Its prose reports 14 included and 10 excluded, but its table rows give **15 included and 9 excluded**. This report uses the table.

**Resolving stream disagreements.** Where the streams decided differently on the same record, the synthesis resolved the conflict as follows:

- **Kept as included:** CANShield and CANival were included in A but excluded as out of scope in D and E. Wang et al. (FISTS 2020) was included in B but excluded in C as physics-only.
- **Moved to excluded:** ETFIDS was uncertain in A and excluded in B. It was resolved to exclude, because it has no physics and its learned status is unclear.
- **Moved to uncertain:** PCADS was included in B but uncertain in C. It was resolved to uncertain, because the abstract does not say how physics enters and its results are preliminary.
- **Kept uncertain:** ATHENA was rated 3, 2 and 1 across three streams and stays uncertain as a preprint.

After resolution, the flow reads:

1. **Title level:** about 1,100 result rows were inspected across the streams (approximate; overlapping, not deduplicated).
2. **Abstract level:** 159 distinct records were sought. **136 were screened** and 23 had no retrievable abstract.
3. **Decisions:** of the 136 screened, **42 were excluded, 11 left uncertain and 83 included**.
4. **Core set:** 20 of the 83 included records form the **core**. Another 14 form a **reserve** to cite only if a specific sentence needs them. The remaining 49 included records are not carried forward.

## Twenty papers in six roles answer the four questions

The core was chosen for four things: direct bearing on an RQ or a detector, a method step the project will copy or contrast, impact (citations and venue), and recency. Two exceptions are deliberate. The digital-twin preprint [3] is kept because it is the closest real-car competitor. CAID [14] is kept because it is the oldest novelty risk. Both are flagged. Existing IDs are preserved and new papers are numbered N1–N10. In the tables below, every quoted number comes from the abstract unless a page locator is given. Page locators refer to the project's own full-text reading in `literature_review.md`.

### (a) Dataset and closest learned baselines

X-CANIDS is the dataset and the reference unsupervised detector. Its DataPort record shows that the benign set comprises **six driving recordings plus one idling recording**, and that every built-in attack sits in a single capture (**Dump 6, 480–1440 s**). This supports splitting by whole recording and generating the project's own attack injections ([IEEE DataPort](https://ieee-dataport.org/node/12755)). CANival is the only peer-reviewed signal-level detector with X-CANIDS numbers in its abstract, so it is the external anchor for D2–D4. Its true-negative rate of 0.997 implies a false-positive rate near 3×10⁻³, which is looser than the project's 99.9th-percentile budget, so the numbers are not directly comparable ([CANival](https://doi.org/10.1016/j.vehcom.2024.100845)).

| ID | Citation | Peer-reviewed / Scopus (venue-level) | Citations (2026-11-23) | What it gives the project | Key number (locator) | Read next |
|---|---|---|---|---|---|---|
| [1] | Jeong, Lee, Lee, Kim. "X-CANIDS: Signal-Aware Explainable Intrusion Detection System for CAN-Based In-Vehicle Network." *IEEE Trans. Vehicular Technology* 73(3):3230–3246, 2024 (early access 2023). [doi:10.1109/TVT.2023.3327275](https://doi.org/10.1109/TVT.2023.3327275); dataset [doi:10.21227/epsj-y384](https://ieee-dataport.org/node/12755) | Yes / Scopus journal | OA 89; S2 68 | Data source; D2 family; threshold from attack-free data; RQ1, RQ3 | No metric in the abstract; "signals improve the intrusion detection performance compared with the use of bit representations of raw payloads" (abstract); F1 ≥ 0.99 for fabrication and masquerade on most streams ([1, p. 9, Table V]) | Done (KEY); confirm vehicle model and signal count only |
| [4] | Shahriar, Xiao, Moriano, Lou, Hou. "CANShield: Deep-Learning-Based Intrusion Detection Framework for Controller Area Networks at the Signal Level." *IEEE Internet of Things Journal* 10(24):22111–22127, 2023. [doi:10.1109/JIOT.2023.3303271](https://doi.org/10.1109/JIOT.2023.3303271) | Yes / Scopus journal | OA 98; S2 79 | Reference autoencoder design for D2; threat model of timing-preserving value injection; RQ1 | Abstract gives no numbers ("two high-fidelity signal-based CAN attack data sets"); masquerade AUPRC 0.65–0.88 on SynCAN ([4, p. 12], arXiv v4) | Re-map arXiv page locators to the IoT-J version |
| N1 | Kang et al. (authors per stream D; stream A did not capture them). "CANival: A multimodal approach to intrusion detection on the vehicle CAN bus." *Vehicular Communications* 50:100845, 2024. [doi:10.1016/j.vehcom.2024.100845](https://doi.org/10.1016/j.vehcom.2024.100845) | Yes / Scopus journal | OA 55 | External numeric anchor on X-CANIDS for D2–D4; RQ1 | "average true positive rates of 0.960 and 0.912, and true negative rates of 0.997 and 0.996" on X-CANIDS and SynCAN (abstract) | Full text: attack set, threshold rule, FPR |
| [3] | Rahman, Salek, Chowdhury. "Digital Twin-Based Intrusion Detection for Vehicle Powertrain CAN Bus Systems." arXiv:2608.17093, 2026. [doi:10.48550/arXiv.2608.17093](https://doi.org/10.48550/arXiv.2608.17093) | **No (preprint)**; submitted to TRB/TRR / n/a | OA 0; S2 0 | Closest real-car learned competitor (17 decoded Hyundai/Kia signals); range-plausibility rule baseline; motivates a fixed FPR; RQ1, RQ4 | "94.6% for continuous drift and 89.2% for masquerade, while the baseline detected almost none"; "False positive rates reached 39.6%" (abstract) | Check whether its log is X-CANIDS, and check for a peer-reviewed version |
| [2] | commaai/opendbc, file `opendbc/dbc/hyundai_2015_ccan.dbc` ([GitHub](https://github.com/commaai/opendbc)) | No (data artefact, not counted as a paper) | n/a | Signal names, units, scaling for R1–R6 | DataPort calls it "hyundai_ccan_2015.dbc" but links `hyundai_2015_ccan.dbc` | Cite with commit hash and access date |

### (b) Physics-only detectors

SAID and CADD are the two peer-reviewed physics-only detectors for passenger cars. CADD's full text adds the most useful evidence for RQ3. It compares the physics detector with an LSTM-based detector (PID-Piper) under varied road slope and friction. At a false-positive rate near 4%, PID-Piper reached **under 30.7% true positives** ([8, p. 12, Fig. 11]) ([CADD](https://doi.org/10.1145/3678890.3678895)). That comparison ran in CarSim simulation. Ben Othmane et al. add the missing recorded-vehicle comparison: on an in-motion Ford Transit, a simple speed–RPM correlation separated attacked from normal states, while k-means and an HMM produced high false-positive rates ([Ben Othmane et al.](https://www.osti.gov/pages/servlets/purl/1971241)). SAID should be described accurately. It filters injected commands at the entry point by checking their vehicle-dynamics consequences; it is not a passive detector of tampered sensor signals ([SAID](https://www.usenix.org/conference/usenixsecurity22/presentation/xue)).

| ID | Citation | Peer-reviewed / Scopus | Citations | What it gives the project | Key number (locator) | Read next |
|---|---|---|---|---|---|---|
| [7] | Xue, Liu, Li, Zhao, Li, Yu, Luo, Zhou, Gu. "SAID: State-aware Defense Against Injection Attacks on In-vehicle Network." 31st USENIX Security Symposium, pp. 1921–1938, 2022. [USENIX](https://www.usenix.org/conference/usenixsecurity22/presentation/xue) (no DOI) | Yes / uncertain (streams B and E disagree on USENIX coverage) | S2 24 | Roll, steering/yaw and accelerating/braking models as templates for R4 and R6; D1 comparator; RQ3 | "defend against more than 99% of the network and service layer attack traffic and all state layer MIAs" (abstract) | Done (KEY); keyword-search for the R3 relation |
| [8] | Chen, Shin, Dadras. "Context-Aware Anomaly Detection Using Vehicle Dynamics" (CADD). RAID 2024, ACM. [doi:10.1145/3678890.3678895](https://doi.org/10.1145/3678890.3678895) | Yes / likely Scopus (ACM proceedings) | S2 8 | Physics vs LSTM under distribution shift; slope handling for R2; RQ1, RQ3, RQ4 (smallest detectable deviation) | ">96% recall and <0.5% false positive rate" over ">87,000 test-cases"; ">95% accuracy when the vehicle's behavior deviates 0.07g" (abstract) | Done (KEY); keyword-search for R3 |
| N2 | Ben Othmane, Dhulipala, Abdelkhalek, Multari, Govindarasu. "On the Performance of Detecting Injection of Fabricated Messages into the CAN Bus." *IEEE Trans. Dependable and Secure Computing*, accepted 2020. [doi:10.1109/TDSC.2020.2990192](https://www.osti.gov/pages/servlets/purl/1971241) | Yes / Scopus journal | Not checked (S2 rate-limited) | Physics relation (R5, speed vs RPM) vs unsupervised ML on a real in-motion vehicle; RQ3 | "the Pearson correlation distinguishes the two states, the k-means clustering method has an acceptable accuracy but high false positive rate and HMM ... has a high false positive" (abstract) | Full text; confirm issue year and volume |

### (c) Physics plus learning: closest prior work and D3/D4 templates

This is the largest group, because RQ1 and RQ2 both depend on it.

- **Philip et al. [13]** is the closest prior work. In it, physics raised F1 from 93.86% to 95.74% ([13, p. 5, Table III]). But the physics residuals enter both the loss and the anomaly score ([13, p. 4]), and the data are simulated platoon messages ([Philip et al.](https://doi.org/10.1109/ISI69914.2026.11685836)).
- **van Wyk et al.** is the highest-impact vehicle paper in the screen. It is the precedent for the three-way physics-only vs learned-only vs hybrid design: the CNN plus Kalman-filter hybrid "outperforms ... both CNNs and Kalman filtering with a χ2-detector method alone" ([van Wyk et al.](https://doi.org/10.1109/TITS.2019.2906038)).
- **D3 template, outside vehicles.** Chahine & Noura run a controlled test in which the same detector (USAD) gets physics features or raw inputs ([Chahine & Noura](https://doi.org/10.3390/fi18060308)).
- **D4 template, outside vehicles.** Zideh & Solanki compare the same convolutional autoencoder with and without a physical-law term in its loss ([Zideh & Solanki](https://doi.org/10.1016/j.segan.2025.102022)).
- **Vehicle precedents.** Guo et al. [15] is the vehicle precedent for physics as inputs; Vyas et al. [16] is the vehicle precedent for physics in the loss.
- **Novelty risk.** CAID [14] must be cited, because it already combined physical reference models with an unsupervised network on in-car signals in 2017.

| ID | Citation | Peer-reviewed / Scopus | Citations | What it gives the project | Key number (locator) | Read next |
|---|---|---|---|---|---|---|
| [13] | Philip, Rajadurai, Devika K. B. (the project lists her as "Koonthalakadu Baby"), Subramanian. "Physics-Informed Temporal Learning for Cyber Attack Detection in Vehicle Platoons." 2026 IEEE Int. Conf. Intelligence and Security Informatics (ISI), pp. 144–149. [doi:10.1109/ISI69914.2026.11685836](https://doi.org/10.1109/ISI69914.2026.11685836) | Yes / likely Scopus (IEEE proceedings, uncertain) | OA 0; S2 0 | The result tested on real CAN; D4 loss design; attack names; RQ1, RQ2 | "AUROC of 98.33% and F1 score of 95.74%" (abstract); LSTM baseline 93.86% F1 ([13, p. 5, Table III]) | Done (FULL) |
| [16] | Vyas, Padisala, Dey. "A Physics-Informed Neural Network Approach Towards Cyber Attack Detection in Vehicle Platoons." American Control Conference 2023, pp. 4537–4542. [doi:10.23919/ACC55779.2023.10155846](https://doi.org/10.23919/ACC55779.2023.10155846) | Yes / likely Scopus | OA 12; S2 9 | Physics in the loss (a PINN learns an uncertain model parameter); RQ2 | No numbers in the abstract; simulation only ("as shown through the simulation studies") | Full text (the implementation guide requires a direct read) |
| [15] | Guo, Ye, Yang. "Cyberattack Detection for Electric Vehicles Using Physics-Guided Machine Learning." *IEEE Trans. Transportation Electrification* 7(3):2010–2022, 2021. [doi:10.1109/TTE.2020.3044524](https://doi.org/10.1109/TTE.2020.3044524) | Yes / Scopus journal | OA 71; S2 51 | Vehicle precedent for physics as input features (D3); RQ1, RQ2 | No numbers in the abstract ("high accuracy under various driving scenarios"); OPAL-RT HIL | Abstract is enough |
| [14] | Wasicek, Pesé, Weimerskirch, Burakova, Singh. "Context-aware Intrusion Detection in Automotive Control Systems." Proc. 5th escar USA, June 2017 (venue taken from a secondary reference). [Author PDF](https://www.weimerskirch.org/files/WasicekEtAl_CAIDS.pdf) | Probably / probably not Scopus | S2 51 | Novelty risk: physical reference models plus an unsupervised ANN on a real chip-tuned car | No numbers; recognised chip tuning "with a very high probability" (abstract) | Full text; confirm venue and year |
| N3 | van Wyk, Wang, Khojandi, Masoud. "Real-Time Sensor Anomaly Detection and Identification in Automated Vehicles." *IEEE Trans. ITS* 21(3):1264–1276, 2020. [doi:10.1109/TITS.2019.2906038](https://doi.org/10.1109/TITS.2019.2906038) | Yes / Scopus journal | OA 413; S2 304 | Physics-only vs learned-only vs hybrid in one study; RQ1, RQ3 | No numbers; the hybrid beats each component alone (abstract) | Full text: dataset (real or simulated, unverified) and design |
| N4 | Chahine, Noura. "Features over Architecture: Physics-Informed Anomaly Detection in Industrial Control Systems." *Future Internet* 18(6):308, 2026. [doi:10.3390/fi18060308](https://doi.org/10.3390/fi18060308) | Yes / believed Scopus (MDPI) | OA 3; S2 2 | Template for the D3 vs no-physics ablation with the same architecture; warns that temporal models can hurt; RQ1, RQ2 | "PA-F1 = 0.7343 for physics features versus 0.6687 for raw" with USAD; the GRU stage gave +8.1 pp on one dataset and −6.8 pp on the other (abstract) | Full text: check for a placement ablation |
| N5 | Zideh, Solanki. "Multivariate physics-informed convolutional autoencoder for anomaly detection in power distribution systems with widespread deployment of DERs." *Sustainable Energy, Grids and Networks* 44:102022, 2025. [doi:10.1016/j.segan.2025.102022](https://doi.org/10.1016/j.segan.2025.102022); conference companion IEEE PESGM 2024 [doi:10.1109/PESGM51994.2024.10761071](https://doi.org/10.1109/PESGM51994.2024.10761071) | Yes / Scopus journal | OA 30; S2 14 (journal); OA 30; S2 18 (PESGM) | Template for D4 (autoencoder plus a weighted physics-loss term vs the same autoencoder); RQ2 | Qualitative: "more accurate results compared to the data-driven ConvAE model" and "less training time to converge" (PESGM abstract) | Full text: loss weighting and threshold rule |

### (d) Evaluation methodology and dataset critique

ROAD's guide supplies the peer-reviewed critique that the project needs. It states that "the physical effects of attacks on the vehicle are not verified in the available datasets" and that public datasets often contain "attacks that are too easily detectable to truly test the method" ([ROAD](https://doi.org/10.1371/journal.pone.0296879)). It also explains why ROAD itself suits physics poorly. Stream D's reading of its full text, which is an inference rather than a sentence in the paper, is that ROAD's signals come from a reverse-engineered DBC with anonymised IDs and an undisclosed vehicle, so physical equations cannot be written from documented semantics. The work-in-progress paper by Lazeski et al. (VehicleSec '26) states the hypothesis most directly: "new detection strategies founded upon vehicle specifications and domain knowledge, in combination with ML tools, may offer more transparent and reliable protection" ([Lazeski et al.](https://www.usenix.org/conference/vehiclesec26/presentation/lazeski)). It sits in the reserve list only because it is a WIP paper of uncertain indexing.

| ID | Citation | Peer-reviewed / Scopus | Citations | What it gives the project | Key number (locator) | Read next |
|---|---|---|---|---|---|---|
| N6 | Verma et al. "A comprehensive guide to CAN IDS data and introduction of the ROAD dataset." *PLOS ONE* 19(1):e0296879, 2024. [doi:10.1371/journal.pone.0296879](https://doi.org/10.1371/journal.pone.0296879) | Yes / Scopus journal | OA 180 | Dataset-realism critique; reason to inject the project's own attacks; why X-CANIDS rather than ROAD | ROAD has "over 3.5 hours of one vehicle's CAN data" (abstract); "Correlated Signal" attack of four inconsistent wheel speeds (full text, Appendix 6.3) | Done (abstract plus sections read by stream D) |

### (e) Stealthy and physics-consistent attacks (RQ4)

Erba et al. is the closest empirical analogue of the consistent-group attacker. Learned correlation detectors catch replay when the attacker edits fewer than 95% of features, but an attacker who edits a few sensors in line with the learned physical constraints cut recall from **0.68 to 0.12 by manipulating 4 of 82 sensors** ([Erba et al.](https://doi.org/10.1145/3427228.3427660)). Urbina et al. is the seminal security-venue argument that physics detectors must be evaluated against attackers who stay close to expected behaviour, with impact measured against **an upper bound on false alarms**. That is the same framing as the project's fixed false-alarm budget ([Urbina et al.](https://doi.org/10.1145/2976749.2978388)).

| ID | Citation | Peer-reviewed / Scopus | Citations | What it gives the project | Key number (locator) | Read next |
|---|---|---|---|---|---|---|
| N7 | Erba, Taormina, Galelli, et al. "Constrained Concealment Attacks against Reconstruction-based Anomaly Detectors in Industrial Control Systems." ACSAC 2020. [doi:10.1145/3427228.3427660](https://doi.org/10.1145/3427228.3427660) | Yes / likely Scopus (ACM proceedings) | OA 125 | Design and expected result of the consistent-group attacker vs single-signal tampering; RQ4 | "Recall drops from 0.68 to 0.12 by manipulating 4 sensors out of 82 in WADI" (abstract) | Full text: attack construction |
| N8 | Urbina et al. "Limiting the Impact of Stealthy Attacks on Industrial Control Systems." ACM CCS 2016. [doi:10.1145/2976749.2978388](https://doi.org/10.1145/2976749.2978388) | Yes (seminal, pre-2019) / Scopus proceedings | OA 459 | Justifies evaluation at a fixed false-alarm bound against stealthy attackers; RQ4, protocol | No numbers; proposes "a new metric to measure the impact of stealthy attacks and how they relate to our selection on an upper bound on false alarms" (abstract) | Abstract plus the metric section |

### (f) Survey and threat background

| ID | Citation | Peer-reviewed / Scopus | Citations | What it gives the project | Key number (locator) | Read next |
|---|---|---|---|---|---|---|
| N9 | Rajapaksha et al. "AI-Based Intrusion Detection Systems for In-Vehicle Networks: A Survey." *ACM Computing Surveys*, 2023. [doi:10.1145/3570954](https://doi.org/10.1145/3570954) | Yes / Scopus journal | OA 317 | One survey for the introduction and taxonomy | Covers in-vehicle AI IDS "from 2016 to 2022 (August)" (abstract) | Abstract is enough |
| [11] | Koscher et al. "Experimental Security Analysis of a Modern Automobile." IEEE S&P 2010. [doi:10.1109/SP.2010.34](https://doi.org/10.1109/sp.2010.34) | Yes (seminal) / likely Scopus | OA 2,263 | Threat model: a compromised ECU can override safety functions | Effects include "disabling the brakes, selectively braking individual wheels on demand, stopping the engine" (abstract) | Re-read the cited claim |
| N10 | Checkoway et al. "Comprehensive Experimental Analyses of Automotive Attack Surfaces." 20th USENIX Security Symposium, 2011. [USENIX](https://www.usenix.org/conference/usenix-security-11/comprehensive-experimental-analyses-automotive-attack-surfaces) (no DOI) | Yes (seminal) / unknown | OA 1,984 | Peer-reviewed replacement for [12]: remote compromise is feasible | "remote exploitation is feasible via a broad range of attack vectors" (abstract) | Re-read the abstract on the USENIX page |

**Reserve list (14; cite only if a specific sentence needs it, not part of the core):**

| Group | Records |
|---|---|
| Existing sources moved out of the core | [5] Ganesan SAE 2017; [6] Moriano JISA 2026; [17] PSEAD (Electronics 2024) |
| Signal-level and physics detectors | EVAD, Guo et al., IEEE TVT 2019 (cross-sensor correlation, 99.5% TPR at 1% FPR, abstract; used as a baseline in CADD); LGOVAD, Xu et al., AEJ 2025 (learned dependencies between signals) |
| Physics plus learning | PIWAD, IEEE IoT-J 2026 (score fusion, residual-aware adaptive attackers); AVMON, VehicleSec 2024 |
| Stealthy-attack theory and evasion | Pasqualetti et al., IEEE TAC 2013 (theory of undetectable attacks); Dash et al., ACSAC 2019 (evading physics-model IDS on robotic vehicles); Longari et al., ACM TCPS 2025 (evasion of CAN IDS) |
| Evaluation critique and surveys | Lazeski et al., VehicleSec '26 WIP; Koltai et al., EuroS&PW 2026; Sharmin et al., J. Computer Security 2024; Loukas et al., Ad Hoc Networks 2019 (the only screened survey that frames cyber-physical detection) |

## Keep eleven existing sources, reserve three, drop two, replace one

The register's verified status changes four entries:

- [13] now has a confirmed venue (IEEE ISI 2026).
- [6] is now a JISA 2026 journal paper.
- [4] is the IEEE IoT-J 2023 paper, not only the arXiv preprint.
- [10] turns out to state no physical relation in its abstract. Its "conservative PINN" is applied to dimensionality-reduced CAN features, and its encryption and decryption times run to tens or hundreds of seconds ([Senthilkumar & Anbalagan](https://doi.org/10.18280/jesa.590401)).

| ID | Verdict | Reason (verified status) |
|---|---|---|
| [1] X-CANIDS | **KEEP (core)** | IEEE TVT 73(3):3230–3246; data source and D2 family; OA 89 / S2 68 |
| [2] opendbc DBC | **KEEP (artefact)** | File exists as `opendbc/dbc/hyundai_2015_ccan.dbc`; DataPort writes "hyundai_ccan_2015.dbc". Cite the exact file name, a commit hash and an access date |
| [3] Digital twin | **KEEP (core, flagged preprint)** | arXiv 2608.17093 only; closest real-car competitor; recheck its peer-review status and data source |
| [4] CANShield | **KEEP (core)** | Published in IEEE IoT-J 10(24):22111–22127, 2023; cite the journal version, not arXiv |
| [5] Ganesan et al. | **RESERVE** | SAE technical paper 2017 (pre-2019, "preliminary results"); verified. Its idea (learned pairwise correlations) is covered by SAID, CADD and EVAD; cite once as the origin of "natural redundancy" if space allows |
| [6] Moriano et al. | **RESERVE** | Now JISA 98:104392 (2026); peer reviewed. Its masquerade motivation is covered by ROAD, CANShield's masquerade AUPRC and X-CANIDS; if kept, cite the JISA version |
| [7] SAID | **KEEP (core)** | USENIX Security 2022; physics-only comparator; describe it as entry-point command filtering |
| [8] CADD | **KEEP (core)** | RAID 2024; physics vs LSTM under distribution shift |
| [9] ATHENA | **DROP** | arXiv preprint only (2503.17067); rule mining on ROAD; uncertain in two streams, excluded in a third |
| [10] Senthilkumar & Anbalagan (JESA) | **DROP** | JESA 59(4):855–869, 2026; no physical relation in the abstract; Scopus status comes only from publisher self-report; not comparable evidence for RQ1 or RQ2 |
| [11] Koscher et al. | **KEEP (core, seminal)** | IEEE S&P 2010; threat background |
| [12] Miller & Valasek | **REPLACE → N10 Checkoway et al.** | Black Hat 2015 white paper, not peer reviewed and not indexed in OpenAlex; Checkoway et al., USENIX Security 2011, covers remote attack feasibility |
| [13] Philip et al. | **KEEP (core)** | Venue confirmed: IEEE ISI 2026, pp. 144–149, doi:10.1109/ISI69914.2026.11685836 |
| [14] CAID | **KEEP (core, flagged)** | Authors confirmed; venue (escar USA 2017) known only from a secondary reference; a novelty risk that must be cited |
| [15] Guo, Ye, Yang | **KEEP (core)** | IEEE TTE 7(3):2010–2022, 2021; vehicle precedent for D3 |
| [16] Vyas et al. | **KEEP (core)** | ACC 2023; vehicle precedent for D4 (PINN); simulation only, no baseline in the abstract |
| [17] PSEAD | **RESERVE** | Electronics 13(2):377, 2024; CAN-FD with private data; "physical semantics" means what the signals mean, not physics equations. Use one sentence to distinguish it in the gap statement |

## Each candidate gap survives, but narrower than the proposal states

The table bounds every verdict to the 136 screened abstracts plus the project's seven full-text readings.

| Candidate gap | What the screen found | What it did not find | Must check before claiming |
|---|---|---|---|
| Physics-informed learner on real-car decoded CAN / X-CANIDS | None of the 89 OpenAlex works citing X-CANIDS mentions physical or vehicle-dynamics relations in its abstract. Close neighbours: CAID [14] (physical reference models plus an unsupervised ANN on a real car, 2017); the digital twin [3] (learned coupling, preprint); PSEAD [17] and LGOVAD (CAN-FD, learned semantics or dependencies); ATHENA (preprint, physics-refined rules on ROAD) | Any peer-reviewed paper that puts explicit physical relations into a learned detector on X-CANIDS or another public real-car decoded dataset | **Gao et al., KBS 2025** (graph transformer that is aware of relationships between signals, from the PSEAD group); **Luo et al., IJAT 2025** (causality-aware GCN). Neither abstract could be retrieved. Also check whether [3]'s Hyundai/Kia log is X-CANIDS |
| RQ2: physics as inputs vs as a loss | All three placements exist: loss (Zideh & Solanki, Vyas, Moon, Somma, Li PI-KAN-AE); inputs (Guo [15], Chahine & Noura, Bourouis, Ma & Zhang); score fusion (PIWAD, van Wyk, Ghiro) | A head-to-head comparison of input vs loss placement inside one detector (stream C) | **PIWAD** and **Chahine & Noura** full texts may contain stream or placement ablations; [13] mixes loss and score, so its result cannot separate them |
| Physics-only baseline in the same study | **Already exists in vehicles:** van Wyk (KF alone vs CNN vs hybrid), Ben Othmane (correlation vs k-means/HMM), CADD (physics vs LSTM, in simulation), AVMON (hybrid vs physics-model defences), the digital twin (range-rule baseline) | All three of D1, data-only and physics-informed detectors in one study on recorded passenger-car CAN signals | van Wyk's dataset (real or simulated was not verified). Frame the claim as "the three-way comparison on recorded car CAN", not "a physics-only baseline" |
| Threshold fixed on normal data at a fixed false-alarm budget | **The protocol exists:** CITA (IoTAIEE 2026, timing-only) reports recall at a fixed 10⁻³ false-alarm rate from an attack-free quantile; Xiang et al. (Electronics 2026) use normal-only calibration and alarms per hour; Urbina ties evaluation to a false-alarm bound; [13] tried an FPR-constrained rule but chose F1-optimal ([13, p. 4]) | A physics vs data-only comparison on CAN signals at a fixed false-alarm budget; no automotive peer-reviewed source that prescribes the percentile rule (stream D) | Full texts of Sharmin et al. (JCS 2024) and Althunayyan et al. (Computer Networks 2026) for metric guidance |
| Physics-consistent multi-signal attacker vs a CAN detector | Analogues: Erba (industrial control systems, learned constraints), Dash (robotic vehicles), PIWAD (residual-aware adaptive attackers, water systems); CAN evasion work (Longari, Cerracchio, Aloraini) uses gradient payload perturbations, not physics-consistent edits | Any screened abstract that tests a CAN IDS with explicit vehicle-physics features against a coordinated, physics-consistent attacker | **arXiv 2604.15996** (Eslami, Yu, Pirani: covert attacks on the bicycle model; preprint, abstract read only in stream B); **SAVIOR** full text for stealthy-attacker evaluation; arXiv 2602.02781 (protocol-compliant perturbations on ROAD, preprint) |
| R3: yaw rate vs rear-wheel speed difference | R1 and R2 appear in EVAD (wheel-speed correlation 1.0000 between left-front and left-rear, full text Table I); R4 and R6 in SAID and Eslami; R5 in Ganesan and Ben Othmane | R3 as a relation in an attack detector, in any screened abstract (stream B) | Keyword-search the full texts of SAID, CADD and EVAD for "wheel speed difference"; the relation is standard in vehicle dynamics and may appear in fault-detection work (excluded under E3), e.g. an unscreened LiU thesis on yaw-rate plausibility |

The defensible Stage 2 wording is therefore a combination claim, not a list of firsts. Stated as a candidate gap: **no screened study injects explicit physical relations into a learned detector on a public real-car decoded CAN dataset, compares input and loss placement against both a physics-only and a data-only detector at one false-alarm budget fixed on normal data, and tests a physics-consistent attacker.**

**A design point for RQ4.** The stream-E screener derived the following; it is the screener's reasoning, not a source finding, and it should be checked. Scaling every attacked signal by one factor k preserves the linear relations: R1, R2 (if acceleration is also scaled) and R5 (if RPM is also scaled). It does not preserve the bilinear relation R4 (a_y = v·r). If speed and yaw rate are both scaled by k, lateral acceleration has to scale by k². The paper must therefore state exactly which signals the consistent group contains. In Pasqualetti's framework, a correctly built consistent group is a zero-residual attack for any detector that checks only those relations. A null result on it is then expected by construction and is a principled finding, not a weakness ([Pasqualetti et al.](https://doi.org/10.1109/tac.2013.2266831)).

## Twenty-three missing abstracts and eight full texts come first

**Read in full first, in this order.** Items 1 and 2 bear on the novelty claim, items 3–5 on method design, and items 6–8 on RQ4 and the required checks.

1. **Gao et al., KBS 328:114237 (2025)** ([doi:10.1016/j.knosys.2025.114237](https://doi.org/10.1016/j.knosys.2025.114237)): the largest novelty risk for physics-like signal relations on X-CANIDS-adjacent data.
2. **Luo et al., Int. J. Automotive Technology (2025), CA-GCN** ([doi:10.1007/s12239-025-00305-w](https://doi.org/10.1007/s12239-025-00305-w)): causal relations between signals.
3. **van Wyk et al. (N3)**: the three-way design and whether its dataset is real.
4. **Chahine & Noura (N4)**: the D3 ablation protocol and any placement comparison.
5. **PIWAD** ([doi:10.1109/JIOT.2026.3745593](https://doi.org/10.1109/JIOT.2026.3745593)): ablations by stream and the adaptive-attacker design.
6. **Erba et al. (N7)**: how to construct the consistent-group attack.
7. **CAID [14]**: whether its "reference models" are explicit physics, plus venue and year.
8. **Vyas et al. [16]**: required by the implementation guide; RQ2 framing.

**Short targeted checks.** These do not need full reads:

- whether [3]'s log is X-CANIDS, and whether [3] now has a peer-reviewed version;
- the abstract of arXiv 2604.15996;
- SAVIOR's evaluation section;
- a keyword search of SAID and CADD for the R3 relation.

**Uncertain decisions (11).** Each needs a full text to resolve:

| Group | Records |
|---|---|
| Learned and physics detectors | INDRA (whether it models signals or bits); Xiang et al. 2026 (whether its residuals use payload values); ATHENA (preprint); GPS-IDS (preprint); PCADS (how physics enters) |
| Stealthy attacks and physical invariants | Eslami 2604.15996 (preprint); SAVIOR (whether it evaluates a stealthy attacker); Sui et al. TAC 2020 (definitions only) |
| Other domains and venues | Jichici et al. J1939 (venue unknown); Khaleghi et al. 2025 (no numbers in the abstract); Gauthama Raman & Mathur 2024 (no ablation) |

**Records with no abstract (23).** These were not screened and are not counted as screened:

| Stream | Records |
|---|---|
| A (6) | Gao KBS 2025; Liu, C&S 2025; DGIDS, C&S 2024; Luo, IJAT 2025; CANdito, LNCS 2023; Nahannu, JSA 2026 |
| B (4) | UKF + ML, SciTePress 2024; velocity-consistency GNSS spoofing (venue unknown); Biron et al., T-ITS 2018; LiU MSc thesis (yaw-rate plausibility) |
| C (2) | Massaoudi & Ez Eddin, SEGAN 2026; industrial-robot digital twin, Neurocomputing (the DOI resolves to a different title in S2) |
| D (6) | Lokman, EURASIP JWCN 2019; Luo, PeerJ CS 2023; Yang, C&S 2022; Engelen 2021; Apruzzese, TNSM 2022; Hellemans, T-ITS 2025 |
| E (5) | Longari, LNCS 2023; Choi & Kim, LNCS 2021; Jia, IJCIP 2021; arXiv 2602.02781; ABS wheel-speed spoofing chapter, Springer 2013 |

**Conflicting metadata to fix before citing.**

| Item | Conflict | Current resolution |
|---|---|---|
| X-CANIDS year | OpenAlex and S2 give 2023 (early access); DBLP and the project give 2024 (issue) | Cite 2024 with 73(3):3230–3246 |
| X-CANIDS vehicle | Stream A could not confirm "Hyundai Sonata 2017". Stream D read the DataPort record directly: "Hyundai LF Sonata 2017 e-VGT" | Use stream D's direct reading |
| X-CANIDS signal count | Dataset has 688 signal columns (DataPort); the paper uses 107 signals ([1, pp. 6–7]) | Not a conflict; say which one is meant |
| DBC file name | DataPort writes `hyundai_ccan_2015.dbc` but links `hyundai_2015_ccan.dbc` | Use `hyundai_2015_ccan.dbc` |
| CANShield year | Tracker lists 2022 (arXiv); the published version is IoT-J 2023 | 2023 |
| [6] year and venue | arXiv 2024 vs JISA 2026 | JISA 2026 |
| Philip et al. author | "Koonthalakadu Baby" (project) vs "K. B. Devika" (OpenAlex) | Check the IEEE Xplore record |
| Philip et al. existence | Stream B's two web searches failed to find it; streams A and C found it in OpenAlex and S2 by DOI | Resolved by DOI |
| Guo et al. year | 2020 (early access) vs 2021 (issue) | 2021 |
| Zideh & Solanki SEGAN | 2025 (OpenAlex) vs 2024 online (S2) | 2025 |
| Ben Othmane et al. TDSC | Issue year and volume not checked | Check |
| CANival authors | Stream A did not capture them; stream D gives "Kang et al." | Check against the DOI |
| CANet, CANnolo, INDRA first authors | Taken from the screener's background knowledge | Check against the DOIs |
| Lazeski et al. authors | The USENIX page adds Wiesmaier | Check the proceedings |
| Mo & Sinopoli, Wu et al., Song et al. years | Online vs issue year | Cite the issue year |
| SoK (Serag et al.) | NDSS 2027 inferred only from an S2 DOI prefix | Check |
| USENIX Security Scopus status | Stream B says indexed; streams D and E say unknown | Treat as uncertain |
| Stream E tally | Prose 14/2/10 vs table 15/2/9 | Table used |

## Conclusion

The search changes what the project should claim, not what it should build. Every ingredient of the planned study already exists somewhere in the 136 screened records. A three-way physics/learned/hybrid comparison exists in automated vehicles, the fixed-FPR protocol in timing-only CAN detection, physics-consistent concealment in industrial control systems, and physics plus learning on real cars in a 2017 workshop paper. No screened abstract assembles them on a public real-car decoded CAN dataset. That makes the contribution a controlled combination study, and it raises the value of the experiments that separate input from loss placement (RQ2) and that define the consistent-group attacker (RQ4). Philip et al.'s mixed loss-and-score design cannot answer either question.

The core is small because many of the 83 included records repeat evidence that a core paper already carries. Examples are the further surveys, the conference versions of journal papers, and the non-vehicle physics-loss detectors beyond the two chosen templates. Twenty papers are enough to justify every design step, but the gap claim is only as strong as the two Elsevier and Springer abstracts that could not be retrieved. Reading Gao et al. and Luo et al. is the cheapest way to turn "candidate gap" into a defensible statement, or to learn that it needs narrowing again.

---

## Appendix: consolidated screening log (136 distinct records)

Legend: inc = include, unc = uncertain, exc = exclude. Rel. is relevance (0–3, the highest rating across streams). RecIDs list every stream that screened the record. "n.r." means the authors were not recorded. Where a record has a core or reserve role, it is noted in the reason column.

| RecID(s) | Short title | First author | Year | Venue | Decision | Rel. | Reason |
|---|---|---|---|---|---|---|---|
| A01, D13 | X-CANIDS | Jeong | 2024 | IEEE TVT | inc | 3 | Dataset and baseline; CORE [1] |
| A02, D31, E19 | CANShield | Shahriar | 2023 | IEEE IoT-J | inc (exc in D, E: scope) | 3 | D2 reference; CORE [4] |
| A03, D14 | CANet / SynCAN | Hanselmann | 2020 | IEEE Access | inc | 3 | Most-cited signal-level IDS; origin of SynCAN |
| A04 | CANnolo | Longari | 2020 | IEEE TNSM | inc | 2 | Precedent for LSTM-AE reconstruction error |
| A05 | INDRA | Kukkala | 2020 | IEEE TCAD | unc | 2 | Whether it models signals or bits is unclear |
| A06, D32 | CANival | Kang | 2024 | Veh. Commun. | inc (exc in D: scope) | 3 | X-CANIDS numbers; CORE N1 |
| A07 | KG-ID | Sun | 2025 | IEEE T-ITS | inc | 2 | Knowledge-graph domain knowledge |
| A08, B26 | ETFIDS | n.r. | 2025 | IEEE IoT-J | exc (unc in A) | 2 | No physics; learned status unclear |
| A09 | MKF-ADS | n.r. | 2025 | IEEE TVT | inc | 2 | Prediction-error detector; "controllable false alarms" |
| A10 | StatGraph | n.r. | 2025 | IEEE TMC | inc | 2 | Supervised GCN on masquerade |
| A11 | DriveShield | n.r. | 2025 | JKSU-CIS | inc | 2 | Adversarial AE comparable to D2 |
| A12 | Masquerade graph ML | Marfo | 2025 | IEEE TIFS | inc | 2 | Masquerade detection on ROAD |
| A13, D16 | Lightweight online IDS for masquerade | Moriano | 2026 | JISA | inc | 2 | Online evaluation; RESERVE [6] |
| A14, D01 | ROAD dataset guide | Verma | 2024 | PLOS ONE | inc | 3 | Dataset critique; CORE N6 |
| A15, B12, D33 | ATHENA | Wang | 2025 | arXiv | unc | 3 | Preprint; physics-refined rules; DROP [9] |
| A16, B13 | Digital-twin powertrain IDS | Rahman | 2026 | arXiv | inc (preprint) | 3 | Closest real-car competitor; CORE [3] |
| A17, C01 | PI-LSTM platoon | Philip | 2026 | IEEE ISI | inc | 3 | Closest prior work; CORE [13] |
| A18 | PSEAD | Zhao | 2024 | Electronics | inc | 3 | "Physical semantics" on CAN-FD; RESERVE [17] |
| A19 | LGOVAD | Xu | 2025 | Alexandria Eng. J. | inc | 3 | Learned inter-signal dependencies; RESERVE |
| A20 | U-CAN | n.r. | 2022 | COMPSAC | exc | 1 | Supervised; FPR figure internally inconsistent |
| A21 | Adaptive AE, single threshold | n.r. | 2025 | Sensors | exc | 1 | Threshold uses attack data |
| A22 | CITA | Zhan | 2026 | IoTAIEE | exc | 1 | Timing-only; fixed 10⁻³ FAR protocol noted |
| A23 | Target-adaptive residual IDS | Xiang | 2026 | Electronics | unc | 1 | Whether residuals use payload values is unclear |
| A24 | CA-CANet | n.r. | 2026 | ICSIP | inc | 2 | Recent X-CANIDS numbers |
| A25 | IMAT redefinition | n.r. | 2026 | ICUFN | exc | 1 | Timing-only; uses X-CANIDS |
| A26 | AutoGuard-CAN | n.r. | 2026 | ICoICI | exc | 1 | Frame-level fusion; low-tier venue |
| A27 | IWSHAP-X | n.r. | 2026 | JBCS | exc | 1 | Supervised feature selection |
| A28 | NL-based explainable IDS | n.r. | 2026 | JBCS | exc | 1 | Supervised XAI |
| A29 | XAI CAN IDS (Portuguese) | n.r. | 2024 | SBSeg | exc | 1 | National venue; XAI only |
| A30 | PIPD UAV | n.r. | 2025 | IEEE RA-L | exc | 2 | Not automotive; method reference only |
| B01 | Heterogeneous sensor consistency | Ganesan | 2017 | SAE Tech. Paper | inc (seminal) | 3 | Origin of "natural redundancy"; RESERVE [5] |
| B02 | CAID | Wasicek | 2017 | escar USA | inc (seminal) | 2 | Novelty risk; CORE [14] |
| B03 | SAID | Xue | 2022 | USENIX Security | inc | 3 | Explicit dynamics models; CORE [7] |
| B04 | CADD | Chen | 2024 | RAID | inc | 3 | Physics vs LSTM; CORE [8] |
| B05 | EVAD | Guo | 2019 | IEEE TVT | inc | 3 | Cross-sensor consistency on real logs; RESERVE |
| B06, C05 | Sensor anomaly detection in automated vehicles | van Wyk | 2020 | IEEE T-ITS | inc | 3 | Hybrid vs KF-only vs CNN-only; CORE N3 |
| B07, C07 | Augmented-state EKF anomaly detection | Wang | 2020 | IEEE FISTS | inc (exc in C: physics-only) | 2 | Observer residual on real connected-vehicle data |
| B08 | Control invariants for robotic vehicles | Choi | 2018 | ACM CCS | exc | 1 | Robotic vehicles; pre-2019 |
| B09 | RAIDS | Jiang | 2019 | ICICS (LNCS) | exc | 1 | Context learned from perception; no physics model |
| B10 | GPS-IDS | Abrar | 2024 | arXiv | unc | 2 | Preprint; bicycle model |
| B11 | GPS attack detection via lane/map | Chen | 2023 | arXiv | exc | 1 | Preprint; perception vs GPS |
| B14 | Stealthy attacks on lateral dynamics | Eslami | 2026 | arXiv | unc | 2 | Preprint; RQ4 must-check |
| B15 | Event-triggered secure control | Mousavi | 2025 | arXiv | exc | 1 | Preprint; control focus |
| B16 | ACC with ML IDS | Ben Othmane | 2026 | arXiv | exc | 1 | Preprint; control integration |
| B17 | Detecting fabricated CAN messages | Ben Othmane | 2020 | IEEE TDSC | inc | 3 | Speed–RPM correlation vs ML on a real vehicle; CORE N2 |
| B18 | J1939 control-level IDS | Jichici | n.v. | unknown | unc | 2 | Venue and year unknown |
| B19, C08 | PCADS tele-driving | Ghosh | 2025 | IEEE Access | unc (inc in B) | 2 | How physics enters is unclear; preliminary |
| B20 | Sliding-mode observer, platoons | Keijzer | 2021 | ECC | inc | 2 | Undetectable attack classes (simulation) |
| B21 | Subtle ACC attacks, GAN | Li | 2025 | IEEE OJ-ITS | exc | 1 | Purely data-driven |
| B22, C03 | PINN platoon detection | Vyas | 2023 | ACC | inc | 3 | Physics in the loss; CORE [16] |
| B23 | Survey from the dynamics and control view | Ju | 2022 | IEEE T-IV | inc | 1 | Background survey; snowball source |
| B24 | GNSS/INS/odometer spoofing detection | Broumandan | 2018 | Sensors | inc (seminal) | 2 | Odometry vs external speed (R1 pattern) |
| B25 | SoK: CAN security | Serag | 2025 | arXiv / NDSS 2027? | exc | 1 | General SoK |
| B27 | Energy-Truth IDS | n.r. | 2026 | ISAA | exc | 0 | IoT/ICS, not automotive |
| B28 | Attack-aware INS/GNSS integration | n.r. | 2017 | IEEE SMC | exc | 1 | Pre-2019, not seminal; simulation |
| C02 | Physics-guided ML for EV attacks | Guo | 2021 | IEEE TTE | inc | 3 | Physics as inputs in a vehicle; CORE [15] |
| C04 | Homomorphic-encryption cPINN CAN IDS | Senthilkumar | 2026 | JESA | exc | 1 | No physical relation stated; DROP [10] |
| C06 | Sensor anomaly detection and recovery in CAVs | Wang | 2021 | IEEE T-ITS | inc | 2 | Adaptive EKF + OCSVM hybrid |
| C09 | Physics Joins AI (V2X) | Ghiro | 2026 | Computer Commun. | inc | 2 | Physics in score fusion; simulated V2X |
| C10 | Physics-informed edge IDS, IoV | Bourouis | 2026 | Vehicles | inc | 2 | Feature ablation (D3 analogue); simulated |
| C11, E25 | AVMON | Abdo | 2024 | VehicleSec | inc | 3 | Hybrid beats physics-only defences; RESERVE |
| C12 | PID-Piper | Dash | 2021 | IEEE/IFIP DSN | exc | 1 | No explicit physics; recovery focus |
| C13 | Cy-Phy ADS (EV charging) | Mavikumbure | 2024 | IEEE TTE | exc | 1 | No explicit physical law |
| C14 | PI-KAN autoencoder | Li | 2026 | IEEE TTE | inc | 2 | Controlled physics-loss AE (D4 analogue) |
| C15 | Physics-guided contrastive learning, drives | Yang | 2026 | IEEE APEC | inc | 2 | Physics-weighted loss |
| C16 | Physics-informed ConvAE (grid) | Zideh | 2024 | IEEE PESGM | inc | 3 | D4 template; companion of N5 |
| C17 | Multivariate PI-ConvAE (grid) | Zideh | 2025 | SEGAN | inc | 3 | D4 template on a real feeder; CORE N5 |
| C18 | Features over Architecture (ICS) | Chahine | 2026 | Future Internet | inc | 3 | D3 template; CORE N4 |
| C19 | PIWAD (water) | Hussain | 2026 | IEEE IoT-J | inc | 3 | Score fusion; adaptive attackers; RESERVE, must check |
| C20 | Temporal differential consistency AE | Somma | 2025 | CNSM | inc | 2 | Loss on time derivatives |
| C21 | PI-LSTM for DC-DC converter | Moon | 2025 | Applied Sciences | inc | 2 | D4 design; μ + 3σ threshold |
| C22 | Hybrid PINN for DC-DC converter | Machina | 2024 | IEEE TIA | exc | 1 | No controlled comparison |
| C23 | Federated PI-LSTM (VSM) | Khaleghi | 2025 | Fractal Fract. | unc | 1 | With/without claim but no numbers |
| C24 | Physics-informed hybrid (grid) | Sharifi | 2026 | IEEE TIA | exc | 1 | No physics ablation |
| C25 | CLDPhy | Nafees | 2022 | SmartGridComm | inc | 2 | With vs without context gain |
| C26 | PICL (grid) | Lu | 2026 | IEEE Access | inc | 2 | Paired physics vs AE comparison with CI |
| C27 | Physics-informed LFC DoS detection | Sheida | 2026 | IEEE TPEC | inc | 2 | Hybrid vs plain AE (AUC) |
| C28 | Design plus ML (water plants) | Gauthama Raman | 2024 | Electronics | unc | 1 | No with/without-physics ablation |
| C29 | Physics residual + PSO (UAV GPS) | Ma | 2025 | Sensors | inc | 2 | Residuals as features (D3) on real data |
| C30 | VAE physics-informed CPS | Aftabi | 2023 | arXiv | exc | 1 | Preprint |
| C31 | PIML for grid anomaly review | Zideh | 2024 | IEEE Access | exc | 1 | Review, not primary |
| C32 | Platoon detection-isolation in SUMO | Ghosh | 2025 | ACC | exc | 1 | Model-based only |
| C33 | Change-point models (CV) | Comert | 2022 | IEEE T-ITS | exc | 0 | Statistical only |
| D02 | can-train-and-test (journal) | Lampe | 2024 | Computers & Security | inc | 2 | Multi-vehicle dataset; held-out testing |
| D03 | can-train-and-test (conference) | Lampe | 2023 | IEEE VTC-Fall | exc | 1 | Superseded by D02 |
| D04 | can-sleuth (conference) | Lampe | 2024 | EICC | exc | 1 | Superseded by D05 |
| D05 | can-sleuth (journal) | Lampe | 2025 | IJIS | inc | 2 | Train-test interdependence |
| D06 | CAN We Trust Your Results? | Koltai | 2026 | IEEE EuroS&PW | inc | 3 | Cross-dataset comparability; RESERVE |
| D07 | Real-world applicability of CAN IDS (WIP) | Lazeski | 2026 | USENIX VehicleSec | inc | 3 | Shortcut learning; domain knowledge; RESERVE |
| D08 | Benchmarking CAN IDS review | Sharmin | 2024 | J. Computer Security | inc | 3 | Evaluation design space; RESERVE |
| D09 | Analysis of automotive IDS datasets | Lee | 2023 | CMC | inc | 2 | Dataset bias metrics |
| D10 | CAN NIDS evaluation framework | Dupont | 2019 | IEEE ICCVE | inc | 2 | Meaning-aware evaluation |
| D11 | CrySyS CAN dataset | Gazdag | 2023 | Scientific Data | inc | 2 | Signal-level attack dataset |
| D12 | CAN-MIRGU | Rajapaksha | 2024 | VehicleSec | inc | 2 | Moving-vehicle dataset |
| D15 | DCNN IDS (HCRL Car-Hacking) | Song | 2020 | Veh. Commun. | inc | 1 | Provenance of the Car-Hacking dataset |
| D17 | AI-based in-vehicle IDS survey | Rajapaksha | 2023 | ACM CSUR | inc | 3 | Survey; CORE N9 |
| D18 | Automotive IDS review | Lampe | 2023 | IEEE COMST | inc | 2 | Survey |
| D19 | DL automotive IDS survey | Lampe | 2023 | ESWA | inc | 2 | Survey of evaluation practice |
| D20 | IVN intrusion detection survey | Wu | 2019 | IEEE T-ITS | inc | 2 | Most-cited survey (OA 449) |
| D21 | Intra-vehicle IDS review | Al-Jarrah | 2019 | IEEE Access | inc | 1 | Older survey |
| D22 | Deep Learning in the Fast Lane | Almehdhar | 2024 | IEEE OJVT | inc | 1 | Method-centred survey |
| D23 | Learning-based IVN IDS survey | Althunayyan | 2026 | Computer Networks | inc | 2 | Metrics for safety-critical requirements |
| D24 | Intra- and inter-vehicle IDS/IPS survey | El-Fatyany | 2026 | IEEE COMST | inc | 2 | Most recent COMST survey |
| D25 | Vehicular IDS for CAN survey and evaluation | Liu | 2025 | IEEE T-ITS | inc | 2 | Survey + evaluation |
| D26 | Cyber-physical vehicle IDS taxonomy | Loukas | 2019 | Ad Hoc Networks | inc | 3 | Only survey framing physics; RESERVE |
| D27 | Survey of surveys, meta-taxonomy | Karopoulos | 2022 | Electronics | inc | 1 | Coverage only |
| D28 | Experimental security analysis of an automobile | Koscher | 2010 | IEEE S&P | inc (seminal) | 3 | Threat background; CORE [11] |
| D29 | Automotive attack surfaces | Checkoway | 2011 | USENIX Security | inc (seminal) | 3 | Replaces [12]; CORE N10 |
| D30 | CAHOOTv2 | Micale | 2024 | IJIS | exc | 1 | Detector on simulated data |
| D34 | Deep learning CAN IDS | Rai | 2025 | Scientific Reports | exc | 0 | Saturated-benchmark example |
| D35 | Physics-based detection survey (NIST) | Urbina | 2016 | NIST GCR | exc | 1 | Technical report; non-automotive |
| D36 | Automotive Ethernet IDS concept | Lindwall | 2020 | Lund thesis | exc | 0 | Thesis |
| E01 | Limiting the impact of stealthy attacks | Urbina | 2016 | ACM CCS | inc (seminal) | 3 | False-alarm-bounded evaluation; CORE N8 |
| E02 | Attack detection and identification in CPS | Pasqualetti | 2013 | IEEE TAC | inc (seminal) | 2 | Undetectability theory; RESERVE |
| E03 | Secure control framework | Teixeira | 2015 | Automatica | inc (seminal) | 2 | Attacker resource taxonomy |
| E04 | Performance degradation under stealthy attacks | Mo | 2015 | IEEE TAC | inc (seminal) | 2 | Stealthy attacks vs χ² detector |
| E05 | Revealing stealthy attacks | Teixeira | 2012 | Allerton | exc | 2 | Pre-2019; covered by E03 |
| E06 | Vulnerability under stealthy attacks | Sui | 2020 | IEEE TAC | unc | 2 | Definitions only; overlaps E02 and E04 |
| E07 | Comparison of stealthy sensor attacks | Hashemi | 2018 | ACC | exc | 1 | Pre-2019, not seminal |
| E08 | Constrained concealment attacks | Erba | 2020 | ACSAC | inc | 3 | Consistent-group analogue; CORE N7 |
| E09 | Generic concealment attacks | Erba | 2022 | ACSAC | inc | 3 | Attacks that target a consistency |
| E10 | Out of control: robotic vehicles | Dash | 2019 | ACSAC | inc | 3 | Evading physics-model IDS; RESERVE |
| E11 | Stealthy attacks on robotic vehicles (journal) | Dash | 2021 | ACM DTRAP | inc | 2 | Companion of E10 |
| E12 | SAVIOR | Quinonez | 2020 | USENIX Security | unc | 2 | Stealthy-attacker evaluation not in the abstract |
| E13 | Black-box stealthy GPS attacks | Khazraei | 2024 | IEEE CDC | inc | 2 | Single-channel stealth despite sensor fusion |
| E14 | DUET voltage-IDS evasion | Bhatia | 2021 | NDSS | inc | 2 | Masquerade threat model |
| E15 | Evasion attacks on automotive IDS | Cerracchio | 2024 | VehicleSec | inc | 2 | Gradient evasion against CAN IDS |
| E16 | Resilience of automotive IDS | Longari | 2025 | ACM TCPS | inc | 3 | Most complete CAN-IDS evasion study; RESERVE |
| E17 | Adversarial attacks on IVN IDS | Aloraini | 2024 | Sensors | inc | 2 | Black-box adversarial frames |
| E18 | CAN masquerade via signal clustering | Moriano | 2022 | NDSS AutoSec | inc | 2 | Masquerade breaks inter-signal correlations |
| E20 | Cross-domain adversarial attacks (V2X) | Hasan | 2025 | IEEE VTC-Spring | exc | 1 | No physics; network features |
| E21 | Real-time evasion detection, tree ensembles | Colaco | 2025 | IEEE VNC | exc | 1 | ML-evasion defence only |
| E22 | PASAD | Aoudi | 2018 | ACM CCS | exc | 1 | Pre-2019 detector |
| E23 | Stealthy attacks on nonlinear CPS | Zhang | 2021 | IEEE TAC | exc | 1 | Redundant with E02–E04 |
| E24 | Shared Reality | Quinonez | 2021 | CPSIoTSec | exc | 1 | No adaptive-attacker evaluation |
| E26 | Kalman-filter FDI detection (grid) | Manandhar | 2014 | IEEE TCNS | exc | 1 | Pre-2019; smart grid |

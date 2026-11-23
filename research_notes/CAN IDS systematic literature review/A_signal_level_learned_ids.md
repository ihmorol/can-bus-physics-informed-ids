# A. Signal-level (payload / decoded-signal value) learned IDS for in-vehicle CAN: search and title/abstract screening

Prepared 2026-11-23. Scope: learned detectors that model decoded CAN signal values (autoencoders, forecasting / prediction-error, GNN / signal-relationship, explainable signal-level IDS), with emphasis on masquerade / payload tampering, plus users of the X-CANIDS dataset.

Conventions used throughout:
- "OA" = OpenAlex `cited_by_count`, retrieved 2026-11-23. "S2" = Semantic Scholar `citationCount`, retrieved 2026-11-23. The two databases give different counts for the same paper; both are reported where available.
- "Scopus (venue-level)" is my judgement about the venue only. I could not query Scopus, so none of these are verified in Scopus.
- Every number in the "key numbers" fields is quoted from the abstract (locator "abstract") unless marked otherwise.
- Where a record's metadata (authors, volume and so on) came from OpenAlex, the OpenAlex work ID is given (Wxxxx), so it can be re-checked at `https://api.openalex.org/works/Wxxxx`.

---

## 1. Search log

| # | Date | Database / tool | Query / operation | Hits (where visible) | Notes |
|---|---|---|---|---|---|
| S1 | 2026-11-23 | Semantic Scholar Graph API `/paper/search` | `X-CANIDS signal-level intrusion detection CAN`, then `X-CANIDS explainable intrusion detection` | none (HTTP 429 rate limit, twice) | Unauthenticated search endpoint was rate-limited |
| S2 | 2026-11-23 | OpenAlex `/works?search=` | `X-CANIDS` | 18,661 (fuzzy full-text match; first hit = X-CANIDS, W4387918052) | Used only to resolve the X-CANIDS work ID |
| S3 | 2026-11-23 | OpenAlex `/works?filter=cites:W4387918052` (forward citation search of X-CANIDS), sorted by citations | all citing works, 2 pages of 50 | **89 citing works** | All 89 titles screened; all available abstracts searched for "X-CANIDS", "physic", "dynamics", "Hyundai", "Sonata" (see section 2b) |
| S4 | 2026-11-23 | OpenAlex search | `CANShield deep learning signal-level intrusion detection` | 43 | Gave CANShield (IoT-J) |
| S5 | 2026-11-23 | OpenAlex search | `CANet structured neural network intrusion detection controller area network` | count not recorded | Gave CANet, U-CAN, Rec-CNN, TL-IDS |
| S6 | 2026-11-23 | OpenAlex search | `lightweight unsupervised online IDS masquerade attacks CAN` | count not recorded | Gave Moriano (JISA 2026), ROAD, Marfo (TIFS 2025) |
| S7 | 2026-11-23 | OpenAlex search | `Digital Twin-Based Intrusion Detection Vehicle Powertrain CAN` | count not recorded | Gave Rahman et al. (arXiv only) |
| S8 | 2026-11-23 | OpenAlex search | `ATHENA CAN intrusion detection` | count not recorded | Gave ATHENA (arXiv only) |
| S9 | 2026-11-23 | OpenAlex search | `road dataset real controller area network masquerade` | count not recorded | Gave ROAD (PLoS ONE) and ICSCA 2023 comparison |
| S10 | 2026-11-23 | OpenAlex search | `INDRA intrusion detection recurrent autoencoders automotive` | 48 | Gave INDRA (TCAD), Sensors 2025 adaptive AE |
| S11 | 2026-11-23 | OpenAlex search | `CANnolo LSTM autoencoder controller area network` | 79 | Gave CANnolo (TNSM), CANdito (LNCS) |
| S12 | 2026-11-23 | OpenAlex search | `vehicle dynamics physical consistency CAN bus intrusion detection signals` | 1,205 | Top hits were CANet, Rahman DT, generic ML; no explicit vehicle-dynamics IDS on X-CANIDS |
| S13 | 2026-11-23 | OpenAlex search | `physics-informed anomaly detection in-vehicle CAN` | 10,460 | Gave Philip et al. (IEEE ISI 2026) and PIPD (RA-L 2025, UAV) |
| S14 | 2026-11-23 | OpenAlex DOI lookup | `doi:10.3390/electronics13020377` | 1 | Resolved existing source [17] |
| S15 | 2026-11-23 | Semantic Scholar `/paper/batch` (POST) | 11 IDs (DOIs/arXiv of X-CANIDS, CANShield, ATHENA, Rahman DT, Moriano, KBS 2025, C&S 2025, DGIDS, CA-GCN, CANdito) | 9 returned, 2 null (CA-GCN, CANdito) | The batch endpoint worked, but S2 had no abstracts for the Elsevier records |
| S16 | 2026-11-23 | Crossref REST `/works/{doi}` | 5 DOIs (KBS 2025, C&S 2025 x2, IJAT 2025, LNCS 2023) | 5 records, **0 abstracts** | Elsevier and Springer do not deposit abstracts here |
| S17 | 2026-11-23 | Web search | `"Signal-relationship-aware explainable intrusion detection" graph transformers ...` | 10 links | Only the DBLP record (KBS 328:114237) was found; no abstract |
| S18 | 2026-11-23 | Web search | `"X-CANIDS dataset" intrusion detection signal` | 10 links | IEEE DataPort dataset page and the arXiv version of X-CANIDS |
| S19 | 2026-11-23 | WebFetch ScienceDirect / SpringerLink | KBS 2025, IJAT 2025, LNCS 2023 pages | 403 / login redirect | Publisher pages blocked automated access |

Not queried: Google Scholar ("cited by"), IEEE Xplore, ACM DL and Scopus. None of them were reachable with the tools available. The OpenAlex forward-citation search (S3) took the place of Google Scholar's "cited by" for X-CANIDS.

---

## 2. Screening table

Criteria: I1 = peer-reviewed (preprints only if exceptionally relevant, flagged); I2 = 2019-2026; I3 = learned detector that models CAN signal/payload values; E1 = timing/ID-only with no payload-value modelling; E2 = not automotive.
Relevance: 3 = directly answers the project's RQs; 2 = partly, or useful for methods; 1 = background; 0 = unrelated.
All records below were screened on the **abstract** (no full texts were read).

### 2a. Records screened (abstract read)

| RecID | Title | First author et al. | Year | Venue | Peer-reviewed? | Scopus (venue-level) | DOI/URL | Citations (source, date) | Screened on | Aim (one line) | Rel. | Decision | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A01 | X-CANIDS: Signal-Aware Explainable Intrusion Detection System for CAN-Based In-Vehicle Network | Jeong et al. | 2024 (online 2023) | IEEE Trans. Vehicular Technology 73(3):3230-3246 | Yes (journal) | IEEE TVT: Scopus-indexed journal (venue-level, not checked in Scopus) | https://doi.org/10.1109/TVT.2023.3327275 | OA 2026-11-23: 89; S2 2026-11-23: 68 | abstract | Unsupervised, explainable IDS on DBC-decoded signals; shows which signal/ECU is attacked | 3 | include | I1-I3 met; the project's dataset and baseline |
| A02 | CANShield: Deep-Learning-Based Intrusion Detection Framework for CAN at the Signal Level | Shahriar et al. | 2023 | IEEE Internet of Things Journal 10(24):22111-22127 | Yes (journal) | IEEE IoT-J: Scopus-indexed journal (venue-level, not checked) | https://doi.org/10.1109/JIOT.2023.3303271 | OA 2026-11-23: 98; S2 2026-11-23: 79 | abstract | Multi-scale ensemble of deep autoencoders on signal time series, aimed at signal-level injection | 3 | include | I1-I3 met; the reference autoencoder design for D2 |
| A03 | CANet: An Unsupervised Intrusion Detection System for High Dimensional CAN Bus Data | Hanselmann et al.\* | 2020 | IEEE Access | Yes (journal) | IEEE Access: Scopus-indexed journal (venue-level, not checked) | https://doi.org/10.1109/ACCESS.2020.2982544 | OA 2026-11-23: 335 | abstract | Unsupervised neural network handling multi-ID, multi-rate signal data; released SynCAN | 3 | include | I1-I3 met; most-cited signal-level learned IDS; origin of SynCAN |
| A04 | CANnolo: An Anomaly Detection System Based on LSTM Autoencoders for CAN | Longari et al.\* | 2020 | IEEE Trans. Network and Service Management | Yes (journal) | IEEE TNSM: Scopus-indexed (venue-level, not checked) | https://doi.org/10.1109/TNSM.2020.3038991 | OA 2026-11-23: 165 | abstract | LSTM autoencoder reconstruction error on CAN data sequences; simulated attacks on a real-world dataset | 2 | include | I1-I3 met (payload sequences); methods precedent for reconstruction-error detection |
| A05 | INDRA: Intrusion Detection Using Recurrent Autoencoders in Automotive Embedded Systems | Kukkala et al.\* | 2020 | IEEE Trans. CAD of Integrated Circuits and Systems | Yes (journal) | IEEE TCAD: Scopus-indexed (venue-level, not checked) | https://doi.org/10.1109/TCAD.2020.3012749 | OA 2026-11-23: 92 | abstract | GRU recurrent autoencoder anomaly detection on the CAN bus | 2 | uncertain | I3 not confirmed from the abstract (the abstract does not say whether signals or bits are modelled); check the full text |
| A06 | CANival: A multimodal approach to intrusion detection on the vehicle CAN bus | (authors not captured) | 2024 | Vehicular Communications 50 | Yes (journal) | Vehicular Communications (Elsevier): Scopus-indexed (venue-level, not checked) | https://doi.org/10.1016/j.vehcom.2024.100845 | OA 2026-11-23: 55 | abstract | Fuses a time-interval likelihood model with an optimised CANet signal analyser; **evaluated on X-CANIDS** and SynCAN | 3 | include | I1-I3 met; the most-cited peer-reviewed signal-level detector evaluated on X-CANIDS |
| A07 | KG-ID: Knowledge Graph-Based Intrusion Detection on In-Vehicle Network | Sun et al. | 2025 | IEEE Trans. Intelligent Transportation Systems 26(4):4988-5000 | Yes (journal) | IEEE T-ITS: Scopus-indexed (venue-level, not checked) | https://doi.org/10.1109/TITS.2025.3530155 | OA 2026-11-23: 37 | abstract | Knowledge graph and ontology over CAN frame plus signal features; detects fabrication, masquerade and fuzzy attacks; tested in a real XPeng vehicle | 2 | include | I1-I3 met; structured domain knowledge (a non-physics counterpart to explicit physics relations) |
| A08 | ETFIDS: An Entropy-Driven, Time-Frequency Analysis Framework for In-Vehicle CAN Signal Intrusion Detection | (authors not captured) | 2025 | IEEE Internet of Things Journal | Yes (journal) | IEEE IoT-J: Scopus-indexed (venue-level, not checked) | https://doi.org/10.1109/JIOT.2025.3547575 | OA 2026-11-23: 12 | abstract | Extracts physical signal streams from CAN; frequency-domain and time-domain (entropy) detectors | 2 | uncertain | Signal-level, but the abstract does not establish a *learned* detector (I3) or name the dataset |
| A09 | MKF-ADS: Multi-Knowledge Fusion Based Anomaly Detection System in Vehicular CAN | (authors not captured) | 2025 | IEEE Trans. Vehicular Technology | Yes (journal) | IEEE TVT: Scopus-indexed (venue-level, not checked) | https://doi.org/10.1109/TVT.2025.3564575 | OA 2026-11-23: 12 | abstract | Prediction-based detector: Conv1D-BiLSTM-attention student distilled from a patch sparse transformer; six attack scenarios | 2 | include | I1-I3 met; a forecasting / prediction-error design; claims "controllable false alarms". The dataset is not named in the abstract |
| A10 | StatGraph: Effective In-Vehicle Intrusion Detection via Multi-View Statistical Graph Learning | (authors not captured; code at github wangkai-tech23) | 2025 | IEEE Trans. Mobile Computing | Yes (journal) | IEEE TMC: Scopus-indexed (venue-level, not checked) | https://doi.org/10.1109/TMC.2025.3636517 | OA 2026-11-23: 10 | abstract | GCN over timing-correlation and coupling-relationship graphs that encode payload variation and signal co-occurrence; five masquerade attacks, two real datasets | 2 | include | I1-I3 met; masquerade focus. Note: a supervised per-message classifier, not normal-only |
| A11 | DriveShield: Unmasking stealthy attacks on CAN bus via adversarial spatiotemporal feature learning | (authors not captured) | 2025 | J. King Saud Univ. - Computer and Information Sciences | Yes (journal) | JKSU-CIS: Scopus-indexed journal (venue-level, not checked) | https://doi.org/10.1007/s44443-025-00273-2 | OA 2026-11-23: 4 | abstract | Unsupervised adversarial autoencoder on fused time-interval and physical-signal data; aimed at masquerade | 2 | include | I1-I3 met; autoencoder variant directly comparable with D2 |
| A12 | Detecting Masquerade Attacks in CAN Using Graph Machine Learning | Marfo et al. | 2025 | IEEE Trans. Information Forensics and Security 20:13127-13142 | Yes (journal) | IEEE TIFS: Scopus-indexed (venue-level, not checked) | https://doi.org/10.1109/TIFS.2025.3636019 | OA 2026-11-23: 14 | abstract | Message-sequence graphs plus time-series statistical node attributes for masquerade detection on ROAD | 2 | include | I1-I3 met (time-series features from frames); a top-tier venue covering masquerade |
| A13 | Evaluating lightweight unsupervised online IDS for masquerade attacks in CAN | Moriano et al. | 2026 | J. Information Security and Applications 98:104392 | Yes (journal) | JISA (Elsevier): Scopus-indexed (venue-level, not checked) | https://doi.org/10.1016/j.jisa.2026.104392 | OA 2026-11-23: 6; S2 2026-11-23: 5 | abstract | Compares four non-deep-learning unsupervised online IDS on replayed ROAD masquerade attacks in sliding windows | 2 | include | I1-I2 met; unsupervised learned (non-deep-learning) signal time-series methods. Existing source [6] |
| A14 | A comprehensive guide to CAN IDS data and introduction of the ROAD dataset | Verma et al. | 2024 | PLoS ONE 19(1):e0296879 | Yes (journal) | PLoS ONE: Scopus-indexed (venue-level, not checked) | https://doi.org/10.1371/journal.pone.0296879 | OA 2026-11-23: 180 | abstract | Dataset survey plus ROAD: real vehicle, real fabrication/fuzzing, simulated masquerade, signal-translated captures | 2 | include (benchmark) | Not a detector (I3 not met); kept as the major real-vehicle signal benchmark, an allowed exception like those under E1 |
| A15 | ATHENA: An In-vehicle CAN Intrusion Detection Framework Based on Physical Characteristics of Vehicle Systems | Wang et al. | 2025 | arXiv 2503.17067 | **No (preprint)** | n/a | https://doi.org/10.48550/arXiv.2503.17067 | OA 2026-11-23: 6; S2 2026-11-23: 4 | abstract | Cloud-side mixture-model payload rules refined with "first-principled physical knowledge"; on-vehicle LSTM time rules; ROAD | 3 | uncertain (preprint) | Fails I1; kept as "preprint" because it directly uses physical knowledge. Existing source [9] |
| A16 | Digital Twin-Based Intrusion Detection for Vehicle Powertrain CAN Bus Systems | Rahman et al. | 2026 | arXiv 2608.17093 | **No (preprint)** | n/a | https://doi.org/10.48550/arXiv.2608.17093 | OA 2026-11-23: 0; S2 2026-11-23: 0 | abstract | Shared-encoder LSTM "digital twin" predicts coupled powertrain signals from a real Hyundai/Kia log; residual thresholding | 3 | include (preprint, flagged) | Fails I1 but is exceptionally relevant (real-car decoded signals, learned physical coupling, masquerade). Existing source [3] |
| A17 | Physics-Informed Temporal Learning for Cyber Attack Detection in Vehicle Platoons | Philip et al. | 2026 | IEEE Int. Conf. Intelligence and Security Informatics (ISI), pp. 144-149 | Yes (conference) | IEEE ISI proceedings: probably Scopus-indexed (venue-level judgement, uncertain) | https://doi.org/10.1109/ISI69914.2026.11685836 | OA 2026-11-23: 0 | abstract | CNN/LSTM plus physics-informed residuals on longitudinal dynamics for platoon (V2V) attack detection; simulated TruckMaker data | 3 | include | I1-I2 met. Automotive, but V2V platoon data rather than in-vehicle CAN (partial I3). The closest physics-informed method (RQ2) |
| A18 | Application-Layer Anomaly Detection Leveraging Time-Series Physical Semantics in CAN-FD Vehicle Networks (PSEAD) | Zhao et al. | 2024 | Electronics 13(2):377 | Yes (journal) | MDPI Electronics: Scopus-indexed (venue-level, not checked) | https://doi.org/10.3390/electronics13020377 | OA 2026-11-23: 13 | abstract | Unsupervised LSTM plus self-attention on extracted physical-meaning signal features (CAN-FD) | 3 | include | I1-I3 met. Existing source [17] |
| A19 | Learnable graph ODE networks for anomaly detection in CAN-FD vehicle networks (LGOVAD) | Xu et al. | 2025 | Alexandria Engineering Journal 134:308-320 | Yes (journal) | AEJ (Elsevier): Scopus-indexed (venue-level, not checked) | https://doi.org/10.1016/j.aej.2025.12.020 | OA 2026-11-23: 0 | abstract | Decodes physical signals, *learns* hidden dependencies between vehicle parameters via dual-branch graph learning, graph ODE over time | 3 | include | I1-I3 met. Learned-relation counterpart to explicit physics; benchmarks against CANShield, CANet and PSEAD |
| A20 | U-CAN: A Convolutional Neural Network Based Intrusion Detection for CAN | (authors not captured) | 2022 | IEEE COMPSAC | Yes (conference) | COMPSAC: probably Scopus-indexed (venue-level, uncertain) | https://doi.org/10.1109/COMPSAC54236.2022.00235 | OA 2026-11-23: 9 | abstract | CNN segmentation on raw frames and reverse-engineered signals, including plateau attacks | 1 | exclude | Meets I1-I3 only weakly (supervised; the abstract's "false-positive rate 0.998" is internally inconsistent). Relevance 1, dropped under "prefer fewer" |
| A21 | Adaptive Autoencoder-Based IDS with Single Threshold for CAN Networks | (authors not captured) | 2025 | Sensors 25(13):4174 | Yes (journal) | MDPI Sensors: Scopus-indexed (venue-level, not checked) | https://doi.org/10.3390/s25134174 | OA 2026-11-23: 20 | abstract | Frame-level autoencoder on FPGA; threshold picked with KDE on part of the *attack* data | 1 | exclude | I3 unclear (frame-level, not decoded signals). Threshold uses attack data, unlike the project's normal-only protocol |
| A22 | CITA: One-Sided Tail Aggregation for In-Vehicle CAN Bus Anomaly Detection Under Strict False-Alarm Budgets | Zhan et al. | 2026 | IEEE conf. (IoTAIEE 2026), pp. 559-564 | Yes (conference) | unknown | https://doi.org/10.1109/IOTAIEE70863.2026.11749388 | OA 2026-11-23: 0 | abstract | Inter-arrival-time statistics, threshold from an attack-free quantile; recall at a fixed 10^-3 false-alarm rate | 1 | exclude | E1 (timing only). Noted for its fixed-false-alarm-budget evaluation, which matches the project's 99.9th-percentile protocol |
| A23 | Target-Adaptive CAN Intrusion Detection Across Heterogeneous Vehicle Datasets via Robust Residual Modeling and Empirical Block-Rank Calibration | Xiang et al. | 2026 | Electronics 15(20):4865 | Yes (journal) | MDPI Electronics: Scopus-indexed (venue-level, not checked) | https://doi.org/10.3390/electronics15204865 | OA 2026-11-23: 0 | abstract | 12-dimensional residual deviation from normal communication plus Isolation Forest; normal-only calibration; tested on ROAD | 1 | uncertain | Unclear whether the residuals use payload values (I3). Useful for its normal-only calibration and its alarms-per-hour metric |
| A24 | A Channel-Attention-Enhanced Cascaded Method for CAN Bus Intrusion Detection (CA-CANet) | (authors not captured) | 2026 | IEEE conf. (ICSIP 2026) | Yes (conference) | unknown | https://doi.org/10.1109/ICSIP70099.2026.11744253 | OA 2026-11-23: 0 | abstract | Timing-first cascade plus channel-attention CANet signal branch; **evaluated on X-CANIDS** and SynCAN | 2 | include | I1-I3 met; recent X-CANIDS benchmark numbers |
| A25 | Redefinition of Inter-Message Arrival Time for Robust CAN Intrusion Detection | (authors not captured) | 2026 | IEEE ICUFN 2026 | Yes (conference) | unknown | https://doi.org/10.1109/ICUFN69619.2026.11628648 | OA 2026-11-23: 0 | abstract | Robust inter-arrival-time feature; **uses X-CANIDS** and Car-Hacking | 1 | exclude | E1 (timing only). Logged as an X-CANIDS user |
| A26 | AutoGuard-CAN: A Four-Layer Cascaded AI-Powered IDS for Secure In-Vehicle CAN Bus Communication | (authors not captured) | 2026 | IEEE ICoICI 2026 | Yes (conference) | unknown | https://doi.org/10.1109/ICOICI69824.2026.11723357 | OA 2026-11-23: 0 | abstract | Cascaded multi-model fusion, reconstruction-error zero-day branch (95th percentile), SHAP, **cross-dataset validation on X-CANIDS** | 1 | exclude | Low relevance (frame-level fusion; low-tier venue). Logged as an X-CANIDS user |
| A27 | IWSHAP-X: Enhancing Feature Selection for IDS via XAI-Guided Metaheuristics | (authors not captured) | 2026 | J. Brazilian Computer Society | Yes (journal) | unknown | https://doi.org/10.5753/jbcs.2026.6186 | OA 2026-11-23: 0 | abstract | SHAP-guided feature selection for supervised classifiers; **experiments on X-CANIDS** | 1 | exclude | Supervised feature selection, not a signal-level anomaly detector. Logged as an X-CANIDS user |
| A28 | Natural Language-Based Explainable Intrusion Detection for Vehicular Networks: Handling CAN and Wi-Fi Attack Vectors | (authors not captured) | 2026 | J. Brazilian Computer Society | Yes (journal) | unknown | https://doi.org/10.5753/jbcs.2026.6210 | OA 2026-11-23: 0 | abstract | Supervised model plus SHAP plus LLM explanations; **uses X-CANIDS** and AWID2 (fuzzing, fabrication) | 1 | exclude | Supervised XAI, not a signal-tampering detector. Logged as an X-CANIDS user |
| A29 | Modelos Interpretáveis com XAI na Detecção de Intrusões em Redes Intra-Veiculares CAN | (authors not captured) | 2024 | SBSeg 2024 (Brazilian Symposium on Cybersecurity) | Yes (national conference) | unknown | https://doi.org/10.5753/sbseg.2024.241421 | OA 2026-11-23: 6 | abstract (Portuguese) | SHAP explainability for a CAN IDS **using X-CANIDS** | 1 | exclude | Low relevance; national venue. Logged as an X-CANIDS user |
| A30 | Physics-Informed Anomaly Detection for Unmanned Aerial Vehicles (PIPD) | (authors not captured) | 2025 | IEEE Robotics and Automation Letters | Yes (journal) | IEEE RA-L: Scopus-indexed (venue-level, not checked) | https://doi.org/10.1109/LRA.2025.3598666 | OA 2026-11-23: 4 | abstract | Physics-informed prediction-for-detection; GNSS spoofing; two variants (all-state / residual) | 2 | exclude | E2 (not automotive). Kept as a method reference for RQ2 (physics as input vs. loss) |

\* The first author of A03, A04 and A05 comes from my background knowledge. OpenAlex authorship fields were not printed for these records in this session; re-check before citing.

### 2b. Records identified but NOT screened (abstract could not be retrieved)

These came from the X-CANIDS citation search (S3). They have no abstract in OpenAlex, Semantic Scholar or Crossref, and the publisher pages were blocked (S16-S19). Decision: **uncertain - abstract not retrieved**. They should not be counted as screened.

| RecID | Title | First author et al. | Year | Venue | DOI | Citations | Why it may matter |
|---|---|---|---|---|---|---|---|
| U01 | Signal-relationship-aware explainable intrusion detection in CAN using graph transformers | Gao et al. (incl. Zhenhai Gao, Rui Zhao: the same group as A18) | 2025 | Knowledge-Based Systems 328:114237 (per DBLP via S17) | 10.1016/j.knosys.2025.114237 | OA 4; S2 2 (2026-11-23) | Title suggests a learned signal-relationship GNN; possibly evaluated on X-CANIDS. **High priority to read** |
| U02 | Intrusion detection system for autonomous vehicles using sensor spatio-temporal information | Liu et al. | 2025 | Computers & Security | 10.1016/j.cose.2025.104502 | OA 8; S2 7 | Sensor (signal) spatio-temporal modelling |
| U03 | DGIDS: Dynamic graph-based intrusion detection system for CAN | Song et al. | 2024 | Computers & Security | 10.1016/j.cose.2024.104076 | OA 28; S2 23 | Graph IDS that cites X-CANIDS; signal use unknown |
| U04 | Anomaly Detection in Vehicular Networks Using Causality-Aware GCN (CA-GCN) | Luo et al. | 2025 | Int. J. Automotive Technology | 10.1007/s12239-025-00305-w | OA 5 | Causal relations between signals: close to physics relations |
| U05 | CANdito: Improving Payload-Based Detection of Attacks on CAN | Longari et al. | 2023 | LNCS (CSCML 2023) | 10.1007/978-3-031-34671-2_10 | OA 14 | Payload-based successor to CANnolo |
| U06 | A diffusion-based anomaly detection framework for securing in-vehicle CAN networks | Nahannu et al. | 2026 | J. Systems Architecture 181:103985 | 10.1016/j.sysarc.2026.103985 | OA 0 | Recent generative detector that cites X-CANIDS |

---

## 3. Shortlist for THIS project (ranked)

### 1. X-CANIDS (A01): the dataset and the unsupervised signal-level baseline
- **Why it matters:** It defines the data (decoded signals, normal-only training, zero-day framing) and the "learn from data only" comparison point for RQ1 and RQ3. Its explainability goal ("which signal or ECU is under attack") matches the project's per-relation physics residuals in D1 and D3.
- **Key claims from the abstract:**
  - "The signals improve the intrusion detection performance compared with the use of bit representations of raw payloads" (abstract).
  - Detects zero-day attacks "because it does not require any labeled dataset in the training phase" (abstract).
  - Feasibility was benchmarked "on an automotive-grade embedded device with a GPU" (abstract).
- No numeric metric appears in the abstract.

### 2. CANShield (A02): reference autoencoder design for D2
- **Why it matters:** CANShield is the canonical signal-level deep-autoencoder IDS. It uses multiple autoencoders at different temporal scales, with an ensemble decision. It explicitly targets attackers who inject false *signal* values while keeping message timing and frequency normal, which is the project's threat model. It is the natural design reference and justification for the D2 autoencoder (RQ1, RQ3).
- **Key claims from the abstract:** CANShield was evaluated on "two high-fidelity signal-based CAN attack data sets" with "high accuracy and responsiveness" (abstract). The abstract reports no numbers.

### 3. CANival (A06): the main peer-reviewed signal-level result on X-CANIDS
- **Why it matters:** This is the most-cited peer-reviewed paper found that reports detection on X-CANIDS. It is the external numeric anchor for the project's D2-D4 results. It is multimodal (timing plus a signal branch built on CANet), so the project can argue that signal-value detectors still need help on stealthy tampering.
- **Key numbers:** "average true positive rates of 0.960 and 0.912, and true negative rates of 0.997 and 0.996" on X-CANIDS and SynCAN respectively (abstract).
- **Caveat:** A TNR of 0.997 corresponds to an FPR of about 3x10^-3. That is a looser false-alarm budget than the project's 99.9th-percentile threshold (about 10^-3), so the two are not directly comparable.
- **Recent follow-up:** CA-CANet (A24, 2026) reports "0.968, 0.996, and 0.977" (TPR, TNR, F1) on X-CANIDS (abstract).

### 4. Rahman, Salek and Chowdhury digital twin (A16, PREPRINT): closest real-car analogue of D3/D4
- **Why it matters:** An LSTM learns coupled powertrain signal relations from a real Hyundai/Kia log and detects attacks by residuals. It is compared against a "range-and-plausibility baseline", which is a rule baseline similar to D1 (RQ1, RQ3, RQ4 with masquerade).
- **Key numbers:**
  - The model uses "17 decoded signals" and predicts "seven numeric and two categorical gear signals over a 24-step window" (abstract).
  - Detection rates were "94.6% for continuous drift and 89.2% for masquerade, while the baseline detected almost none" (abstract).
  - "False positive rates reached 39.6%" (abstract).
- **What the false-positive figure means for the project:** It shows why fixing the threshold on normal data at a stated false-alarm budget, as the project does, is essential.
- **Status:** Not peer-reviewed (see section 4).

### 5. Philip et al. 2026, PI-LSTM (A17): physics-informed residual method (RQ2)
- **Why it matters:** This is the closest peer-reviewed example of adding longitudinal-dynamics consistency to a learned temporal detector. It is the methodological precedent for D3/D4.
- **Limits:** It uses simulated platoon data (TruckMaker plus brake hardware), not in-vehicle CAN. That gap is exactly the novelty the project claims.
- **Key numbers:** "AUROC of 98.33% and F1 score of 95.74%" (abstract).
- **Attacks evaluated:** "single and multi-channel replay, sinusoidal, and freeze attacks" (abstract).

### 6. LGOVAD (A19): learned inter-signal dependencies as the strongest "data-only relations" competitor
- **Why it matters:** LGOVAD *learns* the dependencies between decoded vehicle parameters (graph learning plus graph ODE). That makes it the natural foil to the project's *explicit* physics relations. If explicit physics helps over a plain autoencoder, the next question is whether it also helps over learned relation graphs. It also benchmarks against CANShield, CANet and PSEAD (RQ1, RQ3).
- **Key numbers:** "F1 scores 1.27-11.51% higher than specialized in-vehicle detectors (CANet, CANShield, PSEAD)" on CAN-FD data (abstract).
- **Caveat:** Low citation count (OA 0) and a CAN-FD dataset rather than X-CANIDS.

Alternates, if a slot is needed:
- **PSEAD (A18, [17]):** physical-semantics LSTM-attention. "0.64% misclassification rate for challenging-to-detect replay attacks" and accuracy "enhanced by over 4%" versus byte-level methods (abstract).
- **Moriano et al. (A13, [6]) and ROAD (A14):** real-vehicle masquerade benchmark for RQ4.
- **Marfo et al. (A12):** masquerade detection in IEEE TIFS.

---

## 4. Status of existing project sources

| Ref | Finding | Evidence |
|---|---|---|
| [1] X-CANIDS | **Peer-reviewed, confirmed.** Jeong, Seong Hoon; Lee, Sangho; Lee, Hwejae; Kim, Huy Kang. *IEEE Trans. Vehicular Technology* **73(3):3230-3246**, DOI 10.1109/TVT.2023.3327275. OpenAlex lists the year as 2023 (early access); DBLP key `journals/tvt/JeongLLK24` gives the 2024 issue year. arXiv version: 2303.12278. Citations: OA 89, S2 68 (2026-11-23). Dataset on IEEE DataPort, DOI 10.21227/epsj-y384. | OpenAlex W4387918052; Semantic Scholar batch (S15); dataset details from web search S18: https://ieee-dataport.org/node/12755 |
| [1] dataset details | Per the S18 search summary of the DataPort page: raw and decoded-signal versions; six driving plus one idling capture; attacks in the 480-1440 s window of one capture; decoded with `hyundai_ccan_2015.dbc` into **688 signal columns**. **Not verified** by reading the DataPort page directly. The "Hyundai Sonata 2017" vehicle model was **not confirmed** in any source read this session. | https://ieee-dataport.org/node/12755 (via search summary only) |
| [3] Rahman, Salek, Chowdhury, Digital Twin-Based IDS for Vehicle Powertrain CAN | **Preprint only.** arXiv:2608.17093 (2026). No peer-reviewed version found in OpenAlex or Semantic Scholar (S2 lists venue "arXiv.org"; DBLP key `journals/corr/abs-2608-17093`). OpenAlex names the authors "A. al Rahman, M Sabbir Salek, Mashrur A. Chowdhury". Citations 0. Note: the abstract says "a real Hyundai/Kia CAN log". Whether that log is X-CANIDS is **not stated** in the abstract. | OpenAlex W7203793041; S2 CorpusId 291185173 |
| [4] CANShield | **Peer-reviewed, confirmed:** *IEEE Internet of Things Journal* **10(24):22111-22127, 2023**, DOI 10.1109/JIOT.2023.3303271. Authors: Md Hasan Shahriar, Yang Xiao, Pablo Moriano, Wenjing Lou, Y. Thomas Hou. arXiv:2205.01306 is the preprint of the same paper (S2 links them; DBLP `journals/iotj/ShahriarXMLH23`). A separate Zenodo record (2022, "CANShield: Signal-based Intrusion Detection for CAN") is the earlier preprint or artifact version. | OpenAlex W4385656664; S2 batch |
| [6] Moriano et al., lightweight unsupervised online IDS for masquerade | **Now peer-reviewed:** *Journal of Information Security and Applications* **98, article 104392 (2026)**, DOI 10.1016/j.jisa.2026.104392. Authors: Pablo Moriano, Steven C. Hespeler, Mingyan Li, Robert A. Bridges. arXiv:2406.13778 links to this DOI (S2; DBLP `journals/istr/MorianoHLB26`). Citations: OA 6, S2 5. Cite the JISA version. | OpenAlex W4399911193; S2 batch |
| [9] ATHENA | **Preprint only:** arXiv:2503.17067 (2025). No journal or conference version found (S2 venue "arXiv.org"; DBLP `journals/corr/abs-2503-17067`). OpenAlex authors: Kai Wang, Zhen Cui Sun, Bailing Wang, Qilin Fan, Ming Li, Hongke Zhang. Citations: OA 6, S2 4. Evaluated on ROAD. | OpenAlex W4417155861; S2 batch |
| [17] Zhao et al., Electronics 13(2):377 | **Confirmed:** "Application-Layer Anomaly Detection Leveraging Time-Series Physical Semantics in CAN-FD Vehicle Networks" (PSEAD). Rui Zhao, Cheng Luo, Fei Gao, Zhenhai Gao, Longyi Li, Dong Zhang. *Electronics* 13(2):377, 2024, DOI 10.3390/electronics13020377. OA citations 13. Note: the data is **CAN-FD**, not classical CAN. | OpenAlex W4390906415 |
| Closest prior work: Philip et al. 2026 | **Peer-reviewed conference paper:** Princy Philip, Madhav Rajadurai, K. B. Devika, Shankar C. Subramanian. "Physics-Informed Temporal Learning for Cyber Attack Detection in Vehicle Platoons", IEEE ISI 2026, pp. 144-149, DOI 10.1109/ISI69914.2026.11685836. | OpenAlex W7213521869 |

---

## 5. Answers to the key questions, and open uncertainties

### Most cited and most recent
- **Most cited signal-level / payload-value learned IDS** (OA, 2026-11-23):
  - CANet, 335 (A03)
  - CANnolo, 165 (A04)
  - CANShield, 98 (A02)
  - INDRA, 92 (A05)
  - X-CANIDS, 89 (A01)
  - CANival, 55 (A06)
  - KG-ID, 37 (A07)
  - The ROAD benchmark (A14) has 180.
- **Most recent (2025-2026) peer-reviewed signal-level papers:**
  - Journals: KG-ID (T-ITS 2025), MKF-ADS (TVT 2025), ETFIDS (IoT-J 2025), StatGraph (TMC 2025), Marfo (TIFS 2025), DriveShield (JKSU-CIS 2025), LGOVAD (AEJ 2025), Moriano (JISA 2026).
  - Conference: CA-CANet (ICSIP 2026).

### Real decoded signals vs. synthetic data (from abstracts only)

| Data type | Papers |
|---|---|
| X-CANIDS (real Hyundai) | A06, A24 (plus non-signal or supervised users A25-A29) |
| ROAD (real vehicle, simulated masquerade) | A12, A13, A15, A23 |
| Other real logs | A07 (real XPeng vehicle), A16 (real Hyundai/Kia log), A18/A19 ("real CAN-FD datasets") |
| SynCAN (synthetic) | A06, A24 (alongside X-CANIDS), A03 (introduced it) |
| Synthetic / simulated, not CAN | A17 (TruckMaker platoon) |
| Dataset not stated in the abstract | A02 ("two high-fidelity signal-based" datasets), A09, A10 ("two real-world CAN datasets"), A11 |

### Has anyone used X-CANIDS since 2024, and has anyone added physics on it?
- **Use of X-CANIDS:** Yes. Of the 89 OpenAlex works citing X-CANIDS, these abstracts state they *use* the X-CANIDS dataset:
  - CANival (VehCom 2024)
  - CA-CANet (ICSIP 2026)
  - IMAT redefinition (ICUFN 2026)
  - AutoGuard-CAN (ICoICI 2026)
  - IWSHAP-X (JBCS 2026)
  - NL-XAI (JBCS 2026)
  - SBSeg 2024 XAI
- **Physics on X-CANIDS:** **No citing abstract mentions physical / vehicle-dynamics relations applied to X-CANIDS.** The keyword search for "physic" and "dynamics" found only surveys, the signal-extraction wording in ETFIDS and DriveShield, and the *learned* dependencies of LGOVAD (on CAN-FD).
- **Caveat:** At least six citing records have no retrievable abstract (U01-U06), so this "no" holds only for the available abstracts. U01 (graph transformers, signal relationships, KBS 2025) is the most likely exception and should be checked first.

### Open uncertainties
1. **Abstracts not retrieved (U01-U06).** Elsevier and Springer abstracts could not be retrieved. U01 and U04 (causal GCN) in particular could weaken the "no physics or relation work on X-CANIDS" claim. A manual check on ScienceDirect, SpringerLink or IEEE Xplore is needed.
2. **Coverage of the X-CANIDS "cited by" search.** Google Scholar and IEEE Xplore were not reachable. The OpenAlex count (89) and the S2 count (68) differ, so a Google Scholar "cited by" check may surface more X-CANIDS users.
3. **Vehicle model in X-CANIDS.** The "Hyundai Sonata 2017" model was not confirmed. The only detail seen was the DBC name `hyundai_ccan_2015.dbc`, via a search summary of the DataPort page. Check the X-CANIDS paper or DataPort page directly.
4. **Data source in Rahman et al. [3].** It is unclear whether the "real Hyundai/Kia CAN log" is X-CANIDS. If it is, [3] is a direct preprint competitor on the same data. Check the full text.
5. **Datasets in recent journal papers.** CANShield, MKF-ADS, StatGraph and DriveShield do not name their datasets in the abstracts. Check the full texts before claiming which ones used real vs. synthetic signals.
6. **INDRA and ETFIDS.** For INDRA (A05), signal-level input is not confirmed from the abstract. For ETFIDS (A08), it is unclear whether the detector is learned.
7. **First authors for A03-A05** come from background knowledge, and authors were not captured for several records (A06, A08-A11, A20, A21, A24-A30). Fill these in from DOIs before citing.
8. **Scopus status** is judged at venue level only throughout, and is "unknown" for the 2026 IEEE conferences (IoTAIEE, ICSIP, ICUFN, ICoICI) and for JBCS.
9. **Citation counts** differ between OpenAlex and Semantic Scholar (for example, X-CANIDS 89 vs. 68, CANShield 98 vs. 79). Report the source and date together with any count.

# Glossary: the terms you need for this project

One short paragraph per term: what it is, and what you need to know for our work. Details come later, when you do each step.

**You do not need all of this now.** Read only the terms you need at each stage:

| When | Read these |
|---|---|
| **Now, for the proposal presentation** (about 15 terms) | CAN bus, control unit, signal, IDS, threat model, attack types, physics-based check, physics-informed, PINN, physical relation, residual, autoencoder, training/validation/test data, data leakage, threshold, false alarms per hour, detection rate, candidate gap |
| Steps 2 to 5 (data and relations) | decoding file, the speed signals, accelerations, yaw rate, gear ratio, wheel slip, fitting constants, correlation and R², parquet, 5 ms grid |
| Steps 6 to 9 (attacks and detectors) | signal tampering, window, rescaling, reconstruction error, loss and penalty, trainable parameters, seed |
| Steps 10 to 13 (results) | percentile, alarm event, AUROC, detection delay, precision, median/IQR, spread across seeds, baseline, distribution shift, sensitivity check |
| Writing the paper | novelty, preprint/peer review, replication, PI-LSTM |

---

## 1. The car and its network

**CAN bus.** The network inside a car that lets its small computers talk to each other. Every message goes to everyone on the network, and there is no check of who sent it. That missing check is why fake messages are possible, and why our project exists.

**Control unit (ECU).** One of the small computers in the car: engine, brakes (ABS), gearbox, steering, dashboard. Each one sends its own messages. Our physics checks work best when they compare signals that come from *different* control units, because one attacker usually controls only one unit's messages.

**Message and message ID.** A CAN message is a short packet of up to 8 bytes with an ID number (for example `386` in hex for wheel speeds). The ID says what the message is about, not who sent it. In our data, column names start with this ID, e.g. `386_WHL_SPD_FL`.

**Signal.** One physical value packed inside a message, like the front-left wheel speed in km/h. One message can hold several signals (message 386 holds all four wheel speeds). We work only with signals, never with raw bytes.

**Decoding file (DBC).** A text file that says where each signal sits inside a message and how to turn the bits into a number with a unit. Ours is a free community file for Hyundai, not an official one, so we check from the data that each signal behaves like its name.

**Wheel speeds, vehicle speed, dashboard speed.** The brake unit measures four wheel speeds; the engine unit (`VS`), the gearbox (`VS_TCU`) and the dashboard (`CF_Clu_Vanz`) report vehicle speed. They should all agree. The dashboard reads about 7% high, which is normal for cars; the fitted constant absorbs it.

**Longitudinal and lateral acceleration.** Forward/backward acceleration (`LONG_ACCEL`) and sideways acceleration in turns (`LAT_ACCEL`), in m/s². On a slope the sensor also feels gravity, so it reads a little off; that is why relation R2 is not perfect.

**Yaw rate.** How fast the car is turning around its vertical axis (`YAW_RATE`). The unit is not written in the decoding file, probably degrees per second; our straight-line fit sorts out the unit automatically. Values stuck at 40.95 are the sensor's maximum, not real readings.

**Steering angle.** How far the steering wheel is turned (`SAS_Angle`, degrees). Used only as a sanity check that the turning signals make sense.

**Engine speed and gear ratio.** Engine speed (`N`) is in rpm. In a fixed gear with the clutch closed, engine rpm ÷ road speed is a constant for that gear. This breaks while pulling away and during gear changes. Our gear signal is `CF_Tcu_TarGr` (target gear, 1 to 7).

**Wheel slip.** When a tyre spins or slides, its speed no longer matches the car's speed. It makes some relations fail briefly, especially hard acceleration, braking and sharp turns.

---

## 2. Security terms

**IDS (intrusion detection system).** Software that watches traffic and raises an alarm when something looks like an attack. We build and compare four small IDSs; we do not block or fix anything.

**Threat model.** A clear statement of what the attacker can and cannot do. Ours: the attacker can already send messages on the bus, can silence one control unit and send false values in its place, and keeps the timing normal. Every security reviewer asks for this first.

**Attack types in the dataset.** *Fuzzing*: random messages flood the bus. *Fabrication*: extra fake messages for one ID. *Suspension*: one unit is silenced. *Masquerade*: one unit is silenced and its messages are replaced with fake ones. *Replay*: old real messages are sent again. Our research focuses on masquerade-style value changes.

**Signal tampering (our attacks).** We edit values in normal recordings to imitate an attacker: *freeze* (hold a value), *drift* (slowly add an error), *offset* (add a constant error), *replay* (copy an earlier part), *whole message* (change all four wheel speeds together), *consistent group* (change every speed signal together so they still agree). The last one is designed to beat physics checks, so we can show the limit honestly.

**Physics-based check.** Comparing signals that physics says must agree (for example four wheel speeds vs vehicle speed). If an attacker changes one, the agreement breaks and we notice. It fails if the attacker changes all related signals consistently.

**Attack label.** The column in the data that marks attacked rows (1) and normal rows (0). In this dataset's attack files the label marks only the 5 ms slots where an attack message arrived, so we use the full attack period (480 to 1440 s) instead.

---

## 3. Physics-informed learning

**Physics-informed.** Giving a model known physical rules instead of making it learn everything from data. In our project this means using relations R1 to R5 inside the detectors.

**PINN (physics-informed neural network), strict meaning.** A neural network trained to solve a physics equation, with the equation inside its training loss. We do not do this. Our detector D4 only borrows the idea of adding a physics penalty to training, so we say "physics-informed in the loose sense".

**Physical relation (R1 to R5).** The five rules we use: wheels agree with speed (R1), speed change matches forward acceleration (R2), turning rate matches the left/right wheel difference (R3), sideways acceleration equals speed × turning rate (R4), rpm ÷ speed is fixed within a gear (R5). Each must be tested on normal data before use.

**Residual.** How much a relation is broken at a moment: left side minus right side. Near zero in normal driving; large when something is wrong. Residuals are the core of detector D1.

**Fitting constants (least squares).** Our relations have unknown constants (like the dashboard's 7% over-read). We find them by fitting the straight line that best matches normal training data. Fit only on training recordings, never on test data.

**Correlation (r) and R².** Two numbers for how well a relation holds. r goes from −1 to 1 (1 = perfectly in step). R² is the share of variation the fitted line explains, from 0 to 1; for a simple straight-line fit R² = r². Our keep rule is R² ≥ 0.9 on validation data, which is our own choice.

---

## 4. Machine learning terms

**Training, validation and test data.** Training data teaches the model. Validation data is used to choose settings and the alarm threshold. Test data is used once, at the end, to measure results. Here they are whole recordings: test is dump6; validation is one other drive; the rest is training.

**Splitting by whole recording.** Never put parts of the same drive in both training and test. Neighbouring moments of one drive are almost identical, so mixing them makes results look better than they really are.

**Data leakage.** Any way test data influences training or settings. It makes results look too good and is the most common hidden mistake. Our ground rules exist to prevent it.

**Window.** A short slice of time (for example 1 second) given to the model at once, so it sees how signals change, not just one moment.

**Rescaling (normalisation).** Putting all signals on a similar scale (rpm is in thousands, acceleration is around 1) so no signal dominates. The rescaling numbers come from training data only.

**Autoencoder.** A neural network that squeezes its input through a narrow middle layer and tries to rebuild it. Trained only on normal driving, it rebuilds normal data well and attacked data badly. Detectors D2, D3 and D4 are autoencoders.

**Reconstruction error.** How different the rebuilt output is from the input. Small for normal data, large for unusual data. It is the alarm score for D2 to D4.

**LSTM, BiLSTM, CNN (recurrent and convolutional networks).** More complex network types used in other papers: LSTM/BiLSTM are built for sequences over time, CNN for local patterns. We start with a plain (fully connected) autoencoder because it is easier to get right; these are optional extras.

**Loss and penalty (λ).** The loss is the number training tries to make small (here, reconstruction error). D4 adds a physics penalty: extra loss when the rebuilt signals break R1 to R5. λ (lambda) sets how much the penalty counts; we try 0.01, 0.1 and 1 and choose using validation data.

**Trainable parameters.** The adjustable numbers (weights) inside a network. D2, D3 and D4 should have about the same count, so a difference in results comes from physics, not from a bigger network.

**Seed.** The starting number for randomness (initial weights, random attack positions). Same seed means same result. We train with several seeds and report the average and spread, never just the best one.

---

## 5. Measuring results

**Threshold.** The score above which the detector raises an alarm. We set it once on normal validation data (the 99.9th percentile of scores) and never change it after seeing test results.

**Percentile.** The value below which a given share of the data falls. The 99.9th percentile of normal scores means only 0.1% of normal moments score higher.

**Alarm event.** Consecutive moments above the threshold, merged into one alarm if gaps are under 1 second. We count events, not single rows, so one long alarm counts once.

**False alarm and false alarms per hour.** An alarm during normal driving. Per hour is easier to judge than a percentage: "two false alarms per hour" means more to a driver than "0.04%".

**Detection rate (recall) and precision.** Detection rate: of all attacks, how many were caught. Precision: of all alarms, how many were real attacks. A good detector has both high.

**AUROC.** A threshold-free score from 0.5 (guessing) to 1 (perfect): the chance that a random attacked moment scores higher than a random normal moment. Useful to compare detectors without arguing about thresholds.

**Detection delay.** Time from the start of an attack to the first alarm. Shorter is better.

**Median, IQR and median absolute deviation.** Ways to describe typical values and spread that are not thrown off by rare spikes. Median: the middle value. IQR: the range covering the middle 50% of values. Median absolute deviation: the typical distance from the median.

**Spread across seeds.** How much results change between training runs. Treat a difference between detectors as real only if it is bigger than this spread.

**Baseline.** The simple method we compare against. Our main baseline is D2, the data-only detector.

**Distribution shift.** When the test data differs from the training data (another road, other traffic). It raises false alarms. We report it honestly rather than moving the threshold.

**Sensitivity check.** Re-running with one setting changed (window length, threshold) to see whether conclusions hold. Done last and reported as a check, not a main result.

---

## 6. Research terms

**Gap and candidate gap.** A gap is something not yet studied. Ours is a *candidate* gap: we have not found it done, but have not searched everything. The literature review must confirm it.

**Novelty.** What our work adds that is new. Not physics-informed detection itself (that exists) and not a new method. Ours is testing whether a physics gain reported on simulated platoon data [13] holds on real-car CAN data, with a physics-only baseline, thresholds set on normal driving only, and an attacker who keeps physics consistent.

**Preprint, arXiv, peer review.** A preprint is a paper posted publicly (often on arXiv) before experts check it. Peer review is that check by experts before a journal or conference publishes it. Preprint numbers are weaker evidence; say so when citing them.

**Replication.** Repeating someone else's study, often on new data. Our project is already close to this: it re-tests the idea of [13] in a new setting. If someone has done it on CAN data too, it becomes a plain replication, which is still valid coursework.

**PI-LSTM (physics-informed LSTM).** The detector in [13]: an LSTM (a network for sequences) trained to predict the next platoon states, with an extra training penalty when its predictions break vehicle physics. Our D4 uses the same kind of penalty on an autoencoder.

**Gate (step 5).** A planned stop-and-decide point: if the physical relations do not hold on this car, we change plan before building anything else.

---

## 7. Data files and tools

**Parquet file.** A compact table file format. Read with `pandas.read_parquet`, and load only the columns you need to save memory.

**5 ms grid.** Our data has one row every 5 milliseconds; each column holds the latest value its message sent. So all signals are already lined up in time.

**Python libraries.** `pandas` (tables), `numpy` (number arrays), `pyarrow` (reads parquet), `scipy` (maths and fitting), `scikit-learn` (AUROC and simple ML tools), `matplotlib` (plots), `torch` / PyTorch (neural networks). All are already installed.

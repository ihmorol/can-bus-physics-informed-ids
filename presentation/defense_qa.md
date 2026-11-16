# Defence Q&A (questions the teacher may ask)

Short, honest answers in plain words. Two rules for every answer:
- **Never claim a result.** No detector has been built yet. We have only downloaded the data and checked that the signals we need are there.
- **If you don't know, say so** ("We have not checked that yet; it is part of step X").

Numbers in brackets are the references on slide 7. For deeper detail, see [defense_and_methodology.md](defense_and_methodology.md).

## 1. Why does this matter?

**Q: Are these attacks really dangerous?**
A: Yes. Researchers have taken control of real cars through the CAN bus [11][12]; the 2015 Jeep attack led to a recall of about 1.4 million vehicles. Wheel speed feeds the braking and stability systems. We make no claims about crashes; we only study detection.

**Q: How does the attacker get onto the bus?**
A: We assume it is already there, for example through a hacked connected device or diagnostic tool [7]. How it gets in is outside our scope; we study what happens after.

**Q: Why not just add encryption or authentication to CAN?**
A: That would be the long-term fix, but millions of cars on the road today have none, and adding it needs new hardware. A detector can protect existing cars.

## 2. Is it new?

**Q: SAID and CADD already use physics. What is new?**
A: They use fixed engineering rules and are not compared with learned detectors. Learned detectors use no physics. We put both on the same data, with the same false-alarm limit, and measure what physics adds.

**Q: Hasn't someone already done "PINN for CAN"?**
A: One paper uses that phrase [10]. We have read only its summary, and it does not make our comparison. That is why we call ours a *candidate* gap; the literature review will confirm it. If someone has already done it, our work becomes a replication on public data, which is still valid.

**Q: Is this a real PINN?**
A: Not in the strict sense. A strict PINN solves a physics equation. We give known physical relations to a detector, which is physics-informed learning in a looser sense.

## 3. Can the attacker beat physics?

**Q: Can't the attacker just send values that still obey physics?**
A: Only by faking several units at the same time, because the related signals come from different units (wheels, engine, gearbox, dashboard). That is a much stronger and harder attack. We test exactly this case, the "physics-consistent" attack, and we will report honestly if physics misses it.

**Q: What if the attacker knows how your detector works?**
A: That is outside our threat model. The physics-consistent attack is the closest case we test.

**Q: Which attacks can physics never catch?**
A: Changes to signals that have no physical partner (for example engine temperature), physics-consistent changes, and attacks at very low speed, where we switch the physics checks off. Finding these is research question 4.

## 4. How does it actually work?

**Q: What exactly does the physics check compute?**
A: For each relation, the gap between what physics predicts and what the car reports. For example: average wheel speed vs. the speed the gearbox reports. In normal driving the gap is small. If it becomes much bigger than usual, the detector raises an alarm.

**Q: Where do the physics constants come from?**
A: The form of each relation is known physics. The exact numbers for this car (scale and offset) are fitted on normal training drives only.

**Q: What if the physics does not hold, for example on slopes, during wheel slip or gear changes?**
A: We test every relation on normal driving first and drop the ones that don't hold well enough. We also ignore very low speeds, where the relations mean nothing.

**Q: Why an autoencoder and not something bigger, like an LSTM?**
A: It is the simplest model of the same type that X-CANIDS and CANShield use, and the easiest to get right. Bigger models are an optional extension.

## 5. Is the test fair?

**Q: How do you keep the comparison fair?**
A: All four detectors use the same signals, the same time windows and the same false-alarm limit. They learn only from normal driving, the alarm level is fixed before testing, and testing uses drives they have never seen.

**Q: Doesn't D3 win just because it gets more inputs?**
A: We check that D2, D3 and D4 have almost the same size, and report it if they don't.

**Q: How will you know if a difference is real and not luck?**
A: We train each detector several times with different random starts. A difference counts only if it is bigger than the spread between runs.

## 6. Data and attacks

**Q: Your attacks are not real attacks.**
A: Correct. They are edits to recorded normal driving, the same approach as X-CANIDS and the digital-twin paper [1][3]. The car does not react to them, so we make no safety claims.

**Q: The dataset has its own attacks. Why not use them?**
A: We do, as a side check. But in them the wheel speeds jump between 0 and about 512 km/h, so any detector catches them; they cannot show the difference between detectors. That is why our own, subtler edits are the main test.

**Q: Only one car. Will it work on other cars?**
A: We don't claim it will. The method (fit the constants for each car) can be repeated on other cars, but our results are for this car only.

**Q: Is the "~40% false alarms" figure fair to use?**
A: It is from one recent detector [3] on its own data, and the slide says so. It shows why false alarms matter. We do not claim to beat it.

## 7. Outcome and practical questions

**Q: What if physics doesn't help?**
A: We report that. It is still useful: it tells builders not to spend effort on it, and research questions 3 and 4 still give results.

**Q: Will it run in a real car, in real time?**
A: Not in this project. It is offline analysis on a laptop.

**Q: What does the project cost?**
A: Nothing. Public data, free software, an ordinary computer.

**Q: Can you share the data?**
A: The dataset is free to download after creating an account. We cite it and share only our code and instructions, not the data itself.

## 8. Weak points to admit if asked
- The gap is based on the papers read so far, not a full review.
- One car, and the attacks are edits to recordings.
- Some speed signals from other units may be calculated from the wheel speeds; we still need to check this.
- The physics checks are switched off below walking speed.

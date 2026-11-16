# Presentation speech (5 minutes, 3 members)

A formal script for the proposal presentation. It follows the standard structure for a research talk:
- **Whole talk:** state the plan at the start, deliver it, and summarise at the end.
- **Each slide:** open with one headline sentence, give the supporting points, and close with a hand-over to the next slide or speaker.

Speak clearly at a steady pace of about 140 words per minute. Total time is about 5 minutes. Rehearse until it sounds natural; do not read it word for word.

| Member | Slides | Time |
|---|---|---|
| Member 1 | 1, 2 | about 1 min 40 s |
| Member 2 | 3, 4, 5 | about 2 min 25 s |
| Member 3 | 6, 7, 8 | about 1 min 00 s |

---

## Member 1: slides 1 and 2

**Slide 1: Title** (about 40 s)

> Good morning, respected faculty members. We are Group [No.], and we present our research proposal: Physics-Informed Intrusion Detection for Vehicle CAN Bus Networks.
> Inside a modern vehicle, the engine, brake and steering units communicate over a shared network, the CAN bus, which cannot verify who sent a message.
> Our proposal asks one question: can the physical laws of a vehicle's motion help detect an attacker who injects false data into this network? We will cover the problem, our idea, the research gap, our method and our research questions.

**Slide 2: Problem** (about 60 s)

> We assume an attacker who has already gained access to the bus, for example through a compromised connected device. The attacker silences one control unit, such as the unit that reports wheel speed, and transmits its messages in its place.
> In the chart, the blue line is the true wheel speed; the red line is the falsified value. Because every message still arrives on time, detectors that monitor only message timing observe nothing abnormal.
> This threat is real. Researchers have demonstrated control of production vehicles through this network, and wheel speed directly informs braking and stability control.
> Value-based detectors exist, but the closest recent work reports up to forty percent false alarms, which is impractical.
> The problem, therefore, is to detect falsified values while keeping false alarms low. My colleague will now present our proposed approach.

---

## Member 2: slides 3, 4 and 5

**Slide 3: Our idea** (about 50 s)

> Thank you. Our approach rests on one observation: a vehicle's signals are physically linked. The four wheel speeds must agree with the vehicle's speed, a change in speed must agree with the measured acceleration, and a turn produces a difference between the left and right wheel speeds.
> These signals come from different control units. A value falsified in one unit therefore becomes inconsistent with the others. To stay hidden, an attacker must compromise several units at once, a harder attack that we also evaluate.
> For example, we compare the average wheel speed with the speed reported by the gearbox, and raise an alarm when the difference exceeds what normal driving produces.

**Slide 4: Research gap and contribution** (about 45 s)

> The next question is whether this idea is new. Existing detectors fall into two groups. Learned detectors, such as X-CANIDS, model normal behaviour from data but use no physical knowledge. Physics-based detectors, such as SAID and CADD, apply fixed engineering rules.
> In the studies we have reviewed, no work compares these approaches on the same data under the same false-alarm limit. This gap is the focus of our study; our literature review will confirm it.
> Our contribution is threefold: a controlled comparison on identical data, a side-by-side evaluation of two ways to integrate physics, and an explicit test of the attacks that physics cannot detect.

**Slide 5: Methodology** (about 50 s)

> Our methodology has five stages, shown at the top: real-vehicle driving data, learning normal behaviour, adding physics checks, injecting attacks, and comparing detectors.
> We will build four detectors. D1 relies on physics alone. D2 learns from data alone and serves as our baseline. D3 adds physics-consistency scores to D2 as extra inputs. D4 trains D2 with a penalty for physically inconsistent output.
> For a fair evaluation, every detector is trained only on normal driving, its alarm threshold is fixed before testing, and it is tested on recordings it has never seen. The attacks include freezing, gradual drift, constant offset, replay, whole-message modification, and a physics-consistent attack.
> My colleague will now present our research questions and expected contribution.

---

## Member 3: slides 6, 7 and 8

**Slide 6: Research questions and expected contribution** (about 40 s)

> Thank you. Our study is guided by four research questions. First, and most important: does physics improve detection without increasing false alarms? Second, which method of integrating physics is more effective? Third, are physics checks alone sufficient? Fourth, which attacks remain invisible to physics?
> We do not predict the outcome; even a negative result would be valuable to designers of vehicle intrusion detection systems.
> Our scope is deliberately limited: one public dataset from a single vehicle, with attacks injected into recordings rather than performed on a moving car.

**Slide 7: References** (about 5 s; do not read the list)

> The references supporting this proposal are listed here.

**Slide 8: Thank you** (about 15 s)

> To summarise: a vehicle's physics may reveal falsified data that timing-based checks miss, and our study will test this claim fairly and rigorously. Thank you for your attention. We welcome your questions and feedback.

---

## Three messages the audience should remember
1. The CAN bus trusts every message, so falsified values sent at normal timing are hard to detect.
2. Physical laws link a vehicle's signals, so a single falsified value becomes inconsistent with the others.
3. Our contribution is a fair comparison of learning, physics, and both combined, including the attacks physics cannot detect.

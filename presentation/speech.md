# Presentation speech (5 minutes, 3 members)

Read this aloud a few times; don't memorise it word for word. Times assume a calm pace of about 130 words per minute. Total: about 4 min 50 s.

| Member | Slides | Time |
|---|---|---|
| Member 1 | 1, 2 | about 1 min 25 s |
| Member 2 | 3, 4, 5 | about 2 min 20 s |
| Member 3 | 6, 7, 8 | about 1 min 05 s |

---

## Member 1: slides 1 and 2

**Slide 1: Title** (about 20 s)

> Good morning. We are Group [No.]. Our project is physics-informed intrusion detection for the vehicle CAN bus.
> Inside a modern car, the engine, brakes, gearbox and steering units all talk over one shared network called the CAN bus. This network has one big weakness: it cannot check who sent a message. So our question is simple: can the car's own physics help us catch an attacker who sends false values on it?

**Slide 2: The problem** (about 65 s)

> Here is the attack we care about. Our threat model is this: the attacker is already on the bus, for example through a hacked connected device. It silences one unit, say the one that reports wheel speed, and sends that unit's messages itself.
> In the chart, the blue line is the real wheel speed. The red line is what the attacker sends: a frozen value. The message still arrives exactly on time, so detectors that only watch message timing see nothing wrong.
> This is not just theory. Researchers have already taken control of real cars through this network. And signals like wheel speed feed the braking and stability systems.
> Detectors that read the values do exist, but the closest recent one reports up to about 40 percent false alarms. Nobody can use a detector that cries wolf that often.
> So we need a detector that catches false values without too many false alarms. [Member 2] will explain our idea.

---

## Member 2: slides 3, 4 and 5

**Slide 3: Our idea** (about 45 s)

> Our idea comes from basic vehicle physics. A car's signals are not independent. The four wheel speeds must match the vehicle speed. Speeding up must match the measured acceleration. Turning shows up as a speed difference between the left and right wheels.
> These signals come from different units. So if an attacker changes one of them, it no longer agrees with the others. To hide, the attacker would have to fake several units at the same time, which is much harder, and we test that case too.
> At ground level, the check is simple. For example, compare the average wheel speed with the speed the gearbox reports. If the gap is much bigger than in normal driving, raise an alarm.

**Slide 4: Gap and what is new** (about 45 s)

> Is this new? Existing work falls into two groups. Learned detectors, like X-CANIDS, learn normal behaviour from data but use no physics. Physics detectors, like SAID and CADD, check vehicle movement with fixed, hand-made rules.
> In the work we have read, nobody has put both on the same data and asked fairly: what does physics actually add? That empty corner is our study. One paper uses physics inside a learned CAN detector, but it does not make this comparison. Our literature review will confirm the gap.
> What is new for us: a controlled comparison on the same data with the same false-alarm limit, two ways of adding physics tested side by side, and an honest test of the attacks physics cannot catch.

**Slide 5: How we will do it** (about 50 s)

> We use public driving recordings from a real car. The plan is shown on top: learn what normal driving looks like, add the physics checks, insert attacks into the recordings, and compare the detectors.
> We build four detectors. D1 uses physics only. D2 learns from data only; it is our baseline. D3 is D2 that is also told how well the physics holds. D4 is D2 trained to respect the physics.
> To keep the test fair, every detector learns only from normal driving, its alarm level is fixed before testing, and it is tested on drives it has never seen. The attacks are freezing, slow drift, offset, replay, changing a whole message, and one attack that keeps the physics consistent. [Member 3] will tell you what we expect to learn.

---

## Member 3: slides 6, 7 and 8

**Slide 6: Research questions and contribution** (about 50 s)

> This gives us four questions. First, the main one: does physics help catch more attacks without more false alarms? Second, which way of adding physics works better? Third, are the physics checks alone already enough? Fourth, which attacks can physics never see?
> We do not guess the answer. Even "physics does not help" is a useful result for anyone building intrusion detection for cars.
> We are also clear about our limits. We use one public dataset from one real car, and the attacks are inserted into recordings, not run on a moving car. We need no hardware and no budget.

**Slide 7: References** (about 3 s; don't read it)

> Our references are listed here.

**Slide 8: Thank you** (about 12 s)

> To sum up: a car's physics may expose false values that timing checks miss, and we will test, fairly, whether it really helps. Thank you. We are happy to take your questions.

---

## Key messages the panel must remember
1. The CAN bus trusts every message, so false values with normal timing are hard to catch.
2. Physics links the signals, so a single false value stands out.
3. Our contribution is a fair comparison of learning, physics, and both together, including the attacks physics cannot catch.

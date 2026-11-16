# Terms explained (everything on the slides, in plain words)

Short explanations of every technical word in the slides. For the full project glossary, see [../glossary.md](../glossary.md).

## The car and its network
- **CAN bus (Controller Area Network):** the shared wire network inside a car. Every control unit sends short messages on it, and every unit can hear all of them.
- **Control unit (ECU):** a small computer that runs one part of the car, such as the engine, gearbox, brakes or steering.
- **Message / message ID:** one short packet on the CAN bus. Its ID number says what kind of data it carries, for example "wheel speeds".
- **Signal:** one physical value packed inside a message, for example the front-left wheel speed in km/h.
- **Sender authentication:** a way to prove who sent a message. The CAN bus has none, so any unit, or an attacker, can send any message.
- **Message timing:** how often a message arrives, for example every 20 milliseconds. Many detectors only watch this.
- **ABS / ESC:** the anti-lock braking system and electronic stability control. This unit measures and sends the wheel speeds.
- **Dashboard (cluster):** the instrument panel. It also sends a speed value.

## Physics terms
- **Wheel speed:** how fast each of the four wheels turns. When driving straight without slipping, all four match the car's speed.
- **Acceleration:** how quickly speed changes. A sensor measures it directly, so it can be checked against the change in wheel speed.
- **Turning rate (yaw rate):** how fast the car turns left or right. When turning, the outer wheels run faster than the inner ones.
- **Sideways acceleration (lateral acceleration):** the sideways push you feel in a turn. It equals speed × turning rate.
- **Engine speed and gear:** in a fixed gear, engine speed ÷ road speed stays constant (the gear ratio).
- **Physical relation:** a rule from physics that links two or more signals, for example "the wheel speeds must match the vehicle speed".
- **Residual:** how far real data is from what a relation predicts. Normal driving gives a small residual; a falsified value gives a large one.

## Attacks
- **Attacker / threat model:** our assumption about what the attacker can do. Ours: it is already on the bus (for example through a hacked connected device), silences one unit, and sends that unit's messages at normal timing.
- **Masquerade attack:** silencing a real unit and sending false messages in its place.
- **Falsified / tampered value:** a signal value changed by the attacker.
- **Freeze:** the value is held at one number while the real value keeps changing.
- **Slow drift:** the value is pushed slowly away from the truth.
- **Offset:** a fixed amount is added to the value.
- **Replay:** old, real values are sent again at the wrong time.
- **Whole message:** every signal in one message is changed, for example all four wheel speeds at once.
- **Physics-consistent attack:** several related signals are changed together so that they still agree with each other. It is the hardest case for physics checks, and we test it on purpose.

## Detection and machine learning
- **Intrusion detection system (IDS):** software that watches the network and raises an alarm when it suspects an attack.
- **False alarm (false positive):** an alarm when there is no attack. Too many make a detector useless.
- **Detection rate:** the share of attacks that the detector catches.
- **Alarm level (threshold):** the score above which the detector raises an alarm. We fix it on normal driving before testing.
- **Learned detector:** a detector that learns what "normal" looks like from data, instead of following hand-written rules.
- **Fixed-rule detector:** a detector built on rules and equations written by engineers.
- **Autoencoder:** a small neural network that learns to copy normal data through a narrow middle layer. It copies normal data well and unusual data badly, and that copying error becomes the alarm score.
- **Baseline:** the simple reference method that the others are compared against. Ours is D2 (data only).
- **Physics-informed:** a learned model that is also given known physics, instead of learning everything from data.
- **PINN (physics-informed neural network):** strictly, a neural network trained to solve a physics equation. We are *not* a strict PINN. Only D4 adds physics to training, which is physics-informed learning in a looser sense.
- **D1 / D2 / D3 / D4:** our four detectors. D1 uses physics only. D2 uses data only. D3 is D2 that also receives the physics residuals as input. D4 is D2 trained with an extra penalty when its output breaks physics.
- **Training / unseen drives:** the detectors learn from some recordings and are tested on other recordings they never saw. This keeps the test honest.
- **Controlled comparison:** everything is kept the same (data, inputs, alarm budget) except the one thing we test: how physics is used.

## Research terms
- **Research question (RQ):** the exact question the project answers.
- **Gap:** something that existing research has not done yet.
- **Candidate gap:** a gap we believe exists based on the papers read so far. The literature review must confirm it.
- **Literature review:** a structured reading of the related research (Stage 2 of the course).
- **Preprint:** a paper made public before peer review (for example on arXiv).
- **Scope / limits:** what the project covers and what it does not claim.

## Names on the slides
- **X-CANIDS [1]:** a learned detector and the public dataset we use: real driving recordings from a Hyundai Sonata.
- **DBC file [2]:** the "decoder" that says where each signal sits inside each CAN message.
- **Digital twin IDS [3]:** a recent learned detector that predicts engine and gearbox signals. It is the source of the "up to ~40% false alarms" figure.
- **CANShield [4]:** a learned detector that uses neural networks on signal data.
- **SAID [7] and CADD [8]:** detectors that check vehicle physics with engineering models and fixed rules.
- **ATHENA [9]:** a detector that mines rules from message bits, not from physics.
- **[10]:** a journal paper that uses the phrase "PINN for CAN". We know only its summary.
- **[11] and [12]:** famous real attacks. Researchers controlled a car's brakes and engine through CAN (2010), and a Jeep was hacked remotely (2015).

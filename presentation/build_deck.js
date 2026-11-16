// Builds the 8-slide proposal pitch (story-first, few numbers). Run: node build2.js <outdir>
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const { FaUnlockAlt, FaClock, FaBell } = require("react-icons/fa");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const OUT = path.join(process.argv[2] || ".", "CAN_IDS_proposal_pitch_v4.pptx");
const THEME = {
  name: "CAN Physics", headFontFace: "Cambria", bodyFontFace: "Calibri",
  colors: { dk1: "1B1F2A", lt1: "FFFFFF", dk2: "4A5568", lt2: "EEF1F5", accent1: "1B998B", accent2: "D1495B",
    accent3: "E09F3E", accent4: "3D5A80", accent5: "8A94A6", accent6: "2E3A4F", hlink: "3D5A80", folHlink: "6B7280" },
};
const H = THEME.colors;
async function icon(Comp, hex) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size: 256 }));
  return "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Physics-Informed Intrusion Detection for Vehicle CAN Bus";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  pres.defineSlideMaster({ title: "DARK_TITLE", background: { color: C.text1 }, objects: [] });
  pres.defineSlideMaster({
    title: "CONTENT", background: { color: C.background1 }, margin: [0.3, 0.5, 0.4, 0.5],
    objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.25, w: 9, h: 0.8, fontSize: 26, bold: true, color: C.text1, margin: 0, align: "left", valign: "middle" }, text: "" } }],
  });

  const T = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontSize: 14, color: C.text1, ...o });
  const card = (s, x, y, w, h, fill, name) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { type: "none" }, objectName: name });
  const pill = (s, shape, x, y, w, h, fill, runs, o = {}) => {
    s.addShape(shape, { x, y, w, h, fill: { color: fill }, line: { type: "none" }, ...(shape === pres.shapes.ROUNDED_RECTANGLE ? { rectRadius: 0.06 } : {}) });
    const pad = o.pad ?? 0.12;
    s.addText(runs, { isTextBox: true, x: x + pad, y, w: w - 2 * pad, h, margin: 0, valign: "middle", fontSize: 13, color: C.text1, ...o.text });
  };
  const badge = (s, x, y, d, fill, label, fs = 12) =>
    s.addText(label, { shape: pres.shapes.OVAL, x, y, w: d, h: d, fill: { color: fill }, color: C.background1, bold: true, fontSize: fs, align: "center", valign: "middle", margin: 0 });
  const drawBus = (s) => {
    const busY = 2.75, bx = [6.05, 7.25, 8.45], bw = 1.0, bh = 0.5;
    s.addShape(pres.shapes.LINE, { x: 5.9, y: busY, w: 3.7, h: 0, line: { color: C.accent1, width: 3 } });
    ["Engine", "Gearbox", "Steering"].forEach((n, i) => {
      s.addShape(pres.shapes.LINE, { x: bx[i] + bw / 2, y: 2.35, w: 0, h: busY - 2.35, line: { color: C.accent1, width: 1.5 } });
      s.addText(n, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x: bx[i], y: 1.85, w: bw, h: bh, fill: { color: C.accent6 }, color: C.background1, fontSize: 11, align: "center", valign: "middle", margin: 0 });
    });
    ["ABS / ESC", "Dashboard"].forEach((n, i) => {
      s.addShape(pres.shapes.LINE, { x: bx[i] + bw / 2, y: busY, w: 0, h: 0.4, line: { color: C.accent1, width: 1.5 } });
      s.addText(n, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x: bx[i], y: 3.15, w: bw, h: bh, fill: { color: C.accent6 }, color: C.background1, fontSize: 11, align: "center", valign: "middle", margin: 0 });
    });
    s.addShape(pres.shapes.LINE, { x: bx[2] + bw / 2, y: busY, w: 0, h: 0.4, line: { color: C.accent2, width: 2, dashType: "dash" } });
    s.addText("Attacker", { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x: bx[2], y: 3.15, w: bw, h: bh, fill: { color: C.accent2 }, color: C.background1, bold: true, fontSize: 11, align: "center", valign: "middle", margin: 0 });
    T(s, "CAN bus: no sender authentication", { x: 5.9, y: 3.9, w: 3.7, h: 0.3, fontSize: 11, italic: true, color: C.accent5, align: "center" });
  };

  // 1. Title
  pres.addSection({ title: "Speaker 1" });
  let s = pres.addSlide({ masterName: "DARK_TITLE", sectionTitle: "Speaker 1" });
  T(s, "CSE 4531 COMPUTER SECURITY  ·  THEME T4: ML FOR THREAT DETECTION", { x: 0.6, y: 0.7, w: 8.8, h: 0.3, fontSize: 11, bold: true, color: C.accent3, charSpacing: 1 });
  T(s, "Physics-Informed Intrusion Detection for Vehicle CAN Bus", { x: 0.6, y: 1.15, w: 5.0, h: 1.7, fontFace: THEME.headFontFace, fontSize: 34, bold: true, color: C.background1, valign: "top" });
  T(s, "Can a car's own physics help us catch attackers who tamper with its sensor values?", { x: 0.6, y: 2.95, w: 4.9, h: 0.8, fontSize: 16, color: "C9D1DC", valign: "top" });
  T(s, "GROUP [No.]  ·  SECTION [ ]  ·  UIU, FALL 2026", { x: 0.6, y: 4.25, w: 8.8, h: 0.25, fontSize: 10, bold: true, color: C.accent3, charSpacing: 1 });
  ["[Member 1 name]", "[Member 2 name]", "[Member 3 name]"].forEach((n, i) => {
    T(s, [{ text: n, options: { bold: true, breakLine: true } }, { text: "ID: [student ID]", options: { fontSize: 11, color: C.accent5 } }],
      { x: 0.6 + i * 2.25, y: 4.55, w: 2.1, h: 0.55, fontSize: 13, color: C.background1, valign: "top" });
  });
  T(s, "Instructor: [name]", { x: 7.35, y: 4.55, w: 2.1, h: 0.3, fontSize: 11, color: C.accent5 });
  drawBus(s);
  s.addNotes("SPEAKER 1 (about 20 s). Inside every modern car, the control units for the engine, brakes and steering talk over one shared network called the CAN bus. That network has no way to check who sent a message. Our project asks whether the car's own physics can help us catch an attacker who sends false values on it.");

  // 2. Problem
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Speaker 1" });
  s.addText("An attacker can send false sensor values at completely normal timing", { placeholder: "title" });
  const t = [...Array(31).keys()];
  const truth = t.map((i) => +(42 + 12 * Math.sin(i / 5)).toFixed(1));
  const frozen = truth.map((v, i) => (i < 12 ? v : truth[11]));
  s.addChart(pres.charts.LINE, [
    { name: "Real speed", labels: t.map(String), values: truth },
    { name: "Value the attacker sends", labels: t.map(String), values: frozen },
  ], {
    x: 0.5, y: 1.25, w: 5.3, h: 2.9, objectName: "Illustration chart",
    chartColors: [H.accent4, H.accent2], lineSize: 2.5, lineDataSymbol: "none",
    showTitle: true, title: "Illustration: wheel speed over time", titleFontSize: 12, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "b", legendFontSize: 11, legendFontFace: "+mn-lt", legendColor: H.dk2,
    catAxisHidden: true, valAxisHidden: true, valAxisMinVal: 20, valAxisMaxVal: 60,
    valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  pill(s, pres.shapes.ROUNDED_RECTANGLE, 0.5, 4.3, 5.3, 0.75, C.background2,
    [{ text: "Threat: ", options: { bold: true } }, { text: "an attacker on the bus (e.g. via a hacked connected device) silences one unit and sends its messages on time [1][7]." }],
    { pad: 0.2, text: { fontSize: 13 } });
  const [icU, icC, icB] = await Promise.all([icon(FaUnlockAlt, H.lt1), icon(FaClock, H.lt1), icon(FaBell, H.lt1)]);
  [[icU, "No sender check", "Any unit can send any message. Researchers have hijacked real cars this way [11][12]."],
   [icC, "Timing looks normal", "Detectors that watch message timing cannot see it [3][8]."],
   [icB, "Too many false alarms", "The closest recent value-based detector reports up to ~40% false alarms [3]."]].forEach(([ic, head, sub], i) => {
    const x = 6.2, y = 1.25 + i * 1.3;
    card(s, x, y, 3.3, 1.2, C.background2, "Problem card " + (i + 1));
    badge(s, x + 0.15, y + 0.28, 0.56, i === 2 ? C.accent2 : C.accent6, "");
    s.addImage({ data: ic, x: x + 0.29, y: y + 0.42, w: 0.28, h: 0.28 });
    T(s, head, { x: x + 0.85, y: y + 0.14, w: 2.35, h: 0.3, bold: true, fontSize: 15 });
    T(s, sub, { x: x + 0.85, y: y + 0.44, w: 2.35, h: 0.72, fontSize: 12, color: C.text2, valign: "top" });
  });
  s.addNotes("SPEAKER 1 (about 80 s). Here is the attack we care about. The blue line is a car's real wheel speed. Our threat model: the attacker is already on the bus, for example through a hacked connected device [7]. At some moment, it silences the wheel-speed unit and sends a frozen value instead: the red line. The false message arrives exactly on time, so detectors that watch message timing see nothing [3][8]. Detectors that read the values do exist, but the closest recent one raises false alarms up to about 40% of the time [3], which no driver or manufacturer would accept. And this is not hypothetical: researchers have taken over real cars through this network [11][12], and signals like wheel speed feed the braking and stability systems. So we need a detector that catches false values without crying wolf. Speaker 2 will explain our idea.");

  // 3. Idea
  pres.addSection({ title: "Speaker 2" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Speaker 2" });
  s.addText("Our idea: a car's signals are bound to agree with each other", { placeholder: "title" });
  const cx = 2.75, cy = 3.05;
  const nodes = [["Wheel speeds", 0.5, 1.4, true], ["Acceleration", 3.55, 1.4, false], ["Turning rate", 0.5, 4.0, false], ["Engine speed and gear", 3.55, 4.0, false]];
  nodes.forEach(([n, x, y, bad]) => {
    const nx = x + 0.95, ny = y + 0.3;
    s.addShape(pres.shapes.LINE, { x: Math.min(nx, cx), y: Math.min(ny, cy), w: Math.abs(cx - nx), h: Math.abs(cy - ny), flipH: (nx < cx) !== (ny < cy),
      line: { color: bad ? C.accent2 : C.accent1, width: 2, dashType: bad ? "dash" : "solid" } });
  });
  s.addText("Vehicle speed", { shape: pres.shapes.OVAL, x: cx - 0.8, y: cy - 0.45, w: 1.6, h: 0.9, fill: { color: C.accent1 }, color: C.background1, bold: true, fontSize: 14, align: "center", valign: "middle", margin: 0 });
  nodes.forEach(([n, x, y, bad]) => {
    s.addText(bad ? [{ text: n, options: { breakLine: true } }, { text: "altered by attacker", options: { fontSize: 10, bold: false, italic: true } }] : n, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x, y, w: 1.9, h: 0.6, fill: { color: bad ? C.accent2 : C.accent6 }, color: C.background1, fontSize: 13, bold: true, align: "center", valign: "middle", margin: 0 });
  });
  const ix = 6.0;
  [["Physics links the signals", "Wheel speeds must match the vehicle's speed; turning shows up in the wheels and the sideways pull."],
   ["Attacks break the links", "A falsified value disagrees with other units' signals. To hide, the attacker must fake several units at once; we test that too."],
   ["Use it in the detector", "Example check: alarm when average wheel speed and gearbox speed disagree more than usual."]].forEach(([h, d], i) => {
    const y = [1.2, 2.4, 3.85][i];
    badge(s, ix, y, 0.45, i === 1 ? C.accent2 : C.accent1, String(i + 1), 13);
    T(s, h, { x: ix + 0.6, y: y - 0.02, w: 2.9, h: 0.3, fontSize: 15, bold: true });
    T(s, d, { x: ix + 0.6, y: y + 0.32, w: 2.9, h: 0.88, fontSize: 13, color: C.text2, valign: "top" });
  });
  s.addNotes("SPEAKER 2 (about 50 s). Our idea comes from basic vehicle physics. A car's signals are not independent: the four wheel speeds must match the vehicle speed, speeding up must match the measured acceleration, and turning shows up as a speed difference between the left and right wheels and as a sideways pull. These signals come from different control units. If an attacker changes one of them, it stops agreeing with the others. Could a clever attacker send values that still obey physics? Only by faking several units at the same time, which is a much stronger attacker, and we test exactly that case. At ground level the check is simple: for example, compare the average wheel speed with the speed the gearbox reports, and raise an alarm when the gap is far larger than in normal driving. But is that new?");

  // 4. Gap + novelty
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Speaker 2" });
  s.addText("Detectors use either learning or physics; we found no fair comparison", { placeholder: "title" });
  const gx = 1.0, gy = 1.6, cw = 2.15, ch = 1.35, gap = 0.1;
  T(s, "No physics", { x: gx, y: 1.25, w: cw, h: 0.3, fontSize: 12, bold: true, color: C.text2, align: "center" });
  T(s, "Uses physics", { x: gx + cw + gap, y: 1.25, w: cw, h: 0.3, fontSize: 12, bold: true, color: C.text2, align: "center" });
  T(s, "Learns from data", { x: 0, y: gy + ch / 2 - 0.15, w: 1.35, h: 0.3, fontSize: 12, bold: true, color: C.text2, align: "center", rotate: 270 });
  T(s, "Fixed rules", { x: 0, y: gy + ch + gap + ch / 2 - 0.15, w: 1.35, h: 0.3, fontSize: 12, bold: true, color: C.text2, align: "center", rotate: 270 });
  const cell = (x, y, fill, color, runs) =>
    s.addText(runs, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x, y, w: cw, h: ch, fill: { color: fill }, color, fontSize: 14, align: "center", valign: "middle", margin: 8 });
  cell(gx, gy, C.background2, C.text1, [{ text: "X-CANIDS [1]", options: { breakLine: true } }, { text: "Digital twin [3]", options: { breakLine: true } }, { text: "CANShield [4]" }]);
  cell(gx + cw + gap, gy, C.accent1, C.background1, [{ text: "Our study", options: { bold: true, fontSize: 17, breakLine: true } }, { text: "(a \u201cPINN for CAN\u201d paper also exists [10])", options: { fontSize: 10 } }]);
  cell(gx, gy + ch + gap, "F7F8FA", C.accent5, [{ text: "Bit-pattern rules [9]" }]);
  cell(gx + cw + gap, gy + ch + gap, C.background2, C.text1, [{ text: "SAID [7]", options: { breakLine: true } }, { text: "CADD [8]" }]);
  T(s, "Based on the sources we have read so far; our literature review will confirm it.", { x: 0.5, y: 4.6, w: 5.0, h: 0.4, fontSize: 11, italic: true, color: C.accent5 });
  const nx0 = 5.85;
  T(s, "What is new in our work", { x: nx0, y: 1.25, w: 3.65, h: 0.35, fontSize: 16, bold: true });
  ["A controlled comparison: same data, same false-alarm budget, drives never seen in training",
   "Two ways of adding physics to a learned detector, tested side by side",
   "An honest test of the attacks physics cannot catch"].forEach((txt, i) => {
    const y = 1.75 + i * 0.95;
    card(s, nx0, y, 3.65, 0.8, i === 0 ? "E3F4F2" : C.background2, "Novelty " + (i + 1));
    T(s, txt, { x: nx0 + 0.18, y, w: 3.3, h: 0.8, fontSize: 13, valign: "middle" });
  });
  s.addNotes("SPEAKER 2 (about 50 s). Existing work falls into two groups. Learned detectors such as X-CANIDS learn normal behaviour from data but use no physics [1][3][4]. Physics detectors such as SAID and CADD check vehicle dynamics with fixed rules [7][8]. In the work we have read, nobody has put both on the same data and asked, fairly, what physics adds. One recent paper uses physics inside a learned CAN detector [10], but it does not make this comparison. That corner is our study. We compare the approaches fairly, we test two ways of adding physics, and we openly test the attacks physics cannot catch. Speaker 3 will explain how.");

  // 5. Approach
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Speaker 2" });
  s.addText("How we will carry out the study", { placeholder: "title" });
  ["Real driving data", "Learn normal driving", "Add physics checks", "Insert attacks", "Compare detectors"].forEach((st, i) => {
    pill(s, i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, 0.5 + i * 1.8, 1.2, 1.9, 0.6, i === 3 ? C.accent2 : C.accent6, st,
      { pad: 0.3, text: { fontSize: 12, bold: true, color: C.background1, align: "center" } });
  });
  [["D1", "Physics only", "Raises an alarm when the relations are broken.", C.accent1],
   ["D2", "Data only", "Learns normal driving; alarms on anything unusual. Our baseline.", C.accent4],
   ["D3", "Physics as input", "Like D2, but also told how well the relations hold.", C.accent1],
   ["D4", "Physics in training", "Like D2, but trained to respect the relations.", C.accent1]].forEach(([id, head, desc, col], i) => {
    const x = 0.5 + i * 2.3, y = 2.05, w = 2.1, h = 1.85;
    card(s, x, y, w, h, C.background2, "Detector " + id);
    badge(s, x + 0.15, y + 0.15, 0.5, col, id, 12);
    T(s, head, { x: x + 0.15, y: y + 0.75, w: w - 0.3, h: 0.35, fontSize: 15, bold: true });
    T(s, desc, { x: x + 0.15, y: y + 1.1, w: w - 0.3, h: 0.7, fontSize: 13, color: C.text2, valign: "top" });
  });
  pill(s, pres.shapes.ROUNDED_RECTANGLE, 0.5, 4.05, 9.0, 0.55, "E3F4F2",
    [{ text: "Fair test: ", options: { bold: true } }, { text: "public recordings from a real car [1]; train on normal driving only; set the alarm level first; test on drives never seen before." }],
    { pad: 0.2, text: { fontSize: 13 } });
  T(s, [{ text: "Attacks tested: ", options: { bold: true, color: C.accent2 } }, { text: "freeze, slow drift, offset, replay, whole message, and a physics-consistent attack." }],
    { x: 0.5, y: 4.72, w: 9.0, h: 0.35, fontSize: 13, valign: "middle" });
  s.addNotes("SPEAKER 3 (about 55 s). We use public recordings from a real car [1]. The flow is shown on top: learn what normal driving looks like, add the physics checks, insert attacks into recordings, and compare detectors. We build four detectors. D1 uses physics only. D2 learns from data only and is our baseline. D3 and D4 are D2 with physics added, once as an extra input and once inside training. To keep it fair, every detector is trained only on normal driving, its alarm level is fixed before testing, and it is tested on drives it has never seen. The attacks are edits to recorded values: freezing, drifting, offsetting or replaying a signal, changing a whole message, and one attack that keeps the physics consistent. We have already opened the data and confirmed that every signal we need is there.");

  // 6. Questions and outcome
  pres.addSection({ title: "Speaker 3" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Speaker 3" });
  s.addText("Research questions and expected contribution", { placeholder: "title" });
  T(s, "Research questions", { x: 0.5, y: 1.2, w: 4.4, h: 0.35, fontSize: 16, bold: true });
  ["Does physics help catch more attacks without more false alarms?", "Which way of adding physics works better?", "Are physics checks alone already enough?", "Which attacks can physics never see?"].forEach((q, i) => {
    const y = 1.7 + i * 0.78;
    badge(s, 0.5, y + 0.04, 0.5, i === 0 ? C.accent1 : C.accent6, "RQ" + (i + 1), 11);
    T(s, q, { x: 1.15, y, w: 3.85, h: 0.6, fontSize: 14, valign: "middle" });
  });
  const ox = 5.5, ow = 4.0;
  card(s, ox, 1.2, ow, 2.1, "E3F4F2", "Outcome card");
  T(s, "Expected contribution", { x: ox + 0.25, y: 1.35, w: ow - 0.5, h: 0.35, fontSize: 16, bold: true, color: C.accent1 });
  T(s, [{ text: "Clear evidence on whether physics improves detection of tampered sensor values, on one real car.", options: { breakLine: true } },
        { text: "Either answer is useful, including “physics does not help”.", options: { italic: true, color: C.text2 } }],
    { x: ox + 0.25, y: 1.8, w: ow - 0.5, h: 1.35, fontSize: 14, valign: "top", paraSpaceAfter: 8 });
  card(s, ox, 3.45, ow, 1.55, C.background2, "Scope card");
  T(s, "Scope and limits", { x: ox + 0.25, y: 3.58, w: ow - 0.5, h: 0.3, fontSize: 14, bold: true });
  T(s, "One public dataset from one real car. Attacks are inserted into recordings, not run on a moving car. No hardware, no cost.",
    { x: ox + 0.25, y: 3.92, w: ow - 0.5, h: 1.0, fontSize: 13, color: C.text2, valign: "top" });
  s.addNotes("SPEAKER 3 (about 40 s). This gives four questions. First and most important: does physics help catch more attacks without raising more false alarms? Second, which way of adding physics works better? Third, are physics checks alone already enough? Fourth, which attacks can physics never see? Whatever the answer, it is useful evidence, for one real car, for anyone building intrusion detection for vehicles. Our scope is honest: one public dataset from one real car, with attacks inserted into recordings rather than run on a moving vehicle.");

  // 7. References
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Speaker 3" });
  s.addText("References", { placeholder: "title" });
  [["[1]", "Jeong, Lee, Lee and Kim, “X-CANIDS: Signal-aware explainable intrusion detection system for controller area network-based in-vehicle network,” IEEE Trans. Vehicular Technology, 73(3), 2024. Dataset on IEEE DataPort."],
   ["[2]", "commaai/opendbc, “hyundai_2015_ccan.dbc” (CAN decoding file), GitHub."],
   ["[3]", "Rahman, Salek and Chowdhury, “Digital twin-based intrusion detection for vehicle powertrain CAN bus systems,” arXiv:2608.17093, 2026 (preprint)."],
   ["[4]", "Shahriar et al., “CANShield,” arXiv:2205.01306, 2022."],
   ["[7]", "Xue et al., “SAID: State-aware defense against injection attacks on in-vehicle network,” USENIX Security, 2022."],
   ["[8]", "Chen, Shin and Dadras, “Context-aware anomaly detection using vehicle dynamics” (CADD), RAID, 2024."],
   ["[9]", "Wang et al., \u201cATHENA,\u201d arXiv:2503.17067, 2025."],
   ["[10]", "Homomorphic-encryption IDS with a conservative PINN, Journal Europ\u00e9en des Syst\u00e8mes Automatis\u00e9s, 2026."],
   ["[11]", "Koscher et al., \u201cExperimental security analysis of a modern automobile,\u201d IEEE Symposium on Security and Privacy, 2010."],
   ["[12]", "Miller and Valasek, \u201cRemote exploitation of an unaltered passenger vehicle,\u201d Black Hat USA, 2015."]].forEach(([n, r], i) => {
    const y = 1.15 + [0, 0.52, 0.86, 1.38, 1.72, 2.06, 2.4, 2.74, 3.08, 3.42][i];
    T(s, n, { x: 0.5, y, w: 0.5, h: 0.45, fontSize: 11, bold: true, color: C.accent1, valign: "top" });
    T(s, r, { x: 1.05, y, w: 8.45, h: 0.45, fontSize: 11, valign: "top" });
  });
  T(s, "[1]\u2013[10] are numbered as in the written proposal, which also lists [5] and [6].", { x: 0.5, y: 4.85, w: 9, h: 0.3, fontSize: 10, italic: true, color: C.accent5 });
  s.addNotes("Show briefly; do not read aloud.");

  // 8. Thank you
  s = pres.addSlide({ masterName: "DARK_TITLE", sectionTitle: "Speaker 3" });
  T(s, "Thank you", { x: 0.6, y: 1.5, w: 5.0, h: 0.9, fontFace: THEME.headFontFace, fontSize: 44, bold: true, color: C.background1 });
  T(s, "We welcome your questions and feedback.", { x: 0.6, y: 2.45, w: 5.0, h: 0.4, fontSize: 18, color: C.accent3 });
  T(s, "In short: a car's physics may expose false sensor values that timing checks miss. We will test, fairly, whether it really helps.", { x: 0.6, y: 3.1, w: 4.9, h: 0.9, fontSize: 14, color: "C9D1DC", valign: "top" });
  T(s, "GROUP [No.]  ·  CSE 4531 COMPUTER SECURITY  ·  UIU", { x: 0.6, y: 4.6, w: 8.8, h: 0.25, fontSize: 10, bold: true, color: C.accent5, charSpacing: 1 });
  drawBus(s);
  s.addNotes("SPEAKER 3 (about 10 s). To sum up: a car's physics may expose false values that timing checks miss, and we will test fairly whether it really helps. Thank you; we are happy to take questions.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();

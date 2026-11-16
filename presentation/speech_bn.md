# Presentation speech: বাংলা-English mixed version (৫ মিনিট, ৩ জন member)

এটা [speech.md](speech.md)-এর Bangla-English mixed version, যেভাবে আমরা সাধারণত class presentation-এ কথা বলি। Practice করার জন্য, আর কোন slide-এ কী বলতে হবে সেটা বোঝার জন্য এটা use করো। Presentation পুরোপুরি English-এ হলে original `speech.md` follow করো।

Structure সব slide-এ একই: শুরুতে একটা main point, তারপর supporting কথা, শেষে next speaker-কে hand over। পুরোটা মুখস্থ করার দরকার নেই, flow-টা মাথায় রাখো। মোট সময় প্রায় ৫ মিনিট।

| Member | Slide | সময় |
|---|---|---|
| Member 1 | 1, 2 | প্রায় ১ মিনিট ৪০ সেকেন্ড |
| Member 2 | 3, 4, 5 | প্রায় ২ মিনিট ২৫ সেকেন্ড |
| Member 3 | 6, 7, 8 | প্রায় ১ মিনিট |

---

## Member 1: Slide 1 ও 2

**Slide 1: Title** (প্রায় ৪০ সেকেন্ড)

> Good morning sir. আমরা Group [No.], আর আজকে আমরা আমাদের research proposal present করছি: Physics-Informed Intrusion Detection for Vehicle CAN Bus Networks.
> একটা modern car-এর ভেতরে engine, brake, steering-এর আলাদা আলাদা control unit থাকে। এরা সবাই CAN bus নামের একটা shared network দিয়ে communicate করে। কিন্তু এই network verify করতে পারে না যে কোন message আসলে কে পাঠিয়েছে।
> তাই আমাদের main question হলো: গাড়ির movement-এর physical law ব্যবহার করে কি এমন attacker-কে detect করা যায়, যে এই network-এ false data inject করে? আমরা একে একে problem, আমাদের idea, research gap, method আর research question-গুলো present করব।

**Slide 2: Problem** (প্রায় ৬০ সেকেন্ড)

> আমরা ধরে নিচ্ছি attacker আগে থেকেই bus-এ access পেয়ে গেছে, যেমন একটা compromised connected device-এর মাধ্যমে। এরপর সে একটা control unit-কে silent করে দেয়, ধরুন যে unit wheel speed পাঠায়, আর তার জায়গায় নিজেই সেই message-গুলো পাঠায়।
> Chart-এ blue line-টা হলো real wheel speed, আর red line-টা attacker-এর পাঠানো falsified value। প্রতিটা message ঠিক time-এ পৌঁছায়, তাই যে detector শুধু message timing monitor করে, সে কোনো problem-ই দেখতে পায় না।
> এই threat-টা কিন্তু real। Researcher-রা এই network দিয়ে real car control করে দেখিয়েছেন, আর wheel speed সরাসরি braking আর stability control-এ use হয়।
> Value check করে এমন detector আছে, কিন্তু সবচেয়ে কাছের recent work প্রায় forty percent পর্যন্ত false alarm দেয়, যেটা practically use করা যায় না।
> So, আমাদের problem হলো false alarm কম রেখে falsified value detect করা। এখন আমার teammate আমাদের proposed approach explain করবে।

---

## Member 2: Slide 3, 4 ও 5

**Slide 3: Our idea** (প্রায় ৫০ সেকেন্ড)

> Thank you. আমাদের approach একটা simple observation-এর ওপর based: গাড়ির signal-গুলো physically একটা আরেকটার সাথে linked। চার চাকার speed অবশ্যই vehicle speed-এর সাথে match করবে, speed change হলে সেটা measured acceleration-এর সাথে match করবে, আর turn নিলে left আর right wheel speed-এর মধ্যে difference তৈরি হয়।
> এই signal-গুলো আসে different control unit থেকে। তাই একটা unit-এর value change করলে সেটা বাকিগুলোর সাথে আর consistent থাকে না। ধরা না খেতে হলে attacker-কে একসাথে কয়েকটা unit compromise করতে হবে, যেটা অনেক বেশি কঠিন, আর এই case-টাও আমরা evaluate করব।
> Example হিসেবে: আমরা চার চাকার average speed-কে gearbox-এর report করা speed-এর সাথে compare করি। Difference যদি normal driving-এর চেয়ে অনেক বেশি হয়, তাহলে alarm দিই।

**Slide 4: Research gap ও contribution** (প্রায় ৪৫ সেকেন্ড)

> এখন প্রশ্ন হলো, এই idea কি নতুন? Existing detector-গুলো মূলত দুই ধরনের। X-CANIDS-এর মতো learned detector data থেকে normal behaviour শেখে, কিন্তু কোনো physics use করে না। আর SAID, CADD-এর মতো physics-based detector fixed engineering rule apply করে।
> আমরা যত study review করেছি, তার কোনোটাই এই দুই approach-কে same data আর same false alarm limit-এ compare করেনি। এই gap-টাই আমাদের study-র focus, আর আমাদের literature review এটা confirm করবে।
> আমাদের contribution তিনটা: same data-তে একটা controlled comparison, physics add করার দুইটা way side by side evaluate করা, আর physics কোন attack detect করতে পারে না সেটার একটা clear test।

**Slide 5: Methodology** (প্রায় ৫০ সেকেন্ড)

> আমাদের methodology-র পাঁচটা stage উপরে দেখানো আছে: real vehicle-এর driving data, normal behaviour শেখা, physics check add করা, attack inject করা, আর detector-গুলো compare করা।
> আমরা চারটা detector বানাব। D1 শুধু physics-এর ওপর depend করে। D2 শুধু data থেকে শেখে, এটা আমাদের baseline। D3, D2-এর সাথে physics consistency score extra input হিসেবে add করে। আর D4, D2-কে এমনভাবে train করে যাতে physically inconsistent output দিলে penalty পায়।
> Evaluation fair রাখতে প্রতিটা detector শুধু normal driving-এ train হবে, testing-এর আগেই alarm threshold fix করা থাকবে, আর test হবে এমন recording-এ যেটা detector আগে কখনো দেখেনি। Attack-গুলোর মধ্যে আছে freeze, gradual drift, constant offset, replay, whole message change, আর একটা physics-consistent attack।
> এখন আমার teammate আমাদের research question আর expected contribution present করবে।

---

## Member 3: Slide 6, 7 ও 8

**Slide 6: Research questions ও expected contribution** (প্রায় ৪০ সেকেন্ড)

> Thank you. আমাদের study চারটা research question follow করে। First, আর সবচেয়ে important: false alarm না বাড়িয়ে physics কি detection improve করে? Second, physics add করার কোন method-টা বেশি effective? Third, শুধু physics check দিয়েই কি যথেষ্ট? আর fourth, কোন attack-গুলো physics দিয়ে কখনোই detect করা যায় না?
> Result কী হবে সেটা আমরা আগে থেকে predict করছি না; negative result আসলেও সেটা vehicle intrusion detection system যারা design করেন তাদের জন্য valuable।
> আমাদের scope-টা আমরা ইচ্ছা করেই limited রেখেছি: একটা vehicle-এর একটা public dataset, আর attack-গুলো moving car-এ না, recording-এর ভেতরে inject করা হবে।

**Slide 7: References** (প্রায় ৫ সেকেন্ড, list পড়ার দরকার নেই)

> এই proposal-এর reference-গুলো এখানে দেওয়া আছে।

**Slide 8: Thank you** (প্রায় ১৫ সেকেন্ড)

> সংক্ষেপে বললে: গাড়ির physics এমন falsified data ধরতে পারে, যেটা timing-based check miss করে, আর আমাদের study এই claim-টা fair আর rigorous ভাবে test করবে। Thank you for your attention. আপনাদের যেকোনো question বা feedback আমরা welcome করছি।

---

## যে তিনটা main message audience-এর মনে থাকা উচিত
১. CAN bus সব message-কে trust করে, তাই normal timing-এ পাঠানো falsified value detect করা কঠিন।
২. Physical law গাড়ির signal-গুলোকে একসাথে link করে রাখে, তাই একটা falsified value বাকিগুলোর সাথে mismatch করে।
৩. আমাদের contribution হলো learning, physics আর দুটোর combination-এর একটা fair comparison, যার মধ্যে physics যে attack ধরতে পারে না সেগুলোর test-ও আছে।

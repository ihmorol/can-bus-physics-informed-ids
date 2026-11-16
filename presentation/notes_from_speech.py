"""Copy each slide's speech from speech.md into the deck's speaker notes. Usage: python notes_from_speech.py speech.md deck.pptx"""
import re, sys
from pptx import Presentation

speech, deck = sys.argv[1], sys.argv[2]
text = open(speech, encoding="utf-8").read()
member = {1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3}
notes = {}
for m in re.finditer(r"\*\*Slide (\d): [^*]+\*\* \(([^)]+)\)\n\n((?:> .*\n?)+)", text):
    n = int(m.group(1))
    body = " ".join(l[2:].strip() for l in m.group(3).splitlines())
    notes[n] = f"MEMBER {member[n]} ({m.group(2)}). {body}"

prs = Presentation(deck)
assert len(prs.slides) == 8 and sorted(notes) == list(range(1, 9)), sorted(notes)
for i, slide in enumerate(prs.slides, 1):
    slide.notes_slide.notes_text_frame.text = notes[i]
prs.save(deck)
print("notes set for", len(notes), "slides")

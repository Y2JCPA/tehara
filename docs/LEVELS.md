# Tehara: Level Designs (draft for review)

This is the level plan we fill out **before building anything**. It has three parts:

- **Part A**: shared rules every level follows.
- **Part B**: full designs for **version 1**: World 1 *The Road to Pesach* (10 levels) and the *Chanukah* pack (6 levels).
- **Part C**: an idea bank of about 40 more levels for the later worlds, in short form. Each one gets a full design when its world is next.

Every rule below traces to a source that was read on Sefaria (Rambam's Sefer Taharah first). Sources marked **[to verify]** are from the commentaries or from memory and must be checked before that level ships. The research files in `docs/research/` have the full quotes.

---

# Part A: shared rules

## A1. The hero
**Eli** (אלי), a young Kohen (כהן), about bar-mitzvah age, from a village in the Galil. In World 1 he travels up to Yerushalayim to bring the Korban Pesach (קרבן פסח) with his family. Bright red-brown hair, a white linen tunic and a white linen cap, like a Kohen. (The real priestly garments [בגדי כהונה] are worn only in the Mikdash, on the day of service and never with the avnet outside the Avodah (Rambam, Klei HaMikdash 8:11-12; Yoma 69a), so on the road he wears everyday white clothes in the same style.) He walks by himself when the path is clear, and stops and waits when it isn't.

Supporting cast:
- **Gardener Gad** (גד הגנן), a Yisrael with a big straw hat and a leaf blower.
- **Grandpa Zevulun** (סבא זבולון), a village elder who knows where the old graves are.
- **Miriam** (מרים), Eli's older sister, who carries the family's terumah (תרומה) basket.
- **Batya** (בתיה), a Beit Din (בית דין) messenger with a bucket of lime.

## A2. Language
- **English version:** Hebrew terms in square brackets the first time they appear on a screen, e.g. *"Eli is a Kohen [כהן]. He may not become impure [טמא] from a dead body [מת]."* Later on the same screen, the Hebrew-letter word alone is fine once kids know it.
- **Hebrew version:** the same text in plain Hebrew.
- Source lines on the Why? card are always in the original Hebrew, with an English translation in the English version.

## A3. How tumah looks (from the design plan)
- **Tahor:** normal colors.
- **Av HaTumah [אב הטומאה]:** purple glow with an "Av" badge.
- **Rishon / Sheni / Shlishi [ראשון / שני / שלישי]:** a softer glow with a 1 / 2 / 3 badge.
- **Ohel [אהל]:** everything under one roof with a met gets a light purple tint.
- **Cartoon skeletons and bones:** friendly, round, never scary. A grave is a stone mound or a rock-cut tomb with a rolling stone (the Second Temple style). A whole met is always a grave or a cave, never a body lying out.
- **Hidden until you fail:** impure zones (ohel shading, glowing bones) are not shown in advance. They appear after a fail or a hint, so the player has to read the scene.

## A4. Win, fail, stars
- **Win:** Eli reaches the goal tahor. He waves and confetti falls.
- **Fail:** Eli glows purple and the scene **rewinds one second** with a soft "whoosh". No screaming, no "you died". A one-line hint explains *which rule* was broken (e.g. "A barley-sized bone [עצם כשעורה] makes you tamei if you move it!").
- **Stars:** ★ for finishing with a hint, ★★ for finishing without a hint, ★★★ for no hint and no mistakes. Where a level has a "clever" solution (like knocking the mouse away in 1-2), ★★★ also needs that solution. It is never just "faster". It always uses a deeper rule.
- **Becoming tamei is not always failure.** In some levels Eli *may* become tamei (e.g. from a sheretz) and the level is still won. The game says so clearly: tumah is a status, not a sin.

## A5. Design guard-rails for every level
1. **Four amot (ארבע אמות):** a Kohen may not come within 4 amot of a met (Rambam Avel 3:13). Paths always pass at a visible distance from any grave or cave with a met.
2. **Only plowed-grave fields** are crossed by blowing. Lost-grave fields are never crossed at all.
3. **No terumah is eaten** after a blowing-crossing in the same story stretch (אין בודקין לתרומה, Oholot 18:4).
4. **Left out:** zav, niddah and similar topics, gentile graves, anything gory.

---

# Part B: version 1 levels (v1.1: harder, with decoys)

Every level now has **decoys**: things that look dangerous but are fine, and things that look safe but aren't. Each decoy is a real halacha with a source, and the Why? card explains it afterwards. Impure zones are **not shown** until the player fails there (or asks for a hint), so the player has to reason from the scene.

The code for each level is in `js/levels/w1/` and `js/levels/ch/`, and the full Why? card text and sources are in each level file. The browser test (`tests/e2e/levels.e2e.js`) plays every solution and every trap.

## World 1: The Road to Pesach (הדרך לפסח)

It's Nisan. Eli's family travels from the Galil to bring the Korban Pesach in Yerushalayim.

### 1-1 · Three Ways Down (שלוש דרכים למטה)
- **Scene:** a cut-away cliff. Three ways down to the road: carved stone **stairs**, a **ladder** in a shaft, and a **drawbridge** over a ravine.
- **Traps:**
  - The stairs climb up and over a rock-cut **tomb** with a rolling stone. Walking on a grave's roof is like touching the grave (Rambam Tumat Met 2:15).
  - The ladder ends **inside a burial cave** with an open niche: under one roof with a met (1:10).
- **Puzzle:** the bridge has two pins. Pull the boulder pin first, then the bridge. If the bridge comes down first, the boulder smashes it.

### 1-2 · The Barn (האורווה)
- **Room 1, decoys:**
  - A **covered bridge** with a **dead fox** inside looks scary, but it's safe. Only a met spreads tumah under a roof; a nevelah only by touch and carrying (Rambam She'ar Avot 1:1; Tumat Met 1:10).
  - The low beam has a **dead mouse**. Touching it is allowed for a Kohen (Tumat Okhalin 16:9). A pin drops a stick that knocks the mouse off: no tumah, since a sheretz isn't carried-tumah (She'ar Avot 4:2).
- **★★★:** Eli arrives pure, by either clever route.
- **Room 2 (if Eli touched the mouse):**
  - Two pools. The fancy one is filled by a servant with buckets. **Drawn water** is invalid by Rabbinic law (Mikvaot 4:2); the plain pool fed by the rain gutter is kosher.
  - Then drag the sun until **three** stars. At two stars Miriam calls "Dinner's ready!", which is a trap (Terumot 7:2).

### 1-3 · The Bone Bridge (גשר העצם)
- **Three ways across:**
  - A **seesaw** with a bone on its far end. Stepping on it lifts the bone, which counts as carrying (Tumat Met 1:7).
  - A high **log**, right over the bone. Safe: a single bone has no ohel (2:10). It needs two pins in order: the stopper, then the rope. Otherwise the log slides off.
  - A low **rope bridge** with no bones in sight. A trap: the rock overhang above it also covers a tomb in the cliff (13:2, 1:10).

### 1-4 · The Gardener's Tree (העץ של הגנן)
- **Room 1:** three pins (board, barrel, door) and only one working order.
- **Room 2:** a tree by a grave, and Gad can make only **two cuts**. The parts that matter:
  - **Thick branch over the road:** brings tumah, Torah law.
  - **Thin twigs over the road:** still bring tumah, Rabbinic law (13:2). Cutting only the thick branch fails.
  - **Rope (clothesline) to a pole across the road:** narrower than a tefach, so not an ohel (12:1). Cutting it wastes a cut.
  - **"Gad holds a board over Eli" button:** a trap. People and vessels bring tumah but don't block it (Oholot 6:1).
- **★★★:** cut the one branch over the **grave**. Then nothing covers both the grave and the road.

### 1-5 · Stones That Don't Wobble (אבנים שאינן מתנדנדות)
- **Setup:** Miriam carries terumah across a Beit HaPeras.
- **Stones:** 19 of them and only **4 tests**. The clue: wobbly stones sit on little pebbles. There is one solid path.
- **Animals:**
  - The **big handsome donkey** drops dung while ridden, so it counts as weak (Tumat Met 10:11).
  - The **mule's** knees knock: also weak.
  - The **small donkey** is steady: strong.
- **Blow button:** a trap. "Ein bodkin l'terumah", you don't rely on that check for terumah (Oholot 18:4).

### 1-6 · The Leaf-Blower Field ⭐ (שדה המפוח)
- **Room 1:** crate, then hay, then cart, for a soft landing.
- **Room 2:** a 6×9 field with exactly enough air plus one.
  - **White twigs** look like bones but are safe to step on. **Bones** have knobs at both ends.
  - Stepping on an unchecked square fails.
- **Sources:** Berakhot 19b; Rambam Eruvin 6:17; Korban Pesach 6:8.

### 1-7 · The Washed-Away Mark (הציון שנמחק)
- **Mark these three:** the lost grave, the branches, the jutting stone. Each ring a little wider than the tumah, not much wider.
- **Don't mark these two:**
  - The **village cemetery**, because everyone knows it.
  - An exact **k'zayit**, because it will shrink in the ground.
- **Source:** Rambam Tumat Met 8:9.

### 1-8 · Read the White Marks (קרא את הסימנים)
Six fields. Tap the squares **and the edges** that are impure (Tumat Met 8:11).
- **A:** one marked stone. The tumah is under it.
- **B:** lime between two stones. The tumah is between them.
- **C vs F:** both have lime on top of two stones and look almost the same.
  - **C** has broken pottery between them: it's just a building, so it's pure.
  - **F** has no pottery: it's a marker, so between them is impure.
- **D:** four edges marked. The whole inside is impure and the edges are pure.
- **E:** one edge marked. Only that edge is impure.

### 1-9 · Trees or No Trees? (יש אילנות או אין?)
Three marked fields; tap one, then choose blow, ride or walk.
- **Trees:** a plowed grave. Blowing or a strong donkey works (10:10).
- **Bare:** a lost grave. Nothing works (Oholot 18:3).
- **One edge marked:** a decoy that's fine. That edge is impure and the field is pure, so just walk (8:11).

### 1-10 · The Pilgrims' Path (שביל העולים)
Five paths over two marked fields.
- **The trap:** the busiest, most trodden path (with sheep on it) crosses the bare field. A lost grave isn't helped by treading.
- **The right path:** the trodden one through the field with trees (Korban Pesach 6:8).

## Chanukah Pack: The Sealed Jug (פך השמן)

Kislev, in the days of the Chashmona'im. **Yehuda**, a young Kohen, helps.

### C-1 · The Stones of the Altar (אבני המזבח)
- Four pins: shelf, flap A, flap B and the chamber door.
- Flap A must be switched. **Flap B is a trap:** pulling it rolls the defiled stones out onto the Mikdash floor instead of into the chamber (Middot 1:6).

### C-2 · They Searched (בדקו)
- Three dark storerooms.
- **Decoys:** a smashed jug, an open jug, a cracked Kohen Gadol seal, and a whole Kohen Gadol seal with drag marks in the dust beside it.
- **Two hidden niches:** one has drag marks inside it (moved). The other has smooth, untouched dust, and that's the one (Shabbat 21b, Rashi, Tosafot).

### C-3 · Sealed Tight (צמיד פתיל)
- Ten items to sort.
- **New traps:**
  - An **open stone bowl of oil**. The bowl is pure, but the oil isn't protected.
  - A **sealed clay jar with a clay cup** inside. It's pure: clay protects clay.
  - A **lone metal ladle**: impure.
- **Sources:** Kelim 10:1; Rambam Tumat Met 21:1.

### C-4 · Oil Is a Liquid (שמן הוא משקה)
- Two gates and a hand-washing station.
- **Left channel:** passes a "2" loaf. A liquid becomes a "1" even from a "2" (She'ar Avot 7:5).
- **Right channel, two branches:**
  - An innocent-looking **puddle** of impure water: a trap.
  - A **dead mouse on a shelf above** the channel looks scary but is fine. A sheretz has no ohel (Tumat Met 1:10).

### C-5 · Pure Oil Run (מסע השמן הטהור)
Five rooms reviewing World 1 with Yehuda: three ways down, two-cut pruning, a Beit HaPeras, and trees or no trees. Blowing fails in both the Beit HaPeras and the field, because it's oil for the Mikdash.

The last room has three jars:
- **A:** sealed clay, carried by someone tamei met. **Pure:** clay becomes impure only from its inside (Rambam Kelim 13:1).
- **B:** cloth-covered clay that rested in a tomb's doorway. Impure.
- **C:** a sealed metal flask that rested in the same doorway. Impure.

### C-6 · Eight Nights (שמונה לילות)
- **Choice:** use the impure oil, or search first? Tumah is only *pushed aside* for the community, so search first (Rambam Bi'at HaMikdash 4:15).
- **Then:** light the Menorah for eight nights.

# Part C: idea bank for later worlds

Each idea: the rule it teaches, then the puzzle, then sources. Ideas marked ✦ are especially strong.

## World 2: The House of Rooms (ohel physics; the "old man through the rooms" format)
1. ✦ **One-Tefach Windows.**
   - Rule: tumah passes between rooms only through an opening of at least 1×1 tefach.
   - Puzzle: rooms are stacked like a dollhouse. Slide shutters to make windows smaller than a tefach (use the tefach gauge) so Eli's route stays clean. *Rambam Tumat Met 14:1.*
2. ✦ **The Door Must Stand by Itself.**
   - Rule: a door a person holds shut doesn't block tumah; a door wedged with a stone does.
   - Puzzle: Gad offers to "hold the door". That fails, and the player must find a wedge. *Rambam Tumat Met 18:3; Oholot 6:1.*
3. **Which Door Will They Use?**
   - Rule: in a closed house with a met, every doorway is tamei; opening (or choosing) the one the met will be carried out through saves the others.
   - Puzzle: pick the exit door. *Rambam Tumat Met 7:2; Oholot 7:3.*
4. ✦ **Tumah Laser.**
   - Rule: tumah packed tight with no 1-tefach air pocket goes straight up and down, not sideways.
   - Puzzle: slide crates; only those in the vertical beam get tamei. *Rambam Tumat Met 7:4-5.*
5. **The Drain Under the House.**
   - Rule: "tumah goes out, not in". A covered drain under a house is tahor when the tumah is in the house; tumah in the drain makes the house tamei unless the drain's exit is a tefach wide.
   - Puzzle: pipes. *Mishnah Oholot 3:7.*
6. **Thin Branches.**
   - Rule: weak branches bring tumah (Rabbinic) but don't block it.
   - Puzzle: a dashed-outline mechanic in learning mode. *Rambam Tumat Met 13:2.*
7. **The Board on the Donkey.**
   - Rule: people and vessels can't act as a blocking ohel, but a board resting on a live animal can.
   - Puzzle: build a protective roof. *Oholot 6:1; Rambam Tumat Met 13:3.*
8. **Stone, Clay or Metal?**
   - Rule: which vessels become tamei and how: stone never; clay only from inside; metal from any touch.
   - Puzzle: a quick-sort mini-game. *Rambam Kelim 1:6, 13:1.*

## World 3: The Kitchen (Rishon, Sheni, Shlishi)
1. ✦ **The Mouse in the Clay Pot.**
   - Rule: a sheretz in a clay pot's airspace makes everything inside tamei with no touch; rubbing the outside does nothing.
   - *Vayikra 11:33; Rambam Kelim 13:1.*
2. ✦ **The Bone-Dry Apple.**
   - Rule: food that was never wetted on purpose can't become tamei. An apple washed yesterday (now dry) can.
   - *Rambam Tumat Okhalin 1:1-2; Makhshirin 6:4.*
3. **Count the Hops.**
   - Puzzle: label each step of a chain: sheretz → oven → bread → terumah cake.
   - *Rambam Tumat Met 5:8; She'ar Avot HaTumot 11:2.*
4. ✦ **Three Plates.**
   - Rule: one "2" loaf touches a plain plate (nothing), a gold-rim terumah plate (3, pasul) and a blue kodesh plate (3, still passes it on).
   - *Rambam She'ar Avot HaTumot 11:2-4.*
5. **A Rishon Can't Tag You.**
   - Rule: a "1" high-fives a friend and grabs a spoon. Neither becomes tamei by Torah law; only his hands become a "2".
   - *Rambam Tumat Met 5:7; She'ar Avot HaTumot 8:1.*
6. ✦ **The Power-Up Drink.**
   - Rule: a "2" loaf drips into water, the water becomes "1", and it makes the salad "2".
   - *Rambam She'ar Avot HaTumot 7:5.*
7. **Too Small to Spread.**
   - Rule: a tamei crumb smaller than an egg's volume (k'beitzah, כביצה) can't pass tumah on. Add a second crumb and it can, at the weaker level of the two.
   - *Rambam Tumat Okhalin 4:1, 4:12.*
8. **Tamei vs. Pasul.**
   - Rule: grey "broken" items vs. pulsing "contagious" items. Build a buffer so terumah is never touched.
   - *Rambam She'ar Avot HaTumot 11:1.*
9. **Inside or Outside?**
   - Rule: tamei water splashes the *outside* of a pot. For terumah only the outside is tamei; for kodesh the whole pot is.
   - *Rambam She'ar Avot HaTumot 7:3, 7:6.*
10. **The Plain Steak.**
    - Rule: a perfectly tahor ordinary steak makes korban meat pasul. A trick level with nothing tamei in sight.
    - *Rambam She'ar Avot HaTumot 11:5.*

## World 4: Mikveh & Sunset
1. ✦ **Fill the Mikveh.**
   - Rule: dig channels so rainwater flows in by itself, 40 se'ah [ארבעים סאה], one amah by one amah by three amot. Water carried in a bucket doesn't count.
   - Learning mode: by Torah law even drawn water works (Rambam Mikvaot 4:1). Disqualifying it is a Rabbinic rule.
   - *Rambam Mikvaot 4:1-2 [4:2 to verify]; Mishnah Mikvaot 1.*
2. **Wait for the Stars.**
   - Puzzle: move clouds aside so the three stars can be seen.
   - *Rambam Terumot 7:2.*
3. **Tevul Yom vs. Dirty Hands.**
   - Rule: someone who went to the mikveh today (tevul yom, טבול יום) doesn't make plain soup tamei, but unwashed hands make terumah pasul.
   - *Mishnah Tevul Yom 2:2; Rambam She'ar Avot HaTumot 10:3.*
4. **Day 3 and Day 7.**
   - Rule: someone tamei from a met is sprinkled with Parah Adumah water on day 3 and day 7, then goes to the mikveh.
   - Puzzle: a calendar puzzle with several characters.
   - *Bamidbar 19:12, 19.*
5. **The Gates.**
   - Rule: a tevul yom may pass the Cheil but not enter Ezrat Nashim until sunset.
   - Puzzle: a gate-check mini-game, which is also the finale's mechanic.
   - *Mishnah Kelim 1:8.*

## World 5: The Bikurim Parade (Shavuot)
1. **Tie the Reed.**
   - Rule: mark the first fig, grape and pomegranate with a reed.
   - *Mishnah Bikurim 3:1.*
2. ✦ **Camp in the Square.**
   - Rule: the procession sleeps in the open square, not in houses, so no one is under a roof with a met.
   - Puzzle: place bedrolls; awnings and balconies count as roofs.
   - *Rambam Bikurim 4:16; Oholot 8:2.*
3. **The Golden-Horned Ox.**
   - Puzzle: lead the parade past graves, trees and a Beit HaPeras. A combination level.
   - *Mishnah Bikurim 3:2-3.*
4. **The King Carries His Basket.**
   - Story: King Agrippas carries his own basket into the Azarah. A gentle story level.
   - *Mishnah Bikurim 3:4.*

## World 6: Children of the Rock (Parah Adumah)
1. ✦ **Courtyard on Hollow Rock.**
   - Rule: build over a hollow space so a hidden deep grave [קבר התהום] can't reach the children.
   - *Mishnah Parah 3:2; Rambam Parah Adumah 2:7.*
2. ✦ **Ox Express to the Shiloach.**
   - Rule: ride on a door on an ox's back holding a stone cup.
   - Puzzle: a "lean meter", since leaning out past the door could make the child tamei.
   - *Parah 3:2; Sukkah 21a.*
3. **Stone Cups Only.**
   - Puzzle: choose stone, clay or metal cups for drawing the water.
   - *Parah 3:2; Rambam Kelim 1:6.*
4. **Seven Days Apart.**
   - Rule: the Kohen who burns the Parah is separated seven days and sprinkled.
   - *Mishnah Parah 3:1 [to verify details].*

## Pesach pack
1. ✦ **Pesach Sheni Sort.**
   - Rule: who brings the Pesach on 14 Nisan and who on 14 Iyar. A sheretz-tamei person goes to the mikveh and brings it now; a met-tamei person whose 7th day is today goes to Pesach Sheni.
   - *Rambam Korban Pesach 6:2; Bamidbar 9.*
2. **"Why Should We Miss Out?"** (למה נגרע)
   - Story: the people who were tamei met ask Moshe and receive Pesach Sheni.
   - *Bamidbar 9:6-11.*

## Lag BaOmer pack
1. ✦ **Rashbi's Market.**
   - Story: test the ground in Tiberias. Hard ground is tahor; soft ground gets marked. An old man remembers where "ben Zakkai cut terumah lupines", a known-pure anchor.
   - Goal: open a direct road so the Kohanim no longer need the long detour.
   - Leave out the punishments in the story.
   - *Shabbat 33b-34a.*

## Finale: The Gates of the Mikdash
- Eli arrives at each gate (Har HaBayit, Cheil, Ezrat Nashim, Ezrat Yisrael, Ezrat Kohanim) carrying the statuses the player earned.
- The gates check them. The last screen: Eli joins the Kohanim in the Azarah.
- Cross-promote our 3D *Avodah – Beit HaMikdash* game here.
- *Mishnah Kelim 1:6-9.*

---

# Decisions

1. **English bracket style:** Hebrew letters in brackets, e.g. *"impure [טמא]"*.
2. **Chanukah hero:** Yehuda, a new young Kohen of the Chashmona'im's time.
3. **Cast names:** kept. Eli wears white Kohen-style clothes.
4. **Difficulty:** this pace is fine for now. Harder paths and levels come later.
5. **Next:** build these 16 levels first to prove the gameplay, then add more from Part C.

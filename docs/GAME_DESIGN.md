# Tehara: Game Design Plan (draft for discussion)

**Status:** research done, design draft. Nothing is built yet.
**Research behind this plan:**
- [`research/01-game-formats.md`](research/01-game-formats.md): the ad-style puzzle games we are modeling on.
- [`research/02-halacha-tumah-levels.md`](research/02-halacha-tumah-levels.md): the "rules engine". Avot, Rishon/Sheni/Shlishi/Revi'i, chullin/terumah/kodesh, liquids, hechsher, vessels, mikveh, doubts. Includes a full transmission table.
- [`research/03-halacha-tumat-met-kohanim-holidays.md`](research/03-halacha-tumat-met-kohanim-holidays.md): tumat met and ohel, Kohanim, Beit HaPeras, marking graves, Chanukah, Terumah, Bikurim, Pesach and Parah Adumah, Rashbi in Tiberias.

**Halachic basis:** the Rambam's **Sefer Taharah** (plus Hilchot Avel, Terumot, Bikurim, Korban Pesach and Eruvin where needed). The Mishnah and Gemara are its sources. Where the Rambam rules differently from a plain reading of the Mishnah, the game follows the Rambam. The research files flag every such place. All texts were pulled from the Sefaria API and every rule has a Sefaria link.

---

## 1. The idea in one paragraph

A one-player, side-view puzzle game in the style of the "pull the pin" / "save the hero" games advertised all over YouTube. You see a cut-away of rooms, fields and roads. A character (usually a young Kohen) walks along on his own, and you clear the way: pull pins, slide roofs, open and close windows, seal jars, blow away soil, choose the right vessel, wait for sunset. The danger isn't lava. It is **tumah**, and it follows the real rules of the Mishnah and the Rambam. To win, you have to understand how tumah actually travels. After every level, a short "Why?" card explains the halacha behind it, with the source. Kids come away knowing how a Rishon, Sheni and Shlishi work, why a Kohen walks around a field, and why a sealed jug of oil mattered on Chanukah.

---

## 2. What we're borrowing from the ad games (and what we're not)

### The games you described
- **The knight / princess / treasure game with metal bars** is the **"pull the pin"** genre. The famous ads were for *Hero Wars*, *Evony* and Playrix's *Homescapes*/*Gardenscapes*. The UK's ad regulator banned two of the Playrix ads in 2020 for not showing the real game. The actual games people play are mostly **How To Loot** and **Hero Rescue: Pull the Pin**, among others.
- **The old man walking through side-view rooms** is most likely **How To Loot's "old mage" levels**. He walks through a stacked tower, and you make one room safe at a time. This match is less certain (about 60%). Other candidates are listed in the research file.

### The format (from the screenshots)
- The phone is held **portrait**, and one level fills one screen. The level is a **cut-away** of a tower or house: stone walls, 2–4 chambers stacked or side by side.
- **Golden pins with ring handles** act as floors, walls and gates. You tap or swipe to pull one, and gravity does the rest.
- **Hazards** (water, lava, gas, boulders, enemies) sit behind the pins. The puzzle is the **order** you pull them in.
- The hero **waits until the path is safe, then walks by himself**. No dexterity is needed, which is good for young kids.
- Levels are short (**15–60 seconds**). Each new world introduces one new element, then combines it with old ones.
- On a win you get confetti, coins and a happy pose. On a loss there's a short sad animation and an instant retry.

### What we're taking
1. **Auto-walking hero and staged rooms** (How To Loot). Clear room 1, he walks, clear room 2.
2. **Pins and gates** that hold back a hazard or open a path.
3. **Sliding roofs and awnings.** This fits our topic better than anything in the ads, because a met spreads tumah to *everything under the same roof* (ohel). Moving the roof is the puzzle, and it's real halacha.
4. **"Pick the right item"** (from games like *Brain Out* and *Save the Girl*): stone cup, clay cup or metal cup?
5. **Draw or place a cover** (from *Save the Doge*): seal the clay jar (*tzamid patil*).
6. **Dig a channel / water flow:** rain has to flow into the mikveh by itself; drawn water doesn't count.

### What we're NOT taking
- No ads, no "watch a video for a hint", no lives or energy timers, no loot boxes, no fake urgency ("ONLY 5% CAN SOLVE THIS!"), and no characters crying to pressure the player.
- No third-party ad or analytics code.
- No gore. Skeletons are friendly cartoons; nothing screams or dies on screen.

---

## 3. Making tumah visible: the core visual language

The whole game depends on kids being able to *see* the halachic status of everything.

| Status | How it looks | Meaning |
|---|---|---|
| **Tahor** | Normal colors, small white sparkle | Pure |
| **Av HaTumah** | Strong purple glow + "Av" badge | Can make **people and vessels** tamei |
| **Rishon / Sheni / Shlishi / Revi'i** | Softer glow + a numbered badge **1 / 2 / 3 / 4** | Each step is weaker |
| **Tamei** (passes it on) | Glow **pulses** outward | "Contagious" |
| **Pasul** (doesn't pass it on) | Grey, with a small crack icon, **no** pulse | Unfit, but the chain stops here |
| **Ohel zone** | Light purple shading under any roof with a met under it | Everything in this zone is tamei |
| **Rabbinic layer** (*d'rabbanan*) | Dashed outline instead of solid | Shown only in "Learning mode" |

**Wording matters.** Tumah isn't dirt, germs or sin. It's a spiritual status the Torah defines. So the game never says "dirty" or "sick". It uses a neutral "glow / charge" metaphor, and the Why? cards say plainly that becoming tamei is often unavoidable and sometimes a mitzvah (burying the dead, caring for family).

**Food sanctity is shown with plates:** plain plate = chullin, gold-rim plate = terumah, Mikdash-blue plate = kodesh. This lets one puzzle show the same touch giving three different results (chullin stops at 2, terumah at 3, kodesh at 4).

---

## 4. Player verbs (what you actually do)

| Verb | Halacha it teaches |
|---|---|
| **Pull a pin / open a gate** | Order of events, keeping hazards apart |
| **Slide a roof, awning, board or tent** | Ohel: a met spreads tumah under a roof (≥ 1×1×1 tefach), and a proper roof also *blocks* it from above (Rambam Tumat Met 1:10, 12:1) |
| **Open or close windows and doors** | Tumah passes only through an opening ≥ 1×1 tefach (14:1). A door held shut by a person doesn't block; it has to stand by itself (18:3) |
| **Blow away soil** (leaf blower / hand blower) | Beit HaPeras: "מנפח אדם בית הפרס והולך" (Berakhot 19b; Rambam Eruvin 6:17) |
| **Paint with lime** | Marking graves in Adar (Shekalim 1:1; Rambam Tumat Met 8:9) |
| **Choose a vessel** (stone / clay / metal / glass) | Stone never becomes tamei; clay only through its inside; metal from any touch |
| **Seal a lid** | Tzamid patil protects a clay jar's contents (Bamidbar 19:15) |
| **Pour, wet or dry food** | Hechsher: food can't become tamei until it has been wetted on purpose (Tumat Okhalin 1:1) |
| **Move food between plates** | Rishon → Sheni → Shlishi → Revi'i, and where each chain stops |
| **Turn the sun dial / wait for stars** | Tevilah plus sunset before eating terumah (Vayikra 22:7) |
| **Pick the character** | Kohen, Kohen Gadol, Yisrael, or a child in the Parah Adumah courtyard: who may do what |

---

## 5. Structure: a journey up to Yerushalayim

The world map is a road from the countryside up to the Beit HaMikdash. It follows the **ten levels of holiness** in Mishnah Kelim 1:6-9: Eretz Yisrael, walled cities, Yerushalayim, Har HaBayit, the Cheil, Ezrat Nashim, Ezrat Yisrael, and so on. Each world is a stop on the road and teaches one topic, with about 6–10 levels each. The finale is a set of "gate checks" at the Mikdash where your status decides how far in you may go. It can link to our 3D **Avodah – Beit HaMikdash** game, which also stars a young Kohen.

### World 1: The Kohen's Road (tumat met basics)
| # | Level | What it teaches | Source |
|---|---|---|---|
| 1-1 | **Mouse Yes, Skeleton No** | A Kohen *may* get tumah from a sheretz; only tumat met is forbidden to him | Vayikra 21:1; Rambam Tumat Okhalin 16:9 |
| 1-2 | **Under One Roof** | Slide the awning so the Kohen's path isn't under the same roof as the skeleton | Rambam Tumat Met 1:10, 12:1 |
| 1-3 | **Don't Rock the Plank** | A barley-grain bone conveys tumah by touch or moving it (even through a plank), not by ohel | Rambam Tumat Met 1:7, 2:10 |
| 1-4 | **The Overhanging Tree** | Branches over a grave are an ohel; a sturdy roof blocks it | Rambam Tumat Met 13:2 |
| 1-5 | **The Leaf-Blower Field** ⭐ | Beit HaPeras: blow, reveal the bone chips, walk around them (see §6) | Berakhot 19b; Rambam Eruvin 6:17, Tumat Met 10 |
| 1-6 | **Stones That Don't Wobble** | Other ways across: solid stones, a strong donkey | Rambam Tumat Met 10:11 |
| 1-7 | **Adar Paint Patrol** | Mark graves with lime: not too tight, not too wide | Shekalim 1:1; Rambam Tumat Met 8:9 |
| 1-8 | **The Lost-Grave Field** | A trap: here blowing does **not** help, so find another road | Oholot 18:3; Moed Katan 5b |

### World 2: The House of Rooms (ohel physics, in the "old man through the rooms" format)
| # | Level | What it teaches | Source |
|---|---|---|---|
| 2-1 | **One-Tefach Windows** | Tumah only squeezes through an opening ≥ 1×1 tefach | Rambam Tumat Met 14:1 |
| 2-2 | **The Door Must Stand by Itself** | A door a person holds shut doesn't block tumah; a door wedged with a stone does | Rambam Tumat Met 18:3; Oholot 6:1 |
| 2-3 | **Which Door Will They Use?** | All closed doorways of a house with a met are tamei; choosing the exit door saves the others | Rambam Tumat Met 7:2; Oholot 7:3 |
| 2-4 | **Tumah Laser** | Tumah packed tight with no air pocket shoots straight up and down, never sideways | Rambam Tumat Met 7:4-5 |
| 2-5 | **The Sealed Jar** | A tightly sealed clay jar protects its contents | Bamidbar 19:15; Rambam Tumat Met 21:1 |
| 2-6 | **Stone, Clay or Metal?** | Stone vessels never become tamei; a metal ring inside a sealed clay jar isn't protected | Mishnah Kelim 10:1; Rambam Kelim 1:6 |

### World 3: The Kitchen (Rishon, Sheni, Shlishi)
| # | Level | What it teaches | Source |
|---|---|---|---|
| 3-1 | **The Mouse in the Clay Pot** | Clay becomes tamei only from its inside airspace, even with no touch | Vayikra 11:33; Rambam Kelim 13:1 |
| 3-2 | **The Bone-Dry Apple** | Food that was never wetted on purpose can't become tamei | Rambam Tumat Okhalin 1:1-2; Makhshirin 6:4 |
| 3-3 | **Count the Hops** | Av → Rishon → Sheni → Shlishi | Rambam Tumat Met 5:8 |
| 3-4 | **Three Plates** | The same touch: chullin stops at 2, terumah at 3, kodesh at 4 | Rambam She'ar Avot HaTumot 11:2-4 |
| 3-5 | **A Rishon Can't Tag You** | Only an Av makes a person or vessel tamei | Rambam Tumat Met 5:7 |
| 3-6 | **The Power-Up Drink** | Liquids always become Rishon, even from a Sheni | Rambam She'ar Avot HaTumot 7:5; Parah 8:7 |
| 3-7 | **Too Small to Spread** | Food passes tumah on only at k'beitzah | Rambam Tumat Okhalin 4:1 |
| 3-8 | **Wash Your Hands** | Hands are a Sheni by Rabbinic law: they disqualify terumah | Rambam She'ar Avot HaTumot 8 |

### World 4: Mikveh & Sunset
| # | Level | What it teaches | Source |
|---|---|---|---|
| 4-1 | **Fill the Mikveh** | Rainwater must flow in by itself (40 se'ah); drawn water doesn't work | Mishnah Mikvaot; Rambam Mikvaot |
| 4-2 | **Wait for the Stars** | After tevilah, a Kohen waits for sunset before eating terumah | Vayikra 22:7; Rambam Terumot 7:2 |
| 4-3 | **Tevul Yom vs. Dirty Hands** | A tevul yom doesn't affect chullin soup; tamei hands do | Mishnah Tevul Yom 2:2 |
| 4-4 | **Day 3 and Day 7** | Tumat met needs Parah Adumah water sprinkled on day 3 and day 7 | Bamidbar 19:12, 19 |

### World 5: The Bikurim Parade
| # | Level | What it teaches | Source |
|---|---|---|---|
| 5-1 | **Tie the Reed** | Choosing and marking the first fruits | Mishnah Bikurim 3:1 |
| 5-2 | **Camp in the Square** | The procession sleeps outside so nobody is under a roof with a met | Rambam Bikurim 4:16 |
| 5-3 | **The Golden-Horned Ox** | Lead the parade past marked graves, trees and a Beit HaPeras: everything combined | Mishnah Bikurim 3:2-3 |

### World 6: Children of the Rock (Parah Adumah)
| # | Level | What it teaches | Source |
|---|---|---|---|
| 6-1 | **Courtyard on Hollow Rock** | Build over a hollow space so a hidden deep grave can't reach up | Mishnah Parah 3:2; Rambam Parah Adumah 2:7 |
| 6-2 | **Ox Express to the Shiloach** | Ride on a door on an ox with a stone cup; don't lean out! | Parah 3:2; Sukkah 21a |

### Holiday packs (unlock around the calendar)
- **Chanukah:**
  - *Find the Sealed Jug*: inspect the seals and find the one jug with the Kohen Gadol's seal (Shabbat 21b).
  - *The Tzamid Patil Room*.
  - *Pure Oil Run*: get the olives to the press without tumah.
  - Teaches why the Chashmona'im looked for pure oil even though tumah is set aside for a community (Rambam Bi'at HaMikdash 4:15).
- **Pesach:**
  - *The Trodden Path*: a path through a Beit HaPeras that many feet have pressed down is tahor, for someone going to bring the Korban Pesach (Rambam Korban Pesach 6:8).
  - *Pesach Sheni Sort*: who brings the Pesach on 14 Nisan and who on 14 Iyar (Rambam Korban Pesach 6:2).
- **Lag BaOmer:** *Rashbi's Market*: test hard ground (tahor) vs. soft ground (mark it), so the Kohanim no longer need the long detour around Tiberias (Shabbat 33b-34a). The violent endings of the story are left out.

### Finale: The Gates of the Mikdash
Your character arrives at each gate with whatever status the journey left him in. A tevul yom gets past the Cheil but stops at Ezrat Nashim until sunset (Mishnah Kelim 1:8). This is the payoff: kids see that everything they learned decides how close they may come.

---

## 6. Worked example: Level 1-5, "The Leaf-Blower Field"

This is your idea, checked against the sources.

**Story.** Eli the young Kohen is on his way to Yerushalayim to bring bikurim (a mitzvah). The only road crosses a field with a whitewashed sign: *"Beit HaPeras: a grave was plowed here."* A river blocks the detour.

**Room 1 (pin puzzle).** The gardener is stuck in his shed. Pull the pins in the right order to free him without knocking the beehive onto the path.

**Room 2 (the field).** The gardener hands Eli his leaf blower. You aim it, and gusts strip the topsoil away to reveal small cartoon **bone chips** glowing faintly purple. Tap the tiles to draw a path that goes around every chip. Eli walks it. If he steps on a chip **or kicks one** (moving it counts, Rambam Tumat Met 1:7), he glows and the level resets.

**Room 3 (the twist, later in the world).** Eli is also carrying **terumah**. A sage stops him: "For terumah, we don't rely on blowing" (אין בודקין לתרומה, Oholot 18:4). The terumah basket has to go across a different way: on solid stones, or on the strong donkey.

**Why? card.**
> A Beit HaPeras is a field where a grave was plowed by mistake, so tiny bone chips might be scattered in it. A bone the size of a barley grain only makes you tamei if you **touch it or move it**; it doesn't spread under a roof. So the Sages said you can **blow on the ground as you walk**, see any chip, and step around it. Even a Kohen may do this.
> *"נתנו בבית הפרס הרי זה ערוב ואפילו היה כהן... שינפח והולך"*. Rambam, Hilchot Eruvin 6:17 · Berakhot 19b · Rambam Tumat Met 2:10, 10:1-2

**Halachic guard-rails built into the level** (details in research file 03, §3):
1. The field must be a **plowed-grave** field. A lost-grave field doesn't work; that's level 1-8.
2. Eli has a **mitzvah purpose** and **no other road** (Rambam Avel 3:14).
3. Blowing is **not** relied on for terumah (Room 3).
4. The sources describe the walker blowing *for himself*. That's why the gardener **hands Eli the blower** instead of blowing ahead of him. Then Eli is the one doing the checking, exactly as in the Gemara. (See question 6 below.)
5. The blower only **reveals** chips. It never pushes them toward Eli.

---

## 7. The learning layer

- **"Why?" card after every level.** A one-paragraph kid rule, the Hebrew source line, its English, and a "Read on Sefaria" link.
- **Sefer collection.** Each level unlocks a page in an in-game "Sefer Taharah" notebook. By the end, kids have their own illustrated summary of the rules.
- **Glossary.** Tap any Hebrew term (Tumah, Tahor, Av, Rishon, Ohel, Tefach, K'beitzah, Terumah...) for a one-line definition.
- **Learning mode** (toggle, for older kids and parents). Shows the d'oraita/d'rabbanan layer (dashed outlines), Rambam notes and machlokot.
- **Hints without ads.** The first hint highlights *which rule* matters. The second shows the first move.

---

## 8. Kid-safety and sensitivity

- **Skeletons** are friendly cartoons (round skulls, no blood). A met mitzvah is shown as a respectful covered shape.
- **Left out of the game entirely:** zav, zavah, niddah, yoledet, shichvat zera, and bo'el niddah (not appropriate for kids); tumah of avodah zarah; the rules about gentile graves; the punishments in the Rashbi story.
- **Kept but treated gently:** death, cemeteries, Kohanim avoiding graves. These are framed around kavod hamet (honoring the dead) and the special role of the Kohen.
- **No ads, no in-app purchases, no tracking.**

---

## 9. Technical plan (proposal)

This matches how our other games (Dreidel, Avodah – Beit HaMikdash, JacobBros) are built:
- **Plain HTML, CSS and JavaScript, with no build step,** drawn on a 2D `<canvas>`. It runs in any browser, on phones and computers, and installs as an app (PWA, works offline).
- **Hosted on GitHub Pages,** and listed on the JacobBros hub with its "More games" badge.
- **The halacha is code.** The rules live in one small module, `js/engine/tumah.js`: pure functions such as `transmit(source, target, how)` that follow the transmission table in research file 02.
  - It has **automated tests**, and each test names its source (e.g. *"a Sheni of chullin does not make a Shlishi in chullin, Rambam She'ar Avot HaTumot 11:2"*).
  - Levels can't accidentally teach something wrong: if the engine says the Kohen became tamei, he did.
- **Levels are data files** (`data/levels/1-5.js`): rooms, objects, pins, the goal, and the Why? card text with its sources. Adding a level means adding a file, not writing code.
- **Art:** start with clean, simple vector art drawn in code (like Dreidel). Upgrade to illustrated art once the gameplay is proven.

### Milestones
1. **Design sign-off.** Answers to the questions below.
2. **Rules engine plus tests** for the transmission table and the ohel rules.
3. **Playable prototype:** levels 1-1, 1-2 and 1-5, with simple art, on GitHub Pages.
4. **Playtest** with a few kids; adjust difficulty.
5. **Halachic review** of the engine and all Why? cards by a rav.
6. **Worlds 1–3**, then 4–6 and the holiday packs.

---

## 10. Things the research flagged as uncertain

These are covered in detail at the end of research files 02 and 03:
- **The gardener blowing for the Kohen** is a reasonable inference, not an explicit source. Our solution is to have the Kohen do the blowing himself.
- **Chullin prepared to kodesh standards:** the Rambam and the Raavad disagree sharply. Leave it out of kids' levels.
- **The moving box (*ohel zaruk*):** the Rambam says it is not an ohel, but the Parah Adumah oxen-with-doors seem to work as one. Unresolved, so the game avoids building a level on the conflict.
- **Doors and *tumah yotzet*:** is it Torah law or Rabbinic? The Rambam doesn't say.
- **Golel/dofek** (the cover stone of a grave): Rabbinic per the Rambam, Torah law per others. The game follows the Rambam.
- **Several citations are marked [memory]** in the research files. They should be checked against the text before a level relies on them.

---

## 11. Questions for you

1. **Age range.** I've assumed about 7–12, with a "Learning mode" for older kids and adults. Right?
2. **Language.** English with Hebrew terms (Tumah, Rishon, Ohel...) and Hebrew source quotes? Or a full Hebrew version too?
3. **Name and hero.** "Tehara" as the title? Should the hero be a young Kohen (I used "Eli" as a placeholder)? Should there be a second playable character, such as a Yisrael or a sister, for levels where the rules differ?
4. **Platform.** A web game like our others, playable on phones and installable, OK?
5. **Halachic reviewer.** Is there a rav who could review the rules engine and the Why? cards before we publish?
6. **The leaf blower.** Is the "gardener hands the Kohen the blower" version OK? Or do you want the gardener blowing ahead, with a note that it's our inference?
7. **Scope for version 1.** Start with World 1 (The Kohen's Road) plus the Chanukah pack, since Chanukah is coming up?
8. **Art direction.** Bright, simple cartoon like the How To Loot screenshots? Or a different feel, e.g. warm Yerushalayim-stone colors?

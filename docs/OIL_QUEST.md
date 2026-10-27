# Tehara: The Last Jug (פך השמן): design draft for the new direction

**Status:** draft, second pass. Nothing is built yet on this branch. Once it's built, this becomes the main game; the current puzzles (`index.html`) and the 3D version (`legacy.html`) stay reachable from a menu.

**Decided so far**
- **Story:** Eli, a young Kohen, finds the one jug of pure oil in the Beit HaMikdash after the Chanukah battles and carries it to the menorah. Yehuda HaMaccabi appears.
- **Play:** point-and-click adventure. Tap where to go, tap things to use them.
- **Look:** in the style of *Lara Croft GO*, kept simple enough to build (§6).
- **Audience:** 12+. Players can read real explanations, Hebrew terms and sources, and handle d'oraita / d'rabbanan distinctions.
- **Scope of halacha:** not only tumat met and ohel. The whole ladder of tumah (Av, Rishon, Sheni, Shlishi, Revi'i), how it works differently for chullin, terumah and kodesh, liquids, hands, and vessels (§3).

**What carries over:** the research in [`research/`](research/) (especially file 02, the full tumah ladder) and the rules engine in `js/engine/tumah.js`, which already models these levels.

---

## 1. The story

**Prologue: after the battle.** The Chashmona'im have taken back Yerushalayim. Yehuda HaMaccabi is a Kohen himself, but he and most of the fighters became tamei met in the battle. They need seven days and the Parah Adumah water before they can go in (Bamidbar 19:11-12). Eli stayed back with the supplies and never came near the fallen. He's one of the few Kohanim who can go into the Mikdash today. Yehuda gives him the job: find pure oil and light the menorah.

**Act I: up to the Mikdash.** Get from the camp to the Temple Mount without becoming tamei. This act introduces the kinds of Av HaTumah and the three ways tumat met spreads: touching, carrying, and being under the same roof (ohel).

**Act II: the search.** The storerooms are wrecked. Big jugs of oil are everywhere and none of them can be used. Eli works out which of them are tamei and how (the tumah ladder), reads the seals, and finds the one small jug, hidden away, with the Kohen Gadol's seal (Shabbat 21b).

**Act III: the carry back.** The way to the Heichal runs through the damaged courtyards. Eli can carry only this one small jug. It has to stay sealed, nothing may touch the oil, and he has to stay tahor enough to pass every gate.

**Finale.** Wash at the kiyor, build the menorah the Chashmona'im actually used (iron spears, Rosh Hashanah 24b), fill seven lamps, and light. Yehuda is there to see it. The jug holds enough for one night; the ending plays out the eight days.

### Where Yehuda appears
- **Prologue:** gives Eli the mission, and explains why he can't go himself.
- **End of Act I:** at the Cheil gate. He can come no further and has to send Eli on alone (Mishnah Kelim 1:8).
- **Finale:** watches from outside the Ezrat Kohanim as the lamps are lit, and at the end, nights 2 to 8.
- Optional: he's the voice of the hint system ("Think like a Kohen: what touched what?").

---

## 2. Gameplay: point-and-click

*Lara Croft GO* is itself a tap-to-move game: each level is a small diorama with a few spots you can walk to, and you tap the next spot or an object. That's a natural fit for point-and-click, and it keeps the game turn-based: nothing moves until the player acts, so there's time to read and think.

### What the player does
| Action | How |
|---|---|
| **Walk** | Tap a spot. Eli walks there along the path. If the step would make him tamei, he stops and says why ("That awning is the same roof as the fallen soldier"). |
| **Look** | Tap any object for a short description. Look closer opens a close-up (seals, labels, marks on the floor). |
| **Use** | Tap an object to push, pull, open, close, lower, raise, light, pour. |
| **Inventory** | A few items: the jug (once found), a wedge stone, a rope, a lamp, a stone cup. Drag an item onto something to use it. |
| **Tag** (Act II on) | Mark any object with its status: Tahor, Av, Rishon, Sheni, Shlishi, Revi'i, Pasul. This is how the tumah-ladder puzzles work (§3). |
| **Talk** | Yehuda, the tamei-met fighters at the gates, an old Levi who knows the storerooms. |
| **Undo / restart** | Always available. No lives, no timers. |

### Always on screen
- **Eli's status:** tahor / washed hands / unwashed hands (Sheni d'rabbanan) / tamei (and which kind, with what it would take to become tahor again).
- **The jug:** sealed ✓, not moved by anyone else ✓, nothing added ✓, still in Eli's care ✓.
- **Tumah view** (toggle): shades the area under the same roof as a met, and shows each object's tag once the player has worked it out.

### What the big jugs are for
- **Act II:** they're the evidence. Each one became tamei in a different way, and working out how is the puzzle.
- **Act III:** the temptation. "The little jug won't last eight days. Top it up from this big one?" Opening the seal or mixing in tamei oil makes the pure oil tamei, so the right answer is to leave it. That sets up the miracle.
- **Obstacles:** a spilled jug leaves a floor of tamei oil that you can't let touch the lamp or the wick.

---

## 3. The tumah ladder: making Av, Rishon, Sheni and the rest part of the game

### Why it fits this story so well
The oil for the menorah is set aside for the Mikdash, so it's treated like kodesh. For kodesh, tumah goes **four steps down**: even a Revi'i disqualifies it. Oil is also a **liquid**, and liquids are the most sensitive of all: anything that makes terumah unfit makes a liquid a **Rishon** (Mishnah Parah 8:7). Even unwashed hands are enough. So the oil is about the easiest thing in the world to ruin. That's why one sealed, untouched jug mattered so much, and it's why Eli has to understand the whole ladder, not only tumat met.

### What the player learns, act by act

**1. The kinds of Av (Act I).** Not all sources of tumah are equal.
- A **met** is the strongest (*avi avot hatumah*). It spreads by touching, by carrying, and by being under the same roof.
- A **sheretz** (a dead mouse) is an Av that spreads only by touching, not by carrying and not by roof. A Kohen is allowed to become tamei from one, but then he couldn't enter the Mikdash today.
- A **tamei met person** (Yehuda and the fighters) is an Av too. If one of them takes Eli's hand, Eli becomes tamei until evening, after immersing (a Rishon). That's enough to keep him out of the Ezrat Nashim today.
- **Rule the game teaches:** only an Av makes a *person* or a *vessel* tamei. A Rishon can't. (Mishnah Kelim 1:1-4; Rambam Tumat Met 5:7-8)

**2. Counting the steps (Act II).** Whatever touches an Av becomes Rishon; whatever touches a Rishon becomes Sheni, and so on (Rambam Tumat Met 5:8). How far it goes depends on what the thing is:

| | Rishon | Sheni | Shlishi | Revi'i |
|---|---|---|---|---|
| **Chullin** (ordinary food) | tamei | pasul, stops here | – | – |
| **Terumah** | tamei | tamei | pasul, stops here | – |
| **Kodesh** (the Mikdash's things, the menorah oil) | tamei | tamei | tamei | pasul, stops here |

(Rambam She'ar Avot HaTumot 11:2-4; the Shlishi and Revi'i of food are d'rabbanan.)

**3. Liquids jump back to the top (Act II).** A liquid that touches a Rishon *or a Sheni* becomes a Rishon, not one step further down (Mishnah Parah 8:7; Rambam She'ar Avot HaTumot 7). The one exception: a tevul yom doesn't do this.

**4. Hands (Act II and the finale).** By rabbinic law, hands that haven't been washed are treated as a Sheni (Rambam She'ar Avot HaTumot 8:8). They disqualify terumah and kodesh and make liquids tamei. For kodesh, the hands have to be immersed, not just washed (Mishnah Chagigah 2:5). And in the Mikdash a Kohen washes hands and feet from the kiyor before he serves (Shemot 30:19-21).

**5. Vessels (Act II).** Different materials follow different rules:
- **Clay** becomes tamei only from the inside, through its airspace. Touching the outside does nothing (Vayikra 11:33). That's why the sealed clay jug survived.
- **Metal** becomes tamei from any touch.
- **Stone** never becomes tamei at all. So in a wrecked storeroom, the stone cup is the one vessel Eli can be sure of.
- **A tight seal** (*tzamid patil*) protects a clay vessel's contents even under the same roof as a met (Bamidbar 19:15).

**6. People's levels and the gates (Act III).** The courtyards are the test of everything above (Mishnah Kelim 1:5-9):

| Gate | Who is stopped there |
|---|---|
| Cheil | anyone tamei met |
| Ezrat Nashim | a *tevul yom* (immersed, but the sun hasn't set) |
| Ezrat Yisrael | a *mechusar kippurim* (still needs to bring his korban) |
| Ezrat Kohanim | anyone who isn't a Kohen, except to bring a korban |
| Heichal | a Kohen who hasn't washed hands and feet |

### The notebook
Every rule Eli works out goes into a notebook ("Sefer Taharah"). By the end it holds the full ladder chart above, the gates, and a source page for each rule with Hebrew text and a Sefaria link. For 12+, each page also shows which parts are d'oraita and which are d'rabbanan.

---

## 4. Level outline (second pass, 17 scenes)

### Act I: up to the Mikdash (kinds of Av; the three ways tumat met spreads)
| # | Scene | What the player works out | Source |
|---|---|---|---|
| 1 | **The Supply Tent** | Tutorial: walk, look, use. Yehuda gives the mission and explains why he can't go | Bamidbar 19:11-12 |
| 2 | **The Market Awning** | A covered fallen fighter lies under a long awning. Lower part of it, or find a way that's never under the same roof | Rambam Tumat Met 1:10, 12:1 |
| 3 | **The Siege Tower** | Its platform overhangs the street and counts as a roof. Roll it back | Rambam Tumat Met 12:1, 13:2 |
| 4 | **Bones in the Rubble** | A bone the size of a barley grain spreads tumah only by touching or moving it, not by roof. Don't push the crate over it | Rambam Tumat Met 1:7, 2:10 |
| 5 | **The Mouse and the Helping Hand** | A dead mouse and a tamei-met fighter offering to help: both are an Av, neither spreads by roof, and both would keep Eli out today. Find another way to get the help (he can move things for you, as long as Eli doesn't touch him) | Mishnah Kelim 1:1; Rambam Tumat Met 5:7 |
| 6 | **The Cheil** | Yehuda stops here. Eli goes on alone | Mishnah Kelim 1:8 |

### Act II: the search (the ladder)
| # | Scene | What the player works out | Source |
|---|---|---|---|
| 7 | **Beit Shemaniya** | The oil chamber in the corner of the Ezrat Nashim. Find out how each big jug became tamei. A mouse fell into one: its airspace made the jug and the oil tamei | Mishnah Middot 2:5; Vayikra 11:33 |
| 8 | **What Touched What** | A detective scene. A ladle went from the mouse jug into a second jug, then a loaf touched the spill. Tag every object with its step on the ladder. The oil keeps jumping back to Rishon | Rambam Tumat Met 5:8; Mishnah Parah 8:7 |
| 9 | **Three Shelves** | The Lechem HaPanim bakers' chamber: one touch, three results. Chullin stops at Sheni, terumah at Shlishi, kodesh goes to Revi'i | Mishnah Middot 1:6; Rambam She'ar Avot HaTumot 11:2-4 |
| 10 | **Clay, Metal, Stone** | Which vessels can still be trusted? The stone cup is the only certain one | Vayikra 11:33; Mishnah Kelim 10:1 |
| 11 | **Read the Seal** | Broken seals, an ordinary seal, a redone seal, and a perfect seal next to a fresh dust ring (moved). Compare to the Kohen Gadol's ring | Shabbat 21b; Rashi; Tosafot |
| 12 | **The Hidden Jug** | A loose floor tile, a sealed niche, and the small jug with the Kohen Gadol's seal | Tosafot Shabbat 21b; Rambam Chanukah 3:2 |

### Act III: the carry back (everything combined)
| # | Scene | What the player works out | Source |
|---|---|---|---|
| 13 | **Sealed Is Safe** | The jug's tight seal would protect the oil from the roof of a met, but Eli still mustn't go under it. Close a shutter; one tefach matters | Bamidbar 19:15; Rambam Tumat Met 14:1 |
| 14 | **The Door That Stands by Itself** | A door held shut by a person doesn't block tumah; a door wedged with a stone does | Rambam Tumat Met 18:3 |
| 15 | **Just a Little More Oil?** | A big jug of tamei oil sits right on the path. Leave the seal alone | Mishnah Parah 8:7; Rambam Tumat Okhalin 1:2 |
| 16 | **The Gates** | Each courtyard checks Eli and the jug | Mishnah Kelim 1:5-9 |

### Finale
| # | Scene | What the player works out | Source |
|---|---|---|---|
| 17 | **Kiyor, Spears and Lamps** | Wash hands and feet; the gold menorah is gone, so build one from iron spears; fill seven lamps with half a log each; light. Then the eight days | Shemot 30:19-21; Rosh Hashanah 24b (= Menachot 28b, Avodah Zarah 43a); Mishnah Menachot 9:3; Shabbat 21b |

**Why search at all?** If tumah is allowed for the whole community (*tumah hutra b'tzibur*), why not use the tamei oil? The Rambam rules it's only *pushed aside* (*dechuyah*), so you have to look for pure oil first (Yoma 6b; Rambam Bi'at HaMikdash 4:15). For 12+ the notebook also gives the other answers (Pnei Yehoshua, Chatam Sofer; research file 03, §5).

**Why eight days?** Night by night the lamps keep burning while olives are pressed for new pure oil (Rambam Chanukah 3:2). The notebook gives the explanations: the olives were four days away (Ran, Maharsha), or everyone was tamei met and needed seven days.

---

## 5. Handling the war

- No fighting on screen. The game starts after the battle.
- The fallen are covered, still shapes, shown with respect. The text says that burying them is a mitzvah, and that becoming tamei for it is good; Eli just can't today because he's needed in the Mikdash.
- Left out: the rabbinic decree treating gentiles like zavim (the deeper reason a moved jug didn't count) and the idols the Greeks set up. The notebook can mention for older players that "there were further rabbinic reasons" without the details. The defiled altar stones (Middot 1:6) can be a background detail.

---

## 6. Graphics: a *Lara Croft GO* look without a huge art budget

What makes that look work isn't detail. It's a few strict rules:
- **Low-poly, flat-shaded shapes.** Big simple forms, no textures, clean silhouettes.
- **A small palette per scene** (5–7 colors), with one warm key light and cool shadows.
- **One fixed camera per scene,** high and at an angle, so every scene reads like a small diorama floating in fog or darkness.
- **Very few objects,** each of them important.

That's a style that suits code, because it's about simple shapes and good lighting, not hand-painted detail. The plan:
1. **three.js, one fixed camera per scene.** No free camera to build or test.
2. **Simple architecture built in code from a small kit:** floor tiles, steps, walls, columns, arches, gates, awnings, crates, jugs, the menorah. These are all simple shapes, which is what low-poly is good at.
3. **Free (CC0) low-poly asset packs for the rest,** such as Kenney, Quaternius or KayKit, recolored to the palette. Licenses to be checked before anything goes in.
4. **Characters (Eli, Yehuda, the Levi)** are the hardest part. Start from a CC0 low-poly character base and give it Kohen's clothes and a recolor, rather than modeling from scratch.
5. **Close-ups** (seals, labels, the jug) as flat 2D illustrations over the scene, which are easier to make sharp than 3D.

**Why this should go better than the last 3D attempt:** last time there were no style rules or references, lots of small objects, and a moving camera. This time the reference is fixed (*Lara Croft GO*), the rules above are fixed, and we judge one room before building more.

**Next step: one test scene.** Beit Shemaniya (scene 7): the oil chamber with the big jugs, Eli, tap to walk, tap a jug to look at it, and the tumah view. If the look isn't right, we change the style before any more scenes exist. If code-built art still isn't good enough, the fallback is to keep the same gameplay and swap in purchased or generated art.

---

## 7. Build plan

1. **Test scene** (above), to settle the look.
2. **Engine:** scenes from data files, walk spots and paths, objects with actions, inventory, tagging, undo, and the status panel, all running on `js/engine/tumah.js`.
3. **Act I** playable end to end.
4. **Acts II–III and the finale.**
5. English and Hebrew text, the notebook with Sefaria links, saved progress on the device.
6. Tests for every scene's solution and every rule. A rav reviews the halacha before release.

---

## 8. Open questions

1. **Is menorah oil "kodesh" for the ladder (tumah to Revi'i)?** I've assumed yes because it's set aside for the Mikdash. This should be confirmed by a rav before the game relies on it.
2. **Yehuda is a Kohen and tamei met:** happy with that as the reason he sends Eli?
3. **The helping-hand puzzle (scene 5):** the tamei-met fighter can move things for Eli as long as they don't touch. Is that clear enough, or too fiddly?
4. **The detective scene (8):** this is the hardest scene in the game and the core of the ladder teaching. Should there be an easier version first?

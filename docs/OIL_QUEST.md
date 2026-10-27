# Tehara: The Last Jug (פך השמן) — design draft for the new direction

**Status:** draft for discussion. Nothing is built yet on this branch. The current game (`index.html`, the "road to Jerusalem" puzzles) and the 3D version (`legacy.html`) are left untouched until we decide what to keep.

**What's new:** one story instead of a level pack. You are a young Kohen at the end of the Chanukah battles. You have to find the one small jug of pure oil in the Beit HaMikdash and carry it, still tahor and still sealed, to the menorah. Every obstacle on the way is a real tumah or kedushah rule.

**What carries over:** the research in [`research/`](research/) and the rules engine in `js/engine/tumah.js`. Most of the sources below are already checked there; the new ones were checked against Sefaria for this draft.

---

## 1. The story in three acts

**Prologue: after the battle.** The Chashmona'im have taken back Yerushalayim. Many of the fighters, Kohanim among them, became tamei met in the fighting; they will need seven days and the Parah Adumah water before they can go in (Bamidbar 19:11-12). You are the young Kohen who stayed back with the supplies and never came near the fallen. That makes you one of the few who can go into the Mikdash right now. Yehuda HaMaccabi gives you the job.

**Act I: up to the Mikdash.** Get from the camp to the Temple Mount gates without becoming tamei met. This is where ohel, touching and carrying are introduced, one at a time.

**Act II: the search.** Inside, the storerooms are wrecked. There are big jugs of oil everywhere: on shelves, knocked over, opened. Every one of them is unusable. You search the chambers, read the seals, and find the one small jug, hidden away and stamped with the Kohen Gadol's seal (Shabbat 21b).

**Act III: the carry back.** Now you have the jug, and the way to the Heichal runs through the damaged courtyards. You may carry only this one small jug. It has to stay sealed, and you have to stay tahor, or you can't go past the gates. At the end you wash at the kiyor, build the menorah the Chashmona'im actually used (iron spears, Rosh Hashanah 24b), fill the seven lamps, and light. The jug holds enough for one night. The ending plays out the eight days.

---

## 2. Gameplay: what you actually do

The last two versions were mostly "tap the right button" scenes. This version needs real play, but still no reflexes or timers for 7-year-olds.

**Recommendation: a turn-based, grid-based adventure** in the style of *Lara Croft GO* / *Hitman GO* / *Monument Valley*. Each level is one room or courtyard seen from slightly above. You move the Kohen square by square (tap a square, arrows or swipe). Nothing moves until you move, so there's time to think, but the rooms are full of things you push, pull, open, close, carry and set down.

Why this format fits the topic:
- **Tumah rules are spatial.** "Under the same roof as a met" is a set of squares. "Touching" is standing next to and interacting. "Carrying" is picking up. A grid makes all of that exact and readable.
- **It's real puzzle play,** not trivia. You can reach a dead end, back up (undo), and try another route.
- **It scales.** Early rooms are 5×5 with one idea; late rooms combine three ideas with moving parts.

### Core verbs

| Verb | What it does in a room |
|---|---|
| **Walk** | One square per turn. The Kohen refuses (with a short explanation) to step into a square that would make him tamei met, so kids learn the rule instead of "dying". Undo is always available. |
| **Push / pull** | Crates, carts, planks, fallen beams. Used to build paths and to move roofs. |
| **Raise / lower / slide a covering** | Tents, awnings, tarps, a siege tower's platform. This is how you remove or create an ohel. |
| **Open / close** | Shutters, doors, trapdoors. Tumah passes only through an opening of a tefach or more, and a door has to stay shut by itself. |
| **Inspect** | Look closely at a jug, a seal, a mark on the ground. Opens a close-up. |
| **Pick up / set down the jug** | You can set the jug down to free your hands (to push a crate, climb), but where you set it matters. |
| **Ask a friend** | Some rooms have a helper who is already tamei met (a fighter, a Levi) and can do things you can't: move a covered body to burial, carry away a bone. They can't follow you past the gates. |

### The status panel (always on screen)
- **The Kohen:** tahor / tamei met. If he becomes tamei met the level stops and explains why, then rewinds.
- **The jug:** sealed ✓, upright ✓, nothing added ✓, never out of your care ✓.
- **Tumah view** (toggle): shades every square that is under the same roof as a met, marks bones and anything that has become tamei. Hints switch it on automatically.

### Puzzle ideas built on the big jugs
You said there could be large jugs around, but you only find one small one. The big jugs should be more than scenery:
- **Decoys during the search:** they look like the answer and aren't (see Act II).
- **Temptation later:** "The little jug won't last eight days. Top it up from this big one?" Opening the seal or mixing in tamei oil ruins the pure oil (oil is one of the seven liquids that take tumah, Rambam Tumat Okhalin 1:2). The right answer is to leave it. That sets up the miracle.
- **Obstacles:** a spilled big jug makes a slick floor; a heavy jug is a block you can push but must not open.

---

## 3. The oil checklist: what makes this jug fit for the menorah

These run through the whole game and come together on the last screen as a checklist the player fills in.

| Requirement | What it means for the game | Source |
|---|---|---|
| **Tahor** | Not touched or made tamei by anyone after it was sealed | Shabbat 21b; Rambam Chanukah 3:2 |
| **Sealed with the Kohen Gadol's seal** | The seal is the proof. Rashi: "hidden, sealed with his ring, so he knew they had not touched it" | Shabbat 21b; Rashi there |
| **Not moved** | Tosafot asks how a sealed jug could survive if the soldiers moved it, and answers that it must have been hidden in the ground. In the game, jugs that were moved don't count, and the real one is hidden | Tosafot Shabbat 21b |
| **Tightly sealed clay** | A tightly sealed clay vessel (*tzamid patil*) protects what's inside even under the same roof as a met | Bamidbar 19:15; Rambam Tumat Met 21:1 |
| **Pure olive oil, first pressing** | The menorah needs *shemen zayit zach katit*: the best, first oil. The jug's label shows it | Shemot 27:20; Mishnah Menachot 8:4-5 |
| **Enough for one night** | Half a log per lamp, seven lamps: three and a half log | Mishnah Menachot 9:3 |

**Why bother searching?** A grown-up question kids will ask: if tumah is allowed for the whole community (*tumah hutra b'tzibur*), why not use the tamei oil? The Why? card for the finding scene gives the short version: the Rambam rules that tumah is only *pushed aside* (*dechuyah*) for the community, so you must look for pure oil first (Yoma 6b; Rambam Bi'at HaMikdash 4:15; more answers in research file 03, §5).

---

## 4. Level outline (first pass, 16 levels)

### Act I: up to the Mikdash (introduces tumat met)
| # | Level | New idea | Source |
|---|---|---|---|
| 1 | **The Supply Tent** | Tutorial: walk, push, pick up. You're tahor because you stayed with the supplies | Bamidbar 19:11 |
| 2 | **Same Roof** | A covered fallen fighter lies under a long market awning. Lower part of it or find a route that's never under the same roof | Rambam Tumat Met 1:10, 12:1 |
| 3 | **The Siege Tower** | A siege tower's platform overhangs the street: it's an ohel. Roll it back so the overhang leaves your path | Rambam Tumat Met 12:1, 13:2 |
| 4 | **Don't Kick It** | A tiny bone in the rubble doesn't spread tumah by roof, only by touching or moving it. Don't push a crate over it | Rambam Tumat Met 1:7, 2:10 |
| 5 | **The Gate of the Cheil** | Your tamei friend can help you clear the way but must stop at the Cheil. You go on alone | Mishnah Kelim 1:8 |

### Act II: the search (the big jugs)
| # | Level | New idea | Source |
|---|---|---|---|
| 6 | **Beit Shemaniya** | The oil chamber in the corner of the Ezrat Nashim. Every big jug is open or knocked over | Mishnah Middot 2:5 |
| 7 | **Read the Seal** | Inspect seals: broken, missing, an ordinary seal, a seal that's been redone. Compare to the Kohen Gadol's ring | Shabbat 21b; Rashi |
| 8 | **Dust Rings** | A jug with a perfect seal but a fresh dust ring next to it: it was moved. Not good enough | Tosafot Shabbat 21b |
| 9 | **The Dark Storeroom** | Only by following clues (a loose floor tile, a sealed niche) do you find the small hidden jug | Tosafot Shabbat 21b; Rambam Chanukah 3:2 |

### Act III: the carry back
| # | Level | New idea | Source |
|---|---|---|---|
| 10 | **Hands Full** | You can set the jug down only on safe squares. Plan where to leave it while you move a beam | |
| 11 | **Sealed Is Safe** | The only route passes a room with a met. The jug's tight seal would protect the oil, but you still mustn't go under that roof. Find a window shutter to close (a tefach matters) | Bamidbar 19:15; Rambam Tumat Met 14:1 |
| 12 | **The Door That Stands by Itself** | A door held shut by a person doesn't block tumah; a door wedged with a stone does | Rambam Tumat Met 18:3 |
| 13 | **Just a Little More Oil?** | The temptation puzzle: a big jug of tamei oil sits right on your path. Leave the seal alone | Rambam Tumat Okhalin 1:2 |
| 14 | **Up the Courtyards** | Each gate checks your status and the jug's (Ezrat Nashim, Ezrat Yisrael, Ezrat Kohanim) | Mishnah Kelim 1:8-9 |

### Finale: the menorah
| # | Level | New idea | Source |
|---|---|---|---|
| 15 | **The Kiyor** | Wash hands and feet before going into the Heichal | Shemot 30:19-21 |
| 16 | **Spears and Lamps** | The gold menorah is gone. Build one from iron spears, fill seven lamps with half a log each, and light. Then the eight-day ending | Rosh Hashanah 24b (= Menachot 28b, Avodah Zarah 43a); Mishnah Menachot 9:3; Shabbat 21b |

**Ending:** night by night the lamps keep burning while, in the background, olives are pressed and new pure oil is made (Rambam Chanukah 3:2: "until they crushed olives and produced pure oil"). Why it took eight days is its own Why? card (Ran and Maharsha: the olives were four days away; or everyone was tamei met and needed seven days; research file 03, §5).

---

## 5. Handling the war, for kids

- No fighting on screen. The game starts after the battle.
- The fallen are shown as covered, still shapes with respect, never bodies or blood. The text says plainly that burying them is a mitzvah and that becoming tamei for it is good; it's just that *you* can't today, because you're needed in the Mikdash.
- Bones are small, plain and not scary.
- Left out: the rabbinic decree treating gentiles like zavim (it's the deeper reason sealed jugs mattered, but it isn't appropriate here), and the idols the Greeks set up. Middot 1:6's defiled altar stones can appear as a background detail.

---

## 6. Graphics: what we need to decide

The previous art was drawn in code by an AI: first as three.js dioramas, then as flat SVG. Both came out generic. The format above doesn't depend on one art style, so the code will keep all art behind a sprite/asset layer and the style can be swapped without touching the puzzles.

The real options:

| Option | Looks like | What it takes | Risk |
|---|---|---|---|
| **A. Illustrated 2D sprites** (painted or vector, from a human artist or an image generator) | A storybook or modern mobile game | Someone produces ~40 tiles/props + 2 characters + a few close-ups, to a consistent spec. I write the spec and the pipeline | Needs an art source outside this repo |
| **B. Pixel art** | *Stardew Valley*, *Eastward* | Can be drawn in code or bought as a pack, then customized; easy to keep consistent | Ancient-Temple packs are rare; code-drawn pixel art has the same ceiling as before |
| **C. Bold flat vector (SVG)** with a strict design system | *Monument Valley*, *Alto's*, Kurzgesagt | Achievable in code, but only with tight reference images to copy the shapes, palette and lighting from | This is what failed last time without references |
| **D. Low-poly 3D** | *Lara Croft GO* | three.js is already in the repo | Also tried; same problem |

**What would help most:** 3–5 reference images of the exact look you want (games, illustrations, anything), plus whether you're open to using an image generator or a paid asset pack. With those, I'd make one test room (the Beit Shemaniya storeroom with the big jugs) in that style before building the rest.

---

## 7. Build plan once the art direction is set

1. Grid engine: rooms from data files, turn loop, undo, push/pull, coverings, the jug, a "tumah view" built on `js/engine/tumah.js` (ohel zones, touch, carry).
2. Levels 1–5 playable with placeholder tiles, so the gameplay can be tested before the art is final.
3. Art pipeline for the chosen style, starting with the test room.
4. Acts II–III and the finale.
5. Bilingual text (English/Hebrew), Why? cards with Sefaria links, the oil checklist, saving progress on the device.
6. Tests for every level's solution and every rule, and a review by a rav before release.

---

## 8. Open questions

1. **Start over or keep the current game?** My suggestion: build this as the new main game on this branch and keep the current puzzles reachable from a menu (or as `legacy` pages) rather than deleting them.
2. **Grid adventure OK?** Or do you want something with free movement (a side-scroller where you walk and jump)? Free movement is more "game-like" but makes the tumah rules fuzzier and adds reflex difficulty.
3. **Who is the hero?** A named young Kohen (Eli from the earlier version, or someone new), and does Yehuda HaMaccabi appear?
4. **Age range:** still 7+? That decides how hard Act III gets and how much text the Why? cards carry.
5. **The friend who's tamei met:** good as a helper character, or too confusing?
6. **Where the jug is found:** the Gemara says only that it was found; the oil chamber (Beit Shemaniya) is my choice for where the search starts, and "hidden in the floor" follows Tosafot. Fine with you?

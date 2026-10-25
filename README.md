# Tehara · טהרה

A side-view puzzle game for kids (7 and up, adults welcome) about the laws of **tumah and taharah**, based on the Mishnah, the Gemara and the Rambam's Sefer Taharah.

It plays like the "pull the pin" puzzle games, with decoys that look dangerous but aren't, and traps that look safe but aren't: a young Kohen walks through cut-away rooms, fields and roads, and you pull pins, cut branches, test stones, blow away soil, paint lime marks and seal jars so he reaches the goal without becoming tamei. Every win or fail is decided by a small rules engine that follows the halacha, and every level ends with a **Why?** card that explains the rule and links to the sources on Sefaria. English and Hebrew.

## What's in version 1

| Pack | Levels |
|---|---|
| **World 1: The Road to Pesach.** Eli travels up to Yerushalayim | 1-1 Three Ways Down · 1-2 The Barn · 1-3 The Bone Bridge · 1-4 The Gardener's Tree · 1-5 Stones That Don't Wobble · 1-6 The Leaf-Blower Field · 1-7 The Washed-Away Mark · 1-8 Read the White Marks · 1-9 Trees or No Trees? · 1-10 The Pilgrims' Path |
| **Chanukah: The Sealed Jug.** Yehuda helps the Chashmona'im | C-1 The Stones of the Altar · C-2 They Searched · C-3 Sealed Tight · C-4 Oil Is a Liquid · C-5 Pure Oil Run · C-6 Eight Nights |

## Play it locally

```bash
tools/serve.sh          # or: python3 -m http.server 8000
# open http://localhost:8000
```

- Levels unlock one at a time. For play-testing, open `http://localhost:8000/?unlock=all` to unlock everything.
- Jump straight to a level with `#level=1-6` (or `C-3`, etc.).
- Progress, language and sound are saved in the browser.

## Tests

```bash
node --test tests/*.test.js          # the rules engine: each test names its source
node tests/e2e/levels.e2e.js         # plays every level in a real browser (needs Playwright + Chromium)
ONLY=1-6 node tests/e2e/levels.e2e.js
```

The browser test plays each level's solution and checks that it wins, and plays the wrong moves and checks that they fail.

## How it's built

Plain HTML, CSS and JavaScript with no build step. Everything is drawn on a 540×960 canvas.

| Path | What it is |
|---|---|
| `js/engine/tumah.js` | **The rules engine.** What conveys tumah and how, Kohanim, ohel, Beit HaPeras, lime marks, tzamid patil, liquids, the Chanukah jug. Each rule names its source |
| `js/levels/w1/`, `js/levels/ch/` | The levels, one file each: its rooms, hints, decoys and Why? card |
| `js/levels/world1.js`, `js/levels/chanukah.js` | The level lists and helpers shared by a pack |
| `js/levels/kit.js` | Shared pieces: golden pins, tweens, paths |
| `js/gfx.js`, `js/chars.js` | The storybook art and characters, drawn in code (textured rock and Jerusalem stone, stairs, ladders, tombs) |
| `tools/showcase.html` | A page that shows the whole drawing kit, for working on the art |
| `js/game.js` | The level runtime: rooms, fail and rewind, stars, sounds |
| `js/app.js`, `js/i18n.js` | Screens, progress, English and Hebrew |

## Design and research

- [Game design plan](docs/GAME_DESIGN.md)
- [Level designs](docs/LEVELS.md), including about 40 more level ideas for later worlds
- Research:
  - [Ad-style puzzle game formats](docs/research/01-game-formats.md)
  - [Tumah levels: the rules engine](docs/research/02-halacha-tumah-levels.md)
  - [Tumat met, Kohanim, Beit HaPeras and the holidays](docs/research/03-halacha-tumat-met-kohanim-holidays.md)

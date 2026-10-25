# Tehara illustrated rebuild

## Intended experience

The original brief describes short, understandable environmental puzzles: look at a room, change its structure, then watch the hero cross. The religious learning should explain an observable consequence. The opening should teach how the game works before asking players to understand several interacting hazards.

The new version keeps the core journey, subject, characters, bilingual presentation, and source-linked rules. It uses an illustrated storybook direction: warm paper, olive hills, Jerusalem stone, gold controls, and a restrained violet cue for shared ohel. SVG artwork keeps the game sharp on phones without a GPU requirement or an initial module-loading delay.

## Gameplay changes

The first puzzle teaches a single pin. Later puzzles introduce a shared roof, a separate arch above a single bone, a branch over a grave, stable stones, a checked field, appropriate lime margins, a lost whole grave, tevilah and sunset, and the terumah exception. The field requires four revealed columns and four actual selected footsteps; bone contacts are rejected without clearing the previous safe steps.

Chanukah has its own six-puzzle progression. The final image is explicitly the seven-branched Mikdash menorah. Its explanation distinguishes those seven lamps from the eight-day miracle and the Chanukah lights at home.

Failure is immediate and explanatory. No death animation, locked waiting period, lives, ads, or timers. Hints affect the current run's stars but cannot prevent progress. Best stars persist. New progress is namespaced separately from the original campaign because the puzzles and IDs no longer describe the same experiences.

## Coverage and limits

This is a playable first rebuild, not every proposed world from the original design document. Worlds about food transmission, bikurim, and Parah Adumah are still future work. Several original multi-room levels have been replaced with focused single-scene puzzles. The research files and legacy implementation remain available for further development.

The original engine is used for halachic outcomes; bridge mechanics, route preparation, searching shelves, and lighting lamps use explicit puzzle state. Rendering and animation never decide a religious rule. Sources are carried beside each explanation. The numerical margins in the lime puzzle are explicitly illustrative, not a prescribed halachic measurement.

The jar-identification puzzle retains the original research's interpretation concerning an unmoved jug; its card identifies this as the interpretation used, not a new independent determination. The original brief's planned review by a rav is still outstanding. Child playtesting and Safari/Firefox checks are also outstanding.

## Verification evidence

- 82 passing Node tests: retained engine cases, all 16 new solutions, representative incorrect choices, and bilingual copy/source completeness.
- 26 passing Chromium browser scenarios: all 16 solutions; error recovery with a hint; keyboard pin activation and restart cancellation; actual SVG field steps with a rejected bone; persistence and 16 notebook cards; phone layout; Hebrew RTL; fresh-player locks; and offline reload after service-worker activation.
- Desktop screenshots inspected at 1440px and mobile at 390px. No horizontal overflow detected on the tested home/game layouts. No uncaught browser errors in the campaign suite.
- No application API or database is required; data flow is browser input → puzzle state → original rules engine → scene/feedback → local storage.

## Review

Start the server and open the normal entrypoint. Both chapters can start immediately; levels within a chapter unlock sequentially. For review use `?unlock=all#level=1-6`. Compare the previous version at `legacy.html`.

`python3 tools/build-preview.py` generates `artifacts/tehara-preview.html`. Download it and open it directly in a modern browser for a standalone preview; the service worker is only registered on HTTP(S). Source links remain external. Browser-specific restrictions can prevent saving progress for a file URL, so the served version is the authoritative persistence test.

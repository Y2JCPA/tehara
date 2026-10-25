/* ============================================
   TEHARA: the rules engine
   Every win or fail in the game is decided here, not in the level code,
   so a level can't teach something the halacha doesn't say.
   Each rule returns { ok/result, rule, src } where src names the
   controlling source (Rambam's Sefer Taharah first).
   Research and full quotes: docs/research/02-*.md and 03-*.md
   ============================================ */
const Tumah = (function () {
  // ---------- 1. What conveys tumah, and how ----------
  // Modes: touch (מגע), carry (משא, which includes moving it: היסט),
  // ohel (being under one roof with it, or over it).
  const CONVEYS = {
    // A corpse: touch, carry and ohel (Rambam Tumat Met 1:1-2, 1:10)
    met:        { touch: true,  carry: true,  ohel: true,  src: 'Rambam, Tumat Met 1:1-2, 1:10' },
    // A closed grave with the tumah inside: touch and ohel, Torah law (Tumat Met 2:15)
    grave:      { touch: true,  carry: false, ohel: true,  src: 'Rambam, Tumat Met 2:15' },
    // A single bone, even barley-sized: touch and carry, never ohel (Tumat Met 2:10)
    bone:       { touch: true,  carry: true,  ohel: false, src: 'Rambam, Tumat Met 2:10' },
    // Earth of a field where a grave was plowed: touch and carry, not ohel; Rabbinic (Tumat Met 10:2)
    plowedField:{ touch: true,  carry: true,  ohel: false, src: 'Rambam, Tumat Met 10:2; Oholot 18:2' },
    // A field where a whole grave was lost: touch, carry and ohel (Oholot 18:3)
    lostGraveField: { touch: true, carry: true, ohel: true, src: 'Mishnah Oholot 18:3; Moed Katan 5b' },
    // A sheretz (dead mouse, lizard): touch only, not carry, not ohel (She'ar Avot HaTumot 4:2)
    sheretz:    { touch: true,  carry: false, ohel: false, src: "Rambam, She'ar Avot HaTumot 4:2" },
    // A nevelah (an animal that died by itself): touch and carry, not ohel (She'ar Avot HaTumot 1:1; Tumat Met 1:10)
    nevelah:    { touch: true,  carry: true,  ohel: false, src: "Rambam, She'ar Avot HaTumot 1:1; Tumat Met 1:10" },
  };

  // Which kinds are part of tumat met (forbidden to a Kohen)
  const FROM_MET = { met: true, grave: true, bone: true, plowedField: true, lostGraveField: true };

  function conveys(kind, mode) {
    const k = CONVEYS[kind];
    if (!k) throw new Error('Unknown tumah kind: ' + kind);
    if (!(mode in k)) throw new Error('Unknown mode: ' + mode);
    return { result: k[mode], src: k.src };
  }

  // Moving something by pressing a plank it lies on counts as carrying (היסט)
  // (Rambam Tumat Met 1:7: "מסיט בכלל נושא")
  function moveViaPlank(kind) {
    return { result: conveys(kind, 'carry').result, src: 'Rambam, Tumat Met 1:7' };
  }

  // Walking over it, with nothing touching it
  function passOver(kind) {
    return conveys(kind, 'ohel');
  }

  // ---------- 2. Kohanim ----------
  // A Kohen may not become tamei from a met (Vayikra 21:1; Rambam Avel 3:1),
  // but may from every other tumah (Rambam Tumat Okhalin 16:9).
  function kohenMay(kind) {
    if (FROM_MET[kind]) return { ok: false, src: 'Vayikra 21:1; Rambam, Avel 3:1' };
    return { ok: true, src: 'Rambam, Tumat Okhalin 16:9' };
  }

  // A met "holds" 4 amot; a Kohen may not come inside them (Rambam Avel 3:13)
  const MET_DISTANCE_AMOT = 4;
  function kohenDistanceOk(amot) {
    return { ok: amot >= MET_DISTANCE_AMOT, src: 'Rambam, Avel 3:13' };
  }

  // ---------- 3. A person who touched something ----------
  // Returns the person's new status.
  function personTouches(kind) {
    if (kind === 'nevelah') return { status: 'rishon', until: 'evening', src: "Rambam, She'ar Avot HaTumot 1:1" };
    if (kind === 'sheretz') return { status: 'rishon', until: 'evening', src: 'Vayikra 11:31; Rambam, Tumat Met 5:7' };
    if (FROM_MET[kind]) return { status: 'tameiMet', until: 'day7', src: 'Bamidbar 19:11; Rambam, Tumat Met 5:1-2' };
    return { status: 'tahor' };
  }

  // A sheretz pushed away with a stick: it conveys only by touch, not by moving
  function personMovesWithStick(kind) {
    const carries = conveys(kind, 'carry').result;
    return { status: carries ? personTouches(kind).status : 'tahor', src: conveys(kind, 'carry').src };
  }

  // Eating terumah: someone tamei until evening needs tevilah AND nightfall
  // (three medium stars) (Vayikra 22:7; Rambam Terumot 7:2)
  function canEatTerumah(p) {
    if (p.status === 'tahor') return { ok: true };
    if (p.status === 'tameiMet') return { ok: false, need: 'sprinkling', src: 'Bamidbar 19:12' };
    if (!p.immersed) return { ok: false, need: 'mikveh', src: 'Vayikra 22:6' };
    if (!p.starsOut) return { ok: false, need: 'stars', src: 'Rambam, Terumot 7:2' };
    return { ok: true, src: 'Rambam, Terumot 7:2' };
  }

  // ---------- 4. Ohel ----------
  // A cover of at least 1x1 tefach and 1 tefach high brings tumah and blocks it
  // (Rambam Tumat Met 12:1). A strong one does so by Torah law; a weak one
  // (thin branches) brings it by Rabbinic law and doesn't block (13:2).
  function ohelCover({ widthTefach = 1, heightTefach = 1, sturdy = true }) {
    if (widthTefach < 1 || heightTefach < 1) return { brings: false, blocks: false, src: 'Rambam, Tumat Met 12:1' };
    if (sturdy) return { brings: true, blocks: true, level: 'doraita', src: 'Rambam, Tumat Met 12:1, 13:2' };
    return { brings: true, blocks: false, level: 'derabbanan', src: 'Rambam, Tumat Met 13:2' };
  }

  // People and vessels can bring tumah as an ohel, but can't block it; a board
  // resting on stones or on a live animal does block (Mishnah Oholot 6:1;
  // Rambam Tumat Met 18:3: a door held shut by a person doesn't block)
  function coverBlocks(heldBy) {
    const blocks = heldBy === 'stones' || heldBy === 'animal' || heldBy === 'itself';
    return { blocks, src: 'Mishnah Oholot 6:1; Rambam, Tumat Met 18:3' };
  }

  // Is a spot under a cover that also covers a met or grave?
  function underSameOhel(coverReachesSpot, coverReachesTumah, cover = {}) {
    const c = ohelCover(cover);
    return { result: c.brings && coverReachesSpot && coverReachesTumah, src: 'Rambam, Tumat Met 1:10, 13:2' };
  }

  // ---------- 5. Beit HaPeras ----------
  // field: 'plowed' (a grave was plowed) | 'lost' (a grave was lost in it)
  // method: 'walk' | 'blow' | 'stones' | 'ride' | 'trodden'
  // opts: { solid, strong } for stones / ride
  // purpose: 'pesach' | 'mitzvah' | 'terumah' | 'mikdash'
  // Returns { tahor, reason, src }
  function crossField({ field, method, solid, strong, purpose }) {
    if (field === 'lost') {
      // A whole grave conveys by ohel, so passing over it in any way is tamei
      return { tahor: false, reason: 'ohel', src: 'Mishnah Oholot 18:3; Rambam, Tumat Met 10:10' };
    }
    if (field !== 'plowed') throw new Error('Unknown field: ' + field);
    switch (method) {
      case 'walk':
        return { tahor: false, reason: 'touch', src: 'Rambam, Tumat Met 10:2' };
      case 'stones':
        return solid
          ? { tahor: true, src: 'Rambam, Tumat Met 10:11' }
          : { tahor: false, reason: 'wobbly', src: 'Rambam, Tumat Met 10:11' };
      case 'ride':
        return strong
          ? { tahor: true, src: 'Rambam, Tumat Met 10:11' }
          : { tahor: false, reason: 'weak', src: 'Rambam, Tumat Met 10:11' };
      case 'blow':
        // "מנפח אדם בית הפרס והולך" (Berakhot 19b), even a Kohen (Rambam Eruvin 6:17),
        // and he brings his Pesach (Korban Pesach 6:8). Not relied on for terumah
        // ("אין בודקין לתרומה", Oholot 18:4), nor for anything holier.
        if (purpose === 'terumah' || purpose === 'mikdash') {
          return { tahor: false, reason: 'notForTerumah', src: 'Mishnah Oholot 18:4; Rashi, Berakhot 19b' };
        }
        return { tahor: true, src: 'Berakhot 19b; Rambam, Eruvin 6:17; Korban Pesach 6:8' };
      case 'trodden':
        // A trodden Beit HaPeras is tahor for the one bringing the Pesach (Korban Pesach 6:8)
        if (purpose === 'pesach') return { tahor: true, src: 'Rambam, Korban Pesach 6:8' };
        return { tahor: false, reason: 'onlyPesach', src: 'Rambam, Korban Pesach 6:8' };
      default:
        throw new Error('Unknown method: ' + method);
    }
  }

  // A marked field of unknown kind: trees = plowed grave, no trees = lost grave
  // (Rambam Tumat Met 10:10, 8:10)
  function markedFieldKind(hasTrees) {
    return { field: hasTrees ? 'plowed' : 'lost', src: 'Rambam, Tumat Met 10:10' };
  }

  // ---------- 6. Lime markings ----------
  // Marks go a little beyond the tumah (so taharot aren't lost) but not far
  // (so the land isn't lost) (Rambam Tumat Met 8:9). The game picks the band.
  const LIME_BAND = { min: 0.06, max: 0.4 }; // extra size, as a fraction of the tumah's size
  function limeMark(markSize, tumahSize) {
    const extra = markSize / tumahSize - 1;
    if (extra < LIME_BAND.min) return { result: 'tooTight', src: 'Rambam, Tumat Met 8:9' };
    if (extra > LIME_BAND.max) return { result: 'tooWide', src: 'Rambam, Tumat Met 8:9' };
    return { result: 'ok', src: 'Rambam, Tumat Met 8:9' };
  }

  // Reading marks on a 3x3 field (cells 0-8, row by row; edges 0 top, 1 right,
  // 2 bottom, 3 left) (Rambam Tumat Met 8:11). Returns { tamei: cells, edges }.
  // pattern: 'oneStone' {cell} | 'twoStonesLimeBetween' {row} |
  //          'twoStonesSherdsBetween' {row} | 'twoStonesLimeOnTop' {row} |
  //          'fourEdges' | 'oneEdge' {edge}
  function readMarks(pattern, opts = {}) {
    const src = 'Rambam, Tumat Met 8:11';
    const row = r => [r * 3, r * 3 + 1, r * 3 + 2];
    switch (pattern) {
      case 'oneStone': return { tamei: [opts.cell], edges: [], src };            // "תחתיה טמא"
      case 'twoStonesLimeBetween': return { tamei: row(opts.row), edges: [], src }; // "ביניהן טמא"
      case 'twoStonesSherdsBetween': return { tamei: [], edges: [], src };      // lime on top, sherd between: "אין זה אלא בניין"
      case 'twoStonesLimeOnTop': return { tamei: row(opts.row), edges: [], src }; // lime spread on top, no sherd: "הרי זה ציון וטמא"
      case 'fourEdges': return { tamei: [0, 1, 2, 3, 4, 5, 6, 7, 8], edges: [], src }; // edges tahor, whole field tamei
      case 'oneEdge': return { tamei: [], edges: [opts.edge], src };            // the edge is tamei, the field tahor
      default: throw new Error('Unknown pattern: ' + pattern);
    }
  }

  // Which places get a lime mark? Only doubtful ones: a field where a grave
  // was lost, branches and jutting stones over a grave. Not well-known graves,
  // and not an exact k'zayit, which will shrink in the ground (Rambam Tumat Met 8:9)
  function shouldMark(kind) {
    const src = 'Rambam, Tumat Met 8:9';
    if (kind === 'lostGrave' || kind === 'branches' || kind === 'juttingStone') return { mark: true, src };
    if (kind === 'knownCemetery') return { mark: false, reason: 'known', src };
    if (kind === 'kzayit') return { mark: false, reason: 'shrinks', src };
    throw new Error('Unknown place: ' + kind);
  }

  // ---------- Mikveh ----------
  // Rainwater gathered by itself is a kosher mikveh; drawn water (שאובין) is
  // invalid by Rabbinic law (Rambam Mikvaot 4:1-2)
  function mikveh({ drawn }) {
    return drawn ? { valid: false, level: 'derabbanan', src: 'Rambam, Mikvaot 4:2' } : { valid: true, src: 'Rambam, Mikvaot 4:1' };
  }

  // ---------- 7. Vessels in an ohel with a met (tzamid patil) ----------
  // material: 'clay' | 'stone' | 'metal' ; sealed: tightly sealed (צמיד פתיל)
  // item: 'oil' / 'food' (food or drink) | 'clay' | 'metal' | 'stone'
  const NEVER_TAMEI = { stone: true }; // also dung and earth vessels (Rambam Kelim 1:6)
  function vesselInOhel({ material, sealed }) {
    if (NEVER_TAMEI[material]) return { tahor: true, src: 'Mishnah Kelim 10:1; Rambam, Kelim 1:6' };
    if (material === 'clay') return { tahor: !!sealed, src: 'Bamidbar 19:15; Rambam, Tumat Met 21:1' };
    return { tahor: false, src: 'Rambam, Tumat Met 21:1' }; // metal: tamei, sealed or not
  }

  // A clay vessel becomes tamei only through its inside (or a zav moving it),
  // never by being touched on the outside (Rambam Kelim 13:1)
  function clayTouchedOutside() {
    return { tahor: true, src: 'Rambam, Kelim 13:1' };
  }

  function itemInOhel({ item, vessel }) {
    const src = 'Mishnah Kelim 10:1; Rambam, Tumat Met 21:1';
    if (NEVER_TAMEI[item]) return { tahor: true, src };
    if (!vessel || !vessel.sealed) return { tahor: false, src };
    if (NEVER_TAMEI[vessel.material]) return { tahor: true, src };        // stone saves everything
    if (vessel.material === 'clay') {                                      // clay saves food, drink and clay only
      return { tahor: item === 'oil' || item === 'food' || item === 'clay', src };
    }
    return { tahor: false, src };                                          // metal saves nothing
  }

  // ---------- 8. Liquids and hands ----------
  // Levels: 'tahor', 'av', 1, 2, 3
  // A liquid that touches anything tamei (Av, Rishon or Sheni) becomes Rishon
  // (Rambam She'ar Avot HaTumot 7:5; Parah 8:7)
  function liquidTouches(otherLevel) {
    if (otherLevel === 'tahor' || otherLevel === 3) return { level: 'tahor', src: "Rambam, She'ar Avot HaTumot 7:5" };
    return { level: 1, src: "Rambam, She'ar Avot HaTumot 7:5; Mishnah Parah 8:7" };
  }

  // Hands that weren't washed count as Sheni, by Rabbinic law (She'ar Avot HaTumot ch. 8)
  function hands(washed) {
    return { level: washed ? 'tahor' : 2, src: "Rambam, She'ar Avot HaTumot 8" };
  }

  // ---------- 9. Chanukah ----------
  // A jug of oil after the Greeks were in the Heichal: pure only if it lay
  // sealed with the Kohen Gadol's seal, intact and unmoved (Shabbat 21b and
  // Rashi there: "hidden and sealed... he recognized they hadn't touched it";
  // Tosafot there on moving)
  function jugIsPure({ sealed, intact, moved }) {
    const src = 'Shabbat 21b; Rashi there';
    if (!sealed) return { pure: false, reason: 'noSeal', src };
    if (!intact) return { pure: false, reason: 'broken', src };
    if (moved) return { pure: false, reason: 'moved', src: 'Shabbat 21b, Tosafot there' };
    return { pure: true, src };
  }

  // For the whole community, tumah is only pushed aside (דחויה), so first
  // search for a pure way (Rambam Bi'at HaMikdash 4:15)
  function communityTumah() {
    return { status: 'dechuya', mustSearchFirst: true, src: "Rambam, Bi'at HaMikdash 4:15" };
  }

  return {
    conveys, moveViaPlank, passOver,
    kohenMay, kohenDistanceOk, MET_DISTANCE_AMOT,
    personTouches, personMovesWithStick, canEatTerumah,
    ohelCover, underSameOhel,
    crossField, markedFieldKind,
    LIME_BAND, limeMark, readMarks, shouldMark, mikveh, coverBlocks,
    vesselInOhel, itemInOhel, clayTouchedOutside,
    liquidTouches, hands,
    jugIsPure, communityTumah,
  };
})();

if (typeof module !== 'undefined') module.exports = Tumah;

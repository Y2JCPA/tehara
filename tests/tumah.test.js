// Run with: node --test tests/
// Each test names the source it checks.
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../js/engine/tumah.js');

test('a met conveys by touch, carrying and ohel (Rambam Tumat Met 1:1-2, 1:10)', () => {
  assert.equal(T.conveys('met', 'touch').result, true);
  assert.equal(T.conveys('met', 'carry').result, true);
  assert.equal(T.conveys('met', 'ohel').result, true);
});

test('a grave conveys by touch and ohel (Rambam Tumat Met 2:15)', () => {
  assert.equal(T.conveys('grave', 'touch').result, true);
  assert.equal(T.passOver('grave').result, true);
});

test('a single bone: touch and carry, never ohel (Rambam Tumat Met 2:10)', () => {
  assert.equal(T.conveys('bone', 'touch').result, true);
  assert.equal(T.conveys('bone', 'carry').result, true);
  assert.equal(T.passOver('bone').result, false);
});

test('pressing a plank a bone lies on counts as carrying it (Rambam Tumat Met 1:7)', () => {
  assert.equal(T.moveViaPlank('bone').result, true);
  assert.equal(T.moveViaPlank('bone').src, 'Rambam, Tumat Met 1:7');
});

test('ohel is only for a met, not a sheretz (Rambam Tumat Met 1:10)', () => {
  assert.equal(T.passOver('sheretz').result, false);
});

test('a sheretz conveys by touch only, not by moving (She\'ar Avot HaTumot 4:2)', () => {
  assert.equal(T.personTouches('sheretz').status, 'rishon');
  assert.equal(T.personMovesWithStick('sheretz').status, 'tahor');
});

test('moving a bone with a stick is carrying it (Tumat Met 2:10)', () => {
  assert.equal(T.personMovesWithStick('bone').status, 'tameiMet');
});

test('a Kohen may not become tamei met but may from a sheretz (Avel 3:1; Tumat Okhalin 16:9)', () => {
  for (const k of ['met', 'grave', 'bone', 'plowedField', 'lostGraveField']) assert.equal(T.kohenMay(k).ok, false, k);
  assert.equal(T.kohenMay('sheretz').ok, true);
});

test('a Kohen keeps 4 amot from a met (Rambam Avel 3:13)', () => {
  assert.equal(T.kohenDistanceOk(3).ok, false);
  assert.equal(T.kohenDistanceOk(4).ok, true);
});

test('terumah after a sheretz needs mikveh and three stars (Vayikra 22:7; Terumot 7:2)', () => {
  assert.equal(T.canEatTerumah({ status: 'tahor' }).ok, true);
  assert.equal(T.canEatTerumah({ status: 'rishon' }).need, 'mikveh');
  assert.equal(T.canEatTerumah({ status: 'rishon', immersed: true }).need, 'stars');
  assert.equal(T.canEatTerumah({ status: 'rishon', immersed: true, starsOut: true }).ok, true);
  assert.equal(T.canEatTerumah({ status: 'tameiMet', immersed: true, starsOut: true }).ok, false);
});

test('strong branches bring and block tumah by Torah law; weak ones only bring it, Rabbinically (Tumat Met 13:2)', () => {
  assert.deepEqual(
    [T.ohelCover({ sturdy: true }).brings, T.ohelCover({ sturdy: true }).blocks, T.ohelCover({ sturdy: true }).level],
    [true, true, 'doraita']);
  assert.deepEqual(
    [T.ohelCover({ sturdy: false }).brings, T.ohelCover({ sturdy: false }).blocks, T.ohelCover({ sturdy: false }).level],
    [true, false, 'derabbanan']);
});

test('a cover smaller than a tefach is not an ohel (Tumat Met 12:1)', () => {
  assert.equal(T.ohelCover({ widthTefach: 0.5 }).brings, false);
});

test('the road under a branch that also covers a grave is tamei; prune it and it is tahor', () => {
  assert.equal(T.underSameOhel(true, true).result, true);
  assert.equal(T.underSameOhel(false, true).result, false);
});

test('Beit HaPeras: walking on the earth is tamei (Tumat Met 10:2)', () => {
  assert.equal(T.crossField({ field: 'plowed', method: 'walk' }).tahor, false);
});

test('Beit HaPeras: solid stones or a strong animal are tahor; wobbly or weak are not (Tumat Met 10:11)', () => {
  assert.equal(T.crossField({ field: 'plowed', method: 'stones', solid: true }).tahor, true);
  assert.equal(T.crossField({ field: 'plowed', method: 'stones', solid: false }).tahor, false);
  assert.equal(T.crossField({ field: 'plowed', method: 'ride', strong: true }).tahor, true);
  assert.equal(T.crossField({ field: 'plowed', method: 'ride', strong: false }).tahor, false);
});

test('Beit HaPeras: blowing works for the Pesach and for a Kohen on a mitzvah, not for terumah (Berakhot 19b; Eruvin 6:17; Oholot 18:4)', () => {
  assert.equal(T.crossField({ field: 'plowed', method: 'blow', purpose: 'pesach' }).tahor, true);
  assert.equal(T.crossField({ field: 'plowed', method: 'blow', purpose: 'mitzvah' }).tahor, true);
  assert.equal(T.crossField({ field: 'plowed', method: 'blow', purpose: 'terumah' }).tahor, false);
  assert.equal(T.crossField({ field: 'plowed', method: 'blow', purpose: 'mikdash' }).tahor, false);
});

test('a trodden Beit HaPeras is tahor for the one bringing the Pesach (Korban Pesach 6:8)', () => {
  assert.equal(T.crossField({ field: 'plowed', method: 'trodden', purpose: 'pesach' }).tahor, true);
});

test('a lost-grave field can not be crossed in any way (Oholot 18:3)', () => {
  for (const m of [{ method: 'walk' }, { method: 'blow', purpose: 'pesach' }, { method: 'stones', solid: true }, { method: 'ride', strong: true }]) {
    assert.equal(T.crossField({ field: 'lost', ...m }).tahor, false, m.method);
  }
});

test('a marked field with trees is a plowed grave; without, a lost grave (Tumat Met 10:10)', () => {
  assert.equal(T.markedFieldKind(true).field, 'plowed');
  assert.equal(T.markedFieldKind(false).field, 'lost');
});

test('lime marks: a little wider than the tumah, not much wider (Tumat Met 8:9)', () => {
  assert.equal(T.limeMark(100, 100).result, 'tooTight');
  assert.equal(T.limeMark(120, 100).result, 'ok');
  assert.equal(T.limeMark(200, 100).result, 'tooWide');
});

test('reading lime marks (Tumat Met 8:11)', () => {
  assert.deepEqual(T.readMarks('oneStone', { cell: 4 }).tamei, [4]);
  assert.deepEqual(T.readMarks('twoStonesLimeBetween', { row: 1 }).tamei, [3, 4, 5]);
  assert.deepEqual(T.readMarks('twoStonesSherdsBetween').tamei, []);
  assert.equal(T.readMarks('fourEdges').tamei.length, 9);
  assert.equal(T.readMarks('fourEdges').edgesTahor, true);
});

test('vessels in an ohel with a met: open clay tamei, sealed clay tahor, stone never, metal always (Bamidbar 19:15; Kelim 10:1)', () => {
  assert.equal(T.vesselInOhel({ material: 'clay', sealed: false }).tahor, false);
  assert.equal(T.vesselInOhel({ material: 'clay', sealed: true }).tahor, true);
  assert.equal(T.vesselInOhel({ material: 'stone', sealed: false }).tahor, true);
  assert.equal(T.vesselInOhel({ material: 'metal', sealed: true }).tahor, false);
});

test('tzamid patil: clay saves food, drink and clay; stone saves all; metal saves nothing (Mishnah Kelim 10:1)', () => {
  const clay = { material: 'clay', sealed: true };
  const stone = { material: 'stone', sealed: true };
  const metal = { material: 'metal', sealed: true };
  assert.equal(T.itemInOhel({ item: 'oil', vessel: clay }).tahor, true);
  assert.equal(T.itemInOhel({ item: 'metal', vessel: clay }).tahor, false);
  assert.equal(T.itemInOhel({ item: 'metal', vessel: stone }).tahor, true);
  assert.equal(T.itemInOhel({ item: 'oil', vessel: metal }).tahor, false);
  assert.equal(T.itemInOhel({ item: 'oil', vessel: { material: 'clay', sealed: false } }).tahor, false);
  assert.equal(T.itemInOhel({ item: 'oil' }).tahor, false);
});

test('a liquid becomes Rishon even from a Sheni (She\'ar Avot HaTumot 7:5)', () => {
  assert.equal(T.liquidTouches(2).level, 1);
  assert.equal(T.liquidTouches(1).level, 1);
  assert.equal(T.liquidTouches('av').level, 1);
  assert.equal(T.liquidTouches('tahor').level, 'tahor');
});

test('unwashed hands are Sheni (She\'ar Avot HaTumot 8)', () => {
  assert.equal(T.hands(false).level, 2);
  assert.equal(T.hands(true).level, 'tahor');
});

test('the Chanukah jug: sealed with the Kohen Gadol\'s seal, intact and unmoved (Shabbat 21b)', () => {
  assert.equal(T.jugIsPure({ sealed: true, intact: true, moved: false }).pure, true);
  assert.equal(T.jugIsPure({ sealed: true, intact: false }).reason, 'broken');
  assert.equal(T.jugIsPure({ sealed: true, intact: true, moved: true }).reason, 'moved');
  assert.equal(T.jugIsPure({}).reason, 'noSeal');
});

test('tumah for the community is only pushed aside: search first (Bi\'at HaMikdash 4:15)', () => {
  assert.equal(T.communityTumah().mustSearchFirst, true);
});

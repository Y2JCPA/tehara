/* ============================================
   TEHARA: English / Hebrew text for the menus.
   Level text lives in the level files as { en, he } pairs.
   English uses Hebrew terms in brackets, e.g. "impure [טמא]".
   ============================================ */
const I18N = (function () {
  const STR = {
    en: {
      title: 'Tehara',
      tagline: 'Puzzles of tumah and taharah',
      play: 'Play',
      language: 'עברית',
      sound: 'Sound',
      back: 'Back',
      map: 'Map',
      hint: 'Hint',
      restart: 'Restart',
      go: 'Go!',
      next: 'Next level',
      replay: 'Play again',
      why: 'Why?',
      sources: 'Sources',
      readSefaria: 'Read on Sefaria',
      world1: 'World 1: The Road to Pesach',
      world1Sub: 'Eli the young Kohen travels up to Yerushalayim',
      chanukah: 'Chanukah: The Sealed Jug',
      chanukahSub: 'Yehuda helps the Chashmona\'im find pure oil',
      locked: 'Finish the level before to unlock',
      level: 'Level',
      stars: 'stars',
      noHint: 'No hint left. Try the Why? ideas from earlier levels!',
      tryAgain: 'Let\'s try that again…',
      wellDone: 'Well done!',
      starsLine: 'Stars: ★ finish · ★★ no hint · ★★★ no hint and no mistakes',
      credits: 'Rules follow the Rambam\'s Sefer Taharah, the Mishnah and the Gemara. Every level has its sources.',
      resetProgress: 'Reset progress',
      confirmReset: 'Erase all stars?',
    },
    he: {
      title: 'טהרה',
      tagline: 'חידות של טומאה וטהרה',
      play: 'שחקו',
      language: 'English',
      sound: 'צליל',
      back: 'חזרה',
      map: 'מפה',
      hint: 'רמז',
      restart: 'מההתחלה',
      go: 'קדימה!',
      next: 'לשלב הבא',
      replay: 'שוב',
      why: 'למה?',
      sources: 'מקורות',
      readSefaria: 'בספריא',
      world1: 'עולם 1: הדרך לפסח',
      world1Sub: 'אלי הכהן הצעיר עולה לירושלים',
      chanukah: 'חנוכה: פך השמן',
      chanukahSub: 'יהודה עוזר לחשמונאים למצוא שמן טהור',
      locked: 'סיימו את השלב הקודם כדי לפתוח',
      level: 'שלב',
      stars: 'כוכבים',
      noHint: 'אין עוד רמזים. נסו להיזכר בשלבים הקודמים!',
      tryAgain: 'ננסה שוב…',
      wellDone: 'כל הכבוד!',
      starsLine: 'כוכבים: ★ סיום · ★★ בלי רמז · ★★★ בלי רמז ובלי טעויות',
      credits: 'הדינים לפי ספר טהרה לרמב"ם, המשנה והגמרא. לכל שלב מקורות.',
      resetProgress: 'איפוס התקדמות',
      confirmReset: 'למחוק את כל הכוכבים?',
    },
  };
  let lang = 'en';
  try { const saved = localStorage.getItem('tehara.lang'); if (saved === 'he' || saved === 'en') lang = saved; } catch (e) {}
  function setLang(l) {
    lang = l; try { localStorage.setItem('tehara.lang', l); } catch (e) {}
    document.documentElement.lang = l; document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
    if (typeof G !== 'undefined') G.setLang(l);
  }
  function t(key) { return (STR[lang] && STR[lang][key]) || STR.en[key] || key; }
  // pick from a { en, he } pair (or pass a plain string through)
  function L(obj) { if (obj == null) return ''; if (typeof obj === 'string') return obj; return obj[lang] != null ? obj[lang] : obj.en; }
  return { t, L, setLang, get lang() { return lang; } };
})();

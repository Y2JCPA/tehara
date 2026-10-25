# Tumat Met, Kohanim and Related Topics: Research for a Kids' Puzzle Game

Research date: 2026-10-25. Texts were pulled from the Sefaria API (v3 texts, v1 related). Quotes are short excerpts. English is from Sefaria's default translations: Kulp (Mishnah), William Davidson/Steinsaltz (Bavli), Touger (Mishneh Torah). **Touger's English sometimes mixes his own notes into the translation**, so the Hebrew is what counts.

**Halachic basis for the game.** Each rule names the Rambam halacha that controls it. Where the Rambam differs from a simple reading of the Mishnah, or from other Rishonim, this is flagged and the game follows the Rambam.

Markers used:
- **[memory]**: comes from my general knowledge and was *not* checked against a text in this session. Verify before shipping.
- **[inference]**: my own reasoning from the sources, not an explicit statement.

Sefaria book titles used for the Rambam (checked via `/api/index`):
`Mishneh_Torah,_Defilement_by_a_Corpse` (Tumat Met), `Mishneh_Torah,_Red_Heifer` (Parah Adumah), `Mishneh_Torah,_Mourning` (Avel), `Mishneh_Torah,_Heave_Offerings` (Terumot), `Mishneh_Torah,_First_Fruits_and_other_Gifts_to_Priests_Outside_the_Sanctuary` (Bikurim), `Mishneh_Torah,_Admission_into_the_Sanctuary` (Bi'at HaMikdash), `Mishneh_Torah,_Paschal_Offering` (Korban Pesach), `Mishneh_Torah,_Nazariteship`, `Mishneh_Torah,_Eruvin`, `Mishneh_Torah,_Defilement_of_Foods` (Tumat Okhalin), `Mishneh_Torah,_Other_Sources_of_Defilement` (She'ar Avot HaTumot), `Mishneh_Torah,_Scroll_of_Esther_and_Hanukkah`.

---

## 0. Core game physics (cheat sheet, all sourced below)

| Mechanic | Rule | Controlling source |
|---|---|---|
| Touch (maga) | Touching a k'zayit of flesh, a barley-grain bone, a grave, etc. makes you tamei | Rambam Tumat Met 1:3, 2:1, 2:9-10 |
| Carry/move (masa / hesset) | Moving it counts, even without touching (e.g. via a beam/seesaw) | Rambam Tumat Met 1:6-7 |
| Ohel (overshadow) | Only a corpse does this (not sheretz etc.). Under one roof ≥ 1×1 tefach, ≥ 1 tefach high | Rambam Tumat Met 1:10, 12:1 |
| Tumah retzutzah | No 1-tefach air space around it: tumah shoots straight up to the sky and down to the depths, not sideways | Rambam Tumat Met 7:4-5 |
| Ohel blocks | A proper ohel spreads tumah to everything under it and protects everything on top of or outside it | Rambam Tumat Met 12:1 |
| Window/hole | Tumah passes between rooms only through an opening ≥ 1×1 tefach (sizes differ for light-holes) | Rambam Tumat Met 14:1, 14:5; Oholot 13 |
| Doors | Closed house with a corpse: all doorways tamei. Open one door (or plan to carry the body out through it) and the others are saved | Rambam Tumat Met 7:2; Oholot 7:3 |
| People/keilim as ohel | They *bring* tumah but do not *block* it. A door held shut by a person does not block; it must stand by itself | Rambam Tumat Met 18:3; Oholot 6:1 |
| Live animals as ohel | A board resting on a live animal blocks tumah | Oholot 6:1; Rambam Tumat Met 13:3 |
| Sealed clay jar | Tzamid patil protects its contents inside an ohel hamet | Bamidbar 19:15; Rambam Tumat Met 21:1 |
| Stone / dung / earth vessels | Do not become tamei at all | Rambam Tumat Met 6:2 |

---

## 1. Tumat Met and Ohel

### (a) Kid-level rule
A dead body (our cartoon skeleton) gives off "tumah." You catch it three ways:
1. **Touching** it.
2. **Picking it up or moving it**, even with a stick.
3. Being under **the same roof** as it, or being the roof over it.

A tiny bone the size of a grain of barley only counts if you touch or move it. It does not spread under a roof. A whole skeleton, or a big pile of bones (a *rova*), spreads under a roof too.

If there is no air pocket around the tumah, it shoots straight up and straight down like a laser and never spreads sideways. A roof only counts if it is at least one "hand" (tefach) wide and one tefach above the ground. Tumah can only squeeze through a window that is at least one tefach square.

### (b) Precise halacha
**Three modes.** Touch and ohel are written in the Torah (Bamidbar 19:11, 14). Carrying is Oral Tradition, learned by kal va-chomer (Rambam Tumat Met 1:1-2). Ohel applies **only** to a corpse, not to other tumot (Rambam Tumat Met 1:10). Carrying includes moving it indirectly, e.g. pressing the far end of a beam that has the impurity on it (1:7).

**What conveys what** (Rambam Tumat Met 2:1-16; Oholot 2:1-3):
- **Ohel, touch and carry, all d'oraita:**
  - an entire corpse;
  - a k'zayit of flesh (2:1);
  - a full limb with its flesh (2:3-4);
  - the spine or the skull;
  - the majority of the skeleton's structure, or the majority of the number of bones (125, Oholot 2:1);
  - a **rova (¼ kav) of bones** (2:8-9);
  - a revi'it of blood (2:12);
  - a closed grave (2:15).
- **Touch and carry only, no ohel:** a single bone, even a large one, down to the size of a barley grain. This is halacha l'Moshe mi-Sinai, "so it is d'oraita and not d'rabbanan" (2:10).
- **Rambam's view on golel/dofek** (the grave's cover stone and its support stones). They convey tumah by touch and ohel but **not by carrying**, and their tumah is **"מדברי סופרים"** (2:15; also Avel 3:13 "אבות של דבריהם"). The Mishnah (Oholot 2:4) only lists their modes and does not say whether they are d'oraita. **Other Rishonim treat golel as Torah-level [memory]. The game follows the Rambam.**
- **Solid tombstone (nefesh atumah).** Tumah goes straight up and down through it. Touching it from the side is pure, unless there is a 1-tefach hollow inside, in which case it is "like a closed grave" and tamei from all sides (Oholot 7:1; Rambam Tumat Met 7:4-5).

**Tumah retzutzah** (Rambam Tumat Met 7:4-5, "a great general principle"). If tumah has no 1×1×1 tefach space around it, "the tumah breaks through and rises to the sky, and breaks through and descends to the depths, and does not make anything tamei from the sides."
- Example: a k'zayit buried inside a heap of grain. Vessels beside it are pure. Vessels directly above or below it are tamei.
- With a tefach of space, it is "like a sealed grave" and tamei from all sides.

**An ohel spreads tumah and also blocks it** (Rambam Tumat Met 12:1). A cover ≥ 1×1 tefach that is ≥ 1 tefach high spreads tumah to everything under it. It also "saves everything outside it and separates the tumah from the vessels on top of it." Smaller than that, it is not an ohel.

**Strength of the ohel** (13:1-2). It counts even if nobody built it on purpose (a hole carved by water, a pile of beams). It has to be sturdy:
- Tree branches or stones jutting out of a wall that can hold "medium plaster" bring tumah and block it **d'oraita**.
- Weaker ones bring tumah only **d'rabbanan**, and do not block it.

**Who can be an ohel.**
- People and vessels: "אדם וכלים נעשין אהלים לטמא אבל לא לטהר" (Oholot 6:1). They become an ohel to spread tumah, but not to protect.
- A board resting on four stones or **on a live animal** does protect (ibid.).
- Rambam 18:3: if a person holds a door shut, the door does not block the tumah, "because the person is the one who blocked, and people and vessels bring tumah and do not block." **The door has to stand by itself.**

**Windows and holes** (Rambam Tumat Met 14:1-6; Oholot 13:1-4):
- "Tumah does not enter or leave an ohel through less than a tefach by a tefach" (14:1). A window between two houses or between a house and the upper floor transfers tumah at ≥ 1 tefach square.
- A window made for light, or one open to the sky, needs only the size of a pundyon / the large Temple drill hole (14:5; Oholot 13:1-2).
- A hole in a door counts at the size of a fist, as does a door the wind blew open (Oholot 13:3; Rambam 14:6).
- Things that do not themselves receive tumah can **shrink** an opening below a tefach and close it. For example, half a k'zayit of flesh can shrink an opening for a rova of bones (Oholot 13:5-6; Rambam 15:1-5).

**"Tumah yotzet" (tumah heads for the exit)** (Rambam Tumat Met 7:2; Oholot 7:3):
- If a corpse is in a house with many doors and all are closed, **all** the doorways are tamei, including anyone sitting under the overhang outside each door.
- Open one door, or decide to take the body out through one door or a 4×4-tefach window, and that one door saves all the others. Beit Hillel: even if the decision was made after the death.
- Related rule: "דרך הטמאה לצאת ואין דרכה להכנס" ("tumah's way is to go out, not to come in"; 18:4, 19:3, 20:8).
- **Whether the closed-doors rule is d'oraita or d'rabbanan is debated by the Rishonim [memory]. The Rambam states it without qualification.**
- Rema (YD 371:4) brings a stringency for Kohanim not to pass through the city gate a corpse will be carried out through, and others who permit it.

**4 amot.** "מת תופש ארבע אמות" (a corpse "holds" 4 amot). A Kohen who enters the 4 amot gets makat mardut (rabbinic lashes) (Rambam Avel 3:13; SA YD 371:5).

**Purification.** Seven days, with sprinkling of mei chatat (water with the red heifer's ashes) on day 3 and day 7, then tevilah (Bamidbar 19:12, 18-19). There is **no** "wait until evening" shortcut for tumat met.

**Tumat met as an av hatumah** (Rambam Tumat Met 5:9). Someone who became tamei met is an *av hatumah*. He makes people and vessels tamei by touch, but not by carrying.

### (c) Sources
- Bamidbar 19:11, 14-16. https://www.sefaria.org/Numbers.19
  - "הַנֹּגֵעַ בְּמֵת לְכׇל־נֶפֶשׁ אָדָם וְטָמֵא שִׁבְעַת יָמִים" ("Anyone who touches the corpse of any human being shall be impure for seven days.")
  - "אָדָם כִּי־יָמוּת בְּאֹהֶל כׇּל־הַבָּא אֶל־הָאֹהֶל... יִטְמָא שִׁבְעַת יָמִים" ("When a person dies in a tent, whoever enters the tent... shall be impure seven days.")
  - 19:16: "בַּחֲלַל־חֶרֶב אוֹ בְמֵת אוֹ־בְעֶצֶם אָדָם אוֹ בְקָבֶר" ("a person who was killed or who died naturally, or human bone, or a grave.")
- Rambam Tumat Met 1:10. https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.1.10
  - "טמאת אהל אינה בשאר טמאות אלא במת בלבד" ("The ritual impurity of ohel does not apply with regard to other sources of impurity, only with regard to a human corpse.")
- Rambam Tumat Met 2:9-10. https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.2.10
  - "אפלו עצם כשעורה מטמא במגע ובמשא ואינו מטמא באהל" ("even a bone merely the size of a barley-corn... imparts impurity when touched or carried... not... under the same structure.")
  - "...הרי הוא דין תורה ולא מדברי סופרים" ("it is considered as Scriptural Law and not as a Rabbinic decree.")
- Rambam Tumat Met 2:15 (golel/dofek d'rabbanan). https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.2.15
- Rambam Tumat Met 7:4-5 (retzutzah). https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.7.5
  - "זה כלל גדול בטמאת מת... אם היה רצוץ שאין לו חלל טפח הרי הטמאה בוקעת ועולה עד לרקיע בוקעת ויורדת עד התהום ואינה מטמאה מן הצדדין" ("If the impurity is flush with its covering, the impurity pierces through and ascends until the heavens and pierces through and descends until the depths, but does not impart impurity to those on the sides.")
- Rambam Tumat Met 12:1 (ohel 1×1×1). https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.12.1
  - "טפח על טפח מרבע על רום טפח מביא את הטמאה וחוצץ בפני הטמאה דין תורה" ("A covering that is a square, a handbreadth by a handbreadth and a handbreadth high brings ritual impurity and intervenes between ritual impurity according to Scriptural Law.")
- Rambam Tumat Met 13:2 (branches and jutting stones). https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.13.2
- Rambam Tumat Met 14:1 (windows). https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.14.1
  - "אין טמאה נכנסת לאהל ולא יוצאה ממנו בפחות מטפח על טפח" ("Tumah does not enter or leave an ohel through less than a tefach by a tefach.")
- Rambam Tumat Met 7:2 (many doors). https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.7.2
- Rambam Tumat Met 18:3 (a door held by a person does not block). https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.18.3
  - "...והאדם והכלים מביאין ואינן חוצצין" ("...people and vessels bring [tumah] and do not block it.")
- Mishnah Oholot 2:1-4. https://www.sefaria.org/Mishnah_Oholot.2
- Mishnah Oholot 6:1. https://www.sefaria.org/Mishnah_Oholot.6.1
- Mishnah Oholot 7:1-3. https://www.sefaria.org/Mishnah_Oholot.7.3
- Mishnah Oholot 8:1-2 (what brings and blocks; shidah, teivah, migdal; branches). https://www.sefaria.org/Mishnah_Oholot.8.1
- Mishnah Oholot 13:1-6. https://www.sefaria.org/Mishnah_Oholot.13
- Berakhot 19b (Rava: d'oraita, an ohel with a tefach of space blocks; otherwise the tumah "reaches the heavens"). https://www.sefaria.org/Berakhot.19b.7
- SA YD 369:1, 371:1-6. https://www.sefaria.org/Shulchan_Arukh,_Yoreh_De'ah.371

### (d) Puzzle ideas
1. **"Laser Tumah."** A cartoon skeleton is packed tightly in a pile of sand (retzutzah). A purple beam shoots straight up and down from it. The player slides crates sideways around it; boxes next to the pile stay clean, boxes over the beam turn grey.
   - Add a "1-tefach air bubble" power-up. Placing it makes the pile a "sealed grave" and the glow spreads to all sides. This teaches when the air pocket matters (Rambam 7:5).
2. **"Tefach Doors."** A house of rooms, with the skeleton in one room. The player opens and closes windows to keep the Kohen's route clean.
   - Windows smaller than the 1-tefach gauge don't let tumah through.
   - A door wedged with a stone blocks it. A door a character holds shut does not (Rambam 18:3).
   - Secret mechanic: pick the "exit door" for the body (Oholot 7:3). The other doors light up as pure.
3. **"Seesaw Trap."** A barley-grain bone sits on the end of a plank. Stepping on the other end lifts it, which is masa/hesset (Rambam 1:7), so the hero becomes tamei. The player has to remove the plank instead.

---

## 2. Kohanim

### (a) Kid-level rule
A Kohen has a special job in the Beit HaMikdash, so the Torah tells him: **don't get tumat met**. Don't touch a dead body, don't go under its roof, don't go into a cemetery.
- **Exceptions:** for his closest family (mother, father, son, daughter, brother, unmarried sister, and his wife), and for a "met mitzvah" (a body lying alone with nobody else to bury it).
- The **Kohen Gadol** may not even do it for family. He may only do it for a met mitzvah.
- A Kohen **may** get other kinds of tumah, like touching a dead mouse (sheretz). Then he just can't eat terumah or serve until he's tahor again.

### (b) Precise halacha
**The prohibition** (d'oraita, Vayikra 21:1; Rambam Avel 3:1). A Kohen who becomes tamei met by touching, by ohel ("המאהיל") or by carrying gets lashes, with witnesses and a warning. This applies "to the corpse and to all tumot that come out of a corpse."
- Touching a grave: lashes (3:2).
- Entering any ohel the tumah has spread into, even if the body is in another building: lashes (3:3).
- Entering a cemetery: lashes d'oraita (3:13).

**What he may do** (3:2). He **may touch clothing that touched a corpse**, "even though he becomes tamei for seven days by it." The prohibition is on the corpse itself, not on secondary tumah.

**Rabbinic-level tumot of met** (3:13). For entering the 4 amot of a corpse, a beit haperas, or chutz la'aretz, or for touching dam tevusah (a corpse's mixed blood), a golel or a dofek, he gets **makat mardut** (rabbinic lashes), "because they are rabbinic avot hatumah."

**Other tumot (sheretz, neveilah, zav, etc.).** Explicitly permitted (Rambam Tumat Okhalin 16:9): "Even Kohanim and nezirim may become tamei with all other tumot except tumat met." The Torah only warned them about met.
- A tamei Kohen still may not eat terumah or kodashim, or serve, until he is tahor (Rambam Terumot 7:1-2; Vayikra 22:4-7).
- On the Regalim (pilgrimage festivals) everyone is told to be tahor (Tumat Okhalin 16:10).

**The relatives** (Vayikra 21:2-3; Rambam Avel 2:6-15, 3:1):
- mother, father, son, daughter;
- paternal brother;
- a virgin paternal sister who is not married or betrothed (2:10-12);
- his wife: rabbinic, treated like a met mitzvah (2:7).

This is a **mitzvah**: "if he doesn't want to, we make him become tamei" (2:6). Limits:
- He does not become tamei for a severed limb or bones of the relative, or for a decapitated body (2:14-15).
- Only until the grave is closed (2:8).
- Only for that relative, not for anyone else at the same time (2:15).

**Kohen Gadol** (Vayikra 21:11; Rambam Avel 3:6). He doesn't become tamei even for relatives, and "doesn't enter an ohel with a corpse." There are two separate prohibitions, *lo yavo* and *lo yitama*.
- Example: he sits in a closed chest (shidah/teivah/migdal) inside an ohel hamet, and a friend lifts the lid. The tumah and the entering happen at the same moment, so he gets two sets of lashes.

**Met mitzvah** (3:8-9). Even a Kohen Gadol must become tamei to bury an abandoned Jewish corpse when he's alone and nobody answers his call.
- If a Kohen and a nazir meet one, the nazir does it.
- If a Kohen Gadol and a regular Kohen meet one, the regular Kohen does it: "whoever is holier becomes tamei last."

**Daughters of Kohanim** are not commanded about tumat met. Neither are chalalim (3:11).

**A minor Kohen** (3:12). Adults may not make him tamei. If he does it on his own, beit din doesn't have to stop him, but his father must train him in holiness. **Good for a kid-hero Kohen.**

**Cemetery / tree over a grave.**
- A cemetery is forbidden d'oraita (Avel 3:13).
- A tree whose branches overhang the ground, with tumah under one of them and nobody knows which, is forbidden to a Kohen (SA YD 369:1, "ולא לאילן המיסך על הארץ...").
- Per Rambam Tumat Met 13:2, sturdy branches are an ohel d'oraita. So if there's a grave under a strong branch, walking under that branch is an ohel d'oraita.
- He also can't walk *on* a Jewish grave: being over it is overshadowing it (ma'ahil).

**When rabbinic tumah is allowed for a Kohen** (Rambam Avel 3:14; SA YD 372:1). A Kohen **may go through a beit haperas or chutz la'aretz for a mitzvah when there is no other road** (to marry, to learn Torah). He may also take on rabbinic tumah for kevod habriyot (human dignity):
- following a mourner through a beit haperas;
- jumping over coffins to greet kings, Jewish or not;
- going to court against non-Jews to save property.

**Gentile graves.** Rambam (Avel 3:3; Tumat Met 1:13, based on Rashbi in Yevamot 61a / BM 114b) permits a Kohen to walk on them. SA YD 372:2 says it is "proper to be careful," and Rema says it is proper to be strict. **Recommendation: leave this out of a kids' game.**

**Nazir.** Like a Kohen regarding met (Bamidbar 6:6-7). He shaves and restarts his count only for core corpse-tumot (Mishnah Nazir 7:2).
- Beit haperas, tree branches over graves, chutz la'aretz, golel/dofek, a rova of bones, a revi'it of blood and ohel(!) do **not** make him shave. He just gets sprinkled on day 3 and day 7 (Mishnah Nazir 7:3; Rambam Nezirut 7:1-3).
- Note: the Mishnah's list includes "ohel" and "rova" as non-shaving items. The Rambam explains the shaving rule follows "נפש מת" ("the substance of the corpse").
- Nazir + beit haperas inspection: Beit Shammai say it is inspected for him, Beit Hillel say it is not (Oholot 18:4).

### (c) Sources
- Vayikra 21:1-4, 10-11. https://www.sefaria.org/Leviticus.21
  - "לְנֶפֶשׁ לֹא־יִטַּמָּא בְּעַמָּיו כִּי אִם־לִשְׁאֵרוֹ הַקָּרֹב אֵלָיו" ("None shall defile himself for any [dead] person among his kin, except for the relatives that are closest to him.")
  - Kohen Gadol: "וְעַל כׇּל־נַפְשֹׁת מֵת לֹא יָבֹא לְאָבִיו וּלְאִמּוֹ לֹא יִטַּמָּא" ("He shall not go in where there is any dead body; he shall not defile himself even for his father or mother.")
- Rambam Avel 3:1. https://www.sefaria.org/Mishneh_Torah,_Mourning.3.1
  - "כל כהן שנטמא למת חוץ מששה מתים המפרשים בתורה או אשתו... לוקה" ("With the exception of the six relatives mentioned in the Torah and his wife, whenever a priest becomes impure because of contact with a corpse... he is punished by lashes.")
- Rambam Avel 3:2. https://www.sefaria.org/Mishneh_Torah,_Mourning.3.2
  - "נוגע הוא בבגדים שנגעו במת אף על פי שמטמא בהן טמאת שבעה" ("He may, however, touch clothes that touched a corpse, even though by doing so, he contracts ritual impurity that continues for seven days.")
- Rambam Avel 3:6 (Kohen Gadol), 3:8-12. https://www.sefaria.org/Mishneh_Torah,_Mourning.3.6
- Rambam Avel 3:13-14. https://www.sefaria.org/Mishneh_Torah,_Mourning.3.13
  - "וכן אם נכנס לבית הפרס... מכין אותו מכת מרדות... אבל אם נכנס לבית הקברות לוקה מן התורה" ("Similarly, if priests enter a beit hapras... they are given stripes for rebellious conduct... If, however, a priest enters a cemetery, he receives lashes according to Scriptural Law.")
  - 3:14: "מתר לכהן להטמא בבית הפרס... לדבר מצוה בזמן שאין שם דרך אלא היא" ("It is permissible for a priest to become impure through walking through a beit hapras... for the sake of a mitzvah, when there is no way other than that.")
- Rambam Avel 2:6-15. https://www.sefaria.org/Mishneh_Torah,_Mourning.2
- Rambam Tumat Okhalin 16:9. https://www.sefaria.org/Mishneh_Torah,_Defilement_of_Foods.16.9
  - "וְשֶׁאַף כֹּהֲנִים וּנְזִירִים מֻתָּרִין לְהִתְטַמֵּא בִּשְׁאָר טֻמְאוֹת חוּץ מִטְּמֵא מֵת" ("even priests and nazirites are permitted to contract impurity from all other sources of impurity with the exception of a human corpse.")
- SA YD 369:1, 372:1-2. https://www.sefaria.org/Shulchan_Arukh,_Yoreh_De'ah.369.1 , https://www.sefaria.org/Shulchan_Arukh,_Yoreh_De'ah.372
- Mishnah Nazir 7:2-3. https://www.sefaria.org/Mishnah_Nazir.7.3
- Berakhot 19b (R. Elazar bar Tzadok jumping over coffins; mourners in a beit haperas). https://www.sefaria.org/Berakhot.19b.3-8

### (d) Puzzle ideas
1. **"Mouse Yes, Skeleton No."** A young Kohen has to fetch a scroll from a shed that has a cartoon dead mouse (sheretz) on one path and a skeleton room on the other. The mouse path is *allowed* (Tumat Okhalin 16:9). The game shows a "tamei until evening, then mikveh" timer, and the Kohen can't eat the terumah snack until sunset.
   - The skeleton path is blocked: a "No Kohanim" sign.
2. **"Who Should Go?"** An abandoned body (met mitzvah, shown with a respectful covered shape, not a skeleton) and three characters: a nazir, a Kohen, a Kohen Gadol. The player picks who handles it: the nazir first (Avel 3:9).
3. **"The Overhanging Tree."** A path along a cemetery wall has a big tree with branches over graves. The Kohen must not walk under the branches (SA 369:1; Rambam 13:2).
   - Solution: build a sturdy roof on the far side, or reroute.
   - If branches are thin and flimsy, the game can show "rabbinic" yellow tumah (Rambam 13:2).

---

## 3. Beit HaPeras (central level)

### (a) Kid-level rule
A *beit haperas* is a field where someone **plowed over a grave by mistake**. The plow might have spread tiny bone chips (like barley grains) over about 100 amot.
- The Sages made the whole field "careful-zone" tumah. It's a **rabbinic** rule, not a Torah rule.
- A tiny bone only makes you tamei if you **touch it or move it with your foot**, not by being over it.
- So the Sages said you can **blow on the dirt in front of you as you walk**. If a bone chip is there, the blowing uncovers it, you step around it, and you stay tahor.
- Other ways across: ride on a strong animal, or walk on big stones that don't wobble.

### (b) Precise halacha

**Definition and size** (Rambam Tumat Met 10:1-3; Oholot 17:1). A place where a grave was plowed: "the bones of the corpse were crushed in the earth and spread over the whole field."
- The area is 100 amah by 100 amah from the grave, the length of one furrow, a field that takes four se'ah of seed (Rambam 10:1-2).
- If the plow was shaken out or hit a rock before 100 amot, the beit haperas ends there (10:3).
- Bones are not carried past 100 amot.

**Status** (Rambam Tumat Met 2:16, 10:2). Its earth makes things tamei **by touch and carrying, not by ohel**. "One who overshadows this beit haperas is pure." The whole thing is **d'rabbanan**.

**Three kinds of beit haperas** (Oholot 18:2-4). Important for the game.
1. **A field where a grave was plowed** (חורש את הקבר). Touch and carry only, no ohel. **This is the one the blowing leniency is about.**
2. **A field where a grave was lost** (שדה שאבד קבר בתוכה). There's a *whole* grave somewhere in it. It conveys tumah by touch, carrying **and ohel**.
   - Moed Katan 5b (Rav Pappa) uses exactly this distinction. The blowing leniency is for the plowed field, not the lost-grave field.
   - **Blowing does not help in a lost-grave field.**
3. **"Sedeh bochin"** (a field of mourning/weeping). Its earth is pure (18:4).

**THE BLOWING SOURCE (מנפח).** It is **not** in the Mishnah. Oholot 18:4 has the *Mishnah's* inspection, which is sifting. The blowing is a statement of **Rav Yehuda in the name of Shmuel**: "מְנַפֵּחַ אָדָם בֵּית הַפְּרָס וְהוֹלֵךְ" ("a person may blow on a beit haperas and walk"). It appears in seven places:
- **Berakhot 19b**: the reason the mourners' companions may walk through a beit haperas, which proves it is d'rabbanan.
- **Pesachim 92b**: explains "בודקין לעושה פסח" ("we inspect for one bringing the Pesach").
- **Chagigah 25b**: same explanation.
- **Ketubot 28b**: why a grown person is believed about what he saw as a child: beit haperas is d'rabbanan.
- **Moed Katan 5b**: proves a plowed beit haperas has no ohel tumah.
- **Niddah 57a**: the reason is bones without flesh, so no ohel.
- **Eruvin 30b**: **why an eruv may be placed for a KOHEN in a beit haperas** (Mishnah Eruvin 3:1 "ולכהן בבית הפרס").

Each time it comes with a second statement: "בית הפרס שנידש טהור", a beit haperas that has been trodden into a path is pure. Ketubot 28b gives the reason: "it is impossible for a barley-sized bone not to have been crushed underfoot."

**Rashi's explanation of the mechanics:**
- Rashi Eruvin 30b: "When he blows before his feet, a big bone is visible by itself and a small bone is revealed by the blowing, and he doesn't move it with his feet."
- Rashi Berakhot 19b: "If it were d'oraita we wouldn't be so lenient as to rely on blowing. **This inspection was permitted for the Pesach and not for terumah eaters**, as in Chagigah 25b."

**Does blowing work for a Kohen? The Rambam says yes.**
- **Rambam Hilchot Eruvin 6:17**: "נתנו בבית הפרס הרי זה ערוב **ואפלו היה כהן**, מפני שיכול לכנס שם במגדל הפורח **או שינפח והולך**." ("If he put it in a beit haperas, it is a valid eruv, **even if he is a Kohen**, because he can go in there in a flying tower **or blow and walk**.") This is the most direct Rambam source for the game. The Rambam assumes a Kohen *can* get into a beit haperas by blowing as he walks, without breaking the Kohen-prohibition. This follows Eruvin 30b.
- **Rambam Korban Pesach 6:8**: "מי שבא בבית הפרס הרי זה **מנפח והולך**, ואם לא מצא עצם ולא נטמא שוחט ואוכל פסחו... וכן בית הפרס שנדוש טהור לעושה פסח." ("One who comes through a beit haperas **blows and walks**; if he found no bone and did not become tamei, he slaughters and eats his Pesach... Likewise a trodden beit haperas is pure for one bringing the Pesach.")
  - Note: Touger's English renders מנפח as "sift." The Hebrew is **blow**.
- **Rambam Avel 3:13-14**: a Kohen who enters a beit haperas gets makat mardut. But for a mitzvah with no other road, he may enter it and even *become tamei*.

**Blowing and terumah.** Oholot 18:4: "בודקין לעושה פסח ואין בודקין לתרומה" ("we inspect for one bringing the Pesach, but not for terumah"). Chagigah 25b and Pesachim 92b: blowing is that inspection, and it is waived only because skipping the Pesach carries karet.
- **So for eating terumah, the blowing check does not count**, and he is treated as tamei d'rabbanan for terumah purposes (Rashi Berakhot 19b).
- Tosafot Ketubot 28b, s.v. מנפח: blowing is only *bedi'avad* (after the fact, e.g. he already handled taharot). The *lechatchilah* inspection is the sifting of Oholot 18:4.
- **[inference]** The Rambam's Eruvin ruling treats blowing as a valid way for a Kohen to avoid the *Kohen-prohibition*. That is a separate question from his *terumah-purity*.

**Other ways across or to fix the field** (Rambam Tumat Met 10:11-12; Oholot 18:5-6):
- Walk on stones that don't wobble, or ride a person or animal "whose strength is good." Then you are tahor.
  - If the stones wobble, you're tamei even if you were careful.
  - If the bearer is weak (knees knocking, an animal that drops dung while carrying you), you're tamei.
- **Purifying the field** must be done in front of two talmidei chachamim (10:12). Ways:
  - sift all the movable top earth through a fine sieve and remove every barley-sized bone;
  - add 3 tefachim of earth from elsewhere on top;
  - remove 3 tefachim of earth from the whole surface;
  - remove 3 tefachim from half the field and pile them on the other half;
  - pave it with stones that don't wobble.
- **Mishnah vs. Rambam:**
  - Oholot 18:5: Rabbi Shimon allows 1½ + 1½ tefachim and allows digging it up (עוזק). The Rambam rules **against** Rabbi Shimon: "לא עשה כלום" ("he did nothing"). The game follows the Rambam.
  - Oholot 18:4 gives the sifting as the inspection *for the Pesach-bringer*. The Rambam (10:12) also lists sifting as a way to *purify the field*.
- Planting is fine: roots go below 3 tefachim, and below 3 tefachim it is pure, since the bones are spread on the surface (10:8). Sowing is limited to crops that are reaped. The grain is sifted 2× (legumes 3×) and the stalks burnt.

**Not every plowed grave makes a beit haperas** (10:4-6). Only a *known* grave plowed by the field's owner makes one. Not a lost grave, not someone else's field, not a gentile's field. Rain washing the dirt into the next field doesn't spread it (10:7).

**A box, wagon or "flying tower"** (shidah, teivah, migdal):
- **In a beit haperas** it works (Rambam Eruvin 6:17, "מגדל הפורח"). This fits the touch-and-carry-only logic: being lifted off the ground on a strong animal also works (10:11).
- **In chutz la'aretz** it does **not** work for the Rambam: "הנכנס לארץ העכו"ם בשדה תבה ומגדל הפורחין באויר טמא, שאהל זרוק אינו קרוי אהל" ("one who enters gentile lands in a box flying in the air is tamei, because a moving ohel is not called an ohel"; Tumat Met 11:5). This follows Rebbi against Rabbi Yosei b'R. Yehuda (Eruvin 30b; Nazir 55a).
- **In a cemetery** (d'oraita): Mishnah Eruvin 3:1 has Rabbi Yehuda allow an eruv for a Kohen even in a cemetery, because he can go in a shidah/teivah/migdal ("ohel zaruk shmei ohel"). The Rambam doesn't follow this. He invalidates an eruv in a cemetery for another reason, the ban on benefit (Eruvin 6:17), and holds that ohel zaruk is not an ohel (11:5).
  - **For the game:** a moving box does **not** protect a Kohen in a cemetery.
  - A **stationary** box of 40 se'ah does block tumah inside an ohel hamet (Oholot 8:1; Rambam Tumat Met 6:2, 13:3; Avel 3:6).

### (c) Sources
- Mishnah Oholot 17:1. https://www.sefaria.org/Mishnah_Oholot.17.1
  - "הַחוֹרֵשׁ אֶת הַקֶּבֶר, הֲרֵי זֶה עוֹשֶׂה בֵית הַפְּרָס... מְלֹא מַעֲנָה מֵאָה אַמָּה" ("One who plows a grave makes it a bet haperas... for the length of a furrow of a hundred cubits.")
- Mishnah Oholot 18:2-3. https://www.sefaria.org/Mishnah_Oholot.18.2
  - "...וּמְטַמֵּא בְמַגָּע וּבְמַשָּׂא, וְאֵינוֹ מְטַמֵּא בְאֹהֶל" ("conveys uncleanness by contact and carriage but does not convey uncleanness by overshadowing.")
  - Lost grave: "...וּמְטַמֵּא בְמַגָּע וּבְמַשָּׂא וּבְאֹהֶל" ("conveys uncleanness by contact, carriage and overshadowing.")
- Mishnah Oholot 18:4. https://www.sefaria.org/Mishnah_Oholot.18.4
  - "וּמוֹדִים בֵּית שַׁמַּאי וּבֵית הִלֵּל שֶׁבּוֹדְקִים לְעוֹשֶׂה פֶסַח, וְאֵין בּוֹדְקִין לִתְרוּמָה... כֵּיצַד הוּא בוֹדֵק. מֵבִיא אֶת הֶעָפָר... וְנוֹתֵן לְתוֹךְ כְּבָרָה" ("Bet Shammai and Bet Hillel agree that it is examined for one who wished to perform the pesah sacrifice, but is not examined for one who wants to eat terumah... How does he examine it? He brings earth... and places it into a sieve.")
- Mishnah Oholot 18:5-6. https://www.sefaria.org/Mishnah_Oholot.18.6
  - "הַמְהַלֵּךְ בְּבֵית הַפְּרָס עַל אֲבָנִים שֶׁאֵינוֹ יָכוֹל לַהֲסִיטָן, עַל הָאָדָם וְעַל הַבְּהֵמָה שֶׁכֹּחָן יָפֶה, טָהוֹר" ("A person who walks through a bet peras on stones that cannot [easily] be moved, or [who rides] on a man or beast whose strength is great, remains clean.")
- Berakhot 19b. https://www.sefaria.org/Berakhot.19b.4-5
  - "תַּרְגְּמַהּ רַבִּי אַבָּא בְּבֵית הַפְּרָס דְּרַבָּנַן. דְּאָמַר רַב יְהוּדָה אָמַר שְׁמוּאֵל: מְנַפֵּחַ אָדָם בֵּית הַפְּרָס וְהוֹלֵךְ" ("Rabbi Abba explained that the baraita is referring to a... beit haperas [which is rabbinic]... Rav Yehuda said that Shmuel said: One who passes through a beit haperas may blow on the dust before taking each step... and walk.")
- Rashi on Berakhot 19b. https://www.sefaria.org/Rashi_on_Berakhot.19b.5.1
  - "...והך בדיקה לעושה פסח אישתרי ולא לאוכלי תרומה" ("...this inspection was permitted for one bringing the Pesach and not for those who eat terumah.")
- Eruvin 30b. https://www.sefaria.org/Eruvin.30b.15-18
  - "ולכהן בבית הפרס. דאמר רב יהודה אמר שמואל: מנפח אדם בית הפרס והולך" ("One may establish an eiruv for a priest in a beit haperas... as Rav Yehuda said that Shmuel said: ...a person may blow on the dust in a beit haperas... and walk.")
- Rashi on Eruvin 30b. https://www.sefaria.org/Rashi_on_Eruvin.30b.15.1
- Pesachim 92b. https://www.sefaria.org/Pesachim.92b.1-2
- Chagigah 25b. https://www.sefaria.org/Chagigah.25b.6-7
  - "מודין בית שמאי ובית הלל שבודקין לעושי פסח, ואין בודקין לאוכלי תרומה. מאי בודקין? ...מנפח אדם בית הפרס והולך" ("Beit Shammai and Beit Hillel agree that we examine for those performing the Pesach, but not for those eating terumah. What does 'examine' mean? ...A person may blow at the ground of a beit haperas and walk.")
- Ketubot 28b, with Tosafot s.v. בית הפרס דרבנן and s.v. מנפח. https://www.sefaria.org/Ketubot.28b.6 , https://www.sefaria.org/Tosafot_on_Ketubot.28b.6.3
- Moed Katan 5b (plowed vs. lost grave). https://www.sefaria.org/Moed_Katan.5b.9-12
- Niddah 57a. https://www.sefaria.org/Niddah.57a.10
- Rambam Tumat Met 10:1-12. https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.10
  - 10:2: "...ואינו מטמא באהל. וכן המאהיל על בית הפרס הזה טהור" ("...It does not impart impurity because of ohel. Similarly, one who stands over a beit hapras is pure.")
  - 10:11: "המהלך בבית הפרס על גבי אבנים שאין מתנדנדין... או שנכנס לה והוא רוכב על גבי אדם ובהמה שכחן יפה הרי זה טהור" ("When a person walks through a beit hapras on stones that do not wobble... or he enters it when he is riding on a person or an animal of formidable strength, he is pure.")
- **Rambam Eruvin 6:17.** https://www.sefaria.org/Mishneh_Torah,_Eruvin.6.17
- **Rambam Korban Pesach 6:8.** https://www.sefaria.org/Mishneh_Torah,_Paschal_Offering.6.8
- Rambam Tumat Met 11:5 (ohel zaruk). https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.11.5
- Nazir 55a. https://www.sefaria.org/Nazir.55a.1-7

### (d) Puzzle ideas
1. **"The Leaf-Blower Path"** (the user's idea, adjusted to the Rambam).
   - **Setup.** A Kohen kid is going to Yerushalayim **for a mitzvah**: bringing bikurim, learning Torah, or helping at a wedding. A signpost (lime-white) reads "Beit HaPeras: an old grave was plowed here." Make it explicitly a *plowed-grave* field. **No other road** (a river or cliff blocks the detour), which also satisfies Avel 3:14.
   - **Mechanic.** A friendly gardener walks ahead with a "blower." Gusts strip loose topsoil and reveal glowing barley-grain bone chips (cartoon, not gory). The Kohen follows only on cleared tiles and must not step on or kick (hesset) a revealed chip. Shmuel's original is the walker blowing himself ("מנפח... והולך"), so give the Kohen a little hand-blower or pinwheel as the "authentic" tool. The gardener's machine is a fun upgrade (see open questions).
   - **Teaching text:** "Tiny bones only count if you touch or move them, and this whole rule is from the Sages. Blowing lets you see them (Berakhot 19b; Rambam Eruvin 6:17)."
   - **Fail state.** If the field were a *lost-grave* field (shown with a different sign), blowing wouldn't help. Make that a later "trap" level.
   - **Optional twist.** The Kohen's basket holds *terumah*. After crossing by blowing, a sage says the terumah should still be handled as rabbinic-tamei, "we don't rely on the check for terumah" (Oholot 18:4; Rashi Berakhot 19b). So the right solution with terumah is a different crossing method (next idea).
2. **"Stones That Don't Wobble / The Strong Donkey."** Tiles marked as wobbly or solid stones. Wobbly ones fail you even if you balance perfectly (Rambam 10:11).
   - Alternative: ride a strong donkey. A weak donkey with knocking knees fails.
   - Bonus: pave a path with big stones (10:12) to permanently purify a strip.
3. **"The Well-Trodden Path"** (בית הפרס שנידש). The player herds a flock of sheep or a crowd of villagers back and forth until a path is "trodden," and the path turns pure (Berakhot 19b; Rambam KP 6:8).
   - Caveat: the Rambam codifies "nidash" explicitly only for the Pesach-bringer. Frame this level as "on the way to bring the Korban Pesach."
4. **"Three Tefachim."** A bulldozer or shovel game. Add 3 tefachim of soil on top, or move 3 tefachim from one half to the other, while two cartoon sages watch (Rambam 10:12).
   - A "1½ + 1½" trick fails ("לא עשה כלום", "he did nothing").

---

## 4. Marking graves (tziyun with sid / lime)

### (a) Kid-level rule
Every year in Adar, before the crowds come up for Pesach, the Beit Din's helpers went out and **painted graves white with lime**, so nobody would walk over them by accident and become tamei.

### (b) Precise halacha
**When.** On the 15th of Adar they mark the graves (Shekalim 1:1), along with fixing roads and mikva'ot. They may also mark graves on Chol HaMoed (Moed Katan 1:2 / 5a; Rambam Tumat Met 8:9).

**Why.** Moed Katan 5a gives several sources:
- Yechezkel 39:15, "וראה עצם אדם ובנה אצלו ציון" ("[if] any see a human bone, he shall erect a marker beside it"). Rav Ashi: this was originally a tradition, and Yechezkel attached it to a verse.
- Vayikra 13:45, "וטמא טמא יקרא": "the tumah itself calls out to him and says: keep away!"
- Lifnei iver (don't put a stumbling block before the blind).
- "סלו סלו פנו דרך" ("Pave, pave, clear the way"; Yeshayahu 57:14).

**How** (Rambam Tumat Met 8:9-11; Ma'aser Sheni 5:1):
- Lime, "mixed and poured" over the spot.
- Not *exactly* on the edge of the tumah, so that taharot (pure items) aren't lost: you'd find out too late. Make it a bit wider.
- Not too far out either, so as not to "ruin Eretz Yisrael."
- They mark only **doubtful** spots: a field where a grave was lost, overhanging branches, jutting stones. Definite cemeteries everyone knows aren't marked.
- They don't mark an exact k'zayit, since it will shrink in the ground. They also don't mark tumot that only work by touch, like a barley-size bone (Moed Katan 5b).
- Ma'aser Sheni 5:1 adds a color code: a fourth-year vineyard is marked with clods of earth, orlah with potter's clay, graves with lime.

**Reading markings** (Rambam 8:11):
- One marked stone: the area under it is tamei.
- Two stones with lime between them: the area between them is tamei. If there's a potsherd between them instead, it's just a building and it's pure.
- One marked edge of a field: only that edge is tamei.
- **All four edges marked: the edges are pure and the whole field is tamei**, because the sign isn't put far from the tumah.
- A marked field with trees: assume a plowed grave. Without trees: assume a lost grave (10:10; 8:10).

### (c) Sources
- Mishnah Shekalim 1:1. https://www.sefaria.org/Mishnah_Shekalim.1.1
  - "בַּחֲמִשָּׁה עָשָׂר בּוֹ... וּמְצַיְּנִין אֶת הַקְּבָרוֹת" ("on the fifteenth day of the month of Adar... they also mark the Jewish gravesites anew.")
- Mishnah Ma'aser Sheni 5:1. https://www.sefaria.org/Mishnah_Maaser_Sheni.5.1
  - "וְשֶׁל קְבָרוֹת בְּסִיד, וּמְמַחֶה וְשׁוֹפֵךְ" ("and graves with lime which is dissolved and poured on.")
- Moed Katan 5a. https://www.sefaria.org/Moed_Katan.5a.13-22
  - "טומאה קוראה לו ואומרת לו 'פרוש'" ("Impurity cries out to the passerby and tells him: Remove yourself.")
- Moed Katan 5b. https://www.sefaria.org/Moed_Katan.5b.2-3
- Yechezkel 39:15. https://www.sefaria.org/Ezekiel.39.15
- Rambam Tumat Met 8:9-11. https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.8.9
  - "ובמה מצינין, בסיד. ממחה ושופך על מקום הטמאה. אין מעמידין את הציון על גבי הטמאה... ואין מרחיקין את הציון..." ("With what is the designation made? With lime. It should be mixed and poured over the place of the impurity. The designation should not be placed on the exact perimeters of the impurity... The designation should not be extended much beyond the place of the impurity...")

### (d) Puzzle ideas
1. **"Adar Paint Patrol."** The player is a Beit Din helper with a bucket of lime before the Pesach crowds arrive. Paint just a bit wider than the hidden tumah. Too tight: a traveler's taharot bag gets zapped. Too wide: "you ruined good farmland" (Rambam 8:9).
2. **"Read the Marks."** Given marked stones and fields, predict which tiles are tamei (Rambam 8:11). Include the four-edges-marked twist.
3. **Combo with Beit HaPeras.** A "trees / no trees" clue tells you whether the marked field is a plowed-grave field (blowing allowed) or a lost-grave field (no crossing).

---

## 5. Chanukah oil

### (a) Kid-level rule
When the Greeks took over the Beit HaMikdash, they made the oil tamei. The Chashmona'im searched and found **one small jug still sealed with the Kohen Gadol's seal**. That seal proved nobody had opened or touched it, so it was still tahor. It had enough for one day, and it burned for eight!

### (b) Precise halacha
**Shabbat 21b**: "שכשנכנסו יוונים להיכל טמאו כל השמנים שבהיכל... ולא מצאו אלא פך אחד של שמן שהיה מונח בחותמו של כהן גדול" ("when the Greeks entered the Sanctuary they defiled all the oils... they found only one jug that was lying with the seal of the Kohen Gadol").
- Rashi: "hidden and sealed with his ring, **so he recognized they hadn't touched it**."
- **Avodah Zarah 52b is not about the oil.** It's about the altar stones the Greeks defiled, which were stored away (Middot 1:6).

**Rambam Chanukah 3:2**: "ולא מצאו שמן טהור במקדש אלא פך אחד... והדליקו ממנו נרות המערכה שמונה ימים עד שכתשו זיתים והוציאו שמן טהור" ("...and they lit the lamps from it for eight days, until they crushed olives and produced pure oil").

**How the Greeks made it tamei.** Gentiles were made rabbinically like zavim (Niddah 34a). A zav makes things tamei by **hesset**, i.e. moving them even without touching.
- So the question: wasn't the sealed jug moved?
- Tosafot Shabbat 21b: it must have been sealed and buried in the ground, so it wasn't moved.
- Rashba ad loc.: it was found in the ground, so there's no concern of hesset. Or, alternatively, this was before the decree.

**Why sealing helps against corpse-tumah.** A clay jug gets tamei only through its inside (*avir*). In an ohel hamet, a **tzamid patil** (tightly fastened seal) protects everything inside (Bamidbar 19:15; Rambam Tumat Met 21:1, 1:5).

**Oil as a liquid.**
- Oil is one of the 7 liquids that both become tamei and make food susceptible (machshir): water, dew, **oil**, wine, milk, blood, honey (Rambam Tumat Okhalin 1:2).
- A liquid that becomes tamei becomes a *rishon* (first degree), whatever touched it (Parah 8:7; this level of liquid-tumah is rabbinic, Rambam She'ar Avot HaTumot 7:2).
- Tamei terumah oil isn't thrown out. It's burned for light, "shemen sereifah" (Rambam Terumot 11:1, "סך הוא את השמן הטהור ומדליק את הטמא", "he anoints with the pure oil and lights the tamei").

**Tumah hutra or dechuya b'tzibbur.**
- Yoma 6b: Rav Nachman says tumah is **hutra** (permitted) for the community; Rav Sheshet says it is **dechuya** (pushed aside). Under "dechuya, mehadrinan" we search for pure means first.
- Pesachim 77a: a tannaitic dispute (Rabbi Yehuda vs. Rabbi Shimon).
- **Rambam rules dechuya** (Bi'at HaMikdash 4:15-16): "the tumah was not permitted for the community but stands in its prohibition and is pushed aside now because of need, **and one only pushes aside where it is impossible otherwise**."
- Only **tumat met** is pushed aside. Zav, niddah and the like are not (4:9, 4:12; Korban Pesach 7:5).

**So why a miracle, if they could have lit with tamei oil?**
- **Pnei Yehoshua** (Shabbat 21b) raises the question: "since tumah hutra b'tzibbur, they could have lit with tamei oil."
  - Under the "dechuya" view it's "somewhat understandable," but under "hutra" it is very difficult.
  - He also cites the Beit Yosef that all of Israel were tamei met.
  - He considers saying the menorah is not altar-service, but rejects it: Torat Kohanim and the Rambam say the menorah lighting overrides tumah.
  - His conclusion: **the miracle was to show God's love for them** (חיבת המקום), like the miracles that kept the Omer and Shtei HaLechem from becoming pasul.
- **Chatam Sofer** (Chidushei, Shabbat 21b): tumat met is hutra for the community, **but the Sages had decreed gentiles to be like zavim, and zav-tumah is not hutra b'tzibbur**. The Sages didn't know whether to keep their own decree and cancel the lighting. The miracle showed Heaven's agreement with the Sages' fences.
- **Maharsha** (Chidushei Agadot, Shabbat 21b): they couldn't make pure oil for 8 days. Either they were all tamei met (Beit Yosef, Re'em), or, as he prefers following the Ran, the pure oil was 4 days away.
- **Rambam (per Rambam's dechuya ruling) [inference]:** since tumah is only *dechuya*, they had to search for pure oil first ("mehadrinan"). That fits the Gemara's "בדקו" ("they searched").

### (c) Sources
- Shabbat 21b. https://www.sefaria.org/Shabbat.21b.10
  - "בדקו ולא מצאו אלא פך אחד של שמן שהיה מונח בחותמו של כהן גדול" ("they searched and found only one cruse of oil that was placed with the seal of the High Priest.")
- Rashi on Shabbat 21b. https://www.sefaria.org/Rashi_on_Shabbat.21b.10.2
  - "בחותמו – בהצנע וחתום בטבעתו והכיר שלא נגעו בו" ("With his seal: hidden and sealed with his imprint, so he recognized that they had not touched [the oil].")
- Tosafot on Shabbat 21b. https://www.sefaria.org/Tosafot_on_Shabbat.21b.10.1
- Rashba on Shabbat 21b. https://www.sefaria.org/Rashba_on_Shabbat.21b.7
- Penei Yehoshua on Shabbat 21b. https://www.sefaria.org/Penei_Yehoshua_on_Shabbat.21b.6
  - "ולכאורה יש לתמוה כל טורח הנס זה למה דהא קי"ל טומאה הותרה בציבור" ("At first glance, why all the trouble of this miracle, since we hold tumah is permitted for the community?")
- Chidushei Chatam Sofer on Shabbat 21b. https://www.sefaria.org/Chidushei_Chatam_Sofer_on_Shabbat.21b.4
- Chidushei Agadot (Maharsha) on Shabbat 21b. https://www.sefaria.org/Chidushei_Agadot_on_Shabbat.21b.3
- Rambam Chanukah 3:2. https://www.sefaria.org/Mishneh_Torah,_Scroll_of_Esther_and_Hanukkah.3.2
- Yoma 6b. https://www.sefaria.org/Yoma.6b.6-8
  - "רב נחמן אמר: היתר היא בציבור, ולא מהדרינן. ורב ששת אמר: דחויה היא בציבור, ומהדרינן" ("Rav Nachman said: it is permitted for the community, and we don't search [for pure means]. Rav Sheshet said: it is overridden for the community, and we do search.")
- Pesachim 77a. https://www.sefaria.org/Pesachim.77a.11-14
- Rambam Bi'at HaMikdash 4:9-16. https://www.sefaria.org/Mishneh_Torah,_Admission_into_the_Sanctuary.4.15
  - "שהטמאה לא התרה בצבור אלא באסורה עומדת ודחויה היא עתה מפני הדחק" ("because the tumah was not permitted for the community; it remains forbidden and is pushed aside now because of the pressing need.")
- Bamidbar 19:15. https://www.sefaria.org/Numbers.19.15
- Rambam Tumat Met 21:1. https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.21.1
- Rambam Tumat Okhalin 1:2. https://www.sefaria.org/Mishneh_Torah,_Defilement_of_Foods.1.2
- Rambam Terumot 11:1. https://www.sefaria.org/Mishneh_Torah,_Heave_Offerings.11.1
- Avodah Zarah 52b (altar stones, not oil). https://www.sefaria.org/Avodah_Zarah.52b

### (d) Puzzle ideas
1. **"Find the Sealed Jug."** A cluttered Heichal storeroom with many oil jugs. Most have broken or missing seals: "touched, not usable." The player inspects seals with a magnifier to find the one with the Kohen Gadol's seal.
   - Rule shown: an *unmoved*, sealed clay jug stays tahor. If any jug was moved by the soldiers, it's out (the Tosafot/Rashba hesset logic). Keep the soldiers offscreen or in silhouette.
2. **"Tzamid Patil Room."** A room with a cartoon skeleton and three clay jugs: open, loosely covered, tightly sealed. Only the sealed one survives (Bamidbar 19:15).
   - Swap in a stone jug: it can't become tamei at all (Rambam 6:2).
3. **"Pure Oil Run (8 days)."** Escort olives from a far grove to the press without tumah. The game timer is the 8 days. This follows Maharsha/Ran's "4 days away" theory.

---

## 6. Terumah

### (a) Kid-level rule
Terumah is the special portion of produce given to Kohanim. Only a Kohen and his family (wife, kids, even servants and his animals) may eat it, and **only when tahor**.
- A Kohen who went to the mikveh still has to **wait until nightfall** before he may eat terumah.
- Terumah must be guarded so it doesn't become tamei. You may not make it tamei on purpose.
- If it does become tamei, terumah oil can still be burned for light.

### (b) Precise halacha
**Who eats** (Rambam Terumot 6:1-3):
- Kohanim, male and female, adult and child;
- their Canaanite slaves and animals (Vayikra 22:11);
- an Israelite wife after chuppah (by Torah law, from erusin, the betrothal).
- Torah-level terumah only for a Kohen of established lineage (6:2).

**Tumah** (Rambam Terumot 7:1-3):
- A tamei Kohen may not eat terumah, tamei or tahor (Vayikra 22:4).
- Eating tahor terumah while tamei = death by Heaven, so lashes.
- After tevilah, he waits "until the sun sets and three medium stars come out" (Vayikra 22:7, "ובא השמש וטהר ואחר יאכל").
- A tahor Kohen eating tamei terumah transgresses an *asei* (positive command). Note that tumat met needs the full 7 days plus sprinkling first.

**Levels of tumah** (Mishnah Taharot 2:3-6):
- Chullin: rishon is tamei, sheni is pasul, shlishi is ok.
- **Terumah: rishon and sheni are tamei and pass it on; shlishi is pasul and doesn't pass it on**; revi'i is ok.
- Kodesh: one more level (revi'i pasul).
- **Chullin sheni "pasul l'ochlei terumah"** (Taharot 2:6). Chullin at the second degree disqualifies terumah.

**Guarding** (Rambam Terumot 12:1): "אסור לטמא את התרומה של ארץ ישראל... ולא יביאנה לידי טמאה ולא יפסידנה, אלא אוכל הטהורה ומדליק הטמאה" ("It is forbidden to make terumah of Eretz Yisrael tamei... nor bring it to tumah, nor spoil it. Rather he eats the pure and lights the tamei").
- Chutz la'aretz terumah is different (12:1).
- **Doubtful** tumah: don't eat it and don't burn it; leave it until it becomes definitely tamei (12:2-3).
- Bechorot 34a: Rabbi Eliezer vs. Rabbi Yehoshua on whether you must *guard* terumah of doubtful status, from "את משמרת תרומתי" (Bamidbar 18:8). The Rambam follows not changing anything (12:3) [the Rambam does not count "don't make terumah tamei" as one of the 613 mitzvot; Touger's note says the Semag does].
- **Beit haperas and terumah** (from §3): "אין בודקין לתרומה". The blowing check isn't relied on for terumah.

### (c) Sources
- Vayikra 22:4-7, 10-11. https://www.sefaria.org/Leviticus.22
  - "וּבָא הַשֶּׁמֶשׁ וְטָהֵר וְאַחַר יֹאכַל מִן־הַקֳּדָשִׁים" ("As soon as the sun sets, he shall be pure; and afterward he may eat of the sacred donations.")
- Rambam Terumot 6:1. https://www.sefaria.org/Mishneh_Torah,_Heave_Offerings.6.1
- Rambam Terumot 7:1-3. https://www.sefaria.org/Mishneh_Torah,_Heave_Offerings.7.2
  - "אין הטמאים אוכלין בתרומה עד שיעריב שמשן ויצאו שלשה כוכבים בינוניים" ("Impure [priests who have immersed] may not partake of terumah until the sun sets and three [medium] stars appear.")
- Rambam Terumot 12:1-3. https://www.sefaria.org/Mishneh_Torah,_Heave_Offerings.12.1
- Rambam Terumot 11:1. https://www.sefaria.org/Mishneh_Torah,_Heave_Offerings.11.1
- Mishnah Taharot 2:3-6 (Sefaria spelling "Tahorot"). https://www.sefaria.org/Mishnah_Tahorot.2.4
  - "הָרִאשׁוֹן וְהַשֵּׁנִי שֶׁבַּתְּרוּמָה טְמֵאִין וּמְטַמְּאִין. הַשְּׁלִישִׁי, פּוֹסֵל וְלֹא מְטַמֵּא" ("First and second degree uncleanness in terumah are unclean and convey uncleanness; third degree uncleanness causes invalidity but does not convey uncleanness.")
- Bechorot 34a. https://www.sefaria.org/Bekhorot.34a.2-6

### (d) Puzzle ideas
1. **"Chain of Tumah."** Rishon, sheni, shlishi meters. A sheretz touches a loaf (rishon). The loaf touches an apple (sheni). The apple touches terumah grapes (shlishi): pasul, but they can't pass it on.
   - The player arranges a "buffer" so the terumah never gets touched.
2. **"Wait for the Stars."** The Kohen dips in the mikveh. The puzzle is passing time: move clouds and wait for three stars before the terumah plate unlocks (Rambam Terumot 7:2).
3. **"Pure for Eating, Tamei for Lighting."** Sort jugs of terumah oil: pure ones go to the table, tamei ones to the lamp (Terumot 11:1, 12:1). Doubtful ones go on a "wait" shelf (12:2).

---

## 7. Bikurim

### (a) Kid-level rule
Farmers tie a reed around the first fig, grape or pomegranate and say "these are bikurim!"
- Everyone in the region meets in one town, **sleeps outside in the town square, not in houses, so nobody catches tumah from a house with a dead person in it**, and marches to Yerushalayim.
- An ox with **golden horns** and an olive-wreath leads the way, and a flute plays. The leader calls "**Kumu v'na'aleh Tzion!**"
- In Yerushalayim, workers stand up and greet them. Even King Agrippas carries his own basket on his shoulder.
- Bikurim are holy like terumah, so they have to stay tahor and are eaten by tahor Kohanim.

### (b) Precise halacha
**Status** (Mishnah Bikurim 2:1; Rambam Bikurim 3:5).
- Like terumah: death by Heaven and an added fifth for a zar who eats, forbidden to non-Kohanim, Kohen's property, require hand-washing and *ha'arev shemesh* (nightfall).
- Unlike terumah: must be brought to "the place," require a declaration, and are forbidden to an onen (2:2).
- **Stricter than terumah:** a tahor Kohen who eats tamei bikurim gets lashes (Rambam Bikurim 3:5).
- Bikurim that became tamei in the Azarah are scattered there and there's no reading (Rambam 4:10).
- If bikurim became tamei, the baskets don't go to the Kohanim (3:8).

**Procession** (Mishnah Bikurim 3:2-9; Rambam Bikurim 4:16-17):
- They gather in the town of the ma'amad, "so they don't go up alone, 'ברב עם הדרת מלך' ('in a multitude of people is the king's glory')."
- "**ולנים ברחובה של עיר. ולא יכנסו לבתים מפני אהל הטמאה**" ("They sleep in the town square, and don't enter the houses because of tumat ohel").
  - The Mishnah (3:2) says only "they would not enter the houses." **The Rambam supplies the tumah reason. Follow the Rambam.**
- Near ones bring fresh figs and grapes; far ones bring dried figs and raisins.
- The ox goes before them, horns overlaid with gold, an olive crown on its head. The Rambam explains: "to show that the bikurim are from the seven species."
- The flute plays until the Temple Mount.
- Officials come out to greet them; all the craftsmen of Yerushalayim stand and greet them.
- On the Temple Mount, each carries his basket on his shoulder, even King Agrippas. In the Azarah the Levi'im sing "ארוממך ה' כי דליתני" (Tehillim 30).
- The pigeons on the baskets become olot (burnt offerings) (3:5).
- The farmer reads Devarim 26 with the basket on his shoulder (3:6).
- The rich bring gold and silver baskets (returned to them); the poor bring willow baskets (given to the Kohanim) (3:8).

**The bringer must be tahor? [inference + memory].** He enters the Azarah and places the basket by the altar (3:6), so he must be fit to enter the Azarah. A tamei met may not enter the Mikdash (Bamidbar 5:2-3; Rambam Bi'at HaMikdash ch. 3) [memory: not pulled this session]. Combined with the "don't sleep in houses" rule, the **bringer is expected to arrive tahor**.

### (c) Sources
- Mishnah Bikurim 2:1-2. https://www.sefaria.org/Mishnah_Bikkurim.2.1
  - "הַתְּרוּמָה וְהַבִּכּוּרִים... וּטְעוּנִין רְחִיצַת יָדַיִם וְהַעֲרֵב שֶׁמֶשׁ" ("Regarding terumah and bikkurim... they require the washing of hands and the setting of the sun.")
- Mishnah Bikurim 3:1-9. https://www.sefaria.org/Mishnah_Bikkurim.3
  - 3:2: "וְלָנִין בִּרְחוֹבָהּ שֶׁל עִיר, וְלֹא הָיוּ נִכְנָסִין לַבָּתִּים... קוּמוּ וְנַעֲלֶה צִיּוֹן אֶל בֵּית ה' אֱלֹהֵינוּ" ("...and they would sleep in the town square and would not enter the houses... 'Arise, let us go up to Zion, to the house of the Lord our God.'")
  - 3:3: "וְהַשּׁוֹר הוֹלֵךְ לִפְנֵיהֶם, וְקַרְנָיו מְצֻפּוֹת זָהָב, וַעֲטֶרֶת שֶׁל זַיִת בְּרֹאשׁוֹ. הֶחָלִיל מַכֶּה לִפְנֵיהֶם" ("The ox goes before them, its horns overlaid with gold and an olive crown on its head; the flute plays before them.")
  - 3:4: "אֲפִלּוּ אַגְרִיפַּס הַמֶּלֶךְ נוֹטֵל הַסַּל עַל כְּתֵפוֹ" ("even King Agrippas takes the basket on his shoulder.")
- Rambam Bikurim 4:16-17. https://www.sefaria.org/Mishneh_Torah,_First_Fruits_and_other_Gifts_to_Priests_Outside_the_Sanctuary.4.16
  - "ולא יכנסו לבתים מפני אהל הטמאה" ("but they do not enter the homes lest they contract impurity because of being under the same shelter as a corpse.")
- Rambam Bikurim 3:5, 3:8, 4:10. https://www.sefaria.org/Mishneh_Torah,_First_Fruits_and_other_Gifts_to_Priests_Outside_the_Sanctuary.3.5

### (d) Puzzle ideas
1. **"Camp in the Square."** Night falls on the way. Houses around the square: one has a (cartoon, offscreen) "someone passed away" candle in the window. Its awning sticks out over part of the square.
   - The player places bedrolls so no one sleeps under any roof, including the awnings and balconies (zizin) that reach out into the square (Rambam 4:16; Oholot 8:2).
2. **"Golden-Horned Ox Parade."** Lead the procession along a route avoiding marked graves (lime), overhanging trees and a beit haperas. Ties together §3 and §4.
3. **"Basket Sort."** Rich (gold, returned) vs. poor (willow, kept by Kohanim). A basket that got tamei on the way is a fail: "the baskets don't go to the Kohanim" (Rambam 3:8).

---

## 8. Korban Pesach, Pesach Sheni and Parah Adumah

### (a) Kid-level rule
- **Pesach Sheni.** Some people were tamei from a dead body and couldn't bring the Korban Pesach. They asked Moshe: "Why should we miss out?" Hashem gave a second chance one month later, on 14 Iyar.
- **The Parah Adumah children.** To make sure the people preparing the red-heifer ashes were *super* pure, some children were born and raised in special courtyards built on stone with a hollow space underneath, in case there was a forgotten grave deep down.
  - When needed, they rode **oxen with doors on their backs**, holding **stone cups** (stone can't become tamei), down to the Shiloach spring to fill water.

### (b) Precise halacha
**Pesach Sheni** (Bamidbar 9:6-11; Rambam Korban Pesach 5:1-4, 6:1-2):
- Individuals who are tamei (or on a "distant road") bring the Pesach on 14 Iyar.
- **Unique to tumat met (KP 6:2):** if a tamei met's 7th day falls on 14 Nisan, the Pesach is *not* slaughtered for him, even though he immersed, was sprinkled, and could eat kodashim that night. He goes to Pesach Sheni. The Oral Tradition reads Bamidbar 9:6 "ביום ההוא" ("on that day") as their 7th day.
- **Contrast (6:1):** someone tamei from a sheretz or neveilah on the 14th immerses, the Pesach is slaughtered for him, and he eats it at night.
- **Whole community tamei met (Bi'at HaMikdash 4:16; KP 7:5):** if most of the community is tamei met, they bring the Pesach *in tumah* (no Pesach Sheni). But zavim etc. among them bring neither.
- **Beit haperas on the way to the Pesach (KP 6:8):** blow and walk; a trodden beit haperas is pure for the Pesach-bringer.
- Someone who could have become tahor and didn't counts as having skipped the first Pesach on purpose (5:4).

**Parah Adumah children** (Mishnah Parah 3:2-4; Rambam Parah Adumah 2:7; Sukkah 21a):
- Seven days before the burning, the burning Kohen is separated to the "Beit Even" chamber and sprinkled (3:1).
- The sprinkler must be someone who **never** became tamei met. All vessels for filling and sanctifying were stone. These are *extra stringencies* (מעלות יתרות) (Rambam 2:7).
- **Courtyards in Yerushalayim built on rock with a hollow beneath** ("מפני קבר התהום", in case of a grave in the depths). Pregnant women gave birth and raised children there.
- **Oxen**, "because their bellies are wide" (Rambam's reason), with doors on their backs, "so the ohel separates them from the ground because of kever hatehom." Children sat on the doors with stone cups.
- At the Shiloach they climbed down and filled the cups. Rambam: there's no worry at the spring, "because people don't bury in rivers." Rabbi Yose (Mishnah) says they let the cups down from where they sat.
- At the Temple Mount they walked, since it and the courtyards were built over a hollow too.
- At the Azarah entrance was the jar of ashes. Mishnah 3:3 describes a ram with a rope tied between its horns and a stick at the end of the rope, which was thrown into the jar. The ram was struck so it jumped back and spilled ashes, which a child scooped onto the water "enough to be seen on the water." Rabbi Yose objects ("don't give the Tzedukim an opening"); a child took and mixed it himself.
  - **The Rambam (2:7) says simply "they take the ashes and put them on the water in the cups."**
- Even so, the children immersed, in case of another tumah (Rambam 2:7). One child couldn't be reused for another (Parah 3:4).
- **Sukkah 21a:**
  - Rabbi Yehuda says oxen alone, without doors; the ox's belly itself is the ohel.
  - Abaye: the oxen were broad enough.
  - **Rava: no doors, because a child sitting on a wide door gets over-confident, may stick his head or a limb out past the edge, and become tamei.**
  - Rambam rules that doors are used (2:7). Rava's concern is a great kid-game mechanic either way: **keep your head inside the door's edge!**
- **Halachic basis that the ox ohel works.** Oholot 6:1: a board resting "on any living creature" blocks; Rambam Tumat Met 13:3 lists live animals among things that bring and block tumah. The door rests on an ox, not held by a person.

### (c) Sources
- Bamidbar 9:6-11. https://www.sefaria.org/Numbers.9.6
  - "לָמָּה נִגָּרַע לְבִלְתִּי הַקְרִיב אֶת־קׇרְבַּן ה' בְּמֹעֲדוֹ" ("why must we be debarred from presenting GOD's offering at its set time?")
- Rambam Korban Pesach 6:1-2, 6:8. https://www.sefaria.org/Mishneh_Torah,_Paschal_Offering.6.2
  - "טמא מת שחל שביעי שלו להיות בארבעה עשר אף על פי שטבל והזה עליו... אין שוחטין עליו אלא נדחה לפסח שני" ("When the seventh day of one impure from a corpse falls on the fourteenth, even though he immersed and was sprinkled... the Pesach is not slaughtered for him; he is pushed off to Pesach Sheni.")
- Rambam Korban Pesach 5:1-4. https://www.sefaria.org/Mishneh_Torah,_Paschal_Offering.5
- Rambam Korban Pesach 7:5. https://www.sefaria.org/Mishneh_Torah,_Paschal_Offering.7.5
- Rambam Bi'at HaMikdash 4:16. https://www.sefaria.org/Mishneh_Torah,_Admission_into_the_Sanctuary.4.16
- Mishnah Parah 3:2-4. https://www.sefaria.org/Mishnah_Parah.3.2
  - "חֲצֵרוֹת הָיוּ בִירוּשָׁלַיִם בְּנוּיוֹת עַל גַּבֵּי סֶלַע וְתַחְתֵּיהֶם חָלוּל, מִפְּנֵי קֶבֶר הַתְּהוֹם... וּמְבִיאִים שְׁוָרִים וְעַל גַּבֵּיהֶן דְּלָתוֹת, וְתִינוֹקוֹת יוֹשְׁבִין עַל גַּבֵּיהֶן וְכוֹסוֹת שֶׁל אֶבֶן בְּיָדָם" ("Courtyards were built in Jerusalem over rock, and beneath them there was a hollow... against a grave in the depths... And they brought oxen, upon whose backs were placed doors, and the children sat upon them with stone cups in their hands.")
- Rambam Parah Adumah 2:7. https://www.sefaria.org/Mishneh_Torah,_Red_Heifer.2.7
  - "מביאין שורים מפני שכרסיהן נפוחות ומניחים על גביהן דלתות... כדי שיהיה האהל מבדיל בינם לבין הארץ מפני קבר התהום... שאין דרך בני אדם לקבר בנהרות" ("They would bring oxen, because they have ample bellies, and place doors on their backs... so that there would be an ohel intervening between them and the earth because of a grave in the depths... because it is not ordinary practice to bury the dead in streams.")
- Sukkah 21a. https://www.sefaria.org/Sukkah.21a.2-7
- Mishnah Oholot 6:1. https://www.sefaria.org/Mishnah_Oholot.6.1

### (d) Puzzle ideas
1. **"Ox Express to the Shiloach."** The rider is a child on a door on an ox, carrying a stone cup. Hidden "deep graves" sit under the road, shown as faint dotted outlines.
   - The player steers the ox. The child must stay entirely inside the door's footprint: a "lean" meter, where leaning out = fail (Rava's concern, Sukkah 21a).
   - At the spring, climb down (safe: no burials in rivers) or use the "lower the cup on a string" option (Rabbi Yose).
   - Swap in a metal cup: fail. Stone only.
2. **"Hollow-Rock Courtyard Builder."** Place stone floor tiles over 1-tefach-high pillars over unknown ground, so a hidden deep grave can't reach the children's play area (the ohel blocks; Rambam Tumat Met 12:1). Run water and paths so the courtyard is self-contained.
3. **"Pesach Sheni Calendar."** Characters with different tumot reach 14 Nisan:
   - sheretz → mikveh → eats tonight;
   - tamei met whose 7th day is today → Pesach Sheni (KP 6:2);
   - beit haperas walker → blow and walk → goes now (6:8).
   The player sorts them into "14 Nisan" and "14 Iyar" lines.

---

## 9. Other narrative material

### 9a. Rabbi Shimon bar Yochai purifies Tiberias (verify the details)
**What the Bavli actually says** (Shabbat 33b-34a):
- After the cave, Rashbi asks if anything needs fixing. They say there's a place of doubtful tumah, "and the Kohanim are pained by having to go around it."
- He asks whether anyone knows of a chezkat taharah (presumption of purity) there. An elder says: "**Here ben Zakkai cut terumah lupines**" (כאן קיצץ בן זכאי תורמסי תרומה). Rabban Yochanan ben Zakkai, a Kohen, had grown and harvested terumah lupines there, which needs taharah, so the spot was known pure.
- Rashbi "did likewise": "**wherever [the ground] was hard he declared it pure, and wherever it was soft he marked it**."
- **Correction to the brief:** in the Bavli it's ben Zakkai who used the lupines (long before). Rashbi tested hard vs. soft ground.

**The lupine miracle is in Bereshit Rabbah 79:6** (and per Rashi also the Yerushalmi Shevi'it 9:1 and Pesikta): "נסב תרמוסא והוה מקצץ תרמוסא ושדי קצוצותיה ומקלק בשוק, וכל אתרא דהוה קטילא סליק... וכל מקום שלא היתה שמה טמאה תרמסא עומדת" ("He took lupines, cut them and scattered the pieces in the market. Every place where there was a corpse, it rose up... and every place without tumah, the lupine stayed").
- Rashi (Shabbat 34a) brings this version: "he cut lupines and threw them there, and a miracle happened and the corpse floated up, and they marked the grave."
- **Sefaria's English for Bereshit Rabbah renders תרמוסא as "mandrake." That is a mistranslation: it's lupine.**

**Halachic note.** This is a **miracle (nes)**, not a halachic purification method. The halachic tools in the story are chezkat taharah (ben Zakkai's terumah) and inspecting the ground.

**Kid-safety.** Both versions end with Rashbi's gaze killing a mocking elder, turning Yehuda ben Gerim "into a pile of bones," and punishing a Samaritan prankster. **Leave those parts out.**

Sources:
- Shabbat 33b-34a. https://www.sefaria.org/Shabbat.34a.1
  - "ואית להו צערא לכהנים לאקופי... כאן קיצץ בן זכאי תורמסי תרומה. עבד איהו נמי הכי, כל היכא דהוה קשי — טהריה, וכל היכא דהוה רפי — צייניה" ("...and the priests are troubled by being forced to circumvent it... Here ben Zakkai cut the teruma of lupines... Everywhere that the ground was hard, he pronounced it ritually pure... and every place that the ground was soft, he marked it.")
- Rashi on Shabbat 34a. https://www.sefaria.org/Rashi_on_Shabbat.34a.1
- Bereshit Rabbah 79:6. https://www.sefaria.org/Bereshit_Rabbah.79.6

**Level idea: "Rashbi's Market."** The player taps tiles with a staff: hard = pure (green), soft = mark with lime. An old-timer NPC points to "ben Zakkai's lupine patch" as a known-pure anchor. A "bonus miracle" mode scatters lupine bits that pop up over hidden spots (with a note that this was a miracle). Goal: open a direct road so Kohanim don't need the long detour.

### 9b. Other fun material
- **Kohanim jumping over coffins to greet kings** (Berakhot 19b; Rambam Avel 3:14). Most coffins have a tefach of space, so by Torah law the tumah doesn't rise above them; the Sages waived their decree for honor of kings. **Possible "boss parade" level, but jumping over coffins may feel morbid; use crates labeled with a tefach-gap icon only if tasteful.**
- **Mourners' companions following through a beit haperas** (Berakhot 19b; Avel 3:14). Kevod habriyot overrides rabbinic tumah.
- **A minor Kohen** (Avel 3:12). The father trains him; adults may not make him tamei.
- **Eruv on a grave with a flying tower** (Eruvin 31a). Terumah that never became susceptible, picked up with a flat wooden board that can't become tamei, held sideways so it doesn't form a tefach-wide ohel over the grave. A very "puzzle-y" passage, but the Rambam rules the cemetery eruv invalid (Eruvin 6:17).

---

## Open questions and uncertainties

1. **Leaf blower for a Kohen.**
   - *Supported:*
     - Shmuel's blowing is the accepted halacha.
     - Rambam Eruvin 6:17 explicitly applies it to a **Kohen** in a beit haperas ("ואפלו היה כהן... או שינפח והולך").
     - The reason (Rashi Eruvin 30b) is to *reveal* barley-size bones so he doesn't touch or move them. A machine that blows soil off does the same job.
   - *Not explicit:*
     - The sources describe the walker himself blowing as he goes. No source deals with another person (a gardener) blowing ahead. That seems equivalent [inference].
     - A powerful blower might also blow bone chips *into* the Kohen's path or onto him. Gameplay should only reveal, never move bones toward him.
   - *Limits to build in:*
     - (i) Only a **plowed-grave** beit haperas, not a lost-grave field (Moed Katan 5b, Oholot 18:3), not a cemetery, not chutz la'aretz.
     - (ii) Tosafot Ketubot 28b says blowing is only *bedi'avad*; the lechatchilah inspection is sifting (Oholot 18:4). The Rambam's Eruvin ruling suggests he accepts blowing for entering, so following the Rambam it's fine.
     - (iii) Give the Kohen a **mitzvah purpose**, ideally with no other road. Then even without blowing, Avel 3:14 permits him to go through, and blowing means he doesn't even become tamei. Belt and suspenders.
     - (iv) **Terumah:** "אין בודקין לתרומה". Don't end the level with the Kohen eating terumah he carried through on the strength of blowing. Use stable stones, a strong animal, or a box for the terumah instead.
2. **Rambam's ohel zaruk (Tumat Met 11:5: a moving box is not an ohel) vs. the oxen with doors (Parah 2:7, where the moving ox-ohel works).**
   - Possible resolutions [inference]: kever hatehom is a remote doubt and the whole thing is an extra stringency; a live animal walking on the ground isn't "flying" (פורח) or "thrown"; Tosafot Eruvin 30b limits ohel zaruk to the moment of throwing.
   - Not resolved from sources this session.
3. **Whether "tumah yotzet" through closed doors is d'oraita or d'rabbanan.** I believe it is debated, and some call it rabbinic [memory]. The Rambam (7:2) states it without saying.
4. **Golel/dofek:** the Rambam says d'rabbanan (Tumat Met 2:15, Avel 3:13). Other Rishonim say d'oraita [memory]. The game follows the Rambam.
5. **Rambam vs. Mishnah on purifying a beit haperas:** Rabbi Shimon's 1½ + 1½ and digging are rejected by the Rambam (10:12).
6. **Bikurim bringer's taharah** is inferred from entering the Azarah. I didn't pull an explicit Rambam line requiring the *bringer* to be tahor.
7. **Gentile graves for Kohanim** (Rambam permits; SA/Rema say be strict) and the gentiles-as-zavim decree (Chanukah). Halachically real but sensitive for a children's game. I recommend leaving them out or keeping them off-screen.
8. **Translation caveats:** Touger's Rambam English sometimes renders מנפח as "sift" (KP 6:8) and inserts notes. Steinsaltz's Moed Katan 5b English adds "carrying pure items / eat kodashim," which isn't in the Hebrew. Sefaria's English for Bereshit Rabbah 79:6 has "mandrake" for lupine.

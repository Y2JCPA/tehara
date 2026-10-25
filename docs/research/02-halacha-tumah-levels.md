# Tumah & Taharah: Core Rules Engine Spec (for an educational puzzle game)

**Scope:** the core system of tumah levels, how far tumah travels, who can receive it from what, hechsher, shiurim (minimum sizes), vessels, purification, ways tumah is passed on, and doubtful cases.

**Halachic basis:** the Rambam, Mishneh Torah, Sefer Taharah, is the controlling source for every rule (per the user's instruction). The Mishnah, Gemara and Torah verses are given as its sources. Where the Rambam differs from a simple reading of the Mishnah, or a major Rishon disagrees, this is flagged with **⚖ RAMBAM NOTE** and the game follows the Rambam.

**Method:** texts were pulled live from the Sefaria API (v1 `api/texts`, `api/links`, `api/index`, `api/search-wrapper`) on 2026-10-25. Quotes marked ✓ were read in the fetched text. Anything marked **[memory]** was **not** checked against fetched text in this session; verify it before relying on it.

**Sefaria English titles for the Rambam (checked through `api/index`):**

| Hilchot | Sefaria title | Chapters |
|---|---|---|
| Tumat Met | `Mishneh Torah, Defilement by a Corpse` | 25 |
| Parah Adumah | `Mishneh Torah, Red Heifer` | 15 |
| Tumat Tsara'at | `Mishneh Torah, Defilement by Leprosy` | 16 |
| Metamei Mishkav uMoshav | `Mishneh Torah, Those Who Defile Bed or Seat` | 13 |
| She'ar Avot HaTumot | `Mishneh Torah, Other Sources of Defilement` | 20 |
| Tumat Okhalin | `Mishneh Torah, Defilement of Foods` | 16 |
| Kelim | `Mishneh Torah, Vessels` | 28 |
| Mikvaot | `Mishneh Torah, Immersion Pools` | 11 |

**URL pattern:** `https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.11.2`, `https://www.sefaria.org/Mishnah_Tahorot.2.3`, `https://www.sefaria.org/Sotah.29a`. The Mishnah tractate on hechsher is spelled `Mishnah_Makhshirin` and Ohalot is `Mishnah_Oholot` on Sefaria.

**Abbreviations used below:**
- **SAT** = She'ar Avot HaTumot (Other Sources of Defilement)
- **TO** = Tumat Okhalin (Defilement of Foods)
- **TM** = Tumat Met (Defilement by a Corpse)
- **MMM** = Metamei Mishkav uMoshav
- **TT** = Tumat Tsara'at
- **d'oraita** = Torah law; **d'rabbanan** = Rabbinic law

---

## 0. Data model (for the engine)

```
Entity.kind      ∈ {person, hands, keli_metal, keli_wood_leather_bone_cloth (container),
                    keli_flat_wood_leather_bone, keli_cheres (earthenware, with receptacle),
                    keli_cheres_flat, keli_glass, keli_stone/dung/earth, food, liquid}
Entity.sanctity  ∈ {chullin, chullin_al_taharat_terumah, chullin_al_taharat_kodesh, maaser, terumah, kodesh}   (food/liquid only)
Entity.status    ∈ {tahor, AVI_AVOT (met / keli-tamei-met "k'met"), AV, RISHON, SHENI, SHLISHI, REVII,
                    TEVUL_YOM, MECHUSAR_KIPPURIM}
Entity.pasul     = true when the item is itself unfit but cannot pass anything on (end of its chain)
Entity.layer     ∈ {doraita, derabbanan}   // a level created through a Rabbinic link is Rabbinic
Food.hukhshar    : bool   (wetted willingly by one of the 7 liquids, after harvest)
Food.volume      : for transmitting (k'beitzah threshold)
Event            ∈ {touch, carry, ohel, airspace_entry, heset (moved by zav), midras (zav leans/sits/lies), biah (metzora enters house), eat}
Location         ∈ {reshut_hayachid, reshut_harabim}  // used only to resolve doubts
```

---

## A. THE HIERARCHY

### R1. The Met is the strongest source ("Avi Avot HaTumah")
**(a) Kid rule:** A dead person is the "super-source." It is the only thing that makes things tamei just by being under the same roof, and it makes people tamei for 7 days.

**(b) Halacha:**
- A met makes things tamei by touch, by carrying, and by ohel. Things that become tamei from it stay tamei for **seven days** (TM 1:1; 5:1).
- A person who touched a met becomes an **Av HaTumah**, called *tamei met*. Whoever touches *him* becomes tamei only until evening (Bamidbar 19:22; TM 5:2).
- **Metal and other vessels** (not earthenware) that touch a met become "like the met itself" (*cherev harei hu k'chalal*). A person or vessel touching them also becomes 7-day tamei (TM 5:3). This lets the chain stretch to 3 or 4 links (Mishnah Oholot 1:1-3; TM 5:4).
- An **earthenware vessel** never becomes an Av, whether from a met or from anything else (TM 5:6; SAT 10:8).
- The term *Avi Avot HaTumah* is **not** used by the Mishnah or the Rambam. The Rambam calls the met itself, and a tamei-met person or keli, "av." The term comes from Rishonim: Sefaria search found it in Rashi on Haggai 2:13, Rashi on Chullin 88a, and Rashbam on Bamidbar 19:22. It is fine to use as a game label.
- ⚖ **RAMBAM NOTE (TM 5:2):** By Torah law, someone who touches a tamei-met person is tamei until evening, even if the tamei-met person is still touching the met. **By Rabbinic law**, if the first person is *still touching the met*, the second also becomes 7-day tamei. This applies **for terumah and kodashim only**; for a nazir and the korban Pesach the Torah law stands. A simple reading of Oholot 1:1 does not show this.
- ⚖ **RAMBAM NOTE (TM 5:5):** Only the first two links (the person who touched the met, and whoever touches him) are *d'oraita* for karet. The longer vessel chains come from the Oral Tradition and are not counted as "Scriptural" for karet.

**(c) Sources:**
- Bamidbar 19:22 ✓ "וְכֹל אֲשֶׁר־יִגַּע־בּוֹ הַטָּמֵא יִטְמָא וְהַנֶּפֶשׁ הַנֹּגַעַת תִּטְמָא עַד־הָעָרֶב" / "Whatever that impure person touches shall be impure; and the person who touches [that impure one] shall be impure until evening." https://www.sefaria.org/Numbers.19.22
- Mishnah Kelim 1:4 ✓ "חָמוּר מִכֻּלָּם, הַמֵּת, שֶׁהוּא מְטַמֵּא בְאֹהֶל, מַה שֶּׁאֵין כֻּלָּם מְטַמְּאִין" / "More strict than all these is a corpse, for it conveys impurity by ohel, whereby all the others convey no impurity." https://www.sefaria.org/Mishnah_Kelim.1.4
- Mishnah Oholot 1:1-3 ✓ "שְׁנַיִם טְמֵאִים בְּמֵת... כֵּלִים הַנּוֹגְעִים בְּמֵת, וְכֵלִים בַּכֵּלִים, טְמֵאִין טֻמְאַת שִׁבְעָה. הַשְּׁלִישִׁי... טֻמְאַת עֶרֶב" / "Vessels touching a corpse and [other] vessels [touching these] vessels are defiled with seven days' defilement. The third... until the evening." https://www.sefaria.org/Mishnah_Oholot.1.1-3
- Pesachim 14b ✓ "חרב הרי הוא כחלל. והויא ליה אב הטומאה" / the metal sword's status "is like that of one who is slain." https://www.sefaria.org/Pesachim.14b
- TM 5:3 ✓ "כֵּלִים שֶׁנִּטְמְאוּ בְּמֵת... הֲרֵי הֵן לַנּוֹגֵעַ בָּהֶן כְּנוֹגֵעַ בַּמֵּת עַצְמוֹ" / "one who touches them is considered like one who touches a corpse itself." https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.5.3
- TM 5:4-6, 5:9 ✓ https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.5.4

**(d) Puzzle:** "Sword chain." A metal sword touched a met. Player picks a sequence (sword → person → pot → person) and must predict who is "7-day tamei" and who is only "until evening." Teaches that a metal keli carries the met's power one extra step, while an earthenware jug in the same chain stays at Rishon and passes nothing to people.

---

### R2. Avot HaTumah (primary sources)
**(a) Kid rule:** An "Av" is a source strong enough to make a **person** or a **vessel** tamei. Some Avot work just by touch; stronger ones also work when you carry them.

**(b) Halacha.** The Mishnah's ladder (Kelim 1:1-4), from weakest to strongest. Each rung is "above" the previous one because of an added power:

| Rung | Avot | Added power | Rambam |
|---|---|---|---|
| 1 | Sheretz (k'adashah), shichvat zera (k'adashah to touch), tamei met person, metzora in his days of counting, mei chatat **less than** enough to sprinkle | Touch, and airspace of earthenware. **Not** carrying | SAT 4:2; SAT 5:1; TT 11:2 |
| 2 | Nevelah (k'zayit), mei chatat **enough** to sprinkle | Also carrying: the carrier makes his clothes tamei | SAT 1:1; SAT 6:13 |
| 3 | Bo'el niddah | Makes the lower bedding tamei like the upper | MMM ch. 3 [memory for exact halacha] |
| 4 | Zov, spit, semen and urine of a zav; dam niddah | Touch **and** carry | MMM 1:8 |
| 5 | Merkav (saddle a zav rode on) | Makes tamei even under a heavy stone | MMM 6:2 |
| 6 | Mishkav (bed a zav lay on) | Touching it equals carrying it | MMM 6:2 |
| 7 | Zav | Creates mishkav/moshav; heset | MMM 1:1; MMM 8:2 |
| 8 | Zavah | Also makes the man who is with her tamei | |
| 9 | Metzora | Makes tamei by entering a house (biah) | TT 10:11-12 |
| 10 | Human bone k'se'orah | 7-day tumah by touch or carry, not ohel | TM 2:9-10 |
| 11 | Met | Ohel | |

- **Rabbinic Avot:** avodah zarah, its accessories, its offerings, and yayin nesech (SAT 6:1-8). Their offspring are Rabbinic (SAT 6:10).
- **Rambam's general definition (TM 5:7):** anything that makes a **person or keli** tamei by touch is an Av. Every "offspring" (*v'lad*) makes only food and drink tamei, never a person or a keli.

**(c) Sources:**
- Mishnah Kelim 1:1 ✓ "אֲבוֹת הַטֻּמְאוֹת, הַשֶּׁרֶץ, וְשִׁכְבַת זֶרַע, וּטְמֵא מֵת, וְהַמְּצֹרָע בִּימֵי סָפְרוֹ, וּמֵי חַטָּאת שֶׁאֵין בָּהֶם כְּדֵי הַזָּיָה, הֲרֵי אֵלּוּ מְטַמְּאִין אָדָם וְכֵלִים בְּמַגָּע, וּכְלֵי חֶרֶשׂ בַּאֲוִיר, וְאֵינָם מְטַמְּאִין בְּמַשָּׂא" / "The fathers of impurity are: sheretz, semen, one who has contracted corpse impurity, a metzora during the days of his counting, and the waters of purification whose quantity is less than the minimum needed for sprinkling. These convey impurity to people and vessels by contact and to earthenware by presence within their airspace, but they do not convey impurity by being carried." https://www.sefaria.org/Mishnah_Kelim.1.1 (ladder continues at https://www.sefaria.org/Mishnah_Kelim.1.2-4)
- SAT 1:1 ✓ "הַנְּבֵלָה אָב מֵאֲבוֹת הַטֻּמְאוֹת. כְּזַיִת מִבְּשָׂרָהּ מְטַמֵּא אָדָם וְכֵלִים בְּמַגָּע וּכְלֵי חֶרֶס בַּאֲוִיר. וּמְטַמֵּא אֶת הָאָדָם בְּמַשָּׂא לְטַמֵּא בְּגָדִים" / "The carcass of a dead animal is a primary source of impurity. An olive-sized portion of its meat imparts impurity to a person and keilim when touched and to an earthenware container when it enters its inner space..." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.1.1
- SAT 4:2 ✓ "הַשֶּׁרֶץ אָב מֵאֲבוֹת הַטֻּמְאוֹת מְטַמֵּא אָדָם וְכֵלִים בְּמַגָּע וּכְלֵי חֶרֶס בָּאֲוִיר וְאֵינוֹ מְטַמֵּא בְּמַשָּׂא" / "...The minimum measure that imparts impurity is a lentil-sized portion." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.4.2
- SAT 5:1 ✓ semen: Av; k'adashah for the one who touches; any amount for the one who emits it. https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.5.1
- MMM 1:1 ✓ "הַזָּב וְהַזָּבָה וְהַנִּדָּה וְהַיּוֹלֶדֶת כָּל אֶחָד מֵאַרְבַּעְתָּן אָב מֵאֲבוֹת הַטֻּמְאוֹת" / "A zav, a zavah, a niddah, and a woman after childbirth: all these four are primary sources of impurity." https://www.sefaria.org/Mishneh_Torah,_Those_Who_Defile_Bed_or_Seat.1.1
- TT 10:11 ✓ "A person afflicted with tzara'at is a primary source of impurity..." and TT 10:12 ✓ "He imparts impurity to a building when he enters it." https://www.sefaria.org/Mishneh_Torah,_Defilement_by_Leprosy.10.11. On the metzora in his days of counting: TT 11:2 ✓ https://www.sefaria.org/Mishneh_Torah,_Defilement_by_Leprosy.11.2
- TM 5:7 ✓ "זֶה כְּלָל גָּדוֹל בַּטֻּמְאוֹת... וְכָל הַמְטַמֵּא אָדָם וְכֵלִים בִּנְגִיעָה הֲרֵי זֶה אַב הַטֻּמְאָה. וְכָל וְלַד הַטֻּמְאוֹת מְטַמֵּא אֳכָלִין וּמַשְׁקִין וְאֵינוֹ מְטַמֵּא לֹא אָדָם וְכֵלִים" / "This is a great general principle... Any entity that imparts impurity to a person or keilim when touched is called a primary source of ritual impurity. Any derivative of ritual impurity imparts ritual impurity to food and drink, but it does not impart impurity to a person or keilim." https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.5.7

**(d) Puzzle:** "Ladder of Avot" sorting game. Kids order cards from weakest to strongest and unlock each card's special power: touch, then carry, then under a stone, then heset, then entering a house, then ohel. Wrong placements are explained by the power the card lacks.

---

### R3. Derivatives: Rishon, Sheni, Shlishi, Revi'i
**(a) Kid rule:** Every time tumah passes along, it gets one step weaker. Whatever touches an Av is "1st." What touches a 1st is "2nd," then "3rd," then "4th." Each kind of food has a step where the chain stops.

**(b) Halacha (TM 5:8):** Whatever touches an Av is Rishon. Whatever touches a Rishon is Sheni. Whatever touches a Sheni is Shlishi. Whatever touches a Shlishi is Revi'i. All of these are *v'lad hatumah* (offspring).
- ⚖ **RAMBAM NOTE, which links are Torah law (SAT 10:7-9):**
  - **Person:** can be Av or Rishon d'oraita. A person is Sheni only d'rabbanan: after eating tamei food, drinking tamei liquid, or having drawn water poured on him or immersing in it.
  - **Keli (not earthenware):** can be Av or Rishon d'oraita; Sheni only d'rabbanan (from tamei liquids).
  - **Earthenware:** never an Av. Rishon d'oraita; Sheni d'rabbanan.
  - **People and vessels never become Shlishi or Revi'i**, not even d'rabbanan.
  - **Food:** never an Av. Rishon and Sheni d'oraita (a Rishon person or keli touching food makes it Sheni). **Shlishi and Revi'i for food exist only by Rabbinic law.**
  - A simple reading of R. Akiva's derivation (Sotah 27b) and R. Yochanan ben Zakkai's kal va-chomer (Sotah 29a) treats the Shlishi as Torah-based. The Rambam places it in *divrei soferim*. The game can show both "how" and "which layer."

**(c) Sources:**
- TM 5:8 ✓ "Any entity that touches a primary source of impurity is referred to as a derivative of the first degree. Anything that touches a derivative of the first degree is referred to as a derivative of the second degree..." https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.5.8
- SAT 10:8 ✓ "וְלֹא יִהְיֶה הָאָדָם וְלֹא הַכֵּלִים שְׁלִישִׁי וְלֹא רְבִיעִי לְעוֹלָם לֹא מִדִּבְרֵי תּוֹרָה וְלֹא מִדִּבְרֵי סוֹפְרִים" / "Neither persons, nor keilim ever become a third degree or a fourth degree derivative of impurity, neither according to Scriptural Law, nor according to Rabbinic Law." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.10.8
- SAT 10:9 ✓ "הָאֳכָלִים לֹא יִהְיוּ אַב טֻמְאָה לְעוֹלָם... וְיִהְיוּ רִאשׁוֹן וְשֵׁנִי מִדִּבְרֵי תּוֹרָה... וְהָאֳכָלִין יִהְיוּ שְׁלִישִׁי וּרְבִיעִי לְטֻמְאָה מִדִּבְרֵיהֶן בִּלְבַד" / "Foods will never become a primary source... They may become primary and secondary derivatives according to Scriptural Law... According to the Sages alone, foods may become third degree derivatives or fourth degree derivatives." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.10.9
- Vayikra 11:33 ✓ "וְכָל־כְּלִי־חֶרֶשׂ אֲשֶׁר־יִפֹּל מֵהֶם אֶל־תּוֹכוֹ כֹּל אֲשֶׁר בְּתוֹכוֹ יִטְמָא וְאֹתוֹ תִשְׁבֹּרוּ" / "if any of those falls into an earthen vessel, everything inside it shall be impure and [the vessel] itself you shall break." https://www.sefaria.org/Leviticus.11.33. Its use as a source for Sheni: SAT 11:2.
- Sotah 27b (Mishnah Sotah 5:2) ✓ "אינו אומר ׳טמא׳ אלא ׳יטמא׳, לטמא אחרים. למד על ככר שני שמטמא את השלישי" / "The verse does not state 'is impure' but 'shall be impure'... This teaches with regard to a loaf that has second-degree impurity... that it can render other food impure with third-degree impurity." https://www.sefaria.org/Sotah.27b

**(d) Puzzle:** "Count the hops." A sheretz falls into an oven with bread inside. The oven is Rishon and the bread is Sheni (Vayikra 11:33; SAT 11:2). The bread then touches a terumah cake, which becomes Shlishi. Kids label each hop.

---

### R4. Ten levels of kedusha (map) and ten "steps out of tumah" for a person
**(a) Kid rule:** The closer you get to the Kodesh HaKodashim, the "cleaner" you must be. Each gate needs a higher purity level.

**(b) Halacha (Mishnah Kelim 1:5-9):**
- **Ten steps out of tumah (1:5):**
  - *Mechusar kippurim:* barred from kodesh, permitted terumah and ma'aser.
  - *Tevul yom:* barred from kodesh and terumah, permitted ma'aser.
  - *Ba'al keri:* barred from all three.
  - Then bo'el niddah, zav of 2 sightings, zav of 3, metzora musgar/muchlat, and a limb with or without proper flesh.
- **Ten levels of holiness (1:6-9):**

| Area | Who may not enter |
|---|---|
| Eretz Yisrael | (holier than other lands; source of the omer, bikkurim, shtei halechem) |
| Walled cities | Metzora |
| Inside Yerushalayim | (lesser kodashim and ma'aser sheni are eaten here) |
| Har HaBayit | Zav, zavah, niddah, yoledet |
| Cheil | Non-Jews and tamei met |
| Ezrat Nashim | Tevul yom |
| Ezrat Yisrael | Mechusar kippurim |
| Ezrat Kohanim | Yisraelim, except for semichah, shechitah or tenufah |
| Between Ulam and Mizbe'ach | Blemished kohanim, or kohanim with unkempt hair |
| Heichal | Anyone with unwashed hands and feet |
| Kodesh HaKodashim | Everyone except the Kohen Gadol on Yom Kippur |

- Rambam parallel: Hilchot Beit HaBechirah ch. 7 and Bi'at HaMikdash ch. 3 **[memory, not fetched]**. This is outside Sefer Taharah.

**(c) Sources:**
- Mishnah Kelim 1:5 ✓ "עֶשֶׂר טֻמְאוֹת פּוֹרְשׁוֹת מִן הָאָדָם. מְחֻסַּר כִּפּוּרִים, אָסוּר בַּקֹּדֶשׁ וּמֻתָּר בַּתְּרוּמָה וּבַמַּעֲשֵׂר. חָזַר לִהְיוֹת טְבוּל יוֹם, אָסוּר בַּקֹּדֶשׁ וּבַתְּרוּמָה וּמֻתָּר בַּמַּעֲשֵׂר..." https://www.sefaria.org/Mishnah_Kelim.1.5
- Mishnah Kelim 1:8 ✓ "The Temple Mount is holier, for zavim, zavot, menstruants and women after childbirth may not enter it. The chel is holier, for neither non-Jews nor one who contracted corpse impurity may enter it. The court of women is holier, for a tevul yom may not enter it..." https://www.sefaria.org/Mishnah_Kelim.1.6-9

**(d) Puzzle:** "World map" level select. Each zone is a gate that checks the avatar's status. A tevul-yom avatar gets past the Cheil but is stopped at Ezrat Nashim until sunset. Good as the meta-structure of the game.

---

## B. HOW FAR TUMAH TRAVELS, BY TYPE OF FOOD

### R5. Chullin (ordinary food): stops at Sheni ("ein sheni oseh shlishi b'chullin")
**(a) Kid rule:** Regular food can be "1st" or "2nd." A 2nd is spoiled but can't spoil anything else. A "3rd" doesn't exist for regular food.

**(b) Halacha:** In chullin a Rishon is *tamei u'metamei* (impure, and makes others impure). A Sheni is *pasul v'lo metamei* (unfit, and passes nothing on). A Sheni of chullin does **not** create a Shlishi in chullin.

Two important exceptions:
1. A chullin Sheni still makes **liquids** tamei (they become Rishon). See R14.
2. A chullin Sheni **disqualifies terumah** it touches (the terumah becomes Shlishi).

Tevel, demai-type mixtures (*dimu'a*), ma'aser rishon and ma'aser sheni, and dough before challah is taken all follow the chullin rules (SAT 11:15).

**(c) Sources:**
- SAT 11:2 ✓ "הָרִאשׁוֹן שֶׁבְּחֻלִּין טָמֵא וּמְטַמֵּא. הַשֵּׁנִי פָּסוּל וְלֹא מְטַמֵּא וְאֵין שֵׁנִי עוֹשֶׂה שְׁלִישִׁי בְּחֻלִּין" / "With regard to ordinary foods, a primary derivative contracts impurity and imparts impurity to others. A secondary derivative is disqualified, but does not impart impurity, for a secondary derivative does not create a tertiary derivative with regard to ordinary food." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.11.2
- Mishnah Tahorot 2:3 ✓ "הָרִאשׁוֹן שֶׁבַּחֻלִּין, טָמֵא וּמְטַמֵּא. הַשֵּׁנִי פּוֹסֵל וְלֹא מְטַמֵּא. וְהַשְּׁלִישִׁי נֶאֱכָל בִּנְזִיד הַדָּמַע" / "...and third [degree] may be eaten in a dish mixed with terumah." https://www.sefaria.org/Mishnah_Tahorot.2.3
- Mishnah Tahorot 2:6 ✓ "הַשֵּׁנִי שֶׁבְּחֻלִּין, מְטַמֵּא מַשְׁקֵה חֻלִּין, וּפוֹסֵל לְאֳכָלֵי תְרוּמָה" / "Second [degree] in common food conveys uncleanness to unconsecrated liquids and causes invalidity to terumah food." https://www.sefaria.org/Mishnah_Tahorot.2.6
- Mishnah Tevul Yom 4:1 ✓ "...third degree uncleanness counts as clean in hullin." https://www.sefaria.org/Mishnah_Tevul_Yom.4.1
- SAT 11:15 ✓ https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.11.15
- On the phrase *ein sheni oseh shlishi b'chullin*: it is Rambam's wording in SAT 11:2. The Gemara discussion is Chullin 33b-34a, cited by the Kesef Mishneh on SAT 11:9 ✓. The Chullin daf was **not** fetched directly.

**(d) Puzzle:** "The dead-end loaf." A chullin Sheni loaf touches a plate of chullin cookies (no effect), then a cup of chullin juice-water (the water becomes Rishon). The aha moment: the "weak" loaf still made the water strong.

---

### R6. Terumah: stops at Shlishi (pasul)
**(a) Kid rule:** The kohen's food is more sensitive. It can be 1st, 2nd or 3rd. The 3rd is ruined but can't ruin anything else.

**(b) Halacha:**
- In terumah, Rishon and Sheni are *tamei u'metamei*. Shlishi is *pasul v'lo metamei*. There is no Revi'i in terumah (SAT 11:3).
- The Rambam's proof: a tevul yom, who has the status of a Sheni, disqualifies terumah (Vayikra 22:7), so a Sheni makes a Shlishi in terumah.
- A terumah Shlishi **does** still disqualify kodesh, making it Revi'i. It also makes **kodesh liquids** Rishon (SAT 11:8; Tahorot 2:6).
- Challah, bikkurim, and *terumat ma'aser* restitution (the replacement plus the added fifth) are treated as terumah (SAT 11:14).
- ⚖ The Rambam (SAT 11:3) brings a verse for terumah-Shlishi, yet in SAT 10:9 he calls food-Shlishi Rabbinic. Treat it as Rabbinic, with a Scriptural *asmachta* (supporting hint).

**(c) Sources:**
- SAT 11:3 ✓ "הָרִאשׁוֹן וְהַשֵּׁנִי שֶׁבַּתְּרוּמָה טְמֵאִים וּמְטַמְּאִים. הַשְּׁלִישִׁי פָּסוּל וְלֹא מְטַמֵּא וְאֵין שְׁלִישִׁי עוֹשֶׂה רְבִיעִי בִּתְרוּמָה" / "With regard to terumah, primary and secondary derivatives of impurity contract impurity and impart impurity. A tertiary derivative is disqualified, but does not impart impurity." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.11.3
- Mishnah Tahorot 2:4 ✓ "הָרִאשׁוֹן וְהַשֵּׁנִי שֶׁבַּתְּרוּמָה טְמֵאִין וּמְטַמְּאִין. הַשְּׁלִישִׁי, פּוֹסֵל וְלֹא מְטַמֵּא. וְהָרְבִיעִי, נֶאֱכָל בִּנְזִיד הַקֹּדֶשׁ" https://www.sefaria.org/Mishnah_Tahorot.2.4
- Sotah 29a ✓ "ומה טבול יום שמותר בחולין — פוסל בתרומה, ככר שני שפסול בחולין — אינו דין שיעשה שלישי בתרומה?" / "If even one who immersed that day... who is permitted to touch non-sacred articles, disqualifies teruma... a loaf that has second-degree impurity... isn't it logical that it should impart third-degree impurity [to terumah]?" https://www.sefaria.org/Sotah.29a
- Vayikra 22:7 ✓ "וּבָא הַשֶּׁמֶשׁ וְטָהֵר וְאַחַר יֹאכַל מִן־הַקֳּדָשִׁים" / "As soon as the sun sets, he shall be pure; and afterward he may eat of the sacred donations." https://www.sefaria.org/Leviticus.22.7
- Pesachim 19a / Mishnah Chagigah 3:2 ✓ "והרביעי בקודש פסול, והשלישי בתרומה" https://www.sefaria.org/Pesachim.19a ; https://www.sefaria.org/Mishnah_Chagigah.3.2

**(d) Puzzle:** "Three steps and out." Chain a terumah challah through Rishon, then Sheni, then Shlishi. On the 4th touch the chain "fizzles": the Shlishi challah touches another terumah roll and nothing happens. If it touches a kodesh mincha, that becomes Revi'i.

---

### R7. Kodashim: stops at Revi'i (pasul)
**(a) Kid rule:** Korban food is the most sensitive. It goes down to "4th," and the 4th is ruined but stops there.

**(b) Halacha:**
- In kodesh, Rishon, Sheni and Shlishi are *tamei u'metamei*. Revi'i is *pasul*. There is never a fifth (SAT 11:4).
- Shlishi in kodesh is learned from Vayikra 7:19. Revi'i in kodesh comes from a kal va-chomer (R. Yose): a *mechusar kippurim* may eat terumah but not kodesh, so a Shlishi, which disqualifies terumah, should surely produce a Revi'i in kodesh.
- **Kodesh** for these rules (SAT 11:13) means: sacrificial meat; the todah breads and nazir's loaves once the korban is slaughtered; menachot sanctified in a *kli sharet*; shtei halechem; lechem hapanim once its crust has formed. If not yet sanctified this way, they are treated like terumah.

**(c) Sources:**
- SAT 11:4 ✓ "הָרִאשׁוֹן וְהַשֵּׁנִי וְהַשְּׁלִישִׁי בַּקֹּדֶשׁ טְמֵאִין וּמְטַמְּאִין. הָרְבִיעִי פָּסוּל וְאֵינוֹ מְטַמֵּא וְאֵין רְבִיעִי עוֹשֶׂה חֲמִישִׁי לְעוֹלָם" https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.11.4
- Vayikra 7:19 ✓ "וְהַבָּשָׂר אֲשֶׁר־יִגַּע בְּכׇל־טָמֵא לֹא יֵאָכֵל" / "Flesh that touches anything impure shall not be eaten." https://www.sefaria.org/Leviticus.7.19
- Pesachim 18b ✓ "ומה מחוסר כפורים שמותר בתרומה, פסול בקודש. שלישי שפסול בתרומה — אינו דין שיעשה רביעי בקודש? ולמדנו שלישי בקודש מן התורה, ורביעי מקל וחומר." https://www.sefaria.org/Pesachim.18b ; parallel in Sotah 29b ✓ https://www.sefaria.org/Sotah.29b
- Pesachim 19a ✓ "רביעי אין, חמישי לא. שלישי אין, רביעי לא." https://www.sefaria.org/Pesachim.19a
- Mishnah Tahorot 2:5 ✓ "הָרִאשׁוֹן וְהַשֵּׁנִי וְהַשְּׁלִישִׁי שֶׁבַּקֹּדֶשׁ, טְמֵאִין וּמְטַמְּאִין. הָרְבִיעִי, פּוֹסֵל וְלֹא מְטַמֵּא" https://www.sefaria.org/Mishnah_Tahorot.2.5
- SAT 11:13 ✓ https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.11.13

**(d) Puzzle:** "Same touch, three results." One Sheni loaf touches three plates in turn: chullin (nothing), terumah (Shlishi, pasul), kodesh (Shlishi, *still tamei* and can make a Revi'i). The kid then predicts the next hop for each plate.

---

### R8. Chullin prepared "al taharat terumah / al taharat ha-kodesh"
**(a) Kid rule:** If you treat your regular food as carefully as the kohen's food, it gets one extra step (a "3rd" that is ruined).

**(b) Halacha (Rambam):**
- **Chullin al taharat terumah:** its Shlishi is *pasul*, like terumah. But it does not make kodesh Revi'i, and does not even disqualify kodesh liquids (SAT 11:9).
- **Chullin al taharat ha-kodesh:** its Shlishi is **tahor, like plain chullin** (SAT 11:9; SAT 12:16).
  - It does share the first six of the eleven ma'alot of kodesh (SAT 12:16).
  - Eating a Shlishi of chullin-al-taharat-kodesh leaves a person tahor (SAT 11:12).
- ⚖ **MACHLOKET:**
  - The Rambam follows the Tanna Kamma of Mishnah Tahorot 2:8 ✓ "וְחֻלִּין שֶׁנַּעֲשׂוּ עַל גַּב קֹדֶשׁ, הֲרֵי אֵלּוּ כְחֻלִּין" / "Common food that was prepared under conditions proper to the cleanness of consecrated food is still regarded as common food."
  - **Raavad** (Hasagot on SAT 11:9 ✓) objects sharply: "זה האיש תפס הדרך המסוכסכת בסירים והניח הדרך הסלולה". He argues that most sugyot (Chullin, Niddah, and the stam mishnah in Chagigah) treat chullin al taharat ha-kodesh **like kodesh**, and that the Rambam followed a lone opinion.
  - The Kesef Mishneh ✓ traces this through Chullin 33b-34a.
  - **Game choice:** follow the Rambam (Shlishi tahor), but consider **leaving this case out of kids' levels** because it is disputed.

**(c) Sources:**
- SAT 11:9 ✓ "חֻלִּין שֶׁנַּעֲשׂוּ עַל טָהֳרַת תְּרוּמָה הַשְּׁלִישִׁי שֶׁבָּהֶן פָּסוּל כִּתְרוּמָה. וְאִם נָגַע בַּקֹּדֶשׁ אֵינוֹ עוֹשֵׂהוּ רְבִיעִי..." / "...When ordinary food is prepared with the stringencies of consecrated food, a tertiary derivative is pure like ordinary food." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.11.9
- SAT 12:16 ✓ https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.12.16
- Mishnah Tahorot 2:2 ✓ (R. Yehoshua: "בְּחֻלִּין שֶׁנַּעֲשׂוּ לְטָהֳרַת תְּרוּמָה") https://www.sefaria.org/Mishnah_Tahorot.2.2 ; Tahorot 2:8 ✓ https://www.sefaria.org/Mishnah_Tahorot.2.8
- Raavad ✓ https://www.sefaria.org/Hasagot_HaRa'avad_on_Mishneh_Torah,_Other_Sources_of_Defilement.11.9.1 ; Kesef Mishneh ✓ https://www.sefaria.org/Kessef_Mishneh_on_Mishneh_Torah,_Other_Sources_of_Defilement.11.9.2

**(d) Puzzle (advanced/optional):** A "Chaver's kitchen" bonus level. The same Shlishi cookie is pasul if the family keeps terumah-level purity, and tahor if they keep only plain chullin.

---

### R9. "Tamei" vs. "Pasul"
**(a) Kid rule:** "Tamei" means it is sick **and contagious**. "Pasul" means it is sick but **not contagious**. It can't be eaten (by those who need that level), but it can't spread anything.

**(b) Halacha (SAT 11:1):** "Pasul" for food means the food itself is tamei but does not make another food of its kind tamei. The pasul levels are:
- Sheni in chullin
- Shlishi in terumah
- Revi'i in kodesh
- Whatever a tevul yom or mechusar kippurim touches

**Caveat on "of its kind":** a pasul item can still affect a *more sensitive* category. A chullin Sheni disqualifies terumah and makes liquids tamei. A terumah Shlishi disqualifies kodesh and makes kodesh liquids tamei (SAT 11:7-8).

**(c) Sources:**
- SAT 11:1 ✓ "כָּל מָקוֹם שֶׁנֶּאֱמַר בָּאֳכָלִין פָּסוּל הוּא שֶׁיִּהְיֶה הָאֹכֶל עַצְמוֹ טָמֵא וְלֹא יְטַמֵּא אֹכֶל אַחֵר. אֶלָּא אִם נָגַע בְּאֹכֶל אַחֵר הֲרֵי הוּא טָהוֹר" / "Whenever the term 'disqualified' is used with regard to foods, the intent is that the food itself is considered as impure, but it does not impart impurity to other similar foods." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.11.1
- SAT 11:7-8 ✓ https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.11.7-8

**(d) Puzzle:** Two icon types in the UI: a red "contagious" aura (tamei) and a grey "broken" icon (pasul). Puzzles where kids must cut off the spread by noticing that an item is only grey for *this* plate type.

---

### R10. Basar ta'avah (ordinary meat) is treated as Shlishi for kodesh
**(a) Kid rule:** Even perfectly clean regular meat acts as a "3rd" toward korban meat, so the two won't get mixed up.

**(b) Halacha (SAT 11:5):** Rabbinic. Ordinary meat that is tahor makes kodesh **pasul** (Revi'i), but has no effect on terumah. The Rambam gives his own reason ("וְיֵרָאֶה לִי"): so that people will not mix it up with kodesh meat.

**(c) Source:** SAT 11:5 ✓ "בְּשַׂר תַּאֲוָה אַף עַל פִּי שֶׁהוּא טָהוֹר גָּזְרוּ עָלָיו שֶׁיִּהְיֶה כִּשְׁלִישִׁי לְטֻמְאָה מְטַמֵּא אֶת הַקֹּדֶשׁ וְאֵינוֹ פּוֹסֵל אֶת הַתְּרוּמָה" https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.11.5

**(d) Puzzle:** A trick level. Nothing tamei is on the table at all, yet the shelamim meat ends up pasul because it touched regular meat.

---

## C. WHO CAN RECEIVE TUMAH FROM WHAT

### R11. People and vessels are made tamei only by an Av
**(a) Kid rule:** Only a big source (an Av) can make a **person** or a **pot** tamei. A "1st" can't do it. It can only affect food and drinks.

**(b) Halacha:**
- *D'oraita*: a Rishon, whether person, keli or food, does not make a person or a keli tamei (TM 1:5; TM 5:7).
- Exceptions and Rabbinic layers:
  1. **Tamei-met vessels** count as Av (see R1).
  2. **Tamei liquids** make keilim tamei, by Rabbinic decree (R15).
  3. **Hands** that touch a Rishon become Sheni, by Rabbinic decree (R16).
  4. A person who **eats or drinks** tamei food becomes Sheni, by Rabbinic decree (R17).
  5. A person who touches an Av that defiles by carrying (zav, mishkav, mei chatat enough to sprinkle, and so on), **while still touching it**, makes his **clothes and other keilim** tamei as a Rishon (SAT 6:12; MMM 6:2). This is *mamid begadim* ("ad shetifrosh").
     - For nevelah and merkav this applies **only when carrying them**, not by touch (SAT 6:12; SAT 1:1).
     - Sheretz, semen and other Avot that don't defile by carrying never do this, even during the touch (SAT 6:11).

**(c) Sources:**
- TM 1:5 ✓ "וְזֶהוּ כְּלָל גָּדוֹל בַּטֻּמְאָה. כָּל הַמְטַמֵּא אָדָם בְּמַגָּע מְטַמֵּא כֵּלִים. וְכָל שֶׁאֵינוֹ מְטַמֵּא אָדָם בְּמַגָּע אֵינוֹ מְטַמֵּא כֵּלִים. וְאֵין אָדָם וְכֵלִים מְקַבְּלִין טֻמְאָה אֶלָּא מֵאַב הַטֻּמְאָה" / "Whatever causes a person to contract ritual impurity when touching him, causes keilim to contract ritual impurity... A person and keilim contract ritual impurity only from a primary source." The last clause is **in brackets** in Sefaria's Hebrew edition, a textual addition. https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.1.5
- TM 5:7 ✓ (quoted in R2).
- SAT 1:1 ✓ "If he touches keilim - even at the same time that he is touching the carcass - they are pure. Similarly, the clothes that he is wearing are pure, for he is a derivative of impurity and a derivative does not impart impurity to keilim." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.1.1
- SAT 6:11-12 ✓ https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.6.11-12

**(d) Puzzle:** "Can a Rishon tag you?" A kid who touched a sheretz (now Rishon) high-fives a friend and grabs a metal spoon. Neither becomes tamei d'oraita. Then he touches a cucumber that was wetted earlier: it becomes Sheni.

---

### R12. Food and drink: what makes them tamei (Torah vs. Rabbinic layers)
**(a) Kid rule:** Food can catch tumah from a tamei person or a tamei pot. Food catching it from *other food* is a Rabbinic rule. Food never makes a pot tamei.

**(b) Halacha (SAT 7:1, 7:5; TO 4:1):**
- Food and liquids receive tumah d'oraita (Vayikra 11:34).
- Tamei food making other food tamei is **d'rabbanan** (SAT 7:1).
- Food **never** makes a keli tamei, not even d'rabbanan (SAT 7:1).
- **Shiur:** food becomes tamei in any amount, even a sesame seed. To make *other* food, liquid or hands tamei it must be **k'beitzah** (TO 4:1).
- Foods of the same type of tumah combine to make a k'beitzah. A mixture takes the **lower** level (TO 4:11-16). Example: half a k'beitzah of Rishon plus half a k'beitzah of Sheni is a k'beitzah of Sheni (TO 4:12).
- ⚖ **RAMBAM NOTE:** Food-to-food tumah is d'rabbanan (SAT 7:1). This differs from a straightforward reading of R. Akiva's "יִטְמָא — לטמא אחרים" (Sotah 27b) and of Pesachim 18b ("yitma, l'tamei et ha-mashkin").

**(c) Sources:**
- Vayikra 11:34 ✓ "מִכׇּל־הָאֹכֶל אֲשֶׁר יֵאָכֵל אֲשֶׁר יָבוֹא עָלָיו מַיִם יִטְמָא וְכׇל־מַשְׁקֶה אֲשֶׁר יִשָּׁתֶה בְּכׇל־כְּלִי יִטְמָא" https://www.sefaria.org/Leviticus.11.34
- SAT 7:1 ✓ "...וְאֵין הָאֹכֶל שֶׁנִּטְמָא מְטַמֵּא אֹכֶל אַחֵר מִן הַתּוֹרָה. וְלֹא הַמַּשְׁקִין שֶׁנִּטְמְאוּ מְטַמְּאִין..." / "Food that contracted impurity does not impart impurity to other foods according to Scriptural Law. Nor do liquids... Food does not, by contrast, ever impart impurity to a container that it touches even according to Rabbinic Law." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.7.1
- TO 4:1 ✓ "כַּמָּה שִׁעוּר אֳכָלִין לְטֻמְאָה. לְטֻמְאַת עַצְמָן כָּל שֶׁהֵן אֲפִלּוּ שֻׁמְשֹׁם אוֹ חַרְדָּל..." / "Food does not impart impurity to other foods or liquids or a person's hands until it is the size of an egg without its shell." https://www.sefaria.org/Mishneh_Torah,_Defilement_of_Foods.4.1
- TO 4:12-16 ✓ https://www.sefaria.org/Mishneh_Torah,_Defilement_of_Foods.4.12

**(d) Puzzle:** "Too small to spread." A tamei grape (less than k'beitzah) sits on a terumah cake: the cake stays tahor. Add another tamei piece so the pile reaches k'beitzah: now it spreads. Kids learn to combine pieces, and that the combined pile takes the weakest level in it.

---

### R13. Kodesh is susceptible even without hechsher ("chibat ha-kodesh")
**(a) Kid rule:** Korban food is so precious that it can become tamei even if it never got wet.

**(b) Halacha (SAT 12:13-14):**
- Dry, un-wetted terumah may be eaten with tamei hands.
- Kodesh may not: *chibat ha-kodesh* makes it susceptible, and an Av touching dry kodesh makes it tamei.
- It is an open question (*safek*) whether degrees are counted from such kodesh.

**(c) Sources:**
- SAT 12:13 ✓ "אֳכָלִין נְגוּבִין שֶׁלֹּא הֻכְשְׁרוּ אוֹכְלִין אוֹתָם בְּיָדַיִם מְסֹאָבוֹת. בַּמֶּה דְּבָרִים אֲמוּרִים בִּתְרוּמָה. אֲבָל בְּקֹדֶשׁ חִבַּת הַקֹּדֶשׁ מַכְשַׁרְתָּן" https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.12.13
- Mishnah Chagigah 3:3 ✓ "One may eat dry foods... with impure hands when it is teruma, but not when it is sacrificial food." https://www.sefaria.org/Mishnah_Chagigah.3.3

**(d) Puzzle:** The "dry-food shield" (R18) works on every plate except the kodesh plate.

---

### R14. Liquids are always Rishon ("mashkin l'olam techilah")
**(a) Kid rule:** Drinks are "super-catchers." If a drink touches anything tamei, even a weak "2nd," the drink becomes a strong "1st." And it can pass that on drink-to-drink forever.

**(b) Halacha:**
- Any of the seven liquids that touches an Av, a Rishon, **or a Sheni** becomes **Rishon**. This includes chullin liquid (Tahorot 2:6) and tamei hands (SAT 8:10).
- Liquids have no descending degrees. A chain of a hundred liquids stays Rishon (SAT 7:5).
- Receiving tumah is d'oraita (Vayikra 11:34). Becoming *Rishon to transmit* after touching a Rishon or Sheni is d'rabbanan (SAT 10:10).
- **Exceptions:**
  - A **tevul yom** (and a mechusar kippurim for kodesh), and the fluids they emit, do **not** make liquids Rishon. Chullin liquid stays tahor; terumah liquid becomes Shlishi; kodesh liquid becomes Revi'i (SAT 10:3-4, 10:10; Parah 8:7 "חוּץ מִטְּבוּל יוֹם"; Tevul Yom 2:1-2).
  - A **terumah Shlishi** touching **terumah liquid**: tahor. A **kodesh Revi'i** touching **kodesh liquid**: tahor. A terumah Shlishi touching kodesh liquid: Rishon (SAT 11:8; SAT 12:11).
- Doubt: *safek mashkin l'tamei acherim* is tahor, but *safek mashkin l'hitamei* (whether the liquid itself became tamei) is tamei (SAT 14:1; Tahorot 4:7).
- Shiur: liquids become tamei and pass it on in **any amount** (TO 4:2).
- ⚖ **MACHLOKET (Gemara):** Pesachim 14b ✓. Rava infers that R. Akiva holds "טומאת משקין לטמא אחרים דאורייתא". Others hold it is Rabbinic. Pesachim 16a (R. Yose ben Yo'ezer, "mashkeh beit mitbechaya dakhan") is **[memory, not fetched]**. **The Rambam rules d'rabbanan (SAT 7:1-2).** Follow that.

**(c) Sources:**
- Mishnah Parah 8:7 ✓ "כָּל הַפּוֹסֵל אֶת הַתְּרוּמָה, מְטַמֵּא אֶת הַמַּשְׁקִין לִהְיוֹת תְּחִלָּה לְטַמֵּא אֶחָד וְלִפְסֹל אֶחָד, חוּץ מִטְּבוּל יוֹם" / "Whatever causes terumah to be invalid causes liquid to become unclean in the first grade so that it can convey uncleanness at one remove, and render unfit at one other remove, except for a tevul yom." https://www.sefaria.org/Mishnah_Parah.8.7. Quoted in Pesachim 14b ✓ "כל הפוסל את התרומה — מטמא משקין להיות תחלה, חוץ מטבול יום." https://www.sefaria.org/Pesachim.14b
- SAT 7:5 ✓ "...אֲבָל הַמַּשְׁקִין אֶחָד מַשְׁקֶה שֶׁנָּגַע בְּאַב הַטֻּמְאָה אוֹ שֶׁנָּגַע בְּרִאשׁוֹן אוֹ בְשֵׁנִי..." / "With regard to liquids... whether a liquid touches a primary source of impurity, a primary derivative or a secondary derivative, that liquid is considered as a primary derivative... even if there is a chain of a hundred. For there is no concept of degrees of impurity with regard to liquids." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.7.5
- SAT 8:10 ✓ "...שֶׁהַמַּשְׁקִין תְּחִלָּה לְעוֹלָם כְּמוֹ שֶׁבֵּאַרְנוּ" https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.8.10
- SAT 10:3 ✓ "הֲרֵי נִתְבָּאֵר לְךָ... שֶׁאֵין שָׁם מַשְׁקִין שְׁנִיּוֹת לְעוֹלָם אֶלָּא הַמַּשְׁקִין תְּחִלָּה לְעוֹלָם חוּץ מִמַּשְׁקִין שֶׁנָּגַע בָּהֶן טְבוּל יוֹם" https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.10.3 ; SAT 10:10 ✓ https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.10.10
- Mishnah Tevul Yom 2:1-2 ✓ https://www.sefaria.org/Mishnah_Tevul_Yom.2.1-2
- TO 4:2 ✓ "הַמַּשְׁקִין מִתְטַמְּאִין כָּל שֶׁהֵן וּמְטַמְּאִין בְּכָל שֶׁהֵן" https://www.sefaria.org/Mishneh_Torah,_Defilement_of_Foods.4.2

**(d) Puzzle:** "The power-up drink." A chullin Sheni bread (harmless to chullin) drips onto water. The water becomes Rishon and splashes onto a chullin salad, which becomes Sheni. *Aha:* the drink "boosted" the tumah. Counter-puzzle: a tevul yom touches the same water and nothing happens.

---

### R15. Tamei liquids make vessels tamei (Rabbinic), inside vs. outside
**(a) Kid rule:** A tamei drink is the only "1st" that can make a pot tamei, and that's a Rabbinic rule. If it only touched the outside of the pot, only the outside is tamei (for terumah).

**(b) Halacha (SAT 7:2-4, 7:6; SAT 12:2; Kelim 13:4):**
- The decree that liquids make keilim tamei (they become **Sheni**, d'rabbanan) applies only if the liquid got its tumah from an **Av**, whether a Torah Av or a Rabbinic one.
- The reason is the comparison to a zav's fluids, which are Avot (SAT 7:2).
- **Inside touched:** the whole keli is Sheni. **Outside only:** only the outside is Sheni (for terumah). For kodesh the whole keli becomes tamei (SAT 7:3; SAT 12:2; Chagigah 3:1).
- Food, even terumah, that touches a keli whose outside alone is tamei stays tahor. Kodesh food becomes tamei (SAT 7:6).
- Liquids that touch the tamei outside become Rishon (SAT 7:5).
- Liquids made tamei by **hands** do not make keilim tamei (SAT 8:10).
- The Sages made this outside/inside distinction on purpose, so people would know it is Rabbinic and not burn terumah because of it (SAT 7:4).

**(c) Sources:**
- SAT 7:2 ✓ "אֵין לְךָ וְלַד טֻמְאָה שֶׁמְּטַמֵּא כֵּלִים אֶלָּא מַשְׁקִין טְמֵאִים בִּלְבַד. וְטֻמְאָה זוֹ מִדִּבְרֵיהֶם וְהוּא שֶׁיִּהְיוּ אוֹתָן הַמַּשְׁקִין טְמֵאִין מֵחֲמַת אָב..." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.7.2
- SAT 7:3 ✓ "כְּשֶׁגָּזְרוּ עַל הַמַּשְׁקִין שֶׁיְּטַמְּאוּ אֶת הַכֵּלִים גָּזְרוּ שֶׁיִּהְיוּ מְטַמְּאִין אֶת הַכֵּלִים מִתּוֹכָן..." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.7.3
- Mishnah Kelim 25:6 ✓ "If the outer side of a vessel contracted uncleanness from a liquid, only its outer side is unclean but its inner side, rim, hanger and handles remain clean." https://www.sefaria.org/Mishnah_Kelim.25.6
- Mishnah Kelim 2:1 ✓ on earthenware: "מִטַּמְּאִין וּמְטַמְּאִין בַּאֲוִיר, וּמִטַּמְּאִין מֵאֲחוֹרֵיהֶן, וְאֵינָן מִטַּמְּאִין מִגַּבֵּיהֶן". The usual explanation: *me-achoreihen* = from their outside by tamei liquids (Rabbinic); *mi-gabeihen* = not by an Av touching the outside **[memory: Bartenura's explanation]**. https://www.sefaria.org/Mishnah_Kelim.2.1

**(d) Puzzle:** A "split-color pot" sprite. Tamei water splashes on the outside of a pot: only the outside glows. A terumah roll touching the outside stays tahor. A kodesh roll gets tamei. Water dripping off the outside becomes Rishon.

---

### R16. Hands (netilat yadayim) are Sheni by Rabbinic law
**(a) Kid rule:** The Rabbis said hands are "busy," so we treat them as a "2nd" until washed. Hands can ruin terumah and make drinks tamei.

**(b) Halacha (SAT 8:1-2, 8:6-8, 8:10; SAT 12:12):**
- Hands that touch a Rishon (person, keli, food or liquid), or are put into a tamei earthenware's airspace or a house with tzara'at, become tamei **up to the wrist**, always as **Sheni d'rabbanan**.
- Unwashed hands are presumed Sheni (*stam yadayim*). Shlomo HaMelech's court made this decree for kodesh, and later Sages extended it to terumah (SAT 8:8).
- Hands disqualify terumah (it becomes Shlishi) and make **any** liquid Rishon (SAT 8:10; Tevul Yom 2:2).
- One tamei hand does not make the other hand tamei for terumah, but it does for kodesh (SAT 8:7; SAT 12:12; Chagigah 3:2).
- There is **no tumat yadayim inside the Mikdash** (SAT 8:6).
- *Safek yadayim* (a doubt about hands) is tahor (SAT 14:1; Tahorot 4:7).
- **Levels of washing (Chagigah 2:5):** netilah for chullin, ma'aser and terumah; tevilah of the hands for kodesh; tevilah of the whole body for mei chatat.

**(c) Sources:**
- SAT 8:2 ✓ "הַיָּדָיִם שְׁנִיּוֹת מִדִּבְרֵי סוֹפְרִים לְעוֹלָם" https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.8.2
- SAT 8:1 ✓ https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.8.1 ; SAT 8:8 ✓ https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.8.8
- Mishnah Chagigah 2:5 ✓ https://www.sefaria.org/Mishnah_Chagigah.2.5
- Mishnah Tevul Yom 2:2 ✓ "קְדֵרָה שֶׁהִיא מְלֵאָה מַשְׁקִים וְנָגַע בָּהּ טְבוּל יוֹם, אִם הָיָה מַשְׁקֵה תְרוּמָה, הַמַּשְׁקִין פְּסוּלִין וְהַקְּדֵרָה טְהוֹרָה. וְאִם הָיָה מַשְׁקֵה חֻלִּין, הַכֹּל טָהוֹר. הָיוּ יָדָיו מְסֹאָבוֹת, הַכֹּל טָמֵא" / "...If his hands were defiled, all becomes unclean. This is a case where defiled hands are treated more stringently than a tevul yom..." https://www.sefaria.org/Mishnah_Tevul_Yom.2.2

**(d) Puzzle:** "Tevul yom vs. dirty hands." The same pot of chullin soup is touched by (1) a tevul yom: nothing happens; (2) a tahor person with unwashed hands: the soup is tamei, Rishon. Kids are surprised that the "Rabbinic" hands beat the "Torah" tevul yom here (SAT 10:5).

---

### R17. Eating tamei food or drinking tamei liquid makes a person Sheni (Rabbinic)
**(a) Kid rule:** If you eat a big portion of tamei food, the Rabbis say you become a "2nd" until you go to the mikveh.

**(b) Halacha:**
- Eating **half a pras** (k'beitzah and a half) of tamei food within *k'dei achilat pras*, or drinking a **revi'it** of tamei liquid, makes a person **Sheni d'rabbanan** until tevilah (SAT 8:10-11; TO 4:1).
- Such a person disqualifies terumah (makes it Shlishi) and makes liquids Rishon. Those liquids do not make keilim tamei (SAT 8:10).
- A nursing baby is tahor (SAT 8:12). A pregnant woman eating less than the shiur is tahor (SAT 8:13).
- Tahorot 2:2: R. Eliezer and R. Yehoshua disagree about which degree the eater takes on. The Rambam follows R. Yehoshua: Rishon or Sheni food makes the eater Sheni. Eating a terumah Shlishi bars the person from **eating** terumah until tevilah, but not from **touching** it (SAT 11:11-12).

**(c) Sources:**
- SAT 8:10-11 ✓ https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.8.10-11 ; SAT 11:11-12 ✓
- Mishnah Tahorot 2:2 ✓ "רַבִּי יְהוֹשֻׁעַ אוֹמֵר, הָאוֹכֵל אֹכֶל רִאשׁוֹן וְאֹכֶל שֵׁנִי, שֵׁנִי" https://www.sefaria.org/Mishnah_Tahorot.2.2

**(d) Puzzle:** A side-quest where the avatar eats a tamei snack and then can't eat terumah until after the mikveh. The status bar shows a "Sheni (Rabbinic)" badge.

---

## D. HECHSHER AND SHIURIM

### R18. Hechsher: food must first be wetted, willingly, by one of the 7 liquids
**(a) Kid rule:** Dry food is "tumah-proof." Food can become tamei only after it got wet, on purpose (or with the owner happy about it), from one of 7 special drinks: **water, dew, oil, wine, milk, blood, bees' honey**. Once wet, it stays "catchable" forever, even after it dries.

**(b) Halacha:**
- Foods become susceptible only after hechsher by one of the seven liquids, applied **with the owner's will (ratzon)**, and **after harvest** (TO 1:1-2; TO 12:1-2).
- What counts as ratzon:
  - Wanted at the start but not at the end, or wanted at the end but not at the start: it **is** a hechsher (TO 12:2; Makhshirin 1:1).
  - Wetting that happened *against* the owner's will, or for safety or necessity (hiding produce in water from thieves, floating it downriver): **no** hechsher (TO 12:2).
- Once made susceptible, the food stays so even when dry (TO 1:2).
- Fruit juices (other than the 7) neither give hechsher nor become tamei (TO 1:3-4). Hornet honey is tahor (Makhshirin 6:4).
- Juice of grapes and olives before one-third ripeness is like fruit juice (TO 1:5).
- **Food must be human food:**
  - Things not meant for human eating are tahor unless designated for it (TO 1:1).
  - Spices used only for flavor are tahor (TO 1:6).
  - Produce **attached to the ground** cannot become tamei (TO 2:1).
- *Tamei* liquids make things tamei whether or not their contact was wanted; the "will" requirement is only for hechsher (Makhshirin 1:1).
- Exceptions:
  - **Kodesh** needs no hechsher (R13).
  - Grapes harvested for the winepress are susceptible even without liquid (TO 11:1).
  - Market vegetables and flour are presumed muchshar, because vegetables are sprinkled and wheat is washed before grinding (TO 16:1).

**(c) Sources:**
- Vayikra 11:38 ✓ "וְכִי יֻתַּן־מַיִם עַל־זֶרַע וְנָפַל מִנִּבְלָתָם עָלָיו טָמֵא הוּא לָכֶם" / "but if water is put on the seed and any part of a carcass falls upon it, it shall be impure for you." https://www.sefaria.org/Leviticus.11.38 ; 11:34 ✓ (above)
- Mishnah Makhshirin 6:4 ✓ "שִׁבְעָה מַשְׁקִין הֵן. הַטַּל וְהַמַּיִם, הַיַּיִן וְהַשֶּׁמֶן, וְהַדָּם, וְהֶחָלָב, וּדְבַשׁ דְּבוֹרִים. דְּבַשׁ צְרָעִים, טָהוֹר" https://www.sefaria.org/Mishnah_Makhshirin.6.4
- Mishnah Makhshirin 1:1 ✓ "Any liquid which was desired at the beginning though it was not desired at the end, or ... desired at the end though not at the beginning, comes under the law of 'if water be put.' Unclean liquids render unclean whether desired or not." https://www.sefaria.org/Mishnah_Makhshirin.1.1
- TO 1:1 ✓ "כָּל אֹכֶל הַמְיֻחָד לְמַאֲכַל אָדָם... מְקַבֵּל טֻמְאָה... No foods are susceptible to ritual impurity unless it was first dampened with one of the seven liquids. This dampening is referred to as hechsher." https://www.sefaria.org/Mishneh_Torah,_Defilement_of_Foods.1.1
- TO 1:2 ✓ "וְאֵלּוּ הֵן הַשִּׁבְעָה מַשְׁקִין שֶׁמַּכְשִׁירִין אֶת הָאֳכָלִין לְטֻמְאָה. הַמַּיִם וְהַטַּל וְהַשֶּׁמֶן וְהַיַּיִן וְהֶחָלָב וְהַדָּם וְהַדְּבַשׁ..." / "...They do not make foods susceptible to impurity unless they fall upon them as desired by the owner... Once food has been made susceptible to ritual impurity, it retains that status after it is dry." https://www.sefaria.org/Mishneh_Torah,_Defilement_of_Foods.1.2
- TO 1:3 ✓ "When food has been dampened with fruit juice... even though it is wet and was touched by a zav or the flesh of a corpse, it is pure." https://www.sefaria.org/Mishneh_Torah,_Defilement_of_Foods.1.3
- TO 12:1-2 ✓ https://www.sefaria.org/Mishneh_Torah,_Defilement_of_Foods.12.2 ; TO 2:1 ✓ https://www.sefaria.org/Mishneh_Torah,_Defilement_of_Foods.2.1 ; TO 16:1 ✓

**(d) Puzzles:**
- "The bone-dry apple": a sheretz touches a never-wetted apple, which stays tahor. Then a contrast case: the same apple after the farmer washed it on purpose yesterday (now dry) becomes Rishon.
- "Pomegranate juice trap": an apple soaked in pomegranate juice is touched by a zav and stays tahor.
- "Rain vs. hose": rain fell on harvested figs and the owner was upset, so no hechsher. A variant where he was glad it rained gives hechsher.

---

### R19. Minimum sizes (shiurim): quick table

| Item | Shiur | Mode | Source |
|---|---|---|---|
| Met, flesh of a met | **k'zayit** | touch, carry, ohel | TM 2:1-2 ✓; Oholot 2:1 ✓ |
| Whole limb (from a met or a living person) | any size, if complete with flesh, sinew and bone | touch, carry, ohel | TM 2:3, 2:7 ✓ |
| Spine, skull, majority of the frame or of the bones, revi'it of bones (kav) | as listed | touch, carry, ohel | TM 2:8-9 ✓; Oholot 2:1 ✓ |
| Revi'it of blood of a met | revi'it | ohel | Oholot 2:2 ✓ |
| Bone of a met | **k'se'orah** (barleycorn) | touch and carry, **not ohel** | TM 2:9-10 ✓; Oholot 2:3 ✓ |
| Nevelah | **k'zayit** | touch, carry | SAT 1:1 ✓ |
| Sheretz | **k'adashah** (lentil); a complete limb in any amount | touch only | SAT 4:2-4 ✓ |
| Shichvat zera | k'adashah to the one who touches; any amount to the one who emits | touch | SAT 5:1 ✓ |
| Dam niddah/zivah/yoledet; zav's fluids | **any amount** | touch, carry | MMM 1:8 ✓ |
| Food to become tamei | any amount | — | TO 4:1 ✓ |
| Food to make others tamei | **k'beitzah** | touch | TO 4:1 ✓ |
| Eating tamei food (body becomes pasul) | **half a pras** = 1.5 k'beitzah | eat | TO 4:1 ✓; SAT 8:11 ✓ |
| Liquids, to become tamei and to transmit | any amount | touch | TO 4:2 ✓ |
| Drinking tamei liquid | revi'it | drink | SAT 8:11 ✓ |
| Avodah zarah (Rabbinic) | k'zayit | touch | SAT 6:2 ✓ |
| Mikveh | **40 se'ah** (1 × 1 × 3 amot) | — | Mikvaot (Rambam) 4:1 ✓; Mishnah Mikvaot 1:7 ✓ |
| Tumah that dried up in the sun and shrank below the shiur | tahor | — | TO 4:5 ✓ |

Quotes:
- TM 2:2 ✓ "At the onset of his conception, man's body is the size of an olive." https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.2.2
- Mishnah Oholot 2:3 ✓ "The following defile by contact and carriage but not by overshadowing: A bone of barleycorn size..." https://www.sefaria.org/Mishnah_Oholot.2.3

**Puzzle:** "Shrink ray." A k'zayit of nevelah dried in the sun and is now smaller: it is tahor (TO 4:5). Rain makes it swell back: tamei again (TO 4:6).

---

## E. VESSELS (KELIM)

### R20. Which materials can become tamei

| Material | Container (has *beit kibbul*) | Flat (no receptacle) | Purified by |
|---|---|---|---|
| Metal | tamei d'oraita | **tamei d'oraita** (knives, scissors) | mikveh |
| Wood, leather, bone, cloth, sackcloth | tamei d'oraita | ⚖ **Rambam:** tahor d'oraita but **susceptible d'rabbanan**; d'oraita for midras if made to lie or sit on | mikveh |
| Earthenware (cheres) | tamei d'oraita, **only via airspace** | **never** tamei | **only by breaking** |
| Glass | **d'rabbanan only**, by touch inside or outside (not airspace) | not decreed | breaking (Rabbinic) |
| Stone, dung, unbaked earth (adamah) | **never** tamei, d'oraita or d'rabbanan | never | n/a |
| Fish or sea-animal bone and skin; bird bones (except osprey wings and coated ostrich egg) | never tamei | never | n/a |

- ⚖ **RAMBAM NOTE, flat wooden vessels (Kelim 1:10):** Mishnah Kelim 2:1 says "פְּשׁוּטֵיהֶן טְהוֹרִים" (flat ones are tahor). The Rambam reads this as **tahor only d'oraita**; Rabbinically they are susceptible, e.g. a board, chair, or leather eating mat. The Kesef Mishneh ✓ cites Bava Batra (פרק המוכר את הבית, "דף ס״ו") "שאני פשוטי כלי עץ דטומאה דמדרבנן" and notes that some wooden items are tahor even Rabbinically (Kelim ch. 4).
- **Game:** if the game is about Torah-level rules, the flat board is safe. If it shows Rabbinic layers, mark it "Rabbinic: susceptible."

**Sources:**
- Rambam Kelim 1:1 ✓ the seven materials susceptible d'oraita. https://www.sefaria.org/Mishneh_Torah,_Vessels.1.1
- Rambam Kelim 1:5 ✓ glass is Rabbinic, by touch. https://www.sefaria.org/Mishneh_Torah,_Vessels.1.5
- Rambam Kelim 1:6 ✓ "כְּלֵי גְּלָלִים וּכְלֵי אֲבָנִים וּכְלֵי אֲדָמָה לְעוֹלָם טְהוֹרִין. וְאֵין מְקַבְּלִין טֻמְאָה מִן הַטֻּמְאוֹת וְלֹא טֻמְאַת מִדְרָס לֹא מִן הַתּוֹרָה וְלֹא מִדִּבְרֵי סוֹפְרִים בֵּין פְּשׁוּטֵיהֶן בֵּין מְקַבְּלֵיהֶן" / "Utensils made from animal turds, stone, or earth are always pure..." https://www.sefaria.org/Mishneh_Torah,_Vessels.1.6
- Rambam Kelim 1:8 ✓ "פְּשׁוּטֵי כְּלֵי חֶרֶס... אֵין מְקַבְּלִין טֻמְאָה... כָּל שֶׁיֵּשׁ לוֹ תּוֹךְ בִּכְלִי חֶרֶס מְקַבֵּל טֻמְאָה וְשֶׁאֵין לוֹ תּוֹךְ טָהוֹר" https://www.sefaria.org/Mishneh_Torah,_Vessels.1.8
- Rambam Kelim 1:9-10 ✓ (metal flat and container; wood/leather/bone flat are Rabbinic) "...אֲבָל פְּשׁוּטֵיהֶן כְּגוֹן הַלּוּחוֹת וְהַכִּסֵּא וְהָעוֹר שֶׁאוֹכְלִין עָלָיו... אֵינָן מְקַבְּלִין טֻמְאָה אֶלָּא מִדִּבְרֵי סוֹפְרִים..." https://www.sefaria.org/Mishneh_Torah,_Vessels.1.10
- Rambam Kelim 1:2-3 ✓ (bones; sea creatures tahor)
- Mishnah Kelim 2:1 ✓ "כְּלֵי עֵץ, וּכְלֵי עוֹר, וּכְלֵי עֶצֶם, וּכְלֵי זְכוּכִית, פְּשׁוּטֵיהֶן טְהוֹרִים, וּמְקַבְּלֵיהֶן טְמֵאִים. נִשְׁבְּרוּ, טָהָרוּ..." https://www.sefaria.org/Mishnah_Kelim.2.1
- Vayikra 11:32 ✓ "מִכׇּל־כְּלִי־עֵץ אוֹ בֶגֶד אוֹ־עוֹר אוֹ שָׂק... בַּמַּיִם יוּבָא וְטָמֵא עַד־הָעֶרֶב וְטָהֵר" https://www.sefaria.org/Leviticus.11.32
- Shabbat 16a ✓ "טומאת כלי זכוכית דרבנן" (glass is Rabbinic). **Correction to the brief:** Shabbat 16a is about **glass**, not stone. https://www.sefaria.org/Shabbat.16a
- Kesef Mishneh on Kelim 1:10 ✓ https://www.sefaria.org/Kessef_Mishneh_on_Mishneh_Torah,_Vessels.1.10.2

**Puzzle:** "Pick your cup." A tray holds metal, wood, clay, glass and stone cups. A sheretz touches each one from the outside. Results: metal and wood are tamei (Rishon); clay is tahor (outside contact doesn't count); glass is tamei only Rabbinically; stone is tahor.

---

### R21. Earthenware: tamei only through its airspace (tocho), never from its outside
**(a) Kid rule:** A clay pot is "inside-only." A sheretz touching the outside does nothing. A sheretz hanging *inside* the empty space, even without touching anything, makes the pot and all the food inside tamei. Once tamei, the only fix is to break it.

**(b) Halacha (Rambam Kelim 13:1-4; Vayikra 11:33):**
- Earthenware becomes tamei only from its airspace, or by **heset of a zav**.
- Other keilim are the reverse: tamei by contact, but not by tumah in their airspace.
- A tamei earthenware vessel makes food and liquids in its airspace tamei even without contact (13:2). It does **not** make *vessels* inside it tamei (13:3). Liquids inside those inner vessels do become tamei, and they in turn make the inner vessels tamei (Rabbinic).
- Tamei liquid on the outside makes the outside tamei (Rabbinic), but only for a vessel that has a receptacle (13:4).
- It is never an Av (TM 5:6).
- Purification is only by breaking (Mikvaot 1:3); glass follows the same Rabbinic rule.
- A zav putting his hand into its airspace without touching or moving it: tahor (MMM 8:4).

**(c) Sources:**
- Rambam Kelim 13:1 ✓ "כְּבָר בֵּאַרְנוּ בְּכַמָּה מְקוֹמוֹת שֶׁאֵין כְּלִי חֶרֶס מִתְטַמֵּא אֶלָּא מֵאֲוִירוֹ אוֹ בְּהֶסֵּט הַזָּב..." / "...what makes an earthenware container impure leaves other keilim pure. And what makes other keilim impure, leaves an earthenware container pure." https://www.sefaria.org/Mishneh_Torah,_Vessels.13.1
- Rambam Kelim 13:3 ✓ "It is as the smaller containers say: 'The one that imparted impurity to you did not impart impurity to me, but you imparted impurity to me.'" https://www.sefaria.org/Mishneh_Torah,_Vessels.13.3
- Mikvaot (Rambam) 1:3 ✓ "כָּל הַכֵּלִים שֶׁנִּטְמְאוּ יֵשׁ לָהֶן טָהֳרָה בְּמִקְוֶה חוּץ מִכְּלֵי חֶרֶס וּכְלֵי זְכוּכִית וְכֵן הַמַּפָּץ..." https://www.sefaria.org/Mishneh_Torah,_Immersion_Pools.1.3
- Vayikra 11:33 ✓ (above)

**(d) Puzzles:**
- "The hovering mouse": a dead mouse dangles on a string inside an empty clay jar, touching nothing. The jar is Rishon and the bread inside is Sheni. The same mouse rubbing the jar's outside: everything is tahor.
- "Nested pots": a small metal cup sits inside the tamei clay jar and stays tahor, but water inside the cup becomes tamei and then makes the cup tamei (Rabbinic).

---

### R22. Tzamid patil (tightly sealed lid) protects in an ohel ha-met
**(a) Kid rule:** In a room with a met, an open clay jar becomes tamei. If it's sealed tight with clay, wax or the like, everything inside stays tahor.

**(b) Halacha (TM 21:1; Mishnah Kelim 10:1-2):**
- Vessels that **cannot themselves become tamei** protect what is in them when tightly sealed: earthenware (which can only become tamei through its opening), dung, stone, unbaked earth, natron, fish bone and skin, large wooden vessels that are always tahor, flat boards, unfinished metal vessels.
- Turned upside down on the ground, they protect what is under them "to the depths."
- **An earthenware vessel protects only food, liquids and earthenware** (Kelim 10:1). Other materials protect everything.
- What counts as a seal: lime, gypsum, pitch, wax, mud, dung, clay. **Not** tin or lead (a cover, but not tight). Fig-cake or fruit-juice dough may not be used *l'chatchilah*, but if used it works (Kelim 10:2).
- **Zav exception:** heset of a zav makes a sealed earthenware vessel tamei (MMM 8:3).

**(c) Sources:**
- Bamidbar 19:15 ✓ "וְכֹל כְּלִי פָתוּחַ אֲשֶׁר אֵין־צָמִיד פָּתִיל עָלָיו טָמֵא הוּא" / "and every open vessel, with no lid fastened down, shall be impure." https://www.sefaria.org/Numbers.19.15
- TM 21:1 ✓ "מִנַּיִן לְצָמִיד פָּתִיל שֶּׁמַּצִּיל בְּאֹהֶל הַמֵּת... וּמִפִּי הַשְּׁמוּעָה לָמְדוּ שֶׁאֵין הַכָּתוּב מְדַבֵּר אֶלָּא בִּכְלִי חֶרֶשׂ..." https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.21.1 ; TM 20:1 ✓ (three things save in an ohel: tzamid patil, ohel, being swallowed) https://www.sefaria.org/Mishneh_Torah,_Defilement_by_a_Corpse.20.1
- Mishnah Kelim 10:1 ✓ "אֵלּוּ כֵלִים מַצִּילִין בְּצָמִיד פָּתִיל, כְּלֵי גְלָלִים, כְּלֵי אֲבָנִים, כְּלֵי אֲדָמָה, כְּלֵי חֶרֶס... עַל הַכֹּל מַצִּילִין, חוּץ מִכְּלֵי חֶרֶס, שֶׁאֵינוֹ מַצִּיל אֶלָּא עַל הָאֳכָלִים וְעַל הַמַּשְׁקִין וְעַל כְּלֵי חָרֶס" https://www.sefaria.org/Mishnah_Kelim.10.1 ; 10:2 ✓ https://www.sefaria.org/Mishnah_Kelim.10.2
- MMM 8:3 ✓ "חֹמֶר בְּהֶסֵּט הַזָּב מִמַּגָּעוֹ שֶׁאִם נָגַע בִּכְלִי חֶרֶס הַמֻּקָּף צָמִיד פָּתִיל טָהוֹר וְאִם הֱסִיטוֹ טִמְּאָהוּ" https://www.sefaria.org/Mishneh_Torah,_Those_Who_Defile_Bed_or_Seat.8.3

**(d) Puzzles:**
- "Seal it in time": a met is in a house. Kids choose lids: wax seal (protects), metal plate (doesn't seal), lead (a cover, not tight). The sealed clay jar's food stays tahor.
- Twist: a sealed clay jar holding a **metal ring** is not protected (clay protects only food, drink and clay). A sealed **stone** jar protects the ring.

---

### R23. Stone cups: the Para Aduma children (aha story)
**(a) Kid rule:** Stone can't become tamei, so the children who drew water for the Para Aduma used stone cups. They rode on doors laid across oxen so they'd never be over a hidden grave.

**(b) Halacha:** As in Rambam Kelim 1:6 (R20). The doors over the oxen formed an ohel that separated the children from any *kever ha-tehom* (hidden grave in the depths). This is the classic illustration.

**(c) Source:** Mishnah Parah 3:2 ✓ "...וּמְבִיאִים שְׁוָרִים וְעַל גַּבֵּיהֶן דְּלָתוֹת, וְתִינוֹקוֹת יוֹשְׁבִין עַל גַּבֵּיהֶן וְכוֹסוֹת שֶׁל אֶבֶן בְּיָדָם..." / "And they brought oxen, upon whose backs were placed doors, and the children sat upon them with stone cups in their hands." https://www.sefaria.org/Mishnah_Parah.3.2. Related: Oholot 5:5 ✓ (stone and dung vessels over a hatch protect the upper story) https://www.sefaria.org/Mishnah_Oholot.5.5

**(d) Puzzle:** A "Shiloach run" level. Guide the children from courtyards built over hollows, ride doors on oxen, and fill **stone** cups (clay cups make the level fail).

---

## F. PURIFICATION

### R24. Mikveh: 40 se'ah of gathered (not drawn) water
**(a) Kid rule:** To become tahor, you (or your pot) must go **completely** under the water of a mikveh, which needs at least 40 se'ah, about a 1 × 1 × 3 amah tank.

**(b) Halacha:**
- All tamei people and keilim, whether the tumah is Torah or Rabbinic, become tahor only by immersion in water gathered in the ground (Mikvaot 1:1).
- The whole body must be under at once; if even a fingertip is out, it doesn't work (1:2).
- By Torah law any gathered water of a body's volume works. The Sages measured this as 1 × 1 × 3 amot = 40 se'ah. Drawn water is acceptable d'oraita, with Rabbinic invalidations (4:1).
- A **zav** needs **mayim chayim**, a spring (1:5; Mishnah Mikvaot 1:8).
- A niddah and a yoledet immerse at **night**; others may immerse by day (1:6).
- Earthenware and glass cannot be immersed (1:3).
- Mishnah Mikvaot 1 ranks six grades of water: the 40-se'ah mikveh is grade 4, the spring is higher.
- *Safek mayim she'uvin* in a mikveh is tahor (SAT 14:1).

**(c) Sources:**
- Rambam Mikvaot 1:1 ✓ https://www.sefaria.org/Mishneh_Torah,_Immersion_Pools.1.1 ; 4:1 ✓ "דִין תּוֹרָה שֶׁכָּל מַיִם מְכֻנָּסִין טוֹבְלִין בָּהֶן שֶׁנֶּאֱמַר 'מִקְוֵה מַיִם'..." / "...Our Sages measured this figure as a cubit by a cubit by a height of three cubits. This measure contains 40 se'ah of water." https://www.sefaria.org/Mishneh_Torah,_Immersion_Pools.4.1
- Mishnah Mikvaot 1:7 ✓ "לְמַעְלָה מֵהֶן, מִקְוֶה שֶׁיֶּשׁ בּוֹ אַרְבָּעִים סְאָה, שֶׁבּוֹ טוֹבְלִין וּמַטְבִּילִין" https://www.sefaria.org/Mishnah_Mikvaot.1.7 ; 1:8 ✓ (mayim chayim for zavim) https://www.sefaria.org/Mishnah_Mikvaot.1.8
- Rambam Mikvaot 1:5-6 ✓ https://www.sefaria.org/Mishneh_Torah,_Immersion_Pools.1.5

**(d) Puzzle:** "Fill the mikveh": a volume meter shows 39 se'ah (fails) versus 40 (works). A "fingertip out" fail state. A clay pot thrown in stays tamei, and the kid must break it instead.

---

### R25. He'erev shemesh (sunset) and the Tevul Yom
**(a) Kid rule:** After the mikveh you're *almost* clean. You can eat regular food and ma'aser, but terumah only after sunset. Until then you're a "tevul yom" and you'd spoil terumah you touch, but not regular food.

**(b) Halacha:**
- A person or keli that was a Rishon is **like a Sheni until nightfall** after tevilah (SAT 10:1-2). This holds for every tumah needing sunset, Torah or Rabbinic (10:2).
- What a tevul yom touches (SAT 10:3; Tevul Yom 2:2):
  - Chullin food or liquid: **tahor**.
  - Terumah food or liquid: **Shlishi** (pasul).
  - Kodesh: **Revi'i** (pasul).
- A tevul yom's liquids and spit act like what he touches: they cannot make liquids Rishon (SAT 10:4-6).
- The tevul yom is **stricter than hands** in one way: *safek tevul yom* disqualifies, while *safek yadayim* is tahor (SAT 10:5).
- Barred from entering Ezrat Nashim (Kelim 1:8).
- Ma'aser sheni is permitted to a tevul yom (Kelim 1:5).

**(c) Sources:**
- SAT 10:1 ✓ "כָּל הַמִּתְטַמֵּא בְּאָב מֵאֲבוֹת הַטֻּמְאוֹת בֵּין אָדָם בֵּין כֵּלִים הֲרֵי הוּא רִאשׁוֹן לְטֻמְאָה... עַד שֶׁיִּטְבּל. טָבַל הֲרֵי הוּא כְּשֵׁנִי לְטֻמְאָה עַד שֶׁיַּעֲרִיב שִׁמְשׁוֹ" / "...After immersion, he or it is considered like a secondary derivative of impurity until nightfall." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.10.1
- SAT 10:3 ✓ "טְבוּל יוֹם פּוֹסֵל אָכֳלֵי תְּרוּמָה וּמַשְׁקֵה תְּרוּמָה וְאָכֳלֵי הֶקְדֵּשׁ וּמַשְׁקֵה הֶקְדֵּשׁ..." / "If, however, he touches ordinary foods or ordinary liquids, they remain pure." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.10.3
- Vayikra 11:32 ✓ "בַּמַּיִם יוּבָא וְטָמֵא עַד־הָעֶרֶב וְטָהֵר" ; Vayikra 22:6-7 ✓ https://www.sefaria.org/Leviticus.22.6-7
- Mishnah Tevul Yom 2:1-2 ✓ https://www.sefaria.org/Mishnah_Tevul_Yom.2.2

**(d) Puzzle:** "Wait for the sunset." A day/night slider. The avatar who just came out of the mikveh tries terumah at 3 pm (the terumah becomes pasul) and again after sunset (fine). He can pour himself regular soup at 3 pm with no problem.

---

### R26. Mechusar kippurim
**(a) Kid rule:** Some people (zav, zavah, yoledet, metzora) must also bring a korban before they may eat korban food. Terumah is already allowed.

**(b) Halacha:**
- A mechusar kippurim is barred from kodesh but permitted terumah and ma'aser (Kelim 1:5).
- He is barred from Ezrat Yisrael (Kelim 1:8).
- For touching kodesh he is like a tevul yom: he makes it Revi'i (pasul) (SAT 10:3).
- Even after bringing the korban, he must immerse before **eating** kodesh, one of the ma'alot. He may touch it before then (SAT 12:15; Chagigah 3:3).

**(c) Sources:**
- Mishnah Kelim 1:5 ✓ "מְחֻסַּר כִּפּוּרִים, אָסוּר בַּקֹּדֶשׁ וּמֻתָּר בַּתְּרוּמָה וּבַמַּעֲשֵׂר" https://www.sefaria.org/Mishnah_Kelim.1.5
- SAT 10:3 ✓ "וְדִין מְחֻסַּר כִּפּוּרִים וּטְבוּל יוֹם בִּנְגִיעַת הַקֹּדֶשׁ אֶחָד הוּא" https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.10.3
- SAT 12:15 ✓ https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.12.15

**(d) Puzzle:** Three "badges," one per food type: kodesh is locked until the korban icon is collected.

---

### R27. Tumat met needs Para Aduma sprinkling on days 3 and 7
**(a) Kid rule:** For met-tumah, the mikveh alone isn't enough. A tahor person sprinkles you with special water (Para Aduma ashes in spring water) using hyssop on day 3 and day 7. Then you go to the mikveh on day 7 and are tahor at nightfall.

**(b) Halacha (Parah Adumah 11:1-3):**
- A tahor person dips three hyssop stalks bound together into the mei chatat and sprinkles, by day, on the 3rd and 7th days.
- On the 7th day the person immerses, and is tahor at nightfall.
- A common person must count the days in front of the court (11:2).
- Sprinkling works even on someone who is also a zav, niddah and so on, for the met-tumah alone (11:3).
- Keilim tamei met also need sprinkling (Bamidbar 19:18).
- Irony: mei chatat itself is an Av (Kelim 1:1-2). Less than enough to sprinkle defiles by touch; enough to sprinkle defiles also by carrying.

**(c) Sources:**
- Bamidbar 19:12 ✓ "הוּא יִתְחַטָּא־בוֹ בַּיּוֹם הַשְּׁלִישִׁי וּבַיּוֹם הַשְּׁבִיעִי יִטְהָר" ; 19:19 ✓ "וְהִזָּה הַטָּהֹר עַל־הַטָּמֵא בַּיּוֹם הַשְּׁלִישִׁי וּבַיּוֹם הַשְּׁבִיעִי וְחִטְּאוֹ בַּיּוֹם הַשְּׁבִיעִי וְכִבֶּס בְּגָדָיו וְרָחַץ בַּמַּיִם וְטָהֵר בָּעָרֶב" https://www.sefaria.org/Numbers.19.19
- Rambam Parah Adumah 11:1 ✓ "כֵּיצַד מְטַהֲרִים טְמֵא מֵת בְּמֵי נִדָּה. לוֹקֵחַ אָדָם טָהוֹר שְׁלֹשָׁה קְלָחִין שֶׁל אֵזוֹב..." / "...sprinkle it on the impure person or utensil on the third and seventh days after sunrise... After the water has been sprinkled on a person on the seventh day, he should immerse in a mikveh during the day, wait until nightfall, and then, in the evening, he is pure." https://www.sefaria.org/Mishneh_Torah,_Red_Heifer.11.1
- Mishnah Kelim 1:2 ✓ https://www.sefaria.org/Mishnah_Kelim.1.2

**(d) Puzzle:** A calendar mini-game. Kids drag "sprinkle" tokens onto days 3 and 7 and "mikveh" onto day 7, then wait for the sunset. Missing day 3 resets the count (Bamidbar 19:12: "וְאִם־לֹא יִתְחַטָּא... לֹא יִטְהָר").

---

### R28. Ma'alot (extra strictness): kodesh above terumah
**(a) Kid rule:** The holier the food, the more careful you must be. Kodesh has 11 extra rules beyond terumah. Even the clothes of careful people count as "zav-stepped" for anyone who is one level more careful.

**(b) Halacha:**
- **Eleven ma'alot** of kodesh over terumah (SAT 12:1-16; Mishnah Chagigah 3:1-3):
  1. No immersing vessels inside other vessels.
  2. An outside-tamei vessel is entirely tamei.
  3. One may not carry kodesh together with a midras.
  4. The clothes of terumah-eaters count as midras for kodesh.
  5. Composite vessels must be taken apart to immerse.
  6. New vessels need tevilah.
  7. A keli joins everything inside it (*keli metzaref*).
  8. Revi'i is pasul.
  9. One tamei hand makes the other tamei.
  10. Dry food is still susceptible.
  11. An onen and a mechusar kippurim need tevilah.
- The **first six** also apply to chullin al taharat ha-kodesh (SAT 12:16).
- **Intent in tevilah (Chagigah 2:6):** immersion for chullin does not qualify you for ma'aser; for ma'aser not for terumah; for terumah not for kodesh; for kodesh not for chatat.
- **Clothes as midras, one level up (Chagigah 2:7):** "בִּגְדֵי עַם הָאָרֶץ מִדְרָס לַפְּרוּשִׁין. בִּגְדֵי פְרוּשִׁין מִדְרָס לְאוֹכְלֵי תְרוּמָה. בִּגְדֵי אוֹכְלֵי תְרוּמָה מִדְרָס לַקֹּדֶשׁ. בִּגְדֵי קֹדֶשׁ מִדְרָס לְחַטָּאת" (the Rambam's version is SAT 13:1).

**(c) Sources:**
- SAT 12:1 ✓ "אַחַת עֶשְׂרֵה מַעֲלוֹת עָשׂוּ חֲכָמִים לַקֹּדֶשׁ עַל הַתְּרוּמָה" https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.12.1
- Mishnah Chagigah 2:5-7 ✓ https://www.sefaria.org/Mishnah_Chagigah.2.5-7 ; 3:1-3 ✓ https://www.sefaria.org/Mishnah_Chagigah.3.1-3 ; Gemara Chagigah 20b ✓ https://www.sefaria.org/Chagigah.20b

**(d) Puzzle:** "Yochanan ben Gudgeda's towel." The same towel is fine for kodesh but counts as midras for mei chatat (Chagigah 2:7). Kids match each item to the "level" it is safe for.

---

## G. METHODS OF TRANSMISSION

| Method | Who transmits this way | Who receives | Sources |
|---|---|---|---|
| **Maga** (touch) | Every Av: person or keli becomes Rishon. Every v'lad: only food and liquids (plus Rabbinic liquids→keilim and hands) | person, keli (not earthenware), food, liquid | TM 1:3-5 ✓; TM 5:7 ✓ |
| **Avir** (airspace of earthenware) | Every Av that defiles by touch; a tamei earthenware vessel passes tumah to food and liquid in its airspace | earthenware vessel; food and liquid inside a tamei earthenware vessel | Kelim 1:1 ✓; Rambam Kelim 13:1-2 ✓ |
| **Masa** (carrying, incl. moving it, *heset of the tumah*) | met, nevelah, mei chatat (sprinkling amount), zav/niddah/zavah/yoledet, their fluids and blood, mishkav, merkav, metzora. **Not** sheretz, semen, a tamei-met person, or avodah zarah | **people only**, not keilim | TM 1:6-9 ✓ ("אֵין מִתְטַמֵּא בְּמַשָּׂא אֶלָּא הָאָדָם בִּלְבַד"); Kelim 1:2-3 ✓ |
| **Ohel** | **Met only** (incl. k'zayit, limb, revi'it of blood, etc.). Not a gentile's corpse (TM 1:13) | person, keli | TM 1:10-11 ✓ ("טֻמְאַת אֹהֶל אֵינָהּ בִּשְׁאָר טֻמְאוֹת אֶלָּא בְּמֵת בִּלְבַד"); Kelim 1:4 ✓; Oholot 2:1 ✓ |
| **Heset by a zav** (the zav moves a tahor thing) | zav, zavah, niddah, yoledet only: "no comparison in the whole Torah." Works even on a **sealed earthenware vessel** and a needle hidden inside wood | person, keli → Rishon d'oraita | MMM 8:1-3 ✓ |
| **Midras** (a zav stands, sits, lies, hangs or leans on it) | zav and his group | a keli **made for** lying, sitting or riding becomes an **Av** d'oraita, even under a stone | MMM 7:1 ✓; MMM 6:1-2 ✓; Kelim 1:3 ✓ |
| **Madaf** (things *above* a zav) | zav | Rabbinic: like a Rishon; makes food and liquid tamei, not people or earthenware | MMM 6:3 ✓ |
| **Bi'ah** (entering a house) | metzora (and a house with tzara'at) | everything in the house | TT 10:12 ✓; Kelim 1:4 ✓ |
| **Eating / drinking** | tamei food (half a pras) or liquid (revi'it) | the eater becomes Sheni d'rabbanan | SAT 8:10-11 ✓ |
| **Clothes while connected** | Av that defiles by carrying, while one is still touching (mishkav) or carrying it (nevelah, merkav) | his clothes and keilim become Rishon | SAT 6:11-12 ✓; SAT 1:1 ✓ |

Notes:
- Carrying makes only **people** tamei, never keilim. Ten stacked pots on a hand with a nevelah in the top one: the person is tamei, and only the top pot (which it touched) is tamei (TM 1:9).
- If *the tumah moves the person* (it falls on him), he is not tamei by masa. Only a zav's heset works in reverse (MMM 8:1-2).

**Puzzle ideas:**
- "Carry or touch?" Lift a nevelah with a stick: tamei (masa). Lift a sheretz with a stick: tahor (no masa for sheretz).
- "The seesaw beam" (TM 1:7; MMM 8:2): a beam on a wall. A zav sits on one end and a pot is on the other. When the pot moves, it becomes tamei by heset.
- "Under one roof": a met in one room, and the kid finds the door and window openings (≥ 1 tefach) through which ohel spreads **[memory: the 1-tefach opening rule (Oholot ch. 3, 10-13) was not fetched]**.

---

## H. DOUBTS (SAFEK TUMAH)

### R29. Reshut harabim vs. reshut hayachid
**(a) Kid rule:** If you're **not sure** whether you touched something tamei: in a public place (with lots of people), you're tahor; in a private place, you're tamei. However many "maybe"s you stack up, it stays that way.

**(b) Halacha:**
- *Safek tumah b'reshut hayachid* is tamei; *b'reshut harabim* it is tahor, no matter how many doubts are compounded (SAT 18:1; Tahorot 6:4).
- It is learned from **sotah**: her case is a doubt in a private place, and it makes her tamei (Sotah 28b-29a; SAT 16:1).
- Reason for being lenient in public: the community may bring the Pesach in tumah when most people are tamei; how much more can a mere doubt be set aside there (SAT 16:1).
- **Three people** in a private domain count as public (SAT 16:2).
- **The thing must be able to be asked (da'at lishael):**
  - A deaf-mute, a shoteh, a minor, or **vessels lying on their own** are tahor in a doubt, even in a private place (SAT 16:2; SAT 17:1; Sotah 28b).
  - A blind or sleeping person **is** considered able to be asked (SAT 16:3).
- A "public domain" for tumah follows the Shabbat definition, with some differences, e.g. the paths of Beit Gilgul (SAT 20:1; Tahorot 6:6).
- **Twelve doubts the Sages declared tahor** (SAT 14:1; Tahorot 4:7-11):
  1. Drawn water in a mikveh
  2. Tumah floating on water
  3. Liquids making others tamei (but liquids *becoming* tamei in a doubt: tamei)
  4. Hands
  5. A Rabbinic matter
  6. Chullin al taharat ha-kodesh
  7. Korbanot owed
  8. Tzara'at marks
  9. Whether a metzora stood or passed
  10. Sheretz
  11. Reshut harabim
  12. Two domains

**(c) Sources:**
- Mishnah Tahorot 6:4 ✓ "כֹּל שֶׁאַתָּה יָכוֹל לְרַבּוֹת סְפֵקוֹת וּסְפֵק סְפֵקוֹת, בִּרְשׁוּת הַיָּחִיד, טָמֵא. בִּרְשׁוּת הָרַבִּים, טָהוֹר" https://www.sefaria.org/Mishnah_Tahorot.6.4
- Mishnah Tahorot 6:6 ✓ "סְפֵק רְשׁוּת הַיָּחִיד, טָמֵא, עַד שֶׁיֹּאמַר לֹא נָגַעְתִּי. סְפֵק רְשׁוּת הָרַבִּים טָהוֹר, עַד שֶׁיֹּאמַר נָגַעְתִּי" https://www.sefaria.org/Mishnah_Tahorot.6.6
- Mishnah Tahorot 4:7 ✓ (doubts declared tahor) https://www.sefaria.org/Mishnah_Tahorot.4.7 ; 4:11 ✓ https://www.sefaria.org/Mishnah_Tahorot.4.11 ; 5:1 ✓ (sheretz and frog in reshut harabim) https://www.sefaria.org/Mishnah_Tahorot.5.1
- Sotah 28b ✓ "...if an entity that has awareness in order for it to be asked may have contracted impurity in the private domain, its uncertain impurity renders it impure; but if... in the public domain, its uncertain impurity leaves it pure..." https://www.sefaria.org/Sotah.28b ; Sotah 29a ✓ https://www.sefaria.org/Sotah.29a
- SAT 16:1 ✓ "מִפְּנֵי מָה טִהֲרוּ חֲכָמִים סְפֵק טֻמְאָה בִּרְשׁוּת הָרַבִּים. שֶׁהֲרֵי הַצִּבּוּר עוֹשִׂין פֶּסַח בְּטֻמְאָה..." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.16.1
- SAT 18:1 ✓ "כָּל שֶׁאַתָּה יָכוֹל לְרַבּוֹת סְפֵקוֹת וּסְפֵקֵי סְפֵקוֹת בִּרְשׁוּת הָרַבִּים טָהוֹר, בִּרְשׁוּת הַיָּחִיד טָמֵא" https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.18.1
- SAT 14:1 ✓ "שְׁנֵּים עָשָׂר סְפֵקוֹת טהֲרוּ חֲכָמִים..." https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.14.1
- SAT 17:1 ✓ (raven with a k'zayit of met: the person is tamei, vessels tahor; ten buckets) https://www.sefaria.org/Mishneh_Torah,_Other_Sources_of_Defilement.17.1 ; Tahorot 4:3-4 ✓

**(d) Puzzles:**
- "Market vs. courtyard": the same "maybe I brushed the dead lizard" happens twice. In the shuk the result is tahor; in a private courtyard, tamei.
- "Nine frogs and one sheretz" (SAT 18:2): touching one unknown animal among them in public is tahor.
- "Ask the cup": a raven carrying a k'zayit of met maybe flew over a person and a pot in a private yard. The person is tamei; the pot is tahor, because a pot can't be asked (SAT 17:1).

---

## I. TRANSMISSION TABLE

Columns are the **target** (assume food is muchshar and at least k'beitzah where the source is food). Cells give the **resulting status**. Key: **T** = Torah law, **R** = Rabbinic, **—** = no effect (tahor).

| Source ↓ / Target → | Person | Keli (metal/wood/cloth) | Keli cheres (earthenware) | Chullin food | Terumah food | Kodesh food | Liquid (any) |
|---|---|---|---|---|---|---|---|
| **Met** (touch/carry/ohel) | **Av** (tamei met, 7 days) T | Av, *k'met*: passes 7-day tumah onward (*cherev k'chalal*) T | Rishon (never Av); by ohel or airspace if open T | Rishon T | Rishon T | Rishon T (even un-wetted) | Rishon T |
| **Av** (sheretz, nevelah, zav, zera, tamei-met person*, metzora, mishkav, mei chatat) | Rishon T (*tamei-met person → person = tamei erev; R: 7 days if he is still touching the met, for terumah/kodesh) | Rishon T | Rishon **only via airspace** T; outside contact: — | Rishon T | Rishon T | Rishon T | Rishon T |
| **Rishon person/keli** (not met-chain) | — T (R: his **hands** become Sheni if he touched with them) | — | — | **Sheni** T | Sheni T | Sheni T | **Rishon** (receives T; transmits R) |
| **Rishon food** | — (R: hands → Sheni) | — (never, even R) | — | Sheni **R** | Sheni R | Sheni R | Rishon R |
| **Rishon liquid** (made tamei by an Av) | — (R: hands → Sheni) | **Sheni R**: inside touched = whole; outside only = outside (for kodesh = whole) | Sheni R (inside = whole; outside = outside, receptacle vessels only) | Sheni R | Sheni R | Sheni R | Rishon R (endless chain) |
| **Rishon liquid** (made tamei by hands / a Rabbinic Sheni person) | — | — (does not make keilim tamei) | — | Sheni R | Sheni R | Sheni R | Rishon R |
| **Sheni food** (any sanctity) | — | — | — | **— (pasul stays put)** | **Shlishi = pasul** R | Shlishi (tamei, transmits) R | **Rishon** R |
| **Sheni keli** (Rabbinic, from liquid) | — | — | — | — | Shlishi pasul R† | Shlishi R | Rishon R |
| **Hands** (Sheni R) | — | — | — | — | Shlishi pasul R | Shlishi R | Rishon R (but such liquid doesn't make keilim tamei) |
| **Person who ate tamei food** (Sheni R) | — | — | — | — | Shlishi pasul R | Shlishi R | Rishon R |
| **Tevul yom** (like Sheni) | — | — | — | **—** | Shlishi **pasul** | **Revi'i pasul** | chullin: **—**; terumah: Shlishi; kodesh: Revi'i |
| **Mechusar kippurim** | — | — | — | — | — | Revi'i pasul | kodesh liquid: Revi'i; otherwise — |
| **Shlishi terumah** (pasul) | — | — | — | — | **—** | **Revi'i pasul** | terumah liquid: —; kodesh liquid: **Rishon**; chullin liquid: — |
| **Shlishi chullin al taharat terumah** (pasul) | — | — | — | — | — | — (does not make Revi'i) | — (not even kodesh liquid) |
| **Shlishi kodesh** (tamei) | — | — | — | — | — | Revi'i pasul | kodesh liquid: Rishon; others: — |
| **Revi'i kodesh** (pasul) | — | — | — | — | — | — | — (even kodesh liquid) |
| **Basar ta'avah** (tahor chullin meat) | — | — | — | — | — | Revi'i pasul R | — |

Table notes:
- † A keli whose **outside only** is tamei does **not** affect terumah or chullin food. It affects kodesh (SAT 7:6).
- Liquids touching it become Rishon (SAT 7:5).
- **Kodesh food** is susceptible without hechsher (SAT 12:13). Chullin and terumah food must be muchshar (TO 1:1).
- Food transmits only at **k'beitzah** (TO 4:1). Liquids transmit in any amount (TO 4:2).
- The **Shlishi of chullin al taharat ha-kodesh** is tahor according to the Rambam (SAT 11:9). The Raavad disagrees.
- Earthenware gets tumah **only from its inside or airspace**, or by a zav's heset. A tamei earthenware vessel passes tumah to food and liquid **in its airspace without contact** (Rambam Kelim 13:2).
- **Stone, dung and earth vessels, flat earthenware, and sea-creature vessels:** never tamei. Glass: Rabbinic, touch only. Flat wood/leather/bone: Rabbinic only (Rambam).
- Sources for the table: SAT 7:1-6, 8:1-10, 10:1-10, 11:1-15, 12:2, 12:11-13; TM 1:5, 5:2-9; Mishnah Tahorot 2:2-8; Parah 8:7; Tevul Yom 2:1-2.

**Engine pseudo-rules (Rambam):**
```
transmit(src, tgt):
  if tgt.kind in {stone,dung,earth,flat_cheres,sea}: return tahor
  if tgt.kind == keli_cheres and event not in {airspace_entry, heset_zav, ohel(open)}: return tahor
  if tgt is food and not tgt.hukhshar and tgt.sanctity != kodesh: return tahor
  if src is food and src.volume < k'beitzah: return tahor
  if tgt in {person, keli}:
      if src.status in {AVI_AVOT, AV}: return (src is met or met-keli) ? AV(7d) : RISHON
      if src is liquid tamei-from-Av and tgt is keli: return SHENI (derabbanan; inside/outside rule)
      if tgt is hands and src.status == RISHON: return SHENI (derabbanan)
      return tahor
  if tgt is liquid:
      if src in {TEVUL_YOM, MECHUSAR_KIPPURIM}: return {chullin:tahor, terumah:SHLISHI, kodesh:REVII}[tgt.sanctity]   (MK: kodesh only)
      if src.status in {AV, RISHON, SHENI} (any source that is tamei, not pasul, toward this sanctity): return RISHON
      if src is SHLISHI-terumah and tgt.sanctity == kodesh: return RISHON
      else tahor
  // food targets
  next = src.level + 1
  limit = {chullin:2, chullin_al_taharat_terumah:3, chullin_al_taharat_kodesh:2 (Rambam), maaser:2, terumah:3, kodesh:4}[tgt.sanctity]
  if src is pasul for *its own* category, it acts only on stricter categories (Tahorot 2:6-7; SAT 11:7-8)
  if next > limit: return tahor
  status = next; pasul = (next == limit)
  layer = derabbanan if (src is food or liquid or src.layer==derabbanan or next>=3) else doraita
```

---

## J. "AHA!" PUZZLE MOMENTS (shortlist, each traceable to a rule)

1. **Hovering mouse in the clay jar.** It touches nothing, yet everything is tamei. Rubbing the outside does nothing. (R21; Vayikra 11:33; Rambam Kelim 13:1)
2. **The bone-dry apple.** A sheretz touches it and it stays tahor (never wetted). Washed yesterday on purpose (now dry): tamei. (R18; TO 1:1-2)
3. **Pomegranate-juice-soaked apple** touched by a zav: still tahor. (TO 1:3)
4. **A Rishon high-fives you:** you're not tamei d'oraita. Only your hands are Sheni (Rabbinic). (R11, R16; TM 5:7; SAT 8:1)
5. **A Shlishi terumah cake touches a chullin sandwich:** nothing happens. It touches another terumah cake: nothing. It touches a kodesh korban loaf: Revi'i. It touches kodesh wine: that becomes Rishon! (R6, R9; SAT 11:8)
6. **The weak loaf boosts the water.** A chullin Sheni loaf makes water Rishon, and the water makes the salad Sheni. (R14; Tahorot 2:6; SAT 7:5)
7. **Tevul yom vs. dirty hands** with the same chullin soup: the tevul yom does nothing; the dirty hands make it tamei. (R16, R25; Tevul Yom 2:2)
8. **Stone cups and door-rafts** for the Para Aduma children. (R23; Parah 3:2)
9. **The sealed jar in the met's room:** a wax seal saves the food. A metal ring in a sealed clay jar is **not** saved; in a sealed stone jar it is. (R22; Kelim 10:1)
10. **Sword chain:** a sword that touched a met makes you 7-day tamei, as if you touched the met. (R1; Pesachim 14b; TM 5:3)
11. **Lift with a stick:** a nevelah makes you tamei (masa); a sheretz doesn't. (Section G; Kelim 1:1-2)
12. **Seesaw beam / zav heset:** the zav never touches the sealed jar, but rocking the beam makes it tamei. (MMM 8:2-3)
13. **Market maybe vs. courtyard maybe.** The same doubt gives tahor in public and tamei in private. A pot can't be "asked," so it's tahor even in private. (R29; Tahorot 6:4; SAT 17:1)
14. **Shrinking nevelah** in the sun becomes tahor; rain swells it back to tamei. (TO 4:5-6)
15. **Too-small tamei crumb** can't spread; add a second crumb to reach k'beitzah and it spreads at the **lower** of the two levels. (TO 4:1, 4:12)
16. **Basar ta'avah:** a perfectly tahor steak makes shelamim meat pasul. (SAT 11:5)
17. **Kodesh needs no hechsher:** the "dry shield" fails only on the korban plate. (SAT 12:13)
18. **Glass cup:** tamei only by Rabbinic law, and only by touch. Its airspace doesn't count, unlike clay. (Rambam Kelim 1:5; Shabbat 16a)

---

## K. WHERE THE RAMBAM DIFFERS FROM A SIMPLE READING (follow the Rambam)

1. **Food → food tumah is Rabbinic** (SAT 7:1). Food Shlishi and Revi'i are Rabbinic (SAT 10:9), even though R. Akiva derives the Shlishi from a verse (Sotah 27b) and R. Yochanan ben Zakkai by kal va-chomer (Sotah 29a). Food → keli never, even Rabbinically.
2. **Liquids making others tamei is Rabbinic** (SAT 7:1-2). In Pesachim 14b, Rava infers R. Akiva holds it is d'oraita. Liquids making **keilim** tamei is a Rabbinic decree, and only when the liquid's tumah came from an Av.
3. **Flat wood, leather and bone vessels are susceptible d'rabbanan** (Rambam Kelim 1:10), although Mishnah Kelim 2:1 says simply "פשוטיהן טהורים." For midras they are d'oraita.
4. **Chullin al taharat ha-kodesh is like chullin** (SAT 11:9; SAT 12:16; Tahorot 2:8 Tanna Kamma). The **Raavad disagrees** strongly (Hasagot ad loc. ✓). Chullin al taharat terumah has a pasul Shlishi.
5. **Person touching a tamei-met person who is still touching the met:** 7 days, by Rabbinic law, for terumah and kodesh only (TM 5:2). This is not visible in Oholot 1:1.
6. **Only the first two links of met tumah are d'oraita for karet** (TM 5:5). The vessel chains of Oholot 1:2-3 are Oral Tradition but "not Scriptural" for karet.
7. **TM 1:5's general rule** "ואין אדם וכלים מקבלין טמאה אלא מאב הטמאה" appears **in brackets** in Sefaria's Hebrew text (a textual variant or addition). The same principle stands unbracketed in TM 5:7.
8. **Kodesh liquid and terumah Shlishi:** a terumah Shlishi makes kodesh liquid Rishon (SAT 11:8, following Tahorot 2:6). A terumah or kodesh Shlishi touching **terumah** liquid has no effect (SAT 12:11).

---

## L. UNCERTAINTIES / NOT VERIFIED

- **[memory]** Bartenura's explanation of Kelim 2:1 "מטמאין מאחוריהן / אינן מטמאין מגביהן". It agrees with Rambam Kelim 13:4 (fetched), but Bartenura himself was not fetched.
- **[memory]** Pesachim 16a (R. Yose ben Yo'ezer, "mashkeh beit mitbechaya dakhan") and Chullin 33b-34a. These were not fetched directly. The Chullin sugya is known here only through the Kesef Mishneh's quote.
- **[memory]** Rambam Bi'at HaMikdash ch. 3 and Beit HaBechirah ch. 7 for the ten kedusha levels. These are outside Sefer Taharah and were not fetched.
- **[memory]** The 1-tefach ohel-opening rules (Oholot ch. 3, 10-13; TM ch. 12-ff.) were not reviewed in detail.
- **Bo'el niddah** (Kelim 1:3): the exact Rambam halacha in MMM ch. 3 was seen only in passing (MMM 3:2 ✓, briefly).
- **Tahorot 4:3 vs. 4:4 numbering:** the raven case's exact mishnah number was not pinned down. SAT 17:1 is the solid citation.
- **SAT 7:1 vs. SAT 11:3:** the Rambam gives a verse-based derivation for terumah-Shlishi (11:3) while also calling food-to-food tumah Rabbinic (7:1, 10:9). The usual reading is that the verses are asmachtot. Check commentaries (Kesef Mishneh, Mishneh LaMelech) before stating this to users.
- The brief's citation of **"Shabbat 16a" for stone vessels** is not right. Shabbat 15b-16a discusses **glass** (Rabbinic). For stone, use Kelim 10:1, Parah 3:2 and Rambam Kelim 1:6.
- The English translations quoted are Sefaria's: Touger for the Rambam, Kulp/Sefaria for the Mishnah, the William Davidson edition for the Gemara, and JPS for the Torah. They may paraphrase; the Hebrew is authoritative.

// Builds the Premier Cercle screening kit (Word). Usage: node build_kit.js "<output.docx>"  (needs the `docx` npm package)
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, AlignmentType, LevelFormat, PageBreak,
} = require("docx");

const W = 9638; // A4 text width with 2 cm margins (DXA)
const ACCENT = "1F3A5F";
const LIGHT = "E8EEF5";

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 }, ...opts.para,
  children: [new TextRun({ text, ...opts.run })],
});
const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 160 }, children: [new TextRun(t)] });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 120 }, children: [new TextRun(t)] });
const h3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 160, after: 80 }, children: [new TextRun(t)] });
const bullet = t => new Paragraph({ numbering: { reference: "bul", level: 0 }, spacing: { after: 60 }, children: [new TextRun(t)] });
const br = () => new Paragraph({ children: [new PageBreak()] });

// Arabic (right-to-left) paragraph
const ar = text => new Paragraph({
  bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { after: 120 },
  children: [new TextRun({ text, rightToLeft: true, font: "Arial", size: 24 })],
});

const cell = (text, width, { bold = false, fill = null, color } = {}) => new TableCell({
  width: { size: width, type: WidthType.DXA },
  shading: fill ? { type: ShadingType.CLEAR, color: "auto", fill } : undefined,
  margins: { top: 60, bottom: 60, left: 100, right: 100 },
  children: [new Paragraph({ children: [new TextRun({ text, bold, color })] })],
});
const table = (cols, rows) => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: cols,
  rows: rows.map((r, i) => new TableRow({
    tableHeader: i === 0,
    children: r.map((c, j) => cell(c, cols[j], i === 0 ? { bold: true, fill: ACCENT, color: "FFFFFF" } : (j === 0 ? { bold: true, fill: LIGHT } : {}))),
  })),
});
// Label + empty space to fill in, for the discovery record
const fillTable = rows => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [3200, 6438],
  rows: rows.map(([label, hint]) => new TableRow({ children: [
    cell(label, 3200, { bold: true, fill: LIGHT }),
    new TableCell({ width: { size: 6438, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: hint, italics: true, color: "777777", size: 18 })] }),
                 new Paragraph({ children: [] }), new Paragraph({ children: [] })] }),
  ] })),
});

const content = [];

// ---------- Cover ----------
content.push(
  new Paragraph({ spacing: { before: 2400, after: 200 }, children: [new TextRun({ text: "Leaders Way Pro · Projet Premier Cercle", size: 28, color: ACCENT, bold: true })] }),
  new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Kit de dépistage — Segment A", size: 52, bold: true, color: ACCENT })] }),
  new Paragraph({ spacing: { after: 400 }, children: [new TextRun({ text: "Valider l'ICP « chefs récemment nommés en Tunisie » par des entretiens réels", size: 28 })] }),
  p("Version 1.0 · usage interne"),
  p("Contenu : protocole de validation · guide d'entretien · fiche de dépistage · formulations à tester · messages d'invitation (français et arabe standard) · recherche LinkedIn guidée · règles de confidentialité."),
  br(),
);

// ---------- 1. Protocole ----------
content.push(h1("1. Protocole de validation"));
content.push(h2("Objectif"));
content.push(p("Décider, à partir de preuves et non d'intuition, si le segment A devient l'ICP v1 de LWP pour le programme « Communiquez comme un Leader ». La recherche documentaire (étape 0) a confirmé la douleur ; la question prioritaire est désormais : qui paie ?"));
content.push(h2("Hypothèse testée"));
content.push(table([2600, 7038], [
  ["Élément", "Hypothèse"],
  ["Segment", "Chefs récemment nommés (moins de 12 mois dans le poste), tous métiers, en Tunisie."],
  ["Déclencheur", "La nomination : passage d'expert de son métier à responsable d'une équipe, sans préparation à la gestion des hommes."],
  ["Problème", "Ils ont la compétence métier, mais ne savent pas encore comment se faire entendre, respecter et suivre par leur équipe."],
  ["Douleur visible (1)", "Conversations difficiles évitées ou mal menées, décisions contestées, consignes mal suivies, tensions."],
  ["Douleur ressentie (2)", "Anciens collègues devenus subordonnés, coincé entre l'équipe et la hiérarchie, peur de « jouer au petit chef » ou de paraître faible."],
  ["Enjeu (3)", "La crédibilité se joue dans les premiers mois."],
  ["H-payeur", "Une partie des chefs paiera elle-même le programme, en dinars et en plusieurs fois."],
  ["H-attribution", "La cible attribue sa difficulté à l'organisation et attend que l'employeur paie."],
]));
content.push(h2("Échantillon"));
[
  "15 entretiens réalisés au minimum, 20 au maximum (objectif : 30 à 40 personnes contactées).",
  "Critères d'entrée (tous obligatoires) : encadre au moins 2 personnes · nommé il y a moins de 12 mois · en poste en Tunisie · premier poste d'encadrement · ni client actuel, ni proche.",
  "Priorité : cadres du privé en ville (Grand Tunis, Sfax, Sousse) — banque, assurance, IT/offshore, télécoms, industrie, pharma, centres de relation client.",
  "Contrôle : 3 ou 4 entretiens hors LinkedIn (public, entreprise familiale, chef d'équipe de terrain).",
  "Diversité : au moins 4 secteurs · au moins 30 % de femmes et 30 % d'hommes · au plus 5 personnes par entreprise.",
].forEach(t => content.push(bullet(t)));
content.push(h2("Seuils de décision (fixés avant les entretiens, sur 15)"));
content.push(table([4400, 2600, 2638], [
  ["Critère", "Validé", "À revoir"],
  ["Douleur ressentie confirmée (anciens pairs, coincé entre deux, « petit chef »)", "≥ 8", "< 5"],
  ["Douleur visible évoquée spontanément", "≥ 9", "< 6"],
  ["Difficulté principale dans le périmètre du programme", "≥ 10", "< 7"],
  ["A déjà payé lui-même une formation ou se dit prêt à payer au prix testé", "≥ 5", "< 3 → piste B2B / hybride"],
  ["Accès plausible à un financement employeur", "à mesurer", "décide de la piste hybride"],
  ["Accepte la formation gratuite ou une consultation", "≥ 5", "< 3"],
]));
content.push(p("Pour 20 entretiens, appliquer les mêmes proportions. Le fichier Excel de suivi fait le calcul automatiquement."));
content.push(h2("Verdicts"));
content.push(table([4000, 5638], [
  ["Situation", "Verdict"],
  ["Tous les seuils « validé » atteints", "Segment A validé → ICP v1 officiel (après votre approbation)"],
  ["Douleur et périmètre validés, paiement personnel faible", "Pivot B2B ou hybride : même problème, l'employeur paie"],
  ["Douleur validée mais hors périmètre du programme", "Ajustement de l'offre (signal produit)"],
  ["Douleur non validée", "Segment abandonné, passage au suivant"],
  ["Résultats entre les deux seuils", "5 entretiens de plus, une seule fois, puis décision"],
]));
content.push(h2("Calendrier indicatif"));
[
  "Semaine 1 : 30 à 40 invitations (taux d'acceptation visé : environ 40 %).",
  "Semaines 2 et 3 : entretiens ; fiche remplie dans les 24 heures.",
  "Semaine 4 : synthèse anonymisée et décision.",
].forEach(t => content.push(bullet(t)));
content.push(h2("Règles"));
[
  "Entretien de recherche : on ne vend pas. La formation gratuite n'est proposée qu'à la fin, et seulement si la difficulté entre dans le périmètre du programme.",
  "Messages écrits et envoyés à la main, un par un. Aucun envoi automatique.",
  "Enregistrement uniquement avec accord explicite. Verbatims anonymisés avant toute réutilisation.",
  "Les fiches restent sur votre ordinateur. Seule la synthèse anonymisée entre dans LWP AI OS.",
].forEach(t => content.push(bullet(t)));
content.push(br());

// ---------- 2. Guide ----------
content.push(h1("2. Guide d'entretien (25 minutes)"));
content.push(p("Principe : faire raconter des faits récents plutôt que demander des opinions. Écouter 80 % du temps. Ne pas suggérer les réponses. Noter les mots exacts, dans la langue utilisée (darija, arabe, français)."));
const steps = [
  ["1. Ouverture (2 min)", [
    "« Merci de m'accorder ce temps. Je mène une étude sur les premiers mois des nouveaux responsables d'équipe en Tunisie. Il n'y a ni bonne ni mauvaise réponse, et je ne vais rien vous vendre. »",
    "« Tout reste confidentiel. Puis-je noter vos mots, sans votre nom ? Et puis-je enregistrer, uniquement pour ne rien oublier ? » (noter la réponse)",
  ]],
  ["2. Situation (3 min)", [
    "« Depuis quand êtes-vous responsable d'équipe ? Combien de personnes ? »",
    "« Quel était votre poste avant ? Est-ce votre premier poste d'encadrement ? »",
    "« Comment votre nomination a-t-elle été annoncée à l'équipe ? »",
    "« Managez-vous d'anciens collègues ? Des personnes plus âgées ou plus anciennes que vous ? »",
  ]],
  ["3. Récit des difficultés (7 min)", [
    "« Racontez-moi la dernière situation avec votre équipe qui vous a mis mal à l'aise. Que s'est-il passé ensuite ? »",
    "« Y a-t-il une conversation que vous repoussez en ce moment ? Qu'est-ce qui vous retient ? »",
    "« Une de vos décisions a-t-elle été contestée récemment ? Comment avez-vous réagi ? »",
    "« Comment vous sentez-vous, entre votre équipe et votre hiérarchie ? À qui parlez-vous de ces difficultés ? »",
    "« Si vous deviez choisir la difficulté numéro un de votre nouveau rôle, ce serait laquelle ? » (noter si elle est dans le périmètre : assertivité, conversations difficiles, réactions ; ou hors périmètre : délégation, réunions, prise de parole, surcharge)",
  ]],
  ["4. Ce qui a été essayé (3 min)", [
    "« Qu'avez-vous fait jusqu'ici pour gérer ce genre de situation ? » (livres, vidéos, mentor, formation, rien)",
    "« Qu'est-ce qui a marché, et qu'est-ce qui n'a pas suffi ? »",
  ]],
  ["5. Coût de l'inaction (2 min)", [
    "« Si rien ne change dans les six prochains mois, qu'est-ce que cela vous coûterait ? »",
  ]],
  ["6. Paiement — question prioritaire (4 min)", [
    "« La dernière formation que vous avez suivie : qui l'a payée ? Combien, à peu près ? »",
    "« Avez-vous déjà payé vous-même une formation ou un accompagnement ? Combien, et comment avez-vous payé ? »",
    "« Votre entreprise a-t-elle un plan de formation ? Pourriez-vous demander une prise en charge ? À qui ? »",
    "« Si un accompagnement vous aidait vraiment sur ce que vous m'avez raconté, qui devrait le payer selon vous ? »",
    "Test de prix (fin d'entretien) : présenter un prix concret avec paiement en plusieurs fois (D17, Flouci, lien de paiement) et noter la réaction exacte.",
  ]],
  ["7. Canaux (2 min)", [
    "« Quand vous cherchez un conseil de management, où allez-vous ? » (LinkedIn, YouTube, Facebook, collègues, podcasts, livres)",
  ]],
  ["8. Réaction aux formulations (2 min)", [
    "Lire les formulations de la section 4, une par une : « Est-ce que cela vous ressemble : oui, un peu, non ? » Ne pas commenter.",
  ]],
  ["9. Clôture (1 min)", [
    "« Merci. Y a-t-il quelqu'un d'autre, récemment nommé, qui accepterait d'en parler ? »",
    "Si la difficulté est dans le périmètre : proposer la formation gratuite (2 × 60 min) ou une consultation. Noter l'issue.",
  ]],
];
for (const [title, qs] of steps) { content.push(h3(title)); qs.forEach(q => content.push(bullet(q))); }
content.push(h3("À éviter"));
[
  "Présenter le programme avant la fin.",
  "Poser des questions fermées qui suggèrent la réponse (« Vous avez du mal à vous affirmer, n'est-ce pas ? »).",
  "Donner des conseils pendant l'entretien.",
  "Interpréter à voix haute ce que dit la personne.",
].forEach(t => content.push(bullet(t)));
content.push(br());

// ---------- 3. Fiche ----------
content.push(h1("3. Fiche de dépistage (une par entretien)"));
content.push(p("Identifiant : E-__ (jamais le nom) · Date : ____ · Durée : ____ · Langue : darija / arabe / français · Recruté via : LinkedIn / recommandation / post / JCI / autre"));
content.push(fillTable([
  ["Situation", "Date de nomination · métier d'origine · taille de l'équipe · secteur · ville · premier poste d'encadrement (oui/non) · manage d'anciens pairs (oui/non)"],
  ["Douleur 1 — visible", "Confirmée / non confirmée / non abordée · spontanée (oui/non) · mots exacts"],
  ["Douleur 2 — ressentie", "Confirmée / non confirmée / non abordée · anciens pairs / coincé entre deux / « petit chef » / peur de paraître faible · mots exacts"],
  ["Douleur 3 — enjeu", "Confirmée / non confirmée / non abordée · mots exacts"],
  ["Difficulté n° 1", "Dans le périmètre / hors périmètre (délégation, réunions, prise de parole, surcharge) · laquelle"],
  ["Déjà essayé", "Quoi, et pourquoi cela n'a pas suffi"],
  ["Coût de l'inaction", "Avec ses mots"],
  ["Paiement", "Qui a payé la dernière formation · a déjà payé soi-même (montant) · accès à un financement employeur · qui devrait payer selon lui/elle · réaction au prix testé (mots exacts)"],
  ["Canaux", "Où il/elle cherche des conseils"],
  ["Objections", "Temps, prix, « l'entreprise devrait payer », autre"],
  ["Réaction aux formulations", "F1 … F8 : oui / un peu / non"],
  ["Issue", "Formation gratuite / consultation / achat / refus (raison) · recommande quelqu'un (oui/non)"],
  ["Consentement", "Réutilisation anonymisée des mots (oui/non) · enregistrement (oui/non)"],
  ["Mon impression", "Correspond au segment A ? Force de la douleur (faible / moyenne / forte)"],
]));
content.push(p("Après l'entretien, reporter la fiche dans l'onglet « Fiches » du fichier Excel de suivi."));
content.push(br());

// ---------- 4. Formulations ----------
content.push(h1("4. Formulations à tester en fin d'entretien"));
content.push(p("Issues de la recherche documentaire (verbatims français) ou proposées. Elles servent à mesurer la reconnaissance, pas à l'induire."));
content.push(table([700, 6038, 2900], [
  ["N°", "Formulation", "Niveau visé"],
  ["F1", "« Je n'ose pas faire de feedback négatif à quelqu'un qui était mon collègue. »", "1 + 2"],
  ["F2", "« J'ai peur qu'on pense que je joue au petit chef. »", "2 — trop dur"],
  ["F3", "« Je suis coincé entre ma hiérarchie et mon équipe. »", "2 — solitude"],
  ["F4", "« J'ai l'impression que ça n'arriverait pas si j'étais venu de l'extérieur. »", "2 — légitimité"],
  ["F5", "« Personne ne m'a préparé à ça. »", "Attribution à l'organisation"],
  ["F6", "« Je veux parler clair sans exploser ni m'écraser. »", "Promesse de l'offre"],
  ["F7", "« Mes premiers mois vont décider de la façon dont on me verra. »", "3 — enjeu"],
  ["F8", "« J'ai peur de paraître faible. »", "2 — faible"],
]));
content.push(br());

// ---------- 5. Messages FR ----------
content.push(h1("5. Messages d'invitation — français"));
content.push(p("À personnaliser et envoyer à la main, un par un. Ne jamais copier-coller à plusieurs personnes à la fois."));
content.push(h2("5.1 Relation LinkedIn (nomination visible)"));
[
  "Bonjour [Prénom],",
  "J'ai vu que vous avez pris récemment vos fonctions de [poste] chez [entreprise] — félicitations.",
  "Je mène une petite étude sur les premiers mois des nouveaux responsables d'équipe en Tunisie : ce qui est difficile, ce qui aide. Accepteriez-vous un échange de 25 minutes, par téléphone ou en visio ? Ce n'est pas une démarche commerciale, et tout reste confidentiel.",
  "Merci d'avance,",
  "Ilhem Zabi — Leaders Way Pro",
].forEach(t => content.push(p(t)));
content.push(h2("5.2 Recommandation"));
[
  "Bonjour [Prénom],",
  "[Nom du contact] m'a dit que vous aviez été nommé(e) [poste] cette année, et pensait que vous accepteriez peut-être d'en parler.",
  "Je mène une étude sur les premiers mois des nouveaux responsables d'équipe en Tunisie. Auriez-vous 25 minutes cette semaine ou la suivante ? Rien à vendre : uniquement votre expérience, de façon confidentielle.",
  "Bien à vous,",
  "Ilhem Zabi — Leaders Way Pro",
].forEach(t => content.push(p(t)));
content.push(h2("5.3 Post d'appel à volontaires (LinkedIn ou Facebook)"));
[
  "Vous avez été nommé(e) responsable d'équipe ces 12 derniers mois ?",
  "Passer d'expert à chef d'équipe, c'est souvent un saut sans préparation. Je mène une étude sur ces premiers mois en Tunisie : ce qui est difficile, ce qui aide vraiment.",
  "Je cherche 15 personnes pour un échange confidentiel de 25 minutes. En remerciement, je partagerai la synthèse anonymisée de l'étude avec chaque participant.",
  "Intéressé(e) ? Commentez « étude » ou écrivez-moi en message privé.",
].forEach(t => content.push(p(t)));
content.push(h2("5.4 Relance (une seule, après 5 à 7 jours)"));
content.push(p("Bonjour [Prénom], je me permets une seule relance au sujet de l'étude sur les nouveaux responsables d'équipe. Si ce n'est pas le bon moment, aucun souci — et merci d'avance si vous connaissez quelqu'un de récemment nommé qui accepterait d'en parler."));
content.push(br());

// ---------- 6. Messages AR ----------
content.push(h1("6. Messages d'invitation — arabe standard"));
content.push(p("Mêmes règles : à personnaliser et envoyer à la main."));
content.push(h2("6.1 Relation LinkedIn"));
[
  "مرحبًا [الاسم]،",
  "لاحظتُ أنك توليتَ مؤخرًا منصب [المنصب] في [الشركة]، فألف مبروك.",
  "أُجري دراسة قصيرة حول الأشهر الأولى للمسؤولين الجدد عن الفرق في تونس: ما الذي يصعب، وما الذي يساعد فعلًا. هل تقبل حوارًا لمدة 25 دقيقة عبر الهاتف أو الفيديو؟ ليس الهدف بيع أي شيء، وكل ما يُقال يبقى سريًا.",
  "شكرًا مسبقًا،",
  "إلهام زبي — Leaders Way Pro",
].forEach(t => content.push(ar(t)));
content.push(h2("6.2 Recommandation"));
[
  "مرحبًا [الاسم]،",
  "أخبرني [اسم الشخص] أنك عُيِّنتَ [المنصب] هذا العام، وظنّ أنك قد تقبل الحديث عن تجربتك.",
  "أُجري دراسة حول الأشهر الأولى للمسؤولين الجدد عن الفرق في تونس. هل لديك 25 دقيقة هذا الأسبوع أو الأسبوع القادم؟ لا شيء للبيع، فقط تجربتك، وبسرّية تامة.",
  "مع خالص التحية،",
  "إلهام زبي — Leaders Way Pro",
].forEach(t => content.push(ar(t)));
content.push(h2("6.3 Post d'appel à volontaires"));
[
  "هل عُيِّنتَ مسؤولًا عن فريق خلال الاثني عشر شهرًا الماضية؟",
  "الانتقال من خبير في مجالك إلى قائد فريق يحدث غالبًا دون أي تحضير. أُجري دراسة حول هذه الأشهر الأولى في تونس: ما الصعب فيها، وما الذي يساعد حقًا.",
  "أبحث عن 15 شخصًا لحوار سري مدته 25 دقيقة. وشكرًا لمشاركتكم، سأرسل لكل مشارك خلاصة الدراسة دون ذكر أي اسم.",
  "مهتم؟ اكتب «دراسة» في التعليقات أو راسلني على الخاص.",
].forEach(t => content.push(ar(t)));
content.push(h2("6.4 Relance"));
content.push(ar("مرحبًا [الاسم]، أسمح لنفسي بتذكير واحد فقط بخصوص الدراسة حول المسؤولين الجدد عن الفرق. إن لم يكن الوقت مناسبًا فلا بأس، وشكرًا مسبقًا إن كنت تعرف شخصًا عُيِّن مؤخرًا ويقبل الحديث عن تجربته."));
content.push(br());

// ---------- 7. LinkedIn ----------
content.push(h1("7. Recherche LinkedIn guidée"));
content.push(h2("Recherche gratuite (barre de recherche → Personnes)"));
[
  "Filtres : Lieux = Tunisie (ou Grand Tunis, Sfax, Sousse) · Entreprises actuelles = celles de la liste cible.",
  "Mots-clés de titre, un par recherche : « chef d'équipe », « team lead », « team leader », « responsable d'équipe », « superviseur », « chef de service », « chef d'agence », « manager ».",
  "Vérifier sur le profil : date de début du poste actuel (moins de 12 mois) et poste précédent sans encadrement.",
].forEach(t => content.push(bullet(t)));
content.push(h2("Publications « nouveau poste »"));
[
  "Rechercher dans Publications : « nouveau poste » Tunis · « heureux d'annoncer » responsable · « starting a new position » « Team Lead » Tunisia — filtre Date : derniers mois.",
  "Les personnes qui annoncent leur nomination sont souvent ouvertes à l'échange : commencer par féliciter sincèrement.",
].forEach(t => content.push(bullet(t)));
content.push(h2("Sales Navigator (essai gratuit d'un mois)"));
content.push(bullet("Filtres : Géographie = Tunisie · Niveau hiérarchique = hors Directeur et au-dessus · Titre actuel = mots-clés ci-dessus · filtre « A changé de poste dans les 90 derniers jours »."));
content.push(h2("Rythme conseillé"));
content.push(bullet("15 à 20 minutes par jour · 5 à 8 invitations personnalisées par jour · une seule relance."));
content.push(br());

// ---------- 8. Confidentialité ----------
content.push(h1("8. Confidentialité et suite"));
[
  "Ne jamais coller de nom, numéro ou capture de profil dans une conversation avec Claude, ni dans le dépôt GitHub.",
  "Les fiches et le suivi restent sur votre ordinateur (fichier Excel du kit).",
  "Pour la synthèse : partager uniquement l'onglet « Fiches » (identifiants E-01, E-02…). Claude produit la synthèse et la compare aux seuils.",
  "Repères non juridiques (loi 2004-63) : consentement explicite pour l'enregistrement et la réutilisation des mots ; messages manuels ; vérifier avec un juriste une éventuelle déclaration à l'INPDP.",
].forEach(t => content.push(bullet(t)));

const doc = new Document({
  creator: "Leaders Way Pro",
  title: "Kit de dépistage — Segment A",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 34, bold: true, color: ACCENT }, paragraph: { outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 26, bold: true, color: ACCENT }, paragraph: { outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 23, bold: true }, paragraph: { outlineLevel: 2 } },
    ],
  },
  numbering: { config: [
    { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
  ] },
  sections: [{ properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, children: content }],
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync(process.argv[2], buf); console.log("written", process.argv[2]); });

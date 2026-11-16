const ExcelJS = require("exceljs");
const wb = new ExcelJS.Workbook();
wb.creator = "Leaders Way Pro";
const ACCENT = "FF1F3A5F";
const N = 25; // rows prepared

function header(ws, cols) {
  ws.columns = cols.map(([h, w]) => ({ header: h, width: w }));
  const r = ws.getRow(1);
  r.font = { bold: true, color: { argb: "FFFFFFFF" } };
  r.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ACCENT } };
  r.alignment = { wrapText: true, vertical: "middle" };
  r.height = 32;
  ws.views = [{ state: "frozen", ySplit: 1 }];
}
function list(ws, col, values) {
  for (let i = 2; i <= N + 1; i++)
    ws.getCell(`${col}${i}`).dataValidation = { type: "list", allowBlank: true, formulae: [`"${values.join(",")}"`] };
}

// 1. Mode d'emploi
const help = wb.addWorksheet("Mode d'emploi");
help.getColumn(1).width = 110;
[
  ["Projet Premier Cercle — suivi du dépistage, segment A (chefs récemment nommés en Tunisie)", true],
  ["1. Onglet « Suivi contacts » : une ligne par personne contactée. Le nom reste dans ce fichier, sur votre ordinateur uniquement.", false],
  ["2. Onglet « Fiches » : une ligne par entretien réalisé, avec un identifiant E-01, E-02… (jamais le nom). Utilisez les listes déroulantes.", false],
  ["3. Onglet « Seuils » : le calcul est automatique. Il compare les résultats aux seuils fixés avant les entretiens et propose un verdict.", false],
  ["4. Pour la synthèse avec Claude : partagez uniquement l'onglet « Fiches » (anonymisé), jamais « Suivi contacts ».", false],
  ["Règles : messages envoyés à la main, une seule relance, entretien de recherche sans vente, consentement avant tout enregistrement.", false],
].forEach(([t, b], i) => { const c = help.getCell(`A${i + 1}`); c.value = t; c.font = { bold: b, size: b ? 14 : 11, color: b ? { argb: ACCENT } : undefined }; c.alignment = { wrapText: true }; });

// 2. Suivi contacts
const sc = wb.addWorksheet("Suivi contacts");
header(sc, [["N°", 6], ["Nom (local uniquement)", 24], ["Poste", 22], ["Entreprise", 22], ["Secteur", 16], ["Ville", 12],
  ["Source", 16], ["Date invitation", 13], ["Date relance", 13], ["Statut", 18], ["Date entretien", 13], ["ID entretien", 11], ["Notes", 30]]);
for (let i = 1; i <= N; i++) sc.getCell(`A${i + 1}`).value = i;
const SECT = ["Banque", "Assurance", "IT/offshore", "Télécoms", "Industrie", "Pharma/santé", "Commerce", "Centre d'appels", "Public", "Autre"];
list(sc, "E", SECT);
list(sc, "G", ["LinkedIn", "Recommandation", "Post volontaires", "JCI", "Réseau perso", "Autre"]);
list(sc, "J", ["À contacter", "Invité", "Relancé", "Accepté", "Entretien fait", "Refus", "Sans réponse", "Hors critères"]);

// 3. Fiches (one row per interview)
const fi = wb.addWorksheet("Fiches");
const ficheCols = [
  ["ID", 8], ["Date", 11], ["Langue", 10], ["Secteur", 14], ["Ville", 11], ["Taille équipe", 9], ["Mois depuis nomination", 10],
  ["1er poste encadrement", 10], ["Manage anciens pairs", 10],
  ["D1 visible", 13], ["D1 spontanée", 10], ["D1 mots exacts", 30],
  ["D2 ressentie", 13], ["D2 forme", 18], ["D2 mots exacts", 30],
  ["D3 enjeu", 13], ["D3 mots exacts", 26],
  ["Difficulté n°1", 16], ["Difficulté n°1 (détail)", 26],
  ["Déjà essayé", 26], ["Coût inaction (mots exacts)", 28],
  ["Dernière formation payée par", 14], ["A déjà payé soi-même", 11], ["Montant payé soi-même (DT)", 12],
  ["Accès financement employeur", 12], ["Qui devrait payer (selon lui/elle)", 14], ["Prêt à payer au prix testé", 12], ["Réaction au prix (mots exacts)", 28],
  ["Canaux d'information", 22], ["Objections", 22],
  ["F1", 7], ["F2", 7], ["F3", 7], ["F4", 7], ["F5", 7], ["F6", 7], ["F7", 7], ["F8", 7],
  ["Issue", 16], ["Recommande quelqu'un", 10], ["Consent. mots", 9], ["Consent. enregistr.", 9], ["Force douleur", 10], ["Impression", 26],
];
header(fi, ficheCols);
const col = h => fi.getColumn(ficheCols.findIndex(c => c[0] === h) + 1).letter;
for (let i = 1; i <= N; i++) fi.getCell(`A${i + 1}`).value = `E-${String(i).padStart(2, "0")}`;
const CNA = ["Confirmée", "Non confirmée", "Non abordée"], YN = ["Oui", "Non"], YUN = ["Oui", "Un peu", "Non"];
list(fi, col("Langue"), ["Darija", "Arabe", "Français", "Mixte"]);
list(fi, col("Secteur"), SECT);
["1er poste encadrement", "Manage anciens pairs", "D1 spontanée", "A déjà payé soi-même", "Recommande quelqu'un", "Consent. mots", "Consent. enregistr."].forEach(h => list(fi, col(h), YN));
["D1 visible", "D2 ressentie", "D3 enjeu"].forEach(h => list(fi, col(h), CNA));
list(fi, col("D2 forme"), ["Anciens pairs", "Coincé entre deux", "Petit chef", "Paraître faible", "Légitimité", "Plusieurs", "Autre"]);
list(fi, col("Difficulté n°1"), ["Dans périmètre", "Hors périmètre"]);
list(fi, col("Dernière formation payée par"), ["Employeur", "Lui/elle", "Gratuite", "Aucune"]);
list(fi, col("Accès financement employeur"), ["Oui", "Peut-être", "Non"]);
list(fi, col("Qui devrait payer (selon lui/elle)"), ["Moi", "Employeur", "Partagé", "Ne sait pas"]);
list(fi, col("Prêt à payer au prix testé"), ["Oui", "En plusieurs fois", "Non", "Non testé"]);
["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8"].forEach(h => list(fi, col(h), YUN));
list(fi, col("Issue"), ["Formation gratuite", "Consultation", "Achat", "Refus", "À recontacter"]);
list(fi, col("Force douleur"), ["Faible", "Moyenne", "Forte"]);
for (let r = 2; r <= N + 1; r++) fi.getRow(r).alignment = { wrapText: true, vertical: "top" };

// 4. Seuils (thresholds as a share of interviews done: 8, 9, 10, 5, 5 out of 15)
const se = wb.addWorksheet("Seuils");
se.columns = [{ width: 58 }, { width: 12 }, { width: 14 }, { width: 14 }, { width: 26 }];
const R = (c) => `Fiches!${col(c)}2:${col(c)}${N + 1}`;
const f = (formula) => ({ formula });
const rows = [
  ["Critère", "Résultat", "Seuil validé", "Seuil à revoir", "Statut"],
  ["Entretiens réalisés (dates renseignées)", f(`COUNTA(${R("Date")})`), 15, "", ""],
  ["Douleur ressentie (D2) confirmée", f(`COUNTIF(${R("D2 ressentie")},"Confirmée")`), 0.53, 0.33, ""],
  ["Douleur visible (D1) évoquée spontanément", f(`COUNTIFS(${R("D1 visible")},"Confirmée",${R("D1 spontanée")},"Oui")`), 0.6, 0.4, ""],
  ["Difficulté n°1 dans le périmètre du programme", f(`COUNTIF(${R("Difficulté n°1")},"Dans périmètre")`), 0.66, 0.46, ""],
  ["A déjà payé soi-même OU prêt à payer au prix testé", f(`SUMPRODUCT(--(((${R("A déjà payé soi-même")}="Oui")+(${R("Prêt à payer au prix testé")}="Oui")+(${R("Prêt à payer au prix testé")}="En plusieurs fois"))>0))`), 0.33, 0.2, ""],
  ["Accès plausible à un financement employeur (oui / peut-être)", f(`COUNTIF(${R("Accès financement employeur")},"Oui")+COUNTIF(${R("Accès financement employeur")},"Peut-être")`), "à mesurer", "", "Décide de la piste hybride"],
  ["Accepte formation gratuite ou consultation (ou achat)", f(`COUNTIF(${R("Issue")},"Formation gratuite")+COUNTIF(${R("Issue")},"Consultation")+COUNTIF(${R("Issue")},"Achat")`), 0.33, 0.2, ""],
];
rows.forEach(r => se.addRow(r).eachCell(c => { c.alignment = { wrapText: true, vertical: "middle" }; }));
const hr = se.getRow(1); hr.font = { bold: true, color: { argb: "FFFFFFFF" } }; hr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ACCENT } };
for (const i of [3, 4, 5, 6, 8]) {
  se.getCell(`C${i}`).numFmt = "0%"; se.getCell(`D${i}`).numFmt = "0%";
  se.getCell(`E${i}`).value = f(`IF($B$2=0,"—",IF(B${i}/$B$2>=C${i},"VALIDÉ",IF(B${i}/$B$2<D${i},"À REVOIR","ENTRE-DEUX")))`);
}
se.getCell("E2").value = f(`IF(B2>=15,"Échantillon atteint","Encore "&(15-B2)&" entretien(s)")`);
se.addRow([]);
se.addRow(["Verdict proposé (à confirmer par la fondatrice)"]).font = { bold: true, color: { argb: ACCENT } };
se.addRow([f(
  `IF(B2<15,"Échantillon incomplet",` +
  `IF(AND(E3="VALIDÉ",E4="VALIDÉ",E5="VALIDÉ",E6="VALIDÉ",E8="VALIDÉ"),"Segment A validé → ICP v1",` +
  `IF(OR(E3="À REVOIR",E4="À REVOIR"),"Douleur non validée → segment à abandonner ou revoir",` +
  `IF(E5="À REVOIR","Douleur validée hors périmètre → ajustement de l'offre",` +
  `IF(E6="À REVOIR","Paiement personnel faible → pivot B2B ou hybride",` +
  `"Résultats entre deux seuils → 5 entretiens de plus, puis décision")))))`)]);
se.addRow([]);
se.addRow(["Seuils exprimés en proportion des entretiens réalisés (sur 15 : 8, 9, 10, 5, 5 pour « validé »). Ils ont été fixés avant les entretiens : ne pas les modifier en cours de route."]);
se.getColumn(1).alignment = { wrapText: true };

wb.xlsx.writeFile(process.argv[2]).then(() => console.log("written", process.argv[2]));

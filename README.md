# LeadersWayPro

Site vitrine de **LeadersWayPro** — « Communiquez comme un Leader » / «تواصل كقائد» — le programme de
formation et de coaching en communication de leadership d'Ilhem Zabi, destiné aux dirigeants, managers
et entrepreneurs francophones et arabophones. Le site est **bilingue français / arabe**, avec des pages
dédiées et une bascule de langue dans la navigation.

## Aperçu

Site statique (HTML / CSS / JS, sans framework ni build) construit autour du parcours de conversion de
la marque, décliné dans les deux langues :

1. **Accueil** (`index.html` / `ar/index.html`) — proposition de valeur, méthode, aperçu des offres, témoignages.
2. **Formations** (`formations.html` / `ar/formations.html`) — détail des 3 offres : formation gratuite
   de 2 jours, programme signature « Communiquez comme un Leader », coaching individuel & entreprise, + FAQ.
3. **À propos** (`a-propos.html` / `ar/a-propos.html`) — portrait d'Ilhem Zabi, mission, vision, valeurs.
4. **Contact** (`contact.html` / `ar/contact.html`) — coordonnées et formulaire de réservation de consultation.

Chaque page porte un bouton « 🌐 العربية » (pages FR) ou « 🌐 Français » (pages AR) dans la navigation,
qui bascule vers l'équivalent exact de la page courante dans l'autre langue.

## Structure

```
.
├── index.html              # pages françaises (racine)
├── formations.html
├── a-propos.html
├── contact.html
├── ar/                      # pages arabes (RTL), mêmes noms de fichiers
│   ├── index.html
│   ├── formations.html
│   ├── a-propos.html
│   └── contact.html
└── assets/
    ├── css/style.css   # design system partagé (couleurs, typographie, composants)
    ├── css/rtl.css     # surcharges RTL + police arabe, chargé uniquement par les pages ar/
    ├── js/main.js      # menu mobile, FAQ accordéon, animations au scroll, formulaires
    └── img/            # visuels réels (logo, photos, portrait — partagés entre FR et AR)
```

### Comment fonctionne la version arabe

- Les pages `ar/*.html` ont `<html lang="ar" dir="rtl">` : la mise en page (grilles, flexbox) se
  réoriente automatiquement en miroir grâce au CSS Grid/Flexbox nativement sensibles à `dir`.
- `assets/css/rtl.css` ne corrige que ce qui reste "physique" en CSS (positions `left/right` en dur,
  majuscules/espacement de lettres qui ne conviennent pas à l'arabe) et charge la police **Cairo**
  (adaptée à l'arabe) à la place de Playfair Display / Inter.
- Les numéros de téléphone et emails sont enveloppés dans `<span class="ltr-embed">` pour rester
  affichés de gauche à droite même dans une page RTL.
- Pour ajouter une page arabe supplémentaire, dupliquez une page FR existante dans `ar/`, ajoutez
  `dir="rtl" lang="ar"`, le lien vers `rtl.css`, préfixez les chemins vers `assets/` par `../`, et
  traduisez le contenu.

## Lancer le site en local

Aucune dépendance à installer. Depuis la racine du projet :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

ou avec n'importe quel serveur statique (VS Code Live Server, `npx serve`, etc.).

## Déploiement

Le site est 100% statique et peut être déployé tel quel sur GitHub Pages, Netlify, Vercel ou tout
hébergement web classique — aucune étape de build n'est nécessaire.

## Ajouter le portrait d'Ilhem Zabi

Le code référence déjà une photo à cet emplacement : `assets/img/ilhem-zabi.jpg`
(utilisée sur `a-propos.html` et en petit format dans le hero de `index.html`). Tant que le fichier
n'existe pas, le site retombe proprement sur un visuel de substitution (initiales "IZ" sur fond navy/or)
— aucune image cassée ne s'affiche.

Pour l'ajouter :

1. Déposez le fichier photo dans `assets/img/` sous le nom exact `ilhem-zabi.jpg` (format portrait,
   déjà recadré si possible — l'image est affichée en `object-fit: cover`).
2. Committez et poussez le fichier comme n'importe quel autre fichier du dépôt.

Si vous envoyez la photo dans une conversation Claude, préférez un **envoi en pièce jointe fichier**
plutôt qu'un simple collage dans le champ de texte : selon l'environnement d'exécution, une image
collée inline n'est pas toujours accessible sur le disque pour être ajoutée automatiquement au dépôt.

## Connecter les formulaires à GoHighLevel (GHL)

Les formulaires de `formations.html#gratuite` (inscription à la formation gratuite) et de
`contact.html` (réservation de consultation) — ainsi que leurs équivalents `ar/formations.html#gratuite`
et `ar/contact.html` — sont actuellement des formulaires HTML statiques : ils affichent un message de
confirmation côté navigateur mais n'envoient les données nulle part. Chaque formulaire est encadré dans
le code par un commentaire `INTÉGRATION GHL` qui indique où intervenir.

Le site étant bilingue, prévoyez **deux formulaires GHL distincts** (un français, un arabe — c'est
d'ailleurs le formulaire arabe déjà existant qui a motivé la création des pages `ar/`) : embarquez le
formulaire français dans `formations.html` / `contact.html`, et le formulaire arabe dans
`ar/formations.html` / `ar/contact.html`.

Pour les remplacer par vos vrais formulaires GHL :

1. Dans GoHighLevel, ouvrez **Sites → Forms** (ou **Sites → Calendars** si vous préférez un lien de
   prise de rendez-vous plutôt qu'un formulaire) et sélectionnez/créez le formulaire correspondant.
2. Cliquez sur **Share / Integrate → Embed** (ou l'icône `</>`). GHL propose deux modes :
   - **iFrame** — le plus simple : GHL vous donne un `<iframe src="https://api.leadconnectorhq.com/widget/form/...">`.
   - **JavaScript embed** — un `<script>` qui injecte le formulaire dans une `<div>` cible.
3. Copiez ce code.
4. Ouvrez `formations.html` (pour la formation gratuite) ou `contact.html` (pour la consultation),
   repérez le commentaire `INTÉGRATION GHL`, supprimez le bloc `<form id="lead-form">…</form>` (ou
   `id="contact-form"`) juste en dessous, et collez le code GHL à la place.
5. Si GHL fournit un `<script>` à placer en fin de page plutôt qu'à cet endroit précis, ajoutez-le
   juste avant `</body>`, à côté de `<script src="assets/js/main.js"></script>`.
6. Vous pouvez supprimer sans risque le bloc correspondant dans `assets/js/main.js` (la fonction qui
   gère `#lead-form` / `#contact-form`) une fois le formulaire GHL en place — il ne s'applique qu'aux
   formulaires statiques d'origine.
7. Testez en soumettant une donnée factice et vérifiez qu'elle arrive bien dans **Contacts** côté GHL.

Astuce : pour préqualifier automatiquement les nouveaux leads avant votre appel, vous pouvez ensuite
utiliser le skill `preparation-consultation-leaderswaypro` sur l'export/la réponse du formulaire GHL.

## Prochaines étapes suggérées

- Ajouter le logo officiel (au-delà du monogramme "L" actuel) et d'éventuels autres visuels de
  formation dans `assets/img/`.
- Renseigner les vrais liens réseaux sociaux (actuellement des `#`) dans les en-têtes/pieds de page.
- Ajouter Google Analytics / Meta Pixel selon les besoins de suivi marketing.
- Ajouter les pages légales (mentions légales, politique de confidentialité) référencées en pied de page.

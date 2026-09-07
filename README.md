# LeadersWayPro

Site vitrine de **LeadersWayPro** — « Communiquez comme un Leader » — le programme de formation et de
coaching en communication de leadership d'Ilhem Zabi, destiné aux dirigeants, managers et entrepreneurs
francophones.

## Aperçu

Site statique (HTML / CSS / JS, sans framework ni build) construit autour du parcours de conversion de
la marque :

1. **Accueil** (`index.html`) — proposition de valeur, méthode, aperçu des offres, témoignages.
2. **Formations** (`formations.html`) — détail des 3 offres : formation gratuite de 2 jours, programme
   signature « Communiquez comme un Leader », coaching individuel & entreprise, + FAQ.
3. **À propos** (`a-propos.html`) — portrait d'Ilhem Zabi, mission, vision, valeurs.
4. **Contact** (`contact.html`) — coordonnées et formulaire de réservation de consultation.

## Structure

```
.
├── index.html
├── formations.html
├── a-propos.html
├── contact.html
└── assets/
    ├── css/style.css   # design system (couleurs, typographie, composants)
    ├── js/main.js      # menu mobile, FAQ accordéon, animations au scroll, formulaires
    └── img/            # emplacement pour les visuels réels (logo, photos, portrait)
```

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
`contact.html` (réservation de consultation) sont actuellement des formulaires HTML statiques : ils
affichent un message de confirmation côté navigateur mais n'envoient les données nulle part. Chaque
formulaire est encadré dans le code par un commentaire `INTÉGRATION GHL` qui indique où intervenir.

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

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

## Prochaines étapes suggérées

- Remplacer les visuels de substitution (initiales, dégradés) par le logo officiel et de vraies
  photos (portrait d'Ilhem Zabi, visuels de formation).
- Connecter les formulaires (`contact.html`, `formations.html#gratuite`) à un service réel
  (par ex. un formulaire GoHighLevel / GHL, Formspree, ou un backend dédié) — actuellement ils
  affichent une confirmation côté client uniquement.
- Renseigner les vraies coordonnées (email, téléphone, adresse) et les liens réseaux sociaux dans
  les en-têtes/pieds de page de chaque page.
- Ajouter Google Analytics / Meta Pixel selon les besoins de suivi marketing.
- Ajouter les pages légales (mentions légales, politique de confidentialité) référencées en pied de page.

# Rubriques

Application web (PWA) de création de **grilles d'évaluation** et de **notation par compétences**, destinée aux enseignants. Tout fonctionne **côté client**, sans serveur : les données sont stockées dans le `localStorage` du navigateur et peuvent être exportées / importées en JSON.

## Fonctionnalités

- **Grilles** : catégories d'items évaluables, réutilisables comme modèles.
- **Trois modalités d'évaluation par item** :
  - `check` — pastilles à points (validée / rejetée / neutre) ;
  - `level` — niveaux par groupe de critères ;
  - `columns` — colonnes de niveaux avec barème de points.
- **Évaluations** : liste d'élèves, saisie des scores, états spéciaux (absent, dispensé, non noté, inapte), conseils.
- **Exports** : JSON (sauvegarde/partage), XLSX (résultats), PDF par élève (impression).

## Stack

- [Vue 3](https://vuejs.org/) (`<script setup>`) + [Vue Router](https://router.vuejs.org/) + [Pinia](https://pinia.vuejs.org/)
- [Vite](https://vite.dev/) (build) + [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) (tests unitaires)
- Bibliothèques d'export chargées depuis `public/` : `xlsx`, `jspdf`, `html2canvas`

## Développement

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production -> dist/
npm run preview  # prévisualise le build
npm test         # tests unitaires (logique de scoring)
```

## Architecture

```
src/
  stores/store.js   # état Pinia + logique métier pure (scoring, validation, persistance)
  data/grille-dg.js # grille modèle par défaut
  router/           # routes : / (accueil), /edit/:id, /eval/:id
  views/            # HomeView, EditView, EvalView
  components/Grille/ # composants d'édition et d'évaluation par modalité
  utils/            # exporters (JSON/XLSX), print (PDF), palette, files, icons
```

La logique de calcul des scores et de validation est isolée dans `src/stores/store.js`
sous forme de fonctions pures, couvertes par `src/stores/store.test.js`.

## Persistance & format des données

Les données sont persistées dans `localStorage` (`rubriques:grilles`, `rubriques:evaluations`)
au format versionné `{ version, data }`. La constante `SCHEMA_VERSION` (dans `store.js`) doit être
incrémentée lors de tout changement de structure incompatible, accompagnée d'une migration.
Les imports JSON sont validés (`isValidGradeData`) avant intégration.

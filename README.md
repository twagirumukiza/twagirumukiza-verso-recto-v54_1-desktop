# Verso Recto — V54

Jeu de stratégie abstrait (2 à 4 joueurs, 72 cases triangulaires). Concept et règles :
Innocent Twagirumukiza — médaille A.I.F.F., Concours Lépine 2005.

Cette édition se concentre sur les modes essentiels et retire les modules
expérimentaux (mémoire/apprentissage, laboratoire en ligne, anciennes versions) des
éditions précédentes, dans un souci de simplicité et de fiabilité.

## Modes de jeu

- **Local, joueurs humains** (`index.html`, mode « Local ») — 2 à 4 joueurs sur le même
  appareil. La partie en cours survit à un rafraîchissement de la page (F5).
- **Local, humain(s) contre IA** (`index.html`, mode « Mode IA » ou « Mode mixte ») — de
  1 humain seul face à l'IA (2 participants) jusqu'à 4 participants en mélange libre
  humains/IA. L'IA est le *Victory Planner* : recherche minimax à profondeur adaptative
  (5/7/9 demi-coups en duel selon la tension de la position, 3/4/5 en multijoueur) avec
  *Path Planner* (navigation réelle des pions isolés autour des barrières).
- **Tournoi — élimination progressive** (`index.html`, mode « Tournoi », et
  `online-v39.html` via la case « Mode tournoi ») — 4 joueurs (humains ou IA). À la fin
  de chaque manche, le dernier classé est éliminé : ses pions repartent à leur case de
  départ mais restent figés et grisés. Une nouvelle manche démarre aussitôt avec les
  survivants — **tous les pions, y compris ceux des survivants, reviennent à leur case de
  départ** (le plateau redémarre entièrement à chaque manche) et l'ordre de jeu est
  retiré au sort — jusqu'au champion. Disponible en local comme en multijoueur en ligne.
- **Multijoueur en ligne** (`online-v39.html`) — parties à distance via Firebase, 2 à 4
  joueurs, couleurs non choisies laissées en pions neutres. Un rafraîchissement de page
  reconnecte automatiquement au salon en cours. Si un joueur quitte une partie en cours,
  il est déclaré forfait : ses pions se grisent, son tour est automatiquement sauté, et
  il apparaît en dernière position du classement final.

> **⚠️ Action requise après mise à jour depuis une version antérieure :** copier le
> contenu de `firebase-rules-v37.json` dans la console Firebase du projet (Realtime
> Database → Règles) pour que la déclaration de forfait fonctionne. Cette étape ne peut
> pas être faite à distance.

## Déploiement (GitHub Pages ou tout hébergeur statique)

Copier tout le contenu de ce dossier à la racine du dépôt / du site. Aucune étape de
build n'est nécessaire pour le jeu lui-même (HTML/CSS/JS statiques).

## Application de bureau (Windows / Linux) via GitHub

Depuis cette version, le jeu peut être empaqueté en application de bureau
autonome grâce à [Electron](https://www.electronjs.org/) et
[electron-builder](https://www.electron.build/), avec une construction
automatique sur GitHub Actions — pas besoin d'installer Windows ou Linux
soi-même, ni de machine de build locale.

### Mise en place (une seule fois)

1. Créer un dépôt GitHub (public ou privé) et y pousser tout le contenu de
   ce dossier (`git init`, `git add .`, `git commit`, `git remote add
   origin ...`, `git push`).
2. Le fichier `.github/workflows/build.yml` est déjà inclus : aucune
   configuration supplémentaire n'est nécessaire côté GitHub.

### Déclencher une construction

- **Automatiquement** : pousser un tag de version, par exemple :
  ```
  git tag v54.1.0
  git push origin v54.1.0
  ```
  GitHub Actions construit alors l'installeur Windows (`.exe`, NSIS) et les
  paquets Linux (`.AppImage` et `.deb`), puis crée automatiquement une
  **Release GitHub** avec ces fichiers en pièces jointes, prêts à
  télécharger.
- **Manuellement** : dans l'onglet **Actions** du dépôt GitHub, choisir le
  workflow « Build desktop apps » puis « Run workflow ». Les fichiers
  construits sont alors disponibles comme « Artifacts » de l'exécution
  (sans création de Release), utile pour tester sans publier de version.

### Construire en local (optionnel)

```
npm install
npm run start        # lance l'app Electron directement, sans empaqueter
npm run dist:win      # installeur Windows (nécessite Wine si on est sous Linux/macOS)
npm run dist:linux    # AppImage + .deb (natif sous Linux)
```

Les fichiers construits apparaissent dans le dossier `release/`. Le mode
en ligne (`online-v39.html`, Firebase) fonctionne normalement dans
l'application de bureau puisqu'elle a accès à Internet comme un
navigateur classique.

### Icône de l'application

Une icône est fournie dans `build/icon.png` (Linux) et `build/icon.ico`
(Windows), reprenant les tons kaolin/or du plateau triangulaire. Pour la
remplacer, il suffit de déposer un nouveau `build/icon.png` (512×512
minimum) et `build/icon.ico` (multi-résolutions) portant les mêmes noms.

## Tests

Les tests nécessitent Node.js et, une seule fois, l'installation des dépendances de
développement (jsdom, utilisé uniquement pour simuler un navigateur dans les tests —
jamais chargé par le jeu réel) :

```
npm install
npm test
```

Suites exécutées :

- `tests/smoke-test.js` — vérifie la syntaxe de `game.js`, les identifiants HTML
  essentiels et le nombre de configurations gagnantes (5 816).
- `tests/path-planner-test.js` — vérifie la présence du code du Path Planner (V51).
- `tests/integration-test.js` — **fait réellement tourner une partie** dans un DOM
  simulé (jsdom) : démarrage d'une partie à 3 joueurs, un coup joué côté page, puis
  exécution directe du vrai moteur du Worker IA (Victory Planner/Path Planner).
- `tests/online-forfeit-test.js` — vérifie le forfait en multijoueur en ligne (saut de
  tour automatique, fin de partie par attrition, classement).
- `tests/local-persistence-test.js` / `tests/online-persistence-test.js` — vérifient
  qu'un rafraîchissement de page (F5) ne fait perdre la partie ni en local ni en ligne.
- `tests/tournament-test.js` / `tests/online-tournament-test.js` — vérifient un tournoi
  complet de bout en bout (3 manches, gel des pions, couronnement du champion), en local
  et en ligne, y compris le déclenchement automatique par un vrai coup gagnant.

## Historique

Voir `CHANGELOG.md`. Les éditions antérieures (mémoire/apprentissage V44-V50, laboratoire
en ligne, anciennes versions multijoueur V37/V38) ne sont plus incluses dans cette
édition simplifiée ; elles restent disponibles dans les archives précédentes si besoin.

# Jeu de Plateforme - ESGI

## Description

Ce projet est un jeu de plateforme simple développé en HTML, CSS et JavaScript. Il permet au joueur de choisir un personnage, d'éviter des obstacles, de collecter des points, et de suivre ses statistiques de jeu. Le jeu inclut des fonctionnalités comme la sélection de personnage, un système de vies, un score dynamique, et un écran de fin de partie affichant des statistiques.

---

## Fonctionnalités

- **Sélection de personnage** : Choisissez entre Donkey Kong et Mario avant de commencer la partie.
- **Système de vies** : Le joueur commence avec 3 vies. Une vie est perdue à chaque collision avec un obstacle.
- **Score dynamique** :
  - +1 point toutes les secondes.
  - +10 points pour chaque obstacle qui atteint le mur gauche.
- **Difficulté progressive** : Le délai de spawn des obstacles diminue de manière exponentielle à partir de 150 points.
- **Statistiques de fin de partie** :
  - Nombre total de parties jouées.
  - Score moyen.
  - Meilleur score (Top 1).
  - Taux de victoire.
  - Personnage principal (le plus utilisé).
- **Stockage des statistiques** : Les statistiques sont sauvegardées dans le `localStorage` pour être persistantes entre les sessions.

---

## Technologies utilisées

- **HTML** : Structure de la page et des éléments interactifs.
- **CSS** : Styles pour l'apparence du jeu, y compris les animations et les transitions.
- **JavaScript** : Logique du jeu, gestion des événements, et manipulation du DOM.
  - **Modules JavaScript** : Le code est organisé en plusieurs fichiers pour une meilleure modularité :
    - `game.js` : Gestion du démarrage du jeu et des statistiques.
    - `main.js` : Point d'entrée principal pour initialiser le jeu.
    - `hud.js` : Mise à jour de l'affichage des vies et du score.
    - `obstacle.js` : Gestion des obstacles et des collisions.
    - `player.js` : Gestion des mouvements et des sauts du joueur.
    - `selection.js` : Gestion de la sélection de personnage.

---

## Installation et exécution

### Prérequis

- Un navigateur moderne (Google Chrome, Firefox, Edge, etc.).

### Étapes

1. **Téléchargez ou clonez le projet** :
   ```bash
   git clone https://github.com/JS/jeu-plateforme.git
   ```

2. **Ouvrez le fichier `index.html`** :
   - Si vous utilisez Visual Studio Code, lancez le projet avec l'extension **Live Server** pour exécuter les modules JavaScript correctement.
   - Sinon, utilisez un serveur local comme [http-server](https://www.npmjs.com/package/http-server) :
     ```bash
     npx http-server
     ```
   - Accédez à l'URL fournie par le serveur (par exemple, `http://127.0.0.1:8080`).

3. **Jouez au jeu** :
   - Sélectionnez un personnage.
   - Cliquez sur "Start" pour commencer la partie.
   - Évitez les obstacles et essayez de battre votre meilleur score !

---

## Structure du projet

- **`index.html`** : Contient la structure HTML du jeu.
- **`style.css`** : Définit les styles et animations du jeu.
- **`assets/`** : Contient les images utilisées dans le jeu (personnages, obstacles, arrière-plan, etc.).
- **`js/`** : Contient les fichiers JavaScript modulaires pour la logique du jeu.

---

## Fonctionnement du jeu

1. **Sélection de personnage** :
   - Choisissez entre Donkey Kong et Mario.
   - Une fois sélectionné, le bouton "Start" devient visible.

2. **Gameplay** :
   - Le joueur peut se déplacer avec les flèches gauche et droite.
   - Appuyez sur la barre d'espace pour sauter.
   - Évitez les obstacles pour ne pas perdre de vies.

3. **Fin de partie** :
   - Lorsque toutes les vies sont perdues, l'écran "Game Over" s'affiche.
   - Les statistiques de la partie sont affichées.

4. **Redémarrage** :
   - Cliquez sur "Rejouer" pour recommencer une nouvelle partie.

---

## Statistiques

Les statistiques sont affichées à la fin de chaque partie et incluent :
- **Nombre de parties jouées** : Total des parties depuis le début.
- **Score moyen** : Moyenne des scores obtenus.
- **Top 1 score** : Meilleur score atteint.
- **Taux de victoire** : Pourcentage de parties gagnées (au moins 1 vie restante).
- **Personnage principal** : Le personnage le plus utilisé.

Les statistiques sont sauvegardées dans le `localStorage` et sont persistantes entre les sessions.

---

## Améliorations possibles

- Ajouter des niveaux de difficulté supplémentaires.
- Intégrer des sons pour les actions du joueur et les collisions.
- Ajouter de nouveaux personnages ou obstacles.
- Permettre le partage des scores en ligne.

---

## Bug connu

- J'ai un bug qui est inexplicable pour les plateformes, j'arrive à bien les supprimer si je tape par en dessous, mais lorsque j'arrive par dessus alors sur une frame je suis dessus puis je redescend, j'ai beau triturer le code dans tous les sens je n'ai pas réussi à comprendre le comportement de ce bug, pareil en debug tout est normal juste une variable booléenne qui s'actualise que sur une frame et pas les autres.
- Le retour à l'accueil, il est impossible de retourner à la sélection de personnage sans faire F5. Sinon cela casse tout le visuel....

## Auteur

- **Clément KERVICHE** - Projet réalisé dans le cadre du cours ESGI.
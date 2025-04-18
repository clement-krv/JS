import { updateLivesDisplay, updateScoreDisplay } from './hud.js';

export function startGame(gameState, elements, callbacks) {
    const { gameOverScreen, player, startScreen } = elements;
    const { updateLives, updateScore, loopObstacle, addMovementListener } = callbacks;

    // Réinitialisation de l'état du jeu
    gameOverScreen.classList.add('hidden');
    gameState.gameOver = false;
    gameState.lives = 3; // Réinitialisation des vies
    gameState.score = 0; // Réinitialisation du score
    gameState.position.x = 0;
    gameState.position.y = 30;
    gameState.spawnDelay = 2000; // Réinitialisation du délai de spawn
    player.style.left = gameState.position.x + "px";
    player.style.bottom = gameState.position.y + "px";

    // Mise à jour de l'affichage
    updateLives();
    updateScore();

    // Lancement de la boucle des obstacles et activation des mouvements
    loopObstacle();
    addMovementListener();

    // Cacher l'écran de démarrage
    startScreen.classList.add('hidden');
}
export function startGame(gameState, elements, callbacks) {
    const { gameOverScreen, player, startScreen } = elements;
    const { updateLives, updateScore, loopObstacle, addMovementListener } = callbacks;

    gameOverScreen.classList.add('hidden');
    gameState.gameOver = false;
    gameState.lives = 3; 
    gameState.score = 0; 
    gameState.position.x = 0;
    gameState.position.y = 30;
    gameState.spawnDelay = 2000; 
    player.style.left = gameState.position.x + "px";
    player.style.bottom = gameState.position.y + "px";

    updateLives();
    updateScore();

    loopObstacle();
    addMovementListener();
}

// Fonction pour afficher les statistiques de jeu
export function showStats(gameState) {
    const stats = JSON.parse(localStorage.getItem('gameStats')) || {
        totalGames: 0,
        scores: [],
        victories: 0,
        characters: {},
    };


    stats.totalGames += 1;
    stats.scores.push(gameState.score);
    if (gameState.lives > 0) {
        stats.victories += 1;
    }
    stats.characters[gameState.selectedCharacter] = 
        (stats.characters[gameState.selectedCharacter] || 0) + 1;


    localStorage.setItem('gameStats', JSON.stringify(stats));

    // Calcul des statistiques
    const averageScore = stats.scores.reduce((sum, score) => sum + score, 0) / stats.scores.length;
    const topScore = Math.max(...stats.scores);
    const mainCharacter = Object.entries(stats.characters).reduce((a, b) => b[1] > a[1] ? b : a)[0];


    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = `
        <h2>Statistiques</h2>
        <p>Nombre de parties : ${stats.totalGames}</p>
        <p>Score moyen : ${averageScore.toFixed(2)}</p>
        <p>Top 1 score : ${topScore}</p>
        <p>Personnage principal : ${mainCharacter}</p>
    `;
    statsContainer.classList.remove('hidden');
}
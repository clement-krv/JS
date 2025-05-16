export function startGame(gameState, elements, callbacks) {
    const { gameOverScreen, player } = elements;
    const { updateLives, updateScore, loopObstacle } = callbacks;

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
    generatePlatforms(gameState);
    loopObstacle();
}

export function generatePlatforms(gameState) {
    const gameElement = document.querySelector('#game');
    gameState.platforms.forEach(p => p.remove());
    gameState.platforms = [];

    for (let i = 0; i < 2; i++) {
        const platform = document.createElement('div');
        platform.classList.add('platform');

        let positionX, tooClose;
        do {
            positionX = Math.random() * (gameElement.offsetWidth - 100);
            tooClose = gameState.platforms.some(p => {
                const existingX = parseFloat(p.style.left);
                return Math.abs(existingX - positionX) < 150;
            });
        } while (tooClose);

        const positionY = Math.random() * 120 + 80;
        platform.style.left = `${positionX}px`;
        platform.style.bottom = `${positionY}px`;

        gameElement.appendChild(platform);
        gameState.platforms.push(platform);
    }
}


export function checkPlatformCollisions(gameState, player) {
    const game = document.querySelector('#game');
    const gameRect = game.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    let landed = false;

    for (let platform of gameState.platforms) {
        const platformRect = platform.getBoundingClientRect();

        const playerBottom = playerRect.bottom;
        const platformTop = platformRect.top;

        const verticalDistance = Math.abs(playerBottom - platformTop);
        const isHorizontallyAligned =
            playerRect.right > platformRect.left + 5 &&
            playerRect.left < platformRect.right - 5;

        // Tolérance augmentée pour éviter de "sauter" une frame
        if (
            verticalDistance <= 15 &&
            isHorizontallyAligned &&
            gameState.velocity.y <= 0
        ) {
            const newY = game.offsetHeight - (platformTop - gameRect.top) - player.offsetHeight;

            if (gameState.position.y >= newY - 5) {
                gameState.position.y = newY;
                gameState.velocity.y = 0;
                player.style.bottom = `${newY}px`;
                landed = true;
                console.log("✅ Plateforme atteinte ou maintenue");
            }
        }

        const isBelow =
            playerRect.top >= platformRect.bottom - 10 &&
            playerRect.top <= platformRect.bottom + 10 &&
            isHorizontallyAligned &&
            gameState.velocity.y > 0;

        if (isBelow) {
            platform.remove();
            gameState.platforms = gameState.platforms.filter(p => p !== platform);
            console.log("💥 Plateforme supprimée (frappée par dessous)");
        }
    }

    return landed;
}


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

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

    gameState.platforms.forEach(platform => {
        const platformRect = platform.getBoundingClientRect();

        const isAbove =
            playerRect.bottom <= platformRect.top + 5 &&
            playerRect.bottom >= platformRect.top - 10 &&
            playerRect.right > platformRect.left &&
            playerRect.left < platformRect.right &&
            gameState.velocity.y <= 0;

        const isBelow =
            playerRect.top >= platformRect.bottom - 10 &&
            playerRect.top <= platformRect.bottom + 10 &&
            playerRect.right > platformRect.left &&
            playerRect.left < platformRect.right &&
            gameState.velocity.y > 0;

        if (isAbove) {
            const platformTop = platformRect.top - gameRect.top;
            const newY = game.offsetHeight - platformTop - player.offsetHeight;

            gameState.position.y = newY;
            player.style.bottom = `${newY}px`;
            gameState.velocity.y = 0;
            landed = true;
        }

        if (isBelow) {
            platform.remove();
            gameState.platforms = gameState.platforms.filter(p => p !== platform);
        }
    });

    gameState.isOnGround = landed || gameState.position.y <= 30;
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

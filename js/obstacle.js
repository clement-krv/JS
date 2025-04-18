export function createRocket(gameWidth, gameElement, gameState, updateScoreCallback, checkCollisionCallback, updateLivesCallback, gameOverCallback) {
    const rocket = document.createElement('div');
    rocket.classList.add('rocket');
    gameElement.appendChild(rocket);

    let positionRocket = gameWidth;
    rocket.style.left = positionRocket + "px";

    const moveInterval = setInterval(() => {
        if (positionRocket < 0) {
            clearInterval(moveInterval);
            rocket.remove();
            gameState.score += 10; // +10 points pour chaque obstacle qui atteint le mur gauche
            updateScoreCallback();

            // Réduction exponentielle du délai de spawn à partir de 150 points
            if (gameState.score >= 150) {
                gameState.spawnDelay = Math.max(500, gameState.spawnDelay * 0.9);
            }
        } else {
            positionRocket -= 10;
            rocket.style.left = positionRocket + "px";

            if (checkCollisionCallback(rocket)) {
                clearInterval(moveInterval);
                rocket.remove();
                gameState.lives--;

                updateLivesCallback();

                if (gameState.lives <= 0) {
                    gameOverCallback();
                }
            }
        }
    }, 20);
}

export function checkCollision(player, rocket) {
    const playerRect = player.getBoundingClientRect();
    const rocketRect = rocket.getBoundingClientRect();

    return !(playerRect.top > rocketRect.bottom || 
             playerRect.bottom < rocketRect.top || 
             playerRect.right < rocketRect.left || 
             playerRect.left > rocketRect.right);
}
export function createRocket(gameWidth, gameElement, score, updateScoreCallback, checkCollisionCallback, gameState, updateLivesCallback, gameOverCallback) {
    const rocket = document.createElement('div');
    rocket.classList.add('rocket');
    gameElement.appendChild(rocket);

    let positionRocket = gameWidth;
    rocket.style.left = positionRocket + "px";

    const moveInterval = setInterval(() => {
        if (positionRocket < 0) {
            clearInterval(moveInterval);
            rocket.remove();
            score.value += 10;
            updateScoreCallback();

        } else {
            positionRocket -= 10;
            rocket.style.left = positionRocket + "px";

            if (checkCollisionCallback(rocket)) {
                clearInterval(moveInterval);
                rocket.remove();
                gameState.lives--;

                console.log(`Il vous reste ${gameState.lives} vies`); // Affiche la perte de vie
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
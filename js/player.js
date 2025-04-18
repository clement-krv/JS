export function handlePlayerMovement(event, gameState, limits, jumpCallback) {
    if (gameState.gameOver) return;

    const { gameWidth, playerWidth } = limits;

    if (event.key === "ArrowRight") {
        gameState.position.x += 10;
        if (gameState.position.x > gameWidth - playerWidth) {
            gameState.position.x = gameWidth - playerWidth;
        }
    }

    if (event.key === "ArrowLeft") {
        gameState.position.x -= 10;
        if (gameState.position.x < 0) {
            gameState.position.x = 0;
        }
    }

    if (event.key === " ") {
        jumpCallback();
    }
}

export function jump(gameState, playerElement) {
    if (gameState.isJumping || gameState.gameOver) return;

    gameState.isJumping = true;

    let upInterval = setInterval(() => {
        if (gameState.position.y >= 200) {
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if (gameState.position.y <= 30) {
                    clearInterval(downInterval);
                    gameState.isJumping = false;
                } else {
                    gameState.position.y -= 8;
                    playerElement.style.bottom = gameState.position.y + "px";
                }
            }, 20);
        } else {
            gameState.position.y += 8;
            playerElement.style.bottom = gameState.position.y + "px";
        }
    }, 20);
}
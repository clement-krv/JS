// Fonction pour gérer les touches (ancienne méthode, maintenant remplacée par keyState)
export function handlePlayerMovement(event, gameState, limits, jumpCallback) {
    if (gameState.gameOver) return;

    if (event.key === " ") {
        jumpCallback();
    }
}

// Fonction de saut propre : donne une impulsion verticale
export function jump(gameState, playerElement) {
    if (gameState.isJumping || gameState.gameOver || !gameState.isOnGround) return;

    gameState.velocity.y = gameState.jumpStrength;
    gameState.isJumping = true;

    // Permet d'éviter les doubles sauts
    setTimeout(() => {
        gameState.isJumping = false;
    }, 300);
}

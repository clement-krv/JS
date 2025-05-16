// Fonction de saut propre : donne une impulsion verticale
export function jump(gameState, playerElement) {
    if (gameState.isJumping || gameState.gameOver || !gameState.isOnGround) return;

    gameState.velocity.y = gameState.jumpStrength;
    gameState.isJumping = true;

    // Empêche le double saut
    setTimeout(() => {
        gameState.isJumping = false;
    }, 300);
}

// Récupération du joueur
const player = document.querySelector('#player');
const game = document.querySelector('#game'); // Conteneur du jeu

// Variables mouvement
let playerX = 0;  // Position initiale à 0
let playerY = 0;
let isJumping = false;
let gravity = 0.7; // Vitesse de descente
let velocityY = 5; // Vitesse verticale

// Dimensions du conteneur et du joueur
const gameWidth = game.offsetWidth;
const gameHeight = game.offsetHeight;
const playerWidth = player.offsetWidth;
const playerHeight = player.offsetHeight; // Hauteur du joueur pour la gestion du sol

// Fonction pour mettre à jour les limites horizontales et verticales
function updateLimits() {
    // Recalcule les dimensions à chaque cycle, si besoin
    const gameWidth = game.offsetWidth;
    const playerWidth = player.offsetWidth;
    return { gameWidth, playerWidth };
}

// Gérer les événements de touche pour le mouvement
document.addEventListener('keydown', (event) => {
    const { gameWidth, playerWidth } = updateLimits(); // Mettre à jour les limites à chaque événement

    if (event.key === 'ArrowUp' && !isJumping) {
        isJumping = true;
        velocityY = -20; // Déplacement vers le haut (saut)
    } else if (event.key === 'ArrowLeft') {
        playerX = Math.max(0, playerX - 10); // Limite à gauche, assure que playerX >= 0
    } else if (event.key === 'ArrowRight') {
        playerX = Math.min(gameWidth - playerWidth, playerX + 10); // Limite à droite, assure que playerX <= gameWidth - playerWidth
    }
});

// Boucle pour appliquer la gravité et gérer le saut
function applyGravity() {
    if (isJumping) {
        velocityY += gravity; // Appliquer la gravité
        playerY += velocityY; // Mise à jour de la position verticale

        // Si le joueur atteint le sol (au niveau de Y = 0)
        if (playerY >= 0) {
            playerY = 0;
            isJumping = false;
            velocityY = 0;
        }
    }

    // Mise à jour de la position du joueur
    player.style.transform = `translate(${playerX}px, ${playerY}px)`; // Appliquer les deux transformations

    requestAnimationFrame(applyGravity); // Appel récursif pour animer
}

// Lancer la boucle de gravité
applyGravity();

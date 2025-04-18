// Récupération des éléments du DOM
const player = document.querySelector('#player');
const game = document.querySelector('#game');
const livesContainer = document.querySelector('#lives-container');
const scoreText = document.querySelector('#score-text');
const startButton = document.querySelector('#start-button');
const startScreen = document.querySelector('#start-screen');
const gameOverScreen = document.querySelector('#game-over-screen');
const restartButton = document.querySelector('#restart-button'); // Bouton "Rejouer"

// Variables de jeu
let gameOver = false;
let lives = 3;
let positionX = 0; 
let positionY = 30; 
let isJumping = false;
let gravity = 2;
let velocityY = 0;
let score = 0; // Initialisation du score
let spawnDelay = 2000; // Temps initial entre le spawn des obstacles (en ms)

// Variables pour la gestion du score par seconde
let scoreInterval;

// Dimensions du jeu et du joueur
const gameWidth = game.offsetWidth;
const gameHeight = game.offsetHeight;
const playerWidth = player.offsetWidth;
const playerHeight = player.offsetHeight;

// Fonction pour redimensionner les limites du jeu
function updateLimits() {
    return {
        gameWidth: game.offsetWidth,
        playerWidth: player.offsetWidth
    };
}

// Mouvements du joueur
function handlePlayerMovement(event) {
    if (gameOver) return; // Si le jeu est terminé, on ne permet pas de bouger

    const { gameWidth, playerWidth } = updateLimits();

    if (event.key === "ArrowRight") {
        positionX += 10;
        if (positionX > gameWidth - playerWidth) positionX = gameWidth - playerWidth; 
    }

    if (event.key === "ArrowLeft") {
        positionX -= 10;
        if (positionX < 0) positionX = 0; 
    }

    if (event.key === " ") jump();

    player.style.left = positionX + "px"; // Applique le mouvement horizontal
}

// Ajouter l'écouteur d'événements uniquement si le jeu n'est pas terminé
function addMovementListener() {
    document.addEventListener('keydown', handlePlayerMovement);
}

// Supprimer l'écouteur d'événements lorsque le jeu est terminé
function removeMovementListener() {
    document.removeEventListener('keydown', handlePlayerMovement);
}

// Gestion du saut
function jump() {
    if (isJumping || gameOver) return; // Si le jeu est terminé ou le joueur saute, on ne permet pas de sauter

    isJumping = true;

    let upInterval = setInterval(() => {
        if (positionY >= 200) {
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if (positionY <= 30) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    positionY -= 8;
                    player.style.bottom = positionY + "px";
                }
            }, 20); 
        } else {
            positionY += 8; 
            player.style.bottom = positionY + "px";
        }
    }, 20);
}

// Créer un obstacle
function createRocket() {
    const rocket = document.createElement('div');
    rocket.classList.add('rocket');
    document.querySelector('#game').appendChild(rocket);

    let positionRocket = gameWidth;
    rocket.style.left = positionRocket + "px";

    const moveInterval = setInterval(() => {
        if (positionRocket < 0) {
            clearInterval(moveInterval);
            rocket.remove();
            score += 10; // Le joueur gagne 10 points pour avoir passé un obstacle
            updateScoreDisplay(); // Met à jour le score

            // Augmenter la vitesse de spawn des obstacles en fonction du score
            if (score >= 150) {
                spawnDelay = Math.max(500, spawnDelay * 0.9); // Réduit le délai de spawn de manière exponentielle
            }
        } else {
            positionRocket -= 10;
            rocket.style.left = positionRocket + "px";

            if (checkCollision(rocket)) {
                clearInterval(moveInterval);
                rocket.remove();
                lives--;

                updateLivesDisplay(); // Met à jour l'affichage des vies

                if (!gameOver) {
                    if (lives <= 0) {
                        showGameOver();
                        gameOver = true;
                    } else {
                        console.log("Il vous reste " + lives + " vies");
                    }
                }
            }
        }
    }, 20);
}

// Mise à jour de l'affichage des vies
function updateLivesDisplay() {
    livesContainer.innerHTML = '';
    
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        livesContainer.appendChild(heart);
    }
}

// Mise à jour de l'affichage du score
function updateScoreDisplay() {
    scoreText.textContent = "Score : " + score;
}

// Création d'obstacles à intervalle régulier
function loopObstacle() {
    if (!gameOver) {
        createRocket();
        setTimeout(loopObstacle, spawnDelay); // Utilisation du délai de spawn dynamique
    }
}

// Vérification des collisions
function checkCollision(rocket) {
    const playerRect = player.getBoundingClientRect();
    const rocketRect = rocket.getBoundingClientRect();

    return !(playerRect.top > rocketRect.bottom || 
             playerRect.bottom < rocketRect.top || 
             playerRect.right < rocketRect.left || 
             playerRect.left > rocketRect.right);
}

// Affichage du Game Over
function showGameOver() {
    const screen = document.getElementById('game-over-screen');
    screen.classList.remove('hidden');
    console.log("Game Over");

    // Supprimer les événements de mouvement pendant le Game Over
    removeMovementListener();
}

// Redémarrer le jeu
function startGame() {
    const screen = document.getElementById('game-over-screen');
    screen.classList.add('hidden');
    gameOver = false;
    lives = 3;
    score = 0;
    positionX = 0;
    positionY = 30;
    player.style.left = positionX + "px";
    player.style.bottom = positionY + "px";
    updateLivesDisplay(); // Met à jour l'affichage des vies
    updateScoreDisplay(); // Met à jour le score
    spawnDelay = 2000; // Réinitialise le délai de spawn des obstacles à 2000ms
    loopObstacle();

    // Réactive les déplacements du joueur
    addMovementListener();
    startScreen.classList.add('hidden'); // Cacher le bouton Start quand le jeu commence

    // Démarre l'auto-incrémentation du score chaque seconde
    startScoreIncrement();
}

// Bouton "Start"
startButton.addEventListener('click', () => {
    startGame();
});

// Bouton "Rejouer"
restartButton.addEventListener('click', () => {
    startGame();
});

// Initialisation
updateLivesDisplay(); // Affiche les vies au démarrage
updateScoreDisplay(); // Affiche le score au démarrage
startScreen.classList.remove('hidden'); // Affiche le bouton Start

// Ajouter le score par seconde
function startScoreIncrement() {
    if (scoreInterval) {
        clearInterval(scoreInterval); // Clear any previous interval
    }

    scoreInterval = setInterval(() => {
        if (!gameOver) {
            score += 1;  
            updateScoreDisplay();  
        }
    }, 1000);
}

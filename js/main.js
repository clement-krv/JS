import { startGame, showStats } from './game.js';
import { updateLivesDisplay, updateScoreDisplay } from './hud.js';
import { handlePlayerMovement, jump } from './player.js';
import { createRocket, checkCollision } from './obstacle.js';
import { setupCharacterSelection } from './selection.js';

document.addEventListener('DOMContentLoaded', () => {
    const player = document.querySelector('#player');
    const game = document.querySelector('#game');
    const livesContainer = document.querySelector('#lives-container');
    const scoreText = document.querySelector('#score-text');
    const gameOverScreen = document.querySelector('#game-over-screen');
    const restartButton = document.querySelector('#restart-button');
    const characterSelectionScreen = document.querySelector('#character-selection-screen');

    // État initial du jeu
    const gameState = {
        gameOver: false,
        lives: 3,
        position: { x: 0, y: 30 },
        velocity: { x: 0, y: 0 },
        isJumping: false,
        isOnGround: false,
        score: 0,
        spawnDelay: 2000,
        selectedCharacter: 'playerDK',
        platforms: [],
        gravity: 0.5,
        jumpStrength: 15,
        keys: {
            left: false,
            right: false
        }
    };

    const updateLives = () => updateLivesDisplay(gameState.lives, livesContainer);
    const updateScore = () => updateScoreDisplay(gameState.score, scoreText);

    const loopObstacle = () => {
        if (!gameState.gameOver) {
            createRocket(
                game.offsetWidth,
                game,
                gameState,
                updateScore,
                (rocket) => checkCollision(player, rocket),
                updateLives,
                showGameOver
            );
            setTimeout(loopObstacle, gameState.spawnDelay);
        }
    };

    // 🎯 Boucle de mouvement fluide
    function startMovementLoop() {
        function loop() {
            if (gameState.gameOver) return;

            // Accélération horizontale
            if (gameState.keys.right) {
                gameState.velocity.x = Math.min(gameState.velocity.x + 0.2, 3);
            } else if (gameState.keys.left) {
                gameState.velocity.x = Math.max(gameState.velocity.x - 0.2, -3);
            } else {
                gameState.velocity.x *= 0.8;
                if (Math.abs(gameState.velocity.x) < 0.05) gameState.velocity.x = 0;
            }

            // Gravité
            if (!gameState.isOnGround) {
                gameState.velocity.y -= gameState.gravity;
            
                if (gameState.velocity.y < -2.5) {
                    gameState.velocity.y = -2.5;
                }
            }


            // Mise à jour des positions
            gameState.position.x += gameState.velocity.x;
            gameState.position.y += gameState.velocity.y;

            // Clamp horizontal
            const maxX = game.offsetWidth - player.offsetWidth;
            gameState.position.x = Math.max(0, Math.min(maxX, gameState.position.x));

            // Sol
            if (gameState.position.y <= 30) {
                gameState.position.y = 30;
                gameState.velocity.y = 0;
                gameState.isOnGround = true;
            } else {
                gameState.isOnGround = false;
            }

            // Application CSS
            player.style.left = gameState.position.x + 'px';
            player.style.bottom = gameState.position.y + 'px';

            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    }

    // 🎮 Gestion des touches maintenues
    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowRight") gameState.keys.right = true;
        if (e.key === "ArrowLeft") gameState.keys.left = true;
        if (e.key === " " && !gameState.isJumping && gameState.position.y <= 31) {
            jump(gameState, player);
        }
    });


    document.addEventListener('keyup', (e) => {
        if (e.key === "ArrowRight") gameState.keys.right = false;
        if (e.key === "ArrowLeft") gameState.keys.left = false;
    });

    // Score auto +1 par seconde
    let scoreInterval;
    const startScoreIncrement = () => {
        if (scoreInterval) clearInterval(scoreInterval);
        scoreInterval = setInterval(() => {
            if (!gameState.gameOver) {
                gameState.score += 1;
                updateScore();
            }
        }, 1000);
    };

    const showGameOver = () => {
        gameOverScreen.classList.remove('hidden');
        gameState.gameOver = true;
        showStats(gameState);
    };

    setupCharacterSelection(characterSelectionScreen, game, gameState, player, () => {
        startScoreIncrement();
        startMovementLoop(); // Lancer la physique
        startGame(gameState, { gameOverScreen, player }, {
            updateLives, updateScore, loopObstacle
        });
    });

    restartButton.addEventListener('click', () => {
        document.querySelectorAll('.platform').forEach(p => p.remove());
        startScoreIncrement();
        startMovementLoop(); // Redémarrer la physique
        startGame(gameState, { gameOverScreen, player }, {
            updateLives, updateScore, loopObstacle
        });
    });

    updateLives();
    updateScore();
});

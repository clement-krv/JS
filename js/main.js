import { startGame, showStats, checkPlatformCollisions } from './game.js';
import { updateLivesDisplay, updateScoreDisplay } from './hud.js';
import { jump } from './player.js';
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

    function startMovementLoop() {
        function loop() {
            if (gameState.gameOver) return;

            // Mouvement horizontal
            if (gameState.keys.right) {
                gameState.velocity.x = Math.min(gameState.velocity.x + 0.2, 3);
            } else if (gameState.keys.left) {
                gameState.velocity.x = Math.max(gameState.velocity.x - 0.2, -3);
            } else {
                gameState.velocity.x *= 0.8;
                if (Math.abs(gameState.velocity.x) < 0.05) gameState.velocity.x = 0;
            }

            // Appliquer vitesse horizontale
            gameState.position.x += gameState.velocity.x;

            // Appliquer gravité toujours (même si on est au sol), mais annuler si on est "sur quelque chose"
            gameState.velocity.y -= gameState.gravity;
            if (gameState.velocity.y < -2.5) {
                gameState.velocity.y = -2.5;
            }

            gameState.position.y += gameState.velocity.y;

            // Limite horizontale
            const maxX = game.offsetWidth - player.offsetWidth;
            gameState.position.x = Math.max(0, Math.min(maxX, gameState.position.x));

            // Collision plateforme
            const landed = checkPlatformCollisions(gameState, player);

            // Si on touche le sol
            if (gameState.position.y <= 30) {
                gameState.position.y = 30;
                gameState.velocity.y = 0;
                gameState.isOnGround = true;
                console.log("🟦 Sol atteint");
            } else if (landed) {
                // Si on touche une plateforme
                gameState.velocity.y = 0;
                gameState.isOnGround = true;
            } else {
                // En l'air
                gameState.isOnGround = false;
            }

            // Appliquer le style
            player.style.left = `${gameState.position.x}px`;
            player.style.bottom = `${gameState.position.y}px`;

            // Debug
            console.log(`Y=${gameState.position.y.toFixed(2)} | vy=${gameState.velocity.y.toFixed(2)} | onGround=${gameState.isOnGround}`);

            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    }



    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowRight") gameState.keys.right = true;
        if (e.key === "ArrowLeft") gameState.keys.left = true;
        if (e.key === " " && !gameState.isJumping && gameState.isOnGround) {
            jump(gameState, player);
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === "ArrowRight") gameState.keys.right = false;
        if (e.key === "ArrowLeft") gameState.keys.left = false;
    });

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
        startMovementLoop();
        startGame(gameState, { gameOverScreen, player }, {
            updateLives, updateScore, loopObstacle
        });
    });

    restartButton.addEventListener('click', () => {
        document.querySelectorAll('.platform').forEach(p => p.remove());
        startScoreIncrement();
        startMovementLoop();
        startGame(gameState, { gameOverScreen, player }, {
            updateLives, updateScore, loopObstacle
        });
    });

    updateLives();
    updateScore();
});

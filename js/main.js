import { startGame } from './game.js';
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

    const gameState = {
        gameOver: false,
        lives: 3,
        position: { x: 0, y: 30 },
        isJumping: false,
        score: 0,
        spawnDelay: 2000,
        selectedCharacter: 'playerDK', // Par défaut
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

    const addMovementListener = () => {
        document.addEventListener('keydown', (event) => {
            const limits = {
                gameWidth: game.offsetWidth,
                playerWidth: player.offsetWidth,
            };
            handlePlayerMovement(event, gameState, limits, () => jump(gameState, player));
            player.style.left = gameState.position.x + 'px';
        });
    };

    const showGameOver = () => {
        gameOverScreen.classList.remove('hidden');
        gameState.gameOver = true;
    };

    let scoreInterval; // Variable pour gérer l'incrémentation du score
    
    const startScoreIncrement = () => {
        if (scoreInterval) {
            clearInterval(scoreInterval); // Réinitialise tout intervalle précédent
        }
    
        scoreInterval = setInterval(() => {
            if (!gameState.gameOver) {
                gameState.score += 1; // Incrémente le score
                updateScore();
            }
        }, 1000);
    };
    
    // Configuration de la sélection de personnage
    setupCharacterSelection(characterSelectionScreen, game, gameState, player, () => {
        startScoreIncrement(); // Démarre l'incrémentation du score
        startGame(gameState, { gameOverScreen, player }, { updateLives, updateScore, loopObstacle, addMovementListener });
    });
    
    restartButton.addEventListener('click', () => {
        startScoreIncrement(); // Redémarre l'incrémentation du score
        startGame(gameState, { gameOverScreen, player }, { updateLives, updateScore, loopObstacle, addMovementListener });
    });

    updateLives();
    updateScore();
});
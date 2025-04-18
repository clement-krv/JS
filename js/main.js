import { startGame } from './game.js';
import { updateLivesDisplay, updateScoreDisplay } from './hud.js';
import { handlePlayerMovement, jump } from './player.js';
import { createRocket, checkCollision } from './obstacle.js';

document.addEventListener('DOMContentLoaded', () => {
    const player = document.querySelector('#player');
    const game = document.querySelector('#game');
    const livesContainer = document.querySelector('#lives-container');
    const scoreText = document.querySelector('#score-text');
    const startButton = document.querySelector('#start-button');
    const startScreen = document.querySelector('#start-screen');
    const gameOverScreen = document.querySelector('#game-over-screen');
    const restartButton = document.querySelector('#restart-button');

    const gameState = {
        gameOver: false,
        lives: 3,
        position: { x: 0, y: 30 },
        isJumping: false,
        score: 0,
        spawnDelay: 2000,
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

    startButton.addEventListener('click', () => {
        startGame(gameState, { gameOverScreen, player, startScreen }, { updateLives, updateScore, loopObstacle, addMovementListener });
    });

    restartButton.addEventListener('click', () => {
        startGame(gameState, { gameOverScreen, player, startScreen }, { updateLives, updateScore, loopObstacle, addMovementListener });
    });

    updateLives();
    updateScore();
});
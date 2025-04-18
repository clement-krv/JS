export function updateLivesDisplay(lives, livesContainer) {
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        livesContainer.appendChild(heart);
    }
}

export function updateScoreDisplay(score, scoreText) {
    scoreText.textContent = "Score : " + score;
}
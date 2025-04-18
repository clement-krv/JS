export function setupCharacterSelection(selectionScreen, gameScreen, gameState, playerElement, startGameCallback) {
    const characterOptions = selectionScreen.querySelectorAll('.character');
    const startGameButton = selectionScreen.querySelector('#start-game-button');

    let selectedCharacter = null;

    characterOptions.forEach(option => {
        option.addEventListener('click', () => {
            characterOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedCharacter = option.dataset.character;
            startGameButton.classList.remove('hidden');
        });
    });

    startGameButton.addEventListener('click', () => {
        if (selectedCharacter) {
            gameState.selectedCharacter = selectedCharacter;
            playerElement.style.backgroundImage = `url("assets/${selectedCharacter}.webp")`;
            selectionScreen.classList.add('hidden'); 
            gameScreen.classList.remove('hidden'); 
            startGameCallback();
        }
    });
}
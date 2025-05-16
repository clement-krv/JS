export function setupCharacterSelection(selectionScreen, gameScreen, gameState, playerElement, startGameCallback) {
    const characterOptions = selectionScreen.querySelectorAll('.character');
    const startGameButton = selectionScreen.querySelector('#start-game-button');

    const customUploadOption = document.getElementById('custom-upload-option');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('custom-file-input');

    let selectedCharacter = null;

    characterOptions.forEach(option => {
        option.addEventListener('click', () => {
            characterOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            const character = option.dataset.character;

            if (character) {
                selectedCharacter = character;
                playerElement.style.backgroundImage = `url("assets/${character}.webp")`;
            } else if (option.classList.contains('custom-upload') && gameState.customAvatar) {
                selectedCharacter = 'custom';
                playerElement.style.backgroundImage = `url("${gameState.customAvatar}")`;
            }

            startGameButton.classList.remove('hidden');
        });
    });

    // Gestion du drop d'image
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'limegreen';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#aaa';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#aaa';
        const file = e.dataTransfer.files[0];
        handleCustomImage(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleCustomImage(file);
    });

    function handleCustomImage(file) {
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            dropZone.style.backgroundImage = `url(${imageUrl})`;
            dropZone.textContent = '';
            gameState.customAvatar = imageUrl;
        };
        reader.readAsDataURL(file);
    }

    startGameButton.addEventListener('click', () => {
        gameState.selectedCharacter = selectedCharacter;
        selectionScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startGameCallback();
    });
}

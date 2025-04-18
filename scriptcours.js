const player = document.querySelector('#player');


// Variables de jeu

let gameOver = false
let lives = 3

let positionX = 0; 
let positionY = 30; 
let isJumping = false;
// Gestion des mouvements

document.addEventListener('keydown', (event) => {
    const gameWidth = document.querySelector('#game').offsetWidth - 80; // Largeur du conteneur moins la largeur du joueur

    if (event.key == "ArrowRight") {
        positionX += 10;
        if (positionX > gameWidth) positionX = 0; // Réapparaît à gauche si dépasse à droite
    }

    if (event.key == "ArrowLeft") {
        positionX -= 10;
        if (positionX < 0) positionX = gameWidth; // Réapparaît à droite si dépasse à gauche
    }

    player.style.left = positionX + "px";

    if (event.key == " ") jump();
});

function jump() {
    if (isJumping) return;
    isJumping = true

    let upInterval = setInterval(() => {
        if (positionY >= 200) { 
            clearInterval(upInterval)

            let downInterval = setInterval(() => {
                if (positionY <= 30) { 
                    clearInterval(downInterval)
                    isJumping = false
                } else {
                    positionY -= 8;
                    player.style.bottom = positionY + "px"
                }
            }); 
        } else {
            positionY += 8 
            player.style.bottom = positionY + "px"
        }
    }, 20)
}

// Gestrion des obstacles


function createRocket() {
    const rocket = document.createElement('div')
    rocket.classList.add('rocket')
    document.querySelector('#game').appendChild(rocket)
    
    let positionRocket = 600
    rocket.style.left = positionRocket + "px"

    const moveInterval = setInterval(() => {
        if (positionRocket < 0) {
            clearInterval(moveInterval)
            rocket.remove()
        }else {
            positionRocket -= 10
            rocket.style.left = positionRocket + "px"

            if (checkCollision()) {
                clearInterval(moveInterval)
                rocket.remove()
                lives--
                
                if (!gameOver){
                    if (lives <= 0){
                        showGameOver()
                        gameOver = true
                    } 
                    else {
                        console.log("Il vous reste " + lives + " vies")
                        createRocket()
                    }
                }
            }
        }
    }, 20)
}
createRocket()

function loopObstacle() {
    if (!gameOver) {
        createRocket()
        setTimeout(loopObstacle, 2000) 
    }
}
loopObstacle()

function checkCollision() {
    const playerRect = player.getBoundingClientRect()
    const rocketRect = document.querySelector('.rocket').getBoundingClientRect()

    return !(
        playerRect.top > rocketRect.bottom ||
        playerRect.bottom < rocketRect.top ||
        playerRect.right < rocketRect.left ||
        playerRect.left > rocketRect.right 
    )
}

function showGameOver() {
    const screen = document.getElementById('game-over-screen')
    const text = document.getElementById('game-over-text')

    screen.classList.remove('hidden')
    console.log("Game Over")
}

function startGame() {
    const screen = document.getElementById('game-over-screen')
    screen.classList.add('hidden')
    gameOver = false
    lives = 3
    positionX = 0
    positionY = 30
    player.style.left = positionX + "px"
    player.style.bottom = positionY + "px"
    loopObstacle()
}

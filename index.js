let playBoard = document.querySelector(".play-board");
let scoreElement = document.querySelector(".score");
let highScoreElement = document.querySelector(".high-score");
let controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 10, snakeY = 13;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
// getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`

function changeFoodPos() {
    // passing a random 0-30 as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

function handleGameOver() {
    // clearing the timer and reloading the page on game over 
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...")
    location.reload();
}

function changeDirection(e) {
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0
    } else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }    
}

controls.forEach(key => {
    key.addEventListener("click", () => {
        // calling changeDirection on each key click and passing key dataset value as an object
        changeDirection({key: key.dataset.key})
    })
})

function initGame() {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // checking if snake hit the food
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPos();
        snakeBody.push([foodX, foodY])  // pushing food position to snake body array
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`
    }

    for(let i = snakeBody.length - 1; i > 0; i--){
        // shifting forward the values of elements in the sanke-body by one
        snakeBody[i] = snakeBody[i-1];
    }

    snakeBody[0] = [snakeX, snakeY]; // setting first element of snake-body to current snake position

    snakeX += velocityX;
    snakeY += velocityY;
    
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }
    
    for(let i = 0; i < snakeBody.length; i++){
        // adding a div for each part of snake body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;        
        // checking if the snake head hit the body, if so set the game-over to true
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    // htmlMarkup += `<div class="head" style="grid-area: ${snakeY} / ${snakeX}"></div>`;
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPos();
setIntervalId = setInterval(initGame, 100);

document.addEventListener("keydown", changeDirection);



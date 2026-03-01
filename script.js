const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

canvas.width = 400;
canvas.height = 400;

const gridSize = 20;
let score = 0;
let dx = 0;
let dy = 0;
let foodX;
let foodY;
let changingDirection = false; 
let snakeMoving = false; 
let gameInterval; 

let snake = [];

function resetGame() {
    score = 0;
    dx = 0; 
    dy = 0;
    snakeMoving = false;
    changingDirection = false;
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];
    generateFood();
}

resetGame();
clearCanvas();
drawSnake();

document.addEventListener("keydown", changeDirection);

startButton.addEventListener("click", function() {
    startButton.style.display = "none"; 
    startButton.blur(); 
    resetGame(); 
    startGameLoop(); 
});

function startGameLoop() {
    if (gameInterval) clearInterval(gameInterval);

    gameInterval = setInterval(function() {
        if (hasGameEnded()) {
            clearInterval(gameInterval); 
            displayGameOver();
            return; 
        }

        changingDirection = false; 
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        drawScore(); 
    }, 100); 
}

function displayGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "40px Courier New";
    ctx.fillText("GAME OVER", canvas.width / 4 - 10, canvas.height / 2 - 10);
    
    ctx.font = "20px Courier New";
    ctx.fillText("Final Score: " + score, canvas.width / 4 + 10, canvas.height / 2 + 30);
    
    startButton.style.display = "block";
    startButton.innerText = "PLAY AGAIN";
}

function clearCanvas() {
    ctx.fillStyle = "#9bbc0f"; 
    ctx.strokeStyle = "#306230"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = "#0f380f"; 
    ctx.strokeStyle = "#9bbc0f"; 
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function moveSnake() {
    if (!snakeMoving) return; 

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    
    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    
    if (hasEatenFood) {
        score += 10; 
        generateFood();
    } else {
        snake.pop();
    }
}

function drawScore() {
    ctx.fillStyle = "white"; 
    ctx.font = "20px Courier New"; 
    ctx.fillText("Score: " + score, 10, 30); 
}

function changeDirection(event) {
    if (changingDirection) return;

    const key = event.key;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if ((key === "ArrowLeft" || key === "a") && !goingRight && snakeMoving) {
        dx = -gridSize; dy = 0; changingDirection = true;
    }
    if ((key === "ArrowUp" || key === "w") && !goingDown) {
        dx = 0; dy = -gridSize; changingDirection = true; snakeMoving = true;
    }
    if ((key === "ArrowRight" || key === "d") && !goingLeft) {
        dx = gridSize; dy = 0; changingDirection = true; snakeMoving = true;
    }
    if ((key === "ArrowDown" || key === "s") && !goingUp) {
        dx = 0; dy = gridSize; changingDirection = true; snakeMoving = true;
    }
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / gridSize) * gridSize;
}

function generateFood() {
    foodX = randomTen(0, canvas.width - gridSize);
    foodY = randomTen(0, canvas.height - gridSize);
    
    snake.forEach(function has_snake_eaten_food(part) {
        if (part.x === foodX && part.y === foodY) {
            generateFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = "red"; 
    ctx.strokeStyle = "darkred";
    ctx.fillRect(foodX, foodY, gridSize, gridSize);
    ctx.strokeRect(foodX, foodY, gridSize, gridSize);
}

function hasGameEnded() {
    if (!snakeMoving) return false;

    for (let i = 4; i < snake.length; i++) {
        const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (hasCollided) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

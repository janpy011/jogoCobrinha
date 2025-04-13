const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";
let food = {};
let score = 0;
let speed = 100;
let game;
let isPaused = false;

document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
    if (event.key === " ") {
        togglePause();
    } else {
        changeDirection(event);
    }
}

function changeDirection(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// Para botões mobile
function setDirection(dir) {
    if (
        (dir === "LEFT" && direction !== "RIGHT") ||
        (dir === "RIGHT" && direction !== "LEFT") ||
        (dir === "UP" && direction !== "DOWN") ||
        (dir === "DOWN" && direction !== "UP")
    ) {
        direction = dir;
    }
}

function togglePause() {
    isPaused = !isPaused;
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function draw() {
    if (isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#00ffcc" : "#00bfa5";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").innerText = "Pontuação: " + score;
        food = generateFood();
        increaseSpeed();
    } else {
        snake.pop();
    }

    const newHead = { x: headX, y: headY };

    if (
        headX < 0 || headX >= canvas.width ||
        headY < 0 || headY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        alert("☠️ Fim de jogo! Pontuação: " + score);
    }

    snake.unshift(newHead);
}

function collision(head, body) {
    return body.some(segment => segment.x === head.x && segment.y === head.y);
}

function increaseSpeed() {
    if (speed > 50) {
        speed -= 5;
        clearInterval(game);
        game = setInterval(draw, speed);
    }
}

function restartGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    speed = 100;
    isPaused = false;
    document.getElementById("score").innerText = "Pontuação: 0";
    food = generateFood();
    clearInterval(game);
    game = setInterval(draw, speed);
}

food = generateFood();
game = setInterval(draw, speed);

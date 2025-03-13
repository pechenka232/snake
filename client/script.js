const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("finalScore");
const highScoreText = document.getElementById("highScore");

const GRID_SIZE = 20;
const COLUMNS = 32;
const ROWS = 23;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = "RIGHT";
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

highScoreText.textContent = highScore;

canvas.width = COLUMNS * GRID_SIZE;
canvas.height = ROWS * GRID_SIZE;

function drawSnake() {
    ctx.fillStyle = "lime";
    snake.forEach(part => {
        ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
}

function moveSnake() {
    let head = { ...snake[0] };

    if (direction === "UP") head.y--;
    if (direction === "DOWN") head.y++;
    if (direction === "LEFT") head.x--;
    if (direction === "RIGHT") head.x++;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food.x = Math.floor(Math.random() * COLUMNS);
        food.y = Math.floor(Math.random() * ROWS);
        score++;
        scoreDisplay.textContent = score;
    } else {
        snake.pop();
    }

    if (
        head.x < 0 || head.y < 0 ||
        head.x >= COLUMNS || head.y >= ROWS ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    ) {
        resetGame();
    }
}

async function checkScoreWithSP1(score) {
    if (!window.verify_score) {
        console.warn("⚠️ WASM не загружен! Подождите...");
        setTimeout(() => checkScoreWithSP1(score), 1000);
        return;
    }

    try {
        let isValid = window.verify_score(score);
        if (isValid) {
            console.log("✅ Очки подтверждены ZK-доказательством!");
            saveScore(score);
        } else {
            console.log("❌ Ошибка проверки очков.");
        }
    } catch (error) {
        console.error("Ошибка при проверке очков через SP1:", error);
    }
}

function resetGame() {
    checkScoreWithSP1(score);

    highScore = Math.max(highScore, score);
    localStorage.setItem("highScore", highScore);
    highScoreText.textContent = highScore;
    finalScoreDisplay.textContent = `Score: ${score}\nYour High Score: ${highScore}`;

    gameOverScreen.style.display = "block";
    startScreen.style.display = "none";
    canvas.style.display = "none";

    setTimeout(() => {
        snake = [{ x: 10, y: 10 }];
        food = { x: 5, y: 5 };
        direction = "RIGHT";
        score = 0;
        scoreDisplay.textContent = score;
        gameRunning = false;
    }, 1000);
}

function updateGame() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        moveSnake();
    }
    setTimeout(updateGame, 100);
}

document.addEventListener("keydown", (event) => {
    if (!gameRunning) {
        gameRunning = true;
        gameOverScreen.style.display = "none";
        startScreen.style.display = "none";
        canvas.style.display = "block";
    }

    if ((event.key === "ArrowUp" || event.key === "w" || event.key === "ц") && direction !== "DOWN") direction = "UP";
    if ((event.key === "ArrowDown" || event.key === "s" || event.key === "ы") && direction !== "UP") direction = "DOWN";
    if ((event.key === "ArrowLeft" || event.key === "a" || event.key === "ф") && direction !== "RIGHT") direction = "LEFT";
    if ((event.key === "ArrowRight" || event.key === "d" || event.key === "в") && direction !== "LEFT") direction = "RIGHT";
});

updateGame();

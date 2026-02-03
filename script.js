const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 225,
  y: 440,
  w: 50,
  h: 50,
  speed: 6
};

let items = [];
let score = 0;
let gameOver = false;
let gameStarted = false;
let keys = {};

const scoreText = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

function spawnItem() {
  const type = Math.random() < 0.5 ? "healthy" : "harmful";
  items.push({
    x: Math.random() * 470,
    y: 0,
    size: 30,
    type: type
  });
}

function drawPlayer() {
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#64ffda";
  ctx.fillStyle = "#64ffda";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.shadowBlur = 0;
}

function drawItems() {
  items.forEach(i => {
    ctx.shadowBlur = 10;
    ctx.shadowColor = i.type === "healthy" ? "#00b8ff" : "#ff4d4d";
    ctx.fillStyle = i.type === "healthy" ? "#00b8ff" : "#ff4d4d";
    ctx.beginPath();
    ctx.arc(i.x, i.y, i.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

function collision(a, b) {
  return a.x < b.x + b.size &&
    a.x + a.w > b.x &&
    a.y < b.y + b.size &&
    a.y + a.h > b.y;
}

function update() {
  if (!gameStarted || gameOver) return;

  if (Math.random() < 0.015) spawnItem();

  items.forEach(i => i.y += 4);

  items = items.filter(i => i.y < 520);

  // Handle smooth movement
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.w) player.x += player.speed;

  items.forEach(i => {
    if (collision(player, i)) {
      if (i.type === "healthy") score++;
      else score--;
      i.y = 600;
    }
  });

  if (score < 0) {
    gameOver = true;
  }

  scoreText.innerText = "Score: " + score;
}

function draw() {
  ctx.clearRect(0, 0, 500, 500);

  if (!gameStarted) {
    ctx.fillStyle = "#64ffda";
    ctx.font = "bold 32px Outfit";
    ctx.textAlign = "center";
    ctx.fillText("ECO HERO", 250, 200);
    ctx.font = "18px Outfit";
    ctx.fillStyle = "#8892b0";
    ctx.fillText("Move mouse or use arrows to play", 250, 250);
    ctx.fillStyle = "#00b8ff";
    ctx.font = "bold 22px Outfit";
    ctx.fillText("CLICK TO START", 250, 320);
    ctx.textAlign = "start";
    return;
  }

  drawPlayer();
  drawItems();

  if (gameOver) {
    ctx.fillStyle = "#ff4d4d";
    ctx.font = "bold 40px Outfit";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", 250, 240);
    ctx.font = "20px Outfit";
    ctx.fillStyle = "#e6f1ff";
    ctx.fillText("Final Score: " + score, 250, 280);
    ctx.textAlign = "start"; // Reset for other text
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Mouse and Touch control for "flexible" movement
const handleMove = (e) => {
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const mouseX = clientX - rect.left;
  // Center the player on the cursor/finger
  player.x = Math.max(0, Math.min(canvas.width - player.w, mouseX - player.w / 2));
};

canvas.addEventListener("mousemove", handleMove);
canvas.addEventListener("touchmove", (e) => {
  handleMove(e);
  e.preventDefault(); // Prevent scrolling while playing
}, { passive: false });

canvas.addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
  }
});

restartBtn.onclick = () => {
  score = 0;
  items = [];
  gameOver = false;
  gameStarted = true; // Stay started on restart
  player.x = 225;
};

loop();

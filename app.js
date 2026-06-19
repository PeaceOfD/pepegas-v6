const landing = document.getElementById("landing");
const dashboard = document.getElementById("dashboard");
const login = document.getElementById("login");

document.getElementById("start").onclick = () => {
  const landing = document.getElementById("landing");
  const dashboard = document.getElementById("dashboard");

  // cinematic shrink
  landing.style.transform = "scale(1.1)";
  landing.style.opacity = "0";
  landing.style.filter = "blur(10px)";

  setTimeout(() => {
    landing.style.display = "none";
    dashboard.style.display = "block";

    dashboard.style.opacity = "0";
    dashboard.style.transform = "scale(1.05)";

    setTimeout(() => {
      dashboard.style.transition = "1s ease";
      dashboard.style.opacity = "1";
      dashboard.style.transform = "scale(1)";
    }, 50);

  }, 700);
};

document.getElementById("loginBtn").onclick = () => {
  const login = document.getElementById("login");
  login.style.display = "flex";
};

document.getElementById("login").onclick = (e) => {
  if (e.target.id === "login") {
    e.target.style.opacity = "0";
    setTimeout(() => {
      e.target.style.display = "none";
      e.target.style.opacity = "1";
    }, 200);
  }
};
const canvas = document.getElementById("neon");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==========================
// 🌌 CRACK LINES LAYER
// ==========================
let cracks = [];

for (let i = 0; i < 40; i++) {
  cracks.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    len: Math.random() * 220 + 60,
    angle: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.01,
    color: Math.random() > 0.5 ? "#00ffcc" : "#0066ff"
  });
}

// ==========================
// 🌫 FLOATING FOG PARTICLES
// ==========================
let fog = [];

for (let i = 0; i < 80; i++) {
  fog.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3
  });
}

// ==========================
// 📡 SCANLINE EFFECT
// ==========================
let scanOffset = 0;

// ==========================
// 💀 DRAW CRACK
// ==========================
function drawCrack(c, pulse) {
  let x2 = c.x + Math.cos(c.angle) * c.len;
  let y2 = c.y + Math.sin(c.angle) * c.len;

  ctx.beginPath();
  ctx.moveTo(c.x, c.y);
  ctx.lineTo(x2, y2);

  ctx.strokeStyle = c.color;
  ctx.shadowBlur = 25 + pulse * 10;
  ctx.shadowColor = c.color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // inner core
  ctx.beginPath();
  ctx.moveTo(c.x, c.y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "#ffffff";
  ctx.shadowBlur = 0;
  ctx.lineWidth = 0.4;
  ctx.stroke();
}

// ==========================
// 🌫 DRAW FOG
// ==========================
function drawFog() {
  for (let f of fog) {
    f.x += f.vx;
    f.y += f.vy;

    if (f.x < 0) f.x = canvas.width;
    if (f.x > canvas.width) f.x = 0;
    if (f.y < 0) f.y = canvas.height;
    if (f.y > canvas.height) f.y = 0;

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,204,0.03)";
    ctx.fill();
  }
}

// ==========================
// 📡 SCANLINES
// ==========================
function drawScanlines() {
  scanOffset += 1.2;

  for (let y = -scanOffset; y < canvas.height; y += 4) {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, y, canvas.width, 1);
  }

  if (scanOffset > 4) scanOffset = 0;
}

// ==========================
// 🔥 MAIN LOOP
// ==========================
function animate() {
  // dark fade (gives trail)
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let t = Date.now() * 0.001;
  let pulse = Math.sin(t) * 2;

  // fog layer
  drawFog();

  // cracks layer
  for (let c of cracks) {
    c.angle += Math.sin(t * c.speed) * 0.003;
    drawCrack(c, pulse);
  }

  // scanlines overlay
  drawScanlines();

  requestAnimationFrame(animate);
}

animate();
async function loadServerStatus() {
  try {
    const res = await fetch("https://mc-status-api.your-worker.workers.dev");
    const data = await res.json();

    const statusEl = document.getElementById("status");
    const playersEl = document.getElementById("players");

    // STATUS
    if (data.online) {
      statusEl.innerText = "🟢 Online";
      statusEl.classList.add("online", "pulse");
      statusEl.classList.remove("offline");
    } else {
      statusEl.innerText = "🔴 Offline";
      statusEl.classList.add("offline");
      statusEl.classList.remove("online", "pulse");
    }

    // PLAYERS
    playersEl.innerText = `${data.players} / ${data.max}`;

    // glow based on activity
    if (data.players > 0) {
      playersEl.style.color = "#00ffcc";
      playersEl.style.textShadow = "0 0 20px #00ffcc";
    } else {
      playersEl.style.color = "#666";
      playersEl.style.textShadow = "none";
    }

  } catch (e) {
    document.getElementById("status").innerText = "🔴 Error";
    document.getElementById("players").innerText = "--";
  }
}

loadServerStatus();
setInterval(loadServerStatus, 8000);

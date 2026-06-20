// ==========================
// UI CONTROL
// ==========================

document.getElementById("start").onclick = () => {
  const landing = document.getElementById("landing");
  const dashboard = document.getElementById("dashboard");

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
  document.getElementById("login").style.display = "flex";
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

// ==========================
// SERVER STATUS
// ==========================

async function loadServerStatus() {
  const statusEl = document.getElementById("status");
  const playersEl = document.getElementById("players");
  const pingEl = document.getElementById("ping");
  const playerListEl = document.getElementById("playerList");

  try {
    const startTime = performance.now();

const res = await fetch(
  "https://api.mcsrvstat.us/3/157.90.205.61:29317"
);

const data = await res.json();
    const endTime = performance.now();

    const online = data?.online === true;

    // reset classes
    statusEl.classList.remove("online", "offline");

    if (online) {
      statusEl.innerText = "🟢 Online";
      statusEl.classList.add("online");

      playersEl.innerText =
        `${data.players?.online ?? 0} / ${data.players?.max ?? 0}`;

      // ==========================
      // 🔥 FIXED PING SYSTEM
      // ==========================

      const apiPing = endTime - startTime;
      const mcPing = data?.ping || 0;

      const finalPing = Math.round((apiPing * 0.7) + (mcPing * 0.3));

      pingEl.innerText = finalPing + " ms";

      if (finalPing < 60) {
        pingEl.style.color = "#00ffcc";
      } else if (finalPing < 120) {
        pingEl.style.color = "orange";
      } else {
        pingEl.style.color = "red";
      }

      // PLAYER LIST
      if (
        data.players &&
        data.players.list &&
        data.players.list.length > 0
      ) {
        playerListEl.innerHTML = data.players.list
          .map(player => `
            <div class="player">
              ${player.name}
            </div>
          `)
          .join("");
      } else {
        playerListEl.innerHTML = "<div class='player'>No players</div>";
      }

    } else {
      statusEl.innerText = "🔴 Offline";
      statusEl.classList.add("offline");

      playersEl.innerText = "-- / --";
      pingEl.innerText = "--";
      pingEl.style.color = "#fff";

      playerListEl.innerHTML = "--";
    }

  } catch (err) {
    statusEl.innerText = "🔴 Offline";
    statusEl.classList.add("offline");

    playersEl.innerText = "-- / --";
    pingEl.innerText = "--";
    playerListEl.innerHTML = "--";
  }
}

loadServerStatus();
setInterval(loadServerStatus, 8000);

// ==========================
// NEON CANVAS BACKGROUND
// ==========================

const canvas = document.getElementById("neon");

if (canvas) {
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let cracks = [];
  let fog = [];

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

  for (let i = 0; i < 80; i++) {
    fog.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    });
  }

  function drawCrack(c, pulse) {
    let x2 = c.x + Math.cos(c.angle) * c.len;
    let y2 = c.y + Math.sin(c.angle) * c.len;

    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = c.color;
    ctx.shadowBlur = 20 + pulse * 10;
    ctx.shadowColor = c.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

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

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let t = Date.now() * 0.001;
    let pulse = Math.sin(t);

    drawFog();

    for (let c of cracks) {
      c.angle += Math.sin(t * c.speed) * 0.003;
      drawCrack(c, pulse);
    }

    requestAnimationFrame(animate);
  }

  animate();
}

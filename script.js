/* ============================================================
   BIRTHDAY WEBSITE — script.js
   ============================================================ */
'use strict';

/* ══════════════════
   GALLERY DATA
══════════════════ */
const GALLERY = [
  { img:'vardhini.jpg', label:'Beautiful Memories', tall:true  },
  { img:'gal1.jpg',     label:'Sweet Smiles',       tall:false },
  { img:'gal2.jpg',     label:'Shining Bright',     tall:true  },
  { img:'gal3.jpg',     label:'Pure Joy',           tall:false },
  { img:'gal4.jpg',     label:'Golden Moments',     tall:true  },
  { img:'gal5.jpg',     label:'Blooming Always',    tall:true  },
  { img:'gal6.jpg',     label:'Forever Young',      tall:false },
  { img:'gal7.jpg',     label:'Birthday Queen',     tall:true  },
  { img:'gal8.jpg',     label:'Special Day',        tall:false },
  { img:'gal9.jpg',     label:'Radiant Smile',      tall:true  },
];

/* ══════════════════
   FLOATING HEARTS
══════════════════ */
const HEART_SET = ['❤️','💖','💗','💓','💝','🩷','💕','💞'];

function spawnHeart() {
  const layer = document.getElementById('heartsLayer');
  if (!layer) return;
  const el = document.createElement('span');
  el.className = 'heart';
  el.textContent = HEART_SET[Math.floor(Math.random() * HEART_SET.length)];
  el.style.cssText = `
    left:${Math.random() * 96}%;
    font-size:${0.75 + Math.random() * 1.1}rem;
    animation-duration:${8 + Math.random() * 9}s;
    animation-delay:${Math.random() * 3}s;
  `;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 20000);
}

function startHearts() {
  for (let i = 0; i < 7; i++) setTimeout(spawnHeart, i * 500);
  setInterval(spawnHeart, 1300);
}

/* ══════════════════
   CONFETTI
══════════════════ */
const cvs = document.getElementById('confettiCanvas');
const cx  = cvs && cvs.getContext('2d');
const CONF_COLORS = [
  '#ff6eb4','#ffd700','#c9b8f5','#ff85a1','#98d8f0',
  '#ffa07a','#b8f0c8','#e0b0ff','#fff176','#f48fb1'
];

function resizeCvs() {
  if (!cvs) return;
  cvs.width  = window.innerWidth;
  cvs.height = window.innerHeight;
}

class Piece {
  constructor(burst) {
    this.burst = burst;
    this.reset(true);
  }
  reset(init) {
    if (this.burst) {
      this.x  = innerWidth  / 2 + (Math.random()-0.5)*380;
      this.y  = innerHeight / 2 + (Math.random()-0.5)*250;
      this.vx = (Math.random()-0.5)*5;
      this.vy = 1 + Math.random()*4;
    } else {
      this.x  = Math.random() * cvs.width;
      this.y  = init ? Math.random() * -cvs.height : -18;
      this.vx = (Math.random()-0.5)*1.8;
      this.vy = 2 + Math.random()*4;
    }
    this.w     = 5  + Math.random()*9;
    this.h     = 3  + Math.random()*6;
    this.color = CONF_COLORS[Math.floor(Math.random()*CONF_COLORS.length)];
    this.angle = Math.random()*Math.PI*2;
    this.spin  = (Math.random()-0.5)*0.2;
    this.alpha = 0.85 + Math.random()*0.15;
    this.round = Math.random()>0.5;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.angle += this.spin;
    if (this.y > cvs.height + 30) this.reset(false);
  }
  draw() {
    cx.save();
    cx.globalAlpha = this.alpha;
    cx.fillStyle   = this.color;
    cx.translate(this.x, this.y);
    cx.rotate(this.angle);
    if (this.round) {
      cx.beginPath(); cx.arc(0,0,this.w/2,0,Math.PI*2); cx.fill();
    } else {
      cx.fillRect(-this.w/2,-this.h/2,this.w,this.h);
    }
    cx.restore();
  }
}

function runConfetti(count, maxF, burst) {
  if (!cx) return;
  resizeCvs();
  const pieces = Array.from({length:count}, ()=>new Piece(burst));
  let f = 0;
  (function loop() {
    cx.clearRect(0,0,cvs.width,cvs.height);
    pieces.forEach(p=>{p.update();p.draw();});
    if (++f < maxF) requestAnimationFrame(loop);
    else cx.clearRect(0,0,cvs.width,cvs.height);
  })();
}

/* ══════════════════
   GALLERY
══════════════════ */
let galleryBuilt = false;

function buildGallery() {
  if (galleryBuilt) return;
  galleryBuilt = true;
  const grid = document.getElementById('galleryGrid');
  GALLERY.forEach(item => {
    const div = document.createElement('div');
    div.className = 'g-item' + (item.tall ? ' tall' : '');
    if (item.img) {
      div.style.background = `url(${item.img}) center/cover no-repeat`;
      div.innerHTML = `<span class="g-lbl img-lbl">${item.label}</span>`;
    } else {
      div.style.background = item.bg;
      div.innerHTML = `<span class="g-icon">${item.icon}</span><span class="g-lbl">${item.label}</span>`;
    }
    grid.appendChild(div);
  });
}

function showGallery() {
  const items = document.querySelectorAll('.g-item');
  items.forEach((el,i) => {
    el.classList.remove('show');
    void el.offsetWidth;
    setTimeout(() => el.classList.add('show'), 60 + i*80);
  });
}

/* ══════════════════
   MUSIC
══════════════════ */
let musicOn = false;

function playMusic() {
  const a = document.getElementById('bgMusic');
  if (!a || musicOn) return;
  a.play().then(()=>{ musicOn=true; }).catch(()=>{});
}

function stopMusic() {
  const a = document.getElementById('bgMusic');
  if (!a) return;
  a.pause(); musicOn = false;
}

/* ══════════════════
   NAVIGATION
══════════════════ */
const PAGE_IDS = {home:'homePage', gallery:'galleryPage', about:'aboutPage'};
let currentTab = 'home';

function switchTab(tab) {
  if (tab === currentTab) return;

  // hide current
  document.getElementById(PAGE_IDS[currentTab])?.classList.remove('active');

  // show next
  const next = document.getElementById(PAGE_IDS[tab]);
  if (next) next.classList.add('active');

  // update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle('active', isActive);
    if (isActive) {
      btn.classList.add('bounce');
      setTimeout(() => btn.classList.remove('bounce'), 450);
    }
  });

  currentTab = tab;

  // tab-specific actions
  if (tab === 'gallery') {
    buildGallery();
    setTimeout(showGallery, 80);
    playMusic();
  } else {
    stopMusic();
  }
}

/* ══════════════════
   INTRO → APP
══════════════════ */
function goToApp() {
  const intro = document.getElementById('introScreen');
  const app   = document.getElementById('mainApp');

  // Fade out intro
  intro.style.cssText = 'opacity:0;transform:scale(0.94);transition:opacity 0.5s ease,transform 0.5s ease;pointer-events:none';

  setTimeout(() => {
    intro.classList.add('hidden');
    app.classList.remove('hidden');
    app.style.cssText = 'opacity:0;transition:opacity 0.45s ease';
    void app.offsetWidth;
    app.style.opacity = '1';

    // Launch confetti rain + burst
    runConfetti(130, 480, false);
    setTimeout(() => runConfetti(80, 220, true), 700);
  }, 520);
}

/* ══════════════════
   INIT
══════════════════ */
window.addEventListener('resize', resizeCvs);

window.addEventListener('DOMContentLoaded', () => {
  resizeCvs();
  startHearts();

  // Wire nav
  document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.addEventListener('click', () => switchTab(btn.dataset.tab))
  );
});

// ----- Máquina de escrever no subtítulo -----
const subtitle = document.getElementById('subtitle');
const message = 'Tenho mil motivos, mas o principal é: meu coração é seu. ❤️';

typeWriter(subtitle, message, 40);

function typeWriter(el, text, speed = 40) {
  let i = 0;
  (function tick() {
    el.textContent = text.slice(0, i++);
    if (i <= text.length) setTimeout(tick, speed);
  })();
}

// ----- Botões -----
const yesBtn = document.getElementById('yesBtn');
const noBtn  = document.getElementById('noBtn');
const modal  = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const shareBtn = document.getElementById('shareBtn');

// Faz o botão "Não" fugir do mouse
function runAway(e) {
  const bounds = noBtn.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const newLeft = Math.random() * (vw - bounds.width - 20);
  const newTop  = Math.random() * (vh - bounds.height - 20);
  noBtn.style.position = 'fixed';
  noBtn.style.left = `${newLeft}px`;
  noBtn.style.top = `${newTop}px`;
}

noBtn.addEventListener('mouseenter', runAway);
noBtn.addEventListener('click', runAway);

// Quando clicar em "Sim"
yesBtn.addEventListener('click', () => {
  launchConfetti(1200);
  modal.hidden = false;
});

// Fechar modal
closeModal.addEventListener('click', () => modal.hidden = true);
document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.hidden = true; });

// Compartilhar (se suportado)
shareBtn.addEventListener('click', () => {
  if (navigator.share) {
    navigator.share({
      title: 'Ela disse SIM! 💍',
      text: 'Vitoriia, casa comigo? (spoiler: ela disse sim!)',
      url: location.href
    }).catch(()=>{});
  } else {
    navigator.clipboard?.writeText(window.location.href);
    shareBtn.textContent = 'Link copiado!';
    setTimeout(()=> shareBtn.textContent = 'Compartilhar', 1500);
  }
});

// ----- Confetes -----
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let pieces = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function createPiece() {
  const colors = ['#ff4d6d', '#ff8fa3', '#ffd6e0', '#34d399', '#60a5fa', '#fbbf24'];
  return {
    x: Math.random() * canvas.width,
    y: -10,
    w: 6 + Math.random() * 6,
    h: 10 + Math.random() * 10,
    r: Math.random() * Math.PI,
    s: 1 + Math.random() * 2,
    rot: (Math.random() - 0.5) * 0.2,
    color: colors[(Math.random() * colors.length) | 0]
  };
}

function drawPiece(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.r);
  ctx.fillStyle = p.color;
  ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
  ctx.restore();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach(p => {
    p.y += p.s;
    p.r += p.rot;
    drawPiece(p);
  });
  pieces = pieces.filter(p => p.y < canvas.height + 20);
  if (pieces.length) requestAnimationFrame(update);
}

function launchConfetti(duration = 1000) {
  const end = Date.now() + duration;
  (function frame() {
    for (let i = 0; i < 10; i++) pieces.push(createPiece());
    update();
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

document.addEventListener('DOMContentLoaded', ()=> {
  const blowBtn = document.getElementById('blowBtn');
  const confettiBtn = document.getElementById('confettiBtn');
  const musicBtn = document.getElementById('musicBtn');
  const cake = document.getElementById('cake');
  const audio = document.getElementById('bg-music');
  const canvas = document.getElementById('confetti-canvas');
  const candles = cake.querySelectorAll('.candle');

  // ----------------- МУЗЫКА -----------------
  let musicPlaying = false;
  musicBtn.addEventListener('click', ()=> {
    if(!musicPlaying){
      audio.play().catch(()=>{}); 
      musicBtn.textContent = 'Выключить музыку';
    } else {
      audio.pause(); 
      musicBtn.textContent = 'Включить музыку';
    }
    musicPlaying = !musicPlaying;
  });

(function() {
  const candles = document.querySelectorAll('.candle');
  const blowBtn = document.getElementById('blowBtn');
  const confettiBtn = document.getElementById('confettiBtn');

  // включить свечи
  function relight() {
    candles.forEach(c => c.classList.remove('extinguished'));
  }

  // выключить свечи
  function blow() {
    candles.forEach(c => c.classList.add('extinguished'));
  }

  // начальное состояние
  relight();
  blowBtn.textContent = "Задуть свечи";

  // переключение
  blowBtn.onclick = () => {
    const out = candles[0].classList.contains('extinguished');

    if (out) {
      relight();
      blowBtn.textContent = "Задуть свечи";
    } else {
      blow();
      blowBtn.textContent = "Зажечь снова";
    }
  };

  // конфетти НЕ трогает свечи
  if (confettiBtn) {
    confettiBtn.onclick = () => {
      if (typeof confetti === "function") {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.7 }
        });
      }
    };
  }
})();

  // ----------------- КОНФЕТТИ -----------------
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const particles = [];
  let confettiRunning = false;

  function rand(min,max){ return Math.random()*(max-min)+min; }
  function createParticle(x,y){
    const size = rand(6,14);
    const colors = ['#FF6B6B','#FFD166','#6BCB77','#4D96FF','#C285FF','#FF9CD3'];
    return {x,y,vx:rand(-6,6),vy:rand(-10,-6),gravity:0.28,size,tilt:rand(-0.2,0.2),color:colors[Math.floor(rand(0,colors.length))]};
  }

  function startConfetti(amount=80){
    for(let i=0;i<amount;i++){
      particles.push(createParticle(W/2 + rand(-60,60), H/2 + rand(-40,40)));
    }
    if(!confettiRunning){ 
      confettiRunning = true; 
      animateConfetti(); 
      setTimeout(()=>{ confettiRunning=false; }, 4500); 
    }
  }

  function animateConfetti(){
    if(!confettiRunning) return;
    ctx.clearRect(0,0,W,H);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.tilt += p.vx*0.02;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.tilt);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
      ctx.restore();
      if(p.y>H+50 || p.x<-50 || p.x>W+50) particles.splice(i,1);
    }
    requestAnimationFrame(animateConfetti);
  }

  window.addEventListener('resize', ()=>{ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; });

  confettiBtn.addEventListener('click', ()=> startConfetti(120));

  // ----------------- ИЗМЕНЕНИЕ КОРОТКОГО ПОЖЕЛАНИЯ -----------------
  const messageEl = document.getElementById('message');
  messageEl.addEventListener('dblclick', ()=>{
    const custom = prompt('Напиши своё пожелание (короткое):', messageEl.textContent);
    if(custom!==null) messageEl.textContent = custom;
  });

  // ----------------- КАРУСЕЛЬ -----------------
  const track = document.querySelector('.carousel-track');
  const images = document.querySelectorAll('.carousel-track img');
  let index = 0;

  document.getElementById('next').onclick = () => { index++; if(index>=images.length) index=0; updateCarousel(); }
  document.getElementById('prev').onclick = () => { index--; if(index<0) index=images.length-1; updateCarousel(); }

  function updateCarousel(){
    const width = images[0].clientWidth;
    track.style.transform = `translateX(-${index*width}px)`;
  }
});

// ----------------- Шарики с боков -----------------
function createBalloon(side) {
  const container = document.getElementById(side === 'left' ? 'balloons-left' : 'balloons-right');
  const balloon = document.createElement('div');
  balloon.classList.add('balloon');

  // случайная горизонтальная позиция внутри контейнера
  balloon.style.left = `${Math.random() * 40}px`; 

  // случайный цвет
  const colors = ['#FF6B6B','#FFD166','#6BCB77','#4D96FF','#C285FF','#FF9CD3','#FF85B3','#FFB347'];
  balloon.style.background = colors[Math.floor(Math.random() * colors.length)];

  // случайная скорость анимации
  const duration = 5 + Math.random() * 5; // от 5 до 10 секунд
  balloon.style.animationDuration = `${duration}s`;

  container.appendChild(balloon);

  // удалить шарик после анимации
  balloon.addEventListener('animationend', () => {
    balloon.remove();
  });
}

// создаем шарики каждые 400 мс с обеих сторон
setInterval(() => {
  createBalloon('left');
  createBalloon('right');
}, 400);


// ----------------- Блёстки на фоне -----------------
function createSparkle() {
  const container = document.getElementById('sparkles');
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');

  // случайная позиция по горизонтали
  sparkle.style.left = `${Math.random() * window.innerWidth}px`;

  // случайный размер
  const size = 2 + Math.random() * 4;
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;

  // случайная скорость (от 3 до 7 секунд)
  const duration = 3 + Math.random() * 4;
  sparkle.style.animationDuration = `${duration}s`;

  container.appendChild(sparkle);

  // удалить блёстку после анимации
  sparkle.addEventListener('animationend', () => {
    sparkle.remove();
  });
}

// создаем блёстки каждые 200 мс
setInterval(createSparkle, 200);


const canvas = document.getElementById('firework-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

class Particle {
  constructor(x, y, color, angle, speed, size, gravity, alphaDecay) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = angle;
    this.speed = speed;
    this.size = size;
    this.gravity = gravity;
    this.alpha = 1;
    this.alphaDecay = alphaDecay;
  }

  update() {
    this.speed *= 0.98; // замедление
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.alphaDecay;
  }

  draw(ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

let particles = [];

function createFirework() {
  const x = Math.random() * W * 0.8 + W * 0.1; // не прямо по краям
  const y = Math.random() * H * 0.3 + H * 0.1; // верхняя часть экрана

  const colors = ['#FF6B6B','#FFD166','#6BCB77','#4D96FF','#C285FF','#FF9CD3','#FFB347','#FFFF66'];

  const count = 80 + Math.floor(Math.random() * 50); // много частиц
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = 3 + Math.random() * 7;
    const size = 2 + Math.random() * 3;
    const gravity = 0.06 + Math.random() * 0.06;
    const alphaDecay = 0.01 + Math.random() * 0.02;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particles.push(new Particle(x, y, color, angle, speed, size, gravity, alphaDecay));
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);

  particles.forEach((p, i) => {
    p.update();
    p.draw(ctx);
    if (p.alpha <= 0) particles.splice(i,1);
  });

  requestAnimationFrame(animate);
}

animate();

document.getElementById('fireworkBtn').addEventListener('click', () => {
  // создаём несколько фейерверков сразу
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createFirework(), i * 300); 
  }
});

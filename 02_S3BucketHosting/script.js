/* =============================================
   ABYSSAL — script.js
   All interactivity & animations
   ============================================= */

// ─── PRELOADER ───────────────────────────────────────────────
(function () {
  const counter = document.getElementById('depth-counter');
  const fill = document.querySelector('.preloader-fill');
  const preloader = document.getElementById('preloader');
  let current = 0;
  const target = 11034;
  const duration = 2200;
  const startTime = performance.now();

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOut(progress);
    current = Math.floor(eased * target);
    counter.textContent = current.toLocaleString();
    fill.style.width = (eased * 100) + '%';

    if (progress < 1) {
      requestAnimationFrame(animateCounter);
    } else {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    }
  }

  document.body.style.overflow = 'hidden';
  requestAnimationFrame(animateCounter);
})();

// ─── CUSTOM CURSOR ────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .exp-card, .creature-item, input, select, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
  el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
});

// ─── NAVBAR SCROLL ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
});

// ─── HERO CANVAS — particle field ─────────────────────────────
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 2 + 0.3;
      this.speed = Math.random() * 0.4 + 0.1;
      this.opacity = Math.random() * 0.5 + 0.05;
      this.blink = Math.random() * 0.02 + 0.002;
      this.blinkDir = 1;
      this.hue = Math.random() > 0.8 ? 185 : 210;
    }
    update() {
      this.y -= this.speed * 0.3;
      this.opacity += this.blink * this.blinkDir;
      if (this.opacity > 0.7 || this.opacity < 0.02) this.blinkDir *= -1;
      if (this.y < -5) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create depth gradient background
  function drawBg() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#061830');
    grad.addColorStop(0.4, '#03101f');
    grad.addColorStop(1, '#010810');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // subtle light shaft from above
    const shaft = ctx.createLinearGradient(0, 0, 0, H * 0.6);
    shaft.addColorStop(0, 'rgba(0,180,255,0.06)');
    shaft.addColorStop(1, 'transparent');
    ctx.fillStyle = shaft;
    ctx.fillRect(W * 0.3, 0, W * 0.4, H * 0.6);
  }

  for (let i = 0; i < 200; i++) particles.push(new Particle());

  function loop() {
    drawBg();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

  // Mouse parallax
  let mx = 0, my = 0;
  canvas.closest('.hero').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mx = (e.clientX - rect.left) / W - 0.5;
    my = (e.clientY - rect.top) / H - 0.5;
  });
})();

// ─── BUBBLES ──────────────────────────────────────────────────
(function () {
  const container = document.getElementById('bubbles');
  function spawnBubble() {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.random() * 16 + 4;
    const drift = (Math.random() - 0.5) * 80;
    const dur = Math.random() * 12 + 8;
    b.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${dur}s;
      animation-delay: ${Math.random() * dur}s;
      --drift: ${drift}px;
    `;
    container.appendChild(b);
    setTimeout(() => b.remove(), (dur + 2) * 1000);
  }

  for (let i = 0; i < 20; i++) spawnBubble();
  setInterval(spawnBubble, 800);
})();

// ─── DEPTH INDICATOR ON SCROLL ────────────────────────────────
(function () {
  const el = document.querySelector('.current-depth');
  const maxDepth = 11000;

  window.addEventListener('scroll', () => {
    const prog = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const depth = Math.floor(prog * maxDepth);
    el.textContent = `— ${depth.toLocaleString()}m`;
  });
})();

// ─── SCROLL REVEAL ────────────────────────────────────────────
(function () {
  // Add reveal class to elements
  const selectors = [
    '.section-header', '.exp-card', '.creature-item',
    '.stats-strip .stat-item', '.depth-zone', '.contact-left',
    '.contact-right', '.quote-inner'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i > 0 && i <= 3) el.classList.add(`reveal-delay-${i}`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ─── DEPTH BAR ANIMATION ──────────────────────────────────────
(function () {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.depth-fill').forEach(fill => {
          fill.classList.add('animated');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.creature-item').forEach(el => observer.observe(el));
})();

// ─── STAT COUNTER ANIMATION ───────────────────────────────────
(function () {
  const stats = document.querySelectorAll('.stat-num');
  const targets = [11034, 247, 89, 12];
  let done = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !done) {
      done = true;
      stats.forEach((el, i) => {
        const target = targets[i];
        const duration = 1800;
        const start = performance.now();

        function update(now) {
          const t = Math.min((now - start) / duration, 1);
          const val = Math.floor((1 - Math.pow(1 - t, 3)) * target);
          el.textContent = val.toLocaleString();
          if (t < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  const strip = document.querySelector('.stats-strip');
  if (strip) observer.observe(strip);
})();

// ─── EXPEDITION CARD HOVER — depth badge effect ───────────────
document.querySelectorAll('.exp-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── FORM SUBMIT ANIMATION ────────────────────────────────────
const btn = document.getElementById('submit-btn');
if (btn) {
  btn.addEventListener('click', function () {
    const span = this.querySelector('span');
    const orig = span.textContent;
    span.textContent = 'Sending...';
    this.disabled = true;

    setTimeout(() => {
      span.textContent = '✓ Inquiry Received';
      this.style.borderColor = '#00ff80';
      this.style.color = '#00ff80';

      setTimeout(() => {
        span.textContent = orig;
        this.disabled = false;
        this.style.borderColor = '';
        this.style.color = '';
      }, 3000);
    }, 1800);
  });
}

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

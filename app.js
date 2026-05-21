/* =====================================================================
   SYNTRIX · app.js
   ===================================================================== */
(() => {
  'use strict';

  /* -------------------- Loader -------------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader && loader.classList.add('is-hidden'), 450);
  });

  /* -------------------- Nav: scrolled + burger -------------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById('burger');
  const navMobile = document.getElementById('navMobile');
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    navMobile.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    navMobile.setAttribute('aria-hidden', !open);
  });
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open');
    navMobile.classList.remove('is-open');
  }));

  /* -------------------- Reveal on scroll -------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.revealDelay || 0;
        e.target.style.setProperty('--reveal-delay', `${delay}ms`);
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* -------------------- Metric bars visibility -------------------- */
  const metricIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); metricIO.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.metric').forEach(m => metricIO.observe(m));

  /* -------------------- Counters -------------------- */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); counterIO.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(c => counterIO.observe(c));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const fmt = (n) => target >= 1000 ? Math.round(n).toLocaleString('pt-BR') : (target % 1 === 0 ? Math.round(n) : n.toFixed(1));
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* -------------------- Panel live time -------------------- */
  const panelTime = document.getElementById('panelTime');
  if (panelTime) {
    const updateTime = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      panelTime.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  /* -------------------- Card mouse halo -------------------- */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  /* -------------------- Tech icons (inline SVG) -------------------- */
  const ICONS = {
    aws: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 36c0 3 3 5 7 5s7-2 7-5v-8M22 36c0 3 3 5 7 5s7-2 7-5v-8M36 36c0 3 3 5 7 5s7-2 7-5v-8"/><path d="M10 48c10 6 32 6 44 0" stroke-dasharray="0" /><path d="M48 50l4-2 1 4" /></svg>`,

    docker: `<svg viewBox="0 0 64 64" fill="currentColor"><rect x="8" y="32" width="7" height="7" rx="1"/><rect x="17" y="32" width="7" height="7" rx="1"/><rect x="26" y="32" width="7" height="7" rx="1"/><rect x="35" y="32" width="7" height="7" rx="1"/><rect x="17" y="23" width="7" height="7" rx="1"/><rect x="26" y="23" width="7" height="7" rx="1"/><rect x="35" y="23" width="7" height="7" rx="1"/><rect x="26" y="14" width="7" height="7" rx="1"/><path d="M52 28c-2-1-5-1-7 0 0-2-1-3-2-4-1 1-2 3-1 5-3 1-5 0-6 0v2c0 4 2 7 5 9 4 2 9 2 13 0 3-2 5-4 6-7 2 0 4-1 5-3-2-1-5-2-7-1z"/></svg>`,

    k8s: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M32 6 L53 17 L48 40 L32 50 L16 40 L11 17 Z"/><path d="M32 18 L42 26 L38 38 L26 38 L22 26 Z" stroke-width="1.4"/><circle cx="32" cy="6" r="2" fill="currentColor"/><circle cx="53" cy="17" r="2" fill="currentColor"/><circle cx="48" cy="40" r="2" fill="currentColor"/><circle cx="32" cy="50" r="2" fill="currentColor"/><circle cx="16" cy="40" r="2" fill="currentColor"/><circle cx="11" cy="17" r="2" fill="currentColor"/></svg>`,

    terraform: `<svg viewBox="0 0 64 64" fill="currentColor"><path d="M14 12 L26 19 L26 33 L14 26 Z" opacity=".7"/><path d="M28 19 L40 26 L40 40 L28 33 Z"/><path d="M42 12 L54 19 L54 33 L42 26 Z" opacity=".85"/><path d="M28 35 L40 42 L40 56 L28 49 Z" opacity=".95"/></svg>`,

    python: `<svg viewBox="0 0 64 64" fill="none"><path d="M32 8c-7 0-12 1-12 6v8h13v2H14c-5 0-8 4-8 11s3 11 8 11h6v-7c0-4 3-7 7-7h13c4 0 7-3 7-7v-11c0-5-4-6-12-6-3 0-3 0-3 0z" fill="currentColor" opacity=".95"/><path d="M32 56c7 0 12-1 12-6v-8H31v-2h19c5 0 8-4 8-11s-3-11-8-11h-6v7c0 4-3 7-7 7H24c-4 0-7 3-7 7v11c0 5 4 6 12 6 3 0 3 0 3 0z" fill="currentColor" opacity=".7"/><circle cx="25" cy="14" r="2" fill="#05070D"/><circle cx="39" cy="50" r="2" fill="#05070D"/></svg>`,

    openai: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M32 8 L48 17 L48 35 L32 44 L16 35 L16 17 Z"/><path d="M32 8 L32 26 L16 35 M32 26 L48 35 M32 26 L32 44"/><circle cx="32" cy="26" r="3" fill="currentColor"/></svg>`,

    nextjs: `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="26" stroke="currentColor" stroke-width="2"/><path d="M22 22 L22 44" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M22 22 L44 48" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M42 22 L42 36" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,

    postgres: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="32" cy="14" rx="20" ry="6"/><path d="M12 14 v8 c0 3.3 9 6 20 6 s20-2.7 20-6 v-8"/><path d="M12 22 v8 c0 3.3 9 6 20 6 s20-2.7 20-6 v-8"/><path d="M12 30 v8 c0 3.3 9 6 20 6 s20-2.7 20-6 v-8"/><path d="M12 38 v8 c0 3.3 9 6 20 6 s20-2.7 20-6 v-8"/></svg>`,

    langchain: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 32 a8 8 0 0 1 8-8 h8" /><path d="M50 32 a8 8 0 0 1 -8 8 h-8" /><rect x="20" y="26" width="14" height="12" rx="3"/><rect x="30" y="26" width="14" height="12" rx="3"/><circle cx="14" cy="32" r="2.5" fill="currentColor"/><circle cx="50" cy="32" r="2.5" fill="currentColor"/></svg>`,

    fastapi: `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="2"/><path d="M34 14 L20 36 L30 36 L28 50 L44 28 L34 28 Z" fill="currentColor"/></svg>`
  };
  document.querySelectorAll('[data-svg]').forEach(el => {
    const key = el.dataset.svg;
    if (ICONS[key]) el.innerHTML = ICONS[key];
  });

  /* -------------------- Hero Neural Canvas -------------------- */
  const canvas = document.getElementById('neuralCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let mouse = { x: -9999, y: -9999 };
    let rafId;

    const NODE_COUNT_BASE = 70;
    const LINK_DIST = 140;
    const SPEED = 0.18;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    }
    function initNodes() {
      const count = Math.round(NODE_COUNT_BASE * Math.min(1.4, W / 1280));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.4 + 0.6,
        pulse: Math.random() * Math.PI * 2
      }));
    }

    function step(t) {
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;

        // mouse repel
        const dxm = a.x - mouse.x, dym = a.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 120) {
          const force = (120 - dm) / 120 * 0.6;
          a.x += (dxm / dm) * force;
          a.y += (dym / dm) * force;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.35;
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(103, 232, 249, ${alpha})`);
            grad.addColorStop(1, `rgba(37, 99, 235, ${alpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        n.pulse += 0.02;
        const r = n.r + Math.sin(n.pulse) * 0.4;
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        glow.addColorStop(0, 'rgba(103, 232, 249, 0.55)');
        glow.addColorStop(1, 'rgba(103, 232, 249, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(220, 240, 255, 0.95)';
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    window.addEventListener('resize', () => { cancelAnimationFrame(rafId); resize(); rafId = requestAnimationFrame(step); });
    resize();
    rafId = requestAnimationFrame(step);

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else rafId = requestAnimationFrame(step);
    });
  }

  /* -------------------- Smooth anchor offset (for fixed nav) -------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          const y = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });
})();

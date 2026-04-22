/* =========================================================
   Frenzy INK — Animations (anime.js v3)
   ========================================================= */

(function () {
  'use strict';

  // ---------- Nav: mobile toggle + scroll state ----------
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 20) nav.style.background = 'rgba(5,5,5,0.92)';
    else nav.style.background = 'rgba(10,10,10,0.75)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mark active nav link ----------
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---------- Wait for anime.js ----------
  if (typeof anime === 'undefined') {
    console.warn('anime.js not loaded');
    return;
  }

  // ---------- Hero headline: letter-by-letter ----------
  const hero = document.querySelector('.hero');
  if (hero) {
    const h1 = hero.querySelector('h1');
    if (h1 && !h1.dataset.split) {
      const text = h1.textContent.trim();
      h1.textContent = '';
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'letter';
        if (ch === ' ') {
          span.innerHTML = '&nbsp;';
        } else {
          span.textContent = ch;
        }
        // Make "INK" red if present in the word
        h1.appendChild(span);
      });
      // Color the last 3 characters red for "INK"
      const letters = h1.querySelectorAll('.letter');
      const inkStart = text.toUpperCase().lastIndexOf('INK');
      if (inkStart !== -1) {
        for (let i = inkStart; i < inkStart + 3 && i < letters.length; i++) {
          letters[i].classList.add('red');
        }
      }
      h1.dataset.split = '1';
    }

    const tl = anime.timeline({ easing: 'easeOutExpo' });
    tl.add({
      targets: '.hero-eyebrow',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 700,
    })
    .add({
      targets: '.hero h1 .letter',
      opacity: [0, 1],
      translateY: [60, 0],
      rotate: [{ value: () => anime.random(-20, 20) }, 0],
      delay: anime.stagger(55),
      duration: 900,
    }, '-=400')
    .add({
      targets: '.hero-sub',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 700,
    }, '-=600')
    .add({
      targets: '.hero-cta',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 700,
    }, '-=500')
    .add({
      targets: '.hero-scroll',
      opacity: [0, 1],
      duration: 600,
    }, '-=300');
  }

  // ---------- Page-header entrance ----------
  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) {
    anime({
      targets: '.page-header h1',
      opacity: [0, 1],
      translateY: [40, 0],
      easing: 'easeOutExpo',
      duration: 900,
    });
    anime({
      targets: '.page-header p',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: 300,
      easing: 'easeOutExpo',
      duration: 800,
    });
  }

  // ---------- Scroll reveal using IntersectionObserver ----------
  const revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [40, 0],
            easing: 'easeOutExpo',
            duration: 900,
            delay: entry.target.dataset.delay ? parseInt(entry.target.dataset.delay, 10) : 0,
          });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => io.observe(el));
  }

  // ---------- Staggered grids on scroll ----------
  document.querySelectorAll('[data-stagger]').forEach(group => {
    const children = group.children;
    anime.set(children, { opacity: 0, translateY: 40 });
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: children,
            opacity: [0, 1],
            translateY: [40, 0],
            delay: anime.stagger(90),
            easing: 'easeOutExpo',
            duration: 800,
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    io.observe(group);
  });

  // ---------- Gallery filter ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = f === 'all' || item.dataset.category === f;
        anime({
          targets: item,
          opacity: match ? [0, 1] : [1, 0],
          scale: match ? [0.9, 1] : [1, 0.9],
          duration: 400,
          easing: 'easeOutExpo',
          begin: () => { if (match) item.style.display = ''; },
          complete: () => { if (!match) item.style.display = 'none'; },
        });
      });
    });
  });

  // ---------- Lightbox ----------
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbClose = lightbox.querySelector('.lightbox-close');
    document.querySelectorAll('.gallery-item img').forEach(img => {
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lightbox.classList.add('open');
        anime({ targets: lbImg, opacity: [0, 1], scale: [0.9, 1], duration: 400, easing: 'easeOutExpo' });
      });
    });
    const close = () => lightbox.classList.remove('open');
    lbClose.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // ---------- Contact form UX (no backend) ----------
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sent — We\'ll be in touch';
      btn.disabled = true;
      anime({ targets: btn, scale: [1, 1.04, 1], duration: 500, easing: 'easeOutExpo' });
      setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 3500);
    });
  }
})();

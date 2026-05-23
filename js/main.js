/* ══════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════ */
const cur  = document.getElementById('cur');
const ring = document.getElementById('ring');

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
});

(function lerpRing() {
  rx += (mx - rx) * .1;
  ry += (my - ry) * .1;
  ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
  requestAnimationFrame(lerpRing);
})();

/* Hover enlarge on interactive elements */
const hoverEls = document.querySelectorAll('a, button, .gallery-item, .tag, .stat-item, .shot-ph');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
});


/* ══════════════════════════════════════════════════
   NAV — show/hide on scroll
══════════════════════════════════════════════════ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ══════════════════════════════════════════════════
   HERO PARALLAX
══════════════════════════════════════════════════ */
const heroBg = document.getElementById('heroBg');

window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const y = window.scrollY;
  heroBg.style.transform = `translateY(${y * 0.28}px)`;
}, { passive: true });


/* ══════════════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const step = 16;
  const total = Math.ceil(duration / step);
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    // Ease-out curve
    const progress = 1 - Math.pow(1 - frame / total, 3);
    el.textContent = Math.round(progress * target);
    if (frame >= total) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, step);
}


/* ══════════════════════════════════════════════════
   SCROLL REVEAL — Intersection Observer
══════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    el.classList.add('on');

    /* Trigger skill bars inside this element */
    el.querySelectorAll('[data-level]').forEach(item => {
      const fill = item.querySelector('.skill-fill');
      if (fill) fill.style.width = item.dataset.level + '%';
    });

    /* Trigger counters inside this element */
    el.querySelectorAll('[data-target]').forEach(animateCounter);

    revealObs.unobserve(el);
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* Separate observer for skill list (if it's not already a .reveal parent) */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-level]').forEach(item => {
      const fill = item.querySelector('.skill-fill');
      if (fill) fill.style.width = item.dataset.level + '%';
    });
    skillObs.unobserve(entry.target);
  });
}, { threshold: 0.2 });

const skillList = document.getElementById('skillList');
if (skillList) skillObs.observe(skillList);


/* ══════════════════════════════════════════════════
   GALLERY — Click & drag to scroll
══════════════════════════════════════════════════ */
const galleryTrack = document.getElementById('galleryTrack');

if (galleryTrack) {
  let isDown    = false;
  let startX    = 0;
  let scrollLeft = 0;

  galleryTrack.addEventListener('mousedown', e => {
    isDown = true;
    galleryTrack.classList.add('dragging');
    startX     = e.pageX - galleryTrack.offsetLeft;
    scrollLeft = galleryTrack.scrollLeft;
    e.preventDefault();
  });

  galleryTrack.addEventListener('mouseleave', () => {
    isDown = false;
    galleryTrack.classList.remove('dragging');
  });

  galleryTrack.addEventListener('mouseup', () => {
    isDown = false;
    galleryTrack.classList.remove('dragging');
  });

  galleryTrack.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - galleryTrack.offsetLeft;
    const walk = (x - startX) * 1.6;
    galleryTrack.scrollLeft = scrollLeft - walk;
  });

  /* Touch support */
  let touchStartX = 0;
  let touchScrollLeft = 0;

  galleryTrack.addEventListener('touchstart', e => {
    touchStartX    = e.touches[0].pageX;
    touchScrollLeft = galleryTrack.scrollLeft;
  }, { passive: true });

  galleryTrack.addEventListener('touchmove', e => {
    const dx = touchStartX - e.touches[0].pageX;
    galleryTrack.scrollLeft = touchScrollLeft + dx;
  }, { passive: true });
}


/* ══════════════════════════════════════════════════
   TICKER — duplicate guard (already doubled in HTML)
══════════════════════════════════════════════════ */
// The ticker HTML already contains content duplicated × 2,
// so the CSS animation translates by -50% for seamless loop.
// Nothing to do in JS.


/* ══════════════════════════════════════════════════
   SMOOTH ANCHOR LINKS
══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

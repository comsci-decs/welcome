/* =============================================
   DECS – script.js
   Bold · Modern · Crimson · Silver · Orange
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════
     SPLASH SCREEN — 4 seconds
  ══════════════════════════════════════ */
  const splash = document.getElementById('splash-screen');
  document.body.classList.add('no-scroll');

  // Spawn floating particles
  const pContainer = document.getElementById('splashParticles');
  const pColors = ['#DC143C', '#E85D04', '#C0C0C0', '#FF8534', '#A00F2C'];

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.classList.add('splash-particle');
    const size  = (Math.random() * 5 + 2).toFixed(1);
    const color = pColors[Math.floor(Math.random() * pColors.length)];
    const left  = (Math.random() * 100).toFixed(1);
    const dur   = (Math.random() * 7 + 5).toFixed(1);
    const delay = (Math.random() * 4).toFixed(1);
    p.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${left}%;
      bottom:-10px;
      --pd:${dur}s;
      --pde:-${delay}s;
      box-shadow:0 0 ${Number(size) * 3}px ${color};
    `;
    pContainer.appendChild(p);
  }

  // Hide splash after exactly 4 s → trigger hero reveal
  setTimeout(() => {
    splash.classList.add('out');
    document.body.classList.remove('no-scroll');
    triggerHeroReveal();
  }, 4000);


  /* ══════════════════════════════════════
     HERO — trigger on-load reveals
  ══════════════════════════════════════ */
  function triggerHeroReveal() {
    document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('go'));
  }


  /* ══════════════════════════════════════
     NAVBAR
  ══════════════════════════════════════ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const overlay   = document.getElementById('navOverlay');

  // Scroll: solidify navbar
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('solid', window.scrollY > 50);
    updateActiveLink();
    runScrollReveals();
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    overlay.classList.toggle('visible', isOpen);
  });

  // Close on overlay click
  overlay.addEventListener('click', closeNav);

  // Close on nav-link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  function closeNav() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('visible');
  }

  // Active link tracking
  const SECTIONS = ['hero','about','story','executive','auxiliary','follow','contact'];

  function updateActiveLink() {
    let current = 'hero';
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 90) current = id;
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      const matches = link.getAttribute('data-section') === current;
      link.classList.toggle('active', matches);
    });
  }


  /* ══════════════════════════════════════
     SCROLL REVEAL — Intersection Observer
  ══════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // Fallback for manual scroll events (for browsers without IntersectionObserver)
  function runScrollReveals() {
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  // Initial check (in case elements are already visible on load after splash)
  setTimeout(runScrollReveals, 4100);


  /* ══════════════════════════════════════
     PARALLAX — hero headline subtle drift
  ══════════════════════════════════════ */
  const heroHeadline = document.querySelector('.hero-headline');

  if (heroHeadline) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (sy < window.innerHeight) {
        heroHeadline.style.transform = `translateY(${sy * 0.18}px)`;
        heroHeadline.style.opacity   = 1 - sy / (window.innerHeight * 0.9);
      }
    }, { passive: true });
  }


  /* ══════════════════════════════════════
     FOLLOW CARD — ripple on click
  ══════════════════════════════════════ */
  document.querySelectorAll('.follow-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Ripple element
      const ripple = document.createElement('span');
      ripple.classList.add('follow-ripple');
      const rect   = card.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${x}px; top:${y}px;
        background:rgba(255,255,255,0.06);
        transform:scale(0); z-index:10;
        animation:rippleAnim 0.6s ease-out forwards;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // Inject ripple keyframe once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }


  /* ══════════════════════════════════════
     STAT COUNTER ANIMATION
  ══════════════════════════════════════ */
  const statNums = document.querySelectorAll('.hstat-num');
  let statsAnimated = false;

  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNums.forEach(el => {
          const target = parseInt(el.textContent, 10);
          let current = 0;
          const step  = Math.ceil(target / 20);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current >= target) clearInterval(timer);
          }, 50);
        });
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statObserver.observe(el));

});


/* ══════════════════════════════════════
   AUXILIARY TABS — global function
══════════════════════════════════════ */
function switchTab(tab) {
  const csReps  = document.getElementById('csReps');
  const cpeReps = document.getElementById('cpeReps');
  const tabCS   = document.getElementById('tabCS');
  const tabCPE  = document.getElementById('tabCPE');

  if (tab === 'cs') {
    csReps.classList.remove('hidden');
    cpeReps.classList.add('hidden');
    tabCS.classList.add('active');
    tabCPE.classList.remove('active');
  } else {
    cpeReps.classList.remove('hidden');
    csReps.classList.add('hidden');
    tabCPE.classList.add('active');
    tabCS.classList.remove('active');
  }

  // Re-trigger scroll reveal on newly visible reps
  document.querySelectorAll('#csReps .scroll-reveal, #cpeReps .scroll-reveal').forEach(el => {
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('visible'), 80);
  });
}

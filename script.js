'use strict';

const projects = {
  otterlink: {
    title: 'OtterLink', category: 'Desktop application · Private repository',
    description: 'A local-first desktop messenger for people on the same trusted local network. Built around temporary conversations, deliberate pairing, and a custom interface. The project is experimental and not independently security-audited.',
    points: ['Windows desktop app using C#, .NET 10, and WPF.', 'Device discovery, verification-based pairing, and encrypted messaging transport.', 'Custom conversation UI, compact mode, and interface state management.', 'Automated tests exist; physical multi-PC and broader compatibility checks are still pending.'],
    tags: ['C#', '.NET 10', 'WPF', 'LAN', 'UX']
  },
  rhythmabox: {
    title: 'RhythmaBox', category: 'Personal desktop project · Private build',
    description: 'A custom desktop music player built to make listening more visual and personal, with a playback interface, themed components, and multiple visualizer ideas.',
    points: ['C# Windows desktop application.', 'Multimedia playback architecture using LibVLCSharp.', 'Custom interface drawing and visualizers using SkiaSharp.', 'Theme configuration, local settings, and a focus on the music experience.'],
    tags: ['C#', 'WinForms', 'SkiaSharp', 'LibVLCSharp', 'SQLite']
  },
  ottersapex: {
    title: 'OttersApex', category: 'Personal motorsport tool · Private build',
    description: 'A telemetry-focused desktop project built around the information produced by F1 racing games, aiming to turn dense session data into a useful, readable dashboard.',
    points: ['F1 game data received over a configurable UDP connection.', 'Desktop interface focused on live telemetry and session feedback.', 'Offline-first design, with an emphasis on fast, clear information.'],
    tags: ['UDP', 'Telemetry', 'Desktop UI', 'Motorsport']
  },
  totallysafe: {
    title: 'Totally Safe', category: 'Game project · In development',
    description: 'An intentionally unpredictable 2D platformer where the level is part of the joke. The goal is to surprise players without making a second attempt feel unfair.',
    points: ['Unity 2D platformer with gameplay-focused trap design.', 'Different hazards and twists across planned levels.', 'Prioritizing visual identity, clarity on retries, and playful pacing.'],
    tags: ['Unity', 'C#', '2D', 'Level Design']
  },
  library: {
    title: 'Library Management System', category: 'Course project · C# fundamentals',
    description: 'A foundational C# console application for organizing a small library. Built while studying core programming and object-oriented patterns.',
    points: ['Create, remove, and search book records.', 'Borrow and return operations with checks and limits.', 'Practice with input validation, classes, and collection handling.'],
    tags: ['C#', 'Console', 'OOP', 'Validation']
  },
  events: {
    title: 'Event & Attendance Tracker', category: 'Course project · Blazor',
    description: 'A learning project exploring how Blazor handles UI components, navigation, registration, and session-related application state.',
    points: ['Reusable event card components and routing.', 'Registration forms and input validation.', 'Session state and attendance tracking practice.'],
    tags: ['Blazor', 'C#', 'Components', 'State']
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeButton = $('#themeButton');
const menuButton = $('#menuButton');
const siteNav = $('#siteNav');
const dialog = $('#projectDialog');
const dialogClose = $('#dialogClose');

function setTheme(light) {
  document.body.classList.toggle('light', light);
  themeButton.setAttribute('aria-pressed', String(light));
  themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  document.querySelector('meta[name="theme-color"]').content = light ? '#f7f7fe' : '#090d1a';
  try { localStorage.setItem('otter-theme', light ? 'light' : 'dark'); } catch (_) { /* Storage unavailable. */ }
}

let storedTheme;
try { storedTheme = localStorage.getItem('otter-theme'); } catch (_) { /* Storage unavailable. */ }
if (storedTheme === 'light' || storedTheme === 'dark') {
  setTheme(storedTheme === 'light');
} else {
  setTheme(window.matchMedia('(prefers-color-scheme: light)').matches);
}
themeButton.addEventListener('click', () => setTheme(!document.body.classList.contains('light')));

function closeMenu() {
  siteNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('.site-nav a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => {
  if (!siteNav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
});

const cards = $$('.project-card');
const filters = $$('.filter-chip');
const status = $('#filterStatus');
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(chip => {
    const selected = chip === button;
    chip.classList.toggle('is-active', selected);
    chip.setAttribute('aria-pressed', String(selected));
  });
  let visible = 0;
  cards.forEach(card => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.hidden = !show;
    if (show) visible++;
  });
  status.textContent = 'Showing ' + visible + ' ' + (visible === 1 ? 'project' : 'projects') + '.';
}));

let previousFocus = null;
function openProject(key) {
  const project = projects[key];
  if (!project) return;
  previousFocus = document.activeElement;
  $('#dialogTitle').textContent = project.title;
  $('#dialogCategory').textContent = project.category;
  $('#dialogDescription').textContent = project.description;
  $('#dialogPoints').replaceChildren(...project.points.map(point => {
    const li = document.createElement('li');
    li.textContent = point;
    return li;
  }));
  $('#dialogTags').replaceChildren(...project.tags.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    return span;
  }));
  if (typeof dialog.showModal === 'function') dialog.showModal();
}
$$('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project)));
dialogClose.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => {
  if (e.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  if (previousFocus && previousFocus.isConnected) previousFocus.focus();
});

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }), { threshold: .08, rootMargin: '0px 0px -20px 0px' });
  $$('.reveal').forEach(el => observer.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('in-view'));
}

const progress = $('.scroll-progress');
let scrollQueued = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(updateProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const showcase = $('.tilt-surface');
const visual = $('.hero-visual');
if (showcase && visual && !reducedMotion.matches && window.matchMedia('(pointer: fine)').matches) {
  visual.addEventListener('pointermove', e => {
    const bounds = visual.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width - .5;
    const y = (e.clientY - bounds.top) / bounds.height - .5;
    showcase.style.transform = 'rotate(' + (-5 + x * 3) + 'deg) rotateY(' + (-8 + x * 11) + 'deg) rotateX(' + (-y * 8) + 'deg)';
  });
  visual.addEventListener('pointerleave', () => { showcase.style.transform = ''; });
}


// The two newest builds. Keeping them with the existing project notes.
projects.otteraui = {
  title: 'OtteraUI', category: 'Android launcher · In development',
  description: 'A private Android home-screen replacement exploring liquid-glass components, fluid motion, customizable widgets, and a cohesive interface system. It is a work in progress, not a published app.',
  points: [
    'Kotlin and Jetpack Compose with a custom visual component system.',
    'Multi-page home screens, app organization, widgets, and theme ideas.',
    'Local-first settings and privacy-conscious design goals.',
    'Continuing to refine performance, interaction quality, and daily usability.'
  ],
  tags: ['Kotlin', 'Jetpack Compose', 'Android', 'UI/UX']
};
projects.inventoryhub = {
  title: 'InventoryHub', category: 'Course project · Full-stack integration',
  description: 'A study project connecting a Blazor front end to a .NET web API. It focuses on making the complete data flow work, from the interface through HTTP requests to the application logic.',
  points: [
    'Blazor interface connected to .NET REST endpoints.',
    'Create, read, update, and delete operations.',
    'API responses and common success/error paths tested.',
    'Built as part of a practical full-stack learning sequence.'
  ],
  tags: ['Blazor', '.NET', 'REST', 'Full-stack']
};

// Stars sit behind the page. No extra libraries needed.
const starCanvas = $('#starfield');
const starContext = starCanvas ? starCanvas.getContext('2d', { alpha: true }) : null;
const cursorGlow = $('#cursorGlow');
const finePointer = window.matchMedia('(pointer: fine)').matches;
let starWidth = 0;
let starHeight = 0;
let stars = [];
let frame = null;
let lastTime = 0;
let pointerX = 0;
let pointerY = 0;
let currentX = 0;
let currentY = 0;

function resizeStarfield() {
  if (!starContext) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  starWidth = window.innerWidth;
  starHeight = window.innerHeight;
  starCanvas.width = Math.round(starWidth * ratio);
  starCanvas.height = Math.round(starHeight * ratio);
  starCanvas.style.width = starWidth + 'px';
  starCanvas.style.height = starHeight + 'px';
  starContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(220, Math.max(65, Math.round(starWidth * starHeight / 5900)));
  stars = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * starWidth,
    y: Math.random() * starHeight,
    radius: Math.random() * 1.3 + .3,
    depth: .15 + Math.random() * .85,
    phase: Math.random() * Math.PI * 2,
    speed: .00025 + Math.random() * .0008,
    bright: index % 19 === 0
  }));

  if (reducedMotion.matches) drawStarfield(0);
}

function drawStarfield(time) {
  if (!starContext) return;

  starContext.clearRect(0, 0, starWidth, starHeight);
  currentX += (pointerX - currentX) * .028;
  currentY += (pointerY - currentY) * .028;
  const isLight = document.body.classList.contains('light');

  // A couple of subtle colour clouds give the empty space some depth.
  if (!isLight) {
    const nebula = starContext.createRadialGradient(starWidth * .82, starHeight * .22, 0, starWidth * .82, starHeight * .22, starWidth * .48);
    nebula.addColorStop(0, 'rgba(74, 67, 154, .11)');
    nebula.addColorStop(.5, 'rgba(38, 68, 124, .045)');
    nebula.addColorStop(1, 'rgba(10, 12, 28, 0)');
    starContext.fillStyle = nebula;
    starContext.fillRect(0, 0, starWidth, starHeight);
  }

  stars.forEach(star => {
    const shimmer = reducedMotion.matches ? .75 : .61 + Math.sin(time * star.speed + star.phase) * .28;
    const x = star.x + currentX * star.depth * 15;
    const y = star.y + currentY * star.depth * 12;
    const alpha = (isLight ? .24 : .72) * shimmer;

    starContext.beginPath();
    starContext.arc(x, y, star.radius, 0, Math.PI * 2);
    starContext.fillStyle = isLight ? 'rgba(69, 70, 141, ' + alpha + ')' : 'rgba(210, 225, 255, ' + alpha + ')';
    starContext.fill();

    if (star.bright && !isLight) {
      starContext.strokeStyle = 'rgba(170, 199, 255, ' + alpha * .33 + ')';
      starContext.lineWidth = .65;
      starContext.beginPath();
      starContext.moveTo(x - 5, y);
      starContext.lineTo(x + 5, y);
      starContext.moveTo(x, y - 5);
      starContext.lineTo(x, y + 5);
      starContext.stroke();
    }
  });

  // One quiet meteor every few seconds. It should never distract from the work.
  if (!reducedMotion.matches && !isLight) {
    const cycle = time % 11000;
    if (cycle > 8600 && cycle < 9600) {
      const progress = (cycle - 8600) / 1000;
      const x = starWidth * .77 - progress * 180;
      const y = starHeight * .08 + progress * 105;
      const line = starContext.createLinearGradient(x + 88, y - 50, x, y);
      line.addColorStop(0, 'rgba(160, 197, 255, 0)');
      line.addColorStop(1, 'rgba(190, 219, 255, ' + Math.sin(progress * Math.PI) * .5 + ')');
      starContext.beginPath();
      starContext.moveTo(x + 88, y - 50);
      starContext.lineTo(x, y);
      starContext.strokeStyle = line;
      starContext.lineWidth = 1.4;
      starContext.stroke();
    }
  }
}

function animateStarfield(time) {
  frame = null;
  if (document.hidden || reducedMotion.matches) return;
  // Cap background updates to roughly 30fps to keep laptops cool.
  if (time - lastTime > 32) {
    drawStarfield(time);
    lastTime = time;
  }
  frame = requestAnimationFrame(animateStarfield);
}

function startStarfield() {
  if (!starContext) return;
  if (frame !== null) cancelAnimationFrame(frame);
  if (reducedMotion.matches) {
    drawStarfield(0);
    return;
  }
  if (!document.hidden) frame = requestAnimationFrame(animateStarfield);
}

if (starContext) {
  resizeStarfield();
  startStarfield();
  window.addEventListener('resize', () => {
    resizeStarfield();
    startStarfield();
  }, { passive: true });
  document.addEventListener('visibilitychange', startStarfield);
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', startStarfield);
  }
}

if (finePointer && !reducedMotion.matches) {
  document.addEventListener('pointermove', e => {
    pointerX = e.clientX / Math.max(1, window.innerWidth) - .5;
    pointerY = e.clientY / Math.max(1, window.innerHeight) - .5;
    if (cursorGlow) {
      cursorGlow.style.transform = 'translate3d(' + (e.clientX - 230) + 'px,' + (e.clientY - 230) + 'px,0)';
    }
  }, { passive: true });

  $$('.project-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', (e.clientX - bounds.left) + 'px');
      card.style.setProperty('--spot-y', (e.clientY - bounds.top) + 'px');
    }, { passive: true });
  });
}

// Highlight the part of the site someone is exploring.
if ('IntersectionObserver' in window) {
  const sectionLinks = $$('.site-nav a[href^="#"]');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        const active = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-22% 0px -65% 0px' });
  ['work', 'about', 'stack', 'trajectory', 'contact'].forEach(id => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

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

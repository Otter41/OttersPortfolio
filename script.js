'use strict';

const projects = {
  otterlink: {
    title: 'OtterLink', category: 'Desktop application · Private repository',
    description: 'A local-first desktop messenger for people on the same trusted local network. Built around temporary conversations, deliberate pairing, and a custom interface. The project is experimental and not independently security-audited.',
    points: [
      'Windows desktop app using C#, .NET 10, and WPF.',
      'Device discovery, verification-based pairing, and encrypted messaging transport.',
      'Custom conversation UI, compact mode, and interface state management.',
      'Automated tests exist; physical multi-PC and broader compatibility checks are still pending.'
    ],
    tags: [
      'C#',
      '.NET 10',
      'WPF',
      'LAN',
      'UX'
    ]
  },
  rhythmabox: {
    title: 'RhythmaBox', category: 'Personal desktop project · Private build',
    description: 'A custom desktop music player built to make listening more visual and personal, with a playback interface, themed components, and multiple visualizer ideas.',
    points: [
      'C# Windows desktop application.',
      'Multimedia playback architecture using LibVLCSharp.',
      'Custom interface drawing and visualizers using SkiaSharp.',
      'Theme configuration, local settings, and a focus on the music experience.'
    ],
    tags: [
      'C#',
      'WinForms',
      'SkiaSharp',
      'LibVLCSharp',
      'SQLite'
    ]
  },
  ottersapex: {
    title: 'OttersApex', category: 'Personal motorsport tool · Private build',
    description: 'A telemetry-focused desktop project built around the information produced by F1 racing games, aiming to turn dense session data into a useful, readable dashboard.',
    points: [
      'F1 game data received over a configurable UDP connection.',
      'Desktop interface focused on live telemetry and session feedback.',
      'Offline-first design, with an emphasis on fast, clear information.'
    ],
    tags: [
      'UDP',
      'Telemetry',
      'Desktop UI',
      'Motorsport'
    ]
  },
  totallysafe: {
    title: 'Totally Safe', category: 'Game project · In development',
    description: 'An intentionally unpredictable 2D platformer where the level is part of the joke. The goal is to surprise players without making a second attempt feel unfair.',
    points: [
      'Unity 2D platformer with gameplay-focused trap design.',
      'Different hazards and twists across planned levels.',
      'Prioritizing visual identity, clarity on retries, and playful pacing.'
    ],
    tags: [
      'Unity',
      'C#',
      '2D',
      'Level Design'
    ]
  },
  library: {
    title: 'Library Management System', category: 'Course project · C# fundamentals',
    description: 'A foundational C# console application for organizing a small library. Built while studying core programming and object-oriented patterns.',
    points: [
      'Create, remove, and search book records.',
      'Borrow and return operations with checks and limits.',
      'Practice with input validation, classes, and collection handling.'
    ],
    tags: [
      'C#',
      'Console',
      'OOP',
      'Validation'
    ]
  },
  events: {
    title: 'Event & Attendance Tracker', category: 'Course project · Blazor',
    description: 'A learning project exploring how Blazor handles UI components, navigation, registration, and session-related application state.',
    points: [
      'Reusable event card components and routing.',
      'Registration forms and input validation.',
      'Session state and attendance tracking practice.'
    ],
    tags: [
      'Blazor',
      'C#',
      'Components',
      'State'
    ]
  }
};



projects.otteraui = {
  title: 'OtteraUI',
  category: 'Android launcher · In development',
  description: 'A private Android home-screen replacement exploring liquid-glass components, fluid motion, customizable widgets, and a cohesive interface system. It is a work in progress, not a published app.',
  points: [
    'Kotlin and Jetpack Compose with a custom visual component system.',
    'Multi-page home screens, app organization, widgets, and theme ideas.',
    'Local-first settings and privacy-conscious design goals.',
    'Continuing to refine performance, interaction quality, and daily usability.'
  ],
  tags: [
    'Kotlin',
    'Jetpack Compose',
    'Android',
    'UI/UX'
  ]
};

projects.inventoryhub = {
  title: 'InventoryHub',
  category: 'Course project · Full-stack integration',
  description: 'A study project connecting a Blazor front end to a .NET web API. It focuses on making the complete data flow work, from the interface through HTTP requests to the application logic.',
  points: [
    'Blazor interface connected to .NET REST endpoints.',
    'Create, read, update, and delete operations.',
    'API responses and common success/error paths tested.',
    'Built as part of a practical full-stack learning sequence.'
  ],
  tags: [
    'Blazor',
    '.NET',
    'REST',
    'Full-stack'
  ]
};


// Small helpers so I don't have to repeat selectors everywhere.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = $('#menuButton');
const siteNav = $('#siteNav');
const progressBar = $('#scrollProgress');

// Navigation should stay out of the way on smaller screens.
function closeMenu() {
  if (!menuButton || !siteNav) {
    return;
  }

  siteNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}

if (menuButton && siteNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  $$('.site-nav a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', event => {
    if (!menuButton.contains(event.target) && !siteNav.contains(event.target)) {
      closeMenu();
    }
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

// Readable project details without sending anyone to a private repository.
const projectDialog = $('#projectDialog');
const dialogClose = $('#dialogClose');
let previousFocus = null;

function openProject(key) {
  const project = projects[key];

  if (!project || !projectDialog) {
    return;
  }

  previousFocus = document.activeElement;

  $('#dialogTitle').textContent = project.title;
  $('#dialogCategory').textContent = project.category;
  $('#dialogDescription').textContent = project.description;

  const points = project.points.map(point => {
    const item = document.createElement('li');
    item.textContent = point;
    return item;
  });

  const tags = project.tags.map(tag => {
    const item = document.createElement('span');
    item.textContent = tag;
    return item;
  });

  $('#dialogPoints').replaceChildren(...points);
  $('#dialogTags').replaceChildren(...tags);
  projectDialog.showModal();
}

$$('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    openProject(button.dataset.project);
  });
});

if (projectDialog && dialogClose) {
  dialogClose.addEventListener('click', () => {
    projectDialog.close();
  });

  projectDialog.addEventListener('click', event => {
    if (event.target === projectDialog) {
      projectDialog.close();
    }
  });

  projectDialog.addEventListener('close', () => {
    if (previousFocus?.isConnected) {
      previousFocus.focus();
    }
  });
}

// Sections gently enter when someone scrolls down to them.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -35px 0px'
  });

  $$('.reveal').forEach(element => observer.observe(element));
} else {
  $$('.reveal').forEach(element => element.classList.add('in-view'));
}

// Scroll progress is a tiny detail, but it's a nice one.
let progressQueued = false;

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  if (progressBar) {
    progressBar.style.width = (progress * 100) + '%';
  }

  progressQueued = false;
}

window.addEventListener('scroll', () => {
  if (!progressQueued) {
    progressQueued = true;
    requestAnimationFrame(updateScrollProgress);
  }
}, { passive: true });

window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// A small, lightweight starfield behind the hero.
const starCanvas = $('#starfield');
const starContext = starCanvas?.getContext('2d');
let backgroundStars = [];
let backgroundWidth = 0;
let backgroundHeight = 0;
let frameId = null;
let lastFrame = 0;
let mouseX = 0;
let mouseY = 0;

function resizeStarfield() {
  if (!starContext) {
    return;
  }

  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  backgroundWidth = window.innerWidth;
  backgroundHeight = window.innerHeight;

  starCanvas.width = Math.round(backgroundWidth * ratio);
  starCanvas.height = Math.round(backgroundHeight * ratio);
  starContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(190, Math.max(80, Math.floor(backgroundWidth * backgroundHeight / 6800)));

  backgroundStars = Array.from({ length: count }, () => ({
    x: Math.random() * backgroundWidth,
    y: Math.random() * backgroundHeight,
    size: Math.random() * 1.2 + 0.25,
    phase: Math.random() * Math.PI * 2,
    speed: 0.0003 + Math.random() * 0.0008,
    depth: Math.random() * 0.7 + 0.3
  }));
}

function drawStarfield(time) {
  if (!starContext) {
    return;
  }

  starContext.clearRect(0, 0, backgroundWidth, backgroundHeight);

  backgroundStars.forEach(star => {
    const shimmer = reducedMotion.matches ? 0.75 : 0.62 + Math.sin(time * star.speed + star.phase) * 0.3;
    const x = star.x + mouseX * star.depth * 9;
    const y = star.y + mouseY * star.depth * 8;

    starContext.beginPath();
    starContext.arc(x, y, star.size, 0, Math.PI * 2);
    starContext.fillStyle = 'rgba(209, 225, 255, ' + (shimmer * 0.75) + ')';
    starContext.fill();
  });
}

function animateStarfield(time) {
  frameId = null;

  if (document.hidden || reducedMotion.matches) {
    return;
  }

  if (time - lastFrame > 33) {
    drawStarfield(time);
    lastFrame = time;
  }

  frameId = requestAnimationFrame(animateStarfield);
}

function startStarfield() {
  if (!starContext) {
    return;
  }

  if (frameId !== null) {
    cancelAnimationFrame(frameId);
  }

  if (reducedMotion.matches) {
    drawStarfield(0);
    return;
  }

  if (!document.hidden) {
    frameId = requestAnimationFrame(animateStarfield);
  }
}

if (starContext) {
  resizeStarfield();
  startStarfield();

  window.addEventListener('resize', () => {
    resizeStarfield();
    startStarfield();
  }, { passive: true });

  document.addEventListener('visibilitychange', startStarfield);
}

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', event => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  }, { passive: true });
}

// The otter starts as scattered light, then gradually comes together.
// Keep the actual SVG visible as a fallback even if animation is unavailable.
const otterArtwork = $('#otterArt');
const otterOutline = $('#otterOutline');
const otterStarGroup = $('#otterStars');
const otterDustGroup = $('#otterDust');

function createSvgCircle(group, className, radius) {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('r', radius.toFixed(2));
  circle.setAttribute('class', className);
  group.appendChild(circle);
  return circle;
}

function buildOtterStars() {
  if (!otterArtwork || !otterOutline || !otterStarGroup || !otterDustGroup) {
    return;
  }

  const outlinePath = otterOutline.getAttribute('d');
  const shape = new Path2D(outlinePath);
  const testCanvas = document.createElement('canvas');
  const testContext = testCanvas.getContext('2d');

  if (!testContext) {
    return;
  }

  const points = [];
  const length = otterOutline.getTotalLength();

  // Some brighter stars run around the shape.
  for (let index = 0; index < 95; index++) {
    const position = otterOutline.getPointAtLength(length * index / 95);

    points.push({
      x: position.x,
      y: position.y,
      radius: index % 7 === 0 ? 3.1 : 1.45,
      bright: index % 7 === 0
    });
  }

  // Fill the body with smaller stars. This gives it a galaxy texture.
  let attempts = 0;

  while (points.length < 320 && attempts < 8000) {
    attempts++;

    const x = 104 + Math.random() * 820;
    const y = 174 + Math.random() * 300;

    if (!testContext.isPointInPath(shape, x, y)) {
      continue;
    }

    points.push({
      x,
      y,
      radius: Math.random() * 1.3 + 0.5,
      bright: Math.random() < 0.07
    });
  }

  const stars = points.map(point => {
    const circle = createSvgCircle(
      otterStarGroup,
      point.bright ? 'bright-star' : 'dust-star',
      point.radius
    );

    const fromX = Math.random() * 1000;
    const fromY = Math.random() * 640;

    circle.setAttribute('cx', fromX.toFixed(1));
    circle.setAttribute('cy', fromY.toFixed(1));

    return {
      element: circle,
      fromX,
      fromY,
      toX: point.x,
      toY: point.y
    };
  });

  // Extra speckles remain inside the body after the stars settle.
  for (let index = 0; index < 65; index++) {
    const circle = createSvgCircle(
      otterDustGroup,
      'dust-star',
      Math.random() * 0.65 + 0.3
    );

    circle.setAttribute('cx', (Math.random() * 1000).toFixed(1));
    circle.setAttribute('cy', (Math.random() * 640).toFixed(1));
    circle.setAttribute('opacity', '0.5');
  }

  if (reducedMotion.matches) {
    stars.forEach(star => {
      star.element.setAttribute('cx', star.toX.toFixed(1));
      star.element.setAttribute('cy', star.toY.toFixed(1));
    });

    return;
  }

  const silhouette = $('.otter-silhouette', otterArtwork);
  const duration = 2500;
  let startTime = null;

  // Only hide the fallback when the actual star animation is ready.
  if (silhouette) {
    silhouette.style.opacity = '0';
  }

  function animateFormation(time) {
    if (startTime === null) {
      startTime = time;
    }

    const elapsed = time - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - progress, 3);

    stars.forEach(star => {
      const x = star.fromX + (star.toX - star.fromX) * eased;
      const y = star.fromY + (star.toY - star.fromY) * eased;

      star.element.setAttribute('cx', x.toFixed(1));
      star.element.setAttribute('cy', y.toFixed(1));
    });

    if (silhouette) {
      silhouette.style.opacity = String(Math.min(0.84, Math.max(0, (progress - 0.34) * 1.4)));
    }

    if (progress < 1) {
      requestAnimationFrame(animateFormation);
    }
  }

  // The page gets a moment to settle before the stars make their entrance.
  requestAnimationFrame(animateFormation);
}

buildOtterStars();

'use strict';

const projects = {
  otterlink: {
    title: 'OtterLink',
    category: 'Desktop application · Private repository',
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
    title: 'RhythmaBox',
    category: 'Personal desktop project · Private build',
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
    title: 'OttersApex',
    category: 'Personal motorsport tool · Private build',
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
    title: 'Totally Safe',
    category: 'Game project · In development',
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
    title: 'Library Management System',
    category: 'Course project · C# fundamentals',
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
    title: 'Event & Attendance Tracker',
    category: 'Course project · Blazor',
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

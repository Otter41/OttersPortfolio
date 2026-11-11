'use strict';

const projects = {
  wellbloom: {
    title: 'WellBloom',
    category: 'Published browser strategy game · itch.io · November 2026',
    description: 'An independently released, browser-playable strategy game built in a two-week development cycle. Continuing updates are planned, and a Steam release may follow if the game gains enough traction.',
    points: [
      'Designed, developed, tested, and launched as a publicly playable browser game.',
      'Created gameplay and interface experiences with an emphasis on ongoing refinement.',
      'Used AI-assisted development with Claude and disclosed that assistance on the release page.',
      'Public release: mrbulko.itch.io/wellbloom'
    ],
    tags: ['Browser Game', 'Strategy', 'Indie Game', 'Game Design', 'UI/UX'],
    url: 'https://mrbulko.itch.io/wellbloom'
  },
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
    tags: ['C#', '.NET 10', 'WPF', 'LAN', 'UX']
  },
  otteraui: {
    title: 'OtteraUI',
    category: 'Android launcher · In development',
    description: 'A private Android home-screen replacement exploring liquid-glass components, fluid motion, customizable widgets, and a cohesive interface system. It is a work in progress, not a published app.',
    points: [
      'Kotlin and Jetpack Compose with a custom visual component system.',
      'Multi-page home screens, app organization, widgets, and theme ideas.',
      'Local-first settings and privacy-conscious design goals.',
      'Continuing to refine performance, interaction quality, and daily usability.'
    ],
    tags: ['Kotlin', 'Jetpack Compose', 'Android', 'UI/UX']
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
    tags: ['C#', 'WinForms', 'SkiaSharp', 'LibVLCSharp', 'SQLite']
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
    tags: ['UDP', 'Telemetry', 'Desktop UI', 'Motorsport']
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
    tags: ['Unity', 'C#', '2D', 'Level Design']
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
    tags: ['C#', 'Console', 'OOP', 'Validation']
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
    tags: ['Blazor', 'C#', 'Components', 'State']
  },
  inventoryhub: {
    title: 'InventoryHub',
    category: 'Course project · Full-stack integration',
    description: 'A study project connecting a Blazor front end to a .NET web API. It focuses on making the complete data flow work, from the interface through HTTP requests to the application logic.',
    points: [
      'Blazor interface connected to .NET REST endpoints.',
      'Create, read, update, and delete operations.',
      'API responses and common success/error paths tested.',
      'Built as part of a practical full-stack learning sequence.'
    ],
    tags: ['Blazor', '.NET', 'REST', 'Full-stack']
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const isNarrow = () => window.innerWidth <= 900;

const palette = [
  [243, 237, 226],
  [255, 122, 69],
  [255, 186, 140],
  [126, 220, 214],
  [190, 170, 240],
  [255, 255, 255]
];

const hexPalette = ['#f3ede2', '#ff7a45', '#ffba8c', '#7edcd6', '#beaaf0', '#ffffff'];
const cssPalette = palette.map(color => 'rgb(' + color.join(',') + ')');

const sceneLabels = {
  wellbloom: 'WELLBLOOM',
  otter: 'OTTER',
  drift: 'DEEP FIELD',
  galaxy: 'SPIRAL GALAXY',
  code: 'SOURCE',
  shield: 'SECURE CORE',
  blackhole: 'EVENT HORIZON',
  otterlink: 'OTTERLINK',
  otteraui: 'OTTERAUI',
  rhythmabox: 'RHYTHMABOX',
  ottersapex: 'OTTERSAPEX',
  totallysafe: 'TOTALLY SAFE',
  library: 'LIBRARY',
  events: 'EVENT TRACKER',
  inventoryhub: 'INVENTORYHUB'
};

const scramblePool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#*';

function scramble(element, text, duration = 650) {
  const start = performance.now();
  const length = text.length;

  if (element.scrambleFrame) {
    cancelAnimationFrame(element.scrambleFrame);
  }

  function step(now) {
    const progress = clamp((now - start) / duration);
    const fixed = Math.floor(progress * length);
    let output = text.slice(0, fixed);

    for (let index = fixed; index < length; index++) {
      output += text[index] === ' ' ? ' ' : scramblePool[Math.floor(Math.random() * scramblePool.length)];
    }

    element.textContent = output;

    if (progress < 1) {
      element.scrambleFrame = requestAnimationFrame(step);
    }
  }

  if (reducedMotion) {
    element.textContent = text;
    return;
  }

  element.scrambleFrame = requestAnimationFrame(step);
}

const universe = createUniverse($('#universe'));

function createUniverse(canvas) {
  const context = canvas.getContext('2d');
  const count = isNarrow() ? 2600 : 5200;
  const maskSize = 360;
  const shapes = {};

  const positionX = new Float32Array(count);
  const positionY = new Float32Array(count);
  const positionZ = new Float32Array(count);
  const velocityX = new Float32Array(count);
  const velocityY = new Float32Array(count);
  const velocityZ = new Float32Array(count);
  const targetX = new Float32Array(count);
  const targetY = new Float32Array(count);
  const targetZ = new Float32Array(count);
  const spins = new Float32Array(count);
  const colors = new Uint8Array(count);
  const nextColors = new Uint8Array(count);
  const wakes = new Float32Array(count);
  const sizes = new Float32Array(count);
  const screenX = new Float32Array(count);
  const screenY = new Float32Array(count);
  const backdrop = [];
  const sprites = palette.map(makeSprite);

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let scene = null;
  let spinSpeed = 0;
  let spinAngle = 0;
  let tilt = 0;
  let tiltTarget = 0;
  let pointerX = -9999;
  let pointerY = -9999;
  let lookX = 0;
  let lookY = 0;
  let lookTargetX = 0;
  let lookTargetY = 0;
  let lastTime = performance.now();
  let yawDegrees = 0;
  let explode = 0;

  const stage = {
    x: 0,
    y: 0,
    radius: 0,
    dim: 1
  };

  const stageTarget = {
    x: 0,
    y: 0,
    radius: 0,
    dim: 1
  };

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function gaussian() {
    return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  }

  function nearestColor(red, green, blue) {
    let best = 0;
    let bestDistance = Infinity;

    palette.forEach((color, index) => {
      const distance =
        (color[0] - red) ** 2 +
        (color[1] - green) ** 2 +
        (color[2] - blue) ** 2;

      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });

    return best;
  }

  function makeSprite(color) {
    const sprite = document.createElement('canvas');
    const spriteContext = sprite.getContext('2d');
    sprite.width = 64;
    sprite.height = 64;

    const glow = spriteContext.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, 'rgba(' + color.join(',') + ',0.9)');
    glow.addColorStop(0.18, 'rgba(' + color.join(',') + ',0.32)');
    glow.addColorStop(1, 'rgba(' + color.join(',') + ',0)');

    spriteContext.fillStyle = glow;
    spriteContext.fillRect(0, 0, 64, 64);

    return sprite;
  }

  function emptyShape() {
    return {
      x: new Float32Array(count),
      y: new Float32Array(count),
      z: new Float32Array(count),
      color: new Uint8Array(count),
      spin: new Float32Array(count)
    };
  }

  function maskShape(draw, depth, spin = 0) {
    const offscreen = document.createElement('canvas');
    offscreen.width = maskSize;
    offscreen.height = maskSize;

    const maskContext = offscreen.getContext('2d', { willReadFrequently: true });
    draw(maskContext, maskSize);

    const pixels = maskContext.getImageData(0, 0, maskSize, maskSize).data;
    const hits = [];

    for (let y = 0; y < maskSize; y += 2) {
      for (let x = 0; x < maskSize; x += 2) {
        const index = (y * maskSize + x) * 4;

        if (pixels[index + 3] > 70) {
          hits.push(x, y, nearestColor(pixels[index], pixels[index + 1], pixels[index + 2]));
        }
      }
    }

    const shape = emptyShape();
    const half = maskSize / 2;
    const total = hits.length / 3;

    for (let index = 0; index < count; index++) {
      if (total === 0) {
        break;
      }

      const pick = Math.floor(Math.random() * total) * 3;

      shape.x[index] = (hits[pick] - half + random(-1, 1)) / half;
      shape.y[index] = (hits[pick + 1] - half + random(-1, 1)) / half;
      shape.z[index] = gaussian() * depth;
      shape.color[index] = hits[pick + 2];
      shape.spin[index] = spin;
    }

    return shape;
  }

  function drawOtter(ctx, size) {
    if (typeof otterReference === 'undefined') {
      return;
    }

    const colours = [
      null,
      null,
      hexPalette[0],
      hexPalette[4],
      hexPalette[5],
      hexPalette[2],
      hexPalette[3],
      hexPalette[1],
      hexPalette[1]
    ];

    const pixels = atob(otterReference.pixels);
    const cell = size / otterReference.width;
    const top = (size - otterReference.height * cell) / 2;

    for (let row = 0; row < otterReference.height; row++) {
      for (let col = 0; col < otterReference.width; col++) {
        const index = row * otterReference.width + col;
        const byte = pixels.charCodeAt(Math.floor(index / 2)) || 0;
        const colour = index % 2 === 0 ? byte >> 4 : byte & 15;

        if (!colours[colour]) {
          continue;
        }

        ctx.fillStyle = colours[colour];
        ctx.fillRect(col * cell, top + row * cell, cell + 0.5, cell + 0.5);
      }
    }
  }

  function drawChat(ctx) {
    ctx.fillStyle = hexPalette[0];
    ctx.beginPath();
    ctx.roundRect(30, 60, 210, 130, 34);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(70, 180);
    ctx.lineTo(50, 230);
    ctx.lineTo(110, 186);
    ctx.fill();

    ctx.fillStyle = hexPalette[1];
    ctx.beginPath();
    ctx.roundRect(140, 200, 190, 110, 30);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(290, 300);
    ctx.lineTo(315, 340);
    ctx.lineTo(260, 306);
    ctx.fill();

    ctx.globalCompositeOperation = 'destination-out';

    for (const x of [90, 135, 180]) {
      ctx.beginPath();
      ctx.arc(x, 125, 13, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  function drawPhone(ctx) {
    ctx.strokeStyle = hexPalette[0];
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.roundRect(105, 22, 150, 316, 34);
    ctx.stroke();

    ctx.fillStyle = hexPalette[0];
    ctx.beginPath();
    ctx.roundRect(155, 42, 50, 12, 6);
    ctx.fill();

    const apps = [hexPalette[3], hexPalette[1], hexPalette[4], hexPalette[2], hexPalette[3], hexPalette[1]];

    apps.forEach((colour, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);

      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.roundRect(135 + col * 52, 90 + row * 62, 38, 38, 11);
      ctx.fill();
    });

    ctx.fillStyle = hexPalette[4];
    ctx.beginPath();
    ctx.roundRect(135, 280, 90, 30, 12);
    ctx.fill();
  }

  function drawWave(ctx) {
    for (let index = 0; index < 15; index++) {
      const barHeight = 40 + Math.abs(Math.sin(index * 0.72 + 0.4)) * 230;
      const x = 34 + index * 20;

      ctx.fillStyle = index % 4 === 0 ? hexPalette[0] : index % 2 === 0 ? hexPalette[1] : hexPalette[2];
      ctx.beginPath();
      ctx.roundRect(x, 180 - barHeight / 2, 12, barHeight, 6);
      ctx.fill();
    }
  }

  function drawGauge(ctx) {
    ctx.lineCap = 'round';
    ctx.lineWidth = 24;
    ctx.strokeStyle = hexPalette[0];
    ctx.beginPath();
    ctx.arc(180, 200, 140, Math.PI * 0.8, Math.PI * 1.85);
    ctx.stroke();

    ctx.strokeStyle = hexPalette[1];
    ctx.beginPath();
    ctx.arc(180, 200, 140, Math.PI * 1.9, Math.PI * 2.2);
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.strokeStyle = hexPalette[2];

    for (let index = 0; index <= 8; index++) {
      const angle = Math.PI * 0.8 + index * (Math.PI * 1.4 / 8);

      ctx.beginPath();
      ctx.moveTo(180 + Math.cos(angle) * 100, 200 + Math.sin(angle) * 100);
      ctx.lineTo(180 + Math.cos(angle) * 115, 200 + Math.sin(angle) * 115);
      ctx.stroke();
    }

    ctx.lineWidth = 12;
    ctx.strokeStyle = hexPalette[1];
    ctx.beginPath();
    ctx.moveTo(180, 200);
    ctx.lineTo(180 + Math.cos(-0.5) * 110, 200 + Math.sin(-0.5) * 110);
    ctx.stroke();

    ctx.fillStyle = hexPalette[5];
    ctx.beginPath();
    ctx.arc(180, 200, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBloom(ctx) {
    ctx.strokeStyle = hexPalette[1];
    ctx.lineWidth = 17;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(180, 191);
    ctx.quadraticCurveTo(188, 265, 168, 331);
    ctx.stroke();

    ctx.fillStyle = hexPalette[4];
    ctx.beginPath();
    ctx.ellipse(143, 271, 47, 22, Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(215, 292, 43, 20, -Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();

    for (let index = 0; index < 6; index++) {
      const angle = (index * Math.PI) / 3;
      ctx.fillStyle = index % 2 ? hexPalette[2] : hexPalette[0];
      ctx.beginPath();
      ctx.ellipse(180 + Math.cos(angle) * 57, 132 + Math.sin(angle) * 57, 37, 59, angle + Math.PI / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = hexPalette[3];
    ctx.beginPath();
    ctx.arc(180, 132, 36, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawWarning(ctx) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = 26;
    ctx.strokeStyle = hexPalette[2];
    ctx.beginPath();
    ctx.moveTo(180, 40);
    ctx.lineTo(325, 310);
    ctx.lineTo(35, 310);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = hexPalette[1];
    ctx.beginPath();
    ctx.roundRect(166, 120, 28, 110, 14);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(180, 266, 17, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBook(ctx) {
    ctx.fillStyle = hexPalette[0];
    ctx.beginPath();
    ctx.moveTo(180, 100);
    ctx.quadraticCurveTo(110, 60, 30, 80);
    ctx.lineTo(30, 290);
    ctx.quadraticCurveTo(110, 270, 180, 310);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = hexPalette[4];
    ctx.beginPath();
    ctx.moveTo(180, 100);
    ctx.quadraticCurveTo(250, 60, 330, 80);
    ctx.lineTo(330, 290);
    ctx.quadraticCurveTo(250, 270, 180, 310);
    ctx.closePath();
    ctx.fill();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 7;

    for (let line = 0; line < 6; line++) {
      const y = 125 + line * 28;

      ctx.beginPath();
      ctx.moveTo(55, y);
      ctx.lineTo(155, y + 10);
      ctx.moveTo(205, y + 10);
      ctx.lineTo(305, y);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  function drawCalendar(ctx) {
    ctx.strokeStyle = hexPalette[0];
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.roundRect(40, 60, 280, 260, 28);
    ctx.stroke();

    ctx.fillStyle = hexPalette[1];
    ctx.beginPath();
    ctx.roundRect(40, 60, 280, 64, [28, 28, 0, 0]);
    ctx.fill();

    ctx.fillStyle = hexPalette[0];
    ctx.beginPath();
    ctx.roundRect(100, 30, 18, 60, 9);
    ctx.roundRect(242, 30, 18, 60, 9);
    ctx.fill();

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const highlighted = row === 1 && col === 2;

        ctx.fillStyle = highlighted ? hexPalette[1] : hexPalette[3];
        ctx.beginPath();
        ctx.arc(90 + col * 60, 165 + row * 55, highlighted ? 20 : 12, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawDatabase(ctx) {
    ctx.lineWidth = 14;

    for (let layer = 0; layer < 3; layer++) {
      const y = 90 + layer * 90;

      ctx.strokeStyle = layer === 0 ? hexPalette[0] : hexPalette[3];
      ctx.beginPath();
      ctx.ellipse(180, y, 130, 40, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = hexPalette[3];
    ctx.beginPath();
    ctx.moveTo(50, 90);
    ctx.lineTo(50, 270);
    ctx.moveTo(310, 90);
    ctx.lineTo(310, 270);
    ctx.stroke();

    ctx.fillStyle = hexPalette[1];

    for (const y of [150, 240]) {
      ctx.beginPath();
      ctx.arc(250, y, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawCode(ctx) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 190px "DejaVu Sans Mono", monospace';
    ctx.fillStyle = hexPalette[0];
    ctx.fillText('<', 70, 185);
    ctx.fillText('>', 290, 185);
    ctx.fillStyle = hexPalette[1];
    ctx.fillText('/', 180, 185);
  }

  function drawShield(ctx) {
    ctx.fillStyle = hexPalette[3];
    ctx.beginPath();
    ctx.moveTo(180, 30);
    ctx.lineTo(310, 80);
    ctx.lineTo(300, 200);
    ctx.quadraticCurveTo(280, 290, 180, 340);
    ctx.quadraticCurveTo(80, 290, 60, 200);
    ctx.lineTo(50, 80);
    ctx.closePath();
    ctx.fill();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(120, 185);
    ctx.lineTo(165, 230);
    ctx.lineTo(245, 140);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';

    ctx.strokeStyle = hexPalette[0];
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(180, 12);
    ctx.lineTo(328, 68);
    ctx.lineTo(318, 202);
    ctx.quadraticCurveTo(296, 304, 180, 358);
    ctx.quadraticCurveTo(64, 304, 42, 202);
    ctx.lineTo(32, 68);
    ctx.closePath();
    ctx.stroke();
  }

  function driftShape() {
    const shape = emptyShape();

    for (let index = 0; index < count; index++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(random(-1, 1));
      const radius = random(1.1, 2.6);

      shape.x[index] = Math.sin(phi) * Math.cos(theta) * radius * 1.4;
      shape.y[index] = Math.cos(phi) * radius * 0.8;
      shape.z[index] = Math.sin(phi) * Math.sin(theta) * radius;
      shape.color[index] = Math.random() > 0.85 ? 1 : Math.random() > 0.7 ? 4 : 0;
      shape.spin[index] = 1;
    }

    return shape;
  }

  function galaxyShape() {
    const shape = emptyShape();
    const arms = 3;

    for (let index = 0; index < count; index++) {
      const arm = index % arms;
      const radius = Math.pow(Math.random(), 0.7);
      const angle = arm * (Math.PI * 2 / arms) + radius * 4.4 + gaussian() * 0.35 * (1 - radius * 0.4);

      shape.x[index] = Math.cos(angle) * radius + gaussian() * 0.04;
      shape.z[index] = Math.sin(angle) * radius + gaussian() * 0.04;
      shape.y[index] = gaussian() * 0.08 * (1.2 - radius);
      shape.color[index] = radius < 0.18 ? 5 : radius < 0.4 ? 2 : Math.random() > 0.55 ? 4 : Math.random() > 0.5 ? 3 : 0;
      shape.spin[index] = 1;
    }

    return shape;
  }

  function blackHoleShape() {
    const shape = emptyShape();

    for (let index = 0; index < count; index++) {
      if (index % 7 === 0) {
        const angle = Math.random() * Math.PI * 2;

        shape.x[index] = Math.cos(angle) * 0.4;
        shape.y[index] = Math.sin(angle) * 0.4;
        shape.z[index] = 0;
        shape.color[index] = 5;
        shape.spin[index] = 0;
        continue;
      }

      const radius = 0.5 + Math.pow(Math.random(), 1.6) * 0.75;
      const angle = Math.random() * Math.PI * 2;

      shape.x[index] = Math.cos(angle) * radius;
      shape.z[index] = Math.sin(angle) * radius;
      shape.y[index] = gaussian() * 0.015;
      shape.color[index] = radius < 0.62 ? 5 : radius < 0.8 ? 2 : radius < 1 ? 1 : 4;
      shape.spin[index] = 1.4 / radius;
    }

    return shape;
  }

  function buildShapes() {
    shapes.otter = maskShape(drawOtter, 0.12);
    shapes.drift = driftShape();
    shapes.galaxy = galaxyShape();
    shapes.code = maskShape(drawCode, 0.14);
    shapes.shield = maskShape(drawShield, 0.12);
    shapes.blackhole = blackHoleShape();
    shapes.wellbloom = maskShape(drawBloom, 0.12);
    shapes.otterlink = maskShape(drawChat, 0.12);
    shapes.otteraui = maskShape(drawPhone, 0.1);
    shapes.rhythmabox = maskShape(drawWave, 0.16);
    shapes.ottersapex = maskShape(drawGauge, 0.12);
    shapes.totallysafe = maskShape(drawWarning, 0.12);
    shapes.library = maskShape(drawBook, 0.14);
    shapes.events = maskShape(drawCalendar, 0.1);
    shapes.inventoryhub = maskShape(drawDatabase, 0.12);
  }

  const sceneSettings = {
    otter: { place: 'hero', tilt: 0, spin: 0 },
    drift: { place: 'wide', tilt: 0.1, spin: 0.00005 },
    galaxy: { place: 'side', tilt: 0.55, spin: 0.00018 },
    code: { place: 'side', tilt: 0, spin: 0 },
    shield: { place: 'side', tilt: 0, spin: 0 },
    blackhole: { place: 'side', tilt: 0.32, spin: 0.0006 },
    project: { place: 'side', tilt: 0, spin: 0 }
  };

  function placement(name) {
    const narrow = isNarrow();
    const shortest = Math.min(width, height);

    if (name === 'hero') {
      return narrow
        ? { x: width * 0.5, y: height * 0.36, radius: Math.min(width * 0.46, height * 0.3), dim: 1 }
        : { x: width * 0.66, y: height * 0.48, radius: Math.min(width * 0.25, height * 0.42), dim: 1 };
    }

    if (name === 'wide') {
      return { x: width * 0.5, y: height * 0.5, radius: shortest * 0.42, dim: narrow ? 0.55 : 0.75 };
    }

    return narrow
      ? { x: width * 0.5, y: height * 0.42, radius: Math.min(width * 0.4, height * 0.26), dim: 0.38 }
      : { x: width * 0.77, y: height * 0.5, radius: Math.min(width * 0.17, height * 0.33), dim: 1 };
  }

  function setScene(name) {
    if (!shapes[name] || name === scene) {
      return;
    }

    scene = name;

    const settings = sceneSettings[name] || sceneSettings.project;
    const shape = shapes[name];
    const now = performance.now();

    tiltTarget = settings.tilt;
    spinSpeed = settings.spin;
    Object.assign(stageTarget, placement(settings.place));

    for (let index = 0; index < count; index++) {
      targetX[index] = shape.x[index];
      targetY[index] = shape.y[index];
      targetZ[index] = shape.z[index];
      spins[index] = shape.spin[index];
      nextColors[index] = shape.color[index];
      wakes[index] = now + (reducedMotion ? 0 : Math.random() * 600);

      if (!reducedMotion) {
        velocityX[index] += positionX[index] * 0.012 + random(-0.006, 0.006);
        velocityY[index] += positionY[index] * 0.012 + random(-0.006, 0.006);
        velocityZ[index] -= random(0.004, 0.02);
      }
    }

    scramble($('#hudName'), sceneLabels[name] || name.toUpperCase());

    if (reducedMotion) {
      snapToTargets();
      Object.assign(stage, stageTarget);
      tilt = tiltTarget;
      draw(now);
    }
  }

  function snapToTargets() {
    for (let index = 0; index < count; index++) {
      positionX[index] = targetX[index];
      positionY[index] = targetY[index];
      positionZ[index] = targetZ[index];
      colors[index] = nextColors[index];
    }
  }

  function scatterStart() {
    for (let index = 0; index < count; index++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(random(-1, 1));
      const radius = random(2, 5);

      positionX[index] = Math.sin(phi) * Math.cos(theta) * radius;
      positionY[index] = Math.cos(phi) * radius;
      positionZ[index] = Math.sin(phi) * Math.sin(theta) * radius;
      targetX[index] = positionX[index];
      targetY[index] = positionY[index];
      targetZ[index] = positionZ[index];
      sizes[index] = random(0.5, 1.7);
      colors[index] = Math.random() > 0.8 ? 1 : 0;
      nextColors[index] = colors[index];
    }

    for (let index = 0; index < 340; index++) {
      backdrop.push({
        x: Math.random(),
        y: Math.random(),
        depth: Math.random(),
        phase: Math.random() * Math.PI * 2,
        warm: Math.random() > 0.85
      });
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const settings = sceneSettings[scene] || sceneSettings.project;
    Object.assign(stageTarget, placement(scene ? settings.place : 'hero'));

    if (!stage.radius) {
      Object.assign(stage, stageTarget);
    }

    if (reducedMotion) {
      Object.assign(stage, stageTarget);
      draw(performance.now());
    }
  }

  function update(now, step) {
    const spring = 0.032 * step;
    const damping = Math.pow(0.84, step);
    const cosine = Math.cos(spinAngle);
    const sine = Math.sin(spinAngle);
    const pointerRadius = isNarrow() ? 0 : 130;

    spinAngle += spinSpeed * 16.7 * step;

    for (let index = 0; index < count; index++) {
      if (now < wakes[index]) {
        velocityX[index] *= damping;
        velocityY[index] *= damping;
        velocityZ[index] *= damping;
      } else {
        colors[index] = nextColors[index];

        let goalX = targetX[index];
        let goalZ = targetZ[index];

        if (spins[index] !== 0) {
          const angle = spinAngle * spins[index];
          const c = spins[index] === 1 ? cosine : Math.cos(angle);
          const s = spins[index] === 1 ? sine : Math.sin(angle);

          goalX = targetX[index] * c - targetZ[index] * s;
          goalZ = targetX[index] * s + targetZ[index] * c;
        }

        velocityX[index] = (velocityX[index] + (goalX - positionX[index]) * spring) * damping;
        velocityY[index] = (velocityY[index] + (targetY[index] - positionY[index]) * spring) * damping;
        velocityZ[index] = (velocityZ[index] + (goalZ - positionZ[index]) * spring) * damping;
      }

      if (pointerRadius) {
        const dx = screenX[index] - pointerX;
        const dy = screenY[index] - pointerY;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared < pointerRadius * pointerRadius && distanceSquared > 1) {
          const distance = Math.sqrt(distanceSquared);
          const force = (1 - distance / pointerRadius) * 0.035 * step;

          velocityX[index] += dx / distance * force;
          velocityY[index] += dy / distance * force;
          velocityZ[index] -= force * 0.6;
        }
      }

      positionX[index] += velocityX[index] * step;
      positionY[index] += velocityY[index] * step;
      positionZ[index] += velocityZ[index] * step;
    }
  }

  function draw(now) {
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = 'rgba(6,5,10,0.6)';
    context.fillRect(0, 0, width, height);

    lookX += (lookTargetX - lookX) * 0.05;
    lookY += (lookTargetY - lookY) * 0.05;
    tilt += (tiltTarget - tilt) * 0.04;
    stage.x += (stageTarget.x - stage.x) * 0.05;
    stage.y += (stageTarget.y - stage.y) * 0.05;
    stage.radius += (stageTarget.radius - stage.radius) * 0.05;
    stage.dim += (stageTarget.dim - stage.dim) * 0.05;

    const idle = reducedMotion ? 0 : Math.sin(now * 0.00022) * 0.28;
    const yaw = idle + lookX * 0.6;
    const pitch = tilt + lookY * 0.3;
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const focal = 2.8;
    const fade = 1 - explode;

    yawDegrees = yaw * 180 / Math.PI;

    context.globalCompositeOperation = 'lighter';

    for (const star of backdrop) {
      const twinkle = reducedMotion ? 0.7 : 0.45 + Math.sin(now * 0.0012 + star.phase) * 0.35;
      const x = ((star.x * width - yaw * 60 * star.depth) % width + width) % width;
      const y = star.y * height - window.scrollY * 0.05 * star.depth;
      const wrappedY = (y % height + height) % height;

      context.globalAlpha = twinkle * (0.25 + star.depth * 0.45);
      context.fillStyle = star.warm ? cssPalette[2] : cssPalette[0];
      context.fillRect(x, wrappedY, 0.6 + star.depth, 0.6 + star.depth);
    }

    for (let index = 0; index < count; index++) {
      const x = positionX[index] * (1 + explode * 1.2);
      const y = positionY[index] * (1 + explode * 1.2);
      const z = positionZ[index] - explode * 0.5;

      const rotatedX = x * cosYaw - z * sinYaw;
      const rotatedZ = x * sinYaw + z * cosYaw;
      const rotatedY = y * cosPitch - rotatedZ * sinPitch;
      const depth = y * sinPitch + rotatedZ * cosPitch;
      const perspective = focal / (focal + depth);

      if (perspective <= 0 || perspective > 6) {
        screenX[index] = -9999;
        continue;
      }

      const projectedX = stage.x + rotatedX * perspective * stage.radius;
      const projectedY = stage.y + rotatedY * perspective * stage.radius;
      const previousX = screenX[index];
      const previousY = screenY[index];

      screenX[index] = projectedX;
      screenY[index] = projectedY;

      if (projectedX < -40 || projectedX > width + 40 || projectedY < -40 || projectedY > height + 40) {
        continue;
      }

      const alpha = clamp((perspective - 0.45) * 0.9) * stage.dim * fade;

      if (alpha < 0.02) {
        continue;
      }

      const size = sizes[index] * perspective * (isNarrow() ? 0.9 : 1.15);
      const colour = colors[index];
      const travelX = projectedX - previousX;
      const travelY = projectedY - previousY;
      const travel = Math.abs(travelX) + Math.abs(travelY);

      context.globalAlpha = alpha;

      if (travel > 14 && travel < 260 && !reducedMotion) {
        context.globalAlpha = alpha * 0.45;
        context.strokeStyle = cssPalette[colour];
        context.lineWidth = size * 0.7;
        context.beginPath();
        context.moveTo(previousX, previousY);
        context.lineTo(projectedX, projectedY);
        context.stroke();
      } else {
        context.fillStyle = cssPalette[colour];
        context.fillRect(projectedX - size / 2, projectedY - size / 2, size, size);
      }

      if (index % 29 === 0) {
        const glow = size * 9;

        context.globalAlpha = alpha * 0.5;
        context.drawImage(sprites[colour], projectedX - glow, projectedY - glow, glow * 2, glow * 2);
      }
    }

    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
  }

  function frame(now) {
    const step = clamp((now - lastTime) / 16.7, 0.2, 3);
    lastTime = now;

    if (!document.hidden) {
      update(now, step);
      draw(now);
    }

    requestAnimationFrame(frame);
  }

  function onPointer(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
    lookTargetX = (event.clientX / width - 0.5) * 2;
    lookTargetY = (event.clientY / height - 0.5) * 2;
  }

  function setExplode(value) {
    explode = reducedMotion ? 0 : value;

    if (reducedMotion) {
      draw(performance.now());
    }
  }

  buildShapes();
  scatterStart();
  resize();

  window.addEventListener('resize', resize);

  if (finePointer) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', () => {
      pointerX = -9999;
      pointerY = -9999;
      lookTargetX = 0;
      lookTargetY = 0;
    });
  }

  if (reducedMotion) {
    draw(performance.now());
  } else {
    requestAnimationFrame(frame);
  }

  return {
    setScene,
    setExplode,
    count,
    yaw: () => yawDegrees
  };
}

const heroTitle = $('.hero-title');
const heroDot = heroTitle.querySelector('.dot');
const heroLetters = heroTitle.firstChild.textContent;

heroTitle.textContent = '';

[...heroLetters].forEach((letter, index) => {
  const span = document.createElement('span');
  span.className = 'ch';
  span.style.setProperty('--i', index);
  span.textContent = letter;
  heroTitle.append(span);
});

heroDot.classList.add('ch');
heroDot.style.setProperty('--i', heroLetters.length);
heroTitle.append(heroDot);

function wrapWords(node, className, counter, masked) {
  [...node.childNodes].forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment();

      child.textContent.split(/(\s+)/).filter(Boolean).forEach(part => {
        if (/^\s+$/.test(part)) {
          fragment.append(' ');
          return;
        }

        const word = document.createElement('span');
        word.className = className;

        if (masked) {
          const inner = document.createElement('span');
          inner.style.setProperty('--n', counter.value++);
          inner.textContent = part;
          word.append(inner);
        } else {
          word.style.setProperty('--n', counter.value++);
          word.textContent = part;
        }

        fragment.append(word);
      });

      child.replaceWith(fragment);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      wrapWords(child, className, counter, masked);
    }
  });
}

wrapWords($('.manifesto-text'), 'w', { value: 0 }, false);
$$('.reveal-words').forEach(heading => wrapWords(heading, 'wd', { value: 0 }, true));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add('in');

    if (entry.target.classList.contains('kicker') && !entry.target.closest('.stage')) {
      scramble(entry.target, entry.target.dataset.text);
    }

    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

$$('main .kicker').forEach(kicker => {
  kicker.dataset.text = kicker.textContent;
});

$$('.reveal').forEach(element => revealObserver.observe(element));

if (reducedMotion) {
  $$('.reveal').forEach(element => element.classList.add('in'));
}

const sections = $$('main [data-scene]');
const rows = $$('.row');
let hoveredProject = null;
let sceneQueued = false;

function pickScene() {
  sceneQueued = false;

  const middle = window.innerHeight * 0.5;
  let current = sections[0];

  sections.forEach(section => {
    const bounds = section.getBoundingClientRect();

    if (bounds.top <= middle) {
      current = section;
    }
  });

  universe.setExplode(clamp(window.scrollY / (window.innerHeight * 0.85)) * (current === sections[0] ? 1 : 0));

  if (current.dataset.scene !== 'work') {
    rows.forEach(row => row.classList.remove('active'));
    universe.setScene(current.dataset.scene);
    return;
  }

  let focus = null;

  if (hoveredProject) {
    focus = rows.find(row => row.dataset.project === hoveredProject);
  } else {
    let closest = Infinity;

    rows.forEach(row => {
      const bounds = row.getBoundingClientRect();
      const distance = Math.abs(bounds.top + bounds.height / 2 - middle);

      if (distance < closest) {
        closest = distance;
        focus = row;
      }
    });
  }

  rows.forEach(row => row.classList.toggle('active', row === focus && !hoveredProject));

  if (focus) {
    universe.setScene(focus.dataset.project);
  }
}

function queueScene() {
  if (!sceneQueued) {
    sceneQueued = true;
    requestAnimationFrame(pickScene);
  }
}

rows.forEach(row => {
  row.addEventListener('pointerenter', () => {
    if (!finePointer) {
      return;
    }

    hoveredProject = row.dataset.project;
    queueScene();
  });

  row.addEventListener('pointerleave', () => {
    hoveredProject = null;
    queueScene();
  });
});

const progress = $('#progress');

function paintProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
}

window.addEventListener('scroll', () => {
  paintProgress();
  queueScene();
}, { passive: true });

window.addEventListener('resize', queueScene);

const hudYaw = $('#hudYaw');

function paintHud() {
  const degrees = ((universe.yaw() % 360) + 360) % 360;
  hudYaw.textContent = 'YAW ' + degrees.toFixed(1).padStart(5, '0') + '°';
  setTimeout(paintHud, 120);
}

const topbar = $('.topbar');
const menuButton = $('#menuButton');

menuButton.addEventListener('click', () => {
  const open = topbar.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

$$('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    topbar.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    topbar.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

const dialog = $('#projectDialog');
const dialogClose = $('#dialogClose');
let previousFocus = null;

function openProject(key) {
  const project = projects[key];

  if (!project) {
    return;
  }

  previousFocus = document.activeElement;
  $('#dialogTitle').textContent = project.title;
  $('#dialogCategory').textContent = project.category;
  $('#dialogDescription').textContent = project.description;

  $('#dialogPoints').replaceChildren(...project.points.map(point => {
    const item = document.createElement('li');
    item.textContent = point;
    return item;
  }));

  const projectLink = $('#dialogProjectLink');
  projectLink.hidden = !project.url;
  if (project.url) projectLink.href = project.url;

  $('#dialogTags').replaceChildren(...project.tags.map(tag => {
    const item = document.createElement('span');
    item.textContent = tag;
    return item;
  }));

  dialog.showModal();
}

rows.forEach(row => {
  row.addEventListener('click', () => openProject(row.dataset.project));
});

dialogClose.addEventListener('click', () => dialog.close());

dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    dialog.close();
  }
});

dialog.addEventListener('close', () => {
  if (previousFocus?.isConnected) {
    previousFocus.focus();
  }
});

if (finePointer && !reducedMotion) {
  $$('.stack-row').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--mx', (event.clientX - bounds.left) + 'px');
      card.style.setProperty('--my', (event.clientY - bounds.top) + 'px');
    });
  });

  $$('.cta').forEach(link => {
    link.addEventListener('pointermove', event => {
      const bounds = link.getBoundingClientRect();
      link.style.setProperty('--tx', ((event.clientX - bounds.left - bounds.width / 2) * 0.3) + 'px');
      link.style.setProperty('--ty', ((event.clientY - bounds.top - bounds.height / 2) * 0.4) + 'px');
    });

    link.addEventListener('pointerleave', () => {
      link.style.setProperty('--tx', '0px');
      link.style.setProperty('--ty', '0px');
    });
  });
}

const preloader = $('#preloader');
const preloaderCount = $('#preloaderCount');
const introStart = performance.now();

function runIntro(now) {
  const value = Math.round(clamp((now - introStart) / (reducedMotion ? 1 : 1100)) * 100);
  preloaderCount.textContent = String(value).padStart(3, '0');

  if (value < 100) {
    requestAnimationFrame(runIntro);
    return;
  }

  preloader.classList.add('done');
  document.body.classList.add('loaded');
  pickScene();
  paintProgress();
  paintHud();
}

requestAnimationFrame(runIntro);

'use strict';

(() => {
  const canvas = document.getElementById('galaxyCanvas');

  if (!canvas) {
    return;
  }

  const context = canvas.getContext('2d', { alpha: true });

  if (!context) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const shapeCanvas = document.createElement('canvas');
  const shapeContext = shapeCanvas.getContext('2d');
  const shapePath = new Path2D(
    'M 104 387 C 154 370 208 377 274 385 ' +
    'C 331 343 367 300 441 271 ' +
    'C 493 249 552 210 615 216 ' +
    'C 627 201 643 186 659 181 ' +
    'C 677 174 685 181 687 196 ' +
    'C 724 172 763 173 796 190 ' +
    'C 811 177 824 183 833 199 ' +
    'C 852 207 865 220 883 242 ' +
    'C 898 248 920 256 920 270 ' +
    'Q 920 284 901 287 ' +
    'C 880 292 862 290 840 298 ' +
    'C 796 317 764 345 734 379 ' +
    'C 706 413 647 439 593 451 ' +
    'C 532 469 473 473 415 461 ' +
    'C 365 450 321 446 294 431 ' +
    'C 233 421 175 412 104 387 Z'
  );

  // Each particle has a place in the final picture.
  // The shape is only used to position them. It never gets drawn.
  const particleColors = [
    [232, 243, 255],
    [182, 224, 255],
    [109, 189, 255],
    [255, 212, 173],
    [255, 169, 123],
    [188, 171, 255]
  ];

  const highlights = [
    { x: 784, y: 236, radius: 2.8 },
    { x: 914, y: 269, radius: 3.2 },
    { x: 665, y: 190, radius: 2.2 },
    { x: 828, y: 197, radius: 2.0 },
    { x: 575, y: 305, radius: 2.4 },
    { x: 448, y: 379, radius: 2.0 },
    { x: 350, y: 505, radius: 2.6 },
    { x: 667, y: 492, radius: 2.1 },
    { x: 160, y: 389, radius: 2.0 }
  ];

  const whiskers = [
    [[857, 271], [965, 246]],
    [[864, 279], [980, 280]],
    [[857, 287], [952, 313]]
  ];

  let width = 0;
  let height = 0;
  let ratio = 1;
  let scale = 1;
  let centerX = 0;
  let centerY = 0;
  let particles = [];
  let sky = [];
  let ready = false;
  let animationId = null;
  let startedAt = null;
  let lastFrame = 0;
  let mouseX = 0;
  let mouseY = 0;
  let smoothX = 0;
  let smoothY = 0;

  const duration = 3000;
  const easeOut = value => 1 - Math.pow(1 - Math.min(1, value), 4);

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function addParticle(x, y, size, glow, kind = 'body') {
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    const alpha = randomBetween(0.42, 0.97);

    particles.push({
      x,
      y,
      size,
      glow,
      kind,
      color,
      alpha,
      fromX: randomBetween(-120, 1120),
      fromY: randomBetween(-130, 780),
      phase: randomBetween(0, Math.PI * 2)
    });
  }

  function addCurve(points, count, spread, glowChance) {
    for (let index = 0; index < count; index++) {
      const segment = Math.random() * (points.length - 1);
      const left = Math.floor(segment);
      const right = Math.min(points.length - 1, left + 1);
      const amount = segment - left;

      const x = points[left][0] * (1 - amount) + points[right][0] * amount;
      const y = points[left][1] * (1 - amount) + points[right][1] * amount;

      addParticle(
        x + randomBetween(-spread, spread),
        y + randomBetween(-spread, spread),
        randomBetween(0.45, 1.85),
        Math.random() < glowChance,
        'trail'
      );
    }
  }

  function makeOtter() {
    particles = [];

    if (!shapeContext) {
      return;
    }

    // More stars where the light naturally catches the body.
    // No solid silhouettes, outlines, or visible tracing lines.
    let attempts = 0;

    while (particles.length < 4300 && attempts < 42000) {
      attempts++;

      const x = randomBetween(100, 925);
      const y = randomBetween(176, 477);

      if (!shapeContext.isPointInPath(shapePath, x, y)) {
        continue;
      }

      const centralLight = Math.exp(
        -Math.pow((x - 550) / 195, 2) -
        Math.pow((y - 344) / 100, 2)
      );

      const faceLight = Math.exp(
        -Math.pow((x - 792) / 94, 2) -
        Math.pow((y - 262) / 67, 2)
      );

      const density = 0.52 + centralLight * 0.38 + faceLight * 0.22;

      if (Math.random() > density) {
        continue;
      }

      const glow = Math.random() < 0.032 + centralLight * 0.08;
      const size = glow ? randomBetween(1.45, 3.2) : randomBetween(0.35, 1.28);

      addParticle(x, y, size, glow);
    }

    // Extra star currents give the silhouette a galactic texture.
    addCurve(
      [[112, 390], [215, 387], [322, 375], [422, 327], [536, 292], [659, 260], [809, 248], [916, 270]],
      670,
      17,
      0.07
    );

    addCurve(
      [[244, 404], [342, 430], [451, 458], [576, 445], [691, 416], [785, 335], [889, 282]],
      490,
      12,
      0.06
    );

    // Ears, paws and whiskers need their own little constellations.
    addCurve([[638, 203], [660, 178], [683, 192]], 74, 3, 0.12);
    addCurve([[796, 191], [817, 181], [838, 201]], 74, 3, 0.12);
    addCurve([[384, 442], [355, 488], [348, 507], [375, 511], [418, 458]], 120, 3, 0.10);
    addCurve([[646, 388], [637, 445], [651, 491], [686, 494], [691, 455], [716, 394]], 146, 3, 0.10);

    whiskers.forEach(line => addCurve(line, 64, 1.4, 0.09));

    // A few warm stars keep the artwork from feeling flat blue.
    for (let index = 0; index < 440; index++) {
      const angle = randomBetween(0, Math.PI * 2);
      const distance = Math.sqrt(Math.random());

      addParticle(
        565 + Math.cos(angle) * distance * 138,
        345 + Math.sin(angle) * distance * 83,
        randomBetween(0.5, 1.7),
        Math.random() < 0.12,
        'core'
      );
    }

    highlights.forEach(point => {
      for (let index = 0; index < 18; index++) {
        addParticle(
          point.x + randomBetween(-8, 8),
          point.y + randomBetween(-8, 8),
          randomBetween(0.8, 2.25),
          index % 4 === 0,
          'feature'
        );
      }
    });
  }

  function makeSky() {
    sky = [];

    const count = Math.min(480, Math.round(width * height / 2700));

    for (let index = 0; index < count; index++) {
      sky.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: randomBetween(0.3, 1.35),
        alpha: randomBetween(0.12, 0.7),
        phase: randomBetween(0, Math.PI * 2),
        warm: Math.random() < 0.15
      });
    }
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();

    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const compact = width < 780;
    scale = Math.min(
      width * (compact ? 1.13 : 0.82) / 1000,
      height * (compact ? 0.9 : 0.83) / 640
    );

    centerX = width * (compact ? 0.51 : 0.52);
    centerY = height * (compact ? 0.47 : 0.51);

    makeSky();
    draw(performance.now());
  }

  function getPosition(particle, formation, time) {
    const x = particle.fromX + (particle.x - particle.fromX) * formation;
    const y = particle.fromY + (particle.y - particle.fromY) * formation;

    const ripple = reducedMotion.matches
      ? 0
      : Math.sin(time * 0.0006 + particle.phase) * 1.25;

    return {
      x: centerX + (x - 505 + ripple) * scale + smoothX,
      y: centerY + (y - 324 - ripple) * scale + smoothY
    };
  }

  function drawNebula() {
    const radius = Math.min(width, height) * 0.57;
    const glow = context.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );

    glow.addColorStop(0, 'rgba(91, 106, 166, 0.09)');
    glow.addColorStop(0.35, 'rgba(55, 82, 139, 0.065)');
    glow.addColorStop(1, 'rgba(10, 15, 30, 0)');

    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  }

  function drawBackground(time) {
    for (const star of sky) {
      const twinkle = reducedMotion.matches
        ? 0.85
        : 0.68 + Math.sin(time * 0.0009 + star.phase) * 0.28;

      const alpha = star.alpha * twinkle;
      context.fillStyle = star.warm
        ? 'rgba(255, 186, 136, ' + alpha + ')'
        : 'rgba(194, 221, 255, ' + alpha + ')';

      context.fillRect(star.x, star.y, star.size, star.size);
    }
  }

  function drawGlow(x, y, radius, color, opacity) {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, 'rgba(' + color.join(',') + ',' + opacity + ')');
    gradient.addColorStop(0.21, 'rgba(' + color.join(',') + ',' + opacity * 0.31 + ')');
    gradient.addColorStop(1, 'rgba(' + color.join(',') + ',0)');

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  function drawParticles(formation, time) {
    smoothX += (mouseX - smoothX) * 0.05;
    smoothY += (mouseY - smoothY) * 0.05;

    for (const particle of particles) {
      const point = getPosition(particle, formation, time);

      if (particle.glow) {
        drawGlow(point.x, point.y, particle.size * scale * 7 + 6, particle.color, 0.21);
      }

      const shimmer = reducedMotion.matches
        ? 1
        : 0.9 + Math.sin(time * 0.002 + particle.phase) * 0.10;

      context.fillStyle = 'rgba(' + particle.color.join(',') + ',' + particle.alpha * shimmer + ')';
      context.beginPath();
      context.arc(
        point.x,
        point.y,
        Math.max(0.33, particle.size * scale),
        0,
        Math.PI * 2
      );
      context.fill();
    }
  }

  function drawBigStars(formation, time) {
    if (formation < 0.68) {
      return;
    }

    const opacity = Math.min(1, (formation - 0.68) / 0.32);

    for (const star of highlights) {
      const point = getPosition({
        x: star.x,
        y: star.y,
        fromX: star.x,
        fromY: star.y,
        phase: 0
      }, 1, time);

      const radius = star.radius * Math.max(0.65, scale);

      drawGlow(point.x, point.y, radius * 14, [172, 209, 255], opacity * 0.33);

      context.fillStyle = 'rgba(245, 250, 255,' + opacity + ')';
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = 'rgba(196, 232, 255,' + opacity * 0.35 + ')';
      context.lineWidth = 0.7;
      context.beginPath();
      context.moveTo(point.x - radius * 4, point.y);
      context.lineTo(point.x + radius * 4, point.y);
      context.moveTo(point.x, point.y - radius * 4);
      context.lineTo(point.x, point.y + radius * 4);
      context.stroke();
    }
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    drawNebula();
    drawBackground(time);

    const elapsed = startedAt === null ? duration : time - startedAt;
    const progress = reducedMotion.matches ? 1 : Math.min(1, elapsed / duration);
    const formation = easeOut(progress);

    drawParticles(formation, time);
    drawBigStars(formation, time);
  }

  function frame(time) {
    animationId = null;

    if (document.hidden) {
      return;
    }

    if (startedAt === null) {
      startedAt = time;
    }

    // Around 24 fps is plenty for slow-moving stars.
    if (time - lastFrame >= 40 || reducedMotion.matches) {
      draw(time);
      lastFrame = time;
    }

    if (!reducedMotion.matches) {
      animationId = requestAnimationFrame(frame);
    }
  }

  function start() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    if (!document.hidden) {
      animationId = requestAnimationFrame(frame);
    }
  }

  let resizeFrame = null;

  window.addEventListener('resize', () => {
    if (resizeFrame !== null) {
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = null;
      resize();
    });
  }, { passive: true });

  if (finePointer.matches) {
    canvas.closest('.galaxy-hero')?.addEventListener('pointermove', event => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 12;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 9;
    }, { passive: true });
  }

  document.addEventListener('visibilitychange', start);

  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', () => {
      startedAt = null;
      start();
    });
  }

  makeOtter();
  resize();
  ready = true;

  if (ready) {
    start();
  }
})();

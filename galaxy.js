'use strict';

(() => {
  const canvas = document.getElementById('galaxyCanvas');

  if (!canvas) {
    return;
  }

  const context = canvas.getContext('2d');

  if (!context) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sceneIds = ['top', 'work', 'about', 'stack', 'next', 'contact'];
  const maskWidth = 720;
  const maskHeight = 760;
  const particleCount = window.innerWidth < 760 ? 3200 : 7600;
  const masks = {};
  const stars = [];
  const backgroundStars = [];

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let activeScene = 0;
  let sceneStart = 0;
  let animationId = null;
  let lastFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let pointerSmoothX = 0;
  let pointerSmoothY = 0;
  let currentLayout = null;
  let previousLayout = null;

  // This is the same constellation throughout the page.
  // The stars just find different places as you scroll.
  const palette = [
    [242, 246, 255],
    [155, 204, 255],
    [102, 182, 242],
    [255, 198, 147],
    [236, 226, 218],
    [97, 211, 225],
    [190, 167, 244]
  ];

  const ease = value => {
    const progress = Math.max(0, Math.min(1, value));
    return progress * progress * (3 - 2 * progress);
  };

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function ellipse(ctx, x, y, radiusX, radiusY, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function strokePath(ctx, points, color, size) {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point[0], point[1]);
      } else {
        ctx.lineTo(point[0], point[1]);
      }
    });

    ctx.stroke();
  }

  // Paint the colour map from the actual otter picture.
  // The pixels only guide star placement. The picture never shows on the page.
  function drawOtter(ctx) {
    ctx.clearRect(0, 0, maskWidth, maskHeight);

    if (typeof otterReference === 'undefined') {
      return;
    }

    const colours = [
      '',
      '#302832', // Dark eyes, nose and tiny details.
      '#a0a9d2', // Fur, lit by the blue stars.
      '#777ba9', // Softer shadows in the fur.
      '#f1f1ff', // The muzzle and chest.
      '#e2d8ee', // Highlights.
      '#5fc4d7', // Water and splashes.
      '#79bbd4', // Deeper water.
      '#d89894'  // A little colour inside the mouth.
    ];

    const pixels = atob(otterReference.pixels);
    const cellWidth = maskWidth / otterReference.width;
    const cellHeight = (maskHeight - 154) / otterReference.height;
    const top = 77;

    for (let row = 0; row < otterReference.height; row++) {
      for (let col = 0; col < otterReference.width; col++) {
        const index = row * otterReference.width + col;
        const byte = pixels.charCodeAt(Math.floor(index / 2)) || 0;
        const colour = index % 2 === 0 ? byte >> 4 : byte & 15;

        if (colour === 0) {
          continue;
        }

        ctx.fillStyle = colours[colour] || colours[2];
        ctx.fillRect(
          col * cellWidth,
          top + row * cellHeight,
          cellWidth + 0.1,
          cellHeight + 0.1
        );
      }
    }
  }

  function drawCode(ctx) {
    ctx.clearRect(0, 0, maskWidth, maskHeight);
    ctx.fillStyle = '#d3dff9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 230px monospace';
    ctx.fillText('</>', 360, 385);
  }

  function drawPaw(ctx) {
    ctx.clearRect(0, 0, maskWidth, maskHeight);
    ellipse(ctx, 357, 470, 180, 146, '#c5b7ee');
    ellipse(ctx, 178, 284, 64, 90, '#f4eefc');
    ellipse(ctx, 299, 223, 65, 94, '#a8d5fa');
    ellipse(ctx, 429, 220, 65, 94, '#f4c69c');
    ellipse(ctx, 546, 282, 64, 90, '#a6e4ec');
  }

  function drawOrbit(ctx) {
    ctx.clearRect(0, 0, maskWidth, maskHeight);
    ctx.strokeStyle = '#bcdfff';
    ctx.lineWidth = 17;

    for (const angle of [-0.7, 0.7, 1.55]) {
      ctx.save();
      ctx.translate(360, 380);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 265, 105, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ellipse(ctx, 360, 380, 67, 67, '#f4e6f9');
    ellipse(ctx, 133, 280, 28, 28, '#9bccf7');
    ellipse(ctx, 597, 485, 25, 25, '#e9ad84');
  }

  function drawCloud(ctx) {
    ctx.clearRect(0, 0, maskWidth, maskHeight);
    ellipse(ctx, 261, 387, 130, 118, '#b1d8f5');
    ellipse(ctx, 374, 318, 164, 145, '#f1f5fc');
    ellipse(ctx, 495, 394, 130, 112, '#9dd4ec');
    ctx.fillStyle = '#c5e8f7';
    ctx.fillRect(195, 393, 362, 107);

    // A shield in the cloud for the cloud-security direction.
    ctx.fillStyle = '#90c7f2';
    ctx.beginPath();
    ctx.moveTo(361, 326);
    ctx.lineTo(441, 354);
    ctx.lineTo(433, 443);
    ctx.quadraticCurveTo(416, 490, 361, 521);
    ctx.quadraticCurveTo(308, 490, 287, 443);
    ctx.lineTo(282, 353);
    ctx.closePath();
    ctx.fill();

    strokePath(ctx, [[322, 424], [351, 452], [406, 391]], '#f5f9ff', 16);
  }

  function drawSpark(ctx) {
    ctx.clearRect(0, 0, maskWidth, maskHeight);
    ctx.save();
    ctx.translate(360, 380);

    for (let index = 0; index < 10; index++) {
      ctx.rotate(Math.PI / 5);
      ellipse(ctx, 0, -165, 35, 126, index % 3 === 0 ? '#f6d3af' : '#b2cbfb');
    }

    ellipse(ctx, 0, 0, 95, 95, '#f8f2ff');
    ctx.restore();
  }

  const drawFunctions = [
    drawOtter,
    drawCode,
    drawPaw,
    drawOrbit,
    drawCloud,
    drawSpark
  ];

  function chooseColor(red, green, blue) {
    if (green > red * 1.12 && blue > red * 1.13) {
      return 5;
    }

    if (red > blue * 1.21 && red > green * 1.09) {
      return 3;
    }

    if (red < 100 && green < 100 && blue < 105) {
      return 6;
    }

    if (red > 216 && green > 210 && blue > 202) {
      return 0;
    }

    // A handful of warm stars keeps the whole thing from going flat blue.
    if (random(0, 1) < 0.07) {
      return 3;
    }

    return Math.floor(random(0, 3));
  }

  function makeMask(drawFunction) {
    const offscreen = document.createElement('canvas');
    offscreen.width = maskWidth;
    offscreen.height = maskHeight;

    const ctx = offscreen.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      return [];
    }

    drawFunction(ctx);

    const pixels = ctx.getImageData(0, 0, maskWidth, maskHeight).data;
    const positions = [];
    let attempts = 0;

    while (positions.length < particleCount && attempts < particleCount * 85) {
      attempts++;

      const x = Math.floor(random(10, maskWidth - 10));
      const y = Math.floor(random(12, maskHeight - 10));
      const pixelIndex = (y * maskWidth + x) * 4;
      const alpha = pixels[pixelIndex + 3];

      if (alpha < 50) {
        continue;
      }

      const red = pixels[pixelIndex];
      const green = pixels[pixelIndex + 1];
      const blue = pixels[pixelIndex + 2];
      const darkFeature = red < 95 && green < 95 && blue < 100;

      if (darkFeature && Math.random() > 0.21) {
        continue;
      }

      positions.push({
        x,
        y,
        color: chooseColor(red, green, blue),
        opacity: darkFeature ? 0.22 : random(0.5, 0.98)
      });
    }

    return positions;
  }

  function buildMasks() {
    drawFunctions.forEach((drawing, index) => {
      masks[index] = makeMask(drawing);
    });
  }

  function makeGlowSprite(color) {
    const texture = document.createElement('canvas');
    const ctx = texture.getContext('2d');
    texture.width = 64;
    texture.height = 64;

    if (!ctx) {
      return texture;
    }

    const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, 'rgba(' + color.join(',') + ',0.75)');
    glow.addColorStop(0.20, 'rgba(' + color.join(',') + ',0.25)');
    glow.addColorStop(1, 'rgba(' + color.join(',') + ',0)');

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 64, 64);

    return texture;
  }

  const sprites = palette.map(makeGlowSprite);

  function makeStars() {
    for (let index = 0; index < particleCount; index++) {
      const initial = masks[0][index % masks[0].length];

      stars.push({
        x: random(-150, maskWidth + 150),
        y: random(-150, maskHeight + 150),
        fromX: random(-150, maskWidth + 150),
        fromY: random(-150, maskHeight + 150),
        toX: initial.x,
        toY: initial.y,
        color: initial.color,
        fromColor: initial.color,
        toColor: initial.color,
        opacity: initial.opacity,
        fromOpacity: 0,
        toOpacity: initial.opacity,
        size: random(0.4, 1.6),
        bright: index % 21 === 0,
        phase: random(0, Math.PI * 2)
      });
    }

    for (let index = 0; index < 180; index++) {
      backgroundStars.push({
        x: Math.random(),
        y: Math.random(),
        size: random(0.4, 1.6),
        opacity: random(0.14, 0.60),
        phase: random(0, Math.PI * 2)
      });
    }
  }

  function resize() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function sceneLayout(index) {
    const mobile = width < 760;

    const centerX = index === 0
      ? width * (mobile ? 0.51 : 0.51)
      : width * (mobile ? 0.73 : index % 2 === 0 ? 0.22 : 0.77);

    const centerY = height * (mobile ? 0.53 : 0.53);
    const maxWidth = width * (mobile ? 0.75 : index === 0 ? 0.44 : 0.38);
    const maxHeight = height * (mobile ? 0.55 : index === 0 ? 0.70 : 0.64);

    return {
      centerX,
      centerY,
      scale: Math.min(maxWidth / maskWidth, maxHeight / maskHeight)
    };
  }

  function updateScene() {
    let next = 0;

    for (let index = 1; index < sceneIds.length; index++) {
      const element = document.getElementById(sceneIds[index]);

      if (element && element.getBoundingClientRect().top < height * 0.65) {
        next = index;
      }
    }

    if (next === activeScene) {
      return;
    }

    previousLayout = currentLayout || sceneLayout(activeScene);

    for (let index = 0; index < stars.length; index++) {
      const star = stars[index];
      const target = masks[next][index % masks[next].length];

      star.fromX = star.x;
      star.fromY = star.y;
      star.fromColor = star.color;
      star.fromOpacity = star.opacity;
      star.toX = target.x;
      star.toY = target.y;
      star.toColor = target.color;
      star.toOpacity = target.opacity;
    }

    activeScene = next;
    sceneStart = performance.now();
  }

  function paintBackground(time) {
    for (const star of backgroundStars) {
      const shimmer = reducedMotion.matches
        ? 1
        : 0.76 + Math.sin(time * 0.0007 + star.phase) * 0.24;

      context.fillStyle = 'rgba(201,222,255,' + star.opacity * shimmer + ')';
      context.fillRect(star.x * width, star.y * height, star.size, star.size);
    }
  }

  function paintConstellation(time) {
    const duration = activeScene === 0 ? 2900 : 1600;
    const progress = reducedMotion.matches
      ? 1
      : ease((time - sceneStart) / duration);

    const targetLayout = sceneLayout(activeScene);
    const originLayout = previousLayout || targetLayout;
    const layout = {
      centerX: originLayout.centerX + (targetLayout.centerX - originLayout.centerX) * progress,
      centerY: originLayout.centerY + (targetLayout.centerY - originLayout.centerY) * progress,
      scale: originLayout.scale + (targetLayout.scale - originLayout.scale) * progress
    };

    currentLayout = layout;

    const calm = activeScene !== 0;
    const strength = calm ? 0.43 : 1;

    pointerSmoothX += (pointerX - pointerSmoothX) * 0.035;
    pointerSmoothY += (pointerY - pointerSmoothY) * 0.035;

    for (const star of stars) {
      star.x = star.fromX + (star.toX - star.fromX) * progress;
      star.y = star.fromY + (star.toY - star.fromY) * progress;
      star.opacity = star.fromOpacity + (star.toOpacity - star.fromOpacity) * progress;

      if (progress >= 0.5) {
        star.color = star.toColor;
      }

      const drift = reducedMotion.matches
        ? 0
        : Math.sin(time * 0.00053 + star.phase) * 0.65;

      const x = layout.centerX + (star.x - maskWidth / 2 + drift) * layout.scale + pointerSmoothX;
      const y = layout.centerY + (star.y - maskHeight / 2 + drift) * layout.scale + pointerSmoothY;
      const color = palette[star.color];
      const opacity = star.opacity * strength;
      const radius = Math.max(0.35, star.size * layout.scale);

      if (star.bright) {
        const spriteSize = Math.max(7, radius * 9);
        context.globalAlpha = opacity * 0.6;
        context.drawImage(sprites[star.color], x - spriteSize, y - spriteSize, spriteSize * 2, spriteSize * 2);
        context.globalAlpha = 1;
      }

      context.fillStyle = 'rgba(' + color.join(',') + ',' + opacity + ')';
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  function render(time) {
    animationId = null;

    if (document.hidden) {
      return;
    }

    if (time - lastFrame > 34 || reducedMotion.matches) {
      context.clearRect(0, 0, width, height);
      paintBackground(time);
      paintConstellation(time);
      lastFrame = time;
    }

    if (!reducedMotion.matches) {
      animationId = requestAnimationFrame(render);
    }
  }

  function start() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    if (!document.hidden) {
      animationId = requestAnimationFrame(render);
    }
  }

  // Passive listeners keep page scrolling responsive.
  let scrollQueued = false;

  window.addEventListener('scroll', () => {
    if (scrollQueued) {
      return;
    }

    scrollQueued = true;

    requestAnimationFrame(() => {
      scrollQueued = false;
      updateScene();
    });
  }, { passive: true });

  window.addEventListener('resize', () => {
    resize();
    updateScene();
  }, { passive: true });

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', event => {
      pointerX = (event.clientX / width - 0.5) * 10;
      pointerY = (event.clientY / height - 0.5) * 8;
    }, { passive: true });
  }

  document.addEventListener('visibilitychange', start);

  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', start);
  }

  buildMasks();
  makeStars();
  resize();
  sceneStart = performance.now();
  updateScene();
  start();
})();

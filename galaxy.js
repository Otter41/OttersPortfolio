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
  const isMobile = window.innerWidth < 760;

  const particleCount = isMobile ? 2200 : 5100;
  const sceneIds = [
    'top',
    'statement',
    'work',
    'about',
    'stack',
    'next',
    'contact'
  ];

  const palette = [
    [245, 249, 255],
    [180, 223, 255],
    [98, 188, 254],
    [255, 195, 146],
    [190, 169, 245],
    [103, 223, 232]
  ];

  const stars = [];
  const backgroundStars = [];
  const scenePoints = [];
  const glowSprites = [];

  let width = 0;
  let height = 0;
  let activeScene = 0;
  let frameId = null;
  let lastFrame = 0;
  let entrance = true;
  let sceneChangedAt = 0;
  let previousScroll = window.scrollY;

  let pointerX = -1000;
  let pointerY = -1000;
  let pointerActive = false;

  const layout = {
    x: 0,
    y: 0,
    scale: 1
  };

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function chooseColor(warm = false) {
    if (warm) {
      return Math.random() < 0.65 ? 3 : 4;
    }

    return Math.floor(Math.random() * palette.length);
  }

  function makePoint(x, y, options = {}) {
    return {
      x,
      y,
      color: options.color ?? chooseColor(),
      alpha: options.alpha ?? random(0.55, 1),
      size: options.size ?? random(0.55, 1.45)
    };
  }

  // The otter pixels come from the reference picture.
  // No JPG or PNG is drawn on the page. They're just star positions.
  function makeOtterPoints() {
    const points = [];

    if (typeof otterReference === 'undefined') {
      return makeSpiralPoints();
    }

    const picture = atob(otterReference.pixels);
    const pictureWidth = otterReference.width;
    const pictureHeight = otterReference.height;

    let attempts = 0;

    while (points.length < particleCount && attempts < particleCount * 70) {
      attempts++;

      const column = Math.floor(random(0, pictureWidth));
      const row = Math.floor(random(0, pictureHeight));
      const pixelIndex = row * pictureWidth + column;
      const packed = picture.charCodeAt(Math.floor(pixelIndex / 2)) || 0;
      const tone = pixelIndex % 2 === 0 ? packed >> 4 : packed & 15;

      if (!tone) {
        continue;
      }

      // The dark eyes and nose should remain dark, not become white blobs.
      if (tone === 1 && Math.random() < 0.84) {
        continue;
      }

      let color = 1;

      if (tone === 2 || tone === 3) {
        color = Math.random() < 0.13 ? 3 : 2;
      } else if (tone === 4 || tone === 5) {
        color = Math.random() < 0.8 ? 0 : 4;
      } else if (tone === 6 || tone === 7) {
        color = Math.random() < 0.55 ? 5 : 2;
      } else if (tone === 8) {
        color = 3;
      }

      points.push(makePoint(
        ((column + random(-0.5, 0.5)) / pictureWidth - 0.5) * 2.1,
        ((row + random(-0.5, 0.5)) / pictureHeight - 0.5) * 1.7,
        {
          color,
          alpha: tone === 1 ? random(0.16, 0.35) : random(0.5, 1),
          size: Math.random() < 0.09 ? random(1.6, 2.6) : random(0.5, 1.35)
        }
      ));
    }

    return points;
  }

  // Soft strands of light, not giant letters pasted across the screen.
  function makeFlowPoints() {
    const points = [];

    for (let index = 0; index < particleCount; index++) {
      const t = Math.random();
      const strand = index % 4;

      const x = (t - 0.5) * 1.95;
      const wave = Math.sin(t * Math.PI * 2.45 + strand * 0.58) * 0.30;
      const y = wave + (strand - 1.5) * 0.075 + random(-0.12, 0.12);

      points.push(makePoint(x, y, {
        color: index % 13 === 0 ? 3 : index % 5 === 0 ? 5 : 1,
        alpha: random(0.37, 0.86)
      }));
    }

    return points;
  }

  // This is a loose three-armed galaxy.
  // Keeping it abstract feels a lot cleaner than the old giant paw.
  function makeSpiralPoints() {
    const points = [];

    for (let index = 0; index < particleCount; index++) {
      const arm = index % 3;
      const radius = Math.pow(Math.random(), 0.75) * 0.92;
      const angle = arm * Math.PI * 2 / 3 + radius * Math.PI * 4.3;

      points.push(makePoint(
        Math.cos(angle) * radius + random(-0.075, 0.075),
        Math.sin(angle) * radius * 0.72 + random(-0.055, 0.055),
        {
          color: radius < 0.24 ? 0 : arm === 1 && index % 8 === 0 ? 3 : 2,
          alpha: radius < 0.22 ? random(0.8, 1) : random(0.3, 0.8)
        }
      ));
    }

    return points;
  }

  function makeOrbitPoints() {
    const points = [];

    for (let index = 0; index < particleCount; index++) {
      const ring = index % 3;
      const angle = random(0, Math.PI * 2);
      const radius = 0.48 + ring * 0.19;
      const tilt = ring === 0 ? -0.54 : ring === 1 ? 0.42 : 1.12;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.38;
      const rotatedX = x * Math.cos(tilt) - y * Math.sin(tilt);
      const rotatedY = x * Math.sin(tilt) + y * Math.cos(tilt);

      points.push(makePoint(
        rotatedX + random(-0.045, 0.045),
        rotatedY + random(-0.045, 0.045),
        {
          color: ring === 1 ? 4 : ring === 2 ? 5 : 1,
          alpha: random(0.45, 0.9)
        }
      ));
    }

    return points;
  }

  // Connected clusters for the cloud-security chapter.
  function makeNetworkPoints() {
    const points = [];
    const nodes = [
      [-0.64, -0.18],
      [-0.26, -0.56],
      [0.45, -0.40],
      [0.76, 0.12],
      [0.23, 0.49],
      [-0.55, 0.41]
    ];

    for (let index = 0; index < particleCount; index++) {
      const point = nodes[index % nodes.length];
      const angle = random(0, Math.PI * 2);
      const distance = Math.pow(Math.random(), 1.8) * 0.22;

      points.push(makePoint(
        point[0] + Math.cos(angle) * distance,
        point[1] + Math.sin(angle) * distance,
        {
          color: index % 12 === 0 ? 3 : index % 3 === 0 ? 5 : 1,
          alpha: random(0.38, 0.92)
        }
      ));
    }

    return points;
  }

  // The final scene forms an accretion disk with an empty centre.
  function makeBlackHolePoints() {
    const points = [];

    for (let index = 0; index < particleCount; index++) {
      const angle = random(0, Math.PI * 2);
      const ring = Math.random() < 0.34;
      const radius = ring ? random(0.32, 0.38) : random(0.44, 1);

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.37;

      points.push(makePoint(
        x * 0.93 + y * 0.35,
        y * 0.93 - x * 0.35,
        {
          color: ring ? 0 : index % 5 === 0 ? 3 : 2,
          alpha: ring ? random(0.8, 1) : random(0.33, 0.82)
        }
      ));
    }

    return points;
  }

  function buildScenes() {
    scenePoints.push(makeOtterPoints());
    scenePoints.push(makeSpiralPoints());
    scenePoints.push(makeFlowPoints());
    scenePoints.push(makeSpiralPoints());
    scenePoints.push(makeOrbitPoints());
    scenePoints.push(makeNetworkPoints());
    scenePoints.push(makeBlackHolePoints());
  }

  function makeGlowSprites() {
    palette.forEach(color => {
      const texture = document.createElement('canvas');
      const textureContext = texture.getContext('2d');

      texture.width = 64;
      texture.height = 64;

      if (textureContext) {
        const gradient = textureContext.createRadialGradient(
          32, 32, 0,
          32, 32, 31
        );

        gradient.addColorStop(0, 'rgba(' + color.join(',') + ',0.95)');
        gradient.addColorStop(0.19, 'rgba(' + color.join(',') + ',0.36)');
        gradient.addColorStop(1, 'rgba(' + color.join(',') + ',0)');

        textureContext.fillStyle = gradient;
        textureContext.fillRect(0, 0, 64, 64);
      }

      glowSprites.push(texture);
    });
  }

  function makeStars() {
    for (let index = 0; index < particleCount; index++) {
      const point = scenePoints[0][index];
      const offset = reducedMotion.matches ? 0 : 0.45;

      stars.push({
        x: point.x + random(-offset, offset),
        y: point.y + random(-offset, offset),
        targetX: point.x,
        targetY: point.y,
        color: point.color,
        targetColor: point.color,
        alpha: point.alpha,
        targetAlpha: point.alpha,
        size: point.size,
        phase: random(0, Math.PI * 2),
        glow: index % 13 === 0,
        flare: index % 86 === 0,
        pushX: 0,
        pushY: 0
      });
    }

    for (let index = 0; index < 260; index++) {
      backgroundStars.push({
        x: Math.random(),
        y: Math.random(),
        size: random(0.35, 1.2),
        alpha: random(0.08, 0.56),
        phase: random(0, Math.PI * 2),
        warm: index % 17 === 0
      });
    }
  }

  function targetLayout(scene) {
    const mobile = width < 760;

    if (scene === 0) {
      return {
        x: width * 0.50,
        y: height * (mobile ? 0.50 : 0.52),
        scale: Math.min(
          width * (mobile ? 0.33 : 0.30),
          height * (mobile ? 0.36 : 0.50)
        )
      };
    }

    if (scene === 6) {
      return {
        x: width * (mobile ? 0.50 : 0.79),
        y: height * (mobile ? 0.26 : 0.52),
        scale: Math.min(
          width * (mobile ? 0.36 : 0.24),
          height * (mobile ? 0.27 : 0.37)
        )
      };
    }

    const positions = [
      [0.5, 0.5],
      [0.87, 0.52],
      [0.91, 0.54],
      [0.16, 0.57],
      [0.91, 0.52],
      [0.90, 0.56]
    ];

    const position = positions[scene];

    return {
      x: width * (mobile ? 0.85 : position[0]),
      y: height * (mobile ? 0.43 : position[1]),
      scale: Math.min(
        width * (mobile ? 0.23 : 0.18),
        height * (mobile ? 0.24 : 0.33)
      )
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    if (!layout.x) {
      const position = targetLayout(activeScene);
      layout.x = position.x;
      layout.y = position.y;
      layout.scale = position.scale;
    }
  }

  function setScene(nextScene) {
    if (nextScene === activeScene) {
      return;
    }

    activeScene = nextScene;
    sceneChangedAt = performance.now();
    entrance = false;

    const positions = scenePoints[nextScene];

    for (let index = 0; index < stars.length; index++) {
      const star = stars[index];
      const point = positions[index];

      star.targetX = point.x;
      star.targetY = point.y;
      star.targetColor = point.color;
      star.targetAlpha = point.alpha;
    }

    if (reducedMotion.matches) {
      settleInstantly();
      draw(performance.now());
    }
  }

  function checkScene() {
    let next = 0;

    for (let index = 1; index < sceneIds.length; index++) {
      const section = document.getElementById(sceneIds[index]);

      if (section && section.getBoundingClientRect().top < height * 0.48) {
        next = index;
      }
    }

    setScene(next);
  }

  function settleInstantly() {
    const position = targetLayout(activeScene);

    layout.x = position.x;
    layout.y = position.y;
    layout.scale = position.scale;

    stars.forEach(star => {
      star.x = star.targetX;
      star.y = star.targetY;
      star.color = star.targetColor;
      star.alpha = star.targetAlpha;
      star.pushX = 0;
      star.pushY = 0;
    });
  }

  function updateStars() {
    const position = targetLayout(activeScene);
    const speed = reducedMotion.matches ? 1 : 0.105;

    layout.x += (position.x - layout.x) * speed;
    layout.y += (position.y - layout.y) * speed;
    layout.scale += (position.scale - layout.scale) * speed;

    for (const star of stars) {
      star.x += (star.targetX - star.x) * speed;
      star.y += (star.targetY - star.y) * speed;
      star.alpha += (star.targetAlpha - star.alpha) * speed;

      if (star.color !== star.targetColor && Math.random() < 0.09) {
        star.color = star.targetColor;
      }

      star.pushX *= 0.82;
      star.pushY *= 0.82;
    }
  }

  function paintBackdrop(time) {
    for (const star of backgroundStars) {
      const flicker = reducedMotion.matches
        ? 0.8
        : 0.78 + Math.sin(time * 0.001 + star.phase) * 0.22;

      context.fillStyle = star.warm
        ? 'rgba(255,191,151,' + (star.alpha * flicker) + ')'
        : 'rgba(186,216,255,' + (star.alpha * flicker) + ')';

      context.fillRect(
        star.x * width,
        star.y * height,
        star.size,
        star.size
      );
    }
  }

  function paintGlow(x, y, radius, color, opacity) {
    const glow = context.createRadialGradient(x, y, 0, x, y, radius);

    glow.addColorStop(0, 'rgba(' + color.join(',') + ',' + opacity + ')');
    glow.addColorStop(0.45, 'rgba(' + color.join(',') + ',' + opacity * 0.22 + ')');
    glow.addColorStop(1, 'rgba(' + color.join(',') + ',0)');

    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  function paintConstellation(time) {
    const hero = activeScene === 0;
    const blackHole = activeScene === 6;
    const intensity = hero ? 1 : blackHole ? 0.88 : width < 760 ? 0.50 : 0.72;

    // A few quiet layers of light give the galaxy some depth.
    paintGlow(
      layout.x,
      layout.y,
      layout.scale * (hero ? 1.3 : 1.1),
      hero ? palette[4] : palette[2],
      hero ? 0.12 : 0.065
    );

    if (hero) {
      paintGlow(
        layout.x - layout.scale * 0.18,
        layout.y - layout.scale * 0.33,
        layout.scale * 0.43,
        palette[0],
        0.13
      );

      paintGlow(
        layout.x + layout.scale * 0.22,
        layout.y + layout.scale * 0.35,
        layout.scale * 0.60,
        palette[5],
        0.09
      );
    }

    const elapsed = time - sceneChangedAt;
    const transition = clamp(elapsed / 1100, 0, 1);
    const inBetween = Math.sin(transition * Math.PI);
    const transitionOpacity = entrance ? 1 : 1 - inBetween * 0.24;

    for (const star of stars) {
      const shimmer = reducedMotion.matches
        ? 1
        : 0.84 + Math.sin(time * 0.002 + star.phase) * 0.16;

      let x = layout.x + star.x * layout.scale;
      let y = layout.y + star.y * layout.scale;

      // Barely moving starlight keeps a finished shape from feeling frozen.
      if (!reducedMotion.matches) {
        const drift = Math.sin(time * 0.0006 + star.phase) * 0.9;

        x += drift;
        y -= drift * 0.65;
      }

      // Stars move aside when the cursor passes, then drift back.
      if (pointerActive && !reducedMotion.matches) {
        const dx = x - pointerX;
        const dy = y - pointerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = 125;

        if (distance < radius && distance > 0.1) {
          const force = Math.pow(1 - distance / radius, 2) * 7;

          star.pushX += dx / distance * force;
          star.pushY += dy / distance * force;
        }
      }

      star.pushX = clamp(star.pushX, -42, 42);
      star.pushY = clamp(star.pushY, -42, 42);

      x += star.pushX;
      y += star.pushY;

      const color = palette[star.color];
      const alpha = star.alpha * intensity * transitionOpacity * shimmer;
      const size = Math.max(0.42, star.size * (hero ? 1 : 0.86));

      if (star.glow) {
        const radius = size * 5.5 + 7;

        context.globalAlpha = alpha * 0.68;
        context.drawImage(
          glowSprites[star.color],
          x - radius,
          y - radius,
          radius * 2,
          radius * 2
        );
        context.globalAlpha = 1;
      }

      context.fillStyle = 'rgba(' + color.join(',') + ',' + alpha + ')';
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();

      if (star.flare && alpha > 0.3) {
        const reach = size * 4.8;

        context.strokeStyle = 'rgba(222,240,255,' + alpha * 0.54 + ')';
        context.lineWidth = 0.65;
        context.beginPath();
        context.moveTo(x - reach, y);
        context.lineTo(x + reach, y);
        context.moveTo(x, y - reach);
        context.lineTo(x, y + reach);
        context.stroke();
      }
    }

    if (blackHole) {
      paintBlackHole(time);
    }
  }

  function paintBlackHole(time) {
    const elapsed = time - sceneChangedAt;
    const progress = reducedMotion.matches ? 1 : clamp(elapsed / 1250, 0, 1);

    // A brief collision flash, just once on arrival.
    if (progress > 0.20 && progress < 0.47) {
      const flash = Math.sin((progress - 0.20) / 0.27 * Math.PI);

      paintGlow(
        layout.x,
        layout.y,
        layout.scale * 0.65,
        palette[0],
        flash * 0.65
      );
    }

    const opacity = clamp((progress - 0.35) / 0.40, 0, 1);

    if (opacity <= 0) {
      return;
    }

    const radius = Math.max(18, layout.scale * 0.295);

    context.save();
    context.globalAlpha = opacity;

    // Warm accretion light sweeps around the centre.
    context.translate(layout.x, layout.y);
    context.rotate(-0.32);

    const disk = context.createRadialGradient(
      0, 0, radius * 0.7,
      0, 0, radius * 2.9
    );

    disk.addColorStop(0, 'rgba(146,200,255,0)');
    disk.addColorStop(0.48, 'rgba(121,178,248,0.11)');
    disk.addColorStop(0.71, 'rgba(255,181,128,0.19)');
    disk.addColorStop(1, 'rgba(255,162,111,0)');

    context.fillStyle = disk;
    context.beginPath();
    context.ellipse(0, 0, radius * 3, radius * 1.30, 0, 0, Math.PI * 2);
    context.fill();
    context.rotate(0.32);

    // The event horizon itself must be completely dark.
    context.shadowBlur = radius * 0.30;
    context.shadowColor = '#000';
    context.fillStyle = '#01030a';
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();

    context.shadowBlur = radius * 0.20;
    context.shadowColor = '#9acfff';
    context.strokeStyle = '#d8e9ff';
    context.lineWidth = Math.max(1.2, radius * 0.04);
    context.beginPath();
    context.arc(0, 0, radius * 1.04, 0, Math.PI * 2);
    context.stroke();

    // One bright star travels along the photon ring.
    const angle = time * 0.00045;
    context.fillStyle = '#ffe0b8';
    context.beginPath();
    context.arc(
      Math.cos(angle) * radius * 1.06,
      Math.sin(angle) * radius * 1.06,
      Math.max(2, radius * 0.055),
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);

    updateStars();
    paintBackdrop(time);
    paintConstellation(time);
  }

  function frame(time) {
    frameId = null;

    if (document.hidden) {
      return;
    }

    // Slow star motion looks smooth at 30 fps and costs less power.
    if (time - lastFrame >= 32) {
      draw(time);
      lastFrame = time;
    }

    if (!reducedMotion.matches) {
      frameId = requestAnimationFrame(frame);
    }
  }

  function start() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }

    if (reducedMotion.matches) {
      settleInstantly();
      draw(performance.now());
      return;
    }

    if (!document.hidden) {
      frameId = requestAnimationFrame(frame);
    }
  }

  window.addEventListener('scroll', () => {
    // We check the section, not the scroll amount.
    // Ordinary scrolling must never restart the constellation.
    if (window.scrollY !== previousScroll) {
      previousScroll = window.scrollY;
      checkScene();
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    resize();
    checkScene();
    start();
  }, { passive: true });

  if (finePointer.matches) {
    window.addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerActive = true;
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      pointerActive = false;
    });
  }

  document.addEventListener('visibilitychange', start);

  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', start);
  }

  buildScenes();
  makeGlowSprites();
  makeStars();
  resize();
  sceneChangedAt = performance.now();
  checkScene();
  start();
})();

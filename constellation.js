'use strict';

// LUTRA is a little made-up constellation.
// The star map is hand drawn. No images or libraries needed.
const otterPoints = {
  earLbase:[302,161], earLtip:[298,130], earLinner:[335,145],
  browL:[368,128], crown:[406,122], browR:[449,127],
  earRinner:[478,144], earRtip:[511,130], earRbase:[506,163],
  templeL:[273,213], cheekL:[278,273], jawL:[322,313],
  chinL:[365,337], chin:[404,342], chinR:[447,338],
  jawR:[492,310], cheekR:[528,271], templeR:[532,211],
  eyeL:[344,227], eyeR:[464,227], nose:[403,267],
  muzzleL:[367,288], muzzleR:[440,288], mouth:[403,299],
  whiskerL1:[234,245], whiskerL2:[220,289], whiskerL3:[244,321],
  whiskerR1:[573,247], whiskerR2:[587,292], whiskerR3:[565,326],
  neckL:[311,316], shoulderL:[261,375], upperArmL:[235,447],
  armL1:[189,495], armL2:[209,556], pawL:[275,558],
  hipL:[278,625], sideL:[329,685],
  neckR:[497,315], shoulderR:[545,376], upperArmR:[561,449],
  armR1:[611,503], armR2:[586,558], pawR:[529,557],
  hipR:[522,631], sideR:[473,684],
  bellyTop:[404,361], bellyL1:[342,403], bellyL2:[326,519],
  bellyL3:[355,614], bellyBottom:[406,668],
  bellyR3:[457,615], bellyR2:[485,520], bellyR1:[467,407],
  pawmidL:[349,504], pawmidR:[455,504], pawmidTop:[405,474],
  footL1:[333,723], footL2:[306,772], footL3:[352,787], footL4:[401,753],
  footR1:[476,724], footR2:[499,773], footR3:[455,792], footR4:[408,755],
  tail1:[526,641], tail2:[583,680], tail3:[649,677],
  tail4:[689,621], tail5:[712,577], tail6:[756,558],
  tail7:[793,579], tail8:[796,645], tail9:[760,713],
  tail10:[700,751], tail11:[638,760], tail12:[552,724], tail13:[473,683]
};

const otterLines = [
  'earLinner browL crown browR earRinner',
  'earLinner earLtip earLbase templeL cheekL jawL chinL chin chinR jawR cheekR templeR earRbase earRtip earRinner',
  'templeL eyeL nose eyeR templeR',
  'cheekL muzzleL nose muzzleR cheekR',
  'muzzleL mouth muzzleR',
  'cheekL whiskerL1','cheekL whiskerL2','jawL whiskerL3',
  'cheekR whiskerR1','cheekR whiskerR2','jawR whiskerR3',
  'neckL shoulderL upperArmL armL1 armL2 pawL hipL sideL footL1 footL2 footL3 footL4',
  'neckR shoulderR upperArmR armR1 armR2 pawR hipR sideR footR1 footR2 footR3 footR4',
  'neckL bellyL1 bellyL2 bellyL3 bellyBottom bellyR3 bellyR2 bellyR1 neckR',
  'bellyTop bellyL1','bellyTop bellyR1',
  'bellyL2 pawmidL pawmidTop pawmidR bellyR2',
  'pawmidL pawmidR','hipL bellyBottom hipR',
  'hipR tail1 tail2 tail3 tail4 tail5 tail6 tail7 tail8 tail9 tail10 tail11 tail12 tail13',
  'tail13 sideR'
].map(chain => chain.split(' '));

const canvas = document.getElementById('otterConstellation');
const replay = document.getElementById('replayConstellation');
const panel = document.querySelector('.constellation-panel');
const status = document.getElementById('constellationStatus');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const context = canvas?.getContext('2d', { alpha: true });

if (context && panel) {
  const names = Object.keys(otterPoints);
  const brightStars = new Set(['crown','nose','eyeL','eyeR','bellyTop','bellyBottom','pawL','pawR','footL3','footR3','tail6','tail9','whiskerL1','whiskerR1']);
  let width = 0;
  let height = 0;
  let scale = 1;
  let dots = [];
  let start = null;
  let animation = null;
  let pointer = { x: 0, y: 0 };
  let pointerSmooth = { x: 0, y: 0 };
  let hasFinished = false;

  const duration = 2800;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => 1 - Math.pow(1 - clamp(value), 4);

  function fit() {
    const rect = panel.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    scale = Math.min(width / 900, height / 870);
  }

  function scatter() {
    dots = names.map((name, index) => {
      const [x, y] = otterPoints[name];
      const targetX = (x - 500) * scale + width * .5;
      const targetY = (y - 448) * scale + height * .49;
      return {
        name, index,
        fromX: Math.random() * width,
        fromY: Math.random() * height,
        targetX, targetY,
        phase: Math.random() * Math.PI * 2,
        size: brightStars.has(name) ? 2.3 : 1.25 + Math.random() * .65
      };
    });
  }

  function positions(progress, time) {
    const formation = ease(progress);
    pointerSmooth.x += (pointer.x - pointerSmooth.x) * .035;
    pointerSmooth.y += (pointer.y - pointerSmooth.y) * .035;
    const points = {};
    dots.forEach(dot => {
      const drift = motion.matches ? 0 : Math.sin(time * .00055 + dot.phase) * .7 * formation;
      points[dot.name] = {
        x: dot.fromX + (dot.targetX - dot.fromX) * formation + pointerSmooth.x * 8 * formation + drift,
        y: dot.fromY + (dot.targetY - dot.fromY) * formation + pointerSmooth.y * 7 * formation + drift
      };
    });
    return points;
  }

  function draw(time) {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    const progress = motion.matches ? 1 : clamp((time - start) / duration);
    const formation = ease(progress);
    const points = positions(progress, time);

    // The shape gets its lines only after the stars find their places.
    if (progress > .17) {
      const alpha = clamp((progress - .17) / .65);
      context.save();
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = .86;
      otterLines.forEach((chain, index) => {
        context.beginPath();
        chain.forEach((name, step) => {
          const point = points[name];
          if (step === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.strokeStyle = index < 2
          ? 'rgba(170, 206, 255, ' + (.49 * alpha) + ')'
          : 'rgba(132, 178, 244, ' + (.28 * alpha) + ')';
        context.stroke();
      });
      context.restore();
    }

    dots.forEach(dot => {
      const point = points[dot.name];
      const pulse = motion.matches ? 1 : .78 + Math.sin(time * .002 + dot.phase) * .22;
      const glow = brightStars.has(dot.name);
      context.save();
      if (glow) {
        context.shadowBlur = 19 * formation + 3;
        context.shadowColor = dot.name === 'nose' ? '#d8ddff' : '#8caeff';
      }
      context.beginPath();
      context.arc(point.x, point.y, dot.size * pulse, 0, Math.PI * 2);
      context.fillStyle = glow
        ? 'rgba(240, 249, 255, .98)'
        : 'rgba(196, 222, 255, ' + (.7 + .28 * formation) + ')';
      context.fill();
      context.restore();

      // A handful of compass-like crosses, like stars on old sky maps.
      if (glow && formation > .88 && (dot.index % 3 === 0)) {
        const radius = 6.5 * (formation - .88) / .12;
        context.beginPath();
        context.moveTo(point.x - radius, point.y);
        context.lineTo(point.x + radius, point.y);
        context.moveTo(point.x, point.y - radius);
        context.lineTo(point.x, point.y + radius);
        context.strokeStyle = 'rgba(181, 223, 255, .37)';
        context.lineWidth = .7;
        context.stroke();
      }
    });

    if (!hasFinished && progress === 1) {
      hasFinished = true;
      if (status) status.textContent = 'The stars have formed Lutra, the otter constellation.';
      panel.classList.add('is-aligned');
    }
  }

  function tick(time) {
    animation = null;
    if (document.hidden) return;
    if (start === null) start = time;
    draw(time);
    // The twinkle stays subtle after the constellation finishes.
    if (!motion.matches) animation = requestAnimationFrame(tick);
  }

  function play() {
    if (animation !== null) cancelAnimationFrame(animation);
    start = null;
    hasFinished = false;
    panel.classList.remove('is-aligned');
    if (status) status.textContent = 'The stars are gathering.';
    fit();
    scatter();
    if (motion.matches) {
      draw(duration);
      return;
    }
    animation = requestAnimationFrame(tick);
  }

  replay?.addEventListener('click', play);
  panel.addEventListener('pointermove', event => {
    if (motion.matches) return;
    const rect = panel.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width - .5;
    pointer.y = (event.clientY - rect.top) / rect.height - .5;
  }, { passive: true });
  panel.addEventListener('pointerleave', () => {
    pointer.x = 0;
    pointer.y = 0;
  });

  let resizeQueued = false;
  window.addEventListener('resize', () => {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      // Keep the constellation intact during resize.
      fit();
      dots.forEach(dot => {
        const [x, y] = otterPoints[dot.name];
        dot.targetX = (x - 500) * scale + width * .5;
        dot.targetY = (y - 448) * scale + height * .49;
      });
      if (motion.matches) draw(duration);
    });
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && animation === null && !motion.matches) {
      animation = requestAnimationFrame(tick);
    }
  });
  if (typeof motion.addEventListener === 'function') {
    motion.addEventListener('change', play);
  }

  play();
}

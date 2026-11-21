// Level 2 — "The Night Garden": a moonlit garden with an owl, fireflies and a pond.
// Eight differences: the moon, the owl's eyes, fireflies, a flower, mushroom spots,
// a fence plank, a snail and a shooting star. Panel space is 600x540.

import { circle, ellipse, fillCircle, fillEllipse, flower, star } from './helpers.js';

export const garden = {
  id: 'garden',
  name: 'The Night Garden',
  tagline: 'The owl is awake. So are the fireflies.',
  timeLimit: 150,
  seed: 202,
  differences: [
    { id: 'moon-phase', x: 482, y: 72, r: 34, label: 'the shape of the moon' },
    { id: 'owl-eyes', x: 138, y: 148, r: 32, label: "the owl's eyes" },
    { id: 'firefly-count', x: 352, y: 252, r: 32, label: 'a firefly' },
    { id: 'flower-colour', x: 502, y: 424, r: 30, label: 'the big flower colour' },
    { id: 'mushroom-spots', x: 92, y: 432, r: 30, label: 'a spot on the mushroom' },
    { id: 'fence-plank', x: 302, y: 382, r: 30, label: 'a plank in the fence' },
    { id: 'snail-shell', x: 202, y: 482, r: 30, label: 'the snail' },
    { id: 'star-shooting', x: 302, y: 62, r: 30, label: 'the shooting star' },
  ],

  draw(ctx, W, H, changed) {
    // Night sky, stars, moon and the garden below.
    const sky = ctx.createLinearGradient(0, 0, 0, 320);
    sky.addColorStop(0, '#0d1230');
    sky.addColorStop(1, '#2a3560');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 320);
    ctx.fillStyle = '#1d2b1f';
    ctx.fillRect(0, 300, W, H - 300);
    ctx.fillStyle = '#2c4630';
    ctx.fillRect(0, 300, W, 12);
    drawStars(ctx, changed);
    drawMoon(ctx, changed);
    drawTree(ctx, changed);
    drawFence(ctx, changed);
    drawPond(ctx);
    drawFlowers(ctx, changed);
    drawMushroom(ctx, changed);
    drawSnail(ctx, changed);
    drawFireflies(ctx, changed);
    drawGrass(ctx);
  },
};

function drawGrass(ctx) {
  // Tufts of grass along the bottom edge, so the ground is not a flat slab.
  ctx.strokeStyle = '#356b3e';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (const [x, y] of [[40, 528], [120, 522], [250, 530], [330, 524], [470, 530], [560, 524]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, y - 12);
    ctx.moveTo(x + 4, y);
    ctx.lineTo(x + 4, y - 14);
    ctx.moveTo(x + 8, y);
    ctx.lineTo(x + 12, y - 10);
    ctx.stroke();
  }
}

const STARS = [
  [60, 50], [120, 90], [200, 40], [260, 110], [340, 44], [400, 100],
  [90, 150], [230, 180], [330, 150], [440, 190], [520, 130], [160, 210],
];

function drawStars(ctx, changed) {
  for (const [x, y] of STARS) star(ctx, x, y, 5, 2, 'rgba(255, 244, 200, 0.9)');
  if (!changed.has('star-shooting')) {
    ctx.strokeStyle = '#ffe9a8';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(280, 46);
    ctx.lineTo(330, 78);
    ctx.stroke();
    star(ctx, 336, 82, 7, 3, '#ffe9a8');
  }
}

function drawMoon(ctx, changed) {
  // Full moon on the left; a crescent on the right.
  fillCircle(ctx, 482, 72, 34, '#fdf6d8');
  if (changed.has('moon-phase')) {
    fillCircle(ctx, 496, 64, 30, '#2a3560');
  }
  ctx.fillStyle = 'rgba(190, 180, 140, 0.5)';
  fillCircle(ctx, 472, 62, 6, 'rgba(190, 180, 140, 0.5)');
  fillCircle(ctx, 492, 84, 4, 'rgba(190, 180, 140, 0.5)');
}

function drawTree(ctx, changed) {
  // A crooked tree on the left with the owl perched on its branch.
  ctx.fillStyle = '#4a3220';
  ctx.beginPath();
  ctx.moveTo(96, 330);
  ctx.quadraticCurveTo(84, 220, 108, 150);
  ctx.quadraticCurveTo(116, 130, 128, 128);
  ctx.lineTo(140, 150);
  ctx.quadraticCurveTo(132, 220, 132, 330);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(118, 190);
  ctx.quadraticCurveTo(170, 170, 205, 185);
  ctx.stroke();
  fillEllipse(ctx, 118, 132, 46, 30, '#2c5a34');
  fillEllipse(ctx, 150, 108, 38, 26, '#356b3e');
  fillEllipse(ctx, 84, 108, 34, 24, '#2c5a34');
  // The owl: brown body, pale belly, ear tufts, and eyes open or shut.
  fillEllipse(ctx, 138, 148, 30, 36, '#8a6a45');
  fillEllipse(ctx, 138, 158, 20, 24, '#e8dcc0');
  ctx.fillStyle = '#8a6a45';
  ctx.beginPath();
  ctx.moveTo(116, 122);
  ctx.lineTo(112, 104);
  ctx.lineTo(126, 116);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(160, 122);
  ctx.lineTo(164, 104);
  ctx.lineTo(150, 116);
  ctx.closePath();
  ctx.fill();
  if (changed.has('owl-eyes')) {
    ctx.strokeStyle = '#2c2216';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(124, 140);
    ctx.lineTo(134, 140);
    ctx.moveTo(142, 140);
    ctx.lineTo(152, 140);
    ctx.stroke();
  } else {
    fillCircle(ctx, 129, 140, 7, '#fdf6d8');
    fillCircle(ctx, 147, 140, 7, '#fdf6d8');
    fillCircle(ctx, 129, 140, 3, '#1d1a12');
    fillCircle(ctx, 147, 140, 3, '#1d1a12');
  }
  fillEllipse(ctx, 138, 168, 6, 4, '#e8a13d');
  ctx.strokeStyle = '#5d4026';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(120, 186);
  ctx.lineTo(156, 186);
  ctx.stroke();
}

function drawFence(ctx, changed) {
  // A picket fence across the garden; one plank is missing on the right picture.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(210, 356, 340, 10);
  ctx.fillRect(210, 392, 340, 10);
  const planks = [222, 252, 282, 312, 342, 372, 402, 432, 462, 492, 522];
  for (let index = 0; index < planks.length; index += 1) {
    if (changed.has('fence-plank') && index === 3) continue;
    const x = planks[index];
    ctx.fillStyle = '#8a6238';
    ctx.beginPath();
    ctx.moveTo(x, 340);
    ctx.lineTo(x + 10, 330);
    ctx.lineTo(x + 20, 340);
    ctx.lineTo(x + 20, 420);
    ctx.lineTo(x, 420);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPond(ctx) {
  // A small pond with lily pads in the lower right.
  fillEllipse(ctx, 452, 500, 110, 30, '#2f5d8a');
  fillEllipse(ctx, 452, 500, 96, 24, '#3f74a8');
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(400, 496);
  ctx.quadraticCurveTo(440, 490, 480, 498);
  ctx.stroke();
  fillEllipse(ctx, 420, 492, 18, 8, '#4e9a51');
  fillEllipse(ctx, 492, 508, 16, 7, '#4e9a51');
  flower(ctx, 492, 500, '#f2a0c0', 7);
}

function drawFlowers(ctx, changed) {
  // A row of night flowers along the bottom; the big one changes colour.
  const spots = [
    [60, 470, '#c98ae0', 12],
    [150, 500, '#f2a0c0', 11],
    [260, 478, '#a0c8f2', 12],
    [350, 505, '#f2c94c', 10],
    [560, 470, '#f2a0c0', 11],
  ];
  for (const [x, y, color, size] of spots) {
    ctx.strokeStyle = '#3f7a44';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x, y + 34);
    ctx.stroke();
    flower(ctx, x, y, color, size);
  }
  ctx.strokeStyle = '#3f7a44';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(502, 436);
  ctx.lineTo(502, 470);
  ctx.stroke();
  flower(ctx, 502, 424, changed.has('flower-colour') ? '#8a5fd0' : '#f2709a', 18);
}

function drawMushroom(ctx, changed) {
  // A red-capped mushroom; three white spots on the left, two on the right.
  ctx.fillStyle = '#e8dcc0';
  ctx.fillRect(84, 432, 16, 34);
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.arc(92, 434, 30, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, 78, 424, 5, '#fffdf5');
  fillCircle(ctx, 100, 418, 5, '#fffdf5');
  if (!changed.has('mushroom-spots')) fillCircle(ctx, 92, 430, 5, '#fffdf5');
  ctx.fillStyle = '#2c4630';
  ctx.fillRect(60, 466, 64, 4);
}

function drawSnail(ctx, changed) {
  // A snail crossing the grass — present on the left, gone on the right.
  if (changed.has('snail-shell')) return;
  fillEllipse(ctx, 202, 486, 26, 12, '#c9a86a');
  ctx.fillStyle = '#8a5fd0';
  ctx.beginPath();
  ctx.arc(196, 482, 13, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#6a3fb0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(196, 482, 8, 0, Math.PI * 1.5);
  ctx.stroke();
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(214, 478);
  ctx.lineTo(220, 468);
  ctx.moveTo(220, 478);
  ctx.lineTo(224, 466);
  ctx.stroke();
}

function drawFireflies(ctx, changed) {
  // Five fireflies on the left, four on the right, each with a soft glow.
  const flies = [
    [300, 240], [352, 252], [400, 220], [250, 290], [430, 280],
  ];
  const count = changed.has('firefly-count') ? 4 : 5;
  for (let index = 0; index < count; index += 1) {
    const [x, y] = flies[index];
    fillCircle(ctx, x, y, 10, 'rgba(242, 201, 76, 0.25)');
    fillCircle(ctx, x, y, 4, '#ffe98a');
  }
}

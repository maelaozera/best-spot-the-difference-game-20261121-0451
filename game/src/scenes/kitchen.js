// Level 1 — "Mira's Kitchen": a sunny morning kitchen with a cat asleep on the rug.
// Eight differences hide in plain sight: a bird, clock hands, steam, fruit, a mug,
// a tail, a leaf and a rug stripe. Panel space is 600x540; every difference lists
// the centre and radius the engine tests clicks against.

import { circle, ellipse, fillCircle, fillEllipse, roundRect, cloud } from './helpers.js';

export const kitchen = {
  id: 'kitchen',
  name: "Mira's Kitchen",
  tagline: 'Morning tea, and a cat who found the warmest spot.',
  timeLimit: 150,
  seed: 101,
  differences: [
    { id: 'sun-bird', x: 478, y: 82, r: 30, label: 'the bird in the window' },
    { id: 'clock-hands', x: 300, y: 82, r: 34, label: 'the clock hands' },
    { id: 'teapot-steam', x: 148, y: 296, r: 30, label: 'the teapot steam' },
    { id: 'apple-count', x: 438, y: 392, r: 32, label: 'an apple in the bowl' },
    { id: 'mug-colour', x: 252, y: 424, r: 30, label: 'the mug colour' },
    { id: 'cat-tail', x: 508, y: 468, r: 30, label: "the cat's tail" },
    { id: 'plant-leaf', x: 82, y: 176, r: 30, label: 'a leaf on the plant' },
    { id: 'rug-stripe', x: 300, y: 506, r: 30, label: 'the rug stripe' },
  ],

  draw(ctx, W, H, changed) {
    // Wall and wooden floor.
    ctx.fillStyle = '#f7e8c9';
    ctx.fillRect(0, 0, W, 360);
    ctx.fillStyle = '#b07a45';
    ctx.fillRect(0, 360, W, H - 360);
    ctx.fillStyle = '#9c6a38';
    for (let plank = 0; plank < 6; plank += 1) ctx.fillRect(0, 384 + plank * 26, W, 2);
    ctx.fillStyle = '#e8d5ae';
    ctx.fillRect(0, 354, W, 8);

    drawWindow(ctx, changed);
    drawClock(ctx, changed);
    drawShelf(ctx);
    drawPlant(ctx, changed);
    drawTable(ctx, changed);
    drawCat(ctx, changed);
    drawRug(ctx, changed);
    drawTowel(ctx);
  },
};

function drawTowel(ctx) {
  // A striped tea towel hanging from the table edge, for a lived-in kitchen.
  ctx.fillStyle = '#fffdf5';
  ctx.fillRect(560, 414, 26, 44);
  ctx.fillStyle = '#7a9cc6';
  ctx.fillRect(560, 426, 26, 5);
  ctx.fillRect(560, 440, 26, 5);
}

function drawWindow(ctx, changed) {
  // Window frame, sky, sun, a cloud and — on the left picture — a little bird.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(392, 26, 180, 168);
  ctx.fillStyle = '#aee3f5';
  ctx.fillRect(402, 36, 160, 148);
  fillCircle(ctx, 528, 66, 24, '#ffd94d');
  cloud(ctx, 420, 70, 0.55, '#ffffff');
  cloud(ctx, 470, 150, 0.45, '#eef7fb');
  if (!changed.has('sun-bird')) {
    ctx.strokeStyle = '#3d4451';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(470, 92, 10, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(488, 92, 10, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    fillCircle(ctx, 479, 84, 4, '#3d4451');
  }
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(482, 36);
  ctx.lineTo(482, 184);
  ctx.moveTo(402, 110);
  ctx.lineTo(562, 110);
  ctx.stroke();
  // Curtain rod and two curtain panels.
  ctx.fillStyle = '#c96f4a';
  ctx.fillRect(384, 16, 196, 10);
  ctx.fillStyle = '#e07856';
  ctx.fillRect(384, 26, 22, 150);
  ctx.fillRect(558, 26, 22, 150);
}

function drawClock(ctx, changed) {
  // Round wall clock: 3 o'clock on the left, half past five on the right.
  fillCircle(ctx, 300, 82, 42, '#fffdf5');
  ctx.strokeStyle = '#5b4636';
  ctx.lineWidth = 5;
  circle(ctx, 300, 82, 42);
  ctx.stroke();
  ctx.fillStyle = '#5b4636';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('12', 300, 52);
  ctx.fillText('3', 328, 82);
  ctx.fillText('6', 300, 112);
  ctx.fillText('9', 272, 82);
  ctx.strokeStyle = '#3d4451';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(300, 82);
  if (changed.has('clock-hands')) {
    ctx.lineTo(300, 60);
    ctx.moveTo(300, 82);
    ctx.lineTo(314, 100);
  } else {
    ctx.lineTo(300, 58);
    ctx.moveTo(300, 82);
    ctx.lineTo(322, 82);
  }
  ctx.stroke();
  fillCircle(ctx, 300, 82, 4, '#c96f4a');
}

function drawShelf(ctx) {
  // A shelf with three jars and a stack of plates.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(36, 158, 300, 12);
  ctx.fillStyle = '#8fb8a8';
  roundRect(ctx, 52, 108, 44, 50, 8);
  ctx.fill();
  ctx.fillStyle = '#e07856';
  roundRect(ctx, 112, 116, 40, 42, 8);
  ctx.fill();
  ctx.fillStyle = '#f2c94c';
  roundRect(ctx, 168, 104, 46, 54, 8);
  ctx.fill();
  ctx.fillStyle = '#fffdf5';
  for (let plate = 0; plate < 4; plate += 1) {
    ellipse(ctx, 272, 152 - plate * 7, 30, 6);
    ctx.fill();
  }
}

function drawPlant(ctx, changed) {
  // A potted plant on the sill: five leaves on the left, four on the right.
  ctx.fillStyle = '#c96f4a';
  ctx.beginPath();
  ctx.moveTo(56, 208);
  ctx.lineTo(108, 208);
  ctx.lineTo(100, 246);
  ctx.lineTo(64, 246);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4e9a51';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const leaves = [
    [64, 206, 48, 176],
    [82, 206, 82, 158],
    [100, 206, 118, 178],
    [72, 206, 56, 182],
    [96, 206, 112, 160],
  ];
  const count = changed.has('plant-leaf') ? 4 : 5;
  for (let leaf = 0; leaf < count; leaf += 1) {
    const [x1, y1, x2, y2] = leaves[leaf];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2 - 8, (y1 + y2) / 2, x2, y2);
    ctx.stroke();
  }
  fillEllipse(ctx, 82, 206, 20, 6, '#6b8e4e');
}

function drawTable(ctx, changed) {
  // Table top, teapot with steam, a mug and a bowl of fruit.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(36, 398, 528, 16);
  ctx.fillRect(60, 414, 16, 84);
  ctx.fillRect(524, 414, 16, 84);
  // Teapot: round body, lid, handle and spout; steam curls on the left picture.
  fillEllipse(ctx, 148, 372, 42, 30, '#7a9cc6');
  fillEllipse(ctx, 148, 346, 20, 10, '#5d7ea8');
  fillCircle(ctx, 148, 340, 6, '#5d7ea8');
  ctx.strokeStyle = '#5d7ea8';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(192, 372, 16, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(108, 362);
  ctx.lineTo(88, 348);
  ctx.stroke();
  if (!changed.has('teapot-steam')) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(140, 330);
    ctx.quadraticCurveTo(128, 312, 140, 296);
    ctx.quadraticCurveTo(152, 282, 142, 268);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(158, 330);
    ctx.quadraticCurveTo(170, 314, 158, 300);
    ctx.stroke();
  }
  // Mug: red on the left, teal on the right.
  ctx.fillStyle = changed.has('mug-colour') ? '#3f9a8e' : '#d94f3d';
  roundRect(ctx, 228, 402, 48, 36, 6);
  ctx.fill();
  ctx.strokeStyle = changed.has('mug-colour') ? '#2f7a70' : '#b03a2c';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(278, 420, 11, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Fruit bowl: three apples on the left, two on the right.
  ctx.fillStyle = '#5b4636';
  ctx.beginPath();
  ctx.moveTo(404, 402);
  ctx.lineTo(472, 402);
  ctx.lineTo(460, 424);
  ctx.lineTo(416, 424);
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, 420, 394, 13, '#d94f3d');
  fillCircle(ctx, 452, 390, 13, '#7cb342');
  if (!changed.has('apple-count')) fillCircle(ctx, 436, 376, 13, '#e8a13d');
  ctx.strokeStyle = '#4e9a51';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(436, 364);
  ctx.lineTo(442, 354);
  ctx.stroke();
}

function drawCat(ctx, changed) {
  // A ginger cat asleep on the rug, tail curled high on the left picture.
  fillEllipse(ctx, 470, 478, 52, 22, '#e8975a');
  fillCircle(ctx, 424, 468, 20, '#e8975a');
  ctx.beginPath();
  ctx.moveTo(410, 452);
  ctx.lineTo(404, 436);
  ctx.lineTo(418, 446);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(428, 450);
  ctx.lineTo(428, 434);
  ctx.lineTo(438, 448);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#b06a35';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(448, 470);
  ctx.lineTo(462, 470);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(452, 478);
  ctx.lineTo(466, 478);
  ctx.stroke();
  if (!changed.has('cat-tail')) {
    ctx.strokeStyle = '#e8975a';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(516, 482);
    ctx.quadraticCurveTo(540, 470, 534, 444);
    ctx.quadraticCurveTo(530, 428, 516, 430);
    ctx.stroke();
  }
}

function drawRug(ctx, changed) {
  // A round rug under the cat; its middle stripe is gold or green.
  fillEllipse(ctx, 300, 506, 210, 26, '#b8573f');
  fillEllipse(ctx, 300, 506, 170, 19, changed.has('rug-stripe') ? '#4e9a51' : '#f2c94c');
  fillEllipse(ctx, 300, 506, 120, 12, '#e8d5ae');
}

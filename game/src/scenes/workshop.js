// Level 3 — "The Toy Workshop": a maker's bench full of toys in progress.
// Nine differences: the lamp, a train wheel, the bear's bow, the robot's antenna,
// a paint pot, a gear, a hammer, a poster star and the saw. Panel space is 600x540.

import { circle, ellipse, fillCircle, fillEllipse, roundRect, star } from './helpers.js';

export const workshop = {
  id: 'workshop',
  name: 'The Toy Workshop',
  tagline: 'Every toy here was made by hand — twice.',
  timeLimit: 165,
  seed: 303,
  differences: [
    { id: 'lamp-light', x: 92, y: 92, r: 32, label: 'the lamp glow' },
    { id: 'hammer-handle', x: 252, y: 92, r: 30, label: 'the hammer' },
    { id: 'gear-count', x: 352, y: 122, r: 32, label: 'the small gear' },
    { id: 'saw-blade', x: 452, y: 92, r: 30, label: 'the saw' },
    { id: 'robot-antenna', x: 522, y: 196, r: 30, label: "the robot's antenna" },
    { id: 'paint-pot', x: 182, y: 302, r: 30, label: 'the blue paint pot' },
    { id: 'bear-bow', x: 482, y: 382, r: 30, label: "the bear's bow" },
    { id: 'train-wheel', x: 302, y: 432, r: 30, label: 'a wheel on the train' },
    { id: 'poster-star', x: 92, y: 252, r: 30, label: 'the star on the poster' },
  ],

  draw(ctx, W, H, changed) {
    // Pegboard wall, floor and the long workbench.
    ctx.fillStyle = '#d9b98a';
    ctx.fillRect(0, 0, W, 300);
    ctx.fillStyle = '#8a6238';
    ctx.fillRect(0, 300, W, H - 300);
    ctx.fillStyle = '#a87a48';
    for (let plank = 0; plank < 4; plank += 1) ctx.fillRect(0, 322 + plank * 56, W, 2);
    drawPegboard(ctx, changed);
    drawLamp(ctx, changed);
    drawPoster(ctx, changed);
    drawBench(ctx, changed);
  },
};

function drawPegboard(ctx, changed) {
  // Dotted pegboard with the tools hanging on it.
  ctx.fillStyle = 'rgba(90, 60, 30, 0.35)';
  for (let x = 20; x < 580; x += 24) {
    for (let y = 20; y < 280; y += 24) {
      ctx.fillRect(x, y, 3, 3);
    }
  }
  // Hammer: present on the left, gone on the right.
  if (!changed.has('hammer-handle')) {
    ctx.fillStyle = '#6b4a2f';
    ctx.fillRect(248, 60, 8, 70);
    ctx.fillStyle = '#9aa0a8';
    ctx.fillRect(228, 44, 48, 22);
  }
  // Two gears on the left; the small one is missing on the right.
  drawGear(ctx, 352, 122, 30, '#c96f4a');
  if (!changed.has('gear-count')) drawGear(ctx, 396, 138, 18, '#8a6a45');
  // Saw: present on the left, gone on the right.
  if (!changed.has('saw-blade')) {
    ctx.fillStyle = '#c8ccd2';
    ctx.beginPath();
    ctx.moveTo(420, 70);
    ctx.lineTo(492, 70);
    ctx.lineTo(492, 96);
    ctx.lineTo(420, 96);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#6b4a2f';
    ctx.fillRect(492, 74, 22, 18);
  }
}

function drawGear(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let tooth = 0; tooth < 8; tooth += 1) {
    const angle = (tooth * Math.PI) / 4;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    ctx.rect(px - 5, py - 5, 10, 10);
  }
  ctx.fill();
  fillCircle(ctx, x, y, radius * 0.72, color);
  fillCircle(ctx, x, y, radius * 0.28, '#d9b98a');
}

function drawLamp(ctx, changed) {
  // A desk lamp in the corner: glowing warm on the left, dark on the right.
  ctx.strokeStyle = '#3d4451';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(92, 210);
  ctx.lineTo(92, 110);
  ctx.stroke();
  ctx.fillStyle = '#3d4451';
  ctx.beginPath();
  ctx.moveTo(62, 210);
  ctx.lineTo(122, 210);
  ctx.lineTo(112, 196);
  ctx.lineTo(72, 196);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = changed.has('lamp-light') ? '#5d6a72' : '#f2c94c';
  ctx.beginPath();
  ctx.moveTo(92, 74);
  ctx.lineTo(58, 112);
  ctx.lineTo(126, 112);
  ctx.closePath();
  ctx.fill();
  if (!changed.has('lamp-light')) {
    fillCircle(ctx, 92, 112, 34, 'rgba(242, 201, 76, 0.18)');
    fillCircle(ctx, 92, 112, 18, 'rgba(242, 201, 76, 0.25)');
  }
}

function drawPoster(ctx, changed) {
  // A "TOYS" poster with three stars on the left and two on the right.
  ctx.fillStyle = '#fffdf5';
  ctx.fillRect(52, 222, 88, 62);
  ctx.strokeStyle = '#c96f4a';
  ctx.lineWidth = 4;
  ctx.strokeRect(52, 222, 88, 62);
  ctx.fillStyle = '#c96f4a';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TOYS', 96, 240);
  star(ctx, 76, 266, 8, 3, '#f2c94c');
  star(ctx, 96, 266, 8, 3, '#f2c94c');
  if (!changed.has('poster-star')) star(ctx, 116, 266, 8, 3, '#f2c94c');
}

function drawBench(ctx, changed) {
  // The workbench top and everything standing on it.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(24, 372, 552, 18);
  ctx.fillStyle = '#54371f';
  ctx.fillRect(48, 390, 18, 110);
  ctx.fillRect(534, 390, 18, 110);
  drawPaintPots(ctx, changed);
  drawRobot(ctx, changed);
  drawBear(ctx, changed);
  drawTrain(ctx, changed);
  drawSawdust(ctx);
}

function drawSawdust(ctx) {
  // Sawdust specks on the bench and floor: the workshop is used, not a showroom.
  ctx.fillStyle = 'rgba(217, 185, 138, 0.8)';
  for (const [x, y] of [[120, 380], [140, 386], [380, 382], [410, 388], [90, 500], [540, 512], [300, 520]]) {
    ctx.fillRect(x, y, 4, 3);
  }
}

function drawPaintPots(ctx, changed) {
  // Three paint pots; the blue one is missing on the right picture.
  const pots = [
    [150, '#d94f3d'],
    [182, '#3f9a8e'],
    [214, '#f2c94c'],
  ];
  for (const [x, color] of pots) {
    if (changed.has('paint-pot') && color === '#3f9a8e') continue;
    ctx.fillStyle = color;
    roundRect(ctx, x - 12, 330, 24, 42, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(x - 12, 330, 24, 8);
  }
  ctx.strokeStyle = '#54371f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(246, 340);
  ctx.lineTo(268, 372);
  ctx.stroke();
}

function drawRobot(ctx, changed) {
  // A tin robot: square head, antenna, round eyes and a wind-up key.
  ctx.fillStyle = '#9aa0a8';
  roundRect(ctx, 500, 232, 48, 44, 6);
  ctx.fill();
  ctx.strokeStyle = '#5d6a72';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(524, 232);
  ctx.lineTo(524, 206);
  ctx.stroke();
  fillCircle(ctx, 524, 198, 7, changed.has('robot-antenna') ? '#3f9a8e' : '#d94f3d');
  fillCircle(ctx, 514, 250, 6, '#2c3540');
  fillCircle(ctx, 534, 250, 6, '#2c3540');
  ctx.strokeStyle = '#2c3540';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(514, 264);
  ctx.lineTo(534, 264);
  ctx.stroke();
  ctx.fillStyle = '#7d838c';
  roundRect(ctx, 496, 276, 56, 66, 8);
  ctx.fill();
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(508, 292, 10, 10);
  ctx.fillRect(530, 292, 10, 10);
  ctx.fillStyle = '#f2709a';
  ctx.fillRect(508, 312, 32, 12);
  // Wind-up key on its back.
  ctx.strokeStyle = '#c96f4a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(496, 306);
  ctx.lineTo(482, 306);
  ctx.stroke();
  ctx.fillStyle = '#c96f4a';
  ellipse(ctx, 478, 296, 5, 10);
  ctx.fill();
  ellipse(ctx, 478, 316, 5, 10);
  ctx.fill();
}

function drawBear(ctx, changed) {
  // A teddy bear sitting on the bench, bow tie on the left picture only.
  ctx.fillStyle = '#b07a45';
  fillCircle(ctx, 462, 352, 16, '#b07a45');
  fillCircle(ctx, 494, 352, 16, '#b07a45');
  fillCircle(ctx, 466, 348, 7, '#e8c49a');
  fillCircle(ctx, 490, 348, 7, '#e8c49a');
  fillEllipse(ctx, 478, 384, 26, 30, '#b07a45');
  fillEllipse(ctx, 478, 392, 16, 18, '#e8c49a');
  fillCircle(ctx, 478, 366, 22, '#b07a45');
  fillCircle(ctx, 470, 360, 4, '#2c2216');
  fillCircle(ctx, 486, 360, 4, '#2c2216');
  fillEllipse(ctx, 478, 370, 5, 4, '#5b4636');
  ctx.strokeStyle = '#5b4636';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(478, 372, 8, 0.2, Math.PI - 0.2);
  ctx.stroke();
  if (!changed.has('bear-bow')) {
    ctx.fillStyle = '#d94f3d';
    ctx.beginPath();
    ctx.moveTo(478, 396);
    ctx.lineTo(462, 388);
    ctx.lineTo(462, 404);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(478, 396);
    ctx.lineTo(494, 388);
    ctx.lineTo(494, 404);
    ctx.closePath();
    ctx.fill();
    fillCircle(ctx, 478, 396, 5, '#b03a2c');
  }
}

function drawTrain(ctx, changed) {
  // A wooden toy train: engine, carriage and wheels — one wheel short on the right.
  ctx.fillStyle = '#d94f3d';
  roundRect(ctx, 250, 400, 70, 36, 8);
  ctx.fill();
  ctx.fillStyle = '#3f9a8e';
  roundRect(ctx, 320, 412, 56, 24, 6);
  ctx.fill();
  ctx.fillStyle = '#5d7ea8';
  ctx.fillRect(262, 378, 26, 24);
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(296, 382, 8, 40);
  ctx.fillStyle = '#2c3540';
  const wheels = [268, 302, 336, 362];
  const count = changed.has('train-wheel') ? 3 : 4;
  for (let index = 0; index < count; index += 1) {
    fillCircle(ctx, wheels[index], 440, 11, '#2c3540');
    fillCircle(ctx, wheels[index], 440, 4, '#9aa0a8');
  }
  ctx.strokeStyle = '#2c3540';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(250, 436);
  ctx.lineTo(376, 436);
  ctx.stroke();
}

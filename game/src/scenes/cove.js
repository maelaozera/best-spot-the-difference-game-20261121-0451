// Level 4 — "Pirate Cove": a sunny beach with a palm, a treasure chest and a ship.
// Nine differences: the flag, the sail, coconuts, spilled gold, a crab claw, shells,
// seagulls, a starfish arm and a cloud over the sun. Panel space is 600x540.

import { circle, ellipse, fillCircle, fillEllipse, cloud, star } from './helpers.js';

export const cove = {
  id: 'cove',
  name: 'Pirate Cove',
  tagline: 'X marks the spot. So do nine other things.',
  timeLimit: 165,
  seed: 404,
  differences: [
    { id: 'sun-cloud', x: 92, y: 72, r: 32, label: 'the cloud over the sun' },
    { id: 'seagull-count', x: 252, y: 72, r: 30, label: 'a seagull' },
    { id: 'flag-skull', x: 482, y: 92, r: 32, label: 'the skull on the flag' },
    { id: 'palm-coconuts', x: 302, y: 152, r: 30, label: 'a coconut' },
    { id: 'ship-sail', x: 122, y: 182, r: 32, label: 'the ship sail' },
    { id: 'chest-gold', x: 422, y: 432, r: 30, label: 'the spilled gold' },
    { id: 'crab-claw', x: 152, y: 472, r: 30, label: "the crab's raised claw" },
    { id: 'starfish-arm', x: 352, y: 492, r: 30, label: 'an arm of the starfish' },
    { id: 'shell-count', x: 522, y: 492, r: 30, label: 'a shell on the sand' },
  ],

  draw(ctx, W, H, changed) {
    // Sky, sun, sea with waves and sand.
    const sky = ctx.createLinearGradient(0, 0, 0, 240);
    sky.addColorStop(0, '#8fd0f0');
    sky.addColorStop(1, '#cfeefb');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 240);
    ctx.fillStyle = '#3f74a8';
    ctx.fillRect(0, 240, W, 120);
    ctx.fillStyle = '#e8d5a0';
    ctx.fillRect(0, 360, W, H - 360);
    ctx.fillStyle = '#d9c48a';
    ctx.fillRect(0, 360, W, 8);
    drawSun(ctx, changed);
    drawGulls(ctx, changed);
    drawShip(ctx, changed);
    drawWaves(ctx);
    drawPalm(ctx, changed);
    drawChest(ctx, changed);
    drawCrab(ctx, changed);
    drawStarfish(ctx, changed);
    drawShells(ctx, changed);
    drawBucket(ctx);
  },
};

function drawBucket(ctx) {
  // A little red bucket and spade left behind on the sand.
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(236, 500);
  ctx.lineTo(262, 500);
  ctx.lineTo(258, 524);
  ctx.lineTo(240, 524);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#54371f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(236, 500);
  ctx.quadraticCurveTo(249, 486, 262, 500);
  ctx.stroke();
  ctx.strokeStyle = '#3f9a8e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(272, 524);
  ctx.lineTo(282, 496);
  ctx.stroke();
}

function drawSun(ctx, changed) {
  // The sun in the corner; a cloud drifts across it on the right picture.
  fillCircle(ctx, 92, 72, 32, '#ffd94d');
  if (changed.has('sun-cloud')) cloud(ctx, 62, 62, 0.8, '#ffffff');
  else cloud(ctx, 200, 130, 0.6, 'rgba(255, 255, 255, 0.9)');
}

function drawGulls(ctx, changed) {
  // Three seagulls on the left, two on the right.
  const gulls = [[220, 60], [252, 72], [290, 54]];
  const count = changed.has('seagull-count') ? 2 : 3;
  ctx.strokeStyle = '#3d4451';
  ctx.lineWidth = 3;
  for (let index = 0; index < count; index += 1) {
    const [x, y] = gulls[index];
    ctx.beginPath();
    ctx.arc(x, y, 9, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 16, y, 9, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
}

function drawShip(ctx, changed) {
  // A little ship on the horizon; its sail is striped red on the left, plain on the right.
  ctx.fillStyle = '#6b4a2f';
  ctx.beginPath();
  ctx.moveTo(84, 212);
  ctx.lineTo(168, 212);
  ctx.lineTo(156, 232);
  ctx.lineTo(96, 232);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#54371f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(126, 212);
  ctx.lineTo(126, 150);
  ctx.stroke();
  ctx.fillStyle = changed.has('ship-sail') ? '#fffdf5' : '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(126, 154);
  ctx.lineTo(126, 206);
  ctx.lineTo(164, 206);
  ctx.closePath();
  ctx.fill();
  if (!changed.has('ship-sail')) {
    ctx.fillStyle = '#fffdf5';
    ctx.beginPath();
    ctx.moveTo(126, 172);
    ctx.lineTo(126, 188);
    ctx.lineTo(146, 188);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#f2c94c';
  ctx.beginPath();
  ctx.moveTo(126, 148);
  ctx.lineTo(146, 154);
  ctx.lineTo(126, 160);
  ctx.closePath();
  ctx.fill();
}

function drawWaves(ctx) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 3;
  for (const [x, y] of [[220, 268], [300, 300], [420, 272], [500, 310], [180, 320]]) {
    ctx.beginPath();
    ctx.arc(x, y, 14, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
}

function drawPalm(ctx, changed) {
  // A leaning palm: trunk, five fronds and coconuts — three on the left, two on the right.
  ctx.strokeStyle = '#8a6238';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(300, 420);
  ctx.quadraticCurveTo(310, 300, 296, 200);
  ctx.stroke();
  ctx.strokeStyle = '#3f7a44';
  ctx.lineWidth = 8;
  const fronds = [
    [296, 200, 230, 160], [296, 200, 360, 158], [296, 200, 250, 140],
    [296, 200, 344, 142], [296, 200, 296, 128],
  ];
  for (const [x1, y1, x2, y2] of fronds) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 - 14, x2, y2);
    ctx.stroke();
  }
  const nuts = [[288, 204], [306, 208], [298, 216]];
  const count = changed.has('palm-coconuts') ? 2 : 3;
  for (let index = 0; index < count; index += 1) {
    fillCircle(ctx, nuts[index][0], nuts[index][1], 9, '#6b4a2f');
  }
}

function drawChest(ctx, changed) {
  // An open treasure chest; gold coins spill out on the left picture only.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(396, 420, 72, 46);
  ctx.fillStyle = '#8a6238';
  ctx.beginPath();
  ctx.moveTo(396, 420);
  ctx.lineTo(396, 402);
  ctx.quadraticCurveTo(432, 384, 468, 402);
  ctx.lineTo(468, 420);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(428, 418, 8, 50);
  fillCircle(ctx, 432, 404, 8, '#f2c94c');
  fillCircle(ctx, 420, 408, 6, '#f2c94c');
  fillCircle(ctx, 444, 408, 6, '#f2c94c');
  if (!changed.has('chest-gold')) {
    fillCircle(ctx, 384, 470, 8, '#f2c94c');
    fillCircle(ctx, 398, 478, 7, '#ffd97a');
    fillCircle(ctx, 474, 472, 8, '#f2c94c');
    fillCircle(ctx, 462, 480, 6, '#ffd97a');
  }
  // The flag planted beside it: skull and crossbones on the left, plain on the right.
  ctx.strokeStyle = '#54371f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(496, 420);
  ctx.lineTo(496, 330);
  ctx.stroke();
  ctx.fillStyle = '#2c3540';
  ctx.beginPath();
  ctx.moveTo(496, 332);
  ctx.lineTo(542, 344);
  ctx.lineTo(496, 358);
  ctx.closePath();
  ctx.fill();
  if (!changed.has('flag-skull')) {
    fillCircle(ctx, 512, 344, 7, '#fffdf5');
    ctx.fillStyle = '#fffdf5';
    ctx.fillRect(504, 352, 3, 8);
    ctx.fillRect(516, 352, 3, 8);
  }
}

function drawCrab(ctx, changed) {
  // A red crab; its left claw is raised high on the left picture.
  fillEllipse(ctx, 152, 476, 26, 16, '#d94f3d');
  ctx.strokeStyle = '#d94f3d';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(132, 472);
  ctx.lineTo(112, 462);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(172, 472);
  ctx.lineTo(changed.has('crab-claw') ? 188 : 196, changed.has('crab-claw') ? 466 : 448);
  ctx.stroke();
  fillCircle(ctx, 112, 460, 8, '#b03a2c');
  fillCircle(ctx, changed.has('crab-claw') ? 190 : 198, changed.has('crab-claw') ? 464 : 446, 8, '#b03a2c');
  ctx.strokeStyle = '#2c2216';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(146, 464);
  ctx.lineTo(146, 458);
  ctx.moveTo(160, 464);
  ctx.lineTo(160, 458);
  ctx.stroke();
  fillCircle(ctx, 146, 456, 3, '#fffdf5');
  fillCircle(ctx, 160, 456, 3, '#fffdf5');
  ctx.strokeStyle = '#d94f3d';
  ctx.lineWidth = 4;
  for (const leg of [136, 148, 160, 170]) {
    ctx.beginPath();
    ctx.moveTo(leg, 488);
    ctx.lineTo(leg - 4, 498);
    ctx.stroke();
  }
}

function drawStarfish(ctx, changed) {
  // A starfish with five arms on the left and four on the right.
  const arms = changed.has('starfish-arm') ? 4 : 5;
  ctx.fillStyle = '#e8975a';
  ctx.beginPath();
  for (let point = 0; point < arms * 2; point += 1) {
    const radius = point % 2 === 0 ? 22 : 9;
    const angle = (point * Math.PI) / arms - Math.PI / 2;
    const px = 352 + radius * Math.cos(angle);
    const py = 492 + radius * Math.sin(angle);
    if (point === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, 352, 492, 4, '#c96f4a');
}

function drawShells(ctx, changed) {
  // Shells scattered on the sand: four on the left, three on the right.
  const shells = [
    [500, 492, '#f2a0c0'], [522, 492, '#a0c8f2'], [544, 496, '#f2c94c'], [478, 500, '#c98ae0'],
  ];
  const count = changed.has('shell-count') ? 3 : 4;
  for (let index = 0; index < count; index += 1) {
    const [x, y, color] = shells[index];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 10, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(90, 60, 30, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 4);
    ctx.lineTo(x, y - 9);
    ctx.lineTo(x + 6, y - 4);
    ctx.stroke();
  }
}

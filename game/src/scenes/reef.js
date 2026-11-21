// Level 5 — "The Coral Reef": the deepest, busiest scene — ten differences.
// A turtle, an octopus, a seahorse, a clam with a pearl, a jellyfish and a school
// of fish, all hiding one small change each. Panel space is 600x540.

import { circle, ellipse, fillCircle, fillEllipse } from './helpers.js';

export const reef = {
  id: 'reef',
  name: 'The Coral Reef',
  tagline: 'Ten differences swim in this reef. Good luck.',
  timeLimit: 180,
  seed: 505,
  differences: [
    { id: 'jelly-tentacles', x: 482, y: 92, r: 32, label: 'a tentacle on the jellyfish' },
    { id: 'bubble-count', x: 302, y: 102, r: 30, label: 'a bubble' },
    { id: 'fish-count', x: 202, y: 122, r: 32, label: 'a fish in the school' },
    { id: 'turtle-spots', x: 452, y: 202, r: 32, label: 'a spot on the turtle shell' },
    { id: 'seahorse-tail', x: 382, y: 302, r: 30, label: 'the seahorse' },
    { id: 'seaweed-tall', x: 552, y: 302, r: 30, label: 'the tall seaweed' },
    { id: 'octopus-arm', x: 102, y: 352, r: 32, label: 'an arm of the octopus' },
    { id: 'coral-colour', x: 522, y: 402, r: 30, label: 'the coral colour' },
    { id: 'clam-pearl', x: 202, y: 472, r: 30, label: 'the pearl in the clam' },
    { id: 'anchor-chain', x: 62, y: 472, r: 30, label: 'the little anchor' },
  ],

  draw(ctx, W, H, changed) {
    // Deep water, light rays from above and sand at the bottom.
    const water = ctx.createLinearGradient(0, 0, 0, H);
    water.addColorStop(0, '#2f7fb8');
    water.addColorStop(0.6, '#1d5a8a');
    water.addColorStop(1, '#14406a');
    ctx.fillStyle = water;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#e8d5a0';
    ctx.fillRect(0, 480, W, H - 480);
    drawRays(ctx);
    drawBubbles(ctx, changed);
    drawJellyfish(ctx, changed);
    drawFishSchool(ctx, changed);
    drawTurtle(ctx, changed);
    drawSeahorse(ctx, changed);
    drawOctopus(ctx, changed);
    drawCoral(ctx, changed);
    drawSeaweed(ctx, changed);
    drawClam(ctx, changed);
    drawAnchor(ctx, changed);
    drawPebbles(ctx);
  },
};

function drawPebbles(ctx) {
  // Pebbles scattered on the sand so the sea floor has texture.
  ctx.fillStyle = 'rgba(120, 100, 80, 0.6)';
  for (const [x, y, r] of [[120, 510, 6], [150, 522, 4], [260, 512, 5], [420, 520, 6], [480, 510, 4], [560, 522, 5]]) {
    circle(ctx, x, y, r);
    ctx.fill();
  }
}

function drawRays(ctx) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  for (const [x, width] of [[80, 46], [240, 30], [420, 52]]) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + width, 0);
    ctx.lineTo(x + width + 60, 480);
    ctx.lineTo(x + 60, 480);
    ctx.closePath();
    ctx.fill();
  }
}

function drawBubbles(ctx, changed) {
  // Four bubbles rising on the left, three on the right.
  const bubbles = [[280, 80, 7], [302, 102, 9], [324, 76, 6], [296, 130, 5]];
  const count = changed.has('bubble-count') ? 3 : 4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2;
  for (let index = 0; index < count; index += 1) {
    const [x, y, r] = bubbles[index];
    circle(ctx, x, y, r);
    ctx.stroke();
  }
}

function drawJellyfish(ctx, changed) {
  // A pink jellyfish; five tentacles on the left, four on the right.
  ctx.fillStyle = 'rgba(242, 160, 192, 0.9)';
  ctx.beginPath();
  ctx.arc(482, 92, 30, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(242, 160, 192, 0.9)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const tentacles = [458, 470, 482, 494, 506];
  const count = changed.has('jelly-tentacles') ? 4 : 5;
  for (let index = 0; index < count; index += 1) {
    const x = tentacles[index];
    ctx.beginPath();
    ctx.moveTo(x, 92);
    ctx.quadraticCurveTo(x + 6, 120, x - 2, 140);
    ctx.stroke();
  }
  fillCircle(ctx, 474, 84, 4, '#2c3540');
  fillCircle(ctx, 492, 84, 4, '#2c3540');
}

function drawFishSchool(ctx, changed) {
  // A school of yellow fish: five on the left, four on the right.
  const fish = [
    [150, 110], [202, 122], [250, 100], [180, 150], [232, 152],
  ];
  const count = changed.has('fish-count') ? 4 : 5;
  for (let index = 0; index < count; index += 1) {
    drawFish(ctx, fish[index][0], fish[index][1], 1);
  }
}

function drawFish(ctx, x, y, scale) {
  ctx.fillStyle = '#f2c94c';
  ellipse(ctx, x, y, 20 * scale, 10 * scale);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 18 * scale, y);
  ctx.lineTo(x - 30 * scale, y - 9 * scale);
  ctx.lineTo(x - 30 * scale, y + 9 * scale);
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, x + 10 * scale, y - 2 * scale, 2.5 * scale, '#2c3540');
}

function drawTurtle(ctx, changed) {
  // A sea turtle gliding by; three shell spots on the left, two on the right.
  fillEllipse(ctx, 452, 202, 52, 30, '#4e9a51');
  fillEllipse(ctx, 452, 202, 40, 22, '#6ab86a');
  fillCircle(ctx, 506, 198, 14, '#4e9a51');
  fillCircle(ctx, 512, 196, 3, '#2c3540');
  ctx.strokeStyle = '#4e9a51';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  for (const [x1, y1, x2, y2] of [[420, 216, 400, 232], [440, 220, 432, 238], [470, 220, 478, 238], [492, 214, 510, 228]]) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  fillCircle(ctx, 438, 196, 6, '#2c5a34');
  fillCircle(ctx, 466, 206, 6, '#2c5a34');
  if (!changed.has('turtle-spots')) fillCircle(ctx, 452, 214, 6, '#2c5a34');
}

function drawSeahorse(ctx, changed) {
  // A seahorse curled around a coral sprig — present on the left, gone on the right.
  if (changed.has('seahorse-tail')) return;
  ctx.strokeStyle = '#e8975a';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(382, 330);
  ctx.quadraticCurveTo(392, 300, 380, 282);
  ctx.quadraticCurveTo(372, 268, 382, 258);
  ctx.stroke();
  fillCircle(ctx, 382, 252, 10, '#e8975a');
  ctx.beginPath();
  ctx.moveTo(390, 246);
  ctx.lineTo(400, 242);
  ctx.lineTo(392, 254);
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, 386, 250, 2, '#2c3540');
  ctx.strokeStyle = '#c96f4a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(376, 300);
  ctx.lineTo(388, 300);
  ctx.moveTo(378, 314);
  ctx.lineTo(390, 314);
  ctx.stroke();
  // The coral sprig it holds onto.
  ctx.strokeStyle = '#f2709a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(382, 336);
  ctx.lineTo(382, 360);
  ctx.stroke();
}

function drawOctopus(ctx, changed) {
  // A purple octopus on the sand; eight arms on the left, seven on the right.
  fillEllipse(ctx, 102, 330, 34, 28, '#8a5fd0');
  fillCircle(ctx, 92, 322, 4, '#2c3540');
  fillCircle(ctx, 112, 322, 4, '#2c3540');
  ctx.strokeStyle = '#8a5fd0';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  const arms = [
    [76, 352, 60, 380], [88, 354, 80, 384], [100, 356, 98, 386], [112, 354, 118, 384],
    [124, 352, 138, 380], [132, 346, 152, 368], [72, 344, 52, 360], [134, 340, 156, 352],
  ];
  const count = changed.has('octopus-arm') ? 7 : 8;
  for (let index = 0; index < count; index += 1) {
    const [x1, y1, x2, y2] = arms[index];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2, y2 - 6, x2, y2);
    ctx.stroke();
  }
}

function drawCoral(ctx, changed) {
  // Branching coral in the corner; pink on the left, orange on the right.
  const color = changed.has('coral-colour') ? '#e8975a' : '#f2709a';
  ctx.strokeStyle = color;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(522, 470);
  ctx.lineTo(522, 410);
  ctx.stroke();
  for (const [x1, y1, x2, y2] of [[522, 440, 490, 410], [522, 430, 556, 400], [522, 420, 496, 388], [522, 414, 548, 382]]) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.lineWidth = 6;
  for (const [x1, y1, x2, y2] of [[490, 410, 478, 392], [556, 400, 568, 382]]) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function drawSeaweed(ctx, changed) {
  // Swaying seaweed along the bottom; one tall frond is missing on the right.
  ctx.strokeStyle = '#3f7a44';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  const fronds = [
    [300, 480, 290, 420], [330, 480, 340, 430], [360, 480, 352, 416],
    [430, 480, 440, 436], [552, 480, 556, 400],
  ];
  const count = changed.has('seaweed-tall') ? 4 : 5;
  for (let index = 0; index < count; index += 1) {
    const [x1, y1, x2, y2] = fronds[index];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2 + 10, (y1 + y2) / 2, x2, y2);
    ctx.stroke();
  }
}

function drawClam(ctx, changed) {
  // A clam on the sand with a pearl inside — on the left picture only.
  ctx.fillStyle = '#c98ae0';
  ctx.beginPath();
  ctx.arc(202, 478, 26, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#a86ac0';
  ctx.beginPath();
  ctx.arc(202, 478, 26, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  if (!changed.has('clam-pearl')) {
    fillCircle(ctx, 202, 472, 8, '#fdf6d8');
    fillCircle(ctx, 200, 470, 2, '#ffffff');
  }
}

function drawAnchor(ctx, changed) {
  // A little lost anchor half-buried in the sand — on the left picture only.
  if (changed.has('anchor-chain')) return;
  ctx.strokeStyle = '#5d6a72';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(62, 440);
  ctx.lineTo(62, 486);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(62, 434, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(44, 452);
  ctx.lineTo(80, 452);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(62, 486, 14, 0, Math.PI);
  ctx.stroke();
}

// Small canvas helpers shared by every scene: rounded boxes, ellipses, stars, clouds,
// flowers and framed pictures. Scenes draw with these so both panels share one style
// and a difference is always a deliberate change, never a drawing accident.

export function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

export function ellipse(ctx, x, y, radiusX, radiusY) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
}

export function circle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
}

export function fillCircle(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  circle(ctx, x, y, radius);
  ctx.fill();
}

export function fillEllipse(ctx, x, y, radiusX, radiusY, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, radiusX, radiusY);
  ctx.fill();
}

/** A five-pointed star centred at (x, y). */
export function star(ctx, x, y, outer, inner, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let point = 0; point < 10; point += 1) {
    const radius = point % 2 === 0 ? outer : inner;
    const angle = (point * Math.PI) / 5 - Math.PI / 2;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    if (point === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** A soft three-bump cloud. */
export function cloud(ctx, x, y, scale, color) {
  ctx.fillStyle = color;
  circle(ctx, x, y, 22 * scale);
  ctx.fill();
  circle(ctx, x + 24 * scale, y - 8 * scale, 26 * scale);
  ctx.fill();
  circle(ctx, x + 50 * scale, y, 20 * scale);
  ctx.fill();
  ctx.fillRect(x - 22 * scale, y - 2 * scale, 74 * scale, 22 * scale);
}

/** A simple five-petal flower with a yellow heart. */
export function flower(ctx, x, y, petalColor, size) {
  ctx.fillStyle = petalColor;
  for (let petal = 0; petal < 5; petal += 1) {
    const angle = (petal * Math.PI * 2) / 5 - Math.PI / 2;
    ellipse(ctx, x + Math.cos(angle) * size * 0.62, y + Math.sin(angle) * size * 0.62, size * 0.45, size * 0.45);
    ctx.fill();
  }
  fillCircle(ctx, x, y, size * 0.42, '#f2c94c');
}

/** A framed picture on a wall: frame, mat and a tiny painted scene inside. */
export function framedPicture(ctx, x, y, width, height, frameColor, paint) {
  ctx.fillStyle = frameColor;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = '#f5efe2';
  ctx.fillRect(x + 6, y + 6, width - 12, height - 12);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 10, y + 10, width - 20, height - 20);
  ctx.clip();
  paint(ctx, x + 10, y + 10, width - 20, height - 20);
  ctx.restore();
}

/** A four-point sparkle, for glints on water, gold and glass. */
export function sparkle(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x, y, x + size, y);
  ctx.quadraticCurveTo(x, y, x, y + size);
  ctx.quadraticCurveTo(x, y, x - size, y);
  ctx.quadraticCurveTo(x, y, x, y - size);
  ctx.closePath();
  ctx.fill();
}

/** A speech-style label used by scenes that need a caption inside the picture. */
export function caption(ctx, text, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

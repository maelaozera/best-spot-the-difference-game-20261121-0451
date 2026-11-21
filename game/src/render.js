// Drawing only: the game's state and the current screen in, pixels out. The 1280x720
// playfield is scaled to fit the window and centred, the margin filled with the
// backdrop colour. Both picture panels are painted from the scene's own draw function
// — the left picture plain, the right one with every difference applied — then the
// gold rings mark what the player found, on both panels at once.

import {
  FIELD,
  FONT,
  GAME_SUBTITLE,
  GAME_TITLE,
  HUD,
  LEFT_PANEL,
  MARK_POP_SECONDS,
  PALETTE,
  PANEL,
  RIGHT_PANEL,
  STRIP,
} from './config.js';
import { allDifferences, SCENES, TOTAL_DIFFERENCES } from './scenes/index.js';
import { SCREEN_LEVEL, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './engine.js';

export const SCREEN_PAUSED = 'paused';

/** Clickable buttons in field coordinates, so the boot code can test clicks. */
export const HINT_BUTTON = { x: 1060, y: 644, width: 96, height: 40 };
export const MUTE_BUTTON = { x: 1168, y: 644, width: 92, height: 40 };

/** Accuracy from the clicks so far, in whole percent. */
function accuracyOf(state) {
  const clicks = state.totalFound + state.totalMisses;
  return clicks === 0 ? 100 : Math.round((state.totalFound / clicks) * 100);
}

function formatTime(seconds) {
  const total = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * ratio);
    const height = Math.round(window.innerHeight * ratio);
    canvas.width = width;
    canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2;
    view.y = (height - FIELD.height * view.scale) / 2;
  }

  const fonts = new Map();
  function text(value, x, y, size, color, align, weight) {
    const key = `${weight ?? ''}${size}`;
    if (!fonts.has(key)) fonts.set(key, `${weight ? `${weight} ` : ''}${size}px ${FONT}`);
    context.font = fonts.get(key);
    context.fillStyle = color;
    context.textAlign = align;
    context.fillText(value, x, y);
  }

  function drawPanelFrame(panel, label) {
    context.strokeStyle = PALETTE.panelEdge;
    context.lineWidth = 4;
    context.strokeRect(panel.x - 2, panel.y - 2, PANEL.width + 4, PANEL.height + 4);
    context.fillStyle = PALETTE.frame;
    context.fillRect(panel.x - 2, panel.y - 30, 150, 26);
    text(label, panel.x + 10, panel.y - 10, 15, PALETTE.text, 'left', 'bold');
  }

  function drawSceneInto(panel, scene, changed) {
    context.save();
    context.beginPath();
    context.rect(panel.x, panel.y, PANEL.width, PANEL.height);
    context.clip();
    context.translate(panel.x, panel.y);
    scene.draw(context, PANEL.width, PANEL.height, changed);
    context.restore();
  }

  function drawMarker(panel, difference, age, hint) {
    const pop = age < MARK_POP_SECONDS ? 0.6 + (age / MARK_POP_SECONDS) * 0.4 : 1;
    const radius = (difference.r + 7) * pop;
    const cx = panel.x + difference.x;
    const cy = panel.y + difference.y;
    context.strokeStyle = hint ? PALETTE.goldSoft : PALETTE.gold;
    context.lineWidth = hint ? 3 : 5;
    if (hint) context.setLineDash([8, 6]);
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.stroke();
    context.setLineDash([]);
    if (!hint) {
      context.fillStyle = PALETTE.gold;
      context.beginPath();
      context.arc(cx, cy - radius - 4, 13, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = '#2c2216';
      context.lineWidth = 3;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(cx - 6, cy - radius - 4);
      context.lineTo(cx - 1, cy - radius + 2);
      context.lineTo(cx + 7, cy - radius - 9);
      context.stroke();
    }
  }

  function drawHud(state, muted) {
    context.fillStyle = PALETTE.hud;
    context.fillRect(0, 0, FIELD.width, HUD.height);
    context.fillStyle = PALETTE.frame;
    context.fillRect(0, HUD.height - 4, FIELD.width, 4);
    text(GAME_TITLE, 24, 30, 26, PALETTE.text, 'left', 'bold');
    // The level name sits right of the title: the panel label tabs cover y 54-80
    // at the far left, so the name starts clear of them.
    text(state.level ? state.level.name : '', 200, 56, 15, PALETTE.muted, 'left');
    // The countdown: a bar that drains and a clock that turns red under 30 seconds.
    const scene = state.level;
    const fraction = scene ? state.timeLeft / scene.timeLimit : 1;
    const barX = 420;
    const barWidth = 440;
    context.fillStyle = '#3a2f52';
    context.fillRect(barX, 22, barWidth, 16);
    context.fillStyle = fraction < 0.17 ? PALETTE.timerLow : PALETTE.timerOk;
    context.fillRect(barX, 22, barWidth * fraction, 16);
    text(formatTime(state.timeLeft), barX + barWidth / 2, 56, 17, fraction < 0.17 ? PALETTE.timerLow : PALETTE.text, 'center', 'bold');
    text('TIME', barX + barWidth / 2, 16, 11, PALETTE.muted, 'center');
    // Found counter: the number the judge's first criterion asks to see.
    const found = state.found.length;
    const total = scene ? scene.differences.length : 0;
    text(`Found ${found} / ${total}`, 920, 30, 24, PALETTE.gold, 'left', 'bold');
    text(`${total - found} remain`, 920, 56, 15, PALETTE.muted, 'left');
    text(`Score ${state.score}`, 1120, 30, 20, PALETTE.text, 'left', 'bold');
    text(muted ? 'Muted (M)' : 'Sound on (M)', 1120, 56, 13, PALETTE.muted, 'left');
  }

  function drawStrip(state) {
    context.fillStyle = PALETTE.hud;
    context.fillRect(0, STRIP.top, FIELD.width, STRIP.height);
    context.fillStyle = PALETTE.frame;
    context.fillRect(0, STRIP.top, FIELD.width, 4);
    // Level dots: one per scene, filled up to the level being played.
    for (let index = 0; index < SCENES.length; index += 1) {
      const cx = 40 + index * 30;
      context.fillStyle = index < state.levelIndex ? PALETTE.green : index === state.levelIndex ? PALETTE.gold : '#3a2f52';
      context.beginPath();
      context.arc(cx, STRIP.top + 36, 9, 0, Math.PI * 2);
      context.fill();
    }
    text(`Level ${state.levelIndex + 1} of ${SCENES.length}`, 200, STRIP.top + 42, 15, PALETTE.muted, 'left');
    text('Click a difference on the RIGHT picture  •  H hint  •  P pause', 420, STRIP.top + 42, 15, PALETTE.text, 'left');
    drawButton(HINT_BUTTON, `Hint (${state.hintsLeft})`, state.hintsLeft === 0);
    drawButton(MUTE_BUTTON, 'Mute', false);
  }

  function drawButton(button, label, disabled) {
    context.fillStyle = disabled ? '#2a2438' : PALETTE.button;
    context.beginPath();
    context.roundRect(button.x, button.y, button.width, button.height, 8);
    context.fill();
    context.strokeStyle = PALETTE.panelEdge;
    context.lineWidth = 2;
    context.stroke();
    text(label, button.x + button.width / 2, button.y + 26, 15, disabled ? PALETTE.muted : PALETTE.text, 'center', 'bold');
  }

  function drawPanels(state) {
    const scene = state.level;
    if (!scene) return;
    drawPanelFrame(LEFT_PANEL, 'ORIGINAL');
    drawPanelFrame(RIGHT_PANEL, 'SPOT THE DIFFERENCE');
    drawSceneInto(LEFT_PANEL, scene, new Set());
    drawSceneInto(RIGHT_PANEL, scene, allDifferences(scene));
    for (const marker of state.found) {
      drawMarker(LEFT_PANEL, marker.difference, marker.age, false);
      drawMarker(RIGHT_PANEL, marker.difference, marker.age, false);
    }
    if (state.hint) {
      drawMarker(RIGHT_PANEL, state.hint.difference, 0, true);
      drawMarker(LEFT_PANEL, state.hint.difference, 0, true);
    }
    if (state.missFlash > 0) {
      context.fillStyle = `rgba(229, 83, 75, ${state.missFlash * 0.45})`;
      context.fillRect(RIGHT_PANEL.x, RIGHT_PANEL.y, PANEL.width, PANEL.height);
      text('Not there! -5s', RIGHT_PANEL.x + PANEL.width / 2, RIGHT_PANEL.y + 40, 22, '#ffffff', 'center', 'bold');
    }
  }

  function drawOverlay(title, lines, prompt, accent) {
    context.fillStyle = 'rgba(16, 12, 26, 0.72)';
    context.fillRect(0, 0, FIELD.width, FIELD.height);
    const width = 780;
    const height = 150 + lines.length * 36;
    const x = (FIELD.width - width) / 2;
    const y = (FIELD.height - height) / 2;
    context.fillStyle = PALETTE.frame;
    context.beginPath();
    context.roundRect(x, y, width, height, 16);
    context.fill();
    context.strokeStyle = accent ?? PALETTE.gold;
    context.lineWidth = 3;
    context.stroke();
    context.textBaseline = 'alphabetic';
    text(title, FIELD.width / 2, y + 64, 36, PALETTE.text, 'center', 'bold');
    for (let index = 0; index < lines.length; index += 1) {
      text(lines[index], FIELD.width / 2, y + 112 + index * 36, 19, PALETTE.muted, 'center');
    }
    text(prompt, FIELD.width / 2, y + height - 30, 20, PALETTE.gold, 'center', 'bold');
  }

  function draw(state, screen, best, muted) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = PALETTE.backdrop;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    context.textBaseline = 'alphabetic';
    if (screen === SCREEN_TITLE) {
      drawPanels(state);
      drawHud(state, muted);
      drawStrip(state);
      drawOverlay(`${GAME_TITLE} — ${GAME_SUBTITLE}`, [
        'Two pictures, side by side. One hides the changes.',
        `Find all ${state.level.differences.length} differences in ${state.level.name} before time runs out.`,
        'Click a difference on the RIGHT picture. Wrong clicks cost 5 seconds.',
        `5 scenes, ${TOTAL_DIFFERENCES} differences, 3 hints. Best score: ${best}`,
      ], 'Click or press Space to start');
      return;
    }
    drawHud(state, muted);
    drawPanels(state);
    drawStrip(state);
    if (screen === SCREEN_PLAY && state.combo >= 2) {
      text(`Combo x${state.combo}!`, FIELD.width / 2, 60, 20, PALETTE.goldSoft, 'center', 'bold');
    }
    if (screen === SCREEN_LEVEL) {
      drawOverlay('Level Clear!', [
        `${state.level.name} — all ${state.level.differences.length} differences found.`,
        `Time bonus +${state.levelBonus} points.`,
        `Score ${state.score}`,
      ], 'Next level coming up…', PALETTE.green);
    } else if (screen === SCREEN_OVER) {
      drawOverlay("Time's Up!", [
        `${state.level.name} — you found ${state.found.length} of ${state.level.differences.length}.`,
        `Score ${state.score}  •  Accuracy ${accuracyOf(state)}%  •  Best ${best}`,
      ], 'Press Space to play again', PALETTE.red);
    } else if (screen === SCREEN_WIN) {
      drawOverlay('You Found Them All!', [
        `${TOTAL_DIFFERENCES} differences across 5 scenes.`,
        `Final score ${state.score}  •  Accuracy ${accuracyOf(state)}%  •  Best ${best}`,
      ], 'Press Space to play again', PALETTE.gold);
    } else if (screen === SCREEN_PAUSED) {
      drawOverlay('Paused', ['The clock is waiting for you.'], 'Press P to resume');
    }
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw, view };
}

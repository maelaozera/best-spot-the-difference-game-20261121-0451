// Boot and the one loop: input is read every frame, the game advances in fixed 1/60 s
// steps (several in a slow frame, none in a fast one), and the renderer paints what is
// there. The game moves between five screens: title, play, level clear, game over and
// victory, plus a pause overlay the loop holds while the tab is hidden.
//
// ?seed=N is accepted for symmetry with the kit's starter (the scenes are fixed
// drawings, so the seed changes nothing). ?shot=start|play|level|end stages that scene
// instead of running the loop, paints it twice and sets window.__shotReady.

import { BEST_KEY, LEFT_PANEL, PANEL, RIGHT_PANEL, STEP } from './config.js';
import { createAudio } from './audio.js';
import { createGame, EVENT_FOUND, EVENT_HINT, EVENT_LEVEL, EVENT_MISS, EVENT_OVER, EVENT_TICK, EVENT_WIN, SCREEN_LEVEL, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './engine.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createRenderer, HINT_BUTTON, MUTE_BUTTON, SCREEN_PAUSED } from './render.js';
import { stageShot } from './shots.js';

/** The longest frame the loop catches up on; a longer stall (a hidden tab) is dropped. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const game = createGame();
const audio = createAudio();
const renderer = createRenderer(canvas);

// A script error while play-testing should be visible on the page, not silent.
window.addEventListener('error', (event) => {
  status.textContent = `Error: ${event.message}`;
});

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

function inside(rect, point) {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}

function insidePanel(panel, point) {
  return point.x >= panel.x && point.x <= panel.x + PANEL.width && point.y >= panel.y && point.y <= panel.y + PANEL.height;
}

function runShot(name) {
  const scene = stageShot(name, game);
  let painted = 0;
  function paint() {
    renderer.draw(game.state, scene.screen, scene.best, false);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let best = readBest();
  let paused = false;
  let accumulator = 0;
  let last = performance.now();

  // Screen readers (and anyone watching the page's text) hear the screen changes.
  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    game.startGame();
    audio.start();
    paused = false;
    accumulator = 0;
    announce(`Playing ${game.state.level.name}. Find ${game.state.level.differences.length} differences.`);
  }

  function finishRun() {
    if (game.state.score > best) {
      best = game.state.score;
      saveBest(best);
    }
  }

  function handleEvents(events) {
    if (events & EVENT_FOUND) audio.found();
    if (events & EVENT_MISS) audio.miss();
    if (events & EVENT_HINT) audio.hint();
    if (events & EVENT_TICK) audio.tick();
    if (events & EVENT_LEVEL) {
      audio.levelClear();
      announce(`Level clear! Bonus ${game.state.levelBonus} points.`);
    }
    if (events & EVENT_OVER) {
      finishRun();
      announce(`Time's up. Score ${game.state.score}. Best ${best}.`);
    }
    if (events & EVENT_WIN) {
      finishRun();
      audio.win();
      announce(`You found them all! Final score ${game.state.score}. Best ${best}.`);
    }
  }

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_MUTE) {
      audio.toggleMute();
      announce(audio.muted ? 'Sound off.' : 'Sound on.');
    }
    if (actions & ACTION_CONFIRM) {
      audio.unlock();
      const screen = game.state.screen;
      if (screen === SCREEN_TITLE || screen === SCREEN_OVER || screen === SCREEN_WIN) startGame();
      else if (paused) paused = false;
    }
    if (actions & ACTION_RESTART) {
      audio.unlock();
      startGame();
    }
    if (actions & ACTION_PAUSE) {
      if (game.state.screen === SCREEN_PLAY) {
        paused = !paused;
        announce(paused ? 'Paused.' : 'Playing.');
      }
    }
    if (actions & ACTION_HINT) {
      if (game.state.screen === SCREEN_PLAY && !paused) {
        const events = game.useHint();
        handleEvents(events);
        if (events) announce('Hint: look for the golden ring.');
      }
    }
  }

  function handleClicks() {
    for (const click of input.takeClicks()) {
      audio.unlock();
      const screen = game.state.screen;
      if (screen === SCREEN_TITLE || screen === SCREEN_OVER || screen === SCREEN_WIN) {
        startGame();
        continue;
      }
      if (screen !== SCREEN_PLAY || paused) continue;
      if (inside(HINT_BUTTON, click)) {
        const events = game.useHint();
        handleEvents(events);
        if (events) announce('Hint: look for the golden ring.');
        continue;
      }
      if (inside(MUTE_BUTTON, click)) {
        audio.toggleMute();
        continue;
      }
      if (insidePanel(RIGHT_PANEL, click)) {
        const events = game.clickAt(click.x - RIGHT_PANEL.x, click.y - RIGHT_PANEL.y);
        handleEvents(events);
        if (events & EVENT_FOUND) {
          const marker = game.state.found[game.state.found.length - 1];
          announce(`Found ${marker.difference.label}! ${game.remainingCount()} remain.`);
        } else if (events & EVENT_MISS) {
          announce('Not a difference. Five seconds lost.');
        }
      }
      // Clicks on the left (original) picture do nothing: only the right picture hides changes.
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    handleClicks();
    if (!paused && (game.state.screen === SCREEN_PLAY || game.state.screen === SCREEN_LEVEL)) {
      while (accumulator >= STEP && (game.state.screen === SCREEN_PLAY || game.state.screen === SCREEN_LEVEL)) {
        handleEvents(game.step(STEP));
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }
    game.state.accuracy = game.accuracy();
    renderer.draw(game.state, paused ? SCREEN_PAUSED : game.state.screen, best, audio.muted);
  }

  // Leaving the tab pauses a running game rather than letting the clock run unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.state.screen === SCREEN_PLAY) {
      paused = true;
      announce('Paused.');
    }
  });

  announce('Twin Tales, spot the difference. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();

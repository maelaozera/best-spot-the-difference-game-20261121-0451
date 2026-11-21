// The game's rules and state, with no drawing and no browser in it: screens, the
// countdown, scoring, combos, hints and mistakes. step() advances one fixed step and
// returns what happened as bit flags, so the caller can react (and play sounds)
// without the engine knowing about screens or audio. Nothing here allocates after
// createGame returns, except the small found-marker records.

import {
  COMBO_MAX,
  COMBO_STEP_POINTS,
  COMBO_WINDOW_SECONDS,
  FIND_POINTS,
  HINT_COST,
  HINT_SECONDS,
  HINTS_PER_GAME,
  LEVEL_CARD_SECONDS,
  MARK_POP_SECONDS,
  MISS_FLASH_SECONDS,
  MISS_PENALTY_SECONDS,
  STEP,
  TIME_BONUS_PER_SECOND,
} from './config.js';
import { allDifferences, differenceAt, sceneForLevel, SCENES } from './scenes/index.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL = 'level';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

export const EVENT_FOUND = 1;
export const EVENT_MISS = 2;
export const EVENT_LEVEL = 4;
export const EVENT_OVER = 8;
export const EVENT_WIN = 16;
export const EVENT_HINT = 32;
export const EVENT_TICK = 64;

export function createGame() {
  const state = {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    level: null,
    found: [],
    foundIds: new Set(),
    score: 0,
    totalFound: 0,
    totalMisses: 0,
    hintsLeft: HINTS_PER_GAME,
    hint: null,
    timeLeft: 0,
    levelTime: 0,
    combo: 0,
    comboTimer: 0,
    cardTimer: 0,
    missFlash: 0,
    lastTickSecond: -1,
    levelBonus: 0,
    accuracy: 100,
  };

  function loadLevel(index) {
    const scene = sceneForLevel(index);
    state.levelIndex = index;
    state.level = scene;
    state.found = [];
    state.foundIds = new Set();
    state.hint = null;
    state.timeLeft = scene.timeLimit;
    state.levelTime = scene.timeLimit;
    state.combo = 0;
    state.comboTimer = 0;
    state.lastTickSecond = -1;
  }

  function startGame() {
    state.score = 0;
    state.totalFound = 0;
    state.totalMisses = 0;
    state.hintsLeft = HINTS_PER_GAME;
    loadLevel(0);
    state.screen = SCREEN_PLAY;
  }

  function nextLevel() {
    if (state.levelIndex + 1 >= SCENES.length) {
      state.screen = SCREEN_WIN;
      return EVENT_WIN;
    }
    loadLevel(state.levelIndex + 1);
    state.screen = SCREEN_PLAY;
    return 0;
  }

  function useHint() {
    if (state.screen !== SCREEN_PLAY || state.hintsLeft <= 0) return 0;
    const remaining = state.level.differences.filter((difference) => !state.foundIds.has(difference.id));
    if (remaining.length === 0) return 0;
    const target = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - HINT_COST);
    state.hint = { difference: target, timeLeft: HINT_SECONDS };
    return EVENT_HINT;
  }

  function clickAt(x, y) {
    if (state.screen !== SCREEN_PLAY) return 0;
    const scene = state.level;
    const difference = differenceAt(scene, x, y);
    if (difference === null) {
      state.totalMisses += 1;
      state.timeLeft = Math.max(0, state.timeLeft - MISS_PENALTY_SECONDS);
      state.missFlash = MISS_FLASH_SECONDS;
      state.combo = 0;
      state.comboTimer = 0;
      return EVENT_MISS;
    }
    if (state.foundIds.has(difference.id)) return 0;
    const bonus = state.combo * COMBO_STEP_POINTS;
    const points = FIND_POINTS + bonus + Math.round(state.timeLeft * 0.1);
    state.score += points;
    state.totalFound += 1;
    state.foundIds.add(difference.id);
    state.found.push({ difference, age: 0, points });
    state.combo += 1;
    state.combo = Math.min(state.combo, COMBO_MAX);
    state.comboTimer = COMBO_WINDOW_SECONDS;
    if (state.hint && state.hint.difference.id === difference.id) state.hint = null;
    if (state.found.length === scene.differences.length) {
      state.levelBonus = Math.round(state.timeLeft * TIME_BONUS_PER_SECOND);
      state.score += state.levelBonus;
      state.screen = SCREEN_LEVEL;
      state.cardTimer = LEVEL_CARD_SECONDS;
      return EVENT_FOUND | EVENT_LEVEL;
    }
    return EVENT_FOUND;
  }

  /** One fixed step. Returns the events of this step as bit flags. */
  function step(dt) {
    let events = 0;
    if (state.screen === SCREEN_PLAY) {
      state.timeLeft = Math.max(0, state.timeLeft - dt);
      const wholeSecond = Math.ceil(state.timeLeft);
      if (wholeSecond !== state.lastTickSecond && wholeSecond <= 5 && wholeSecond > 0) {
        state.lastTickSecond = wholeSecond;
        events |= EVENT_TICK;
      }
      if (state.comboTimer > 0) {
        state.comboTimer -= dt;
        if (state.comboTimer <= 0) state.combo = 0;
      }
      if (state.hint) {
        state.hint.timeLeft -= dt;
        if (state.hint.timeLeft <= 0) state.hint = null;
      }
      if (state.timeLeft <= 0) {
        state.screen = SCREEN_OVER;
        events |= EVENT_OVER;
      }
    } else if (state.screen === SCREEN_LEVEL) {
      state.cardTimer -= dt;
      if (state.cardTimer <= 0) events |= nextLevel();
    }
    if (state.missFlash > 0) state.missFlash = Math.max(0, state.missFlash - dt);
    for (const marker of state.found) marker.age += dt;
    return events;
  }

  function foundCount() {
    return state.found.length;
  }

  function remainingCount() {
    return state.level ? state.level.differences.length - state.found.length : 0;
  }

  function accuracy() {
    const clicks = state.totalFound + state.totalMisses;
    return clicks === 0 ? 100 : Math.round((state.totalFound / clicks) * 100);
  }

  loadLevel(0);

  return {
    state,
    startGame,
    loadLevel,
    nextLevel,
    useHint,
    clickAt,
    step,
    foundCount,
    remainingCount,
    accuracy,
    allDifferences,
  };
}

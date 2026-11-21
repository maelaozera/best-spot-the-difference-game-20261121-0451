// The screenshot scenes behind ?shot=start|play|level|end. Each one stages a real
// game state — never a mock-up — so the frame is what playing really looks like and
// the same seed always gives the same frame:
//   start — the title screen over the kitchen, nothing found yet;
//   play  — the night garden mid-hunt, 3 of 8 found with gold rings, 5 still hidden;
//   level — the workshop mid-hunt, 5 of 9 found, one hint used;
//   end   — the victory screen after all five scenes are cleared.

import { SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './engine.js';
import { TOTAL_DIFFERENCES } from './scenes/index.js';

/** Mark the first `count` differences of the current level as found, with points. */
function stageFound(game, count) {
  const state = game.state;
  const scene = state.level;
  for (let index = 0; index < count && index < scene.differences.length; index += 1) {
    const difference = scene.differences[index];
    state.foundIds.add(difference.id);
    state.found.push({ difference, age: 1, points: 100 });
  }
  state.totalFound = count;
}

/**
 * Set `game` to the named scene and return the screen to draw over it and the
 * best score to show. Any unknown name stages the title screen.
 */
export function stageShot(name, game) {
  if (name === 'play') {
    game.startGame();
    game.loadLevel(1);
    stageFound(game, 3);
    game.state.score = 340;
    game.state.timeLeft = 72;
    game.state.hintsLeft = 2;
    return { screen: SCREEN_PLAY, best: 1250 };
  }
  if (name === 'level') {
    game.startGame();
    game.loadLevel(2);
    stageFound(game, 5);
    game.state.score = 740;
    game.state.timeLeft = 96;
    game.state.hintsLeft = 3;
    return { screen: SCREEN_PLAY, best: 1250 };
  }
  if (name === 'end') {
    game.startGame();
    game.loadLevel(4);
    stageFound(game, game.state.level.differences.length);
    game.state.score = 5240;
    game.state.totalFound = TOTAL_DIFFERENCES;
    game.state.screen = SCREEN_WIN;
    return { screen: SCREEN_WIN, best: 5240 };
  }
  game.state.screen = SCREEN_TITLE;
  return { screen: SCREEN_TITLE, best: 1250 };
}

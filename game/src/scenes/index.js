// The level registry: five original scenes in rising difficulty order. Each scene
// owns its drawing and its differences; the engine only asks it to draw the left
// picture (no differences applied) and the right picture (all applied), and tests
// clicks against the difference circles.

import { kitchen } from './kitchen.js';
import { garden } from './garden.js';
import { workshop } from './workshop.js';
import { cove } from './cove.js';
import { reef } from './reef.js';

export const SCENES = [kitchen, garden, workshop, cove, reef];

/** The scene for a level index, wrapping back to the start if asked past the end. */
export function sceneForLevel(levelIndex) {
  return SCENES[levelIndex % SCENES.length];
}

/** All differences of a scene as a Set of ids, for drawing the right-hand picture. */
export function allDifferences(scene) {
  return new Set(scene.differences.map((difference) => difference.id));
}

/** The difference whose circle contains (x, y) in panel space, or null. */
export function differenceAt(scene, x, y) {
  for (const difference of scene.differences) {
    const dx = x - difference.x;
    const dy = y - difference.y;
    if (dx * dx + dy * dy <= difference.r * difference.r) return difference;
  }
  return null;
}

/** Total differences across the whole game, for the victory screen. */
export const TOTAL_DIFFERENCES = SCENES.reduce((sum, scene) => sum + scene.differences.length, 0);

/** The display names of the levels in order, for the level strip. */
export function sceneNames() {
  return SCENES.map((scene) => scene.name);
}

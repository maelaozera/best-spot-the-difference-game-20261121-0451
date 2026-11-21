// Twin Tales — Spot the Difference: every tuning number and colour in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to the window,
// so no rule below depends on the screen size. Two picture panels sit side by side under
// a HUD bar; the right picture hides the differences.

export const FIELD = { width: 1280, height: 720 };

/** The simulation's fixed step, in seconds: 60 updates a second whatever the display's rate. */
export const STEP = 1 / 60;

/** The picture panels: two near-identical scenes, left original, right changed. */
export const PANEL = { width: 600, height: 540, gap: 40, top: 84 };
export const LEFT_PANEL = { x: 20, y: PANEL.top };
export const RIGHT_PANEL = { x: 20 + PANEL.width + PANEL.gap, y: PANEL.top };

/** The HUD bar across the top and the strip across the bottom of the field. */
export const HUD = { height: 72 };
export const STRIP = { top: 636, height: 72 };

/** Points for a find, before the time and combo bonuses are added. */
export const FIND_POINTS = 100;
/** Seconds taken off the clock for a wrong click. */
export const MISS_PENALTY_SECONDS = 5;
/** Points a hint costs, and how many hints a whole game gets. */
export const HINT_COST = 50;
export const HINTS_PER_GAME = 3;
/** Seconds a hint's golden ring stays on screen. */
export const HINT_SECONDS = 3;
/** Finds in a row within this many seconds raise the combo by one step. */
export const COMBO_WINDOW_SECONDS = 8;
/** Extra points per combo step on a find. */
export const COMBO_STEP_POINTS = 25;
/** The combo never pays more than this many steps, however fast the finds come. */
export const COMBO_MAX = 5;
/** Points per second left when a level is cleared. */
export const TIME_BONUS_PER_SECOND = 5;

/** How long the found-marker pop animation lasts, in seconds. */
export const MARK_POP_SECONDS = 0.35;
/** How long the red flash after a wrong click lasts, in seconds. */
export const MISS_FLASH_SECONDS = 0.4;
/** How long the "Level complete" card stays up before the next level starts. */
export const LEVEL_CARD_SECONDS = 2.6;

export const PALETTE = {
  backdrop: '#14101e',
  frame: '#241d33',
  panelEdge: '#4a3d66',
  panelEdgeFound: '#f2c94c',
  hud: '#1e1829',
  text: '#f5efe2',
  muted: '#b8aec9',
  gold: '#f2c94c',
  goldSoft: '#ffd97a',
  green: '#7ed491',
  red: '#e5534b',
  timerLow: '#ff6b5e',
  timerOk: '#7ed491',
  button: '#3a2f52',
  buttonHover: '#4d3f6d',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'twin-tales.best';

/** The game's title, shown on the title screen and the page tab. */
export const GAME_TITLE = 'Twin Tales';
export const GAME_SUBTITLE = 'Spot the Difference';

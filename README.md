# Twin Tales — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/maelaozera/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/maelaozera/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Two pictures, side by side. One of them is lying.

**Twin Tales** is a complete spot-the-difference game that runs offline in a
desktop browser from its own static files — no network, no build step, no
libraries. Every scene is drawn procedurally on canvas (no downloaded images):
a sunny kitchen, a moonlit garden, a toy workshop, a pirate cove and a coral
reef, hiding **44 differences** in total.

## How to play

- Open `game/index.html` (or run `node serve.ts` and open http://localhost:8080).
- Click or press **Space** to start.
- Study the two pictures. Click each difference on the **RIGHT** picture —
  a gold ring marks it on both panels, with a satisfying chime.
- The HUD shows the countdown, your score and the counter **Found X / Y**
  (how many remain). A wrong click costs 5 seconds.
- **H** (or the Hint button) spends one of 3 hints: a pulsing golden ring
  points at a difference you have not found yet, for 50 points.
- **P** pauses, **M** mutes the synthesised sound effects.
- Clear a level before the clock runs out to earn a time bonus, then move on
  to a harder scene. Find all 44 differences to win.

## Levels

| # | Scene | Differences | Time |
|---|-------|-------------|------|
| 1 | Mira's Kitchen | 8 | 2:30 |
| 2 | The Night Garden | 8 | 2:30 |
| 3 | The Toy Workshop | 9 | 2:45 |
| 4 | Pirate Cove | 9 | 2:45 |
| 5 | The Coral Reef | 10 | 3:00 |

Finds build a combo (quick finds in a row pay +25 per step), and your best
score is kept in the browser between visits.

## Structure

- `game/index.html` — the page, canvas and styles.
- `game/src/main.js` — boot, fixed-step loop, input routing, best score.
- `game/src/engine.js` — rules and state: screens, timer, scoring, hints.
- `game/src/render.js` — drawing the panels, HUD, markers and screens.
- `game/src/scenes/` — one file per scene (`kitchen`, `garden`, `workshop`,
  `cove`, `reef`), plus `index.js` (registry) and `helpers.js` (shared drawing).
- `game/src/input.js`, `audio.js`, `random.js`, `config.js` — input, WebAudio
  synth sounds, seeded random, tuning numbers.
- `game/src/shots.js` — deterministic `?shot=start|play|level|end` scenes for
  the screenshots in `screenshots/`.
- `main.ts` — hands the game in with the vendored make.fun library.
- `serve.ts` — a tiny static server for local play-testing.

## Screenshots

The cover (`1-play.jpg`) shows the night garden mid-hunt: 3 differences found
and ringed, 5 still hidden, with the "Found 3 / 8" counter and the clock
running. `2-start.jpg` is the title screen, `3-level.jpg` the workshop at 5 of
9 found, and `4-end.jpg` the victory screen.

## Play it on make.fun

Try the game and more at [make.fun](https://make.fun) — sign up with my
referral link: https://make.fun/r/02gvsh14

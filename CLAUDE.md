# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Project

This is a **static, no-build web project**. There is no package.json, bundler, or build step.

To run it, serve the directory over HTTP (required for ES module imports and texture loading — `file://` will fail due to CORS):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Or any other static file server (e.g. `npx serve .`).

## Architecture

Single-page 3D solar system simulation. Three files:

- `index.html` — shell with intro screen, info panel, and controls UI. Loads Three.js via importmap from unpkg (no local install).
- `main.js` — all logic (~1600 lines), structured in clearly labelled sections
- `style.css` — UI styling only; the 3D canvas is owned by Three.js
- `img/` — 2K NASA/JPL textures, one per body (sun, planets, moon)

### main.js structure

| Section | Purpose |
|---|---|
| `PLANETS_DATA` | Static config: radius, orbital params, axial tilt, info strings per planet |
| `TEXTURE_URLS` | Maps planet keys to `./img/` paths |
| `SimplexNoise` + `generatePlanetTexture` / `generateNormalMap` | Procedural fallback textures if image load fails |
| `init()` | Scene, camera, renderer, OrbitControls setup; calls all `create*` functions |
| `setupIntroAnimation()` / `startCameraAnimation()` | Intro screen → click → ease-in camera fly |
| `createSun()`, `createPlanets()`, `createAsteroidBelt()` | Geometry + material creation; textures applied here |
| `animate()` loop | Orbital mechanics (Kepler ellipse), rotation, hover raycasting, velocity arrows |
| `setupEventListeners()` | Speed controls, orbit/label/velocity toggles, mouse hover/click for planet lock |

### Key patterns

- **Planet state** lives in the `planets` object keyed by planet name (`planets.terre`, `planets.jupiter`, etc.). Each entry holds `{ mesh, orbit, label, angle, ... }`.
- **Orbital position** is computed each frame from `orbitalPeriod`, `eccentricity`, and `speedMultiplier`. The Sun is at origin; planets follow elliptical paths.
- **Hover/click** uses `THREE.Raycaster` against all planet meshes. Hover shows info panel; click locks/unlocks it (`lockedPlanet` global).
- **Textures** are loaded with a `loadTexture()` helper; if they fail, procedural canvas textures are used as fallback.
- **No external state management** — all globals are at the top of `main.js`.

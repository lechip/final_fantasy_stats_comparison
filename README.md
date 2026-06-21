# Final Fantasy VI — Stat Comparison

A single-page web app to compare **Final Fantasy VI** character stats on a radar
chart. Pick a level, toggle up to four characters from the sprite row, and their
stats overlay on one star graph with an exact-value table beside it. Styled after
the SNES / Pixel Remaster menus.

## Features

- **Radar chart** of the six character-intrinsic stats: HP, MP, Vigor, Speed,
  Stamina, Magic Power (Chart.js).
- **Sprite filter row** of all 14 playable characters — click to toggle; selected
  sprites glow in their colour, deselected are greyed out, and the row locks once
  four are chosen.
- **Sprite-style toggle** — switch the whole row between **Pixel Remaster** and
  **Classic (SNES)** artwork.
- **Level selector** with five checkpoints (10 / 30 / 50 / 70 / 99) showing the
  **actual** in-game stats at each — no interpolation.
- **Value table** with the exact numbers per selected character.
- Responsive: one screen with no scroll on desktop, vertical stack on mobile.

## How the stats work (the important FF6 quirk)

In FF6, **only HP and MP grow with level.** Vigor, Speed, Stamina and Magic Power
are fixed per character (they only change via Esper level-up bonuses or equipment,
which this app intentionally excludes). So moving the level selector reshapes only
the HP and MP axes — the other four stay put.

- HP/MP at a level = a **universal baseline** (same for everyone, in
  [`src/data/levels.json`](src/data/levels.json)) **+ a per-character bonus**
  (in [`src/data/characters.json`](src/data/characters.json)).
- The radar normalises each axis to 0–100 independently (so HP in the thousands and
  Vigor around 30–50 are comparable); the **table and tooltips show the real
  numbers**.

### Data sources & accuracy

Stats were transcribed and cross-checked, then verified against known anchors
(baseline HP is 173 at Lv10 and 5050 at Lv60). The MP curve matches the
JP / Pixel-Remaster progression (max 989 MP at Lv99; the SNES-NA curve maxes at 961).
A dev-only sanity check (`runSanityChecks` in `src/lib/stats.js`) runs on load and
logs to the console.

- Stat-by-level baseline: [Gamer Corner Guides](https://guides.gamercorner.net/ffvi/levels/)
- Mechanics & base stats: [kwhazit FF6 notes](https://kwhazit.ucoz.net/trans/ff6/stats.html),
  [Final Fantasy Wiki](https://finalfantasy.fandom.com/wiki/Final_Fantasy_VI_stats)

## Develop

```sh
npm install
npm run dev          # http://localhost:5173
```

```sh
npm run build        # production build to dist/
npm run preview      # serve the build locally
```

To preview the build exactly as it will appear under the GitHub Pages sub-path:

```sh
GITHUB_REPOSITORY=you/your-repo npm run build && npm run preview
```

## Deploy to GitHub Pages

1. Push to the `main` branch of a GitHub repo.
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and
   choose **GitHub Actions**.
3. The included workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
   builds and publishes on every push.

`vite.config.js` derives the Pages base path (`/<repo-name>/`) from
`GITHUB_REPOSITORY` automatically in CI, so **no manual edit is needed** regardless
of the repository name. Locally the base stays `/`.

## Sprites

Two sprite sets ship, switchable live via the in-app toggle:

- `public/sprites/remaster/<id>.png` — **Pixel Remaster** field sprites (front-facing
  standing frame, extracted from the Pixel Remaster overworld sheets on
  [The Spriters Resource](https://www.spriters-resource.com/pc_computer/finalfantasy6pixelremaster/)).
- `public/sprites/classic/<id>.png` — **original SNES** overworld sprites (via the
  [`mthurmond/ff6-sprites`](https://github.com/mthurmond/ff6-sprites) repository).

Each set has the 14 files named by character id (`terra.png` … `umaro.png`,
transparent background). To use different art, drop in PNGs with the same filenames —
roughly 16–48px tall, ideally with a dark outline so they read on the blue panels. If
a sprite is missing in a set, the UI falls back to a coloured tile with the
character's initial. The default set is Pixel Remaster
([`useComparison.js`](src/composables/useComparison.js) → `spriteStyle`).

## Licensing & attribution

- **Final Fantasy VI**, its characters, and all sprite art are © **Square Enix**.
  This is a non-commercial fan project; the sprites are included for that purpose
  only and are not licensed for redistribution or commercial use.
- **Press Start 2P** font © 2012 CodeMan38, under the SIL Open Font License 1.1
  (see [`src/assets/PressStart2P-OFL.txt`](src/assets/PressStart2P-OFL.txt)).
- App code: free to use.

## Tech

Vue 3 (Composition API, single-file components) · Vite · Chart.js · plain CSS.
No state library — shared state lives in a small composable
([`src/composables/useComparison.js`](src/composables/useComparison.js)).

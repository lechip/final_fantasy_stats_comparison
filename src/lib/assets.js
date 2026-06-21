// Build a base-aware URL for runtime-referenced assets (sprite filenames come
// from JSON, so they bypass Vite's bundler rewriting). import.meta.env.BASE_URL
// is '/' in dev and '/<repo>/' in the GitHub Pages build.
// `style` selects the sprite set: 'remaster' (Pixel Remaster) or 'classic' (SNES).
export const spriteUrl = (file, style = 'remaster') =>
  `${import.meta.env.BASE_URL}sprites/${style}/${file}`

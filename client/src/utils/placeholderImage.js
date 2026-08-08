// A self-contained (data-URI) placeholder so a dead seed-data image URL never
// leaves a broken-image icon on screen during a live demo. No network request,
// so it can never itself fail to load.
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#F9E5DC"/>
      <circle cx="200" cy="170" r="60" fill="#F0C6B1"/>
      <path d="M60 320 L160 220 L220 280 L300 200 L340 320 Z" fill="#E4A282"/>
      <rect x="0" y="0" width="400" height="400" fill="none" stroke="#F0C6B1" stroke-width="6"/>
    </svg>
  `)

/**
 * Image onError handler for product photos: swaps to the local placeholder
 * once, then removes itself to avoid an infinite error loop.
 */
export function handleImageError(event) {
  const img = event.currentTarget
  if (img.src !== PLACEHOLDER_IMAGE) {
    img.onerror = null
    img.src = PLACEHOLDER_IMAGE
  }
}

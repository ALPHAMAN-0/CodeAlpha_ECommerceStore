const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/**
 * Formats a numeric amount as USD currency, e.g. 19.5 -> "$19.50".
 * Falls back to $0.00 for null/undefined/NaN so partially-loaded
 * data never renders as "$NaN" on screen.
 */
export function formatCurrency(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return formatter.format(0)
  return formatter.format(value)
}

export default formatCurrency

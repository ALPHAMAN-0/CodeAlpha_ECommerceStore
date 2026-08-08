import formatCurrency from '../../utils/formatCurrency'

const SIZES = {
  sm: 'text-sm font-medium',
  md: 'text-base font-semibold',
  lg: 'font-display text-3xl font-medium',
}

export default function PriceTag({ amount, size = 'md', className = '' }) {
  return (
    <span className={`text-terracotta-600 tabular-nums ${SIZES[size] ?? SIZES.md} ${className}`}>
      {formatCurrency(amount)}
    </span>
  )
}

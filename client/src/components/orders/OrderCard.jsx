import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import StatusBadge from './StatusBadge'
import formatCurrency from '../../utils/formatCurrency'

function formatDate(dateString) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const orderId = order._id || order.id
  const items = order.items || []
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const address = order.shippingAddress

  return (
    <div className="card-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
            Order #{String(orderId).slice(-8)}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {formatDate(order.createdAt)} · {itemCount} item{itemCount === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-base font-medium text-ink">{formatCurrency(order.totalPrice)}</span>
          <StatusBadge status={order.status} />
          <ChevronDown
            size={18}
            className={`text-ink-faint transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {expanded && (
        <div className="border-t border-ink/8 bg-paper/70 px-5 py-4">
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={item.product || index} className="flex justify-between text-sm text-ink-soft">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          {address && (
            <p className="mt-3 border-t border-ink/8 pt-3 text-xs text-ink-faint">
              Shipping to {address.addressLine1}, {address.city}, {address.state} {address.postalCode}, {address.country}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import formatCurrency from '../../utils/formatCurrency'

export default function CartSummary({ subtotal, itemCount, showCheckoutLink = true }) {
  return (
    <div className="card-surface p-6">
      <h2 className="mb-4 font-display text-lg font-medium">Order summary</h2>
      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between text-ink-soft">
          <dt>
            Items ({itemCount})
          </dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-ink-soft">
          <dt>Shipping</dt>
          <dd>Calculated at checkout</dd>
        </div>
      </dl>
      <div className="my-4 border-t border-ink/8" />
      <div className="flex justify-between font-display text-lg font-medium text-ink">
        <span>Total</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      {showCheckoutLink && (
        <Link to="/checkout" className="btn-primary mt-6 w-full">
          Proceed to checkout
        </Link>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import CartItemRow from '../components/cart/CartItemRow'
import CartSummary from '../components/cart/CartSummary'
import EmptyState from '../components/ui/EmptyState'
import useCart from '../hooks/useCart'

export default function CartPage() {
  const { items, itemCount, subtotal } = useCart()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-medium">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add a few things you like — they'll show up here."
            action={
              <Link to="/" className="btn-primary">
                Continue shopping
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="card-surface px-5">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </div>
          <div>
            <CartSummary subtotal={subtotal} itemCount={itemCount} />
          </div>
        </div>
      )}
    </div>
  )
}

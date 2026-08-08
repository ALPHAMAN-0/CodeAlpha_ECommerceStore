import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import PriceTag from '../ui/PriceTag'
import { handleImageError } from '../../utils/placeholderImage'
import formatCurrency from '../../utils/formatCurrency'
import useCart from '../../hooks/useCart'

export default function CartItemRow({ item }) {
  const { updateQuantity, removeItem } = useCart()
  const atStockLimit = Number.isFinite(item.stock) && item.quantity >= item.stock

  return (
    <div className="flex gap-4 border-b border-ink/8 py-5 last:border-b-0">
      <Link to={`/products/${item.productId}`} className="shrink-0">
        <img
          src={item.imageUrl}
          onError={handleImageError}
          alt={item.name}
          className="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/products/${item.productId}`}
            className="font-display text-base font-medium text-ink hover:text-terracotta-600"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 text-ink-faint transition-colors hover:text-terracotta-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
        <p className="text-sm text-ink-soft">{formatCurrency(item.price)} each</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white p-1">
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-terracotta-50"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={atStockLimit}
              aria-label="Increase quantity"
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-terracotta-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>
          <PriceTag amount={item.price * item.quantity} />
        </div>
        {atStockLimit && <p className="text-xs text-terracotta-600">Max available stock reached.</p>}
      </div>
    </div>
  )
}

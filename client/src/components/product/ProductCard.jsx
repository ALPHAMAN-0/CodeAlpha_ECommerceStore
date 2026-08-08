import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import PriceTag from '../ui/PriceTag'
import { toast } from '../ui/Toast'
import { handleImageError } from '../../utils/placeholderImage'
import useCart from '../../hooks/useCart'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const productId = product._id || product.id
  const outOfStock = (product.stock ?? 0) <= 0

  function handleQuickAdd(event) {
    event.preventDefault()
    event.stopPropagation()
    if (outOfStock) return
    addItem(
      {
        productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
      1,
    )
    toast(`Added "${product.name}" to cart`, 'success')
  }

  return (
    <Link
      to={`/products/${productId}`}
      className="group card-surface flex flex-col overflow-hidden transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-square overflow-hidden bg-terracotta-50">
        <img
          src={product.imageUrl}
          onError={handleImageError}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out-soft group-hover:scale-105"
        />
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-paper">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-terracotta-600">
          {product.category}
        </span>
        <h3 className="line-clamp-2 font-display text-base font-medium leading-snug text-ink">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceTag amount={product.price} />
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:bg-ink/20"
          >
            <Plus size={16} strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </Link>
  )
}

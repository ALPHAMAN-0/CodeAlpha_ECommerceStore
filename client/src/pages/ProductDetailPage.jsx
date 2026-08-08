import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react'
import { fetchProductById } from '../api/productsApi'
import { extractErrorMessage } from '../api/axiosClient'
import PriceTag from '../components/ui/PriceTag'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import { toast } from '../components/ui/Toast'
import { handleImageError } from '../utils/placeholderImage'
import useCart from '../hooks/useCart'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError('')
    setQuantity(1)

    fetchProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data)
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err, 'Product not found.'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title="We couldn't find that product"
          description={error || 'It may have been removed from the catalog.'}
          action={
            <button type="button" onClick={() => navigate('/')} className="btn-primary">
              Back to shop
            </button>
          }
        />
      </div>
    )
  }

  const productId = product._id || product.id
  const outOfStock = (product.stock ?? 0) <= 0
  const lowStock = !outOfStock && product.stock <= 5

  function handleAddToCart() {
    addItem(
      {
        productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
      quantity,
    )
    toast(`Added ${quantity} × "${product.name}" to cart`, 'success')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-2xl bg-terracotta-50 shadow-card">
          <img
            src={product.imageUrl}
            onError={handleImageError}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="section-eyebrow">{product.category}</span>
          <h1 className="mt-2 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4">
            <PriceTag amount={product.price} size="lg" />
          </div>

          <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-6">
            {outOfStock ? (
              <p className="text-sm font-medium text-terracotta-600">Currently out of stock.</p>
            ) : lowStock ? (
              <p className="text-sm font-medium text-terracotta-600">Only {product.stock} left in stock.</p>
            ) : (
              <p className="text-sm font-medium text-olive-600">In stock and ready to ship.</p>
            )}
          </div>

          {!outOfStock && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-terracotta-50"
                >
                  <Minus size={15} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-terracotta-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={15} />
                </button>
              </div>
              <button type="button" onClick={handleAddToCart} className="btn-primary flex-1 px-8 py-3 sm:flex-none">
                <ShoppingBag size={17} /> Add to cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, PackageSearch } from 'lucide-react'
import { fetchCategories, fetchProducts } from '../api/productsApi'
import { extractErrorMessage } from '../api/axiosClient'
import useDebounce from '../hooks/useDebounce'
import ProductGrid from '../components/product/ProductGrid'
import CategoryFilter from '../components/product/CategoryFilter'
import SearchBar from '../components/product/SearchBar'
import LoadMoreButton from '../components/product/LoadMoreButton'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { toast } from '../components/ui/Toast'

const LIMIT = 12

function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
      <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Illustration of arranged storefront goods">
        <rect x="0" y="0" width="400" height="300" rx="24" fill="#F0C6B1" opacity="0.45" />
        <g transform="rotate(-6 130 150)">
          <rect x="60" y="80" width="140" height="170" rx="16" fill="#C1573A" />
          <rect x="76" y="100" width="108" height="14" rx="7" fill="#FCF4F1" opacity="0.7" />
          <rect x="76" y="124" width="72" height="10" rx="5" fill="#FCF4F1" opacity="0.5" />
        </g>
        <g transform="rotate(4 260 140)">
          <rect x="210" y="60" width="120" height="150" rx="16" fill="#241F1B" />
          <circle cx="270" cy="112" r="26" fill="#E4A282" />
        </g>
        <g transform="rotate(-3 200 230)">
          <rect x="140" y="190" width="160" height="90" rx="16" fill="#6B7A4F" />
          <rect x="160" y="212" width="60" height="10" rx="5" fill="#F4F5ED" opacity="0.8" />
          <rect x="160" y="230" width="90" height="10" rx="5" fill="#F4F5ED" opacity="0.6" />
        </g>
      </svg>
    </div>
  )
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(searchInput, 400)

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')

  // Keep the debounced search term reflected in the URL (bookmarkable/shareable)
  // without spamming browser history on every keystroke.
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (debouncedSearch) next.set('search', debouncedSearch)
        else next.delete('search')
        return next
      },
      { replace: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError('')

    fetchProducts({ category, search: debouncedSearch, page: 1, limit: LIMIT })
      .then((data) => {
        if (cancelled) return
        setProducts(data.products)
        setPage(1)
        setHasMore(data.pages ? 1 < data.pages : data.products.length >= LIMIT)
      })
      .catch((err) => {
        if (cancelled) return
        setError(extractErrorMessage(err, 'Could not load products.'))
        setProducts([])
        setHasMore(false)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category, debouncedSearch])

  async function handleLoadMore() {
    const nextPage = page + 1
    setIsLoadingMore(true)
    try {
      const data = await fetchProducts({ category, search: debouncedSearch, page: nextPage, limit: LIMIT })
      setProducts((prev) => [...prev, ...data.products])
      setPage(nextPage)
      setHasMore(data.pages ? nextPage < data.pages : data.products.length >= LIMIT)
    } catch (err) {
      toast(extractErrorMessage(err, 'Could not load more products.'), 'error')
    } finally {
      setIsLoadingMore(false)
    }
  }

  function handleCategoryChange(nextCategory) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (nextCategory) next.set('category', nextCategory)
      else next.delete('category')
      return next
    })
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink/8 bg-gradient-to-b from-terracotta-50/70 to-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="section-eyebrow">A small, considered general store</p>
            <h1 className="mt-3 max-w-lg font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Everyday goods, chosen with care.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              A tightly curated catalog — no endless scroll, no filler. Just things worth owning, at prices worth
              paying.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#catalog" className="btn-primary px-6 py-3">
                Browse the catalog
              </a>
              <span className="text-sm text-ink-faint">Free returns within 30 days</span>
            </div>
          </div>
          <HeroIllustration />
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-eyebrow">Full catalog</p>
            <h2 className="mt-1 text-2xl font-medium">Shop everything</h2>
          </div>
          <SearchBar value={searchInput} onChange={setSearchInput} />
        </div>

        <div className="mb-8">
          <CategoryFilter categories={categories} activeCategory={category} onChange={handleCategoryChange} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <EmptyState icon={AlertCircle} title="Couldn't load products" description={error} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No products found"
            description="Try a different search term or category."
          />
        ) : (
          <>
            <ProductGrid products={products} />
            <div className="mt-10">
              <LoadMoreButton onClick={handleLoadMore} isLoading={isLoadingMore} hasMore={hasMore} />
            </div>
          </>
        )}
      </section>
    </div>
  )
}

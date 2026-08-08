import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageOpen } from 'lucide-react'
import { fetchMyOrders } from '../api/ordersApi'
import { extractErrorMessage } from '../api/axiosClient'
import OrderCard from '../components/orders/OrderCard'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchMyOrders()
      .then((data) => {
        if (!cancelled) setOrders(data)
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err, 'Could not load your orders.'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-medium">Order history</h1>
      <p className="mt-1 text-sm text-ink-soft">Newest orders first.</p>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <EmptyState icon={PackageOpen} title="Couldn't load orders" description={error} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="No orders yet"
            description="Once you place an order, it'll show up here."
            action={
              <Link to="/" className="btn-primary">
                Start shopping
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard key={order._id || order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

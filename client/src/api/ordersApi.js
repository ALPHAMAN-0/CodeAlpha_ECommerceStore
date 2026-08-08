import axiosClient from './axiosClient'

// POST /api/orders  { items: [{productId, quantity}], shippingAddress } -> order
// Server re-derives price/name from the DB and decrements stock; never send price from the client.
export async function createOrder({ items, shippingAddress }) {
  const { data } = await axiosClient.post('/orders', { items, shippingAddress })
  return data?.order ?? data
}

// GET /api/orders/mine -> order[] (newest-first)
export async function fetchMyOrders() {
  const { data } = await axiosClient.get('/orders/mine')
  if (Array.isArray(data)) return data
  return data?.orders ?? []
}

// GET /api/orders/:id -> order (403 if not owner)
export async function fetchOrderById(id) {
  const { data } = await axiosClient.get(`/orders/${id}`)
  return data?.order ?? data
}

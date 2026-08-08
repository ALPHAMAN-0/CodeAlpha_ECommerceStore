import axiosClient from './axiosClient'

/**
 * GET /api/products?category=&search=&page=&limit=
 *
 * The plan's endpoint table documents the query params but not the exact
 * response envelope, so this normalizes a few likely shapes (a bare array,
 * or an object wrapping the list under `products`/`items` with pagination
 * metadata) into one consistent { products, page, pages, total } result.
 */
export async function fetchProducts({ category, search, page = 1, limit = 12 } = {}) {
  const params = { page, limit }
  if (category) params.category = category
  if (search) params.search = search

  const { data } = await axiosClient.get('/products', { params })

  if (Array.isArray(data)) {
    return {
      products: data,
      page,
      pages: data.length < limit ? page : page + 1,
      total: data.length,
    }
  }

  const products = data?.products ?? data?.items ?? data?.results ?? []
  return {
    products,
    page: data?.page ?? page,
    pages: data?.pages ?? data?.totalPages ?? (products.length < limit ? page : page + 1),
    total: data?.total ?? data?.count ?? products.length,
  }
}

// GET /api/products/categories -> string[]
export async function fetchCategories() {
  const { data } = await axiosClient.get('/products/categories')
  if (Array.isArray(data)) return data
  return data?.categories ?? []
}

// GET /api/products/:id -> product
export async function fetchProductById(id) {
  const { data } = await axiosClient.get(`/products/${id}`)
  return data?.product ?? data
}

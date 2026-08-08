import { createContext, useEffect, useMemo, useReducer } from 'react'

const CART_STORAGE_KEY = 'cart'

const CartContext = createContext(null)

function readInitialCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] }
    return parsed
  } catch {
    return { items: [] }
  }
}

function clampQuantity(quantity, stock) {
  const max = Number.isFinite(stock) ? Math.max(stock, 0) : Infinity
  return Math.min(Math.max(1, quantity), max === 0 ? 1 : max)
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find((item) => item.productId === product.productId)

      if (existing) {
        const nextQuantity = clampQuantity(existing.quantity + quantity, product.stock ?? existing.stock)
        return {
          items: state.items.map((item) =>
            item.productId === product.productId
              ? { ...item, ...product, quantity: nextQuantity }
              : item,
          ),
        }
      }

      return {
        items: [
          ...state.items,
          { ...product, quantity: clampQuantity(quantity, product.stock) },
        ],
      }
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload
      if (quantity <= 0) {
        return { items: state.items.filter((item) => item.productId !== productId) }
      }
      return {
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: clampQuantity(quantity, item.stock) }
            : item,
        ),
      }
    }

    case 'REMOVE_ITEM':
      return { items: state.items.filter((item) => item.productId !== action.payload.productId) }

    case 'CLEAR_CART':
      return { items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  // Lazy initializer reads localStorage synchronously so the cart never
  // renders empty-then-populated on load/refresh.
  const [state, dispatch] = useReducer(cartReducer, undefined, readInitialCart)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addItem = (product, quantity = 1) => dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  const updateQuantity = (productId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  const removeItem = (productId) => dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const { itemCount, subtotal } = useMemo(() => {
    return state.items.reduce(
      (acc, item) => ({
        itemCount: acc.itemCount + item.quantity,
        subtotal: acc.subtotal + item.price * item.quantity,
      }),
      { itemCount: 0, subtotal: 0 },
    )
  }, [state.items])

  const value = {
    items: state.items,
    itemCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartContext

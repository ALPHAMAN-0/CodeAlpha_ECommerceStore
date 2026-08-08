import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function Footer() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <footer className="border-t border-ink/8 bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          <div className="text-center sm:text-left">
            <Link to="/" className="flex items-baseline gap-1.5 justify-center sm:justify-start">
              <span className="font-display text-lg font-semibold text-ink">Outpost</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-terracotta-600">Goods</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm text-ink-faint">
              A small, considered general store. Demo storefront built with the MERN stack.
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <span className="section-eyebrow">Shop</span>
              <Link to="/" className="text-ink-soft hover:text-ink">
                All products
              </Link>
              <Link to="/cart" className="text-ink-soft hover:text-ink">
                Cart
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="section-eyebrow">Account</span>
              <Link to="/orders" className="text-ink-soft hover:text-ink">
                Order history
              </Link>
              {isAuthenticated ? (
                <button type="button" onClick={logout} className="text-left text-ink-soft hover:text-ink">
                  Log out
                </button>
              ) : (
                <Link to="/auth" className="text-ink-soft hover:text-ink">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
        <p className="mt-8 border-t border-ink/8 pt-6 text-center text-xs text-ink-faint sm:text-left">
          © {new Date().getFullYear()} Outpost Goods. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

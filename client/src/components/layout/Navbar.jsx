import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, ShoppingBag, X } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import useCart from '../../hooks/useCart'

function navLinkClass({ isActive }) {
  return `text-sm font-medium transition-colors ${isActive ? 'text-terracotta-600' : 'text-ink-soft hover:text-ink'}`
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex items-baseline gap-1.5" onClick={() => setMenuOpen(false)}>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">Outpost</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-terracotta-600">Goods</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <NavLink to="/" end className={navLinkClass}>
            Shop
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            aria-label="View cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <ShoppingBag size={20} strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-terracotta-500 px-1 text-[11px] font-semibold text-paper">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          <div className="hidden sm:block">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-ink-soft">Hi, {user?.name?.split(' ')[0] ?? 'there'}</span>
                <button type="button" onClick={handleLogout} className="btn-secondary px-4 py-2 text-xs">
                  Log out
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary px-4 py-2 text-xs">
                Sign in
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 sm:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-ink/8 bg-paper px-4 pb-4 pt-3 sm:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-ink-soft hover:text-ink">
              Shop
            </Link>
            {isAuthenticated && (
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-ink-soft hover:text-ink">
                Orders
              </Link>
            )}
            {isAuthenticated ? (
              <button type="button" onClick={handleLogout} className="btn-secondary w-full">
                Log out
              </button>
            ) : (
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="btn-primary w-full">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

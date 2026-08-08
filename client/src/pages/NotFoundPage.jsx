import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-7xl font-medium text-terracotta-500">404</span>
      <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
        <Compass size={22} strokeWidth={1.75} />
      </div>
      <h1 className="mt-4 font-display text-2xl font-medium">Off the map</h1>
      <p className="mt-2 text-sm text-ink-soft">The page you're looking for doesn't exist, or has moved.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to shop
      </Link>
    </div>
  )
}

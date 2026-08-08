import { useEffect, useState } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'

// Minimal pub/sub so any module (including plain JS, not just components) can
// fire a toast without prop-drilling a dispatcher through the whole tree.
let idCounter = 0
const listeners = new Set()

export function toast(message, type = 'success') {
  const id = ++idCounter
  listeners.forEach((listener) => listener({ id, message, type }))
}

const ICONS = { success: CheckCircle2, error: XCircle, info: Info }
const ICON_COLOR = { success: 'text-olive-600', error: 'text-terracotta-600', info: 'text-ink-soft' }

/** Mounted once near the root of the app; renders whatever toast() fires. */
export default function ToastViewport() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    function handleToast(item) {
      setToasts((current) => [...current, item])
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== item.id))
      }, 3200)
    }
    listeners.add(handleToast)
    return () => listeners.delete(handleToast)
  }, [])

  function dismiss(id) {
    setToasts((current) => current.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:top-6 sm:items-end sm:px-6">
      {toasts.map((item) => {
        const Icon = ICONS[item.type] ?? Info
        return (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3 shadow-card-hover"
          >
            <Icon size={18} className={`mt-0.5 shrink-0 ${ICON_COLOR[item.type] ?? ICON_COLOR.info}`} />
            <p className="flex-1 text-sm text-ink">{item.message}</p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="text-ink-faint hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

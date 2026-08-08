import { Clock, Loader2, PackageCheck, Truck, XCircle } from 'lucide-react'

const STATUS_META = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 ring-amber-200', Icon: Clock },
  processing: { label: 'Processing', className: 'bg-sky-50 text-sky-700 ring-sky-200', Icon: Loader2 },
  shipped: { label: 'Shipped', className: 'bg-violet-50 text-violet-700 ring-violet-200', Icon: Truck },
  delivered: { label: 'Delivered', className: 'bg-olive-50 text-olive-700 ring-olive-200', Icon: PackageCheck },
  cancelled: { label: 'Cancelled', className: 'bg-rose-50 text-rose-700 ring-rose-200', Icon: XCircle },
}

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.pending
  const { label, className, Icon } = meta

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset ${className}`}>
      <Icon size={13} />
      {label}
    </span>
  )
}

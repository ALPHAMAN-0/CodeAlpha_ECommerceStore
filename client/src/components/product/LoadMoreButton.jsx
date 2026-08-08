import Spinner from '../ui/Spinner'

export default function LoadMoreButton({ onClick, isLoading, hasMore }) {
  if (!hasMore) return null

  return (
    <div className="flex justify-center pt-2">
      <button type="button" onClick={onClick} disabled={isLoading} className="btn-secondary min-w-[10rem]">
        {isLoading ? <Spinner size="sm" /> : 'Load more'}
      </button>
    </div>
  )
}

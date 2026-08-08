function pillClass(active) {
  return active
    ? 'bg-ink text-paper'
    : 'bg-white text-ink-soft ring-1 ring-inset ring-ink/10 hover:bg-terracotta-50 hover:text-ink'
}

export default function CategoryFilter({ categories = [], activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('')}
        className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${pillClass(activeCategory === '')}`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${pillClass(activeCategory === category)}`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

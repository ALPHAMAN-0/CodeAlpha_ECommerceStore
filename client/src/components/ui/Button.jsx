import Spinner from './Spinner'

const VARIANT_CLASS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  return (
    <Component
      className={`${VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary} ${className}`}
      disabled={Component === 'button' ? disabled || isLoading : undefined}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </Component>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import useCart from '../hooks/useCart'
import { createOrder } from '../api/ordersApi'
import { extractErrorMessage } from '../api/axiosClient'
import { validateShippingAddress } from '../utils/validators'
import { toast } from '../components/ui/Toast'
import Spinner from '../components/ui/Spinner'
import formatCurrency from '../utils/formatCurrency'

const INITIAL_ADDRESS = {
  fullName: '',
  addressLine1: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
}

const INITIAL_PAYMENT = {
  cardNumber: '',
  expiry: '',
  cvc: '',
}

function Field({ label, value, onChange, error, placeholder, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="input-field"
      />
      {error && <span className="mt-1 block text-xs text-terracotta-600">{error}</span>}
    </label>
  )
}

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart } = useCart()
  const navigate = useNavigate()

  const [shipping, setShipping] = useState(INITIAL_ADDRESS)
  // Payment section is purely cosmetic per the plan: rendered for realism,
  // never validated, and never sent anywhere.
  const [payment, setPayment] = useState(INITIAL_PAYMENT)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  // Cart is cleared as part of a successful order, which would otherwise
  // trip the "redirect to /cart when empty" guard below and race the
  // post-order navigate('/orders') call. This flag tells the guard to stand down.
  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate('/cart', { replace: true })
    }
  }, [items.length, orderPlaced, navigate])

  function updateShippingField(field, value) {
    setShipping((prev) => ({ ...prev, [field]: value }))
  }

  function updatePaymentField(field, value) {
    setPayment((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateShippingAddress(shipping)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitError('')
    try {
      await createOrder({
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        shippingAddress: shipping,
      })
      setOrderPlaced(true)
      clearCart()
      toast('Order placed! Track it from your order history.', 'success')
      navigate('/orders')
    } catch (err) {
      setSubmitError(extractErrorMessage(err, 'Could not place your order. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-medium">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <fieldset className="card-surface p-6">
            <legend className="section-eyebrow px-1">Shipping address</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={shipping.fullName}
                onChange={(v) => updateShippingField('fullName', v)}
                error={errors.fullName}
                className="sm:col-span-2"
              />
              <Field
                label="Street address"
                value={shipping.addressLine1}
                onChange={(v) => updateShippingField('addressLine1', v)}
                error={errors.addressLine1}
                className="sm:col-span-2"
              />
              <Field label="City" value={shipping.city} onChange={(v) => updateShippingField('city', v)} error={errors.city} />
              <Field
                label="State / Province"
                value={shipping.state}
                onChange={(v) => updateShippingField('state', v)}
                error={errors.state}
              />
              <Field
                label="Postal code"
                value={shipping.postalCode}
                onChange={(v) => updateShippingField('postalCode', v)}
                error={errors.postalCode}
              />
              <Field
                label="Country"
                value={shipping.country}
                onChange={(v) => updateShippingField('country', v)}
                error={errors.country}
              />
              <Field
                label="Phone"
                value={shipping.phone}
                onChange={(v) => updateShippingField('phone', v)}
                error={errors.phone}
                className="sm:col-span-2"
              />
            </div>
          </fieldset>

          <fieldset className="card-surface p-6">
            <legend className="section-eyebrow flex items-center gap-1.5 px-1">
              <Lock size={12} /> Payment details
            </legend>
            <p className="mt-1 px-1 text-xs text-ink-faint">
              Demo only — no payment is processed and nothing in this section is sent to the server.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Card number"
                placeholder="4242 4242 4242 4242"
                value={payment.cardNumber}
                onChange={(v) => updatePaymentField('cardNumber', v)}
                className="sm:col-span-2"
              />
              <Field label="Expiry" placeholder="MM/YY" value={payment.expiry} onChange={(v) => updatePaymentField('expiry', v)} />
              <Field label="CVC" placeholder="123" value={payment.cvc} onChange={(v) => updatePaymentField('cvc', v)} />
            </div>
          </fieldset>
        </div>

        <div className="card-surface h-fit p-6">
          <h2 className="mb-4 font-display text-lg font-medium">Order summary</h2>
          <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3 text-sm">
                <span className="text-ink-soft">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium text-ink">{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 border-t border-ink/8" />
          <div className="flex justify-between text-sm text-ink-soft">
            <span>Items ({itemCount})</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between font-display text-lg font-medium text-ink">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {submitError && <p className="mt-4 text-sm text-terracotta-600">{submitError}</p>}

          <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full">
            {isSubmitting ? <Spinner size="sm" /> : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  )
}

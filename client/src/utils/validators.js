const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isRequired(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value != null
}

export function isValidEmail(email) {
  return EMAIL_RE.test(String(email || '').trim())
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6
}

export function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword
}

/**
 * Validates the register form. Returns an { field: message } error map;
 * an empty object means the form is valid.
 */
export function validateRegisterForm({ name, email, password, confirmPassword }) {
  const errors = {}
  if (!isRequired(name)) errors.name = 'Name is required.'
  if (!isRequired(email)) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!isRequired(password)) errors.password = 'Password is required.'
  else if (!isValidPassword(password)) errors.password = 'Password must be at least 6 characters.'
  if (!passwordsMatch(password, confirmPassword)) errors.confirmPassword = 'Passwords do not match.'
  return errors
}

export function validateLoginForm({ email, password }) {
  const errors = {}
  if (!isRequired(email)) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!isRequired(password)) errors.password = 'Password is required.'
  return errors
}

/**
 * Validates the checkout shipping address form. Payment fields are
 * intentionally excluded — that section is cosmetic and never validated.
 */
export function validateShippingAddress({ fullName, addressLine1, city, state, postalCode, country, phone }) {
  const errors = {}
  if (!isRequired(fullName)) errors.fullName = 'Full name is required.'
  if (!isRequired(addressLine1)) errors.addressLine1 = 'Street address is required.'
  if (!isRequired(city)) errors.city = 'City is required.'
  if (!isRequired(state)) errors.state = 'State / province is required.'
  if (!isRequired(postalCode)) errors.postalCode = 'Postal code is required.'
  if (!isRequired(country)) errors.country = 'Country is required.'
  if (!isRequired(phone)) errors.phone = 'Phone number is required.'
  return errors
}

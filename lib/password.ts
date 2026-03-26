export const PASSWORD_MIN_LENGTH = 12

// At least: 1 uppercase, 1 lowercase, 1 digit, 1 symbol
const PASSWORD_COMPLEXITY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

export function validatePasswordStrength(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
  }
  if (!PASSWORD_COMPLEXITY.test(password)) {
    return 'Password must include uppercase, lowercase, number, and symbol.'
  }
  return null
}

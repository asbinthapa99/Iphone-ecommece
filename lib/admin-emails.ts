function normalizeEmail(value: string): string {
  return value.toLowerCase().trim()
}

export function getPrimaryAdminEmailFromEnv(): string | null {
  const direct = process.env.ADMIN_EMAIL
  if (direct && direct.trim()) return normalizeEmail(direct)

  const list = process.env.ADMIN_EMAILS
  if (!list) return null

  const first = list
    .split(/[,\n;]+/)
    .map((entry) => entry.trim())
    .find(Boolean)

  return first ? normalizeEmail(first) : null
}

export function getAdminEmailsFromEnv(): string[] {
  const raw = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS || ''
  if (!raw) return []

  const emails = raw
    .split(/[,\n;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map(normalizeEmail)

  return Array.from(new Set(emails))
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = normalizeEmail(email)
  return getAdminEmailsFromEnv().includes(normalized)
}

export function isPrimaryAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const primaryAdmin = getPrimaryAdminEmailFromEnv()
  if (!primaryAdmin) return false
  return normalizeEmail(email) === primaryAdmin
}

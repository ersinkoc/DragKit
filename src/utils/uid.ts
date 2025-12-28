/**
 * UID Utilities
 * Unique ID generation
 */

let idCounter = 0

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'dragkit'): string {
  return `${prefix}-${++idCounter}-${Date.now()}`
}

/**
 * Generate a short unique ID
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 11)
}

/**
 * Reset ID counter (for testing)
 */
export function resetIdCounter(): void {
  idCounter = 0
}

/**
 * Vitest Global Test Setup
 * Runs before all tests
 */

import { beforeAll, afterEach } from 'vitest'

// Setup global test utilities
beforeAll(() => {
  // Add any global setup here
})

// Clean up after each test
afterEach(() => {
  // Clean up DOM safely - avoid innerHTML
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }

  // Clear any timers
  vi.clearAllTimers()

  // Clear all mocks
  vi.clearAllMocks()
})

// Extend matchers if needed
expect.extend({
  // Custom matchers can be added here
})

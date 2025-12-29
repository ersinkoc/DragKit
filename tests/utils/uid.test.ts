/**
 * UID Utilities Tests
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { generateId, generateShortId, resetIdCounter } from '../../src/utils/uid'

describe('UID Utilities', () => {
  beforeEach(() => {
    resetIdCounter()
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should use default prefix', () => {
      const id = generateId()
      expect(id.startsWith('dragkit-')).toBe(true)
    })

    it('should use custom prefix', () => {
      const id = generateId('custom')
      expect(id.startsWith('custom-')).toBe(true)
    })

    it('should increment counter', () => {
      const id1 = generateId()
      const id2 = generateId()
      // Extract counter from ID (format: prefix-counter-timestamp)
      const counter1 = parseInt(id1.split('-')[1]!)
      const counter2 = parseInt(id2.split('-')[1]!)
      expect(counter2).toBe(counter1 + 1)
    })

    it('should include timestamp', () => {
      const id = generateId()
      const parts = id.split('-')
      const timestamp = parseInt(parts[2]!)
      expect(timestamp).toBeGreaterThan(0)
      expect(timestamp).toBeLessThanOrEqual(Date.now())
    })
  })

  describe('generateShortId', () => {
    it('should generate short IDs', () => {
      const id = generateShortId()
      expect(id.length).toBeGreaterThanOrEqual(8)
      expect(id.length).toBeLessThanOrEqual(9)
    })

    it('should generate unique IDs', () => {
      const ids = new Set<string>()
      for (let i = 0; i < 100; i++) {
        ids.add(generateShortId())
      }
      expect(ids.size).toBe(100)
    })

    it('should contain only alphanumeric characters', () => {
      const id = generateShortId()
      expect(/^[a-z0-9]+$/.test(id)).toBe(true)
    })
  })

  describe('resetIdCounter', () => {
    it('should reset counter to 0', () => {
      generateId() // counter = 1
      generateId() // counter = 2
      resetIdCounter()
      const id = generateId() // counter should be 1 again
      const counter = parseInt(id.split('-')[1]!)
      expect(counter).toBe(1)
    })
  })
})

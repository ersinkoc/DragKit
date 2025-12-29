/**
 * Vue Plugin Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Use vi.hoisted to define mocks before they are hoisted
const { mockKernel } = vi.hoisted(() => ({
  mockKernel: {
    on: vi.fn(),
    emit: vi.fn(),
    destroy: vi.fn(),
    draggable: vi.fn(),
    droppable: vi.fn()
  }
}))

// Mock Vue's inject and provide
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual as any,
    inject: vi.fn(),
    provide: vi.fn()
  }
})

// Mock the kernel creation
vi.mock('../../src/kernel', () => ({
  createDragKit: vi.fn().mockResolvedValue(mockKernel)
}))

import { createDragKitPlugin, provideDragKit, injectDragKit, getKernel, DragKitKey } from '../../src/adapters/vue/plugin'
import { inject, provide, ref } from 'vue'

describe('Vue Plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createDragKitPlugin', () => {
    it('should create a Vue plugin', () => {
      const plugin = createDragKitPlugin()
      expect(plugin).toBeDefined()
      expect(plugin.install).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should create plugin with options', () => {
      const plugin = createDragKitPlugin({ plugins: [] })
      expect(plugin).toBeDefined()
    })

    it('should install on Vue app', async () => {
      const plugin = createDragKitPlugin()
      const mockApp = {
        provide: vi.fn(),
        config: {
          globalProperties: {}
        }
      }

      await plugin.install(mockApp as any)

      expect(mockApp.provide).toHaveBeenCalled()
      expect(mockApp.config.globalProperties.$dragkit).toBeDefined()
    })
  })

  describe('DragKitKey', () => {
    it('should be a Symbol', () => {
      expect(typeof DragKitKey).toBe('symbol')
    })
  })

  describe('provideDragKit', () => {
    it('should provide kernel to Vue context', () => {
      const mockKernel = { on: vi.fn(), emit: vi.fn() } as any

      provideDragKit(mockKernel)

      expect(provide).toHaveBeenCalled()
    })
  })

  describe('injectDragKit', () => {
    it('should return a ref', () => {
      const result = injectDragKit()

      // Result should be a ref-like object
      expect(result).toBeDefined()
      expect('value' in result).toBe(true)
    })

    it('should use injected kernel when available', () => {
      const mockKernelRef = ref({ on: vi.fn(), emit: vi.fn() })
      ;(inject as any).mockReturnValue(mockKernelRef)

      const result = injectDragKit()

      expect(inject).toHaveBeenCalled()
      expect(result).toBe(mockKernelRef)
    })
  })

  describe('getKernel', () => {
    it('should return kernel or null', () => {
      const result = getKernel()
      // May be non-null if previous tests set it
      expect(result === null || result !== undefined).toBe(true)
    })
  })
})

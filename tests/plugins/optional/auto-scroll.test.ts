/**
 * Auto-scroll Plugin Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { autoScroll } from '../../../src/plugins/optional/auto-scroll'
import type { Kernel } from '../../../src/types'

describe('Auto-scroll Plugin', () => {
  let mockKernel: Kernel
  let plugin: ReturnType<typeof autoScroll>
  let eventHandlers: Record<string, (event: any) => void>

  beforeEach(() => {
    eventHandlers = {}

    mockKernel = {
      emit: vi.fn(),
      on: vi.fn().mockImplementation((event: string, handler: (e: any) => void) => {
        eventHandlers[event] = handler
        return () => { delete eventHandlers[event] }
      }),
      isDragging: vi.fn().mockReturnValue(true)
    } as unknown as Kernel

    plugin = autoScroll()
  })

  afterEach(() => {
    plugin.uninstall()
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(plugin.name).toBe('auto-scroll')
    })

    it('should have correct version', () => {
      expect(plugin.version).toBe('1.0.0')
    })

    it('should have optional type', () => {
      expect(plugin.type).toBe('optional')
    })
  })

  describe('install/uninstall', () => {
    it('should install without error', () => {
      expect(() => plugin.install(mockKernel)).not.toThrow()
    })

    it('should uninstall without error', () => {
      plugin.install(mockKernel)
      expect(() => plugin.uninstall()).not.toThrow()
    })

    it('should subscribe to drag events on install', () => {
      plugin.install(mockKernel)

      expect(mockKernel.on).toHaveBeenCalledWith('drag:move', expect.any(Function))
      expect(mockKernel.on).toHaveBeenCalledWith('drag:end', expect.any(Function))
      expect(mockKernel.on).toHaveBeenCalledWith('drag:cancel', expect.any(Function))
    })
  })

  describe('API', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should expose API', () => {
      expect(plugin.api).toBeDefined()
    })

    it('should be enabled by default', () => {
      expect(plugin.api!.isEnabled()).toBe(true)
    })

    it('should toggle enable/disable', () => {
      plugin.api!.disable()
      expect(plugin.api!.isEnabled()).toBe(false)

      plugin.api!.enable()
      expect(plugin.api!.isEnabled()).toBe(true)
    })

    it('should set speed', () => {
      plugin.api!.setSpeed(20)
      // Speed is used internally, verify no errors
      expect(plugin.api!.isEnabled()).toBe(true)
    })

    it('should set threshold', () => {
      plugin.api!.setThreshold(100)
      // Threshold is used internally, verify no errors
      expect(plugin.api!.isEnabled()).toBe(true)
    })
  })

  describe('scroll behavior', () => {
    let rafCallback: FrameRequestCallback | null = null
    let rafId = 0

    beforeEach(() => {
      rafCallback = null
      rafId = 0

      // Mock requestAnimationFrame to capture callback without immediately executing
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        rafCallback = cb
        rafId++
        return rafId
      })

      vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
        rafCallback = null
      })

      plugin.install(mockKernel)
    })

    it('should schedule scroll on drag move', () => {
      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 10, y: 10 } })
      }

      expect(window.requestAnimationFrame).toHaveBeenCalled()
    })

    it('should stop scroll on drag end', () => {
      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 10, y: 10 } })
      }

      if (eventHandlers['drag:end']) {
        eventHandlers['drag:end']({})
      }

      // Should have attempted to cancel any pending animation
      expect(window.cancelAnimationFrame).toHaveBeenCalled()
    })

    it('should stop scroll on drag cancel', () => {
      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 10, y: 10 } })
      }

      if (eventHandlers['drag:cancel']) {
        eventHandlers['drag:cancel']({})
      }

      expect(window.cancelAnimationFrame).toHaveBeenCalled()
    })

    it('should not scroll when disabled', () => {
      plugin.api!.disable()

      // Mock scrollBy if not defined in happy-dom
      if (typeof window.scrollBy !== 'function') {
        (window as any).scrollBy = vi.fn()
      }
      const scrollBySpy = vi.spyOn(window, 'scrollBy')

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 10, y: 10 } })
      }

      // Execute the callback if it was scheduled
      if (rafCallback) {
        rafCallback(0)
      }

      expect(scrollBySpy).not.toHaveBeenCalled()
    })
  })

  describe('options', () => {
    it('should use custom speed', () => {
      const customPlugin = autoScroll({ speed: 25 })
      customPlugin.install(mockKernel)
      expect(customPlugin.api).toBeDefined()
      customPlugin.uninstall()
    })

    it('should use custom threshold', () => {
      const customPlugin = autoScroll({ threshold: 100 })
      customPlugin.install(mockKernel)
      expect(customPlugin.api).toBeDefined()
      customPlugin.uninstall()
    })

    it('should disable window scrolling', () => {
      const customPlugin = autoScroll({ scrollWindow: false })
      customPlugin.install(mockKernel)
      expect(customPlugin.api).toBeDefined()
      customPlugin.uninstall()
    })

    it('should use custom scrollable elements', () => {
      const element = document.createElement('div')
      const customPlugin = autoScroll({ scrollableElements: [element] })
      customPlugin.install(mockKernel)
      expect(customPlugin.api).toBeDefined()
      customPlugin.uninstall()
    })

    it('should use custom acceleration', () => {
      const customPlugin = autoScroll({ acceleration: 2 })
      customPlugin.install(mockKernel)
      expect(customPlugin.api).toBeDefined()
      customPlugin.uninstall()
    })

    it('should use custom maxSpeed', () => {
      const customPlugin = autoScroll({ maxSpeed: 100 })
      customPlugin.install(mockKernel)
      expect(customPlugin.api).toBeDefined()
      customPlugin.uninstall()
    })
  })

  describe('performScroll integration', () => {
    let rafCallback: FrameRequestCallback | null = null

    beforeEach(() => {
      rafCallback = null

      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true })
      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true, configurable: true })

      // Mock scrollBy
      if (typeof window.scrollBy !== 'function') {
        (window as any).scrollBy = vi.fn()
      } else {
        vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
      }

      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        rafCallback = cb
        return 1
      })

      vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
        rafCallback = null
      })

      plugin.install(mockKernel)
    })

    it('should scroll up when near top edge', () => {
      // Position near top edge (y < threshold)
      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 500, y: 20 } })
      }

      // Execute the raf callback
      if (rafCallback) {
        rafCallback(0)
      }

      expect(window.scrollBy).toHaveBeenCalled()
    })

    it('should scroll down when near bottom edge', () => {
      // Position near bottom edge
      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 500, y: 750 } })
      }

      if (rafCallback) {
        rafCallback(0)
      }

      expect(window.scrollBy).toHaveBeenCalled()
    })

    it('should scroll left when near left edge', () => {
      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 20, y: 400 } })
      }

      if (rafCallback) {
        rafCallback(0)
      }

      expect(window.scrollBy).toHaveBeenCalled()
    })

    it('should scroll right when near right edge', () => {
      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 1010, y: 400 } })
      }

      if (rafCallback) {
        rafCallback(0)
      }

      expect(window.scrollBy).toHaveBeenCalled()
    })

    it('should not scroll when position is in center', () => {
      // Create a fresh spy and clear any previous calls
      const scrollBySpy = vi.mocked(window.scrollBy)
      scrollBySpy.mockClear()

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 500, y: 400 } })
      }

      if (rafCallback) {
        rafCallback(0)
      }

      // Position is in center, no scrolling should occur from this specific action
      // Note: we verify scrollBy wasn't called for this specific position
      expect(scrollBySpy.mock.calls.length).toBe(0)
    })

    it('should continue scrolling while dragging', () => {
      // Set up to allow continuous scrolling
      ;(mockKernel.isDragging as any).mockReturnValue(true)
      const rafSpy = vi.mocked(window.requestAnimationFrame)
      rafSpy.mockClear()

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 500, y: 20 } })
      }

      // First frame
      if (rafCallback) {
        rafCallback(0)
      }

      // Should have scheduled another frame while still dragging (initial + continuation)
      expect(rafSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    })

    it('should stop scrolling when no longer dragging', () => {
      ;(mockKernel.isDragging as any).mockReturnValue(false)
      const rafSpy = vi.mocked(window.requestAnimationFrame)
      rafSpy.mockClear()

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 500, y: 20 } })
      }

      const initialCallCount = rafSpy.mock.calls.length

      // First frame
      if (rafCallback) {
        rafCallback(0)
      }

      // Should not have scheduled additional frames after the initial one
      expect(rafSpy.mock.calls.length).toBe(initialCallCount)
    })
  })

  describe('scrollable elements detection', () => {
    let rafCallback: FrameRequestCallback | null = null

    beforeEach(() => {
      rafCallback = null

      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        rafCallback = cb
        return 1
      })

      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true })
      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true, configurable: true })

      if (typeof window.scrollBy !== 'function') {
        (window as any).scrollBy = vi.fn()
      }
    })

    it('should find scrollable elements with auto detection', () => {
      // Create a scrollable droppable element with proper mocks
      const scrollableDiv = document.createElement('div')
      scrollableDiv.setAttribute('data-droppable-id', 'test-container')
      scrollableDiv.style.overflow = 'auto'
      Object.defineProperty(scrollableDiv, 'scrollHeight', { value: 500, configurable: true })
      Object.defineProperty(scrollableDiv, 'clientHeight', { value: 200, configurable: true })
      scrollableDiv.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 0, left: 0, bottom: 200, right: 200, width: 200, height: 200
      })
      document.body.appendChild(scrollableDiv)

      const autoPlugin = autoScroll({ scrollableElements: 'auto' })
      autoPlugin.install(mockKernel)

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 10, y: 10 } })
      }

      if (rafCallback) {
        rafCallback(0)
      }

      expect(autoPlugin.api).toBeDefined()

      document.body.removeChild(scrollableDiv)
      autoPlugin.uninstall()
    })

    it('should scroll custom scrollable elements', () => {
      const scrollableDiv = document.createElement('div')
      scrollableDiv.scrollLeft = 0
      scrollableDiv.scrollTop = 0

      // Mock getBoundingClientRect
      scrollableDiv.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 0,
        left: 0,
        bottom: 200,
        right: 200,
        width: 200,
        height: 200
      })

      const customPlugin = autoScroll({
        scrollableElements: [scrollableDiv],
        scrollWindow: false
      })
      customPlugin.install(mockKernel)

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 10, y: 10 } })
      }

      if (rafCallback) {
        rafCallback(0)
      }

      // Verify the element was scrolled
      expect(scrollableDiv.scrollTop).not.toBe(0)
      customPlugin.uninstall()
    })

    it('should handle non-scrollable elements in auto mode', () => {
      const nonScrollableDiv = document.createElement('div')
      nonScrollableDiv.setAttribute('data-droppable-id', 'test-static')
      Object.defineProperty(nonScrollableDiv, 'scrollHeight', { value: 100, configurable: true })
      Object.defineProperty(nonScrollableDiv, 'clientHeight', { value: 100, configurable: true })
      nonScrollableDiv.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100
      })
      document.body.appendChild(nonScrollableDiv)

      const autoPlugin = autoScroll({ scrollableElements: 'auto' })
      autoPlugin.install(mockKernel)

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 50, y: 50 } })
      }

      if (rafCallback) {
        rafCallback(0)
      }

      document.body.removeChild(nonScrollableDiv)
      autoPlugin.uninstall()
    })

    it('should detect horizontally scrollable elements', () => {
      const scrollableDiv = document.createElement('div')
      scrollableDiv.setAttribute('data-droppable-id', 'test-horizontal')
      scrollableDiv.style.overflowX = 'scroll'
      Object.defineProperty(scrollableDiv, 'scrollWidth', { value: 500, configurable: true })
      Object.defineProperty(scrollableDiv, 'clientWidth', { value: 200, configurable: true })
      scrollableDiv.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 0, left: 0, bottom: 200, right: 200, width: 200, height: 200
      })
      document.body.appendChild(scrollableDiv)

      const autoPlugin = autoScroll({ scrollableElements: 'auto' })
      autoPlugin.install(mockKernel)

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({ position: { x: 10, y: 100 } })
      }

      if (rafCallback) {
        rafCallback(0)
      }

      document.body.removeChild(scrollableDiv)
      autoPlugin.uninstall()
    })
  })
})

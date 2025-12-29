/**
 * Plugin Registry Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PluginRegistry } from '../../src/kernel/plugin-registry'
import type { Plugin, Kernel } from '../../src/types'

describe('PluginRegistry', () => {
  let registry: PluginRegistry
  let mockKernel: Kernel

  beforeEach(() => {
    registry = new PluginRegistry()
    mockKernel = {
      on: vi.fn(() => vi.fn()),
      off: vi.fn(),
      emit: vi.fn()
    } as unknown as Kernel
    registry.setKernel(mockKernel)
  })

  it('should create a plugin registry instance', () => {
    expect(registry).toBeInstanceOf(PluginRegistry)
  })

  it('should register a plugin', async () => {
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    await registry.register(plugin)

    expect(plugin.install).toHaveBeenCalledWith(mockKernel)
    expect(registry.get('test-plugin')).toBe(plugin)
  })

  it('should unregister a plugin', async () => {
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    await registry.register(plugin)
    await registry.unregister('test-plugin')

    expect(plugin.uninstall).toHaveBeenCalled()
    expect(registry.get('test-plugin')).toBeUndefined()
  })

  it('should list registered plugins', async () => {
    const plugin1: Plugin = {
      name: 'plugin-1',
      version: '1.0.0',
      type: 'core',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    const plugin2: Plugin = {
      name: 'plugin-2',
      version: '2.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    await registry.register(plugin1)
    await registry.register(plugin2)

    const plugins = registry.listPlugins()

    expect(plugins).toHaveLength(2)
    expect(plugins).toContainEqual({
      name: 'plugin-1',
      version: '1.0.0',
      type: 'core',
      enabled: true
    })
    expect(plugins).toContainEqual({
      name: 'plugin-2',
      version: '2.0.0',
      type: 'optional',
      enabled: true
    })
  })

  it('should prevent duplicate plugin registration', async () => {
    const plugin: Plugin = {
      name: 'duplicate-plugin',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    await registry.register(plugin)

    await expect(registry.register(plugin)).rejects.toThrow()
  })

  it('should run plugin hooks', async () => {
    const hookFn = vi.fn()
    const plugin: Plugin = {
      name: 'hook-plugin',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn(),
      hooks: {
        afterDragStart: hookFn
      }
    }

    await registry.register(plugin)

    const event = {
      type: 'drag:start' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      position: { x: 0, y: 0 }
    }

    registry.runHook('afterDragStart', event)

    expect(hookFn).toHaveBeenCalledWith(event)
  })

  it('should uninstall all plugins', async () => {
    const plugin1: Plugin = {
      name: 'plugin-1',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    const plugin2: Plugin = {
      name: 'plugin-2',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    await registry.register(plugin1)
    await registry.register(plugin2)
    await registry.uninstallAll()

    expect(plugin1.uninstall).toHaveBeenCalled()
    expect(plugin2.uninstall).toHaveBeenCalled()
    expect(registry.listPlugins()).toHaveLength(0)
  })

  it('should throw error when kernel not set', async () => {
    const newRegistry = new PluginRegistry()
    const plugin: Plugin = {
      name: 'no-kernel-plugin',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    await expect(newRegistry.register(plugin)).rejects.toThrow('Kernel not initialized')
  })

  it('should enable a plugin', async () => {
    const plugin: Plugin = {
      name: 'enable-test',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    await registry.register(plugin)
    registry.disable('enable-test')
    expect(registry.isEnabled('enable-test')).toBe(false)

    registry.enable('enable-test')
    expect(registry.isEnabled('enable-test')).toBe(true)
  })

  it('should disable a plugin', async () => {
    const plugin: Plugin = {
      name: 'disable-test',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    await registry.register(plugin)
    expect(registry.isEnabled('disable-test')).toBe(true)

    registry.disable('disable-test')
    expect(registry.isEnabled('disable-test')).toBe(false)
  })

  it('should return false for non-existent plugin enabled check', () => {
    expect(registry.isEnabled('non-existent')).toBe(false)
  })

  it('should not run hooks for disabled plugins', async () => {
    const hookFn = vi.fn()
    const plugin: Plugin = {
      name: 'disabled-hook-plugin',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn(),
      hooks: {
        afterDragStart: hookFn
      }
    }

    await registry.register(plugin)
    registry.disable('disabled-hook-plugin')

    const event = {
      type: 'drag:start' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      position: { x: 0, y: 0 }
    }

    registry.runHook('afterDragStart', event)
    expect(hookFn).not.toHaveBeenCalled()
  })

  it('should stop hook execution when hook returns false', async () => {
    const hookFn1 = vi.fn().mockReturnValue(false)
    const hookFn2 = vi.fn()

    const plugin1: Plugin = {
      name: 'hook-stop-1',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn(),
      hooks: {
        beforeDragStart: hookFn1
      }
    }

    const plugin2: Plugin = {
      name: 'hook-stop-2',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn(),
      hooks: {
        beforeDragStart: hookFn2
      }
    }

    await registry.register(plugin1)
    await registry.register(plugin2)

    const event = {
      type: 'drag:start' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      position: { x: 0, y: 0 }
    }

    const result = registry.runHook('beforeDragStart', event)
    expect(result).toBe(false)
    expect(hookFn1).toHaveBeenCalled()
    expect(hookFn2).not.toHaveBeenCalled()
  })

  it('should catch and log hook errors', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const errorHook = vi.fn().mockImplementation(() => {
      throw new Error('Hook error')
    })

    const plugin: Plugin = {
      name: 'error-hook-plugin',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn(),
      hooks: {
        afterDragEnd: errorHook
      }
    }

    await registry.register(plugin)

    const event = {
      type: 'drag:end' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      droppable: null,
      position: { x: 0, y: 0 },
      dropped: false
    }

    registry.runHook('afterDragEnd', event)

    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it('should get plugin count', async () => {
    expect(registry.getPluginCount()).toBe(0)

    const plugin: Plugin = {
      name: 'count-test',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    await registry.register(plugin)
    expect(registry.getPluginCount()).toBe(1)
  })

  it('should check if plugin exists', async () => {
    expect(registry.has('test-plugin')).toBe(false)

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
    }

    await registry.register(plugin)
    expect(registry.has('test-plugin')).toBe(true)
  })

  it('should silently handle unregister of non-existent plugin', async () => {
    await expect(registry.unregister('non-existent')).resolves.not.toThrow()
  })

  it('should enable non-existent plugin without error', () => {
    expect(() => registry.enable('non-existent')).not.toThrow()
  })

  it('should disable non-existent plugin without error', () => {
    expect(() => registry.disable('non-existent')).not.toThrow()
  })

  it('should skip plugins without hooks when running hook', async () => {
    const plugin: Plugin = {
      name: 'no-hooks-plugin',
      version: '1.0.0',
      type: 'optional',
      install: vi.fn(),
      uninstall: vi.fn()
      // No hooks property
    }

    await registry.register(plugin)

    const event = {
      type: 'drag:start' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      position: { x: 0, y: 0 }
    }

    // Should not throw
    expect(() => registry.runHook('afterDragStart', event)).not.toThrow()
  })
})

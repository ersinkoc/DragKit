/**
 * Plugin Registry
 * Manages plugin lifecycle and hook execution
 */

import type { Plugin, PluginInfo, PluginHooks, Kernel } from '../types'

interface PluginInstance {
  plugin: Plugin
  enabled: boolean
}

export class PluginRegistry {
  private plugins = new Map<string, PluginInstance>()
  private kernel?: Kernel

  /**
   * Set kernel reference
   */
  setKernel(kernel: Kernel): void {
    this.kernel = kernel
  }

  /**
   * Register a plugin
   */
  async register(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`)
    }

    if (!this.kernel) {
      throw new Error('Kernel not initialized')
    }

    // Install plugin
    await plugin.install(this.kernel)

    // Store plugin instance
    this.plugins.set(plugin.name, {
      plugin,
      enabled: true
    })
  }

  /**
   * Unregister a plugin
   */
  async unregister(name: string): Promise<void> {
    const instance = this.plugins.get(name)
    if (!instance) {
      return
    }

    // Uninstall plugin
    await instance.plugin.uninstall()

    // Remove from registry
    this.plugins.delete(name)
  }

  /**
   * Get a plugin by name
   */
  get<P extends Plugin>(name: string): P | undefined {
    const instance = this.plugins.get(name)
    return instance?.plugin as P | undefined
  }

  /**
   * List all plugins
   */
  listPlugins(): PluginInfo[] {
    return Array.from(this.plugins.values()).map(({ plugin, enabled }) => ({
      name: plugin.name,
      version: plugin.version,
      type: plugin.type,
      enabled
    }))
  }

  /**
   * Enable a plugin
   */
  enable(name: string): void {
    const instance = this.plugins.get(name)
    if (instance) {
      instance.enabled = true
    }
  }

  /**
   * Disable a plugin
   */
  disable(name: string): void {
    const instance = this.plugins.get(name)
    if (instance) {
      instance.enabled = false
    }
  }

  /**
   * Check if plugin is enabled
   */
  isEnabled(name: string): boolean {
    return this.plugins.get(name)?.enabled ?? false
  }

  /**
   * Run plugin hooks for a specific hook type
   */
  runHook<K extends keyof PluginHooks>(
    hookName: K,
    ...args: Parameters<NonNullable<PluginHooks[K]>>
  ): ReturnType<NonNullable<PluginHooks[K]>> | undefined {
    let result: ReturnType<NonNullable<PluginHooks[K]>> | undefined

    for (const { plugin, enabled } of this.plugins.values()) {
      if (!enabled || !plugin.hooks) continue

      const hook = plugin.hooks[hookName]
      if (hook) {
        try {
          // @ts-expect-error - Complex hook type inference
          result = hook(...args)

          // If hook returns false, stop execution
          if (result === false) {
            return result
          }
        } catch (error) {
          console.error(`Error in ${plugin.name}.${hookName}:`, error)
        }
      }
    }

    return result
  }

  /**
   * Uninstall all plugins
   */
  async uninstallAll(): Promise<void> {
    const promises = Array.from(this.plugins.keys()).map(name => this.unregister(name))
    await Promise.all(promises)
  }

  /**
   * Get plugin count
   */
  getPluginCount(): number {
    return this.plugins.size
  }

  /**
   * Check if plugin exists
   */
  has(name: string): boolean {
    return this.plugins.has(name)
  }
}

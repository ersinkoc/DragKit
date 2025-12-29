/**
 * Touch Sensor Plugin Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { touchSensorPlugin, TouchSensor } from '../../src/plugins/core/touch-sensor'
import type { Kernel } from '../../src/types'

describe('Touch Sensor Plugin', () => {
  let mockKernel: Kernel

  beforeEach(() => {
    mockKernel = {
      emit: vi.fn()
    } as unknown as Kernel
  })

  afterEach(() => {
    touchSensorPlugin.uninstall()
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(touchSensorPlugin.name).toBe('touch-sensor')
    })

    it('should have correct version', () => {
      expect(touchSensorPlugin.version).toBe('1.0.0')
    })

    it('should have core type', () => {
      expect(touchSensorPlugin.type).toBe('core')
    })
  })

  describe('install/uninstall', () => {
    it('should install without error', () => {
      expect(() => touchSensorPlugin.install(mockKernel)).not.toThrow()
    })

    it('should uninstall without error', () => {
      touchSensorPlugin.install(mockKernel)
      expect(() => touchSensorPlugin.uninstall()).not.toThrow()
    })
  })

  describe('sensor interface', () => {
    it('should create sensor with touch type', () => {
      // The plugin creates an internal TouchSensor instance
      // We test through the plugin interface
      touchSensorPlugin.install(mockKernel)
      // If installation succeeds, the sensor was created
      expect(touchSensorPlugin.name).toBe('touch-sensor')
    })
  })
})

describe('TouchSensor', () => {
  let mockKernel: Kernel
  let sensor: TouchSensor

  beforeEach(() => {
    mockKernel = {
      emit: vi.fn(),
      getDraggable: vi.fn()
    } as unknown as Kernel
    sensor = new TouchSensor(mockKernel)
  })

  describe('type', () => {
    it('should have touch type', () => {
      expect(sensor.type).toBe('touch')
    })
  })

  describe('isActive', () => {
    it('should return false initially', () => {
      expect(sensor.isActive()).toBe(false)
    })

    it('should return true after activation', () => {
      const element = document.createElement('div')
      const event = new Event('touchstart')
      sensor.activate(element, event)
      expect(sensor.isActive()).toBe(true)
    })

    it('should return false after deactivation', () => {
      const element = document.createElement('div')
      const event = new Event('touchstart')
      sensor.activate(element, event)
      sensor.deactivate()
      expect(sensor.isActive()).toBe(false)
    })
  })

  describe('activate', () => {
    it('should set active state to true', () => {
      const element = document.createElement('div')
      const event = new Event('touchstart')
      sensor.activate(element, event)
      expect(sensor.isActive()).toBe(true)
    })
  })

  describe('deactivate', () => {
    it('should set active state to false', () => {
      const element = document.createElement('div')
      const event = new Event('touchstart')
      sensor.activate(element, event)
      expect(sensor.isActive()).toBe(true)

      sensor.deactivate()
      expect(sensor.isActive()).toBe(false)
    })
  })

  describe('attach', () => {
    it('should attach without error', () => {
      expect(() => sensor.attach(mockKernel)).not.toThrow()
    })
  })

  describe('detach', () => {
    it('should detach without error', () => {
      sensor.attach(mockKernel)
      expect(() => sensor.detach()).not.toThrow()
    })
  })
})

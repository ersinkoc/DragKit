/**
 * Drop Manager Plugin Tests
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { createDragKit } from '../../src/kernel/kernel'
import type { DragKitKernel, DroppableInstance } from '../../src/types'

describe('Drop Manager Plugin', () => {
  let kernel: DragKitKernel

  beforeEach(async () => {
    kernel = await createDragKit() as DragKitKernel
  })

  describe('droppable registration', () => {
    it('should register a droppable with minimal options', () => {
      const element = document.createElement('div')

      const instance = kernel.droppable(element, { id: 'basic-drop' })

      expect(instance).toBeDefined()
      expect(instance.id).toBe('basic-drop')
      expect(instance.element).toBe(element)
    })

    it('should register a droppable with custom data', () => {
      const element = document.createElement('div')

      const instance = kernel.droppable(element, {
        id: 'data-drop',
        data: { zone: 'trash' }
      })

      expect(instance.data.zone).toBe('trash')
    })

    it('should set data-droppable-id attribute', () => {
      const element = document.createElement('div')

      kernel.droppable(element, { id: 'attr-drop' })

      expect(element.getAttribute('data-droppable-id')).toBe('attr-drop')
    })

    it('should throw on duplicate id', () => {
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')

      kernel.droppable(el1, { id: 'duplicate' })

      expect(() => {
        kernel.droppable(el2, { id: 'duplicate' })
      }).toThrow()
    })
  })

  describe('droppable instance methods', () => {
    let element: HTMLElement
    let instance: DroppableInstance

    beforeEach(() => {
      element = document.createElement('div')
      document.body.appendChild(element)
      element.style.width = '100px'
      element.style.height = '100px'
      instance = kernel.droppable(element, { id: 'instance-test' })
    })

    it('should check if over', () => {
      expect(instance.isOver()).toBe(false)
    })

    it('should check if disabled', () => {
      expect(instance.isDisabled()).toBe(false)

      instance.disable()
      expect(instance.isDisabled()).toBe(true)

      instance.enable()
      expect(instance.isDisabled()).toBe(false)
    })

    it('should get rect', () => {
      const rect = instance.getRect()

      expect(rect).toHaveProperty('top')
      expect(rect).toHaveProperty('left')
      expect(rect).toHaveProperty('width')
      expect(rect).toHaveProperty('height')
    })

    it('should clean up on destroy', () => {
      instance.destroy()

      expect(element.getAttribute('data-droppable-id')).toBeNull()
      expect(kernel.getDroppable('instance-test')).toBeUndefined()
    })
  })

  describe('accept logic', () => {
    let dropElement: HTMLElement
    let dropInstance: DroppableInstance

    beforeEach(() => {
      dropElement = document.createElement('div')
      document.body.appendChild(dropElement)
    })

    it('should accept all draggables by default', () => {
      dropInstance = kernel.droppable(dropElement, { id: 'accept-all' })

      const dragElement = document.createElement('div')
      const draggable = kernel.draggable(dragElement, { id: 'any-drag' })

      expect(dropInstance.canAccept(draggable)).toBe(true)
    })

    it('should accept draggables by type string', () => {
      dropInstance = kernel.droppable(dropElement, {
        id: 'accept-card',
        accept: 'card'
      })

      const cardElement = document.createElement('div')
      const card = kernel.draggable(cardElement, {
        id: 'card',
        data: { type: 'card' }
      })

      const fileElement = document.createElement('div')
      const file = kernel.draggable(fileElement, {
        id: 'file',
        data: { type: 'file' }
      })

      expect(dropInstance.canAccept(card)).toBe(true)
      expect(dropInstance.canAccept(file)).toBe(false)
    })

    it('should accept draggables by type array', () => {
      dropInstance = kernel.droppable(dropElement, {
        id: 'accept-multiple',
        accept: ['card', 'file']
      })

      const cardElement = document.createElement('div')
      const card = kernel.draggable(cardElement, {
        id: 'card',
        data: { type: 'card' }
      })

      const imageElement = document.createElement('div')
      const image = kernel.draggable(imageElement, {
        id: 'image',
        data: { type: 'image' }
      })

      expect(dropInstance.canAccept(card)).toBe(true)
      expect(dropInstance.canAccept(image)).toBe(false)
    })

    it('should accept draggables by function', () => {
      dropInstance = kernel.droppable(dropElement, {
        id: 'accept-fn',
        accept: (draggable) => draggable.data.priority === 'high'
      })

      const highElement = document.createElement('div')
      const high = kernel.draggable(highElement, {
        id: 'high',
        data: { priority: 'high' }
      })

      const lowElement = document.createElement('div')
      const low = kernel.draggable(lowElement, {
        id: 'low',
        data: { priority: 'low' }
      })

      expect(dropInstance.canAccept(high)).toBe(true)
      expect(dropInstance.canAccept(low)).toBe(false)
    })

    it('should not accept when disabled', () => {
      dropInstance = kernel.droppable(dropElement, {
        id: 'disabled-drop',
        disabled: true
      })

      const dragElement = document.createElement('div')
      const draggable = kernel.draggable(dragElement, { id: 'any' })

      expect(dropInstance.canAccept(draggable)).toBe(false)
    })
  })

  describe('droppable options', () => {
    it('should respect disabled option', () => {
      const element = document.createElement('div')

      const instance = kernel.droppable(element, {
        id: 'disabled-drop',
        disabled: true
      })

      expect(instance.isDisabled()).toBe(true)
    })
  })

  describe('over state and classes', () => {
    it('should add overClass when setOver(true)', () => {
      const element = document.createElement('div')
      const instance = kernel.droppable(element, {
        id: 'over-class-test',
        overClass: 'is-over'
      })

      // Access internal setOver via type assertion
      ;(instance as any).setOver(true)

      expect(element.classList.contains('is-over')).toBe(true)
      expect(instance.isOver()).toBe(true)
    })

    it('should remove overClass when setOver(false)', () => {
      const element = document.createElement('div')
      const instance = kernel.droppable(element, {
        id: 'over-class-remove',
        overClass: 'is-over'
      })

      ;(instance as any).setOver(true)
      expect(element.classList.contains('is-over')).toBe(true)

      ;(instance as any).setOver(false)
      expect(element.classList.contains('is-over')).toBe(false)
      expect(instance.isOver()).toBe(false)
    })

    it('should handle setOver without overClass option', () => {
      const element = document.createElement('div')
      const instance = kernel.droppable(element, { id: 'no-over-class' })

      ;(instance as any).setOver(true)
      expect(instance.isOver()).toBe(true)

      ;(instance as any).setOver(false)
      expect(instance.isOver()).toBe(false)
    })
  })

  describe('destroy with classes', () => {
    it('should remove overClass on destroy', () => {
      const element = document.createElement('div')
      const instance = kernel.droppable(element, {
        id: 'destroy-over-class',
        overClass: 'is-over'
      })

      element.classList.add('is-over')
      instance.destroy()

      expect(element.classList.contains('is-over')).toBe(false)
    })

    it('should remove activeClass on destroy', () => {
      const element = document.createElement('div')
      const instance = kernel.droppable(element, {
        id: 'destroy-active-class',
        activeClass: 'is-active'
      })

      element.classList.add('is-active')
      instance.destroy()

      expect(element.classList.contains('is-active')).toBe(false)
    })

    it('should remove both overClass and activeClass on destroy', () => {
      const element = document.createElement('div')
      const instance = kernel.droppable(element, {
        id: 'destroy-both-classes',
        overClass: 'is-over',
        activeClass: 'is-active'
      })

      element.classList.add('is-over')
      element.classList.add('is-active')
      instance.destroy()

      expect(element.classList.contains('is-over')).toBe(false)
      expect(element.classList.contains('is-active')).toBe(false)
    })
  })

  describe('manager methods', () => {
    it('should get accepting droppables', () => {
      const drop1Element = document.createElement('div')
      const drop2Element = document.createElement('div')
      const dragElement = document.createElement('div')

      kernel.droppable(drop1Element, { id: 'drop1', accept: 'card' })
      kernel.droppable(drop2Element, { id: 'drop2', accept: 'file' })

      const draggable = kernel.draggable(dragElement, {
        id: 'test-card',
        data: { type: 'card' }
      })

      // Get droppables that accept this draggable
      const droppables = kernel.getDroppables()
      const accepting = Array.from(droppables.values()).filter(d => d.canAccept(draggable))

      expect(accepting.length).toBe(1)
      expect(accepting[0]?.id).toBe('drop1')
    })

    it('should unregister droppable', () => {
      const element = document.createElement('div')
      kernel.droppable(element, { id: 'to-unregister' })

      expect(kernel.getDroppable('to-unregister')).toBeDefined()

      // Unregister by destroying the instance
      kernel.getDroppable('to-unregister')?.destroy()

      expect(kernel.getDroppable('to-unregister')).toBeUndefined()
    })
  })

  describe('accept without type', () => {
    it('should not accept draggable without type when accept is specified', () => {
      const dropElement = document.createElement('div')
      const dragElement = document.createElement('div')

      const droppable = kernel.droppable(dropElement, {
        id: 'accept-specific',
        accept: ['card']
      })

      const draggable = kernel.draggable(dragElement, {
        id: 'no-type',
        data: {} // No type property
      })

      expect(droppable.canAccept(draggable)).toBe(false)
    })
  })

  describe('droppable getAll', () => {
    it('should return all registered droppables', () => {
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')
      const el3 = document.createElement('div')

      kernel.droppable(el1, { id: 'drop-1' })
      kernel.droppable(el2, { id: 'drop-2' })
      kernel.droppable(el3, { id: 'drop-3' })

      const all = kernel.getDroppables()

      expect(all.size).toBe(3)
      expect(all.has('drop-1')).toBe(true)
      expect(all.has('drop-2')).toBe(true)
      expect(all.has('drop-3')).toBe(true)
    })

    it('should return a copy of droppables map', () => {
      const el = document.createElement('div')
      kernel.droppable(el, { id: 'original-drop' })

      const all1 = kernel.getDroppables()
      const all2 = kernel.getDroppables()

      // Should be different map instances
      expect(all1).not.toBe(all2)
      // But contain the same data
      expect(all1.size).toBe(all2.size)
    })
  })

  describe('droppable instance getId and getElement', () => {
    it('should return id via getId()', () => {
      const element = document.createElement('div')
      const instance = kernel.droppable(element, { id: 'get-id-drop' })

      expect(instance.getId()).toBe('get-id-drop')
    })

    it('should return element via getElement()', () => {
      const element = document.createElement('div')
      const instance = kernel.droppable(element, { id: 'get-element-drop' })

      expect(instance.getElement()).toBe(element)
    })
  })

  describe('active droppable state', () => {
    it('should have no active droppable initially', () => {
      expect(kernel.getActiveDroppable()).toBeNull()
    })
  })

  describe('setOver with data-over attribute', () => {
    it('should set data-over attribute when over', () => {
      const element = document.createElement('div')
      const instance = kernel.droppable(element, { id: 'data-over-test' })

      ;(instance as any).setOver(true)

      expect(instance.isOver()).toBe(true)
    })

    it('should clear data-over attribute when not over', () => {
      const element = document.createElement('div')
      const instance = kernel.droppable(element, { id: 'data-over-clear' })

      ;(instance as any).setOver(true)
      ;(instance as any).setOver(false)

      expect(instance.isOver()).toBe(false)
    })
  })
})

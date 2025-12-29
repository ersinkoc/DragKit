/**
 * Vue Plugin for DragKit
 */

import { inject, provide, ref, type App, type InjectionKey, type Ref } from 'vue'
import { createDragKit } from '../../kernel'
import type { Kernel } from '../../types'
import type { DragKitPluginOptions } from './types'

export const DragKitKey: InjectionKey<Ref<Kernel | null>> = Symbol('DragKit')

let globalKernel: Kernel | null = null

export function createDragKitPlugin(options: DragKitPluginOptions = {}) {
  return {
    install: async (app: App) => {
      const kernel = await createDragKit(options)
      globalKernel = kernel

      const kernelRef = ref<Kernel | null>(kernel)
      app.provide(DragKitKey, kernelRef)

      // Make kernel available globally
      app.config.globalProperties.$dragkit = kernel
    }
  }
}

export function provideDragKit(kernel: Kernel): void {
  const kernelRef = ref<Kernel | null>(kernel)
  provide(DragKitKey, kernelRef)
}

export function injectDragKit(): Ref<Kernel | null> {
  const kernel = inject(DragKitKey)

  if (!kernel) {
    // Return global kernel if available
    if (globalKernel) {
      return ref(globalKernel)
    }
    console.warn('DragKit not provided. Make sure to use createDragKitPlugin or provideDragKit.')
    return ref(null)
  }

  return kernel
}

export function getKernel(): Kernel | null {
  return globalKernel
}

/**
 * Drag Devtools Plugin
 * Developer tools for debugging drag and drop
 */

import type { Plugin, Kernel } from '../../types'

export interface DevtoolsOptions {
  autoShow?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  maxLogEntries?: number
  shortcut?: string
}

interface EventLogEntry {
  type: string
  timestamp: number
  data?: any
}

interface DevtoolsAPI {
  show(): void
  hide(): void
  toggle(): void
  isVisible(): boolean
  clearLog(): void
  getEventLog(): EventLogEntry[]
}

class DevtoolsImpl implements DevtoolsAPI {
  private visible = false
  private eventLog: EventLogEntry[] = []
  private panel: HTMLElement | null = null
  private unsubscribers: (() => void)[] = []
  private keyboardHandler: ((e: KeyboardEvent) => void) | null = null

  constructor(
    private kernel: Kernel,
    private options: DevtoolsOptions = {}
  ) {
    this.options = {
      autoShow: false,
      position: 'bottom-right',
      maxLogEntries: 100,
      shortcut: 'Ctrl+Shift+D',
      ...options
    }
  }

  attach(): void {
    // Subscribe to all drag events
    const events = ['drag:start', 'drag:move', 'drag:end', 'drag:cancel', 'drop:enter', 'drop:leave', 'drop:drop']

    events.forEach(event => {
      const unsub = this.kernel.on(event as any, (data: any) => {
        this.logEvent(event, data)
      })
      this.unsubscribers.push(unsub)
    })

    // Setup keyboard shortcut
    this.keyboardHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        this.toggle()
      }
    }
    document.addEventListener('keydown', this.keyboardHandler)

    // Auto-show if configured
    if (this.options.autoShow) {
      this.show()
    }
  }

  detach(): void {
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []

    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler)
      this.keyboardHandler = null
    }

    this.hide()
  }

  show(): void {
    if (this.visible) return

    this.visible = true
    this.createPanel()
  }

  hide(): void {
    if (!this.visible) return

    this.visible = false
    this.removePanel()
  }

  toggle(): void {
    if (this.visible) {
      this.hide()
    } else {
      this.show()
    }
  }

  isVisible(): boolean {
    return this.visible
  }

  clearLog(): void {
    this.eventLog = []
    this.updatePanel()
  }

  getEventLog(): EventLogEntry[] {
    return [...this.eventLog]
  }

  private logEvent(type: string, data?: any): void {
    const entry: EventLogEntry = {
      type,
      timestamp: Date.now(),
      data: this.sanitizeData(data)
    }

    this.eventLog.unshift(entry)

    // Limit log size
    const maxEntries = this.options.maxLogEntries ?? 100
    if (this.eventLog.length > maxEntries) {
      this.eventLog = this.eventLog.slice(0, maxEntries)
    }

    this.updatePanel()
  }

  private sanitizeData(data: any): any {
    if (!data) return undefined

    // Create a safe copy of the data
    try {
      return {
        type: data.type,
        draggableId: data.draggable?.id,
        droppableId: data.droppable?.id,
        position: data.position,
        delta: data.delta,
        dropped: data.dropped
      }
    } catch {
      return undefined
    }
  }

  private createPanel(): void {
    if (this.panel) return

    this.panel = document.createElement('div')
    this.panel.setAttribute('data-devtools-panel', 'true')

    const position = this.options.position ?? 'bottom-right'
    const positionStyles: Record<string, string> = {
      'top-left': 'top: 10px; left: 10px;',
      'top-right': 'top: 10px; right: 10px;',
      'bottom-left': 'bottom: 10px; left: 10px;',
      'bottom-right': 'bottom: 10px; right: 10px;'
    }

    this.panel.style.cssText = `
      position: fixed;
      ${positionStyles[position]}
      width: 300px;
      max-height: 400px;
      background: #1a1a2e;
      color: #eee;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 999999;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `

    this.buildPanelContent()
    document.body.appendChild(this.panel)
  }

  private removePanel(): void {
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel)
      this.panel = null
    }
  }

  private buildPanelContent(): void {
    if (!this.panel) return

    // Clear existing content
    while (this.panel.firstChild) {
      this.panel.removeChild(this.panel.firstChild)
    }

    const draggables = this.kernel.getDraggables?.() ?? new Map()
    const droppables = this.kernel.getDroppables?.() ?? new Map()
    const isDragging = this.kernel.isDragging?.() ?? false

    // Header
    const header = document.createElement('div')
    header.style.cssText = 'padding: 10px; border-bottom: 1px solid #333;'

    const title = document.createElement('strong')
    title.textContent = 'DragKit Devtools'
    header.appendChild(title)

    const closeBtn = document.createElement('button')
    closeBtn.textContent = '\u00d7'
    closeBtn.style.cssText = 'float: right; background: none; border: none; color: #888; cursor: pointer;'
    closeBtn.addEventListener('click', () => this.hide())
    header.appendChild(closeBtn)

    this.panel.appendChild(header)

    // Stats
    const stats = document.createElement('div')
    stats.style.cssText = 'padding: 10px; border-bottom: 1px solid #333;'

    const draggablesDiv = document.createElement('div')
    draggablesDiv.textContent = `Draggables: ${draggables.size}`
    stats.appendChild(draggablesDiv)

    const droppablesDiv = document.createElement('div')
    droppablesDiv.textContent = `Droppables: ${droppables.size}`
    stats.appendChild(droppablesDiv)

    const draggingDiv = document.createElement('div')
    draggingDiv.textContent = `Dragging: ${isDragging ? 'Yes' : 'No'}`
    stats.appendChild(draggingDiv)

    this.panel.appendChild(stats)

    // Events
    const eventsContainer = document.createElement('div')
    eventsContainer.style.cssText = 'padding: 10px; max-height: 250px; overflow-y: auto;'

    const eventsLabel = document.createElement('div')
    eventsLabel.style.cssText = 'margin-bottom: 5px; color: #888;'
    eventsLabel.textContent = 'Recent Events:'
    eventsContainer.appendChild(eventsLabel)

    this.eventLog.slice(0, 10).forEach(entry => {
      const eventDiv = document.createElement('div')
      eventDiv.style.cssText = 'padding: 4px; margin: 2px 0; background: #252540; border-radius: 4px;'

      const typeSpan = document.createElement('span')
      typeSpan.style.color = this.getEventColor(entry.type)
      typeSpan.textContent = entry.type

      const timeSpan = document.createElement('span')
      timeSpan.style.cssText = 'color: #666; font-size: 10px;'
      timeSpan.textContent = ` ${new Date(entry.timestamp).toLocaleTimeString()}`

      eventDiv.appendChild(typeSpan)
      eventDiv.appendChild(timeSpan)
      eventsContainer.appendChild(eventDiv)
    })

    this.panel.appendChild(eventsContainer)
  }

  private updatePanel(): void {
    if (!this.panel) return
    this.buildPanelContent()
  }

  private getEventColor(type: string): string {
    const colors: Record<string, string> = {
      'drag:start': '#4ade80',
      'drag:move': '#60a5fa',
      'drag:end': '#f87171',
      'drag:cancel': '#fbbf24',
      'drop:enter': '#a78bfa',
      'drop:leave': '#fb923c',
      'drop:drop': '#22d3ee'
    }
    return colors[type] ?? '#888'
  }
}

export function dragDevtools(options: DevtoolsOptions = {}): Plugin & { api?: DevtoolsAPI } {
  let instance: DevtoolsImpl | null = null

  return {
    name: 'drag-devtools',
    version: '1.0.0',
    type: 'optional',

    install(kernel: Kernel) {
      instance = new DevtoolsImpl(kernel, options)
      instance.attach()
      ;(this as any).api = instance
    },

    uninstall() {
      if (instance) {
        instance.detach()
        instance = null
      }
    }
  }
}

// Alias exports for consistency with index.ts
export type DragDevtoolsOptions = DevtoolsOptions
export type DragDevtoolsAPI = DevtoolsAPI
export interface DevtoolsState {
  visible: boolean
  eventCount: number
}

export type { DevtoolsAPI, EventLogEntry }

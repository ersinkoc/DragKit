/**
 * Drag DevTools Plugin
 * Visual debugging panel
 */

import type { Plugin, Kernel, DraggableInstance, DroppableInstance } from '../../../types'

export interface DragDevtoolsOptions {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  shortcut?: string
  draggable?: boolean
  resizable?: boolean
  theme?: 'dark' | 'light' | 'auto'
  defaultOpen?: boolean
  showCollisionRects?: boolean
  showDropIndicators?: boolean
}

interface DragDevtoolsAPI {
  open(): void
  close(): void
  toggle(): void
  isOpen(): boolean
  showCollisionRects(show: boolean): void
  showDropIndicators(show: boolean): void
  getState(): DevtoolsState
}

interface DevtoolsState {
  isDragging: boolean
  activeId: string | null
  draggables: DraggableInfo[]
  droppables: DroppableInfo[]
  sortables: SortableInfo[]
}

interface DraggableInfo {
  id: string
  type: string
  status: 'idle' | 'dragging' | 'disabled'
  position: string
}

interface DroppableInfo {
  id: string
  accept: string
  status: 'idle' | 'over' | 'disabled'
  rect: string
}

interface SortableInfo {
  id: string
  items: number
  direction: string
  status: string
}

class DragDevtoolsImpl implements DragDevtoolsAPI {
  private panel: HTMLElement | null = null
  private isOpenState = false
  private showCollisionRectsState = false
  private showDropIndicatorsState = false
  private collisionOverlay: HTMLElement | null = null
  private unsubscribers: (() => void)[] = []
  private options: DragDevtoolsOptions

  constructor(
    private kernel: Kernel,
    options: DragDevtoolsOptions = {}
  ) {
    this.options = {
      position: 'bottom-right',
      shortcut: 'ctrl+shift+d',
      draggable: true,
      resizable: true,
      theme: 'dark',
      defaultOpen: false,
      showCollisionRects: false,
      showDropIndicators: false,
      ...options
    }

    this.showCollisionRectsState = this.options.showCollisionRects ?? false
    this.showDropIndicatorsState = this.options.showDropIndicators ?? false
  }

  attach(): void {
    document.addEventListener('keydown', this.handleKeyDown)

    const unsubStart = this.kernel.on('drag:start', () => this.updatePanel())
    const unsubMove = this.kernel.on('drag:move', () => this.updatePanel())
    const unsubEnd = this.kernel.on('drag:end', () => this.updatePanel())

    this.unsubscribers = [unsubStart, unsubMove, unsubEnd]

    if (this.options.defaultOpen) {
      this.open()
    }
  }

  detach(): void {
    document.removeEventListener('keydown', this.handleKeyDown)
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []
    this.close()
  }

  open(): void {
    if (this.isOpenState) return
    this.isOpenState = true
    this.createPanel()
    this.updatePanel()
  }

  close(): void {
    if (!this.isOpenState) return
    this.isOpenState = false
    this.removePanel()
    this.removeCollisionOverlay()
  }

  toggle(): void {
    if (this.isOpenState) {
      this.close()
    } else {
      this.open()
    }
  }

  isOpen(): boolean {
    return this.isOpenState
  }

  showCollisionRects(show: boolean): void {
    this.showCollisionRectsState = show
    if (show) {
      this.createCollisionOverlay()
    } else {
      this.removeCollisionOverlay()
    }
  }

  showDropIndicators(show: boolean): void {
    this.showDropIndicatorsState = show
    // Could be used to show drop indicators in future implementation
    void this.showDropIndicatorsState
    this.updatePanel()
  }

  getState(): DevtoolsState {
    const draggables = this.kernel.getDraggables()
    const droppables = this.kernel.getDroppables()
    const activeDraggable = this.kernel.getActiveDraggable()

    return {
      isDragging: this.kernel.isDragging(),
      activeId: activeDraggable?.getId() ?? null,
      draggables: Array.from(draggables.values()).map(d => this.getDraggableInfo(d)),
      droppables: Array.from(droppables.values()).map(d => this.getDroppableInfo(d)),
      sortables: []
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.matchesShortcut(e)) {
      e.preventDefault()
      this.toggle()
    }
  }

  private matchesShortcut(e: KeyboardEvent): boolean {
    const shortcut = this.options.shortcut ?? 'ctrl+shift+d'
    const parts = shortcut.toLowerCase().split('+')

    const requireCtrl = parts.includes('ctrl')
    const requireShift = parts.includes('shift')
    const requireAlt = parts.includes('alt')
    const requireMeta = parts.includes('meta')
    const key = parts.find(p => !['ctrl', 'shift', 'alt', 'meta'].includes(p))

    return (
      e.ctrlKey === requireCtrl &&
      e.shiftKey === requireShift &&
      e.altKey === requireAlt &&
      e.metaKey === requireMeta &&
      e.key.toLowerCase() === key
    )
  }

  private createPanel(): void {
    const isDark = this.options.theme === 'dark' ||
      (this.options.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    this.panel = document.createElement('div')
    this.panel.id = 'dragkit-devtools'
    Object.assign(this.panel.style, this.getPanelStyles(isDark))

    this.buildPanelDOM(this.panel, isDark)
    document.body.appendChild(this.panel)

    if (this.options.draggable) {
      this.makePanelDraggable()
    }
  }

  private buildPanelDOM(panel: HTMLElement, isDark: boolean): void {
    const colors = this.getColors(isDark)

    // Header
    const header = document.createElement('div')
    header.className = 'devtools-header'
    Object.assign(header.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      borderBottom: `1px solid ${colors.border}`,
      background: colors.headerBg
    })

    const title = document.createElement('span')
    title.textContent = 'DragKit DevTools'
    title.style.fontWeight = 'bold'
    header.appendChild(title)

    const closeBtn = document.createElement('button')
    closeBtn.textContent = '\u00D7'
    closeBtn.setAttribute('data-action', 'close')
    Object.assign(closeBtn.style, {
      background: 'none',
      border: 'none',
      color: colors.fg,
      fontSize: '18px',
      cursor: 'pointer',
      padding: '0 4px'
    })
    closeBtn.addEventListener('click', () => this.close())
    header.appendChild(closeBtn)

    panel.appendChild(header)

    // Content
    const content = document.createElement('div')
    content.className = 'devtools-content'
    Object.assign(content.style, {
      padding: '12px',
      maxHeight: '400px',
      overflowY: 'auto'
    })

    // Status section
    const statusSection = document.createElement('div')
    Object.assign(statusSection.style, {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      padding: '8px',
      background: colors.sectionBg,
      borderRadius: '4px'
    })

    const statusSpan = document.createElement('span')
    statusSpan.textContent = 'Status: '
    const statusValue = document.createElement('span')
    statusValue.setAttribute('data-status', '')
    statusValue.textContent = 'Ready'
    statusValue.style.color = colors.success
    statusSpan.appendChild(statusValue)
    statusSection.appendChild(statusSpan)

    const activeSpan = document.createElement('span')
    activeSpan.textContent = 'Active: '
    const activeValue = document.createElement('span')
    activeValue.setAttribute('data-active', '')
    activeValue.textContent = '-'
    activeSpan.appendChild(activeValue)
    statusSection.appendChild(activeSpan)

    content.appendChild(statusSection)

    // Draggables section
    content.appendChild(this.createTableSection('Draggables', ['ID', 'Type', 'Status', 'Position'], 'draggables', colors))

    // Droppables section
    content.appendChild(this.createTableSection('Droppables', ['ID', 'Accept', 'Status', 'Rect'], 'droppables', colors))

    // Actions
    const actions = document.createElement('div')
    Object.assign(actions.style, {
      display: 'flex',
      gap: '8px',
      marginTop: '12px'
    })

    const rectsBtn = document.createElement('button')
    rectsBtn.textContent = 'Show Rects'
    rectsBtn.setAttribute('data-action', 'toggle-rects')
    this.styleButton(rectsBtn, colors)
    rectsBtn.addEventListener('click', () => {
      this.showCollisionRects(!this.showCollisionRectsState)
    })
    actions.appendChild(rectsBtn)

    const copyBtn = document.createElement('button')
    copyBtn.textContent = 'Copy State'
    copyBtn.setAttribute('data-action', 'copy-state')
    this.styleButton(copyBtn, colors)
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(JSON.stringify(this.getState(), null, 2))
    })
    actions.appendChild(copyBtn)

    content.appendChild(actions)
    panel.appendChild(content)
  }

  private createTableSection(title: string, headers: string[], dataAttr: string, colors: any): HTMLElement {
    const section = document.createElement('div')
    section.style.marginBottom = '12px'

    const heading = document.createElement('h4')
    heading.textContent = title
    Object.assign(heading.style, {
      margin: '0 0 8px 0',
      fontSize: '12px',
      color: colors.accent
    })
    section.appendChild(heading)

    const table = document.createElement('table')
    Object.assign(table.style, {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '11px'
    })

    const thead = document.createElement('thead')
    const headerRow = document.createElement('tr')
    headers.forEach(h => {
      const th = document.createElement('th')
      th.textContent = h
      Object.assign(th.style, {
        textAlign: 'left',
        padding: '4px',
        borderBottom: `1px solid ${colors.border}`,
        color: colors.muted
      })
      headerRow.appendChild(th)
    })
    thead.appendChild(headerRow)
    table.appendChild(thead)

    const tbody = document.createElement('tbody')
    tbody.setAttribute(`data-${dataAttr}`, '')
    table.appendChild(tbody)

    section.appendChild(table)
    return section
  }

  private styleButton(btn: HTMLElement, colors: any): void {
    Object.assign(btn.style, {
      padding: '6px 12px',
      background: colors.accent,
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px'
    })
  }

  private getColors(isDark: boolean) {
    return {
      bg: isDark ? '#18181b' : '#ffffff',
      fg: isDark ? '#fafafa' : '#09090b',
      border: isDark ? '#27272a' : '#e4e4e7',
      headerBg: isDark ? '#09090b' : '#f4f4f5',
      sectionBg: isDark ? '#27272a' : '#f4f4f5',
      accent: '#8b5cf6',
      success: '#22c55e',
      muted: isDark ? '#a1a1aa' : '#71717a'
    }
  }

  private removePanel(): void {
    if (this.panel) {
      this.panel.remove()
      this.panel = null
    }
  }

  private updatePanel(): void {
    if (!this.panel) return

    const state = this.getState()
    const colors = this.getColors(this.options.theme === 'dark')

    const statusEl = this.panel.querySelector('[data-status]')
    const activeEl = this.panel.querySelector('[data-active]')
    const draggablesEl = this.panel.querySelector('[data-draggables]')
    const droppablesEl = this.panel.querySelector('[data-droppables]')

    if (statusEl) {
      statusEl.textContent = state.isDragging ? 'Dragging' : 'Ready'
      ;(statusEl as HTMLElement).style.color = state.isDragging ? colors.accent : colors.success
    }

    if (activeEl) {
      activeEl.textContent = state.activeId ?? '-'
    }

    if (draggablesEl) {
      this.updateTableBody(draggablesEl as HTMLElement, state.draggables, ['id', 'type', 'status', 'position'], colors)
    }

    if (droppablesEl) {
      this.updateTableBody(droppablesEl as HTMLElement, state.droppables, ['id', 'accept', 'status', 'rect'], colors)
    }

    if (this.showCollisionRectsState) {
      this.updateCollisionOverlay()
    }
  }

  private updateTableBody(tbody: HTMLElement, items: any[], keys: string[], colors: any): void {
    // Clear existing rows
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild)
    }

    items.forEach(item => {
      const row = document.createElement('tr')
      keys.forEach(key => {
        const td = document.createElement('td')
        td.textContent = String(item[key] ?? '-')
        Object.assign(td.style, {
          padding: '4px',
          borderBottom: `1px solid ${colors.border}`
        })
        if (key === 'status') {
          td.style.color = item.status === 'dragging' || item.status === 'over'
            ? colors.accent
            : item.status === 'disabled'
              ? colors.muted
              : colors.fg
        }
        row.appendChild(td)
      })
      tbody.appendChild(row)
    })
  }

  private getDraggableInfo(d: DraggableInstance): DraggableInfo {
    const transform = d.getTransform()
    return {
      id: d.getId(),
      type: d.data.type ?? '-',
      status: d.isDisabled() ? 'disabled' : d.isDragging() ? 'dragging' : 'idle',
      position: transform ? `${transform.x}, ${transform.y}` : '-'
    }
  }

  private getDroppableInfo(d: DroppableInstance): DroppableInfo {
    const rect = d.getRect()
    return {
      id: d.getId(),
      accept: Array.isArray(d.options.accept)
        ? d.options.accept.join(', ')
        : typeof d.options.accept === 'string'
          ? d.options.accept
          : '*',
      status: d.isDisabled() ? 'disabled' : d.isOver() ? 'over' : 'idle',
      rect: `${Math.round(rect.x)},${Math.round(rect.y)},${Math.round(rect.width)}`
    }
  }

  private getPanelStyles(isDark: boolean): Partial<CSSStyleDeclaration> {
    const colors = this.getColors(isDark)

    const positions: Record<string, { top?: string; right?: string; bottom?: string; left?: string }> = {
      'top-left': { top: '16px', left: '16px' },
      'top-right': { top: '16px', right: '16px' },
      'bottom-left': { bottom: '16px', left: '16px' },
      'bottom-right': { bottom: '16px', right: '16px' }
    }

    const pos = positions[this.options.position ?? 'bottom-right']

    return {
      position: 'fixed',
      ...pos,
      width: '400px',
      maxHeight: '500px',
      background: colors.bg,
      color: colors.fg,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '12px',
      zIndex: '99999',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      overflow: 'hidden'
    }
  }

  private makePanelDraggable(): void {
    if (!this.panel) return

    const header = this.panel.querySelector('.devtools-header') as HTMLElement
    if (!header) return

    let isDragging = false
    let startX = 0
    let startY = 0
    let startLeft = 0
    let startTop = 0

    header.style.cursor = 'move'

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      startX = e.clientX
      startY = e.clientY
      const rect = this.panel!.getBoundingClientRect()
      startLeft = rect.left
      startTop = rect.top
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !this.panel) return

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      this.panel.style.left = `${startLeft + deltaX}px`
      this.panel.style.top = `${startTop + deltaY}px`
      this.panel.style.right = 'auto'
      this.panel.style.bottom = 'auto'
    }

    const onMouseUp = () => {
      isDragging = false
    }

    header.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  private createCollisionOverlay(): void {
    if (this.collisionOverlay) return

    this.collisionOverlay = document.createElement('div')
    Object.assign(this.collisionOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '99998'
    })
    document.body.appendChild(this.collisionOverlay)
    this.updateCollisionOverlay()
  }

  private removeCollisionOverlay(): void {
    if (this.collisionOverlay) {
      this.collisionOverlay.remove()
      this.collisionOverlay = null
    }
  }

  private updateCollisionOverlay(): void {
    if (!this.collisionOverlay) return

    // Clear existing
    while (this.collisionOverlay.firstChild) {
      this.collisionOverlay.removeChild(this.collisionOverlay.firstChild)
    }

    const droppables = this.kernel.getDroppables()

    droppables.forEach(d => {
      const rect = d.getRect()
      const isOver = d.isOver()

      const rectEl = document.createElement('div')
      Object.assign(rectEl.style, {
        position: 'absolute',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        border: isOver ? '2px solid #22c55e' : '2px dashed #8b5cf6',
        background: isOver ? 'rgba(34, 197, 94, 0.1)' : 'rgba(139, 92, 246, 0.1)'
      })

      this.collisionOverlay!.appendChild(rectEl)
    })
  }
}

export function dragDevtools(options: DragDevtoolsOptions = {}): Plugin & { api?: DragDevtoolsAPI } {
  let instance: DragDevtoolsImpl | null = null

  return {
    name: 'drag-devtools',
    version: '1.0.0',
    type: 'optional',

    install(kernel: Kernel) {
      instance = new DragDevtoolsImpl(kernel, options)
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

export type { DragDevtoolsAPI, DevtoolsState }

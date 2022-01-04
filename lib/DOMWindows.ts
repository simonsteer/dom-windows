import { DOMWindowConfig, DOMWindowDataDefaults } from './types'
import El from './El'
import DOMWindow from './DOMWindow'
import { DOM_WINDOW_DATA_DEFAULTS } from './vars'

export default class DOMWindows extends El {
  defaults: DOMWindowDataDefaults

  constructor(
    defaults = DOM_WINDOW_DATA_DEFAULTS as Partial<DOMWindowDataDefaults>
  ) {
    super('div')
    this.defaults = { ...DOM_WINDOW_DATA_DEFAULTS, ...defaults }
    this.attrs(['class', 'dom-windows']).styles(['position', 'relative'])
  }

  add = (domWindowData: DOMWindowConfig) => {
    const domWindow = new DOMWindow(this, domWindowData)
    this.addChildren(domWindow)

    return domWindow
  }

  remove = (domWindow: DOMWindow) => {
    this.removeChild(domWindow)
  }

  onDragWindowCallbacks: ((domWindow: DOMWindow) => void)[] = []
  onDragWindow = (callback: (domWindow: DOMWindow) => void) => {
    this.onDragWindowCallbacks.push(callback)
    return () => {
      this.onDragWindowCallbacks = this.onDragWindowCallbacks.filter(
        c => c !== callback
      )
    }
  }

  onResizeWindowCallbacks: ((domWindow: DOMWindow) => void)[] = []
  onResizeWindow = (callback: (domWindow: DOMWindow) => void) => {
    this.onResizeWindowCallbacks.push(callback)
    return () => {
      this.onResizeWindowCallbacks = this.onResizeWindowCallbacks.filter(
        c => c !== callback
      )
    }
  }
}

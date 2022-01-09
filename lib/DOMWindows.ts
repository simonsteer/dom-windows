import {
  DOMWindowConfig,
  DOMWindowDataDefaults,
  DOMWindowCallback,
} from './types'
import El from './El'
import DOMWindow from './DOMWindow'
import { DOM_WINDOW_DATA_DEFAULTS } from './vars'

// TODO: hide El class usage behind a private field instead of via extension
export default class DOMWindows extends El {
  defaults: DOMWindowDataDefaults
  windows: { [id: string]: DOMWindow } = {}

  constructor(
    defaults = DOM_WINDOW_DATA_DEFAULTS as Partial<DOMWindowDataDefaults>
  ) {
    super('div')
    this.defaults = { ...DOM_WINDOW_DATA_DEFAULTS, ...defaults }
    this.attrs(['class', 'dom-windows']).styles(['position', 'relative'])
  }

  add = (domWindowData: DOMWindowConfig) => {
    const domWindow = new DOMWindow(this, domWindowData)

    this.windows[domWindow.data.id] = domWindow
    this.addChildren(domWindow)
    this.event('onAddWindow', domWindow)

    return domWindow
  }

  remove = (domWindow: DOMWindow | string) => {
    const target =
      typeof domWindow === 'string' ? this.windows[domWindow] : domWindow
    if (!target) return

    this.removeChild(target)
    this.event('onRemoveWindow', target)
  }

  callbacks = {
    onDragWindow: [] as DOMWindowCallback[],
    onResizeWindow: [] as DOMWindowCallback[],
    onBeforeCollapseWindow: [] as DOMWindowCallback[],
    onCollapseWindow: [] as DOMWindowCallback[],
    onBeforeExpandWindow: [] as DOMWindowCallback[],
    onExpandWindow: [] as DOMWindowCallback[],
    onRemoveWindow: [] as DOMWindowCallback[],
    onAddWindow: [] as DOMWindowCallback[],
  }

  event = (type: keyof DOMWindows['callbacks'], domWindow: DOMWindow) => {
    this.callbacks[type].forEach(callback => callback(domWindow))
  }

  onDragWindow = (callback: DOMWindowCallback) =>
    this.domWindowCallback('onDragWindow', callback)

  onResizeWindow = (callback: DOMWindowCallback) =>
    this.domWindowCallback('onResizeWindow', callback)

  onBeforeCollapseWindow = (callback: DOMWindowCallback) =>
    this.domWindowCallback('onBeforeCollapseWindow', callback)

  onCollapseWindow = (callback: DOMWindowCallback) =>
    this.domWindowCallback('onCollapseWindow', callback)

  onBeforeExpandWindow = (callback: DOMWindowCallback) =>
    this.domWindowCallback('onBeforeExpandWindow', callback)

  onExpandWindow = (callback: DOMWindowCallback) =>
    this.domWindowCallback('onExpandWindow', callback)

  onRemoveWindow = (callback: DOMWindowCallback) =>
    this.domWindowCallback('onRemoveWindow', callback)

  onAddWindow = (callback: DOMWindowCallback) =>
    this.domWindowCallback('onAddWindow', callback)

  private domWindowCallback = (
    type: keyof DOMWindows['callbacks'],
    callback: DOMWindowCallback
  ) => {
    this.callbacks[type].push(callback)
    return () => {
      this.callbacks[type] = this.callbacks[type].filter(c => c !== callback)
    }
  }
}

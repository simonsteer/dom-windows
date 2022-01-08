import { DOMWindowDataDefaults } from './types'

export const DOM_WINDOW_DATA_DEFAULTS: DOMWindowDataDefaults = {
  resizeHandleSize: 8,
  dragHandleHeight: 32,
  minHeight: 120,
  minWidth: 200,
  dimensions: [300, 400],
  location: [100, 50],
  buttons: undefined,
}

export const RESIZE_HANDLES = [
  'top' as const,
  'right' as const,
  'bottom' as const,
  'left' as const,
  'top-right' as const,
  'bottom-right' as const,
  'bottom-left' as const,
  'top-left' as const,
]

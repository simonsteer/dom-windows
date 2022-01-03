export const MIN_FRAME_HEIGHT = 120
export const CLOSED_FRAME_HEIGHT = 48
export const MIN_FRAME_WIDTH = 200
export const RESIZE_HANDLE_SIZE = 8

export function getDragHandleHeight() {
  return CLOSED_FRAME_HEIGHT - RESIZE_HANDLE_SIZE * 2
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

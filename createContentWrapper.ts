import { RESIZE_HANDLE_SIZE } from 'vars'

export default function createContentWrapper() {
  const el = document.createElement('div')
  el.className = 'frame-content-wrapper'

  el.style.width = `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`
  el.style.height = `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`

  return el
}

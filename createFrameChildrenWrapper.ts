import { getDragHandleHeight } from 'vars'

export default function createFrameChildrenWrapper() {
  const el = document.createElement('div')
  el.className = 'dom-windows--children-wrapper'

  el.style.width = `100%`
  el.style.height = `calc(100% - ${getDragHandleHeight()}px)`
  el.style.position = 'relative'
  el.style.overflow = 'scroll'

  return el
}

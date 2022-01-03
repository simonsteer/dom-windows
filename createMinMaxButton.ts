import { Frame } from 'types'

export default function createMinMaxButton(
  frame: Pick<Frame, 'getIsOpen' | 'close' | 'open'>
) {
  const el = document.createElement('button')
  el.className = 'frame-min-max-button'
  el.append('-')

  function onClick(e: MouseEvent) {
    e.preventDefault()
    if (frame.getIsOpen()) {
      el.replaceChildren('+')
      frame.close()
    } else {
      el.replaceChildren('-')
      frame.open()
    }
  }
  el.addEventListener('click', onClick)

  return [el, () => el.removeEventListener('click', onClick)] as [
    HTMLElement,
    () => void
  ]
}

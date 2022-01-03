import { Frame } from 'types'

export default function createCloseButton(frame: Pick<Frame, 'remove'>) {
  const el = document.createElement('button')
  el.className = 'frame-close-button'
  el.append('x')

  function onClick(e: MouseEvent) {
    e.preventDefault()
    frame.remove()
  }
  el.addEventListener('click', onClick)

  return [el, () => el.removeEventListener('click', onClick)] as [
    HTMLElement,
    () => void
  ]
}

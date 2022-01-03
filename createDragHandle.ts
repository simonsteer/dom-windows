import Frame from 'Frame'
import { CLOSED_FRAME_HEIGHT, RESIZE_HANDLE_SIZE } from 'vars'

export default function createDragHandle(frame: Frame) {
  const [dragHandle, cleanupDragHandle] = createDragHandleElement(frame)
  const [closeButton, cleanupCloseButton] = createCloseButtonElement(frame)
  const [minMaxButton, cleanupMinMaxButton] = createMinMaxButtonElement(frame)
  const title = createDragHandleTitleElement(frame.data.title)

  dragHandle.append(title, minMaxButton, closeButton)
  return [
    dragHandle,
    () => {
      cleanupCloseButton()
      cleanupMinMaxButton()
      cleanupDragHandle()
    },
  ] as const
}

function createDragHandleElement(frame: Frame) {
  const el = document.createElement('div')

  el.style.width = `100%`
  el.style.display = `flex`
  el.style.justifyContent = `space-between`
  el.style.alignItems = `center`
  el.style.height = `${getDragHandleHeight()}px`
  el.style.cursor = `move`

  function pointerdown(e: PointerEvent) {
    e.preventDefault()
    const panStart = [e.screenX, e.screenY] as [number, number]
    const [oldX, oldY] = frame.data.location

    const pointermove = e => {
      e.preventDefault()
      const [deltaX, deltaY] = [
        e.screenX - panStart[0],
        e.screenY - panStart[1],
      ]

      const newX = Math.min(
        Math.max(oldX + deltaX, 0),
        window.innerWidth - frame.data.dimensions[0]
      )
      const newY = Math.min(
        Math.max(oldY + deltaY, 0),
        window.innerHeight - frame.data.dimensions[1]
      )

      frame.setLocation(newX, newY)
    }

    const pointerup = e => {
      e.preventDefault()
      window.removeEventListener('pointermove', pointermove)
      window.removeEventListener('pointerup', pointerup)
    }

    window.addEventListener('pointermove', pointermove)
    window.addEventListener('pointerup', pointerup)
  }
  el.addEventListener('pointerdown', pointerdown)

  return [el, () => el.removeEventListener('pointerdown', pointerdown)] as const
}

function createDragHandleTitleElement(text: string) {
  const title = document.createElement('p')
  title.append(text)

  return title
}

function createCloseButtonElement(frame: Frame) {
  const closeButton = document.createElement('button')
  closeButton.append('x')

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    frame.remove()
  }
  closeButton.addEventListener('click', handleClick)

  return [
    closeButton,
    () => closeButton.removeEventListener('click', handleClick),
  ] as const
}

function createMinMaxButtonElement(frame: Frame) {
  const minMaxButton = document.createElement('button')
  minMaxButton.append(frame.isOpen ? '-' : '+')

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    if (frame.isOpen) {
      frame.close()
      minMaxButton.replaceChildren('+')
    } else {
      frame.open()
      minMaxButton.replaceChildren('-')
    }
  }
  minMaxButton.addEventListener('click', handleClick)

  return [
    minMaxButton,
    () => minMaxButton.removeEventListener('click', handleClick),
  ] as const
}

export function getDragHandleHeight() {
  return CLOSED_FRAME_HEIGHT - RESIZE_HANDLE_SIZE * 2
}

import createCloseButton from 'createCloseButton'
import createMinMaxButton from 'createMinMaxButton'
import { getDragHandleHeight } from 'vars'
import { Frame } from 'types'

export default function createDragHandle(
  frame: Pick<
    Frame,
    | 'setLocation'
    | 'data'
    | 'close'
    | 'open'
    | 'getIsOpen'
    | 'remove'
    | 'el'
    | 'updateAttr'
  >
) {
  const el = document.createElement('div')
  el.className = 'dom-windows--drag-handle'
  el.style.width = `100%`
  el.style.display = `flex`
  el.style.justifyContent = `space-between`
  el.style.alignItems = `center`
  el.style.height = `${getDragHandleHeight()}px`
  el.style.cursor = `move`

  function pointerdown(e: PointerEvent) {
    e.preventDefault()
    frame.updateAttr('dragging', true)

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
      frame.updateAttr('dragging', false)

      window.removeEventListener('pointermove', pointermove)
      window.removeEventListener('pointerup', pointerup)
    }

    window.addEventListener('pointermove', pointermove)
    window.addEventListener('pointerup', pointerup)
  }
  el.addEventListener('pointerdown', pointerdown)

  const title = document.createElement('span')
  title.className = 'dom-windows--title'
  title.append(frame.data.title)

  const [minMaxButton, teardownMinMaxButton] = createMinMaxButton(frame)
  const [closeButton, teardownCloseButton] = createCloseButton(frame)

  const buttonWrapper = document.createElement('div')
  buttonWrapper.className = 'dom-windows--button-wrapper'
  buttonWrapper.append(minMaxButton, closeButton)

  el.append(title, buttonWrapper)

  return [
    el,
    () => {
      el.removeEventListener('pointerdown', pointerdown)
      teardownMinMaxButton()
      teardownCloseButton()
    },
  ] as const
}

import { Frame, ResizeHandleKind } from 'types'
import { MIN_FRAME_HEIGHT, MIN_FRAME_WIDTH, RESIZE_HANDLE_SIZE } from 'vars'

export default function createResizeHandle(
  frame: { root: HTMLElement } & Pick<
    Frame,
    'setWidth' | 'setHeight' | 'data' | 'setX' | 'setY' | 'getIsOpen'
  >,
  kind: ResizeHandleKind
) {
  const cursor = getCursorForHandleKind(kind)
  const el = createResizeHandleElement(kind, cursor)

  function pointerDown(e: PointerEvent) {
    e.preventDefault()
    const panStart = [e.screenX, e.screenY] as [number, number]

    const pointermove = createPointerMove(frame, kind, panStart)

    const pointerup = e => {
      e.preventDefault()
      frame.root.style.cursor = 'auto'
      window.removeEventListener('pointermove', pointermove)
      window.removeEventListener('pointerup', pointerup)
    }

    frame.root.style.cursor = cursor
    window.addEventListener('pointermove', pointermove)
    window.addEventListener('pointerup', pointerup)
  }

  el.addEventListener('pointerdown', pointerDown)

  return [el, () => el.removeEventListener('pointerdown', pointerDown)] as const
}

const createPointerMove = (
  frame: Pick<
    Frame,
    'setHeight' | 'setWidth' | 'getIsOpen' | 'setY' | 'setX' | 'data'
  >,
  kind: ResizeHandleKind,
  panStart: [number, number]
) => {
  const [oldWidth, oldHeight] = frame.data.dimensions
  const [oldX, oldY] = frame.data.location

  switch (kind) {
    case 'top':
      return e => {
        e.preventDefault()
        if (!frame.getIsOpen()) return

        const deltaY = e.screenY - panStart[1]

        let newHeight = oldHeight - deltaY
        let newY = oldY - (newHeight - oldHeight)

        if (newY < 0) {
          newHeight += newY
          newY = 0
        }

        if (newHeight < MIN_FRAME_HEIGHT) {
          newY -= MIN_FRAME_HEIGHT - newHeight
          newHeight = MIN_FRAME_HEIGHT
        }

        frame.setHeight(newHeight)
        frame.setY(newY)
      }
    case 'right':
      return e => {
        e.preventDefault()
        const deltaX = e.screenX - panStart[0]

        let newWidth = oldWidth + deltaX

        if (newWidth < MIN_FRAME_WIDTH) {
          newWidth = MIN_FRAME_WIDTH
        }

        frame.setWidth(newWidth)
      }
    case 'left':
      return e => {
        e.preventDefault()
        const deltaX = e.screenX - panStart[0]

        let newWidth = oldWidth - deltaX
        let newX = oldX - (newWidth - oldWidth)

        if (newX < 0) {
          newWidth += newX
          newX = 0
        }

        if (newWidth < MIN_FRAME_WIDTH) {
          newX -= MIN_FRAME_WIDTH - newWidth
          newWidth = MIN_FRAME_WIDTH
        }

        frame.setWidth(newWidth)
        frame.setX(newX)
      }
    case 'bottom':
      return e => {
        e.preventDefault()
        if (!frame.getIsOpen()) return

        const deltaY = e.screenY - panStart[1]

        let newHeight = oldHeight + deltaY

        if (newHeight < MIN_FRAME_HEIGHT) {
          newHeight = MIN_FRAME_HEIGHT
        }

        const bottomEdge = frame.data.location[1] + newHeight
        if (bottomEdge > window.innerHeight) {
          newHeight = window.innerHeight - frame.data.location[1]
        }

        frame.setHeight(newHeight)
      }
    case 'bottom-left':
      return e => {
        e.preventDefault()
        const deltaX = e.screenX - panStart[0]

        let newWidth = oldWidth - deltaX
        let newX = oldX - (newWidth - oldWidth)

        if (newX < 0) {
          newWidth += newX
          newX = 0
        }

        if (newWidth < MIN_FRAME_WIDTH) {
          newX -= MIN_FRAME_WIDTH - newWidth
          newWidth = MIN_FRAME_WIDTH
        }

        frame.setWidth(newWidth)
        frame.setX(newX)

        if (frame.getIsOpen()) {
          const deltaY = e.screenY - panStart[1]

          let newHeight = oldHeight + deltaY
          if (newHeight < MIN_FRAME_HEIGHT) {
            newHeight = MIN_FRAME_HEIGHT
          }

          const bottomEdge = frame.data.location[1] + newHeight
          if (bottomEdge > window.innerHeight) {
            newHeight = window.innerHeight - frame.data.location[1]
          }

          frame.setHeight(newHeight)
        }
      }
    case 'bottom-right':
      return e => {
        e.preventDefault()
        const deltaX = e.screenX - panStart[0]

        let newWidth = oldWidth + deltaX

        if (newWidth < MIN_FRAME_WIDTH) {
          newWidth = MIN_FRAME_WIDTH
        }

        frame.setWidth(newWidth)

        if (frame.getIsOpen()) {
          const deltaY = e.screenY - panStart[1]

          let newHeight = oldHeight + deltaY
          if (newHeight < MIN_FRAME_HEIGHT) {
            newHeight = MIN_FRAME_HEIGHT
          }

          const bottomEdge = frame.data.location[1] + newHeight
          if (bottomEdge > window.innerHeight) {
            newHeight = window.innerHeight - frame.data.location[1]
          }

          frame.setHeight(newHeight)
        }
      }
    case 'top-left':
      return e => {
        e.preventDefault()
        const [deltaX, deltaY] = [
          e.screenX - panStart[0],
          e.screenY - panStart[1],
        ]

        let newWidth = oldWidth - deltaX
        let newX = oldX - (newWidth - oldWidth)

        if (newX < 0) {
          newWidth += newX
          newX = 0
        }

        if (newWidth < MIN_FRAME_WIDTH) {
          newX -= MIN_FRAME_WIDTH - newWidth
          newWidth = MIN_FRAME_WIDTH
        }

        frame.setWidth(newWidth)
        frame.setX(newX)

        if (frame.getIsOpen()) {
          let newHeight = oldHeight - deltaY
          let newY = oldY - (newHeight - oldHeight)

          if (newY < 0) {
            newHeight += newY
            newY = 0
          }

          if (newHeight < MIN_FRAME_HEIGHT) {
            newY -= MIN_FRAME_HEIGHT - newHeight
            newHeight = MIN_FRAME_HEIGHT
          }

          frame.setHeight(newHeight)
          frame.setY(newY)
        }
      }
    case 'top-right':
      return e => {
        e.preventDefault()

        const [deltaX, deltaY] = [
          e.screenX - panStart[0],
          e.screenY - panStart[1],
        ]

        let newWidth = oldWidth + deltaX
        if (newWidth < MIN_FRAME_WIDTH) {
          newWidth = MIN_FRAME_WIDTH
        }
        frame.setWidth(newWidth)

        if (frame.getIsOpen()) {
          let newHeight = oldHeight - deltaY
          let newY = oldY - (newHeight - oldHeight)

          if (newY < 0) {
            newHeight += newY
            newY = 0
          }

          if (newHeight < MIN_FRAME_HEIGHT) {
            newY -= MIN_FRAME_HEIGHT - newHeight
            newHeight = MIN_FRAME_HEIGHT
          }

          frame.setHeight(newHeight)
          frame.setY(newY)
        }
      }
  }
}

function getCursorForHandleKind(kind: ResizeHandleKind) {
  switch (kind) {
    case 'top':
    case 'bottom':
      return 'ns-resize'
    case 'left':
    case 'right':
      return 'ew-resize'
    case 'top-left':
    case 'bottom-right':
      return 'nwse-resize'
    case 'top-right':
    case 'bottom-left':
      return 'nesw-resize'
  }
}

const createResizeHandleElement = (
  kind: ResizeHandleKind,
  cursor: ReturnType<typeof getCursorForHandleKind>
) => {
  const el = document.createElement('div')
  el.className = `frame-resize-handle-${kind}`

  el.style.cursor = cursor

  switch (kind) {
    case 'top':
    case 'bottom':
      el.style.width = `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`
      el.style.height = `${RESIZE_HANDLE_SIZE}px`
      break
    case 'left':
    case 'right':
      el.style.width = `${RESIZE_HANDLE_SIZE}px`
      el.style.height = `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`
      break
    case 'top-left':
    case 'top-right':
      el.style.width = `${RESIZE_HANDLE_SIZE}px`
      el.style.height = `${RESIZE_HANDLE_SIZE}px`
      break
    case 'bottom-left':
    case 'bottom-right':
      el.style.width = `${RESIZE_HANDLE_SIZE}px`
      el.style.height = `${RESIZE_HANDLE_SIZE}px`
      break
  }

  return el
}

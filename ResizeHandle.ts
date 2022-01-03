import Frame from 'Frame'
import { MIN_FRAME_HEIGHT, MIN_FRAME_WIDTH, RESIZE_HANDLE_SIZE } from 'vars'
import { ResizeHandleKind } from 'types'

export default class ResizeHandle {
  kind: ResizeHandleKind
  frame: Frame
  el: HTMLElement
  handlers: ReturnType<typeof createResizeHandleHandlers>

  constructor(frame: Frame, kind: ResizeHandleKind) {
    this.frame = frame
    this.kind = kind
    this.el = createResizeHandleElement(kind)
    this.handlers = createResizeHandleHandlers(this.frame, kind)
    this.setup()
  }

  setup = () => {
    for (const handlerKind in this.handlers) {
      const handler = this.handlers[handlerKind]
      this.el.addEventListener(handlerKind, handler)
    }
  }

  teardown = () => {
    for (const handlerKind in this.handlers) {
      const handler = this.handlers[handlerKind]
      this.el.removeEventListener(handlerKind, handler)
    }
  }
}

const createPointerMove = (
  frame: Frame,
  kind: ResizeHandleKind,
  panStart: [number, number]
) => {
  const [oldWidth, oldHeight] = frame.data.dimensions
  const [oldX, oldY] = frame.data.location

  switch (kind) {
    case 'top':
      return e => {
        e.preventDefault()
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
        const deltaY = e.screenY - panStart[1]

        let newHeight = oldHeight + deltaY

        if (newHeight < MIN_FRAME_HEIGHT) {
          newHeight = MIN_FRAME_HEIGHT
        }

        const bottomEdge = frame.data.location[1] + newHeight
        if (bottomEdge > window.innerHeight) {
          newHeight = window.innerHeight - frame.data.location[1]
        }

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
        frame.setHeight(newHeight)
      }
    case 'bottom-right':
      return e => {
        e.preventDefault()
        const deltaY = e.screenY - panStart[1]

        let newHeight = oldHeight + deltaY

        if (newHeight < MIN_FRAME_HEIGHT) {
          newHeight = MIN_FRAME_HEIGHT
        }

        const bottomEdge = frame.data.location[1] + newHeight
        if (bottomEdge > window.innerHeight) {
          newHeight = window.innerHeight - frame.data.location[1]
        }

        const deltaX = e.screenX - panStart[0]

        let newWidth = oldWidth + deltaX

        if (newWidth < MIN_FRAME_WIDTH) {
          newWidth = MIN_FRAME_WIDTH
        }

        frame.setWidth(newWidth)
        frame.setHeight(newHeight)
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

        frame.setWidth(newWidth)
        frame.setX(newX)
        frame.setHeight(newHeight)
        frame.setY(newY)
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

        frame.setWidth(newWidth)
        frame.setHeight(newHeight)
        frame.setY(newY)
      }
    default:
      return e => {
        e.preventDefault()
        const distance = [e.screenX - panStart[0], e.screenY - panStart[1]]
        console.log(kind, ...distance)
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

const createResizeHandleHandlers = (frame: Frame, kind: ResizeHandleKind) => {
  const cursor = getCursorForHandleKind(kind)

  function pointerdown(e: PointerEvent) {
    e.preventDefault()
    const panStart = [e.screenX, e.screenY] as [number, number]

    const pointermove = createPointerMove(frame, kind, panStart)

    const pointerup = e => {
      e.preventDefault()
      frame.parent.style.cursor = 'auto'
      window.removeEventListener('pointermove', pointermove)
      window.removeEventListener('pointerup', pointerup)
    }

    frame.parent.style.cursor = cursor
    window.addEventListener('pointermove', pointermove)
    window.addEventListener('pointerup', pointerup)
  }

  return { pointerdown }
}

const createResizeHandleElement = (kind: ResizeHandleKind) => {
  const el = document.createElement('div')
  el.style.background = 'red'
  el.style.cursor = getCursorForHandleKind(kind)

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

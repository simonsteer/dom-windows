import { ResizeHandleKind } from 'types'
import { MIN_FRAME_HEIGHT, MIN_FRAME_WIDTH, RESIZE_HANDLE_SIZE } from 'vars'
import Frame from './Frame'
import PanHandle from './PanHandle'

export default class ResizeHandle extends PanHandle {
  cursor: ReturnType<typeof getCursorForHandleKind>
  kind: ResizeHandleKind
  oldDimensions: [number, number] = [0, 0]
  oldLocation: [number, number] = [0, 0]

  constructor(frame: Frame, kind: ResizeHandleKind) {
    super('div', {
      onStart: () => {
        this.oldDimensions = [...frame.data.dimensions]
        this.oldLocation = [...frame.data.location]
        frame.manager.styles(['cursor', this.cursor])
        frame.state('resizing', true)
      },
      onMove: deltas =>
        createPointerMove(
          frame,
          kind,
          this.oldDimensions,
          this.oldLocation
        )(deltas),
      onEnd: () => {
        frame.manager.styles(['cursor', 'auto'])
        frame.state('resizing', false)
      },
    })
    this.kind = kind
    this.cursor = getCursorForHandleKind(kind)

    this.attrs([
      'class',
      `dom-windows--resize-handle dom-windows--resize-handle-${kind}`,
    ]).styles(
      ['cursor', this.cursor],
      [
        'width',
        ['top', 'bottom'].includes(kind)
          ? `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`
          : `${RESIZE_HANDLE_SIZE}px`,
      ],
      [
        'height',
        ['left', 'right'].includes(kind)
          ? `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`
          : `${RESIZE_HANDLE_SIZE}px`,
      ]
    )
  }
}

const createPointerMove = (
  frame: Frame,
  kind: ResizeHandleKind,
  [oldWidth, oldHeight]: [number, number],
  [oldX, oldY]: [number, number]
): ((deltas: [deltaX: number, deltaY: number]) => void) => {
  switch (kind) {
    case 'top':
      return ([_, deltaY]) => {
        if (!frame.open) return

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
      return ([deltaX]) => {
        let newWidth = oldWidth + deltaX

        if (newWidth < MIN_FRAME_WIDTH) {
          newWidth = MIN_FRAME_WIDTH
        }

        const rightEdge = frame.data.location[0] + newWidth
        if (rightEdge > window.innerWidth) {
          newWidth = window.innerWidth - frame.data.location[0]
        }

        frame.setWidth(newWidth)
      }
    case 'left':
      return ([deltaX]) => {
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
      return ([_, deltaY]) => {
        if (!frame.open) return

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
      return ([deltaX, deltaY]) => {
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

        if (frame.open) {
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
      return ([deltaX, deltaY]) => {
        let newWidth = oldWidth + deltaX

        if (newWidth < MIN_FRAME_WIDTH) {
          newWidth = MIN_FRAME_WIDTH
        }

        const rightEdge = frame.data.location[0] + newWidth
        if (rightEdge > window.innerWidth) {
          newWidth = window.innerWidth - frame.data.location[0]
        }

        frame.setWidth(newWidth)

        if (frame.open) {
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
      return ([deltaX, deltaY]) => {
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

        if (frame.open) {
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
      return ([deltaX, deltaY]) => {
        let newWidth = oldWidth + deltaX
        if (newWidth < MIN_FRAME_WIDTH) {
          newWidth = MIN_FRAME_WIDTH
        }
        const rightEdge = frame.data.location[0] + newWidth
        if (rightEdge > window.innerWidth) {
          newWidth = window.innerWidth - frame.data.location[0]
        }

        frame.setWidth(newWidth)

        if (frame.open) {
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

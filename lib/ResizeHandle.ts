import { ResizeHandleKind } from './types'
import DOMWindow from './DOMWindow'
import PanHandle from './PanHandle'
export default class ResizeHandle extends PanHandle {
  cursor: ReturnType<typeof getCursorForHandleKind>
  kind: ResizeHandleKind
  domWindow: DOMWindow
  oldDimensions: [number, number] = [0, 0]
  oldLocation: [number, number] = [0, 0]

  constructor(domWindow: DOMWindow, kind: ResizeHandleKind) {
    super('div', {
      onStart: () => {
        this.oldDimensions = [...domWindow.data.dimensions]
        this.oldLocation = [...domWindow.data.location]
        this.domWindow.manager.styles(['cursor', this.cursor])
        this.domWindow.state('resizing', true)
      },
      onMove: deltas => {
        this.domWindow.manager.onDragWindowCallbacks.forEach(callback =>
          callback(this.domWindow)
        )
        getPointerMove(
          this.domWindow,
          this.kind,
          this.oldDimensions,
          this.oldLocation
        )(deltas)
      },
      onEnd: () => {
        domWindow.manager.styles(['cursor', 'auto'])
        domWindow.state('resizing', false)
      },
    })
    this.domWindow = domWindow
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
          ? `calc(100% - ${domWindow.data.resizeHandleSize * 2}px)`
          : `${domWindow.data.resizeHandleSize}px`,
      ],
      [
        'height',
        ['left', 'right'].includes(kind)
          ? `calc(100% - ${domWindow.data.resizeHandleSize * 2}px)`
          : `${domWindow.data.resizeHandleSize}px`,
      ]
    )
  }
}

const getPointerMove = (
  domWindow: DOMWindow,
  kind: ResizeHandleKind,
  [oldWidth, oldHeight]: [number, number],
  [oldX, oldY]: [number, number]
): ((deltas: [deltaX: number, deltaY: number]) => void) => {
  switch (kind) {
    case 'top':
      return ([_, deltaY]) => {
        if (!domWindow.open) return

        let newHeight = oldHeight - deltaY
        let newY = oldY - (newHeight - oldHeight)

        if (newY < 0) {
          newHeight += newY
          newY = 0
        }

        if (newHeight < domWindow.data.minHeight) {
          newY -= domWindow.data.minHeight - newHeight
          newHeight = domWindow.data.minHeight
        }

        domWindow.setHeight(newHeight)
        domWindow.setY(newY)
      }
    case 'right':
      return ([deltaX]) => {
        let newWidth = oldWidth + deltaX

        if (newWidth < domWindow.data.minWidth) {
          newWidth = domWindow.data.minWidth
        }

        const rightEdge = domWindow.data.location[0] + newWidth
        if (rightEdge > window.innerWidth) {
          newWidth = window.innerWidth - domWindow.data.location[0]
        }

        domWindow.setWidth(newWidth)
      }
    case 'left':
      return ([deltaX]) => {
        let newWidth = oldWidth - deltaX
        let newX = oldX - (newWidth - oldWidth)

        if (newX < 0) {
          newWidth += newX
          newX = 0
        }

        if (newWidth < domWindow.data.minWidth) {
          newX -= domWindow.data.minWidth - newWidth
          newWidth = domWindow.data.minWidth
        }

        domWindow.setWidth(newWidth)
        domWindow.setX(newX)
      }
    case 'bottom':
      return ([_, deltaY]) => {
        if (!domWindow.open) return

        let newHeight = oldHeight + deltaY

        if (newHeight < domWindow.data.minHeight) {
          newHeight = domWindow.data.minHeight
        }

        const bottomEdge = domWindow.data.location[1] + newHeight
        if (bottomEdge > window.innerHeight) {
          newHeight = window.innerHeight - domWindow.data.location[1]
        }

        domWindow.setHeight(newHeight)
      }
    case 'bottom-left':
      return ([deltaX, deltaY]) => {
        let newWidth = oldWidth - deltaX
        let newX = oldX - (newWidth - oldWidth)

        if (newX < 0) {
          newWidth += newX
          newX = 0
        }

        if (newWidth < domWindow.data.minWidth) {
          newX -= domWindow.data.minWidth - newWidth
          newWidth = domWindow.data.minWidth
        }

        domWindow.setWidth(newWidth)
        domWindow.setX(newX)

        if (domWindow.open) {
          let newHeight = oldHeight + deltaY
          if (newHeight < domWindow.data.minHeight) {
            newHeight = domWindow.data.minHeight
          }

          const bottomEdge = domWindow.data.location[1] + newHeight
          if (bottomEdge > window.innerHeight) {
            newHeight = window.innerHeight - domWindow.data.location[1]
          }

          domWindow.setHeight(newHeight)
        }
      }
    case 'bottom-right':
      return ([deltaX, deltaY]) => {
        let newWidth = oldWidth + deltaX

        if (newWidth < domWindow.data.minWidth) {
          newWidth = domWindow.data.minWidth
        }

        const rightEdge = domWindow.data.location[0] + newWidth
        if (rightEdge > window.innerWidth) {
          newWidth = window.innerWidth - domWindow.data.location[0]
        }

        domWindow.setWidth(newWidth)

        if (domWindow.open) {
          let newHeight = oldHeight + deltaY
          if (newHeight < domWindow.data.minHeight) {
            newHeight = domWindow.data.minHeight
          }

          const bottomEdge = domWindow.data.location[1] + newHeight
          if (bottomEdge > window.innerHeight) {
            newHeight = window.innerHeight - domWindow.data.location[1]
          }

          domWindow.setHeight(newHeight)
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

        if (newWidth < domWindow.data.minWidth) {
          newX -= domWindow.data.minWidth - newWidth
          newWidth = domWindow.data.minWidth
        }

        domWindow.setWidth(newWidth)
        domWindow.setX(newX)

        if (domWindow.open) {
          let newHeight = oldHeight - deltaY
          let newY = oldY - (newHeight - oldHeight)

          if (newY < 0) {
            newHeight += newY
            newY = 0
          }

          if (newHeight < domWindow.data.minHeight) {
            newY -= domWindow.data.minHeight - newHeight
            newHeight = domWindow.data.minHeight
          }

          domWindow.setHeight(newHeight)
          domWindow.setY(newY)
        }
      }
    case 'top-right':
      return ([deltaX, deltaY]) => {
        let newWidth = oldWidth + deltaX
        if (newWidth < domWindow.data.minWidth) {
          newWidth = domWindow.data.minWidth
        }
        const rightEdge = domWindow.data.location[0] + newWidth
        if (rightEdge > window.innerWidth) {
          newWidth = window.innerWidth - domWindow.data.location[0]
        }

        domWindow.setWidth(newWidth)

        if (domWindow.open) {
          let newHeight = oldHeight - deltaY
          let newY = oldY - (newHeight - oldHeight)

          if (newY < 0) {
            newHeight += newY
            newY = 0
          }

          if (newHeight < domWindow.data.minHeight) {
            newY -= domWindow.data.minHeight - newHeight
            newHeight = domWindow.data.minHeight
          }

          domWindow.setHeight(newHeight)
          domWindow.setY(newY)
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

import createDragHandle, { getDragHandleHeight } from 'createDragHandle'
import createResizeHandle from 'createResizeHandle'
import Frames from 'Frames'
import { FrameData, ResizeHandleKind } from 'types'
import { CLOSED_FRAME_HEIGHT, RESIZE_HANDLE_SIZE } from 'vars'

export default class Frame {
  frames: Frames
  get parent(): HTMLElement {
    return this.frames.el
  }
  el: HTMLElement
  childrenContainer = createChildrenContainerElement()
  handles: { [K in ResizeHandleKind]: readonly [HTMLElement, () => void] }
  data: FrameData
  openHeight: string

  constructor(frames: Frames, data: FrameData) {
    this.frames = frames
    this.data = data
    this.el = createFrameElement(data)
    this.handles = {
      ['top']: createResizeHandle(this, 'top'),
      ['top-left']: createResizeHandle(this, 'top-left'),
      ['top-right']: createResizeHandle(this, 'top-right'),
      ['right']: createResizeHandle(this, 'right'),
      ['bottom']: createResizeHandle(this, 'bottom'),
      ['bottom-right']: createResizeHandle(this, 'bottom-right'),
      ['bottom-left']: createResizeHandle(this, 'bottom-left'),
      ['left']: createResizeHandle(this, 'left'),
    }
    this.openHeight = data.dimensions[1] + 'px'
  }

  remove = () => this.frames.remove(this.data.id)

  setLocation = (x: number, y: number) => {
    this.setX(x)
    this.setY(y)
  }

  setX = (x: number) => {
    this.data.location[0] = x
    this.el.style.left = x + 'px'
  }

  setY = (y: number) => {
    this.data.location[1] = y
    this.el.style.top = y + 'px'
  }

  setDimensions = (width: number, height: number) => {
    this.setWidth(width)
    this.setHeight(height)
  }

  setHeight = (height: number) => {
    this.openHeight = height + 'px'
    this.data.dimensions[1] = height
    if (this.isOpen) {
      this.el.style.height = this.openHeight
    }
  }

  setWidth = (width: number) => {
    this.data.dimensions[0] = width
    this.el.style.width = width + 'px'
  }

  isOpen = true

  open = () => {
    this.el.style.height = this.openHeight
    this.isOpen = true
  }

  close = () => {
    this.openHeight = this.el.style.height
    this.el.style.height = `${CLOSED_FRAME_HEIGHT}px`
    this.isOpen = false
  }

  render() {
    const [dragHandle, teardownDragHandle] = createDragHandle(this)

    const wrapper = document.createElement('div')
    wrapper.style.width = `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`
    wrapper.style.height = `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`
    wrapper.append(dragHandle, this.childrenContainer)

    const h1 = document.createElement('h1')
    h1.style.width = '100px'
    h1.append(
      'HELlooo helsd lfh kd fhjsf kshfk ksj k jhd kjh skjh ksj hsdkfj hsfkahj kjhfk hsk g'
    )
    this.childrenContainer.appendChild(h1)

    this.el.append(
      this.handles['top-left'][0],
      this.handles['top'][0],
      this.handles['top-right'][0],
      this.handles['left'][0],
      wrapper,
      this.handles['right'][0],
      this.handles['bottom-left'][0],
      this.handles['bottom'][0],
      this.handles['bottom-right'][0]
    )

    return [
      this.el,
      () => {
        teardownDragHandle()
        this.handles['top-left'][1]()
        this.handles['top'][1]()
        this.handles['top-right'][1]()
        this.handles['left'][1]()
        this.handles['right'][1]()
        this.handles['bottom-left'][1]()
        this.handles['bottom'][1]()
        this.handles['bottom-right'][1]()
      },
    ] as const
  }
}

function createFrameElement(data: FrameData) {
  const [x, y] = data.location
  const [width, height] = data.dimensions

  const el = document.createElement('div')
  el.style.position = 'absolute'
  el.style.display = 'flex'
  el.style.flexWrap = 'wrap'
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.style.width = `${width}px`
  el.style.height = `${height}px`

  return el
}

function createChildrenContainerElement() {
  const el = document.createElement('div')

  el.style.width = `100%`
  el.style.height = `calc(100% - ${getDragHandleHeight()}px)`
  el.style.position = 'relative'
  el.style.overflow = 'scroll'

  return el
}

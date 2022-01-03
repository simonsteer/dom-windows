import ResizeHandle from 'ResizeHandle'
import { FrameData, ResizeHandleKind } from 'types'
import { CLOSED_FRAME_HEIGHT, RESIZE_HANDLE_SIZE } from 'vars'

export default class Frame {
  parent: HTMLElement
  el: HTMLElement
  childrenContainer = createChildrenContainerElement()
  handles: { [K in ResizeHandleKind]: ResizeHandle }
  data: FrameData
  openHeight: string

  constructor(parent: HTMLElement, data: FrameData) {
    this.parent = parent
    this.data = data
    this.el = createFrameElement(data)
    this.handles = {
      ['top']: new ResizeHandle(this, 'top'),
      ['top-left']: new ResizeHandle(this, 'top-left'),
      ['top-right']: new ResizeHandle(this, 'top-right'),
      ['right']: new ResizeHandle(this, 'right'),
      ['bottom']: new ResizeHandle(this, 'bottom'),
      ['bottom-right']: new ResizeHandle(this, 'bottom-right'),
      ['bottom-left']: new ResizeHandle(this, 'bottom-left'),
      ['left']: new ResizeHandle(this, 'left'),
    }
    this.openHeight = data.dimensions[1] + 'px'
    this.render()
  }

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

  private render() {
    const handle = createHandleElement(this)

    const wrapper = document.createElement('div')
    wrapper.style.width = `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`
    wrapper.style.height = `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`

    wrapper.append(handle, this.childrenContainer)

    const h1 = document.createElement('h1')
    h1.style.width = '100px'
    h1.append(
      'HELlooo helsd lfh kd fhjsf kshfk ksj k jhd kjh skjh ksj hsdkfj hsfkahj kjhfk hsk g'
    )
    this.childrenContainer.appendChild(h1)

    this.el.append(
      this.handles['top-left'].el,
      this.handles['top'].el,
      this.handles['top-right'].el,
      this.handles['left'].el,
      wrapper,
      this.handles['right'].el,
      this.handles['bottom-left'].el,
      this.handles['bottom'].el,
      this.handles['bottom-right'].el
    )
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
  el.style.height = `calc(100% - ${getHandleHeight()}px)`
  el.style.position = 'relative'
  el.style.overflow = 'scroll'

  return el
}

function createHandleElement(frame: Frame) {
  const el = document.createElement('div')

  el.style.width = `100%`
  el.style.display = `flex`
  el.style.justifyContent = `space-between`
  el.style.alignItems = `center`
  el.style.height = `${getHandleHeight()}px`
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

  const title = document.createElement('p')
  title.append(frame.data.title)

  const closeButton = document.createElement('button')
  closeButton.append(frame.isOpen ? 'x' : '+')
  closeButton.addEventListener('click', e => {
    e.preventDefault()
    if (frame.isOpen) {
      frame.close()
      closeButton.replaceChildren('+')
    } else {
      frame.open()
      closeButton.replaceChildren('x')
    }
  })

  el.addEventListener('pointerdown', pointerdown)
  el.append(title, closeButton)

  return el
}

function getHandleHeight() {
  return CLOSED_FRAME_HEIGHT - RESIZE_HANDLE_SIZE * 2
}

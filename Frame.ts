import ResizeHandle from 'ResizeHandle'
import { FrameData, ResizeHandleKind } from 'types'
import { RESIZE_HANDLE_SIZE } from 'vars'

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
    this.el.style.height = '40px'
    this.isOpen = false
  }

  private render() {
    const h1 = document.createElement('h1')
    h1.style.width = '100px'
    h1.append(
      'HELlooo helsd lfh kd fhjsf kshfk ksj k jhd kjh skjh ksj hsdkfj hsfkahj kjhfk hsk g'
    )
    this.childrenContainer.appendChild(h1)
    // this.childrenContainer.addEventListener('click', () => {
    //   if (this.isOpen) {
    //     this.close()
    //   } else {
    //     this.open()
    //   }
    // })

    const children = [
      this.handles['top-left'].el,
      this.handles['top'].el,
      this.handles['top-right'].el,
      this.handles['left'].el,
      this.childrenContainer,
      this.handles['right'].el,
      this.handles['bottom-left'].el,
      this.handles['bottom'].el,
      this.handles['bottom-right'].el,
    ]
    children.forEach(c => this.el.appendChild(c))
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
  el.style.background = `red`

  return el
}

function createChildrenContainerElement() {
  const el = document.createElement('div')

  el.style.width = `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`
  el.style.height = `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`
  el.style.background = 'rgba(100,100,255,0.75)'
  el.style.position = 'relative'
  el.style.overflow = 'scroll'

  return el
}

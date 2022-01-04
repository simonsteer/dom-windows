import { DOMWindowData, ResizeHandleKind, DOMWindowConfig } from './types'
import { RESIZE_HANDLES } from './vars'
import { getCollapsedHeight } from './utils'
import DragHandle from './DragHandle'
import El from './El'
import DOMWindows from './DOMWindows'
import ResizeHandle from './ResizeHandle'

export default class DOMWindow extends El {
  manager: DOMWindows
  data: DOMWindowData
  open = true
  dragging = false
  resizing = false

  openHeight: string

  constructor(manager: DOMWindows, config: DOMWindowConfig) {
    super('div')

    this.manager = manager
    const {
      children,
      id,
      title,
      sizeLocks = this.manager.defaults.sizeLocks,
      dimensions = this.manager.defaults.dimensions,
      location = this.manager.defaults.location,
      resizeHandleSize = this.manager.defaults.resizeHandleSize,
      dragHandleHeight = this.manager.defaults.dragHandleHeight,
      minHeight = this.manager.defaults.minHeight,
      minWidth = this.manager.defaults.minWidth,
      buttons = this.manager.defaults.buttons,
    } = config

    this.data = {
      children,
      id,
      sizeLocks,
      title,
      dimensions,
      location,
      resizeHandleSize,
      dragHandleHeight,
      minHeight,
      minWidth,
      buttons,
    }
    this.attrs(['class', 'dom-windows--window'])

    const [x, y] = this.data.location
    const [width, height] = this.data.dimensions

    this.on('pointerdown', e => {
      e.preventDefault()
      this.styles(['zIndex', performance.now() + ''])
    }).styles(
      ['position', 'absolute'],
      ['display', 'flex'],
      ['flexWrap', 'wrap'],
      ['left', `${x}px`],
      ['top', `${y}px`],
      ['width', `${width}px`],
      ['height', `${height}px`]
    )

    this.openHeight = `${height}px`

    const handles = RESIZE_HANDLES.reduce(
      (acc, kind) => ({ ...acc, [kind]: new ResizeHandle(this, kind) }),
      {} as { [Kind in ResizeHandleKind]: ResizeHandle }
    )

    const childrenWrapper = new El('div')
      .attrs(['class', 'dom-windows--children-wrapper'])
      .styles(
        ['width', `100%`],
        ['height', `calc(100% - ${this.data.dragHandleHeight}px)`],
        ['position', 'relative'],
        ['overflow', 'scroll']
      )
    childrenWrapper.el.append(config.children)

    this.addChildren(
      handles['top-left'],
      handles['top'],
      handles['top-right'],
      handles['left'],
      new El('div')
        .attrs(['class', 'dom-windows--content-wrapper'])
        .styles(
          ['width', `calc(100% - ${this.data.resizeHandleSize * 2}px)`],
          ['height', `calc(100% - ${this.data.resizeHandleSize * 2}px)`]
        )
        .addChildren(new DragHandle(this), childrenWrapper),
      handles['right'],
      handles['bottom-left'],
      handles['bottom'],
      handles['bottom-right']
    )
      .state('dragging', false)
      .state('resizing', false)
      .state('open', true)
  }

  setLocation = (x: number, y: number) => {
    this.setX(x)
    this.setY(y)
  }

  setY = (y: number) => {
    this.data.location[1] = y
    this.el.style.top = y + 'px'
  }

  setX = (x: number) => {
    this.data.location[0] = x
    this.el.style.left = x + 'px'
  }

  setDimensions = (width: number, height: number) => {
    this.setWidth(width)
    this.setHeight(height)
  }

  setHeight = (height: number) => {
    this.openHeight = height + 'px'
    this.data.dimensions[1] = height
    if (this.open) {
      this.el.style.height = this.openHeight
    }
  }

  setWidth = (width: number) => {
    this.data.dimensions[0] = width
    this.el.style.width = width + 'px'
  }

  expand = () => {
    this.el.style.height = this.openHeight
    this.state('open', true)
  }

  collapse = () => {
    this.openHeight = this.el.style.height
    this.el.style.height = `${getCollapsedHeight(
      this.data.dragHandleHeight,
      this.data.resizeHandleSize
    )}px`
    this.state('open', false)
  }

  state = (attr: 'dragging' | 'resizing' | 'open', value: boolean) => {
    const nodes = Array.from(
      this.el.querySelectorAll('[class^=dom-windows]')
    ).concat(this.el)

    nodes.forEach(node => {
      node.setAttribute(`data-${attr}`, value + '')
    })
    this[attr] = value

    return this
  }

  remove = () => this.manager.remove(this)
}

import { DOMWindowData, DOMWindowConfig } from './types'
import { RESIZE_HANDLES } from './vars'
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
  resizeHandles: ResizeHandle[]

  constructor(manager: DOMWindows, config: DOMWindowConfig) {
    super('div')

    this.manager = manager
    const {
      children,
      id,
      title,
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
      title,
      dimensions,
      location,
      resizeHandleSize,
      dragHandleHeight,
      minHeight,
      minWidth,
      buttons,
    }
    const [x, y] = this.data.location
    const [width, height] = this.data.dimensions
    this.openHeight = `${height}px`

    this.resizeHandles = RESIZE_HANDLES.map(
      kind => new ResizeHandle(this, kind)
    )

    this.attrs(['class', 'dom-windows--window'])
      .styles(
        ['position', 'absolute'],
        ['display', 'flex'],
        ['left', `${x}px`],
        ['top', `${y}px`],
        ['width', `${width}px`],
        ['height', `${height}px`]
      )
      .addChildren(
        new El('div')
          .attrs(['class', 'dom-windows--content'])
          .styles(
            ['position', 'relative'],
            ['display', `flex`],
            ['flexDirection', 'column'],
            ['flex', '1']
          )
          .addChildren(
            new DragHandle(this),
            new El('div')
              .attrs(['class', 'dom-windows--children'])
              .styles(
                ['flex', '1'],
                ['position', 'relative'],
                ['overflow', 'scroll']
              )
              .addChildren(config.children),
            ...this.resizeHandles
          )
      )
      .on('pointerdown', e => {
        e.preventDefault()
        this.styles(['zIndex', performance.now() + ''])
      })
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
    this.manager.event('onBeforeExpandWindow', this)

    this.el.style.height = this.openHeight
    this.resizeHandles
      .filter(handle => !['left', 'right'].includes(handle.kind))
      .forEach(handle => {
        handle.styles(['pointerEvents', 'auto'])
      })
    this.state('open', true)

    this.manager.event('onExpandWindow', this)
  }

  collapse = () => {
    this.manager.event('onBeforeCollapseWindow', this)

    this.openHeight = this.el.style.height
    this.el.style.height = `${this.data.dragHandleHeight}px`
    this.resizeHandles
      .filter(handle => !['left', 'right'].includes(handle.kind))
      .forEach(handle => {
        handle.styles(['pointerEvents', 'none'])
      })
    this.state('open', false)

    this.manager.event('onCollapseWindow', this)
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

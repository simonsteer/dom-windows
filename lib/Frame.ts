import { FrameData, ResizeHandleKind } from 'types'
import {
  CLOSED_FRAME_HEIGHT,
  getDragHandleHeight,
  RESIZE_HANDLES,
  RESIZE_HANDLE_SIZE,
} from 'vars'
import DragHandle from './DragHandle'
import El from './El'
import FrameManager from './FrameManager'
import ResizeHandle from './ResizeHandle'

export default class Frame extends El {
  manager: FrameManager
  data: FrameData

  open = true
  dragging = false
  resizing = false

  openHeight: string

  constructor(manager: FrameManager, data: FrameData) {
    super('div')
    this.manager = manager
    this.data = data
    this.attrs(['class', 'dom-windows--frame'])

    const [x, y] = data.location
    const [width, height] = data.dimensions

    this.openHeight = `${width}px`

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

    const handles = RESIZE_HANDLES.reduce(
      (acc, kind) => ({ ...acc, [kind]: new ResizeHandle(this, kind) }),
      {} as { [Kind in ResizeHandleKind]: ResizeHandle }
    )

    const childrenWrapper = new El('div')
      .attrs(['class', 'dom-windows--children-wrapper'])
      .styles(
        ['width', `100%`],
        ['height', `calc(100% - ${getDragHandleHeight()}px)`],
        ['position', 'relative'],
        ['overflow', 'scroll']
      )
    childrenWrapper.el.append(data.children)

    this.addChildren(
      handles['top-left'],
      handles['top'],
      handles['top-right'],
      handles['left'],
      new El('div')
        .attrs(['class', 'dom-windows--content-wrapper'])
        .styles(
          ['width', `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`],
          ['height', `calc(100% - ${RESIZE_HANDLE_SIZE * 2}px)`]
        )
        .addChildren(new DragHandle(this), childrenWrapper),
      handles['right'],
      handles['bottom-left'],
      handles['bottom'],
      handles['bottom-right']
    )

    this.state('dragging', false)
    this.state('resizing', false)
    this.state('open', true)
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
    this.el.style.height = `${CLOSED_FRAME_HEIGHT}px`
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
  }

  remove = () => this.manager.remove(this.data.id)
}

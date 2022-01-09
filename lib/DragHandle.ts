import { DOMWindowData } from './types'
import El from './El'
import DOMWindow from './DOMWindow'
import PanHandle from './PanHandle'

export default class DragHandle extends PanHandle {
  domWindow: DOMWindow
  prevLocation: DOMWindowData['location']

  constructor(domWindow: DOMWindow) {
    super('div', {
      onStart: () => {
        this.prevLocation = [...domWindow.data.location]
        this.domWindow.state('dragging', true)
      },
      onMove: ([deltaX, deltaY]) => {
        const [oldX, oldY] = this.prevLocation

        const newX = oldX + deltaX
        const newY = oldY + deltaY

        this.domWindow.setLocation(newX, newY)
        this.domWindow.manager.callbacks.onDragWindow.forEach(callback =>
          callback(this.domWindow)
        )
      },
      onEnd: () => this.domWindow.state('dragging', false),
    })

    this.domWindow = domWindow
    this.prevLocation = [...domWindow.data.location]

    this.attrs(['class', 'dom-windows--drag-handle'])
      .styles(
        ['width', `100%`],
        ['height', `${this.domWindow.data.dragHandleHeight}px`],
        ['cursor', `move`]
      )
      .addChildren(
        new El('span')
          .attrs(['class', 'dom-windows--title'])
          .addChildren(
            typeof this.domWindow.data.title === 'string'
              ? new Text(this.domWindow.data.title)
              : this.domWindow.data.title
          ).el,
        createButtons(this.domWindow)
      )
  }
}

function createButtons(domWindow: DOMWindow) {
  const buttons = new El('span').attrs(['class', 'dom-windows--buttons'])
  if (domWindow.data.buttons) {
    buttons.addChildren(domWindow.data.buttons)
    return buttons
  }

  const maxText = new Text('+')
  const minText = new Text('-')
  const minimizeButton = new El('button')
    .attrs(['class', 'dom-windows--button'])
    .addChildren(minText)
    .on('click', e => {
      e.preventDefault()
      if (domWindow.open) {
        minimizeButton.replaceChildren(maxText)
        domWindow.collapse()
      } else {
        minimizeButton.replaceChildren(minText)
        domWindow.expand()
      }
    })

  const removeButton = new El('button')
    .attrs(['class', 'dom-windows--button'])
    .on('click', e => {
      e.preventDefault()
      domWindow.remove()
    })
    .addChildren(new Text('x'))

  buttons.addChildren(minimizeButton, removeButton)
  return buttons
}

import { FrameData } from 'types'
import { getDragHandleHeight } from 'vars'
import El from './El'
import Frame from './Frame'
import PanHandle from './PanHandle'

export default class DragHandle extends PanHandle {
  frame: Frame
  prevLocation: FrameData['location']

  constructor(frame: Frame) {
    super('div', {
      onStart: () => {
        this.prevLocation = [...frame.data.location]
        frame.state('dragging', true)
      },
      onMove: ([deltaX, deltaY]) => {
        const [oldX, oldY] = this.prevLocation

        const newX = oldX + deltaX
        const newY = oldY + deltaY

        frame.setLocation(newX, newY)
      },
      onEnd: () => frame.state('dragging', false),
    })

    this.prevLocation = [...frame.data.location]
    this.frame = frame

    this.attrs(['class', 'dom-windows--drag-handle']).styles(
      ['width', `100%`],
      ['display', `flex`],
      ['justifyContent', `space-between`],
      ['alignItems', `center`],
      ['height', `${getDragHandleHeight()}px`],
      ['cursor', `move`]
    )

    const title = new El('span')
      .attrs(['class', 'dom-windows--title'])
      .addChildren(new Text(frame.data.title))

    const maxText = new Text('+')
    const minText = new Text('-')

    const minimizeButton = new El('button')
      .attrs(['class', 'dom-windows--button dom-windows--minimize-button'])
      .addChildren(minText)
      .on('click', e => {
        e.preventDefault()
        if (frame.open) {
          minimizeButton.replaceChildren(maxText)
          frame.collapse()
        } else {
          minimizeButton.replaceChildren(minText)
          frame.expand()
        }
      })

    const removeButton = new El('button')
      .attrs(['class', 'dom-windows--button dom-windows--remove-button'])
      .on('click', e => {
        e.preventDefault()
        frame.remove()
      })
      .addChildren(new Text('x'))

    this.addChildren(
      title,
      new El('div').addChildren(minimizeButton, removeButton)
    )
  }
}

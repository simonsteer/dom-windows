import { FrameData, Id } from 'types'
import Frame from 'Frame'

export default class Frames {
  el = createFramesContainer()
  frames: { [key: string]: Frame } = {}

  add(frameData: FrameData) {
    const frame = new Frame(this.el, frameData)
    this.frames[frameData.id] = frame
    this.el.append(frame.el)
    return this
  }

  remove(id: Id) {
    delete this.frames[id]
    return this
  }

  render(el: HTMLElement) {
    el.replaceChildren(this.el)
  }
}

const createFramesContainer = () => {
  const div = document.createElement('div')

  div.style.position = 'relative'
  div.style.width = '100vw'
  div.style.height = '100vh'

  return div
}

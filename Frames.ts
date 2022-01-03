import { FrameData, Id } from 'types'
import Frame from 'Frame'

export default class Frames {
  el = createFramesContainer()
  frames: { [key: string]: readonly [HTMLElement, () => void] } = {}

  add(frameData: FrameData) {
    const frame = new Frame(this, frameData)
    this.frames[frameData.id] = frame.render()
    this.el.append(this.frames[frameData.id][0])
    return this
  }

  remove(id: Id) {
    const target = this.frames[id]
    if (target) {
      const [el, cleanup] = target
      cleanup()
      this.el.removeChild(el)
    }
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

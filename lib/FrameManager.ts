import { FrameData } from 'types'
import El from './El'
import Frame from './Frame'

export default class FrameManager extends El {
  frames: { [id: string]: Frame } = {}

  constructor() {
    super('div')
    this.attrs(['class', 'dom-windows']).styles(['position', 'relative'])
  }

  add = (frameData: FrameData) => {
    const frame = new Frame(this, frameData)
    this.frames[frameData.id] = frame
    this.addChildren(frame)

    return frame
  }

  remove = (frame: string | Frame) => {
    const frameId = typeof frame === 'string' ? frame : frame.data.id

    const target = this.frames[frameId]
    if (target) {
      this.removeChild(target)
      delete this.frames[frameId]
    }

    return !!target
  }
}

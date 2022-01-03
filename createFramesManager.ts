import { FrameData, Id } from 'types'
import createFrame from 'createFrame'

export default function createFramesManager() {
  const el = document.createElement('div')
  el.className = 'frames-manager'
  el.style.position = 'relative'
  el.style.width = '100vw'
  el.style.height = '100vh'

  const frames: { [key: string]: ReturnType<typeof createFrame> } = {}

  const add = (frameData: FrameData) => {
    const frame = createFrame(manager, frameData)
    frames[frameData.id] = frame
    el.append(frames[frameData.id].el)
  }

  const remove = (id: Id) => {
    const target = frames[id]
    if (target) {
      target.teardown()
      el.removeChild(target.el)
    }
  }

  const manager = { el, frames, add, remove }

  return manager
}

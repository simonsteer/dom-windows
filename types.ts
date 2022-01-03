import createFrame from 'createFrame'
import createFramesManager from 'createFramesManager'

export type Id = string

export type FrameData = {
  id: Id
  title: string
  children: Node
  location: [x: number, y: number]
  dimensions: [width: number, height: number]
  sizeLocks: {
    x: [left: string | null, right: string | null]
    y: [top: string | null, bottom: string | null]
  }
}
export type Frame = ReturnType<typeof createFrame>

export type FramesManager = ReturnType<typeof createFramesManager>

type HorizontalEdge = 'right' | 'left'

type VerticalEdge = 'top' | 'bottom'

export type ResizeHandleKind =
  | HorizontalEdge
  | VerticalEdge
  | `${VerticalEdge}-${HorizontalEdge}`

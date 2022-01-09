import DOMWindow from './DOMWindow'

export type DOMWindowData = {
  id: string
  title: string | Node
  buttons: Node | undefined
  children: Node
  location: [x: number, y: number]
  dimensions: [width: number, height: number]
  resizeHandleSize: number
  dragHandleHeight: number
  minWidth: number
  minHeight: number
}

export type DOMWindowCallback = (domWindow: DOMWindow) => void

export type DOMWindowDataDefaults = Pick<
  DOMWindowData,
  | 'dimensions'
  | 'location'
  | 'resizeHandleSize'
  | 'dragHandleHeight'
  | 'minWidth'
  | 'minHeight'
  | 'buttons'
>

export type DOMWindowConfig = Omit<DOMWindowData, keyof DOMWindowDataDefaults> &
  Partial<DOMWindowDataDefaults>

type HorizontalEdge = 'right' | 'left'

type VerticalEdge = 'top' | 'bottom'

export type ResizeHandleKind =
  | HorizontalEdge
  | VerticalEdge
  | `${VerticalEdge}-${HorizontalEdge}`

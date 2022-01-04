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
  sizeLocks: [
    x: [left: string | null, right: string | null],
    y: [top: string | null, bottom: string | null]
  ]
}

export type DOMWindowDataDefaults = Pick<
  DOMWindowData,
  | 'dimensions'
  | 'location'
  | 'sizeLocks'
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

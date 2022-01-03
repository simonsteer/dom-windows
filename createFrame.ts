import createContentWrapper from 'createContentWrapper'
import createDragHandle from 'createDragHandle'
import createFrameChildrenWrapper from 'createFrameChildrenWrapper'
import createFramesManager from 'createFramesManager'
import createResizeHandle from 'createResizeHandle'
import { FrameData, ResizeHandleKind } from 'types'
import { CLOSED_FRAME_HEIGHT, RESIZE_HANDLES } from 'vars'

export default function createFrame(
  manager: ReturnType<typeof createFramesManager>,
  data: FrameData
) {
  const [x, y] = data.location
  const [width, height] = data.dimensions

  const el = document.createElement('div')
  el.className = `managed-frame`

  el.style.position = 'absolute'
  el.style.display = 'flex'
  el.style.flexWrap = 'wrap'
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.style.width = `${width}px`
  el.style.height = `${height}px`

  let openHeight = el.style.height
  let isOpen = true

  const getIsOpen = () => isOpen

  const open = () => {
    el.style.height = openHeight
    isOpen = true
  }

  const close = () => {
    openHeight = el.style.height
    el.style.height = `${CLOSED_FRAME_HEIGHT}px`
    isOpen = false
  }

  const remove = () => manager.remove(data.id)

  const setLocation = (x: number, y: number) => {
    setX(x)
    setY(y)
  }

  const setX = (x: number) => {
    data.location[0] = x
    el.style.left = x + 'px'
  }

  const setY = (y: number) => {
    data.location[1] = y
    el.style.top = y + 'px'
  }

  const setDimensions = (width: number, height: number) => {
    setWidth(width)
    setHeight(height)
  }

  const setHeight = (height: number) => {
    openHeight = height + 'px'
    data.dimensions[1] = height
    if (isOpen) {
      el.style.height = openHeight
    }
  }

  const setWidth = (width: number) => {
    data.dimensions[0] = width
    el.style.width = width + 'px'
  }

  const childrenWrapper = createFrameChildrenWrapper()
  childrenWrapper.append(data.children)

  const resizeHandles = RESIZE_HANDLES.reduce(
    (map, handle) => ({
      ...map,
      [handle]: createResizeHandle(
        { root: manager.el, data, setWidth, setHeight, setX, setY, getIsOpen },
        handle
      ),
    }),
    {} as { [K in ResizeHandleKind]: ReturnType<typeof createResizeHandle> }
  )
  const [dragHandle, teardownDragHandle] = createDragHandle({
    setLocation,
    data,
    close,
    open,
    getIsOpen,
    remove,
    el,
  })

  const contentWrapper = createContentWrapper()
  contentWrapper.append(dragHandle, childrenWrapper)

  el.append(
    resizeHandles['top-left'][0],
    resizeHandles['top'][0],
    resizeHandles['top-right'][0],
    resizeHandles['left'][0],
    contentWrapper,
    resizeHandles['right'][0],
    resizeHandles['bottom-left'][0],
    resizeHandles['bottom'][0],
    resizeHandles['bottom-right'][0]
  )

  const pointerdown = (e: PointerEvent) => {
    e.preventDefault()
    el.style.zIndex = performance.now() + ''
  }
  el.addEventListener('pointerdown', pointerdown)

  const teardown = () => {
    el.removeEventListener('pointerdown', pointerdown)
    teardownDragHandle()
    for (let h in resizeHandles) {
      resizeHandles[h][1]()
    }
  }

  return {
    el,
    teardown,
    setDimensions,
    setWidth,
    setHeight,
    setLocation,
    setX,
    setY,
    getIsOpen,
    open,
    close,
    remove,
    data,
  }
}

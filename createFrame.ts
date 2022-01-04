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

  const frameEl = document.createElement('div')
  frameEl.className = `dom-windows--frame`

  frameEl.style.position = 'absolute'
  frameEl.style.display = 'flex'
  frameEl.style.flexWrap = 'wrap'
  frameEl.style.left = `${x}px`
  frameEl.style.top = `${y}px`
  frameEl.style.width = `${width}px`
  frameEl.style.height = `${height}px`

  const childrenWrapper = createFrameChildrenWrapper()
  childrenWrapper.append(data.children)

  let openHeight = frameEl.style.height
  let isOpen = true

  const getIsOpen = () => isOpen

  const open = () => {
    frameEl.style.height = openHeight
    updateAttr('open', true)
    isOpen = true
  }

  const close = () => {
    openHeight = frameEl.style.height
    frameEl.style.height = `${CLOSED_FRAME_HEIGHT}px`
    updateAttr('open', false)
    isOpen = false
  }

  const updateAttr = (
    attr: 'dragging' | 'resizing' | 'open',
    value: boolean
  ) => {
    const nodes = Array.from(
      frameEl.querySelectorAll('[class^=dom-windows]')
    ).concat(frameEl)
    nodes.forEach(node => {
      node.setAttribute(`data-${attr}`, value + '')
    })
  }
  updateAttr('dragging', false)
  updateAttr('resizing', false)
  updateAttr('open', true)

  const remove = () => manager.remove(data.id)

  const setLocation = (x: number, y: number) => {
    setX(x)
    setY(y)
  }

  const setX = (x: number) => {
    data.location[0] = x
    frameEl.style.left = x + 'px'
  }

  const setY = (y: number) => {
    data.location[1] = y
    frameEl.style.top = y + 'px'
  }

  const setDimensions = (width: number, height: number) => {
    setWidth(width)
    setHeight(height)
  }

  const setHeight = (height: number) => {
    openHeight = height + 'px'
    data.dimensions[1] = height
    if (isOpen) {
      frameEl.style.height = openHeight
    }
  }

  const setWidth = (width: number) => {
    data.dimensions[0] = width
    frameEl.style.width = width + 'px'
  }

  const resizeHandles = RESIZE_HANDLES.reduce(
    (map, handle) => ({
      ...map,
      [handle]: createResizeHandle(
        {
          root: manager.el,
          data,
          setWidth,
          setHeight,
          setX,
          setY,
          getIsOpen,
          updateAttr,
        },
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
    el: frameEl,
    updateAttr,
  })

  const contentWrapper = createContentWrapper()
  contentWrapper.append(dragHandle, childrenWrapper)

  frameEl.append(
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
    frameEl.style.zIndex = performance.now() + ''
  }
  frameEl.addEventListener('pointerdown', pointerdown)

  const teardown = () => {
    frameEl.removeEventListener('pointerdown', pointerdown)
    teardownDragHandle()
    for (let h in resizeHandles) {
      resizeHandles[h][1]()
    }
  }

  return {
    el: frameEl,
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
    updateAttr,
    data,
  }
}

import El from './El'

export default class PanHandle extends El {
  constructor(
    tag: string,
    {
      onStart = () => {},
      onMove,
      onEnd = () => {},
    }: {
      onStart?(e: PointerEvent): void
      onMove(delta: [x: number, y: number]): void
      onEnd?(e: PointerEvent): void
    }
  ) {
    super(tag)

    function pointerdown(e: PointerEvent) {
      e.preventDefault()
      onStart(e)

      const panStart = [e.screenX, e.screenY] as [number, number]

      const pointermove = e => {
        e.preventDefault()

        onMove([e.screenX - panStart[0], e.screenY - panStart[1]])
      }

      const pointerup = e => {
        e.preventDefault()
        onEnd(e)

        window.removeEventListener('pointermove', pointermove)
        window.removeEventListener('pointerup', pointerup)
      }

      window.addEventListener('pointermove', pointermove)
      window.addEventListener('pointerup', pointerup)
    }
    this.on('pointerdown', pointerdown)
  }
}

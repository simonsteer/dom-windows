export default class El {
  el: HTMLElement
  constructor(tag: string) {
    this.el = document.createElement(tag)
  }

  on = <K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) => {
    this.el.addEventListener(type, listener, options)
    const teardown = () => {
      this.el.removeEventListener(type, listener)
    }
    this.teardownFns.push(teardown)
    return this
  }

  teardownFns: Function[] = []
  teardown = () => {
    this.teardownFns.forEach(fn => fn())
    this.teardownFns = []
    this._children.forEach(child => {
      if (child instanceof El) child.teardown()
    })
    return this
  }

  attrs = (...attrs: [attr: string, val: string][]) => {
    attrs.forEach(([attribute, value]) => {
      this.el.setAttribute(attribute, value)
    })
    return this
  }

  styles = (...styles: [prop: string, val: string][]) => {
    styles.forEach(([property, value]) => {
      this.el.style[property] = value
    })
    return this
  }

  private _children: (Text | El)[] = []

  replaceChildren = (...children: (Text | El)[]) => {
    this._children.forEach(child => {
      if (child instanceof El && !children.includes(child)) {
        child.teardown()
      }
    })
    this._children = children
    this.el.replaceChildren(
      ...this._children.map(c => (c instanceof El ? c.el : c))
    )
    return this
  }

  replaceChild = (oldChild: El | Text, newChild: El | Text) => {
    const index = this._children.indexOf(oldChild)
    if (index === -1) return this

    this._children.splice(index, 1, newChild)
    if (oldChild instanceof El) {
      oldChild.teardown()
    }

    const oldNode = oldChild instanceof El ? oldChild.el : oldChild
    const newNode = newChild instanceof El ? newChild.el : newChild

    this.el.replaceChild(oldNode, newNode)

    return this
  }

  removeChild = (child: El | Text) => {
    const index = this._children.indexOf(child)
    if (index === -1) return this

    this._children.splice(index, 1)

    if (child instanceof El) {
      child.teardown()
      this.el.removeChild(child.el)
    } else {
      this.el.removeChild(child)
    }

    return this
  }

  addChildren = (...children: (Text | El)[]) => {
    this._children.push(...children)
    this.el.append(...this._children.map(c => (c instanceof El ? c.el : c)))
    return this
  }

  removeChildren = (...children: (Text | El)[]) => {
    this.replaceChildren(
      ...this._children.filter(child => !children.includes(child))
    )
    return this
  }
}

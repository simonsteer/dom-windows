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
    this.children.forEach(child => {
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

  children: (Node | El)[] = []

  replaceChildren = (...children: (Node | El)[]) => {
    this.children.forEach(child => {
      if (child instanceof El && !children.includes(child)) {
        child.teardown()
      }
    })
    this.children = children
    this.el.replaceChildren(
      ...this.children.map(c => (c instanceof El ? c.el : c))
    )
    return this
  }

  replaceChild = (oldChild: El | Node, newChild: El | Node) => {
    const index = this.children.indexOf(oldChild)
    if (index === -1) return this

    this.children.splice(index, 1, newChild)
    if (oldChild instanceof El) {
      oldChild.teardown()
    }

    const oldNode = oldChild instanceof El ? oldChild.el : oldChild
    const newNode = newChild instanceof El ? newChild.el : newChild

    this.el.replaceChild(oldNode, newNode)

    return this
  }

  removeChild = (child: El | Node) => {
    const index = this.children.indexOf(child)
    if (index === -1) return this

    this.children.splice(index, 1)

    if (child instanceof El) {
      child.teardown()
      this.el.removeChild(child.el)
    } else {
      this.el.removeChild(child)
    }

    return this
  }

  addChildren = (...children: (Node | El)[]) => {
    this.children.push(...children)
    this.el.append(...this.children.map(c => (c instanceof El ? c.el : c)))
    return this
  }

  removeChildren = (...children: (Node | El)[]) => {
    this.replaceChildren(
      ...this.children.filter(child => !children.includes(child))
    )
    return this
  }
}

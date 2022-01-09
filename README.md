# dom-windows
DOM-manipulation library for creating draggable/resizable/collapsible "windows" inside of a parent container element

## Inspiration

I've been seeing a lot of web applications that aim to be editors/GUIs instead of "traditional" websites. A lot of these websites mimic the interfaces and interactions of popular graphics-editing software, where you have many small windowed modules that can be dragged around, customized, minimized, etc.

The goal of this library is to offer a high-level javascript API for creating and manipulating these "windowed" modules, with minimal styling out of the box and plenty of customization options.

## Usage
The library's main export is a class called `DOMWindows`. This class is responsible for creating the parent container element which houses all of the windows, and for establishing default values (such as width/height, position, etc.) for the windows that get created inside of it.
```ts
// you can init the class with nothing, or override some of the default values that the windows use on creation.
const domWindows = new DOMWindows({
  dimensions: [200, 300],
  location: [150, 75],
})

// insert the parent element wherever you like
document.body.append(domWindows.el)
```
Once the parent element exists in the DOM tree, you can start adding windows to it by calling the `add` method on the `DOMWindows` class instance, which will return a `DOMWindow` class instance, which controls the window itself. You can also override the defaults that the `DOMWindows` class was initialized with when creating a new window.
```ts
const myWindow = domWindows.add({
  // id, title, and children are required properties
  id: 'my-window',
  title: 'This is my window',
  children: new Text('Goodnight moon'),
  // optionally override default window dimensions and location
  dimensions: [400, 135],
  location: [25, 200],
})
```
The value returned from `DOMWindows.add` is a class instance which controls the window that was just created. You can use this class to make imperative changes to the window's position, size, whether it's expanded or collapsed, etc.
```
myWindow.setLocation(69, 420)
myWindow.setDimensions(400, 200)
myWindow.collapse()
```

Removing a window is as simple as calling the `remove` method on the instance. You can also remove a `DOMWindow` by passing the instance or its id to the `DOMWindows.remove` method.
```ts
// remove a window by calling remove() from DOMWindow
myWindow.remove()

// remove a window by passing the instance to DOMWindows.remove()
domWindows.remove(myWindow)

// remove a window by passing its id to DOMWindows.remove()
domWindows.remove(myWindow.id)
```
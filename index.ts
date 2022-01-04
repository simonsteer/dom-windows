import Frames from 'lib'

const frames = new Frames()

document.body.append(frames.el)

const testChildren = document.createElement('p')
testChildren.style.padding = '5px'
testChildren.style.margin = '0px'
testChildren.append(
  'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates minus deleniti saepe, amet, exercitationem libero, numquam dignissimos odio earum expedita ipsa fugit neque doloribus enim! Sed esse reiciendis ut voluptatem necessitatibus corporis dicta voluptatibus voluptate commodi enim fugiat, delectus quia architecto possimus.'
)

frames.add({
  id: 'bar',
  title: 'Dolor Sit',
  children: testChildren,
  dimensions: [600, 400],
  location: [175, 85],
  sizeLocks: { x: [null, null], y: [null, null] },
})

frames.add({
  id: 'foo',
  title: 'Lorem Ipsum',
  children: testChildren.cloneNode(true),
  dimensions: [300, 400],
  location: [605, 275],
  sizeLocks: { x: [null, null], y: [null, null] },
})

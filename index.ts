import Frames from 'Frames'

const target = document.body

const frames = new Frames()

frames.render(target)

const testChildren = document.createElement('p')
testChildren.append('hi gay')

frames.add({
  id: 'test',
  title: 'test',
  children: testChildren,
  dimensions: [300, 400],
  location: [25, 25],
  sizeLocks: { x: [null, null], y: [null, null] },
})

import DOMWindows from 'lib'

const domWindows = new DOMWindows({
  dimensions: [400, 300],
  dragHandleHeight: 32,
  resizeHandleSize: 7,
})

document.body.append(domWindows.el)

domWindows.add({
  id: 'bar',
  title: 'Dolor Sit',
  children: new Text(
    'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates minus deleniti saepe, amet, exercitationem libero, numquam dignissimos odio earum expedita ipsa fugit neque doloribus enim! Sed esse reiciendis ut voluptatem necessitatibus corporis dicta voluptatibus voluptate commodi enim fugiat, delectus quia architecto possimus.'
  ),
  dimensions: [600, 400],
  location: [175, 85],
})

domWindows.add({
  id: 'foo',
  title: 'Lorem Ipsum',
  children: new Text(
    'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates minus deleniti saepe, amet, exercitationem libero, numquam dignissimos odio earum expedita ipsa fugit neque doloribus enim! Sed esse reiciendis ut voluptatem necessitatibus corporis dicta voluptatibus voluptate commodi enim fugiat, delectus quia architecto possimus.'
  ),
  location: [605, 275],
})

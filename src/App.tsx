import { Menu } from './Menu'
import type { MenuTree } from './types'

const menuTree: MenuTree = [
  {
    title: 'my profile',
    icon: '🥸',
    id: 'my-profile',
    children: [
      {
        title: 'Username',
        icon: '⚙️',
        id: 'username',
        children: [
          {
            title: 'Username child',
            id: 'username-child',
            icon: '⚙️',
          },    
        ]
      },
    ]
  },
  {
    title: 'Emanuel',
    icon: '🥸',
    id: 'emanuel',
    children: [
      {
        id: 'settings',
        title: 'settings',
        icon: '⚙️',
      },
      {
        title: 'wifi',
        id: 'wifi',
        children: [
        {
          title: 'flashlight',
          id: 'flashlight',
        }
      ]
    }]
  }
]

function App() {

  return (
    <>
      <h1>test</h1>
      <Menu menuTree={menuTree}></Menu>
    </>
  )
}

export default App

import { Menu } from './Menu'
import type { MenuTree } from './types'

const menuTree: MenuTree = [
  {
    title: 'my profile',
    icon: '🥸',
    id: 'my-profile',
    href: 'my-profile',
    children: [
      {
        title: 'Username',
        icon: '⚙️',
        id: 'username',
        href: 'my-profile/username',
        children: [
          {
            title: 'Username child',
            id: 'username-child',
            icon: '⚙️',
            href: 'my-profile/username/username-child',
          },    
          {
            title: 'Google',
            id: 'username-child',
            icon: '⚙️',
            href: 'https://google.com',
          },  
        ]
      },
    ]
  },
  {
    title: 'Emanuel',
    icon: '🥸',
    id: 'emanuel',
    href: 'emanuel',
    children: [
      {
        id: 'settings',
        title: 'settings',
        icon: '⚙️',
        href: 'emanuel/settings'
      },
      {
        title: 'wifi',
        id: 'wifi',
        href: 'emanuel/wifi/flashlight',
        children: [
        {
          title: 'flashlight',
          id: 'flashlight',
          href: 'emanuel/wifi/flashlight'
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

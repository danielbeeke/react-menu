import { MenuItem, MenuTree } from './types'
import './Menu.scss'
import { useRef, useState } from 'react'

function MenuList ({ menuTree, setActiveMenuItem }: { menuTree: MenuTree, setActiveMenuItem: (menuItem: string | null) => void }) {
  return (
    <ul>
      {menuTree.map(menuItem => (
        <li key={JSON.stringify(menuItem)}>
          <button onClick={() => {
            setActiveMenuItem(menuItem.id)
          }}>
            {menuItem.icon} {menuItem.title}
          </button>
        </li>
      ))}
    </ul>
  )
}

const flattenTree = (menuTree: MenuTree) => {
  const items: Array<{ menuItem: MenuItem, parentId: string | null }> = []

  const flattenLevel = (menuLevel: MenuTree, parentId : string | null) => {
    for (const menuItem of menuLevel) {
      items.push({
        menuItem,
        parentId: parentId
      })

      if (menuItem.children) flattenLevel(menuItem.children, menuItem.id)
    }  
  }

  flattenLevel(menuTree, null)

  return items
}

export function Menu ({ menuTree }: { menuTree: MenuTree }) {

  const indexedMenu = flattenTree(menuTree)

  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeMenuItemId, setActiveMenuItem] = useState<string | null>(null)
  const [direction, setDirection] = useState('')
  const slidingWindow = useRef<HTMLDivElement>(null)

  const menuItemClick = (nextActiveMenuItemId: string | null) => {
    slidingWindow.current?.addEventListener('transitionend', () => {
      setIsTransitioning(false)
    }, { once: true })

    setIsTransitioning(true)
    setActiveMenuItem(nextActiveMenuItemId)
    
    const firstMetaMenuItem = indexedMenu.find(metaMenuItem => metaMenuItem.menuItem.id === activeMenuItemId)
    const secondMetaMenuItem = indexedMenu.find(metaMenuItem => metaMenuItem.menuItem.id === nextActiveMenuItemId)
    const direction = firstMetaMenuItem?.parentId === secondMetaMenuItem?.menuItem.id ? 'left' : 'right'
    setDirection(direction)
  }

  const currentMenuTree: Array<MenuItem> = []
  const parentMenuTree: Array<MenuItem> = []
  const childMenuTree: Array<MenuItem> = []

  /**
   * Before the transition
   */
  if (isTransitioning) {
    childMenuTree.push(...indexedMenu.filter(metaMenuItem => metaMenuItem.parentId === activeMenuItemId).map(metaMenuItem => metaMenuItem.menuItem))
    const parentMetaMenuItem = indexedMenu.find(metaMenuItem => metaMenuItem.menuItem.id === activeMenuItemId)
    currentMenuTree.push(...indexedMenu.filter(metaMenuItem => metaMenuItem.parentId === parentMetaMenuItem?.parentId).map(metaMenuItem => metaMenuItem.menuItem))
  }

  /**
   * After the transition
   */
  else {
    currentMenuTree.push(...indexedMenu.filter(metaMenuItem => metaMenuItem.parentId === activeMenuItemId).map(metaMenuItem => metaMenuItem.menuItem))
    const parentMetaMenuItem = indexedMenu.find(metaMenuItem => metaMenuItem.menuItem.id === activeMenuItemId)
    parentMenuTree.push(...indexedMenu.filter(metaMenuItem => metaMenuItem.parentId === parentMetaMenuItem?.parentId).map(metaMenuItem => metaMenuItem.menuItem))
  }

  return (
    <div className={`nested-menu ${isTransitioning ? 'transitioning' : ''} ${direction ?? ''}`}>
      <div className='inner'>
        <div ref={slidingWindow} className='sliding-window'>
          <MenuList setActiveMenuItem={menuItemClick} menuTree={parentMenuTree} />
          <MenuList setActiveMenuItem={menuItemClick} menuTree={currentMenuTree} />
          <MenuList setActiveMenuItem={menuItemClick} menuTree={childMenuTree} />
        </div>
      </div>
    </div>
  )
}
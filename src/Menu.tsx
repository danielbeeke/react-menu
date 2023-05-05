import { MenuItem, MenuTree } from './types'
import './Menu.scss'
import { useRef, useState } from 'react'

const ROOT = '__ROOT__'

type MenuListProps = { 
  menuTree: MenuTree, 
  setActiveMenuItem: (menuItem: string | null, direction: 'forward' | 'backward', callback?: () => void) => void, 
  indexedMenu: Array<MenuItem>
}

function MenuList ({ menuTree, setActiveMenuItem, indexedMenu }: MenuListProps) {
  const parentId = menuTree[0]?.parentId
  const grandParentId = parentId ? indexedMenu.find(menuItem => menuItem.id === parentId)?.parentId : null

  return (
    <ul className='list-group'>
      {grandParentId && parentId && parentId !== ROOT ? (
        <li className='list-group-item'><button onClick={() => {
          setActiveMenuItem(grandParentId, 'backward')
        }}>Back</button></li>        
      ) : null}
      {menuTree.map(menuItem => (
        <li className='list-group-item' key={JSON.stringify(menuItem)}>

          <button onClick={() => {
              setActiveMenuItem(menuItem.id, 'forward', () => {
                location = menuItem.href
              })
          }}>
            {menuItem.icon} {menuItem.title}
          </button>

          {menuItem.children?.length ? (
            <button onClick={() => {
              setActiveMenuItem(menuItem.id, 'forward')
            }}>
              ►
            </button>            
          ) : null}
        </li>
      ))}
    </ul>
  )
}

const flattenTree = (menuTree: MenuTree) => {
  const items: Array<MenuItem> = []

  const flattenLevel = (menuLevel: MenuTree, parentId : string | null) => {
    for (const menuItem of menuLevel) {
      items.push({ ...menuItem, parentId })
      if (menuItem.children) flattenLevel(menuItem.children, menuItem.id)
    }  
  }

  flattenLevel(menuTree, ROOT)

  return items
}

export function Menu ({ menuTree }: { menuTree: MenuTree }) {
  const indexedMenu = flattenTree(menuTree)
  const [isAnimating, setIsAnimating] = useState(false)

  const path = location.pathname.substring(1)
  const defaultActiveMenuItemId = path && indexedMenu.find(menuItem => menuItem.href === path) ? path : ROOT

  const [activeMenuItemId, setActiveMenuItem] = useState<string | null>(defaultActiveMenuItemId)
  const [previousMenuItemId, setPreviousMenuItem] = useState<string | null>(ROOT)
  const [direction, setDirection] = useState('')
  const slidingWindow = useRef<HTMLDivElement>(null)

  const menuItemClick = (nextActiveMenuItemId: string | null, direction: 'forward' | 'backward', callback?: () => void) => {
    if (isAnimating) return

    slidingWindow.current?.addEventListener('animationend', () => {
      setIsAnimating(false)
      if (callback) callback()
    }, { once: true })

    setIsAnimating(true)
    setPreviousMenuItem(activeMenuItemId)
    setActiveMenuItem(nextActiveMenuItemId)
    
    setDirection(direction)
  }

  const currentMenuTree: Array<MenuItem> = []
  const parentMenuTree: Array<MenuItem> = []
  const childMenuTree: Array<MenuItem> = []

  const activeColumnItems = indexedMenu.filter(menuItem => menuItem?.parentId === activeMenuItemId)
  const parentMenuItem = indexedMenu.find(menuItem => menuItem.id === activeMenuItemId)
  const activeChildColumnItems = indexedMenu.filter(menuItem => menuItem?.parentId === parentMenuItem?.parentId)

  if (!isAnimating) {
    currentMenuTree.push(...activeColumnItems)
    parentMenuTree.push(...activeChildColumnItems)
  }
  else if (isAnimating && direction === 'forward') {
    childMenuTree.push(...activeColumnItems)
    currentMenuTree.push(...activeChildColumnItems)
  }
  else if (isAnimating && direction === 'backward') {
    parentMenuTree.push(...activeColumnItems)
    currentMenuTree.push(...indexedMenu.filter(menuItem => menuItem.parentId === previousMenuItemId))
  }

  return (
    <div className={`nested-menu ${isAnimating ? 'animating' : ''} ${direction ?? ''}`}>
      <div className='inner'>
        <div ref={slidingWindow} className='sliding-window'>
          <MenuList setActiveMenuItem={menuItemClick} menuTree={parentMenuTree} indexedMenu={indexedMenu} />
          <MenuList setActiveMenuItem={menuItemClick} menuTree={currentMenuTree} indexedMenu={indexedMenu} />
          <MenuList setActiveMenuItem={menuItemClick} menuTree={childMenuTree} indexedMenu={indexedMenu} />
        </div>
      </div>
    </div>
  )
}
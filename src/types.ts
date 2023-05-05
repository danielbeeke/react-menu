export type MenuTree = Array<MenuItem>
export type MenuItem = {
  title: string,
  icon?: string,
  id: string,
  href: string,
  children?: Array<MenuItem>
  parentId?: string | null
}
export type MenuTree = Array<MenuItem>
export type MenuItem = {
  title: string,
  icon?: string,
  id: string,
  children?: Array<MenuItem>
}
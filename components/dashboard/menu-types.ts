export type MenuNode = {
  id: string
  name: string
  children?: MenuNode[]
}

export type NodeMeta = {
  id: string
  name: string
  depth: number
  parentId: string | null
}

export type MenuNode = {
  id: string
  name: string
  parentId?: string
  position?: number
  children?: MenuNode[]
}

export type NodeMeta = {
  id: string
  name: string
  depth: number
  parentId: string | null
}

import type { MenuNode } from "@/components/dashboard/menu-types"

export function cloneMenuTree(nodes: MenuNode[]): MenuNode[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? cloneMenuTree(node.children) : undefined,
  }))
}

export function findMenuNodeById(nodes: MenuNode[], id: string): MenuNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }

    if (node.children?.length) {
      const found = findMenuNodeById(node.children, id)
      if (found) {
        return found
      }
    }
  }

  return null
}

export function addMenuNode(
  nodes: MenuNode[],
  parentId: string | null,
  newNode: MenuNode
): MenuNode[] {
  if (!parentId) {
    return [...nodes, newNode]
  }

  return nodes.map((node) => {
    if (node.id === parentId) {
      const nextChildren = node.children ? [...node.children, newNode] : [newNode]
      return { ...node, children: nextChildren }
    }

    if (node.children?.length) {
      return {
        ...node,
        children: addMenuNode(node.children, parentId, newNode),
      }
    }

    return node
  })
}

export function updateMenuNodeName(
  nodes: MenuNode[],
  targetId: string,
  nextName: string
): MenuNode[] {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return { ...node, name: nextName }
    }

    if (node.children?.length) {
      return {
        ...node,
        children: updateMenuNodeName(node.children, targetId, nextName),
      }
    }

    return node
  })
}

export function deleteMenuNode(nodes: MenuNode[], targetId: string): MenuNode[] {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) => {
      if (node.children?.length) {
        return {
          ...node,
          children: deleteMenuNode(node.children, targetId),
        }
      }

      return node
    })
}

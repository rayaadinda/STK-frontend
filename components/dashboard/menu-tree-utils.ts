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

type NodePointer = {
  node: MenuNode
  siblings: MenuNode[]
  index: number
}

function findNodePointer(nodes: MenuNode[], targetId: string): NodePointer | null {
  const walk = (items: MenuNode[]): NodePointer | null => {
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index]

      if (item.id === targetId) {
        return {
          node: item,
          siblings: items,
          index,
        }
      }

      if (item.children?.length) {
        const found = walk(item.children)
        if (found) {
          return found
        }
      }
    }

    return null
  }

  return walk(nodes)
}

function containsNodeId(node: MenuNode, targetId: string): boolean {
  if (node.id === targetId) {
    return true
  }

  if (!node.children?.length) {
    return false
  }

  return node.children.some((child) => containsNodeId(child, targetId))
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function moveMenuNodeToParent(
  nodes: MenuNode[],
  menuId: string,
  targetParentId: string | null
): MenuNode[] {
  if (menuId === targetParentId) {
    return nodes
  }

  const nextTree = cloneMenuTree(nodes)
  const source = findNodePointer(nextTree, menuId)

  if (!source) {
    return nodes
  }

  let destinationSiblings: MenuNode[]

  if (!targetParentId) {
    destinationSiblings = nextTree
  } else {
    const destinationParent = findMenuNodeById(nextTree, targetParentId)

    if (!destinationParent) {
      return nodes
    }

    if (containsNodeId(source.node, targetParentId)) {
      return nodes
    }

    if (!destinationParent.children) {
      destinationParent.children = []
    }

    destinationSiblings = destinationParent.children
  }

  if (destinationSiblings === source.siblings && source.index === source.siblings.length - 1) {
    return nodes
  }

  source.siblings.splice(source.index, 1)
  destinationSiblings.push(source.node)

  return nextTree
}

export function reorderMenuNode(
  nodes: MenuNode[],
  menuId: string,
  targetParentId: string | null,
  targetPosition: number
): MenuNode[] {
  const nextTree = cloneMenuTree(nodes)
  const source = findNodePointer(nextTree, menuId)

  if (!source) {
    return nodes
  }

  let destinationSiblings: MenuNode[]

  if (!targetParentId) {
    destinationSiblings = nextTree
  } else {
    const destinationParent = findMenuNodeById(nextTree, targetParentId)

    if (!destinationParent) {
      return nodes
    }

    if (containsNodeId(source.node, targetParentId)) {
      return nodes
    }

    if (!destinationParent.children) {
      destinationParent.children = []
    }

    destinationSiblings = destinationParent.children
  }

  const sameSiblings = destinationSiblings === source.siblings
  source.siblings.splice(source.index, 1)

  const maxTargetIndex = destinationSiblings.length
  const normalizedTarget = clamp(targetPosition, 0, maxTargetIndex)
  const adjustedTarget = sameSiblings && source.index < normalizedTarget
    ? normalizedTarget - 1
    : normalizedTarget

  if (sameSiblings && adjustedTarget === source.index) {
    return nodes
  }

  destinationSiblings.splice(adjustedTarget, 0, source.node)
  return nextTree
}

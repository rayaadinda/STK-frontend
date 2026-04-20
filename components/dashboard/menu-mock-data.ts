import type { MenuNode, NodeMeta } from "@/components/dashboard/menu-types"

export const menuTree: MenuNode[] = [
  {
    id: "system-management-root",
    name: "system management",
    children: [
      {
        id: "system-management",
        name: "System Management",
        children: [
          {
            id: "systems",
            name: "Systems",
            children: [
              {
                id: "system-code",
                name: "System Code",
                children: [{ id: "code-registration", name: "Code Registration" }],
              },
              { id: "code-registration-2", name: "Code Registration - 2" },
              { id: "properties", name: "Properties" },
              {
                id: "menus",
                name: "Menus",
                children: [{ id: "menu-registration", name: "Menu Registration" }],
              },
              {
                id: "api-list",
                name: "API List",
                children: [
                  { id: "api-registration", name: "API Registration" },
                  { id: "api-edit", name: "API Edit" },
                ],
              },
            ],
          },
          {
            id: "users-groups",
            name: "Users & Groups",
            children: [
              {
                id: "users",
                name: "Users",
                children: [
                  { id: "user-account-registration", name: "User Account Registration" },
                ],
              },
              {
                id: "groups",
                name: "Groups",
                children: [{ id: "user-group-registration", name: "User Group Registration" }],
              },
              {
                id: "approval",
                name: "User Approval",
                children: [{ id: "approval-detail", name: "User Approval Detail" }],
              },
            ],
          },
        ],
      },
    ],
  },
]

export function collectNodeIds(nodes: MenuNode[]): string[] {
  const ids: string[] = []

  for (const node of nodes) {
    ids.push(node.id)
    if (node.children?.length) {
      ids.push(...collectNodeIds(node.children))
    }
  }

  return ids
}

export function buildNodeMeta(nodes: MenuNode[]): Map<string, NodeMeta> {
  const map = new Map<string, NodeMeta>()

  const walk = (items: MenuNode[], parentId: string | null, depth: number) => {
    for (const item of items) {
      map.set(item.id, {
        id: item.id,
        name: item.name,
        depth,
        parentId,
      })

      if (item.children?.length) {
        walk(item.children, item.id, depth + 1)
      }
    }
  }

  walk(nodes, null, 0)
  return map
}

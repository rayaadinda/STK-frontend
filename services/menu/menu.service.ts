import type { MenuNode } from "@/components/dashboard/menu-types"
import { apiRequest } from "@/services/http/api-client"

export type MenuItemDTO = {
  id: string
  name: string
  parentId?: string
  position: number
}

function mapNode(node: MenuNode): MenuNode {
  return {
    id: node.id,
    name: node.name,
    parentId: node.parentId,
    position: node.position,
    children: node.children?.map(mapNode),
  }
}

function withScope(path: string, scope: string): string {
  const params = new URLSearchParams({ scope })
  return `${path}?${params.toString()}`
}

export async function listMenus(scope: string): Promise<MenuNode[]> {
  const data = await apiRequest<MenuNode[]>(withScope("/api/menus", scope), { method: "GET" })
  return data.map(mapNode)
}

export async function createMenu(input: {
  scope: string
  name: string
  parentId: string | null
}): Promise<MenuItemDTO> {
  return apiRequest<MenuItemDTO>(withScope("/api/menus", input.scope), {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      parentId: input.parentId,
    }),
  })
}

export async function updateMenu(
  id: string,
  input: { scope: string; name: string }
): Promise<MenuItemDTO> {
  return apiRequest<MenuItemDTO>(withScope(`/api/menus/${id}`, input.scope), {
    method: "PUT",
    body: JSON.stringify({
      name: input.name,
    }),
  })
}

export async function deleteMenu(id: string, scope: string): Promise<{ id: string }> {
  return apiRequest<{ id: string }>(withScope(`/api/menus/${id}`, scope), {
    method: "DELETE",
  })
}

export async function moveMenu(
  id: string,
  input: {
    scope: string
    parentId: string | null
  }
): Promise<MenuItemDTO> {
  return apiRequest<MenuItemDTO>(withScope(`/api/menus/${id}/move`, input.scope), {
    method: "PATCH",
    body: JSON.stringify({
      parentId: input.parentId,
    }),
  })
}

export async function reorderMenu(
  id: string,
  input: {
    scope: string
    parentId: string | null
    position: number
  }
): Promise<MenuItemDTO> {
  return apiRequest<MenuItemDTO>(withScope(`/api/menus/${id}/reorder`, input.scope), {
    method: "PATCH",
    body: JSON.stringify({
      parentId: input.parentId,
      position: input.position,
    }),
  })
}

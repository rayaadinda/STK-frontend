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

export async function listMenus(): Promise<MenuNode[]> {
  const data = await apiRequest<MenuNode[]>("/api/menus", { method: "GET" })
  return data.map(mapNode)
}

export async function createMenu(input: {
  name: string
  parentId: string | null
}): Promise<MenuItemDTO> {
  return apiRequest<MenuItemDTO>("/api/menus", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      parentId: input.parentId,
    }),
  })
}

export async function updateMenu(id: string, input: { name: string }): Promise<MenuItemDTO> {
  return apiRequest<MenuItemDTO>(`/api/menus/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: input.name,
    }),
  })
}

export async function deleteMenu(id: string): Promise<{ id: string }> {
  return apiRequest<{ id: string }>(`/api/menus/${id}`, {
    method: "DELETE",
  })
}

export async function moveMenu(
  id: string,
  input: {
    parentId: string | null
  }
): Promise<MenuItemDTO> {
  return apiRequest<MenuItemDTO>(`/api/menus/${id}/move`, {
    method: "PATCH",
    body: JSON.stringify({
      parentId: input.parentId,
    }),
  })
}

export async function reorderMenu(
  id: string,
  input: {
    parentId: string | null
    position: number
  }
): Promise<MenuItemDTO> {
  return apiRequest<MenuItemDTO>(`/api/menus/${id}/reorder`, {
    method: "PATCH",
    body: JSON.stringify({
      parentId: input.parentId,
      position: input.position,
    }),
  })
}

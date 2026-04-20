export type MenuMoveRequest = {
  parentId: string | null
}

export type MenuReorderRequest = {
  parentId: string | null
  position: number
}

export type MenuMoveIntent = {
  menuId: string
  endpoint: string
  payload: MenuMoveRequest
}

export type MenuReorderIntent = {
  menuId: string
  endpoint: string
  payload: MenuReorderRequest
}

export function buildMenuMoveIntent(menuId: string, payload: MenuMoveRequest): MenuMoveIntent {
  return {
    menuId,
    endpoint: `/api/menus/${menuId}/move`,
    payload,
  }
}

export function buildMenuReorderIntent(
  menuId: string,
  payload: MenuReorderRequest
): MenuReorderIntent {
  return {
    menuId,
    endpoint: `/api/menus/${menuId}/reorder`,
    payload,
  }
}

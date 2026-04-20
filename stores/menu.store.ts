import { create } from "zustand"

import type { MenuNode } from "@/components/dashboard/menu-types"
import {
  createMenu,
  deleteMenu,
  listMenus,
  moveMenu,
  reorderMenu,
  updateMenu,
} from "@/services/menu/menu.service"

type MenuStoreState = {
  treeData: MenuNode[]
  activeScope: string | null
  isLoading: boolean
  isMutating: boolean
  errorMessage: string | null
  initialize: (scope: string) => Promise<void>
  refresh: (scope: string, options?: { showLoading?: boolean }) => Promise<void>
  clearError: () => void
  createMenuItem: (scope: string, input: { name: string; parentId: string | null }) => Promise<string | null>
  updateMenuItem: (scope: string, id: string, input: { name: string }) => Promise<string | null>
  deleteMenuItem: (scope: string, id: string) => Promise<string | null>
  moveMenuItem: (
    scope: string,
    id: string,
    input: { parentId: string | null }
  ) => Promise<string | null>
  reorderMenuItem: (
    scope: string,
    id: string,
    input: { parentId: string | null; position: number }
  ) => Promise<string | null>
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }
  return fallback
}

export const useMenuStore = create<MenuStoreState>((set, get) => ({
  treeData: [],
  activeScope: null,
  isLoading: true,
  isMutating: false,
  errorMessage: null,

  initialize: async (scope) => {
    set({ activeScope: scope })
    await get().refresh(scope, { showLoading: true })
  },

  refresh: async (scope, options) => {
    if (options?.showLoading) {
      set({ isLoading: true })
    }

    try {
      const menus = await listMenus(scope)
      set((state) =>
        state.activeScope === scope ? { treeData: menus, errorMessage: null } : state
      )
    } catch (error) {
      set((state) =>
        state.activeScope === scope
          ? { errorMessage: toErrorMessage(error, "Failed to load menus from backend.") }
          : state
      )
    } finally {
      if (options?.showLoading) {
        set({ isLoading: false })
      }
    }
  },

  clearError: () => {
    set({ errorMessage: null })
  },

  createMenuItem: async (scope, input) => {
    set({ isMutating: true })
    try {
      const created = await createMenu({ scope, ...input })
      await get().refresh(scope)
      return created.id
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to create menu.") })
      return null
    } finally {
      set({ isMutating: false })
    }
  },

  updateMenuItem: async (scope, id, input) => {
    set({ isMutating: true })
    try {
      const updated = await updateMenu(id, { scope, ...input })
      await get().refresh(scope)
      return updated.id
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to update menu.") })
      return null
    } finally {
      set({ isMutating: false })
    }
  },

  deleteMenuItem: async (scope, id) => {
    set({ isMutating: true })
    try {
      const deleted = await deleteMenu(id, scope)
      await get().refresh(scope)
      return deleted.id
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to delete menu.") })
      return null
    } finally {
      set({ isMutating: false })
    }
  },

  moveMenuItem: async (scope, id, input) => {
    set({ isMutating: true })
    try {
      const moved = await moveMenu(id, { scope, ...input })
      await get().refresh(scope)
      return moved.id
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to move menu.") })
      return null
    } finally {
      set({ isMutating: false })
    }
  },

  reorderMenuItem: async (scope, id, input) => {
    set({ isMutating: true })
    try {
      const reordered = await reorderMenu(id, { scope, ...input })
      await get().refresh(scope)
      return reordered.id
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to reorder menu.") })
      return null
    } finally {
      set({ isMutating: false })
    }
  },
}))

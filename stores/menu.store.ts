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
  isLoading: boolean
  isMutating: boolean
  errorMessage: string | null
  initialize: () => Promise<void>
  refresh: (options?: { showLoading?: boolean }) => Promise<void>
  clearError: () => void
  createMenuItem: (input: { name: string; parentId: string | null }) => Promise<string | null>
  updateMenuItem: (id: string, input: { name: string }) => Promise<string | null>
  deleteMenuItem: (id: string) => Promise<string | null>
  moveMenuItem: (id: string, input: { parentId: string | null }) => Promise<string | null>
  reorderMenuItem: (
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
  isLoading: true,
  isMutating: false,
  errorMessage: null,

  initialize: async () => {
    await get().refresh({ showLoading: true })
  },

  refresh: async (options) => {
    if (options?.showLoading) {
      set({ isLoading: true })
    }

    try {
      const menus = await listMenus()
      set({ treeData: menus, errorMessage: null })
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to load menus from backend.") })
    } finally {
      if (options?.showLoading) {
        set({ isLoading: false })
      }
    }
  },

  clearError: () => {
    set({ errorMessage: null })
  },

  createMenuItem: async (input) => {
    set({ isMutating: true })
    try {
      const created = await createMenu(input)
      await get().refresh()
      return created.id
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to create menu.") })
      return null
    } finally {
      set({ isMutating: false })
    }
  },

  updateMenuItem: async (id, input) => {
    set({ isMutating: true })
    try {
      const updated = await updateMenu(id, input)
      await get().refresh()
      return updated.id
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to update menu.") })
      return null
    } finally {
      set({ isMutating: false })
    }
  },

  deleteMenuItem: async (id) => {
    set({ isMutating: true })
    try {
      const deleted = await deleteMenu(id)
      await get().refresh()
      return deleted.id
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to delete menu.") })
      return null
    } finally {
      set({ isMutating: false })
    }
  },

  moveMenuItem: async (id, input) => {
    set({ isMutating: true })
    try {
      const moved = await moveMenu(id, input)
      await get().refresh()
      return moved.id
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to move menu.") })
      return null
    } finally {
      set({ isMutating: false })
    }
  },

  reorderMenuItem: async (id, input) => {
    set({ isMutating: true })
    try {
      const reordered = await reorderMenu(id, input)
      await get().refresh()
      return reordered.id
    } catch (error) {
      set({ errorMessage: toErrorMessage(error, "Failed to reorder menu.") })
      return null
    } finally {
      set({ isMutating: false })
    }
  },
}))

"use client"

import { useEffect, useMemo, useState } from "react"
import { Folder, LayoutGrid } from "lucide-react"
import { toast } from "sonner"

import { buildNodeMeta, collectNodeIds } from "@/components/dashboard/menu-mock-data"
import { MenuCrudDialog, type CrudDialogMode } from "@/components/dashboard/menu-crud-dialog"
import { MenuDetailsPanel } from "@/components/dashboard/menu-details-panel"
import { MenuTree } from "@/components/dashboard/menu-tree"
import { findMenuNodeById } from "@/components/dashboard/menu-tree-utils"
import type { MenuNode } from "@/components/dashboard/menu-types"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMenuStore } from "@/stores/menu.store"

const ALL_ROOT_MENUS_VALUE = "__all__"

type MenuDashboardPageProps = {
  title: string
  scopeKey: string
}

function findFirstNodeId(nodes: MenuNode[]): string {
  if (!nodes.length) {
    return ""
  }

  return nodes[0].id
}

export function MenuDashboardPage({ title, scopeKey }: MenuDashboardPageProps) {
  const treeData = useMenuStore((state) => state.treeData)
  const isLoading = useMenuStore((state) => state.isLoading)
  const isMutating = useMenuStore((state) => state.isMutating)
  const errorMessage = useMenuStore((state) => state.errorMessage)

  const initialize = useMenuStore((state) => state.initialize)
  const clearError = useMenuStore((state) => state.clearError)
  const createMenuItem = useMenuStore((state) => state.createMenuItem)
  const updateMenuItem = useMenuStore((state) => state.updateMenuItem)
  const deleteMenuItem = useMenuStore((state) => state.deleteMenuItem)
  const moveMenuItem = useMenuStore((state) => state.moveMenuItem)
  const reorderMenuItem = useMenuStore((state) => state.reorderMenuItem)

  const [selectedRootMenu, setSelectedRootMenu] = useState(ALL_ROOT_MENUS_VALUE)
  const [selectedNodeId, setSelectedNodeId] = useState("")
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set())
  const [crudDialogOpen, setCrudDialogOpen] = useState(false)
  const [crudMode, setCrudMode] = useState<CrudDialogMode>("add-root")
  const [crudTargetNodeId, setCrudTargetNodeId] = useState<string | null>(null)
  const [crudName, setCrudName] = useState("")
  const [crudParentId, setCrudParentId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTargetNodeId, setDeleteTargetNodeId] = useState<string | null>(null)
  const [crudSubmitting, setCrudSubmitting] = useState(false)

  useEffect(() => {
    void initialize(scopeKey)
  }, [initialize, scopeKey])

  const allNodeIds = useMemo(() => collectNodeIds(treeData), [treeData])

  const effectiveExpandedNodeIds = useMemo(() => {
    if (expandedNodeIds.size === 0) {
      return new Set(allNodeIds)
    }

    return new Set(Array.from(expandedNodeIds).filter((id) => allNodeIds.includes(id)))
  }, [allNodeIds, expandedNodeIds])

  const rootMenuOptions = useMemo(
    () => treeData.map((rootNode) => ({ id: rootNode.id, name: rootNode.name })),
    [treeData]
  )

  const effectiveSelectedRootMenu = useMemo(() => {
    if (selectedRootMenu === ALL_ROOT_MENUS_VALUE) {
      return ALL_ROOT_MENUS_VALUE
    }

    const rootStillExists = rootMenuOptions.some((rootNode) => rootNode.id === selectedRootMenu)
    return rootStillExists ? selectedRootMenu : ALL_ROOT_MENUS_VALUE
  }, [rootMenuOptions, selectedRootMenu])

  const visibleTreeData = useMemo(() => {
    if (effectiveSelectedRootMenu === ALL_ROOT_MENUS_VALUE) {
      return treeData
    }

    return treeData.filter((rootNode) => rootNode.id === effectiveSelectedRootMenu)
  }, [effectiveSelectedRootMenu, treeData])

  const nodeMetaMap = useMemo(() => buildNodeMeta(visibleTreeData), [visibleTreeData])
  const effectiveSelectedNodeId = useMemo(() => {
    const visibleNodeIds = new Set(collectNodeIds(visibleTreeData))

    if (!selectedNodeId || !visibleNodeIds.has(selectedNodeId)) {
      return findFirstNodeId(visibleTreeData)
    }

    return selectedNodeId
  }, [selectedNodeId, visibleTreeData])

  const selectedNodeMeta = nodeMetaMap.get(effectiveSelectedNodeId)

  const selectedParentName = selectedNodeMeta?.parentId
    ? nodeMetaMap.get(selectedNodeMeta.parentId)?.name ?? "-"
    : "-"

  const parentOptions = useMemo(() => {
    return Array.from(nodeMetaMap.values())
      .filter((item) => item.id !== crudTargetNodeId)
      .map((item) => ({ id: item.id, name: item.name }))
  }, [nodeMetaMap, crudTargetNodeId])

  const crudParentDisplayName = crudParentId
    ? nodeMetaMap.get(crudParentId)?.name ?? "-"
    : "-"

  const deleteTargetName = deleteTargetNodeId
    ? findMenuNodeById(treeData, deleteTargetNodeId)?.name ?? "this menu"
    : "this menu"

  const expandAll = () => {
    setExpandedNodeIds(new Set(collectNodeIds(visibleTreeData)))
  }

  const collapseAll = () => {
    setExpandedNodeIds(new Set(visibleTreeData.map((rootNode) => rootNode.id)))
  }

  const toggleNode = (id: string) => {
    setExpandedNodeIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const openAddRootDialog = () => {
    setCrudMode("add-root")
    setCrudTargetNodeId(null)
    setCrudName("")
    setCrudParentId(null)
    setCrudDialogOpen(true)
  }

  const openAddChildDialog = (nodeId: string) => {
    setCrudMode("add-child")
    setCrudTargetNodeId(nodeId)
    setCrudName("")
    setCrudParentId(nodeId)
    setCrudDialogOpen(true)
  }

  const openEditDialog = (nodeId: string) => {
    const target = findMenuNodeById(treeData, nodeId)
    if (!target) {
      return
    }

    setCrudMode("edit")
    setCrudTargetNodeId(nodeId)
    setCrudName(target.name)
    setCrudParentId(nodeMetaMap.get(nodeId)?.parentId ?? null)
    setCrudDialogOpen(true)
  }

  const openDeleteDialog = (nodeId: string) => {
    setDeleteTargetNodeId(nodeId)
    setDeleteDialogOpen(true)
  }

  const handleSaveCrud = () => {
    const nextName = crudName.trim()

    if (!nextName) {
      return
    }

    const run = async () => {
      try {
        setCrudSubmitting(true)
        if (crudMode === "edit" && crudTargetNodeId) {
          const updatedId = await updateMenuItem(scopeKey, crudTargetNodeId, { name: nextName })
          if (updatedId) {
            toast.success("Menu updated successfully")
            setSelectedNodeId(updatedId)
            setCrudDialogOpen(false)
          }
          return
        }

        const parentId = crudMode === "add-child" ? crudTargetNodeId : crudParentId
        const createdId = await createMenuItem(scopeKey, {
          name: nextName,
          parentId,
        })

        if (parentId) {
          setExpandedNodeIds((previous) => {
            const next = new Set(previous)
            next.add(parentId)
            return next
          })
        }

        if (createdId) {
          toast.success("Menu created successfully")
          setSelectedNodeId(createdId)
          setCrudDialogOpen(false)
        }
      } catch {
        toast.error("Something went wrong. Please try again.")
      } finally {
        setCrudSubmitting(false)
      }
    }

    void run()
  }

  const handleConfirmDelete = () => {
    if (!deleteTargetNodeId) {
      return
    }

    const targetId = deleteTargetNodeId

    const run = async () => {
      const deletedId = await deleteMenuItem(scopeKey, targetId)
      if (deletedId && deletedId === effectiveSelectedNodeId) {
        setSelectedNodeId("")
      }

      if (deletedId) {
        setDeleteDialogOpen(false)
      }
    }

    void run()
  }

  const handleMoveNode = (menuId: string, targetParentId: string | null) => {
    const run = async () => {
      const movedId = await moveMenuItem(scopeKey, menuId, { parentId: targetParentId })

      if (targetParentId) {
        setExpandedNodeIds((previous) => {
          const next = new Set(previous)
          next.add(targetParentId)
          return next
        })
      }

      if (movedId) {
        setSelectedNodeId(movedId)
      }
    }

    void run()
  }

  const handleReorderNode = (menuId: string, targetParentId: string | null, targetPosition: number) => {
    const run = async () => {
      const reorderedId = await reorderMenuItem(scopeKey, menuId, {
        parentId: targetParentId,
        position: targetPosition,
      })

      if (reorderedId) {
        setSelectedNodeId(reorderedId)
      }
    }

    void run()
  }

  return (
    <DashboardShell>
      <div className="w-full max-w-none">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 sm:mb-6">
          <Folder size={16} className="text-slate-400" />
          <span>/</span>
          <span className="text-slate-700">{title}</span>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0f57b8] text-white">
            <LayoutGrid size={17} />
          </span>
          <h1 className="break-words text-4xl font-semibold leading-none tracking-[-0.02em] text-[#1e293b] sm:text-[42px]">
            {title}
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          <section className="min-w-0">
            <div className="mb-6 w-full max-w-full sm:max-w-[26rem]">
              <Label htmlFor="menu-selector" className="mb-2.5 block text-sm font-medium text-slate-500">
                Menu
              </Label>

              <Select value={effectiveSelectedRootMenu} onValueChange={setSelectedRootMenu}>
                <SelectTrigger
                  id="menu-selector"
                  className="w-full rounded-xl border-transparent bg-[#e9edf2] px-4 font-medium text-[#1f2937] shadow-none"
                >
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_ROOT_MENUS_VALUE}>All</SelectItem>
                  {rootMenuOptions.map((rootNode) => (
                    <SelectItem key={rootNode.id} value={rootNode.id}>
                      {rootNode.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={openAddRootDialog}
                disabled={isMutating || isLoading}
                className="h-11 w-full rounded-full border-[#b7c2d1] bg-white px-6 text-sm font-semibold text-[#0f57b8] hover:bg-blue-50 sm:w-auto sm:min-w-32"
              >
                Add Root
              </Button>
              <Button
                type="button"
                onClick={expandAll}
                disabled={isMutating || isLoading}
                className="h-11 w-full rounded-full bg-[#1d2d45] px-6 text-sm font-semibold text-white hover:bg-[#162338] sm:w-auto sm:min-w-32"
              >
                Expand All
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={collapseAll}
                disabled={isMutating || isLoading}
                className="h-11 w-full rounded-full border-[#b7c2d1] bg-white px-6 text-sm font-semibold text-[#667085] hover:bg-slate-50 sm:w-auto sm:min-w-32"
              >
                Collapse All
              </Button>
            </div>

            {errorMessage ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span>{errorMessage}</span>
                  <Button type="button" variant="outline" size="xs" onClick={clearError}>
                    Dismiss
                  </Button>
                </div>
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                Loading {title.toLowerCase()} from backend...
              </div>
            ) : (
              <MenuTree
                nodes={visibleTreeData}
                selectedNodeId={effectiveSelectedNodeId}
                expandedNodeIds={effectiveExpandedNodeIds}
                onSelectNode={setSelectedNodeId}
                onToggleNode={toggleNode}
                onAddChild={openAddChildDialog}
                onEditNode={openEditDialog}
                onDeleteNode={openDeleteDialog}
                onMoveNode={handleMoveNode}
                onReorderNode={handleReorderNode}
              />
            )}
          </section>

          <MenuDetailsPanel
            id={selectedNodeMeta?.id ?? "-"}
            depth={selectedNodeMeta?.depth ?? 0}
            parentName={selectedParentName}
            name={selectedNodeMeta?.name ?? "-"}
          />
        </div>
      </div>

      <MenuCrudDialog
        mode={crudMode}
        open={crudDialogOpen}
        onOpenChange={setCrudDialogOpen}
        name={crudName}
        onNameChange={setCrudName}
        parentId={crudParentId}
        onParentIdChange={setCrudParentId}
        parentOptions={parentOptions}
        parentDisplayName={crudParentDisplayName}
        isSubmitting={crudSubmitting}
        onSubmit={handleSaveCrud}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu</AlertDialogTitle>
            <AlertDialogDescription>
              Delete &quot;{deleteTargetName}&quot; and all of its children from current module tree?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}

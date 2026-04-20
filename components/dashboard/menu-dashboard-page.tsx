"use client"

import { useMemo, useState } from "react"
import { Folder } from "lucide-react"
import Image from "next/image"

import {
  buildNodeMeta,
  collectNodeIds,
  menuTree,
} from "@/components/dashboard/menu-mock-data"
import { MenuCrudDialog, type CrudDialogMode } from "@/components/dashboard/menu-crud-dialog"
import { MenuDetailsPanel } from "@/components/dashboard/menu-details-panel"
import { MenuTree } from "@/components/dashboard/menu-tree"
import {
  addMenuNode,
  cloneMenuTree,
  deleteMenuNode,
  findMenuNodeById,
  updateMenuNodeName,
} from "@/components/dashboard/menu-tree-utils"
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

function generateMenuId(seed: string): string {
  const slug = seed
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const fallback = "menu"
  const unique = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
  return `${slug || fallback}-${unique}`
}

function findFirstNodeId(nodes: typeof menuTree): string {
  if (!nodes.length) {
    return ""
  }

  return nodes[0].id
}

export function MenuDashboardPage() {
  const [selectedRootMenu, setSelectedRootMenu] = useState("system management")
  const [treeData, setTreeData] = useState(() => cloneMenuTree(menuTree))
  const [selectedNodeId, setSelectedNodeId] = useState("system-code")
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    () => new Set(collectNodeIds(menuTree))
  )
  const [crudDialogOpen, setCrudDialogOpen] = useState(false)
  const [crudMode, setCrudMode] = useState<CrudDialogMode>("add-root")
  const [crudTargetNodeId, setCrudTargetNodeId] = useState<string | null>(null)
  const [crudName, setCrudName] = useState("")
  const [crudParentId, setCrudParentId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTargetNodeId, setDeleteTargetNodeId] = useState<string | null>(null)

  const nodeMetaMap = useMemo(() => buildNodeMeta(treeData), [treeData])
  const selectedNodeMeta = nodeMetaMap.get(selectedNodeId)

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
    setExpandedNodeIds(new Set(collectNodeIds(treeData)))
  }

  const collapseAll = () => {
    setExpandedNodeIds(new Set(treeData[0]?.id ? [treeData[0].id] : []))
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

    if (crudMode === "edit" && crudTargetNodeId) {
      setTreeData((previous) => updateMenuNodeName(previous, crudTargetNodeId, nextName))
      setCrudDialogOpen(false)
      return
    }

    const parentId = crudMode === "add-child" ? crudTargetNodeId : crudParentId
    const nextNodeId = generateMenuId(nextName)

    setTreeData((previous) =>
      addMenuNode(previous, parentId, {
        id: nextNodeId,
        name: nextName,
      })
    )

    setExpandedNodeIds((previous) => {
      const next = new Set(previous)
      if (parentId) {
        next.add(parentId)
      }
      next.add(nextNodeId)
      return next
    })

    setSelectedNodeId(nextNodeId)
    setCrudDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!deleteTargetNodeId) {
      return
    }

    setTreeData((previous) => {
      const next = deleteMenuNode(previous, deleteTargetNodeId)

      if (selectedNodeId === deleteTargetNodeId) {
        setSelectedNodeId(findFirstNodeId(next))
      }

      return next
    })

    setExpandedNodeIds((previous) => {
      const next = new Set(previous)
      next.delete(deleteTargetNodeId)
      return next
    })

    setDeleteDialogOpen(false)
  }

  return (
    <DashboardShell>
      <div className="w-full max-w-none">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Folder size={16} className="text-slate-400" />
          <span>/</span>
          <span className="text-slate-700">Menus</span>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0f57b8] text-white">
            <Image src="/submenu.png" alt="Logo" width={24} height={32} />
          </span>
          <h1 className="text-[42px] font-semibold leading-none tracking-[-0.02em] text-[#1e293b]">
            Menus
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <div className="mb-6 w-full max-w-105">
              <Label htmlFor="menu-selector" className="mb-2.5 block text-sm font-medium text-slate-500">
                Menu
              </Label>

              <Select value={selectedRootMenu} onValueChange={setSelectedRootMenu}>
                <SelectTrigger
                  id="menu-selector"
                  className="w-full rounded-xl border-transparent bg-[#e9edf2] px-4 font-medium text-[#1f2937] shadow-none"
                >
                  <SelectValue placeholder="system management" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system management">system management</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={openAddRootDialog}
                className="h-11 min-w-32 rounded-full border-[#b7c2d1] bg-white px-6 text-sm font-semibold text-[#0f57b8] hover:bg-blue-50"
              >
                Add Root
              </Button>
              <Button
                type="button"
                onClick={expandAll}
                  className="h-11 min-w-32 rounded-full bg-[#1d2d45] px-6 text-sm font-semibold text-white hover:bg-[#162338]"
              >
                Expand All
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={collapseAll}
                  className="h-11 min-w-32 rounded-full border-[#b7c2d1] bg-white px-6 text-sm font-semibold text-[#667085] hover:bg-slate-50"
              >
                Collapse All
              </Button>
            </div>

            <MenuTree
              nodes={treeData}
              selectedNodeId={selectedNodeId}
              expandedNodeIds={expandedNodeIds}
              onSelectNode={setSelectedNodeId}
              onToggleNode={toggleNode}
              onAddChild={openAddChildDialog}
              onEditNode={openEditDialog}
              onDeleteNode={openDeleteDialog}
            />
          </section>

          <MenuDetailsPanel
            id="56320ee9-6af6-11ed-a7ba-f220afe5e4a9"
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
        onSubmit={handleSaveCrud}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu</AlertDialogTitle>
            <AlertDialogDescription>
              Delete &quot;{deleteTargetName}&quot; and all of its children from current mock tree?
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

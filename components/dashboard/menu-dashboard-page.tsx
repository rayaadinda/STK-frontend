"use client"

import { useMemo, useState } from "react"
import { Folder } from "lucide-react"
import Image from "next/image"

import {
  buildNodeMeta,
  collectNodeIds,
  menuTree,
} from "@/components/dashboard/menu-mock-data"
import { MenuDetailsPanel } from "@/components/dashboard/menu-details-panel"
import { MenuTree } from "@/components/dashboard/menu-tree"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function MenuDashboardPage() {
  const [selectedRootMenu, setSelectedRootMenu] = useState("system management")
  const [selectedNodeId, setSelectedNodeId] = useState("system-code")
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    () => new Set(collectNodeIds(menuTree))
  )

  const nodeMetaMap = useMemo(() => buildNodeMeta(menuTree), [])
  const selectedNodeMeta = nodeMetaMap.get(selectedNodeId)

  const selectedParentName = selectedNodeMeta?.parentId
    ? nodeMetaMap.get(selectedNodeMeta.parentId)?.name ?? "-"
    : "-"

  const expandAll = () => {
    setExpandedNodeIds(new Set(collectNodeIds(menuTree)))
  }

  const collapseAll = () => {
    setExpandedNodeIds(new Set([menuTree[0]?.id]))
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
                  className="h-24 w-full rounded-xl border-transparent bg-[#e9edf2] px-4 text-xl font-medium text-[#1f2937] shadow-none"
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
              nodes={menuTree}
              selectedNodeId={selectedNodeId}
              expandedNodeIds={expandedNodeIds}
              onSelectNode={setSelectedNodeId}
              onToggleNode={toggleNode}
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
    </DashboardShell>
  )
}

"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Folder, Grid2x2 } from "lucide-react"

import {
  buildNodeMeta,
  collectNodeIds,
  menuTree,
} from "@/components/dashboard/menu-mock-data"
import { MenuDetailsPanel } from "@/components/dashboard/menu-details-panel"
import { MenuTree } from "@/components/dashboard/menu-tree"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

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
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Folder size={16} className="text-slate-400" />
          <span>/</span>
          <span className="text-slate-700">Menus</span>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0f57b8] text-white">
            <Grid2x2 size={17} />
          </span>
          <h1 className="text-[42px] font-semibold leading-none tracking-[-0.02em] text-[#1e293b]">
            Menus
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <label htmlFor="menu-selector" className="mb-2.5 block text-sm text-slate-500">
              Menu
            </label>

            <div className="relative mb-6 w-full max-w-[420px]">
              <select
                id="menu-selector"
                value={selectedRootMenu}
                onChange={(event) => setSelectedRootMenu(event.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-transparent bg-[#e9edf2] px-4 pr-10 text-[28px] font-medium leading-none text-[#1f2937] outline-none"
              >
                <option value="system management">system management</option>
              </select>
              <ChevronDown size={20} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            <div className="mb-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={expandAll}
                className="h-11 min-w-[128px] rounded-full bg-[#1d2d45] px-6 text-sm font-semibold text-white"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="h-11 min-w-[128px] rounded-full border border-[#b7c2d1] bg-white px-6 text-sm font-semibold text-[#667085]"
              >
                Collapse All
              </button>
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

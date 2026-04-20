import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react"

import type { MenuNode } from "@/components/dashboard/menu-types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MenuTreeProps = {
  nodes: MenuNode[]
  selectedNodeId: string
  expandedNodeIds: Set<string>
  onSelectNode: (id: string) => void
  onToggleNode: (id: string) => void
  onAddChild: (id: string) => void
  onEditNode: (id: string) => void
  onDeleteNode: (id: string) => void
}

export function MenuTree({
  nodes,
  selectedNodeId,
  expandedNodeIds,
  onSelectNode,
  onToggleNode,
  onAddChild,
  onEditNode,
  onDeleteNode,
}: MenuTreeProps) {
  const renderNode = (node: MenuNode) => {
    const hasChildren = Boolean(node.children?.length)
    const isExpanded = expandedNodeIds.has(node.id)
    const isSelected = node.id === selectedNodeId

    return (
      <li key={node.id}>
        <div className="relative flex items-center gap-2 py-1.5">
          <div className="w-5">
            {hasChildren ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onToggleNode(node.id)}
                className="h-5 w-5 rounded text-slate-600 transition hover:bg-slate-200"
                aria-label={`Toggle ${node.name}`}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </Button>
            ) : (
              <span className="block h-5 w-5" />
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSelectNode(node.id)}
            className={cn(
              "relative h-auto justify-start gap-2 rounded-md px-1 py-0.5 text-left text-[15px] text-slate-700 transition hover:bg-transparent",
              isSelected && "font-semibold text-slate-900"
            )}
          >
            <span>{node.name}</span>
          </Button>

          {isSelected ? (
            <div className="ml-1 flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onAddChild(node.id)}
                className="h-6 w-6 rounded-full bg-[#0b5ec8] text-white hover:bg-[#0a53af]"
                aria-label={`Add child to ${node.name}`}
              >
                <Plus size={13} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onEditNode(node.id)}
                className="h-6 w-6 rounded-full text-slate-500 hover:bg-slate-200"
                aria-label={`Edit ${node.name}`}
              >
                <Pencil size={13} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onDeleteNode(node.id)}
                className="h-6 w-6 rounded-full text-red-600 hover:bg-red-50"
                aria-label={`Delete ${node.name}`}
              >
                <Trash2 size={13} />
              </Button>
            </div>
          ) : null}
        </div>

        {hasChildren && isExpanded ? (
          <div className="ml-2 border-l border-[#bcc8d9] pl-5">
            <ul className="mt-0.5 space-y-0.5">
              {node.children?.map((child) => renderNode(child))}
            </ul>
          </div>
        ) : null}
      </li>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl pr-2 pb-8">
        <ul className="min-w-155 space-y-0.5 text-[15px] md:min-w-0">
        {nodes.map((node) => renderNode(node))}
      </ul>
    </div>
  )
}

import { ChevronDown, ChevronRight, Plus } from "lucide-react"

import type { MenuNode } from "@/components/dashboard/menu-types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MenuTreeProps = {
  nodes: MenuNode[]
  selectedNodeId: string
  expandedNodeIds: Set<string>
  onSelectNode: (id: string) => void
  onToggleNode: (id: string) => void
}

export function MenuTree({
  nodes,
  selectedNodeId,
  expandedNodeIds,
  onSelectNode,
  onToggleNode,
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
            {node.id === "system-code" ? (
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#0b5ec8] text-white">
                <Plus size={14} />
              </span>
            ) : null}
          </Button>
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

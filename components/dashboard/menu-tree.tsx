import { Fragment, type DragEvent, useState } from "react"
import { ChevronDown, ChevronRight, GripVertical, Pencil, Plus, Trash2 } from "lucide-react"

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
  onMoveNode: (menuId: string, targetParentId: string | null) => void
  onReorderNode: (menuId: string, targetParentId: string | null, targetPosition: number) => void
}

type DropTarget =
  | {
      kind: "child"
      nodeId: string
    }
  | {
      kind: "reorder"
      parentId: string | null
      position: number
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
  onMoveNode,
  onReorderNode,
}: MenuTreeProps) {
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)

  const resolveDraggedNodeId = (event: DragEvent): string | null => {
    const fromState = draggedNodeId
    if (fromState) {
      return fromState
    }

    const fromTransfer = event.dataTransfer.getData("text/plain")
    return fromTransfer || null
  }

  const handleDragStart = (event: DragEvent, nodeId: string) => {
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", nodeId)
    setDraggedNodeId(nodeId)
    setDropTarget(null)
  }

  const handleDragEnd = () => {
    setDraggedNodeId(null)
    setDropTarget(null)
  }

  const setDropAsChild = (event: DragEvent, targetNodeId: string) => {
    const activeDragNodeId = resolveDraggedNodeId(event)

    if (!activeDragNodeId || activeDragNodeId === targetNodeId) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    setDropTarget({ kind: "child", nodeId: targetNodeId })
  }

  const setDropAsReorder = (event: DragEvent, parentId: string | null, position: number) => {
    if (!resolveDraggedNodeId(event)) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    setDropTarget({ kind: "reorder", parentId, position })
  }

  const handleDropAsChild = (event: DragEvent, targetNodeId: string) => {
    event.preventDefault()

    const activeDragNodeId = resolveDraggedNodeId(event)
    if (!activeDragNodeId || activeDragNodeId === targetNodeId) {
      handleDragEnd()
      return
    }

    onMoveNode(activeDragNodeId, targetNodeId)
    onSelectNode(activeDragNodeId)
    handleDragEnd()
  }

  const handleDropAsReorder = (event: DragEvent, parentId: string | null, position: number) => {
    event.preventDefault()

    const activeDragNodeId = resolveDraggedNodeId(event)
    if (!activeDragNodeId) {
      handleDragEnd()
      return
    }

    onReorderNode(activeDragNodeId, parentId, position)
    onSelectNode(activeDragNodeId)
    handleDragEnd()
  }

  const renderReorderDropZone = (parentId: string | null, position: number) => {
    const isActive =
      dropTarget?.kind === "reorder" &&
      dropTarget.parentId === parentId &&
      dropTarget.position === position

    return (
      <li
        key={`drop-zone-${parentId ?? "root"}-${position}`}
        className="h-2"
        onDragOver={(event) => setDropAsReorder(event, parentId, position)}
        onDrop={(event) => handleDropAsReorder(event, parentId, position)}
      >
        <div className={cn("h-0.5 rounded-full transition", isActive ? "bg-[#0b5ec8]" : "bg-transparent")} />
      </li>
    )
  }

  const renderNodeList = (items: MenuNode[], parentId: string | null) => {
    return (
      <ul className="space-y-0.5">
        {items.map((node, position) => (
          <Fragment key={node.id}>
            {renderReorderDropZone(parentId, position)}
            {renderNode(node)}
          </Fragment>
        ))}
        {renderReorderDropZone(parentId, items.length)}
      </ul>
    )
  }

  const renderNode = (node: MenuNode) => {
    const hasChildren = Boolean(node.children?.length)
    const isExpanded = expandedNodeIds.has(node.id)
    const isSelected = node.id === selectedNodeId
    const isDragging = node.id === draggedNodeId
    const isChildDropTarget = dropTarget?.kind === "child" && dropTarget.nodeId === node.id

    return (
      <li key={node.id}>
        <div
          className={cn(
            "relative flex items-center gap-2 rounded-md py-1.5 transition",
            isChildDropTarget && "bg-blue-50",
            isDragging && "opacity-50"
          )}
          onDragOver={(event) => setDropAsChild(event, node.id)}
          onDrop={(event) => handleDropAsChild(event, node.id)}
        >
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

          <button
            type="button"
            draggable
            onDragStart={(event) => handleDragStart(event, node.id)}
            onDragEnd={handleDragEnd}
            className="grid h-5 w-5 cursor-grab place-items-center rounded text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
            aria-label={`Drag ${node.name}`}
          >
            <GripVertical size={13} />
          </button>

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
            {renderNodeList(node.children ?? [], node.id)}
          </div>
        ) : null}
      </li>
    )
  }

  return (
    <div className="overflow-x-auto pr-2 pb-8">
      <div className="mb-3 text-xs text-slate-500">
        Drag via handle to move as child, or drop on line to reorder within the same level.
      </div>
      <div className="min-w-155 text-[15px] md:min-w-0">{renderNodeList(nodes, null)}</div>
    </div>
  )
}

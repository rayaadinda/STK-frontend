"use client"

import { Loader2 } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CrudDialogMode = "add-root" | "add-child" | "edit"

type ParentOption = {
  id: string
  name: string
}

type MenuCrudDialogProps = {
  mode: CrudDialogMode
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  onNameChange: (value: string) => void
  parentId: string | null
  onParentIdChange: (value: string | null) => void
  parentOptions: ParentOption[]
  parentDisplayName: string
  isSubmitting: boolean
  onSubmit: () => void
}

const ROOT_VALUE = "__root__"

export function MenuCrudDialog({
  mode,
  open,
  onOpenChange,
  name,
  onNameChange,
  parentId,
  onParentIdChange,
  parentOptions,
  parentDisplayName,
  isSubmitting,
  onSubmit,
}: MenuCrudDialogProps) {
  const isEdit = mode === "edit"

  const title =
    mode === "add-root" ? "Add Root Menu" : mode === "add-child" ? "Add Child Menu" : "Edit Menu"

  const description =
    mode === "add-root"
      ? "Create a new menu item at root level or assign it to a parent."
      : mode === "add-child"
        ? "Create a child menu item under the selected parent."
        : "Update the selected menu item name."

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crud-menu-name">Name</Label>
            <Input
              id="crud-menu-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Input menu name"
              className="h-11"
            />
          </div>

          {isEdit ? null : mode === "add-child" ? (
            <div className="space-y-2">
              <Label htmlFor="crud-parent-name">Parent</Label>
              <Input id="crud-parent-name" value={parentDisplayName || "-"} readOnly className="h-11" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="crud-parent-selector">Parent</Label>
              <Select
                value={parentId ?? ROOT_VALUE}
                onValueChange={(value) => onParentIdChange(value === ROOT_VALUE ? null : value)}
              >
                <SelectTrigger id="crud-parent-selector" className="h-11 w-full">
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ROOT_VALUE}>Root</SelectItem>
                  {parentOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={name.trim().length === 0 || isSubmitting}>
            {isSubmitting ? <><Loader2 className="animate-spin" /> Saving...</> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type MenuDetailsPanelProps = {
  id: string
  depth: number
  parentName: string
  name: string
}

export function MenuDetailsPanel({
  id,
  depth,
  parentName,
  name,
}: MenuDetailsPanelProps) {
  return (
    <aside className="space-y-3 pt-2 lg:pt-29.5">
      <Field label="Menu ID" value={id} />
      <Field label="Depth" value={String(depth)} />
      <Field label="Parent Data" value={parentName} />
      <Field label="Name" value={name} />

      <Button
        type="button"
        className="mt-2 h-12 w-full rounded-full bg-[#0c5cc4] text-base font-semibold text-white transition hover:bg-[#0a53af]"
      >
        Save
      </Button>
    </aside>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  const inputId = `field-${label.toLowerCase().replace(/\s+/g, "-")}`

  return (
    <div>
      <Label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-[#667085]">
        {label}
      </Label>
      <Input
        id={inputId}
        readOnly
        value={value}
        className="h-12 rounded-xl border-transparent bg-[#e9edf2] px-4 text-[40px] font-medium text-[#1f2937] shadow-none"
      />
    </div>
  )
}

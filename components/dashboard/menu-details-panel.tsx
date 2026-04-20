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
    <aside className="space-y-3 pt-2 lg:pt-[118px]">
      <Field label="Menu ID" value={id} />
      <Field label="Depth" value={String(depth)} />
      <Field label="Parent Data" value={parentName} />
      <Field label="Name" value={name} />

      <button
        type="button"
        className="mt-2 h-12 w-full rounded-full bg-[#0c5cc4] text-base font-semibold text-white transition hover:bg-[#0a53af]"
      >
        Save
      </button>
    </aside>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#667085]">{label}</label>
      <input
        readOnly
        value={value}
        className="h-12 w-full rounded-xl border border-transparent bg-[#e9edf2] px-4 text-[30px] font-medium leading-none text-[#1f2937] outline-none"
      />
    </div>
  )
}

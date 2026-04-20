import { Folder, Grid2x2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

type ModulePlaceholderPageProps = {
  title: string
}

export function ModulePlaceholderPage({ title }: ModulePlaceholderPageProps) {
  return (
    <DashboardShell>
      <div className="w-full max-w-none">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Folder size={16} className="text-slate-400" />
          <span>/</span>
          <span className="text-slate-700">{title}</span>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0f57b8] text-white">
            <Grid2x2 size={17} />
          </span>
          <h1 className="text-[42px] font-semibold leading-none tracking-[-0.02em] text-[#1e293b]">
            {title}
          </h1>
        </div>

        <Card className="max-w-3xl rounded-2xl border-slate-200 bg-white/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Module In Progress</CardTitle>
            <CardDescription>
              This page is intentionally kept minimal while this module API is not implemented yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-700">No backend health placeholder is shown here anymore.</p>
              <p className="mt-1">Route and layout are ready for real module content.</p>
            </div>

            <p className="text-sm text-slate-500">
              Continue implementation by adding service calls and dedicated UI for this module.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

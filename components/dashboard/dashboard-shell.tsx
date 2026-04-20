"use client"

import { PropsWithChildren } from "react"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardShell({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />

      <SidebarInset className="min-h-svh bg-[#ffffff]">
        <header className="sticky top-0 z-20 flex h-14 items-center border-b border-slate-200/70 bg-[#f2f4f7]/95 px-4 backdrop-blur md:hidden">
          <SidebarTrigger className="text-slate-700 hover:bg-slate-200 hover:text-slate-800" />
        </header>

        <div className="px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

"use client"

import { Folder, Grid2x2, Square, User } from "lucide-react"
import Image from 'next/image'

import { sidebarGroupItems } from "@/components/dashboard/menu-mock-data"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className={cn(
        "border-none md:inset-y-6 md:left-6 md:h-[calc(100svh-3rem)]",
        "[--sidebar:#0f57b8] [--sidebar-foreground:#ffffff] [--sidebar-border:#1b66cb]",
        "[--sidebar-accent:#1b66cb] [--sidebar-accent-foreground:#ffffff]"
      )}
    >
      <SidebarHeader className="gap-0 p-3">
        <div className="mb-3 flex items-center justify-between px-1">
          <Image
            src="/logo.png"
            alt="Logo"
            width={64}
            height={64}
          />

          <SidebarTrigger className="text-white hover:bg-white/15 hover:text-white" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-3">
        <SidebarGroup className="rounded-xl bg-[#1b66cb] p-2">
          <div className="mb-1 flex items-center gap-2 px-2 py-1 text-sm font-semibold text-white">
            <Folder size={15} />
            <span>Systems</span>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarGroupItems.map((item) => {
                const isActive = item === "Menus"

                return (
                  <SidebarMenuItem key={item}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={cn(
                        "h-10 rounded-xl text-[15px] text-white hover:bg-white/10 hover:text-white",
                        "data-[active=true]:bg-white data-[active=true]:text-[#0f57b8]"
                      )}
                    >
                      <Grid2x2 size={14} />
                      <span>{item}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-3 bg-white/20" />

        <SidebarGroup className="p-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-lg text-[15px] text-white hover:bg-white/10 hover:text-white">
                <User size={14} />
                <span>Users & Group</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-lg text-[15px] text-white hover:bg-white/10 hover:text-white">
                <Square size={14} />
                <span>Competition</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

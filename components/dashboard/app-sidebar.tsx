"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, Folder, LayoutGrid } from "lucide-react"

import { sidebarGroupItems } from "@/components/dashboard/menu-mock-data"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type SidebarSection = {
  id: string
  label: string
  items: string[]
}

const sidebarSections: SidebarSection[] = [
  {
    id: "systems",
    label: "Systems",
    items: sidebarGroupItems,
  },
  {
    id: "users-group",
    label: "Users & Group",
    items: ["Users", "Groups"],
  },
  {
    id: "competition",
    label: "Competition",
    items: ["Competition List", "Competition Detail"],
  },
]

export function AppSidebar() {
  const [activeSectionId, setActiveSectionId] = useState("systems")
  const [activeItem, setActiveItem] = useState("Menus")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    systems: true,
    "users-group": false,
    competition: false,
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections((previous) => ({
      ...previous,
      [sectionId]: !previous[sectionId],
    }))
  }

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
      <SidebarHeader className="gap-0 p-3 group-data-[collapsible=icon]:px-2">
        <div className="mb-3 flex items-center justify-between px-1 group-data-[collapsible=icon]:mb-1 group-data-[collapsible=icon]:px-0">
          <>
            <Image
              src="/logo.png"
              alt="Logo"
              width={112}
              height={32}
              priority
              className="h-auto w-28 group-data-[collapsible=icon]:hidden"
            />
          </>

          <SidebarTrigger className="text-white hover:bg-white/15 hover:text-white group-data-[collapsible=icon]:mx-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-3">
        <SidebarGroup className="rounded-xl p-1 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-0">
          <SidebarMenu>
            {sidebarSections.map((section, sectionIndex) => {
              const sectionExpanded = Boolean(expandedSections[section.id])
              const sectionActive = activeSectionId === section.id

              return (
                <div
                  key={section.id}
                  className={cn(
                    "mb-1 rounded-xl px-1 py-1 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:px-0",
                    sectionExpanded && "bg-[#1b66cb]"
                  )}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        setActiveSectionId(section.id)
                        toggleSection(section.id)
                      }}
                      className={cn(
                        "h-10 rounded-xl text-[15px] text-white hover:bg-white/10 hover:text-white",
                        sectionActive && !sectionExpanded && "bg-white/10"
                      )}
                      aria-expanded={sectionExpanded}
                    >
                      <Folder
                        size={16}
                        className={cn(sectionActive && "fill-white/35")}
                      />
                      <span>{section.label}</span>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "ml-auto transition-transform group-data-[collapsible=icon]:hidden",
                          sectionExpanded ? "rotate-0" : "-rotate-90"
                        )}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {sectionExpanded ? (
                    <SidebarMenuSub className="ml-0 border-none px-0 pb-1 pt-1 group-data-[collapsible=icon]:hidden">
                      {section.items.map((item) => {
                        const itemActive = section.id === "systems" && item === activeItem

                        return (
                          <SidebarMenuSubItem key={item}>
                            <SidebarMenuSubButton
                              onClick={() => {
                                setActiveSectionId(section.id)
                                setActiveItem(item)
                              }}
                              isActive={itemActive}
                              className={cn(
                                "h-10 w-full rounded-xl px-3 text-[15px] text-white hover:bg-white/10 hover:text-white",
                                  "data-[active=true]:bg-white data-[active=true]:font-medium data-[active=true]:text-[#0f57b8] data-[active=true]:[&>svg]:text-[#0f57b8]"
                              )}
                            >
                              <LayoutGrid
                                size={14}
                                  className={cn("text-white", itemActive && "text-[#0f57b8]!")}
                              />
                              <span>{item}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  ) : null}

                  {sectionIndex === 0 ? (
                    <SidebarSeparator className="my-2 bg-white/20 group-data-[collapsible=icon]:hidden" />
                  ) : null}
                </div>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

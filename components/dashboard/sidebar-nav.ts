export type SidebarNavItem = {
  label: string
  href: string
}

export type SidebarNavSection = {
  id: string
  label: string
  items: SidebarNavItem[]
}

export const sidebarNavSections: SidebarNavSection[] = [
  {
    id: "systems",
    label: "Systems",
    items: [
      { label: "System Code", href: "/systems/system-code" },
      { label: "Properties", href: "/systems/properties" },
      { label: "Menus", href: "/systems/menus" },
      { label: "API List", href: "/systems/api-list" },
    ],
  },
  {
    id: "users-group",
    label: "Users & Group",
    items: [
      { label: "Users", href: "/users-group/users" },
      { label: "Groups", href: "/users-group/groups" },
    ],
  },
  {
    id: "competition",
    label: "Competition",
    items: [
      { label: "Competition List", href: "/competition/list" },
      { label: "Competition Detail", href: "/competition/detail" },
    ],
  },
]

export function findActiveSectionId(pathname: string): string {
  const section = sidebarNavSections.find((entry) =>
    entry.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
  )

  return section?.id ?? "systems"
}

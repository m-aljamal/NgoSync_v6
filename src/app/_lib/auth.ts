import { redirect } from "next/navigation"
import { auth } from "@/auth"
import type { SidebarLinks } from "@/types"

import { type Route } from "@/components/layouts/routes"

export const currentUser = async () => {
  const session = await auth()
  return session?.user
}

export const currentRole = async () => {
  const session = await auth()
  return session?.user?.role
}

export const adminRouteProtection = async () => {
  const role = await currentRole()

  if (role !== "admin") {
    redirect("/overview")
  }
}

export const filterPageLinksByRole = async (routes: Route[]) => {
  const role = await currentRole()
  if (!role) redirect("/auth/login")

  return routes.filter((route) => {
    if (route.roles) {
      return route.roles.includes(role)
    }
    if (route.children) {
      const filteredChildren = route.children.filter((child) =>
        child.roles?.includes(role)
      )
      if (filteredChildren.length > 0) {
        route.children = filteredChildren
        return true
      }
      return false
    }
    return false // Return false for routes without roles or children
  })
}

export const filterSideLinksByRole = (
  links: SidebarLinks,
  userRole: string
) => {
  return links
    .map((group) => ({
      ...group,
      items: group.items
        .map((item) => ({
          ...item,
          children: item.children
            ? item.children.filter(
                (child) => !child.roles || child.roles.includes(userRole)
              )
            : undefined,
        }))
        .filter(
          (item) =>
            !item.roles ||
            item.roles.includes(userRole) ||
            (item.children && item.children.length > 0)
        ),
    }))
    .filter((group) => group.items.length > 0)
}

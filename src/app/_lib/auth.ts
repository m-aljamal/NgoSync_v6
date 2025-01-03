import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { type PageLinks } from "@/types"

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

export const userPermissions = async () => {
  const role = await currentRole()

  const permissions = {
    admin: {
      canCreateProjects: true,
      canDeleteProjects: true,
      canDeleteTransfer_fund_to_project: true,
    },

    project_manager: {
      canCreateProjects: false,
      canDeleteProjects: false,
      canDeleteTransfer_fund_to_project: false,
    },
    viewer: {
      canCreateProjects: false,
      canDeleteProjects: false,
      canDeleteTransfer_fund_to_project: false,
    },
  }

  const userPermissions = permissions[role!]

  return {
    role,
    ...userPermissions,
  }
}

export const filterRoutesByRole = async (routes: Route[]) => {
  const role = await currentRole()
  if (!role) redirect("/auth/login")

  return routes.filter((route) => {
    if (route.roles) {
      return route.roles.includes(role)
    }
    if (route.children) {
      route.children = route.children.filter((child) =>
        child.roles.includes(role)
      )
    }
    return true
  })
}

export const filterPageLinksByRole = async (routes: Route[]) => {
  const role = await currentRole()
  if (!role) redirect("/auth/login")

  return routes.filter((route) => {
    if (route.roles) {
      return route.roles.includes(role)
    }
    if (route.children) {
      route.children = route.children.filter((child) =>
        child.roles.includes(role)
      )
    }
    return true
  })
}

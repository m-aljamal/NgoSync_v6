import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/db"
import { employees } from "@/db/schemas"

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

// export const filterPageLinksByRole = async (routes: Route[]) => {
//   const role = await currentRole()
//   if (!role) redirect("/auth/login")

//   return routes.filter((route) => {
//     if (route.roles?.includes(role)) return true

//     if (route.children) {
//       route.children = route.children.filter((child) => child.roles?.includes(role))
//       return route.children.length > 0
//     }

//     return false
//   })
// }

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

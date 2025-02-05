import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import type { users } from "@/db/schemas"

import { currentRole } from "@/app/_lib/auth"

interface RoleGateProps {
  children: ReactNode
  allowedRoles: (typeof users.$inferSelect.role)[]
}

export const RoleGate = async ({ children, allowedRoles }: RoleGateProps) => {
  const role = await currentRole()

  if (!role) {
    redirect("/auth/login")
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

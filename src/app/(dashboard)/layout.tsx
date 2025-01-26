import React from "react"
import { redirect } from "next/navigation"

import { SiteHeader } from "@/components/layouts/site-header"

import { currentRole } from "../_lib/auth"

export default async function layout({ children }: React.PropsWithChildren) {
  const role = await currentRole()
  if (role === "viewer") {
    redirect("/")
  }

  return (
    <div>
      <SiteHeader />
      <main className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
      </main>
    </div>
  )
}

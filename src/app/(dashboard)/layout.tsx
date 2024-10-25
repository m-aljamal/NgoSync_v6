import React from "react"

import { SiteHeader } from "@/components/layouts/site-header"

export default function layout({ children }: React.PropsWithChildren) {
  return (
    <div>
      <SiteHeader />
      <main className="  flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
      </main>
    </div>
  )
}

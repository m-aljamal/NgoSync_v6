import React from "react"

import { SiteHeader } from "@/components/layouts/site-header"

export default function layout({ children }: React.PropsWithChildren) {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto mt-4 max-w-screen-2xl">
        <div className="container">{children}</div>
      </main>
    </div>
  )
}

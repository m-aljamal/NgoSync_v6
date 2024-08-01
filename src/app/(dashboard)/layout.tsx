import React from "react"

import { SiteHeader } from "@/components/layouts/site-header"

export default function layout({ children }: React.PropsWithChildren) {
  return (
    <div>
      <SiteHeader />
      {children}
    </div>
  )
}

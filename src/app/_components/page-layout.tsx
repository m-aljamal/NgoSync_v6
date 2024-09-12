import { type PageLinks } from "@/types"

import { filterPageLinksByRole } from "../_lib/auth"
import Sidebar from "./Sidebar"

interface Props {
  links: PageLinks
  children: React.ReactNode
}

export default async function PageLayout({ children, links }: Props) {
  const filteredRoutes = await filterPageLinksByRole(links)

  return (
    <div className="flex gap-8">
      <Sidebar links={filteredRoutes} />
      <main className="mr-[220px] h-full flex-1">{children}</main>
    </div>
  )
}

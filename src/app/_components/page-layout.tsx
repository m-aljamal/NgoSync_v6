import { type PageLinks } from "@/types"

import { filterPageLinksByRole } from "../_lib/auth"
import MobileSidebar from "./MobileSidebar"
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
      <main className="h-full flex-1 sm:mr-[170px] md:mr-[200px]">
        <MobileSidebar />
        {children}
      </main>
    </div>
  )
}

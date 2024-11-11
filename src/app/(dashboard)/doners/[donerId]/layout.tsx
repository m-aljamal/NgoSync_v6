import { notFound } from "next/navigation"
import type { SidebarLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"
import { getDoner } from "@/app/_lib/queries/doners"

interface Props {
  children: React.ReactNode
  params: { donerId: string }
}

export default async function DonerLayout({ children, params }: Props) {
  const doner = await getDoner({
    id: params?.donerId,
  })
  if (!doner) {
    notFound()
  }

  const links: SidebarLinks = [
    {
      groupName: "المتبرع",
      items: [
        {
          title: "بيانات المتبرع",
          href: `/doners/${doner.id}/overview`,
          icon: "SquareKanban",
        },
        {
          title: "التبرعات",
          icon: "ArrowDownLeft",
          href: `/doners/${doner.id}/donations`,
        },
        {
          title: "الدراسات",
          icon: "BookText",
          href: `/doners/${doner.id}/proposals`,
        },
      ],
    },
  ]

  const breadcrumbs = [
    { title: "المتبرعين", href: "/doners" },
    { title: doner.name, href: `/doners/${doner.id}` },
  ]

  return (
    <AppSidebar links={links} breadcrumbs={breadcrumbs}>
      <main>{children}</main>
    </AppSidebar>
  )
}

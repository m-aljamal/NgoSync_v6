import { notFound } from "next/navigation"
import { type SidebarLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"
import { getFund } from "@/app/_lib/queries/funds"

interface Props {
  children: React.ReactNode
  params: {
    fundId: string
  }
}

export default async function layout({ children, params }: Props) {
  const fund = await getFund({
    id: params.fundId,
  })

  if (!fund) {
    notFound()
  }

  const links: SidebarLinks = [
    {
      groupName: "الصندوق",
      items: [
        {
          title: "بيانات الصندوق",
          icon: "FileDigit",
          href: `/funds/${fund.id}/overview`,
        },

        {
          title: "الداخل",
          href: `/funds/${fund.id}/income`,
          icon: "ArrowDownNarrowWide",
        },
        {
          title: "الخارج",
          href: `/funds/${fund.id}/outcome`,
          icon: "ArrowUpNarrowWide",
        },
      ],
    },
  ]

  const breadcrumbs = [
    { title: "الصناديق", href: "/funds" },
    { title: fund.name, href: `/funds/${fund.id}` },
  ]

  return (
    <AppSidebar links={links} breadcrumbs={breadcrumbs}>
      <main>{children}</main>
    </AppSidebar>
  )
}

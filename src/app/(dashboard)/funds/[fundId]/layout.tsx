import { notFound } from "next/navigation"
import { type PageLinks } from "@/types"

import PageLayout from "@/app/_components/page-layout"
import { getFund } from "@/app/_lib/queries/funds"
import AppSidebar from "@/components/app-sidebar"

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

  const links: PageLinks = [
    {
      href: `/funds/${fund.id}/overview`,
      title: "بيانات الصندوق",
      icon: "FileDigit",
    },
    {
      title: "الحركات المالية",
      children: [
        {
          href: `/funds/${fund.id}/income`,
          title: "الداخل",
          icon: "ArrowDownNarrowWide",
          roles: ["admin"],
        },
        {
          href: `/funds/${fund.id}/outcome`,
          title: "الخارج",
          icon: "ArrowUpNarrowWide",
          roles: ["admin"],
        },
      ],
    },
  ]

  return (
    // <PageLayout links={links}>
    //   <main>{children}</main>
    // </PageLayout>

    <AppSidebar/>
  )
}

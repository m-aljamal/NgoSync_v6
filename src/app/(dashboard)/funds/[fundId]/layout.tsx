import { notFound } from "next/navigation"
import { SidebarLinks, type PageLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"
import PageLayout from "@/app/_components/page-layout"
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

  // const links: PageLinks = [
  //   {
  //     href: `/funds/${fund.id}/overview`,
  //     title: "بيانات الصندوق",
  //     icon: "FileDigit",
  //   },
  //   {
  //     title: "الحركات المالية",
  //     children: [
  //       {
  //         href: `/funds/${fund.id}/income`,
  //         title: "الداخل",
  //         icon: "ArrowDownNarrowWide",
  //         roles: ["admin"],
  //       },
  //       {
  //         href: `/funds/${fund.id}/outcome`,
  //         title: "الخارج",
  //         icon: "ArrowUpNarrowWide",
  //         roles: ["admin"],
  //       },
  //     ],
  //   },
  // ]

  const links: SidebarLinks = [
    {
      groupName: "الصندوق",
      items: [
        {
          type: "collapsible",
          title: "بيانات الصندوق",
          icon: "FileDigit",
          href: `/funds/${fund.id}/overview`,
        },
        {
          type: "collapsible",
          title: "الحركات المالية",
          icon: "ArrowDownNarrowWide",
          children: [
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
      ],
    },
    {
      groupName: "المشاريع",
      items: [
        {
          type: "dropdown",
          title: "بيانات  المشروع",
          icon: "FileDigit",
          href: `/funds/${fund.id}/overview`,
        },
        {
          type: "dropdown",
          title: "الحركات ",
          icon: "ArrowDownNarrowWide",
          children: [
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
      ],
    },
  ]

  return (
    // <PageLayout links={links}>
    //   <main>{children}</main>
    // </PageLayout>

    <AppSidebar links={links}>
      <main>{children}</main>
    </AppSidebar>
  )
}

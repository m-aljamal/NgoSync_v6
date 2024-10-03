import { notFound } from "next/navigation"
import type { PageLinks } from "@/types"

import PageLayout from "@/app/_components/page-layout"
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

  const links: PageLinks = [
    {
      href: `/doners/${doner.id}/overview`,
      title: "بيانات المتبرع",
      icon: "SquareKanban",
      roles: ["admin"],
    },
    {
      title: "الحركات المالية",
      children: [
        {
          href: `/doners/${doner.id}/donations`,
          title: "التبرعات",
          icon: "ArrowDownLeft",
          roles: ["admin"],
        },
      ],
    },
  ]

  return <PageLayout links={links}>{children}</PageLayout>
}

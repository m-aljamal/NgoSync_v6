import { notFound } from "next/navigation"
import { type SidebarLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"
import { getProposal } from "@/app/_lib/queries/proposals"

export default async function ProposalLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { proposalId: string }
}) {
  const proposal = await getProposal({
    id: params.proposalId,
  })

  if (!proposal) {
    notFound()
  }

  const links: SidebarLinks = [
    {
      groupName: "الدراسة",
      items: [
        {
          title: "بيانات الدراسة",
          icon: "Presentation",
          href: `/proposals/${proposal.id}/overview`,
        },
        {
          title: "التبرعات",
          icon: "HandCoins",
          href: `/proposals/${proposal.id}/income`,
        },
        {
          title: "المصروفات",
          icon: "ArrowUpRight",
          href: `/proposals/${proposal.id}/outcome`,
        },
      ],
    },
  ]

  const breadcrumbs = [
    { title: "الدراسات", href: "/proposals" },
    { title: proposal.name, href: `/proposals/${proposal.id}` },
  ]

  return (
    <AppSidebar links={links} breadcrumbs={breadcrumbs}>
      <main>{children}</main>
    </AppSidebar>
  )
}

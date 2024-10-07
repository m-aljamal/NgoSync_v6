import { notFound } from "next/navigation"
import { type PageLinks } from "@/types"

import PageLayout from "@/app/_components/page-layout"
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

  const links: PageLinks = [
    {
      href: `/proposals/${proposal.id}/overview`,
      title: "بيانات الدراسة",
      icon: "Presentation",
    },
    {
      title: "الحركات المالية",
      children: [
        {
          href: `/proposals/${proposal.id}/income`,
          title: "التبرعات",
          icon: "HandCoins",
          roles: ["admin"],
        },
        {
          href: `/proposals/${proposal.id}/outcome`,
          title: "المصروفات",
          icon: "ArrowUpRight",
          roles: ["admin"],
        },
      ],
    },
  ]

  return <PageLayout links={links}>{children}</PageLayout>
}

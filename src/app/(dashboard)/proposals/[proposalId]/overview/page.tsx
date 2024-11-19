import { getProposalRemainingStatistics } from "@/app/_lib/queries/proposals"

import ProposalExpenses from "./_components/proposal-expenses"
import ProposalStatisticsCards from "./_components/proposal-statistics-cards"
import ProposalTableStatistics from "./_components/proposal-table-statistics"

async function Overview({
  params,
}: {
  params: {
    proposalId: string
  }
}) {
  const proposalStatisitcs = await getProposalRemainingStatistics(
    params.proposalId
  )

  return (
    <div className="space-y-4">
      <div className="grid items-start gap-6 rounded-lg lg:grid-cols-2 xl:grid-cols-2">
        <ProposalStatisticsCards {...proposalStatisitcs} />
        <ProposalExpenses proposalId={params.proposalId} />
        <ProposalTableStatistics proposalId={params.proposalId} />
      </div>
    </div>
  )
}

export default Overview

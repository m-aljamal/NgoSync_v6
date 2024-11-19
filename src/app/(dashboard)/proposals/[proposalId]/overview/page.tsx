import { CircleCheck } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getProposalExpenses,
  getProposalRemainingStatistics,
} from "@/app/_lib/queries/proposals"

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

  const proposalExpenses = await getProposalExpenses(params.proposalId)

  return (
    <div className="space-y-4">
      <div className="grid items-start gap-6 rounded-lg lg:grid-cols-2 xl:grid-cols-2">
        <ProposalStatisticsCards {...proposalStatisitcs} />

        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>بنود الدراسة</CardTitle>
              <CardDescription>
                بنود المصاريف المتفق عليها في الدراسة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {proposalExpenses?.map((item) => (
                  <div className="flex items-center" key={item.id}>
                    <CircleCheck className="size-4 text-muted-foreground" />
                    <div className="mr-4 space-y-1">
                      <p className="text-base font-medium leading-none">
                        {item.expensesCategory}
                      </p>
                    </div>
                    <div className="mr-auto font-medium">
                      {formatCurrency(item.amount, item.currency)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <ProposalTableStatistics proposalId={params.proposalId} />
      </div>
    </div>
  )
}

export default Overview

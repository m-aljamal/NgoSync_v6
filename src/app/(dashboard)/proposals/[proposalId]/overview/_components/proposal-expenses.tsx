import React from "react"
import { CircleCheck } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getProposalExpenses } from "@/app/_lib/queries/proposals"

async function ProposalExpenses({ proposalId }: { proposalId: string }) {
  const proposalExpenses = await getProposalExpenses(proposalId)
  return (
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
  )
}

export default ProposalExpenses

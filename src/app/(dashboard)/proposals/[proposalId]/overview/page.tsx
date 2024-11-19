import React from "react"
import {
  CircleCheck,
  HandCoins,
  MoveUpRight,
  SquareKanban,
  Wallet,
} from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  getProposalExpenses,
  getProposalRemainingStatistics,
} from "@/app/_lib/queries/proposals"

import ProposalTableStatistics from "./_components/proposal-table-statistics"

async function Overview({
  params,
}: {
  params: {
    proposalId: string
  }
}) {
  const proposalRemainingStatisitcs = await getProposalRemainingStatistics(
    params.proposalId
  )

  const proposalExpenses = await getProposalExpenses(params.proposalId)
 
  return (
    <div className="space-y-4">
      <div className="grid items-start gap-6 rounded-lg lg:grid-cols-2 xl:grid-cols-2">
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>الدعم / المصروف</CardTitle>
              <CardDescription>
                تفاصيل الدعم المستلم والمصروف على الدراسة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <SquareKanban className="size-6 text-muted-foreground" />
                  <div className="mr-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      قيمة الدراسة
                    </p>
                    <p className="text-sm text-muted-foreground">
                      المبلغ المرصود للدراسة
                    </p>
                  </div>
                  <div className="mr-auto font-medium">
                    {formatCurrency(
                      proposalRemainingStatisitcs.proposalAmount,
                      proposalRemainingStatisitcs.proposalCurrency || ""
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <HandCoins className="size-6 text-muted-foreground" />
                  <div className="mr-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      قيمة الدعم
                    </p>
                    <p className="text-sm text-muted-foreground">
                      المبلغ المستلم من الداعم
                    </p>
                  </div>
                  <div className="mr-auto font-medium">
                    {formatCurrency(
                      proposalRemainingStatisitcs.totalDonations,
                      proposalRemainingStatisitcs.proposalCurrency || ""
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <MoveUpRight className="size-6 text-muted-foreground" />
                  <div className="mr-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      إجمالي المدفوعات
                    </p>
                    <p className="text-sm text-muted-foreground">
                      إجمالي المبلغ المصروف على الدراسة
                    </p>
                  </div>
                  <div className="mr-auto font-medium">
                    {formatCurrency(
                      proposalRemainingStatisitcs.totalExpenses,
                      proposalRemainingStatisitcs.proposalCurrency || ""
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center">
                  <Wallet className="size-6 text-muted-foreground" />
                  <div className="mr-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      المتبقي من الدعم
                    </p>
                    <p className="text-sm text-muted-foreground">
                      المبلغ الباقي من الدعم بعد خصم المصروفات
                    </p>
                  </div>
                  <div className="mr-auto font-medium">
                    {formatCurrency(
                      proposalRemainingStatisitcs.remainingDonationAmount,
                      proposalRemainingStatisitcs.proposalCurrency || ""
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center">
                  <Wallet className="size-6 text-muted-foreground" />
                  <div className="mr-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      المتبقي من الدراسة
                    </p>
                    <p className="text-sm text-muted-foreground">
                      المبلغ الباقي من الدراسة بعد خصم المصروفات
                    </p>
                  </div>
                  <div className="mr-auto font-medium">
                    {formatCurrency(
                      proposalRemainingStatisitcs.remainingProposalAmount,
                      proposalRemainingStatisitcs.proposalCurrency || ""
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

import React from "react"
import { HandCoins, MoveUpRight, SquareKanban, Wallet } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type ProposalStatisticsCardsProps = {
  proposalAmount: number
  totalDonations: number
  totalExpenses: number
  remainingDonationAmount: number
  remainingProposalAmount: number
  proposalCurrency: string | undefined
}

async function ProposalStatisticsCards({
  proposalAmount,
  totalDonations,
  totalExpenses,
  remainingDonationAmount,
  remainingProposalAmount,
  proposalCurrency,
}: ProposalStatisticsCardsProps) {
  return (
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
                <p className="text-sm font-medium leading-none">قيمة الدراسة</p>
                <p className="text-sm text-muted-foreground">
                  المبلغ المرصود للدراسة
                </p>
              </div>
              <div className="mr-auto font-medium">
                {formatCurrency(proposalAmount, proposalCurrency || "")}
              </div>
            </div>
            <div className="flex items-center">
              <HandCoins className="size-6 text-muted-foreground" />
              <div className="mr-4 space-y-1">
                <p className="text-sm font-medium leading-none">قيمة الدعم</p>
                <p className="text-sm text-muted-foreground">
                  المبلغ المستلم من الداعم
                </p>
              </div>
              <div className="mr-auto font-medium">
                {formatCurrency(totalDonations, proposalCurrency || "")}
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
                {formatCurrency(totalExpenses, proposalCurrency || "")}
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
                  remainingDonationAmount,
                  proposalCurrency || ""
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
                  remainingProposalAmount,
                  proposalCurrency || ""
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProposalStatisticsCards

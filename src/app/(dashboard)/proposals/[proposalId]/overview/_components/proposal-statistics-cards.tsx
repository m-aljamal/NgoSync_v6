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
            <Item
              icon={SquareKanban}
              title="قيمة الدراسة"
              description="المبلغ المرصود للدراسة"
              amount={proposalAmount}
              currency={proposalCurrency || ""}
            />

            <Item
              icon={HandCoins}
              title="قيمة الدعم"
              description="المبلغ المستلم من الداعم"
              amount={totalDonations}
              currency={proposalCurrency || ""}
            />

            <Item
              icon={MoveUpRight}
              title="إجمالي المدفوعات"
              description="إجمالي المبلغ المصروف على الدراسة"
              amount={totalExpenses}
              currency={proposalCurrency || ""}
            />

            <Separator />

            <Item
              icon={Wallet}
              title="المتبقي من الدعم"
              description="المبلغ الباقي من الدعم بعد خصم المصروفات"
              amount={remainingDonationAmount}
              currency={proposalCurrency || ""}
            />

            <Separator />

            <Item
              icon={Wallet}
              title="المتبقي من الدراسة"
              description="المبلغ الباقي من الدراسة بعد خصم المصروفات"
              amount={remainingProposalAmount}
              currency={proposalCurrency || ""}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProposalStatisticsCards

type ItemProps = {
  icon: React.ElementType
  title: string
  description: string
  amount: number
  currency: string
}

const Item = ({ icon, title, description, amount, currency }: ItemProps) => {
  const Icon = icon
  return (
    <div className="flex items-center">
      <Icon className="size-6 text-muted-foreground" />
      <div className="mr-4 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mr-auto font-medium">
        {formatCurrency(amount, currency)}
      </div>
    </div>
  )
}

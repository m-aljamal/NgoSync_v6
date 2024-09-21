import { cn, formatCurrency } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

type ViewMoreCardProps = {
  details: {
    title: string
    details: { label: string; value: string | number }[]
  }
  amounts: {
    currency: string
    amount: string
    amountInUSD: string
    proposalAmount: string | null
    proposalCurrency: string | null
    isOfficial: boolean
    officialAmount: string | null
    officialAmountCurrency: string | null
  }
}

export default function ViewMoreCards({
  details: { title, details },
  amounts: {
    currency,
    amount,
    amountInUSD,
    proposalAmount,
    proposalCurrency,
    isOfficial,
    officialAmount,
    officialAmountCurrency,
  },
}: ViewMoreCardProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        <AmountCard
          currency={currency}
          amount={amount}
          title="المبلغ المستلم"
        />
        {currency !== "USD" && (
          <AmountCard currency="USD" amount={amountInUSD} title="يعادل USD" />
        )}
        {proposalAmount && proposalCurrency && (
          <AmountCard
            currency={proposalCurrency}
            amount={proposalAmount}
            title="المبلغ بعملة الدراسة"
          />
        )}
        {isOfficial && officialAmount && officialAmountCurrency && (
          <AmountCard
            currency={officialAmountCurrency}
            amount={officialAmount}
            title="المبلغ بالعملة الرسمية"
          />
        )}
      </div>
      <DetailsCard title={title} details={details} />
    </div>
  )
}

const AmountCard = ({
  currency,
  amount,
  title,
}: {
  currency: string
  amount: string
  title?: string
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>

        <span className="font-bold text-muted-foreground">{currency}</span>
      </CardHeader>
      <CardContent>{formatCurrency(amount, currency)}</CardContent>
    </Card>
  )
}

const DetailsCard = ({
  details,
  title,
}: {
  details: { label: string; value: string | number; colSpan?: string }[]
  title?: string
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 px-4 py-6 sm:grid-cols-4">
        {details?.map(({ label, value, colSpan }) => (
          <dl
            className={cn(
              "flex flex-wrap items-start gap-2 break-all text-sm font-medium",
              colSpan
            )}
            key={label}
          >
            <dt className="text-gray-500">{label}:</dt>
            <dd className="text-gray-900">{value}</dd>
          </dl>
        ))}
      </div>
    </Card>
  )
}

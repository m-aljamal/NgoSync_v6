import { cn, formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ViewMoreCardProps = {
  details: {
    title: string
    details: { label: string; value: string | number }[]
  }
  amounts?: {
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
  amounts,
}: ViewMoreCardProps) {
  return (
    <div className="space-y-5">
      {amounts && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <AmountCard
            currency={amounts.currency}
            amount={amounts.amount}
            title="المبلغ المستلم"
          />
          {amounts.currency !== "USD" && (
            <AmountCard
              currency="USD"
              amount={amounts.amountInUSD}
              title="يعادل USD"
            />
          )}
          {amounts.proposalAmount && amounts.proposalCurrency && (
            <AmountCard
              currency={amounts.proposalCurrency}
              amount={amounts.proposalAmount}
              title="المبلغ بعملة الدراسة"
            />
          )}
          {amounts.isOfficial &&
            amounts.officialAmount &&
            amounts.officialAmountCurrency && (
              <AmountCard
                currency={amounts.officialAmountCurrency}
                amount={amounts.officialAmount}
                title="المبلغ بالعملة الرسمية"
              />
            )}
        </div>
      )}
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

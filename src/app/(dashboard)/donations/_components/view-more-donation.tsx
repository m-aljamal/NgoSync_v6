import React from "react"

import { cn, formatCurrency } from "@/lib/utils"
import { useGetDonationById } from "@/hooks/queries/use-get-donation"
import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { donationPaymentTypeTranslation } from "@/app/_lib/translate"

export default function ViewMoreDonation() {
  const { id } = useViewMoreDialog()
  const { data, isLoading } = useGetDonationById(id)
  if (isLoading) return <div>loading...</div>
  if (!data) return <div>no data</div>
  const {
    currency,
    amount,
    amountInUSD,
    proposalAmount,
    proposalCurrency,
    doner,
    paymentType,
    project,
    proposal,
    date,
    isOfficial,
    officialAmount,
    officialAmountCurrency,
    fund,
    description,
    receiptDescription,
    amountInText,
  } = data

  const details: { label: string; value: string | number; colSpan?: string }[] =
    [
      { label: "التاريخ", value: date },

      {
        label: "طريقة الدفع",
        value: donationPaymentTypeTranslation[paymentType],
      },
      {
        label: "المشروع",
        value: project || "من دون مشروع",
      },
      {
        label: "الدراسة المالية",
        value: proposal || "من دون دراسة",
      },
      {
        label: "توثيق رسمي",
        value: isOfficial ? "نعم" : "لا",
      },
      {
        label: "الصندوق",
        value: fund,
      },
      {
        label: "ملاحظات",
        value: description || "-",
        colSpan: "col-span-full",
      },
      {
        label: "المبلغ بالنص",
        value: amountInText || "-",
      },
      {
        label: "وصف الإيصال",
        value: receiptDescription || "-",
        colSpan: "col-span-full",
      },
    ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        <AmountCard currency={currency} amount={amount} title="المبلغ" />
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
      <DetailsCard title={`المتبرع ${doner}`} details={details} />
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
            className={cn("flex items-end gap-2 text-sm font-medium", colSpan)}
            key={label}
          >
            <dt className="text-gray-500">{label}: </dt>
            <dd className="text-gray-900">{value}</dd>
          </dl>
        ))}
      </div>
    </Card>
  )
}

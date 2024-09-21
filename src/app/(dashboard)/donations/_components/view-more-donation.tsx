import { InfoCircledIcon } from "@radix-ui/react-icons"

import { useGetDonationById } from "@/hooks/queries/use-get-donation"
import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import ViewMoreCards from "@/components/view-more-card"
import { donationPaymentTypeTranslation } from "@/app/_lib/translate"

export default function ViewMoreDonation() {
  const { id } = useViewMoreDialog()
  const { data, isLoading } = useGetDonationById(id)
  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    )
  }
  if (!data)
    return (
      <div className="mt-20 flex items-center justify-center text-sm">
        لا يوجد بيانات
        <InfoCircledIcon className="mr-2 size-4" />
      </div>
    )

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
    <ViewMoreCards
      amounts={{
        amount,
        amountInUSD,
        currency,
        isOfficial,
        officialAmount,
        officialAmountCurrency,
        proposalAmount,
        proposalCurrency,
      }}
      details={{
        details,
        title: `المتبرع ${doner}`,
      }}
    />
  )
}

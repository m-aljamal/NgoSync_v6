import { type ViewMoreDataDetails } from "@/types"

import { useGetDonationById } from "@/hooks/queries/use-get-donation"
import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"
import {
  NoDataFound,
  ViewMoreCards,
  ViewMoreLoading,
} from "@/components/view-more"
import { donationPaymentTypeTranslation } from "@/app/_lib/translate"

export default function ViewMoreDonation() {
  const { id } = useViewMoreDialog()
  const { data, isLoading } = useGetDonationById(id)
  if (isLoading) {
    return <ViewMoreLoading />
  }
  if (!data) return <NoDataFound />

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

  const details: ViewMoreDataDetails = [
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

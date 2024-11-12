import React from "react"
import { type ViewMoreDataDetails } from "@/types"
import { formatDate } from "date-fns"

import { useGetExpenseById } from "@/hooks/queries/use-get-expense"
import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"
import {
  NoDataFound,
  ViewMoreCards,
  ViewMoreLoading,
} from "@/components/view-more"
import { transactionStatusTranslation } from "@/app/_lib/translate"

function ViewMoreExpenses() {
  const { id } = useViewMoreDialog()
  const { data, isLoading } = useGetExpenseById(id)
  if (isLoading) {
    return <ViewMoreLoading />
  }
   
  if (!data) return <NoDataFound />
  const {
    date,
    currency,
    amount,
    amountInUSD,
    description,
    expensesCategory,
    isOfficial,
    officialAmount,
    officialAmountCurrency,
    project,
    proposal,
    proposalAmount,
    proposalCurrency,
    transactionStatus,
  } = data

  const details: ViewMoreDataDetails = [
    { label: "التاريخ", value: formatDate(date, "dd-MM-yyyy") },
    {
      label: "المشروع",
      value: project || "من دون مشروع",
    },
    {
      label: "الحالة",
      value: transactionStatusTranslation[transactionStatus],
    },
    {
      label: "الفئة",
      value: expensesCategory || "-",
    },
    {
      label: "الدراسة المالية",
      value: proposal || "من دون دراسة",
    },
    {
      label: "ملاحظات",
      value: description || "-",
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
        title: "تفاصيل المصروف",
      }}
    />
  )
}

export default ViewMoreExpenses

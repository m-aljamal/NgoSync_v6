import React from "react"
import { type ViewMoreDataDetails } from "@/types"

import { useGetDonerById } from "@/hooks/queries/use-get-doner"
import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"
import {
  NoDataFound,
  ViewMoreCards,
  ViewMoreLoading,
} from "@/components/view-more"

export default function ViewMoreDoner() {
  const { id } = useViewMoreDialog()
  const { data, isLoading } = useGetDonerById(id)
  if (isLoading) {
    return <ViewMoreLoading />
  }
  if (!data) return <NoDataFound />
  const { address, description, email, gender, name, phone, status, type } =
    data

  const details: ViewMoreDataDetails = [
    { label: "الاسم", value: name },
    { label: "النوع", value: type },
    { label: "الحالة", value: status },
    { label: "العنوان", value: address || "-" },
    { label: "البريد الالكتروني", value: email || "-" },
    { label: "الهاتف", value: phone || "-" },
    { label: "الجنس", value: gender },
    {
      label: "ملاحظات",
      value: description || "-",
      colSpan: "col-span-full",
    },
  ]

  return (
    <ViewMoreCards
      details={{
        details,
        title: `المتبرع ${name}`,
      }}
    />
  )
}

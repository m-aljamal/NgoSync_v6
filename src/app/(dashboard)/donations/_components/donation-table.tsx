"use client"
"use memo"

import * as React from "react"
import { donations, type DonationWithRelations } from "@/db/schemas"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getDonations } from "@/app/_lib/queries/donations"
import { donationPaymentTranslation } from "@/app/_lib/translate"

import { getColumns } from "./donation-table-columns"
import { DonationTableToolbarActions } from "./donation-table-toolbar-actions"

interface DonationTableProps {
  promise: ReturnType<typeof getDonations>
}

export function DonationTable({ promise }: DonationTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<DonationWithRelations>[] = [
    {
      label: "المبلغ",
      value: "amount",
      placeholder: "بحث عن مبلغ",
    },
    {
      label: "العملة",
      value: "currencyCode",
      options: [
        {
          label: "دولار",
          value: "USD",
          withCount: true,
        },
        {
          label: "تركي",
          value: "TRY",
          withCount: true,
        },
      ],
    },

    {
      label: "الدفع",
      value: "paymentType",
      options: donations.paymentType.enumValues.map((paymentType) => ({
        label: donationPaymentTranslation[paymentType],
        value: paymentType,
        withCount: true,
      })),
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    state: {
      sorting: [{ id: "createdAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <DonationTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

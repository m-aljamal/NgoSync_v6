"use client"
"use memo"

import * as React from "react"
import { Donation } from "@/db/schemas"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { getDonations } from "@/app/_lib/queries/donations"

import { getColumns } from "./donation-table-columns"
import { DonationTableToolbarActions } from "./donation-table-toolbar-actions"

interface DonationTableProps {
  promise: ReturnType<typeof getDonations>
}

export function DonationTable({ promise }: DonationTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Donation>[] = [
    {
      label: "Amount",
      value: "amount",
      placeholder: "بحث عن مبلغ",
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

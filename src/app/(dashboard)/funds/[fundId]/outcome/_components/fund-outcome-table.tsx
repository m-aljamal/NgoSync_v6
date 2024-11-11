"use client"

import * as React from "react"
import { type FundTransactionWithRelations } from "@/db/schemas"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { useGetCurrencies } from "@/hooks/use-get-form-data"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getFundPageTransactions } from "@/app/_lib/queries/funds"

import { getColumns } from "./fund-outcome-table-columns"
import { FundOutcomeTableToolbarActions } from "./fund-table-toolbar-actions"

interface FundOutcomeTableProps {
  promise: ReturnType<typeof getFundPageTransactions>
}

export function FundOutcomeTable({ promise }: FundOutcomeTableProps) {
  const { data, pageCount } = React.use(promise)

  const { data: currencies, isLoading: loadingCurrencies } = useGetCurrencies()

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<FundTransactionWithRelations>[] = [
    {
      label: "المبلغ",
      value: "amount",
      placeholder: "بحث عن مبلغ",
    },

    {
      label: "العملة",
      value: "currencyCode",
      options: loadingCurrencies
        ? [
            {
              label: "جاري التحميل...",
              value: "loading",
            },
          ]
        : currencies?.map((currency) => ({
            label: currency.name,
            value: currency.code,
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
        <FundOutcomeTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

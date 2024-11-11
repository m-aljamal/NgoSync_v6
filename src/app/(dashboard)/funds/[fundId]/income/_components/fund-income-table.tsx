"use client"

import * as React from "react"
import { type FundTransactionWithRelations } from "@/db/schemas"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { useGetCurrencies } from "@/hooks/use-get-form-data"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getFundIncome } from "@/app/_lib/queries/funds"

import { FundIncomeTableToolbarActions } from "./donation-table-toolbar-actions"
import { getColumns } from "./fund-income-table-columns"

interface FundIncomeTableProps {
  promise: ReturnType<typeof getFundIncome>
}

export function FundIncomeTable({ promise }: FundIncomeTableProps) {
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
        <FundIncomeTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

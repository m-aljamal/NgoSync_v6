"use client"

import * as React from "react"
import { type ExpensesCategoryWithRelation } from "@/db/schemas"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getExpensesCategories } from "@/app/_lib/queries/project-transactions"

import { getColumns } from "./expense-category-table-columns"
import { ExpenseCategoryTableToolbarActions } from "./expense-category-table-toolbar-actions"

interface ExpenseCategoriesTableProps {
  promise: ReturnType<typeof getExpensesCategories>
}

export function ExpenseCategoriesTable({
  promise,
}: ExpenseCategoriesTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<ExpensesCategoryWithRelation>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "بحث عن عنوان",
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
        <ExpenseCategoryTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

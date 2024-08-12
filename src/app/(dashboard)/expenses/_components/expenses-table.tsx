"use client"
"use memo"

import { projects, ProjectTransaction, type Project } from "@/db/schema"
import { type DataTableFilterField } from "@/types"
import * as React from "react"

import { useTasksTable } from "@/app/_components/tasks-table-provider"
import { type getProjects } from "@/app/_lib/queries/projects"
import { getStatusIcon } from "@/app/_lib/utils"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
  
import { getexpenses } from "@/app/_lib/queries/expenses"
import { TasksTableToolbarActions } from "@/app/_components/tasks-table-toolbar-actions"
import { ExpensesTableToolbarActions } from "./expenses-table-toolbar-actions"
import { getColumns } from "./expense-table-columns"

interface TableProps {
  promise: ReturnType<typeof getexpenses>
}

export function ExpensesTable({ promise }: TableProps) {
  // Feature flags for showcasing some additional features. Feel free to remove them.
  // const { featureFlags } = useTasksTable()

  const { data, pageCount } = React.use(promise)
 
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<ProjectTransaction>[] = [
    {
      label: "Amount",
      value: "amount",
      placeholder: "بحث عن عنوان",
    },
    
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    // enableAdvancedFilter: featureFlags.includes("advancedFilter"),
    state: {
      sorting: [{ id: "createdAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
    /* */
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ExpensesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

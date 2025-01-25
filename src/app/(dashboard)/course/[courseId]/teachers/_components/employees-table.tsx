"use client"

import * as React from "react"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import type { getTeachers, TeachersList } from "@/app/_lib/queries/course"

import { getColumns } from "./employee-table-columns"
import { EmployeesTableToolbarActions } from "./employees-table-toolbar-actions"

interface EmployeesTableProps {
  promise: ReturnType<typeof getTeachers>
}

export function EmployeesTable({ promise }: EmployeesTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<TeachersList>[] = []

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    state: {
      sorting: [{ id: "name", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <EmployeesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

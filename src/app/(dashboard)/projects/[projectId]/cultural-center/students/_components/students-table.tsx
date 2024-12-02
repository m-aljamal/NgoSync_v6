"use client"
"use memo"

import * as React from "react"
import { type EmployeeWithRelations } from "@/db/schemas"
import { type Student } from "@/db/schemas/student"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getEmployees } from "@/app/_lib/queries/employees"

import { getColumns } from "./employee-table-columns"
import { EmployeesTableToolbarActions } from "./students-table-toolbar-actions"

interface StudentsTableProps {
  promise: ReturnType<typeof getEmployees>
}

export function StudentsTable({ promise }: StudentsTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Student>[] = [
    {
      label: "الاسم",
      value: "name",
      placeholder: "بحث عن الاسم",
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
        <EmployeesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

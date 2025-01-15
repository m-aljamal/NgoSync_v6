"use client"
"use memo"

import * as React from "react"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import type { getCourseStudents, StudentsList } from "@/app/_lib/queries/course"

import { getColumns } from "./employee-table-columns"
import { StudentsTableToolbarActions } from "./students-table-toolbar-actions"

interface StudentsTableProps {
  promise: ReturnType<typeof getCourseStudents>
}

export function StudentsTable({ promise }: StudentsTableProps) {
  const data = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<StudentsList>[] = []

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
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
        <StudentsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

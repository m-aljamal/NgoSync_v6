"use client"

import * as React from "react"
import { type Student } from "@/db/schemas/student"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getStudents } from "@/app/_lib/queries/student"

import { getColumns } from "./student-table-columns"
import { StudentTableToolbarActions } from "./students-table-toolbar-actions"

interface StudentsTableProps {
  promise: ReturnType<typeof getStudents>
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
        <StudentTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

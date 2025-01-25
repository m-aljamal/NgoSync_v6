"use client"

import * as React from "react"
import { type Course } from "@/db/schemas/course"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getCourses } from "@/app/_lib/queries/course"

import { getColumns } from "./course-table-columns"

interface CoursesTableProps {
  promise: ReturnType<typeof getCourses>
}

export function CoursesTable({ promise }: CoursesTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Course>[] = [
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
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  )
}

"use client"

import * as React from "react"
import { type Lesson } from "@/db/schemas/course"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import type { getLessons } from "@/app/_lib/queries/course"

import { getColumns } from "./lesson-table-columns"
import { LessonsTableToolbarActions } from "./lessons-table-toolbar-actions"

interface LessonsTableProps {
  promise: ReturnType<typeof getLessons>
}

export function LessonsTable({ promise }: LessonsTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Lesson>[] = []

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    state: {
      sorting: [{ id: "date", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <LessonsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

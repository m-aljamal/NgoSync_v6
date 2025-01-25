"use client"

import * as React from "react"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getLessonStudentsNote } from "@/app/_lib/queries/course"

import { getColumns } from "./lesson-columns"
import { LessonTableToolbarActions } from "./lesson-table-toolbar-actions"

interface TableProps {
  promise: ReturnType<typeof getLessonStudentsNote>
}

export function LessonTable({ promise }: TableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data,
    columns,
    pageCount,

    state: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <LessonTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
    </>
  )
}

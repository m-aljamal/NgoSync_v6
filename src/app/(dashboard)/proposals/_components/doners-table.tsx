"use client"
"use memo"

import { Doner, doners, projects } from "@/db/schema"
import { type DataTableFilterField } from "@/types"
import * as React from "react"

import { type getDoners } from "@/app/_lib/queries/doners"
import { projectStatusTranslation } from "@/app/_lib/translate"
import { getStatusIcon } from "@/app/_lib/utils"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"

import { getColumns } from "./doner-table-columns"
import { DonersTableToolbarActions } from "./doners-table-toolbar-actions"

interface DonersTableProps {
  promise: ReturnType<typeof getDoners>
}

export function DonersTable({ promise }: DonersTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Doner>[] = [
    {
      label: "Title",
      value: "name",
      placeholder: "بحث عن عنوان",
    },
    // {
    //   label: "الحالة",
    //   value: "status",
    //   options: doners.status.enumValues.map((status) => ({
    //     label: projectStatusTranslation[status],
    //     value: status,
    //     icon: getStatusIcon(status),
    //     withCount: true,
    //   })),
    // },
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
        <DonersTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

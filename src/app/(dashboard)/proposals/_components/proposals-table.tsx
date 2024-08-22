"use client"
"use memo"

import * as React from "react"
import { type ProposalWithRelations } from "@/db/schemas/proposal"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getProposals } from "@/app/_lib/queries/proposals"

import { getColumns } from "./proposal-table-columns"
import { ProposalsTableToolbarActions } from "./proposal-table-toolbar-actions"

interface ProposalsTableProps {
  promise: ReturnType<typeof getProposals>
}

export function ProposalsTable({ promise }: ProposalsTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<ProposalWithRelations>[] = [
    {
      label: "Title",
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
        <ProposalsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

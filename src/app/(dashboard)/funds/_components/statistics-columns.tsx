"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { formatCurrency } from "@/lib/utils"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

export type FundSummaryColumns = {
  currency: string
  currencyName: string
  totalIncome: number
  totalExpenses: number
  difference: number
}

export const fundSummaryColumns: ColumnDef<FundSummaryColumns>[] = [
  {
    accessorKey: "currencyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="العملة" />
    ),
  },

  {
    accessorKey: "totalIncome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="الداخل" />
    ),
    cell: ({ row }) => (
      <span>
        {formatCurrency(row.getValue("totalIncome"), row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "totalExpenses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="الخارج" />
    ),
    cell: ({ row }) => (
      <span>
        {formatCurrency(row.getValue("totalExpenses"), row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "difference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="الفرق" />
    ),
    cell: ({ row }) => (
      <span>
        {formatCurrency(row.getValue("difference"), row.original.currency)}
      </span>
    ),
  },
]

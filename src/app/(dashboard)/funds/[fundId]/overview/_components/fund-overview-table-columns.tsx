"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { formatCurrency } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

export type FundSummaryColumns = {
  id: string
  currency: string
  currencyName: string
  totalIncome: number
  totalExpenses: number
  difference: number
}

export function getColumns(): ColumnDef<FundSummaryColumns>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
}

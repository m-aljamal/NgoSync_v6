"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { formatCurrency } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

export type StatisticsColumn = {
  month: number
  amount: number
  amountInUSD: number
  currency: string
  expensesCategory: string | null
}

export function getColumns(): ColumnDef<StatisticsColumn>[] {
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
      accessorKey: "month",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الشهر" />
      ),
    },
    {
      accessorKey: "expensesCategory",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الفئة" />
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المبلغ" />
      ),
      cell: ({ row }) => (
        <span>
          {formatCurrency(row.original.amount, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "amountInUSD",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="يعادل دولار" />
      ),
      cell: ({ row }) => (
        <span>{formatCurrency(row.original.amountInUSD, "USD")}</span>
      ),
    },
  ]
}

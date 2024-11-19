"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { formatCurrency } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

export type StatisticsColumn = {
  expensesCategory: string
  paidAmount: number
  expenseTotal: number
  remainingAmount: number
  proposalCurrency: string
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
      accessorKey: "expensesCategory",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الفئة" />
      ),
    },
    {
      accessorKey: "expenseTotal",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المبلغ" />
      ),
      cell: ({ row }) => (
        <span>
          {formatCurrency(
            row.original.expenseTotal,
            row.original.proposalCurrency
          )}
        </span>
      ),
    },
    {
      accessorKey: "paidAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المدفوع" />
      ),
      cell: ({ row }) => (
        <span>
          {formatCurrency(
            row.original.paidAmount,
            row.original.proposalCurrency
          )}
        </span>
      ),
    },

    {
      accessorKey: "remainingAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المتبقي" />
      ),
      cell: ({ row }) => (
        <span>
          {formatCurrency(
            row.original.remainingAmount,
            row.original.proposalCurrency
          )}
        </span>
      ),
    },
  ]
}

"use client"

import * as React from "react"
import { type ProjectTransactionWithRelations } from "@/db/schemas"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { Column, ColumnDef, Row } from "@tanstack/react-table"
import { formatDate } from "date-fns"

import { formatCurrency } from "@/lib/utils"
import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { transactionStatusTranslation } from "@/app/_lib/translate"

import { DeleteExpensesDialog } from "./delete-expenses-dialog"
import { UpdateExpenseSheet } from "./update-expense-sheet"

export function getColumns(
  isOfficial?: boolean
): ColumnDef<ProjectTransactionWithRelations>[] {
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
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="التاريخ" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date, "dd-MM-yyyy"),
    },

    ...(isOfficial
      ? [
          {
            accessorKey: "officialAmount",
            header: ({
              column,
            }: {
              column: Column<ProjectTransactionWithRelations>
            }) => (
              <DataTableColumnHeader column={column} title="المبلغ الرسمي" />
            ),
            cell: ({ row }: { row: Row<ProjectTransactionWithRelations> }) => (
              <span>
                {row.original.officialCurrencyCode &&
                  formatCurrency(
                    row.getValue("officialAmount"),
                    row.original.officialCurrencyCode
                  )}
              </span>
            ),
          },
        ]
      : []),

    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المبلغ" />
      ),
      cell: ({ row }) => (
        <span>
          {formatCurrency(row.getValue("amount"), row.original.currencyCode)}
        </span>
      ),
    },

    {
      accessorKey: "currencyCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="العملة" />
      ),

      cell: ({ row }) => (
        <Badge variant={row.getValue("currencyCode")}>
          {row.getValue("currencyCode")}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },

    {
      accessorKey: "transactionStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الحالة" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.transactionStatus}>
          {transactionStatusTranslation[row.original.transactionStatus]}
        </Badge>
      ),
    },
    {
      accessorKey: "projectName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المشروع" />
      ),
    },
    {
      accessorKey: "expenseCategoryName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الفئة" />
      ),
    },

    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
          React.useState(false)
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false)
        const { onOpen } = useViewMoreDialog()

        return (
          <>
            <UpdateExpenseSheet
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              expense={row.original}
            />
            <DeleteExpensesDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              expenses={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={() => onOpen(row.original.id, "expenses")}
                >
                  التفاصيل
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
                  تعديل
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteTaskDialog(true)}
                >
                  حذف
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
      size: 40,
    },
  ]
}

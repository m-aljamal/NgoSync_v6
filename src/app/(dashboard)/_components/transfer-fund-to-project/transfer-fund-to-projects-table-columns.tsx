"use client"

import * as React from "react"
import { type TransferFundToProjectWithRelations } from "@/db/schemas/transfer"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { Column, ColumnDef, Row } from "@tanstack/react-table"

import { formatCurrency } from "@/lib/utils"
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

import { DeleteTransferFundToProjectsDialog } from "./delete-transfer-fund-to-projects-dialog"
import { UpdateTransferFundToProjectsSheet } from "./update-transfer-fund-to-projects-sheet"

export function getColumns(
  isOfficial?: boolean
): ColumnDef<TransferFundToProjectWithRelations>[] {
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
    },

    ...(isOfficial
      ? [
          {
            accessorKey: "officialAmount",
            header: ({
              column,
            }: {
              column: Column<TransferFundToProjectWithRelations>
            }) => (
              <DataTableColumnHeader column={column} title="المبلغ الرسمي" />
            ),
            cell: ({
              row,
            }: {
              row: Row<TransferFundToProjectWithRelations>
            }) => (
              <span>
                {row.original.officialCurrency &&
                  formatCurrency(
                    row.getValue("officialAmount"),
                    row.original.officialCurrency
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
      accessorKey: "senderName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المرسل" />
      ),
    },
    {
      accessorKey: "receiverName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المستلم" />
      ),
    },

    {
      accessorKey: "transactionStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الحالة" />
      ),

      cell: ({ row }) => (
        <Badge variant={row.getValue("transactionStatus")}>
          {transactionStatusTranslation[row.original.transactionStatus]}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الوصف" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[25rem] truncate">
          {row.getValue("description")}
        </div>
      ),
    },

    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
          React.useState(false)
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false)

        return (
          <>
            <UpdateTransferFundToProjectsSheet
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              transfer={row.original}
            />
            <DeleteTransferFundToProjectsDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              transfer={[row.original]}
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

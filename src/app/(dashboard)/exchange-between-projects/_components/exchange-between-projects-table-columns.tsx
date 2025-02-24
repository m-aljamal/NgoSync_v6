"use client"

import * as React from "react"
import { type ExchangeBetweenProjectsWithRelations } from "@/db/schemas"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { formatDate } from "date-fns"

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

import { DeleteExchangeBetweenProjectsDialog } from "./delete-exchange-between-projects-dialog"
import { UpdateExchangeBetweenProjectsSheet } from "./update-exchange-between-projects-sheet"

export function getColumns(): ColumnDef<ExchangeBetweenProjectsWithRelations>[] {
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

    {
      accessorKey: "rate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="سعر الصرف" />
      ),
      cell: ({ row }) => (
        <span>
          {formatCurrency(row.getValue("rate"), row.original.toCurrencyCode)}
        </span>
      ),
    },

    {
      accessorKey: "senderName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المرسل" />
      ),
    },

    {
      accessorKey: "fromAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="من المبلغ" />
      ),
      cell: ({ row }) => (
        <span>
          {formatCurrency(
            row.getValue("fromAmount"),
            row.original.fromCurrencyCode
          )}
        </span>
      ),
    },

    {
      accessorKey: "fromCurrencyCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="من العملة" />
      ),

      cell: ({ row }) => (
        <Badge variant={row.getValue("fromCurrencyCode")}>
          {row.getValue("fromCurrencyCode")}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },

    {
      accessorKey: "receiverName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المستلم" />
      ),
    },
    {
      accessorKey: "toAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الى المبلغ" />
      ),
      cell: ({ row }) => (
        <span>
          {formatCurrency(
            row.getValue("toAmount"),
            row.original.toCurrencyCode
          )}
        </span>
      ),
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
            <UpdateExchangeBetweenProjectsSheet
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              transfer={row.original}
            />
            <DeleteExchangeBetweenProjectsDialog
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

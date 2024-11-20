"use client"

import * as React from "react"
import Link from "next/link"
import { type LoanWithRelations } from "@/db/schemas/loan"
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
import { loanTypeTranslation } from "@/app/_lib/translate"

import { DeleteLoanDialog } from "./delete-loan-dialog"
import { UpdateLoanSheet } from "./update-loan-sheet"

export function getColumns(): ColumnDef<LoanWithRelations>[] {
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
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="المبلغ" />
      ),
      cell: ({ row }) => (
        <span>
          {formatCurrency(row.getValue("amount"), row.getValue("currencyCode"))}
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
      accessorKey: "employee",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الموظف" />
      ),
      cell: ({ row }) => (
        <Link
          className="hover:text-muted-foreground hover:underline"
          href={`/employees/${row.original.employeeId}/loans`}
        >
          {row.original.employeeName}
        </Link>
      ),
    },

    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="النوع" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.getValue("type")}>
          {loanTypeTranslation[row.original.type]}
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
      id: "actions",
      cell: function Cell({ row }) {
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
          React.useState(false)
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false)

        return (
          <>
            <UpdateLoanSheet
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              loan={row.original}
            />
            <DeleteLoanDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              loans={[row.original]}
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

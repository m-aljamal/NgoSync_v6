"use client"

import * as React from "react"
import Link from "next/link"
import { type EmployeeWithRelations } from "@/db/schemas"
import { doners } from "@/db/schemas/donation"
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
import { TeachersList } from "@/app/_lib/queries/course"
import {
  donerStatusTranslation,
  employeePosisionTranslation,
} from "@/app/_lib/translate"

import { DeleteEmployeesDialog } from "./delete-employee-dialog"

export function getColumns(): ColumnDef<TeachersList>[] {
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الاسم" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/employees/${row.original.id}/overview`}
          className="max-w-[31.25rem] truncate font-medium"
        >
          {row.getValue("name")}
        </Link>
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false)

        return (
          <>
            <DeleteEmployeesDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              employees={[row.original]}
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
            </DropdownMenu>
          </>
        )
      },
      size: 40,
    },
  ]
}

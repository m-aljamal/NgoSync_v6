"use client"

import * as React from "react"
import Link from "next/link"
import { type Student } from "@/db/schemas/student"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { formatDate } from "date-fns"

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

import { DeleteStudentsDialog } from "./delete-student-dialog"
import { UpdateStudentSheet } from "./update-student-sheet"

export function getColumns(): ColumnDef<Student>[] {
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

    // {
    //   accessorKey: "status",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="الحالة" />
    //   ),
    //   cell: ({ row }) => {
    //     const status = doners.status.enumValues.find(
    //       (status) => status === row.original.status
    //     )

    //     if (!status) return null

    //     return <Badge variant={status}>{donerStatusTranslation[status]}</Badge>
    //   },
    //   filterFn: (row, id, value) => {
    //     return Array.isArray(value) && value.includes(row.getValue(id))
    //   },
    // },

    // {
    //   accessorKey: "projectName",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="المشروع" />
    //   ),
    // },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="تاريخ الانشاء" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date, "dd-MM-yyyy"),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showUpdateSheet, setShowUpdateSheet] = React.useState(false)
        const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

        return (
          <>
            <UpdateStudentSheet
              open={showUpdateSheet}
              onOpenChange={setShowUpdateSheet}
              student={row.original}
            />
            <DeleteStudentsDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              students={[row.original]}
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
                <DropdownMenuItem onSelect={() => setShowUpdateSheet(true)}>
                  تعديل
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>
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

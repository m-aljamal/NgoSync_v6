"use client"

import { type StudentsCourseNotesWithRelation } from "@/db/schemas/course"
import { type ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { attendanceTranslation } from "@/app/_lib/translate"

export function getColumns(): ColumnDef<StudentsCourseNotesWithRelation>[] {
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
      accessorKey: "student",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="اسم الطالب" />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "attendance",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="التفقد" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.getValue("attendance")}>
          {attendanceTranslation[row.original.attendance ?? "present"]}
        </Badge>
      ),
    },
    {
      accessorKey: "pageNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="رقم الصفحة" />
      ),
    },
    {
      accessorKey: "mark",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="العلامة" />
      ),
    },
    {
      accessorKey: "note",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الملاحظة" />
      ),
    },
  ]
}

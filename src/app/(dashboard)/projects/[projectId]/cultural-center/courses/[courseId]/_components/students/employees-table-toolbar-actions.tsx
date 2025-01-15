"use client"

import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"
import { StudentsList, TeachersList } from "@/app/_lib/queries/course"

import { CreateEmployeeDialog } from "./create-student-dialog"
import { DeleteEmployeesDialog } from "./delete-student-dialog"

interface StudentsTableToolbarActionsProps {
  table: Table<StudentsList>
}

export function StudentsTableToolbarActions({
  table,
}: StudentsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteEmployeesDialog
          employees={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateEmployeeDialog />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "doners",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="ml-2 size-4" aria-hidden="true" />
        تصدير
      </Button>
    </div>
  )
}

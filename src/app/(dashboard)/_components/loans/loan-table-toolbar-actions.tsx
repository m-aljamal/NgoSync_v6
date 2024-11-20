"use client"

import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { exportTableToCSV } from "@/lib/export"

import { type LoanWithRelations } from "@/db/schemas/loan"
import { CreateLoanDialog } from "./create-loan-dialog"
import { DeleteLoanDialog } from "./delete-loan-dialog"

interface LoanTableToolbarActionsProps {
  table: Table<LoanWithRelations>
}

export function LoanTableToolbarActions({
  table,
}: LoanTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteLoanDialog
          loans={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateLoanDialog />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "proposals",
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
